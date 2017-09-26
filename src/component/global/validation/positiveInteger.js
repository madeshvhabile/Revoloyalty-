export default class positiveInteger {
    constructor() {
        this.restrict = 'A';
        this. require= 'ngModel',
        this.replace = true;
        this.transclude = true;
        this.link=function (scope, element, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                console.log("postive integer",viewValue)
                var INTEGER_REGEXP = /^\d+$/;
                // if (INTEGER_REGEXP.test(viewValue)) { // it is valid
                //     ctrl.$setValidity('positiveInteger', true);
                //     return viewValue;
                // } else { // it is invalid, return undefined (no model update)
                //     ctrl.$setValidity('positiveInteger', false);
                //     return undefined;
                // }
            });
        };
        // this.templateUrl = './templates/formFieldError.html';
    }
}
positiveInteger.$inject = [];

