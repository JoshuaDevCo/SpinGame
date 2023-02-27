import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useField } from "../hooks/useField";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import contractsService from '../services/contractsService';
import castokenService from '../services/castokenService';
import { loadBalance } from "../reducers/balanceReducer";
import { loadCasAllowancement } from "../reducers/casAllowancementReducer";
import TotalBNB from "./TotalBNB";
import SelectAmount from "./SelectAmount";
  
  const Withdraw = async(event, tokenAmount, change, price, account, casAllowancement, dispatch) => {
    event.preventDefault();

    if (casAllowancement < tokenAmount) {
      console.log("xxxxxxxxxxxx2");
      try {
        await castokenService.Approve(tokenAmount);
        await dispatch(loadCasAllowancement(account));
  
        toast.success(`Approved successfully!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      } catch(err) {
        console.log("BuyTokens err:", err);
        toast.error(`An error has occurred please try again later`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      
      return;
    }

    if (tokenAmount === ""){
      toast.error(`Please select an amount of Pepperoni to withdraw`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }else{
    change(0);
    try{
      await contractsService.withdrawTokens(tokenAmount)
      await dispatch(loadBalance(account));
      await dispatch(loadCasAllowancement(account));

      toast.success(`You have withdrawn ${tokenAmount} Pepperonis`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
    }catch(error){
      toast.error(`An error has occurred please try again later`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }
  }
  };

  
  const WithdrawTokens = ({price, account, balance, casAllowancement}) => {
    console.log("withdrawToken: ", casAllowancement, " - ", price, " - ", balance);
    const dispatch = useDispatch()
    const tokenAmount = useField("");

    const auxChange = (amount) => {
      if (amount > balance) {
        toast.warn(
          `The amount of Pepperonis to share cant be higher than your balance`,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        tokenAmount.change(balance);
      } else {
        tokenAmount.change(amount);
      }
    };
  
    return (
      <Grid container rowSpacing={2}>
      <Grid item xs={12}>
      <Grid container alignItems="center" justifyContent="center">
        <Typography variant="h3" sx={{color:'#FFFFFF', width:'90%'}} align='center'>Sell Pepperoni</Typography>
        </Grid>
        </Grid>
    <Grid item xs={12}>
        <form onSubmit={(event)=>Withdraw(event, tokenAmount.value, tokenAmount.change, price, account, casAllowancement, dispatch)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container alignItems="center" justifyContent="center">
                <SelectAmount onChangeValue={tokenAmount.onChange} changeValue={auxChange} TextFielValue={tokenAmount.value} maxValue={balance} buttonColor={'#2e7d32'} />
            </Grid>
          </Grid>
        
          <Grid item xs={12} sx={{ m: 0.25 }}>
          <TotalBNB tokenAmount={tokenAmount.value} price={price} msg={'You will receive'}/>
          </Grid>
          
          <Grid item xs={12} sx={{ m: 0.25 }}>
          <Grid container alignItems="center" justifyContent="center" spacing={2}>
            <Button type="submit" size="large" variant="contained" color="warning">
              {casAllowancement >= tokenAmount.value ? "Convert" : "Approve"}
            </Button>
          </Grid>
          </Grid>
        </Grid>
      </form>
      </Grid>
        <ToastContainer />
      </Grid>
    );
  };
  export default WithdrawTokens;