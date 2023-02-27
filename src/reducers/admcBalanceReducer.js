import { createSlice } from '@reduxjs/toolkit'
import tokenService from '../services/tokenService';
const admcBalanceSlice = createSlice({
    name: 'admcBalance',
    initialState: 0,
    reducers:{
        setAdmcBalance(state, action){
            return action.payload
        }
    }
})

export const {setAdmcBalance} = admcBalanceSlice.actions

export const loadAdmcBalance = (account) => {
    return async dispatch =>{
        const balance = await tokenService.Balance(account)
        dispatch(setAdmcBalance(balance))
    }
}

export default admcBalanceSlice.reducer