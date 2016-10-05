if(loc.indexOf('shelter') > -1) {

	/**
	 * VARIABLES
	 */
	var modalPage = 0;
	var modalName = "";
	var translation = {};
	var attributes;
	var shelter;
	
	/**
	 * FUNCTIONS
	 */
	var modalOpen = function modalOpen(modalid){
		modalName = modalid
		$("#wrapper").addClass("modal-open")
		$("#" + modalid).css("visibility", "visible")
		setPage(1)
	}
	var modalClose = function modalClose(){
		$("#wrapper").removeClass("modal-open")
		$("#" + modalName).css("visibility", "hidden")
		modalName = ""
		modalResetPages()
	}
	var modalPrev = function modalPrev(){
		setPage(modalPage - 1)
	}
	var modalNext = function modalNext(){
		setPage(modalPage + 1)
	}
	var setPage = function setPage(page){
		modalPage = page
		modalResetPages()
		$(".mymodal .page" + page).css("display", "block")
	}
	var modalResetPages = function modalResetPages(){
		$(".mymodal .page").each(function(el){
			$(this).css("display", "none")
		})
	}	

	var getTranslations = function getTranslations(callback){
		if(language !== 'en'){
			d3.json('/api/v0.2/translation/' + language, function (error, data) {
				translation = data;
				
				callback(null);
			});
		}
		
		callback(null);
	};

	var getAttributes = function getAttributes(callback){
		d3.json('/api/v0.2/attributes/pictures/en', function (error, data) {
			attributes = data;
			
			callback(null);
		});
	};

	var getShelter = function getShelter(callback){
		d3.json('/api/v0.2/shelters/' + shelter_id + '?format=prettytext', function (error, data) {
			shelter = data;
			
			callback(null);
		})
	};

	// add spinner
	$('#wrapper').spin();
		
	var parseShelter = function parseShelter(){
		
		// if shelter or attribute queries have failed, show error. 
		// if translation query failes, default to english
		if(jQuery.isEmptyObject(shelter) || jQuery.isEmptyObject(attributes)){
			$("#alert_template button").after('<span>We were unable to retrieve the data for this shelter.</span>');
			$('#alert_template').fadeIn('slow');
			
			// stop spinner
			$('#wrapper').spin(false);
			
			// break out of function
			return;
		}
		
		// Sorted array of categories
		var categories = [
					'Identification',
					'General',
					'Disaster & Response', 
					'Site',
					'Foundation',
					'Beams & floor', 
					'Cladding', 					 
					'Insulation', 
					'Openings', 
					'Roof', 
					'Services', 
					'Skin', 
					'Spaceplan', 
					'Walls & frame'
				  ];
					  
		// create sections for different categories
		var data = shelter[shelter_id];
		var index = 0;
		$.each(categories, function(index, category) {
			if(typeof data[category] !== 'undefined') {
				createCategory(index, category, data[category]['Attributes']);
				index = index + 1;
			}
		});
		
		if(typeof shelter[shelter_id]['Identification'] !== 'undefined') {
			// Set shelter name
			$('#shelter-name').text(shelter[shelter_id]['Identification']['Attributes']['Name of shelter']);
			
			// Get coordinates for this shelter
			var lat = shelter[shelter_id]['Identification']['Attributes']['GPS Latitude'];
			var lon = shelter[shelter_id]['Identification']['Attributes']['GPS Longitude'];
			
			// Initiate leaflet map
			var map = L.map('location-map', {tap:false, dragging:false}).setView([lat, lon], 13);
			
			// Add OSM base layer
			L.tileLayer('http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png').addTo(map);
			
			// disable dragging and scrolling for mobile view
			map.scrollWheelZoom.disable();
			map.dragging.disable();
			
			// add location of shelter to map
			L.marker([lat, lon]).addTo(map);
				
			// add pictures
			addCoverPictures('#coverpicture', '#coverpictureprint', shelter[shelter_id]['Identification']);
			addSwipePictures('#modalIdentification', shelter[shelter_id]['Identification']);
			
			// convert map to image for better printing
			leafletImage(map, function(err, canvas) {
				// now you have canvas
				// example thing to do with that canvas:
				$('#location-image').prepend('<img id="location-image-picture" src="'+ canvas.toDataURL() + '" />')		
			});
		}

		// stop spinner if all has loaded
		$('#wrapper').spin(false);
	};

	var addCoverPictures = function addCoverPictures(coverpicture, printpicture, section){
		if(typeof section['Cover'] !== 'undefined' && section['Cover'].length > 0) {
			$(coverpicture).css("background-image", "url('/" + section['Cover'][0] + "')");	
			$(printpicture).attr("src", "/" + section['Cover'][0]);					
		}
	}

	var addSwipePictures = function addSwipePictures(elementId, section){
		if(typeof section['Pictures'] !== 'undefined') {
		
			//merge arrays
			var d = $.merge(section.Cover, section.Pictures);
			
			// add panes
			d3.select(elementId + "Panes")
			   .selectAll("div")
			   .data(d)
			   .enter()
			   .append("div")
				   .attr("class","pane")
				   .attr("style",function (d){ return "background-image:  url('/" + d + "')";});
			
			// add dots
			var dot = 0;
			
			d3.select(elementId + "Dots")
			   .selectAll("div")
			   .data(d)
			   .enter()
			   .append("div")
				   .attr("class","dot")
				   .attr("onclick",function (d){ 
					var r = "_swipe.show(" + dot + ",0,true)";
					dot++;
					return r;
				});
		}
		
		// dynamically load swipe, because created dots need to be ready
		$.getScript(path + 'js/swipe.js');
	}

	var createCategory = function createCategory(index, category, d) {

		var columns = d3.keys(d);
		
		// if there is no data for this category, skip
		if(jQuery.isEmptyObject(columns)){
			return;
		}		
		
		// convert object keys to an attribute value pair
		var data = Object.keys(d).map(function(k) { return {attribute:k, value:d[k]} })
		
		var sections = d3.select('#sections');
		var section = sections.append('section')
						.attr('class', 'details details-' + ((index %2) + 1) );
						
		var content = section.append('div')
						.attr('class', 'content');
						
		content.append('h3')
			.text(category);
			
		var table = content.append('table');
		var	tbody = table.append('tbody');

		// create a row for each object in the data
		var rows = tbody.selectAll('tr')
		  .data(data)
		  .enter()
		  .append('tr');

		// Add column with attribute names
		rows.append('th').append('b')
			.text(function (d) { 
				if(language == 'en' || jQuery.isEmptyObject(translation) || typeof(translation[d.attribute]) == 'undefined'){
					return d.attribute;
				}
				else {
					// return translated attribute name
					return translation[d.attribute]; 
				}				
			});
		 
		// Add column with values
		rows.append('td')
				.text(function (d) { return d.value.replace(new RegExp(';', 'g'), ', '); })
			.append('span')
				.attr("class", function (d) { 
					// TODO test if attribute has drawing
					if(hasOwnProperty.call(attributes, category) && hasOwnProperty.call(attributes[category], d.attribute)){
						return "info attribute-multimedia-asset";
					}
					else {
						return '';
					}
				})
				.attr("attribute-name", function (d) { return d.attribute;})
				.attr("section-name", function (d) { return category;});
	}

	var show_multimedia_assets = function show_multimedia_assets(e) {
		var attribute = $(this).attr("attribute-name");
		var section = $(this).attr("section-name")
		
		if(hasOwnProperty.call(attributes, section) && hasOwnProperty.call(attributes[section], attribute)){
			var drawings = attributes[section][attribute];
		
			// empty modal list of pictures
			$('#listOfPictures').empty();
			drawings.map(function(picture) {
				var oImg = $('<img />')
							.attr('src', '/' + picture)
							.attr('alt', attribute)
							.attr('title', attribute)
							.attr('class', 'attribute-drawing');
					
				$('#listOfPictures').append(oImg);
				$('#listOfPictures').append($('<hr>'));
			});
			
			$('#listOfPictures hr:last-child').remove();
			modalOpen('infoDialog')
		}
	}
	
	/**
	 * EVENTS
	 */
	$(document).on('click', '.attribute-multimedia-asset' , show_multimedia_assets);
	
	/**
	 * LOGIC
	 */
	 
	var q = d3.queue();
	q.defer(getTranslations);
	q.defer(getAttributes);
	q.defer(getShelter);
	q.await(function(error) {
	  if (error) throw error;
	  
	  parseShelter();
	});
}