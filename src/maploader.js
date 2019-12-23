let loadGoogleMapsApi = require('load-google-maps-api-2');

export default class MapLoader {


    async getMap() {
        return new Promise((resolve,reject) => {

                loadGoogleMapsApi.key = 'AIzaSyB6SSvjmmzWA9zOVHhh4IsBbp3qqY25qas';
                loadGoogleMapsApi().then(function (googleMaps) {

                    let mapOptions = {
                        zoom: 13,
                        center: new google.maps.LatLng(52.37063538130748, 4.899999460629829),
                        mapTypeId: google.maps.MapTypeId.TERRAIN
                    };

                    let map =new googleMaps.Map(document.getElementById('map'), mapOptions);

                    resolve(map);
                }).catch(function (err) {
                    reject(err);
                });
        })
    }
}
