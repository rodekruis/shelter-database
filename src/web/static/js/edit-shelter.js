/**
 * EDIT-SHELTER : edit-shelter.js
 */

/**
 * VARIABLES
 */
var attributes;
 
/**
 * FUNCTIONS
 */
var modalOpen = function modalOpen(modalid){
	modalName = modalid
	$("#wrapper").addClass("modal-open")
	$("#" + modalid).css("visibility", "visible")
}

var modalClose = function modalClose(){
	$("#wrapper").removeClass("modal-open")
	$("#" + modalName).css("visibility", "hidden")
	modalName = ""
}
 
var getAttributes = function getAttributes(callback){
	d3.json('/api/v0.2/attributes/pictures/en', function (error, data) {
		attributes = data;
		
		callback(null);
	});
};
	
function update_free_text_value(value_id, value) {
	new_value = {name: value}

	$.ajax({
		type: 'PUT',
		url: '/api/value/' + value_id,
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify(new_value),
		success: function (result) {
			console.log(result);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			console.log(errorThrown);
		}
	});
}

function new_free_text_property(shelter_id, category_id, attribute_id, value,
								event_target) {
	new_property_dict = {
						"shelter_id": shelter_id,
						"attribute_id": attribute_id,
						"category_id": category_id,
						"values": [
							{
								name:value,
								attribute_id:attribute_id
							}
						]
					}
	$.ajax({
		type: 'POST',
		url: '/api/property',
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify(new_property_dict),
		success: function (result) {
			// set the property-id of the input, so that
			// new time update_property() will be called (HTTP PUT request)
			event_target.attr("value-id", result.values[0].id);
			console.log(result);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			console.log(errorThrown);
		}
	});
}

function new_property(shelter_id, category_id, attribute_id, id_of_values,
						event_target) {
	new_property_dict = {
						"shelter_id": shelter_id,
						"attribute_id": attribute_id,
						"category_id": category_id,
						"values": []
					}
	id_of_values.map(function(id) {
		new_property_dict["values"].push({"id":parseInt(id)})
	})

	$.ajax({
		type: 'POST',
		url: '/api/property',
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify(new_property_dict),
		success: function (result) {
			// set the property-id of the input, so that
			// new time update_property() will be called (HTTP PUT request)
			event_target.attr("property-id", result.id);

			console.log(event_target.attr("property-id"));
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			console.log(errorThrown);
		}
	});
}

function update_property(property_id, id_of_values) {
	new_property_dict = {values: []}
	id_of_values.map(function(id) {
		new_property_dict["values"].push({"id":parseInt(id)})
	})

	$.ajax({
		type: 'PUT',
		url: '/api/property/' + property_id,
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify(new_property_dict),
		success: function (result) {
			console.log(result);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			console.log(errorThrown);
		}
	});
}


// create outside of dom ready, so that it is available when section uploads are created
	var createDropzone = function createDropzone(id, shelter_id, section, category_id){
        var fileId;
		var dropzone = $('#' + id).dropzone({
			  url: "/shelter/edit/multi/" + shelter_id + '/' + category_id + '/' + section,
		  	  paramName: "file", // The name that will be used to transfer the file
			  uploadMultiple: true,
			  parallelUploads: 1,
			  maxFilesize: 4, // MB
			  acceptedFiles: "image/*",
			  addRemoveLinks: true,
			  init: function() {
				this.on("success", function(file, responseText) {
					file.id = responseText; // or however you would point to your assigned file ID here;
				});
			  },
			  removedfile: function(file) {
				x = confirm('Do you want to delete this file?');
				if(!x)  return false;

				$.post( "/shelter/delete_picture/" + file.id, function() {
					$(document).find(file.previewElement).remove();
				})
				  .fail(function() {
					alert( "file was not correctly deleted" );
				  });
			  }
			 });
			
		// add class
		$('#' + id).addClass('dropzone');
	}

// create dropdown and add glossary items upon open
var prepareSelect = function prepareSelect(id){
	$('#' + id).selectize({
				valueField: 'id',
				labelField: 'title',
				create: false,
				sortField: {
					field: 'title',
					direction: 'asc'
				},
				dropdownParent: 'body',
				onDropdownOpen: function onDropdownOpen(dropdown){
					dropdown.glossarizer({
					  sourceURL: '/static/data/glossary.json',
					  lookupTagName : 'div',
					  exactMatch: true,
					  caseSensitive: false,
					  callback: function(){
						new tooltip();
					  }
					});
				},
				onItemAdd: function onItemAdd(value, $item){
					$('#tooltip').remove();
				},
				onDropdownClose: function onDropdownClose(dropdown){
					$('#tooltip').remove();
				}
			});
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
$('.select-attribute').change(function(evt) {
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
		new_property($('#shelterForm').data("shelter-id"),
						category_id, attribute_id, id_of_values,
						$(evt.target))
	} else {
		update_property(property_id, id_of_values)
	}
});

$('.free-text-attribute').change(function(evt) {
	value = $(evt.target).val();
	if ($(evt.target).attr('type') == "checkbox") {
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
		new_free_text_property($('#shelterForm').data("shelter-id"), category_id,
									attribute_id, value, $(evt.target));
	}
});

$('.add-value').click(function(evt) {
	attribute_id = $(evt.target).attr('attribute-id');
	$('#addValueDialog').attr('attribute-id', attribute_id);
	$('#addValueDialog').modal({backdrop:'static', keyboard:false});
})

$('#add-new-value').click(function(evt) {

	new_value = {
		attribute_id: $('#addValueDialog').attr('attribute-id'),
		name: $('#new-value-input').val()
	}
	$.ajax({
		type: 'POST',
		url: '/api/value',
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify(new_value),
		success: function (result) {
			$('#select'+attribute_id)
				.append($("<option></option>")
							.attr("value", result.id)
							.text(result.name));
			$('.selectpicker').selectpicker('refresh');
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			console.log(errorThrown);
		}
	});
})

$(document).on('click', '.see-drawing-link' , show_multimedia_assets);

/**
 * LOGIC
 */
 
var q = d3.queue();
	q.defer(getAttributes);
	q.await(function(error) {
	  if (error) throw error;
	  
	  
	});

Dropzone.autoDiscover = false;

$('.dropzonediv').each(function() { 
	createDropzone($(this).attr('id'), $(this).data("shelter-id"), $(this).data("sub-category"), $(this).data("sub-category-id"))
});

$("select").each(function() {
    prepareSelect($(this).attr('id'));
});