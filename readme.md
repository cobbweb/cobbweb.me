# Cobbweb.me
Since I'm a fan of sharing code, I'm using a public repo to host the code behing my site.

It is based off [Backbone Boilerplate](https://github.com/tbranyen/backbone-boilerplate) with a few changes. Firstly, blog posts are stored as plain-text files in my own flavour of Markdown that includes post metadata (similar to Jekyll, etc). These files are processed by PHP and a spit out as a JavaScript object in index.php. They are then loaded into [Backbone](http://documentcloud.github.com/backbone/) and then the fun begins.

Backbone Boilerplate prompts you to use Node.js to serve your site, but that doesn't work with me for a single page load and I'm much more comfortable parsing those post files with PHP. That being said, I'm still using the Node-powered build tool to concatenate my scripts and compile my LESS. And PHP does some basic HTTP host detection to determine the environment and ergo which files to load in. 

Since all the content/post markup is being generated by JavaScript, I'm very keen to see how my site ranks with Google since the Googlebots are supposed to be JavaScript/AJAX friendly.

*Site still being developed.
