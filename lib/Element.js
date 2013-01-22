
var EventEmitter = require('events').EventEmitter;

module.exports = Element;

function Element(name, text, attrs) {
  var self = this;

  self._name = name;
  self._text = '';
  self._attrs = '';

  switch (typeof text) {
    case 'object':
      if (text.text) {
        self._text = text.text;
      };
      if (text.attrs) {
        attrs = text.attrs;
      } else {
        delete text.text;
        attrs = text;
      };
      break;
    case 'string':
    case 'number':
      self._text = text;
      break;
  };

  switch (typeof attrs) {
    case 'object':
      var keys = Object.keys(attrs), key;

      while (key = keys.shift()) {
        var val = '"' + attrs[key] + '"';
        var attrString = (' ' + key + '=' + val);
        self._attrs += attrString;
      };

      break;
    case 'string':
      self._attrs = ' ' + attrs;
      break;
  };
};

Element.prototype._emitter = new EventEmitter;

Element.on = function(event, fn) {
  Element.prototype._emitter.on(event, fn);
};

Element.prototype.setText =
Element.prototype.text = function(text) {
  this._text = text;
  return this;
};

Element.prototype.appendText = function(text) {
  this._text += text;
  return this;
};

Element.prototype.appendChild = function(element) {
  var children = Array.prototype.slice.call(arguments);
  var length = children.length;

  for (var i=0; i<length; i++) {
    this._text += children[i].toString();
  };

  return this;
};

Element.prototype.attrs =
Element.prototype.attr = 
Element.prototype.setAttribute = function(attr, val) {
  if (typeof attr === 'object') {
    var keys = Object.keys(attr), key;
    while (key = keys.shift()) {
      this.attr(key, attr[key]);
    };
  } else if (val) {
    var val = ['"', '"'].join(val);
    this._attrs += (' ' + attr + '=' + val);
  };
  return this;
};

Element.prototype.set = function(prop, key, val) {
  this[prop](key, val);
  this._emitter.emit('change');
  return this;
};

Element.prototype.open = function() {
  return '<' + this._name + this._attrs + '>';
};

Element.prototype.close = function() {
  return '</' + this._name + '>';
};


Element.prototype.toString = function() {
  var text = this._text;

  if (this.CDATA) {
    text = '<![CDATA[ ' + text + ' ]]>';
  };

  return this.open() + text + this.close();
};

