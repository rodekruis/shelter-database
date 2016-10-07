/**
 * EDIT-SHELTER : edit-shelter.js
 */
 
if(loc.indexOf('shelter/edit') > -1) {
 
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
	var createDropzone = function(id, shelter_id, section, category_id){

		var dropzone = $('#' + id).dropzone({ url: "/shelter/edit/multi/" + shelter_id + '/' + category_id + '/' + section});
		  
		Dropzone.options[id] = {
		  paramName: "file", // The name that will be used to transfer the file
		  uploadMultiple: true,
		  parallelUploads: 1,
		  maxFilesize: 4, // MB
		  acceptedFiles: "image/*",
		};
		
		// add class
		$('#' + id).addClass('dropzone');
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

	/**
	 * LOGIC
	 */
	$('select.expandable').each(function() { $(this).attr('size', $(this).find('option').length) })	
	
	$('.dropzonediv').each(function() { 
		createDropzone($(this).attr('id'), $(this).data("shelter-id"), $(this).data("sub-category"), $(this).data("sub-category-id"))
	});
}