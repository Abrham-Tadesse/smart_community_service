
export const endpoints = {
  login: '/users/login',
  register: '/users',
  me : "/users/me",
  password : "/users/me/password",

  // issue endpoins
  create : "/issues",
  read : "/issues",
  update : "/issues",

  //comment`s end points 
  comments : (issueId)=> `/comments/issues/${issueId}/comments`,

// Admin`s end point
  dashboard : "/admin/dashboard",
  allUser : "/admin/users", // also for deleting
  changeRole : (userID) => `admin/users/${userID}/role`,
  //deleteUser  :"/admin/users",
  allIssue : "/admin/issues",  //For deleting also 
  changeStatus : (issueId) =>`admin/issues/${issueId}/status`,


  
}