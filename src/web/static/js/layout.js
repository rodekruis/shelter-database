/**
 * LAYOUT : layout.js
 */

var loc = window.location.pathname; // returns the full URL

var selectMenuItem = function selectMenuItem(id){
	$('.select-menu').removeClass('selected');		
	$(id).addClass('selected');
}
			
if("" === loc || "/" === loc) {		
	selectMenuItem('#home');
} else if (loc.indexOf('page') > -1) {
	selectMenuItem('#knowledgebase');
} else {
	var m = loc.substring(1);
	var dash = m.indexOf('/');
	if(dash > -1){
		selectMenuItem('#' + m.substring(0, m.indexOf('/')));
	} else {
		selectMenuItem('#' + m);
	}						
}	
				  
 // make alerts disappear
 setTimeout(function() {
	$(".alert").fadeOut().empty();
 }, 7000);