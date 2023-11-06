// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
//https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol (MINTING)
import "@openzeppelin/contracts/utils/Counters.sol";
//https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Counters.sol (tokenID)
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    // uint public tokenCount;
    using Counters for Counters.Counter;//this is the syntax in using the libraries in solidity;Counter struct is in the librray of Counters
    Counters.Counter public _tokenIds;
    constructor() ERC721("GARLAPATI", "TILL") {}//this is the name of the NFT and its symbol NFT-GARLAPATI SYMBOL-TILL
    function mint(string memory _tokenURI) external returns(uint) {
        

        _tokenIds.increment();//every NFT should get its unique id
        uint256 newItemId = _tokenIds.current();//this will return the value of ID inside the struct of Counter
        _safeMint(msg.sender,newItemId);//minting newItemId at recipient address this function can be found at (ERC721URIStorage.sol")
        _setTokenURI(newItemId, _tokenURI);//I am linking the ID with the image metadata is called tokenURI
        return newItemId;//returning the itemId of our NFT
    }
}