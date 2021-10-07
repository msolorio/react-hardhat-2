import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import './App.css';

const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';

function App() {
  const [inputVal, setInputVal] = useState('');

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchGreeting() {
    if (!window.ethereum) return;

    // What is the provider? What does this do?
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Why do we pass the provider to the Contract function
    const contract = new ethers.Contract(contractAddress, Greeter.abi, provider);

    try {
      const greeting = await contract.greet();
      console.log('greeting:', greeting);

    } catch(err) {
      console.log('Err fetching greeting ==>', err);
    }
  }

  async function updateGreeting() {
    if (!inputVal) return;
    if (!window.ethereum) return;

    await requestAccount();

    // What is the provider? What does this do?
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // What does this do?
    const signer = provider.getSigner();

    // What do we pass the signer to the Contract function
    const contract = new ethers.Contract(contractAddress, Greeter.abi, signer);

    const transaction = await contract.setGreeting(inputVal);
    // why do we have to wait if we are already awaiting
    await transaction.wait();

    fetchGreeting();
  }

  return (
    <div className="App">
      <h1>Greeter App</h1>

      <input 
        type="button" 
        value="Fetch Greeting"
        onClick={fetchGreeting} 
      />
      <input 
        type="button" 
        value="Update Greeting" 
        onClick={updateGreeting}
      />

      <br />
      <br />

      <input 
        type="text" 
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
      />
    </div>
  );
}

export default App;
