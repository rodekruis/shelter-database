		// when all dom elements are loaded
        $(document).ready(function() {
			// add spinner
			$('#newest').spin();
			
			// listen for the enter key to activate the search field
			document.getElementById("searchinput").addEventListener("keyup", function(e) {
				e.preventDefault();
				if (e.keyCode == 13) {
					window.location.href = "dashboard#zone=&crisis=&climate=&time=&country=&query=" + $('#searchinput').val();
				}
			});
		
			// the array down on the landing page
            $(".arrow-down").click(function(){
                $("body").animate({ scrollTop: window.innerHeight}, 400);
                return false;
            });
			
			// load the 3 latest shelters
			d3.json('/api/v0.2/shelters/latest/3', function (error, data) {
		  			
				// convert the api data into a simpler array
				var d = Object.keys(data).map(function(k) { 
												if(hasOwnProperty.call(data[k], "Identification")){
													var m = data[k].Identification;
													m.shelter_id = k;
													return m;
												}
											  });
				
				// generate the 3 blocks
				generate('#newest', d);
				
				// function to generate blocls
				function generate(flexbox, data) {

					var fb = d3.select(flexbox);
					

					// create a box for each object in the data
					var box = fb.selectAll('div')
					  .data(data)
					  .enter()
					  .append('div')
					     .attr('class', function (r) {
								return 'box';
							})

					// Add content
					box
								.append('div')
									.attr('class', 'image')
									.attr('style', function(d) {
										if(d.Cover.length){
											return 'background-image: url(' + d.Cover + ')';
										}
										else {
											return 'background-image: url(/)';
										}
									});
					box
						.append('h4').append('a')
							.attr('href', function (d) {
								return '/shelter/' + d.shelter_id;
							})
							.text(function (d) { 
								return d.Attributes.nameofshelter; 
							});
					box
						.append('p')
							.attr('class', 'country')
							.text(function (d) { 
								return d.Attributes.country; 
							});
					 
					}
			});
			
			// stop spinner
			$('#newest').spin(false);
		});