/*
 (c) © 2012 Andrew Cobby Andrew Cobby <andrew.cobby@gmail.com>
 */
(function(Cobbweb, $$) {

    Cobbweb = _.extend(Cobbweb, Backbone.Events, {

        getTemplate: function(id)
        {
            var template = $("#template-" + id).html();
            return _.template(template);
        },

        navigate: function(route, replace)
        {
            $$.router.navigate(route, { trigger: true, replace: replace })
        }

    });

    Cobbweb.Post = Backbone.Model.extend({

        initialize: function()
        {
            this.set('date', new Date());
            this.set('dateString', '2 mins ago');
        }

    });

    Cobbweb.Posts = Backbone.Collection.extend({
        model: Cobbweb.Post
    });

    Cobbweb.Views.Post = Backbone.View.extend({

        tagName: "article",
        className: "post",
        $stage: $("#stage"),

        events: {
            "click": "showFullPost"
        },

        initialize: function()
        {
            this.template = Cobbweb.getTemplate('post');
            this.render();
        },

        render: function()
        {
            var html = this.template(this.model.toJSON());
            this.$el.html(html);
            this.$stagedEl = this.$el.clone();
            this.$stage.append(this.$stagedEl);
        },

        getHeight: function()
        {
            return this.$stagedEl.outerHeight();
        },

        showFullPost: function()
        {
            Cobbweb.navigate("post/" + this.model.id);
        }

    });

    Cobbweb.Views.FullPost = Backbone.View.extend({

        tagName: "article",
        className: "fullPost",
        $main: $("#full-post-main"),
        $overlay: $("#overlay"),

        events: {
            "click .close": "close"
        },

        initialize: function()
        {
            _.bindAll(this);
            this.template = Cobbweb.getTemplate("full-post");
            Cobbweb.on("resetState", this._close);
            $(window).on("keyup", this.onKey);
        },

        render: function()
        {
            var renderedHtml = this.template(this.model.toJSON());
            this.$el.html(renderedHtml);
            this.$main.append(this.$el).show();
            this.$overlay.show();
        },

        close: function()
        {
            Cobbweb.navigate();
        },

        _close: function()
        {
            this.$main.hide().html('');
            this.$overlay.hide()
        },

        onKey: function(event)
        {
            if (event.which == 27) {
                Cobbweb.navigate();
                return false;
            }
        }

    });

    Cobbweb.Views.Column = Backbone.View.extend({

        className: 'column',
        $main: $("#main"),

        initialize: function()
        {
            _.bindAll(this);
            this.posts = [];
        },

        pushPost: function(post)
        {
            this.posts.push(post);
            this.$el.append(post.$el);
        },

        popPost: function()
        {
            var post = this.posts.pop();
            post.$el.remove();
            return post;
        },

        unshiftPost: function(post)
        {
            this.posts.unshift(post);
            this.$el.prepend(post.$el);
        },

        shiftPost: function()
        {
            var post = this.posts.shift();
            post.$el.remove();
            return post;
        },

        canFitPost: function(post)
        {
            return (post.getHeight() + this.getHeight() + 20) < this.getMaxHeight();
        },

        getHeight: function()
        {
            return this.$el.height();
        },

        isBursting: function()
        {
            return this.getHeight() > this.getMaxHeight() && this.posts.length > 1;
        },

        isEmpty: function()
        {
            return this.posts.length == 0;
        },

        remove: function()
        {
            this.$el.remove();
        },

        getMaxHeight: function()
        {
            return this.$main.height();
        }

    });

    Cobbweb.Views.AppView = Backbone.View.extend({

        el:      $("#main"),
        $header: $("#site-header"),
        $footer: $("#site-footer"),

        posts: [],
        columns: [],

        initialize: function()
        {
            _.bindAll(this);
            $(window).on("resize", this.onResize);
            this.collection.each(this.createPost);
            this.onResize();
        },

        render: function()
        {
            if (!this.initialized) {
                var column = this.createColumn();

                _.each(this.posts, function(post) {
                    if (!column.canFitPost(post)) {
                        column = this.createColumn();
                    }

                    column.pushPost(post);
                }, this);

                this.initialized = true;
            }

            Cobbweb.trigger("resetState");
        },

        onResize: function()
        {
            this.$el.height(this._calculateHeight());

            _.debounce(this._arrangeColumns, 100)();
        },

        _arrangeColumns: function()
        {
            _.each(this.columns, function(column, i) {
                if (column.isBursting()) {
                    var post = column.popPost();
                    var nextColumn = this._getNextColumn(column, true);
                    nextColumn.unshiftPost(post);
                } else {
                    var nextColumn = this._getNextColumn(column);

                    if (nextColumn) {
                        var post = nextColumn.posts[0];


                        if (column.canFitPost(post)) {
                            nextColumn.shiftPost();
                            column.pushPost(post);

                            if (nextColumn.isEmpty()) {
                                this.removeColumn(nextColumn);
                            }
                        }
                    }
                }

            }, this);
        },

        _getNextColumn: function(column, force)
        {
            var i = _(this.columns).indexOf(column);
            var nextColumn = this.columns[i + 1];

            if (!nextColumn && force == true) {
                nextColumn = this.createColumn();
            }

            return nextColumn;
        },

        createPost: function(post)
        {
            var view = new Cobbweb.Views.Post({ model: post });
            this.posts.push(view);
        },

        createColumn: function()
        {
            var column = new Cobbweb.Views.Column();
            this.columns.push(column);
            this.$el.append(column.$el);

            return column;
        },

        removeColumn: function(column)
        {
            column.remove();
            this.columns.splice(_(this.columns).indexOf(column), 1);
        },

        getHeight: function()
        {
            return this.$el.height();
        },

        _calculateHeight: function()
        {
            var height = $(document).height();
            height -= (40 + this.$footer.outerHeight(true) + this.$header.outerHeight(true));

            return height;
        },

        showFullPost: function(id)
        {
            var post = this.collection.find(function(p) { return p.get('id') == id });

            if (!post) {
                Cobbweb.Util.navigate("/");
            }

            this.fullPosts = this.fullPosts || [];

            if (!this.fullPosts[id]) {
                this.fullPosts[id] = new Cobbweb.Views.FullPost({ model: post });
            }

            this.fullPosts[id].render();
        }

    });

})(namespace.module("cobbweb"), namespace.app);