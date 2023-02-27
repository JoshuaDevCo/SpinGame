import { createSlice } from '@reduxjs/toolkit'
import tokenService from '../services/tokenService';
const admcAllowancementReducer = createSlice({
    name: 'admcAllowancement',
    initialState: 0,
    reducers:{
        setAdmcAllowancement(state, action){
            return action.payload
        }
    }
})

export const {setAdmcAllowancement} = admcAllowancementReducer.actions

export const loadAdmcAllowancement = (account) => {
    return async dispatch =>{
        const allowancement = await tokenService.Allowancement(account)
        dispatch(setAdmcAllowancement(allowancement))
    }
}

export default admcAllowancementReducer.reducer