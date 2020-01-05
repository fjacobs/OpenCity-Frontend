import MapLoader from './maploader.js';
import RSocketGeojsonClient from "./rsocket";
import TravelTimeService from "./traveltime";

// TODO:
//  1. Receive Features which are changed compared to last via Request/Stream (test)
//  2. Replace JSON with CBOR

const STREAM_ROUTE = "REQUEST_STREAM_JSON";

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


// @ts-ignore
main().then(console.log("main done"));
