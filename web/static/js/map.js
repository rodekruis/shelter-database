
function get_shelters(request_url) {
    $.ajax({
        type: 'GET',
        url: request_url,
        success: function(data) {
            shelters = data;

            $('#search-loading').hide();
            $('#message').text(Object.keys(shelters).length + " shelter(s).");
            $('#message').show();

            place_shelters();
            },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            $('#search-loading').hide();
            $('#message').addClass('alert-danger');
            $('#message').text("Error when retrieving the shelters.");
            $('#message').show();
            }
        }); // ajax closed
}

function create_map() {
    var zoom=3;

    function mapLayerChanged(event) {
        if (kgeig.visibility) {
            $("#koppen-classification").show();
            $("#redcross-classification").hide();
        }
        else {
            $("#koppen-classification").hide();
            kgeig.setVisibility(false);
        }
        if (redcross.visibility) {
            $("#koppen-classification").hide();
            $("#redcross-classification").show();
        }
        else {
            $("#redcross-classification").hide();
            redcross.setVisibility(false);
        }
    }
    map = new OpenLayers.Map("mapdiv" , {
        units : 'km',
        controls:[
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.LayerSwitcher(),
            new OpenLayers.Control.Attribution()
            ],
        eventListeners: {
            "changelayer": mapLayerChanged
        }
    });

    var osm = new OpenLayers.Layer.OSM();
    var gsat = new OpenLayers.Layer.Google(
        "Google Satellite",
        {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22, visibility: false}
    );
    var gphy = new OpenLayers.Layer.Google(
        "Google Physical",
        {type: google.maps.MapTypeId.TERRAIN, visibility: false}
    );
    var gmap = new OpenLayers.Layer.Google(
        "Google Streets", // the default
        {numZoomLevels: 20, visibility: false}
    );
    var ghyb = new OpenLayers.Layer.Google(
        "Google Hybrid",
        {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 22, visibility: false}
    );
    var kgeig = new OpenLayers.Layer.WMS(
            "Climate K&ouml;ppen-Geiger", geoserver_address+"/geoserver/shelters/wms",
            {
                service: 'WMS',
                request: 'GetMap',
                layers: 'shelters:koeppen-geiger',
                format: 'image/png',
                styles: '',
                transparent: true,
                visibility: false
            },
            {
                buffer: 0,
                opacity: 0.4,
                displayOutsideMaxExtent: true
             }
        );
    kgeig.setVisibility(false);
    var redcross = new OpenLayers.Layer.WMS(
            "Climate simplified classification", geoserver_address+"/geoserver/shelters/wms",
            {
                service: 'WMS',
                request: 'GetMap',
                layers: 'shelters:redcross',
                format: 'image/png',
                styles: '',
                transparent: true,
                visibility: false
            },
            {
                buffer: 0,
                opacity: 0.4,
                displayOutsideMaxExtent: true
             }
        );
    //redcross.setVisibility(false);
    map.addLayers([osm, gsat, gphy, gmap, ghyb, kgeig, redcross]);

     // Define three rules to style the cluster features.
     var colors = {
            low: "rgb(181, 226, 140)",
            middle: "rgb(241, 211, 87)",
            high: "rgb(253, 156, 115)"
        };

    // Define three rules to style the cluster features.
    var lowRule = new OpenLayers.Rule({
        filter: new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.LESS_THAN,
            property: "count",
            value: 15
        }),
        symbolizer: {
            fillColor: colors.low,
            fillOpacity: 0.9,
            strokeColor: colors.low,
            strokeOpacity: 0.5,
            strokeWidth: 12,
            pointRadius: 10,
            label: "${count}",
            labelOutlineWidth: 1,
            fontColor: "#ffffff",
            fontOpacity: 0.8,
            fontSize: "12px"
        }
    });
    var middleRule = new OpenLayers.Rule({
        filter: new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.BETWEEN,
            property: "count",
            lowerBoundary: 15,
            upperBoundary: 50
        }),
        symbolizer: {
            fillColor: colors.middle,
            fillOpacity: 0.9,
            strokeColor: colors.middle,
            strokeOpacity: 0.5,
            strokeWidth: 12,
            pointRadius: 15,
            label: "${count}",
            labelOutlineWidth: 1,
            fontColor: "#ffffff",
            fontOpacity: 0.8,
            fontSize: "12px"
        }
    });
    var highRule = new OpenLayers.Rule({
        filter: new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.GREATER_THAN,
            property: "count",
            value: 50
        }),
        symbolizer: {
            fillColor: colors.high,
            fillOpacity: 0.9,
            strokeColor: colors.high,
            strokeOpacity: 0.5,
            strokeWidth: 12,
            pointRadius: 20,
            label: "${count}",
            labelOutlineWidth: 1,
            fontColor: "#ffffff",
            fontOpacity: 0.8,
            fontSize: "12px"
        }
    });
    // Create a Style that uses the three previous rules
    style = new OpenLayers.Style(null, {
        rules: [lowRule, middleRule, highRule]
    });

    // Create a vector layers
    vector = new OpenLayers.Layer.Vector("Shelters (in clusters)", {
        renderers: ['Canvas','SVG'],
        strategies: [
            new OpenLayers.Strategy.Cluster({
                distance: 45,
                animationMethod: OpenLayers.Easing.Expo.easeOut,
                animationDuration: 20
            })
        ],
        styleMap:  new OpenLayers.StyleMap(style)
    });
    map.addLayer(vector);
    vector.setVisibility(false);

    var lonLatCenter = new OpenLayers.LonLat(0.0, 42.0).transform(
                                                new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
    map.setCenter (lonLatCenter, zoom);

    shelters_location = new OpenLayers.Layer.Markers("Shelters");
    map.addLayer(shelters_location);
}


function place_shelters() {
    shelters_location.clearMarkers();

    var popupClass, popupContentHTML;
    AutoSizeAnchoredMinSize = OpenLayers.Class(OpenLayers.Popup.Anchored, {
        'autoSize': true,
        'minSize': new OpenLayers.Size(10,10)
    });

    var features = [];
    for (shelter in shelters)
    {
        var shelter_marker = new OpenLayers.LonLat(
                shelters[shelter]["longitude"],
                shelters[shelter]["latitude"]).transform(
                        new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()
                        );
        popupClass = AutoSizeAnchoredMinSize;

        popupContentHTML = '';
        // if (shelters[shelter]["picture_path"] != "") {
        //     popupContentHTML += '<img src="' + application_root+'/shelters_images/' + shelters[shelter]['picture_path']  + '" width="160px"></img><br /><br />';
        // }
        if (shelters[shelter]["isCommercial"] == true) {
            var picto = "/static/img/CommercialShelter.png";
            $("#commercialPicto").show();
        } else {
            var picto = "/static/img/HumanitarianShelter.png";
        }

        popupContentHTML += '<p><b>ID:</b> '+ shelters[shelter]["id"] + '<br />' +
        '<b>Name:</b> ' + shelters[shelter]["name"] + '<br />' +
        '<b>City:</b> '+ shelters[shelter]["city"] + '<br />' +
        '<a href="/shelter/' + shelter + '/General-Information" target="_blank">More details</a></p>';
        addMarker(shelter_marker, popupClass, popupContentHTML, true, true, picto, shelters_location);

        var f = new OpenLayers.Feature.Vector( new OpenLayers.Geometry.Point(shelter_marker.lon, shelter_marker.lat));
        features.push(f);
    }
    vector.addFeatures(features);
}
