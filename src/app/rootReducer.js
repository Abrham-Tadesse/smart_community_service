import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import issueReducer from '../features/issues/issueSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  issues: issueReducer,
})

export default rootReducer