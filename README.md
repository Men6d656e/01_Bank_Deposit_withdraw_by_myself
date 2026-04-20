# 🏦 Foundry Bank: Full-Cycle Deployment Journey

![Live on Sepolia](https://img.shields.io/badge/Live-Sepolia_Testnet-success?style=for-the-badge)
![Foundry](https://img.shields.io/badge/Built_with-Foundry-orange?style=for-the-badge)
![Solidity](https://img.shields.io/badge/Language-Solidity-blue?style=for-the-badge)

Welcome to the **Bank (Deposit & Withdraw)** project! This is a fullstack Solidity practice project built using the Foundry framework. It demonstrates a complete DApp lifecycle—from local smart contract development and testing to a fully deployed live frontend interacting with the Sepolia testnet.

---

## 📑 Table of Contents

- [Live Application](#-live-application)
- [Project Architecture](#-project-architecture)
- [Getting Started Locally](#-getting-started-locally)
- [Environment Variables](#-environment-variables)
- [Automation with Make](#-automation-with-make)
- [Local Deployment (Anvil & Ganache)](#-local-deployment-anvil--ganache)
- [Testnet Interaction Guide](#-testnet-interaction-guide)

---

## 🌐 Live Application

This project features a live frontend hosted on GitHub Pages that interacts directly with the smart contract deployed on the Sepolia Testnet.

🔗 **[Live Demo: Foundry Bank DApp](https://men6d656e.github.io/01_Bank_Deposit_withdraw_by_myself/)**

**How to interact:**
1. Visit the link above.
2. Click **Connect Wallet**. 
3. Ensure your MetaMask or Web3 Wallet is set to the **Sepolia Testnet**.
4. Deposit and withdraw test ETH easily through the intuitive UI!

*(If you need testnet funds to interact, refer to the [Testnet Interaction Guide](#-testnet-interaction-guide) below).*

---

## 🏗️ Project Architecture

The repository is logically structured to follow Foundry best practices:

- **`src/`**: Contains the core smart contract `Bank.sol` detailing the deposit and withdraw logic.
- **`test/`**: Contains the testing suite. We rigorously test our contract state to ensure bulletproof reliability before deployment.
- **`script/`**: Contains deployment scripts and the helper configuration file to streamline multi-chain deployments dynamically.

---

## 🚀 Getting Started Locally

To clone and run this project locally on your machine, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Men6d656e/01_Bank_Deposit_withdraw_by_myself.git
   cd 01_Bank_Deposit_withdraw_by_myself
   ```

2. **Install Foundry:**
   If you haven't already, install [Foundry](https://book.getfoundry.sh/getting-started/installation).

3. **Install Dependencies:**
   ```bash
   forge install
   ```

---

## 🔐 Environment Variables

This project requires environment variables to deploy and interact securely. We use a `.env` file to manage these secrets so they are never exposed in the code.

1. Locate the **`.env.example`** file in the root directory. This file shows exactly what variables you need.
2. Create a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
3. Fill out the `.env` file with your RPC URLs and Private Keys. 
*(Note: Ensure you never commit your actual `.env` file to version control!)*

---

## 🛠️ Beginner's Guide: Deployment via Makefile

We use a **Makefile** so you don't have to memorize long `forge` commands. Below is the beginner-friendly step-by-step guide for deploying this smart contract to different networks using simple commands.

### 1️⃣ Compile & Test
Before deploying anywhere, make sure your code compiles and passes all tests:
- **Clean previous builds:** Run `make clean`
- **Run tests:** Run `make test`

### 2️⃣ Deploy to Anvil (Local CLI Node)
Anvil is Foundry's built-in local blockchain. It's incredibly fast and perfect for quick testing.
1. Open a new terminal and start Anvil:
   ```bash
   anvil
   ```
2. In your main project terminal, run:
   ```bash
   make deploy-anvil
   ```
*(This command uses the default Anvil keys and RPC url defined in your `.env`, so no interactive prompts are needed.)*

### 3️⃣ Deploy to Ganache (Local GUI Node)
Ganache provides a visual interface for blockchain state debugging.
> ⚠️ **CRITICAL NOTE FOR GANACHE:** Ganache uses an older EVM specification. Before deploying to Ganache, you **must** open the `foundry.toml` file and **uncomment** the following line:
> ```toml
> evm_version = "paris"
> ```
> *Without doing this, your deployment to Ganache will fail!*

1. Open the Ganache application and start a Workspace.
2. Ensure your `GANACHE_RPC_URL` is correctly set in your `.env` (usually `http://127.0.0.1:7545`).
3. Run the deployment command:
   ```bash
   make deploy-ganache
   ```
4. **Interactive Prompt:** The terminal will securely ask you to paste a private key. Copy one of the private keys from your Ganache GUI and paste it into the terminal (it will be hidden as you type).

### 4️⃣ Deploy to Sepolia (Live Testnet)
Deploying to Sepolia makes your contract live and accessible to the world.
1. Make sure your `.env` has the `SEPOLIA_RPC_URL` (e.g., from Alchemy or Infura) and your `EATHER_SCAN_API_KEY` (to verify the contract code on Etherscan).
2. Run the deployment command:
   ```bash
   make deploy-sepolia
   ```
3. **Interactive Prompt:** The terminal will securely ask you to paste your real testnet wallet's private key (e.g., from MetaMask). Paste it in securely.
4. Your contract will be deployed to Sepolia and automatically verified on Etherscan!

---

## 🚦 Testnet Interaction Guide

When interacting with the live DApp or running your own Sepolia deployment:
1. Ensure your browser wallet (like MetaMask) is on the **Sepolia Network**.
2. **Need Faucets?** You cannot use real ETH on testnets. To get test ETH, we recommend requesting some from the [Google Ethereum Faucets](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) or other trusted Sepolia faucet providers.
3. Once your wallet is funded, you can seamlessly test the Deposit and Withdraw functions on the smart contract directly from the live application.
