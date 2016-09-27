/* jshint node: true */
var express = require('express');
var pkg = require('../package');
var config = require('../config.json');
var router = express.Router();
var clearDb = require('../db/clearDb');
var userHelper = require('../services/userHelper.js');
var statHelper = require('../services/statHelper.js');

var wrap = require('co-express');

var mongoose = require('../config/db.js').mongoose;
var sysDefault = mongoose.model('SystemDefaults', require('../models/systemDefaults'));

module.exports = function(app, passport) {
    app.get('/admin',
        function(req, res, next) {
            if (userHelper.auth(req, res, app.locals.site, true)) {
                req = userHelper.processUser(req);
                res.render('admin/admin', { site: app.locals.site, user: req.user, messages: req.flash('info') });
            }
        }
    );

    /* istanbul ignore next */
    app.get('/admin/resetdb',
        function*(req, res, next) {
            if (userHelper.auth(req, res, app.locals.site, true)) {
                /*req = userHelper.processUser(req);
                clearDb.go()
                var seedDb = require('../db/seedDb');
                res.redirect(req.session.returnTo || '/');*/
                res.status(500);
                url = req.url;
                req = userHelper.processUser(req);
                res.render('errors/error.ejs', { title: '500: Internal Server Error, Disabled due to issues.', url: url, statusCode: 500, site: app.locals.site, user: req.user, messages: req.flash('info') });
                logger.error("Error Message: code(500) %s", error);
            }
        }
    );

    app.get('/admin/system-defaults',
        function(req, res, next) {
            /* istanbul ignore next */
            if (userHelper.auth(req, res, app.locals.site, true)) {
                req = userHelper.processUser(req);
                res.render('admin/system-defaults', { site: app.locals.site, user: req.user, messages: req.flash('info') });
            }
        }
    );

    app.post('/admin/system-defaults',
        function(req, res, next) {
            /* istanbul ignore next */
            if (userHelper.auth(req, res, app.locals.site, true)) {
                req = userHelper.processUser(req);
                //update system defaults and then re-render the page

                sysDefault.findOne({}).exec(function(err, defaults) { //there should only be one set of defaults
                    if (err) throw err; //TODO: FIX

                    /* istanbul ignore next */
                    if (req.body && defaults) {
                        if (req.body.defaultTheme) {
                            defaults.DefaultTheme = req.body.defaultTheme;
                        }
                        if (req.body.title) {
                            defaults.Title = req.body.title;
                        }
                        if (req.body.defaultProfilePictureURL) {
                            defaults.DefaultProfilePictureURL = req.body.defaultProfilePictureURL;
                        }
                        if (req.body.defaultBookPictureURL) {
                            defaults.DefaultBookPictureURL = req.body.defaultBookPictureURL;
                        }
                        if (req.body.defaultBrandingText) {
                            defaults.DefaultBrandingText = req.body.defaultBrandingText;
                        }

                        app.locals.site.defaults = defaults;
                        defaults.save();

                        res.render('admin/system-defaults', { site: app.locals.site, user: req.user, messages: req.flash('info') });
                    }
                });
            }
        }
    );

    app.get('/admin/system-information',
        function(req, res, next) {
            if (userHelper.auth(req, res, app.locals.site, true)) {
                //use socket.io
                //TODO: get mongo info
                //TODO: get node server info https://nodejs.org/en/docs/guides/simple-profiling/

                /*statHelper.vmstat();*/

                var info = require('simple-node-info');
                req = userHelper.processUser(req);
                var sysinfo = info.getStat();
                res.render('admin/sys-info', { site: app.locals.site, user: req.user, sysinfo: sysinfo, socketvar: 'load averages', jquery: true, socket: true, messages: req.flash('info') });
            }
        }
    );

    /*if (config.nodeinfo) {
        var nodeinfo = require('node-info');
        app.use(nodeinfo({
            url: '/admin/system-information/node-info',
            check: function(req, res, next) {
                if (userHelper.auth(req, res, app.locals.site, true, true)) {
                    // show nodeinfo
                    return true;
                }
            }
        }));
    }*/
};
