/**
 * DASHBOARD : dashboard.js
 */

var modalName = "";
var modalOpen = function modalOpen(modalid){
	modalName = modalid;
	$("#wrapper").addClass("modal-open");
	$("#" + modalid).css("visibility", "visible");
	setPage(1);
}
var modalClose = function modalClose(){
	$("#wrapper").removeClass("modal-open");
	$("#" + modalName).css("visibility", "hidden");
	modalName = "";
}

var setPage = function setPage(page){
	modalPage = page;
	modalResetPages();
	$(".mymodal .page" + page).css("display", "block");
}

var modalResetPages = function modalResetPages() {
	$(".mymodal .page").each(function(el){
		$(this).css("display", "none");
	})
}

var map = L.map('chart-map',{tap:false, dragging:true, fullscreenControl: true});

map.on('enterFullscreen', function(){
  map.dragging.enable();
});

map.on('exitFullscreen', function(){
  map.dragging.disable();
});

map.on('popupopen', function(e) {
	var px = map.project(e.popup._latlng); // find the pixel location on the map where the popup anchor is
	px.y -= e.popup._container.clientHeight/2 // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
	map.panTo(map.unproject(px),{animate: true}); // pan to new center
	var marker = e.popup.update();
});

var baseLayer = L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var setTab = function (tab) {
	document.getElementById("tabs").className = "tab" + tab
}
var toggleAdvanced = function toggleAdvanced() {
	var obj = document.getElementById("advanced")
	if (obj.className == "advanced") {
		obj.className = "advanced open"
	} else {
		obj.className = "advanced"
	}
}

var getParameterByName = function getParameterByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&#]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.hash);
  if(results == null)
	return "";
  else
	return decodeURIComponent(results[1].replace(/\+/g, " "));
}

$("#query").val(getParameterByName('query'));

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

var chartSizes = {
	'pieChart': {'desktopChartWidth': 130, 'mobileChartMargin': 70},
	'timeChart': {'desktopChartWidth': 460, 'mobileChartMargin': 30},
}

var getChartWidth = function(chartType) {
		var windowWidth = $(window).width()
		if (windowWidth <=700) {
			return windowWidth-chartSizes[chartType]['mobileChartMargin'];
		} else {
			return chartSizes[chartType]['desktopChartWidth'];
		}
}

mapCenter = [48.2361, 21.22574]  // geographical midpoint of Europe
var dateFormat = d3.time.format('%Y');

