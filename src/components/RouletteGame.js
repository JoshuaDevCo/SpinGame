import React, { useState } from "react";
import Ruleta from "./PizzaGame";
import {  Grid, Button } from "@mui/material";
import { useField } from "../hooks/useField";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import CustomButton from "./CustomButton";
import contractsService from '../services/contractsService';
import castokenService from '../services/castokenService';
import { loadBalance } from "../reducers/balanceReducer";
import { loadCasAllowancement } from "../reducers/casAllowancementReducer";

import SelectAmount from "./SelectAmount";

const RouletteGame = ({balance, account, casAllowancement}) => {
  const dispatch = useDispatch()
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const betAmount = useField("");
  const start = useField("");
  const end = useField("");
  const [lastResult, setlastResult] = useState("");

  const onWheelStop= async()=>{
    setMustSpin(false)
    await dispatch(loadBalance(account))
    if (lastResult.result === true){
      toast.success(`Congratulations, you have earned ${lastResult.tokensEarned} Pepperonis!!`, {
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

  const handleSpinClick = async(event) => {
    event.preventDefault();

    if (casAllowancement < betAmount.value) {
      console.log("xxxxxxxxxxxx2");
      try {
        await castokenService.Approve(betAmount.value);
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

    if (betAmount.value === ""){
      toast.error(`Please select an amount of Pepperonis to buy`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }else{
    try{
      console.log("start");
      const result =await contractsService.playRoulette(start.value, end.value, betAmount.value)
      console.log("end");
      setlastResult(result)
      setPrizeNumber(result.numberWon)
      setMustSpin(true)
      await dispatch(loadBalance(account))
      await dispatch(loadCasAllowancement(account))
    }catch(err){
      console.log("spinerror: ", err);
      toast.error(`An error has occurred please try again later`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }}

  };

  const changeNumberBet = (begin, final) => {
    start.change(begin);
    end.change(final);

  };

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
      betAmount.change(balance);
    } else {
      betAmount.change(amount);
    }
  };

  return (
    <Grid container rowSpacing={3}>
      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="center"></Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="center">
          <Ruleta
            newPrizeNumber={prizeNumber}
            mustSpin={mustSpin}
            functionallity={()=> onWheelStop()}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <form onSubmit={handleSpinClick}>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="center">
                <SelectAmount
                  maxValue={balance}
                  TextFielValue={betAmount.value}
                  changeValue={auxChange}
                  onChangeValue={betAmount.onChange}
                  buttonColor={'#D59936'}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="center">
                <Grid item xs={4}>
                  <Grid container alignItems="center" justifyContent="center">
                  <CustomButton
                      backGround={"red"}
                      text={"white"}
                      display={betAmount.value <= casAllowancement ? "Slices 1-7" : 'Approve'}
                      size={"large"}
                      type={"submit"}
                      width={"80%"}
                      functionallity={()=>changeNumberBet(1,7)}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <Grid container alignItems="center" justifyContent="center">
                    <Button
                      style={{
                        width: "80%",
                      }}
                      variant="contained"
                      color="success"
                      type="submit"
                      onClick={()=>changeNumberBet(0,0)}
                    >
                      {betAmount.value <= casAllowancement ? "0" : 'Approve'}
                    </Button>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <Grid container alignItems="center" justifyContent="center">
                    <CustomButton
                      backGround={"gold"}
                      text={"white"}
                      display={betAmount.value <= casAllowancement ? "Slices 8-14" : 'Approve'}
                      size={"large"}
                      type={"submit"}
                      width={"80%"}
                      functionallity={()=>changeNumberBet(8,14)}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Grid>
      <ToastContainer />
    </Grid>
  );
};

export default RouletteGame;
