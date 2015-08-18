var Class = function(methods) {
    var _class = function() {
        this._constructor.apply(this, arguments);
    };

    for (var property in methods) {
       _class.prototype[property] = methods[property];
    }

    if (!_class.prototype._constructor) _class.prototype._constructor = function(){};

    return klass;
};

var Scrollo = Class({

	// _options = {
	// 'scrollSpeed': 500,
	// ...
	// }

	_defaultOptions : {
		'scrollSpeed': 500
	},

	initialize: function(_navigationSelector,_options) {

		var navigation;

		// Bootstrapping
		if (_navigationSelector == null) {
			throw "Navigation must be set";
		}

		if (_navigationSelector.substr(0,1) == '#') {
			navigation = document.getElementByID(_navigationSelector);
		}
		else {
			navigation = document.querySelector(_navigationSelector);
		}

		if (navigation == null) {
			throw ("Navigation selector is incorrect")
		}


		// Merge with options
		for (var option in _options) {
				_defaultOptions[option] = _options[option];
		}




	}



});



// var scroll = new Scrollo({'scrollSpeed':100});
