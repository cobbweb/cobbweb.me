;(function($) {

    var Scrollable = Backbone.View.extend({

        initialize: function()
        {
            _.bindAll(this);
            this.$el.css('overflow', 'hidden');
            this.$scrollingArea = this.$('.scroll-this-shiz');
            this.$el.on("mousewheel", this.onMouseWheel);
            this.render();
        },

        createScrollBar: function()
        {
            this.$scrollbar = $('<div class="scrollbar"/>');
            this.$scrollbar.insertAfter('#container');
            this.initialScrollbarOffset = this.$scrollbar.position().left;
            this.$scrollbar.on("mousedown", this.startScroll);
        },

        render: function()
        {
            if (!this.$scrollbar) {
                this.createScrollBar();
            }

            this.doScrollBarWidth();
        },

        doScrollBarWidth: function()
        {
            // node wide enough to scroll
            if (this.$el.width() + 5 >= this.$scrollingArea.width()) {
                this.$scrollbar.hide();
                return false;
            }

            var scrollRatio = this.getTrackWidth() / this.$scrollingArea.width();

            this.$scrollbar.show();
            this.$scrollbar.width(this.getTrackWidth() * scrollRatio);
        },

        getTrackWidth: function()
        {
            return this.$el.width() - this.initialScrollbarOffset - 125;
        },

        startScroll: function(event)
        {
            event.preventDefault();
            this.disableTextSelection();
            this.startPosition = {
                cursor: event.pageX,
                scrollbar: this.$scrollbar.position().left
            };

            $(window).on("mousemove.scrollbar", this.drag);
            $(document).on("mouseup", this.endScroll);
        },

        endScroll: function()
        {
            $(window).off("mousemove.scrollbar");
            this.enableTextSelection();
            this.startPosition = false;
        },

        drag: function(event)
        {
            var distanceMoved   = (event.pageX - this.startPosition.cursor);
            var newOffset = this.startPosition.scrollbar + distanceMoved;
            this.moveScrollBarTo(newOffset);
        },

        moveScrollBarTo: function(newOffset)
        {
            // shouldn't be less than minimum
            newOffset = Math.max(newOffset, this.initialScrollbarOffset);
            // shouldn't be past boundary
            newOffset = Math.min(newOffset, this.getMaxScrollbarOffset());

            this.$scrollbar.css('left', newOffset);

            // how far as % is the scroll bar?
            var percentScrolled = (newOffset / this.getMaxScrollbarOffset());
            this.moveToPercent(percentScrolled);
        },

        onMouseWheel: function(event, delta, deltaX)
        {
            var velocity  = Math.abs(deltaX * 10);
            var newOffset = this.$scrollbar.position().left - (delta);

            this.moveScrollBarTo(newOffset);
        },

        // scroll the content to a given percentage
        moveToPercent: function(percent)
        {
            var newScrollOffset = this.getMaxContentOffset() * percent;
            this.$el.scrollLeft(newScrollOffset);
        },

        getMaxScrollbarOffset: function()
        {
            return this.getTrackWidth() - this.$scrollbar.width() - 3;
        },

        getMaxContentOffset: function()
        {
            return this.$scrollingArea.width() - this.$el.width();
        },

        disableTextSelection: function()
        {
            $('body').css({
                "-moz-user-select": "none",
                "-webkit-user-select": "none",
                "-ms-user-select": "none"
            });

            if ($.browser.msie || $.browser.opera) {
                return $('*').attr("unselectable", "on");
            }
        },

        enableTextSelection: function()
        {
            $('body').css({
                "-moz-user-select": "auto",
                "-webkit-user-select": "auto",
                "-ms-user-select": "auto"
            });

            if ($.browser.msie || $.browser.opera) {
                return $('*').attr("unselectable", "off");
            }
        }

    });

    $.fn.scrollable = function() {
        return new Scrollable({ el: $(this) });
    };

})(jQuery);