var restructureData = function(dataObject) {
	var data = []

	 for (var key in dataObject) {
		var shelter = dataObject[key]
		var shelterFlat = {}
		shelterFlat["db_id"] = key

		if (shelter['General'] && shelter['General']['Attributes']) {
			if (shelter['General']['Attributes']['yearofconstructionfirstcompletedshelters']) {
				var year = shelter['General']['Attributes']['yearofconstructionfirstcompletedshelters']
				shelterFlat['yearofconstructionfirstcompletedshelters'] = dateFormat.parse(year);
			}
			if (shelter['General']['Attributes']['constructioncostperunitusd']) {
				shelterFlat['constructioncostperunitusd'] = parseFloat(shelter['General']['Attributes']['constructioncostperunitusd'])
			}
			if (shelter['General']['Attributes']['lengthm']) {
				shelterFlat['lengthm'] = parseFloat(shelter['General']['Attributes']['lengthm'])
			}
			if (shelter['General']['Attributes']['widthm']) {
				shelterFlat['widthm'] = parseFloat(shelter['General']['Attributes']['widthm'])
			}
		}
		if (shelter['Identification'] && shelter['Identification']['Attributes']) {
			if (shelter['Identification']['Attributes']['id']) {
				shelterFlat['id'] = shelter['Identification']['Attributes']['id']
			}
			if (shelter['Identification']['Attributes']['gpslatitude']) {
				shelterFlat['gpslatitude'] = shelter['Identification']['Attributes']['gpslatitude']
			}
			if (shelter['Identification']['Attributes']['gpslongitude']) {
				shelterFlat['gpslongitude'] = shelter['Identification']['Attributes']['gpslongitude']
			}
			if (shelter['Identification']['Attributes']['nameofshelter']) {
				shelterFlat['nameofshelter'] = shelter['Identification']['Attributes']['nameofshelter']
			}
			if (shelter['Identification']['Attributes']['zone']) {
				shelterFlat['zone'] = shelter['Identification']['Attributes']['zone']
			}
			if (shelter['Identification']['Attributes']['climatezone']) {
				shelterFlat['climatezone'] = shelter['Identification']['Attributes']['climatezone']
			}
			if (shelter['Identification']['Attributes']['country']) {
				shelterFlat['country'] = shelter['Identification']['Attributes']['country']
			}
		}
		if (shelter['Identification'] && shelter['Identification']['Cover'] &&
		shelterFlat['gpslongitude'] && shelterFlat['gpslatitude'])  {

			// gps position and marker tooltip

			shelterFlat['tooltipContent'] = '<a href="/shelter/' + shelterFlat.db_id +'" target="_blank">' + shelterFlat.id + ', ' + shelterFlat.nameofshelter + '</a>'

			if (shelter['Identification']['Cover'].length> 0 )  {
				// then search for Identification Facade thumbnail or Facade
				shelterFlat['thumbnailUrl'] = undefined;
				$.each(shelter['Identification']['Cover'], function(j, val) {
					var found = val.indexOf('_thumbnail');
					if ( found >= 0) {
						shelterFlat['thumbnailUrl'] = shelter['Identification']['Cover'][j];
						return false;
					}
				});
				if (shelterFlat['thumbnailUrl']) {
					shelterFlat['tooltipContent']= '<div>' +
														'<a href="/shelter/' + shelterFlat.db_id +'">' +
														'<img src=\'/'+ shelterFlat['thumbnailUrl']+'\'/>' + 
															shelterFlat.id + ', ' + shelterFlat.nameofshelter + 
													'</div>';
				}
			}

		}
		 
		if (shelter["Disaster & Response"] && shelter["Disaster & Response"]["Attributes"] ) {
			if (shelter["Disaster & Response"]["Attributes"]["associateddisasterimmediatecause"]) {
				shelterFlat["associateddisasterimmediatecause"] = shelter["Disaster & Response"]["Attributes"]["associateddisasterimmediatecause"]
			}
			if (shelter["Disaster & Response"]["Attributes"]["typeofimplementingagency"]) {
				shelterFlat["typeofimplementingagency"] = shelter["Disaster & Response"]["Attributes"]["typeofimplementingagency"]
			}
			if (shelter["Disaster & Response"]["Attributes"]["typeofshelter"]) {
				shelterFlat["typeofshelter"] = shelter["Disaster & Response"]["Attributes"]["typeofshelter"]
			}
		}

		if (shelter["Site"] && shelter["Site"]["Attributes"] ) {
			if (shelter["Site"]["Attributes"]["soiltype"]) {
				shelterFlat["soiltype"] = shelter["Site"]["Attributes"]["soiltype"]
			}
			if (shelter["Site"]["Attributes"]["topography"]) {
				shelterFlat["topography"] = shelter["Site"]["Attributes"]["topography"]
			}
		}
		data.push(shelterFlat)

	}
	return data;
}

