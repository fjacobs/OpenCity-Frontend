let loadGoogleMapsApi = require('load-google-maps-api-2');

export default class Maploader {

    static getMap() {

        loadGoogleMapsApi.key = 'AIzaSyB6SSvjmmzWA9zOVHhh4IsBbp3qqY25qas';

        loadGoogleMapsApi().then(function (googleMaps) {
            console.log(googleMaps); //=> Object { Animation: Object, ...

            let mapOptions = {
                zoom: 13,
                center: new google.maps.LatLng(52.37063538130748, 4.899999460629829),
                mapTypeId: google.maps.MapTypeId.TERRAIN
            //   styles: mapstyle
            };
            return new googleMaps.Map(document.getElementById('map'), mapOptions);
        }).catch(function (err) {
            console.error(err);
        });
    }
}
