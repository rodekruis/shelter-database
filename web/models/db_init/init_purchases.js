var request = require('request');

ROOT_URL = 'http://127.0.0.1:5000/api'
API_PURCHASE = ROOT_URL + '/purchase'

// Creation of purchases

var purchases = [
            {
                id: 1,
                order_number: '4537',
                purchase_date: '2016-01-10T00:00:00Z',
                expected_delivery: '2016-01-25T00:00:00Z'
            },
            {
                id: 2,
                order_number: '4538',
                purchase_date: '2016-01-10T00:00:00Z',
                expected_delivery: '2016-01-25T00:00:00Z'
            },
            {
                id: 3,
                order_number: '012532',
                purchase_date: '2016-01-12T00:00:00Z',
                expected_delivery: '2016-01-26T00:00:00Z'
            },
            {
                id: 4,
                order_number: '012532',
                purchase_date: '2016-01-12T00:00:00Z',
                expected_delivery: '2016-01-26T00:00:00Z'
            },
            {
                id: 5,
                order_number: '016852',
                purchase_date: '2016-01-15T00:00:00Z',
                expected_delivery: '2016-01-28T00:00:00Z'
            },
            {
                id: 6,
                order_number: '016754',
                purchase_date: '2016-01-15T00:00:00Z',
                expected_delivery: '2016-01-28T00:00:00Z'
            },
            {
                id: 7,
                order_number: '016754',
                purchase_date: '2016-01-15T00:00:00Z',
                expected_delivery: '2016-01-29T00:00:00Z'
            },
            {
                id: 8,
                order_number: '100421',
                purchase_date: '2016-01-15T00:00:00Z',
                expected_delivery: '2016-01-28T00:00:00Z'
            },
            {
                id: 9,
                order_number: '10324',
                purchase_date: '2016-01-15T00:00:00Z',
                expected_delivery: '2016-01-29T00:00:00Z'
            },
            {
                id: 10,
                order_number: '10324',
                purchase_date: '2016-01-15T00:00:00Z',
                expected_delivery: '2016-01-29T00:00:00Z'
            },
            {
                id: 11,
                order_number: '016855',
                purchase_date: '2016-01-15T00:00:00Z',
                expected_delivery: '2016-02-02T00:00:00Z'
            },
            {
                id: 12,
                order_number: '0168632',
                purchase_date: '2016-01-15T00:00:00Z',
                expected_delivery: '2016-02-01T00:00:00Z'
            },
            {
                id: 13,
                order_number: '2754',
                purchase_date: '2016-01-15T00:00:00Z',
                expected_delivery: '2016-01-28T00:00:00Z'
            },
            {
                id: 14,
                order_number: '11244',
                purchase_date: '2016-01-15T00:00:00Z',
                expected_delivery: '2016-02-03T00:00:00Z'
            },
            {
                id: 15,
                order_number: '11244',
                purchase_date: '2016-01-15T00:00:00Z',
                expected_delivery: '2016-02-03T00:00:00Z'
            },
            {
                id: 16,
                order_number: '11355',
                purchase_date: '2016-01-15T00:00:00Z',
                expected_delivery: '2016-02-05T00:00:00Z'
            },
            {
                id: 17,
                order_number: '11355',
                purchase_date: '2016-01-15T00:00:00Z',
                expected_delivery: '2016-02-05T00:00:00Z'
            },
            {
                id: 18,
                order_number: '135544',
                purchase_date: '2016-01-15T00:00:00Z',
                expected_delivery: '2016-02-03T00:00:00Z'
            },
            {
                id: 19,
                order_number: '135544',
                purchase_date: '2016-01-15T00:00:00Z',
                expected_delivery: '2016-02-03T00:00:00Z'
            },
            {
                id: 20,
                order_number: '102351',
                purchase_date: '2016-01-15T00:00:00Z',
                expected_delivery: '2016-02-03T00:00:00Z'
            },
            {
                id: 21,
                order_number: '109456',
                purchase_date: '2016-01-15T00:00:00Z',
                expected_delivery: '2016-02-03T00:00:00Z'
            },
            {
                id: 22,
                order_number: '168439',
                purchase_date: '2016-01-15T00:00:00Z',
                expected_delivery: '2016-02-04T00:00:00Z'
            },
            {
                id: 23,
                order_number: '168939',
                purchase_date: '2016-01-15T00:00:00Z',
                expected_delivery: '2016-02-04T00:00:00Z'
            },
            {
                id: 24,
                order_number: '13925',
                purchase_date: '2016-01-15T00:00:00Z',
                expected_delivery: '2016-02-02T00:00:00Z'
            },
            {
                id: 25,
                order_number: '104324',
                purchase_date: '2016-01-15T00:00:00Z',
                expected_delivery: '2016-02-05T00:00:00Z'
            },
            {
                id: 26,
                order_number: '2941',
                purchase_date: '2016-01-25T00:00:00Z',
                expected_delivery: '2016-02-02T00:00:00Z'
            },
            {
                id: 27,
                order_number: '2949',
                purchase_date: '2016-01-28T00:00:00Z',
                expected_delivery: '2016-02-05T00:00:00Z'
            },
            {
                id: 28,
                order_number: '3784',
                purchase_date: '2016-01-21T00:00:00Z',
                expected_delivery: '2016-01-28T00:00:00Z'
            },
            {
                id: 29,
                order_number: '3985',
                purchase_date: '2016-01-26T00:00:00Z',
                expected_delivery: '2016-02-02T00:00:00Z'
            },
            {
                id: 30,
                order_number: '4127',
                purchase_date: '2016-01-26T00:00:00Z',
                expected_delivery: '2016-02-02T00:00:00Z'
            },
            {
                id: 31,
                order_number: '3784',
                purchase_date: '2016-01-21T00:00:00Z',
                expected_delivery: '2016-01-28T00:00:00Z'
            },
            {
                id: 32,
                order_number: '3985',
                purchase_date: '2016-01-26T00:00:00Z',
                expected_delivery: '2016-02-02T00:00:00Z'
            },
            {
                id: 33,
                order_number: '3985',
                purchase_date: '2016-01-26T00:00:00Z',
                expected_delivery: '2016-02-03T00:00:00Z'
            },
            {
                id: 34,
                order_number: '625939',
                purchase_date: '2016-02-03T00:00:00Z',
                expected_delivery: '2016-03-02T00:00:00Z'
            },
            {
                id: 35,
                order_number: '6338',
                purchase_date: '2016-02-05T00:00:00Z',
                expected_delivery: '2016-03-02T00:00:00Z'
            },
            {
                id: 36,
                order_number: '87544',
                purchase_date: '2016-04-02T00:00:00Z',
                expected_delivery: '2016-03-02T00:00:00Z'
            },
            {
                id: 37,
                order_number: '87545',
                purchase_date: '2016-02-05T00:00:00Z',
                expected_delivery: '2016-03-02T00:00:00Z'
            },
            {
                id: 38,
                order_number: '214921',
                purchase_date: '2016-02-05T00:00:00Z',
                expected_delivery: '2016-03-03T00:00:00Z'
            },
            {
                id: 39,
                order_number: '26436',
                purchase_date: '2016-02-03T00:00:00Z',
                expected_delivery: '2016-03-03T00:00:00Z'
            },
            {
                id: 40,
                order_number: '679423',
                purchase_date: '2016-02-05T00:00:00Z',
                expected_delivery: '2016-03-07T00:00:00Z'
            },
            {
                id: 41,
                order_number: '259655',
                purchase_date: '2016-02-05T00:00:00Z',
                expected_delivery: '2016-03-07T00:00:00Z'
            },
            {
                id: 42,
                order_number: '2744',
                purchase_date: '2016-02-03T00:00:00Z',
                expected_delivery: '2016-03-07T00:00:00Z'
            },
            {
                id: 43,
                order_number: '2854',
                purchase_date: '2016-02-03T00:00:00Z',
                expected_delivery: '2016-03-07T00:00:00Z'
            },
            {
                id: 44,
                order_number: '5437',
                purchase_date: '2016-02-03T00:00:00Z',
                expected_delivery: '2016-03-08T00:00:00Z'
            },
            {
                id: 45,
                order_number: '213954',
                purchase_date: '2016-02-10T00:00:00Z',
                expected_delivery: '2016-03-08T00:00:00Z'
            },
            {
                id: 46,
                order_number: '29755',
                purchase_date: '2016-02-05T00:00:00Z',
                expected_delivery: '2016-03-09T00:00:00Z'
            },
            {
                id: 47,
                order_number: '5999',
                purchase_date: '2016-02-05T00:00:00Z',
                expected_delivery: '2016-03-09T00:00:00Z'
            },
            {
                id: 48,
                order_number: '5548',
                purchase_date: '2016-02-05T00:00:00Z',
                expected_delivery: '2016-03-09T00:00:00Z'
            },
            {
                id: 49,
                order_number: '5549',
                purchase_date: '2016-02-05T00:00:00Z',
                expected_delivery: '2016-03-09T00:00:00Z'
            },
            {
                id: 50,
                order_number: '22455',
                purchase_date: '2016-02-05T00:00:00Z',
                expected_delivery: '2016-03-09T00:00:00Z'
            },
            {
                id: 51,
                order_number: '5639',
                purchase_date: '2016-02-05T00:00:00Z',
                expected_delivery: '2016-03-10T00:00:00Z'
            },
            {
                id: 52,
                order_number: '4537',
                purchase_date: '2016-02-05T00:00:00Z',
                expected_delivery: '2016-03-10T00:00:00Z'
            },
            {
                id: 53,
                order_number: '4758',
                purchase_date: '2016-02-05T00:00:00Z',
                expected_delivery: '2016-03-10T00:00:00Z'
            },
            //{
            //    id: 54,
            //    order_number: '675999',
            //    purchase_date: '2016-02-12T00:00:00Z',
            //    expected_delivery: '2016-03-10T00:00:00Z'
            //},
            //{
            //    id: 55,
            //    order_number: '6431',
            //    purchase_date: '2016-02-13T00:00:00Z',
            //    expected_delivery: '2016-03-10T00:00:00Z'
            //},
            //{
            //    id: 56,
            //    order_number: '6432',
            //    purchase_date: '2016-02-13T00:00:00Z',
            //    expected_delivery: '2016-03-10T00:00:00Z'
            //},
            //{
            //    id: 57,
            //    order_number: '265339',
            //    purchase_date: '2016-02-13T00:00:00Z',
            //    expected_delivery: '2016-03-11T00:00:00Z'
            //},
            //{
            //    id: 58,
            //    order_number: '31756',
            //    purchase_date: '2016-02-13T00:00:00Z',
            //    expected_delivery: '2016-03-11T00:00:00Z'
            //},
            //{
            //    id: 59,
            //    order_number: '5630',
            //    purchase_date: '2016-02-13T00:00:00Z',
            //    expected_delivery: '2016-03-11T00:00:00Z'
            //},
            //{
            //    id: 60,
            //    order_number: '5629',
            //    purchase_date: '2016-02-13T00:00:00Z',
            //    expected_delivery: '2016-03-11T00:00:00Z'
            //},
            //{
            //    id: 61,
            //    order_number: '5652',
            //    purchase_date: '2016-02-14T00:00:00Z',
            //    expected_delivery: '2016-03-14T00:00:00Z'
            //},
            //{
            //    id: 62,
            //    order_number: '4829',
            //    purchase_date: '2016-02-14T00:00:00Z',
            //    expected_delivery: '2016-03-15T00:00:00Z'
            //},
            //{
            //    id: 63,
            //    order_number: '4557',
            //    purchase_date: '2016-02-14T00:00:00Z',
            //    expected_delivery: '2016-03-15T00:00:00Z'
            //},
            {
                id: 64,
                order_number: '270654',
                purchase_date: '2016-02-02T00:00:00Z',
                expected_delivery: '2016-03-07T00:00:00Z'
            },
            {
                id: 67,
                order_number: '20954',
                purchase_date: '2016-01-16T00:00:00Z',
                expected_delivery: '2016-02-04T00:00:00Z'
            },
            {
                id: 68,
                order_number: '20955',
                purchase_date: '2016-01-16T00:00:00Z',
                expected_delivery: '2016-02-04T00:00:00Z'
            }
        ]

purchases.map(function(purchase){
    request({
            url: API_PURCHASE,
            method: 'POST',
            json: purchase
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
