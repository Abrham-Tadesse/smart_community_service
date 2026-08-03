import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../services/api";
import { fetchNotifications,readAllNotif,readOneNotification } from "../../services/notificationServicea";



const initialState = {
    notifications : [],
    loading : false,
    error : null,
}

export const fetchAllNotif = createAsyncThunk("/featchAllNotifications", 
    async(_,{rejectWithValue})=>{
     try {
        const response = await fetchNotifications();
        return response.data;
        
     } catch (e) {
         rejectWithValue(e.message);
     }
})

export const readAll = createAsyncThunk("/readAllNotifications", async(_, {rejectWithValue})=>{
 try {
       const response = await readAllNotif();
       return response.data;
 } catch (e) {
    return rejectWithValue(e.message);
    
 }
})

export const readOne = createAsyncThunk("/readSingleNotification", async({notId}, {rejectWithValue})=>{
    try { 
        const response = await readOne(notId);
        return response.data;
        
    } catch (e) {
        return rejectWithValue(e.message);
        
    }
})





const notificationSlice = createSlice({
    name : notificationSlice,
    initialState,
    reducers : {
        
    }
})