import React from "react";
import { useState } from 'react';
import { ethers } from "ethers";
import {
  Box,
  Grid,
  Container,
  Typography,
  TextField,
  Button,
  Input
} from "@material-ui/core";
import { create as ipfsHttpClient } from 'ipfs-http-client';

// Create IPFS client
const { create } = require("ipfs-http-client");
async function createIPFSClient() {
  const auth =
    "Basic " +
    btoa(
      process.env.INFURA_PROJECT_ID_IPFS +
      
        process.env.INFURA_PROJECT_SECRET_KEY_IPFS
    ).toString("base64");
  console.log(`auth is `, auth);
  try {
    const ipfs = await create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: auth, // Infura auth credentials
      },
    });
    console.log(`ipfs is ${ipfs}`);
    return ipfs;
  } catch (error) {
    console.log(`error while IPFS client: ${error}`);
  }
}

const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState('');
  const [price, setPrice] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Upload file to IPFS
  const uploadToIPFS = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (typeof file !== 'undefined') {
      try {
        let ipfs = await createIPFSClient();
        console.log(ipfs);
        const result = await ipfs.add(file);
        const ipfsHash = result.path;
        console.log(`result hash is `, ipfsHash);
        console.log(`https://ipfs.io/ipfs/${ipfsHash}`);
        setImage(`https://ipfs.io/ipfs/${ipfsHash}`);
      } catch (error) {
        console.log("IPFS image upload error: ", error);
      }
    }
  };

  // Create NFT
  const createNFT = async () => {
    if (!image || !price || !name || !description) {
      console.log("Missing fields: ", image, price, name, description);
      return;
    }
    console.log("createNFT is called");
    try {
      const ipfs = await createIPFSClient();
      const result = await ipfs.add(JSON.stringify({ image, price, name, description }));
      console.log("Result of createNFT is ", result);
      mintThenList(result);
    } catch (error) {
      console.log("IPFS URI upload error: ", error);
    }
  };

  // Mint NFT and list it on the marketplace
  const mintThenList = async (result) => {
    const uri = `https://ipfs.io/ipfs/${result.path}`;
    console.log("mintThenList is called. URI IPFS: ", uri);
    // Mint NFT
    await (await nft.mint(uri)).wait();
    // Get tokenId of new NFT
    const id = await nft._tokenIds();
    // Approve marketplace to spend NFT
    await (await nft.setApprovalForAll(marketplace.address, true)).wait();
    // Add NFT to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString());
    console.log("Listing price is ", listingPrice);
    await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
  };

  return (
    <>
      <Container
        maxWidth="xs"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "90vh",
        }}
      >
        <Typography>Make A NFT</Typography>

        <Box style={{ marginTop: "15px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                variant="outlined"
                fullWidth
                label="Title"
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                variant="outlined"
                fullWidth
                multiline
                minRows={3} // set number of rows to 3
                label="Description"
                onChange={(e) => setDescription(e.target.value)}
                // value={description}
              />
            </Grid>

       
<Grid item xs={12}>
  <TextField
    required
    variant="outlined"
    fullWidth
    label="Price Of NFT (In Eth)"
    onChange={(e) => setPrice(e.target.value)}
  />
</Grid>

<Grid item xs={12}>
  <div>
    <Typography variant="h6">Upload File</Typography>
    <input type="file" onChange={uploadToIPFS} />
    <Button
      variant="contained"
      color="default"
      onClick={createNFT}
      style={{ marginTop: "2.5rem" }}
    >
      Create NFT
    </Button>
  </div>
</Grid>

</Grid>
</Box>
</Container>
</>
);
}

export default Create;