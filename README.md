# 🗳️ Voting System for Municipalities with Blockchain
A decentralized voting system using the MEARN stack (MongoDB, Express.js, React, Node.js) and Solidity smart contracts on the Arbitrum Sepolia testnet.

# 📌 Technology Stack
Frontend: ReactJS

Backend: Node.js, Express.js

Database: MongoDB Atlas

Blockchain: Solidity, Truffle

Network: Arbitrum Sepolia (via Infura)

Wallet: MetaMask

# 🚀 Setup & Run the Project

# 1️⃣ Clone the Repository
1- git clone https://github.com/osamaibhaiss/Voting-System-For-Municipalities-With-Blockchain.git

2- cd Voting-System-For-Municipalities-With-Blockchain

# 🖥 2️⃣ Backend Setup
# Install Dependencies
1- cd voting_backend

2- npm install

# Configure Environment Variables
1 Create a .env file inside voting_backend/ and add:
 PORT=5000
 
 DB_URI=your_mongodb_cluster_uri
 
 JWT_SECRET=your_jwt_secret
 
 CLOUDINARY_CLOUD_NAME=your_cloudinary_name
 
 CLOUDINARY_API_KEY=your_cloudinary_api_key
 
 CLOUDINARY_API_SECRET=your_cloudinary_api_secret
 
 ADMIN_WALLET_PRIVATE_KEY=your_admin_wallet_private_key
 
 INFURA_API_URL=https://arbitrum-sepolia.infura.io/v3/your_infura_project_id
 
 CONTRACT_ADDRESS=your_deployed_contract_address

# Run Backend Server
npm start

# ⛓ 3️⃣ Deploy Smart Contract to Arbitrum Sepolia
# Install Dependencies
cd voting_backend/contract
npm install

# Compile & Deploy Smart Contract
# 1. Ensure truffle is installed:
npm install -g truffle

# 2. Compile the contract:
truffle compile

# 3. Deploy to Arbitrum Sepolia: Update truffle-config.js:
js: 
networks: {

arbitrum_sepolia: {

    provider: () => new HDWalletProvider(
    
      process.env.ADMIN_WALLET_PRIVATE_KEY, 
      
      "https://arbitrum-sepolia.infura.io/v3/your_infura_project_id"
    
    ),
    
    network_id: 421614,
    
    gas: 8000000,
    
    confirmations: 2,
    
    timeoutBlocks: 200,
    
    skipDryRun: true
  
  }
  
}
# 5. Update .env with the new CONTRACT_ADDRESS.

# 🎨 4️⃣ Frontend Setup
Install Dependencies

cd frontend

npm install

# Run React App
npm start

# 🔄 5️⃣ Running the Full System
# Start MongoDB (if running locally):
mongod
# Run the backend:
cd voting_backend
npm start
# Run the frontend:
cd frontend
npm start


# 🌍 Deployment
To deploy:

Backend: Render, Vercel, or AWS EC2

Frontend: Vercel, Netlify, or AWS S3

Smart Contract: Arbitrum Sepolia via Infura


👨‍💻 Contributors
Osama Bhais
📌 GitHub
