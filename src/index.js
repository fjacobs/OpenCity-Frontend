import MapLoader from './maploader.js';
import RSocketGeojsonClient from "./rsocket";

// TODO:
//  1. Receive Features which are changed compared to last via Request/Stream (test)
//  2. Replace JSON with CBOR

const travelTimeInit = 'traveltime-collection';
const msgRouteStream = 'traveltime-message';

const REQUEST_RESPONSE_JSON = 'REQUEST_RESPONSE_JSON';
const REQUEST_RESPONSE_STRING = "REQUEST_RESPONSE_STRING";

const url = 'ws://localhost:9898/rsocket';

let mapLoader = new MapLoader();
let map;
let featureClient;

async function main() {

    try {
        map = await mapLoader.getMap();
        featureClient = new RSocketGeojsonClient(url);
        let x =  await featureClient.requestResponse(REQUEST_RESPONSE_JSON);
        console.log(JSON.stringify(x.data));
        map.data.addGeoJson(x.data);
        //Subscribe for changes:
        //featureClient.requestStream(msgRouteStream, receiveFeature, receiveError);

    } catch (err) {
        console.log(err);
    }
}

function rejected(result) {
    console.log("Received error: " + result);
    console.log(result.source);
}

function streamCallBack(feature: Object) {
    console.log(feature);
    map.data.add(feature);
}

main().then(console.log("main done"));
