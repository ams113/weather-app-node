require('dotenv').config();
require('colors');

const { 
    inquirerMenu,
    pause,
    readInput,
    placesList,
} = require('./helpers/inquirer');
const Searches = require('./models/searches');

const searches = new Searches();


const main = async() => {
    
    let selected;

    
    do {
        selected = await inquirerMenu();

        switch ( selected ) {
            case 1:
                    // Show message
                    const searchPlace = await readInput('City: ');
                    // search places
                    const places = await searches.cities( searchPlace );
                    // select place 
                    const selectedId = await placesList( places );
                    if ( selectedId === '0' ) continue;
                    const { name, lat, lng } = places.find( place => place.id === selectedId );
                    // save place
                    searches.addToHistory( name );
                    // weather data
                    const weather = await searches.weatherLocation( lat, lng );
                    const { main, desc, temp, min, max, hum} = weather;
                    // show results
                    console.clear();
                    console.log('\n <-- CITY INFORMATION -->\n'.green);
                    console.log(` - City: ${name}` );
                    console.log(` - Lat: ${lat}` );
                    console.log(` - Lng: ${lng}`);
                    console.log(` - Weather: ${ main } / ${ desc }`);
                    console.log(` - Temp: ${temp}` );
                    console.log(` - Min: ${min}` );
                    console.log(` - Max: ${max}` );
                    console.log(` - Humidity: ${hum}`);
                break;
            case 2:
                searches.capitalizeHistory.forEach( (place, index ) => {
                    const idx = `${ index + 1 }.`.green;
                    console.log( `${ idx } ${ place }`);
                } );
                break;
            case 0:
                
                break;
    
        }


        if ( selected !== 0 ) await pause();
        else console.log('\n <-- GoodBye! --> \n');

    } while ( selected !== 0 );



};

main();