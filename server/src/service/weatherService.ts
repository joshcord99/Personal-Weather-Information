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
  cityName: string;

  constructor() {
    this.cityName = "";
  }

  private getApiKey(): string {
    return process.env.API_KEY || "";
  }

  private getBaseURL(): string {
    return process.env.API_BASE_URL || "https://api.openweathermap.org";
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
    return `${this.getBaseURL()}/geo/1.0/direct?q=${cityName}&limit=1&appid=${this.getApiKey()}`;
  }

  // Builds the query for fetching weather data based on coordinates
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.getBaseURL()}/data/2.5/forecast?lat=${coordinates.lat}&lon=${
      coordinates.lon
    }&appid=${this.getApiKey()}&units=imperial`;
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
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid weather data received from API");
    }

    const allWeatherData: Weather[] = data.map((weatherData: any) => {
      return new Weather(
        this.cityName,
        weatherData.dt_txt || new Date().toISOString(),
        weatherData.weather?.[0]?.icon || "",
        weatherData.weather?.[0]?.description || "",
        weatherData.main?.temp?.toString() || "0",
        weatherData.wind?.speed?.toString() || "0",
        weatherData.main?.humidity?.toString() || "0"
      );
    });

    const filteredWeatherData = allWeatherData.filter((weatherData) => {
      return weatherData.date.includes("12:00:00");
    });

    if (data[0]) {
      filteredWeatherData.unshift(
        new Weather(
          this.cityName,
          new Date().toString(),
          data[0].weather?.[0]?.icon || "",
          data[0].weather?.[0]?.description || "",
          data[0].main?.temp?.toString() || "0",
          data[0].wind?.speed?.toString() || "0",
          data[0].main?.humidity?.toString() || "0"
        )
      );
    }

    return filteredWeatherData;
  }

  // Gets weather data for a specific city
  async getWeatherForCity(city: string): Promise<Weather[]> {
    try {
      this.cityName = city;
      console.log("Fetching weather for city:", city);
      const coordinates = await this.fetchLocationData(city);
      console.log("Coordinates:", coordinates);
      const weatherData = await this.fetchWeatherData(coordinates);
      console.log(
        "Weather data received, list length:",
        weatherData.list?.length
      );
      return this.parseCurrentWeather(weatherData.list);
    } catch (error) {
      console.error("Error in getWeatherForCity:", error);
      throw error;
    }
  }
}

export default new WeatherService();
