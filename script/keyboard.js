function showKeyboard( target ) {
	var $write = target,
		shift = false,
		capslock = false;
        
    if( $('#keyboard').length === 0 ) {
        $('#content').append($('<div>').load('keyboard.html'));
    }
    $('#keyboard').show(CONST.keyboard.SHOW_TIME);
	
	$('#keyboard li').click(function(){
		var $this = $(this),
			character = $this.html(); // If it's a lowercase letter, nothing happens to this variable
		
		// Shift keys
		if ($this.hasClass('left-shift') || $this.hasClass('right-shift')) {
			$('.letter').toggleClass('uppercase');
			$('.symbol span').toggle();
			
			shift = (shift === true) ? false : true;
			capslock = false;
			return false;
		}
		
		// Caps lock
		if ($this.hasClass('capslock')) {
			$('.letter').toggleClass('uppercase');
			capslock = true;
			return false;
		}
		
		// Delete
		if ($this.hasClass('delete')) {
			var html = $write.html();
			
			$write.html(html.substr(0, html.length - 1));
			return false;
		}
		
		// Special characters
		if ($this.hasClass('symbol')) character = $('span:visible', $this).html();
		if ($this.hasClass('space')) character = ' ';
		if ($this.hasClass('tab')) character = "\t";
		if ($this.hasClass('return')) character = "\n";
		
		// Uppercase letter
		if ($this.hasClass('uppercase')) character = character.toUpperCase();
		
		// Remove shift once a key is clicked.
		if (shift === true) {
			$('.symbol span').toggle();
			if (capslock === false) $('.letter').toggleClass('uppercase');
			
			shift = false;
		}
		
		// Add the character
		$write.html($write.html() + character);
	});
    
    var k_s = 40;
    var k_m = 5;
    var w = 688;
    var h = (k_s+k_m)*5;
    var k_special = {
        'tab': 70,
        'delete': 70,
        'capslock': 80,
        'return': 77,
        'left-shift': 95,
        'right-shift': 109,
        'space': w,
    };
    
    var width = CONST.screen.WIDTH;
    var ratio = width/w;
    
    $('#keyboard li').css({
        'width': k_s*ratio+'px',
        'height': k_s*ratio+'px',
        'line-height': k_s*ratio+'px',
        'margin': k_m*ratio+'px',
    });
    for( var key in k_special ) {
        $('#keyboard .'+key).css({
            'width': k_special[key]*ratio+'px',
        });
    }
};

function hideKeyboard() {
    $('#keyboard').hide(CONST.keyboard.SHOW_TIME);
}