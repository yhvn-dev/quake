import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getReports = async () => {
    try {
        const res = await api.get("http://localhost:5000/api/reports/get/reports")
        console.log("GET REPORTS",res)
        return res
    } catch (error) {
        console.error("Error Getting Reports")
        throw error
    }
}
export const insertReports = async (reportData) =>{
    try {
        const res = await api.post("http://localhost:5000/api/reports/post/reports",reportData)
          console.log("REPORT DATA FROM SERVICES",res)
        return res
    } catch (error) {
        console.error("Error Creating Reports")
        throw error
    }
}

export const UpdateReports = async (reportData,report_id) =>{
    try {
        
        const res = await api.put(`http://localhost:5000/api/reports/put/reports/${report_id}`,{reportData})
        console.log("UPDATE RESPONSE",res)
        return res
    } catch (error) {
        console.error("Error Upating Reports")
        throw error
    }
}

export const deleteReports = async (report_id) =>{
    try {
        const res = await api.delete(`http://localhost:5000/api/reports/delete/reports/${report_id}`)
        console.log("DELETE RESPONSE",res)
        return res
    } catch (error) {
        console.error("Error Getting Reports")
        throw error
    }
}

export default api