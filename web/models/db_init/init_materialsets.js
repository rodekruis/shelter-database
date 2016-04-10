var request = require('request');

ROOT_URL = 'http://127.0.0.1:5000/api'
API_MATERIAL_SET = ROOT_URL + '/material_set'

// Creation of material sets

var material_set = [
    {
        name : 'Treillis soudé ST 50 Etage 1 Zone 1',
        id:1,
        tangible_id: 51
    },
    {
        name : 'Treillis soudé ST 40 Etage 1 Zone 1',
        id:2,
        tangible_id: 44
    },
    {
        name : 'Echaffaudage Etage 1 Zone 3',
        id:3,
        tangible_id: 70
    },
    {
        name : 'Echaffaudage Etage 1 Zone 4',
        id:4,
        tangible_id: 71
    },
    {
        name : 'Poteaux Etage 1 Zone 3',
        id:5,
        tangible_id: 15
    },
    {
        name : 'Prémurs Etage 1 Zone 3',
        id:6,
        tangible_id: 22
    },
    {
        name : 'Poutres (Bandes noyées) Etage 1 Zone 2',
        id:7,
        tangible_id: 38
    },
    {
        name : 'Balcons Etage 1 Zone 2',
        id:8,
        tangible_id: 32
    },
    {
        name : 'Treillis soudé ST 40 Etage 1 Zone 2',
        id:9,
        tangible_id: 45
    },
    {
        name : 'Treillis soudé ST 50 Etage 1 Zone 2',
        id:10,
        tangible_id: 52
    },
    {
        name : 'Poteaux Etage 1 Zone 4',
        id:11,
        tangible_id: 16
    },
    {
        name : 'Prémurs Etage 1 Zone 4',
        id:12,
        tangible_id: 23
    },
    {
        name : 'Tuyaux / réservations Etage 1 Zone 1',
        id:13,
        tangible_id: 64
    },
    {
        name : 'Treillis soudé ST40 Etage 1 Zone 3',
        id:14,
        tangible_id: 46
    },
    {
        name : 'Treillis soudé ST50 Etage 1 Zone 3',
        id:15,
        tangible_id: 53
    },
    {
        name : 'Treillis soudé ST40 Etage 1 Zone 4',
        id:16,
        tangible_id: 47
    },
    {
        name : 'Treillis soudé ST50 Etage 1 Zone 4',
        id:17,
        tangible_id: 54
    },
    {
        name : 'Echaffaudage Etage 2 Zone 1',
        id:18,
        tangible_id: 72
    },
    {
        name : 'Echaffaudage Etage 2 Zone 2',
        id:19,
        tangible_id: 73
    },
    {
        name : 'Poutres (Bandes noyées) Etage 1 Zone 3',
        id:20,
        tangible_id: 39
    },
    {
        name : 'Balcons Etage 1 Zone 3',
        id:21,
        tangible_id: 33
    },
    {
        name : 'Prémurs Etage 2 Zone 1',
        id:22,
        tangible_id: 24
    },
    {
        name : 'Poteaux Etage 2 Zone 1',
        id:23,
        tangible_id: 17
    },
    {
        name : 'Balcons Etage 1 Zone 4',
        id:24,
        tangible_id: 34
    },
    {
        name : 'Poutres (Bandes noyées) Etage 1 Zone 4',
        id:25,
        tangible_id: 40
    },
    {
        name : 'Tuyaux /réservations Etage 1 Zone 2',
        id:26,
        tangible_id: 65
    },
    {
        name : 'Tuyaux /réservations Etage 1 Zone 3',
        id:27,
        tangible_id: 66
    },
    {
        name : 'Pieuvres et cables Etage 1 Zone 1',
        id:28,
        tangible_id: 58
    },
    {
        name : 'Pieuvres et cables Etage 1 Zone 2',
        id:29,
        tangible_id: 59
    },
    {
        name : 'Pieuvres et cables Etage 1 Zone 3',
        id:30,
        tangible_id: 60
    },
    {
        name : 'Poutres (Bandes noyées) Etage 3 Zone 2',
        id:34,
        tangible_id: 41
    },
    {
        name : 'Echaffaudage Etage 3 Zone 4',
        id:35,
        tangible_id: 74
    },
    {
        name : 'Treillis soudé ST50 Etage 3 Zone 2',
        id:36,
        tangible_id: 55
    },
    {
        name : 'Treillis soudé ST40 Etage 3 Zone 2',
        id:37,
        tangible_id: 48
    },
    {
        name : 'Prémurs Etage 3 Zone 4',
        id:38,
        tangible_id: 25
    },
    {
        name : 'Prémurs Etage 3 Zone 2',
        id:39,
        tangible_id: 35
    },
    {
        name : 'Poutres (Bandes noyées) Etage 3 Zone 3',
        id:40,
        tangible_id: 42
    },
    {
        name : 'Prémurs Etage 4 Zone 1',
        id:41,
        tangible_id: 26
    },
    {
        name : 'Pieuvres et cables Etage 3 Zone 2',
        id:42,
        tangible_id: 61
    },
    {
        name : 'Tuyaux /réservations Etage 3 Zone 2',
        id:44,
        tangible_id: 67
    },
    {
        name : 'Poteaux Etage 4 Zone 1',
        id:45,
        tangible_id: 19
    },
    {
        name : 'Balcons Etage 3 Zone 3',
        id:46,
        tangible_id: 36
    },
    {
        name : 'Escalier Etage 3 Bâtiment 2',
        id:47,
        tangible_id: 31
    },
    {
        name : 'Treillis soudé ST40 Etage 3 Zone 3',
        id:48,
        tangible_id: 49
    },
    {
        name : 'Treillis soudé ST50 Etage 3 Zone 3',
        id:49,
        tangible_id: 56
    },
    {
        name : 'Escalier Etage 3 Bâtiment 1',
        id:50,
        tangible_id: 30
    },
    {
        name : 'Tuyaux /réservations Etage 3 Zone 3',
        id:51,
        tangible_id: 68
    },
    {
        name : 'Pieuvres et cables Etage 3 Zone 3',
        id:52,
        tangible_id: 62
    },
    {
        name : 'Poutres (Bandes noyées) Etage 3 Zone 4',
        id:54,
        tangible_id: 43
    },
    {
        name : 'Echaffaudage Etage 4 Zone 2',
        id:55,
        tangible_id: 76
    },
    {
        name : 'Echaffaudage Etage 4 Zone 1',
        id:56,
        tangible_id: 75
    },
    {
        name : 'Prémurs Etage 4 Zone 2',
        id:57,
        tangible_id: 27
    },
    {
        name : 'Balcons Etage 3 Zone 4',
        id:58,
        tangible_id: 37
    },
    {
        name : 'Treillis soudé ST50 Etage 3 Zone 4',
        id:59,
        tangible_id: 57
    },
    {
        name : 'Treillis soudé ST40 Etage 3 Zone 4',
        id:60,
        tangible_id: 50
    },
    {
        name : 'Tuyaux /réservations Etage 3 Zone 4',
        id:61,
        tangible_id: 69
    },
    {
        name : 'Pieuvres et cables Etage 3 Zone 4',
        id:62,
        tangible_id: 63
    },
    {
        name : 'Poteaux Etage 3 Zone 4',
        id:64,
        tangible_id: 18
    },
    {
        name : 'Poteaux Etage 3 Zone 4 Sous-groupe 1',
        id:65,
        tangible_id: 20
    },
    {
        name : 'Poteaux Etage 3 Zone 4 Sous-groupe 2',
        id:66,
        tangible_id: 21
    },
    {
        name : 'Escalier Etage 1 Bâtiment 1',
        id:67,
        tangible_id: 28
    },
    {
        name : 'Escalier Etage 1 Bâtiment 2',
        id:68,
        tangible_id: 29
    },
    {
        name : 'Poteaux P55 Etage 1',
        id:69,
        tangible_id: 77
    },
    {
        name : 'Poteau P56 Etage 1',
        id:70,
        tangible_id: 78
    },
    {
        name : 'Poteau P57 Etage 1',
        id:88,
        tangible_id: 88
    },
    {
        name : 'Poteau P58 Etage 1',
        id:89,
        tangible_id: 89
    },
    {
        name : 'Poteau P59 Etage 1',
        id:90,
        tangible_id: 90
    },
    {
        name : 'Poteau P60 Etage 1',
        id:91,
        tangible_id: 91
    },

    //Equipement
    {
        name : 'Aire de lavage',
        //valable pour semaine S
        id:71,
        tangible_id: 79
    },
    {
        name : "Tour d'étaiement",
        //valable pour semaine S
        id:72,
        tangible_id: 80
    },
    {
        name : "Paniers d'étais",
        //valable pour semaine S
        id:73,
        tangible_id: 81
    },
    {
        name : 'Panier',
        //valable pour semaine S
        id:74,
        tangible_id: 82
    },
    {
        name : 'Coffrage (gridflex)',
        //valable pour semaine S
        id:75,
        tangible_id: 83
    },
    {
        name : 'Planches de coffrage',
        //valable pour semaine S
        id:76,
        tangible_id: 84
    },
    {
        name : 'Planches de coffrage',
        //valable pour semaine S
        id:77,
        tangible_id: 85
    },
    {
        name : 'Stabox',
        //valable pour semaine S
        id:78,
        tangible_id: 86
    },
    {
        name : 'Sacs de gravier',
        //valable pour semaine S
        id:79,
        tangible_id: 87
    },
    {
        name : 'Aire de lavage',
        //valable pour semaine S+6
        id:80,
        tangible_id: 79
    },
    {
        name : "Tour d'étaiement",
        //valable pour semaine S+6
        id:81,
        tangible_id: 80
    },
    {
        name : "Paniers d'étais",
        //valable pour semaine S+6
        id:82,
        tangible_id: 81
    },
    {
        name : 'Panier',
        //valable pour semaine S+6
        id:83,
        tangible_id: 82
    },
    {
        name : 'Coffrage (gridflex)',
        //valable pour semaine S+6
        id:84,
        tangible_id: 83
    },
    {
        name : 'Planches de coffrage',
        //valable pour semaine S+6
        id:85,
        tangible_id: 84
    },
    {
        name : 'Planches de coffrage',
        //valable pour semaine S+6
        id:86,
        tangible_id: 85
    },
    {
        name : 'Stabox',
        //valable pour semaine S+6
        id:87,
        tangible_id: 86
    }
]

material_set.map(function(material){
    request({
            url: API_MATERIAL_SET,
            method: 'POST',
            json: material
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
