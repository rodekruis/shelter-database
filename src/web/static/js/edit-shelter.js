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
            event_target.attr("value-id", result.id);
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
