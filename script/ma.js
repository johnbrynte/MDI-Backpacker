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
            content.append($('<p>').html(activity.title));
        }
    }
}
