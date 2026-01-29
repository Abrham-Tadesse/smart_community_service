import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

const initialState = {
  issues: JSON.parse(localStorage.getItem('issues')) || [],
  currentIssue: null,
  loading: false,
  error: null,
  filters: {
    category: '',
    status: '',
    priority: '',
  },
}

// Mock function to get issues from localStorage
const getIssuesFromStorage = () => {
  return JSON.parse(localStorage.getItem('issues')) || []
}

// Mock function to save issue to localStorage
const saveIssueToStorage = (issue) => {
  const issues = getIssuesFromStorage()
  issues.unshift(issue) // Add new issue at the beginning
  localStorage.setItem('issues', JSON.stringify(issues))
  return issue
}

export const fetchIssues = createAsyncThunk(
  'issues/fetchIssues',
  async (_, { rejectWithValue }) => {
    try {
      // Get from localStorage instead of API
      const issues = getIssuesFromStorage()
      return issues
    } catch (error) {
      return rejectWithValue('Failed to fetch issues')
    }
  }
)

export const fetchIssueById = createAsyncThunk(
  'issues/fetchIssueById',
  async (id, { rejectWithValue }) => {
    try {
      const issues = getIssuesFromStorage()
      const issue = issues.find(issue => issue.id === id)
      
      if (!issue) {
        throw new Error('Issue not found')
      }
      
      return issue
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch issue')
    }
  }
)

export const createIssue = createAsyncThunk(
  'issues/createIssue',
  async (issueData, { rejectWithValue, getState }) => {
    try {
      // Get current user from auth state
      const { auth } = getState()
      const user = auth.user
      
      if (!user) {
        throw new Error('User not authenticated')
      }
      
      // Create issue object
      const newIssue = {
        id: Date.now().toString(),
        ...issueData,
        priorityScore: issueData.priorityScore || 5,
        status: 'submitted',
        reportedBy: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [],
        upvotes: 0,
        // Add mock data for testing
        location: issueData.location || 'Addis Ababa',
        affectedPeople: parseInt(issueData.affectedPeople) || 1,
        durationHours: parseInt(issueData.durationHours) || 1,
        category: issueData.category || 'other',
        severity: issueData.severity || 'medium',
        areaImportance: issueData.areaImportance || 'medium',
        image: issueData.image || null
      }
      
      // Save to localStorage
      const savedIssue = saveIssueToStorage(newIssue)
      
      return savedIssue
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create issue')
    }
  }
)

export const updateIssue = createAsyncThunk(
  'issues/updateIssue',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const issues = getIssuesFromStorage()
      const issueIndex = issues.findIndex(issue => issue.id === id)
      
      if (issueIndex === -1) {
        throw new Error('Issue not found')
      }
      
      // Update the issue
      const updatedIssue = {
        ...issues[issueIndex],
        ...data,
        updatedAt: new Date().toISOString()
      }
      
      issues[issueIndex] = updatedIssue
      localStorage.setItem('issues', JSON.stringify(issues))
      
      return updatedIssue
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update issue')
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
    // Add new reducer to manually add an issue to state
    addIssue: (state, action) => {
      state.issues.unshift(action.payload)
    }
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
        // Add the new issue to the beginning of the issues array
        state.issues.unshift(action.payload)
        try {
          // add notification for admin about new submitted issue
          const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
          notifications.unshift({
            id: Date.now().toString(),
            issueId: action.payload.id,
            title: `New issue submitted: ${action.payload.title}`,
            type: 'issue_submitted',
            createdAt: new Date().toISOString(),
            read: false
          })
          localStorage.setItem('notifications', JSON.stringify(notifications))
          // notify UI in same window
          window.dispatchEvent(new CustomEvent('notificationsUpdated'))
        } catch (e) {
          // ignore notification errors
        }
      })
      .addCase(createIssue.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateIssue.fulfilled, (state, action) => {
        const index = state.issues.findIndex(issue => issue.id === action.payload.id)
        if (index !== -1) {
          state.issues[index] = action.payload
        }
        if (state.currentIssue?.id === action.payload.id) {
          state.currentIssue = action.payload
        }
        try {
          // if issue was reported (status changed to 'reported') notify admin
          if (action.payload.status === 'reported') {
            const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
            notifications.unshift({
              id: Date.now().toString(),
              issueId: action.payload.id,
              title: `Issue reported: ${action.payload.title}`,
              type: 'issue_reported',
              createdAt: new Date().toISOString(),
              read: false
            })
            localStorage.setItem('notifications', JSON.stringify(notifications))
            window.dispatchEvent(new CustomEvent('notificationsUpdated'))
          }
        } catch (e) {
          // ignore
        }
      })
  },
})

export const { setFilters, clearFilters, clearCurrentIssue, addIssue } = issueSlice.actions
export default issueSlice.reducer