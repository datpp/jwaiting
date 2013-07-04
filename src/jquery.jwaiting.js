/**
 * Author: datpp
 * Date: 7/3/13
 * Time: 2:29 PM
 * Version: 1.0-beta1
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
    };

    /**
     * Clone image to overlay
     *
     * @param parentObject
     * @param options
     */
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
    };

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
         * elementRealSize that is the size of element which included padding & border size
         */
        var elementRealSizePosition = {};

        /**
         * Overlay of each element using jwaiting
         *
         * @type {*|HTMLElement}
         */
        var $overlay = $('<div></div>');

        /**
         * Create JWaiting image object
         */
        var imageLoading = new JLoadingIMG(settings.loadingImg, {title: settings.loadingText});

        /**
         * element will be handle
         *
         * @type {*|HTMLElement}
         */
        var handleElement = $(element);

        // just process once time
        if (handleElement.hasClass('jwaiting-added')) return;

        handleElement.addClass('jwaiting-added');

        // Caculate position & size of element using jwaiting
        if ('BODY' == element.tagName) {    // in this case I want use window size for body (just adjustment for display)
            elementRealSizePosition         = {top:0, left:0};
            elementRealSizePosition.width   = $(window).width(); //handleElement.outerWidth(true) ||
            elementRealSizePosition.height  = $(window).height(); //handleElement.outerHeight(true) ||
        }
        else {
            elementRealSizePosition         = handleElement.offset();
            elementRealSizePosition.width   = handleElement.outerWidth();
            elementRealSizePosition.height  = handleElement.outerHeight();
        }

        // Caculate position of overlay
        $overlay.attr('id', 'jwaiting-overlay-element-' + (handleElement.attr('id') || randomInt(100,1000)));
        $overlay.css({
            'position'              : 'absolute',
            'display'               : 'none',
            'text-align'            : 'center',
            'z-index'               : parseInt(handleElement.css('z-index')) + 1,
            'width'                 : elementRealSizePosition.width,
            'height'                : elementRealSizePosition.height,
            'top'                   : elementRealSizePosition.top,
            'left'                  : elementRealSizePosition.left,
            'background-color'      : settings.bgColor,
            'opacity'               : settings.opacity
        });

        // Prepare overlay element in body
        $('body').append($overlay);

        // Append loading image to overlay
        imageLoading.appendTo($overlay, {title: settings.title, alt: settings.alt});

        // Bind event open
        handleElement.bind('jwaiting_open', function() {
            $overlay.show();
        });

        // Bind event close
        handleElement.bind('jwaiting_close', function() {
            $overlay.hide();
        });
    };

    /**
     * Method to declare a plugin for JQuery
     *
     * @param options
     * @returns {*}
     */
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

    /**
     * Default settings of JWaiting
     *
     * @type {{opacity: number, allowEsc: boolean, loadingImg: string, loadingText: string, bgColor: string}}
     */
    $.fn.jwaiting.defaults = {
        opacity         : 0.2,
        allowEsc        : true,
        loadingImg      : '../src/loading.gif',
        loadingText     : 'Loading ....',
        bgColor		    : '#000'
        // @todo: icon_only       : false,
        // @todo: text_only       : false
    };

    /**
     * Generate a random number in a range
     *
     * @param min
     * @param max
     * @returns {Number}
     */
    function randomInt(min, max) {
        return parseInt(Math.floor(Math.random()*(max-min+1)+min));
    };
})(jQuery);
