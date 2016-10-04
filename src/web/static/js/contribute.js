
/**
 * Created by nlrc on 22-7-16.
 */

if("/contribute" === loc) {
	
	var modalPage = 0
	var modalName = ""
	var modalOpen = function(modalid){
		modalName = modalid
		$("#wrapper").addClass("modal-open")
		$("#" + modalid).css("visibility", "visible")
		setPage(1)
	}
	var modalClose = function(){
		$("#wrapper").removeClass("modal-open")
		$("#" + modalName).css("visibility", "hidden")
		modalName = ""
		modalResetPages()
		
		// reset form
		resetForm();
		
	}
	var modalPrev = function(){
		setPage(modalPage - 1)
	}
	var modalNext = function(formId){
		if(! $(formId).isValid({}, {}, true) ) {
			return;
		}
		setPage(modalPage + 1)
	}
	var setPage = function(page){
		modalPage = page
		modalResetPages()
		console.log(page)
		console.log($(".mymodal .page" + page))
		$(".mymodal .page" + page).css("display", "block")
		
		// trigger event that class changed
		$('#modalcontent').trigger('page'+page);
	}
	var modalResetPages = function(){
		$(".mymodal .page").each(function(el){
			$(this).css("display", "none")
		})
	}
	
	var cleanFilename = function (name) {
	   return name.toLowerCase().replace(/[^\w]/gi, '');
	};

	var fetchCountries = function (){
			var filters = [{"name":"name","op":"eq","val":"Country"}];
			$.ajax({
				type: 'GET',
				url: '/api/attribute',
				contentType: "application/json",
				dataType: "json",
				data: {"q": JSON.stringify({"filters": filters})},
				success: function(result) {
					result.objects[0].associated_values.map(function(country) {
						$("#countrySelect").append(new Option(country.name, country.id));
					});
					$("#countrySelect").val([]);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown){
					//alert(errorThrown);
				}
			}) ;
		};

	var fetchAssociatedDisasters = function (){
			var filters = [{"name":"name","op":"eq","val":"Associated disaster / Immediate cause"}];
			$.ajax({
				type: 'GET',
				url: '/api/attribute',
				contentType: "application/json",
				dataType: "json",
				data: {"q": JSON.stringify({"filters": filters})},
				success: function(result) {
					result.objects[0].associated_values.map(function(disaster) {
						$("#associatedDisasterSelect").append(new Option(disaster.name, disaster.id));
					})
				},
				error: function(XMLHttpRequest, textStatus, errorThrown){
					//alert(errorThrown);
				}
			}) ;
	};

	var fetchShelterTypes = function (){
			var filters = [{"name":"name","op":"eq","val":"Type of shelter"}];
			$.ajax({
				type: 'GET',
				url: '/api/attribute',
				contentType: "application/json",
				dataType: "json",
				data: {"q": JSON.stringify({"filters": filters})},
				success: function(result) {
					result.objects[0].associated_values.map(function(shelter) {
						$("#shelterTypeSelect").append(new Option(shelter.name, shelter.id));
					})
				},
				error: function(XMLHttpRequest, textStatus, errorThrown){
					//alert(errorThrown);
				}
			}) ;
	};

	var dropzone;
	var createDropzone = function(){

		dropzone = $("div#uploader").dropzone({ url: "/shelter/edit/multi/" + shelter_id + '/' + category_id + '/General information'});
		Dropzone.options.uploader = {
		  paramName: "file", // The name that will be used to transfer the file
		  uploadMultiple: true,
		  parallelUploads: 1,
		  maxFilesize: 4, // MB
		  acceptedFiles: "image/*",
		};
		
		// add class
		$('div#uploader').addClass('dropzone');
	}

	var shelter_id;

	initiateLocationPicker();

	$("#newShelter").click(function(evt) {
		
		// fetch shelters
		fetchCountries();
		
		//fetch disaster types
		fetchAssociatedDisasters();
		
		//fetch shelter types
		fetchShelterTypes();
	});

	// initiate form validator
	$.validate();

	$(".organizations").select2({
		  tags: true,
		  createTag: function (params) {
			return {
			  id: params.term,
			  text: params.term,
			  newOption: true
			}
		  },
		  templateResult: function (data) {
			var $result = $("<span></span>");

			$result.text(data.text);

			if (data.newOption) {
			  $result.append(" <em>(new)</em>");
			}

			return $result;
		  },
		  ajax: {
			url: "https://www.humanitarianresponse.info/api/v1.0/organizations?autocomplete[operator]=CONTAINS&fields=label,id",
			dataType: 'json',
			delay: 250,
			data: function (params) {
			  return 'autocomplete[string]=' + params.term; // search term
			},
			processResults: function (data, page) {
			  // parse the results into the format expected by Select2.
			  // since we are using custom formatting functions we do not need to
			  // alter the remote JSON data
			  
			  var keys = Object.keys(data.data);
			  var items = [];
			  for (var j=0; j < keys.length; j++) {
				items.push({
					id: j,
					text: data.data[keys[j]]
				});
			  }
			  
			  return {
				
				results: items
			  };
			},
			cache: true
		  },
		  escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
		  minimumInputLength: 1
			
	}); 

	//Attach a submit handler to the form (only allow to click once)
	$('#createShelter').on( "click", function() {
		if(! $('#createShelterForm').isValid({},{}, true) ) {
			return;
		}
		
		// check if form was already submitted
		var submitted = $('#createShelterForm').attr('submitted');
		if (typeof submitted !== typeof undefined && submitted !== false) {
			return;
		}
		
		// set form to submitted
		$('#createShelterForm').attr('submitted', 'yes');
		
		// start spinner
		$('#wrapper').spin();		

		// Send the data using post
		name_of_shelter = $('#titleofproject').val();
		country_value_id = $('#countrySelect option:selected').val();
		country_name = $('#countrySelect option:selected').text()
		create_shelter(name_of_shelter, country_value_id, country_name, function (success, result){
			if(!success){
				console.log(result);
			} else {
				shelter_id = result;
				
				// create dropzone
				createDropzone();		
				
				// update the map given the country
				updateLocationPicker();
				
				// add spinner
				$('#wrapper').spin(false);

				// go to next page
				modalNext();
				
				// Make sure we can submit the form again for a new shelter
				$('#createShelterForm').removeAttr('submitted');
				
				
			}
		});
	});
		
	function findCountry(data, country){
		var countryData = {};
		$.each(data.features, function (key, val) {
			if (val.properties.other_name === country) {
				countryData.lat = val.properties.lat;
				countryData.lon = val.properties.lon;
				countryData.polygon = val;
				
				//if found, break out of loop
				return false;
			}
		});
		
		//return object (or empty object)
		return countryData;
	};

	var countries = {};
	var layerGroup, marker, locationpicker, bounds;

	function initiateLocationPicker (){

		//set encoding
		$.ajaxSetup({
			scriptCharset: "utf-8",
			contentType: "application/json; charset=utf-8"
		});

		//get data from api
		$.getJSON("/static/data/countries_merge.geojson", function(data) {
			// set countries
			countries = data;
						
			// Initiate leaflet map
			locationpicker = L.map('locationpicker').setView([51.505, -0.09], 13);
			
			// Add OSM base layer
			L.tileLayer('http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png').addTo(locationpicker);		
			
			// Add Mapzen geocoder 
			L.control.geocoder('search-Us5vhhe', {panToPoint: true, markers: false, attribution: null}).addTo(locationpicker);
			
			// Create group for your layers and add it to the map
			layerGroup = L.layerGroup().addTo(locationpicker);
			
			// add marker
			marker = L.marker([0,0], {draggable:'true'}).bindLabel('This is where I have built this shelter');
			marker.addTo(locationpicker);
			
			// add listeners	
			locationpicker.on('click', function(e) {        
				var location = e.latlng;
				marker.setLatLng(location).update();
				setLocation(e.latlng);
			});	
		});
	};

	var updateLocationPicker = function(){
		//Query nomatimim for lat lon for country
		var country = $('#countrySelect option:selected').text();
		
		var countryData = findCountry(countries, country);
			
		if(jQuery.isEmptyObject(countryData)){
		  //country was not found
		  //TODO: handle error
		  return;
		} 
		
		// remove all layers
		layerGroup.clearLayers();
		
		// Add country polygon to map and fit map to bounds
		var countryLayer = L.geoJson(countryData.polygon).addTo(layerGroup);
		
		// listen to clicks on the layer to set the marker
		countryLayer.on('click', function(e) {        
			var location = e.latlng;
			marker.setLatLng(location).update();
			setLocation(e.latlng);
		});	
		
		// set position of marker to centroid of country
		var centroid = {lat: countryData.lat, lng: countryData.lon};
		marker.setLatLng(centroid); 
		
		// Add the location to the database, in case the user doesn't drag the marker
		setLocation(centroid);
		
		marker.on('dragend', function(event){
			var position = event.target.getLatLng();
			setLocation(event.target.getLatLng());
			marker.setLatLng(position,{draggable:'true'}).bindPopup(position).update();
		});
		
		// fit map to bounds of country
		bounds = countryLayer.getBounds();
		//locationpicker.fitBounds(bounds);				
	}

	var setLocation = function(latlng){
		$('#latitude').val(latlng.lat).trigger('change');
		$('#longitude').val(latlng.lng).trigger('change');		
	}

	// listen when page3 with leaflet map is opened
	$('#modalcontent').on('page3', function(){ 
		locationpicker.invalidateSize();
		locationpicker.fitBounds(bounds);
	});

				
	$('#organizations').on("select2:select", function (e) { 
		$(e.target).validate(function(valid, elem) {
			if(!valid){
				return;
			}
		});
		value_id = $(e.target).attr("value-id");
		var value = e.params.data.text;

		if (value_id != "None") {
			update_free_text_value(value_id, value);
		} else {
			var category_id = $('.organizations').attr("category-id");
			var attribute_id = $('.organizations').attr("attribute-id");
			new_free_text_property(shelter_id, category_id, attribute_id, value, $(e.target));
		}
	});


	$('.select-attribute').change(function(evt) {
		$(evt.target).validate(function(valid, elem) {
			if(!valid){
				return;
			}
		});
		
		property_id = $(evt.target).attr("property-id");
		id_of_values = $(evt.target).val();
		if (typeof id_of_values === 'string') {
			tmp = []
			tmp.push(id_of_values)
			id_of_values = tmp
		}

		if (property_id==""){
			category_id = $(evt.target).attr("category-id");
			attribute_id = $(evt.target).attr("attribute-id");
			new_property(shelter_id,
							category_id, attribute_id, id_of_values,
							$(evt.target));
		} else {
			update_property(property_id, id_of_values);
		}
	});

	$('.free-text-attribute').change(function(evt) {
		$(evt.target).validate(function(valid, elem) {
			if(!valid){
				return;
			}
		});
		
		if( $(evt.target).hasClass('required-input') && !$(evt.target).val() ) {
			// add myerror class to parent div
			$(this).parent().parent().addClass('myerror');
		} else {
			// remove myerror class
			$(this).parent().parent().removeClass('myerror');
			// edit attribute
			editFreeTextOrDate(evt);
		}				
	});

	var editFreeTextOrDate = function (evt){
		value = $(evt.target).val();
		if ($(evt.target).context.type == "checkbox") {
			if (value == "on" || value == "1") {
				value = "0";
			} else {
				value = "1";
			}
		}
		value_id = $(evt.target).attr("value-id");

		if (value_id != "None") {
			update_free_text_value(value_id, value);
		} else {
			category_id = $(evt.target).attr("category-id");
			attribute_id = $(evt.target).attr("attribute-id");
			new_free_text_property(shelter_id, category_id, attribute_id, value, $(evt.target));
		}
	}
		
	var resetForm = function(){
		//reset shelter title field
		$('#titleofproject').val('');
		$('#countrySelect').val('');
		$('#organizations').val('');
		$('#yearofconstructionfirstshelters').val('');
		$('#latitude').val('');
		$('#longitude').val('');
		$('#associatedDisasterSelect').val('');
		$('#shelterTypeSelect').val('');
		$('#unitCosts').val('');
		$('#inhabitants').val('');
		$('#surface').val('');
		
		if (dropzone != undefined) {
			Dropzone.forElement("div#uploader").destroy();
		}
		
		
	}
	
	/**
	var optClick = function(nr){
		var elements = document.getElementsByClassName('option')
		var length = elements.length

		while(length--) {
			elements[length].className = "option"
		}
		elements[nr].className = "option selected"
	}**/
}