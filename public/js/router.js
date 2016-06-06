define(['angular', 'require', 'angular-route'], function (angular, require) {

    var app = angular.module('webapp', [
        'ngRoute'
    ]);

    app.config(['$routeProvider', '$controllerProvider',
        function($routeProvider, $controllerProvider) {

            var routeMap = {
                '/module1': {                           //路由
                    path: 'js/module1/module1.js',         //模块的代码路径
                    controller: 'module1Controller'     //控制器名称
                },
                '/module2': {                           //路由
                    path: 'module2/module2.js',         //模块的代码路径
                    controller: 'module2Controller'     //控制器名称
                }
            };
            var defaultRoute = '/module1';              //默认跳转到某个路由

            $routeProvider.otherwise({redirectTo: defaultRoute});
            for (var key in routeMap) {
                $routeProvider.when(key, {
                    template: '',
                    controller: routeMap[key].controller,
                    resolve:{
                        keyName: requireModule(routeMap[key].path, routeMap[key].controller)
                    }
                });
            }

            function requireModule(path, controller) {
                return function ($route, $q) {
                    var deferred = $q.defer();
                    require([path], function (ret) {
                        $controllerProvider.register(controller, ret.controller);
                        $route.current.template = ret.tpl;
                        deferred.resolve();
                    });
                    return deferred.promise;
                }
            }

        }]);

    return app;
});