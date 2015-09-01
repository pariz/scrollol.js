function Scrollol(navSelector, options) {
  'use strict';

  ////////////////////////
  // Private variables //
  ////////////////////////

  var _dataStateAttribute = 'data-scrollol-state-active';

  var _navigation,
    _menuLinks,
    _targetContainers;

  // Default options
  var _defaultOptions = {
    scrollSpeed: 500,
    activeClass: 'active',
    inactiveClass: 'inactive',
    smoothScrolling: true,
    highlightNewest: false,
    hideSubMenus: true
  };

  ///////////////
  // Callbacks //
  ///////////////

  var _defaultCallbacks = {
    _scrolledToSection: function() {
      console.log("Scrolling complete", this);
    },
    _clickedOnMenu: function() {
      console.log("_clickedOnMenu", this);
    },
    _menuCollapsed: function() {
      console.log("_menuCollapsed", this);
      this.style.display = 'none';
    },
    _menuExpanded: function() {
      console.log("_menuExpanded", this);
      this.style.display = 'block';
    },
    // _onScrolling conforms to the easing equations by Robert Penner.
    // For more equations, visit http://gizma.com/easing/
    _onScrolling: function(t, b, c, d) {

      // Quadratic easing
      t /= d / 2;
      if (t < 1) {
        return c / 2 * t * t + b;
      }
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }


  };

  // _callbacks is holds a reference to the callback functions. Initially it references the _defaultCallbacks
  var _callbacks = {
    scrolledToSection: function(o) {

      return _resolveCallback.call(o, _defaultCallbacks, '_scrolledToSection');

    },
    clickedOnMenu: function(o) {

      return _resolveCallback.call(o, _defaultCallbacks, '_clickedOnMenu');

    },
    menuCollapsed: function(o) {

      return _resolveCallback.call(o, _defaultCallbacks, '_menuCollapsed');


    },
    menuExpanded: function(o) {

      return _resolveCallback.call(o, _defaultCallbacks, '_menuExpanded');

    },
    onScrolling: function(t, b, c, d) {

      return _resolveCallback.call(t, _defaultCallbacks, '_onScrolling', t, b, c, d);

    }
  };

  /////////////////////
  // Private methods //
  /////////////////////

  // _resolveCallback resolves the passed dependency and either stores it or
  // calls it with given arguments
  var _resolveCallback = function(callbackObject, callbackFunction) {

    // If a function, store the reference to it for further usage
    if (typeof this === 'function') {
      callbackObject[callbackFunction] = this;
    } else {
      // Else, let's assume this is just a bunch of arguments that needs
      // to be passed to an already stored function
      var args = Array.prototype.slice.apply(arguments).splice(2, Number.MAX_VALUE);
      return callbackObject[callbackFunction].apply(this, args);
    }

    return;


  };

  // _getElementsBySelector Returns the given element based on passed selector
  // which can be either id or class name.
  function _getElementsBySelector(selector) {

    if (selector === null || typeof selector !== 'string') {
      throw "You must specify a correct menu selector as first arugment";
    }

    if (selector.substr(0, 1) === '#') {
      return document.getElementByID(selector);
    }

    return document.querySelector(selector);

  }

  // _setMenuItemState alters the classList of the passed element to give it
  // the correct state.
  function _setMenuItemState(element, state) {

    var addClass = (state === true) ? _defaultOptions.activeClass : _defaultOptions.inactiveClass;
    var removeClass = (state === false || state === undefined) ? _defaultOptions.activeClass : _defaultOptions.inactiveClass;

    if (element.classList.contains(addClass) && !element.classList.contains(removeClass)) {
      return 0;
    }

    element.classList.add(addClass);
    element.classList.remove(removeClass);

    _setElementState(element,state);

    return (state === true) ? 1 : -1;

  }


  // _getSubmenu returns the menu element sub menu, which is the first UL sibling.
  function _getSubmenu(menuElement) {

    while ((menuElement = menuElement.nextSibling) && menuElement.nodeName !== 'UL'); // Oh the wonders of functional programming in JavaScript
    return menuElement;
  }

  // _withinViewPort calculates if the element is within viewport.
  function _withinViewPort(element) {
    var viewportHeight = (window.innerHeight || document.documentElement.clientHeight);
    var rect = element.getBoundingClientRect();
    return (rect.bottom > 0 && rect.top - viewportHeight < 0);
  }

  //  _requestAnimationFrame is a shim for requestAnimationFrame in case the user
  //  browser is older than God.
  var _requestAnimationFrame = (function() {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  // _scroll scrolls the page based on the given pixel offset.
  // The animation can be customized using the onScrolling callback
  // and implementing a custom scrolling equation.
  function _scroll(destination) {


    var start = document.documentElement.scrollTop || document.body.scrollTop;
    var now = 0;
    var duration = _defaultOptions.scrollSpeed;

    var _animate = function() {

      now += 10;
      window.scrollTo(0, _callbacks.onScrolling(now, start, destination, duration));

      // do the animation unless its over
      if (now < duration) {
        _requestAnimationFrame(_animate);
      } else {
        _callbacks.scrolledToSection();
      }
    };
    _animate();
  }

  // _setElementState sets the elements data-scrollol-state attribute to given state
  function _setElementState(element,state) {
    element.setAttribute(_dataStateAttribute,state);
  }

  // _getElementState returns the elements data-scrollol-state attribute as boolean
  // if attribute is null, true is default
  function _getElementState(element) {
    var state = element.getAttribute(_dataStateAttribute);
    return (state === null || state === 'true') || state !== 'false';
  }

  // _setupEventListeners initializes all event listeners (scrolling, clicking, etc)
  function _setupEventListeners() {

    var _onScrolling = function() {

      var previousHighlighted;
      var numActive = 0;

      _menuLinks.forEach(function(menuLink) {

        var container = document.querySelector(menuLink.getAttribute('data-target'));
        var submenu = _getSubmenu(menuLink);

        // Iterate through all containers, showing those within viewport
        if (_withinViewPort(container)) {

          // Highlight menu item
          if (_getElementState(menuLink) === false || menuLink.getAttribute(_dataStateAttribute) === null)
            numActive += _setMenuItemState(menuLink, true);

          // Expand any submenu
          if (submenu !== null && _getElementState(submenu) === false) {
            _setElementState(submenu,true);
            _callbacks.menuExpanded(submenu);
          }


          if (_defaultOptions.highlightNewest === true) {

            // Only remove highlight if there is more than one highlight present.
            if (previousHighlighted !== undefined && numActive !== 1) {
              numActive += _setMenuItemState(previousHighlighted, false);
            }
            previousHighlighted = menuLink;
          }

        } else {
          if (_getElementState(menuLink) === true)
            numActive += _setMenuItemState(menuLink, false);

          if (submenu !== null && _getElementState(submenu) === true) {
            //_callbacks._menuCollapsed(submenu);
            _setElementState(submenu,false);
            _callbacks.menuCollapsed(submenu);
          }

        }

      }.bind(this));
    };

    // Listen for menu click events

    _menuLinks.forEach(function(menuLink) {
      menuLink.addEventListener('click', function(event) {

        event.preventDefault();
        event.stopPropagation();

        _callbacks.clickedOnMenu(menuLink, container);

        var container = document.querySelector(menuLink.getAttribute('data-target'));

        // Perform Scrolling
        if (_defaultOptions.smoothScrolling === false) {

          container.scrollIntoView({
            block: "start"
          });

        } else {
          _scroll(container.getBoundingClientRect().top);
        }


      }.bind(this));

    });


    window.onscroll = window.onresize = _onScrolling;
    _onScrolling();


  }

  ///////////////////
  //   Construct   //
  ///////////////////
  
  (function _constructor() {

    var navigation = _getElementsBySelector(navSelector);

    if (navigation === null) {
      throw ('Menu selector is incorrect, must be a string containing a reference to a class or id, for example "#my-menu" or .my-menu"');
    }

    // Validate data-target links
    var targetContainers = [];
    var menuLinks = Array.prototype.slice.call(navigation.querySelectorAll('[data-target]')).filter(function(node) {

      var targetValue = node.getAttribute('data-target');
      var targetNode = _getElementsBySelector(targetValue);

      if (targetValue === '') {
        console.warn('Target selector is empty, removing menu node', node, 'from observer list');
        return false;
      }

      if (targetNode === null) {
        console.warn('Target selector is invalid', targetValue, 'Removing menu node', node.innerText, 'from observer list');
        return false;
      }

      // Add target node
      targetContainers.push(targetNode);

      return true;


    }.bind(this));

    _navigation = navigation;
    _menuLinks = menuLinks;
    _targetContainers = targetContainers;

    // Merge with options
    for (var option in options) {
      _defaultOptions[option] = options[option];
    }

    // Setup event listeners

    _setupEventListeners();
  })();

  return _callbacks;

}
