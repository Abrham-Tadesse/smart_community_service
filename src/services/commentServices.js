import API from "./api";
import { endpoints } from "./endpoints";

export const createComments = (issueId, data)=>{
    return API.post(endpoints.comments(issueId),data);
}

export const readComments = (issueId) =>{
    return API.get(endpoints.comments(issueId));
}