# Blockchain-Based Healthcare Document Security System

## Overview
This project is a **decentralized Electronic Health Record (EHR) system** designed to securely store and verify healthcare documents using **blockchain technology**. It prevents **fraud, identity theft, and unauthorized access** while ensuring data integrity and security.

## Features
- **Decentralized Storage:** Uses **IPFS** for encrypted off-chain document storage, reducing blockchain costs.
- **Smart Contracts:** Implements **Solidity-based smart contracts** to enforce data immutability and controlled access.
- **User Authentication:** Utilizes **MetaMask** for secure login and transaction signing.
- **Secure Access Control:** Only authorized users (patients, doctors) can access records.
- **Seamless Frontend:** Built with **React and Node.js** for intuitive document submission and retrieval.
- **Blockchain Development & Testing:** Uses **Ganache** for local blockchain deployment.

## Technologies Used
- **Blockchain:** Ethereum, Solidity, Ganache
- **Storage:** IPFS (InterPlanetary File System)
- **Frontend:** React, Node.js
- **Authentication:** MetaMask
- **Smart Contracts Deployment:** Truffle
- **Version Control:** Git & GitHub

## Smart Contract Details
- **Data Immutability:** Once a document hash is stored on the blockchain, it cannot be altered.
- **Access Control:** Uses role-based authentication for patients, doctors, and administrators.
- **Transaction Logging:** Every access request and document update is recorded on the blockchain.

## Setup & Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/ehr-blockchain.git
   ```
2. Install dependencies:
   ```sh
   cd ehr-blockchain
   npm install
## Future Enhancements
- **Integration with IPFS encryption layers** for enhanced document privacy.
- **Cross-chain compatibility** to support multiple blockchain networks.
- **Audit logging & analytics** for better tracking of access history.
- **Mobile-friendly UI** for better accessibility.
