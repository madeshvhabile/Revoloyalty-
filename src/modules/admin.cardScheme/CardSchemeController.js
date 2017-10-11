export default class CardSchemeController {
    constructor($scope, $state, AuthService, CardSchemeService,MerchantService,GroupService, Flash, NgTableParams, $q, ParamsMap, $stateParams, EditableMap, DataService, Validation, $filter) {
        if (!AuthService.isGranted('ROLE_ADMIN')) {
            AuthService.logout();
        }
        this.$scope = $scope;
        this.CardSchemeService = CardSchemeService;
        this.MerchantService = MerchantService;
        this.GroupService = GroupService;
        this.$state = $state;
        this.Flash = Flash;
        this.$scope.newOrder = {};
        this.$scope.newCardscheme = {
            isGiftCardApplicable:false,
            isEGiftCardApplicable:false,
            giftCardSchemeData:{
                freecard:{
                    isSelected:false,
                    min:null,
                    max:null
                },
                crossborder:{
                    isSelected:false,
                    country:"SG",
                    min:null,
                    max:null
                }
            },
            isLoyaltyCardApplicable:false,
            isELoyaltyCardApplicable:false,
            loyaltyCardSchemeData:{
                rewardRedeem:{
                    isSelected:false
                },
                crossBorder:{
                    isSelected:false,
                    country:"SG"
                }
            }
        };
        this.$scope.editableFields = {};
        this.$scope.cardpreload='';
        this.preloadList=[];
        this.$scope.cardcat={}
        // this.$scope.gifcard;
        // this.$scope.loyaltycard;
        this.cardschemeId = $stateParams.cardschemeId || null;
        this.NgTableParams = NgTableParams;
        this.ParamsMap = ParamsMap;
        this.preload=[];
        this.$scope.schemaValidation={};
        this.EditableMap = EditableMap;
        this.countries = DataService.getCountries();
        this.$q = $q;
        this.Validation = Validation;
        this.$filter = $filter;
        this.config = DataService.getConfig();
        this.$scope.frontValidate = {
            name: '@assert:not_blank',
            identifier: '@assert:not_blank',
            location: {
                street: '@assert:not_blank',
                address1: '@assert:not_blank',
                Ordertal: '@assert:not_blank',
                city: '@assert:not_blank',
                province: '@assert:not_blank',
                country: '@assert:not_blank',
            }
        };

        this.countryConfig = {
            valueField: 'code',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField: 'name',
            maxItems: 1,
        };

        this.loaderStates = {
            OrderList: true,
            OrderDetails: true,
            coverLoader: true,
            cardSchemeList:true,
            cardSchemeDetails:true,
            deleteCardScheme:false
        };
        this.merchantConfig = {
            valueField: 'merchantId',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField:'name',
            maxItems: 1,
            };

        this.groupConfig = {
            valueField: 'groupId',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField:'name',
            maxItems: 1,
            };
    }

    getGroups(){
        let self=this;
        self.GroupService.getGroups()
        .then(
            res => {
                // self.schemeGroups=res;
                var  tempGroups = [];
                var length = res.total;
                if(length==0){
                  let message = "No groups present. Please add group to proceed..!" ;
                  self.Flash.create('danger', message);
                }
                for(var i=0; i<length ;i++)
                    if(res[i].active == "1")
                    tempGroups.push(res[i]);

                if(tempGroups.length==0&&length!=0){
                  let message = "No active groups present. Please add active group to proceed..!" ;
                  self.Flash.create('danger', message);
                }
                self.schemeGroups=tempGroups;
            },
            error => {
                let message = "Cannot fetch groups.Please try again later.";
                self.Flash.create('danger', message);
            }
        )
    }


    getMerchantsByGroup(selectedGroupId){
        let self=this;
        self.loaderStates.merchant=true;
        self.MerchantService.getMerchantsFromGroups(selectedGroupId)
        .then(
            res => {

                // self.schememerchants=res;

                var  tempMerchants = [];
                var length = res.total;
                if(length==0)
                {
                  let message = "No merchant present under selected group. Please add a merchant to proceed..!";
                  self.Flash.create('danger', message);
                }
                for(var i=0; i<length ;i++){
                    if(res[i].active == "1")
                    tempMerchants.push(res[i]);
                  }
                  if(tempMerchants.length==0&&length!=0)
                  {
                    let message = "No active merchant present under selected group. Please add a active merchant to proceed..!";
                    self.Flash.create('danger', message);
                  }
                self.schememerchants=tempMerchants;
                self.loaderStates.merchant=false;
            },
            error => {
                console.log("error")
                let message = "Cannot fetch merchants.Please try again later.";
                self.Flash.create('danger', message);
                self.loaderStates.merchant=false;
            }
        )
    }


    addCardScheme(newCardscheme){
        let self=this;
        self.$scope.schemaValidation={}
        if(self.$scope.newCardscheme.cardSchemeName == undefined || _.isNull(self.$scope.newCardscheme.cardSchemeName)){
            self.$scope.schemaValidation.cardSchemeName=[];
            self.$scope.schemaValidation.cardSchemeName.push('This field should not be empty')
        }
        if(self.$scope.newCardscheme.merchantId == undefined || _.isNull(self.$scope.newCardscheme.merchantId)){
            self.$scope.schemaValidation.merchant=[];
            self.$scope.schemaValidation.merchant.push('This field should not be empty')
        }
        if(self.$scope.cardcat.gifcard == true || self.$scope.cardcat.loyaltycard == true){
            if(self.$scope.cardcat.gifcard == true){
                if(self.preloadList.length || self.$scope.newCardscheme.giftCardSchemeData.freecard.isSelected || self.$scope.newCardscheme.giftCardSchemeData.crossborder.isSelected ){
                    if(!(self.$scope.newCardscheme.isGiftCardApplicable == true || self.$scope.newCardscheme.isEGiftCardApplicable == true)){

                       self.$scope.schemaValidation.cardtype=[];
                       self.$scope.schemaValidation.cardtype.push('Select any of the card type')

                   }
                    if( self.$scope.newCardscheme.giftCardSchemeData.freecard.isSelected ){
                    if(_.isNull(self.$scope.newCardscheme.giftCardSchemeData.freecard.min)){
                        self.$scope.schemaValidation.freemin=[];
                        self.$scope.schemaValidation.freemin.push("This field should not be empty")
                    }
                    else{
                        if(self.$scope.newCardscheme.giftCardSchemeData.freecard.min < 0){
                            self.$scope.schemaValidation.freemin=[];
                            self.$scope.schemaValidation.freemin.push("This Value should be greater than zero")
                        }
                        if(self.$scope.newCardscheme.giftCardSchemeData.freecard.min > 999999999){
                            self.$scope.schemaValidation.freemin=[];
                            self.$scope.schemaValidation.freemin.push("This Value should be less than 999999999")
                        }

                    }
                    if(_.isNull(self.$scope.newCardscheme.giftCardSchemeData.freecard.max)){
                        self.$scope.schemaValidation.freemax=[];
                        self.$scope.schemaValidation.freemax.push("This field should not be empty")
                    }
                    else{
                        if(self.$scope.newCardscheme.giftCardSchemeData.freecard.max < 0){
                            self.$scope.schemaValidation.freemax=[];
                            self.$scope.schemaValidation.freemax.push("This Value should be greater than zero")
                        }
                        if(self.$scope.newCardscheme.giftCardSchemeData.freecard.max > 999999999){
                            self.$scope.schemaValidation.freemax=[];
                            self.$scope.schemaValidation.freemax.push("This Value should be less than 999999999")
                        }

                    }
                    if(  !_.isNull(self.$scope.newCardscheme.giftCardSchemeData.freecard.max) && ! _.isNull(self.$scope.newCardscheme.giftCardSchemeData.freecard.min) ){
                        if(self.$scope.newCardscheme.giftCardSchemeData.freecard.max < self.$scope.newCardscheme.giftCardSchemeData.freecard.min){
                            self.$scope.schemaValidation.freemax=[];
                            self.$scope.schemaValidation.freemax.push("This field should not be less than Free Form Minimum value")
                        }
                    }
                  }
                  if( self.$scope.newCardscheme.giftCardSchemeData.crossborder.isSelected ){
                       if(_.isEmpty(self.$scope.newCardscheme.giftCardSchemeData.crossborder.country)){
                        self.$scope.schemaValidation.gcrossborder=[]
                        self.$scope.schemaValidation.gcrossborder.push("This field should not be empty")
                       }
                       if(_.isNull(self.$scope.newCardscheme.giftCardSchemeData.crossborder.min)){
                           self.$scope.schemaValidation.crossmin=[];
                           self.$scope.schemaValidation.crossmin.push("This field should not be empty")
                       }
                       else{
                           if(self.$scope.newCardscheme.giftCardSchemeData.crossborder.min < 0){
                               self.$scope.schemaValidation.crossmin=[];
                               self.$scope.schemaValidation.crossmin.push("This Value should be greater than zero")
                           }
                           if(self.$scope.newCardscheme.giftCardSchemeData.crossborder.min > 999999999){
                               self.$scope.schemaValidation.crossmin=[];
                               self.$scope.schemaValidation.crossmin.push("This Value should be less than 999999999")
                           }

                       }
                       if(_.isNull(self.$scope.newCardscheme.giftCardSchemeData.crossborder.max)){
                           self.$scope.schemaValidation.crossmax=[];
                           self.$scope.schemaValidation.crossmax.push("This field should not be empty")
                       }
                       else{
                           if(self.$scope.newCardscheme.giftCardSchemeData.crossborder.max < 0){
                               self.$scope.schemaValidation.crossmax=[];
                               self.$scope.schemaValidation.crossmax.push("This Value should be greater than zero")
                           }
                           if(self.$scope.newCardscheme.giftCardSchemeData.crossborder.max > 999999999){
                               self.$scope.schemaValidation.crossmax=[];
                               self.$scope.schemaValidation.crossmax.push("This Value should be less than 999999999")
                           }

                       }
                       if(  !_.isNull(self.$scope.newCardscheme.giftCardSchemeData.crossborder.max) && ! _.isNull(self.$scope.newCardscheme.giftCardSchemeData.crossborder.min) ){
                           if(self.$scope.newCardscheme.giftCardSchemeData.crossborder.max < self.$scope.newCardscheme.giftCardSchemeData.crossborder.min){
                               self.$scope.schemaValidation.crossmax=[];
                               self.$scope.schemaValidation.crossmax.push("This field should not be less than Cross Border Minimum value")
                           }
                       }
                }
                }else{
                    self.$scope.schemaValidation.gifcard=[];
                    self.$scope.schemaValidation.gifcard.push("Please select atleast one card type ")
                }

                }
            if(self.$scope.cardcat.loyaltycard == true){
               if(self.$scope.newCardscheme.loyaltyCardSchemeData.rewardRedeem.isSelected == true || self.$scope.newCardscheme.loyaltyCardSchemeData.crossBorder.isSelected == true){
                if(!(self.$scope.newCardscheme.isLoyaltyCardApplicable == true || self.$scope.newCardscheme.isELoyaltyCardApplicable == true)){

                   self.$scope.schemaValidation.lcardtype=[];
                   self.$scope.schemaValidation.lcardtype.push('Select any of the card type')

               }
                if(self.$scope.newCardscheme.loyaltyCardSchemeData.crossBorder.isSelected == true){
                    if(_.isEmpty(self.$scope.newCardscheme.loyaltyCardSchemeData.crossBorder.country)){
                        self.$scope.schemaValidation.lcrossborder=[]
                        self.$scope.schemaValidation.lcrossborder.push("This field should not be empty")
                       }
                }

               }else{
                self.$scope.schemaValidation.loyalty=[]
                self.$scope.schemaValidation.loyalty.push("Please select atleast one card type ")
               }


            }
        }else{
            self.$scope.schemaValidation.cardcategory=[];
              self.$scope.schemaValidation.cardcategory.push('Select any of the card type')
        }
       console.log(" self.$scope.schemaValidation", self.$scope.schemaValidation)
        if(_.isEmpty(self.$scope.schemaValidation)){
            self.createCardschme(self.$scope.newCardscheme)
        }

    }

    createCardschme(cardscheme){
        let self=this;
        if(self.preloadList.length){
            cardscheme.giftCardSchemeData.preload=self.preloadList
        }
     if(cardscheme.isEGiftCardApplicable == true){
         cardscheme.eGiftCardSchemeData=angular.copy(cardscheme.giftCardSchemeData)
     }
     if(cardscheme.isELoyaltyCardApplicable == true){
        cardscheme.eLoyaltyCardSchemeData=angular.copy(cardscheme.loyaltyCardSchemeData)
     }
     cardscheme.status="Activate"
     self.CardSchemeService.postCardscheme(cardscheme)
     .then(
         res =>{
             self.$state.go('admin.cardscheme-list');
             self.Flash.create('success', "Card scheme created successfully");
         },
         error =>{
            console.log("error",error)
            let message = 'Cannot create card scheme.Please try again later.';
            if(error.status==409)
            message = error.data.Error;
            self.Flash.create('danger', message);
         }
     )
    }


    addPreload(cardpreload){
        let self=this;

        if(cardpreload > 0 ){
            var idx = self.preloadList.indexOf(cardpreload);
            if(idx > -1){
                let message = 'Pre load Value already exits';
                self.Flash.create('danger', message);
                // self.$scope.newMerchant.billingMaster.moduleids.splice(idx, 1);
            }
            else{
                self.preloadList.push(cardpreload);
                self.$scope.cardpreload=''

            }
        }else{
            let message = 'Pre load Must have a positive value';
            self.Flash.create('danger', message);
        }


    }
    deletePreload(preload){
        let self=this;
        var idx = self.preloadList.indexOf(preload);
        if(idx > -1){
            // console.log("preload alread exits")
            self.preloadList.splice(idx, 1);
        }
    }

    showDeleteCardSchemeModel(selctedRow){
      let self=this;
      self.deleteCardScheme=selctedRow;
      self.showCardSchemeRemoveModal=true;
     };

    activateSchema(cardscheme){
        let self = this;
        self.loaderStates.coverLoader=true
        let status={"status" : "Approved"}
        self.CardSchemeService.deleteCardScheme(cardscheme.cardschemeId,status)
            .then(
                res => {


                    let deletedrow = _.findIndex(self.tableParams.settings().dataset, function (r) {
                        return r === cardscheme;
                    });
                    cardscheme.active = 1;
                    cardscheme.status = 'Activated'
                    angular.extend(self.tableParams.settings().dataset[deletedrow], cardscheme);
                    // _.remove(self.tableParams.settings().dataset, function (item) {
                    //     return self.deleteCardScheme === item;
                    // });
                    // self.tableParams.reload().then(function (data) {
                    //     if (data.length === 0 && self.tableParams.total() > 0) {
                    //         self.tableParams.page(self.tableParams.page() - 1);
                    //         self.tableParams.reload();
                    //     }
                    // });
                    self.loaderStates.coverLoader=false
                    let message = "Card scheme Activated successfully";
                    self.Flash.create('success', message);
                },
                ()=>{
                    let message = "Cannot delete card scheme,Please try again later";
                    self.Flash.create('danger', message);
                }
            )



    }


     deleteCardSchemeConfirm() {
       let self = this;
       self.loaderStates.deleteCardScheme = true;
       self.loaderStates.coverLoader=true
       let status={"status" : "Deactivated"}
       self.CardSchemeService.deleteCardScheme(self.deleteCardScheme.cardschemeId,status)
       .then(
           res =>{


              let deletedrow= _.findIndex(self.tableParams.settings().dataset, function(r){
                   return r === self.deleteCardScheme;
               });
               self.deleteCardScheme.active=0;
               self.deleteCardScheme.status='deactivated'
               angular.extend(self.tableParams.settings().dataset[deletedrow], self.deleteCardScheme);
               // _.remove(self.tableParams.settings().dataset, function (item) {
               //     return self.deleteCardScheme === item;
               // });
               // self.tableParams.reload().then(function (data) {
               //     if (data.length === 0 && self.tableParams.total() > 0) {
               //         self.tableParams.page(self.tableParams.page() - 1);
               //         self.tableParams.reload();
               //     }
               // });
               let message = "Card scheme Deactivated successfully";
               self.Flash.create('success', message);
               self.loaderStates.deleteCardScheme = false;
               self.loaderStates.coverLoader=false
               self.showCardSchemeRemoveModal=false;
           },
           ()=>{
               let message = "Cannot delete card scheme,Please try again later";
               self.Flash.create('danger', message);
               self.loaderStates.deleteCardScheme = false;
               self.showCardSchemeRemoveModal=false;
           }
       )



   }

    getCardSchemesListData() {

        let self = this;
          //let dfd = self.$q.defer();
          self.loaderStates.cardSchemeList = true;
          self.loaderStates
          self.jsonData;
          //self.ParamsMap.params(params.url())
          self.CardSchemeService.getCardSchemesList()
              .then(
                  res => {


                      self.$scope.cardSchemes = res;
                      this.cardSchemes=res;
                      // params.total(res.total);self.config.perPage
                      //dfd.resolve(res)
                      //console.log(self.$scope.merchants[1].MID);
                      var result = res;
                      self.tableParams = new self.NgTableParams({
                              count:self.config.perPage,
                              sorting: {
                                  created: 'desc'
                              }
                          }, {
                          dataset:result
                      });
                      self.loaderStates.cardSchemeList = false;
                      self.loaderStates.coverLoader = false;

                  },
                  () => {
                      let message = "Cannot get card schemes list. Please try again later.";
                      self.Flash.create('danger', message);
                      self.loaderStates.cardSchemeList = false;
                      self.loaderStates.coverLoader = false;
                      // dfd.reject();
                  }
              );

    }



    getCardSchemeData() {
        let self = this;
        self.loaderStates.cardSchemeDetails = true;

        if (self.cardschemeId) {
            self.$q.all([
                self.CardSchemeService.getCardScheme(self.cardschemeId)
                    .then(
                        res => {
                            self.$scope.cardscheme = res;
                            self.loaderStates.cardSchemeDetails = false;

                        },
                        () => {
                          let message = "Cannot get card scheme details";
                            self.Flash.create('danger', message);
                            self.loaderStates.cardSchemeDetails = false;
                        }
                    )
            ])

        }
    }

    // getOrderData() {
    //     let self = this;
    //     self.loaderStates.OrderDetails = true;

    //     if (self.OrderId) {
    //         self.CardSchemeService.getOrder(self.OrderId)
    //             .then(
    //                 res => {
    //                     self.$scope.Order = res;
    //                     self.$scope.editableFields = self.EditableMap.humanizeOrder(res);
    //                     self.loaderStates.OrderDetails = false;
    //                 },
    //                 () => {
    //                     let message = self.$filter('translate')('xhr.get_Order.error');
    //                     self.Flash.create('danger', message);
    //                     self.loaderStates.OrderDetails = false;
    //                 }
    //             )
    //     } else {
    //         self.$state.go('admin.Order-list');
    //         let message = self.$filter('translate')('xhr.get_Order.no_id');
    //         self.Flash.create('warning', message);
    //         self.loaderStates.OrderDetails = false;
    //     }
    // }

    // editOrder(editedOrder) {
    //     let self = this;
    //     let validateFields = angular.copy(self.$scope.frontValidate);
    //     let frontValidation = self.Validation.frontValidation(editedOrder, validateFields);
    //     self.loaderStates.OrderDetails = true;

    //     if (_.isEmpty(frontValidation)) {
    //         delete editedOrder.transactionsAmount
    //         delete editedOrder.transactionsCount
    //         self.CardSchemeService.putOrder(self.OrderId, editedOrder)
    //             .then(
    //                 res => {
    //                     let message = self.$filter('translate')('xhr.put_Order.success');
    //                     self.Flash.create('success', message);
    //                     self.$state.go('admin.Order-list')
    //                     self.loaderStates.OrderDetails = false;
    //                 },
    //                 res => {
    //                     self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
    //                     let message = self.$filter('translate')('xhr.put_Order.error');
    //                     self.Flash.create('danger', message);
    //                     self.loaderStates.OrderDetails = false;
    //                 }
    //             )
    //     } else {
    //         self.$scope.validate = frontValidation;
    //         let message = self.$filter('translate')('xhr.put_Order.error');
    //         self.Flash.create('danger', message);
    //         self.loaderStates.OrderDetails = false;
    //     }
    // }

    // addOrder(newOrder) {
    //     let self = this;
    //     let validateFields = angular.copy(self.$scope.frontValidate);
    //     let frontValidation = self.Validation.frontValidation(newOrder, validateFields);
    //     self.loaderStates.OrderDetails = true;

    //     if (_.isEmpty(frontValidation)) {
    //         self.CardSchemeService.OrdertOrder(newOrder)
    //             .then(
    //                 res => {
    //                     let message = self.$filter('translate')('xhr.Ordert_Order.success');
    //                     self.Flash.create('success', message);
    //                     self.$state.go('admin.Order-list')
    //                     self.loaderStates.OrderDetails = false;
    //                 },
    //                 res => {
    //                     self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
    //                     let message = self.$filter('translate')('xhr.Ordert_Order.error');
    //                     self.Flash.create('danger', message);
    //                     self.loaderStates.OrderDetails = false;
    //                 }
    //             );
    //     } else {
    //         self.$scope.validate = frontValidation;
    //         let message = self.$filter('translate')('xhr.Ordert_Order.error');
    //         self.Flash.create('danger', message);
    //         self.loaderStates.OrderDetails = false;
    //     }
    // }
}

CardSchemeController.$inject = ['$scope', '$state', 'AuthService', 'CardSchemeService','MerchantService','GroupService', 'Flash', 'NgTableParams', '$q', 'ParamsMap', '$stateParams', 'EditableMap', 'DataService', 'Validation', '$filter'];
