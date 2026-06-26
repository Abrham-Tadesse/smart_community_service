import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../services/api';
import  {registerUser,updateProfile,loginUser,passwordUpdate } from '../../services/userServices';



const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
}

// Login
export const login = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginUser(data)
      return res.data
    } catch (err) {
      console.log(err.message);
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

//Register
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // Remove confirmPassword from user data
      const { confirmPassword, ...userDataToSave } = userData
      const response = await registerUser(userDataToSave);
      // localStorage.setItem('token', response.data.token)
      return response.data

    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)
// Authenticate the user it has a token or not in other word it is legitimate or not
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user'))
      
      if (token && user) {
        return { user, token }
      }
      throw new Error('Not authenticated')
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)
// Update profile settings
 export const updateProfiles = createAsyncThunk(
  "profile/profileSettings",async(data,{rejectWithValue}) => {
    try{
       const response = await updateProfile(data);
       return response.data;
    }catch(e){
      return rejectWithValue(
        e.response?.data || e.message
      );
    }
  }
 )

// update the password
export const updatePassword = createAsyncThunk(
  "profile/profileSetting", async(data,{rejectWithValue}) => {
    try{
     const response = await passwordUpdate(data);
     return response.data;
    }catch(e){
      return rejectWithValue(
        e.response?.data || e.message
      )
    }
  }
)


const authSlice = createSlice({
  name: 'auth',
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
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(updateProfiles.fulfilled , (state , action)=>{
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload))
      })
      .addCase(updatePassword.fulfilled, (state,action) =>{
        state.user = action.payload;

      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer