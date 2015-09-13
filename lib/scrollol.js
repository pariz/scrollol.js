function Scrollol(navSelector, options) {
  'use strict';

  // ------------------------------------------------------------------------
  // Private variables
  // ------------------------------------------------------------------------

  var _dataStateAttribute = 'data-scrollol-state-active';
  var _dataTargetAttribute = 'data-scrollol-target';

  // DOM elements
  var _navigation;
  var _menuLinks;
  var _targetContainers;

  // States
  var _isOnscrollInited = false;

  // Default options
  var _defaultOptions = {
    scrollSpeed: 500,
    activeClass: 'active',
    inactiveClass: 'inactive',
    smoothScrolling: true
  };

  // Callbacks
  // ------------------------------------------------------------------------

  //
  // _eventsAndCallbacks holds a reference to any callback and event functions functions. By default it uses core
  // callbacks and events, which can be overridden using the callbacks and events API.
  //
  var _eventsAndCallbacks = {

    //
    // Callbacks

    // _clickedOnMenu triggers whenever the menu is clicked
    _clickedOnMenu: function() {
      console.log("default callbacks", "_clickedOnMenu", this);
    },

    // _menuItemActive fires whenever a menu item (main or sub) is activated
    _menuItemActive: function() {
      console.log("default callbacks", "_menuItemActive", this);
      var addClass = _defaultOptions.activeClass;
      var removeClass = _defaultOptions.inactiveClass;

      if (this.classList.contains(addClass) && !this.classList.contains(removeClass)) {
        return;
      }

      this.classList.add(addClass);
      this.classList.remove(removeClass);

    },

    // _menuItemInactive is the inverse of _menuItemActive and fires when the
    // menu item is no longer active
    _menuItemInactive: function() {
      console.log("default callbacks", "_menuItemInActive", this);
      var addClass = _defaultOptions.inactiveClass;
      var removeClass = _defaultOptions.activeClass;

      if (this.classList.contains(addClass) && !this.classList.contains(removeClass)) {
        return;
      }

      this.classList.add(addClass);
      this.classList.remove(removeClass);
    },

    // _menuCollapsing handles the menu collapsing. If this function is overridden
    // using the API, the developer is responsible for hiding the menu
    _menuCollapsing: function() {
      console.log("default callbacks", "_menuCollapsing", this);
      this.style.display = 'none';
    },

    // _menuExpanding handles the menu expansion. If this function is overridden
    // using the API, the developer is responsible for showing the menu
    _menuExpanding: function() {
      console.log("default callbacks", "_menuExpanding", this);
      this.style.display = 'block';
    },


    // _scrolling conforms to the easing equations by Robert Penner.
    // For more equations, visit http://gizma.com/easing/
    _scrolling: function(t, b, c, d) {
      // Quadratic easing
      t /= d / 2;
      if (t < 1) {
        return c / 2 * t * t + b;
      }
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    },

    //
    // Events

    // _onScrollingComplete fires whenever a scroll is completed.
    _onScrollingComplete: function() {
      console.log("default callbacks", "_onScrollingComplete", this);
    }


  };

  //
  // _eventsAndCallbacksContainer holds a reference to the callback functions.
  //
  var _eventsAndCallbacksContainer = {
    clickedOnMenu: function(o) {

      return _storeOrResolveCallback.call(o, _eventsAndCallbacks, '_clickedOnMenu');

    },
    menuItemActive: function(o, state) {

      return _storeOrResolveCallback.call(o, _eventsAndCallbacks, '_menuItemActive', state);

    },
    menuItemInactive: function(o, state) {

      return _storeOrResolveCallback.call(o, _eventsAndCallbacks, '_menuItemInactive', state);

    },
    menuCollapsing: function(o) {

      return _storeOrResolveCallback.call(o, _eventsAndCallbacks, '_menuCollapsing');

    },
    menuExpanding: function(o) {

      return _storeOrResolveCallback.call(o, _eventsAndCallbacks, '_menuExpanding');

    },
    scrolling: function(t, b, c, d) {

      return _storeOrResolveCallback.call(t, _eventsAndCallbacks, '_scrolling', t, b, c, d);

    },
    onScrollingComplete: function(o) {

      return _storeOrResolveCallback.call(o, _eventsAndCallbacks, '_onScrollingComplete');

    }
  };

  // ------------------------------------------------------------------------
  // Private methods
  // ------------------------------------------------------------------------

  //
  // _storeOrResolveCallback resolves the passed dependency and either stores it or
  // resolves it and passes any given arguments.
  //
  var _storeOrResolveCallback = function(cbObj, cbFunctionName) {

    // If a function, *store* the reference to it for further usage
    if (typeof this === 'function') {
      cbObj[cbFunctionName] = this;
    } else {
      // Else, let's assume this is just a bunch of arguments that needs
      // to be passed to an already stored function
      // thus; *resolve* the callback and pass arguments[1..n]
      var args = Array.prototype.slice.apply(arguments).splice(2, Number.MAX_VALUE);
      return cbObj[cbFunctionName].apply(this, args);
    }

    return;

  };

  //
  // _getElementsBySelector Returns the given element based on passed selector
  // which can be either id or class name.
  //
  function _getElementsBySelector(selector) {

    if (selector === null || typeof selector !== 'string') {
      throw "You must specify a correct menu selector as first argument";
    }

    if (selector.substr(0, 1) === '#') {
      return document.getElementByID(selector);
    }

    return document.querySelector(selector);

  }

  //
  // _setMenuItemState alters the classList of the passed element to give it
  // the correct state.
  //
  function _setMenuItemState(element, state) {


    _setElementState(element, state);

    if (state === true) {
      _eventsAndCallbacksContainer.menuItemActive(element, state);
    } else {
      _eventsAndCallbacksContainer.menuItemInactive(element, state);
    }

  }

  //
  // _getSubmenu returns the menu element sub menu, which is the first UL sibling.
  //
  function _getSubmenu(menuElement) {
    while ((menuElement = menuElement.nextSibling) && menuElement.nodeName !== 'UL');
    return menuElement;
  }

  //
  // _sectionWithinViewPort calculates if the element is within viewport.
  //
  function _sectionWithinViewPort(element) {
    var viewportHeight = (window.innerHeight || document.documentElement.clientHeight);
    var rect = element.getBoundingClientRect();
    return (rect.bottom > 0 && rect.top - viewportHeight < 0);
  }

  //
  // _scroll scrolls the page based on the given pixel offset.
  // The animation can be customized using the scrolling callback
  // and implementing a custom scrolling equation.
  //
  function _scroll(destination) {

    var start = document.documentElement.scrollTop || document.body.scrollTop;
    var now = 0;
    var speed = _defaultOptions.scrollSpeed;

    var _animate = function() {

      now += 10;
      window.scrollTo(0, _eventsAndCallbacksContainer.scrolling(now, start, destination, speed));

      if (now < speed) {
        requestAnimationFrame(_animate);
      } else {
        _eventsAndCallbacksContainer.onScrollingComplete();
      }
    };
    _animate();
  }

  //
  // _setElementState sets the elements data-scrollol-state attribute to given state
  //
  function _setElementState(element, state) {
    element.setAttribute(_dataStateAttribute, state);
  }

  //
  // _getElementState returns the elements data-scrollol-state attribute as boolean
  // if attribute is null, true is default
  //
  function _getElementState(element) {
    var state = element.getAttribute(_dataStateAttribute);
    return (state === null || state === 'true') || state !== 'false';
  }

  //
  // _setupEventListeners initializes all event listeners (scrolling, clicking, etc)
  //
  function _setupEventListeners() {
    _setupOnScrollEventListeners(); // On scroll
    _setupOnClickEventListeners(); // On click
  }

  //
  // _setupOnScrollEventListeners listens for onscroll/onresize events
  //
  function _setupOnScrollEventListeners() {
    window.onscroll = window.onresize = window.onload = _onScroll;
  }

  //
  // _setupOnClickEventListeners listens for click events on the menu
  //
  function _setupOnClickEventListeners() {
    // Listen for menu click events
    _menuLinks.forEach(function(menuLink) {
      menuLink.addEventListener('click', function(event) {

        if (_eventsAndCallbacksContainer.clickedOnMenu(menuLink, container)) // If callback returns, abort everything
          return;

        event.preventDefault();
        event.stopPropagation();

        var container = document.querySelector(menuLink.getAttribute(_dataTargetAttribute));

        // Perform Scrolling
        if (_defaultOptions.smoothScrolling === false) {

          container.scrollIntoView({
            block: "start"
          });

          // Fire onScrollingComplete event. This will fire right after
          // clickedOnMenu but is kept for conformity reasons.
          _eventsAndCallbacksContainer.onScrollingComplete();

        } else {
          _scroll(container.getBoundingClientRect().top);
        }


      }.bind(this));

    });

  }

  //
  // _onScroll handles scrolling events
  //
  function _onScroll() {

    _menuLinks.forEach(function(menuLink) {

      var container = document.querySelector(menuLink.getAttribute(_dataTargetAttribute));
      var submenu = _getSubmenu(menuLink);

      // Iterate through all containers, showing those within viewport
      if (_sectionWithinViewPort(container)) {

        // Highlight menu item
        if (_getElementState(menuLink) === false || menuLink.getAttribute(_dataStateAttribute) === null)
          _setMenuItemState(menuLink, true);

        // Expand any submenu
        if (submenu !== null && (_getElementState(submenu) === false || !_isOnscrollInited)) {
          _setElementState(submenu, true);
          _eventsAndCallbacksContainer.menuExpanding(submenu);
        }

      } else {
        if (_getElementState(menuLink) === true)
          _setMenuItemState(menuLink, false);

        if (submenu !== null && (_getElementState(submenu) === true || !_isOnscrollInited)) {
          _setElementState(submenu, false);
          _eventsAndCallbacksContainer.menuCollapsing(submenu);
        }

      }

    });

    _isOnscrollInited = true;

  }

  // ------------------------------------------------------------------------
  //   Construct
  // ------------------------------------------------------------------------

  (function _constructor() {

    var navigation = _getElementsBySelector(navSelector);

    if (navigation === null) {
      throw ('Menu selector is incorrect, must be a string containing a reference to a class or id, for example "#my-menu" or .my-menu"');
    }

    // Validate target links
    var targetContainers = [];
    var menuLinks = Array.prototype.slice.call(navigation.querySelectorAll('['+_dataTargetAttribute+']')).filter(function(node) {

      var targetValue = node.getAttribute(_dataTargetAttribute);
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

  return _eventsAndCallbacksContainer;

}
