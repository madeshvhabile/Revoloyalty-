import OrderController from './OrderController';
import OrderService from './OrderService';
import CardSchemeService from '../admin.cardScheme/CardSchemeService';

const MODULE_NAME = 'admin.order';

angular.module(MODULE_NAME, [])
    .config($stateProvider => {
        $stateProvider
            .state('admin.order-list', {
                url: "/order-list/",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/order-list-extend-top.html',
                        controller: 'OrderController',
                        controllerAs: 'OrderCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/order-list.html',
                        controller: 'OrderController',
                        controllerAs: 'OrderCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/order-list-extend-bottom.html',
                        controller: 'OrderController',
                        controllerAs: 'OrderCtrl'
                    }
                }
            })
            .state('admin.edit-order', {
                url: "/edit-order/:orderId",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/edit-order-extend-top.html',
                        controller: 'OrderController',
                        controllerAs: 'OrderCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/edit-order.html',
                        controller: 'OrderController',
                        controllerAs: 'OrderCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/edit-order-extend-bottom.html',
                        controller: 'OrderController',
                        controllerAs: 'OrderCtrl'
                    }
                }
            })
            .state('admin.add-order', {
                url: "/add-order",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/add-order-extend-top.html',
                        controller: 'OrderController',
                        controllerAs: 'OrderCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/add-order.html',
                        controller: 'OrderController',
                        controllerAs: 'OrderCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/add-order-extend-bottom.html',
                        controller: 'OrderController',
                        controllerAs: 'OrderCtrl'
                    }
                }
            })
            .state('admin.view-order', {
                url: "/view-order/:OrderId",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/order-view-extend-top.html',
                        controller: 'OrderController',
                        controllerAs: 'OrderCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/order-view.html',
                        controller: 'OrderController',
                        controllerAs: 'OrderCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/order-view-extend-bottom.html',
                        controller: 'OrderController',
                        controllerAs: 'OrderCtrl'
                    }
                }
            })
    })
    .run(($templateCache, $http) => {
        let catchErrorTemplate = () => {
            throw `${MODULE_NAME} has missing template`
        };

        $templateCache.put('./templates/edit-order-extend-top.html', '');
        $templateCache.put('./templates/edit-order-extend-bottom.html', '');

        $templateCache.put('./templates/add-order-extend-top.html', '');
        $templateCache.put('./templates/add-order-extend-bottom.html', '');

        $templateCache.put('./templates/order-list-extend-top.html', '');
        $templateCache.put('./templates/order-list-extend-bottom.html', '');

        $templateCache.put('./templates/order-view-extend-top.html', '');
        $templateCache.put('./templates/order-view-extend-bottom.html', '');

        $http.get(`./build/${MODULE_NAME}/templates/order-list.html`)
            .then(
                response => {
                    $templateCache.put('./templates/order-list.html', response.data);
                }
            )
            .catch(catchErrorTemplate);

        $http.get(`./build/${MODULE_NAME}/templates/edit-order.html`)
            .then(
                response => {
                    $templateCache.put('./templates/edit-order.html', response.data);
                }
            )
            .catch(catchErrorTemplate);

        $http.get(`./build/${MODULE_NAME}/templates/add-order.html`)
            .then(
                response => {
                    $templateCache.put('./templates/add-order.html', response.data);
                }
            )
            .catch(catchErrorTemplate);

        $http.get(`./build/${MODULE_NAME}/templates/order-view.html`)
            .then(
                response => {
                    $templateCache.put('./templates/order-view.html', response.data);
                }
            )
            .catch(catchErrorTemplate);
    })
    .controller('OrderController', OrderController)
    .service('OrderService', OrderService)
    .service('CardSchemeService', CardSchemeService);

try {
    window.OpenLoyaltyConfig.modules.push(MODULE_NAME);
} catch(err) {
    throw `${MODULE_NAME} will not be registered`
}
