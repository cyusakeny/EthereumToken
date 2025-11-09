let provider;
let signer;
let contract;

const contractAddress = "0x68637914e7a6e6b7D0C2Ca9D741923CED4317B53"; // Replace with your ERC20 contract address
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    const walletAddress = await signer.getAddress();

    document.getElementById("walletAddress").innerText = walletAddress;

    contract = new ethers.Contract(contractAddress, contractABI, signer);


    updateBalance(walletAddress);
  } else {
    alert("MetaMask not found! Please install it.");
  }
}

async function updateBalance(address) {
  const balance = await contract.balanceOf(address);
  const readable = ethers.formatUnits(balance.toString(), 18);
  document.getElementById("tokenBalance").innerText = readable;
}

async function transferTokens() {
  const toAddress = document.getElementById("recipient").value;
  const amount = document.getElementById("amount").value;
  const amountInWei = ethers.parseUnits(amount, 18);

  try {
    const tx = await contract.transfer(toAddress, amountInWei);
    await tx.wait();
    alert("Transfer successful!");
    const walletAddress = await signer.getAddress();
    updateBalance(walletAddress);
  } catch (err) {
    alert("Transfer failed: " + err.message);
  }
}