// get shelters from api
 d3.json("api/v0.2/shelters", function(dataObject) {

	var data = restructureData(dataObject)

	for (var filterId in filters) {
		var element = document.getElementById(filterId)
		if ($(element).is('input') && $(element).attr('data-type')=="range") {
			(function(id) {
				var dbAttrName = filters[id]['dbName']
				d3.json("api/v0.2/attributes/" + encodeURI(dbAttrName), function (valuesObject) {
						if (valuesObject && valuesObject[dbAttrName]) {
							var values = valuesObject[dbAttrName].split(';')
							for(var i=0; i<values.length; i++) { values[i] = parseInt(values[i], 10); }
							var minValue = Math.min.apply(null, values)
							var maxValue = Math.max.apply(null, values)+1
//								console.log(dbAttrName, maxValue, values)

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
					return d['yearofconstructionfirstcompletedshelters'];
				}
				else {
					return undefined;
				}
			});
			filters[id]['count'] = filters[id]['dimension'].group().reduceCount();
		} else
			if (id == 'positionFilter') {
				filters[id]['dimension'] = ndx.dimension(function (d) {
					if (d['gpslatitude'] && d['gpslongitude']) {
						return [d['gpslatitude'], d['gpslongitude'], d['tooltipContent'] ];
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
						return "no data"
					}
				})
				filters[id]['count'] = filters[id]['dimension'].group().reduceCount();

				// populate all available options in dropdowns
				var dropdown = document.getElementById(id)
				if (dropdown && $(dropdown).is('select')) {
					(function(filterId, htmlElement) {
						var counts = filters[filterId]['count'].top(Infinity);
						var values = []
						for (var i in counts) {
							values.push(counts[i].key);
						}
						for (var i in values.sort()) {
							addOption(dropdown, values[i], values[i]);
						}

					})(id, dropdown);
				}
			}
	}

	$.urlParam = function(name){
		var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
		return results[1] || 0;
	}

	var onFiltered = function onFiltered(chart) {
		// Serialize selected options in url
		// Synchronize dropdowns with changes made on charts
		// Adjust shelter list

		// set the url parameters to match the filters
		getFiltersValues();

		// filter the table for the shelters selected by the filters
		generateShelterList(allDimensions.top(Infinity));

		/*var value = '';
		var f = chart.filters();
		if (chart.filters().length>0) {
			value = chart.filters()[chart.filters().length-1]
		}

		// Find menu filter corresponding to chart and adjust displayed selected option as selected using dc chart
		for (var filter in filters) {
			var chartx = filters[filter]['chart'];

			if(chartx){
				var chartx_filters = chartx.filters();
				var chart_filters = chart.filters();
				if (chartx_filters == chart_filters) {
					$('#' + filter).val(value);
				}
			}
		}*/
	}

	var onMapFiltered = function onMapFiltered(chart) {
		// fit filtered markers within map bounds if any of the non-map filters where applied
        /*
		bounds = [];
		allDimensions.top(Infinity).forEach(function (d) {
			bounds.push(new L.latLng(d.gpslatitude, d.gpslongitude));
		}); 

		// For Debugging:
		//print_filter(filters['positionFilter']['dimension']);
		if(bounds.length > 0){
            map.fitBounds(bounds, {pan: {animate: true, duration: 1.5, easeLinearity: 0.25}});
		}
        */
		
		// set the url parameters to match the filters
		getFiltersValues();

		// filter the table for the shelters selected by the filters
		generateShelterList(allDimensions.top(Infinity));
	}

	mapChart
		.dimension(filters['positionFilter']['dimension'])
		.group(filters['positionFilter']['count'] )
		.center(mapCenter)
		.zoom(1)
		.filterByArea(true)
		.cluster(true)
		.popup(function(d) {
			if (d.key.length>2) {
				return d.key[2];  // generated tooltip
			} else {
				return d.key[0] + ', ' + d.key[1]; // lat, lng
			}
		})
		.createLeaflet(function(){
			return map;
		})
		.renderTitle(false);

	addLayersToChart(mapChart);
	setMapView(mapChart);
	mapChart.map().scrollWheelZoom.disable()

	pieChartWidth = getChartWidth('pieChart')
	zoneChart
		.width(pieChartWidth)
		.dimension(filters['zoneFilter']['dimension'])
		.group(filters['zoneFilter']['count'])
		.innerRadius(20)
		.on("filtered", onFiltered);

	crisisChart
		.width(pieChartWidth)
		.dimension(filters['disasterFilter']['dimension'])
		.group(filters['disasterFilter']['count'])
		.innerRadius(20)
		.on("filtered", onFiltered);


	climateChart
		.width(pieChartWidth)
		.dimension(filters['climateFilter']['dimension'])
		.group(filters['climateFilter']['count'])
		.innerRadius(20)
		.on("filtered", onFiltered);

	timeChartWidth = getChartWidth('timeChart');

	timeChart
		.width(timeChartWidth)
		.height(120)
		.margins({top:20, right:10, bottom:30, left:25})
		.dimension(filters['timeFilter']['dimension'])
		.group(filters['timeFilter']['count'])
		.barPadding(5)
		.elasticX(true)
		.elasticY(true)
		.x(d3.time.scale().domain([new Date(2000, 01, 01), new Date()]))
		.round(d3.time.year.round)
		.xUnits(d3.time.years)
		.xUnits(function() {return 10;})
		.on("filtered", onFiltered)
		.yAxis().tickFormat(
		function (v) {
			return d3.format('f')(v);
		});

	timeChart.filter = function(){}
	timeChart.onClick = function(){}


	countryChart
		.width(210)
		.height(250)
		.margins({left: 10, right: 10, top: 20, bottom: 30})
		.dimension(filters['countryFilter']['dimension'])
		.group(filters['countryFilter']['count'])
        .on("postRedraw", onMapFiltered)
	 
		.xAxis().tickFormat(
		function (v) {
			return d3.format('f')(v);
		});


	countryChart.xAxis().ticks(10)

	topographyChart
		.width(210)
		.height(250)
		.margins({left: 10, right: 10, top: 20, bottom: 30})
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
				return '<a href="/shelter/' + d.db_id +'" target="_blank">' + d.id + '</a>';
			},
			function (d) {
				return '<a href="/shelter/' + d.db_id +'" target="_blank">' + d.nameofshelter + '</a>';
			},
			function (d) {
				return d.zone;
			},
			function (d) {
				return d.country;
			},
			function (d) {
				return d.associateddisasterimmediatecause;
			},
			function (d) {
				return d.climatezone;
			}
		])
		.size(data.length)
		.on('renderlet', function (table) {
			// each time table is rendered remove nasty extra row dc.js insists on adding
			table.select('tr.dc-table-group').remove();
		});


	$(window).resize(function() {
		if (document.getElementById("tabs").className == "tab2") {
			var adjustedWidth = getChartWidth("timeChart");
			var redraw = false;
			if (adjustedWidth!=timeChartWidth) {
				timeChartWidth = adjustedWidth;
				timeChart.width(timeChartWidth);
				redraw = true;
			}
			adjustedWidth = getChartWidth("pieChart");
			if (adjustedWidth!=pieChartWidth) {
				pieChartWidth = adjustedWidth;
				zoneChart.width(pieChartWidth);
				crisisChart.width(pieChartWidth);
				climateChart.width(pieChartWidth);
				redraw = true;
			}
			if (redraw) {
				dc.redrawAll();
				dc.renderAll();
			}
		}
	})

	dataCount
		.dimension(ndx)
		.group(all)


	// Init chart filters using url values

	var initFilters = function initFilters() {

		var parseHash = /^#zone=([A-Za-z0-9,_\-\/\s]*)&crisis=([A-Za-z0-9,_\-\/\s]*)&climate=([A-Za-z0-9,_\-\/\s]*)&time=([A-Za-z0-9,_\-\/\s\(\):+\.]*)&country=([A-Za-z0-9,_\-\/\s]*)&query=([A-Za-z0-9,_\-\/\s]*)&topography=(.*)&map=(.*)$/;
		var parsed = parseHash.exec(decodeURIComponent(location.hash.replace(/\+/g, ' ')));
//	             console.log("parsed:", parsed)

		var filterQuery = function filterQuery(rank){
			if (parsed[rank] == "") {
				return;
			}
			// perform query
			queryByString(parsed[rank]);

		}

		var filter = function filter(chart, rank) {

			if (parsed[rank] == "") {
				chart.filter(null);
			}
			else {
				var filterValues = parsed[rank].split(",");
//					 console.log(filterValues)

				switch (rank) {
					case 4: //timeChart
						chart.filter(null);
						if (filterValues.length == 2) {
							var start = new Date(filterValues[0])
							var end = new Date(filterValues[1])
//								console.log('start', start, '\nend', end)

							chart.filter(dc.filters.RangedFilter(start, end))
						}
						break;
					case 8: //mapChart

						 filterValues = JSON.parse(filterValues)
						 if (filterValues.length>0) {
							var ne = filterValues[0]['_northEast'];
							var sw = filterValues[0]['_southWest'];
                            mapChart.map().fitBounds([L.latLngBounds(ne,sw)])
						 }

						break;
					default:
						for (var i = 0; i < filterValues.length; i++) {
							chart.filter(filterValues[i]);
						}
				}
			}
			
			var value = '';
			var f = chart.filters();
			if (chart.filters().length>0) {
				value = chart.filters()[chart.filters().length-1]
			}

			// Find menu filter corresponding to chart and adjust displayed selected option as selected using dc chart
			for (var filter in filters) {
				var chartx = filters[filter]['chart'];

				if(chartx){
					var chartx_filters = chartx.filters();
					var chart_filters = chart.filters();
					if (chartx_filters == chart_filters) {
						$('#' + filter).val(value);
					}
				}
			}
		}
		if (parsed) {
			dc.renderAll();
			filter(zoneChart, 1);
			filter(crisisChart, 2);
			filter(climateChart, 3);
			filter(timeChart, 4);
			filter(countryChart, 5);
			filterQuery(6);
			filter(topographyChart, 7);
			filter(mapChart, 8);
		}

	}

	d3.select('#query').on('keydown', function() {
		if (d3.event.keyCode == 13) {
			var query = this.value
//				console.log("Searching for " + query);

			queryByString(query);
		}

	});

	/**
	 * if queried by string, all other filters are reset
	 * then the result is queried and the filtered
	 */
	var queryByString = function(query){
		resetAll();
		$("#query").val(query);
		if (query!="") {
			d3.json("api/v0.2/shelters?q=" + query, function(results) {
				if (results != null) {
					filters['queryFilter']['dimension'].filterFunction(function(id) {
						return id in results;
					});
				}
				getFiltersValues();
				redrawAll();
			})
		} else {
			filters['queryFilter']['dimension'].filterAll();
			redrawAll();
		}		
	}

	$('select').on('change', function() {                         // User selected dropdown value
		if (this.id in filters ) {
			var value = this.value
			if (filters[this.id]['chart']) {                      // if dropdown corresponds to a chart - redraw it
				filters[this.id]['chart'].filterAll();            // reset first
				if (value) {
					filters[this.id]['chart'].filter(value);      // filter chart with selected value
				}
                let bounds = [];
                filters['positionFilter']['dimension'].filterAll();
                mapChart.dimension().top(Infinity).forEach(function (d) {
                    bounds.push(new L.latLng(d.gpslatitude, d.gpslongitude));
                });
                if(bounds.length > 0){ //now zoom to the visible markers
                    mapChart.map().fitBounds(bounds, {pan: {animate: true, duration: 1.5, easeLinearity: 0.25}});
                }
				dc.redrawAll();
			} else {                                              // no chart - filter dimension directly
				if (filters[this.id]['dimension']) {
					if (value) {
						filters[this.id]['dimension'].filter(value);
					} else {
						filters[this.id]['dimension'].filterAll();
//							console.log("no value")
					}

					redrawAll();
				}
			}
		}
	});


	var onSliderChange = function onSliderChange(id, values) {                          // User selected range using sliders
		filters[id]['dimension'].filter(values);
		redrawAll();
	}

	var resetAll = function resetAll(){
		// reset all dimensions, if chart is associated, reset it via chart
		for (var id in filters) {
			if (filters[id]['chart']) {
				filters[id]['chart'].filterAll();
			} else {
				filters[id]['dimension'].filterAll();
			}
		}

		// reset map
		setMapView(mapChart)

		// reset inputs
		$("select").val("");
		$("#query").val("");
		for (var id in filters) {
			if (filters[id]['slider']) {
				filters[id]['slider'].setValue([0, filters[id]['maxValue']]);
			}
		}	
	}


	d3.select('#all').on('click', function () {   //    Reset All Filters
		resetAll();
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

	var redrawAll = function redrawAll() {
		    console.log('redrawAll called')
		dc.renderAll();
		dc.redrawAll();
		generateShelterList(allDimensions.top(Infinity));
	}

	 initFilters();
	 redrawAll();

})



// Serializing filters values in URL


var getFiltersValues = function getFiltersValues() {
	var filterValues = [
		{name: 'zone', value: zoneChart.filters()},
		{name: 'crisis', value: crisisChart.filters()},
		{name: 'climate', value: climateChart.filters()},
		{name: 'time', value: timeChart.filters()},
		{name: 'country', value: countryChart.filters()},
		{name: 'query', value: $('#query').val()},
		{name: 'topography', value: topographyChart.filters()},
		{name: 'map', value: JSON.stringify(mapChart.filters())}
	];

	var recursiveEncoded = $.param(filterValues);
//		console.log('timeChart filters', timeChart.filters());
//		console.log('timeFilter', filters['timeFilter']['dimension'].top(Infinity))
	location.hash = recursiveEncoded;
}

var addLayersToChart = function addLayersToChart(mapChart) {

	var redCrossLayer = L.tileLayer.wms("https://shelter-database.org:8080/geoserver/shelters/wms", {
		layers: 'shelters:redcross',
		transparent: true,
		opacity: 0.5

	});""

	var koeppenGeigerLayer = L.tileLayer.wms("https://shelter-database.org:8080/geoserver/shelters/wms", {
		layers: 'shelters:koeppen-geiger',
		transparent: true,
		opacity: 0.5
	});


	var googleSat = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
		layers: 'Satellite',
		transparant: true,
		opacity: 0.5,
		maxZoom: 20,
		subdomains:['mt0','mt1','mt2','mt3'],
		attribution: 'Map data &copy;2016 Google'
	});

	var countryStyle = {
		"color": 'black',
		"weight": 1,
		"opacity": 0.65,
		"fillColor": 'white'
	};

	var countryLayer = new L.GeoJSON.AJAX("/static/data/countries_merge.geojson", {style: countryStyle});

	var overlayMaps = {
		"OpenStreetMap" : baseLayer,
		"Climate simplified classification": redCrossLayer,
		"Koeppen-Geiger": koeppenGeigerLayer,
		"Google Satellite": googleSat,
		"Country borders": countryLayer
	};

	mapChart._doRender()
	var map = mapChart.map()

	map.addLayer(redCrossLayer)
	L.control.layers(null, overlayMaps).addTo(map);

	// add legend control
	var Legend =  new L.Control.Legend({
			position: 'topright',
			collapsed: true,
			controlButton: {
				title: "Legend"
			}
	});

	map.addControl( Legend );

	$(".legend-container").append( $("#legend") );
	$(".legend-toggle").append( "<i class='icon legend-icon icon-info icon-size-2' style='color: #000'></i>" );



};

