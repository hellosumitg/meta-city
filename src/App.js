import Web3 from "web3";
import { Suspense, useState, useEffect } from "react"; // Suspense basically suspends a component that being rendered until a certain condition has been met.
import { Canvas } from "@react-three/fiber";
import { Sky, MapControls } from "@react-three/drei"; // MapControls is for ZoomIn and ZoomOut
import { Physics } from "@react-three/cannon"; // this is for buildings

// Import CSS
import "./App.css";

// Import Components
import Navbar from "./components/Navbar";
import Plane from "./components/Plane";
import Plot from "./components/Plot";
import Building from "./components/Building";

// Import ABI
import Land from "./abis/Land.json";

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);

  // Contract
  const [landContract, setLandContract] = useState(null);

  // Contract states
  const [cost, setCost] = useState(0);
  const [buildings, setBuildings] = useState(null);
  const [landId, setLandId] = useState(null);
  const [landName, setLandName] = useState(null);
  const [landOwner, setLandOwner] = useState(null);
  const [hasOwner, setHasOwner] = useState(false);

  const loadBlockchainData = async () => {
    // Metamask...
    // Checking whether the user has installed Metamask or not by using `window.ethereum` object, which we get when we install the metamask extension...
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);
      setWeb3(web3);

      // Now, getting all the accounts the user have using the `getAccounts()`
      const accounts = await web3.eth.getAccounts();

      // Now checking that the user have more than one account then using only the first or the 0th index account
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }

      const networkId = await web3.eth.net.getId();

      // Now we will make Contract instance...using the Contract we had deployed on our ganache blockchain
      const land = new web3.eth.Contract(
        Land.abi,
        Land.networks[networkId].address
      );
      setLandContract(land);

      // Getting cost from the smart contract
      const cost = await land.methods.cost().call();
      setCost(web3.utils.fromWei(cost.toString(), "ether")); // here converting the cost from `wei` to `ether`

      const buildings = await land.methods.getBuildings().call();
      setBuildings(buildings);

      // Event listener for account change, so as to reload the website if `account` changes...
      window.ethereum.on("accountsChanged", function (accounts) {
        setAccount(accounts[0]);
      });

      // Event listener for blockchain or chain change, so as to reload the website if `chain` changes...
      window.ethereum.on("chainChanged", (chainId) => {
        window.location.reload();
      });
    }
  };

  // MetaMask Login/Connect which we used in the `Navbar.js` component
  const web3Handler = async () => {
    if (web3) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, [account]); // here we trigger the `useEffect` hook(i.e call the function which it stores) whenever the account is changed.

  // below functions will be get triggered whenever anybody clicks on buy Property and this will handle all the buying of this virtual land.
  const buyHandler = async (_id) => {
    try {
      await landContract.methods
        .mint(_id)
        .send({ from: account, value: "1000000000000000000" });

      const buildings = await landContract.methods.getBuildings().call();
      setBuildings(buildings);

      setLandName(buildings[_id - 1].name);
      setLandOwner(buildings[_id - 1].owner);
      setHasOwner(true);
    } catch (error) {
      window.alert("Error occurred when buying");
    }
  };

  return (
    <div>
      <Navbar web3Handler={web3Handler} account={account} />
      {/* Now for putting all of our virtual land details in the below `Canvas` component from `three.js`... */}
      <Canvas camera={{ position: [0, 0, 30], up: [0, 0, 1], far: 10000 }}>
        {/* Wrapping all the `Sky`, `ambientLight`, `Physics` and `Plane` under a `Suspense` component from `React.js` and this gets rendered until a certain condition has been met, under this `Canvas` component */}
        <Suspense fallback={null}>
          <Sky
            distance={450000}
            sunPosition={[1, 10, 0]}
            inclination={0}
            azimuth={0.25}
          />
          {/* As we don't have light by default in `Three.js` 3D world so adding some light to this 3D world which we are forming so that we can see every object clearly */}
          <ambientLight intensity={0.5} />

          {/* Load in each cell */}
          <Physics>
            {/* whenever we want to output something in react we use {} for writing javascript code */}
            {buildings &&
              buildings.map((building, index) => {
                if (
                  building.owner ===
                  "0x0000000000000000000000000000000000000000" // i.e doesn't have any owner
                ) {
                  return (
                    <Plot
                      key={index}
                      position={[building.posX, building.posY, 0.1]}
                      size={[building.sizeX, building.sizeY]}
                      landId={index + 1}
                      landInfo={building}
                      setLandName={setLandName}
                      setLandOwner={setLandOwner}
                      setHasOwner={setHasOwner}
                      setLandId={setLandId}
                    />
                  );
                } else {
                  return (
                    // If Plot/Land already has the owner then
                    <Building
                      key={index}
                      position={[building.posX, building.posY, 0.1]}
                      size={[building.sizeX, building.sizeY, building.sizeZ]}
                      landId={index + 1}
                      landInfo={building}
                      setLandName={setLandName}
                      setLandOwner={setLandOwner}
                      setHasOwner={setHasOwner}
                      setLandId={setLandId}
                    />
                  );
                }
              })}
          </Physics>
          {/* As all of these Plot/Land/Buildings stands on a `Plane` that's why using a `Plane` component below */}
          <Plane />
        </Suspense>
        {/* for zooming In & Out we are going to use this below component from `three.js`*/}
        <MapControls />
      </Canvas>
      {/* Below code is used for showing a information `pop-up` about the plot/land clicked */}
      {landId && (
        <div className="info">
          <h1 className="flex">{landName}</h1>

          <div className="flex-left">
            <div className="info--id">
              <h2>ID</h2>
              <p>{landId}</p>
            </div>

            <div className="info--owner">
              <h2>Owner</h2>
              <p>{landOwner}</p>
            </div>

            {/* If any plot/land doesn't have a owner then we'll show the `cost` and `buying opportunity` to the buyer */}
            {!hasOwner && (
              <div className="info--owner">
                <h2>Cost</h2>
                <p>{`${cost} ETH`}</p>
              </div>
            )}
          </div>

          {!hasOwner && (
            <button
              onClick={() => buyHandler(landId)}
              className="button info--buy"
            >
              Buy Property
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
