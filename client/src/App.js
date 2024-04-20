// Import React, useEffect, useState
import React, { useEffect, useState } from 'react';
// Import ethers
import { ethers } from "ethers";

function App() {
  // State variables
  const [depositValue, setDepositValue] = useState(0);
  const [withdrawValue, setWithdrawValue] = useState(0);
  const [greet, setGreet] = useState('');
  const [greetingValue, setGreetingValue] = useState('');
  const [balance, setBalance] = useState();

  // Ethereum provider and contract
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  const ABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_greeting",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "balances",
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
      "inputs": [],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "greet",
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
      "inputs": [
        {
          "internalType": "string",
          "name": "_greeting",
          "type": "string"
        }
      ],
      "name": "setGreeting",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "withdrawValue",
          "type": "uint256"
        }
      ],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]; // Your contract ABI
  const contract = new ethers.Contract(contractAddress, ABI, signer);

  // UseEffect to load data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await provider.send("eth_requestAccounts", []);
        const balance = await provider.getBalance(contractAddress);
        setBalance(ethers.utils.formatEther(balance));
        const greeting = await contract.greet();
        setGreet(greeting);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [provider, contract, contractAddress]);

  // Event handlers
  const handleDepositChange = (e) => {
    setDepositValue(e.target.value);
  };

  const handleWithdrawChange = (e) => {
    setWithdrawValue(e.target.value);
  };

  const handleGreetingChange = (e) => {
    setGreetingValue(e.target.value);
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    const ethValue = ethers.utils.parseEther(depositValue);
    const depositTx = await contract.deposit({ value: ethValue });
    await depositTx.wait();
    setDepositValue('');
    const newBalance = await provider.getBalance(contractAddress);
    setBalance(ethers.utils.formatEther(newBalance));
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    const ethValue = ethers.utils.parseEther(withdrawValue);

    if (ethValue.lte(0)) {
        console.error("Withdrawal amount must be greater than 0");
        return;
    }

    try {
        const balanceBefore = await provider.getBalance(contractAddress);
        const withdrawTx = await contract.withdraw(ethValue, { gasLimit: 3000000 }); // Increase gas limit
        await withdrawTx.wait();
        const balanceAfter = await provider.getBalance(contractAddress);
        const newBalance = balanceBefore.sub(balanceAfter).toString();
        console.log("Withdrawal successful");
        setBalance(ethers.utils.formatEther(newBalance));
        setWithdrawValue('');
    } catch (error) {
        console.error("Withdrawal failed:", error);
    }
};


  const handleGreetingSubmit = async (e) => {
    e.preventDefault();
    await contract.setGreeting(greetingValue);
    setGreet(greetingValue);
    setGreetingValue('');
  };

  // Render the component
  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col">
          <h3>{greet}</h3>
          <p>Contract Balance: {balance} ETH</p>
        </div>
        <div className="col">
          <div className="mb-3">
            <h4>Deposit ETH</h4>
            <form onSubmit={handleDepositSubmit}>
              <div className="mb-3">
                <input type="number" className="form-control" placeholder="0" onChange={handleDepositChange} value={depositValue} />
              </div>
              <button type="submit" className="btn btn-success">Deposit</button>
            </form>
            <h4 className="mt-3">Withdraw ETH</h4>
            <form onSubmit={handleWithdrawSubmit}>
              <div className="mb-3">
                <input type="number" className="form-control" placeholder="0" onChange={handleWithdrawChange} value={withdrawValue} />
              </div>
              <button type="submit" className="btn btn-danger">Withdraw</button>
            </form>
            <h4 className="mt-3">Change Greeting</h4>
            <form onSubmit={handleGreetingSubmit}>
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="" onChange={handleGreetingChange} value={greetingValue} />
              </div>
              <button type="submit" className="btn btn-dark">Change</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
