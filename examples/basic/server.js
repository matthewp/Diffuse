
var RSS = require('../../');
var http = require('http');

var feed = RSS.createFeed({
  title: 'Amphibious Rodents',
  link: 'http://www.amphibiousrodentsclub.com',
  description: 'Where we share our thoughts about amphibiosu rodents'
});

feed.addItem({
  title: 'Let me introduce myself',
  description: 'My name is Bobby Stevenson and I like rodents <p> Hey my RSS feed can contain HTML in case I want to <strong>emphasize</strong> my interest in rodents.',
  guid: '2013-1-20',
  pubDate: (new Date).toUTCString()
});

var server = http.createServer(function(req, res) {
  res.writeHead(200, {'content-type': 'application/xml'});
  res.end(feed.render());
});

server.listen(8080);

