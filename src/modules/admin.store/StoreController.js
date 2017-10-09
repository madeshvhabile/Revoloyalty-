export default class StoreController {
    constructor($scope, $state, $stateParams, AuthService, StoreService, Flash, EditableMap, NgTableParams, ParamsMap, $q, LevelService, Validation, $filter, DataService, PosService, TransferService) {
        if (!AuthService.isGranted('ROLE_ADMIN')) {
            $state.go('admin-login')
        }
        this.$scope = $scope;
        this.$scope.dateNow = new Date();
        this.StoreService = StoreService;
        this.$scope.newStore = {};
        this.$stateParams=$stateParams
        this.merchantId = $stateParams.merchantId || null;
        this.storeId=$stateParams.storeId || null;
        this.storeValidation = {
            name: '@assert:not_blank|min-4|max-50',
            contactperson: '@assert:not_blank|min-4|max-25',
            noofterminals: '@assert:not_blank|min-1|max-3',
            email: '@assert:not_blank|max-50',
            postalcode: '@assert:not_blank|min-4|max-10',
            address: '@assert:not_blank|min-5|max-100',
            contactno: '@assert:not_blank|min-6|max-15',
            //bankaccno: '@assert:not_blank|min-5|max-20',
            //bankname: '@assert:not_blank|min-5|max-50',
            alternatecontactno:'min-6|max-15',
            storetype: '@assert:not_blank',
            // storeurl:'@assert:min-5|min-50',
            city:'@assert:not_blank|min-3|max-50',
            country:'@assert:not_blank',
            active:'@assert:not_blank'
            },
            this.editStoreValidation = {
                name: '@assert:not_blank|min-4|max-50',
                contactperson: '@assert:not_blank|min-4|max-25',
                // noOfTerminals: '@assert:not_blank',
                email: '@assert:not_blank|max-50',
                postalcode: '@assert:not_blank|min-4|max-10',
                address:  '@assert:not_blank|min-5|max-100',
                contactno: '@assert:not_blank|min-6|max-15',
                alternatecontactno:'min-6|max-15',
                //bankaccno: '@assert:not_blank|min-5|max-20',
                //bankname: '@assert:not_blank|min-5|max-50',
                storetype: '@assert:not_blank',
                city:'@assert:not_blank|min-3|max-50',
                country:'@assert:not_blank',
                active:'@assert:not_blank'
            }
            this.terminalValidation = {
                noofterminals: '@assert:not_blank|min-1|max-3',
                terminaltype: '@assert:not_blank'
            },
        this.$state = $state;
        this.AuthService = AuthService;
        this.Flash = Flash;
        this.EditableMap = EditableMap;
        this.merchantId = $stateParams.merchantId || null;
        this.storeId = $stateParams.storeId || null;
        this.NgTableParams = NgTableParams;
        this.ParamsMap = ParamsMap;
        this.$q = $q;
        this.Validation = Validation;
        this.$filter = $filter;
        this.country = DataService.getCountries();
        this.config = DataService.getConfig();
        this.countryConfig = {
            valueField: 'code',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField:'name',
            maxItems: 1,
        };
        this.loaderStates = {
            customerTabs: true,
            customerDetails: true,
            storeList: true,
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
            deactivateStore: false,
            deleteStore: false,
            deleteTerminal: false
        }
        this.active = [{
                name: this.$filter('translate')('global.active'),
                type: 1
            },
            {
                name: this.$filter('translate')('global.inactive'),
                type: 0
            }
        ];
        this.type = [{
                name: 'Physical',
                type: 'Physical'
            },
            {
                name: 'E-store',
                type: 'E-store'
            }
        ];
        this.typeConfig = {
            valueField: 'type',
            labelField: 'name',
            create: false,
            sortField: 'name',
            maxItems: 1,
            searchField: 'name'
        };

        this.activeConfig = {
            valueField: 'type',
            labelField: 'name',
            create: false,
            sortField: 'name',
            maxItems: 1
        };

    }
    /*getData() {
        let self = this;

        self.tableParams = new self.NgTableParams({
            count: self.config.perPage,
            sorting: {
                createdAt: 'desc'
            }
        }, {
            getData: function (params) {
                let dfd = self.$q.defer();
                self.loaderStates.storeList = true;
                self.StoreService.getStores(self.merchantId,self.ParamsMap.params(params.url()))
                    .then(
                        res => {
                            self.loaderStates.storeList = false;
                            self.loaderStates.coverLoader = false;
                            self.$scope.stores = res;
                            params.total(res.total);
                            dfd.resolve(res)
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_customers.error');
                            self.Flash.create('danger', message);
                            self.loaderStates.storeList = false;
                            self.loaderStates.coverLoader = false;
                            dfd.reject();
                        }
                    );

                return dfd.promise;
            }
        });
    }*/
    closeModal() {
        let self = this;
        self.linkAddStoreModal = false
        self.linkAddTerminalModal = false
    }
    openModal() {
        let self = this
        console.log("here")
        self.linkAddStoreModal = true
        self.$scope.newStore = {}
        self.$scope.storeValidate = {}
    }
    openTerminalModal() {
        let self = this
        self.linkAddTerminalModal = true
        self.$scope.newTerminals = {}
        self.$scope.terminalValidate = {}
    }
    showDeleteTerminalModel(store) {
        let self = this;
        self.deleteTerminal = store
        self.showTerminalRemoveModal = true;
    };
    deleteTerminalConform() {
        let self = this;
        self.loaderStates.deleteTerminal = true;
        self.StoreService.deleteTerminal(self.deleteTerminal.terminalId)
        .then(
            res => {
                _.remove(self.TerminaltableParams.settings().dataset, function (item) {
                    return self.deleteTerminal === item;
                });
                self.TerminaltableParams.reload().then(function (data) {
                    if (data.length === 0 && self.TerminaltableParams.total() > 0) {
                        self.TerminaltableParams.page(self.TerminaltableParams.page() - 1);
                        self.TerminaltableParams.reload();
                    }
                });
                let message = "Terminal Deleted Successfully";
                self.Flash.create('success', message);
                self.loaderStates.deleteTerminal = false;
                self.showTerminalRemoveModal=false;
        },
        () =>{
            let message = "Cannot Delete Terminal,Please Try Again Later";
            self.Flash.create('danger', message);
            self.loaderStates.deleteTerminal = false;
            self.showTerminalRemoveModal=false;
        }
    )

        //    var idx = self.storeList.indexOf(self.deleteStore);
        //    self.storeList.splice(idx, 1);
        //    this.storeTableParams = new this.NgTableParams({
        //        count: this.config.perPage,
        //        sorting: {
        //            createdAt: 'desc'
        //        }
        //    }, {dataset:self.storeList})
        self.loaderStates.deleteStore = false;
        self.showTerminalRemoveModal = false;
    }


    showDeleteStoreModel(store) {
        let self = this;
        self.deleteStore = store
        self.showStoreRemoveModal = true;
    };
    deleteStoreConform() {
        let self = this;
        self.loaderStates.deleteStore = true;
        self.StoreService.deleteStore(self.deleteStore.storeId)
        .then(
           res=> {
                _.remove(self.StorestableParams.settings().dataset, function (item) {
                    return self.deleteStore === item;
                });
                self.StorestableParams.reload().then(function (data) {
                    if (data.length === 0 && self.StorestableParams.total() > 0) {
                        self.StorestableParams.page(self.StorestableParams.page() - 1);
                        self.StorestableParams.reload();
                    }
                });
                let message = "Store Deleted Successfully";
                self.Flash.create('success', message);
                self.loaderStates.deleteTerminal = false;
                self.showStoreRemoveModal=false;
            },
            () =>{
                let message = "Cannot Delete Store,Please Try Again Later";
                self.Flash.create('danger', message);
                self.loaderStates.deleteTerminal = false;
                self.showStoreRemoveModal=false;
            }
        )

    }
    closedeleteModal() {
        this.showStoreRemoveModal=false;
        this.showTerminalRemoveModal=false;
        }

    addTerminals(newTerminlas) {
        let self = this;
        let validateFields = angular.copy(self.terminalValidation);
        let frontValidation = self.Validation.frontValidation(newTerminlas, validateFields);
        if (!_.isEmpty(frontValidation)) {
            self.$scope.terminalValidate = frontValidation;
        } else {
            self.StoreService.postTerminals(self.storeId,newTerminlas).then(
                res =>{
                    for (var i = 0; i < res.TerminalId.length; i++) {
                        let terminal = {
                            terminalId:res.TerminalId[i] ,
                            terminaltype: newTerminlas.terminaltype,
                            status: 'Approved'
                        }
                        self.TerminaltableParams.settings().dataset.unshift(
                            terminal
                        );
                    };
                    self.TerminaltableParams.sorting({});
                    self.TerminaltableParams.page(1);
                    self.TerminaltableParams.reload();
                    let message = 'Terminals Added Successfully';
                    self.Flash.create('success', message);
                    // console.log("newTerminlas",newTerminlas)
                    self.linkAddTerminalModal = false
                },
                ()=>{
                    let message = "Something Went Wrong!,Cannot Create Terminals";
                    self.Flash.create('danger', message);
                })

        }

    }

    addStore(newStore) {
        let self = this;
        // if(newStore.storeurl != undefined){
        //     self.storeValidation.storeurl='@assert:min-5|max-20'
        // }else{
        //     delete self.storeValidation.storeurl
        // }
        if(!_.isEmpty(newStore.alternatecontactperson)){
            self.storeValidation.alternatecontactperson = '@assert:min-4|max-25';
        }else{
            delete self.storeValidation.alternatecontactperson;
        }
        if(!_.isEmpty(newStore.storeurl)){
            self.storeValidation.storeurl = '@assert:min-5|max-50';
        }else{
            delete self.storeValidation.storeurl;
        }
        if((newStore.alternatecontactno != undefined) &&  (!_.isNull(newStore.alternatecontactno))){
            self.storeValidation.alternatecontactno = '@assert:min-6|max-15';
        }else{
            delete self.storeValidation.alternatecontactno;
        }

        let validateFields = angular.copy(self.storeValidation);
        let frontValidation = self.Validation.frontValidation(newStore, validateFields);
        if (_.isEmpty(frontValidation)) {
           let  idx= _.findIndex(self.StorestableParams.settings().dataset, function(o) { return o.name == newStore.name; });
            if(!(idx > -1)){
            self.StoreService.postStore(newStore,self.$stateParams.merchantId).then(
              res=>{
                  console.log("res",res)
                newStore.storeId=res.storeId[0]
                self.StorestableParams.settings().dataset.unshift(
                    newStore
                );
                self.StorestableParams.sorting({});
                self.StorestableParams.page(1);
                self.StorestableParams.reload();
                let message = "Store Added Successfully";
                self.Flash.create('success', message);
                this.closeModal()
              },
              error=>{
                let message = "Something Went Wrong!,Cannot Create Store";
                self.Flash.create('danger', message);
              }
            )
        }
        else{
            let message = 'Store Name Is Already Exists';
            self.Flash.create('danger', message);
        }

            // self.$scope.stores.push(newStore)
            // console.log("self.storeList",self.storeList)
            // self.tableParams = new self.NgTableParams({
            //     count: 5,
            //     sorting: {
            //         createdAt: 'desc'
            //     }
            // }, {
            //     dataset:self.$scope.stores
            //  });
            // console.log("table",self.tableParams)

            // self.MerchantService.postMerchant(newStore)
            //     .then(
            //         res => {
            //             self.$state.go('admin.merchant-list');
            //             let message = self.$filter('translate')('xhr.post_customer.success');
            //             self.Flash.create('success', message);

            //         },
            //         res => {
            //             self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
            //             let message = self.$filter('translate')('xhr.post_customer.error');
            //             self.Flash.create('danger', message);
            //         }
            //     )
        } else {
            // console("error",frontValidation)
            let message = self.$filter('translate')('xhr.post_customer.error');
            self.Flash.create('danger', message);
            self.$scope.storeValidate = frontValidation;
        }
    }
    getData() {
        let self = this;
        self.stores = [];
        // let dfd = self.$q.defer();
        self.loaderStates.storeList = true;
        //self.merchantId,self.ParamsMap.params(params.url())
        if(self.merchantId){
     self.$q.all([
         self.StoreService.getMerchat(self.merchantId).then(
             res=>{
                 console.log("merchant",res)
                 self.$scope.merchantInfo=res
                 self.loaderStates.storeList = false;
                 self.loaderStates.coverLoader = false;
             },
             () => {
                let message = "Cannot get MerchantList";
                self.Flash.create('danger', message);
                self.loaderStates.storeList = false;
                self.loaderStates.coverLoader = false;
                //dfd.reject();
            }
         ),
        self.StoreService.getStores(self.merchantId)
            .then(
                res => {
                    console.log("res",res)
                    self.loaderStates.storeList = false;
                    self.loaderStates.coverLoader = false;
                    self.stores = res;
                    console.log("res")
                    // params.total(res.total);
                    // dfd.resolve(res)
                    var result = res;
                    self.StorestableParams = new self.NgTableParams({
                        count: self.config.perPage,
                        sorting: {
                            created: 'desc'
                        }
                    }, {
                        dataset: result
                    });
                },
                () => {
                    let message = "Cannot get StoreList";
                    self.Flash.create('danger', message);
                    self.loaderStates.storeList = false;
                    self.loaderStates.coverLoader = false;
                    //dfd.reject();
                }
            )
        ])
        .then(
            () => {
                this.loaderStates.coverLoader = false;
            }
        )
        }else{
                self.$state.go('admin.merchant-list');
                let message = self.$filter('translate')('xhr.get_customer.no_id');
                self.Flash.create('warning', message);
        }


        }


    openEditModel(){
        let self = this
        self.$scope.temObject=angular.copy(self.$scope.EditableStore);
        self.linkEditStoreModal = true
        self.$scope.EditStoreValidate = {}
    }
    closeEditModal(){
        let self = this
        self.linkEditStoreModal = false
    }
    getStoreDetails(){
        let self = this;
        // let dfd = self.$q.defer();
        self.loaderStates.terminalList = true;
        self.StoreService.storeDetails()
        .then(
            res=>{
                self.loaderStates.terminalList = false;
                self.loaderStates.coverLoader = false;
                self.$scope.EditableStore = res;
            },
            ()=>{
                let message = self.$filter('translate')('xhr.get_customers.error');
                self.Flash.create('danger', message);
                self.loaderStates.terminalList = false;
                self.loaderStates.coverLoader = false;
            }

        )
    }

    // self.$q.all([
// ])
// .then(
//     () => {
//         this.loaderStates.coverLoader = false;
//     }
// );
// } else {
// self.$state.go('admin.customers-list');
// let message = self.$filter('translate')('xhr.get_customer.no_id');
// self.Flash.create('warning', message);
// }

    getTerminalData() {
        let self = this;
        // let dfd = self.$q.defer();
        self.loaderStates.terminalList = true;
        if(self.storeId){
            self.$q.all([

        //self.merchantId,self.ParamsMap.params(params.url())
        self.StoreService.getTerminal(self.storeId)
            .then(
                res => {

                    self.loaderStates.terminalList = false;
                    self.loaderStates.coverLoader = false;
                    self.$scope.terminal = res;
                    // self.$scope.EditableStore={
                    //     address : "LB road",
                    //     bankaccno:"654654654",
                    //     bankname:"hdfc",
                    //     contactno:9159633430,
                    //     contactperson:"madesh",
                    //     email:"madesh.v@habile.in",
                    //     NoofTerminals:21,
                    //     postalcode:600044,
                    //     name:"reliance",
                    //     active:0,
                    //     city:"singapore",
                    //     country:'al',

                    // }
                    //params.total(res.total);
                    //dfd.resolve(res)

                    self.TerminaltableParams = new self.NgTableParams({
                        count: self.config.perPage,
                        sorting: {
                            created: 'desc'
                        }
                    }, {
                        dataset: angular.copy(res)
                    });
                },
                () => {
                    let message = self.$filter('translate')('xhr.get_customers.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.terminalList = false;

                    //dfd.reject();
                }
            ),
            self.StoreService.getStore(self.storeId)
            .then(
                res=>{
                    console.log("res",res)
                    self.loaderStates.terminalList = false;
                    self.loaderStates.coverLoader = false;
                    self.$scope.EditableStore=angular.copy(res)
                    self.$scope.EditableStoreDetails=angular.copy(res)
                },
                error=>{
                    let message = self.$filter('translate')('xhr.get_customers.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.terminalList = false;
                }
            )
            ])
.then(
    () => {
        this.loaderStates.coverLoader = false;
    }
);
        }
            else{
                self.$state.go('admin.store-list');
                let message = self.$filter('translate')('xhr.get_customer.no_id');
                self.Flash.create('warning', message);
            }


        }



    editStore(ModifiedStore){
        let self=this;
        console.log(!_.isEqual(self.$scope.temObject,ModifiedStore))
        if( !_.isEqual(self.$scope.temObject,ModifiedStore)){

            /*non mantatery field validation */
            if(!_.isEmpty(ModifiedStore.alternatecontactperson)){
                self.editStoreValidation.alternatecontactperson = '@assert:min-4|max-25';
            }else{
                delete self.editStoreValidation.alternatecontactperson;
            }
            if(!_.isEmpty(ModifiedStore.storeurl)){
                self.editStoreValidation.storeurl = '@assert:min-5|max-50';
            }else{
                delete self.editStoreValidation.storeurl;
            }
            if((ModifiedStore.alternatecontactno != undefined) &&  (!_.isNull(ModifiedStore.alternatecontactno))){
                self.editStoreValidation.alternatecontactno = '@assert:min-6|max-15';
            }else{
                delete self.editStoreValidation.alternatecontactno;
            }

            let validateFields = angular.copy(self.editStoreValidation);
            let frontValidation = self.Validation.frontValidation(ModifiedStore, validateFields);
            if (_.isEmpty(frontValidation)) {
                self.StoreService.putStore(ModifiedStore)
                .then(
                    res => {
                        console.log("res",res)
                        self.$scope.editableFields=angular.copy(ModifiedStore)
                        self.$scope.EditableStoreDetails=angular.copy(ModifiedStore)
                        let message = 'Store Updated Successfully'
                        self.Flash.create('success', message);
                        self.loaderStates.terminalList = false;
                        self.loaderStates.coverLoader = false;
                        self.linkEditStoreModal=false
                    },
                    error => {
                        let message = 'Something Went Wrong try again later'
                        self.Flash.create('danger', message);
                        self.linkEditStoreModal=false
                        self.loaderStates.terminalList = false;
                        self.loaderStates.coverLoader = false;
                    }
                )


            }
            else{
                let message = 'Please Provide a valid input';
                self.Flash.create('danger', message);
                self.loaderStates.terminalList = false;
                self.loaderStates.coverLoader = false;
                self.$scope.EditStoreValidate = frontValidation;
            }

        }else{
            let message = 'No Changes are Made'
            self.Flash.create('danger', message);
            self.loaderStates.terminalList = false;
            self.loaderStates.coverLoader = false;
        }



    }

    getStoreData() {
        let self = this;

        self.loaderStates.merchantDetails = true;

        if (self.storeId) {
            self.$q.all([
                    self.StoreService.getStore(self.storeId)
                    .then(
                        res => {
                            self.$scope.store = res;
                            self.$scope.editableFields = self.EditableMap.humanizeCustomer(res);
                            self.$scope.showAddress = !(_.isEmpty(self.$scope.editableFields.address));
                            self.$scope.showCompany = !(_.isEmpty(self.$scope.editableFields.company));
                            self.loaderStates.storeDetails = false;
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_customer.error');
                            self.Flash.create('danger', message);
                            self.loaderStates.storeDetails = false;
                        }
                    )
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

    // getAvailableGroup() {
    //     let self = this;
    //
    //     self.LevelService.getLevels()
    //         .then(
    //             res => {
    //                 self.$scope.availableLevels = [];
    //                 let tmp = 0;
    //                 for (var i in res) {
    //                     if (!res.hasOwnProperty(i)) {
    //                         continue;
    //                     }
    //                     if (res[i] && res[i].active) {
    //                         tmp++;
    //                         self.$scope.availableLevels.push(res[i]);
    //                     }
    //                 }
    //                 self.$scope.availableLevels.total = tmp;
    //                 self.levels = res;
    //             },
    //             () => {
    //                 let message = self.$filter('translate')('xhr.get_levels.error');
    //                 self.Flash.create('danger', message);
    //             }
    //         )
    // }
    //
    // getAvailableCategory() {
    //     let self = this;
    //
    //     self.loaderStates.customerPOS = true;
    //
    //     self.PosService.getPosList()
    //         .then(
    //             res => {
    //                 self.$scope.availablePos = res;
    //                 self.posList = res;
    //                 self.loaderStates.customerPOS = false;
    //             },
    //             () => {
    //                 let message = self.$filter('translate')('xhr.get_pos_list.error');
    //                 self.Flash.create('danger', message);
    //                 self.loaderStates.customerPOS = false;
    //             }
    //         )
    // }

    //   addStore(newStore) {
    //       console.log("enter to submit",newStore)
    //       let self = this;
    //       let validateFields = angular.copy(self.$scope.frontValidate);
    //       let frontValidation = self.Validation.frontValidation(newStore, validateFields);
    //       if (_.isEmpty(frontValidation)) {
    //           self.StoreService.postStore(newStore)
    //               .then(
    //                   res => {
    //                       self.$state.go('admin.merchant-list');
    //                       let message = self.$filter('translate')('xhr.post_customer.success');
    //                       self.Flash.create('success', message);

    //                   },
    //                   res => {
    //                       self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
    //                       let message = self.$filter('translate')('xhr.post_customer.error');
    //                       self.Flash.create('danger', message);
    //                   }
    //               )
    //       } else {
    //           let message = self.$filter('translate')('xhr.post_customer.error');
    //           self.Flash.create('danger', message);
    //           self.$scope.validate = frontValidation;
    //       }
    //   }


    // editStore(editedStore) {
    //     let self = this;

    //     let validateFields = angular.copy(self.$scope.frontValidate);

    //     let frontValidation = self.Validation.frontValidation(editedStore, validateFields);
    //     if (_.isEmpty(frontValidation)) {
    //         self.StoreService.putStore(editedStore)
    //             .then(
    //                 res => {
    //                     let message = self.$filter('translate')('xhr.put_customer.success');
    //                     self.Flash.create('success', message);
    //                     self.$state.go('admin.single-customer', {
    //                         customerId: res.customerId
    //                     });
    //                 },
    //                 res => {
    //                     self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
    //                     let message = self.$filter('translate')('xhr.put_customer.error');
    //                     self.Flash.create('danger', message);
    //                 }
    //             )
    //     } else {
    //         let message = self.$filter('translate')('xhr.post_customer.error');
    //         self.Flash.create('danger', message);
    //         self.$scope.validate = frontValidation;
    //     }
    // }

    deactivateStore(storeId) {
        let self = this;
        self.loaderStates.deactivateStore = true;

        self.StoreService.deactivateStore(merchantId)
            .then(
                res => {
                    let message = self.$filter('translate')('xhr.post_deactivate_customer.success');
                    self.Flash.create('success', message);
                    self.getData();
                    self.loaderStates.deactivateStore = false;
                },
                () => {
                    let message = self.$filter('translate')('xhr.post_deactivate_customer.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.deactivateStore = false;
                }
            )
    }


    //   addTerminal(storeId){
    //     for(var i= 0;i < storeId.)
    //     let self=this;
    //     self.StoreService.addTerminal(storeId)
    //     .then(
    //         res => {
    //             let message = self.$filter('translate')('xhr.post_activate_customer.success');
    //             self.Flash.create('success', message);
    //             self.getData();
    //         },
    //         () => {
    //             let message = self.$filter('translate')('xhr.post_activate_customer.error');
    //             self.Flash.create('danger', message);
    //         }
    //     )
    //   }
    deleteTerminal(row) {
        let self = this;
        console.log("row", row)
        delete row.showRemoveModal;
        var idx = self.tableParams.data.map(function (el) {
            return el['$$hashKey'];
        }).indexOf(row.$$hashKey)
        //   var idx = self.tableParams.data.indexOf(row);
        console.log("idx", idx)
        //   self.tableParams.data.splice(idx, 1);

        _.remove(self.tableParams.data, function (item) {
            console.log(row.Terminal === item.Terminal)
            return row.Terminal === item.Terminal;
        });
        console.log("self.tableParams", self.tableParams)
        self.tableParams.reload().then(function (data) {
            console.log("data", data)
            if (data.length === 0 && self.tableParams.total() > 0) {
                self.tableParams.page(self.tableParams.page() - 1);
                self.tableParams.reload();
            }
        });
    }

    //   deleteTerminal(terminalId){
    //     let self=this
    //     self.StoreService.deactivateTerminal(terminalId)
    //     .then(
    //         res => {
    //             let message = self.$filter('translate')('xhr.post_activate_customer.success');
    //             self.Flash.create('success', message);
    //             self.getData();
    //         },
    //         () => {
    //             let message = self.$filter('translate')('xhr.post_activate_customer.error');
    //             self.Flash.create('danger', message);
    //         }
    //     )

    //   }
    ApproveTerminal(TerminalId) {
        let self = this
        self.StoreService.activateTerminal(terminalId)
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

    RejectTerminal(TerminalId, reason) {

        let self = this
        self.StoreService.RejectTerminal(terminalId)
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

    activateStore(storeId) {
        let self = this;

        self.StoreService.activatestore(storeId)
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

}
StoreController.$inject = ['$scope', '$state', '$stateParams', 'AuthService', 'StoreService', 'Flash', 'EditableMap', 'NgTableParams', 'ParamsMap', '$q', 'LevelService', 'Validation', '$filter', 'DataService', 'PosService', 'TransferService'];
