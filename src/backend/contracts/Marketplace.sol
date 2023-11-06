// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract Marketplace is ReentrancyGuard {//To prevent vulnerabilities we use ReentrancyGuard 

    // Variables
      // the account that receives royalty fees
    uint public royaltyPercent  = 20; // the fee percentage on sales 
    uint public itemCount; 

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
        address payable  royaltyFeeAccount ;
    }

    // itemId -> Item mapping for NFT'S
    mapping(uint => Item) public items;
// Triggered when a seller offers an item for sale on the marketplace.
    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );
// Triggered when a buyer successfully purchases an item from the marketplace.
    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );


    // constructor(uint _royaltyPercent) {
    //     royaltyPercent = _royaltyPercent;
    // }

    // Make item to offer on the marketplace
    function makeItem(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant {
        require(_price > 0, "Price must be greater than zero");
        // increment itemCount
        itemCount ++;
        // transfer nft
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        // add new item to items mapping
        items[itemCount] = Item (
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false,
            payable(msg.sender)//assuming royalty is the same address can be different also
        );
        // emit Offered event
        // Emit the 'Offered' event to notify external observers that a new item is being offered for sale on the marketplace.
        emit Offered(
            itemCount,
            address(_nft),
            _tokenId,
            _price,
            msg.sender
        );
    }
    //this will excecute the purchase
    function purchaseItem(uint _itemId) external payable nonReentrant {
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");//does it exist
        require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");//does the value is > the total price of NFT
        require(!item.sold, "item already sold");
        // pay seller and royaltyFeeAccount
        item.seller.transfer(item.price);
        item.royaltyFeeAccount.transfer(_totalPrice - item.price);//royalty fee transfer
        // update item to sold
        item.sold = true;
        // transfer nft to buyer
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        // emit Bought event
        // Emit the 'Bought' event to notify external observers when a successful purchase occurs on the marketplace.
// Parameters:
        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
    }
    //total price including royalty is returned
    function getTotalPrice(uint _itemId) view public returns(uint){
        return((items[_itemId].price*(100 + royaltyPercent))/100);
    }
}