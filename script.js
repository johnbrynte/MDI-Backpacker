var currentSection = -1;
var map;
var tmpMarker;
var infoWindow;

var activities = [
    {
        title: 'Stockholms stadshus',
        description: 'The Stockholm stadshus is located at Kungsholmen.',
        pos: new google.maps.LatLng(59.327578, 18.053664),
    },
    {
        title: 'Vasamuseet',
        description: 'A museum displaying the Swedish warship Vasa which sunk on 10 august 1628.',
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
    },
    'section': {
        'SHOW_TIME': 250,
        'HIDE_TIME': 150,
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
    };
    
    self.removeSection = function( i ) {
        if( sections.length > 0 ) {
            sections[i].animate({
                'left': ((i-1)*CONST.menu.SECTION_WIDTH)+'px',
            }, CONST.section.HIDE_TIME);
            sections.splice(i, 1);
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
                    $('#search-button').click(function() {
                        var result = $('#search .search-result');
                        result.html('');
                        for( var i = 0; i < activities.length; i ++ ) {
                            result.append($('<li>')
                                .append($('<p>').html(activities[i].title)
                                    .click((function( activity ) {
                                        return function() {
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
                                    })(activities[i]))
                                )
                                .append($('<div>').addClass('content')
                                    .append($('<p>').html(activities[i].description))
                                    .append($('<input>').attr({
                                        'type': 'button',
                                        'value': 'Add activity',
                                    }))
                                )
                            );
                        }
                    });
                });
                break;
            case 1:
                section.addSection('my_activities.html');
                break;
            case 2:
                section.addSection('information.html');
                break;
            case 3:
                section.addSection('recommendations.html');
                break;
            }
        } else {
            section.removeSection(0);
            currentSection = -1;
        }
    });
    // load the Google map
    var myPos = new google.maps.LatLng(59.314798, 18.044056);
    var mapOptions = {
        center: myPos,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    map = new google.maps.Map($('#map')[0], mapOptions);
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
    info.open(map, marker);
}));
