var request = require('request');

ROOT_URL = 'http://127.0.0.1:5000/api'
API_ACTIVITY = ROOT_URL + '/activity'

// Creation of Activities

var activities = [
                {
                    id: 1,
                    name: 'Verticaux',
                    css: 'post-itVerticaux',
                    display_order: 1
                },
                {
                    id: 2,
                    name: 'Horizontaux',
                    css: 'post-itC',
                    display_order: 2
                },
                {
                    id: 3,
                    name: 'Ferraillage',
                    css: 'post-itFI',
                    display_order: 3
                },
                {
                    id: 4,
                    name: 'Électricité',
                    css: 'post-itElec',
                    display_order: 4
                },
                {
                    id: 5,
                    name: 'Plomberie',
                    css: 'post-itPlomb',
                    display_order: 5
                },
                {
                    id: 6,
                    name: 'Coulage plancher',
                    css: 'post-itCoulage',
                    display_order: 6
                },
                {
                    id: 7,
                    name: 'Echaffaudage',
                    css: 'post-itEchaffaudage',
                    display_order: 7
                },
                //"Activité fictive" pour indiquer le début d'étage dans le planning collaboratif uniquement (css couleur rouge, à ne pas afficher dans la liste d'activités dans l'écran PPH)
                {
                    id: 8,
                    name: 'Jalons',
                    css: 'post-itJalons',
                    display_order: 8
                }

            ];

activities.map(function(activity){
    request({
            url: API_ACTIVITY,
            method: 'POST',
            json: activity
        },
        function(error, response, body) {
            if(error) {
                console.log(error);
            } else {
                //console.log(response.statusCode, 'Activity: ', body);
            }
        }
    );
});
