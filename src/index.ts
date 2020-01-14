import MapLoader from './MapLoader.js';
import RSocketGeojsonClient from "./RsocketGeojsonClient";
import TravelTimeService from "./TravelTime";



const STREAM_ROUTE = "TRAVELTIME_STREAM";

const url = 'ws://localhost:9897/rsocket';
let key =  'AIzaSyB6SSvjmmzWA9zOVHhh4IsBbp3qqY25qas';

async function main() {

    let map;
    let googleMapsApi;

    try {
         googleMapsApi = await MapLoader.getGoogleMapsApi(key);
         map = await MapLoader.createMap(googleMapsApi);
    } catch (error) {
        console.error("Error loading map. " + error);
    }

    try {
        let travelTimeService = new TravelTimeService(map, googleMapsApi, new RSocketGeojsonClient(url));
        await travelTimeService.subscribe(STREAM_ROUTE);
    } catch (error) {
        console.error("Error in traveltime service: " + error);
    }
}

let gridData = [];

// @ts-ignore
window.gridData = gridData;

export function setErrorNotification(error){

    // @ts-ignore
    window.gridData.push({
        Id: error.Id,
        Name: error.Name,
        Description: error.Description,
        Date: new Date().toLocaleString(),
        Category: error.Category,
    });

    // @ts-ignore
    console.log(window.gridData);
}
// @ts-ignore
window.setgriddata = setErrorNotification;

export function getGridData() {
    // @ts-ignore
    console.log(window.gridData);
    // @ts-ignore
    return window.gridData;
}
// @ts-ignore
window.getGridData = getGridData;
// @ts-ignore
main().then(console.log("main done"));
