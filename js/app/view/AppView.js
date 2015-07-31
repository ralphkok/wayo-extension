define([
    'model/AppModel',
    'model/UserModel',
    'view/LoginView',
    'view/MainView',
    'handlebars.runtime'
], function(AppModel,
            UserModel,
            LoginView,
            MainView,
            Handlebars) {

    return Backbone.View.extend({

        initialize: function (options) {

            this.autoBind();

            UserModel.on('login:success', this.onLogin);
            UserModel.on('login:fail', this.onLoginFail);

            chrome.tabs.query({active: true, currentWindow: true}, this.onGetCurrentTab);

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

        onLogin: function() {

            chrome.storage.local.set({user: UserModel.get('email'), pass: UserModel.get('pass')}, function() {
                //
            });

            this.showMain();
        },

        onLoginFail: function() {

            chrome.storage.local.clear(function() {
                //
            });

            this.showLogin();
        },

        showLogin: function() {

            if (!this.loginView) {
                this.loginView = new LoginView();
                this.loginView.render($('body'));
            }
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