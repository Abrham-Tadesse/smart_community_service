
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


  
}