/**
    data: [{title, distance, price, description, img}]
*/
function loadChosenActivities() {
    if( chosenActivities.length > 0 ) {
        var i, content;
        content = $('#my-activities .activities');
        content.html('');
        
        for( i = 0; i < chosenActivities.length; i ++ ) {
            var activity = activities[chosenActivities[i]];
            
            content.append($('<div>', { 'class': 'travel' })
                .append($('<div>', { 'class': 'foot' }))
                .append($('<div>', { 'class': 'public-transport' }))
                .append($('<div>', { 'class': 'car' }))
            );
            
            content.append($('<div>', { 'class': 'activity' })
                .append($('<p>', { 'class': 'title' }).html(activity.title))
                .append($('<p>', { 'class': 'address' }).html(activity.address))
                .append($('<p>', { 'class': 'description' }).html(activity.description))
                .append($('<input>', { 'type': 'button', 'value': 'Info' }))
                .append($('<input>', { 'type': 'button', 'value': 'Show in map' })
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
