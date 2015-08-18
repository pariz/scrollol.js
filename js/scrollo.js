var Class = function(methods) {
    var _class = function() {
        this._initialize.apply(this, arguments);
    };

    for (var property in methods) {
       _class.prototype[property] = methods[property];
    }

    if (!_class.prototype._initialize) _class.prototype._initialize = function(){};

    return _class;
};

var Scrollo = new Class({

	// options = {
	// 'scrollSpeed': 500,
	// ...
	// }

	_defaultOptions: {
		'scrollSpeed': 500,
    'activeClass': 'active',
    'inactiveClass': 'inactive'
	},

  _callbacks: {
    _didScrollToSection: function(){},
    _didClickMenuItem: function(){}
  },

  _validateSelector: function(selector) {

    var node;

    // Validate correct hooks
    if (selector == null || typeof selector !== 'string') {
      throw "You must specify a correct menu selector as first arugment";
    }

    if (selector.substr(0,1) === '#') {
      node = document.getElementByID(selector);
    }
    else {
      node = document.querySelector(selector);
    }

    return node;

  },

  _setupEventListeners: function() {

    /////////////////////
    // Private methods //
    /////////////////////

    var _onScroll = function(){
      this._menuLinks.forEach(function(menuLink) {

        var container       = document.querySelector(menuLink.getAttribute('data-target'));
        var rect            = container.getBoundingClientRect();
        var viewportHeight  = (window.innerHeight || document.documentElement.clientHeight);

        if (rect.bottom > 0 && rect.top-viewportHeight < 0) {
          // Highlight menu item
          menuLink.classList.add(this._defaultOptions.activeClass);
          menuLink.classList.remove(this._defaultOptions.inactiveClass);
        }
        else {
          // Dehightlight menu item
          menuLink.classList.remove(this._defaultOptions.activeClass);
          menuLink.classList.add(this._defaultOptions.inactiveClass);
        }


      }.bind(this));
    }.bind(this);

    ////////////////////////
    // Register listeners //
    ////////////////////////

    // Scrolling
    window.onscroll = window.onresize = _onScroll;
    _onScroll();

    // Menu clicking
    this._menuLinks.forEach(function(menuLink) {
      menuLink.addEventListener('click',function(event) {

        event.preventDefault();
        event.stopPropagation();

        this._callbacks._didClickMenuItem(menuLink,container);

        // Perform Scrolling
        var container = document.querySelector(menuLink.getAttribute('data-target'));
        container.scrollIntoView({block: "start", behavior: "smooth"});

      }.bind(this));
    }.bind(this));


  },

	_initialize: function(navSelector,options) {

		var navigation = this._validateSelector(navSelector)

    if (navigation == null) {
      throw ('Menu selector is incorrect, must be a string containing a reference to a class or id, for example "#my-menu" or .my-menu"')
    }

    // Validate data-target links
    var targetContainers = [];
    var menuLinks = Array.prototype.slice.call(navigation.querySelectorAll('[data-target]')).filter(function(node) {

      var targetValue = node.getAttribute('data-target');
      var targetNode = this._validateSelector(targetValue);

      if (targetValue == '') {
        console.warn('Target selector is empty, removing menu node', node, 'from observer list');
        return false;
      }

      if (targetNode == null) {
        console.warn('Target selector is invalid',targetValue,'Removing menu node', node.innerText, 'from observer list');
        return false;
      }

      // Add target node
      targetContainers.push(targetNode);

      return true;


    }.bind(this));

		this._menuLinks = menuLinks;
    this._targetContainers = targetContainers;

		// Merge with options
		for (var option in options) {
				this._defaultOptions[option] = options[option];
		}

    /////////////////////////////
    // Initialization complete //
    /////////////////////////////

    this._setupEventListeners();

    return {

      didScrollToSection: this._callbacks_didScrollToSection,
      didClickMenuItem: this._callbacks._didClickMenuItem

    }

	},


});





// var scroll = new Scrollo({'scrollSpeed':100});