var setMapView = function(mapChart) {
	// sets Max Zoom depending on screen width,
	// centers map

	//var windowWidth = $(window).width();
	//var maxZoom = 0;
	//if (windowWidth > 767) {
		//maxZoom = 1;
	//}
	//mapChart.map().setView(mapCenter,maxZoom);
    let bounds = []
    mapChart.dimension().top(Infinity).forEach(function (d) {
        bounds.push(new L.latLng(d.gpslatitude, d.gpslongitude));
    });
    if(bounds.length > 0){ //now zoom to the visible markers
        mapChart.map().fitBounds(bounds, {pan: {animate: true, duration: 1.5, easeLinearity: 0.25}});
    }
}

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



var generateShelterList  = function generateShelterList(data) {
	$('#shelterList').empty();
	for (var i = 0; i <data.length; i ++)
	{
		var thumbnailUrl = '/static/img/no-thumbnail.png';
		if(data[i].hasOwnProperty("thumbnailUrl")){
		 thumbnailUrl = '/' + data[i].thumbnailUrl;
		}
		
		var shelterList = d3.select('#shelterList');
		var shelter = shelterList.append('div')
									.attr('class', 'shelter')
									.attr('data-location', "/shelter/" + data[i].db_id)
										.on("click", function() { 
													window.location = $(this).data('location');
											  });
		
		shelter.append('div')
				.attr('class', 'lazy image')
				.attr('data-original', thumbnailUrl);
					
		
		var title = shelter.append('h4')
							.attr('class', 'title');
		
		var titleLink = title
						 .append('a')
							.attr('href', '/shelter/' + data[i].db_id)
						 .text(data[i].nameofshelter);
		
		shelter.append('div')
				.attr('class', 'country')
				.text(data[i].country);
		
		shelter.append('div')
				.attr('class', 'country')
				.text(function(d) { 
									var year = data[i].yearofconstructionfirstcompletedshelters;
								    if (typeof year !== 'undefined') {
										return year.getFullYear();
									}
			
									return '';
								}
					);
		
		shelter.append('div')
				.attr('class', 'country')
				.text(data[i].climatezone);
							
		/**
		var shelter = $('<div class="shelter"/>').appendTo('#shelterList');
		shelter.append('<div class="lazy image" data-original="'  + thumbnailUrl  + '"></div> ' +
			'<h4 class="title"><a href="/shelter/' + data[i].db_id + '">' +data[i].nameofshelter+ '</a></h4>'  +
			'<div class="country">'+data[i].country+'</div> ' +
			'<div class="country">Year: '+data[i].yearofconstructionfirstcompletedshelters.getFullYear() +'</div> ' +
			'<div class="country">Climate zone: ' + data[i].climatezone + '</div>');**/
	}

	$("div.lazy").lazyload({
		  effect : "fadeIn"
	});

}

function print_filter(filter){
	var f=eval(filter);
	if (typeof(f.length) != "undefined") {}else{}
	if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
	if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
	console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
} 


