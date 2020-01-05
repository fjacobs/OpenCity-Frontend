import MapLoader from './maploader.js';
import RSocketGeojsonClient from "./rsocket";
import TravelTimeService from "./traveltime";

// TODO:
//  1. Receive Features which are changed compared to last via Request/Stream (test)
//  2. Replace JSON with CBOR


const INIT_ROUTE = 'REQUEST_RESPONSE_JSON';
const STREAM_ROUTE = "REQUEST_STREAM_JSON";

const url = 'ws://localhost:9897/rsocket';
let key =  'AIzaSyB6SSvjmmzWA9zOVHhh4IsBbp3qqY25qas';

async function main() {

    let map;
    let googleMapsApi;

    try {
         googleMapsApi = await MapLoader.getGoogleMapsApi(key);
         map = await MapLoader.createMap(googleMapsApi);
    } catch (err) {
        console.log("Error loading map. " + err);
        // console.log(err.source);
    }

    try {
        let travelTimeService = new TravelTimeService(map, googleMapsApi, new RSocketGeojsonClient(url));
    //    await travelTimeService.initMap(INIT_ROUTE);
        await travelTimeService.subscribe(STREAM_ROUTE);
    } catch (err) {
        console.log("Error in traveltime service: " + err);
        // console.log(err.source);
    }
}


main().then(console.log("main done"));
