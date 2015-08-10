define([
    'model/AppModel',
    'model/UserModel',
    'view/LoginView',
    'view/MainView',
    'util/BackgroundComms',
    'handlebars.runtime'
], function(AppModel,
            UserModel,
            LoginView,
            MainView,
            BackgroundComms,
            Handlebars) {

    return Backbone.View.extend({

        initialize: function (options) {

            this.autoBind();

            UserModel.on('login:success', this.onLoginSuccess);
            UserModel.on('login:fail', this.onLoginFail);

            chrome.tabs.query({active: true, currentWindow: true}, this.onGetCurrentTab);

            BackgroundComms.on('links', this.onNewLinks);

            chrome.storage.local.get(null, this.onStorageRead);
        },

        onGetCurrentTab: function(tabs) {

            AppModel.set('currentTab', tabs && tabs.length ? tabs[0] : null);
        },

        onStorageRead: function (items) {

            if (_.has(items, 'user') && _.has(items, 'pass')) {
                UserModel.login(items.user, items.pass);
            }
            else this.showLogin();
        },

        onNewLinks: function(links) {

            UserModel.get('links').received.add(links);
        },

        onLoginSuccess: function() {

            chrome.storage.local.set({user: UserModel.get('email'), pass: UserModel.get('pass')}, function() {
                //
            });

            this.showMain();
        },

        onLoginFail: function() {

            chrome.storage.local.clear(function() {});
            this.showLogin(true);
        },

        showLogin: function(showError) {

            if (!this.loginView) {
                this.loginView = new LoginView();
                this.loginView.render($('body'));
            }

            if (showError) this.loginView.showError();
        },

        showMain: function() {

            if (this.loginView) this.loginView.hide();
            if (!this.mainView) {
                this.mainView = new MainView();
                this.mainView.render($('body'));
            }
        }

    })
});