import { Router } from "express";
const router = Router();

import HistoryService from "../../service/historyService.js";
import WeatherService from "../../service/weatherService.js";

// POST Request with city name to retrieve weather data
router.post("/", async (req, res) => {
  const { cityName } = req.body;

  if (!cityName) {
    return res.status(400).json({ message: "City name is required" });
  }

  try {
    // Corrected method name for WeatherService
    const allWeatherData = await WeatherService.getWeatherForCity(cityName);
    await HistoryService.addCityToHistory(cityName); // Save the city to search history
    return res.json(allWeatherData); // Ensured response is returned in all cases
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ message: "Error retrieving weather data", error });
  }
});

// GET request to retrieve weather data from search history
router.get("/history", async (_, res) => {
  // Removed unused req parameter
  try {
    const history = await HistoryService.getHistory();
    return res.json(history);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving search history", error });
  }
});

// DELETE request to remove a city from search history by ID
router.delete("/history/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await HistoryService.removeCityFromHistory(id);
    return res.json({ message: "City deleted from history successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting city from history", error });
  }
});

export default router;
