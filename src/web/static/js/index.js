/**
 * INDEX : index.js
 */

if("/" === loc) {
	
	var modalName = "";
	var modalOpen = function modalOpen(modalid){
		modalName = modalid;
		$("#wrapper").addClass("modal-open");
		$("#" + modalid).css("visibility", "visible");
		setPage(1);
	}
	var modalClose = function modalClose(){
		$("#wrapper").removeClass("modal-open");
		$("#" + modalName).css("visibility", "hidden");
		modalName = "";
	}

	var setPage = function setPage(page){
		modalPage = page;
		modalResetPages();
		$(".mymodal .page" + page).css("display", "block");
	}

	var modalResetPages = function modalResetPages() {
		$(".mymodal .page").each(function(el){
			$(this).css("display", "none");
		})
	}
	
	// function to generate blocks
	var generate = function generate(flexbox, data) {

		var fb = d3.select(flexbox);

		// create a box for each object in the data
		var box = fb.selectAll('div')
		  .data(data)
		  .enter()
		  .append('div')
			 .attr('class', 'box');

		// Add content
		box
					.append('div')
						.attr('class', 'image')
						.attr('style', function(d) {
							if(d.Cover.length == 1){
								return 'background-image: url(' + d.Cover + ')';
							}
							else if(d.Cover.length > 1){
								return 'background-image: url(' + d.Cover[d.Cover.length - 1] + ')';
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
	
	/**
	 * EVENTS
	 */
	// listen for the enter key to activate the search field
	$('#searchinput').keyup(function(e){ 
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

	/**
	 * LOGIC
	 */
	// load the 3 latest shelters
	d3.json('/api/v0.2/shelters/latest/3', function (error, data) {
			
		// add spinner
	    $('#newestcontent').spin();
		
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
		
		// stop spinner
		$('#newestcontent').spin(false);
	});
	
	
}

