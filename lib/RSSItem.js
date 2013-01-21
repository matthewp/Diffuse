
var Element = require('./Element');

module.exports = RSSItem;

/**
 * @constructor RSSItem
 */

function RSSItem() { };

RSSItem.prototype.set = function set(prop, key, val) {
  if (!this[prop]) return;

  var keyType = typeof key;

  if (keyType === 'object') {
    var keys = Object.keys(key), k;
    while (k = keys.shift()) {
      this[prop].set(k, key[k]);
    };
    return;
  };

  if (!val && keyType !== 'object') {
    val = key;
    key = 'text';
  };

  this[prop].set(key, val);
};

RSSItem.prototype.get = function get(name) {
  return this[name];
};

RSSItem.prototype.add = 
RSSItem.prototype.addElement = addElement;

function addElement(name, element) {
  this[name] = element;
};


RSSItem.prototype.keys = function keys() {
  return Object.keys(this);
};

RSSItem.prototype.toString = function toString() {
  var item = new Element('item');
  var keys = this.keys(), key;
  var result = '';

  while (key = keys.shift()) {
    item.appendChild(this[key]);
  };

  return item;
};
