var request = require('request');

ROOT_URL = 'http://127.0.0.1:5000/api'
API_EVENT = ROOT_URL + '/event'

// Creation of puchases

var events = [
            {
                state: 'stocking',
                date: '2016-02-12T00:00:00Z',
                material_id: 2301,
                zone_id: 1
            }
        ]

events.map(function(event){
    request({
            url: API_EVENT,
            method: 'POST',
            json: event
        },
        function(error, response, body) {
            if(error) {
                console.log(error);
            } else {
                //console.log(response.statusCode, 'User: ', body);
            }
        }
    );
});
