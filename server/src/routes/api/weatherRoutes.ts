import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req, res) => { 

  const {city } req.body;

  if (!city) {
    return res.status(400).json {message: "city name is required'});
   }
try {
  const weatherData = await WeatherService.get WeatherByCity(city)

}
  // TODO: GET weather data from city name
router.get('history', async (req,res) =>{
try {
  const history = await HistoryService.getSearchHistory();
  res.status
}

}





  // TODO: save city to search history
UPDATE (/HistoryService/cityName) {


} 


});

// TODO: GET search history
router.get('/history', async (req, res) => {});


// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {});

export default router;
