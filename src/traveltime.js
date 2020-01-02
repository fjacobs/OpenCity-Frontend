import RSocketGeojsonClient from "./rsocket";


export default class TravelTimeService {

    rsocketClient: RSocketGeojsonClient;
    map: any;
    googleMapsApi: any;
    features: any;

    constructor( map: any, googleMapsApi:any, rSocketClient: RSocketGeojsonClient ) {
        this.map = map;
        this.googleMapsApi = googleMapsApi;
        this.rsocketClient = rSocketClient;
    }

    async initMap(route) {
        let rsocketPacket;
        rsocketPacket = await this.rsocketClient.requestResponse(route);
        let result = rsocketPacket.data;
       // this.map.data.addGeoJson(result);
        this.features = result.features;
        console.log(this.features.length);

        function speedToColor(type, speed){
            if(type === "H"){
                //Snelweg
                var speedColors = {0: "#D0D0D0", 1: "#BE0000", 30: "#FF0000", 50: "#FF9E00", 70: "#FFFF00", 90: "#AAFF00",120: "#00B22D"};
            } else {
                //Overige wegen
                var speedColors = {0: "#D0D0D0", 1: "#BE0000", 10: "#FF0000", 20: "#FF9E00", 30: "#FFFF00", 40: "#AAFF00", 70: "#00B22D"};
            }
            var currentColor = "#D0D0D0";
            for(var i in speedColors){
                if(speed >= i) currentColor = speedColors[i];
            }
            return currentColor;
        }

        function showFeature(i, line, features) {
            var i = line.localID;
            line.setOptions({strokeWeight: 6});
            var html = "<H1>"+ features[i].properties.Name + "</H1><dl>";
            html += "<dt>ID</dt> <dd>"+ features[i].properties.Id +"</dd>";
            html += "<dt>Lengte</dt> <dd>"+ features[i].properties.Length +" meter</dd>";
            html += "<dt>Snelheid</dt> <dd>"+ features[i].properties.Velocity +" km/u</dd>";
            html += "<dt>Huidige reistijd</dt> <dd>"+ Math.floor(features[i].properties.Traveltime / 60) +":"+ ("0"+features[i].properties.Traveltime % 60).slice(-2) +"</dd></dl>";
            html += "<dt>Timestamp</dt> <dd>"+ features[i].properties.Timestamp +"</dd>";
            $("#info").html(html);

            for(let j in features){
                if(j !== i){
                    features[j].line.setOptions({strokeWeight: features[j].line.originalWeight});
                }
            }
        }

        for(let i in this.features){
              var f = this.features[i];
              var color = speedToColor(f.properties.Type, f.properties.Velocity);
              var points = f.geometry.coordinates;
              var path = [];

              for(var j in points){
                  if(!isNaN(points[j][1])){
                      path.push(new this.googleMapsApi.LatLng(points[j][1], points[j][0]));
                  }
              }

              if(f.properties.Velocity > 0){ var weight = 3; } else { var weight = 1;}
              f.line = new this.googleMapsApi.Polyline({map: this.map, path: path, strokeColor: color, strokeOpacity: 1.0,strokeWeight: weight, title: f.properties.Name, localID: i, originalWeight: weight});
              this.map.addListener(f.line, 'click', function(){ showFeature(this) });
        }
    }

}

