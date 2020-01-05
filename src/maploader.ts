// @ts-ignore
let loadGoogleMapsApi = require('load-google-maps-api-2');
import { google } from '@google/maps';

export default class MapLoader {


    static async getGoogleMapsApi(key: String) {

        // @ts-ignore
        return new Promise((resolve, reject) => {
            loadGoogleMapsApi.key = key;
            loadGoogleMapsApi.version = 'weekly';
            loadGoogleMapsApi().then(function (googleMaps) {

                    resolve(googleMaps);
                }).catch(function (err) {
                    reject(err);
                });
        })
    }

    static async createMap(googleMaps: google.maps) {
        console.log('Google Maps API version: ' + googleMaps.version);

        // @ts-ignore
        let mapOptions = {
            zoom: 13,
            center: new googleMaps.LatLng(52.37063538130748, 4.899999460629829),
            mapTypeId: googleMaps.MapTypeId.TERRAIN
        };

        // @ts-ignore
        return new Promise((resolve) => {
            let map = new googleMaps.Map(document.getElementById('map'), mapOptions);
            resolve(map);
        });
    }

}
