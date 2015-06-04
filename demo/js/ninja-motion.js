/*
 Version 1.0.0
 The MIT License (MIT)

 Copyright (c) 2015 Kelvin Mijaya

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.
 */

//define children
function makeTimeoutFunc(elemen,objOptions,launch,effect,speed) {
    setTimeout(function(){
        elemen.removeClass(objOptions.removeThisClass);
        elemen.addClass(objOptions.addThisClass);
        elemen.addClass(effect);
        elemen.addClass(speed);
    },launch);
}
(function($){
    $.fn.nnMotion = function(defaultOptions){
        // Define options and extend with user
        var options = {
            addThisClass: 'visibleThis animated',
            removeThisClass : 'invisibleThis',
            speed : 'normal-motion',
            offset: 200,
            delay :0,
            repeat: false,
            invertBottomOffset: true,
            callbackFunction: function(elem, action){},
            scrollHorizontal: false
        };
        $.extend(options, defaultOptions);

        // Cache the given element and height of the browser
        var $element = this,
            windowSize = {height: $(window).height(), width: $(window).width()},
            scrollElem = ((navigator.userAgent.toLowerCase().indexOf('webkit') != -1) ? 'body' : 'html');

        /*reset if have child*/
        $('.nm-child-post').addClass('invisibleThis');
        /*
         * Main method that checks the elements and adds or removes the class(es)
         */
        this.checkElements = function(){
            var viewportStart, viewportEnd;

            // Set some vars to check with
            if(!options.scrollHorizontal){
                viewportStart = $(scrollElem).scrollTop();
                viewportEnd = (viewportStart + windowSize.height);
            }
            else{
                viewportStart = $(scrollElem).scrollLeft();
                viewportEnd = (viewportStart + windowSize.width);
            }

            // Loop through all given dom elements
            $element.each(function(){
                var $obj = $(this),
                    objOptions = {},
                    attrOptions = {};

                //  Get any custom attribution data
                if ($obj.data('nm-addthisclass'))
                    attrOptions.addThisClass = $obj.data('nm-addthisclass');
                if ($obj.data('nm-removethisclass'))
                    attrOptions.removeThisClass = $obj.data('nm-removethisclass');
                if ($obj.data('nm-offset'))
                    attrOptions.offset = $obj.data('nm-offset');
                if ($obj.data('nm-effect'))
                    attrOptions.effect = $obj.data('nm-effect');
                if ($obj.data('nm-delay'))
                    attrOptions.delay = $obj.data('nm-delay');
                if ($obj.data('nm-speed'))
                    attrOptions.speed = $obj.data('nm-speed');
                if ($obj.data('nm-stay'))
                    attrOptions.stay = $obj.data('nm-stay');
                if ($obj.data('nm-repeat'))
                    attrOptions.repeat = $obj.data('nm-repeat');
                if ($obj.data('nm-scrollHorizontal'))
                    attrOptions.scrollHorizontal = $obj.data('nm-scrollHorizontal');
                if ($obj.data('nm-invertBottomOffset'))
                    attrOptions.invertBottomOffset = $obj.data('nm-invertBottomOffset');

                // Extend objOptions with data attributes and default options
                $.extend(objOptions, options);
                $.extend(objOptions, attrOptions);

                // If class already exists; quit
                if ($obj.hasClass(objOptions.addThisClass) && !objOptions.repeat){
                    return;
                }

                // Check if the offset is percentage based
                if(String(objOptions.offset).indexOf("%") > 0)
                    objOptions.offset = (parseInt(objOptions.offset) / 100) * windowSize.height;

                // define the top position of the element and include the offset which makes is appear earlier or later
                var elemStart = (!objOptions.scrollHorizontal) ? Math.round( $obj.offset().top ) + objOptions.offset : Math.round( $obj.offset().left ) + objOptions.offset,
                    elemEnd = (!objOptions.scrollHorizontal) ? elemStart + $obj.height() : elemStart + $obj.width();

                if(objOptions.invertBottomOffset)
                    elemEnd -= (objOptions.offset * 2);

                // Add class if in viewport
                if ((elemStart < viewportEnd) && (elemEnd > viewportStart)){
                        //make delay
                        setTimeout(function(){
                            $obj.removeClass(objOptions.removeThisClass); // remove class
                            $obj.addClass(objOptions.addThisClass); // add class
                            $obj.addClass(objOptions.effect); // add effect
                            $obj.addClass(objOptions.speed); // add speed

                            //checking if parent has child
                            if($obj.find('.nm-child-post').length != 0)
                            {
                                //get each children
                                $obj.find('.nm-child-post').each(function(){
                                    var launch = $(this).data('nm-launch');
                                    var effect = $(this).data('nm-effect');
                                    var speed = $(this).data('nm-speed');
                                    makeTimeoutFunc($(this),objOptions,launch,effect,speed);
                                });
                                //var launch = $obj.find('.nm-child-post').data('nm-launch');
                                //var effect = $obj.find('.nm-child-post').data('nm-effect');
                                //makeTimeoutFunc($obj,launch,effect);
                            }
                            //check if added stay animation
                            if(objOptions.stay)
                            {
                                if(objOptions.speed == "normal-motion")
                                {
                                   var delayed = 1100;
                                }else if(objOptions.speed == "slow-motion")
                                {
                                    var delayed = 5100;
                                }else
                                {
                                    var delayed = 600;
                                }

                                setTimeout(function() {
                                    $obj.removeClass(objOptions.effect); // remove class
                                    $obj.addClass(objOptions.stay); // add stay animation
                                },delayed);

                            }
                        },objOptions.delay);

                    // Do the callback function. Callback wil send the jQuery object as parameter
                    objOptions.callbackFunction($obj, "add");

                    // Remove class if not in viewport and repeat is true
                } else if ($obj.hasClass(objOptions.addThisClass) && (objOptions.repeat)){
                    $obj.removeClass(objOptions.addThisClass);
                    $obj.addClass(objOptions.removeThisClass);

                    // Do the callback function.
                    objOptions.callbackFunction($obj, "remove");
                }
            });

        };

        // Run check elements on load and scroll
        $(document).bind("touchmove MSPointerMove pointermove", this.checkElements);
        $(window).bind("load scroll touchmove", this.checkElements);

        // On resize change the height var
        $(window).resize(function(e){
            windowSize = {height: $(window).height(), width: $(window).width()};
            $element.checkElements();
        });

        // trigger inital check if elements already visible
        this.checkElements();

        // Default jquery plugin behaviour
        return this;
    };
})(jQuery);
