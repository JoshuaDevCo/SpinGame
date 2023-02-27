import { createSlice } from '@reduxjs/toolkit'
import castokenService from '../services/castokenService';
const casAllowancementReducer = createSlice({
    name: 'casAllowancement',
    initialState: 0,
    reducers:{
        setCasAllowancement(state, action){
            return action.payload
        }
    }
})

export const {setCasAllowancement} = casAllowancementReducer.actions

export const loadCasAllowancement = (account) => {
    return async dispatch =>{
        const allowancement = await castokenService.Allowancement(account)
        dispatch(setCasAllowancement(allowancement))
    }
}

export default casAllowancementReducer.reducer