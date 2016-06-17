function create_shelter (name_of_shelter, country_value_id, country_name) {
    new_shelter_dict = {} // the id of the shelter's owner is controlled by a POST preprocessor function
    $.ajax({
        type: 'POST',
        url: '/api/shelter',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(new_shelter_dict),
        success: function (new_shelter) {
            // creation of the shelter OK
            //console.log(new_shelter);


            // Creation of the property: Name of shelter
            var filters = [{"name":"name","op":"eq","val":"Name of shelter"}];
            $.ajax({
                type: 'GET',
                url: '/api/attribute',
                contentType: "application/json",
                dataType: "json",
                data: {"q": JSON.stringify({"filters": filters})},
                success: function(result) {
                    attribute_id = result.objects[0].id;
                    category_id = result.objects[0].category_id;
                    new_property = {
                        shelter_id: new_shelter.id,
                        attribute_id: attribute_id,
                        category_id: category_id,
                        values : [{
                            name: name_of_shelter,
                            attribute_id: attribute_id
                        }]
                    }
                    $.ajax({
                        type: 'POST',
                        url: '/api/property',
                        contentType: "application/json",
                        dataType: "json",
                        data: JSON.stringify(new_property),
                        success: function (result) {
                            console.log(result);






                            // Creation of the property: Country
                            var filters = [{"name":"name","op":"eq","val":"Country"}];
                            $.ajax({
                                type: 'GET',
                                url: '/api/attribute',
                                contentType: "application/json",
                                dataType: "json",
                                data: {"q": JSON.stringify({"filters": filters})},
                                success: function(result) {
                                    attribute_id = result.objects[0].id;
                                    category_id = result.objects[0].category_id;
                                    new_property = {
                                        shelter_id: new_shelter.id,
                                        attribute_id: attribute_id,
                                        category_id: category_id,
                                        values : [{
                                            id: country_value_id
                                        }]
                                    }
                                    $.ajax({
                                        type: 'POST',
                                        url: '/api/property',
                                        contentType: "application/json",
                                        dataType: "json",
                                        data: JSON.stringify(new_property),
                                        success: function (result) {
                                            console.log(result);


                                            // Creation of the property: ID
                                            var filters = [{"name":"name","op":"eq","val":"ID"}];
                                            $.ajax({
                                                type: 'GET',
                                                url: '/api/attribute',
                                                contentType: "application/json",
                                                dataType: "json",
                                                data: {"q": JSON.stringify({"filters": filters})},
                                                success: function(result) {
                                                    new_property = {
                                                        shelter_id: new_shelter.id,
                                                        attribute_id: result.objects[0].id,
                                                        category_id: result.objects[0].category_id,
                                                        values : [{
                                                            name: getCountryCode(country_name)+new_shelter.id,
                                                            attribute_id: result.objects[0].id
                                                        }]
                                                    }
                                                    $.ajax({
                                                        type: 'POST',
                                                        url: '/api/property',
                                                        contentType: "application/json",
                                                        dataType: "json",
                                                        data: JSON.stringify(new_property),
                                                        success: function (result) {
                                                            console.log(result);

                                                            window.location = '/shelter/' + new_shelter.id + '/generalInformation';
                                                        },
                                                        error: function(XMLHttpRequest, textStatus, errorThrown){
                                                            console.log(errorThrown);
                                                        }
                                                    });
                                                },
                                                error: function(XMLHttpRequest, textStatus, errorThrown){
                                                    //alert(errorThrown);
                                                }
                                            })











                                        },
                                        error: function(XMLHttpRequest, textStatus, errorThrown){
                                            console.log(errorThrown);
                                        }
                                    });
                                },
                                error: function(XMLHttpRequest, textStatus, errorThrown){
                                    //alert(errorThrown);
                                }
                            })
















                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown){
                            console.log(errorThrown);
                        }
                    });
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    //alert(errorThrown);
                }
            })
















        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log(errorThrown);
        }
    }); // end POST api Shelter
}
