import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

const initialState = {
  issues: [],
  currentIssue: null,
  loading: false,
  error: null,
  filters: {
    category: '',
    status: '',
    priority: '',
  },
}

export const fetchIssues = createAsyncThunk(
  'issues/fetchIssues',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/issues')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch issues')
    }
  }
)

export const fetchIssueById = createAsyncThunk(
  'issues/fetchIssueById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/issues/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch issue')
    }
  }
)

export const createIssue = createAsyncThunk(
  'issues/createIssue',
  async (issueData, { rejectWithValue }) => {
    try {
      const response = await api.post('/issues', issueData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create issue')
    }
  }
)

export const updateIssue = createAsyncThunk(
  'issues/updateIssue',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/issues/${id}`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update issue')
    }
  }
)

const issueSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
    clearCurrentIssue: (state) => {
      state.currentIssue = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIssues.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.loading = false
        state.issues = action.payload
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchIssueById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchIssueById.fulfilled, (state, action) => {
        state.loading = false
        state.currentIssue = action.payload
      })
      .addCase(fetchIssueById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createIssue.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createIssue.fulfilled, (state, action) => {
        state.loading = false
        state.issues.unshift(action.payload)
      })
      .addCase(createIssue.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { setFilters, clearFilters, clearCurrentIssue } = issueSlice.actions
export default issueSlice.reducer