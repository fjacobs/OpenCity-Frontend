import RSocketGeojsonClient from "./rsocket";
import { google } from '@google/maps';
import{ Data } from '@google/maps';

export default class TravelTimeService {

    rsocketClient: RSocketGeojsonClient;
    map: google.maps;
    googleMapsApi: any;
    features: any;

    constructor( map: google.maps, rSocketClient: RSocketGeojsonClient ) {
        this.map = map;
        this.rsocketClient = rSocketClient;
        map.data.addListener('addfeature', this.addFeatureEvent);
    }

    receiveFeature = (payload) => {
       this.map.data.addGeoJson(payload.data);
    }

    paintFeature = (feature: Data.Feature) => {
        let color = this.speedToColor(feature.getProperty("Type"), feature.getProperty("Velocity"));
        let weight;

        if(feature.getProperty('Velocity') > 0){
            weight = 3;
        } else {
            weight = 1;
        }

        this.map.data.overrideStyle(feature,
            {
                fillColor:"#00B22D",
                strokeColor: color,
                strokeOpacity: 1.0,
                strokeWeight: weight,
                originalWeight: weight,
                title: feature.getProperty('Name')
            });
    }

    addFeatureEvent = (event: google.maps.event) => {
        this.paintFeature( event.feature);
    }

    onComplete() {
        console.log("oncomplete in service");
    }

    errorCallback(error) {
    }

    async subscribe(route) {
      this.rsocketClient.requestStream(route, this.receiveFeature.bind(this), this.onComplete.bind(this), this.errorCallback.bind(this));
    }

    speedToColor(type, speed){
        let speedColors;
        if(type === "H"){
            //Snelweg
            speedColors = {0: "#D0D0D0", 1: "#BE0000", 30: "#FF0000", 50: "#FF9E00", 70: "#FFFF00", 90: "#AAFF00",120: "#00B22D"};
        } else {
            //Overige wegen
             speedColors = {0: "#D0D0D0", 1: "#BE0000", 10: "#FF0000", 20: "#FF9E00", 30: "#FFFF00", 40: "#AAFF00", 70: "#00B22D"};
        }
        var currentColor = "#D0D0D0";
        for(var i in speedColors){
            if(speed >= i) currentColor = speedColors[i];
        }
        return currentColor;
    }

}

