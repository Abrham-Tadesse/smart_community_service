import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../services/api';
import { dashboard,allUsers,role,deleteUsers, allIssues,status,deleteIssue } from '../../services/adminServices';
import { clearError, logout } from '../auth/authSlice';


const initialState = {
  users: [],
  issues: [],

  dashboard: {
    totalUsers: 0,
    totalIssues: 0,
    submitted: 0,
    inProgress: 0,
    resolved: 0,
  },

  loading: false,
  error: null,
  message: null,
};

export const adminDashboard = createAsyncThunk("/admin/usermanagement", 
  async(_, {rejectWithValue})=>{
    try {

      const response = await dashboard();
      return response.data;

    } catch (e) {
      return rejectWithValue(e.response?.data?.message);
      
    }
  }
)

export const accessingAllUsers = createAsyncThunk("/admin/userManagement", 
    async(_, {rejecWithValue})=>{
       
       try { 
        const response = await allUsers();
        return response.data;
        
        }catch(e){
            rejecWithValue(e.response?.data?.message);
        }

})

export const roleChange = createAsyncThunk("/admin/userManagement",
   async(id, {rejecWithValue})=>{
    try {
      const response = await role(id);
      return response.data;

    } catch (e) {
      return rejecWithValue(e.response?.data?.message);
    }

})

export const deleteCitizen = createAsyncThunk("/admin/userManagement",
  async(id, {rejectWithValue})=>{
   try {

       const response = await deleteUsers(id);
       return response.data;

   } catch (e) {
       return rejectWithValue(e.response?.data?.message);
   }

  }) 

  export const accessingAllIssues = createAsyncThunk("/admin/userManagement", 
     async(_, {rejectWithValue})=>{
        try {

           const response = await allIssues();
           return response.data;

        } catch (e) {
          return rejectWithValue(e.response?.data?.message);
          
        }
     
    })

    export const changeStatus = createAsyncThunk("/admin/userManagement",
      async(id,{rejectWithValue})=>{
          try {

          const response = await status(id);
          return response.data;

          } catch (e) {
            return rejectWithValue(e.respose?.data?.message);
            
          }
      })

    export const deleteIssues = createAsyncThunk("/admin/userManagement",
      async(id, {rejectWithValue})=>{
        try {
          const response = await deleteIssue(id);
          return response.data;

        } catch (e) {
          return rejectWithValue(e.response?.data?.message);
        }

      })





      const adminSlice = createSlice({
        name : "admin",
        initialState,
        reducers : {
          logout : (state)=>{
            state.users = null
            state.token = null
            state.error = null
            localStorage.removeItem("token")
            localStorage.removeItem("user")
           
          },
          clearError : (state)=>{
            state.error = null
          },
        },
      
        extraReducers : (builder)=>{
          builder
          .addCase(accessingAllUsers.pending, (state)=>{
           state.loading = true
           state.error = false
          }).addCase(accessingAllUsers.fulfilled, (state,action)=>{
            state.loading = false
            state.error = false
            state.users = action.payload.users;
            
          }).addCase(accessingAllUsers.rejected , (state,action)=>{
            state.loading = false
            state.error = action.payloaad
          }).addCase(roleChange.fulfilled, (state,action)=>{
            state.users = action.payload.users
          }).addCase(deleteCitizen.fulfilled, (state,action)=>{
            state.users = action.payload
          }).addCase(accessingAllIssues.pending, (state)=>{
            state.loading = true
            state.error = false
          }).addCase(accessingAllIssues.fulfilled, (state,action)=>{
            state.loading = false
            state.error = false
            state.issues = action.payload.issues
          }).addCase(accessingAllIssues.rejected, (state,action)=>{
            state.loading = false
            state.error = action.payload
          }).addCase(changeStatus.fulfilled, (state, action)=>{
            state.issues = action.payload
          }).addCase(deleteIssues.fulfilled, (state,action)=>{
            state.issues = action.payloaad
          }).addCase(adminDashboard.pending, (state)=>{
            state.loading = true
            state.error = false
          }).addCase(adminDashboard.fulfilled, (state,action)=>{
             state.dashboard = action.payload.dashboard
          })


        }

      })