// TODO: Define a City class with name and id properties
class city {
  name: String;
  id: integer;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
} 


// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read () {
    return await fs.readFile('db/db.json', {
      flag: 'a+',
      encoding: 'utf8',
    });
  }
  // private async read() {}
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
    // private async write(cities: City[]) {}
    private async write(cities: City[]) {
      return await fs.writeFile('db/db.json', JSON.stringify(cities, null, '\t'));
    }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
// async getCities() {}
  async getCities.search.json(){
  
  returns [Object]
}
  
  // TODO Define an addCity method that adds a city to the searchHistory.json file
    // async addCity(city: string) {}
    async addCity(cities: string) {
      if (!city) {
        throw new Error('state cannot be blank');
      }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
  async removeCity(id: string) {
    return await this.getCities()
      .then((cities) => states.filter((city) => city.id !== id))
      .then((filteredCity) => this.write(filteredCity));
  }
}

export default new HistoryService();
