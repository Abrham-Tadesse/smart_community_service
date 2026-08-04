import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../services/api";
import { fetchNotifications,readAllNotif,readOneNotification } from "../../services/notificationServicea";



const initialState = {
    notifications : [],
    unreadCount  :0,
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
        const response = await readOneNotification(notId);
        return response.data;
        
    } catch (e) {
        return rejectWithValue(e.message);
        
    }
})





const notificationSlice = createSlice({
    name : notificationSlice,
    initialState,
    reducers : {
        clearNotificationError : ((state)=>{
            state.error = null
        }),
        clearNotificationMessage : ((state)=>{
            state.message = null
        }),
        resetNotitfications : ((state)=>{
            state.notifications = [],
            state.error = null,
            state.loading = false,
            state.message = null
        })
    },
    extraReducers : (builder)=>{
        builder.addCase(fetchAllNotif.pending, (state)=>{
            state.loading = true,
            state.error = null
        })
        .addCase(fetchAllNotif.fulfilled, (state, action)=>{
            state.loading = false,
            state.notifications = action.payload,
             state.unreadCount = action.payload.filter((notification)=> 
             !(notification.isRead)).length
        })
        .addCase(fetchAllNotif.rejected, (state, action)=>{
            state.loading = false,
            state.error = action.payload
        })
        .addCase(readOne.fulfilled, (state,action)=>{

            const notification = state.notifications.find((n)=>
                n._id === action.payload._id
            );
            if(notification){
                notification._isRead = true
            }
            state.unreadCount--;

        })
        .addCase(readOne.rejected, (state, action)=>{
            state.error = action.payload
        })
        .addCase(readAll.fulfilled, (state)=>{
              state.notifications.forEach((notification) => {
              notification.isRead = true;
          });
            state.loading = false,
            state.unreadCount = 0
        })
        .addCase(readAll.rejected, (state, action)=> {
            state.loading = false,
            state.error = action.payload
        }) 




    }
})


export const {
    clearNotificationError,
    clearNotificationMessage,
    resetNotitfications
} = notificationSlice.actions;

export default notificationSlice.reducer;