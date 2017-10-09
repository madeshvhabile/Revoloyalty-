export default class MerchantController {
    constructor($scope, $state, $stateParams, AuthService, MerchantService, Flash, EditableMap, NgTableParams, ParamsMap, $q, LevelService, Validation, $filter, DataService, PosService, TransferService) {
        if (!AuthService.isGranted('ROLE_ADMIN')) {
            $state.go('admin-login')
        }

              this.$scope = $scope;
              this.MerchantService = MerchantService;
              this.$scope.dateNow = new Date();

             this.$scope.newMerchant = {
                billingMaster:{
                    moduleids:[],
                    cycle:"Monthly",
                    method:"creditCard",
                    isbillingaddresssame:"true",
                    isgiftcardapplicable:false,
                    // giftpertxnfeepercent: 0,
                    // giftpertxnfeeamount:0,
                    // topuppertxnfeepercent: 0,
                    // topuppertxnfeeamount: 0,
                    isloyaltycardapplicable:false,
                    // loyaltypertxnfeeamount: 0,
                    // loyaltypertxnfeepercent:0,
                    status:'Approved',
                    },
                    merchantMaster:{
                        status:'Approved',
                        active:'1',

                    }
             };

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

              this.$scope.newStore = {
                status:"Approved",
                active:1,

              };
              this.$scope.newCategory = {
                active:1
                  };
              this.$scope.newGroup = {
                active:1
              };
              this.$scope.merchant={};
              this.$scope.showMerchantDetail=false;
              this.merchantValidation={
                Modules: '@assert:not_blank',
                billingCycle: '@assert:not_blank',
                billingMethod: '@assert:not_blank',
                transactionValue: '@assert:not_blank',
                noOfTransaction: '@assert:not_blank',
              },
              this.storeValidation={
                name: '@assert:not_blank|min-4|max-50',
                contactperson: '@assert:not_blank|min-4|max-25',
                noofterminals: '@assert:not_blank|max-3',
                email: '@assert:not_blank|max-50',
                postalcode: '@assert:not_blank|min-5|max-10',
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
              this.registerValidation={
                merchantId:'@assert:not_blank',
                name:'@assert:not_blank',
                contactno: '@assert:not_blank|min-6|max-15',
                email: '@assert:not_blank|max-50',
                active:'@assert:not_blank',
                plainPassword:'@assert:not_blank'
              },

              this.groupValidation={
                name: '@assert:not_blank|min-4|max-50',
                active: '@assert:not_blank',
              },

              this.catagoryValidation={
                name: '@assert:not_blank|min-4|max-50',
                active: '@assert:not_blank'
              },
              this.firstStepValidation={
                merchantcategorytype:'@assert:not_blank',
                active:'@assert:not_blank',
                name:'@assert:not_blank',
                roc:'@assert:not_blank',
                dba:'@assert:not_blank',
                bankaccno:'@assert:not_blank',
                bankname:'@assert:not_blank',
                country:'@assert:not_blank',
                address:'@assert:not_blank',
                //postalcode:'@assert:not_blank|min-5|max-10',
                city:'@assert:not_blank',
                contactno:'@assert:not_blank',
                email:'@assert:not_blank',
                group:'@assert:not_blank',
                //contactperson:'@assert:not_blank|min-4|max-25',
                postype:'@assert:not_blank',
                //bankcode:'@assert:not_blank',
                //branchcode:'@assert:not_blank',
                branchname:'@assert:not_blank',
                //swiftcode:'@assert:not_blank',

              },
            this.giftTransactionAmount={
                giftpertxnfeeamount:'@assert:not_blank',

            },
            this.giftTransactionValue={
                giftpertxnfeepercent:'@assert:not_blank|max-2',
            },
            this.topTransactionAmount={
                topuppertxnfeepercent:'@assert:not_blank|max-2',
            },
            this.topTransactionValue={
                topuppertxnfeeamount:'@assert:not_blank',
            },
            this.loyaltyTransactionAmount={
                loyaltypertxnfeepercent:'@assert:not_blank|max-2',
                },
            this.loyaltyTransactionValue={
                loyaltypertxnfeeamount:'@assert:not_blank',
                }
            this.billingValidation={
                cycle:'@assert:not_blank',
                method:'@assert:not_blank',
                moduleids:'@assert:not_blank',
                isbillingaddresssame:'@assert:not_blank'
            }
              this.$state = $state;
              this.AuthService = AuthService;
              this.Flash = Flash;
              this.EditableMap = EditableMap;

              this.merchantId = $stateParams.merchantId || null;
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
              this.groupConfig = {
                valueField: 'groupId',
                labelField: 'name',
                create: false,
                sortField: 'name',
                searchField:'name',
                maxItems: 1,
            };


              this.categoryConfig={
                valueField: 'categoryId',
                labelField: 'name',
                create: false,
                sortField: 'name',
                searchField:'name',
                maxItems: 1
              }
              this.postypeConfig={
                valueField: 'type',
                labelField: 'name',
                create: false,
                sortField: 'name',
                searchField:'name',
                maxItems: 1
              }
              this.loaderStates = {
                  customerTabs: true,
                  customerDetails: true,
                  merchantList: true,
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
                  deactivateMerchant: false,
                  deleteStore:false,
                  deleteMerchant:false
              }


              this.activeoption = [
                {
                    name: this.$filter('translate')('global.inactive'),
                    type: 0
                },
                {
                    name: this.$filter('translate')('global.active'),
                    type: 1
                }

            ];

            this.postype = [
                {
                    name: "E-Commerce",
                    type: "E-Commerce"
                },
                {
                    name: "Retail",
                    type: "Retail"
                },
                {
                    name: "Both",
                    type: "Both"
                }
            ];

              this.Modules=[{
                id:1,
                name:'Broadcast (SMS)'
            },
            {
              id:2,
              name:'In-app Push Notification'
          },
          {
              id:3,
              name:'SMS Activation'
          },
          {
              id:4,
              name:'Loyalty Campaigns'
          },
          {
              id:5,
              name:'Gift Card Reload'
          },
          {
              id:6,
              name:'CRM'
          },
          {
              id:7,
              name:'EDM'
          },
          {
              id:8,
              name:'Gift Card Conversion to Loyalty'
          }
          ]

              this.activeConfig = {
                  valueField: 'type',
                  labelField: 'name',
                  create: false,
                  sortField: 'name',
                  maxItems: 1
              };

              this.merchantConfig={
                valueField: 'merchantId',
                labelField: 'name',
                create: false,
                sortField: 'name',
                searchField:'name',
                maxItems: 1
              }

            this.storeList=[];
            this.storeTableParams = new this.NgTableParams({
              count: this.config.perPage,
              sorting: {
                created: 'desc'
              }
          }, {dataset:this.storeList})
          }
          stepOnevalidation(newMerchant){
                let self=this;
                let validateFields={};
                if(!_.isEmpty(newMerchant.alternatecontactno)){
                    self.firstStepValidation.alternatecontactno = '@assert:min-6|max-15';
                }else{
                    delete self.firstStepValidation.alternatecontactno;
                }
                validateFields.merchantMaster= angular.copy(self.firstStepValidation);
                let frontValidation = self.Validation.frontValidation(newMerchant, validateFields);

                let message = self.$filter('translate')('xhr.post_customer.error');
                self.$scope.validate = frontValidation;
                console.log('newMerchant', validateFields);
                console.log('stepOnevalidation',frontValidation);
                if(!(_.isEmpty(frontValidation))){
                        self.Flash.create('danger', message);
                }
                else{
                    $( ".tabs li:nth-child(1)" ).removeClass( "is-active" );
                    $( ".tabs li:nth-child(2)" ).addClass( "is-active" );
                    $( "#panel2c" ).addClass( "is-active" ).attr("aria-hidden","false");
                    $( "#panel1c" ).removeClass( "is-active" ).attr("aria-hidden","true");

               }
            }
            backTostepOne(){
                $( ".tabs li:nth-child(1)" ).addClass( "is-active" );
                $( ".tabs li:nth-child(2)" ).removeClass( "is-active" );
                $( "#panel2c" ).removeClass( "is-active" ).attr("aria-hidden","true");
                $( "#panel1c" ).addClass( "is-active" ).attr("aria-hidden","false");
            }
          closeModal(){
              let self=this;
            self.$scope.newStore={};
            self.$scope.storeValidate={};
              this.linkAddStoreModal=false;
          };
          closedeleteModal() {
            this.showMerchantRemoveModal=false;
            }
          openModal(){
              let self=this
              console.log("here")
          self.$scope.newStore={};
          self.$scope.storeValidate={};
          self.linkAddStoreModal = true
          }
          openCategory(){
            let self=this
            console.log("here")
            self.$scope.categoryValidate={}
            self.$scope.newCategory={}
        self.linkAddCategoryModal = true


        }
          openGroup(){
              let self=this;
              self.$scope.newGroup={}
              self.$scope.groupValidate={}
              self.linkAddGroupModal=true;
          }
          closeGroup(){
              let self=this;
              self.$scope.newGroup={};
              self.$scope.groupValidate={};
              self.linkAddGroupModal=false;
          }
          closeCatagory(){
            let self=this;
            self.$scope.categoryValidate={};
            self.$scope.newCategory={};
            self.linkAddCategoryModal=false;
          }
          showDeleteStoreModel(store){
           let self=this;
           self.deleteStore=store
           self.showStoreRemoveModal=true;
          };

          showDeleteMerchantModel(selctedRow){
            let self=this;
            self.deleteMerchant=selctedRow
            self.showMerchantRemoveModal=true;
           };


          deleteStoreConform(){
              let self=this;
              self.loaderStates.deleteStore=true;
              var idx = self.storeList.indexOf(self.deleteStore);
              self.storeList.splice(idx, 1);
              this.storeTableParams = new this.NgTableParams({
                  count: this.config.perPage,
                  sorting: {
                    created: 'desc'
                  }
              }, {dataset:self.storeList})
              self.loaderStates.deleteStore=false;
              self.showStoreRemoveModal=false;
          }
          toggleSelection(id){
              let self=this;
              console.log("self.$scope.newMerchant.moduleids",self.$scope.newMerchant.billingMaster.moduleids)
              var idx = self.$scope.newMerchant.billingMaster.moduleids.indexOf(id);
              if(idx > -1){
                  self.$scope.newMerchant.billingMaster.moduleids.splice(idx, 1);
              }
              else{
                  self.$scope.newMerchant.billingMaster.moduleids.push(id);
              }
          }

          deleteMerchantConform() {
            let self = this;
            self.loaderStates.deleteMerchant = true;
            self.MerchantService.deleteMerchant(self.deleteMerchant.merchantId)
            .then(
                res =>{

                    _.remove(self.tableParams.settings().dataset, function (item) {
                        return self.deleteMerchant === item;
                    });
                    self.tableParams.reload().then(function (data) {
                        if (data.length === 0 && self.tableParams.total() > 0) {
                            self.tableParams.page(self.tableParams.page() - 1);
                            self.tableParams.reload();
                        }
                    });
                    let message = "Merchant Deleted Successfully";
                    self.Flash.create('success', message);
                    self.loaderStates.deleteMerchant = false;
                    self.showMerchantRemoveModal=false;
                }
            ),
             ()=>{
                let message = "Cannot Delete Merchant,Please Try Again Later";
                self.Flash.create('danger', message);
                self.loaderStates.deleteMerchant = false;
                self.showMerchantRemoveModal=false;
            }


        }
          checkGiftCheck(param){
              let self= this;
            if(!param){
                self.$scope.newMerchant.billingMaster.isgiftcardapplicable=false
            }
            else{
                self.$scope.newMerchant.GtransactionRadio = "total";
                self.$scope.newMerchant.topupTransactionRadio="topCount"
               this.checkCheckedRadio( self.$scope.newMerchant.GtransactionRadio);
               this.checkCheckedtopRadio(self.$scope.newMerchant.topupTransactionRadio);
            }
          }

          checkLoyaltyCheck(param){
            let self= this;
            if(!param){
                self.$scope.newMerchant.billingMaster.isloyaltycardapplicable=false
            }
            else{
                self.$scope.newMerchant.LtransactionRadio="LCount";
               this.checkCheckedLoyaltyRadio(self.$scope.newMerchant.LtransactionRadio);
            }
          }



          checkCheckedLoyalty(param){
            let self =this;
            if(param==true){
                newMerchant.LtransactionRadio="LCount";
            }
            else{
                newMerchant.LtransactionRadio='';
            }
          }


          checkCheckedRadio(param){
            let self =this;
            if(param=="total"){

                self.$scope.showText=true ;
                }
                else{
                    self.$scope.showText=false;
                }

                if(param=="value"){
                    self.$scope.showValue=true ;
                }
                else{
                    self.$scope.showValue=false;

                }
            }
                checkCheckedtopRadio(param){
                    let self =this;
                    if(param=="topCount"){

                        self.$scope.showTopupTotal=true ;
                        }
                        else{
                            self.$scope.showTopupTotal=false ;
                        }
                     if(param=="topValue"){

                     self.$scope.showTopupValue=true ;
                      }
                      else{
                        self.$scope.showTopupValue=false ;
                      }
                }

               checkCheckedLoyaltyRadio(param){
                let self =this;
                  if(param=="LCount"){

                    self.$scope.showLTotal=true ;
                    }
                    else{
                        self.$scope.showLTotal=false ;
                    }
                 if(param=="LValue"){

                 self.$scope.showLValue=true ;
                  }
                  else{
                    self.$scope.showLValue=false ;
                  }
            }



            editToggleSelection(id){
            let self=this;
            console.log(typeof self.$scope.editMerchant.billingMaster.moduleids)
            var idx = self.$scope.editMerchant.billingMaster.moduleids.indexOf(id);
            if(idx > -1){
                self.$scope.editMerchant.billingMaster.moduleids.splice(idx, 1);
            }
            else{
                self.$scope.editMerchant.billingMaster.moduleids.push(id);
            }
        }
              getData(){
                  let self = this;
                    //let dfd = self.$q.defer();
                    self.loaderStates.merchantList = true;
                    self.jsonData;
                    //self.ParamsMap.params(params.url())
                    self.MerchantService.getMerchants()
                        .then(
                            res => {

                                self.loaderStates.merchantList = false;
                                self.loaderStates.coverLoader = false;
                                self.$scope.merchants = res;
                                //self.merchants=res;
                                this.merchants=res;
                                // params.total(res.total);self.config.perPage
                                //dfd.resolve(res)
                                //console.log(self.$scope.merchants[1].MID);
                                var result = res;
                                self.tableParams = new self.NgTableParams({
                                        count: self.config.perPage,
                                        sorting: {
                                            created: 'desc'
                                        }
                                    }, {
                                    dataset:result
                                });

                            },
                            () => {
                                let message = "Cannot get MerchantList";
                                self.Flash.create('danger', message);
                                self.loaderStates.merchantList = false;
                                self.loaderStates.coverLoader = false;
                                // dfd.reject();
                            }
                        );

              }


              getGroup() {
                let self = this;
                        //let dfd = self.$q.defer();
                        //self.ParamsMap.params(params.url())

                        self.MerchantService.getGroups()
                            .then(
                                res => {
                                    console.log("res",res)
                                    self.loaderStates.coverLoader = false;
                                    var  tempGroups = [];
                                    var length = res.total
                                    for(var i=0; i<length ;i++){
                                        var groupname=res[i].name;
                                        if(res[i].active == "1"){
                                        tempGroups.push({name:groupname ,groupId:res[i].groupId});
                                    }
                                }
                                    this.groups=tempGroups;
                                    console.log(this.groups);
                                },
                                () => {
                                    let message = "Cannot get GroupList";
                                    self.Flash.create('danger', message);
                                    self.loaderStates.coverLoader = false;
                                   // dfd.reject();
                                }
                            );
            }

              getMerchantData() {
                  let self = this;

                  self.loaderStates.merchantDetails = true;

                  if (self.merchantId) {
                      self.$q.all([
                          self.MerchantService.getMerchant(self.merchantId)
                              .then(
                                  res => {
                                    self.$scope.merchant = res;
                                    self.viewModules=[]
                                    let modulesarray=res.billing.moduleids.split(',')
                                    for(var i=0;i<modulesarray.length;i++){
                                     let idx= _.findIndex(self.Modules, function(o) { return o.id ==modulesarray[i] ; });
                                     if(idx > -1)
                                     self.viewModules.push(self.Modules[idx])
                                    }
                                    self.loaderStates.merchantDetails = false;

                                  },
                                  () => {
                                    let message = "Cannot get Merchant Details";
                                      self.Flash.create('danger', message);
                                      self.loaderStates.merchantDetails = false;
                                  }
                              )
                      ])

                  }
              }

              getMerchantDateils(merchantId){
                  let self =this;
               let detail =_.find(self.merchants, ['merchantId',merchantId]);
               self.$scope.merchant={
                   name:detail.name,
                   active:detail.active,
                   email:detail.email,
                   contactno:detail.contactno

               }
               self.$scope.merchant.merchantId =merchantId;
               self.$scope.showMerchantDetail=true;
              }


            getCatagory () {
                let self = this;
                        //let dfd = self.$q.defer();
                        //self.ParamsMap.params(params.url())

                        self.MerchantService.getCatagory()
                            .then(
                                res => {

                                    self.loaderStates.coverLoader = false;
                                  console.log('categoryRes',res);
                                    var length = res.total
                                    var tempCategory =[];
                                    for(var i=0; i<length ;i++){
                                        var name=res[i].name;
                                        if(res[i].active == 1){
                                            console.log("active");

                                        tempCategory.push({name:res[i].name ,categoryId:res[i].categoryId});
                                       }
                                    }
                                       this.categorys=tempCategory;
                                    console.log(self.$scope.categorys);

                                },
                                () => {
                                    let message = "Cannot get CategoryList";
                                    self.Flash.create('danger', message);

                                    self.loaderStates.coverLoader = false;
                                   // dfd.reject();
                                }
                            );
            };


            getStore () {
                let self = this;
                        //let dfd = self.$q.defer();
                        //self.ParamsMap.params(params.url())
                        self.loaderStates.storeList = true
                        self.MerchantService.getStore(self.merchantId)
                            .then(
                                res => {
                                    self.loaderStates.storeList = false
                                    self.loaderStates.coverLoader = false;
                                    self.$scope.storeList = res.store;
                                    //params.total(res.total);
                                    //dfd.resolve(res)
                                    self.storetableParams = new self.NgTableParams({
                                        count: self.config.perPage,
                                        sorting: {
                                            created: 'desc'
                                        }
                                    }, {
                                        dataset:  self.$scope.storeList


                                    });
                                },
                                () => {
                                    let message = "Cannot get StoreList";
                                    self.Flash.create('danger', message);
                                    self.loaderStates.storeList = false;
                                    self.loaderStates.coverLoader = false;
                                   // dfd.reject();
                                }
                            );
            };



              getAvailableGroup() {
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

              getAvailableCategory(){
                  let self = this;

                  self.loaderStates.customerPOS = true;

                  self.PosService.getPosList()
                      .then(
                          res => {
                              self.$scope.availablePos = res;
                              self.posList = res;
                              self.loaderStates.customerPOS = false;
                          },
                          () => {
                              let message = self.$filter('translate')('xhr.get_pos_list.error');
                              self.Flash.create('danger', message);
                              self.loaderStates.customerPOS = false;
                          }
                      )
              }



              addMerchant(newMerchant) {

                let self = this;
                let validateFields={};
                let array ={};
                let addressValidation ={
                    country : angular.copy(self.firstStepValidation.country),
                    city:angular.copy(self.firstStepValidation.country),
                    address:angular.copy(self.firstStepValidation.address),
                    postalcode:angular.copy(self.firstStepValidation.postalcode),
                };
                if(newMerchant.billingMaster.isbillingaddresssame=='false'){
                      array=  _.merge(array, addressValidation);
                }

                array=  _.merge(array, self.billingValidation);
                if(newMerchant.GtransactionRadio=="total"){
                    array=  _.merge(array, self.giftTransactionAmount);
                }
                else if(newMerchant.GtransactionRadio =="value") {
                    array= _.merge(array, self.giftTransactionValue);

                }

                if(newMerchant.topupTransactionRadio=="topCount"){
                    array=  _.merge(array, self.topTransactionAmount);

                }
                else if(newMerchant.topupTransactionRadio =="topValue"){
                    array= _.merge(array, self.topTransactionValue);

                }
                if(newMerchant.LtransactionRadio=="LCount"){
                    array= _.merge(array, self.loyaltyTransactionAmount);

                }
                else if(newMerchant.LtransactionRadio =="LValue"){
                    array= _.merge(array, self.loyaltyTransactionValue);

                }
                validateFields.billingMaster =  array;
                console.log(validateFields);
                let checked ;
                let frontValidation = self.Validation.frontValidation(newMerchant, validateFields);
                if ($(".checkbox-group input[type=checkbox]:checked").length === 0) {
                    $(".checkbox-group .form-error").css("display", "block");
                     checked =false;
                }
                else{
                    checked =true;
                    $(".checkbox-group .form-error").css("display", "none");;
                }
                let booleanCheck;
                if(newMerchant.billingMaster.isgiftcardapplicable){
                    if (!(newMerchant.hasOwnProperty("GtransactionRadio"))){
                     $(".giftcard").css("display", "block");
                     booleanCheck =false;
                    }
                    else{
                     booleanCheck =true;

                        $(".giftcard").css("display", "none");
                    }
                    if(!(newMerchant.hasOwnProperty("topupTransactionRadio"))){
                     booleanCheck =false;

                        $(".topup").css("display", "block");
                    }
                    else{
                     booleanCheck =true;

                        $(".topup").css("display", "none");
                    }
                }
                if(newMerchant.billingMaster.isloyaltycardapplicable){
                    if(!(newMerchant.hasOwnProperty("LtransactionRadio"))){
                     booleanCheck =false;

                        $(".loyaltyCard").css("display", "block");
                     }
                     else{
                     booleanCheck =true;

                        $(".loyaltyCard").css("display", "none");
                     }
                }

                     if (_.isEmpty(frontValidation) && checked && booleanCheck) {
                    console.log('self.$scope.oldMerchant ',self.$scope.oldMerchant );
                    console.log(typeof self.$scope.oldMerchant );
                    console.log(typeof newMerchant );
                   if( _.isEmpty(self.storeList)){
                        $( ".tabs li:nth-child(1)" ).addClass( "is-active" );
                        $( ".tabs li:nth-child(2)" ).removeClass( "is-active" );
                        $( "#panel2c" ).removeClass( "is-active" ).attr("aria-hidden","true");
                        $( "#panel1c" ).addClass( "is-active" ).attr("aria-hidden","false");
                        let message = 'Please add store to continue...';
                        self.Flash.create('danger', message);
                    }
                    else{

                       // else{
                            if(newMerchant.billingMaster.isbillingaddresssame){
                                newMerchant.billingMaster.address = newMerchant.merchantMaster.address;
                                newMerchant.billingMaster.country = newMerchant.merchantMaster.country;
                                newMerchant.billingMaster.city = newMerchant.merchantMaster.city;
                                newMerchant.billingMaster.postalcode = newMerchant.merchantMaster.postalcode;
                            }

                            newMerchant.billingMaster.moduleids = newMerchant.billingMaster.moduleids.toString();
                            newMerchant.merchantMaster.status = "Approved" ;
                            if(!(newMerchant.merchantMaster.hasOwnProperty('alternatecontactno'))){
                                newMerchant.merchantMaster.alternatecontactno="";
                            }

                            if(self.$scope.showValue == false ){
                               delete newMerchant.billingMaster.giftpertxnfeepercent
                            }
                            if(self.$scope.showText == false ){
                              delete  newMerchant.billingMaster.giftpertxnfeeamount
                            }
                            if(self.$scope.showTopupTotal == false ){
                                delete newMerchant.billingMaster.topuppertxnfeepercent
                            }
                            if(self.$scope.showTopupValue == false ){
                               delete newMerchant.billingMaster.topuppertxnfeeamount
                            }
                            if(self.$scope.showLValue == false ){
                                delete newMerchant.billingMaster.loyaltypertxnfeeamount
                            }
                            if(self.$scope.showLTotal == false ){
                                delete newMerchant.billingMaster.loyaltypertxnfeepercent
                            }


                            self.MerchantService.postMerchant(newMerchant)
                                .then(
                                    res => {
                                        console.log("merchantRes",res);

                                         self.MerchantService.postStore(self.storeList,res.merchantId).then(
                                            res =>{
                                                self.$state.go('admin.merchant-list');
                                                let message = "Merchant Added Successfully";
                                                self.Flash.create('success', message);
                                            },
                                            res => {
                                                self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                                                let message = "Something went Wrong,Store Cannot Create";
                                                self.Flash.create('danger', message);
                                            }
                                        )

                                    },
                                    res => {
                                        self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                                        let message = "Something went Wrong,Merchant Cannot Create";
                                        self.Flash.create('danger', message);
                                    }
                                )
                           // }
                    }
                } else {
                    let message = self.$filter('translate')('xhr.post_customer.error');
                    self.Flash.create('danger', message);
                    self.$scope.validate = frontValidation;
                }
            }

              saveEditMerchant(editMerchant) {


                let self = this;
                let validateFields={};
                let array ={};
                let addressValidation ={
                    country : angular.copy(self.firstStepValidation.country),
                    city:angular.copy(self.firstStepValidation.country),
                    address:angular.copy(self.firstStepValidation.address),
                    postalcode:angular.copy(self.firstStepValidation.postalcode),
                };
                if(editMerchant.billingMaster.isbillingaddresssame=='false'){
                      array=  _.merge(array, addressValidation);
                }

                array=  _.merge(array, self.billingValidation);
                if(editMerchant.GtransactionRadio=="total"){
                    array=  _.merge(array, self.giftTransactionAmount);
                }
                else if(editMerchant.GtransactionRadio =="value") {
                    array= _.merge(array, self.giftTransactionValue);

                }

                if(editMerchant.topupTransactionRadio=="topCount"){
                    array=  _.merge(array, self.topTransactionAmount);

                }
                else if(editMerchant.topupTransactionRadio =="topValue"){
                    array= _.merge(array, self.topTransactionValue);

                }
                if(editMerchant.LtransactionRadio=="LCount"){
                    array= _.merge(array, self.loyaltyTransactionAmount);

                }
                else if(editMerchant.LtransactionRadio =="LValue"){
                    array= _.merge(array, self.loyaltyTransactionValue);

                }
                if(editMerchant.billingMaster.isloyaltycardapplicable == undefined){
                    editMerchant.billingMaster.isloyaltycardapplicable=false
                }
                if(editMerchant.billingMaster.isgiftcardapplicable == undefined){
                    editMerchant.billingMaster.isgiftcardapplicable=false
                }
                validateFields.billingMaster =  array;
                console.log(validateFields);
                let checked ;
                let frontValidation = self.Validation.frontValidation(editMerchant, validateFields);
                if ($(".checkbox-group input[type=checkbox]:checked").length === 0) {
                    $(".checkbox-group .form-error").css("display", "block");
                     checked =false;
                }
                else{
                    checked =true;
                    $(".checkbox-group .form-error").css("display", "none");;
                }
                if (_.isEmpty(frontValidation) && checked) {
                    // console.log('self.$scope.oldMerchant ',self.$scope.oldMerchant );
                    // console.log(typeof self.$scope.oldMerchant );
                    // console.log(typeof editMerchant );
                   /* if( _.isEmpty(self.storeList)){
                        $( ".tabs li:nth-child(1)" ).addClass( "is-active" );
                        $( ".tabs li:nth-child(2)" ).removeClass( "is-active" );
                        $( "#panel2c" ).removeClass( "is-active" ).attr("aria-hidden","true");
                        $( "#panel1c" ).addClass( "is-active" ).attr("aria-hidden","false");
                        let message = 'Please add store to continue...';
                        self.Flash.create('danger', message);
                    }*/
                    //else{
                        console.log("Edit Change Merchant",editMerchant.merchantMaster);
                        editMerchant.merchantMaster.active=parseInt( editMerchant.merchantMaster.active)
                        if(_.isEqual(self.$scope.oldMerchant , editMerchant)){

                            let message = 'No change to save';
                            self.Flash.create('danger', message);
                        }
                        else{
                            if(editMerchant.billingMaster.isbillingaddresssame !="false"){
                                editMerchant.billingMaster.address = editMerchant.merchantMaster.address;
                                editMerchant.billingMaster.country = editMerchant.merchantMaster.country;
                                editMerchant.billingMaster.city = editMerchant.merchantMaster.city;
                                editMerchant.billingMaster.postalcode = editMerchant.merchantMaster.postalcode;
                            }
                            if(!(editMerchant.merchantMaster.hasOwnProperty('alternatecontactno'))){
                                editMerchant.merchantMaster.alternatecontactno="";
                            }

                             editMerchant.billingMaster.moduleids = editMerchant.billingMaster.moduleids.toString();


                             if(self.$scope.showValue == false ){
                               delete editMerchant.billingMaster.giftpertxnfeepercent
                            }
                            if(self.$scope.showText == false ){
                              delete  editMerchant.billingMaster.giftpertxnfeeamount
                            }
                            if(self.$scope.showTopupTotal == false ){
                                delete editMerchant.billingMaster.topuppertxnfeepercent
                            }
                            if(self.$scope.showTopupValue == false ){
                               delete editMerchant.billingMaster.topuppertxnfeeamount
                            }
                            if(self.$scope.showLValue == false ){
                                delete editMerchant.billingMaster.loyaltypertxnfeeamount
                            }
                            if(self.$scope.showLTotal == false ){
                                delete editMerchant.billingMaster.loyaltypertxnfeepercent
                            }

                            self.MerchantService.putMerchant(editMerchant)
                                .then(
                                    res => {
                                        self.$state.go('admin.merchant-list');
                                        let message = "Merchant Updated Successfully";
                                        self.Flash.create('success', message);

                                    },
                                    res => {
                                        self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                                        let message = "Something went wrong!Please try again later";
                                        self.Flash.create('danger', message);
                                    }
                                )
                            }
                    //}
                } else {
                    let message = self.$filter('translate')('xhr.post_customer.error');
                    self.Flash.create('danger', message);
                    self.$scope.validate = frontValidation;
                }
            }


              addStore(newStore) {
                console.log("enter to submit",newStore)
                let self = this;
                newStore.status="Approved";
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
                var altconno =!_.isNull(newStore.alternatecontactno);
                console.log(altconno);
                var altconno1 =!_.isEmpty(newStore.alternatecontactno);
                console.log(altconno1);
                if((newStore.alternatecontactno != undefined) &&  (!_.isNull(newStore.alternatecontactno))){
                    self.storeValidation.alternatecontactno = '@assert:min-6|max-15';
                }else{
                    delete self.storeValidation.alternatecontactno;
                }

                let validateFields = angular.copy(self.storeValidation);
                let frontValidation = self.Validation.frontValidation(newStore, validateFields);
                console.log("frontValidation",frontValidation)
                if (_.isEmpty(frontValidation)) {
                    self.storeList.push(newStore)
                    console.log("self.storeList",self.storeList)
                    this.storeTableParams = new this.NgTableParams({
                        count: this.config.perPage,
                        sorting: {
                            created: 'desc'
                        }
                    }, {dataset:self.storeList})
                    console.log("table",self.storeTableParams)
                    let message = "Store Added Successfully ";
                     self.Flash.create('success', message);
                    this.closeModal()
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
                    let message = self.$filter('translate')('xhr.post_customer.error');
                    self.Flash.create('danger', message);
                    self.$scope.storeValidate = frontValidation;
                }
            }


            addGroup(newGroup,newMerchant){
                console.log("new ",newGroup,newMerchant)
                let self=this
                let idx;
                let validateFields = angular.copy(self.groupValidation);
                let frontValidation = self.Validation.frontValidation(newGroup, validateFields);
                if(newGroup.name == undefined || newGroup.active == undefined){
                     idx=-1
                }
                else{
                     idx= _.findIndex(self.groups, function(o) { return o.name == newGroup.name; });
                }
                if(!(idx > -1)){
                if (!_.isEmpty(frontValidation)) {
                    self.$scope.groupValidate = frontValidation;
                }
               else{
                 self.MerchantService.postGroup(newGroup)
                 .then(
                     res=>{
                    if(newGroup.active == "1"){
                     self.groups.push({name:res.groupname,groupId:res.groupId})
                     }
                    //  newMerchant.merchantMaster={
                    //      group : res.groupId
                    //  }

                     self.$scope.groupValidate = {};
                     let message = 'Group Added successfully';
                     self.linkAddGroupModal = false
                     self.Flash.create('success', message);

                     },
                     (error)=>{
                        let message = 'Something Went wrong Please Try again later';
                        self.Flash.create('danger', message);
                     }
                )
                 }
               }
               else{
                let message = 'Group Name Already Exists';
                self.Flash.create('danger', message);
               }
            }

            addCategory(newCatagory,newMerchant){
                console.log('newde',newMerchant)
                let self=this
                let idx;


                if((newCatagory.categorycode != undefined) &&  (!_.isNull(newCatagory.categorycode))){
                    self.catagoryValidation.categorycode = '@assert:min-1|max-8';
                }else{
                    delete self.catagoryValidation.categorycode;
                }

                let validateFields = angular.copy(self.catagoryValidation);
                let frontValidation = self.Validation.frontValidation(newCatagory, validateFields);
                if(newCatagory.name == undefined || newCatagory.active == undefined){
                     idx=-1
                }
                else{
                    idx= _.findIndex(self.categorys, function(o) { return o.name == newCatagory.name; });
                }
                if(!(idx > -1)){
                if (!_.isEmpty(frontValidation)) {
                    self.$scope.categoryValidate = frontValidation;
                }
               else{

                 self.MerchantService.postCategory(newCatagory)
                 .then(
                     res=>{
                         newCatagory.categoryId=res.categoryId;

                         if(newCatagory.active == "1"){
                             console.log("push activated category ");

                         self.categorys.push({name:res.categoryname,categoryId:res.categoryId});
                         }

                         self.$scope.categoryValidate = {};

                     let message = 'New Category  Added successfully';
                     self.linkAddCategoryModal = false
                     self.Flash.create('success', message);

                     },
                     (error)=>{
                        let message = 'Something Went wrong Please Try again later';
                        self.Flash.create('danger', message);
                     }
                )
                 }
               }
               else{
                let message = 'Category Name is Already Exists';
                self.Flash.create('danger', message);
               }
            }


            editMerchant() {
                let self = this;

                self.loaderStates.merchantDetails = true;

                if (self.merchantId) {
                    self.$q.all([
                        self.MerchantService.getMerchant(self.merchantId)
                            .then(
                                res => {
                                    self.$scope.merchants = res;
                                    let merchantDetail=res;
                                    console.log('self.$scope.merchants',self.$scope.merchants);
                                    self.loaderStates.merchantDetails = false;

                                    self.$scope.editMerchant={
                                      merchantId:self.merchantId,
                                      merchantMaster:{
                                          merchantcategorytype:merchantDetail.category,
                                          active:merchantDetail.active,
                                          city:merchantDetail.city,
                                          postype:merchantDetail.postype,
                                          name:merchantDetail.name,
                                          roc:merchantDetail.roc,
                                          dba:merchantDetail.dba,
                                          bankaccno:merchantDetail.bankaccno,
                                          bankname:merchantDetail.bankname,
                                          swiftcode:merchantDetail.swiftcode,
                                          branchcode:merchantDetail.branchcode,
                                          bankcode:merchantDetail.bankcode,
                                          branchname:merchantDetail.branchname,
                                          country:merchantDetail.country,
                                          address:merchantDetail.address,
                                          postalcode:merchantDetail.postalcode,
                                          contactno:merchantDetail.contactno,
                                          email:merchantDetail.email,
                                          group:merchantDetail.groupid,
                                          contactperson:merchantDetail.contactperson,
                                          alternatecontactno:merchantDetail.alternatecontactno,
                                          status:'Approved'
                                      },
                                      billingMaster:{
                                          moduleids:JSON.parse("[" + merchantDetail.billing.moduleids + "]"),
                                          cycle:merchantDetail.billing.cycle,
                                          method:merchantDetail.billing.method,
                                          isbillingaddresssame:merchantDetail.billing.isbillingaddresssame.toString(),
                                          country:merchantDetail.billing.country,
                                          address:merchantDetail.billing.address,
                                          postalcode:merchantDetail.billing.postalcode,
                                          isgiftcardapplicable: merchantDetail.billing.isgiftcardapplicable,
                                          giftpertxnfeepercent: merchantDetail.billing.giftpertxnfeepercent,
                                          giftpertxnfeeamount: merchantDetail.billing.giftpertxnfeeamount,
                                          topuppertxnfeepercent: merchantDetail.billing.topuppertxnfeepercent,
                                          topuppertxnfeeamount: merchantDetail.billing.topuppertxnfeeamount,
                                          isloyaltycardapplicable: merchantDetail.billing.isloyaltycardapplicable,
                                          loyaltypertxnfeepercent: merchantDetail.billing.loyaltypertxnfeepercent,
                                          loyaltypertxnfeeamount: merchantDetail.billing.loyaltypertxnfeeamount,
                                          status: 'Approved'
                                      }


                                  }

                                  if(merchantDetail.billing.giftpertxnfeepercent != undefined){
                                       self.$scope.showValue=true ;
                                      self.$scope.editMerchant.GtransactionRadio="value";
                                  }
                                  else if(merchantDetail.billing.giftpertxnfeeamount !=undefined){
                                      self.$scope.showText=true ;
                                      self.$scope.editMerchant.GtransactionRadio="total"
                                  }
                                  if(merchantDetail.billing.topuppertxnfeepercent!=undefined){
                                      self.$scope.showTopupTotal=true ;
                                      self.$scope.editMerchant.topupTransactionRadio="topCount"
                                  }
                                  else if(merchantDetail.billing.topuppertxnfeeamount!=undefined){
                                      self.$scope.showTopupValue=true ;
                                      self.$scope.editMerchant.topupTransactionRadio="topValue"
                                  }
                                  if(merchantDetail.billing.loyaltypertxnfeepercent!=undefined){
                                      self.$scope.showLTotal=true ;
                                      self.$scope.editMerchant.LtransactionRadio="LCount"
                                  }
                                  else if(merchantDetail.billing.loyaltypertxnfeeamount!=undefined){
                                      self.$scope.showLValue=true ;
                                      self.$scope.editMerchant.LtransactionRadio="LValue"
                                  }
                                  self.$scope.oldMerchant =angular.copy(self.$scope.editMerchant);
                                },
                                () => {
                                    let message = self.$filter('translate')('xhr.get_customer.error');
                                    self.Flash.create('danger', message);
                                    self.loaderStates.merchantDetails = false;
                                }
                            )
                    ])

                }
            }


            addRegisterMerchant(merchant){
                let self = this;

                let validateFields = angular.copy(self.registerValidation);
                let frontValidation = self.Validation.frontValidation(merchant, validateFields);

                if (_.isEmpty(frontValidation)) {
                    self.MerchantService.postRegisterMerchant(merchant)
                        .then(
                            res => {
                                let message = "Merchant Registered Successfully";
                                self.Flash.create('success', message);
                                self.$state.go('admin.merchant-list');
                            },
                            res => {
                                self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                                let message = self.$filter('translate')('xhr.post_seller.error');
                                self.Flash.create('danger', message);
                            }
                        );
                } else {
                    self.$scope.validate = frontValidation;
                    let message = self.$filter('translate')('xhr.put_seller.error');
                    self.Flash.create('danger', message);
                }
            }


              deactivateMerchant(merchantId) {
                  let self = this;
                  self.loaderStates.deactivateMerchant = true;

                  self.MerchantService.deactivateMerchant(merchantId)
                      .then(
                          res => {
                              let message = self.$filter('translate')('xhr.post_deactivate_customer.success');
                              self.Flash.create('success', message);
                              self.getData();
                              self.loaderStates.deactivateMerchant = false;
                          },
                          () => {
                              let message = self.$filter('translate')('xhr.post_deactivate_customer.error');
                              self.Flash.create('danger', message);
                              self.loaderStates.deactivateMerchant = false;
                          }
                      )
              }

              activateStore(storeId) {
                  let self = this;

                  self.MerchantService.activatestore(storeId)
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
MerchantController.$inject = ['$scope', '$state', '$stateParams', 'AuthService', 'MerchantService', 'Flash', 'EditableMap', 'NgTableParams', 'ParamsMap', '$q', 'LevelService', 'Validation', '$filter', 'DataService', 'PosService', 'TransferService'];
