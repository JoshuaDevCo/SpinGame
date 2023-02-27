import './App.css';
import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import { Grid } from '@mui/material';
import contractsService from './services/contractsService';
import tokenService from './services/tokenService';
import castokenService from './services/castokenService';
import {useDispatch, useSelector } from "react-redux";
import { loadAccounts } from './reducers/accountReducer';
import { loadBalance } from './reducers/balanceReducer';
import { loadPrice } from './reducers/priceReducer';
import { loadHistorial } from './reducers/historialReducer';

import { loadAdmcBalance } from './reducers/admcBalanceReducer';
import { loadAdmcAllowancement } from './reducers/admcAllowancementReducer';

import { loadCasAllowancement } from './reducers/casAllowancementReducer';

import BuyTokens from './components/BuyTokens';
import WithdrawTokens from './components/Withdraw';
import Header from './components/Header';
import {
  Routes,
  Route,
} from "react-router-dom"

import RouletteGame from './components/RouletteGame';
import Wallet from './components/Wallet';
import Games from './components/Games';

const App = () => {
  const dispatch = useDispatch()
  const balance = useSelector(({ balance }) => {
    return balance;
  });
  const account = useSelector(({ account }) => {
    return (
      account
    )
  })

  const price = useSelector(({ price }) => {
    console.log("price: ", price);
    return price;
  });

  const admcAllowancement = useSelector(({ admcAllowancement }) => {
    console.log("admcAllowancement: ", admcAllowancement);
    return admcAllowancement;
  })
  
  const casAllowancement = useSelector(({ casAllowancement }) => {
    console.log("casAllowancement: ", casAllowancement);
    return casAllowancement;
  })

  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    dispatch(loadAccounts(accounts[0]));
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      dispatch(loadAccounts(accounts[0]));
      await web3Handler();
    })
    console.log("singer: ", signer);
    await contractsService.loadContracts(signer);
    await tokenService.loadContracts(signer);
    await castokenService.loadContracts(signer);
  }

  const loadInfo = async () => {
    if (account !==""){
      await dispatch(loadBalance(account));
      await dispatch(loadPrice(account));
      await dispatch(loadHistorial(account))
      
      await dispatch(loadAdmcBalance(account))
      await dispatch(loadAdmcAllowancement(account))
      
      await dispatch(loadCasAllowancement(account))
    }
  }

  useEffect(() => {
    loadInfo()
}, [account])


  return (
    <Grid container rowSpacing={{ xs: 8, sm: 9 }} sx={{ width: 1, backgroundColor: '#11111'}}>
    <Grid item xs={12}>
      <Header login={web3Handler} balance={balance} account={account}/>
    </Grid>
    <Grid item xs={12}>
      <Routes>
        <Route path="/Wallet" element={<Wallet/>} > 
          <Route path="buyTokens" element={<BuyTokens account={account} price={price} admcAllowancement={admcAllowancement}/>} />
          <Route path="withdrawTokens" element={<WithdrawTokens balance={balance} account={account} price={price} casAllowancement={casAllowancement}/>} />
        </Route>
        <Route path="/games" element={<Games/>}/>
        <Route path="/games/PizzaGame" element={<RouletteGame balance={balance} account={account} casAllowancement={casAllowancement}/>} />
      </Routes>
      </Grid>
      </Grid>
  );
}

export default App;
