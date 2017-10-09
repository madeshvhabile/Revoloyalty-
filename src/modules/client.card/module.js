import CustomerCardController from './CustomerCardController';
import CustomerCardService from './CustomerCardService';

const MODULE_NAME = 'client.card';

angular.module(MODULE_NAME, [])
    .config($stateProvider => {
        $stateProvider

            .state('customer.panel.card-show', {
                url: "/card",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/customer-card-extend-top.html',
                        controller: 'CustomerCardController',
                        controllerAs: 'CustomerCardCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/customer-card.html',
                        controller: 'CustomerCardController',
                        controllerAs: 'CustomerCardCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/customer-card-extend-bottom.html',
                        controller: 'CustomerCardController',
                        controllerAs: 'CustomerCardCtrl'
                    }
                },
            })
            .state('customer.panel.card-details', {
                url: "/card/details",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/customer-card-details-extend-top.html',
                        controller: 'CustomerCardController',
                        controllerAs: 'CustomerCardCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/customer-card-details.html',
                        controller: 'CustomerCardController',
                        controllerAs: 'CustomerCardCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/customer-card-details-extend-bottom.html',
                        controller: 'CustomerCardController',
                        controllerAs: 'CustomerCardCtrl'
                    }
                },
            })
    })
    .run(($templateCache, $http) => {
        let catchErrorTemplate = () => {
            throw `${MODULE_NAME} has missing template`
        };

        $templateCache.put('./templates/customer-card-extend-top.html', '');
        $templateCache.put('./templates/customer-card-extend-bottom.html', '');

        $templateCache.put('./templates/customer-card-details-extend-top.html', '');
        $templateCache.put('./templates/customer-card-details-extend-bottom.html', '');

        $http.get(`./build/${MODULE_NAME}/templates/customer-card.html`)
            .then(
                response => {
                    $templateCache.put('./templates/customer-card.html', response.data);
                }
            )
            .catch(catchErrorTemplate);

        $http.get(`./build/${MODULE_NAME}/templates/customer-card-details.html`)
            .then(
                response => {
                    $templateCache.put('./templates/customer-card-details.html', response.data);
                }
            )
            .catch(catchErrorTemplate);
    })
    .controller('CustomerCardController', CustomerCardController)
    .service('CustomerCardService', CustomerCardService);

try {
    window.OpenLoyaltyConfig.modules.push(MODULE_NAME);
} catch(err) {
    throw `${MODULE_NAME} will not be registered`
}