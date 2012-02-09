<?php


namespace Cobbweb;

/**
 * @author Andrew Cobby <andrew.cobby@gmail.com>
 */
class Posts
{

    const SYNTAX_BODY_SEPARATOR = "#---#";
    const SYNTAX_BODY_MORE_SEPARATOR = "#---more---#";
    const SYNTAX_PROPERTY_DELIMITER = ":";
    const FILE_TYPE = ".post.markdown";

    /**
     * @var \DirectoryIterator
     */
    private $dir;

    /**
     * @var array
     */
    private $posts;

    public function __construct(\DirectoryIterator $dir)
    {
        $this->dir = $dir;
        $this->_parsePosts();
    }

    private function _parsePosts()
    {
        foreach ($this->dir as $file) {
            $regex = preg_quote(self::FILE_TYPE, '/');
            $regex = "/{$regex}$/";

            if ($file->isFile() && preg_match($regex, $file->getFilename())) {
                $this->posts[] = $this->_parsePost($file);
            }
        }
    }

    private function _parsePost(\DirectoryIterator $file)
    {
        $post = array('id' => $file->getBasename('.post.markdown'));
        $contents = file_get_contents($file->getPathname());
        $contents = explode(self::SYNTAX_BODY_SEPARATOR, $contents);

        $properties = trim($contents[0]);
        $body       = explode(self::SYNTAX_BODY_MORE_SEPARATOR, $contents[1]);
        $summary    = trim($body[0]);
        $body       = (isset($body[1])) ? trim($body[1]) : "";

        $post       = $post + $this->_parseProperties($properties);
        $summary    = \Markdown($summary);
        $body       = \Markdown($body);

        return $post + array("summary" => $summary, "content" => $body);
    }

    private function _parseProperties($propsString)
    {
        $properties = array();

        foreach (explode("\n", $propsString) as $n => $line) {
            $line = preg_split('/(?:\s+)?'. self::SYNTAX_PROPERTY_DELIMITER .'(?:\s+)?/', $line, 2);

            if (count($line) != 2) {
                $n += 1;
                throw new \Exception("Invalid property in $propsString on line $n");
            }

            $properties[$line[0]] = $line[1];
        }

        $properties['tags'] = preg_split('/(?:\s+)?\,(?:\s+)?/', $properties['tags']);
        $properties['displayLink'] = $this->getDisplayLink($properties['link']);

        return $properties;
    }

    private function getDisplayLink($url)
    {
        $link = preg_replace('#^\w+\://#', '', $url);
        $link = trim($link, ' /');

        return $link;
    }

    public function getPosts()
    {
        return $this->posts;
    }

}
