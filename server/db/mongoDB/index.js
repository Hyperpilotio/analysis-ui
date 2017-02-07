
'use strict'

let config = require('../../../config/template');
let mongo = require('mongodb');
let monk = require('monk');
let wrap = require('co-monk');
let db = monk(config.mongoDB.url);

module.exports={
	getModel : function( modelName ){
		return wrap(db.get(modelName));
	},
	deployments : {
	  findAll: function() {
	    return wrap(db.get('deployments')).find({});
	  }
	}
};