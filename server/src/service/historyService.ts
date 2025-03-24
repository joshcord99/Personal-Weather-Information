import fs from "node:fs/promises";
import { v4 as uuidv4 } from "uuid";

// Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

// Complete the HistoryService class
class HistoryService {
  private async read() {
    const dbPath = new URL("../../db/db.json", import.meta.url);
    return await fs.readFile(dbPath, {
      flag: "a+",
      encoding: "utf8",
    });
  }

  // Define a write method that writes the updated cities array to the db.json file
  private async write(cities: City[]) {
    const dbPath = new URL("../../db/db.json", import.meta.url);
    return await fs.writeFile(dbPath, JSON.stringify(cities, null, "\t"));
  }

  // Define a getHistory method to fetch cities from db.json file as an array of City objects
  async getHistory(): Promise<City[]> {
    return await this.read().then((cities) => {
      let parsedCities: City[];

      try {
        parsedCities = [].concat(JSON.parse(cities));
      } catch (err) {
        parsedCities = [];
      }

      return parsedCities;
    });
  }

  // Define an addCityToHistory method to add a city to db.json file
  async addCityToHistory(city: string): Promise<City> {
    if (!city) {
      throw new Error("city cannot be blank");
    }

    const newCity = new City(city, uuidv4());

    return await this.getHistory()
      .then((cities) => {
        if (cities.find((existingCity) => existingCity.name === city)) {
          return cities; // Return the list if the city already exists
        }
        return [...cities, newCity];
      })
      .then((updatedCities) => this.write(updatedCities))
      .then(() => newCity);
  }

  // Define a removeCityFromHistory method that removes a city by ID from db.json file
  async removeCityFromHistory(id: string) {
    return await this.getHistory()
      .then((cities) => cities.filter((city) => city.id !== id))
      .then((filteredCities) => this.write(filteredCities));
  }
}

export default new HistoryService();
