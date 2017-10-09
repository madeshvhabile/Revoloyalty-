import SellerCardController from './SellerCardController';
import SellerCardService from './SellerCardService';

const MODULE_NAME = 'pos.card';

angular.module(MODULE_NAME, [])
    .config($stateProvider => {
        $stateProvider
            // .state('seller.panel.card-search', {
            //     url: "/search/card",
            //     views: {
            //         'extendTop@': {
            //             templateUrl: './templates/seller-find-card-extend-top.html',
            //             controller: 'SellerCardController',
            //             controllerAs: 'SellerCardCtrl'
            //         },
            //         'main@': {
            //             templateUrl: './templates/seller-find-card.html',
            //             controller: 'SellerCardController',
            //             controllerAs: 'SellerCardCtrl'
            //         },
            //         'extendBottom@': {
            //             templateUrl: './templates/seller-find-card-extend-bottom.html',
            //             controller: 'SellerCardController',
            //             controllerAs: 'SellerCardCtrl'
            //         }
            //     },
            // })
            // .state('seller.panel.card-registration', {
            //     url: "/card-registration",
            //     views: {
            //         'extendTop@': {
            //             templateUrl: './templates/seller-card-registration-extend-top.html',
            //             controller: 'SellerCardController',
            //             controllerAs: 'SellerCardCtrl'
            //         },
            //         'main@': {
            //             templateUrl: './templates/seller-card-registration.html',
            //             controller: 'SellerCardController',
            //             controllerAs: 'SellerCardCtrl'
            //         },
            //         'extendBottom@': {
            //             templateUrl: './templates/seller-card-registration-extend-bottom.html',
            //             controller: 'SellerCardController',
            //             controllerAs: 'SellerCardCtrl'
            //         }
            //     },
            // })
            // .state('seller.panel.edit-card', {
            //     url: "/card-edit/:cardId",
            //     views: {
            //         'extendTop@': {
            //             templateUrl: './templates/seller-card-edit-extend-top.html',
            //             controller: 'SellerCardController',
            //             controllerAs: 'SellerCardCtrl'
            //         },
            //         'main@': {
            //             templateUrl: './templates/seller-card-edit.html',
            //             controller: 'SellerCardController',
            //             controllerAs: 'SellerCardCtrl'
            //         },
            //         'extendBottom@': {
            //             templateUrl: './templates/seller-card-edit-extend-bottom.html',
            //             controller: 'SellerCardController',
            //             controllerAs: 'SellerCardCtrl'
            //         }
            //     },
            // })
            // .state('seller.panel.single-card', {
            //     url: "/single-card/:cardId",
            //     views: {
            //         'extendTop@': {
            //             templateUrl: './templates/seller-single-card-extend-top.html',
            //             controller: 'SellerCardController',
            //             controllerAs: 'SellerCardCtrl'
            //         },
            //         'main@': {
            //             templateUrl: './templates/seller-single-card.html',
            //             controller: 'SellerCardController',
            //             controllerAs: 'SellerCardCtrl'
            //         },
            //         'extendBottom@': {
            //             templateUrl: './templates/seller-single-card-extend-bottom.html',
            //             controller: 'SellerCardController',
            //             controllerAs: 'SellerCardCtrl'
            //         }
            //     }
            // })
            // .state('seller.panel.single-card.rewards', {
            //     url: "/rewards",
            //     views: {
            //         'extendTop@': {
            //             templateUrl: './templates/seller-card-rewards-extend-top.html',
            //             controller: 'SellerCardController',
            //             controllerAs: 'SellerCardCtrl'
            //         },
            //         'main@': {
            //             templateUrl: './templates/seller-card-rewards.html',
            //             controller: 'SellerCardController',
            //             controllerAs: 'SellerCardCtrl'
            //         },
            //         'extendBottom@': {
            //             templateUrl: './templates/seller-card-rewards-extend-bottom.html',
            //             controller: 'SellerCardController',
            //             controllerAs: 'SellerCardCtrl'
            //         }
            //     }
            // })
            // .state('seller.panel.single-card.transactions', {
            //     url: "/transactions",
            //     views: {
            //         'extendTop@': {
            //             templateUrl: './templates/seller-card-transactions-extend-top.html',
            //             controller: 'SellerCardController',
            //             controllerAs: 'SellerCardCtrl'
            //         },
            //         'main@': {
            //             templateUrl: './templates/seller-card-transactions.html',
            //             controller: 'SellerCardController',
            //             controllerAs: 'SellerCardCtrl'
            //         },
            //         'extendBottom@': {
            //             templateUrl: './templates/seller-card-transactions-extend-bottom.html',
            //             controller: 'SellerCardController',
            //             controllerAs: 'SellerCardCtrl'
            //         }
            //     }
            // })
            // .state('seller.panel.single-card.transfers', {
            //     url: "/transfers",
            //     views: {
            //         'extendTop@': {
            //             templateUrl: './templates/seller-card-transfers-extend-top.html',
            //             controller: 'SellerCardController',
            //             controllerAs: 'SellerCardCtrl'
            //         },
            //         'main@': {
            //             templateUrl: './templates/seller-card-transfers.html',
            //             controller: 'SellerCardController',
            //             controllerAs: 'SellerCardCtrl'
            //         },
            //         'extendBottom@': {
            //             templateUrl: './templates/seller-card-transfers-extend-bottom.html',
            //             controller: 'SellerCardController',
            //             controllerAs: 'SellerCardCtrl'
            //         }
            //     }
            // })
            .state('seller.cards', {
                url: "/cards",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/seller-card-extend-top.html',
                        controller: 'SellerCardController',
                        controllerAs: 'SellerCardCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/seller-cardlist.html',
                        controller: 'SellerCardController',
                        controllerAs: 'SellerCardCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/seller-card-extend-bottom.html',
                        controller: 'SellerCardController',
                        controllerAs: 'SellerCardCtrl'
                    }
                }
            })
    })
    .run(($templateCache, $http) => {
        let catchErrorTemplate = () => {
            throw `${MODULE_NAME} has missing template`
        };

        // $templateCache.put('./templates/seller-find-card-extend-top.html', '');
        // $templateCache.put('./templates/seller-find-card-extend-bottom.html', '');

        // $templateCache.put('./templates/seller-card-registration-extend-top.html', '');
        // $templateCache.put('./templates/seller-card-registration-extend-bottom.html', '');

        // $templateCache.put('./templates/seller-card-edit-extend-top.html', '');
        // $templateCache.put('./templates/seller-card-edit-extend-bottom.html', '');

        // $templateCache.put('./templates/seller-single-card-extend-top.html', '');
        // $templateCache.put('./templates/seller-single-card-extend-bottom.html', '');

        // $templateCache.put('./templates/seller-card-rewards-extend-top.html', '');
        // $templateCache.put('./templates/seller-card-rewards-extend-bottom.html', '');

        // $templateCache.put('./templates/seller-card-transactions-extend-top.html', '');
        // $templateCache.put('./templates/seller-card-transactions-extend-bottom.html', '');
        //
        // $templateCache.put('./templates/seller-card-transfers-extend-top.html', '');
        // $templateCache.put('./templates/seller-card-transfers-extend-bottom.html', '');

        $templateCache.put('./templates/seller-card-extend-top.html', '');
        $templateCache.put('./templates/seller-card-extend-bottom.html', '');

        // $http.get(`./build/${MODULE_NAME}/templates/seller-find-card.html`)
        //     .then(
        //         response => {
        //             $templateCache.put('./templates/seller-find-card.html', response.data);
        //         }
        //     )
        //     .catch(catchErrorTemplate);

        // $http.get(`./build/${MODULE_NAME}/templates/seller-card-registration.html`)
        //     .then(
        //         response => {
        //             $templateCache.put('./templates/seller-card-registration.html', response.data);
        //         }
        //     )
        //     .catch(catchErrorTemplate);

        // $http.get(`./build/${MODULE_NAME}/templates/seller-card-edit.html`)
        //     .then(
        //         response => {
        //             $templateCache.put('./templates/seller-card-edit.html', response.data);
        //         }
        //     )
        //     .catch(catchErrorTemplate);

        // $http.get(`./build/${MODULE_NAME}/templates/seller-single-card.html`)
        //     .then(
        //         response => {
        //             $templateCache.put('./templates/seller-single-card.html', response.data);
        //         }
        //     )
        //     .catch(catchErrorTemplate);

        // $http.get(`./build/${MODULE_NAME}/templates/seller-card-rewards.html`)
        //     .then(
        //         response => {
        //             $templateCache.put('./templates/seller-card-rewards.html', response.data);
        //         }
        //     )
        //     .catch(catchErrorTemplate);

        // $http.get(`./build/${MODULE_NAME}/templates/seller-card-transactions.html`)
        //     .then(
        //         response => {
        //             $templateCache.put('./templates/seller-card-transactions.html', response.data);
        //         }
        //     )
        //     .catch(catchErrorTemplate);

        // $http.get(`./build/${MODULE_NAME}/templates/seller-card-transfers.html`)
        //     .then(
        //         response => {
        //             $templateCache.put('./templates/seller-card-transfers.html', response.data);
        //         }
        //     )
        //     .catch(catchErrorTemplate);

        $http.get(`./build/${MODULE_NAME}/templatesseller-cardlist.html`)
            .then(
                response => {
                    $templateCache.put('./templates/seller-cardlist.html', response.data);
                }
            )
            .catch(catchErrorTemplate);
    })
    .controller('SellerCardController', SellerCardController)
    .service('SellerCardService', SellerCardService);

try {
    window.OpenLoyaltyConfig.modules.push(MODULE_NAME);
} catch(err) {
    throw `${MODULE_NAME} will not be registered`
}
