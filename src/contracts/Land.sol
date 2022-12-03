// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Land is ERC721 {
    uint256 public cost = 1 ether;
    uint256 public maxSupply = 5; // maximum number of plots that can be sold...
    uint256 public totalSupply = 0; // or current supply; initializing this to zero...

    struct Building {
        string name;
        address owner;
        int256 posX;
        int256 posY;
        int256 posZ;
        uint256 sizeX;
        uint256 sizeY;
        uint256 sizeZ;
    }

    Building[] public buildings; // storing all the Buildings inside an array naming `buildings`(i.e of type struct `Building`)

    // `constructor` is just a function that gets called whenever we deploy this smart contract to the blockchain.
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _cost
    ) ERC721(_name, _symbol) {
        // name, symbol and cost for NFT(i.e plot of land)
        cost = _cost;

        // below we are adding `BUilding`s to our `buildings` array
        buildings.push(
            Building("City Hall", address(0x0), 0, 0, 0, 10, 10, 10)
        );
        buildings.push(Building("Stadium", address(0x0), 0, 10, 0, 10, 5, 3));
        buildings.push(
            Building("University", address(0x0), 0, -10, 0, 10, 5, 3)
        );
        buildings.push(
            Building("Shopping Plaza 1", address(0x0), 10, 0, 0, 5, 25, 5)
        );
        buildings.push(
            Building("Shopping Plaza 2", address(0x0), -10, 0, 0, 5, 25, 5)
        );
        // As there are no owners of building in the starting, hence we have written `address(0x0)`
    }

    // below function is used to mint and buy new land...
    function mint(uint256 _id) public payable {
        uint256 supply = totalSupply;
        require(supply <= maxSupply);
        // for checking that the `Building` is not already bought by some other owner(i.e address) by just accessing our `buildings` array.
        // As ID(i.e tokenID) of each `Building` starts from `1` but indexes that we have from our array starts from `0`. So we have to minus `1`.
        // Also, we need address of the `Building's` owner as shown below...
        require(buildings[_id - 1].owner == address(0x0));
        require(msg.value >= cost); // checking the amount of `ether` send to payable `mint()` >= `Cost of Building`(i.e 1 ETH)

        // NOTE: tokenID always starts from 1, but our array starts from 0

        buildings[_id - 1].owner = msg.sender; // for accessing the address(i.e new owner) which calls this payable `mint()`
        totalSupply = totalSupply + 1; // increasing the totalSupply(initially `0`) by `1`

        _safeMint(msg.sender, _id); // this function taken from openzeppelin's ERC721 contract.
    }

    // below function for transferring ownership of the plot of land.
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        // As this function is already implemented in the ERC721, but we want to improve on it so we use `override` keyword...
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        ); // here we used `_msgSender()` to get `msg.sender` as it was given in the Openzeppelin Contracts.

        // Update Building ownership
        buildings[tokenId - 1].owner = to;

        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public override {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        ); // here we used `_msgSender()` to get `msg.sender` as it was given in the Openzeppelin Contracts.

        // Updating old owner's address of the `Building` with the index number in the `buildings` array to the new owner's address.
        buildings[tokenId - 1].owner = to;

        _safeTransfer(from, to, tokenId, _data);
    }

    // Public View(i.e just for reading data from the blockchain and not for any transaction/change/writing on the blockchain) Functions

    // below view function will return all the `Building` we have in the `buildings` array
    function getBuildings() public view returns (Building[] memory) {
        return buildings;
    }

    // below view function will return a specifically only one `Building` from the `buildings` array
    function getBuilding(uint256 _id) public view returns (Building memory) {
        return buildings[_id - 1];
    }
}
