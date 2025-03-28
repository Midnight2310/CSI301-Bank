let web3;
let contract;
let account;

//etherscan holesky 0xA22121Cfa84b17dd108461de0F8C4BD8229b3Ddc
const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [],
    name: "checkBalance",
    outputs: [{ internalType: "uint256", name: "balance", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

function logOutput(text) {
  document.getElementById("output").textContent = text;
}

document.getElementById("connectBtn").addEventListener("click", async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];

    const contractAddress = document
      .getElementById("contractAddress")
      .value.trim();
    contract = new web3.eth.Contract(abi, contractAddress);

    document.getElementById("status").textContent = `Connected: ${account}`;
  } else {
    alert("Please install MetaMask");
  }
});

// Deposit function
document.getElementById("depositBtn").addEventListener("click", async () => {
  const amount = document.getElementById("amount").value;
  try {
    await contract.methods
      .deposit()
      .send({ from: account, value: web3.utils.toWei(amount, "ether") });
    logOutput(`Deposited ${amount} ETH`);
  } catch (err) {
    logOutput(`Error: ${err.message}`);
  }
});

document.getElementById("withdrawBtn").addEventListener("click", async () => {
  const amount = document.getElementById("amount").value;
  try {
    await contract.methods
      .withdraw(web3.utils.toWei(amount, "ether"))
      .send({ from: account });
    logOutput(`Withdraw ${amount} ETH`);
  } catch (err) {
    logOutput(`Error: ${err.message}`);
  }
});

document.getElementById("balanceBtn").addEventListener("click", async () => {
    try {
      if (!web3 || !contract || !account) {
        throw new Error("Not connected. Please connect first.");
      }
      console.log("Contract address:", contract.options.address);
      console.log("Caller account:", account);
      const balance = await contract.methods
        .checkBalance()
        .call({ from: account });
      console.log("Raw balance:", balance);
      const balanceInEther = web3.utils.fromWei(balance, "ether");
      logOutput(`Your balance: ${balanceInEther} ETH`);
    } catch (err) {
      console.error("Full error:", err);
      logOutput(`Error: ${err.message}`);
    }
  });
