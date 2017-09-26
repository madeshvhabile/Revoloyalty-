import StoreController from './StoreController';
import StoreService from './StoreService';

const MODULE_NAME = 'admin.store';

angular.module(MODULE_NAME, [])
    .config($stateProvider => {
        $stateProvider
            .state('admin.store-list', {
                url: "/store-list/:merchantId",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/store-list-extend-top.html',
                        controller: 'StoreController',
                        controllerAs: 'StoreCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/store-list.html',
                        controller: 'StoreController',
                        controllerAs: 'StoreCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/store-list-extend-bottom.html',
                        controller: 'StoreController',
                        controllerAs: 'StoreCtrl'
                    }
                },
            })
            .state('admin.terminal-list', {
                url: "/terminal-list/:storeId",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/terminal-list-extend-top.html',
                        controller: 'StoreController',
                        controllerAs: 'StoreCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/terminal-list.html',
                        controller: 'StoreController',
                        controllerAs: 'StoreCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/terminal-list-extend-bottom.html',
                        controller: 'StoreController',
                        controllerAs: 'StoreCtrl'
                    }
                },
            })
            .state('admin.add-store', {
                url: "/add-store",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/add-store-extend-top.html',
                        controller: 'StoreController',
                        controllerAs: 'StoreCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/add-store.html',
                        controller: 'StoreController',
                        controllerAs: 'StoreCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/add-store-extend-bottom.html',
                        controller: 'StoreController',
                        controllerAs: 'StoreCtrl'
                    }
                }
            })
            .state('admin.edit-store', {
                url: "/edit-store/:storeId",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/edit-store-extend-top.html',
                        controller: 'StoreController',
                        controllerAs: 'StoreCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/edit-store.html',
                        controller: 'StoreController',
                        controllerAs: 'StoreCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/edit-store-extend-bottom.html',
                        controller: 'StoreController',
                        controllerAs: 'StoreCtrl'
                    }
                }
            })
            .state('admin.view-store', {
                url: "/view-store/:storeId",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/view-store-extend-top.html',
                        controller: 'StoreController',
                        controllerAs: 'StoreCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/view-store.html',
                        controller: 'StoreController',
                        controllerAs: 'StoreCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/view-store-extend-bottom.html',
                        controller: 'StoreController',
                        controllerAs: 'StoreCtrl'
                    }
                }
            })


    })
    .run(($templateCache, $http) => {
        let catchErrorTemplate = () => {
            throw `${MODULE_NAME} has missing template`
        };

        $templateCache.put('./templates/store-list-extend-top.html', '');
        $templateCache.put('./templates/store-list-extend-bottom.html', '');

        $templateCache.put('./templates/terminal-list-extend-top.html', '');
        $templateCache.put('./templates/terminal-list-extend-bottom.html', '');


        $templateCache.put('./templates/add-store-extend-top.html', '');
        $templateCache.put('./templates/add-store-extend-bottom.html', '');

        $templateCache.put('./templates/edit-store-extend-top.html', '');
        $templateCache.put('./templates/edit-store-extend-bottom.html', '');

        $templateCache.put('./templates/view-store-extend-top.html', '');
        $templateCache.put('./templates/view-store-extend-bottom.html', '');





        $http.get(`./build/${MODULE_NAME}/templates/store-list.html`)
            .then(
                response => {
                    $templateCache.put('./templates/store-list.html', response.data);
                }
            )
            .catch(catchErrorTemplate);

        $http.get(`./build/${MODULE_NAME}/templates/terminal-list.html`)
            .then(
                response => {
                    $templateCache.put('./templates/terminal-list.html', response.data);
                }
            )
            .catch(catchErrorTemplate);




        $http.get(`./build/${MODULE_NAME}/templates/add-store.html`)
            .then(
                response => {
                    $templateCache.put('./templates/add-store.html', response.data);
                }
            )
            .catch(catchErrorTemplate);






        $http.get(`./build/${MODULE_NAME}/templates/edit-store.html`)
            .then(
                response => {
                    $templateCache.put('./templates/edit-store.html', response.data);
                }
            )
            .catch(catchErrorTemplate);

            $http.get(`./build/${MODULE_NAME}/templates/view-store.html`)
                .then(
                    response => {
                        $templateCache.put('./templates/view-store.html', response.data);
                    }
                )
                .catch(catchErrorTemplate);


    })

    .controller('StoreController', StoreController)
    .service('StoreService', StoreService);

try {
    window.OpenLoyaltyConfig.modules.push(MODULE_NAME);
} catch (err) {
    throw `${MODULE_NAME} will not be registered`
}
