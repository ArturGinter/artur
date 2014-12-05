/*
 *
 * https://github.com/wf9a5m75/phonegap-googlemaps-plugin/wiki/Why-use-this-plugin%3F
 *
 */


function GoogleMap() {

    var retailer;
    var addMarkersToMap = function(map, retailer, position) {

        // Usermarker
        if (window.localStorage.getItem("myLatitude") && window.localStorage.getItem("myLongitude")) {
            var latitudeAndLongitudeUser = new google.maps.LatLng(window.localStorage.getItem("myLatitude"), window.localStorage.getItem("myLongitude"));
            var markerUser = new google.maps.Marker({
                position: latitudeAndLongitudeUser,
                animation: google.maps.Animation.DROP,
                map: map,
                title: "User",
                draggable: false,
                clickable: true,
                optimized: false,
                zIndex: 15,
                icon: new google.maps.MarkerImage("img/bluedot.png", null, null, null, new google.maps.Size(20,20))
            });
        }


        // Load Akustiker
        var log;
        var mapBounds = new google.maps.LatLngBounds();
        var poIcon = new google.maps.MarkerImage("img/googlemap_lokal_indikator.png", null, null, null, new google.maps.Size(20,33));

        angular.forEach(retailer, function(value, key) {

            var latitudeAndLongitude = new google.maps.LatLng(value.lat,value.lan);
            var marker = new google.maps.Marker({
                position: latitudeAndLongitude,
                animation: google.maps.Animation.DROP,
                map: map,
                title: value.company,
                snippet: value.company,
                draggable: false,
                clickable: true,
                optimized: false,
                zIndex: 5,
                icon: poIcon
            });

            var content = '<p><strong>'+value.company+'</strong></p><p>'+value.street+', '+value.zip+' '+value.city+'</p>';

            if (value.email) {
                content += '<div class="map_info_icon"><i class="icon ion-chevron-right"></i></div>';
            } else {
                content += '<div class="map_info_icon"><i class="icon ion-ios7-information-outline"></i></div>';
            }

            //var infoWindow = new google.maps.InfoWindow({content: "Nome do evento:"});
            google.maps.event.addListener(marker, 'click', function() {
                //infowindow.open(marker.get('map'), marker);

                $('#map_info').html(content);
                $('#map_info').attr('data-retailer', key);
                $('#map_info').show();
            });
            mapBounds.extend(latitudeAndLongitude);
        }, log);


        $('#map_info').bind( "click", function(event) {
            window.location = "#/tab/details/" + $(event.currentTarget).attr('data-retailer');
        });
        google.maps.event.addListener(map, 'bounds_changed', function() {
            $('#map_info').hide();
        });
        var bounds_listener = google.maps.event.addListener( map, 'bounds_changed', function(event) {
            if (this.getZoom() > 15) {
                this.setZoom(15);
            }

            google.maps.event.removeListener( bounds_listener );
        });

        if( retailer.length > 0) map.fitBounds(mapBounds);

    }

    this.initialize = function(position) {
        var map = showMap();
        addMarkersToMap(map, this.retailer, position);
    }

    var showMap = function(){
        $('#map_info').hide();
        var mapOptions = {
            zoom: 5,
            center: new google.maps.LatLng('52.3796664', '9.7614715'),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scaleControl:false,
            zoomControl:false,
            mapTypeControlOptions:{
                mapTypeIds: [
                    google.maps.MapTypeId.HYBRID,
                    google.maps.MapTypeId.SATELLITE,
                    google.maps.MapTypeId.ROADMAP
                ]
            }
        }

        var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        //map.setMyLocationEnabled(true);

        return map;

    }
}