var section = (function() {
    var self = {};
    
    var sections = [];
    
    self.addSection = function( content, callback ) {
        var section, firstSection;
        
        section = $('<div>').addClass('section');
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
        firstSection = $('.section:first');
        if( firstSection.length > 0 ) {
            firstSection.before(section);
        } else {
            $('#content').append(section);
        }
        
        $('#toolbar').animate({
            'left': (CONST.menu.MENU_WIDTH+sections.length*CONST.menu.SECTION_WIDTH+CONST.toolbar.MARGIN)+'px'
        }, CONST.section.SHOW_TIME);
    };
    
    self.removeSection = function( i ) {
        var j, kill, callback;
        
        if( sections.length > 0 && i < sections.length ) {
            kill = [];
            for( j = sections.length-1; j >= i; j -- ) {
                if( j == i ) {
                    callback = function() {
                        $('#toolbar').animate({
                            'left': (CONST.menu.MENU_WIDTH+sections.length*CONST.menu.SECTION_WIDTH+CONST.toolbar.MARGIN)+'px'
                        }, CONST.section.HIDE_TIME);
                    };
                } else {
                    callback = function() {};
                }
                sections[j].animate({
                    'left': ((i-1)*CONST.menu.SECTION_WIDTH)+'px',
                }, {
                    'duration': CONST.section.HIDE_TIME,
                    'complete': (function( section, callback ) {
                        return function() {
                            section.remove();
                            callback();
                        };
                    })(sections[j], callback),
                });
                kill.push(j);
            }
            for( j = 0; j < kill.length; j ++ ) {
                sections.splice(kill[j], 1);
            }
        }
    };

    return self;
})();