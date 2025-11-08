import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import cors from "cors";
import https from "https";
import fs from "fs";

const app = express();
const BASE_URL = "https://earthquake.phivolcs.dost.gov.ph/";

app.use(cors());
app.use(express.json());

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  timeout: 30000, // 30 second timeout
});

// Cache for earthquake data
let cachedData = null;
let lastFetchTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes


// Function to fetch and alayze phivolcs data
async function fetchEarthquakeData() {
  try {
    const response = await axiosInstance.get(BASE_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        Connection: "keep-alive",
      },
    });

    // Save HTML for debugging
    fs.writeFileSync("debug_response.html", response.data);

    const $ = cheerio.load(response.data);
    const earthquakes = [];

    // Find all tables
    const allTables = $("table.MsoNormalTable");

    
    // Find the table with earthquake data (has Date-Time header)
    let dataTable = null;
    allTables.each((i, table) => {
      const text = $(table).text();
      if (text.includes("Date - Time") || text.includes("Philippine Time")) {
        dataTable = $(table);
        return false; // break
      }
    });

    if (!dataTable) {
      throw new Error("Could not find earthquake data table");
    }

    // Get all rows from the data table
    const rows = dataTable.find("tr");

    // Process each row
    let dataCount = 0;
    rows.each((index, row) => {
      const cells = $(row).find("td");

      if (cells.length < 6) {
        return;
      }

      // Extract data from cells
      const dateTimeCell = $(cells[0]);
      const latitudeCell = $(cells[1]);
      const longitudeCell = $(cells[2]);
      const depthCell = $(cells[3]);
      const magnitudeCell = $(cells[4]);
      const locationCell = $(cells[5]);

      // Get the date/time text
      let dateTime = dateTimeCell.find("a").text().trim();
      const href = dateTimeCell.find("a").attr("href");
      let detailLink = null;
      if (href) {
        const normalizedPath = href.replace(/\\/g, "/").trim();
        try {
          detailLink = new URL(normalizedPath, BASE_URL).href;
        } catch (e) {
          detailLink = normalizedPath;
        }
      }
      if (!dateTime) {
        dateTime = dateTimeCell.text().trim();
      }

      // Get other values
      const latitude = latitudeCell.text().trim();
      const longitude = longitudeCell.text().trim();
      const depth = depthCell.text().trim();
      const magnitude = magnitudeCell.text().trim();
      const location = locationCell.text().trim();

      // Validate and add to results
      if (
        dateTime &&
        magnitude &&
        dateTime.length > 10 &&
        !dateTime.toLowerCase().includes("date") &&
        !isNaN(parseFloat(magnitude))
      ) {
        earthquakes.push({
          dateTime,
          detailLink,
          latitude,
          longitude,
          depth,
          magnitude,
          location,
        });
        dataCount++;
      }
    });

    console.log(`Successfully alalyse ${earthquakes.length} earthquakes`);

    if (earthquakes.length === 0) {
      throw new Error("No earthquake data found.");
    }

    return earthquakes;
  } catch (error) {
    console.error("Error fetching earthquake data:", error.message);
    throw error;
  }
}

export const eqRefresh = async (req, res) => {
  try {
    console.log("Force refresh requested");
    const earthquakes = await fetchEarthquakeData();

    // Update cache
    cachedData = earthquakes;
    lastFetchTime = Date.now();

    res.json({
      success: true,
      data: earthquakes,
      lastUpdated: new Date(lastFetchTime).toISOString(),
      count: earthquakes.length,
      message: "Cache refreshed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      hint: "Check console for more details",
    });
  }
};

export const eqEarthquake = async (req, res) => {
  try {
    const now = Date.now();
    if (cachedData && lastFetchTime && now - lastFetchTime < CACHE_DURATION) {
      return res.json({
        success: true,
        data: cachedData,
        cached: true,
        lastUpdated: new Date(lastFetchTime).toISOString(),
        count: cachedData.length,
      });
    }

    // Fetch fresh data
    const earthquakes = await fetchEarthquakeData();

    // Update cache
    cachedData = earthquakes;
    lastFetchTime = now;

    res.json({
      success: true,
      data: earthquakes,
      cached: false,
      lastUpdated: new Date(lastFetchTime).toISOString(),
      count: earthquakes.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      details: "Failed to fetch earthquake data",
      hint: "Check console file for more details",
    });
  }
};
