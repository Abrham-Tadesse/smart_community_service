import API from "./api";
import { endpoints } from "./endpoints";

export const createIssues = (data) =>{
    return API.post(endpoints.create, data);
}

export const readIssues = () =>{
    return API.get(endpoints.read);
}
