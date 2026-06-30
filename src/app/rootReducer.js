import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import issueReducer from '../features/issues/issueSlice'
import commentReducers from '../features/comments/commentSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  issues: issueReducer,
  comments: commentReducers
})

export default rootReducer