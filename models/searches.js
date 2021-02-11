const fs = require('fs');
const axios = require('axios').default;

class Searches {

    filePath = './db/db.json'
    history = ['Madrid'];

    constructor() {
        // read DB if exist
        this.readFile(); 
    }

    get capitalizeHistory() {

        return this.history.map( place => {
            let words = place.split(' ');
            words = words.map( word => word[0]. toUpperCase() + word.substring(1) );

            return words.join(' ');
        });
    }

    get paramsMapbox() {
        return {
            'access_token' : process.env.MAPBOX_KEY,
            'limit' : 5,
        };
    }

    get paramsWeather() {
        return {
            'appid' : process.env.OPENWEATHER_KEY,
            'units' : 'metric',
        };
    }

    async cities( place = '' ) {
        try {
            
            // http request
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ place }.json`,
                params: this.paramsMapbox
            });

            const resApi =  await instance.get();

            // return matching places 
            return resApi.data.features.map( place => (
                {
                    id: place.id,
                    name: place.place_name,
                    lng: place.center[0],
                    lat: place.center[1],
                }
            )); 
 
        } catch (error) {

            console.log(error);
            return [];
        }
    }

    async  weatherLocation ( lat, lon ) {

        try {

            // http request
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeather, lat, lon }  
            });
            // extract data
            const resApi =  await instance.get();
            const { weather, main } = resApi.data;

            console.log(weather);
            
            return {
                main: weather[0].main,
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
                hum: main.humidity
            };

        } catch (error) {

            console.log(error);
        }

    }

    addToHistory( place = '') {

        // prevent duplicates
        if ( this.history.includes( place.toLocaleLowerCase() )) {
            return;
        }
        // Only the last 6 searches are registered
        this.history = this.history.splice(0,5);

        this.history.unshift( place );

        // save in DB
        this.saveFile();

    }

    saveFile() {

        const payload = {
            history: this.history
        };

        fs.writeFileSync( this.filePath, JSON.stringify( payload ) );
    }

    readFile() {

        if( !fs.existsSync( this.filePath )){
            return;
        }
        
        const raw = fs.readFileSync( this.filePath, { encoding: 'utf-8'} );
        const data = JSON.parse( raw );

        this.history = data.history;

    }

}

module.exports = Searches;