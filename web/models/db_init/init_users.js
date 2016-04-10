var request = require('request');

ROOT_URL = 'http://127.0.0.1:5000/api'
API_USER = ROOT_URL + '/user'

// Creation of users

var users = [
            {
                name : 'Bob',
                pwdhash : 'pbkdf2:sha1:1000$8xt9pjn6$acc321879ecb3463d6a481cf8ffaad3a309eaf09', // password
                organization_id: 1,
                sub_activities: [{ id: 1 }, { id: 2 }, { id: 3 },{ id: 4 },{ id: 5 },{ id: 7 },{ id: 29 }]
            },
            {
                name : 'Dom',
                pwdhash : 'pbkdf2:sha1:1000$8xt9pjn6$acc321879ecb3463d6a481cf8ffaad3a309eaf09', // password
                organization_id: 2,
                sub_activities: [{ id: 8 }, { id: 9 }, { id: 10 }, { id: 11 }, { id: 22 }, { id: 23 }, { id: 30 }]
            },
            {
                name : 'Pierre',
                pwdhash : 'pbkdf2:sha1:1000$8xt9pjn6$acc321879ecb3463d6a481cf8ffaad3a309eaf09', // password
                organization_id: 3,
                sub_activities: [{ id: 12 }, { id: 13 }, { id: 14 },{ id: 15 },{ id: 31 }]
            },
            {
                name : 'Fab',
                pwdhash : 'pbkdf2:sha1:1000$8xt9pjn6$acc321879ecb3463d6a481cf8ffaad3a309eaf09', // password
                organization_id: 4,
                sub_activities: [{ id: 16 }, { id: 17 }, { id: 18 },{ id: 19 },{ id: 32 }]
            },
            {
                name : 'Anne',
                pwdhash : 'pbkdf2:sha1:1000$8xt9pjn6$acc321879ecb3463d6a481cf8ffaad3a309eaf09', // password
                organization_id: 5,
                sub_activities: [{ id: 20 }, { id: 21 }, { id: 33 }]
            },
            {
                name : 'Thibaud',
                pwdhash : 'pbkdf2:sha1:1000$8xt9pjn6$acc321879ecb3463d6a481cf8ffaad3a309eaf09', // password
                organization_id: 6,
                sub_activities: [{ id: 24 }, { id: 34 }]
            },
        ];

users.map(function(user){
    request({
            url: API_USER,
            method: 'POST',
            json: user
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
