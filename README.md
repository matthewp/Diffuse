#Diffuse

`npm install diffuse`

A fast and simple RSS generator for Node.

```js
var RSS = require('diffuse');

var feed = RSS.createFeed({
  title: 'Amphibious Rodents',
  link: 'http://www.amphibiousrodentsclub.com',
  description: 'Where we share our thoughts about amphibiosu rodents'
});

feed.addItem({
  title: 'Let me introduce myself',
  description: 'My name is Bobby Stevenson and I command several fleets of amphibious rodents. Come with me on a journey to learn more about them. <p>My RSS feed can contain HTML in case I would like to <strong>emphasize</strong> my interest in rodents.',
  guid: '2013-1-20',
  pubDate: (new Date).toUTCString()
});
```

##Usage

Usage is fairly simple. The `Diffuse` API is mostly compatible with [node-rss](https://github.com/dylang/node-rss) module.

```js
var RSS = require('diffuse');
```

**Creating a feed**

Just call `#createFeed` with an object containing elements & their contents.

```js
var feed = RSS.createFeed({
  title: 'my feed',

  link: 'www.example.com',

  // Not limited to text!
  description: {
    text: 'A description of my feed',
    attrs: {
      href: 'www.example.com'
    }
  }
});
```

Some elements are required according to [RSS spec](http://cyber.law.harvard.edu/rss/rss.html#requiredChannelElements), and these are created for you automatically. Usually you would at least prefer to specify a `title`, `link` and a `description`, but diffuse will accept anything you throw at it.

**Adding items**

Call `#addItem` to add an item to your feed. This behaves similarly to `createFeed`, by building whatever elements you provide it.  Unlike `createFeed`, this does not have any defaults.

```js
var item = feed.addItem({
  title: 'The color white considered harmful',
  description: 'Here is the content of my RSS article. I hope you are ready for grammatical mistakes and poor word-flow.'
});
```

The `title` and `description` of the feed as well as items within it are wrapped in [CDATA](http://en.wikipedia.org/wiki/CDATA) blocks, so your descriptions may contain HTML. Give her hell.

**Rendering your feed**

To render your feed, call `#render`. This returns the generated XML of your RSS feed, and accepts a callback.

```js
var data = feed.render();

feed.render(function(err, data) {
  //Do stuff
});
```

Diffuse has an internal caching mechanism. Diffuse watches its document structure for modifications, and caches your generated XML. Re-rendering only needs to occur when the document has been modified. This happens either when you add a new item, or items have been modified using `item#set`. This gives it a significant performance advantage.

**More item configuration**

After you've created an item, you can still modify it using a simple API.

```js
var item = feed.addItem({
  title: 'Butt'
});

item.set('title', 'My modified title. I  didn\'t mean to say butt. Silly me.'
item.title.set('attrs', { href: 'www.example.com' });
```

**Building new Elements**

Internally, Diffuse has a simple API for building its document structure. That is exposed to you if you need to build a more complicated structure.

```js
var anchor = RSS.createElement('a', { href: 'http://www.google.com' });
anchor.appendText('My anchor.');

var mine = RSS.createElement('strong', ' Mine.');

anchor.appendChild(mine);

var content = anchor.toString();  // <a href='http://www.google.com'>My anchor. <strong>Mine.</strong></a>
```

##License

MIT
