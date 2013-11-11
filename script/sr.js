/**
    data: [{title, distance, price, description, img}]

    gotta run jquery ui accordion initialization after this here has been inserted
*/
function appendSearchResultsHtml( data, container ){
    var element;
    element = $('<div>', {class:"accordion"});
    $.each(data, function(index, value){
        var title, distance, price, description, content, head, img, contentRight, calculatedDistance;
        
        calculatedDistance = (google.maps.geometry.spherical.computeDistanceBetween(myPos, value.pos) / 1000).toFixed(2);

        content = $('<div>').addClass("sr-content");

        title = $('<div>').addClass("sr-title").html(value.title);
        distance = $('<div>').addClass("sr-distance").html(calculatedDistance+' km');
        price = $('<div>').addClass("sr-price").html(value.price);
        description = $('<div>').addClass("sr-description").html(value.description);
        description.appendTo(content);
        img = $('<img>').addClass("sr-img").attr("src", value.img);

        head = $('<div>').addClass('sr-head').append(title, distance, price).click(searchResultExpandEvent(value));
        contentRight = $('<div>').addClass("sr-content-right").append(img, $('<button>').addClass('sr-save ui-button').html("Save activity").click(searchResultAddActivityEvent(index)));
        contentRight.appendTo(content);

        element.append(head, content);
    });

    container.html(element);
    element.accordion({
        collapsible:true,
        active:false,
        heightStyle:"content",
    });
};
