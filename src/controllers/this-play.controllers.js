;(function (undefined) {
	'use strict';
	
	if (typeof this_play === 'undefined') {
		throw 'this_play is not declared';
	}
	
	var Controller = function (model) {
		this.model = model;
		this.events = {};
	};
	
	Controller.prototype.update = function (data) {
		var before = this.model.getValue();
		this.model.setValue(data);
		var after = this.model.getValue();
		if (this.events["update"]) this.events["update"](before, after);
	};
	
	Controller.prototype.on = function (event, callback) {
		this.events[event] = callback;
	};
	
	var ArrayController = function (model) {
		Controller.apply(this, arguments);
	};
	
	ArrayController.prototype = new Controller();
	
	ArrayController.prototype.update = function (data) {
		if (!Array.isArray(data)) {
			throw TypeError("data is not array");
		}
		
		if (data.length != this.model.array.length) {
			throw RangeError("data range error");
		}
		
		for (var i = 0; i < data.length; i++) {
			if (typeof data[i] !== this.model.type) {
				throw TypeError("type error");
			}
		}
		
		for (var i = 0; i < data.length; i++) {
			this.model.array[i].setValue(data[i]);
		}
	};
	
	var module = (function () {
				
		var create = function (model) {
			if (model.array) {
				return new ArrayController(model);
			}
			
			return new Controller(model);
		}
		
		return {
			create: create
		}
		
	})();
	
	this_play.controllers = module;
	
}).call(this);