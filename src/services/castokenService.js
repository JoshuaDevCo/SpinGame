import { ethers } from "ethers";
import TokenAbi from "../backend/contractsData/Token.json";
// import TokenAddress from "../backend/contractsData/Token-address.json";
import CasinoAddress from "../backend/contractsData/Casino-address.json";

let token = null;
const casTokenAddress = "0x0141ea6bcb0dd08f71bb7310e08e36d8a0af3313";
const loadContracts = async(signer) => {
    token = new ethers.Contract(casTokenAddress, TokenAbi.abi, signer);
    console.log("TokenContract: ", token);
}

const Balance = async(acc) =>{
    const balance = await token.balanceOf(acc);
    return parseInt(balance._hex);
}

const Allowancement = async(acc) =>{
    const allowancement = await token.allowance(acc, CasinoAddress.address);
    console.log("cas-allowancement: ", allowancement);
    return ethers.utils.formatEther(allowancement.toString());
}

const Approve = async(amount) =>{
    console.log("Approve");
    console.log("Approve: token=", token);
    console.log("Approve: ", amount, " - ", ethers.utils.parseEther(amount.toString()));
    await (await token.approve(CasinoAddress.address, ethers.utils.parseEther(amount.toString()))).wait();
}

export default {loadContracts, Balance, Allowancement, Approve};





