// Mock API service that uses localStorage
const api = {
  // Mock login function
  async post(endpoint, data) {
    console.log('Mock API call:', endpoint, data)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (endpoint === '/auth/register') {
      return this.mockRegister(data)
    }
    
    if (endpoint === '/auth/login') {
      return this.mockLogin(data)
    }
    
    if (endpoint === '/issues') {
      return this.mockCreateIssue(data)
    }
    
    if (endpoint === '/issues/' && data?.id) {
      return this.mockGetIssue(data.id)
    }
    
    return { data: null }
  },
  
  async get(endpoint) {
    console.log('Mock GET:', endpoint)
    
    await new Promise(resolve => setTimeout(resolve, 300))
    
    if (endpoint === '/issues') {
      return this.mockGetIssues()
    }
    
    return { data: null }
  },
  
  async put(endpoint, data) {
    console.log('Mock PUT:', endpoint, data)
    await new Promise(resolve => setTimeout(resolve, 300))
    return { data }
  },
  
  // Mock registration
  mockRegister(userData) {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const existingUser = users.find(u => u.email === userData.email)
    
    if (existingUser) {
      throw {
        response: {
          data: { message: 'User already exists' }
        }
      }
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    
    // Create token
    const token = 'mock-jwt-token-' + Date.now()
    
    return {
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: 'citizen'
        },
        token
      }
    }
  },
  
  // Mock login
  mockLogin(credentials) {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => 
      u.email === credentials.email && 
      u.password === credentials.password
    )
    
    if (!user) {
      throw {
        response: {
          data: { message: 'Invalid email or password' }
        }
      }
    }
    
    const token = 'mock-jwt-token-' + Date.now()
    
    return {
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: 'citizen'
        },
        token
      }
    }
  },
  
  // Mock issues
  mockCreateIssue(issueData) {
    const issues = JSON.parse(localStorage.getItem('issues') || '[]')
    const newIssue = {
      id: Date.now().toString(),
      ...issueData,
      createdAt: new Date().toISOString(),
      status: 'submitted'
    }
    
    issues.unshift(newIssue)
    localStorage.setItem('issues', JSON.stringify(issues))
    
    return {
      data: newIssue
    }
  },
  
  mockGetIssues() {
    const issues = JSON.parse(localStorage.getItem('issues') || '[]')
    return {
      data: issues
    }
  },
  
  mockGetIssue(id) {
    const issues = JSON.parse(localStorage.getItem('issues') || '[]')
    const issue = issues.find(i => i.id === id)
    
    if (!issue) {
      throw {
        response: {
          data: { message: 'Issue not found' }
        }
      }
    }
    
    return {
      data: issue
    }
  }
}

export default api