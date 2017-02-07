
'use strict'

let logger = require('koa-logger');
let route = require('koa-route');
let send = require('koa-send');
let cors = require('kcors');
let path = require('path');
let koa = require('koa');
let serve = require('koa-static');
let mongo = require('./db/mongoDB');

/**
 * Create our app
 */

let app = koa();

/**
 * Export the app
 */

module.exports = app;

/**
 * Add in a logger
 */

app.use(logger());

/**
 * Setup an error handler.
 */

app.use(function *(next){
  try {
    yield next;
  } catch (err) {
    console.log('error:', err.stack);
  }
});

/**
 * Add our CORS handler.
 */

app.use(cors());

/**
 * Create our state.
 */

app.use(function *(next){
  this.mongo = mongo;
  yield next;
});

/**
 * Set our routes.
 */

app.use(route.get('/api/clusters', list));

/**
 * Static routes.
 */

app.use(route.get('/bundle.js', bundle));
app.use(route.get('/bundle.js.map', sourcemap));
app.use(route.get('/bundle.css', stylesheet));
app.use(route.get('/bundle.css.map', stylesheetMap));
app.use(route.get('/*', index));

/**
 * Transfer the index page
 */

function *index(){
  yield send(this, 'build/index.html');
}

/**
 * Transfer js bundle
 */

function *bundle(){
  yield send(this, 'build/bundle.js');
}

/**
 * Transfer the bundle sourcemap.
 */

function *sourcemap(){
  yield send(this, 'build/bundle.js.map');
}

/**
 * Transfer stylesheet
 */

function *stylesheet(){
  yield send(this, 'build/bundle.css');
}

/**
 * Transfer stylesheet sourcemap
 */

function *stylesheetMap(){
  yield send(this, 'build/bundle.css.map');
}

/**
 * Return a json array of all the clusters
 */

function *list(){
  var res = yield mongo.deployments.findAll();
  this.body = res;
}
