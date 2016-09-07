/**
 * Created by nlrc on 22-7-16.
 */

$(document).ready(function () {


    var zoneChart = dc.pieChart('#chart-ring-zone')
    var crisisChart = dc.pieChart('#chart-ring-crisis')
    var climateChart = dc.pieChart('#chart-ring-climate')
    var timeChart = dc.barChart('#chart-timeline');
    var countryChart = dc.rowChart('#chart-bar-country')
    var mapChart = dc_leaflet.markerChart("#chart-map")
    var topographyChart = dc.rowChart("#chart-topography")
    var tableChart = dc.dataTable("#shelters-table")

    var filters = {
        'zoneFilter': {'chart': zoneChart, 'dbName': 'zone'},
        'disasterFilter': {'chart': crisisChart, 'dbName': 'associateddisasterimmediatecause'},
        'climateFilter': { 'chart': climateChart, 'dbName': 'climatezone' },
        'commercialFilter': { 'dbName': 'typeofimplementingagency'},
        'soilFilter': {'dbName': 'soiltype' },
        'shelterTypeFilter': {'dbName': 'typeofshelter'},
        'countryFilter': {'chart': countryChart, 'dbName': 'country'},
        'topographyFilter': {'chart': topographyChart, 'dbName': 'topography'},
        'timeFilter': {'chart': timeChart, 'dbName': 'yearofconstructionfirstcompletedshelters'},
        'positionFilter': {},
        'costRange': {'dbName': 'constructioncostperunitusd', 'sliderId': 'costSlider'},
        'widthRange': {'dbName': 'widthm', 'sliderId': 'widthSlider'},
        'lengthRange':{'dbName': 'lengthm', 'sliderId': 'lenghtSlider'},
        'queryFilter': {'dbName': 'db_id'},
    }

//    d3.csv('/static/data/shelters-sample.csv', function (data) {
     d3.json("api/v0.1/shelters", function(dataObject) {

          var data = []
          for (var key in dataObject) {
             var shelter = dataObject[key]
             shelter["db_id"] = key
             data.push(shelter)
          }
        var dateFormat = d3.time.format('%Y');


        function loadFilterDomainValues() {

            for (var filterId in filters) {
                var dropdown = document.getElementById(filterId)
                if (dropdown && $(dropdown).is('select')) {
                    (function(attrName, htmlElement) {
                        d3.json("api/v0.1/attributes/" + encodeURI(attrName), function (valuesObject) {
                            // console.log(attrName + JSON.stringify(valuesObject));
                            if (valuesObject && valuesObject[attrName]) {

                                var values = valuesObject[attrName].split(';')
                                for (var i = 0; i < values.length; ++i) {
                                    addOption(htmlElement, values[i], values[i]);
                                }
                            }
                        })
                    })(filters[filterId]['dbName'], dropdown);
                }
            }

            for (var filterId in filters) {
                var element = document.getElementById(filterId)
                if ($(element).is('input') && $(element).attr('data-type')=="range") {
                    (function(id) {
                        var dbAttrName = filters[id]['dbName']
                        d3.json("api/v0.1/attributes/" + encodeURI(dbAttrName), function (valuesObject) {
                                if (valuesObject && valuesObject[dbAttrName]) {
                                    var values = valuesObject[dbAttrName].split(';')
                                    for(var i=0; i<values.length; i++) { values[i] = parseInt(values[i], 10); }
                                    var minValue = Math.min.apply(null, values)
                                    var maxValue = Math.max.apply(null, values)

                                    $('#' + id + 'MinValue').text(minValue);
                                    $('#' + id + 'MaxValue').text(maxValue);
                                    filters[id]['slider'] = new Slider('#' + id , {min: minValue, max: maxValue, id: filters[id]['sliderId'], })
                                        .on('change', function(values) {onSliderChange(id, values.newValue)})

                                    filters[id]['maxValue'] = maxValue
                                }
                            })
                    })(filterId);
                }
            }
        }
        loadFilterDomainValues()




        var ndx = crossfilter(data);

        var allDimensions = ndx.dimension(function (d) {
            return d;
        });
        var all = ndx.groupAll();
        var dataCount = dc.dataCount('#data-count')

        for (var id in filters) {    // define crossfilter dimensions and groups (position and time require special treatment)
            if (id == 'timeFilter') {
                filters[id]['dimension'] = ndx.dimension(function (d) {
                    if (d['yearofconstructionfirstcompletedshelters']) {
                        return d3.time.year(dateFormat.parse(d['yearofconstructionfirstcompletedshelters']));
                    }
                    else {
                        return undefined;
                    }
                });
                filters[id]['count'] = filters[id]['dimension'].group().reduceCount(
                    function (d) {
                        if (d['yearofconstructionfirstcompletedshelters']) {
                            return d['yearofconstructionfirstcompletedshelters'];
                        } else {
                            return undefined;
                        }
                    });
            } else
                if (id == 'positionFilter') {
                    filters[id]['dimension'] = ndx.dimension(function (d) {
                        if (d['gpslatitude'] && d['gpslongitude']) {
                            return [d['gpslatitude'], d['gpslongitude']];
                        } else {
                            return undefined;
                        }
                    });
                    filters[id]['count'] = filters[id]['dimension'].group().reduceCount();

                } else {
                    filters[id]['dimension'] = ndx.dimension(function(d) {
                        if (d[filters[id]['dbName']]) {
                            return d[filters[id]['dbName']];
                        } else {
                            return "No data"
                        }
                    })
                    if (filters[id]['chart']) {
                        filters[id]['count'] = filters[id]['dimension'].group().reduceCount();
                    }
                }
        }

        mapChart.dimension(filters['positionFilter']['dimension'])
            .group(filters['positionFilter']['count'] )
            .center([51.505, -0.09])
            .zoom(2)
            .filterByArea(true)
            .cluster(true)
            .on("filtered", onFiltered);

        addLayersToChart(mapChart)
        mapChart.map().scrollWheelZoom.disable()


        zoneChart
            .width(110)
            .height(110)
            .dimension(filters['zoneFilter']['dimension'])
            .group(filters['zoneFilter']['count'])
            .innerRadius(20)
            .on("filtered", onFiltered);

        crisisChart
            .width(110)
            .height(110)
            .dimension(filters['disasterFilter']['dimension'])
            .group(filters['disasterFilter']['count'])
            .innerRadius(20)
            .on("filtered", onFiltered);


        climateChart
            .width(110)
            .height(110)
            .dimension(filters['climateFilter']['dimension'])
            .group(filters['climateFilter']['count'])
            .innerRadius(20)
            .on("filtered", onFiltered);
        ;

        timeChart
            .width(500)
            .height(120)
            .dimension(filters['timeFilter']['dimension'])
            .group(filters['timeFilter']['count'])
            .barPadding(5)
            .x(d3.time.scale().domain([new Date(2003, 01, 01), new Date()]))
            .xUnits(d3.time.year)
            .on("filtered", onFiltered)
            .yAxis().tickFormat(
            function (v) {
                return d3.format('f')(v);
            });


        countryChart
            .width(200)
            .height(200)
            .margins({left: 0, right: 10, top: 10, bottom: 20})
            .dimension(filters['countryFilter']['dimension'])
            .group(filters['countryFilter']['count'])
            .on("filtered", onFiltered)
            .xAxis().tickFormat(
            function (v) {
                return d3.format('f')(v);
            });

        countryChart.xAxis().ticks(10)

        topographyChart
            .width(200)
            .height(200)
            .margins({left: 0, right: 10, top: 10, bottom: 20})
            .dimension(filters['topographyFilter']['dimension'])
            .group(filters['topographyFilter']['count'])
            .on("filtered", onFiltered)
            .xAxis().tickFormat(
            function (v) {
                return d3.format('f')(v);
            });

        tableChart
            .dimension(allDimensions)
            .group(function (d) {
                return '';
            })
            .columns([
                function (d) {
                    return d.id;
                },
                function (d) {
                    return d['nameofshelter'];
                },
                function (d) {
                    return d.zone;
                },
                function (d) {
                    return d.country;
                },
                function (d) {
                    return d['associateddisasterimmediatecause'];
                },
                function (d) {
                    return d['climatezone'];
                }
            ])
            .on('renderlet', function (table) {
                // each time table is rendered remove nasty extra row dc.js insists on adding
                table.select('tr.dc-table-group').remove();
            })

        dataCount
            .dimension(ndx)
            .group(all)


        // Init chart filters using url values

        function initFilters() {

            var parseHash = /^#zone=([A-Za-z0-9,_\-\/\s]*)&crisis=([A-Za-z0-9,_\-\/\s]*)&climate=([A-Za-z0-9,_\-\/\s]*)&time=([A-Za-z0-9,_\-\/\s\(\):+]*)&country=([A-Za-z0-9,_\-\/\s]*)$/;
            var parsed = parseHash.exec(decodeURIComponent(location.hash.replace(/\+/g, ' ')));
//             console.log("parsed:", parsed)
            function filter(chart, rank) {

                if (parsed[rank] == "") {
                    chart.filter(null);
                }
                else {
                    var filterValues = parsed[rank].split(",");
                    // console.log(filterValues)

                    switch (rank) {
                        case 4: //timeChart
                            chart.filter(null);
                            if (filterValues.length == 2) {
                                filterValues[i] = new Date(filterValues[i])
                                var start = new Date(filterValues[0])
                                var end = new Date(filterValues[1])
                                chart.filter(dc.filters.RangedFilter(start, end))
                            }
                            break;
                        case 7: //mapChart
                            // console.log('parsed:', filterValues)
                            // filterValues = JSON.parse(filterValues)
                            // console.log(filterValues)
                            break;
                        default:
                            for (var i = 0; i < filterValues.length; i++) {
                                chart.filter(filterValues[i]);
                            }
                    }
                }
            }
            if (parsed) {
                filter(zoneChart, 1);
                filter(crisisChart, 2);
                filter(climateChart, 3);
                filter(timeChart, 4);
                filter(countryChart, 5);
                // filter(mapChart, 7);
            }

        }

        d3.select('#query').on('keydown', function() {
            if (d3.event.keyCode == 13) {
                var query = this.value
                console.log("Searching for " + query);

                if (query!="") {
                    d3.json("api/v0.1/shelters/search/" + query, function(results) {
                        if (results != null) {
                            filters['queryFilter']['dimension'].filterFunction(function(id) {
                                return id in results;
                            });
                        }
                        redrawAll();
                    })
                } else {
                    filters['queryFilter']['dimension'].filterAll();
                    redrawAll();
                }

            }

        });

        $('select').on('change', function() {                         // User selected dropdown value
            if (this.id in filters ) {
                var value = this.value
                if (filters[this.id]['chart']) {                      // if dropdown corresponds to a chart - redraw it
                    filters[this.id]['chart'].filterAll();            // reset first
                    if (value) {
                        filters[this.id]['chart'].filter(value);      // filter chart with selected value
                    }
                    dc.redrawAll();

                } else {                                              // no chart - filter dimension directly
                    if (filters[this.id]['dimension']) {
                        if (value) {
                            filters[this.id]['dimension'].filter(value);
                        } else {
                            filters[this.id]['dimension'].filterAll();
                            console.log("no value")
                        }

                        redrawAll();
                    }
                }
            }
        });


        function onSliderChange(id, values) {                          // User selected range using sliders
            filters[id]['dimension'].filter(values);
            redrawAll();
        }


        d3.select('#all').on('click', function () {   //    Reset All Filters
            for (var id in filters) {
                if (filters[id]['dimension']) {
                    filters[id]['dimension'].filterAll();
                }
            }

            $("select").val("");
            $("#query").val("");
            for (id in filters) {
                if (filters[id]['slider']) {
                    filters[id]['slider'].setValue([0, filters[id]['maxValue']]);
                }
            }
            mapChart.map().setZoom(1);
            redrawAll();

        });

        // Reset individual filters on request

        d3.selectAll('#year').on('click', function () {
            timeChart.filterAll();
            dc.redrawAll();
        });
        d3.selectAll('#zone').on('click', function () {
            zoneChart.filterAll();
            dc.redrawAll();
            $("#zoneFilter").val("");

        });
        d3.selectAll('#crisis').on('click', function () {
            crisisChart.filterAll();
            dc.redrawAll();
            $("#disasterFilter").val("");

        });
        d3.selectAll('#climate').on('click', function () {
            climateChart.filterAll();
            dc.redrawAll();
            $("#climateFilter").val("");

        });
        d3.selectAll('#country').on('click', function () {
            countryChart.filterAll();
            dc.redrawAll();
            $("#countryFilter").val("");

        });


        d3.selectAll('#cost').on('click', function () {
            costChart.filterAll();
            dc.redrawAll();
        });

         d3.selectAll('#topography').on('click', function () {
            topographyChart.filterAll();
            dc.redrawAll();
        });

        d3.select('#download')
            .on('click', function () {
                var data = allDimensions.top(Infinity);
                var blob = new Blob([d3.csv.format(data)], {type: "text/csv;charset=utf-8"});
                saveAs(blob, 'data.csv');
         });

        function onFiltered(chart) {
            // Serialize selected options in url
            // Synchronize dropdowns with changes made on charts
            // Adjust shelter list

            getFiltersValues();
            generateShelterList(allDimensions.top(Infinity));

            var value = ''
            if (chart.filters().length>0) {
                value = chart.filters()[chart.filters().length-1]
            }

            // Find menu filter corresponding to chart and adjust displayed selected option as selected using dc chart

            for (var filter in filters) {
                var chartx = filters[filter]['chart']
                if (chartx && chartx.filters() == chart.filters()) {
                    $('#' + filter).val(value);
                }
            }
        }

        function redrawAll() {
            dc.renderAll();
            generateShelterList(allDimensions.top(Infinity));
        }

         initFilters();
         redrawAll();

    })



    // Serializing filters values in URL


    function getFiltersValues() {
        var filters = [
            {name: 'zone', value: zoneChart.filters()},
            {name: 'crisis', value: crisisChart.filters()},
            {name: 'climate', value: climateChart.filters()},
            {name: 'time', value: timeChart.filters()},
            {name: 'country', value: countryChart.filters()},
//            {name: 'topography', value: topographyChart.filters()}
            // {name: 'map', value: JSON.stringify(mapChart.filters())}
        ];

        // console.log("map:")
        // console.log(JSON.stringify(mapChart.filters()))
        var recursiveEncoded = $.param(filters);
        location.hash = recursiveEncoded;
    }







})


