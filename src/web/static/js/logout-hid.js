$(document).ready(function(){
    $("#logout-button").click(function(event){
        event.preventDefault();
        let logout = $(this).attr('href');
        let hid_logout = $(this).data('hid-href');
        hFrame = $('<iframe>');
        hFrame.attr("src", hid_logout);
        hFrame.css("display", "none");
        hFrame.css("visibility", "hidden");
        $('body').append(hFrame);
        hFrame[0].onload = function(){
            window.location.href = logout;
        };
    })
});
