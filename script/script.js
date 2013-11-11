var currentSection = -1;
var map;
var myPos;
var tmpMarker;
var infoWindow;
var newActivities;

var hostel = {
    title: 'Zinkensdamms hostel',
    address: 'Södermalm, Stockholm',
    description: 'A beautiful hostel at Södermalm in Stockholm.',
    price: '100 kr',
    img: null,
    pos: new google.maps.LatLng(59.314798, 18.044056),
}

var activities = [
    {
        title: 'Stockholms stadshus',
        address: 'Kungsholmen, Stockholm',
        description: 'The Stockholm stadshus is located at Kungsholmen.',
        price: '100 kr',
        img: null,
        pos: new google.maps.LatLng(59.327578, 18.053664),
    },
    {
        title: 'Vasamuseet',
        address: 'Djurgården, Stockholm',
        description: 'A museum displaying the Swedish warship Vasa which sunk on 10 august 1628.',
        price: '100 kr',
        img: null,
        pos: new google.maps.LatLng(59.328264, 18.091693),
    },
];

var chosenActivities = [];

var CONST = {
    'screen': {
        'WIDTH': 1920,
        'HEIGHT': 1080,
    },
    'menu': {
        'MENU_WIDTH': 300,
        'SECTION_WIDTH': 500,
        'NOTIFICATION_TIME': 100,
    },
    'section': {
        'SHOW_TIME': 250,
        'HIDE_TIME': 150,
    },
    'toolbar': {
        'MARGIN': 20,
    },
};

var section = (function() {
    var self = {};
    
    var sections = [];
    
    self.addSection = function( content, callback ) {
        var section = $('<div>').addClass('section');
        section.css({
            'width': CONST.menu.SECTION_WIDTH+'px',
            'left': (CONST.menu.MENU_WIDTH+(sections.length-1)*CONST.menu.SECTION_WIDTH)+'px',
        }).animate({
            'left': (CONST.menu.MENU_WIDTH+sections.length*CONST.menu.SECTION_WIDTH)+'px',
        }, CONST.section.SHOW_TIME);
        if( content ) {
            if( typeof content === 'string' ) {
                if( (/.*.html$/g).test(content) ) {
                    section.load(content, callback);
                }
            } else {
                section.html(content);
                if( callback ) {
                    callback();
                }
            }
        }
        sections.push(section);
        $('#content').append(section);
        
        $('#toolbar').animate({
            'left': (CONST.menu.MENU_WIDTH+sections.length*CONST.menu.SECTION_WIDTH+CONST.toolbar.MARGIN)+'px'
        }, CONST.section.SHOW_TIME);
    };
    
    self.removeSection = function( i ) {
        if( sections.length > 0 && i < sections.length ) {
            sections[i].animate({
                'left': ((i-1)*CONST.menu.SECTION_WIDTH)+'px',
            }, {
                'duration': CONST.section.HIDE_TIME,
                'complete': (function( section ) {
                    return function() {
                        section.remove();
                    };
                })(sections[i]),
            });
            sections.splice(i, 1);
            
            $('#toolbar').animate({
                'left': (CONST.menu.MENU_WIDTH+sections.length*CONST.menu.SECTION_WIDTH+CONST.toolbar.MARGIN)+'px'
            }, CONST.section.HIDE_TIME);
        }
    };

    return self;
})();

$('#content').append($('#menu').load('menu.html', function() {
    var ratio = $(window).width()/CONST.screen.WIDTH;
    $('body').css({
        'zoom': ratio,
    });
    /*
    $(window).resize(function() {
        var ratio = $(window).width()/CONST.screen.WIDTH;
        $('body').css({
            'zoom': ratio,
        });
    });
    */

    $('#menu').css({
        'width': CONST.menu.MENU_WIDTH+'px',
    });
    
    $('#menu input[type=button]').click(function() {
        var i = $(this).index();
        if( i !== currentSection ) {
            currentSection = i;
            
            section.removeSection(0);
            
            switch(currentSection) {
            case 0:
                section.addSection('search.html', function() {
                    // make search options into an accordion
                    $('#search-form').accordion();                    

                    $('#search-button').click(function() {
                        appendSearchResultsHtml(activities, $('#search .search-results'));
                    });
                });
                break;
            case 1:
                resetActivityNotification();
                section.addSection('my_activities.html', function() {
                    loadChosenActivities();
                });
                break;
            case 2:
                section.addSection('information.html', function(){
                    $("#information-menu button").click(function(){
                        var classes;     
                        $(this).toggleClass("ui-state-active");
                        $(this).toggleClass("ui-state-default");
                        classes = $(this).attr("class");  
          
                        if($(this).hasClass("ui-state-active")){
                            section.removeSection(1);
                            section.addSection("about_stockholm.html");      
                        }else{
                            section.removeSection(1);
                        }

                        $("#information-menu button").removeClass("ui-state-active");
                        $("#information-menu button").addClass("ui-state-default");
                        $(this).attr("class", classes);
                                   
                    });
                });

               
                break;
            case 3:
                section.addSection('recommendations.html');
                break;
            }
        } else {
            section.removeSection(0);
            currentSection = -1;
        }

        $('#menu input[type=button]').attr("class", "ui-state-default");
        $(this).attr("class", "ui-state-active");
    });
    // load the Google map
    myPos = new google.maps.LatLng(59.314798, 18.044056);
    var mapOptions = {
        center: myPos,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    /*map = new google.maps.Map($('#map')[0], mapOptions);
    // To add the marker to the map, use the 'map' property
    var marker = new google.maps.Marker({
        position: myPos,
        map: map,
        title: 'You are here',
    });
    var info = new google.maps.InfoWindow({
        content: $('<div>').append(
            $('<div>').addClass('info-window').html('You are here')
        ).html(),
    });
    info.open(map, marker);*/
    
    $('#toolbar').css('left', (CONST.menu.MENU_WIDTH+CONST.toolbar.MARGIN)+'px');
    
    newActivities = 0;
}));

function resetActivityNotification() {
    newActivities = 0;
    $('#menu .notification-wrapper .notification').html(newActivities).hide(CONST.menu.NOTIFICATION_TIME);
};

function notifyNewActivity() {
    newActivities ++;
    $('#menu .notification-wrapper .notification').html(newActivities).show(CONST.menu.NOTIFICATION_TIME);
};

function searchResultExpandEvent( activity ) {
    return function() {
        showActivityInMap(activity);
    };
};

function showActivityInMap( activity ) {
    if( tmpMarker ) {
        tmpMarker.setMap(null);
    }
    tmpMarker = new google.maps.Marker({
        position: activity.pos,
        map: map,
        title: activity.title,
    });
    infoWindow = new google.maps.InfoWindow({
        content: $('<div>')
            .append($('<div>').addClass('activity-info')
                .append($('<p>').html(activity.title))
                .append($('<p>').html(activity.description))
            ).html(),
    });
    infoWindow.open(map, tmpMarker);
};

function searchResultAddActivityEvent( index ) {
    return function() {
        if( chosenActivities.indexOf(index) === -1 ) {
            chosenActivities.push(index);
            notifyNewActivity();
        }
    };
};


