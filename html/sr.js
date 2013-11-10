$(function(){
	init();

	window.initSearchResults = init;
	window.getSearchResultsHtml = getSearchResultsHtml;
	console.log('hej');
});

/**
	data: [{name, distance, price, text, img}]

	gotta run jquery ui accordion initialization after this here has been inserted
*/
function getSearchResultsHtml(data){
	var element;
	element = $('<div>', {class:"accordion", id:"search-results"});
	$.each(data, function(index, value){
		var name, distance, price, text, content, head, img, contentRight;

		content = $('<div>').addClass("sr-content");

		name = $('<div>').addClass("sr-name").append(value["name"]);
		distance = $('<div>').addClass("sr-distance").append(value.distance);
		price = $('<div>').addClass("sr-price").append(value.price);
		text = $('<div>').addClass("sr-text").append(value["text"]);
		text.appendTo(content);
		img = $('<img>').addClass("sr-img").attr("src", value.img);

		head = $('<div>').addClass('sr-head').append(name, distance, price);
		contentRight = $('<div>').addClass("sr-content-right").append(img, $('<button>').addClass('sr-save ui-button').append("Save activity"));
		contentRight.appendTo(content);

		element.append(head, content);
	});

	return element[0].outerHTML;
}

function init(){
	$(".accordion#search-results").accordion({
		collapsible:true,
		//active:false,
		heightStyle:"content",
	});

}