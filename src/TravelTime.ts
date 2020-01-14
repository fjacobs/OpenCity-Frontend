import RSocketGeojsonClient from "./RsocketGeojsonClient";
import {google} from '@google/maps';
import {LatLng} from '@google/maps';
import {Feature} from '@google/maps';
import {event} from '@google/maps';
import {setErrorNotification} from "./index";


export default class TravelTimeService {

    private rsocketClient: RSocketGeojsonClient;
    private readonly map: google.maps;
    private googleMapsApi: any;

    constructor(map: google.maps.Map, api:google.maps, rSocketClient: RSocketGeojsonClient) {
        this.map = map;
        this.googleMapsApi = api;
        this.rsocketClient = rSocketClient;
        map.data.addListener('addfeature', this.addFeatureEvent);
        map.data.addListener('click', (event) => {
            this.createRoadPopup(event.feature, event.latLng);
        });
    }

    receiveFeature = (payload) => {
        this.map.data.addGeoJson(payload.data);
    }

    paintFeature = (feature: Feature) => {
        let color = this.speedToColor(feature.getProperty("Type"), feature.getProperty("Velocity"));
        let weight;

        if (feature.getProperty('Velocity') > 0) {
            weight = 3;
        } else {
            weight = 1;
        }

        this.map.data.overrideStyle(feature,
            {
                fillColor: "#00B22D",
                strokeColor: color,
                strokeOpacity: 1.0,
                strokeWeight: weight,
                originalWeight: weight,
                title: feature.getProperty('Name')
            });
    }

    createRoadPopup = (feature: Feature, clickPos: LatLng) => {

        let infoWindow = new this.googleMapsApi.InfoWindow();

        let html = "<div> <b> Weginformatie </b> </div>";
        html +=    "<div>Naam:" + feature.getProperty("Name") + "</div>";
        html += "<div>ID : " + feature.getProperty("Id") + "</div>";
        html += "<div>Lengte:  " + feature.getProperty("Length") + " meter</div>";
        html += "<div>Snelheid: " + feature.getProperty("Velocity") + " km/u</div>";
        html += "<div>Huidige reistijd: " + Math.floor(feature.getProperty("Traveltime") / 60) + ":" + ("0" + feature.getProperty("Traveltime") % 60).slice(-2) + "</div>";
        html += "<div>Timestamp: " + feature.getProperty("Timestamp") + "</div>";

        infoWindow.setContent(html);
        infoWindow.setPosition(clickPos);
        infoWindow.setOptions({pixelOffset: new this.googleMapsApi.Size(0,-34)});
        infoWindow.open(this.map);
    }

    addFeatureEvent = (event: event) => {
        this.paintFeature(event.feature);
    }

    onComplete() {
        console.log("oncomplete in service");
    }



    async subscribe(route) {
        this.rsocketClient.requestStream(route, this.receiveFeature.bind(this), this.onComplete.bind(this));
    }

    speedToColor(type, speed) {
        let speedColors;
        if (type === "H") {
            //Highway
            speedColors = {0: "#D0D0D0", 1: "#BE0000", 30: "#FF0000", 50: "#FF9E00", 70: "#FFFF00", 90: "#AAFF00",120: "#00B22D"};
        } else {
            //Other roads
             speedColors = {0: "#D0D0D0", 1: "#BE0000", 10: "#FF0000", 20: "#FF9E00", 30: "#FFFF00", 40: "#AAFF00", 70: "#00B22D"};
        }
        var currentColor = "#D0D0D0";
        for (var i in speedColors) {
            if (speed >= i) currentColor = speedColors[i];
        }
        return currentColor;
    }

}

