// Here we will take lots of arguments and all of these we had already defined in our smart contract and co-defined in our App.js file also...
// Using all the arguments we will display different Plots/Land based on the building we added in the smart contract...
const Plot = ({
  position,
  size,
  landId,
  landInfo,
  setLandName,
  setLandOwner,
  setHasOwner,
  setLandId,
}) => {
  const clickHandler = () => {
    setLandName(landInfo.name);
    setLandId(landId);

    if (landInfo.owner === "0x0000000000000000000000000000000000000000") {
      setLandOwner("No Owner");
      setHasOwner(false);
    } else {
      setLandOwner(landInfo.owner);
      setHasOwner(true);
    }
  };

  return (
    // here whenever we click any Plot/Land `clickHandler` function gets called and we get to know which land we want to buy...
    // And before we buy the plot of land it's going to be a plot so we're going to just have a flat 2d object/plot...
    // but if we buy that or any flat 2d object/plot it will turn into a 3d object/plot which we'll going to create in `Building.js` component
    <mesh position={position} onClick={clickHandler}>
      <planeBufferGeometry attach="geometry" args={size} />
      <meshStandardMaterial color={"#11E169"} metalness={0.5} roughness={0} />
    </mesh>
  );
};

export default Plot;
