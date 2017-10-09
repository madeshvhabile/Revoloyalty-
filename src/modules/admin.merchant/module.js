import MerchantController from './MerchantController';
import MerchantService from './MerchantService';

const MODULE_NAME = 'admin.merchant';

angular.module(MODULE_NAME, [])
    .config($stateProvider => {
        $stateProvider
            .state('admin.merchant-list', {
                url: "/merchant-list",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/merchant-list-extend-top.html',
                        controller: 'MerchantController',
                        controllerAs: 'MerchantCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/merchant-list.html',
                        controller: 'MerchantController',
                        controllerAs: 'MerchantCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/merchant-list-extend-bottom.html',
                        controller: 'MerchantController',
                        controllerAs: 'MerchantCtrl'
                    }
                },
            })
            .state('admin.add-merchant', {
                url: "/add-merchant",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/add-merchant-extend-top.html',
                        controller: 'MerchantController',
                        controllerAs: 'MerchantCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/add-merchant.html',
                        controller: 'MerchantController',
                        controllerAs: 'MerchantCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/add-merchant-extend-bottom.html',
                        controller: 'MerchantController',
                        controllerAs: 'MerchantCtrl'
                    }
                }
            })
            .state('admin.edit-merchant', {
                url: "/edit-merchant/:merchantId",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/edit-merchant-extend-top.html',
                        controller: 'MerchantController',
                        controllerAs: 'MerchantCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/edit-merchant.html',
                        controller: 'MerchantController',
                        controllerAs: 'MerchantCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/edit-merchant-extend-bottom.html',
                        controller: 'MerchantController',
                        controllerAs: 'MerchantCtrl'
                    }
                }
            })
            .state('admin.merchant-login-credential', {
                url: "/merchant-login-credential",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/merchant-login-credential-top.html',
                        controller: 'MerchantController',
                        controllerAs: 'MerchantCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/merchant-credential.html',
                        controller: 'MerchantController',
                        controllerAs: 'MerchantCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/merchant-login-credential-bottom.html',
                        controller: 'MerchantController',
                        controllerAs: 'MerchantCtrl'
                    }
                }
            })

            .state('admin.view-merchant', {
                url: "/view-merchant/:merchantId",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/edit-merchant-extend-top.html',
                        controller: 'MerchantController',
                        controllerAs: 'MerchantCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/merchant-view.html',
                        controller: 'MerchantController',
                        controllerAs: 'MerchantCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/edit-merchant-extend-bottom.html',
                        controller: 'MerchantController',
                        controllerAs: 'MerchantCtrl'
                    }
                }
            })


    })
    .run(($templateCache, $http) => {
        let catchErrorTemplate = () => {
            throw `${MODULE_NAME} has missing template`
        };

        $templateCache.put('./templates/merchant-list-extend-top.html', '');
        $templateCache.put('./templates/merchant-list-extend-bottom.html', '');



        $templateCache.put('./templates/add-merchant-extend-top.html', '');
        $templateCache.put('./templates/add-merchant-extend-bottom.html', '');

        $templateCache.put('./templates/edit-merchant-extend-top.html', '');
        $templateCache.put('./templates/edit-merchant-extend-bottom.html', '');

        $templateCache.put('./templates/merchant-login-credential-top.html', '');
        $templateCache.put('./templates/merchant-login-credential-bottom.html', '');




        $http.get(`./build/${MODULE_NAME}/templates/merchant-view.html`)
            .then(
                response => {
                    $templateCache.put('./templates/merchant-view.html', response.data);
                }
            )
            .catch(catchErrorTemplate);

            $http.get(`./build/${MODULE_NAME}/templates/merchant-credential.html`)
            .then(
                response => {
                    $templateCache.put('./templates/merchant-credential.html', response.data);
                }
            )
            .catch(catchErrorTemplate);


            $http.get(`./build/${MODULE_NAME}/templates/merchant-list.html`)
            .then(
                response => {
                    $templateCache.put('./templates/merchant-list.html', response.data);
                }
            )
            .catch(catchErrorTemplate);




        $http.get(`./build/${MODULE_NAME}/templates/add-merchant.html`)
            .then(
                response => {
                    $templateCache.put('./templates/add-merchant.html', response.data);
                }
            )
            .catch(catchErrorTemplate);






        $http.get(`./build/${MODULE_NAME}/templates/edit-merchant.html`)
            .then(
                response => {
                    $templateCache.put('./templates/edit-merchant.html', response.data);
                }
            )
            .catch(catchErrorTemplate);


    })

    .controller('MerchantController', MerchantController)
    .service('MerchantService', MerchantService);

try {
    window.OpenLoyaltyConfig.modules.push(MODULE_NAME);
} catch (err) {
    throw `${MODULE_NAME} will not be registered`
}
