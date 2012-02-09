;(function($) {

    var Scrollable = Backbone.View.extend({

        initialize: function()
        {
            _.bindAll(this);
            this.$el.css('overflow', 'hidden');
            this.$scrollingArea = this.$('.scroll-this-shiz');
            this.createScrollBar();
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
            return this.$el.width() - this.initialScrollbarOffset - 140;
        },

        startScroll: function(event)
        {
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
        },

        drag: function(event)
        {
            var distanceMoved   = (event.pageX - this.startPosition.cursor);
            var moveScrollbarTo = this.startPosition.scrollbar + distanceMoved;

            // shouldn't be less than zero
            moveScrollbarTo = Math.max(moveScrollbarTo, this.initialScrollbarOffset);
            // shouldn't be past boundary
            moveScrollbarTo = Math.min(moveScrollbarTo, this.getMaxScrollbarOffset());

            this.$scrollbar.css('left', moveScrollbarTo);

            // how far as % is the scroll bar?
            var percentScrolled = (moveScrollbarTo / this.getMaxScrollbarOffset());
            var newScrollOffset = this.getMaxContentOffset() * percentScrolled;
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
            console.log($("#container"));
            $("#container").disableTextSelect();
        },

        enableTextSelection: function()
        {
            $("#container").enableTextSelect();
        }

    });

    $.fn.scrollable = function() {
        return new Scrollable({ el: $(this) });
    };

})(jQuery);