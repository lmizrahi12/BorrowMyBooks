var pkg = require('../package');
var config = require('../config');

var userHelper = require('../services/userHelper');
var mongoose = require('../config/db.js').mongoose;
var user = mongoose.model('User', require('../models/user'));

module.exports = function(app, passport) {
    app.get('/login', function(req, res) {
        req = userHelper.processUser(req);
        res.render('accounts/login.ejs', { 'site': app.locals.site, user: req.user });
    });
    app.post('/login', passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: true
        }),
        function(req, res) {
            req = userHelper.processUser(req);
            res.redirect(req.session.returnTo || '/');
        });

    app.get('/signup', function(req, res) {
        req = userHelper.processUser(req);
        res.render('accounts/signup.ejs', { 'site': app.locals.site, user: req.user });
    });

    app.post('/signup', passport.authenticate('signup', {
            failureRedirect: '/signup',
            failureFlash: true
        }),
        function(req, res) {
            res.redirect(req.session.returnTo || '/');
        });

    app.get('/profile',
        function(req, res, next) {
            if (userHelper.auth(req, res, app.locals.site)) {
                req = userHelper.processUser(req);
                res.render('accounts/profile', { site: app.locals.site, user: req.user });
            }
        }
    );

    app.get('/profile/settings',
        function(req, res, next) {
            if (userHelper.auth(req, res, app.locals.site)) {
                req = userHelper.processUser(req);
                res.render('accounts/profile-settings', { site: app.locals.site, user: req.user });
            }
        }
    );

    app.post('/profile/settings',
        function(req, res, next) {
            if (userHelper.auth(req, res, app.locals.site)) {
                req = userHelper.processUser(req);
                res.render('accounts/profile', { site: app.locals.site, user: req.user });
            }
        }
    );

    app.get('/logout', function(req, res) {
        req.logout();
        req = userHelper.processUser(req, true);
        res.redirect('/');
    });

    app.post('/logout', function(req, res) {
        req.logout();
        req = userHelper.processUser(req, true);
        res.redirect('/');
    });
};
