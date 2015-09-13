function Scrollol(navSelector, options) {
  "use strict";
  var _dataStateAttribute = "data-scrollol-state-active";
  var _dataTargetAttribute = "data-scrollol-target";
  var _navigation;
  var _menuLinks;
  var _targetContainers;
  var _isOnscrollInited = false;
  var _defaultOptions = {
    scrollSpeed: 500,
    activeClass: "active",
    inactiveClass: "inactive",
    smoothScrolling: true
  };
  var _eventsAndCallbacks = {
    _clickedOnMenu: function() {},
    _menuItemActive: function() {
      var addClass = _defaultOptions.activeClass;
      var removeClass = _defaultOptions.inactiveClass;
      if (this.classList.contains(addClass) && !this.classList.contains(removeClass)) {
        return;
      }
      this.classList.add(addClass);
      this.classList.remove(removeClass);
    },
    _menuItemInactive: function() {
      var addClass = _defaultOptions.inactiveClass;
      var removeClass = _defaultOptions.activeClass;
      if (this.classList.contains(addClass) && !this.classList.contains(removeClass)) {
        return;
      }
      this.classList.add(addClass);
      this.classList.remove(removeClass);
    },
    _menuCollapsing: function() {
      this.style.display = "none";
    },
    _menuExpanding: function() {
      this.style.display = "block";
    },
    _scrolling: function(t, b, c, d) {
      t /= d / 2;
      if (t < 1) {
        return c / 2 * t * t + b;
      }
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    },
    _onScrollingComplete: function() {}
  };
  var _eventsAndCallbacksContainer = {
    clickedOnMenu: function(o) {
      return _storeOrResolveCallback.call(o, _eventsAndCallbacks, "_clickedOnMenu");
    },
    menuItemActive: function(o, state) {
      return _storeOrResolveCallback.call(o, _eventsAndCallbacks, "_menuItemActive", state);
    },
    menuItemInactive: function(o, state) {
      return _storeOrResolveCallback.call(o, _eventsAndCallbacks, "_menuItemInactive", state);
    },
    menuCollapsing: function(o) {
      return _storeOrResolveCallback.call(o, _eventsAndCallbacks, "_menuCollapsing");
    },
    menuExpanding: function(o) {
      return _storeOrResolveCallback.call(o, _eventsAndCallbacks, "_menuExpanding");
    },
    scrolling: function(t, b, c, d) {
      return _storeOrResolveCallback.call(t, _eventsAndCallbacks, "_scrolling", t, b, c, d);
    },
    onScrollingComplete: function(o) {
      return _storeOrResolveCallback.call(o, _eventsAndCallbacks, "_onScrollingComplete");
    }
  };
  var _storeOrResolveCallback = function(cbObj, cbFunctionName) {
    if (typeof this === "function") {
      cbObj[cbFunctionName] = this;
    } else {
      var args = Array.prototype.slice.apply(arguments).splice(2, Number.MAX_VALUE);
      return cbObj[cbFunctionName].apply(this, args);
    }
    return;
  };
  function _getElementsBySelector(selector) {
    if (selector === null || typeof selector !== "string") {
      throw "You must specify a correct menu selector as first argument";
    }
    if (selector.substr(0, 1) === "#") {
      return document.getElementByID(selector);
    }
    return document.querySelector(selector);
  }
  function _setMenuItemState(element, state) {
    _setElementState(element, state);
    if (state === true) {
      _eventsAndCallbacksContainer.menuItemActive(element, state);
    } else {
      _eventsAndCallbacksContainer.menuItemInactive(element, state);
    }
  }
  function _getSubmenu(menuElement) {
    while ((menuElement = menuElement.nextSibling) && menuElement.nodeName !== "UL") ;
    return menuElement;
  }
  function _sectionWithinViewPort(element) {
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    var rect = element.getBoundingClientRect();
    return rect.bottom > 0 && rect.top - viewportHeight < 0;
  }
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
  function _setElementState(element, state) {
    element.setAttribute(_dataStateAttribute, state);
  }
  function _getElementState(element) {
    var state = element.getAttribute(_dataStateAttribute);
    return state === null || state === "true" || state !== "false";
  }
  function _setupEventListeners() {
    _setupOnScrollEventListeners();
    _setupOnClickEventListeners();
  }
  function _setupOnScrollEventListeners() {
    window.onscroll = window.onresize = window.onload = _onScroll;
  }
  function _setupOnClickEventListeners() {
    _menuLinks.forEach(function(menuLink) {
      menuLink.addEventListener("click", function(event) {
        if (_eventsAndCallbacksContainer.clickedOnMenu(menuLink, container)) return;
        event.preventDefault();
        event.stopPropagation();
        var container = document.querySelector(menuLink.getAttribute(_dataTargetAttribute));
        if (_defaultOptions.smoothScrolling === false) {
          container.scrollIntoView({
            block: "start"
          });
          _eventsAndCallbacksContainer.onScrollingComplete();
        } else {
          _scroll(container.getBoundingClientRect().top);
        }
      }.bind(this));
    });
  }
  function _onScroll() {
    _menuLinks.forEach(function(menuLink) {
      var container = document.querySelector(menuLink.getAttribute(_dataTargetAttribute));
      var submenu = _getSubmenu(menuLink);
      if (_sectionWithinViewPort(container)) {
        if (_getElementState(menuLink) === false || menuLink.getAttribute(_dataStateAttribute) === null) _setMenuItemState(menuLink, true);
        if (submenu !== null && (_getElementState(submenu) === false || !_isOnscrollInited)) {
          _setElementState(submenu, true);
          _eventsAndCallbacksContainer.menuExpanding(submenu);
        }
      } else {
        if (_getElementState(menuLink) === true) _setMenuItemState(menuLink, false);
        if (submenu !== null && (_getElementState(submenu) === true || !_isOnscrollInited)) {
          _setElementState(submenu, false);
          _eventsAndCallbacksContainer.menuCollapsing(submenu);
        }
      }
    });
    _isOnscrollInited = true;
  }
  (function _constructor() {
    var navigation = _getElementsBySelector(navSelector);
    if (navigation === null) {
      throw 'Menu selector is incorrect, must be a string containing a reference to a class or id, for example "#my-menu" or .my-menu"';
    }
    var targetContainers = [];
    var menuLinks = Array.prototype.slice.call(navigation.querySelectorAll("[" + _dataTargetAttribute + "]")).filter(function(node) {
      var targetValue = node.getAttribute(_dataTargetAttribute);
      var targetNode = _getElementsBySelector(targetValue);
      if (targetValue === "") {
        return false;
      }
      if (targetNode === null) {
        return false;
      }
      targetContainers.push(targetNode);
      return true;
    }.bind(this));
    _navigation = navigation;
    _menuLinks = menuLinks;
    _targetContainers = targetContainers;
    for (var option in options) {
      _defaultOptions[option] = options[option];
    }
    _setupEventListeners();
  })();
  return _eventsAndCallbacksContainer;
}