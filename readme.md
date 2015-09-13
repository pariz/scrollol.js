# Scrollol.js
A page scroller in ~3 kb vanilla JavaScript.

Scrollol.js is minimalistic and does not use any third party libraries. It also tries to take advantage of the features of most modern browsers. If backwards compatability is required, I recommend using this amazing polyfill: [https://github.com/inexorabletash](https://github.com/inexorabletash)

# Installation

Download [the zip](https://github.com/pariz/scrollol.js/archive/master.zip) or clone the repo `git clone https://github.com/pariz/scrollol.js.git`.
Or reference it directly from the rawgit CDN: `<script type="text/javascript" src="https://cdn.rawgit.com/pariz/scrollol.js/master/dist/scrollol.min.js"></script>`

# Usage

To get going with Scrollol.js is easy, just create an instance of Scrollol, with the first argument being a CSS selector referring your menu:
```javascript

var scroll = new Scrollol('.my-navigation');

```
and the correspondiing menu:
```html
<aside class="my-navigation">
  <ul>
    <li><a href="" data-scrollol-target=".my-section">My section</a></li>
  </ul>
</aside>
```

Scrollol requires a set of menu items, with a corresponding amount of content sections.

For example, if you have 5 menu items:
```html
<ul>
  <li><a href="" data-scrollol-target=".section-one">Section one</a>
   <li><a href="" data-scrollol-target=".section-two">Section two</a>
   <li><a href="" data-scrollol-target=".section-three">Section three</a>
   <li><a href="" data-scrollol-target=".section-four">Section four</a>
   <li><a href="" data-scrollol-target=".section-five">Section five</a>
</ul>
```
each `data-scrollol-target` attribute will be evaluated as a css seelctor. If the targeted element does not exist, Scrollol.js will fail.

## Sub menus
Scrollol.js supports sub menus as well, however they are limited to one sub menu depth as of now.

```html
<ul>
  <li><a href="" data-scrollol-target=".section-one">Section one</a>
    <ul>
      <li><a href="" data-scrollol-target=".section-one-sub-one">Section one sub one</a></li>
      <li><a href="" data-scrollol-target=".section-one-sub-two">Section one sub two</a></li>
      <li><a href="" data-scrollol-target=".section-one-sub-three">Section one sub three</a></li>
    </ul>
  </li>
</ul>
```

# Callbacks and Events API

Of course, Scrollol.js has a callback API. By defining your own callbacks, you can manipulate pretty much every way Scrollol.js behaves.

## Callbacks
`clickedOnMenu`, `menuItemActive`, `menuItemInactive`, `menuCollapsing`, `menuExpanding` and `scrolling` are all callback methods on your `Scrollol` instance. The `this` keyword in each of these callbacks refers to the current element being manipulated.

The only exception here is the `scrolling` callback, which expects a function returning the result of an easing equation. By default a Quadradic easing function is used.

Example:
```javascript
var scrollol = new Scrollol(".my-navigation");
scrollol.scrolling(function(currentTime,startPosition,endPosition,speed) {
  currentTime /= speed / 2;
  if (currentTime < 1) {
    return endPosition / 2 * currentTime * currentTime + startPosition;
  }
  currentTime--;
  return -endPosition / 2 * (currentTime * (currentTime - 2) - 1) + startPosition;

});
```
More equations can be found here: http://gizma.com/easing/

If a callback is initiated, the default internals of that callback is overridden. This means that the callback must satisfy the expected behaviour.

The `this` keyword references the element being effected in each of the callbacks.

Example:
```javascript
var scrollol = new Scrollol(".my-navigation");

scrollol.menuItemActive(function() {

  if (this.classList.contains('active') && !this.classList.contains('inactive')) {
    return;
  }

  this.classList.add('active');
  this.classList.remove('inactive');

});
```

The above example makes sure any active menu item has the class name `active` attached to it.

## Events
Events are pretty similar to callbacks, except for the fact that the events have no way of directly manipulate it's origin. The `this` keyword for example references the function itself. Neither are there any arguments passed to an event function.

At the moment, the only event is `onScrollingComplete`, which fires every time the page has scrolled to it's destination.

# Todo
* Finalize tests
* Create a github pages site
* Infinite submenus (maybe, not sure this makes sense)
* ...
* Profit
