function Scrollol(navSelector, options) {
  'use strict';

  // ------------------------------------------------------------------------
  // Private variables
  // ------------------------------------------------------------------------

  var _dataStateAttribute = 'data-scrollol-state-active';

  // DOM elements
  var _navigation;
  var _menuLinks;
  var _targetContainers;

  // Default options
  var _defaultOptions = {
    scrollSpeed: 500,
    activeClass: 'active',
    inactiveClass: 'inactive',
    smoothScrolling: true
  };

  // ------------------------------------------------------------------------
  // Callbacks
  // ------------------------------------------------------------------------

  //
  // _callbacks holds a reference to any callbacks. By default it uses core
  // callbacks, which can be overridden using the callbacks API.
  //
  var _callbacks = {

    _clickedOnMenu: function() {
      //console.log("_clickedOnMenu", this);
    },

    _menuItemActive: function() {
      var element = this;
      var addClass = _defaultOptions.activeClass;
      var removeClass = _defaultOptions.inactiveClass;

      if (element.classList.contains(addClass) && !element.classList.contains(removeClass)) {
        return;
      }

      element.classList.add(addClass);
      element.classList.remove(removeClass);

    },

    _menuItemInactive: function() {
      var element = this;
      var addClass = _defaultOptions.inactiveClass;
      var removeClass = _defaultOptions.activeClass;

      if (element.classList.contains(addClass) && !element.classList.contains(removeClass)) {
        return; // 0;
      }

      element.classList.add(addClass);
      element.classList.remove(removeClass);
    },

    // _menuCollapsing handles the menu collapsing. If this function is overridden
    // using the API, the developer is responsible for hiding the menu
    _menuCollapsing: function() {
      this.style.display = 'none';
    },

    // _menuExpanding handles the menu expansion. If this function is overridden
    // using the API, the developer is responsible for showing the menu
    _menuExpanding: function() {
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
    },

    // _onScrollingComplete fires whenever a scroll is completed.
    _onScrollingComplete: function() {
      //console.log("Scrolling complete", this);
    }


  };

  //
  // _callbackContainer holds a reference to the callback functions.
  //
  var _callbackContainer = {
    clickedOnMenu: function(o) {

      return _resolveCallback.call(o, _callbacks, '_clickedOnMenu');

    },
    menuItemActive: function(o, state) {

      return _resolveCallback.call(o, _callbacks, '_menuItemActive', state);

    },
    menuItemInactive: function(o, state) {

      return _resolveCallback.call(o, _callbacks, '_menuItemInactive', state);

    },
    menuCollapsing: function(o) {

      return _resolveCallback.call(o, _callbacks, '_menuCollapsing');

    },
    menuExpanding: function(o) {

      return _resolveCallback.call(o, _callbacks, '_menuExpanding');

    },
    onScrolling: function(t, b, c, d) {

      return _resolveCallback.call(t, _callbacks, '_onScrolling', t, b, c, d);

    },
    onScrollingComplete: function(o) {

      return _resolveCallback.call(o, _callbacks, '_onScrollingComplete');

    }
  };

  // ------------------------------------------------------------------------
  // Private methods
  // ------------------------------------------------------------------------

  //
  // _resolveCallback resolves the passed dependency and either stores it or
  // calls it with given arguments
  //
  var _resolveCallback = function(callbackObject, callbackFunction) {

    // If a function, store the reference to it for further usage
    if (typeof this === 'function') {
      callbackObject[callbackFunction] = this;
    } else {
      // Else, let's assume this is just a bunch of arguments that needs
      // to be passed to an already stored function
      var args = Array.prototype.slice.apply(arguments).splice(2, Number.MAX_VALUE);
      console.log(callbackObject, callbackFunction);
      return callbackObject[callbackFunction].apply(this, args);
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
      _callbackContainer.menuItemActive(element, state);
    } else {
      _callbackContainer.menuItemInactive(element, state);
    }


    //return (state === true) ? 1 : -1;

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
  // The animation can be customized using the onScrolling callback
  // and implementing a custom scrolling equation.
  //
  function _scroll(destination) {

    var start = document.documentElement.scrollTop || document.body.scrollTop;
    var now = 0;
    var speed = _defaultOptions.scrollSpeed;

    var _animate = function() {

      now += 10;
      window.scrollTo(0, _callbackContainer.onScrolling(now, start, destination, speed));

      if (now < speed) {
        requestAnimationFrame(_animate);
      } else {
        _callbackContainer.onScrollingComplete();
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
    window.onscroll = window.onresize = _setupOnScrollEventListeners; // On scroll
    _setupOnClickEventListeners(); // On click
  }

  function _setupOnClickEventListeners() {
    // Listen for menu click events
    _menuLinks.forEach(function(menuLink) {
      menuLink.addEventListener('click', function(event) {

        event.preventDefault();
        event.stopPropagation();

        _callbackContainer.clickedOnMenu(menuLink, container);

        var container = document.querySelector(menuLink.getAttribute('data-target'));

        // Perform Scrolling
        if (_defaultOptions.smoothScrolling === false) {

          container.scrollIntoView({
            block: "start"
          });

          // Fire onScrollingComplete event. This will fire right after
          // clickedOnMenu but is kept for conformity reasons.
          _callbackContainer.onScrollingComplete();

        } else {
          _scroll(container.getBoundingClientRect().top);
        }


      }.bind(this));

    });

  }

  //
  // _setupOnScrollEventListeners handles scrolling events
  //
  function _setupOnScrollEventListeners() {

    _menuLinks.forEach(function(menuLink) {

      var container = document.querySelector(menuLink.getAttribute('data-target'));
      var submenu = _getSubmenu(menuLink);

      // Iterate through all containers, showing those within viewport
      if (_sectionWithinViewPort(container)) {

        // Highlight menu item
        if (_getElementState(menuLink) === false || menuLink.getAttribute(_dataStateAttribute) === null)
          _setMenuItemState(menuLink, true);

        // Expand any submenu
        if (submenu !== null && _getElementState(submenu) === false) {
          _setElementState(submenu, true);
          _callbackContainer.menuExpanding(submenu);
        }


      } else {
        if (_getElementState(menuLink) === true)
          _setMenuItemState(menuLink, false);




        if (submenu !== null && _getElementState(submenu) === true) {
          _setElementState(submenu, false);
          _callbackContainer.menuCollapsing(submenu);
        }

      }

    });

  }

  // ------------------------------------------------------------------------
  //   Construct
  // ------------------------------------------------------------------------

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

  return _callbackContainer;

}
