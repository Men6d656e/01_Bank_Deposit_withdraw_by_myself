// Constants
const CONTRACT_ADDRESS = "0x373f77cFcd8167dA0A143EC1eb7B4DB204e04444";

// Hardcoded ABI Placeholder
// Replace this array with the actual ABI array from out/Bank.sol/Bank.json
const contractAbi = [
  {
    type: "function",
    name: "accountsBalance",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "checkBalance",
    inputs: [
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "deposit",
    inputs: [
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "DepositSuccessfully",
    inputs: [
      {
        name: "account",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "BANK__AccountNotFound",
    inputs: [],
  },
  {
    type: "error",
    name: "BANK__AmountCannotBeZero",
    inputs: [],
  },
  {
    type: "error",
    name: "BANK__DepositMisMatch",
    inputs: [],
  },
  {
    type: "error",
    name: "BANK__InsuficentFunds",
    inputs: [],
  },
  {
    type: "error",
    name: "BANK__WithdrawFailed",
    inputs: [],
  },
];

// Global State
let provider;
let signer;
let contract;
let userAddressStr = "";

// DOM Elements
const connectWalletBtn = document.getElementById("connectWalletBtn");
const walletInfo = document.getElementById("walletInfo");
const userAddressEl = document.getElementById("userAddress");
const userBalanceEl = document.getElementById("userBalance");
const bankDepositsEl = document.getElementById("bankDeposits");
const depositBtn = document.getElementById("depositBtn");
const withdrawBtn = document.getElementById("withdrawBtn");
const depositAmountInput = document.getElementById("depositAmount");
const withdrawAmountInput = document.getElementById("withdrawAmount");
const toastContainer = document.getElementById("toastContainer");

// Initialization
async function init() {
  if (window.ethereum) {
    // Handle account changes
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", () => window.location.reload());

    // Setup ethers v6 provider
    provider = new ethers.BrowserProvider(window.ethereum);

    // Check if already connected
    const accounts = await provider.listAccounts();
    if (accounts.length > 0) {
      handleAccountsChanged(accounts);
    }
  } else {
    console.warn("Please install MetaMask to use this DApp.");
    connectWalletBtn.innerText = "MetaMask Not Found";
    connectWalletBtn.disabled = true;
  }
}

// Connect Wallet
async function connectWallet() {
  if (!window.ethereum) {
    showToast("MetaMask is not installed!", "error");
    return;
  }

  try {
    connectWalletBtn.innerText = "Connecting...";
    const accounts = await provider.send("eth_requestAccounts", []);
    handleAccountsChanged(accounts);
    showToast("Wallet Connected!", "success");
  } catch (error) {
    console.error(error);
    showToast("User Denied Connection", "error");
    connectWalletBtn.innerText = "Connect Wallet";
  }
}

// Handle Account Connection
async function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    // Disconnected
    walletInfo.classList.add("hidden");
    connectWalletBtn.classList.remove("hidden");
    userAddressStr = "";
    return;
  }

  // Set Signer & Contract
  signer = await provider.getSigner();
  userAddressStr = accounts[0].address || accounts[0]; // Ethers v6 might return objects or strings

  if (typeof userAddressStr !== "string") {
    userAddressStr = await signer.getAddress();
  }

  contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);

  // Update UI
  connectWalletBtn.classList.add("hidden");
  walletInfo.classList.remove("hidden");

  // Truncate address for display
  userAddressEl.innerText = `${userAddressStr.substring(0, 6)}...${userAddressStr.substring(userAddressStr.length - 4)}`;

  await updateBalances();
}

// Update User & Bank Balances
async function updateBalances() {
  if (!signer || !contract) return;

  try {
    // Get ETH Balance
    const balanceWei = await provider.getBalance(userAddressStr);
    const balanceEth = ethers.formatEther(balanceWei);
    userBalanceEl.innerText = parseFloat(balanceEth).toFixed(4);

    // Get Bank Deposits
    try {
      const depositsWei = await contract.checkBalance(userAddressStr);
      const depositsEth = ethers.formatEther(depositsWei);
      bankDepositsEl.innerText = parseFloat(depositsEth).toFixed(4);
    } catch (e) {
      console.warn("checkBalance() failed. Ensure actual ABI is loaded.", e);
      bankDepositsEl.innerText = "0.0000";
    }
  } catch (error) {
    console.error("Error updating balances:", error);
  }
}

// Deposit Function
async function depositFunds() {
  const val = depositAmountInput.value;
  if (!val || parseFloat(val) <= 0) {
    showToast("Please enter a valid amount to deposit.", "error");
    return;
  }

  if (!contract) {
    showToast("Please connect your wallet first.", "error");
    return;
  }

  try {
    showToast("Processing Transaction...", "info");
    const tx = await contract.deposit(ethers.parseEther(val), {
      value: ethers.parseEther(val),
    });

    depositBtn.disabled = true;
    depositBtn.innerText = "Depositing...";

    await tx.wait();

    showToast("Transaction Confirmed!", "success");
    depositAmountInput.value = "";
    await updateBalances();
  } catch (error) {
    console.error(error);
    
    // Attempt to extract custom error name or reason
    const customError = error.revert?.name || error.info?.error?.name || error.reason;
    
    if (
      error.code === "ACTION_REJECTED" ||
      error.message.includes("user rejected")
    ) {
      showToast("User Denied Transaction.", "error");
    } else if (customError) {
      showToast(`Failed: ${customError}`, "error");
    } else {
      showToast("Transaction Failed.", "error");
    }
  } finally {
    depositBtn.disabled = false;
    depositBtn.innerText = "Deposit Funds";
  }
}

// Withdraw Function
async function withdrawFunds() {
  const val = withdrawAmountInput.value;
  if (!val || parseFloat(val) <= 0) {
    showToast("Please enter a valid amount to withdraw.", "error");
    return;
  }

  if (!contract) {
    showToast("Please connect your wallet first.", "error");
    return;
  }

  try {
    showToast("Processing Transaction...", "info");
    const tx = await contract.withdraw(ethers.parseEther(val));

    withdrawBtn.disabled = true;
    withdrawBtn.innerText = "Withdrawing...";

    await tx.wait();

    showToast("Transaction Confirmed!", "success");
    withdrawAmountInput.value = "";
    await updateBalances();
  } catch (error) {
    console.error(error);
    
    // Attempt to extract custom error name or reason
    const customError = error.revert?.name || error.info?.error?.name || error.reason;

    if (
      error.code === "ACTION_REJECTED" ||
      error.message.includes("user rejected")
    ) {
      showToast("User Denied Transaction.", "error");
    } else if (customError) {
      showToast(`Failed: ${customError}`, "error");
    } else {
      showToast("Transaction Failed.", "error");
    }
  } finally {
    withdrawBtn.disabled = false;
    withdrawBtn.innerText = "Withdraw Funds";
  }
}

// UI Toast Notification System
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;

  toastContainer.appendChild(toast);

  // Remove toast after 4 seconds
  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease-in forwards";
    setTimeout(() => {
      if (toastContainer.contains(toast)) {
        toastContainer.removeChild(toast);
      }
    }, 300);
  }, 4000);
}

// Event Listeners
connectWalletBtn.addEventListener("click", connectWallet);
depositBtn.addEventListener("click", depositFunds);
withdrawBtn.addEventListener("click", withdrawFunds);

// Run init on load
window.addEventListener("DOMContentLoaded", init);
