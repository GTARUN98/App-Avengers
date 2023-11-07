import React from "react";
import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { Row, Col, Card } from 'react-bootstrap';

export default function MyPurchases({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);

  const loadPurchasedItems = async () => {// here sender is the account address
    // Fetch purchased items from the marketplace by querying the Bought events with the buyer set as the user
    const filter = marketplace.filters.Bought(null, null, null, null, null, account);
    const results = await marketplace.queryFilter(filter);// the filter used to display only purchased items

    // Fetch metadata of each NFT and add it to the purchasedItem object
    const purchases = await Promise.all(results.map(async i => {
      // Fetch arguments from each result
      i = i.args;

      // Get URI URL from the NFT contract
      const uri = await nft.tokenURI(i.tokenId);

      // Use the URI to fetch the NFT metadata stored on IPFS
      const response = await fetch(uri);
      const metadata = await response.json();

      // Get the total price of the item (item price + fee)
      const totalPrice = await marketplace.getTotalPrice(i.itemId);

      // Define the purchasedItem object
      let purchasedItem = {
        totalPrice,
        price: i.price,
        itemId: i.itemId,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image
      };

      return purchasedItem;
    }));

    setLoading(false);
    setPurchases(purchases);
  };

  useEffect(() => {
    loadPurchasedItems();
  }, []);

  if (loading) {
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    );
  }

  return (
    <div className="flex justify-center">
      {purchases.length > 0 ? (
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {purchases.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Title>Title : {item.name}</Card.Title>
                  <Card.Title>Description : {item.description}</Card.Title>
                  <Card.Title>IPFS : {item.image}</Card.Title>
                  <Card.Footer>{ethers.utils.formatEther(item.totalPrice)} ETH</Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No purchases</h2>
        </main>
      )}
    </div>
  );
}

//USELESS