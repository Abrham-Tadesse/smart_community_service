import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../services/api';
import { dashboard,allUsers,role,changeUserStatus, allIssues,status,deleteIssue } from '../../services/adminServices';
// import { clearError, logout } from '../auth/authSlice';


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

export const adminDashboard = createAsyncThunk("/admin/dashboard", 
  async(_, {rejectWithValue})=>{
    try {

      const response = await dashboard();
      console.log("Dashboard response:", response.data);
      return response.data;

    } catch (e) {
      return rejectWithValue(e.response?.data?.message);
      
    }
  }
)

export const accessingAllUsers = createAsyncThunk("/admin/allusers", 
    async(_, {rejectWithValue})=>{
       
       try { 
        const response = await allUsers();
        return response.data;
        
        }catch(e){
            rejectWithValue(e.response?.data?.message);
        }

})

export const roleChange = createAsyncThunk("/admin/roleChange",
   async({id,newRole}, {rejectWithValue})=>{
    try {
      
      // console.log(id);
      const response = await role(id,newRole);
      return response.data;

    } catch (e) {
      // console.log(e.response?.data?.message);
      return rejectWithValue(e.response?.data?.message);
    }

})


// CHANGE THE STATUS OF THE USER IN THE SYSTEM 
export const deleteCitizen = createAsyncThunk("/admin/deleteUser",
  async({id,newStatus}, {rejectWithValue})=>{
   try {
       const response = await changeUserStatus(id,newStatus);
       return response.data;

   } catch (e) {
       return rejectWithValue(e.response?.data?.message);
   }

  }) 

  // THE ISSUE CASE 
  
  export const accessingAllIssues = createAsyncThunk("/admin/allIssue", 
     async(_, {rejectWithValue})=>{
        try {

           const response = await allIssues();
           console.log("THUNK:", response.data);
           return response.data;


        } catch (e) {
          return rejectWithValue(e.response?.data?.message);
          
        }
     
    })

    export const changeStatus = createAsyncThunk("/admin/changeStatus",
      async(id,{rejectWithValue})=>{
          try {

          const response = await status(id);
          return response.data;

          } catch (e) {
            return rejectWithValue(e.respose?.data?.message);
            
          }
      })

    export const deleteIssues = createAsyncThunk("/admin/deleteIssue",
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
          reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.error = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    clearError: (state) => {
      state.error = null
    },
        },
      
        extraReducers : (builder)=>{
          builder
          .addCase(accessingAllUsers.pending, (state)=>{
           state.loading = true
           state.error = false
          }).addCase(accessingAllUsers.fulfilled, (state,action)=>{
            console.log("FULFILLED PAYLOAD:", action.payload);

            state.loading = false
            state.error = false
            state.users = action.payload.users;
            
          }).addCase(accessingAllUsers.rejected , (state,action)=>{
            state.loading = false
            state.error = action.payloaad
          }).addCase(roleChange.fulfilled, (state, action) => {
            const updatedUser = action.payload.user;
            state.users = state.users.map(user =>
                user._id === updatedUser._id
                    ? updatedUser
                    : user
            )
        }).addCase(deleteCitizen.fulfilled, (state,action)=>{
            const updatedUser = action.payload.user;
            state.users = state.users.map(user =>
                user._id === updatedUser._id
                    ? updatedUser
                    : user
            )
          }).addCase(accessingAllIssues.pending, (state)=>{
            state.loading = true
            state.error = false
          }).addCase(accessingAllIssues.fulfilled, (state,action)=>{
            console.log("REDUCER:", action.payload);

            state.loading = false
            state.error = null
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
            state.loading = false;
             state.dashboard = action.payload;
          })


        }

      })


      // export const {logout, clearError} = adminSlice.actions

      export default adminSlice.reducer