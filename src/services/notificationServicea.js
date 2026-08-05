import API from "./api";
import { endpoints } from "./endpoints";

export const fetchNotifications = ()=>{

    return API.get(endpoints.fetch);
}

export const readAllNotif = ()=>{
    return API.patch(endpoints.readAllNotifications);
}

export const readOneNotification = (notifId)=>{
    return API.patch(endpoints.readSingleNotification(notifId))
}