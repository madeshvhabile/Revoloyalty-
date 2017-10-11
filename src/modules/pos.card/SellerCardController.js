export default class SellerCustomerController {
    constructor($scope, $state, $stateParams, SellerCardService, Flash, $filter, DataService, Validation, EditableMap, $q, ParamsMap, NgTableParams) {
        this.$scope = $scope;
        this.$scope.newCustomer = {};
        this.$scope.editableFields = {};
        this.$scope.newLevel = {};
        this.$scope.newPos = {};
        this.$scope.validate = {};
        this.$state = $state;
        this.SellerCardService = SellerCardService;
        this.Flash = Flash;
        this.$filter = $filter;
        this.country = DataService.getCountries();
        this.DataService=DataService;
        this.EditableMap = EditableMap;
        this.Validation = Validation;
        // this.DataService.getsellerloginDetails()
        // this.$scope.addressValidation = {
        //     street: '@assert:not_blank',
        //     address1: '@assert:not_blank',
        //     postal: '@assert:not_blank',
        //     country: '@assert:not_blank',
        //     city: '@assert:not_blank',
        // };
        // this.$scope.companyValidation = {
        //     nip: '@assert:not_blank',
        //     name: '@assert:not_blank'
        // };
        // this.$scope.frontValidate = {
        //     firstName: '@assert:not_blank',
        //     lastName: '@assert:not_blank',
        //     agreement1: '@assert:not_blank',
        //     email: '@assert:not_blank',
        //     phone: '@assert:not_blank'
        // };
        // // this.customerId = $stateParams.customerId || null;
        // this.countryConfig = {
        //     valueField: 'code',
        //     labelField: 'name',
        //     create: false,
        //     sortField: 'name',
        //     maxItems: 1,
        // };
        // this.levelsConfig = {
        //     valueField: 'id',
        //     labelField: 'name',
        //     create: false,
        //     sortField: 'name',
        //     maxItems: 1,
        // };
        // this.posConfig = {
        //     valueField: 'posId',
        //     labelField: 'name',
        //     create: false,
        //     sortField: 'name',
        //     maxItems: 1,
        // };
        // this.$scope.search = {};
        this.ParamsMap = ParamsMap;
        // this.$scope.searchCustomerValidate = {
        //     loyaltyCardNumber: '@assert:one_from:phone:email:firstName:city:postcode',
        //     phone: '@assert:one_from:loyaltyCardNumber:email:firstName:city:postcode',
        //     email: '@assert:one_from:phone:loyaltyCardNumber:firstName:city:postcode',
        //     firstName: '@assert:one_from:phone:email:loyaltyCardNumber:city:postcode',
        //     city: '@assert:one_from:phone:email:firstName:loyaltyCardNumber:postcode',
        //     postcode: '@assert:one_from:phone:email:firstName:city:loyaltyCardNumber'
        // };
        this.NgTableParams = NgTableParams;
        // this.$scope.customers = null;
        this.$q = $q;
        // this.loaderVisible = {
        //     editCustomer: true,
        //     singleCustomer: true
        // };
        this.loaderStates={
          coverLoader:false,
          CardListloader:false
        }

        // if (this.customerId && this.$state.current.name === 'seller.panel.single-customer') {
        //     let self = this;
        //
        //     $scope.$watch('customer', function () {
        //         if ($scope.customer && $scope.customer.levelId) {
        //             self.getAssignedLevel($scope.customer.levelId);
        //             self.getAvailableLevels();
        //         } else {
        //             self.getAvailableLevels();
        //         }
        //         if ($scope.customer && $scope.customer.posId) {
        //             self.getAssignedPos($scope.customer.posId);
        //             self.getAvailablePos();
        //         } else {
        //             self.getAvailablePos();
        //         }
        //     }, true)
        // }
    }



    getsellerCards() {
        let self = this;
        self.loaderStates.CardListloader= true;
         self.sellerId='f2c75459-ab41-4d53-abf9-40baede053fc';
         console.log("details",self.DataService)
        if (self.sellerId) {
            self.$q.all([
                // self.SellerCardService.getOrderData(self.sellerId)
                //     .then(
                //         res => {
                //             self.$scope.orderDetails = res;
                //             self.loaderStates.CardListloader = false;
                //
                //         },
                //         () => {
                //           let message = "Cannot get order details";
                //             self.Flash.create('danger', message);
                //             self.loaderStates.CardListloader = false;
                //         }
                //     ),
                    self.SellerCardService.getCardDetailData(self.sellerId)
                    .then(
                        res =>{
                            console.log('response',res);

                            self.getCardDetailData(res);
                            self.loaderStates.CardListloader= false
                        },
                        ()=>{
                          self.loaderStates.CardListloader= false
                            let message = "Cannot get Card details for this order,please check order status";
                            self.Flash.create('danger', message);
                        }
                    )

            ]).then(
                (res)=>{
                    console.log('Success');
                    self.loaderStates.CardListloader= false
                },
                (err)=>{
                  self.loaderStates.CardListloader= false
                  let message = "Something Went wrong Please Try again Later";
                  self.Flash.create('danger', message);

                }
                  )

        }
    }

    getCardDetailData(response){

        let self =this;

        self.$scope.totalCardobj=[];
        if(response.total !=0){
            self.CardData =true;
        }

        for(var k=0 ;k < response.total; k++){
            self.CardObj ={
                cardnumber:'',
                cardtype:'',
                cardexistencetype:'',
                cardscheme:'',
                expirymonths:'',
                preloadamount:'',
                freeformmin:'',
                freeformmax:'',
                crossbordercountry :''
            }
           if(response[k].hasOwnProperty("cardnumber")){
           self.CardObj.cardnumber = response[k].cardnumber;
           }
          if(response[k].hasOwnProperty("cardexistencetype")){
               self.CardObj.cardexistencetype =response[k].cardexistencetype;
           }
           if(response[k].hasOwnProperty("isgiftcard")){
             if(response[k].isgiftcard){
                 self.CardObj.cardtype ="GiftCard";
                 if(response[k].hasOwnProperty("giftCardSchemeData")){
                    if(!_.isEmpty(response[k].giftCardSchemeData)){
                        if(response[k].giftCardSchemeData.hasOwnProperty('preload')){
                        self.CardObj.cardscheme ="Preload";
                        self.CardObj.preloadamount = response[k].giftCardSchemeData.preload.value;
                        self.CardObj.expirymonths = response[k].giftCardSchemeData.preload.expirymonths;
                        }
                        if(response[k].giftCardSchemeData.hasOwnProperty('freecard')){
                            self.CardObj.cardscheme ="FreeForm";
                            self.CardObj.freeformmin = response[k].giftCardSchemeData.freecard.min;
                            self.CardObj.freeformmax = response[k].giftCardSchemeData.freecard.max;
                            self.CardObj.expirymonths = response[k].giftCardSchemeData.freecard.expirymonths;
                        }
                        if(response[k].giftCardSchemeData.hasOwnProperty('crossborder')){
                            self.CardObj.cardscheme ="crossBorder";
                            self.CardObj.crossbordercountry = response[k].giftCardSchemeData.crossborder.country;
                            self.CardObj.expirymonths = response[k].giftCardSchemeData.crossborder.expirymonths;
                            self.CardObj.freeformmin = response[k].giftCardSchemeData.crossborder.min;
                            self.CardObj.freeformmax = response[k].giftCardSchemeData.crossborder.max;
                        }
                    }
                }
               }
            }
             if(response[k].hasOwnProperty("isloyaltycard")){
                if(response[k].isloyaltycard){
                  self.CardObj.cardtype ="LoyaltyCard";
                  if(response[k].hasOwnProperty("loyaltyCardSchemeData")){
                    if(!_.isEmpty(response[k].loyaltyCardSchemeData)){
                       if(response[k].giftCardSchemeData.hasOwnProperty('rewardredeam')){
                       self.CardObj.cardscheme ="Redeem";
                       self.CardObj.expirymonths = response[k].giftCardSchemeData.rewardredeam.expirymonths;
                       }
                       if(response[k].giftCardSchemeData.hasOwnProperty('CrossBorder')){
                           self.CardObj.cardscheme ="CrossBorder";
                           self.CardObj.crossbordercountry = response[k].giftCardSchemeData.crossBorder.country
                           self.CardObj.expirymonths = response[k].giftCardSchemeData.crossBorder.expirymonths;
                       }

                   }
                }
             }

            }

           self.$scope.totalCardobj.push(angular.copy(self.CardObj));
        }
        self.loaderStates.CardListloader= false;
            console.log('self.$scope.totalCardobj',self.$scope.totalCardobj);
            self.CardtableParams = new self.NgTableParams({
                count: 25,
                sorting: {
                    created: 'desc'
                }
            }, {
            dataset:self.$scope.totalCardobj
            });
       }


    // deactivateCustomer(customerId) {
    //     let self = this;
    //
    //     self.SellerCardServicgetStoreListe.deactivateCustomer(customerId)
    //         .then(
    //             res => {
    //                 let message = self.$filter('translate')('xhr.post_deactivate_customer.success');
    //                 self.Flash.create('success', message);
    //                 self.find();
    //             },
    //             () => {
    //                 let message = self.$filter('translate')('xhr.post_deactivate_customer.error');
    //                 self.Flash.create('danger', message);
    //             }
    //         )
    // }
    //
    // addCustomer(newCustomer) {
    //     let self = this;
    //     let validateFields = angular.copy(self.$scope.frontValidate);
    //
    //     if (self.$scope.showAddress) {
    //         validateFields.address = angular.copy(self.$scope.addressValidation);
    //     } else {
    //         delete self.$scope.newCustomer.address;
    //     }
    //     if (self.$scope.showCompany) {
    //         validateFields.company = angular.copy(self.$scope.companyValidation);
    //     } else {
    //         delete self.$scope.newCustomer.company;
    //     }
    //
    //     let frontValidation = self.Validation.frontValidation(newCustomer, validateFields);
    //
    //     if (_.isEmpty(frontValidation)) {
    //         self.SellerCardService.postCustomer(newCustomer)
    //             .then(
    //                 res => {
    //                     let message = self.$filter('translate')('xhr.post_registration_customer.success');
    //                     self.Flash.create('success', message);
    //                     self.$state.go('seller.panel.dashboard')
    //                 },
    //                 res => {
    //                     self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
    //                     let message = self.$filter('translate')('xhr.post_registration_customer.error');
    //                     self.Flash.create('danger', message);
    //                 }
    //             )
    //     } else {
    //         let message = self.$filter('translate')('xhr.post_registration_customer.error');
    //         self.Flash.create('danger', message);
    //         self.$scope.validate = frontValidation;
    //     }
    // }
    //
    // getTransactionsData() {
    //     let self = this;
    //
    //     self.transactionsTableParams = new self.NgTableParams({}, {
    //         getData: function (params) {
    //             let dfd = self.$q.defer();
    //
    //             self.SellerCardService.getCustomerTransactions(self.ParamsMap.params(params.url()), self.customerId)
    //                 .then(
    //                     res => {
    //                         self.$scope.customerTransactions = res;
    //                         params.total(res.total);
    //                         dfd.resolve(res);
    //                     },
    //                     () => {
    //                         let message = self.$filter('translate')('xhr.get_transations.error');
    //                         self.Flash.create('danger', message);
    //                         dfd.reject();
    //                     }
    //                 );
    //
    //             return dfd.promise;
    //         }
    //     });
    // }
    //
    // getTransfersData() {
    //     let self = this;
    //
    //     self.transfersTableParams = new self.NgTableParams({}, {
    //         getData: function (params) {
    //             let dfd = self.$q.defer();
    //
    //             self.SellerCardService.getCustomerTransfers(self.ParamsMap.params(params.url()), self.customerId)
    //                 .then(
    //                     res => {
    //                         self.$scope.customerTransfers = res;
    //                         params.total(res.total);
    //                         dfd.resolve(res);
    //                     },
    //                     () => {
    //                         let message = self.$filter('translate')('xhr.get_transfers.error');
    //                         self.Flash.create('danger', message);
    //                         dfd.reject();
    //                     }
    //                 );
    //
    //             return dfd.promise;
    //         }
    //     });
    // }
    //
    // getCampaignsData() {
    //     let self = this;
    //
    //     self.availableCampaignsTableParams = new self.NgTableParams({}, {
    //         getData: function (params) {
    //             let dfd = self.$q.defer();
    //
    //             self.SellerCardService.getCustomerAvailableCampaigns(self.ParamsMap.params(params.url()), self.customerId)
    //                 .then(
    //                     res => {
    //                         self.$scope.availableCampaigns = res;
    //                         params.total(res.total);
    //                         dfd.resolve(res);
    //                     },
    //                     () => {
    //                         let message = self.$filter('translate')('xhr.get_available_campaigns.error');
    //                         self.Flash.create('danger', message);
    //                         dfd.reject();
    //                     }
    //                 );
    //
    //             return dfd.promise;
    //         }
    //     });
    // }
    //
    // getRewardsData() {
    //     let self = this;
    //
    //     self.boughtCampaignsTableParams = new self.NgTableParams({}, {
    //         getData: function (params) {
    //             let dfd = self.$q.defer();
    //
    //             self.SellerCardService.getCustomerBoughtCampaigns(self.ParamsMap.params(params.url()), self.customerId)
    //                 .then(
    //                     res => {
    //                         self.$scope.boughtCampaigns = res;
    //                         params.total(res.total);
    //                         dfd.resolve(res);
    //                     },
    //                     () => {
    //                         let message = self.$filter('translate')('xhr.get_bought_campaigns.error');
    //                         self.Flash.create('danger', message);
    //                         dfd.reject();
    //                     }
    //                 );
    //
    //             return dfd.promise;
    //         }
    //     });
    // }
    //
    // getCustomerData() {
    //     let self = this;
    //
    //     if (self.customerId) {
    //         self.SellerCardService.getCustomer(self.customerId)
    //             .then(
    //                 res => {
    //                     self.$scope.customer = res;
    //                     self.$scope.editableFields = self.EditableMap.humanizeCustomer(res);
    //                     self.$scope.showAddress = !(_.isEmpty(self.$scope.editableFields.address));
    //                     self.$scope.showCompany = !(_.isEmpty(self.$scope.editableFields.company));
    //                     self.loaderVisible.editCustomer = false;
    //                     self.loaderVisible.singleCustomer = false;
    //                 },
    //                 () => {
    //                     self.$state.go('seller.panel.customer-search');
    //                     let message = self.$filter('translate')('xhr.get_customer.cant_edit');
    //                     self.Flash.create('danger', message);
    //                     self.loaderVisible.editCustomer = false;
    //                     self.loaderVisible.singleCustomer = false;
    //
    //                 }
    //             );
    //         self.SellerCardService.getCustomerStatus(self.customerId)
    //             .then(
    //                 res => {
    //                     self.$scope.status = res;
    //                 },
    //                 () => {
    //                     let message = self.$filter('translate')('xhr.get_customer.error');
    //                     self.Flash.create('danger', message);
    //                 }
    //             );
    //         self.getTransactionsData();
    //         self.getTransfersData();
    //         self.getCampaignsData();
    //         self.getRewardsData();
    //     } else {
    //         self.$state.go('seller.panel.dashboard');
    //         let message = self.$filter('translate')('xhr.get_customer.no_id');
    //         self.Flash.create('warning', message);
    //     }
    // }
    //
    // editCustomer(editedCustomer) {
    //     let self = this;
    //     let validateFields = angular.copy(self.$scope.frontValidate);
    //
    //     if (self.$scope.showAddress) {
    //         validateFields.address = angular.copy(self.$scope.addressValidation);
    //     } else {
    //         delete self.$scope.editableFields.address;
    //     }
    //     if (self.$scope.showCompany) {
    //         validateFields.company = angular.copy(self.$scope.companyValidation);
    //     } else {
    //         delete self.$scope.editableFields.company;
    //     }
    //
    //     let frontValidation = self.Validation.frontValidation(editedCustomer, validateFields);
    //     if (_.isEmpty(frontValidation)) {
    //         self.SellerCardService.putCustomer(editedCustomer)
    //             .then(
    //                 res => {
    //                     let message = self.$filter('translate')('xhr.put_customer.success');
    //                     self.Flash.create('success', message);
    //                     self.$state.go('seller.panel.dashboard');
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
    //
    // getAvailableLevels() {
    //     let self = this;
    //
    //     self.SellerCardService.getLevels()
    //         .then(
    //             res => {
    //                 self.$scope.availableLevels = res;
    //                 self.levels = res;
    //             },
    //             () => {
    //                 let message = self.$filter('translate')('xhr.get_levels.error');
    //                 self.Flash.create('danger', message);
    //             }
    //         )
    // }
    //
    // getAvailablePos() {
    //     let self = this;
    //
    //     self.SellerCardService.getPosList()
    //         .then(
    //             res => {
    //                 self.$scope.availablePos = res;
    //                 self.posList = res;
    //             },
    //             () => {
    //                 let message = self.$filter('translate')('xhr.get_pos_list.error');
    //                 self.Flash.create('danger', message);
    //             }
    //         )
    // }
    //
    // getAssignedPos(posId) {
    //     let self = this;
    //
    //     self.SellerCardService.getPos(posId)
    //         .then(
    //             res => {
    //                 self.$scope.assignedPos = res;
    //             },
    //             () => {
    //                 let message = self.$filter('translate')('xhr.get_pos_list.error');
    //                 self.Flash.create('danger', message);
    //             }
    //         )
    // }
    //
    // getAssignedLevel(levelId) {
    //     let self = this;
    //
    //     if (!levelId) {
    //         return;
    //     }
    //
    //     self.SellerCardService.getLevel(levelId)
    //         .then(
    //             res => {
    //                 self.$scope.assignedLevel = res;
    //             },
    //             () => {
    //                 let message = self.$filter('translate')('xhr.get_level.error');
    //                 self.Flash.create('danger', message);
    //             }
    //         )
    //
    // }
    //
    // find() {
    //     let self = this;
    //     self.$scope.validate = {};
    //     let validateFields = angular.copy(self.$scope.searchCustomerValidate);
    //     let frontValidation = self.Validation.frontValidation(self.$scope.search, validateFields);
    //
    //     if (_.isEmpty(frontValidation)) {
    //         if (self.$scope.search) {
    //             self.SellerCardService.search(self.$scope.search)
    //                 .then(
    //                     (res) => {
    //                         if(!res.customers.length) {
    //                             let message = self.$filter('translate')('xhr.customer_search.nothing_found');
    //                             self.Flash.create('warning', message);
    //                         } else {
    //
    //                             let message = self.$filter('translate')('xhr.customer_search.success');
    //                             self.Flash.create('success', message);
    //                         }
    //                         self.$scope.customers = res.customers;
    //                     },
    //                     res => {
    //                         if (res.data.error && res.data.error == 'to many results') {
    //                             let message = self.$filter('translate')('xhr.customer_search.to_many_results');
    //                             self.Flash.create('danger', message);
    //                         } else {
    //                             self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
    //                             let message = self.$filter('translate')('xhr.customer_search.error');
    //                             self.Flash.create('danger', message);
    //                             self.$scope.customers = null;
    //                         }
    //                     }
    //                 );
    //         }
    //     } else {
    //         let message = self.$filter('translate')('xhr.customer_search.error');
    //         self.Flash.create('danger', message);
    //         self.$scope.validate = frontValidation;
    //     }
    // }
    //
    // assignPos(newPos) {
    //     let self = this;
    //
    //     self.SellerCardService.postPos(self.$scope.customer, newPos.posId)
    //         .then(
    //             res => {
    //                 let message = self.$filter('translate')('xhr.post_pos.success');
    //                 self.Flash.create('success', message);
    //                 self.getCustomerData();
    //                 self.showAvailablePosModal = false;
    //             },
    //             () => {
    //                 let message = self.$filter('translate')('xhr.post_pos.error');
    //                 self.Flash.create('danger', message);
    //             }
    //         )
    // }
    //
    // assignLevel(newLevel) {
    //     let self = this;
    //
    //     self.SellerCardService.postLevel(self.$scope.customer, newLevel.id)
    //         .then(
    //             res => {
    //                 let message = self.$filter('translate')('xhr.post_level.success');
    //                 self.Flash.create('success', message);
    //                 self.getCustomerData();
    //                 self.showAvailableLevelsModal = false;
    //             },
    //             () => {
    //                 let message = self.$filter('translate')('xhr.post_level.error');
    //                 self.Flash.create('danger', message);
    //             }
    //         )
    // }
}

SellerCustomerController.$inject = ['$scope', '$state', '$stateParams', 'SellerCardService', 'Flash', '$filter', 'DataService', 'Validation', 'EditableMap', '$q', 'ParamsMap', 'NgTableParams'];
