import MapLoader from './maploader.js';
import RSocketFeatureClient from "./rsocket.js";

// TODO:
//  1. Receive FeatureCollection via Request/Response (not implemented)
//  2. Receive Features that are changed compared to last via Request/Stream (test)

const url =  'ws://localhost:8888/traveltime-message';
const messageRoute = 'traveltime-message';

function main() {
    let map = MapLoader.getMap();
    let featureClient = new RSocketFeatureClient(url, messageRoute,streamMsgCallback);
    featureClient.requestStream(url, messageRoute, streamMsgCallback());
}

function streamMsgCallback(message: Object) {
    console.log(message);
}

main();
