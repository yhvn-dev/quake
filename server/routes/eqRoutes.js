import express from "express";
import * as eqController from "../controller/eqController.js"

const router = express.Router()


router.get("/earthquakes/refresh",eqController.eqRefresh)
router.get("/earthquakes",eqController.eqEarthquake)



export default router