import CardSchemeController from './CardSchemeController';
import CardSchemeService from './CardSchemeService';
import MerchantService from '../admin.merchant/MerchantService';
import GroupService from '../admin.group/GroupService';

const MODULE_NAME = 'admin.cardScheme';

angular.module(MODULE_NAME, [])
    .config($stateProvider => {
        $stateProvider
            .state('admin.cardscheme-list', {
                url: "/cardscheme-list/",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/cardscheme-list-extend-top.html',
                        controller: 'CardSchemeController',
                        controllerAs: 'CardSchemeCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/cardscheme-list.html',
                        controller: 'CardSchemeController',
                        controllerAs: 'CardSchemeCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/cardscheme-list-extend-bottom.html',
                        controller: 'CardSchemeController',
                        controllerAs: 'CardSchemeCtrl'
                    }
                }
            })
            .state('admin.edit-cardscheme', {
                url: "/edit-cardscheme/:cardschemeId",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/edit-cardscheme-extend-top.html',
                        controller: 'CardSchemeController',
                        controllerAs: 'CardSchemeCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/edit-cardscheme.html',
                        controller: 'CardSchemeController',
                        controllerAs: 'CardSchemeCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/edit-cardscheme-extend-bottom.html',
                        controller: 'CardSchemeController',
                        controllerAs: 'CardSchemeCtrl'
                    }
                }
            })
            .state('admin.add-cardscheme', {
                url: "/add-cardscheme",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/add-cardscheme-extend-top.html',
                        controller: 'CardSchemeController',
                        controllerAs: 'CardSchemeCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/add-cardscheme.html',
                        controller: 'CardSchemeController',
                        controllerAs: 'CardSchemeCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/add-cardscheme-extend-bottom.html',
                        controller: 'CardSchemeController',
                        controllerAs: 'CardSchemeCtrl'
                    }
                }
            })
            .state('admin.view-cardscheme', {
                url: "/view-cardscheme/:cardschemeId",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/cardscheme-view-extend-top.html',
                        controller: 'CardSchemeController',
                        controllerAs: 'CardSchemeCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/cardscheme-view.html',
                        controller: 'CardSchemeController',
                        controllerAs: 'CardSchemeCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/cardscheme-view-extend-bottom.html',
                        controller: 'CardSchemeController',
                        controllerAs: 'CardSchemeCtrl'
                    }
                }
            })
    })
    .run(($templateCache, $http) => {
        let catchErrorTemplate = () => {
            throw `${MODULE_NAME} has missing template`
        };

        $templateCache.put('./templates/edit-cardscheme-extend-top.html', '');
        $templateCache.put('./templates/edit-cardscheme-extend-bottom.html', '');

        $templateCache.put('./templates/add-cardscheme-extend-top.html', '');
        $templateCache.put('./templates/add-cardscheme-extend-bottom.html', '');

        $templateCache.put('./templates/cardscheme-list-extend-top.html', '');
        $templateCache.put('./templates/cardscheme-list-extend-bottom.html', '');

        $templateCache.put('./templates/cardscheme-view-extend-top.html', '');
        $templateCache.put('./templates/cardscheme-view-extend-bottom.html', '');

        $http.get(`./build/${MODULE_NAME}/templates/cardscheme-list.html`)
            .then(
                response => {
                    $templateCache.put('./templates/cardscheme-list.html', response.data);
                }
            )
            .catch(catchErrorTemplate);

        $http.get(`./build/${MODULE_NAME}/templates/edit-cardscheme.html`)
            .then(
                response => {
                    $templateCache.put('./templates/edit-cardscheme.html', response.data);
                }
            )
            .catch(catchErrorTemplate);

        $http.get(`./build/${MODULE_NAME}/templates/add-cardscheme.html`)
            .then(
                response => {
                    $templateCache.put('./templates/add-cardscheme.html', response.data);
                }
            )
            .catch(catchErrorTemplate);

        $http.get(`./build/${MODULE_NAME}/templates/cardscheme-view.html`)
              .then(
                  response => {
                      $templateCache.put('./templates/cardscheme-view.html', response.data);
                  }
              )
              .catch(catchErrorTemplate);
    })
    .controller('CardSchemeController', CardSchemeController)
    .service('CardSchemeService', CardSchemeService)
    .service('MerchantService',MerchantService)
    .service('GroupService',GroupService);

try {
    window.OpenLoyaltyConfig.modules.push(MODULE_NAME);
} catch(err) {
    throw `${MODULE_NAME} will not be registered`
}
