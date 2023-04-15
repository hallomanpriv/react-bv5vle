import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Web3Modal from '@walletconnect/web3modal';
import { BscConnector } from '@binance-chain/bsc-connector';
import { getAvailableItems } from './marketplace';

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [networkId, setNetworkId] = useState(null);
  const [availableItems, setAvailableItems] = useState([]);

  useEffect(() => {
    const init = async () => {
      const providerOptions = {
        walletconnect: {
          package: Web3Modal.WalletConnectProvider,
          options: {
            infuraId: 'YOUR_INFURA_PROJECT_ID',
          },
        },
        bsc: {
          package: BscConnector,
          options: {
            supportedChainIds: [56, 97],
          },
        },
      };

      const web3Modal = new Web3Modal({
        network: 'mainnet',
        cacheProvider: true,
        providerOptions,
      });

      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);

      setWeb3(web3);
    };

    init();
  }, []);

  useEffect(() => {
    const getAccounts = async () => {
      if (web3) {
        const accounts = await web3.eth.getAccounts();
        setAccounts(accounts);
      }
    };

    getAccounts();
  }, [web3]);

  useEffect(() => {
    const getNetworkId = async () => {
      if (web3) {
        const networkId = await web3.eth.net.getId();
        setNetworkId(networkId);
      }
    };

    getNetworkId();
  }, [web3]);

  useEffect(() => {
    const getItems = async () => {
      if (web3 && networkId) {
        const items = await getAvailableItems(web3, networkId);
        setAvailableItems(items);
      }
    };

    getItems();
  }, [web3, networkId]);

  const connectWallet = async () => {
    const providerOptions = {
      walletconnect: {
        package: Web3Modal.WalletConnectProvider,
        options: {
          infuraId: 'YOUR_INFURA_PROJECT_ID',
        },
      },
      bsc: {
        package: BscConnector,
        options: {
          supportedChainIds: [56, 97],
        },
      },
    };

    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
      providerOptions,
    });

    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);

    setWeb3(web3);
  };

  return (
    <div>
      <h1>Marketplace</h1>
      {accounts.length === 0 ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected Account: {accounts[0]}</p>
          <ul>
            {availableItems.map((item) => (
              <li key={item.id}>
                <p>Name: {item.name}</p>
                <p>Price: {item.price}</p>
                <p>Available: {item.available}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
