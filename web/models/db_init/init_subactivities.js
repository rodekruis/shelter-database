var request = require('request');

ROOT_URL = 'http://127.0.0.1:5000/api'
API_SUB_ACTIVITY = ROOT_URL + '/sub_activity'

// Creation of sub-activities

var sub_activities = [
                // Activity Verticaux
                {
                    id: 1,
                    name : 'Traçage verticaux',
                    css: 'post-itVerticaux',
                    activity_id: 1
                },
                {
                    id: 2,
                    name : 'Pose poteaux',
                    css: 'post-itVerticaux',
                    activity_id: 1
                },
                {
                    id: 3,
                    name : 'Pose prémurs',
                    css: 'post-itVerticaux',
                    activity_id: 1
                },
                {
                    id: 4,
                    name : 'Coulage prémurs',
                    css: 'post-itVerticaux',
                    activity_id: 1
                },
                {
                    id: 5,
                    name : 'Escaliers',
                    css: 'post-itVerticaux',
                    activity_id: 1
                },
                {
                    id: 6,
                    name : 'Traçage arrêts béton',
                    css: 'post-itVerticaux',
                    activity_id: 1
                },
                {
                    id: 7,
                    name : 'Vérification Ankrobox',
                    css: 'post-itVerticaux',
                    activity_id: 1
                },
                {
                    id: 29,
                    name : 'Action 5S Verticaux',
                    css: 'post-itVerticaux',
                    activity_id: 1
                },
                
                // Activity Horizontaux
                {
                    id: 8,
                    name : 'Etaiement',
                    css: 'post-itC',
                    activity_id: 2
                },
                {
                    id: 9,
                    name : 'Plaquage',
                    css: 'post-itC',
                    activity_id: 2
                },
                {
                    id: 10,
                    name : 'Joues / arrêts',
                    css: 'post-itC',
                    activity_id: 2
                },
                {
                    id: 11,
                    name : 'Balcons',
                    css: 'post-itC',
                    activity_id: 2
                },
                {
                    id: 30,
                    name : 'Action 5S Horizontaux',
                    css: 'post-itC',
                    activity_id: 2
                },
                // Activity Ferraillage
                {
                    id: 12,
                    name : 'Prépa poutres',
                    css: 'post-itFI',
                    activity_id: 3
                },
                {
                    id: 13,
                    name : 'Pose poutres',
                    css: 'post-itFI',
                    activity_id: 3
                },
                {
                    id: 14,
                    name : 'Nappe inférieure',
                    css: 'post-itFI',
                    activity_id: 3
                },
                {
                    id: 15,
                    name : 'Nappe supérieure',
                    css: 'post-itFI',
                    activity_id: 3
                },
                {
                    id: 31,
                    name : 'Action 5S féraille',
                    css: 'post-itFI',
                    activity_id: 3
                },
                // Activity Électricité
                {
                    id: 16,
                    name : 'Traçage elec',
                    css: 'post-itElec',
                    activity_id: 4
                },
                {
                    id: 17,
                    name : 'Pieuvres / réserv.',
                    css: 'post-itElec',
                    activity_id: 4
                },
                {
                    id: 18,
                    name : 'Tirages cables',
                    css: 'post-itElec',
                    activity_id: 4
                },
                {
                    id: 19,
                    name : 'Elec verticaux',
                    css: 'post-itElec',
                    activity_id: 4
                },
                {
                    id: 32,
                    name : 'Action 5S Elec',
                    css: 'post-itElec',
                    activity_id: 4
                },
                // Activity Plomberie
                {
                    id: 20,
                    name : 'Traçage plombier',
                    css: 'post-itPlomb',
                    activity_id: 5
                },
                {
                    id: 21,
                    name : 'Pose plombier',
                    css: 'post-itPlomb',
                    activity_id: 5
                },
                {
                    id: 33,
                    name : 'Action 5S plombier',
                    css: 'post-itPlomb',
                    activity_id: 5
                },
                // Activity Coulage plancher
                {
                    id: 22,
                    name : 'Coulage plancher',
                    css: 'post-itCoulage',
                    activity_id: 6
                },
                {
                    id: 23,
                    name : 'Talochage',
                    css: 'post-itCoulage',
                    activity_id: 6
                },
                
                
                // Activity Echaffaudage
                {
                    id: 24,
                    name : 'Echaff.',
                    css: 'post-itEchaffaudage',
                    activity_id: 7
                },
                {
                    id: 34,
                    name : 'Action 5S Echaffaudages',
                    css: 'post-itEchaffaudage',
                    activity_id: 7
                },
                // Jalons (pour Planning collaboratif uniquement)
                {
                    id: 25,
                    name : 'Début R+1',
                    css: 'post-itJalons',
                    activity_id: 8
                },
                {
                    id: 26,
                    name : 'Début R+2',
                    css: 'post-itJalons',
                    activity_id: 8
                },
                {
                    id: 27,
                    name : 'Début R+3',
                    css: 'post-itJalons',
                    activity_id: 8
                },
                {
                    id: 28,
                    name : 'Début R+4',
                    css: 'post-itJalons',
                    activity_id: 8
                }
             ];

sub_activities.map(function(sub_activity){
    request({
            url: API_SUB_ACTIVITY,
            method: 'POST',
            json: sub_activity
        },
        function(error, response, body) {
            if(error) {
                console.log(error);
            } else {
                //console.log(response.statusCode, 'SubActivity: ', body);
            }
        });
});