function addLayersToChart(mapChart) {

    var redCrossLayer = L.tileLayer.wms("https://shelter-database.org:8443/geoserver/ows?service=wms&version=1.1.1&request=GetCapabilities", {
        layers: 'shelters:redcross',
        transparent: true,
        opacity: 0.5

    });

    var koeppenGeigerLayer = L.tileLayer.wms("https://shelter-database.org:8443/geoserver/ows?service=wms&version=1.1.1&request=GetCapabilities", {
        layers: 'koeppen-geiger',
        transparent: true,
        opacity: 0.5
    })

    var overlayMaps = {
        "Climate simplified classification": redCrossLayer,
        "Koeppen-Geiger": koeppenGeigerLayer
    };

    mapChart._doRender()
    var map = mapChart.map()

    map.addLayer(redCrossLayer)
    L.control.layers(null, overlayMaps).addTo(map);

};

d3.select("#share")
    .on('click', function () {
        window.prompt("Link to share:", window.location.href);
    })

addOption = function (selectbox, text, value) {
    var optn = document.createElement("OPTION");
    optn.text = text;
    optn.value = value;
    selectbox.options.add(optn);
}





generateShelterList  = function (data) {
    $('#shelterList').empty();
    for (var i = 0; i <data.length; i ++)
    {
		// get url from api data if pictures exist
		var url = '';
		if(typeof(data[i].shelterpicture) !== 'undefined' && Object.keys(data[i].shelterpicture).length > 0){
			for (var prop in data[i].shelterpicture) {
				url = data[i].shelterpicture[prop][0];
				break;
			}
		}
		
        var shelter = $('<div class="shelter"/>').appendTo('#shelterList');
        shelter.append('<div class="image" style="background-image: url(\'/' + url  + '\')"></div> ' +
            '<h4 class="title"><a href="/shelter/' + data[i].db_id + '">' +data[i].nameofshelter+ '</a></h4>'  +
            '<div class="country">'+data[i].country+'</div> ' +
            '<div class="description"><p>' +'' + '</p></div>');
    }

}

