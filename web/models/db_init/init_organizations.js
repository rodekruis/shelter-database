var request = require('request');

ROOT_URL = 'http://127.0.0.1:5000/api'
API_ORGANIZATION = ROOT_URL + '/organization'

// Creation of organizations

var organizations = [
                {
                    name : 'LIST Bâtiment',
                    id:1
                 },
                 {
                    name : 'The Stage GmBH',
                    id:2
                 },
                 {
                    name : 'Acier Guernassassin SA',
                    id:3
                 },
                 {
                    name : 'LuxDuck Elec',
                    id:4
                 },
                 {
                    name : 'Houz & Beck Plomberie',
                    id:5
                 },
                 {
                    name : 'Osblec Echaff',
                    id:6
                 },
             ];

organizations.map(function(organization){
    request({
            url: API_ORGANIZATION,
            method: 'POST',
            json: organization
        },
        function(error, response, body) {
            if(error) {
                console.log(error);
            } else {
                //console.log(response.statusCode, 'Organization: ', body);
            }
        });
});
