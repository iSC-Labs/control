control.factory('AuthService', function ($http, Session, USER_ROLES, localStorageService, ENV, AuthChecker, $rootScope, $interval, AUTH_EVENTS) {
    var AuthService = {};

    AuthService.logIn = function (credentials) {
        return $http
            .post('https://' + ENV.apiEndpoint + '/authenticate', credentials)
            .then(function (res) {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            Session.create(res.data.token);
        }, function onFail () {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };

    AuthService.logOut = function () {
        return $http
            .post('https://' + ENV.apiEndpoint + '/control/log-out')
            .then(function () {
            Session.destroy();
        });
    };

    AuthService.keepAlivePromise = null;

    AuthService.keepAlive = function () {
        $http.post('https://' + ENV.apiEndpoint + '/control/keep-alive')
            .then(function (res) {
            Session.update(res.data.token);
        }, function (response) {
            $rootScope.$broadcast(AUTH_EVENTS.sessionTimeout, response);
            $interval.cancel(AuthService.keepAlivePromise);
            AuthService.keepAlivePromise = null;
        });
    };

    $rootScope.$on('sessionCreated', function onSessionCreated () {
        if (AuthService.keepAlivePromise) {
            return;
        }
        AuthService.keepAlivePromise = $interval(AuthService.keepAlive, 1000 * 60 * 15);
    });
    $rootScope.$on('sessionDestroyed', function onSessionDestroyed () {
        if (!AuthService.keepAlivePromise) {
            return;
        }
        $interval.cancel(AuthService.keepAlivePromise);
        AuthService.keepAlivePromise = null;
    });

    return AuthService;
});
