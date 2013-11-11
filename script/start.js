var ratio = $(window).width()/1920;
$('body').css({
    'zoom': ratio,
});

$('#start-screen').click(function() {
    window.location = 'map.html';
});