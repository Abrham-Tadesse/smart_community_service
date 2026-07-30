import API from "./api";
import { endpoints } from "./endpoints";

export const dashboard = ()=>{
    return API.get(endpoints.dashboard);
}

export const allUsers = ()=>{
    return API.get(endpoints.allUser);
}

export const role = (userId,newRole) =>{
    return API.patch(endpoints.changeRole(userId),{newRole});
}

export const changeUserStatus = (userId,newStatus)=>{
    return API.patch(endpoints.changeUsersStatus(userId),{newStatus});
}

// ISSUE CASE 

export const allIssues = ()=>{
    return API.get(endpoints.allIssue);
}

export const status = (issueId)=>{
     return API.patch(endpoints.changeStatus(issueId));
}

export const deleteIssue = (issueId)=>{
    return API.delete(`${endpoints.allIssue}/${issueId}`);
}

export const readActivities = ()=>{
    return API.get(endpoints.recentActivities);
}