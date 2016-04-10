var request = require('request');

ROOT_URL = 'http://127.0.0.1:5000/api';
API_ZONE = {
    'macro': ROOT_URL + '/zone_macro',
    'micro': ROOT_URL + '/zone_micro',
    'storage': ROOT_URL + '/zone_storage',
}

// Creation of Zones
var zones = [
                {
                    id: 1,
                    type: 'macro',
                    name: 'Zone 1',
                    points: '115,302 456,302 456,439 36,439',
                    center: '{x: "285" , "y": "374"}'
                },
                {
                    id: 2,
                    type: 'macro',
                    name: 'Zone 2',
                    points: '115,298 227,105 275,105 275,174 455,174 455,300',
                    center: '{x: "299" , y: "233" }'
                },
                {
                    id: 3,
                    type: 'macro',
                    name: 'Zone 3',
                    points: '659,178 841,178 841,225 910,225 910,291 832,288 832,439 659,439',
                    center: '{x: "708" , y: "305"}'
                },
                {
                    id: 4,
                    type: 'macro',
                    name: 'Zone 4',
                    points: '909,225 909,178 1099,178 1152,439 833,441 833,290 911,290',
                    center: '{x: "990" , y: "308"}'
                },
                {
                    id: 5,
                    type: 'storage',
                    name: 'Zone Est',
                    volume: 303,
                    points: '1314,639 1534,784 1533,1003 1411,971 1391,1004 1294,997',
                    start: '2016-01-10T00:00:00Z',
                    end: '2016-05-11T00:00:00Z',
                    images: 'zone_stockage_Est_id_5.jpg'
                },
                {
                    id: 6,
                    type: 'storage',
                    name: 'Zone Ouest',
                    volume: 100,
                    points: '489,218 605,350 592,400 368,342',
                    start: '2016-01-10T00:00:00Z',
                    end: '2016-05-11T00:00:00Z',
                    images: 'Zone_stockage_ouest_id_6.jpg'
                },
                {
                    id: 7,
                    type: 'storage',
                    name: 'Zone Centre 2',
                    volume: 121,
                    points: '569,654 740,692 723,753 745,758 722,836 536,787',
                    start: '2016-01-10T00:00:00Z',
                    end: '2016-05-11T00:00:00Z',
                    images: 'Zone_centre_2_id_8.jpg',
                    actions5: "Attention matériel non prévu enregistré dans la zone"
                },
                {
                    id: 8,
                    type: 'storage',
                    name: 'Zone Centre 1',
                    volume: 136,
                    points: '752,657 578,621 623,440 798,544 776,632 756,629',
                    start: '2016-01-10T00:00:00Z',
                    end: '2016-02-16T00:00:00Z',
                    images: 'Zone_centre_2_id_8.jpg',
                    actions5: "Evacuation de la zone, TRAVAUX d'étanchéité | à partir du 17 février"
                },
                {
                    id: 9,
                    type: 'storage',
                    name: 'Zone Parking',
                    volume: 443,
                    points: '1495,591 1495,269 1194,251 1180,465',
                    start: '2016-01-10T00:00:00Z',
                    end: '2016-03-1T00:00:00Z',
                    images: 'Zone_parking_id_9.jpg,Zone_parking_id_9_2.jpg,Zone_parking_id_9_3.jpg,Zone_stockage_parking_id_9.jpg'
                },
                {
                    id: 10,
                    type: 'storage',
                    name: 'Zone temporaire',
                    volume: 105,
                    points: '1106,731 1240,756 1234,887 1089,859',
                    start: '2016-02-01T00:00:00Z',
                    end: '2016-02-20T00:00:00Z',
                    images: 'Zone_stockage_tenporaire_id_10.jpg'
                },
                {
                    id: 11,
                    type: 'storage',
                    name: 'à localiser',
                    volume: 1,
                    points: '53,215 207,215 201,357 50,357 ',
                    start: '2016-01-10T00:00:00Z',
                    end: '2020-05-11T00:00:00Z',
                    isEditable: false
                },
                {
                    id: 12,
                    type: 'storage',
                    name: 'Zone de livraison',
                    volume: 1,
                    points: '794,333 1026,255 1111,379 836,378',
                    start: '2016-01-10T00:00:00Z',
                    end: '2020-05-11T00:00:00Z',
                    isEditable: false
                },
                {
                    id: 13,
                    type: 'storage',
                    name: 'à renvoyer',
                    volume: 1,
                    points: '1027,251 1124,394 1181,379 1199,196',
                    start: '2016-01-10T00:00:00Z',
                    end: '2020-05-11T00:00:00Z',
                    isEditable: false
                },
                {
                    id: 14,
                    type: 'storage',
                    name: 'Zone Centre-grue',
                    volume: 120,
                    points: '1260,655 972,587 1005,463 1062,475 1110,545 1274,605',
                    start: '2016-01-10T00:00:00Z',
                    end: '2016-05-11T00:00:00Z',
                    images: 'Zone_centre_grue_id_14.jpg',
                    actions5: 'Attention materiel hors de la zone: ZONE PIRATE!'
                },
                {
                    id: 15,
                    type: 'storage',
                    name: 'Zone Centre 1',
                    volume: 136,
                    points: '752,657 578,621 625,439 798,544 776,632 756,629',
                    start: '2016-03-01T00:00:00Z',
                    end: '2016-05-11T00:00:00Z'
                },
                {
                    id: 16,
                    type: 'storage',
                    name: 'Zone Parking',
                    volume: 443,
                    points: '1495,591 1495,269 1194,251 1180,465',
                    start: '2016-03-01T00:00:01Z',
                    end: '2016-05-11T00:00:00Z',
                    images: 'Zone_parking_id_9.jpg,Zone_parking_id_9_2.jpg,Zone_parking_id_9_3.jpg,Zone_stockage_parking_id_9.jpg',
                    actions5: "ATTENTION RESTITUTION DU PARKING LE 8 mars !"
                }


 ];

zones.map(function(zone){
    request({
            url: API_ZONE[zone.type],
            method: 'POST',
            json: zone
        },
        function(error, response, body) {
            if(error) {
                console.log(error);
            } else {
                //console.log(response.statusCode, 'Zone: ', body);
            }
        }
    );
});
