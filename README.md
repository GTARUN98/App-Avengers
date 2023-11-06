
# NFT Marketplace Project



[NFT Marketplace](https://drive.google.com/file/d/1RxelPxWfGAXxIYs-YULkhgc5KeC28Eid/view?usp=drive_link)


## Getting Started

To run the NFT Marketplace project, you can follow these steps:

1. Clone the repository to your local machine.

2. Navigate to the project directory.

3. Install the necessary dependencies for both the backend and frontend. You can use npm or yarn to install dependencies:

   ```bash
   # Install backend dependencies
   cd src/backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

4. Configure your environment variables by creating a .env file in the project root directory. You should include your Infura project ID and secret key for IPFS and other relevant configurations:

   ```env
   INFURA_PROJECT_ID_IPFS=your_infura_project_id
   INFURA_PROJECT_SECRET_KEY_IPFS=your_infura_secret_key
   ```

5. Compile and deploy the smart contracts to the desired Ethereum network using Hardhat. Ensure that you have specified the network settings in hardhat.config.js:

   ```bash
   # Deploy to the specified Ethereum network (e.g., sepolia)
   npx hardhat deploy --network sepolia
   ```

6. Start the frontend application:

   ```bash
   # Navigate to the frontend directory
   cd ../frontend

   # Start the React development server
   npm start
   ```

The NFT Marketplace web application should be accessible at http://localhost:3000. You can interact with the marketplace, create NFTs, list items, and purchase NFTs.

## Contracts

### NFT.sol

- This contract defines the NFT (Non-Fungible Token) and its minting capabilities.
- It utilizes the OpenZeppelin ERC721URIStorage library for managing NFTs and their metadata.
- The constructor initializes the NFT contract with a name ("GARLAPATI") and a symbol ("TILL").

### Marketplace.sol

- This contract represents the NFT Marketplace, allowing users to create and list NFTs for sale and purchase NFTs.
- The contract includes royalty fees and utilizes the ReentrancyGuard to prevent vulnerabilities.

These contracts provide the foundation for creating and managing NFTs and the marketplace for trading them. The specific functions mentioned earlier are part of these contracts, but you've requested to omit the details of those functions. If you have any specific questions or need more detailed information about any aspect of these contracts, please feel free to ask.
```

