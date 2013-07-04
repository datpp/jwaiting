/**
 * Author: datpp
 * Date: 7/3/13
 * Time: 2:29 PM
 * Version: 1.0
 *
 * Require: JQuery > 1.4
 */

;(function($) {
    var addedBodyOverlay = false;

    /**
     * Image loading object
     * @param _src
     * @param _settings
     * @constructor
     */
    var JLoadingIMG = function(src, options) {
        var _settings_default = { title: '', alt: ''};
        var _settings = $.extend({}, _settings_default, options);


        this.img = $('<img>').attr('src', src)
                             .attr('alt', _settings.alt)
                             .attr('title', _settings.title);
    }

    JLoadingIMG.prototype.appendTo = function(parentObject, options) {

        var settings_default = { title: '', alt: ''};
        var settings = $.extend({}, settings_default, options);

        var divWrapper = $('<div></div>').css('position', 'relative');
        parentObject.append(divWrapper);

        /**
         * Clone image
         * @type {*}
         */
        var img = this.img.clone();

        img.load(function() {
            $(this).css({
                'position'  : 'absolute',
                'top'       : parseInt((parentObject.height() - img.height()) / 2),
                'left'      : parseInt((parentObject.width() - img.width()) / 2)
            })
            .attr('alt', settings.alt)
            .attr('title', settings.title);
        });

        divWrapper.append(img);
    }

    /**
     * JWaiting object
     *
     * @param element
     * @param options
     * @constructor
     */
    var JWaiting = function(element, options) {
        /**
         * Default settings for jwaiting element
         */
        var settings = $.extend({}, $.fn.jwaiting.defaults, options);

        /**
         * Element will apply waiting
         * @type {*|HTMLElement}
         */
        var waitingElement = $(element);

        /**
         * elementRealSize that is the size of element which included padding & border size
         */
        var elementRealSizePosition = {};

        /**
         * Overlay
         */
        var $overlay;

        /**
         * Create JWaiting image object
         */
        var imageLoading = new JLoadingIMG(settings.loadingImg, {title: settings.loadingText});

        if ('BODY' == element.tagName) {
            elementRealSizePosition = {
                top     : 0,
                left    : 0,
                width   : $(window).width(),
                height  : $(window).height()
            };

            /**
             * With BODY element we just add once overlay
             */
            if (!addedBodyOverlay) {
                $overlay = $('<div></div>');
                $overlay.attr('id', 'jwaiting-overlay-body');
                $overlay.css({
                    'position'              : 'fixed',
                    'display'               : 'none',
                    'text-align'            : 'center',
                    'z-index'               : parseInt(waitingElement.css('z-index')) + 1,
                    'width'                 : elementRealSizePosition.width,
                    'height'                : elementRealSizePosition.height,
                    'top'                   : elementRealSizePosition.top,
                    'left'                  : elementRealSizePosition.left,
                    'background-color'      : settings.bgColor,
                    'opacity'               : settings.opacity
                });
                $('body').append($overlay);

                imageLoading.appendTo($overlay, {title: settings.title, alt: settings.alt});

                addedBodyOverlay = true;
            }
        }
        else {
            elementRealSizePosition         = waitingElement.offset();
            elementRealSizePosition.width   = waitingElement.outerWidth();
            elementRealSizePosition.height  = waitingElement.outerHeight();

            /**
             * overlay for each a element need separated.
             * @type {*|HTMLElement}
             */
            $overlay = $('<div></div>');
            $overlay.attr('id', 'jwaiting-overlay-element-' + (waitingElement.attr('id') || randomInt(100,1000)));
            $overlay.css({
                'position'              : 'absolute',
                'display'               : 'none',
                'text-align'            : 'center',
                'z-index'               : parseInt(waitingElement.css('z-index')) + 1,
                'width'                 : elementRealSizePosition.width,
                'height'                : elementRealSizePosition.height,
                'top'                   : elementRealSizePosition.top,
                'left'                  : elementRealSizePosition.left,
                'background-color'      : settings.bgColor,
                'opacity'               : settings.opacity
            });
            $('body').append($overlay);

            imageLoading.appendTo($overlay, {title: settings.title, alt: settings.alt});
        }

        waitingElement.bind('jwaiting_open', function() {
            $overlay.show();
        });
        waitingElement.bind('jwaiting_close', function() {
            $overlay.hide();
        });
    }

    $.fn.jwaiting = function(options) {
        var settings = $.extend({}, $.fn.jwaiting.defaults, options);

        if (settings.allowEsc) {
            var elements = $(this);
            $(document).bind('keydown', function(e) {
                if (e.keyCode == 27) {
                    elements.trigger('jwaiting_close');
                }
            })
        }

        return this.each(function(key, value) {
            var element  = $(this);
            var jwaiting = new JWaiting(this, options);

            element.data('jwaiting', jwaiting);

        });
    };

    $.fn.jwaiting.defaults = {
        opacity         : 0.2,
        allowEsc        : true,
        loadingImg      : '../src/loading.gif',
        loadingText     : 'Loading ....',
        bgColor		    : '#000'
        // @todo: icon_only       : false,
        // @todo: text_only       : false
    };

    function randomInt(min, max) {
        return parseInt(Math.floor(Math.random()*(max-min+1)+min));
    };
})(jQuery);
