var request = require('request');

ROOT_URL = 'http://127.0.0.1:5000/api'
API_TASK = ROOT_URL + '/task'

// Creation of tasks

var tasks = [
            //jalons:
            {
               day: "2016-01-25",
               zone_id: 1,
               subactivity_id: 25
           },
           {
               day: "2016-02-10",
               zone_id: 1,
               subactivity_id: 26
           },
           {
               day: "2016-02-26",
               zone_id: 1,
               subactivity_id: 27
           },
           {
               day: "2016-03-15",
               zone_id: 1,
               subactivity_id: 28
           },


            //Planning collabortif:
            //{
            //   day: "2016-01-25",
            //   zone_id: 1,
            //   subactivity_id: 1
           //},
           {
               day: "2016-01-25",
               zone_id: 1,
               subactivity_id: 3
           },
           {
               day: "2016-01-25",
               zone_id: 1,
               subactivity_id: 24
           },
           {
               day: "2016-01-26",
               zone_id: 1,
               subactivity_id: 2
           },
            //{
            //   day: "2016-01-26",
            //   zone_id: 1,
            //   subactivity_id: 19
            //},
            //{
            //   day: "2016-01-26",
            //   zone_id: 1,
            //   subactivity_id: 4
            //},
           {
               day: "2016-01-26",
               zone_id: 1,
               subactivity_id: 24
           },
           {
               day: "2016-01-27",
               zone_id: 1,
               subactivity_id: 2
           },
            //{
            //   day: "2016-01-27",
            //   zone_id: 1,
            //   subactivity_id: 4
            //},
            {
               day: "2016-01-27",
               zone_id: 1,
               subactivity_id: 8
            },
           {
               day: "2016-01-28",
               zone_id: 1,
               subactivity_id: 8
           },
           {
               day: "2016-01-28",
               zone_id: 1,
               subactivity_id: 9
           },
           {
               day: "2016-01-29",
               zone_id: 1,
               subactivity_id: 9
           },
            //{
            //   day: "2016-01-29",
            //   zone_id: 1,
            //   subactivity_id: 16
            //},
           //{
            //   day: "2016-01-29",
            //   zone_id: 1,
            //   subactivity_id: 20
           //},

           // tâche Planning collaboratif S zone 1

           //{
            //   day: "2016-02-01",
            //   zone_id: 1,
            //   subactivity_id: 10,
            //   pph: false
           //},
           {
               day: "2016-02-01",
               zone_id: 1,
               subactivity_id: 11,
               pph: false
           },
           {
               day: "2016-02-01",
               zone_id: 1,
               subactivity_id: 13,
               pph: false
           },
           {
               day: "2016-02-01",
               zone_id: 1,
               subactivity_id: 14,
               pph: false,
               materials: [
                            {id: 200}
                          ]
           },
           {
               day: "2016-02-02",
               zone_id: 1,
               subactivity_id: 17,
               pph: false,
               materials: [
                            {id: 2801}
                          ]
           },
           {
               day: "2016-02-02",
               zone_id: 1,
               subactivity_id: 18,
               pph: false,
               materials: [
                            {id: 2802}
                          ]
           },
           {
               day: "2016-02-02",
               zone_id: 1,
               subactivity_id: 21,
               pph: false,
               materials: [
                            {id: 1300},
                          ]
            },
           {
               day: "2016-02-02",
               zone_id: 1,
               subactivity_id: 15,
               pph: false,
               materials: [
                            {id: 100}
                          ]
           },
           {
               day: "2016-02-03",
               zone_id: 1,
               subactivity_id: 22,
               pph: false
           },
           //{
            //   day: "2016-02-03",
            //   zone_id: 1,
            //   subactivity_id: 23,
            //   pph: false
           //},

           // tâches planifiées semaine S zone 1

           {
               day: "2016-02-01",
               zone_id: 1,
               subactivity_id: 10,
               pph: true,
               top: '444px',
               left: '470px'
           },
           {
               day: "2016-02-01",
               zone_id: 1,
               subactivity_id: 11,
               pph: true,
               top: '444px',
               left: '550px'
           },
           {
               day: "2016-02-01",
               zone_id: 1,
               subactivity_id: 13,
               pph: true,
               top: '444px',
               left: '630px'
           },
           {
               day: "2016-02-01",
               zone_id: 1,
               subactivity_id: 14,
               pph: true,
               top: '444px',
               left: '710px'
           },
           {
               day: "2016-02-02",
               zone_id: 1,
               subactivity_id: 17,
               pph: true,
               top: '444px',
               left: '470px'
           },
           {
               day: "2016-02-02",
               zone_id: 1,
               subactivity_id: 18,
               pph: true,
               top: '444px',
               left: '550px'
           },
           {
               day: "2016-02-02",
               zone_id: 1,
               subactivity_id: 21,
               pph: true,
               top: '444px',
               left: '630px'
            },
           {
               day: "2016-02-02",
               zone_id: 1,
               subactivity_id: 15,
               pph: true,
               top: '444px',
               left: '710px'
           },
           {
               day: "2016-02-03",
               zone_id: 1,
               subactivity_id: 22,
               pph: true,
               top: '450px',
               left: '500px'
           },
           {
               day: "2016-02-03",
               zone_id: 1,
               subactivity_id: 23,
               pph: true,
               top: '444px',
               left: '650px'
           },

           // fin tâche planifiées S


           //{
            //   day: "2016-02-10",
            //   zone_id: 1,
            //   subactivity_id: 1,
           //},
           {
               day: "2016-02-10",
               zone_id: 1,
               subactivity_id: 3,
               materials: [
                            {id: 2201},
                            {id: 2203},
                            {id: 2204},
                            {id: 2205},
                            {id: 2206},
                            {id: 2207},
                            {id: 2212},
                            {id: 2213},
                            {id: 2214},
                            {id: 2215},
                            {id: 2218}
                          ]
           },
           {
               day: "2016-02-10",
               zone_id: 1,
               subactivity_id: 24,
               materials: [
                            {id: 1800}
                          ]

           },
           {
               day: "2016-02-11",
               zone_id: 1,
               subactivity_id: 2,
               materials: [
                            {id: 2301},
                            {id: 2302},
                            {id: 2303},
                            {id: 2304},
                            {id: 2305},
                            {id: 2306},
                            {id: 2307},
                            {id: 2310},
                            {id: 2313},
                            {id: 2315},
                            {id: 2316},
                            {id: 2317},
                            {id: 2318},
                            {id: 2320},
                            {id: 2321},
                            {id: 2322}
                          ]
           },
           //{
            //   day: "2016-02-11",
            //   zone_id: 1,
            //   subactivity_id: 19
           //},
           //{
            //   day: "2016-02-11",
            //   zone_id: 1,
            //   subactivity_id: 4
           //},
           {
               day: "2016-02-11",
               zone_id: 1,
               subactivity_id: 24
           },
           {
               day: "2016-02-12",
               zone_id: 1,
               subactivity_id: 2
           },
           //{
            //   day: "2016-02-12",
            //   zone_id: 1,
            //   subactivity_id: 4
           //},
           {
               day: "2016-02-12",
               zone_id: 1,
               subactivity_id: 8
           },
           {
               day: "2016-02-15",
               zone_id: 1,
               subactivity_id: 8
           },
           {
               day: "2016-02-15",
               zone_id: 1,
               subactivity_id: 9
           },
           {
               day: "2016-02-16",
               zone_id: 1,
               subactivity_id: 9
           },
           //{
            //   day: "2016-02-16",
            //   zone_id: 1,
            //   subactivity_id: 16
           //},
           //{
             //  day: "2016-02-16",
             //  zone_id: 1,
             //  subactivity_id: 20
           //},
           //{
            //   day: "2016-02-17",
            //   zone_id: 1,
            //   subactivity_id: 10
           //},
           {
               day: "2016-02-17",
               zone_id: 1,
               subactivity_id: 11
           },
           {
               day: "2016-02-17",
               zone_id: 1,
               subactivity_id: 13
           },
           {
               day: "2016-02-17",
               zone_id: 1,
               subactivity_id: 14
           },
           {
               day: "2016-02-18",
               zone_id: 1,
               subactivity_id: 17
           },
           {
               day: "2016-02-18",
               zone_id: 1,
               subactivity_id: 18
           },
           {
               day: "2016-02-18",
               zone_id: 1,
               subactivity_id: 21
           },
           {
               day: "2016-02-18",
               zone_id: 1,
               subactivity_id: 15
           },
           {
               day: "2016-02-19",
               zone_id: 1,
               subactivity_id: 22
           },
           //{
            //   day: "2016-02-19",
            //   zone_id: 1,
            //   subactivity_id: 23
           //},
           //{
            //   day: "2016-02-26",
            //   zone_id: 1,
            //   subactivity_id: 1
           //},
           {
               day: "2016-02-26",
               zone_id: 1,
               subactivity_id: 3
           },
           {
               day: "2016-02-26",
               zone_id: 1,
               subactivity_id: 24
           },
           {
               day: "2016-02-29",
               zone_id: 1,
               subactivity_id: 2
           },
           //{
            //   day: "2016-02-29",
            //   zone_id: 1,
            //   subactivity_id: 19
           //},
           //{
            //   day: "2016-02-29",
            //   zone_id: 1,
            //   subactivity_id: 4
           //},
           {
               day: "2016-02-29",
               zone_id: 1,
               subactivity_id: 24
           },
           {
               day: "2016-03-01",
               zone_id: 1,
               subactivity_id: 2
           },
           //{
            //   day: "2016-03-01",
            //   zone_id: 1,
            //   subactivity_id: 4
           //},
           {
               day: "2016-03-01",
               zone_id: 1,
               subactivity_id: 8
           },
           {
               day: "2016-03-02",
               zone_id: 1,
               subactivity_id: 8
           },
           {
               day: "2016-03-02",
               zone_id: 1,
               subactivity_id: 9
           },
           {
               day: "2016-03-03",
               zone_id: 1,
               subactivity_id: 9
           },
           //{
            //   day: "2016-03-03",
            //   zone_id: 1,
            //   subactivity_id: 16
           //},
           //{
            //   day: "2016-03-03",
            //   zone_id: 1,
            //   subactivity_id: 20
           //},
           //{
            //   day: "2016-03-04",
            //   zone_id: 1,
            //   subactivity_id: 10
           //},
           {
               day: "2016-03-04",
               zone_id: 1,
               subactivity_id: 11
           },
           {
               day: "2016-03-04",
               zone_id: 1,
               subactivity_id: 13
           },
           {
               day: "2016-03-04",
               zone_id: 1,
               subactivity_id: 14
           },
           {
               day: "2016-03-07",
               zone_id: 1,
               subactivity_id: 17
           },
           {
               day: "2016-03-07",
               zone_id: 1,
               subactivity_id: 18
           },
           {
               day: "2016-03-07",
               zone_id: 1,
               subactivity_id: 21
           },
           {
               day: "2016-03-07",
               zone_id: 1,
               subactivity_id: 15
           },
           {
               day: "2016-03-08",
               zone_id: 1,
               subactivity_id: 22
           },
           //{
            //   day: "2016-03-08",
            //   zone_id: 1,
            //   subactivity_id: 23
           //},
           //{
            //   day: "2016-03-15",
            //   zone_id: 1,
            //   subactivity_id: 1
           //},
           {
               day: "2016-03-15",
               zone_id: 1,
               subactivity_id: 3,
               materials: [
                            {id: 4101},
                            {id: 4103},
                            {id: 4104},
                            {id: 4105},
                            {id: 4106},
                            {id: 4107},
                            {id: 4112},
                            {id: 4113},
                            {id: 4114},
                            {id: 4115},
                            {id: 4118}
                          ]
           },
           {
               day: "2016-03-15",
               zone_id: 1,
               subactivity_id: 24,
               materials: [
                            {id: 5600}
                        ]
           },
           {
               day: "2016-03-16",
               zone_id: 1,
               subactivity_id: 2,
               materials: [
                            {id: 4501},
                            {id: 4502},
                            {id: 4503},
                            {id: 4504},
                            {id: 4505},
                            {id: 4506},
                            {id: 4507},
                            {id: 4513},
                            {id: 4515},
                            {id: 4516},
                            {id: 4517},
                            {id: 4518},
                            {id: 4520},
                            {id: 4521},
                            {id: 4522}
                        ]
           },
           //{
            //   day: "2016-03-16",
            //   zone_id: 1,
            //   subactivity_id: 19
           //},
           //{
            //   day: "2016-03-16",
            //   zone_id: 1,
            //   subactivity_id: 4
           //},
           {
               day: "2016-03-16",
               zone_id: 1,
               subactivity_id: 24
           },
           {
               day: "2016-03-17",
               zone_id: 1,
               subactivity_id: 2
           },
           //{
            //   day: "2016-03-17",
            //   zone_id: 1,
            //   subactivity_id: 4
           //},
           {
               day: "2016-03-17",
               zone_id: 1,
               subactivity_id: 8
           },
           {
               day: "2016-03-18",
               zone_id: 1,
               subactivity_id: 8
           },
           {
               day: "2016-03-18",
               zone_id: 1,
               subactivity_id: 9
           },
           {
               day: "2016-03-21",
               zone_id: 1,
               subactivity_id: 9
           },
           //{
            //   day: "2016-03-21",
            //   zone_id: 1,
            //   subactivity_id: 16
           //},
           //{
            //   day: "2016-03-21",
            //   zone_id: 1,
            //   subactivity_id: 20
           //},
           //{
            //   day: "2016-03-22",
            //   zone_id: 1,
            //   subactivity_id: 10
           //},
           {
               day: "2016-03-22",
               zone_id: 1,
               subactivity_id: 11
           },
           {
               day: "2016-03-22",
               zone_id: 1,
               subactivity_id: 13
           },
           {
               day: "2016-03-22",
               zone_id: 1,
               subactivity_id: 14
           },
           {
               day: "2016-03-23",
               zone_id: 1,
               subactivity_id: 17
           },
           {
               day: "2016-03-23",
               zone_id: 1,
               subactivity_id: 18
           },
           {
               day: "2016-03-23",
               zone_id: 1,
               subactivity_id: 21
           },
           {
               day: "2016-03-23",
               zone_id: 1,
               subactivity_id: 15
           },
           {
               day: "2016-03-24",
               zone_id: 1,
               subactivity_id: 22
           },
           //{
            //   day: "2016-03-24",
            //   zone_id: 1,
            //   subactivity_id: 23
           //},
           //{
            //   day: "2016-03-31",
            //   zone_id: 1,
            //   subactivity_id: 1
           //},
           {
               day: "2016-03-31",
               zone_id: 1,
               subactivity_id: 3
           },
           {
               day: "2016-03-31",
               zone_id: 1,
               subactivity_id: 24
           },
           {
               day: "2016-04-01",
               zone_id: 1,
               subactivity_id: 2
           },
           //{
            //   day: "2016-04-01",
            //   zone_id: 1,
            //   subactivity_id: 19
           //},
           //{
            //   day: "2016-04-01",
            //   zone_id: 1,
            //   subactivity_id: 4
           //},
           {
               day: "2016-04-01",
               zone_id: 1,
               subactivity_id: 24
           },
           {
               day: "2016-04-04",
               zone_id: 1,
               subactivity_id: 2
           },
           //{
            //   day: "2016-04-04",
            //   zone_id: 1,
            //   subactivity_id: 4
           //},
           {
               day: "2016-04-04",
               zone_id: 1,
               subactivity_id: 8
           },
           {
               day: "2016-04-05",
               zone_id: 1,
               subactivity_id: 8
           },
           {
               day: "2016-04-05",
               zone_id: 1,
               subactivity_id: 9
           },
           {
               day: "2016-04-06",
               zone_id: 1,
               subactivity_id: 9
           },
           //{
            //   day: "2016-04-06",
            //   zone_id: 1,
            //   subactivity_id: 16
           //},
           //{
            //   day: "2016-04-06",
            //   zone_id: 1,
            //   subactivity_id: 20
           //},
           //{
            //   day: "2016-04-07",
            //   zone_id: 1,
            //   subactivity_id: 10
           //},
           {
               day: "2016-04-07",
               zone_id: 1,
               subactivity_id: 11
           },
           {
               day: "2016-04-07",
               zone_id: 1,
               subactivity_id: 13
           },
           {
               day: "2016-04-07",
               zone_id: 1,
               subactivity_id: 14
           },
           {
               day: "2016-04-08",
               zone_id: 1,
               subactivity_id: 17
           },
           {
               day: "2016-04-08",
               zone_id: 1,
               subactivity_id: 18
           },
           {
               day: "2016-04-08",
               zone_id: 1,
               subactivity_id: 21
           },
           {
               day: "2016-04-08",
               zone_id: 1,
               subactivity_id: 15
           },
           {
               day: "2016-04-11",
               zone_id: 1,
               subactivity_id: 22
           },
           //{
            //   day: "2016-04-11",
            //   zone_id: 1,
            //   subactivity_id: 23
           //},

           {
               day: "2016-01-27",
               zone_id: 2,
               subactivity_id: 24
           },
           {
               day: "2016-01-28",
               zone_id: 2,
               subactivity_id: 1
           },
           {
               day: "2016-01-28",
               zone_id: 2,
               subactivity_id: 3
           },
           {
               day: "2016-01-28",
               zone_id: 2,
               subactivity_id: 24
           },
           {
               day: "2016-01-29",
               zone_id: 2,
               subactivity_id: 2
           },
           //{
            //   day: "2016-01-29",
            //   zone_id: 2,
            //   subactivity_id: 19
           //},
           //{
            //   day: "2016-01-29",
            //   zone_id: 2,
            //   subactivity_id: 4
           //},

           //Tâches S Zone 2 (PC)
           {
               day: "2016-02-01",
               zone_id: 2,
               subactivity_id: 2,
               pph: false
           },
           //{
            //   day: "2016-02-01",
            //   zone_id: 2,
            //   subactivity_id: 4,
            //   pph: false
           //},
           {
               day: "2016-02-01",
               zone_id: 2,
               subactivity_id: 8,
               pph: false
           },
           {
               day: "2016-02-02",
               zone_id: 2,
               subactivity_id: 8,
               pph: false
           },
           {
               day: "2016-02-02",
               zone_id: 2,
               subactivity_id: 9,
               pph: false
           },
           {
               day: "2016-02-03",
               zone_id: 2,
               subactivity_id: 9,
               pph: false
           },
           //{
            //   day: "2016-02-03",
            //   zone_id: 2,
            //   subactivity_id: 16,
            //   pph: false
           //},
           //{
            //   day: "2016-02-03",
            //   zone_id: 2,
            //   subactivity_id: 20,
            //   pph: false
           //},
           {
               day: "2016-02-04",
               zone_id: 2,
               subactivity_id: 11,
               pph: false,
               materials: [
                            {id: 804},
                            {id: 805},
                            {id: 806}
                          ]
           },
           {
               day: "2016-02-04",
               zone_id: 2,
               subactivity_id: 13,
               pph: false,
               materials: [
                            {id: 711},
                            {id: 712},
                            {id: 713},
                            {id: 714},
                            {id: 715},
                            {id: 716},
                            {id: 717},
                            {id: 718},
                            {id: 719},
                            {id: 720}
                          ]
           },
           {
               day: "2016-02-04",
               zone_id: 2,
               subactivity_id: 14,
               pph: false,
               materials: [
                            {id: 900}
                          ]
           },
           {
               day: "2016-02-05",
               zone_id: 2,
               subactivity_id: 17,
               pph: false,
               materials: [
                            {id: 2901}
                          ]
           },
           {
               day: "2016-02-05",
               zone_id: 2,
               subactivity_id: 18,
               pph: false,
               materials: [
                            {id: 2902}
                          ]
           },
           {
               day: "2016-02-05",
               zone_id: 2,
               subactivity_id: 21,
               pph: false,
               materials: [
                            {id: 2600}
                          ]
           },
           {
               day: "2016-02-05",
               zone_id: 2,
               subactivity_id: 15,
               pph: false,
               materials: [
                            {id: 1000}
                          ]
           },

           // Tâche déjà planifiées PPH Zone 2
           {
               day: "2016-02-01",
               zone_id: 2,
               subactivity_id: 2,
               pph: true,
               top: '300px',
               left: '550px'
           },
           {
               day: "2016-02-01",
               zone_id: 2,
               subactivity_id: 4,
               pph: true,
               top: '300px',
               left: '640px'
           },
           {
               day: "2016-02-01",
               zone_id: 2,
               subactivity_id: 8,
               pph: true,
               top: '300px',
               left: '720px'
           },
           {
               day: "2016-02-02",
               zone_id: 2,
               subactivity_id: 8,
               pph: true,
               top: '300px',
               left: '570px'
           },
           {
               day: "2016-02-02",
               zone_id: 2,
               subactivity_id: 9,
               pph: true,
               top: '300px',
               left: '660px'
           },
           {
               day: "2016-02-03",
               zone_id: 2,
               subactivity_id: 9,
               pph: true,
               top: '300px',
               left: '550px'
           },
           {
               day: "2016-02-03",
               zone_id: 2,
               subactivity_id: 16,
               pph: true,
               top: '300px',
               left: '640px'
           },
           {
               day: "2016-02-03",
               zone_id: 2,
               subactivity_id: 20,
               pph: true,
               top: '300px',
               left: '720px'
           },
           {
               day: "2016-02-04",
               zone_id: 2,
               subactivity_id: 11,
               pph: true,
               top: '300px',
               left: '550px'
           },
           {
               day: "2016-02-04",
               zone_id: 2,
               subactivity_id: 13,
               pph: true,
               top: '300px',
               left: '640px'
           },
           {
               day: "2016-02-04",
               zone_id: 2,
               subactivity_id: 14,
               pph: true,
               top: '300px',
               left: '720px'
           },
           {
               day: "2016-02-05",
               zone_id: 2,
               subactivity_id: 17,
               pph: true,
               top: '300px',
               left: '665px'
           },
           {
               day: "2016-02-05",
               zone_id: 2,
               subactivity_id: 18,
               pph: true,
               top: '300px',
               left: '590px'
           },
           {
               day: "2016-02-05",
               zone_id: 2,
               subactivity_id: 21,
               pph: true,
               top: '300px',
               left: '520px'
           },
           {
               day: "2016-02-05",
               zone_id: 2,
               subactivity_id: 15,
               pph: true,
               top: '300px',
               left: '740px'
           },

           // fin tâches planifiées PPH S Zone 2


           {
               day: "2016-02-08",
               zone_id: 2,
               subactivity_id: 22
           },
           //{
            //   day: "2016-02-08",
            //   zone_id: 2,
            //   subactivity_id: 23
           //},
           {
               day: "2016-02-10",
               zone_id: 2,
               subactivity_id: 5,
               materials: [
                            {id: 6700},
                          ]

           },
           {
               day: "2016-02-12",
               zone_id: 2,
               subactivity_id: 24,
               materials: [
                            {id: 1900},
                          ]
           },
           //{
            //   day: "2016-02-15",
            //   zone_id: 2,
            //   subactivity_id: 1
           //},
           {
               day: "2016-02-15",
               zone_id: 2,
               subactivity_id: 3
           },
           {
               day: "2016-02-15",
               zone_id: 2,
               subactivity_id: 24
           },
           {
               day: "2016-02-16",
               zone_id: 2,
               subactivity_id: 2
           },
           //{
            //   day: "2016-02-16",
            //   zone_id: 2,
            //   subactivity_id: 19
           //},
           //{
            //   day: "2016-02-16",
            //   zone_id: 2,
            //   subactivity_id: 4
           //},
           {
               day: "2016-02-17",
               zone_id: 2,
               subactivity_id: 2
           },
           //{
            //   day: "2016-02-17",
            //   zone_id: 2,
            //   subactivity_id: 4
           //},
           {
               day: "2016-02-17",
               zone_id: 2,
               subactivity_id: 8
           },
           {
               day: "2016-02-18",
               zone_id: 2,
               subactivity_id: 8
           },
           {
               day: "2016-02-18",
               zone_id: 2,
               subactivity_id: 9
           },
           {
               day: "2016-02-19",
               zone_id: 2,
               subactivity_id: 9
           },
           //{
            //   day: "2016-02-19",
            //   zone_id: 2,
            //   subactivity_id: 16
           //},
           //{
             //  day: "2016-02-19",
             //  zone_id: 2,
             //  subactivity_id: 20
           //},
           {
               day: "2016-02-22",
               zone_id: 2,
               subactivity_id: 11
           },
           {
               day: "2016-02-22",
               zone_id: 2,
               subactivity_id: 13
           },
           {
               day: "2016-02-22",
               zone_id: 2,
               subactivity_id: 14
           },
           {
               day: "2016-02-23",
               zone_id: 2,
               subactivity_id: 17
           },
           {
               day: "2016-02-23",
               zone_id: 2,
               subactivity_id: 18
           },
           {
               day: "2016-02-23",
               zone_id: 2,
               subactivity_id: 21
           },
           {
               day: "2016-02-23",
               zone_id: 2,
               subactivity_id: 15
           },
           {
               day: "2016-02-24",
               zone_id: 2,
               subactivity_id: 22
           },
           //{
            //   day: "2016-02-24",
            //   zone_id: 2,
            //   subactivity_id: 23
           //},
           {
               day: "2016-02-26",
               zone_id: 2,
               subactivity_id: 5
           },


           {
               day: "2016-03-01",
               zone_id: 2,
               subactivity_id: 24
           },
           //{
            //   day: "2016-03-02",
            //   zone_id: 2,
            //   subactivity_id: 1
           //},
           {
               day: "2016-03-02",
               zone_id: 2,
               subactivity_id: 3
           },
           {
               day: "2016-03-02",
               zone_id: 2,
               subactivity_id: 24
           },
           {
               day: "2016-03-03",
               zone_id: 2,
               subactivity_id: 2
           },
           //{
            //   day: "2016-03-03",
            //   zone_id: 2,
            //   subactivity_id: 19
           //},
           //{
            //   day: "2016-03-03",
            //   zone_id: 2,
            //   subactivity_id: 4
           //},
           {
               day: "2016-03-04",
               zone_id: 2,
               subactivity_id: 2
           },
           //{
            //   day: "2016-03-04",
            //   zone_id: 2,
            //   subactivity_id: 4
           //},
           {
               day: "2016-03-04",
               zone_id: 2,
               subactivity_id: 8
           },
           {
               day: "2016-03-07",
               zone_id: 2,
               subactivity_id: 8
           },
           {
               day: "2016-03-07",
               zone_id: 2,
               subactivity_id: 9
           },
           {
               day: "2016-03-08",
               zone_id: 2,
               subactivity_id: 9
           },
           //{
             //  day: "2016-03-08",
             //  zone_id: 2,
             //  subactivity_id: 16
           //},
           //{
             //  day: "2016-03-08",
             //  zone_id: 2,
             //  subactivity_id: 20
           //},
           {
               day: "2016-03-09",
               zone_id: 2,
               subactivity_id: 11,
               materials: [
                            {id: 3904},
                            {id: 3905},
                            {id: 3906}
                          ]
           },
           {
               day: "2016-03-09",
               zone_id: 2,
               subactivity_id: 13,
               materials: [
                            {id: 3411},
                            {id: 3412},
                            {id: 3413},
                            {id: 3414},
                            {id: 3415},
                            {id: 3416},
                            {id: 3417},
                            {id: 3418},
                            {id: 3419},
                            {id: 3420}
                          ]
           },
           {
               day: "2016-03-09",
               zone_id: 2,
               subactivity_id: 14,
               materials: [
                            {id: 3700}
                          ]
           },
           {
               day: "2016-03-10",
               zone_id: 2,
               subactivity_id: 17,
               materials: [
                            {id: 4201}
                          ]
           },
           {
               day: "2016-03-10",
               zone_id: 2,
               subactivity_id: 18,
               materials: [
                            {id: 4202}
                          ]
           },
           {
               day: "2016-03-10",
               zone_id: 2,
               subactivity_id: 21,
               materials: [
                            {id: 4400}
                          ]
           },
           {
               day: "2016-03-10",
               zone_id: 2,
               subactivity_id: 15,
               materials: [
                            {id: 3600}
                          ]
           },
           {
               day: "2016-03-11",
               zone_id: 2,
               subactivity_id: 22
           },
           //{
            //   day: "2016-03-11",
            //   zone_id: 2,
            //   subactivity_id: 23
           //},
           {
               day: "2016-03-15",
               zone_id: 2,
               subactivity_id: 5,
                materials: [
                            {id: 5000}
                        ]
           },


           {
               day: "2016-03-17",
               zone_id: 2,
               subactivity_id: 24,
               materials: [
                            {id: 5500}
                        ]
           },
           //{
            //   day: "2016-03-18",
            //   zone_id: 2,
            //   subactivity_id: 1
           //},
           {
               day: "2016-03-18",
               zone_id: 2,
               subactivity_id: 3,
               materials: [
                            {id: 5702},
                            {id: 5708},
                            {id: 5709},
                            {id: 5710},
                            {id: 5711},
                            {id: 5716},
                            {id: 5717},
                            {id: 5719}
                          ]
           },
           {
               day: "2016-03-18",
               zone_id: 2,
               subactivity_id: 24
           },
           {
               day: "2016-03-21",
               zone_id: 2,
               subactivity_id: 2
           },
           //{
            //   day: "2016-03-21",
            //   zone_id: 2,
            //   subactivity_id: 19
           //},
           //{
            //   day: "2016-03-21",
            //   zone_id: 2,
            //   subactivity_id: 4
           //},
           {
               day: "2016-03-22",
               zone_id: 2,
               subactivity_id: 2
           },
           //{
            //   day: "2016-03-22",
            //   zone_id: 2,
            //   subactivity_id: 4
           //},
           {
               day: "2016-03-22",
               zone_id: 2,
               subactivity_id: 8
           },
           {
               day: "2016-03-23",
               zone_id: 2,
               subactivity_id: 8
           },
           {
               day: "2016-03-23",
               zone_id: 2,
               subactivity_id: 9
           },
           {
               day: "2016-03-24",
               zone_id: 2,
               subactivity_id: 9
           },
           //{
            //   day: "2016-03-24",
            //   zone_id: 2,
            //   subactivity_id: 16
           //},
           //{
            //   day: "2016-03-24",
            //   zone_id: 2,
            //   subactivity_id: 20
           //},
           {
               day: "2016-03-25",
               zone_id: 2,
               subactivity_id: 11
           },
           {
               day: "2016-03-25",
               zone_id: 2,
               subactivity_id: 13
           },
           {
               day: "2016-03-25",
               zone_id: 2,
               subactivity_id: 14
           },
           {
               day: "2016-03-28",
               zone_id: 2,
               subactivity_id: 17
           },
           {
               day: "2016-03-28",
               zone_id: 2,
               subactivity_id: 18
           },
           {
               day: "2016-03-28",
               zone_id: 2,
               subactivity_id: 21
           },
           {
               day: "2016-03-28",
               zone_id: 2,
               subactivity_id: 15
           },
           {
               day: "2016-03-29",
               zone_id: 2,
               subactivity_id: 22
           },
           //{
            //   day: "2016-03-29",
            //   zone_id: 2,
            //   subactivity_id: 23
           //},
           {
               day: "2016-03-31",
               zone_id: 2,
               subactivity_id: 5
           },




           {
               day: "2016-04-04",
               zone_id: 2,
               subactivity_id: 24
           },
           //{
            //   day: "2016-04-05",
            //   zone_id: 2,
            //   subactivity_id: 1
           //},
           {
               day: "2016-04-05",
               zone_id: 2,
               subactivity_id: 3
           },
           {
               day: "2016-04-05",
               zone_id: 2,
               subactivity_id: 24
           },
           {
               day: "2016-04-06",
               zone_id: 2,
               subactivity_id: 2
           },
           //{
            //   day: "2016-04-06",
            //   zone_id: 2,
            //   subactivity_id: 19
           //},
           //{
            //   day: "2016-04-06",
            //   zone_id: 2,
            //   subactivity_id: 4
           //},
           {
               day: "2016-04-07",
               zone_id: 2,
               subactivity_id: 2
           },
           //{
            //   day: "2016-04-07",
            //   zone_id: 2,
            //   subactivity_id: 4
           //},
           {
               day: "2016-04-07",
               zone_id: 2,
               subactivity_id: 8
           },
           {
               day: "2016-04-08",
               zone_id: 2,
               subactivity_id: 8
           },
           {
               day: "2016-04-08",
               zone_id: 2,
               subactivity_id: 9
           },
           {
               day: "2016-04-11",
               zone_id: 2,
               subactivity_id: 9
           },
           //{
            //   day: "2016-04-11",
            //   zone_id: 2,
            //   subactivity_id: 16
           //},
           //{
            //   day: "2016-04-11",
            //   zone_id: 2,
            //   subactivity_id: 20
           //},
           {
               day: "2016-04-12",
               zone_id: 2,
               subactivity_id: 11
           },
           {
               day: "2016-04-12",
               zone_id: 2,
               subactivity_id: 13
           },
           {
               day: "2016-04-12",
               zone_id: 2,
               subactivity_id: 14
           },
           {
               day: "2016-04-13",
               zone_id: 2,
               subactivity_id: 17
           },
           {
               day: "2016-04-13",
               zone_id: 2,
               subactivity_id: 18
           },
           {
               day: "2016-04-13",
               zone_id: 2,
               subactivity_id: 21
           },
           {
               day: "2016-04-13",
               zone_id: 2,
               subactivity_id: 15
           },
           {
               day: "2016-04-14",
               zone_id: 2,
               subactivity_id: 22
           },
           //{
            //   day: "2016-04-14",
            //   zone_id: 2,
            //   subactivity_id: 23
           //},
           {
               day: "2016-04-18",
               zone_id: 2,
               subactivity_id: 5
           },






            //Tâches PC S Zone 3
           //{
            //   day: "2016-02-02",
            //   zone_id: 3,
            //   subactivity_id: 1,
            //   pph: false
           //},
           {
               day: "2016-02-02",
               zone_id: 3,
               subactivity_id: 3,
               pph: false,
               materials: [
                            {id: 620},
                            {id: 621},
                            {id: 622},
                            {id: 623},
                            {id: 624},
                            {id: 625},
                            {id: 626},
                            {id: 627},
                            {id: 628},
                            {id: 629}
                          ]
           },
           {
               day: "2016-02-02",
               zone_id: 3,
               subactivity_id: 24,
               pph: false,
               materials: [
                            {id: 300},
                          ]
           },
           {
               day: "2016-02-03",
               zone_id: 3,
               subactivity_id: 2,
               pph: false,
               materials: [
                            {id: 526},
                            {id: 527},
                            {id: 528},
                            {id: 529},
                            {id: 530},
                            {id: 531},
                            {id: 532},
                            {id: 533},
                            {id: 534},
                            {id: 535},
                            {id: 536},
                            {id: 537},
                            {id: 538},
                            {id: 539},
                            {id: 540},
                            {id: 541},
                            {id: 542},
                          ]
           },
           //{
            //   day: "2016-02-03",
            //   zone_id: 3,
            //   subactivity_id: 19,
            //   pph: false
           //},
           //{
            //   day: "2016-02-03",
            //   zone_id: 3,
            //   subactivity_id: 4,
            //   pph: false
           //},
           {
               day: "2016-02-03",
               zone_id: 3,
               subactivity_id: 24,
               pph: false
           },
           {
               day: "2016-02-04",
               zone_id: 3,
               subactivity_id: 2,
               pph: false
           },
           //{
            //   day: "2016-02-04",
            //   zone_id: 3,
            //   subactivity_id: 4,
            //   pph: false
           //},
           {
               day: "2016-02-04",
               zone_id: 3,
               subactivity_id: 8,
               pph: false
           },
           {
               day: "2016-02-05",
               zone_id: 3,
               subactivity_id: 8,
               pph: false
           },
           {
               day: "2016-02-05",
               zone_id: 3,
               subactivity_id: 9,
               pph: false
           },
            //Tâche planifiées PPH S Zone 3

           {
               day: "2016-02-02",
               zone_id: 3,
               subactivity_id: 1,
               pph: true,
               top: '390px',
               left: '1030px'
           },
           {
               day: "2016-02-02",
               zone_id: 3,
               subactivity_id: 3,
               pph: true,
               top: '390px',
               left: '1110px'
           },
           {
               day: "2016-02-02",
               zone_id: 3,
               subactivity_id: 24,
               pph: true,
               top: '280px',
               left: '1090px'
           },
           {
               day: "2016-02-03",
               zone_id: 3,
               subactivity_id: 2,
               pph: true,
               top: '285px',
               left: '1030px'
           },
           {
               day: "2016-02-03",
               zone_id: 3,
               subactivity_id: 19,
               pph: true,
               top: '370px',
               left: '1030px'
           },
           {
               day: "2016-02-03",
               zone_id: 3,
               subactivity_id: 4,
               pph: true,
               top: '370px',
               left: '1110px'
           },
           {
               day: "2016-02-03",
               zone_id: 3,
               subactivity_id: 24,
               pph: true,
               top: '470px',
               left: '1110px'
           },
           {
               day: "2016-02-04",
               zone_id: 3,
               subactivity_id: 2,
               pph: true,
               top: '370px',
               left: '1030px'
           },
           {
               day: "2016-02-04",
               zone_id: 3,
               subactivity_id: 4,
               pph: true,
               top: '430px',
               left: '1025px'
           },
           {
               day: "2016-02-04",
               zone_id: 3,
               subactivity_id: 8,
               pph: true,
               top: '290px',
               left: '1080px'
           },
           {
               day: "2016-02-05",
               zone_id: 3,
               subactivity_id: 8,
               pph: true,
               top: '360px',
               left: '1020px'
           },
           {
               day: "2016-02-05",
               zone_id: 3,
               subactivity_id: 9,
               pph: true,
               top: '360px',
               left: '1110px'
           },
           {
               day: "2016-02-08",
               zone_id: 3,
               subactivity_id: 9
           },
           //{
            //   day: "2016-02-08",
            //   zone_id: 3,
            //   subactivity_id: 16
           //},
           //{
            //   day: "2016-02-08",
            //   zone_id: 3,
            //   subactivity_id: 20
           //},
           //{
            //   day: "2016-02-09",
            //   zone_id: 3,
            //   subactivity_id: 10
           //},
           {
               day: "2016-02-09",
               zone_id: 3,
               subactivity_id: 11,
               materials: [
                            {id: 2107},
                            {id: 2108},
                            {id: 2109}
                          ]
           },
           {
               day: "2016-02-09",
               zone_id: 3,
               subactivity_id: 13,
               materials: [
                            {id: 2021},
                            {id: 2022},
                            {id: 2023},
                            {id: 2024},
                            {id: 2025},
                            {id: 2026},
                            {id: 2027},
                            {id: 2028},
                            {id: 2029},
                            {id: 2030}
                          ]
           },
           {
               day: "2016-02-09",
               zone_id: 3,
               subactivity_id: 14,
               materials: [
                            {id: 1400},
                          ]
           },
           {
               day: "2016-02-10",
               zone_id: 3,
               subactivity_id: 17,
               materials: [
                            {id: 3001},
                          ]

           },
           {
               day: "2016-02-10",
               zone_id: 3,
               subactivity_id: 18,
               materials: [
                            {id: 3002},
                          ]
           },
           {
               day: "2016-02-10",
               zone_id: 3,
               subactivity_id: 21,
               materials: [
                            {id: 2700},
                          ]
           },
           {
               day: "2016-02-10",
               zone_id: 3,
               subactivity_id: 15,
               materials: [
                            {id: 1500},
                          ]
           },
           {
               day: "2016-02-11",
               zone_id: 3,
               subactivity_id: 22
           },
           //{
            //   day: "2016-02-11",
            //   zone_id: 3,
            //   subactivity_id: 23
           //},
           //{
            //   day: "2016-02-18",
            //   zone_id: 3,
            //   subactivity_id: 1
           //},
           {
               day: "2016-02-18",
               zone_id: 3,
               subactivity_id: 3
           },
           {
               day: "2016-02-18",
               zone_id: 3,
               subactivity_id: 24
           },
           {
               day: "2016-02-19",
               zone_id: 3,
               subactivity_id: 2
           },
           //{
            //   day: "2016-02-19",
            //   zone_id: 3,
            //   subactivity_id: 19
           //},
           //{
            //   day: "2016-02-19",
            //   zone_id: 3,
            //   subactivity_id: 4
           //},
           {
               day: "2016-02-19",
               zone_id: 3,
               subactivity_id: 24
           },
           {
               day: "2016-02-22",
               zone_id: 3,
               subactivity_id: 2
           },
           //{
            //   day: "2016-02-22",
            //   zone_id: 3,
            //   subactivity_id: 4
           //},
           {
               day: "2016-02-22",
               zone_id: 3,
               subactivity_id: 8
           },
           {
               day: "2016-02-23",
               zone_id: 3,
               subactivity_id: 8
           },
           {
               day: "2016-02-23",
               zone_id: 3,
               subactivity_id: 9
           },
           {
               day: "2016-02-24",
               zone_id: 3,
               subactivity_id: 9
           },
           //{
            //   day: "2016-02-24",
            //   zone_id: 3,
            //   subactivity_id: 16
           //},
           //{
            //   day: "2016-02-24",
            //   zone_id: 3,
            //   subactivity_id: 20
           //},
           //{
            //   day: "2016-02-25",
            //   zone_id: 3,
            //   subactivity_id: 10
           //},
           {
               day: "2016-02-25",
               zone_id: 3,
               subactivity_id: 11
           },
           {
               day: "2016-02-25",
               zone_id: 3,
               subactivity_id: 13
           },
           {
               day: "2016-02-25",
               zone_id: 3,
               subactivity_id: 14
           },
           {
               day: "2016-02-26",
               zone_id: 3,
               subactivity_id: 17
           },
           {
               day: "2016-02-26",
               zone_id: 3,
               subactivity_id: 18
           },
           {
               day: "2016-02-26",
               zone_id: 3,
               subactivity_id: 21
           },
           {
               day: "2016-02-26",
               zone_id: 3,
               subactivity_id: 15
           },
           {
               day: "2016-02-29",
               zone_id: 3,
               subactivity_id: 22
           },
           //{
            //   day: "2016-02-29",
            //   zone_id: 3,
            //   subactivity_id: 23
           //},
           //{
            //   day: "2016-03-07",
            //   zone_id: 3,
            //   subactivity_id: 1
           //},
           {
               day: "2016-03-07",
               zone_id: 3,
               subactivity_id: 3
           },
           {
               day: "2016-03-07",
               zone_id: 3,
               subactivity_id: 24
           },
           {
               day: "2016-03-08",
               zone_id: 3,
               subactivity_id: 2
           },
           //{
            //   day: "2016-03-08",
            //   zone_id: 3,
            //   subactivity_id: 19
           //},
           //{
            //   day: "2016-03-08",
            //   zone_id: 3,
            //   subactivity_id: 4
           //},
           {
               day: "2016-03-08",
               zone_id: 3,
               subactivity_id: 24
           },
           {
               day: "2016-03-09",
               zone_id: 3,
               subactivity_id: 2
           },
           //{
            //   day: "2016-03-09",
            //   zone_id: 3,
            //   subactivity_id: 4
           //},
           {
               day: "2016-03-09",
               zone_id: 3,
               subactivity_id: 8
           },
           {
               day: "2016-03-10",
               zone_id: 3,
               subactivity_id: 8
           },
           {
               day: "2016-03-10",
               zone_id: 3,
               subactivity_id: 9
           },
           {
               day: "2016-03-11",
               zone_id: 3,
               subactivity_id: 9
           },
           //{
            //   day: "2016-03-11",
            //   zone_id: 3,
            //   subactivity_id: 16
           //},
           //{
            //   day: "2016-03-11",
            //   zone_id: 3,
            //   subactivity_id: 20
           //},
           //{
            //   day: "2016-03-14",
            //   zone_id: 3,
            //   subactivity_id: 10
           //},
           {
               day: "2016-03-14",
               zone_id: 3,
               subactivity_id: 11,
               materials: [
                            {id: 4607},
                            {id: 4608},
                            {id: 4609}
                          ]
           },
           {
               day: "2016-03-14",
               zone_id: 3,
               subactivity_id: 13,
                materials: [
                            {id: 4021},
                            {id: 4022},
                            {id: 4023},
                            {id: 4024},
                            {id: 4025},
                            {id: 4026},
                            {id: 4027},
                            {id: 4028},
                            {id: 4029},
                            {id: 4030}
                          ]
           },
           {
               day: "2016-03-14",
               zone_id: 3,
               subactivity_id: 14,
               materials: [
                            {id: 4800}
                          ]
           },
           {
               day: "2016-03-15",
               zone_id: 3,
               subactivity_id: 17,
                materials: [
                            {id: 5201}
                        ]
           },
           {
               day: "2016-03-15",
               zone_id: 3,
               subactivity_id: 18,
               materials: [
                            {id: 5202}
                        ]
           },
           {
               day: "2016-03-15",
               zone_id: 3,
               subactivity_id: 21,
               materials: [
                            {id: 5100}
                        ]
           },
           {
               day: "2016-03-15",
               zone_id: 3,
               subactivity_id: 15,
               materials: [
                            {id: 4900}
                        ]
           },
           {
               day: "2016-03-16",
               zone_id: 3,
               subactivity_id: 22
           },
           //{
            //   day: "2016-03-16",
            //   zone_id: 3,
            //   subactivity_id: 23
           //},
           //{
            //   day: "2016-03-23",
            //   zone_id: 3,
            //   subactivity_id: 1
           //},
           {
               day: "2016-03-23",
               zone_id: 3,
               subactivity_id: 3
           },
           {
               day: "2016-03-23",
               zone_id: 3,
               subactivity_id: 24
           },
           {
               day: "2016-03-24",
               zone_id: 3,
               subactivity_id: 2
           },
           //{
            //   day: "2016-03-24",
            //   zone_id: 3,
            //   subactivity_id: 19
           //},
           //{
            //   day: "2016-03-24",
            //   zone_id: 3,
            //   subactivity_id: 4
           //},
           {
               day: "2016-03-24",
               zone_id: 3,
               subactivity_id: 24
           },
           {
               day: "2016-03-25",
               zone_id: 3,
               subactivity_id: 2
           },
           //{
            //   day: "2016-03-25",
            //   zone_id: 3,
            //   subactivity_id: 4
           //},
           {
               day: "2016-03-25",
               zone_id: 3,
               subactivity_id: 8
           },
           {
               day: "2016-03-28",
               zone_id: 3,
               subactivity_id: 8
           },
           {
               day: "2016-03-28",
               zone_id: 3,
               subactivity_id: 9
           },
           {
               day: "2016-03-29",
               zone_id: 3,
               subactivity_id: 9
           },
           //{
            //   day: "2016-03-29",
            //   zone_id: 3,
            //   subactivity_id: 16
           //},
           //{
            //   day: "2016-03-29",
            //   zone_id: 3,
            //   subactivity_id: 20
           //},
           //{
            //   day: "2016-03-30",
            //   zone_id: 3,
            //   subactivity_id: 10
           //},
           {
               day: "2016-03-30",
               zone_id: 3,
               subactivity_id: 11
           },
           {
               day: "2016-03-30",
               zone_id: 3,
               subactivity_id: 13
           },
           {
               day: "2016-03-30",
               zone_id: 3,
               subactivity_id: 14
           },
           {
               day: "2016-03-31",
               zone_id: 3,
               subactivity_id: 17
           },
           {
               day: "2016-03-31",
               zone_id: 3,
               subactivity_id: 18
           },
           {
               day: "2016-03-31",
               zone_id: 3,
               subactivity_id: 21
           },
           {
               day: "2016-03-31",
               zone_id: 3,
               subactivity_id: 15
           },
           {
               day: "2016-04-01",
               zone_id: 3,
               subactivity_id: 22
           },
           //{
            //   day: "2016-04-01",
            //   zone_id: 3,
            //   subactivity_id: 23
           //},
           //{
            //   day: "2016-04-08",
            //   zone_id: 3,
            //   subactivity_id: 1
           //},
           {
               day: "2016-04-08",
               zone_id: 3,
               subactivity_id: 3
           },
           {
               day: "2016-04-08",
               zone_id: 3,
               subactivity_id: 24
           },
           {
               day: "2016-04-11",
               zone_id: 3,
               subactivity_id: 2
           },
           //{
            //   day: "2016-04-11",
            //   zone_id: 3,
            //   subactivity_id: 19
           //},
           //{
            //   day: "2016-04-11",
            //   zone_id: 3,
            //   subactivity_id: 4
           //},
           {
               day: "2016-04-11",
               zone_id: 3,
               subactivity_id: 24
           },
           {
               day: "2016-04-12",
               zone_id: 3,
               subactivity_id: 2
           },
           //{
            //   day: "2016-04-12",
            //   zone_id: 3,
            //   subactivity_id: 4
           //},
           {
               day: "2016-04-12",
               zone_id: 3,
               subactivity_id: 8
           },
           {
               day: "2016-04-13",
               zone_id: 3,
               subactivity_id: 8
           },
           {
               day: "2016-04-13",
               zone_id: 3,
               subactivity_id: 9
           },
           {
               day: "2016-04-14",
               zone_id: 3,
               subactivity_id: 9
           },
           //{
            //   day: "2016-04-14",
            //   zone_id: 3,
            //   subactivity_id: 16
           //},
           //{
            //   day: "2016-04-14",
            //   zone_id: 3,
            //   subactivity_id: 20
           //},
           //{
            //   day: "2016-04-15",
            //   zone_id: 3,
            //   subactivity_id: 10
           //},
           {
               day: "2016-04-15",
               zone_id: 3,
               subactivity_id: 11
           },
           {
               day: "2016-04-15",
               zone_id: 3,
               subactivity_id: 13
           },
           {
               day: "2016-04-15",
               zone_id: 3,
               subactivity_id: 14
           },
           {
               day: "2016-04-18",
               zone_id: 3,
               subactivity_id: 17
           },
           {
               day: "2016-04-18",
               zone_id: 3,
               subactivity_id: 18
           },
           {
               day: "2016-04-18",
               zone_id: 3,
               subactivity_id: 21
           },
           {
               day: "2016-04-18",
               zone_id: 3,
               subactivity_id: 15
           },
           {
               day: "2016-04-19",
               zone_id: 3,
               subactivity_id: 22
           },
           //{
            //   day: "2016-04-19",
            //   zone_id: 3,
            //   subactivity_id: 23
           //},


            //Tâches PC S Zone 4

            {
               day: "2016-02-04",
               zone_id: 4,
               subactivity_id: 24,
               pph: false,
               materials: [
                            {id: 400}
                          ]
           },
           //{
            //   day: "2016-02-05",
            //   zone_id: 4,
            //   subactivity_id: 1,
            //   pph: false
           //},
           {
               day: "2016-02-05",
               zone_id: 4,
               subactivity_id: 3,
               pph: false,
               materials: [
                            {id: 1230},
                            {id: 1231},
                            {id: 1232},
                            {id: 1233},
                            {id: 1234},
                            {id: 1235},
                            {id: 1236},
                            {id: 1237},
                            {id: 1238},
                            {id: 1239},
                            {id: 1240},
                            {id: 1241}
                          ]
           },
           {
               day: "2016-02-05",
               zone_id: 4,
               subactivity_id: 24,
               pph: false
           },

            //Tâches planifiées PPH S Zone 4
           {
               day: "2016-02-04",
               zone_id: 4,
               subactivity_id: 24,
               pph: true,
               top: '280px',
               left: '1330px'
           },
           {
               day: "2016-02-05",
               zone_id: 4,
               subactivity_id: 1,
               pph: true,
               top: '360px',
               left: '1300px'
           },
           {
               day: "2016-02-05",
               zone_id: 4,
               subactivity_id: 3,
               pph: true,
               top: '360px',
               left: '1380px'
           },
           {
               day: "2016-02-05",
               zone_id: 4,
               subactivity_id: 24,
               pph: true,
               top: '460px',
               left: '1310px'
           },
           {
               day: "2016-02-08",
               zone_id: 4,
               subactivity_id: 2,
               materials: [
                            {id: 1143},
                            {id: 1144},
                            {id: 1145},
                            {id: 1146},
                            {id: 1147},
                            {id: 1148},
                            {id: 1149},
                            {id: 1150},
                            {id: 1151},
                            {id: 1152},
                            {id: 1153},
                            {id: 1154},
                            {id: 6955},
                            {id: 6956},
                            {id: 6957},
                            {id: 7058},
                            {id: 7059},
                            {id: 7060}
                          ]
           },
           //{
            //   day: "2016-02-08",
            //   zone_id: 4,
            //   subactivity_id: 19
           //},
           //{
            //   day: "2016-02-08",
            //   zone_id: 4,
            //   subactivity_id: 4
           //},
           {
               day: "2016-02-09",
               zone_id: 4,
               subactivity_id: 2
           },
           //{
            //   day: "2016-02-09",
            //   zone_id: 4,
            //   subactivity_id: 4
           //},
           {
               day: "2016-02-09",
               zone_id: 4,
               subactivity_id: 8
           },
           {
               day: "2016-02-10",
               zone_id: 4,
               subactivity_id: 8
           },
           {
               day: "2016-02-10",
               zone_id: 4,
               subactivity_id: 9
           },
           {
               day: "2016-02-11",
               zone_id: 4,
               subactivity_id: 9
           },
           //{
            //   day: "2016-02-11",
            //   zone_id: 4,
            //   subactivity_id: 16
           //},
           //{
            //   day: "2016-02-11",
            //   zone_id: 4,
            //   subactivity_id: 20
           //},
           {
               day: "2016-02-12",
               zone_id: 4,
               subactivity_id: 11,
               materials: [
                            {id: 2410},
                            {id: 2411},
                            {id: 2412},
                          ]
           },
           {
               day: "2016-02-12",
               zone_id: 4,
               subactivity_id: 13,
               materials: [
                            {id: 2531},
                            {id: 2532},
                            {id: 2533},
                            {id: 2534},
                            {id: 2535},
                            {id: 2536},
                            {id: 2537},
                            {id: 2538},
                            {id: 2539},
                            {id: 2540}
                          ]
           },
           {
               day: "2016-02-12",
               zone_id: 4,
               subactivity_id: 14,
               materials: [
                            {id: 1600}
                          ]
           },
           {
               day: "2016-02-15",
               zone_id: 4,
               subactivity_id: 17
           },
           {
               day: "2016-02-15",
               zone_id: 4,
               subactivity_id: 18
           },
           {
               day: "2016-02-15",
               zone_id: 4,
               subactivity_id: 21
           },
           {
               day: "2016-02-15",
               zone_id: 4,
               subactivity_id: 15
           },
           {
               day: "2016-02-16",
               zone_id: 4,
               subactivity_id: 22
           },
           //{
            //   day: "2016-02-16",
            //   zone_id: 4,
            //   subactivity_id: 23
           //},
           {
               day: "2016-02-15",
               zone_id: 3,
               subactivity_id: 5
           },
           {
               day: "2016-02-22",
               zone_id: 4,
               subactivity_id: 24
           },
           //{
            //   day: "2016-02-23",
            //   zone_id: 4,
            //   subactivity_id: 1
           //},
           {
               day: "2016-02-23",
               zone_id: 4,
               subactivity_id: 3
           },
           {
               day: "2016-02-23",
               zone_id: 4,
               subactivity_id: 24
           },
           {
               day: "2016-02-24",
               zone_id: 4,
               subactivity_id: 2
           },
           //{
            //   day: "2016-02-24",
            //   zone_id: 4,
            //   subactivity_id: 19
           //},
           //{
            //   day: "2016-02-24",
            //   zone_id: 4,
            //   subactivity_id: 4
           //},
           {
               day: "2016-02-25",
               zone_id: 4,
               subactivity_id: 2
           },
           //{
            //   day: "2016-02-25",
            //   zone_id: 4,
            //   subactivity_id: 4
           //},
           {
               day: "2016-02-25",
               zone_id: 4,
               subactivity_id: 8
           },
           {
               day: "2016-02-26",
               zone_id: 4,
               subactivity_id: 8
           },
           {
               day: "2016-02-26",
               zone_id: 4,
               subactivity_id: 9
           },
           {
               day: "2016-02-29",
               zone_id: 4,
               subactivity_id: 9
           },
           //{
            //   day: "2016-02-29",
            //   zone_id: 4,
            //   subactivity_id: 16
           //},
           //{
            //   day: "2016-02-29",
            //   zone_id: 4,
            //   subactivity_id: 20
           //},
           {
               day: "2016-03-01",
               zone_id: 4,
               subactivity_id: 11
           },
           {
               day: "2016-03-01",
               zone_id: 4,
               subactivity_id: 13
           },
           {
               day: "2016-03-01",
               zone_id: 4,
               subactivity_id: 14
           },
           {
               day: "2016-03-02",
               zone_id: 4,
               subactivity_id: 17
           },
           {
               day: "2016-03-02",
               zone_id: 4,
               subactivity_id: 18
           },
           {
               day: "2016-03-02",
               zone_id: 4,
               subactivity_id: 21
           },
           {
               day: "2016-03-02",
               zone_id: 4,
               subactivity_id: 15
           },
           {
               day: "2016-03-03",
               zone_id: 4,
               subactivity_id: 22
           },
           //{
            //   day: "2016-03-03",
            //   zone_id: 4,
            //   subactivity_id: 23
           //},
           {
               day: "2016-03-02",
               zone_id: 3,
               subactivity_id: 5
           },


           {
               day: "2016-03-09",
               zone_id: 4,
               subactivity_id: 24,
               materials: [
                            {id: 3500}
                        ]
           },
           //{
            //   day: "2016-03-10",
            //   zone_id: 4,
            //   subactivity_id: 1
           //},
           {
               day: "2016-03-10",
               zone_id: 4,
               subactivity_id: 3,
               materials: [
                            {id: 3830},
                            {id: 3831},
                            {id: 3832},
                            {id: 3833},
                            {id: 3834},
                            {id: 3835},
                            {id: 3836},
                            {id: 3837},
                            {id: 3838},
                            {id: 3839},
                            {id: 3840},
                            {id: 3841}
                          ]
           },
           {
               day: "2016-03-10",
               zone_id: 4,
               subactivity_id: 24
           },
           {
               day: "2016-03-11",
               zone_id: 4,
               subactivity_id: 2,
               materials: [
                            {id: 6443},
                            {id: 6444},
                            {id: 6445},
                            {id: 6446},
                            {id: 6447},
                            {id: 6448},
                            {id: 6449},
                            {id: 6450},
                            {id: 6451},
                            {id: 6452},
                            {id: 6453},
                            {id: 6454},
                            {id: 6455},
                            {id: 6456},
                            {id: 6457},
                            {id: 6458},
                            {id: 6459},
                            {id: 6460}
                          ]
           },
           //{
            //   day: "2016-03-11",
            //   zone_id: 4,
            //   subactivity_id: 19
           //},
           //{
            //   day: "2016-03-11",
            //   zone_id: 4,
            //   subactivity_id: 4
           //},
           {
               day: "2016-03-14",
               zone_id: 4,
               subactivity_id: 2
           },
           {
               day: "2016-03-14",
               zone_id: 4,
               subactivity_id: 4
           },
           {
               day: "2016-03-14",
               zone_id: 4,
               subactivity_id: 8
           },
           {
               day: "2016-03-15",
               zone_id: 4,
               subactivity_id: 8
           },
           {
               day: "2016-03-15",
               zone_id: 4,
               subactivity_id: 9
           },
           {
               day: "2016-03-16",
               zone_id: 4,
               subactivity_id: 9
           },
           //{
            //   day: "2016-03-16",
            //   zone_id: 4,
            //   subactivity_id: 16
           //},
           //{
            //   day: "2016-03-16",
            //   zone_id: 4,
            //   subactivity_id: 20
           //},
           {
               day: "2016-03-17",
               zone_id: 4,
               subactivity_id: 11,
               materials: [
                            {id: 5810},
                            {id: 5811},
                            {id: 5812}
                          ]

           },
           {
               day: "2016-03-17",
               zone_id: 4,
               subactivity_id: 13,
               materials: [
                            {id: 5431},
                            {id: 5432},
                            {id: 5433},
                            {id: 5434},
                            {id: 5435},
                            {id: 5436},
                            {id: 5437},
                            {id: 5438},
                            {id: 5439},
                            {id: 5440},
                          ]
           },
           {
               day: "2016-03-17",
               zone_id: 4,
               subactivity_id: 14,
               materials: [
                            {id: 6000}
                          ]
           },
           {
               day: "2016-03-18",
               zone_id: 4,
               subactivity_id: 17,
               materials: [
                            {id: 6201}
                          ]
           },
           {
               day: "2016-03-18",
               zone_id: 4,
               subactivity_id: 18,
               materials: [
                            {id: 6202}
                          ]
           },
           {
               day: "2016-03-18",
               zone_id: 4,
               subactivity_id: 21,
               materials: [
                            {id: 6100}
                          ]
           },
           {
               day: "2016-03-18",
               zone_id: 4,
               subactivity_id: 15,
               materials: [
                            {id: 5900}
                          ]
           },
           {
               day: "2016-03-21",
               zone_id: 4,
               subactivity_id: 22
           },
           //{
            //   day: "2016-03-21",
            //   zone_id: 4,
            //   subactivity_id: 23
           //},
           {
               day: "2016-03-02",
               zone_id: 3,
               subactivity_id: 5
           },


           {
               day: "2016-03-25",
               zone_id: 4,
               subactivity_id: 24
           },
           //{
            //   day: "2016-03-28",
            //   zone_id: 4,
            //   subactivity_id: 1
           //},
           {
               day: "2016-03-28",
               zone_id: 4,
               subactivity_id: 3
           },
           {
               day: "2016-03-28",
               zone_id: 4,
               subactivity_id: 24
           },
           {
               day: "2016-03-29",
               zone_id: 4,
               subactivity_id: 2
           },
           //{
            //   day: "2016-03-29",
            //   zone_id: 4,
            //   subactivity_id: 19
           //},
           //{
            //   day: "2016-03-29",
            //   zone_id: 4,
            //   subactivity_id: 4
           //},
           {
               day: "2016-03-30",
               zone_id: 4,
               subactivity_id: 2
           },
           //{
            //   day: "2016-03-30",
            //   zone_id: 4,
            //   subactivity_id: 4
           //},
           {
               day: "2016-03-30",
               zone_id: 4,
               subactivity_id: 8
           },
           {
               day: "2016-03-31",
               zone_id: 4,
               subactivity_id: 8
           },
           {
               day: "2016-03-31",
               zone_id: 4,
               subactivity_id: 9
           },
           {
               day: "2016-04-01",
               zone_id: 4,
               subactivity_id: 9
           },
           //{
            //   day: "2016-04-01",
            //   zone_id: 4,
            //   subactivity_id: 16
           //},
           //{
            //   day: "2016-04-01",
            //   zone_id: 4,
            //   subactivity_id: 20
           //},
           {
               day: "2016-04-04",
               zone_id: 4,
               subactivity_id: 11
           },
           {
               day: "2016-04-04",
               zone_id: 4,
               subactivity_id: 13
           },
           {
               day: "2016-04-04",
               zone_id: 4,
               subactivity_id: 14
           },
           {
               day: "2016-04-05",
               zone_id: 4,
               subactivity_id: 17
           },
           {
               day: "2016-04-05",
               zone_id: 4,
               subactivity_id: 18
           },
           {
               day: "2016-04-05",
               zone_id: 4,
               subactivity_id: 21
           },
           {
               day: "2016-04-05",
               zone_id: 4,
               subactivity_id: 15
           },
           {
               day: "2016-04-06",
               zone_id: 4,
               subactivity_id: 22
           },
           {
               day: "2016-04-06",
               zone_id: 4,
               subactivity_id: 23
           },
           {
               day: "2016-03-18",
               zone_id: 3,
               subactivity_id: 5,
               materials: [
                            {id: 4700}
                          ]

           },


           {
               day: "2016-04-12",
               zone_id: 4,
               subactivity_id: 24
           },
           //{
            //   day: "2016-04-13",
            //   zone_id: 4,
            //   subactivity_id: 1
           //},
           {
               day: "2016-04-13",
               zone_id: 4,
               subactivity_id: 3
           },
           {
               day: "2016-04-13",
               zone_id: 4,
               subactivity_id: 24
           },
           {
               day: "2016-04-14",
               zone_id: 4,
               subactivity_id: 2
           },
           //{
            //   day: "2016-04-14",
            //   zone_id: 4,
            //   subactivity_id: 19
           //},
           //{
            //   day: "2016-04-14",
            //   zone_id: 4,
            //   subactivity_id: 4
           //},
           {
               day: "2016-04-15",
               zone_id: 4,
               subactivity_id: 2
           },
           //{
            //   day: "2016-04-15",
            //   zone_id: 4,
            //   subactivity_id: 4
           //},
           {
               day: "2016-04-15",
               zone_id: 4,
               subactivity_id: 8
           },
           {
               day: "2016-04-18",
               zone_id: 4,
               subactivity_id: 8
           },
           {
               day: "2016-04-18",
               zone_id: 4,
               subactivity_id: 9
           },
           {
               day: "2016-04-19",
               zone_id: 4,
               subactivity_id: 9
           },
           {
               day: "2016-04-19",
               zone_id: 4,
               subactivity_id: 16
           },
           //{
            //   day: "2016-04-19",
            //   zone_id: 4,
            //   subactivity_id: 20
           //},
           {
               day: "2016-04-20",
               zone_id: 4,
               subactivity_id: 11
           },
           {
               day: "2016-04-20",
               zone_id: 4,
               subactivity_id: 13
           },
           {
               day: "2016-04-20",
               zone_id: 4,
               subactivity_id: 14
           },
           {
               day: "2016-04-21",
               zone_id: 4,
               subactivity_id: 17
           },
           {
               day: "2016-04-21",
               zone_id: 4,
               subactivity_id: 18
           },
           {
               day: "2016-04-21",
               zone_id: 4,
               subactivity_id: 21
           },
           {
               day: "2016-04-21",
               zone_id: 4,
               subactivity_id: 15
           },
           {
               day: "2016-04-22",
               zone_id: 4,
               subactivity_id: 22
           },
           //{
            //   day: "2016-04-22",
            //   zone_id: 4,
            //   subactivity_id: 23
           //},
           {
               day: "2016-04-05",
               zone_id: 3,
               subactivity_id: 5
           },
        ];

tasks.map(function(task){
    request({
            url: API_TASK,
            method: 'POST',
            json: task
        },
        function(error, response, body) {
            if(error) {
                console.log(error);
            } else {
                //console.log(response.statusCode, 'Task: ', body);
            }
        });
});
