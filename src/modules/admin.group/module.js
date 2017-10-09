import GroupController from './GroupController';
import GroupService from './GroupService';

const MODULE_NAME = 'admin.group';

angular.module(MODULE_NAME, [])
    .config($stateProvider => {
        $stateProvider
            .state('admin.Group-list', {
                url: "/Group-list",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/group-list-extend-top.html',
                        controller: 'GroupController',
                        controllerAs: 'GroupCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/group-list.html',
                        controller: 'GroupController',
                        controllerAs: 'GroupCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/group-list-extend-bottom.html',
                        controller: 'GroupController',
                        controllerAs: 'GroupCtrl'
                    }
                },
            })
            .state('admin.Category-list', {
                url: "/Category-list",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/group-list-extend-top.html',
                        controller: 'GroupController',
                        controllerAs: 'GroupCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/Catagory-list.html',
                        controller: 'GroupController',
                        controllerAs: 'GroupCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/group-list-extend-bottom.html',
                        controller: 'GroupController',
                        controllerAs: 'GroupCtrl'
                    }
                },
            })
            .state('admin.add-group', {
                url: "/add-group",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/add-group-extend-top.html',
                        controller: 'GroupController',
                        controllerAs: 'GroupCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/add-group.html',
                        controller: 'GroupController',
                        controllerAs: 'GroupCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/add-group-extend-bottom.html',
                        controller: 'GroupController',
                        controllerAs: 'GroupCtrl'
                    }
                }
            })
            .state('admin.edit-group', {
                url: "/edit-group/:groupId",
                views: {
                    'extendTop@': {
                        templateUrl: './templates/edit-group-extend-top.html',
                        controller: 'GroupController',
                        controllerAs: 'GroupCtrl'
                    },
                    'main@': {
                        templateUrl: './templates/edit-group.html',
                        controller: 'GroupController',
                        controllerAs: 'GroupCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: './templates/edit-group-extend-bottom.html',
                        controller: 'GroupController',
                        controllerAs: 'GroupCtrl'
                    }
                }
            })


    })
    .run(($templateCache, $http) => {
        let catchErrorTemplate = () => {
            throw `${MODULE_NAME} has missing template`
        };

        $templateCache.put('./templates/group-list-extend-top.html', '');
        $templateCache.put('./templates/group-list-extend-bottom.html', '');



        $templateCache.put('./templates/add-group-extend-top.html', '');
        $templateCache.put('./templates/add-group-extend-bottom.html', '');

        $templateCache.put('./templates/edit-group-extend-top.html', '');
        $templateCache.put('./templates/edit-group-extend-bottom.html', '');





        $http.get(`./build/${MODULE_NAME}/templates/group-list.html`)
            .then(
                response => {
                    $templateCache.put('./templates/group-list.html', response.data);
                }
            )
            .catch(catchErrorTemplate);




        $http.get(`./build/${MODULE_NAME}/templates/add-group.html`)
            .then(
                response => {
                    $templateCache.put('./templates/add-group.html', response.data);
                }
            )
            .catch(catchErrorTemplate);






        $http.get(`./build/${MODULE_NAME}/templates/edit-group.html`)
            .then(
                response => {
                    $templateCache.put('./templates/edit-group.html', response.data);
                }
            )
            .catch(catchErrorTemplate);

          $http.get(`./build/${MODULE_NAME}/templates/Catagory-list.html`)
              .then(
                  response => {
                      $templateCache.put('./templates/Catagory-list.html', response.data);
                  }
              )
              .catch(catchErrorTemplate);


    })

    .controller('GroupController', GroupController)
    .service('GroupService', GroupService);

try {
    window.OpenLoyaltyConfig.modules.push(MODULE_NAME);
} catch (err) {
    throw `${MODULE_NAME} will not be registered`
}
