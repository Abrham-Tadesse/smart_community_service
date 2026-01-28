// Debug helper to check localStorage
export const checkLocalStorage = () => {
  console.log('=== LOCALSTORAGE DEBUG ===')
  console.log('Users:', JSON.parse(localStorage.getItem('users') || '[]'))
  console.log('Issues:', JSON.parse(localStorage.getItem('issues') || '[]'))
  console.log('Current User:', JSON.parse(localStorage.getItem('user') || 'null'))
  console.log('Token:', localStorage.getItem('token'))
  console.log('========================')
}

// Function to clear all localStorage (for testing)
export const clearLocalStorage = () => {
  localStorage.clear()
  console.log('LocalStorage cleared!')
  window.location.reload()
}

// Function to add test issues
export const addTestIssues = () => {
  const testIssues = [
    {
      id: 'test-1',
      title: 'Test Water Issue',
      category: 'water',
      description: 'This is a test water issue description.',
      severity: 'high',
      priorityScore: 8,
      status: 'submitted',
      location: 'Test Location',
      affectedPeople: 50,
      durationHours: 24,
      areaImportance: 'high',
      reportedBy: {
        id: 'test-user',
        name: 'Test User',
        email: 'test@example.com'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
  
  localStorage.setItem('issues', JSON.stringify(testIssues))
  console.log('Test issues added!')
  window.location.reload()
}