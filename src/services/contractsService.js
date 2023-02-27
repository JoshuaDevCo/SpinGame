import { ethers } from "ethers";
import CasinoAbi from "../backend/contractsData/Casino.json";
import CasinoAddress from "../backend/contractsData/Casino-address.json";

    let casino = null;

    const loadContracts = async(signer) => {
        casino = new ethers.Contract(CasinoAddress.address, CasinoAbi.abi, signer);
    }

    const tokenBalance = async(acc) =>{
        const balance = await casino.tokenBalance(acc);
        // return parseInt(balance._hex);
        return ethers.utils.formatEther(balance.toString());
    }

    const buyTokens = async(tokenNum, price) =>{
        await (await casino.compraTokens(tokenNum)).wait();
    }

    const withdrawTokens = async(tokenNum) =>{
        await (await casino.devolverTokens(tokenNum)).wait();
    }

    const playRoulette = async(start, end, tokensBet) =>{
        console.log("playRoulette: ", start, end, tokensBet);
        const game = await (await casino.jugarRuleta(start.toString(), end.toString(), tokensBet.toString())).wait();
        console.log("game: ", game);
        let result
        try{
            result = {
                numberWon : parseInt(game.events[1].args[0]._hex),
                result: game.events[1].args[1],
                tokensEarned: parseInt(game.events[1].args[2]._hex)
            }
        }catch(err){
            console.log("Roulette error: ", err);
            result = {
                numberWon : parseInt(game.events[2].args[0]._hex),
                result: game.events[2].args[1],
                tokensEarned: parseInt(game.events[2].args[2]._hex)
            }
        }

        console.log("result: ", result);
        return result
    }

    const tokenPrice = async() =>{
        const price = await casino.precioTokens(1)
        // return ethers.utils.formatEther(price._hex)
        return ethers.utils.formatUnits(price._hex, "gwei");
    }

    const historial = async(account) =>{
        const historial = await casino.tuHistorial(account)
        let historialParsed = []
        historial.map((game) => (
            historialParsed.push([game[2], parseInt(game[0]), parseInt(game[1])])
          ))
        return historialParsed
    }


    export default {loadContracts, tokenBalance, buyTokens, tokenPrice, historial, playRoulette, withdrawTokens};





