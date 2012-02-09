<?php
$host   = $_SERVER['HTTP_HOST'];
$isProd = isset($_ENV['PRODUCTION']) && $_ENV['PRODUCTION'] == true;

require_once "lib/markdown.php";
require_once "lib/Cobbweb/Posts.php";

$posts = new Cobbweb\Posts(new DirectoryIterator("posts"));
$json  = json_encode($posts->getPosts());

$scripts = array(
    'dev' => array(
        'assets/js/libs/jquery',
        'assets/js/libs/underscore',
        'assets/js/libs/backbone',
        'assets/js/libs/jquery.disableselection',
        'assets/js/libs/jquery.scrollbar',
        'app/namespace',
        'app/modules/cobbweb',
        'app/index'
    ),
    'production' => array(
        'dist/release/js/libs',
        'dist/release/js/templates',
        'dist/release/js/app'
    )
);

if ($isProd && false) {
    $scripts = $scripts['production'];
} else {
    $scripts = $scripts['dev'];
}

?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <title>Andrew Cobby - Web Developer</title>
    <meta name="description" content="Web Developer, want some cob with your web?">
    <meta name="author" content="Andrew Cobby">

    <meta name="viewport" content="width=device-width,initial-scale=1">

    <link rel="stylesheet/less" type="text/css" href="/assets/css/cobbweb.less">
    <script type="text/javascript">
        var less = { env: "development" };
    </script>
    <script src="/assets/js/libs/less.js"></script>
</head>
<body>

    <div id="container">
        <header id="site-header">
            <div id="title">Cobbweb</div>
            <div id="humour">&lt;geek alert/&gt;</div>
            <nav>
                <a href="http://github.com/cobbweb" class="img-link">
                    <img src="/assets/img/github.png" alt="Andrew Cobby on GitHub">
                </a>
                <a href="http://twitter.com/andrewcobby" class="img-link">
                    <img src="/assets/img/twitter.png" alt="Andrew Cobby on Twitter">
                </a>
                <a href="about-me">About Me</a>
            </nav>
        </header>

        <div id="scroll-wrapper">
            <div id="main" class="scroll-this-shiz"></div>
        </div>

        <footer id="site-footer">
            <p>&copy; Andrew Cobby 2012</p>
        </footer>
    </div>

<div id="overlay" style="display: none"></div>
<div id="full-post-main" style="display: none"></div>
<div id="stage"></div>

<script>
    var _post_data = <?php echo $json; ?>;
</script>

<?php foreach($scripts as $script): ?>
    <script src="/<?php echo $script . '.js'; ?>"></script>
<?php endforeach; ?>

<script type="text/template" id="template-post">
    <header><h1><%= title %></h1></header>

    <div class="content">
        <%= summary %>
    </div>

    <footer>
        <% if (link) { %>
        <a href="<%= link %>" class="post-link" target="_blank"><%= displayLink %></a>
        <% } %>

        <div class="info">
            <a href="https://twitter.com/share" class="twitter-share-button" data-count="none" data-via="andrewcobby">Tweet</a>

            <time datetime="<%= date.toISOString() %>">
                <%= dateString %>
            </time>
        </div>

        <nav class="tags">
            <% _.each(tags, function(tag) { %>
                <a href="/tag/<%= tag %>">#<%= tag %></a>
            <% }); %>
        </nav>
    </footer>
</script>

<script id="template-full-post" type="text/template">
    <header><h1><%= title %></h1></header>

    <div class="content">
        <%= summary %>
        <%= content %>
    </div>

    <footer>
        <% if (link) { %>
        <a href="<%= link %>" class="post-link" target="_blank"><%= displayLink %></a>
        <% } %>

        <div class="info">
            <a href="https://twitter.com/share" class="twitter-share-button" data-count="none" data-via="andrewcobby">Tweet</a>

            <time datetime="<%= date.toISOString() %>">
                <%= dateString %>
            </time>
        </div>

        <nav class="tags">
            <% _.each(tags, function(tag) { %>
            <a href="/tag/<%= tag %>">#<%= tag %></a>
            <% }); %>
        </nav>
    </footer>

    <div class="close"><img src="/assets/img/close.png" alt="Close Post" title="Close post"></div>
</script>

</body>
</html>