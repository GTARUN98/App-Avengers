import React from "react";
import { useState } from 'react'
import { ethers } from "ethers"
import {
  Box,
  Grid,
  Container,
  Typography,
  TextField,
  Button,
  Input
} from "@material-ui/core";
import { create as ipfsHttpClient } from 'ipfs-http-client'

// import dotenv from 'dotenv';
// dotenv.config();

// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const { create } = require("ipfs-http-client");
async function ipfsClient() {
  const auth =
    "Basic " +
    btoa(
      // process.env.INFURA_PROJECT_ID_IPFS +
      "2Xl1Z35GwRtxJAqhon13g2HQtDQ" +
        ":" +
        "dda10586bf32aa88a897a548b0ab7eba"
        // process.env.INFURA_PROJECT_SECRET_KEY_IPFS
    ).toString("base64");
    // console.log(`projectid`,process.env.INFURA_PROJECT_ID_IPFS ,`secret key `,INFURA_PROJECT_SECRET_KEY_IPFS)
  console.log(`auth is ` ,auth);
  try {
    const ipfs = await create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: auth, // infura auth credentails
      },
    });
    console.log(`ipfs is ${ipfs}`)
    return ipfs;
  } catch (error) {
    console.log(`error while ipfs clent ${error}`);
  }
}


const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState('')
  const [price, setPrice] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const uploadToIPFS = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        let ipfs = await ipfsClient();
        console.log(ipfs)
        const result = await ipfs.add(file)
        const ipfsHash = result.path;
        console.log(`result hash is `,ipfsHash)
        console.log(`https://ipfs.io/ipfs/${ipfsHash}`)
        setImage(`https://ipfs.io/ipfs/${ipfsHash}`)

      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
    }
  }
  const createNFT = async () => {
    if (!image || !price || !name || !description) {
      console.log(`price `,price)
      console.log(`missing`,image,price,name,description);
    return
  }
    console.log(`createNFT is called`)
    try{
      const ipfs = await ipfsClient();
      const result = await ipfs.add(JSON.stringify({image, price, name, description}))
      console.log(`result of create NFT is `,result)
      mintThenList(result)
    } catch(error) {
      console.log("ipfs uri upload error: ", error)
    }
  }
  const mintThenList = async (result) => {
    const uri = `https://ipfs.io/ipfs/${result.path}`
    console.log(`mint then list s called uri ipfs is `,uri)
    // mint nft 
    await(await nft.mint(uri)).wait()
    // get tokenId of new nft 
    const id = await nft.tokenCount()
    // approve marketplace to spend nft
    await(await nft.setApprovalForAll(marketplace.address, true)).wait()
    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString())
    console.log(`listiong price is `,listingPrice)
    await(await marketplace.makeItem(nft.address, id, listingPrice)).wait()

  }
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
          label="Price Of NFT(In Eth)"
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
            style={{marginTop:"2.5rem"}}
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