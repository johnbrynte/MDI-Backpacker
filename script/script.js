var currentSection = -1;
var newActivities;

/* Google map */
var map;
var myPos;
var tmpMarker;
var infoWindow;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

var hostel = {
    title: 'Zinkensdamms hostel',
    address: 'Södermalm, Stockholm',
    description: 'A beautiful hostel at Södermalm in Stockholm.',
    price: '100 kr',
    img: null,
    pos: new google.maps.LatLng(59.314798, 18.044056),
}

var activities = [
    hostel,
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

var chosenActivities = [0];
var activityMarkers = [];

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
    'keyboard': {
        'SHOW_TIME': 200,
    },
};

function resetActivityNotification() {
    newActivities = 0;
    $('#menu .notification-wrapper .notification').hide(CONST.menu.NOTIFICATION_TIME);
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
            activityMarkers.push(new google.maps.Marker({
                position: activities[index].pos,
                map: map,
                title: activities[index].title,
            }));
            updateRoute();
            notifyNewActivity();
        }
    };
};

function updateRoute() {
    if( chosenActivities.length > 1 ) {
        var waypoints, content, i;
        waypoints = [];
        // Google map directions
        for( i = 1; i < chosenActivities.length-1; i ++ ) {
            waypoints.push({
                location: activities[chosenActivities[i]].pos,
                stopover: false,
            });
        }
        var request = {
            origin: activities[chosenActivities[0]].pos,
            destination: activities[chosenActivities[chosenActivities.length-1]].pos,
            waypoints: waypoints,
            travelMode: google.maps.TravelMode.WALKING,
        };
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });
        // Toolbar route
        content = $('#toolbar .planned-trip');
        content.html('');
        for( i = 1; i < chosenActivities.length; i ++ ) {
            content.append($('<p>').html(i+'. '+activities[chosenActivities[i]].title));
        }
    } else {
        $('#toolbar .planned-trip').html($('<p>').html('No activities chosen'));
    }
};

(function() {
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
    
    $('#keyboard').click(function() {
        $(this).hide(CONST.keyboard.SHOW_TIME);
    });

    $('#menu').css({
        'width': CONST.menu.MENU_WIDTH+'px',
    });
    
    $('#menu input[type=button]').click(function() {
        var i = $(this).index();
        $('#menu input[type=button]').removeClass('active');
        $(this).addClass('active');
        if( i !== currentSection ) {
            currentSection = i;
            
            section.removeSection(0);
            
            switch(currentSection) {
            case 0:
                section.addSection('search.html', function() {
                    $('#search input[type=button]').button();
                
                    $('#search .text-search .header').addClass('active');
                    $('#search .text-search .overlay').hide();
                    
                    $('#searchtype-text').click(function() {
                        $('#search .text-search .header').addClass('active');
                        $('#search .category-search .header').removeClass('active');
                        $('#search .text-search .overlay').hide();
                        $('#search .category-search .overlay').show();
                    });
                    
                    $('#searchtype-category').click(function() {
                        $('#search .text-search .header').removeClass('active');
                        $('#search .category-search .header').addClass('active');
                        $('#search .text-search .overlay').show();
                        $('#search .category-search .overlay').hide();
                    });
                
                    $('#search .search-content .search-button').click(function() {
                        appendSearchResultsHtml(activities, $('#search .search-results'));
                        $('#keyboard').hide(CONST.keyboard.SHOW_TIME);
                    });
                    
                    $('#search-query').click(function() {
                        $('#keyboard').show(CONST.keyboard.SHOW_TIME);
                    });
                });
                break;
            case 1:
                resetActivityNotification();
                section.addSection('my_activities.html', function() {
                    loadChosenActivities();
                    $('#plan-button').button().click(function() {
                        if( $(this).attr('expanded') ) {
                            section.removeSection(1);
                            $(this).removeAttr('expanded');
                        } else {
                            section.removeSection(1);
                            section.addSection("planner.html");
                            $(this).attr('expanded', true);
                        }
                    });
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
                section.addSection('recommendations.html', function() {
                    var content = $('#recommendations .recommendations');
                    for( var i = 0; i < activities.length; i ++ ) {
                        content.append($('<div>').append($('<p>').html(activities[i].title)).button());
                    }
                });
                break;
            }
        } else {
            section.removeSection(0);
            currentSection = -1;
        }
    });
    
    // load the Google map
    myPos = new google.maps.LatLng(59.314798, 18.044056);
    var mapOptions = {
        center: myPos,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    map = new google.maps.Map($('#map')[0], mapOptions);
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    // Show the hostel position
    activityMarkers.push(new google.maps.Marker({
        position: myPos,
        map: map,
        title: 'You are here',
    }));
    //Show 'you are here' text
    /*var info = new google.maps.InfoWindow({
        content: $('<div>').append(
            $('<div>').addClass('info-window').html('You are here')
        ).html(),
    });
    info.open(map, activityMarkers[0]);*/
    
    // Load the map toolbar
    $('#toolbar').css('left', (CONST.menu.MENU_WIDTH+CONST.toolbar.MARGIN)+'px');
    updateRoute();
    
    newActivities = 0;
})();
