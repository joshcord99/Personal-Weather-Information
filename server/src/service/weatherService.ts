import dotenv from "dotenv";
import fetch from "node-fetch"; // Importing fetch for Node.js environment

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
  cityName: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || "https://api.openweathermap.org";
    this.apiKey = process.env.API_KEY || "";
    this.cityName = "";
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
      throw new Error("Invalid location data");
    }
  }

  // Builds the geocode query for fetching location data
  private buildGeocodeQuery(cityName: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${cityName}&limit=1&appid=${this.apiKey}`;
  }

  // Builds the query for fetching weather data based on coordinates
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }

  // Fetches weather data from the OpenWeather API
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    console.log(this.buildWeatherQuery(coordinates));
    const response = await fetch(this.buildWeatherQuery(coordinates));


    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }
    return await response.json();
  }

  // Parses the current weather data into a Weather object
  private parseCurrentWeather(data: any): Weather[] {
    const allWeatherData: Weather[] = data.map((weatherData: any) => {
      return new Weather(
        weatherData.name,
        weatherData.dt_txt,
        weatherData.weather[0]?.icon,
        weatherData.weather[0]?.description,
        weatherData.main?.temp?.toString(),
        weatherData.wind?.speed?.toString(),
        weatherData.main?.humidity?.toString()
      );
    });

    const filteredWeatherData = allWeatherData.filter((weatherData) => {
      return weatherData.date.includes("12:00:00");
    });

    filteredWeatherData.unshift(
      new Weather(
        this.cityName,
        new Date().toString(),
        data[0].weather[0]?.icon,
        data[0].weather[0]?.description,
        data[0].main?.temp?.toString(),
        data[0].wind?.speed?.toString(),
        data[0].main?.humidity?.toString()
      )
    );

    return filteredWeatherData;
  }

  // Gets weather data for a specific city
  async getWeatherForCity(city: string): Promise<Weather[]> {
    this.cityName = city;
    const coordinates = await this.fetchLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    return this.parseCurrentWeather(weatherData.list);
  }
}

export default new WeatherService();
