import axios from "axios";
import { BASE_URL } from "../Setting/Settings";
export function get(endPoint:string) {
    return axios.get(BASE_URL + endPoint)
        .then((result:any) => {
            return result;
        }).catch(function (error) {
            console.log(error);
        });
}
export function post(endPoint:any, obj:any) {
    return axios.post(BASE_URL + endPoint, obj)
        .then((result:any) => {
            return result;
        }).catch(function (error) {
            console.log(error);
        });
}
export function put(endPoint:any, obj:any) {
    return axios.put(BASE_URL + endPoint, obj)
        .then((result:any) => {
            return result;
        }).catch(function (error) {
            console.log(error);
        });
}
export function Delete(endPoint:any) {
    return axios.delete(BASE_URL + endPoint)
        .then((result:any) => {
            return result;
        }).catch(function (error) {
            console.log(error);
        });
}







export function getBlob(endPoint:string) {
     const url= BASE_URL + endPoint;
    return  axios({
        url,
        method: 'GET',
        responseType: 'blob',
      })
        .then((result:any) => {

            return result;
        }).catch(function (error) {
            console.log(error);
        });
}





export async function  downloadfile(endPoint:string) 
 { 
    try { 
    const url= BASE_URL + endPoint;
    const response = await axios.get(url, 
    { responseType: 'blob', }); const file = new Blob([response.data], 
        { type: 'application/pdf' }); const fileUrl = URL.createObjectURL(file); 
        return fileUrl; } 
        catch (error) { 
            console.error('Error downloading file:', error);
         } 
        };