import express from "express"
import * as reportsController from "../controller/reportsController.js"

const router = express.Router()

router.get("/get/reports",reportsController.selectReports)
router.post("/post/reports",reportsController.insertReports)
router.put("/put/reports/:report_id",reportsController.updateReports)
router.delete("/delete/reports/:report_id",reportsController.deleteReports)

export default router