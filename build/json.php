<?php

require_once "../lib/markdown.php";
require_once "../lib/Cobbweb/Posts.php";

$posts = new Cobbweb\Posts(new DirectoryIterator("../posts"));

header("Content-type: application/json");
echo json_encode($posts->getPosts());

