import { ethers } from "ethers";
import TokenAbi from "../backend/contractsData/Token.json";
import TokenAddress from "../backend/contractsData/Token-address.json";
import CasinoAddress from "../backend/contractsData/Casino-address.json";

let token = null;

const loadContracts = async(signer) => {
    token = new ethers.Contract(TokenAddress.address, TokenAbi.abi, signer);
    console.log("TokenContract: ", token);
}

const Balance = async(acc) =>{
    const balance = await token.balanceOf(acc);
    return parseInt(balance._hex);
}

const Allowancement = async(acc) =>{
    const allowancement = await token.allowance(acc, CasinoAddress.address);
    return ethers.utils.formatUnits(allowancement, "gwei");
}

const Approve = async(amount) =>{
    console.log("Approve");
    console.log("Approve: token=", token);
    console.log("Approve: ", amount, " - ", ethers.utils.parseUnits(amount.toString(), "gwei"));
    await (await token.approve(CasinoAddress.address, ethers.utils.parseUnits(amount.toString(), "gwei"))).wait();
}

export default {loadContracts, Balance, Allowancement, Approve};





