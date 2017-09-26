export default class FormValidationDirective {
    constructor() {
        this.restrict = 'A';
        this.scope = {customValidation: "=?"};
        this.replace = true;
        this.transclude = true;
        this.templateUrl = './templates/customFieldError.html';
    }
}

FormValidationDirective.$inject = [];