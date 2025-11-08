import db from "../config/database.js";


export const readReports = async () =>{
    try {
        const [rows] = await db.query("SELECT * FROM reports")
        return rows
        
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const readReport = async (report_id) =>{
    try {
        const [rows] = await db.query("SELECT * FROM reports WHERE report_id = ?",[report_id])
        return rows[0]
        
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const insertReports = async (reportData) =>{
    const {user_id,report_title,location,magnitude,description} = reportData
    try {   
        const [rows] = await db.query(`INSERT INTO reports (user_id,report_title,location,magnitude,description)
            VALUES (?,?,?,?,?)`,[user_id,report_title,location,magnitude,description])
            console.log(rows[0])
            const newReports = rows.insertId
            return readReport(newReports)
    } catch (error) {
        console.error(error)
        throw error
    }
}


export const updateReports = async (reportData,report_id) =>{
    
    const {location,magnitude,description} = reportData
    try {
        const [rows] = await db.query(`UPDATE reports 
            SET location = ?,magnitude = ?, description = ? WHERE report_id = ?`,[location,magnitude,description,report_id])
        return rows[0]
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const deleteReports = async (report_id) =>{
    try {
        const [rows] = await db.query(`DELETE FROM reports WHERE report_id = ?`,[report_id])
        return rows[0]
    } catch (error) {
        console.error(error)
        throw error
    }
}


export const searchReports = async (term) =>{
    try {
        const [rows] = await db.query(`SELECT * FROM reports 
            WHERE location LIKE % OR magnitude LIKE % OR description LIKE %`,[])
        return rows[0]
    } catch (error) {
        console.error(error)
        throw error
    }
}