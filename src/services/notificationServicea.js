import API from "./api";
import { endpoints } from "./endpoints";

export const fetchNotifications = ()=>{
    return API.get(endpoints.fetchNotifications());
}

export const readAllNotif = ()=>{
    return API.patch(endpoints.readAllNotifications());
}

export const readOneNotification = (notId)=>{
    return API.patch(endpoints.readSingleNotification(notId))
}