import axios from "axios"

export const eqParam = async () =>{
    try {
        const res = await axios.get("https://earthquake.usgs.gov/fdsnws/event/1/application.json");
        return res
    } catch (error) {
        console.error("Error Getting API",error)
        throw error
    }
}


export const eqAll = async () =>{
    try {
        const res = await axios.get("http://localhost:5000/api/eq/earthquakes");
        console.log(res)
        return res
    } catch (error) {
        console.error("Error Getting API",error)
        throw error
    }
}

