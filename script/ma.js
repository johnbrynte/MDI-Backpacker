/**
    data: [{title, distance, price, description, img}]
*/
function loadChosenActivities() {
    if( chosenActivities.length > 1 ) {
        var i, content;
        content = $('#my-activities .activities');
        content.html('');
        
        for( i = 1; i < chosenActivities.length; i ++ ) {
            var activity = activities[chosenActivities[i]];
            
            content.append($('<div>', { 'class': 'travel-text' })
                .append($('<div>').html('Walk'))
                .append($('<div>').html('Commute'))
                .append($('<div>').html('Car'))
            );
            
            content.append($('<div>', { 'class': 'travel' })
                .append($('<div>', { 'class': 'foot selected' })
                    .append($('<img>', { 'src': 'images/pedestrian.png' }))
                    .append($('<p>').html('Walk'))
                )
                .append($('<div>', { 'class': 'public-transport' })
                    .append($('<img>', { 'src': 'images/public_transport.png' }))
                )
                .append($('<div>', { 'class': 'car' })
                    .append($('<img>', { 'src': 'images/car.png' }))
                )
            );
            
            content.append($('<div>', { 'class': 'activity' })
                .append($('<p>', { 'class': 'title' }).html(activity.title))
                .append($('<p>', { 'class': 'address' }).html(activity.address))
                .append($('<input>', { 'type': 'button', 'value': 'Info' }).button())
                .append($('<input>', { 'type': 'button', 'value': 'Show in map' }).button()
                    .click((function( activity ) {
                        return function() {
                            showActivityInMap(activity);
                        };
                    })(activity))
                )
            );
        }
    }
}
