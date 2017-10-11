export default class CustomerController {
    constructor($scope, $state, $stateParams, AuthService, CustomerService, Flash, EditableMap, NgTableParams, ParamsMap, $q, LevelService, Validation, $filter, DataService, PosService, TransferService, MerchantService) {
        if (!AuthService.isGranted('ROLE_ADMIN')) {
            $state.go('admin-login')
        }
        this.$scope = $scope;
        this.TransferService = TransferService;
        this.$scope.dateNow = new Date();
        this.$scope.newCustomer = {};
        this.$scope.customarray = {};
        this.$scope.newLevel = {};
        this.$scope.newPos = {};
        this.$scope.showCompany = false;
        this.$scope.showAddress = false;
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
            merchantid: '@assert:not_blank'
        };
        this.$scope.excelarryvalidate = {
            merchantid: '@assert:not_blank',
            couponsCsv: '@assert:not_blank'
        }
        this.levels = null;
        this.posList = null;
        this.$state = $state;
        this.AuthService = AuthService;
        this.CustomerService = CustomerService;
        this.Flash = Flash;
        this.EditableMap = EditableMap;
        this.customerId = $stateParams.customerId || null;
        this.NgTableParams = NgTableParams;
        this.ParamsMap = ParamsMap;
        this.$q = $q;
        this.LevelService = LevelService;
        this.Validation = Validation;
        this.$filter = $filter;
        this.PosService = PosService;
        this.MerchantService = MerchantService;
        this.country = DataService.getCountries();
        this.config = DataService.getConfig();
        this.countryConfig = {
            valueField: 'code',
            labelField: 'name',
            create: false,
            sortField: 'name',
            maxItems: 1,
        };
        this.levelsConfig = {
            valueField: 'id',
            labelField: 'name',
            create: false,
            sortField: 'name',
            maxItems: 1,
        };
        this.storesConfig = {
            valueField: 'storeId',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField: 'name',
            maxItems: 1,
        };
        this.posConfig = {
            valueField: 'posId',
            labelField: 'name',
            create: false,
            sortField: 'name',
            maxItems: 1,
        };
        this.merchantConfig = {
            valueField: 'merchantId',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField: 'name',
            maxItems: 1
        };
        this.$scope.excelfile = 'text.xlx';
        if (this.customerId && this.$state.current.name === 'admin.single-customer') {
            let self = this;

            $scope.$watch('customer', function () {
                if ($scope.customer && $scope.customer.levelId) {
                    self.getAssignedLevel($scope.customer.levelId);
                    self.getAvailableLevels();
                } else {
                    self.getAvailableLevels();
                }
                if ($scope.customer && $scope.customer.posId) {
                    self.getAssignedPos($scope.customer.posId);
                    self.getAvailablePos();
                } else {
                    self.getAvailablePos();
                }
            }, true)
        }

        this.loaderStates = {
            customerTabs: true,
            customerDetails: true,
            customerList: true,
            customerReferredList: true,
            customerPOS: true,
            customerLevel: true,
            campaignList: true,
            rewardList: true,
            transactionList: true,
            transferList: true,
            coverLoader: true,
            cancelTransfer: false,
            assignLevel: false,
            assignPos: false,
            deactivateCustomer: false
        }

        this.referredStatusSelectOptions = [{
            value: '',
            label: $filter('translate')('customer.referred.statuses.all')
        },
            {
                value: 'invited',
                label: $filter('translate')('customer.referred.statuses.invited')
            },
            {
                value: 'registered',
                label: $filter('translate')('customer.referred.statuses.registered')
            },
            {
                value: 'made_purchase',
                label: $filter('translate')('customer.referred.statuses.made_purchase')
            }
        ];

        this.referredStatusSelectConfig = {
            valueField: 'value',
            labelField: 'label',
            create: false,
            sortField: 'label',
            searchField: 'label',
            maxItems: 1,
            allowEmptyOption: true
        };
        this.reserr=false
    }

    getData() {
        let self = this;

        self.tableParams = new self.NgTableParams({
            count: self.config.perPage,
            sorting: {
                createdAt: 'desc'
            }
        }, {
            getData: function (params) {
                let dfd = self.$q.defer();
                self.loaderStates.customerList = true;
                self.CustomerService.getCustomers(self.ParamsMap.params(params.url()))
                    .then(
                        res => {
                            self.loaderStates.customerList = false;
                            self.loaderStates.coverLoader = false;
                            self.$scope.customers = res;
                            params.total(res.total);
                            dfd.resolve(res)
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_customers.error');
                            self.Flash.create('danger', message);
                            self.loaderStates.customerList = false;
                            self.loaderStates.coverLoader = false;
                            dfd.reject();
                        }
                    );

                return dfd.promise;
            }
        });
    }

    readExcel(fileselect) {
        let self = this;
        let excelarrayvalidate = angular.copy(self.$scope.excelarryvalidate);
        let frontValidation = self.Validation.frontValidation(fileselect, excelarrayvalidate);
        if (_.isEmpty(frontValidation)) {
            self.$scope.excelvalidate={};
            let temobj = angular.copy(fileselect.couponsCsv)
            self.checkedjson = []
            self.$scope.ExcelError = false
            self.$scope.exceluploadbtn = false;
            for (var i = 0; i < temobj.length; i++) {
                self.checkMandatory(temobj[i])
            }
            self.excelTableParams = new self.NgTableParams({
                count: self.config.perPage,
                sorting: {
                    createdAt: 'desc'
                }
            }, {
                dataset: self.checkedjson
            });
            if(self.checkedjson.length){
                self.excelTableParams.reload().then(function (data) {
                    if (data.length === 0 && self.tableParams.total() > 0) {
                        self.excelTableParams.page(self.excelTableParams.page() - 1);
                        self.excelTableParams.reload();
                    }
                });
            }

            if (!self.$scope.ExcelError) {
                self.$scope.exceluploadbtn = true
            }

        } else {
            let message = self.$filter('translate')('xhr.post_customer.error');
            self.Flash.create('danger', message);
            self.$scope.excelvalidate = frontValidation;
        }


    }

    checkMandatory(customer) {
        let self = this;
        self.reserr=false;
        let error = [];
        if (!customer.hasOwnProperty('customeraddress')) {
            customer.customeraddress = false
        }
        if (!customer.hasOwnProperty('customercompany')) {
            customer.customercompany = false
        }
        if (customer.hasOwnProperty('firstName')) {

        } else {
            error.push('FirstName should not be empty')
        }
        if (customer.hasOwnProperty('lastName')) {

        } else {
            error.push('FirstName should not be empty')
        }
        if (customer.hasOwnProperty('email')) {

        } else {
            error.push('email should not be empty')
        }
        if (customer.hasOwnProperty('phone')) {

        } else {
            error.push('Phonenumber  should not be empty')
        }
        if (customer.customeraddress == 'true') {
            customer.address = {}
            if (customer.hasOwnProperty('street')) {
                customer.address['street'] = customer.street;
                delete customer.street
            } else {
                error.push('streetname  should not be empty')
            }
            if (customer.hasOwnProperty('address1')) {
                customer.address['address1'] = customer.address1;
                delete customer.address1
            } else {
                error.push('Address1 should not be empty')
            }
            if (customer.hasOwnProperty('postal')) {
                customer.address['postal'] = customer.postal;
                delete customer.postal
            } else {
                error.push('Postalcode should not be empty ')
            }
            // if (customer.hasOwnProperty('province')) {
            //     customer.address['province'] = customer.province;
            //     delete customer.province
            // } else {
            //     error.push('Postalcode should not be empty ')
            // }
            if (customer.hasOwnProperty('city')) {
                customer.address['city'] = customer.city;
                delete customer.city
            } else {
                error.push('city should not be empty')
            }
            if (customer.hasOwnProperty('country')) {
                customer.address['country'] = customer.country;
                delete customer.country
            } else {
                error.push('country should not be empty')
            }
            delete customer.customeraddress
        }else{
            delete customer.customeraddress;
            delete customer.street;
            delete customer.province;
            delete customer.address1;
            delete customer.address2;
            delete customer.city;
            delete customer.country;
            delete customer.postal;
        }

        if (customer.customercompany == 'true') {
            customer.company = {}
            if (customer.hasOwnProperty('companyname')) {
                customer.company['name'] = customer.companyname;
                delete customer.companyname
            } else {
                error.push('company name should not be empty')
            }
            if (customer.hasOwnProperty('companynip')) {
                customer.company['nip'] = customer.companynip;
                delete customer.companynip
            } else {
                error.push('company Nip number should not be empty')
            }
            delete customer.customercompany
        }else{
            delete customer.customercompany;
            delete customer.companyname;
            delete customer.companynip
        }

        if (error.length && !self.$scope.ExcelError) {
            self.$scope.ExcelError = true
        }
        customer.merchantid = self.$scope.customarray.merchantid;
        customer.storeid = self.$scope.customarray.storeid;
        customer.agreement1=true;
        if (error.length) {
            customer.errorsInForm = error;
        }
        self.checkedjson.push(customer)
    }

    uploadexcelData(){
        let self=this;
        self.CustomerService.postCustomers(self.checkedjson)
        .then(
            res=>{
                let message = 'Customer List add Successfully'
                self.Flash.create('success', message);
            },
            error=>{
                if(error.status == 400){
                    self.reserr=true;
                    let errorData=error.data;
                    self.excelTableParams = new self.NgTableParams({
                        count: self.config.perPage,
                        sorting: {
                            createdAt: 'desc'
                        }
                    }, {
                        dataset: errorData
                    });
                    if(errorData.length){
                        self.excelTableParams.reload().then(function (data) {
                            if (data.length === 0 && self.tableParams.total() > 0) {
                                self.excelTableParams.page(self.excelTableParams.page() - 1);
                                self.excelTableParams.reload();
                            }
                        });
                    }


                }
                let message = self.$filter('translate')('xhr.get_referred_customers.error');
                self.Flash.create('danger', message);
            }
        )

    }

    getReferredData() {
        let self = this;

        self.referredTableParams = new self.NgTableParams({
            count: self.config.perPage,
            sorting: {
                createdAt: 'desc'
            }
        }, {
            getData: function (params) {
                let dfd = self.$q.defer();
                self.loaderStates.customerReferredList = true;
                self.CustomerService.getReferredCustomers(self.ParamsMap.params(params.url()))
                    .then(
                        res => {
                            self.referredTotal = res.total;
                            self.referredCompleted = res.additional ? res.additional.totalCompleted: '';
                            self.referredRegistered = res.additional ? res.additional.totalRegistered: '';
                            self.loaderStates.customerReferredList = false;
                            self.loaderStates.coverLoader = false;
                            self.$scope.referredCustomers = res;
                            params.total(res.total);
                            dfd.resolve(res)
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_referred_customers.error');
                            self.Flash.create('danger', message);
                            self.loaderStates.customerReferredList = false;
                            self.loaderStates.coverLoader = false;
                            dfd.reject();
                        }
                    );

                return dfd.promise;
            }
        });
    }

    cancelTransfer(transferId) {
        let self = this;
        this.loaderStates.cancelTransfer = true;

        self.TransferService.postCancelTransfer(transferId)
            .then(
                res => {
                    let message = self.$filter('translate')('xhr.post_cancel_transfer.success');
                    self.Flash.create('success', message);
                    self.tableParams.reload();
                    this.loaderStates.cancelTransfer = false;
                },
                () => {
                    let message = self.$filter('translate')('xhr.post_cancel_transfer.error');
                    self.Flash.create('danger', message);
                    this.loaderStates.cancelTransfer = false;
                }
            )
    }

    getTransactionsData() {
        let self = this;

        self.transactionsTableParams = new self.NgTableParams({
            count: self.config.perPage
        }, {
            getData: function (params) {
                let dfd = self.$q.defer();

                self.loaderStates.transactionList = true;
                self.CustomerService.getCustomerTransactions(self.ParamsMap.params(params.url()), self.customerId)
                    .then(
                        res => {
                            self.$scope.customerTransactions = res;
                            params.total(res.total);
                            self.loaderStates.transactionList = false;
                            self.loaderStates.coverLoader = false;
                            dfd.resolve(res);
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_transations.error');
                            self.Flash.create('danger', message);
                            self.loaderStates.transactionList = false;
                            self.loaderStates.coverLoader = false;
                            dfd.reject();
                        }
                    );

                return dfd.promise;
            }
        });
    }

    getTransfersData() {
        let self = this;

        self.transfersTableParams = new self.NgTableParams({
            count: self.config.perPage
        }, {
            getData: function (params) {
                let dfd = self.$q.defer();

                self.loaderStates.transferList = true;
                self.CustomerService.getCustomerTransfers(self.ParamsMap.params(params.url()), self.customerId)
                    .then(
                        res => {
                            self.$scope.customerTransfers = res;
                            params.total(res.total);
                            self.loaderStates.transferList = false;
                            self.loaderStates.coverLoader = false;
                            dfd.resolve(res);
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_transfers.error');
                            self.Flash.create('danger', message);
                            self.loaderStates.transferList = false;
                            self.loaderStates.coverLoader = false;
                            dfd.reject();
                        }
                    );

                return dfd.promise;
            }
        });
    }

    getCampaignsData() {
        let self = this;

        self.availableCampaignsTableParams = new self.NgTableParams({
            count: self.config.perPage
        }, {
            getData: function (params) {
                let dfd = self.$q.defer();

                self.loaderStates.campaignList = true;
                self.CustomerService.getCustomerAvailableCampaigns(self.ParamsMap.params(params.url()), self.customerId)
                    .then(
                        res => {
                            self.$scope.availableCampaigns = res;
                            params.total(res.total);
                            self.loaderStates.campaignList = false;
                            self.loaderStates.coverLoader = false;
                            dfd.resolve(res);
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_available_campaigns.error');
                            self.Flash.create('danger', message);
                            self.loaderStates.campaignList = false;
                            self.loaderStates.coverLoader = false;
                            dfd.reject();
                        }
                    );

                return dfd.promise;
            }
        });
    }

    getRewardsData() {
        let self = this;

        self.boughtCampaignsTableParams = new self.NgTableParams({
            count: self.config.perPage
        }, {
            getData: function (params) {
                let dfd = self.$q.defer();

                self.loaderStates.rewardList = true;
                self.CustomerService.getCustomerBoughtCampaigns(self.ParamsMap.params(params.url()), self.customerId)
                    .then(
                        res => {
                            self.$scope.boughtCampaigns = res;
                            params.total(res.total);
                            self.loaderStates.rewardList = false;
                            self.loaderStates.coverLoader = false;
                            dfd.resolve(res);
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_bought_campaigns.error');
                            self.Flash.create('danger', message);
                            self.loaderStates.rewardList = false;
                            self.loaderStates.coverLoader = false;
                            dfd.reject();
                        }
                    );

                return dfd.promise;
            }
        });
    }

    getCustomerData() {
        let self = this;

        self.loaderStates.customerDetails = true;

        if (self.customerId) {
            self.$q.all([
                self.CustomerService.getCustomer(self.customerId)
                    .then(
                        res => {
                            self.$scope.customer = res;
                            self.$scope.editableFields = self.EditableMap.humanizeCustomer(res);
                            self.$scope.showAddress = !(_.isEmpty(self.$scope.editableFields.address));
                            self.$scope.showCompany = !(_.isEmpty(self.$scope.editableFields.company));
                            self.loaderStates.customerDetails = false;
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_customer.error');
                            self.Flash.create('danger', message);
                            self.loaderStates.customerDetails = false;
                        }
                    ),

                self.CustomerService.getCustomer(self.customerId)
                    .then(
                        res => {
                            self.$scope.customer = res;
                            self.$scope.editableFields = self.EditableMap.humanizeCustomer(res);
                            self.$scope.showAddress = !(_.isEmpty(self.$scope.editableFields.address));
                            self.$scope.showCompany = !(_.isEmpty(self.$scope.editableFields.company));
                            self.loaderStates.customerDetails = false;
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_customer.error');
                            self.Flash.create('danger', message);
                            self.loaderStates.customerDetails = false;
                        }
                    ),
                self.CustomerService.getCustomerStatus(self.customerId)
                    .then(
                        res => {
                            self.$scope.status = res;
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_customer.error');
                            self.Flash.create('danger', message);
                        }
                    ),
                self.getTransactionsData(),
                self.getTransfersData(),
                self.getCampaignsData(),
                self.getRewardsData(),
            ])
                .then(
                    () => {
                        this.loaderStates.coverLoader = false;
                    }
                );
        } else {
            self.$state.go('admin.customers-list');
            let message = self.$filter('translate')('xhr.get_customer.no_id');
            self.Flash.create('warning', message);
        }
    }

    addCustomer(newCustomer) {
        let self = this;
        let validateFields = angular.copy(self.$scope.frontValidate);

        if (self.$scope.showAddress) {
            validateFields.address = angular.copy(self.$scope.addressValidation);
        } else {
            delete self.$scope.newCustomer.address;
        }
        if (self.$scope.showCompany) {
            validateFields.company = angular.copy(self.$scope.companyValidation);
        } else {
            delete self.$scope.newCustomer.company;
        }

        let frontValidation = self.Validation.frontValidation(newCustomer, validateFields);

        if (_.isEmpty(frontValidation)) {
            self.CustomerService.postCustomer(newCustomer)
                .then(
                    res => {
                        self.$state.go('admin.customers-list');
                        let message = self.$filter('translate')('xhr.post_customer.success');
                        self.Flash.create('success', message);

                    },
                    res => {
                        self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                        let message = self.$filter('translate')('xhr.post_customer.error');
                        self.Flash.create('danger', message);
                    }
                )
        } else {
            let message = self.$filter('translate')('xhr.post_customer.error');
            self.Flash.create('danger', message);
            self.$scope.validate = frontValidation;
        }
    }

    editCustomer(editedCustomer) {
        let self = this;

        let validateFields = angular.copy(self.$scope.frontValidate);

        if (self.$scope.showAddress) {
            validateFields.address = angular.copy(self.$scope.addressValidation);
        } else {
            delete self.$scope.editableFields.address;
        }
        if (self.$scope.showCompany) {
            validateFields.company = angular.copy(self.$scope.companyValidation);
        } else {
            delete self.$scope.editableFields.company;
        }

        let frontValidation = self.Validation.frontValidation(editedCustomer, validateFields);
        if (_.isEmpty(frontValidation)) {
            self.CustomerService.putCustomer(editedCustomer)
                .then(
                    res => {
                        let message = self.$filter('translate')('xhr.put_customer.success');
                        self.Flash.create('success', message);
                        self.$state.go('admin.single-customer', {customerId: res.customerId});
                    },
                    res => {
                        self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                        let message = self.$filter('translate')('xhr.put_customer.error');
                        self.Flash.create('danger', message);
                    }
                )
        } else {
            let message = self.$filter('translate')('xhr.post_customer.error');
            self.Flash.create('danger', message);
            self.$scope.validate = frontValidation;
        }
    }

    getAssignedLevel(levelId) {
        let self = this;

        if (!levelId) {
            return;
        }

        self.loaderStates.customerLevel = true;

        self.LevelService.getLevel(levelId)
            .then(
                res => {
                    self.$scope.assignedLevel = res;
                    self.loaderStates.customerLevel = false;
                },
                () => {
                    let message = self.$filter('translate')('xhr.get_level.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.customerLevel = false;
                }
            )

    }

    getAvailableLevels() {
        let self = this;

        self.LevelService.getLevels()
            .then(
                res => {
                    self.$scope.availableLevels = [];
                    let tmp = 0;
                    for (var i in res) {
                        if (!res.hasOwnProperty(i)) {
                            continue;
                        }
                        if (res[i] && res[i].active) {
                            tmp++;
                            self.$scope.availableLevels.push(res[i]);
                        }
                    }
                    self.$scope.availableLevels.total = tmp;
                    self.levels = res;
                },
                () => {
                    let message = self.$filter('translate')('xhr.get_levels.error');
                    self.Flash.create('danger', message);
                }
            )
    }
    checkMerchantSelect(param) {
        let self = this;
        if (param) {
            self.getStore(param);
            //   self.getCardSchemesByMerchant(param);
        }
    }

    getStore(param) {
        let self = this;

        //let dfd = self.$q.defer();
        //self.ParamsMap.params(params.url())
        self.loaderStates.store = true;
        // $( ".store" ).attr("disabled","true");
        self.MerchantService.getStore(param)
            .then(
                res => {
                    console.log("res", res)
                    self.loaderStates.coverLoader = false;
                    var tempStores = [];
                    var length = res.total;
                    this.stores = res.store;
                    self.loaderStates.store = false;
                    // $( ".store" ).attr("disabled","false");
                },
                () => {
                    let message = "Cannot fetch stores.Please try again larer";
                    self.Flash.create('danger', message);
                    self.loaderStates.store = false;
                    // dfd.reject();
                }
            );
    }

    getAvailableMerchant() {
        let self = this;

        self.loaderStates.customerPOS = true;

        self.MerchantService.getMerchants()
            .then(
                res => {
                    self.$scope.availableMerchants = res;
                    self.merchantList = res;
                    self.loaderStates.customerPOS = false;
                },
                () => {
                    let message = self.$filter('translate')('xhr.get_pos_list.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.customerPOS = false;
                }
            )
    }

    getAssignedPos(posId) {
        let self = this;

        self.loaderStates.customerPOS = true;

        self.PosService.getPos(posId)
            .then(
                res => {
                    self.$scope.assignedPos = res;
                    self.loaderStates.customerPOS = false;
                },
                () => {
                    let message = self.$filter('translate')('xhr.get_pos_list.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.customerPOS = false;
                }
            )
    }

    assignPos(newPos) {
        let self = this;
        self.loaderStates.assignPos = true;

        self.CustomerService.postPos(self.$scope.customer, newPos.posId)
            .then(
                res => {
                    let message = self.$filter('translate')('xhr.post_pos.success');
                    self.Flash.create('success', message);
                    self.getCustomerData();
                    self.showAvailablePosModal = false;
                    self.loaderStates.assignPos = false;
                },
                () => {
                    let message = self.$filter('translate')('xhr.post_pos.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.assignPos = false;
                }
            )
    }

    updateCouponUsage(customerId, campaignId, code, used) {
        let self = this;
        self.CustomerService.postUsage(customerId, campaignId, code, used).then(
            res => {
                self.getRewardsData();
            },
            res => {
                let message = self.$filter('translate')('xhr.pos_coupon_usage.error');
                self.Flash.create('danger', message);

            }
        )
    }

    deactivateCustomer(customerId) {
        let self = this;
        self.loaderStates.deactivateCustomer = true;

        self.CustomerService.deactivateCustomer(customerId)
            .then(
                res => {
                    let message = self.$filter('translate')('xhr.post_deactivate_customer.success');
                    self.Flash.create('success', message);
                    self.getData();
                    self.loaderStates.deactivateCustomer = false;
                },
                () => {
                    let message = self.$filter('translate')('xhr.post_deactivate_customer.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.deactivateCustomer = false;
                }
            )
    }

    activateCustomer(customerId) {
        let self = this;

        self.CustomerService.activateCustomer(customerId)
            .then(
                res => {
                    let message = self.$filter('translate')('xhr.post_activate_customer.success');
                    self.Flash.create('success', message);
                    self.getData();
                },
                () => {
                    let message = self.$filter('translate')('xhr.post_activate_customer.error');
                    self.Flash.create('danger', message);
                }
            )
    }

    assignLevel(newLevel) {
        let self = this;
        self.loaderStates.assignLevel = true;

        self.CustomerService.postLevel(self.$scope.customer, newLevel.id)
            .then(
                res => {
                    let message = self.$filter('translate')('xhr.post_level.success');
                    self.Flash.create('success', message);
                    self.getCustomerData();
                    self.showAvailableLevelsModal = false;
                    self.loaderStates.assignLevel = false
                },
                () => {
                    let message = self.$filter('translate')('xhr.post_level.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.assignLevel = false
                }
            )
    }

}
CustomerController.$inject = ['$scope', '$state', '$stateParams', 'AuthService', 'CustomerService', 'Flash', 'EditableMap', 'NgTableParams', 'ParamsMap', '$q', 'LevelService', 'Validation', '$filter', 'DataService', 'PosService', 'TransferService', 'MerchantService'];