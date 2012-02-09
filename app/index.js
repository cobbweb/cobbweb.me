// Treat the jQuery ready function as the entry point to the application.
// Inside this function, kick-off all initialization, everything up to this
// point should be definitions.
$(function($) {


    // Shorthand the application namespace
    var app = window.$$ = namespace.app;
    var Cobbweb = namespace.module("cobbweb");

    var Posts = new Cobbweb.Posts();
    Posts.reset(window._post_data);

    var appView = new Cobbweb.Views.AppView({ collection: Posts });

    // Defining the application router, you can attach sub routers here.
    var Router = Backbone.Router.extend({

        routes: {
            "": "index",
            ":hash": "index",
            "post/:id": "showFullPost"
        },

        index: function(hash)
        {
            // Attach the tutorial to the DOM
            appView.render();

            this.indexRendered = true;

            // Fix for hashes in pushState and hash fragment
            if (hash && !route._alreadyTriggered) {
                // Reset to home, pushState support automatically converts hashes
                Backbone.history.navigate("", false);

                // Trigger the default browser behavior
                location.hash = hash;

                // Set an internal flag to stop recursive looping
                this._alreadyTriggered = true;
            }
        },

        showFullPost: function(id)
        {
            if (!this.indexRendered) {
                this.index();
            }

            appView.showFullPost(id);
        }

    });

    // Define your master router on the application namespace and trigger all
    // navigation from this instance.
    app.router = new Router();

    // Trigger the initial route and enable HTML5 History API support
    Backbone.history.start({ pushState: true });

    // All navigation that is relative should be passed through the navigate
    // method, to be processed by the router.  If the link has a data-bypass
    // attribute, bypass the delegation completely.
    $(document).on("click", "a:not([data-bypass])", function(evt) {
        // Get the anchor href and protcol
        var href = $(this).attr("href");
        var protocol = this.protocol + "//";

        // Ensure the protocol is not part of URL, meaning its relative.
        if (href && href.slice(0, protocol.length) !== protocol) {
            // Stop the default event to ensure the link will not cause a page
            // refresh.
            evt.preventDefault();

            // This uses the default router defined above, and not any routers
            // that may be placed in modules.  To have this work globally (at the
            // cost of losing all route events) you can change the following line
            // to: Backbone.history.navigate(href, true);
            app.router.navigate(href, true);
        }
    });
});
