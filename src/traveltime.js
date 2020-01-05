import RSocketGeojsonClient from "./rsocket";


export default class TravelTimeService {

    rsocketClient: RSocketGeojsonClient;
    map: google.maps;
    data: google.maps.Data;
    googleMapsApi: any;
    features: any;

    constructor( map: google.maps, googleMapsApi:any, rSocketClient: RSocketGeojsonClient ) {
        this.map = map;
        this.data = map.Data;
        this.googleMapsApi = googleMapsApi;
        this.rsocketClient = rSocketClient;
    }

    receiveFeature = (payload) => {
        // this.map.data.addFeature(payload.data);
        let feature = this.data.addGeoJson(payload.data);

    }

    featureEvent = () => {

        console.log(payload.data);
    }


    onComplete() {
        console.log("oncomplete in service");
    }

    errorCallback(error) {
    }

    async subscribe(route) {
      this.rsocketClient.requestStream(route, this.receiveFeature.bind(this), this.onComplete.bind(this), this.errorCallback.bind(this));
    }

    async initMap(route) {
        let rsocketPacket = await this.rsocketClient.requestResponse(route);
        let features = this.map.data.addGeoJson(rsocketPacket.data);
        this.features = result.features;

        console.log(this.features.length);

        this.map.data.setStyle(feature => {
            let id = feature.Id;
            console.log(feature.h.Id);

            return {
                fillColor:"#00B22D",
                strokeColor: "#FF9E00"
            };
        });



        // function speedToColor(type, speed){
        //     if(type === "H"){
        //         //Snelweg
        //         var speedColors = {0: "#D0D0D0", 1: "#BE0000", 30: "#FF0000", 50: "#FF9E00", 70: "#FFFF00", 90: "#AAFF00",120: "#00B22D"};
        //     } else {
        //         //Overige wegen
        //         var speedColors = {0: "#D0D0D0", 1: "#BE0000", 10: "#FF0000", 20: "#FF9E00", 30: "#FFFF00", 40: "#AAFF00", 70: "#00B22D"};
        //     }
        //     var currentColor = "#D0D0D0";
        //     for(var i in speedColors){
        //         if(speed >= i) currentColor = speedColors[i];
        //     }
        //     return currentColor;
        // }


        // for(let i in this.features){
        //       var f = this.features[i];
        //       var color = speedToColor(f.properties.Type, f.properties.Velocity);
        //       var points = f.geometry.coordinates;
        //       var path = [];
        //
        //       for(var j in points){
        //           if(!isNaN(points[j][1])){
        //               path.push(new this.googleMapsApi.LatLng(points[j][1], points[j][0]));
        //           }
        //       }
        //
        //       let weight;
        //       if(f.properties.Velocity > 0){
        //           weight = 3;
        //       } else {
        //           weight = 1;
        //       }
        //
        //        f.line = new this.googleMapsApi.Polyline({map: this.map, path: path, strokeColor: color, strokeOpacity: 1.0,strokeWeight: weight, title: f.properties.Name, localID: i, originalWeight: weight});
        //
        //
        //       // this.map.addListener(f.line, 'click', function(){ showFeature(this) });
        // }
    }

}

