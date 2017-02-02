/**
 * SHELTER : shelter.js
 */

	/**
	 * VARIABLES
	 */
	var modalPage = 0;
	var maxSections = 3;
	var modalName = "";
	var translation = {};
	var attributes;
	var shelter;
	var index = 1;
	var visibleRows = 3;
	
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
		modalResetPages();
		
		//$('.royalSlider').data('royalSlider').destroy();
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
		$.each(categories, function(j, category) {
			if(typeof data[category] !== 'undefined') {
				createCategory(index, category, data[category]['Attributes']);
				index = index + 1;
			}
		});
		
		// set more link for uncollapse sections
		if(index > maxSections){
			var targets = '';
			for(i = maxSections; i < index; i++){
				targets += ',#section-' + i;
			}
			targets = targets.substring(1);
			$('#collapseButton').attr('data-target', targets);
		}
		
		// set identification attributes
		if(typeof data['Identification'] !== 'undefined'){
			createIdentification(data['Identification']);
		}
		
		// set organization
		if(typeof data['Disaster & Response'] !== 'undefined' && 
		   typeof data['Disaster & Response']['Attributes']['Implementing Agency'] !== 'undefined'){
			$('#organization').text(data['Disaster & Response']['Attributes']['Implementing Agency']);
		}
		
		if(typeof data['Documents'] !== 'undefined' && 
		   typeof data['Documents']['Documents'] !== 'undefined' &&
		   data['Documents']['Documents'].length > 0) {
			   
			    $("#section-documents").removeClass('hidden');
				$("#documentslink").removeClass('hidden');
				
				
				var documentsdiv = d3.select('#section-documents"')
								.append("div")
										   .attr("class","flexbox");
										   
				var box = documentsdiv
							   .selectAll("div")
							   .data(data['Documents']['Documents'])
							   .enter()
							   .append("div")
								   .attr("class","box");
										   
				var l = box.append("a")
							.attr('href', function (di){ return "/" + di; } )
							.attr('target', '_blank');					   
							
				var title = l.append('i')
							.attr('class', function (di) {
												var filename = di.replace(/^.*[\\\/]/, '');
												var ext = filename.substr(filename.lastIndexOf('.')+1).toLowerCase();
												
												var c = 'head';
												
												if (ext.match('/(jpg|jpeg|png|gif)$/')) {
													c += ' 	icon-file-image';
												} else if (ext.match('/(ppt|pptx)$/')) {
													c += ' 	icon-file-powerpoint';
												} else if (ext.match('/(doc|docx)$/')) {
													c += ' 	icon-file-word';
												} else if (ext === 'pdf'){
													c += ' icon-file-pdf';
												} else if (ext.match('/(txt)$/')) {
													c += ' icon-doc-text';
												} else if (ext.match('/(mov|avi|mkv|wmv|mpg})$/')) {
													c += ' icon-file-video';
												} else {
													c += ' icon-doc';
												}
												
												return c;
							});
					
				var h4 = l.append('h4')
							.text(function (di){ return di.replace(/^.*[\\\/]/, '') } );
					
				
				
						
			
		}
		
		// Activate slider
		$(".royalSlider").royalSlider({
			transitionType:'fade',
			loop: true,
			arrowsNav: false,
			keyboardNavEnabled: true,
			addActiveClass: true,
			arrowsNav: false,
			fadeinLoadedSlide: false,
			globalCaption: true,
			globalCaptionInside: false,
			imageScaleMode: 'fit-if-smaller',
			autoScaleSlider:false,
			autoHeight: false,
			numImagesToPreload: 0,
			controlNavigation: 'thumbnails',
			thumbs: {
					  appendSpan: true,
					  firstMargin: true,
					  paddingBottom: 4
					},
		  }); 		 
		  
		// glossarize attributes
		glossarize();

		// stop spinner if all has loaded
		$('#wrapper').spin(false);
	};

	var addCoverPictures = function addCoverPictures(section, section_id, category){
		var source = 'Pictures';
		// for identification use cover
		if(section_id === '#section-0' ){
			source = 'Cover';
		}
		
		if(typeof section[source] !== 'undefined' && section[source].length > 0) {
			
			// add panes
			var divprint = d3.select(section_id)
							 .selectAll('div')
								.insert("div",'#section-table-' + index)
									.attr('class', 'shelter-main-image' );
							
				divprint.append('img')
					.attr('src', '/' + section[source][0])
					.attr('id', 'coverpictureprint');
				 
			var divsection = d3.select(section_id)
								.selectAll('div')
									.insert("div", '#section-table-' + index)
										.attr('class', 'shelterimg')
										.attr('id', 'mainimage-' + category)
										.attr('style' , "background-image: url('/" + section[source][0] + "')")	
											.on({
												  "click":  function() { 
														modalOpen('mymodal-' + category);
												  }, 
												});
				var  btn = divsection.append('button')
								.attr('type', 'button')
								.attr('class','btn');
								
				btn.append('span')
						.text('See more photos');
						
		}
	}

	var addSwipePictures = function addSwipePictures(section, category){
		
		if(typeof section['Pictures'] === 'undefined') {
			section['Pictures'] = [];
		}
		
		if(typeof section['Cover'] === 'undefined') {
			section['Cover'] = [];
		}
			
		//merge arrays
		var d = $.merge(section.Cover, section.Pictures);
		
		if(d.length > 0){
			
			// remove the thumbnail if there is one
			for (var i=d.length-1; i>=0; i--) {
				if (d[i].indexOf("_thumbnail") > -1) {
					d.splice(i, 1);
					break;
				}
			}
			
			//if there are no pictures, return
			if(d.length === 0){
				return;
			}
			
			// create modal
			createPicturesModal(d, category);
		}
	}
	
	var createPicturesModal = function createPicturesModal(pictures, name){
		var modal = d3.select("#wrapper")
							.append('div')
								.attr('class', 'mymodal mymodal-dark mymodal-no-scroll')
								.attr('id', 'mymodal-' + name);
								
			modal.append('div')
					.attr('class', 'mymodal-close')
					.on({
						  "click":  function() { 
								modalClose();
						  }, 
						});	
						
			var slider = modal.append('div')
					.attr('class', 'royalSlider rsUni');
								
			// add panes
			slider.selectAll("a")
				   .data(pictures)
				   .enter()
				   .append("a")
					   .attr("class","rsImg")
					   .attr("href", function (di){ return "/" + di; })
					   .text("image description")
				   .append("img")
					   .attr("class", "rsTmb")
					   .attr("src", function (di){ 
										var url = di.substring(0, di.length - 4);
										var ext = di.substring(di.length - 4, di.length);
										return "/" + url + "_thumbnail" + ext; 
									});	
					   
			//<a class="rsImg" href="image.jpg">image description<img src="small-image.jpg" class="rsTmb" /></a>
	}
	
	var createIdentification = function createIdentification(data){
			
		// set main image
		addCoverPictures(data, '#section-0', 'Identification');
		addSwipePictures(data, 'Identification');

		// Set shelter name
		$('#shelter-name').text(data['Attributes']['Name of shelter']);
		
		// set geography
		var geographyAttributes = ['Country', 'Province / District / Region', 'City / Village'];
		var geography = '';
		$.each(geographyAttributes, function( index, value ) {
		  if(typeof data['Attributes'][value] !== 'undefined') {
			  geography += data['Attributes'][value] + ', ';
		  }
		});
		// remove last ,
		geography = geography.substring(0,geography.length - 2);
		
		// set element value
		$('#geography').text(geography);
		
		// set other values
		var otherAttributes = ['ID', 'Survey date', 'Landform', 'Climate zone'];
		$.each(otherAttributes, function( index, value ) {
		  if(typeof data['Attributes'][value] !== 'undefined') {
			  $('#' + value.replace(/\s+/g, '').toLowerCase()).text(data['Attributes'][value]);
		  }
		});

		// create divs
		var content = d3.select('#location');
		var details = content.append('div')
					.attr('class', 'details');
					
		details.append('div')
					.attr('id', 'location-image')
					.attr('class', 'location-image');
					
		var lmap = details.append('div')
					.attr('id', 'location-map')
					.attr('class', 'location-map');
					
		var  btn = lmap.append('button')
								.attr('type', 'button')
								.attr('class','btn');
								
		btn.append('span')
						.text('See more photos');
		
		// Get coordinates for this shelter
		var lat = data['Attributes']['GPS Latitude'];
		var lon = data['Attributes']['GPS Longitude'];
		
		// Initiate leaflet map
		var map = L.map('location-map', {tap:false, dragging:false, fullscreenControl: true}).setView([lat, lon], 13);
		
		map.on('enterFullscreen', function(){
		  map.dragging.enable();
		});

		map.on('exitFullscreen', function(){
		  map.dragging.disable();
		});

		// Add OSM base layer
		L.tileLayer('http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png').addTo(map);
		
		// disable dragging and scrolling for mobile view
		map.scrollWheelZoom.disable();
		map.dragging.disable();
		
		// add location of shelter to map
		var marker = L.marker([lat, lon]);
		marker.addTo(map);
		
		// convert map to image for better printing
		
		leafletImage(map, function(err, canvas) {
			// now you have canvas
			// example thing to do with that canvas:
			d3.select('#location-image')
				.append('img')
					.attr('id', 'location-image-picture')
					.attr('src', canvas.toDataURL());	

			// add the marker popup after the image was made
			marker.bindPopup("GPS location: " + lat + "," + lon).openPopup();
			//marker.addTo(map);
		});
			

	}

	var createCategory = function createCategory(index, category, d) {

		var columns = d3.keys(d);
		
		// if there is no data for this category, skip
		if(jQuery.isEmptyObject(columns)){
			return;
		}		
		
		// convert object keys to an attribute value pair
		var i = 0;
		var data = Object.keys(d).map(function(k) { 
			v = true;
			if(i > visibleRows){
				v = false;
			}
			i++;
			return {attribute:k, value:d[k], visible:v} 
		});
		
		// set collapse class
		var collapse = '';
		//if(index > maxSections) {
		//	collapse = 'collapse ';
		//}
		
		var sections = d3.select('#section-specifications');
		var section = sections.append('section')
						.attr('id', 'section-' + index)
						.attr('class', 'details ' + collapse + 'details-' + ((index %2) + 1) );
						
		var content = section.append('div')
						.attr('class', 'content');
						
		content.append('h3')
			.text(category);
			
		// if there are images, show them
		addCoverPictures(shelter[shelter_id][category], '#section-' + index, category);
		addSwipePictures(shelter[shelter_id][category], category);
										
		var table = content.append('table')
						.attr('id', 'section-table-' + index)
						.attr('class', 'section-data');	
								
		var	tbody = table.append('tbody');

		// create a row for each object in the data
		var rows = tbody.selectAll('tr')
		  .data(data)
		  .enter()
		  .append('tr')
			.attr("class", function(d) { return 'rowVisible_' + d.visible; });

		// Add column with attribute names
		var th = rows.append('th');
			
				th.append('a')
					//.attr('rel', 'tooltip')
					//.attr('title', 'Enter your tip here')
					//.attr('class', 'glossary-link')
					.text(function (d) { 
						if(language == 'en' || jQuery.isEmptyObject(translation) || typeof(translation[d.attribute]) == 'undefined'){
							return d.attribute;
						}
						else {
							// return translated attribute name
							return translation[d.attribute]; 
						}				
					});
				
			th.append('a')
					.filter(function(d){ 
						if(hasOwnProperty.call(attributes, category) && hasOwnProperty.call(attributes[category], d.attribute)){
							return true;
						}
						else {
							return false;
						}
					})
					.attr("class", 'btn-link see-drawing-link')
					.attr("attribute-name", function (d) { return d.attribute;})
					.attr("section-name", function (d) { return category;})
					.text('+ See drawing');	
		 
		// Add column with values
		rows.append('td')
				.text(function (d) { return d.value.replace(new RegExp(';', 'g'), ', '); });
				
		tbody.append('tr')
				.attr("class", 'rowVisible_true')
			 .append('a')
				.attr('class', 'more btn-link')
				.attr('data-table-id', 'section-table-' + index)
				.text('+ More');	
	
		// init tooltip
		tooltip();
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
	
	var goToAnchor = function(anchor){
		window.location = (''+window.location).replace(/#[A-Za-z0-9_-]*$/,'')+anchor;
	}
	
	var glossarize = function glossarize(){
		$('#section-specifications').glossarizer({
		  sourceURL: '/static/data/glossary.json',
		  lookupTagName : 'th, td, a',
		  exactMatch: true,
		  caseSensitive: false,
		  callback: function(){
			new tooltip();
		  }
		});
	}
	
	/**
	 * EVENTS
	 */
	$(document).on('click', '.see-drawing-link' , show_multimedia_assets);
	
	// If the more link is clicked, the depending div will be expanded
	$(document).on('click', '.more', function() {
		// set height to auto
		$('tr.rowVisible_false', "#" + $(this).attr('data-table-id')).removeClass('rowVisible_false');
		// remove the mode button
	    $(this).remove();
	});
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
	
	L.Icon.Default.imagePath = '/static/lib/bower/leaflet/dist/images';