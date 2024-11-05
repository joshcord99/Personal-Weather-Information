import dotenv from 'dotenv';
import fetch from 'node-fetch'; // Importing fetch for Node.js environment

dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}


class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: string;
  windSpeed: string;
  humidity: string;

  constructor(
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: string,
    windSpeed: string,
    humidity: string
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// Complete the WeatherService class
class WeatherService {
  baseURL: string;
  apiKey: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || 'https://api.openweathermap.org';
    this.apiKey = process.env.API_KEY || '';
  }

  // Fetches location data and destructures coordinates
  private async fetchLocationData(cityName: string): Promise<Coordinates> {
    const response = await fetch(this.buildGeocodeQuery(cityName));
    
    if (!response.ok) {
      throw new Error(`Failed to fetch location data: ${response.statusText}`);
    }

    const data = await response.json();
    return this.destructureLocationData(data);
  }

  // Destructures latitude and longitude from location data
  private destructureLocationData(locationData: any): Coordinates {
    const lat = locationData[0]?.lat;
    const lon = locationData[0]?.lon;

    if (lat && lon) {
      return { lat, lon };
    } else {
      throw new Error('Invalid location data');
    }
  }

  // Builds the geocode query for fetching location data
  private buildGeocodeQuery(cityName: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${cityName}&limit=1&appid=${this.apiKey}`;
  }

  // Builds the query for fetching weather data based on coordinates
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }

  // Fetches weather data from the OpenWeather API
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }

    return await response.json();
  }

  // Parses the current weather data into a Weather object
  private parseCurrentWeather(data: any): Weather {
    return new Weather(
      data.name,
      new Date().toISOString(),
      data.weather[0]?.icon,
      data.weather[0]?.description,
      data.main?.temp?.toString(),
      data.wind?.speed?.toString(),
      data.main?.humidity?.toString()
    );
  }

  // Gets weather data for a specific city
  async getWeatherForCity(city: string): Promise<Weather> {
    const coordinates = await this.fetchLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    return this.parseCurrentWeather(weatherData);
  }
}

export default new WeatherService();
