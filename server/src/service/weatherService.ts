import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface coordinates (){

}
// TODO: Define a class for the Weather object
class Weather {
  name: string
}
// TODO: Complete the WeatherService class
class WeatherService {
  name : String
  // TODO: Define the baseURL, API key, and city name properties
  baseURL:
  apiKey:
  cityName:

  // TODO: Create fetchLocationData method
  let fetchLocationData(){

  }
  // private async fetchLocationData(query: string) {}
  // TODO: Create destructureLocationData method
  let destructureLocationData(){

  }
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  // TODO: Create buildGeocodeQuery method
  let buildGeocodeQuery(){

  }
  // private buildGeocodeQuery(): string {}
  // TODO: Create buildWeatherQuery method
  let buildWeatherQuery (){

  }
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  // TODO: Create fetchAndDestructureLocationData method
  let fetchAndDestructureLocationData (){

  }
  // private async fetchAndDestructureLocationData() {}
  // TODO: Create fetchWeatherData method
  create fetchWeatherData(){

  }
  // private async fetchWeatherData(coordinates: Coordinates) {}
  // TODO: Build parseCurrentWeather method
  let parseCurrentWeather(){

  }
  // private parseCurrentWeather(response: any) {}
  // TODO: Complete buildForecastArray method
  let buildForecastArray(){
    
  }
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  let getWeatherForCity(){

  }
  // async getWeatherForCity(city: string) {}
}

export default new WeatherService();
