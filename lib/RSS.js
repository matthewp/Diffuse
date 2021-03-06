
var Element = require('./Element');
var RSSItem = require('./RSSItem');

const head = '<?xml version="1.0" encoding="UTF-8"?>';

const rssHead = new Element('rss', {
  'version': '2.0',
  'xmlns:content':'http://purl.org/rss/1.0/modules/content/'
});

module.exports = RSS;

/**
 * @constructor RSS
 * @param {Object} options
 */

function RSS(options) {
  var self = this;
  var options = options || {};
  var elements = this.elements = {};

  //Required elements
  options.title = options.title || 'Untitled';
  options.link = options.link || 'www.example.com';
  options.description = options.description || 'Undescribed';

  // Construct RSS feed
  var keys = Object.keys(options), key;

  while (key = keys.shift()) {
    var value = options[key];
    elements[key] = this[key] = new Element(key, value);
  };

  // Flag for wrapping content in CDATA blocks
  this.description.CDATA = true;
  this.title.CDATA = true;

  // Root channel element
  var channelName = options.channel || 'Untitled';
  this.channel = new Element('channel', channelName);

  // Container for RSS items
  this.items = [];

  // Container for options
  this.options = {};

  // Listen for changes on all Elements
  Element.on('change', function() {
    self.lastModified = Date.now();
  });

  // The rss head for this feed.
  this._rssHead = rssHead;

  return this;
};

RSS.createFeed = function(options) {
  return new RSS(options);
};

RSS.createElement = function(name, text, attrs) {
  return new Element(name, text, attrs);
};

RSS.prototype.appendChild = function(element) {
  this.elements[element._name] = element;
  this.lastModified = Date.now();
};

/**
 * Set option
 *
 * @param {String} key
 * @param {Any} val
 */

RSS.prototype.set = function(key, val) {
  this.options[key] = val;
};

/**
 * Get option
 *
 * @param {String} key
 * @return option
 */

RSS.prototype.get = function(key) {
  return this.options[key];
};

/**
 * Get a conformant date string
 *
 * @return String
 */

RSS.prototype.dateString = dateString;

function dateString() {
  return (new Date).toUTCString();
};

/**
 * Update an element's date text
 */

RSS.prototype.updateDate = updateDate;

function updateDate(type) {
  var element = this.elements[type];

  if (!element) return;

  // Update element text for new date
  element.text(this.dateString());
};

/**
 * addItem
 *
 * Add an item to the RSS feed
 *
 * @param {Object} options
 * @return RSSItem
 */

RSS.prototype.addItem =
RSS.prototype.item = addItem;

function addItem(options, cb) {
  var item = new RSSItem;
  var options = options || {};

  options.guid = options.guid || this.dateString();

  var keys = Object.keys(options), key;

  // Construct item
  while (key = keys.shift()) {
    var value = options[key];
    item.add(key, new Element(key, value));
  };

  // Flag for wrapping content in CDATA blocks
  if (item.description) item.description.CDATA = true;
  if (item.title) item.title.CDATA = true;

  if (cb) cb(item);

  // Add item to list
  this.items.push(item);

  // Update modified clock
  this.lastModified = Date.now();

  // Update build date
  this.updateDate('lastBuildDate');

  return item;
};

/**
 * Render channel or item elements
 *
 * @param {String} type
 * @return String
 * @api private
 */

RSS.prototype._render = _render;

function _render(type) {
  var elements = this[type];
  var keys = Object.keys(elements), key;
  var result = '';

  while (key = keys.shift()) {
    result += elements[key].toString();
  };

  return result;
};

/**
 * Render the RSS feed
 *
 * @return String
 * @api public
 */

RSS.prototype.render = 
RSS.prototype.xml = render;

function render(cb) {

  // Return cached result
  if (this.lastModified <= this.lastRendered) {
    if (cb) cb(null, this.cached);
    return this.cached;
  };

  // Render elements
  var channel        = this.channel;
  var channelContent = this._render('elements');
  var itemsContent   = this._render('items');
  var rssHead        = this._rssHead;

  // Generate XML
  var result = head
    + rssHead.open()
    + channel.open()
    + channelContent
    + itemsContent
    + channel.close()
    + rssHead.close();

  if (cb) cb(null, result);

  // Update cache
  this.cached = result;

  // Update clocks
  var now = Date.now();
  this.lastModified = now;
  this.lastRendered = now;
  
  // Update publish date
  this.updateDate('pubDate');

  return result;
};

/**
 * Adds a namespace to the feed.
 *
 * @param {String} nsName
 * @param {String} nsUrl
 * @return RSS object
 * @api public
 */

RSS.prototype.addNamespace = function(nsName, nsUrl) {
  this._rssHead.attr('xmlns:' + nsName, nsUrl);
  return this;
};

/**
 * Adds a namespace to the feed.
 *
 * @param {String} nsName
 * @return RSS object
 * @api public
 */

RSS.prototype.removeNamespace = function(nsName) {
  this._rssHead.removeAttribute('xmlns:' + nsName);
  return this;
};
