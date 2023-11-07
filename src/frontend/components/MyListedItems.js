import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card } from "react-bootstrap";

// Rendering the sold items iterating
function renderSoldItems(items) {
  return (
    <>
      <h2>Sold</h2>
      <Row xs={1} md={2} lg={4} className="g-4 py-3">
        {items.map((item, idx) => (
          <Col key={idx} className="overflow-hidden">
            <Card>
              <Card.Img variant="top" src={item.image} />
              <Card.Footer>
                For {ethers.utils.formatEther(item.totalPrice)} ETH - Received {ethers.utils.formatEther(item.price)} ETH
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default function MyListedItems({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true);
  const [listedItems, setListedItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);

  // Load the listed items
  const loadListedItems = async () => {
    // Load all items listed by the user
    const itemCount = await marketplace.itemCount();
    let listedItems = [];
    let soldItems = [];

    for (let i = 1; i <= itemCount; i++) {//itelating for all the listed items
      const item = await marketplace.items(i);

      if (item.seller.toLowerCase() === account) {
        // Get the URI URL from the NFT contract
        const uri = await nft.tokenURI(item.tokenId);

        // Use the URI to fetch the NFT metadata stored on IPFS
        const response = await fetch(uri);
        const metadata = await response.json();

        // Get the total price of the item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(item.itemId);

        // Define the listed item object
        let listItem = {
          totalPrice,
          price: item.price,
          itemId: item.itemId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
        };

        // Add the listed item to the array
        listedItems.push(listItem);

        // Add the listed item to the sold items array if it is sold
        if (item.sold) {
          soldItems.push(listItem);
        }
      }
    }

    setLoading(false);//now stop loading
    setListedItems(listedItems);//items are now set useState
    setSoldItems(soldItems);
  };

  useEffect(() => {
    loadListedItems();//every time you refresh it will load
  }, []);

  // Show loading message if the data is still loading
  if (loading) {
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    );
  }

  return (
    <div className="flex justify-center">
      {listedItems.length > 0 ? (
        <div className="px-5 py-3 container">
          <h2>Listed</h2>
          <Row xs={1} md={2} lg={4} className="g-4 py-3">
            {listedItems.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Footer>{ethers.utils.formatEther(item.totalPrice)} ETH</Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
          {soldItems.length > 0 && renderSoldItems(soldItems)}
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No listed assets</h2>
        </main>
      )}
    </div>
  );
}


//USELESS