/**
* Function: addMarker
* Add a new marker to the layer given the following lonlat,
*     popupClass, and popup contents HTML. Also allow specifying
*     whether or not to give the popup a close box.
*
* Parameters:
* ll - {<OpenLayers.LonLat>} Where to place the marker
* popupClass - {<OpenLayers.Class>} Which class of popup to bring up
*     when the marker is clicked.
* popupContentHTML - {String} What to put in the popup
* closeBox - {Boolean} Should popup have a close box?
* overflow - {Boolean} Let the popup overflow scrollbars?
*/
function addMarker(ll, popupClass, popupContentHTML, closeBox, overflow, icon, layer) {

    var feature = new OpenLayers.Feature(layer, ll);
    feature.closeBox = closeBox;
    feature.popupClass = popupClass;
    feature.data.popupContentHTML = popupContentHTML;
    feature.data.overflow = (overflow) ? "auto" : "hidden";
    feature.data.icon = new OpenLayers.Icon(icon);

    var marker = feature.createMarker();

    var markerClick = function (evt) {
        if (this.popup == null) {
            this.popup = this.createPopup(this.closeBox);
            map.addPopup(this.popup);
            this.popup.show();
        } else {
            this.popup.toggle();
        }
        currentPopup = this.popup;
        OpenLayers.Event.stop(evt);
    };
    marker.events.register("mousedown", feature, markerClick);

    layer.addMarker(marker);
}

var x = document.getElementById("geolocation");
function getLocation()
{
    x = document.getElementById("geolocation");
    if (navigator.geolocation)
    {
        var optn = {
            enableHighAccuracy : true,
            timeout : 10000,
            maximumAge : 0
        };
        navigator.geolocation.getCurrentPosition(init, showError, optn);
    }
    else
    {
        x.innerHTML="Geolocation is not supported by this browser.";
    }
}

function showError(error)
{
    switch(error.code)
    {
        case error.PERMISSION_DENIED:
            x.innerHTML="User denied the request for geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML="Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = '<span class="glyphicon glyphicon-warning-sign"></span> The request to get user location timed out. Automatically set to (49.627800, 6.161530).'
            latitude = 49.627800;
            longitude = 6.161530;
            get_restaurant(latitude, longitude);
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML="An unknown error occurred."
            break;
    }
}
