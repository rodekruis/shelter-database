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
    var tableChart = dc.dataTable("#shelters-table")
    var topographyChart = dc.rowChart('#chart-topography');

     var filterChartMap = {
        'climateFilter': climateChart, 'zoneFilter': zoneChart, 'commercialFilter': undefined,
        'disasterFilter': crisisChart,
        'soilFilter': undefined, 'shelterTypeFilter': undefined, 'countryFilter': countryChart
    }

    var dimensions = []
//    d3.csv('/static/data/shelters-sample.csv', function (data) {
     d3.json("api/v0.1/shelters", function(dataObject) {

          var data = []
          for (var key in dataObject) {
             var shelter = dataObject[key]
             shelter["db_id"] = key
             data.push(shelter)
          }
        var dateFormat = d3.time.format('%Y');

        var ndx = crossfilter(data);

        var allDimensions = ndx.dimension(function (d) {
            return d;
        });
        var all = ndx.groupAll();
        var dataCount = dc.dataCount('#data-count')

        var db_idDimension = ndx.dimension(function(d) {
            return d.db_id
        });

        dimensions.push(db_idDimension)

        var zoneDimension = ndx.dimension(function (d) {
            if (d.zone) {
                return d.zone;
            } else {
                return "No data"
            }
        });
        dimensions.push(zoneDimension)
        var zoneCount = zoneDimension.group().reduceCount()

        var crisisDimension = ndx.dimension(function (d) {
            if (d['associateddisasterimmediatecause']) {
                return d['associateddisasterimmediatecause'];
            } else {
                return 'No data'
            }
        });
        dimensions.push(crisisDimension);
        var crisisCount = crisisDimension.group().reduceCount()

        var climateDimension = ndx.dimension(function (d) {
            if (d['climatezone']) {
                return d['climatezone'];
            } else {
                return 'No data'
            }

        });
        dimensions.push(climateDimension);
        var climateCount = climateDimension.group().reduceCount()

        var timeDimension = ndx.dimension(function (d) {
            if (d['yearofconstructionfirstcompletedshelters']) {
                return d3.time.year(dateFormat.parse(d['yearofconstructionfirstcompletedshelters']));
            }
            else {
                return undefined;
            }
        });
        dimensions.push(timeDimension);
        var timeCount = timeDimension.group().reduceCount(
            function (d) {
                if (d['yearofconstructionfirstcompletedshelters']) {
                    return d['yearofconstructionfirstcompletedshelters'];
                } else {
                    return undefined;
                }

            }
        );

        var shelters = ndx.dimension(function (d) {
            if (d['gpslatitude'] && d['gpslongitude']) {
                return [d['gpslatitude'], d['gpslongitude']];
            } else {
                return undefined;
            }
        });
        dimensions.push(shelters);

        var countryDimension = ndx.dimension(function (d) {
            if (d.country) {
                return d.country;
            } else {
                return 'No data'
            }

        })
        dimensions.push(countryDimension);
        var countryCount = countryDimension.group().reduceCount()

        var topographyDimension = ndx.dimension(function (d) {
            if (d.topography) {
                return d.topography;
            } else {
                return 'No data'
            }
        })
        dimensions.push(topographyDimension);
        var topographyCount = topographyDimension.group().reduceCount()

        var sheltersGroup = shelters.group().reduceCount();

        mapChart.dimension(shelters)
            .group(sheltersGroup)
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
            .dimension(zoneDimension)
            .group(zoneCount)
            .innerRadius(20)
            .on("filtered", onFiltered);

        crisisChart
            .width(110)
            .height(110)
            .dimension(crisisDimension)
            .group(crisisCount)
            .innerRadius(20)
            .on("filtered", onFiltered);


        climateChart
            .width(110)
            .height(110)
            .dimension(climateDimension)
            .group(climateCount)
            .innerRadius(20)
            .on("filtered", onFiltered);
        ;

        timeChart
            .width(500)
            .height(120)
            .dimension(timeDimension)
            .group(timeCount)
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
            .dimension(countryDimension)
            .group(countryCount)
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
            .dimension(topographyDimension)
            .group(topographyCount)
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
                    return d[''];
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


        // Init chart filters

        function initFilters() {

            var parseHash = /^#zone=([A-Za-z0-9,_\-\/\s]*)&crisis=([A-Za-z0-9,_\-\/\s]*)&climate=([A-Za-z0-9,_\-\/\s]*)&time=([A-Za-z0-9,_\-\/\s\(\):+]*)&country=([A-Za-z0-9,_\-\/\s]*)&topography=([A-Za-z0-9,_\-\/\s]*)$/;
            var parsed = parseHash.exec(decodeURIComponent(location.hash.replace(/\+/g, ' ')));
            // console.log("parsed:", parsed)
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
                filter(topographyChart, 6);
                // filter(mapChart, 7);
            }


            dc.renderAll();

        }

        d3.select('#query').on('keydown', function() {
            if (d3.event.keyCode == 13) {
                var query = this.value
                console.log("Searching for " + query);

                if (query!="") {
                    d3.json("api/v0.1/shelters/search/" + query, function(results) {
                    if (results != null) {
                        db_idDimension.filterFunction(function(id) {
                            return id in results;
                        });
                    }
                    dc.renderAll();
                    generateShelterList(allDimensions.top(Infinity));


                 })

                } else {
                    db_idDimension.filterAll();
                    dc.renderAll();
                    generateShelterList(allDimensions.top(Infinity));
                }

            }

        });


        d3.select('#download')
            .on('click', function () {
                var data = allDimensions.top(Infinity);
                var blob = new Blob([d3.csv.format(data)], {type: "text/csv;charset=utf-8"});
                saveAs(blob, 'data.csv');
            });


        d3.select('#all').on('click', function () {
            for (var i=0; i< dimensions.length; i++ ) {
                dimensions[i].filterAll();
            }
//            dc.filterAll();
            dc.renderAll();
            $("select").val("");
            $("#query").val("");

        });

        function onFiltered(chart) {


            getFiltersValues();
            generateShelterList(allDimensions.top(Infinity));

            var value = ''
            if (chart.filters().length>0) {
                value = chart.filters()[chart.filters().length-1]
            }
            
            for (var filter in filterChartMap) {
                var chartx = filterChartMap[filter]
                if (chartx && chartx.filters() == chart.filters()) {
                    $('#' + filter).val(value);
                }
            }
        }

         generateShelterList(data);
         initFilters()


    })




    // Serializing filters values in URL


    function getFiltersValues() {
        var filters = [
            {name: 'zone', value: zoneChart.filters()},
            {name: 'crisis', value: crisisChart.filters()},
            {name: 'climate', value: climateChart.filters()},
            {name: 'time', value: timeChart.filters()},
            {name: 'country', value: countryChart.filters()},
            {name: 'topography', value: topographyChart.filters()},
            // {name: 'map', value: JSON.stringify(mapChart.filters())}
        ];

        // console.log("map:")
        // console.log(JSON.stringify(mapChart.filters()))
        var recursiveEncoded = $.param(filters);
        location.hash = recursiveEncoded;
    }

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



    loadFilterDomainValues()


     $('select').on('change', function() {
        if (this.id in filterChartMap && filterChartMap[this.id]) {
            var value = this.value
            filterChartMap[this.id].filterAll();
            if (value) {
                filterChartMap[this.id].filter(value);
            }

            dc.redrawAll();
        }
     });

    function loadFilterDomainValues() {
    var filters = {
        'climateFilter': 'climatezone', 'zoneFilter': 'zone', 'commercialFilter': 'typeofimplementingagency',
        'disasterFilter': 'associateddisasterimmediatecause',
        'soilFilter': 'soiltype', 'shelterTypeFilter': 'typeofshelter', 'countryFilter': 'country'
        // 'topographyFilter': 'topography'
    }

    for (var filterId in filters) {
        var dropdown = document.getElementById(filterId)
        if (dropdown) {
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
            })(filters[filterId], dropdown);
        }
    }
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





function generateShelterList(data) {
    $('#shelterList').empty();
    for (var i = 0; i <data.length; i ++)
    {
        var shelter = $('<div class="shelter"/>').appendTo('#shelterList');
        shelter.append('<div class="image" style="background-image: url(' + '' + ')"></div> ' +
            '<h4 class="title"><a href="/shelter/' + data[i].db_id + '">' +data[i].nameofshelter+ '</a></h4>'  +
            '<div class="country">'+data[i].country+'</div> ' +
            '<div class="description"><p>' +'' + '</p></div>');
    }

}

