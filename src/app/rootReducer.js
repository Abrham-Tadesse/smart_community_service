import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import issueReducer from '../features/issues/issueSlice'
import commentReducers from '../features/comments/commentSlice'
import adminReducers from '../features/admin/adminSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  issues: issueReducer,
  comments: commentReducers,
  admin : adminReducers,
})

export default rootReducer