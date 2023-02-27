import { createSlice } from '@reduxjs/toolkit'
import castokenService from '../services/castokenService';
const casBalanceSlice = createSlice({
    name: 'casBalance',
    initialState: 0,
    reducers:{
        setCasBalance(state, action){
            return action.payload
        }
    }
})

export const {setCasBalance} = casBalanceSlice.actions

export const loadCasBalance = (account) => {
    return async dispatch =>{
        const balance = await castokenService.Balance(account)
        dispatch(setCasBalance(balance))
    }
}

export default casBalanceSlice.reducer