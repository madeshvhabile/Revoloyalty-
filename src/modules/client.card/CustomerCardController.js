export default class CustomerCardController {
    constructor($scope, $state, AuthService, CustomerCardService, Flash, NgTableParams, $q, ParamsMap, $stateParams, EditableMap, $filter, Validation, DataService) {
        if (!AuthService.isGranted('ROLE_PARTICIPANT')) {
            $state.go('customer-login')
        }
        this.id = AuthService.getLoggedUserId();
        this.$scope = $scope;
        this.CustomerCardService = CustomerCardService;
        this.$state = $state;
        this.Flash = Flash;
        this.NgTableParams = NgTableParams;
        this.ParamsMap = ParamsMap;
        this.EditableMap = EditableMap;
        this.$q = $q;
        this.$filter = $filter;
        this.Validation = Validation;
        this.$scope.password = {};
        this.giftCardList=[];
        this.loyaltyCardList=[];
        this.country = DataService.getCountries();
        this.$scope.addressValidation = {
            street: '@assert:not_blank',
            address1: '@assert:not_blank',
            postal: '@assert:not_blank',
            country: '@assert:not_blank',
            city: '@assert:not_blank',
        };
        this.$scope.companyValidation = {
            nip: '@assert:not_blank',
            name: '@assert:not_blank'
        };
        this.$scope.frontValidate = {
            firstName: '@assert:not_blank',
            lastName: '@assert:not_blank',
            agreement1: '@assert:not_blank',
            email: '@assert:not_blank',
            phone: '@assert:not_blank'
        };
        this.$scope.passwordValidate = {
            currentPassword: '@assert:not_blank',
            plainPassword: '@assert:not_blank|equal_with:plainPassword2',
            plainPassword2: '@assert:not_blank|equal_with:plainPassword'
        };
        this.countryConfig = {
            valueField: 'code',
            labelField: 'name',
            create: false,
            sortField: 'name',
            maxItems: 1,
        };
        this.$scope.loaderVisible = true;
    }

    changePassword(password) {
        let self = this;
        let validateFields = angular.copy(self.$scope.passwordValidate);
        let frontValidation = self.Validation.frontValidation(password, validateFields);

        if (_.isEmpty(frontValidation)) {
            self.CustomerCardService.changePassword(password)
                .then(
                    res => {
                        let message = self.$filter('translate')('xhr.post_password_change.success');
                        self.Flash.create('success', message);
                    },
                    res => {
                        self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                        let message = self.$filter('translate')('xhr.post_password_change.error');
                        self.Flash.create('danger', message);
                    }
                )
        } else {
            let message = self.$filter('translate')('xhr.post_password_change.error');
            self.Flash.create('danger', message);
            self.$scope.validate = frontValidation;
        }
    }

    getData() {
        let self = this;
        self.CustomerCardService.getCustomer(self.id)
            .then(
                res => {
                    self.$scope.loaderVisible = false;
                    self.$scope.customer = res;
                    self.$scope.editableFields = self.EditableMap.humanizeCustomer(res);
                    self.$scope.showAddress = !_.isEmpty(_.omitBy(self.$scope.editableFields.address, _.isEmpty));
                    self.$scope.showCompany = !_.isEmpty(_.omitBy(self.$scope.editableFields.company, _.isEmpty));
                },
                () => {
                    let message = self.$filter('translate')('xhr.get_customer.error');
                    self.Flash.create('danger', message);
                }
            );
    }

    editCustomer(editedCustomer) {
        let self = this;
        let validateFields = angular.copy(self.$scope.frontValidate);

        if (self.$scope.showAddress) {
            validateFields.address = angular.copy(self.$scope.addressValidation);
        } else {
            delete editedCustomer.address;
        }
        if (self.$scope.showCompany) {
            validateFields.company = angular.copy(self.$scope.companyValidation);
        } else {
            delete editedCustomer.company;
        }

        let frontValidation = self.Validation.frontValidation(editedCustomer, validateFields);

        if (_.isEmpty(frontValidation)) {
            self.CustomerCardService.putCustomer(editedCustomer)
                .then(
                    res => {
                        let message = self.$filter('translate')('xhr.put_customer.success');
                        self.Flash.create('success', message);
                        self.$state.go('customer.panel.card-show');
                    },
                    res => {
                        self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                        let message = self.$filter('translate')('xhr.put_customer.error');
                        self.Flash.create('danger', message);
                    }
                )
        } else {
            let message = self.$filter('translate')('xhr.put_customer.error');
            self.Flash.create('danger', message);
            self.$scope.validate = frontValidation;
        }
    }
}

CustomerCardController.$inject = ['$scope', '$state', 'AuthService', 'CustomerCardService', 'Flash', 'NgTableParams', '$q', 'ParamsMap', '$stateParams', 'EditableMap', '$filter', 'Validation', 'DataService'];