import * as reportsModel from "../models/reportsModel.js"

export const selectReports = async (req,res) =>{
  try {
    const reports = await reportsModel.readReports()
    console.log("REPORT DISPLAYED",reports)
     res.json({
      success: true,
      data:reports,
      message: "Report Displayed!",
    });
    
  } catch (error) {
     res.status(500).json({
      success: false,
      error: error.message,
      hint: "Check server console and debug_response.html file for more details",
    });
  }
}




export const selectReport = async (req,res) =>{
  try {

    const {user_id} = req.params
    const report = await reportsModel.readReport(user_id)
    console.log("REPORT DISPLAYED",report)
     res.json({
      success: true,
      data:report,
      message: "Report Displayed!",
    });
    
  } catch (error) {
     res.status(500).json({
      success: false,
      error: error.message,
      hint: "Check server console and debug_response.html file for more details",
    });
  }
}



export const insertReports = async (req,res) =>{
  try {
    const reportData = req.body
    console.log("REPORT DATA FROM CONTROLLER",reportData)
    const reports = await reportsModel.insertReports(reportData)
    console.log("ADDED",reports)

     res.json({
      success: true,
      data:reports,
      message: "Report Added",
    });
    
  } catch (error) {
     res.status(500).json({
      success: false,
      error: error.message,
      hint: "Check server console and debug_response.html file for more details",
    });
  }
}


export const updateReports = async (req,res) =>{
  try {

    const {report_id} = req.params;
    const reportData = req.body
    const reports = await reportsModel.updateReports(reportData,report_id)
    console.log("UPDATED",reports)

     res.json({
      success: true,
      data:reports,
      message: "Report Updated",
    });
    
  } catch (error) {
     res.status(500).json({
      success: false,
      error: error.message,
      hint: "Check server console and debug_response.html file for more details",
    });
  }
}

export const deleteReports = async (req,res) =>{
  try {

    const {report_id} = req.params;
    const reports = await reportsModel.deleteReports(report_id)
    console.log("DELETED",reports)

     res.json({
      success: true,
      data:reports,
      message: "Report DELETED",
    });
  } catch (error) {
     res.status(500).json({
      success: false,
      error: error.message,
      hint: "Check server console and debug_response.html file for more details",
    });
  }
}

export const searchReports = async (req,res) =>{
  try {

    const term = req.query.q;
    const reports = await reportsModel.searchReports(term)
    console.log("DELETED",reports)

     res.json({
      success: true,
      data:reports,
      message: "Report DELETED",
    });


  } catch (error) {
     res.status(500).json({
      success: false,
      error: error.message,
      hint: "Check server console and debug_response.html file for more details",
    });
  }
}