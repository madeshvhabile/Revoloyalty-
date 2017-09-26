export default class MerchantController {
    constructor($scope, $state, $stateParams, AuthService, MerchantService, Flash, EditableMap, NgTableParams, ParamsMap, $q, LevelService, Validation, $filter, DataService, PosService, TransferService) {
        if (!AuthService.isGranted('ROLE_ADMIN')) {
            $state.go('admin-login')
        }
        
              this.$scope = $scope;
              this.MerchantService = MerchantService;
              this.$scope.dateNow = new Date();
             this.merchants={};
             this.$scope.newMerchant = {
                billingMaster:{
                    moduleids:[],
                    isgiftcardapplicable:false,
                    giftfeepercentforcount: 0,
                    giftfeepercentforamount:0,
                    giftfeevalueforcount: 0,
                    giftfeevalueforamount: 0,
                    topupfeepercentforcount: 0,
                    topupfeepercentforamount:0,
                    topupfeevalueforcount:0,
                    topupfeevalueforamount:0, 
                    isloyaltycardapplicable:false,                    
                    loyaltyfeepercentforcount: 0,
                    loyaltyfeepercentforamount:0,
                    loyaltyfeevalueforcount: 0,
                    loyaltyfeevalueforamount:0,
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
                storetype:'E'
              };
              this.$scope.newCategory = {
                active:1
                  };
              this.$scope.newGroup = {
                active:1
              };
              this.merchantValidation={
                Modules: '@assert:not_blank',
                billingCycle: '@assert:not_blank',
                billingMethod: '@assert:not_blank',
                transactionValue: '@assert:not_blank',
                noOfTransaction: '@assert:not_blank',
              },
              this.storeValidation={
                name: '@assert:not_blank|min-5|max-50',
                contactperson: '@assert:not_blank|min-5|max-25',
                noofterminals: '@assert:not_blank|max-3',
                email: '@assert:not_blank|max-50',
                postalcode: '@assert:not_blank|min-5|max-10',
                address: '@assert:not_blank|min-5|max-100',
                contactno: '@assert:not_blank',
                bankaccno: '@assert:not_blank|min-5|max-20',
                bankname: '@assert:not_blank|min-5|max-50',
                alternatecontactno:'@assert:not_blank|max-10',
                storetype: '@assert:not_blank',
                // storeurl:'@assert:min-5|min-50',
                city:'@assert:not_blank|min-3|max-50',
                country:'@assert:not_blank',
                active:'@assert:not_blank'
                
              },
              this.groupValidation={
                active: '@assert:not_blank',    
                name: '@assert:not_blank',
              },
              
              this.catagoryValidation={
                name: '@assert:not_blank',
                active: '@assert:not_blank',
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
                
                postalcode:'@assert:not_blank',
                city:'@assert:not_blank',
                contactno:'@assert:not_blank',
                email:'@assert:not_blank',
                group:'@assert:not_blank',
                contactperson:'@assert:not_blank',
                postype:'@assert:not_blank',
                alternatecontactno:'@assert:not_blank',               

              },
              
            this.giftTransactionAmount={
                giftfeepercentforcount:'@assert:not_blank',
                giftfeepercentforamount:'@assert:not_blank',
            },
            this.giftTransactionValue={
                giftfeevalueforcount:'@assert:not_blank',
                giftfeevalueforamount:'@assert:not_blank',
            },
            this.topTransactionAmount={
                topupfeepercentforcount:'@assert:not_blank',
                topupfeepercentforamount:'@assert:not_blank',
            },
            this.topTransactionValue={
                topupfeevalueforcount:'@assert:not_blank',
                topupfeevalueforamount:'@assert:not_blank',
            },
            this.loyaltyTransactionAmount={
                loyaltyfeepercentforcount:'@assert:not_blank',
                loyaltyfeepercentforamount:'@assert:not_blank',
            },
            this.loyaltyTransactionValue={
                loyaltyfeevalueforcount:'@assert:not_blank',                
                loyaltyfeevalueforamount:'@assert:not_blank'
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
              
              this.merchantId = $stateParams.merchantId || '13d98613-7cf1-4e16-89d4-02e6e5e48924';
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
                  deleteStore:false
              }
            
            
              this.active = [
                {
                    name: this.$filter('translate')('global.active'),
                    type: 1
                },
                {
                    name: this.$filter('translate')('global.inactive'),
                    type: 0
                }
            ];

            this.postype = [
                {
                    name: "E-Commerce",
                    type: "E"
                },
                {
                    name: "Retail",
                    type: "R"
                },
                {
                    name: "Both",
                    type: "B"
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
            

            this.storeList=[];
            this.storeTableParams = new this.NgTableParams({
              count: this.config.perPage,
              sorting: {
                  createdAt: 'desc'
              }
          }, {dataset:this.storeList})
          }
          stepOnevalidation(newMerchant){
                let self=this;
                let validateFields={};
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
              this.linkAddStoreModal=false;
          };
          openModal(){
              let self=this
              console.log("here")
          self.linkAddStoreModal = true
          self.$scope.newStore={}
          self.$scope.storeValidate={}
          }
          openCategory(){
            let self=this
            console.log("here")
        self.linkAddCategoryModal = true
        self.$scope.newCategory={}
        self.$scope.catagoryValidation={}
        }
          openGroup(){
              let self=this;
              self.linkAddGroupModal=true;
              self.$scope.newGroup={}
              self.$scope.groupValidate={}
          }
          closeGroup(){
              let self=this;
              self.linkAddGroupModal=false;
          }
          closeCatagory(){
            let self=this;
            self.linkAddCategoryModal=false;
          }
          showDeleteStoreModel(store){
           let self=this;
           self.deleteStore=store
           self.showStoreRemoveModal=true;
          };
          deleteStoreConform(){
              let self=this;
              self.loaderStates.deleteStore=true;
              var idx = self.storeList.indexOf(self.deleteStore);
              self.storeList.splice(idx, 1);
              this.storeTableParams = new this.NgTableParams({
                  count: this.config.perPage,
                  sorting: {
                      createdAt: 'desc'
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

          checkGiftCheck(param){
              let self= this;
            if(!param){
                self.$scope.newMerchant.billingMaster.isgiftcardapplicable=false
            }
          }
          checkLoyaltyCheck(param){
            let self= this;
            if(!param){
                self.$scope.newMerchant.billingMaster.isloyaltycardapplicable=false
            }
          }

          checkCheckedGiftCard(param){
            let self =this;
            if(param==true){
                newMerchant.GtransactionRadio="total";
                newMerchant.topupTransactionRadio='topCount';
            }
            else{
                newMerchant.GtransactionRadio='';
                newMerchant.topupTransactionRadio='';
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
                                // params.total(res.total);self.config.perPage
                                //dfd.resolve(res)   
                                //console.log(self.$scope.merchants[1].MID);    
                                var result = _.reverse(res);                                               
                                self.tableParams = new self.NgTableParams({
                                        count: 5,
                                        sorting: {
                                            createdAt: 'desc'
                                        }
                                    }, {
                                    dataset:result            
                                });
                               
                            },
                            () => {
                                let message = self.$filter('translate')('xhr.get_customers.error');
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
                                        tempGroups.push({name:groupname ,groupId:res[i].groupId});
                                    }
                                    this.groups=tempGroups;                                  
                                    console.log(this.groups);
                                },
                                () => {
                                    let message = self.$filter('translate')('xhr.get_customers.error');
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
                                      self.loaderStates.merchantDetails = false;
                                     
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



            getCatagory () {
                let self = this;
                        //let dfd = self.$q.defer();
                        //self.ParamsMap.params(params.url())
                        
                        self.MerchantService.getCatagory()
                            .then(
                                res => {
                                    
                                    self.loaderStates.coverLoader = false;
                                  
                                    var length = res.total
                                    var tempCategory =[];
                                    for(var i=0; i<length ;i++){
                                        var name=res[i].name;
                                        tempCategory.push({name:name ,categoryId:res[i].categoryId});
                                       }
                                       this.categorys=tempCategory;
                                    console.log(self.$scope.categorys);
                                    
                                },
                                () => {
                                    let message = self.$filter('translate')('xhr.get_customers.error');
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
                                            createdAt: 'desc'
                                        }
                                    }, {
                                        dataset:  self.$scope.storeList             
                                                        
                                        
                                    });
                                },
                                () => {
                                    let message = self.$filter('translate')('xhr.get_customers.error');
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
                            newMerchant.billingMaster.moduleids = newMerchant.billingMaster.moduleids.join();
                            newMerchant.merchantMaster.status = "Approved" ;
                            if(!(newMerchant.merchantMaster.hasOwnProperty('alternatecontactno'))){
                                newMerchant.merchantMaster.alternatecontactno="";
                            }
                            self.MerchantService.postMerchant(newMerchant)
                                .then(
                                    res => {
                                        console.log("merchantRes",res);
                                        
                                         self.MerchantService.postStore(self.storeList,res.merchantId).then(
                                            res =>{
                                                self.$state.go('admin.merchant-list');
                                                let message = self.$filter('translate')('xhr.post_customer.success');
                                                self.Flash.create('success', message);
                                            },
                                            res => {
                                                self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                                                let message = "Success Add Merchant";
                                                self.Flash.create('danger', message);
                                            }
                                        )
                                       
                                    },
                                    res => {
                                        self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                                        let message = self.$filter('translate')('xhr.post_customer.error');
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
                            console.log('editMerchant.billingMaster.moduleids',typeof editMerchant.billingMaster.moduleids)
                            if(typeof editMerchant.billingMaster.moduleids== 'Array'){ 
                             editMerchant.billingMaster.moduleids = editMerchant.billingMaster.moduleids.join();
                            }
                            self.MerchantService.putMerchant(editMerchant)
                                .then(
                                    res => {
                                        self.$state.go('admin.merchant-list');
                                        let message = "Success Add Merchant";
                                        self.Flash.create('success', message);

                                    },
                                    res => {
                                        self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                                        let message = self.$filter('translate')('xhr.post_customer.error');
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
                let validateFields = angular.copy(self.storeValidation);
                let frontValidation = self.Validation.frontValidation(newStore, validateFields);
                console.log("frontValidation",frontValidation)
                if (_.isEmpty(frontValidation)) {
                    self.storeList.push(newStore)
                    console.log("self.storeList",self.storeList)
                    this.storeTableParams = new this.NgTableParams({
                        count: this.config.perPage,
                        sorting: {
                            createdAt: 'desc'
                        }
                    }, {dataset:self.storeList})
                    console.log("table",self.storeTableParams)
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
                        
                     self.groups.push({name:res.groupname,groupId:res.groupId})
                     
                    //  newMerchant.merchantMaster={
                    //      group : res.groupId
                    //  }
                     console.log('grouplist',self.groups)
                     console.log('Categorylist',self.categorys)
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
                let message = 'Group Name is Already Exists';
                self.Flash.create('danger', message);
               }              
            }

            addCategory(newCatagory,newMerchant){    
                console.log('newde',newMerchant)           
                let self=this
                let idx;
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
                         
                     
                           
                         self.categorys.push({name:res.categoryname,categoryId:res.categoryId});

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
                                          giftfeepercentforcount: merchantDetail.billing.giftfeepercentforcount,
                                          giftfeepercentforamount:merchantDetail.billing.giftfeepercentforamount,
                                          giftfeevalueforcount: merchantDetail.billing.giftfeevalueforcount,
                                          giftfeevalueforamount: merchantDetail.billing.giftfeevalueforamount,
                                          topupfeepercentforcount: merchantDetail.billing.topupfeepercentforcount,
                                          topupfeepercentforamount: merchantDetail.billing.topupfeepercentforamount,
                                          topupfeevalueforcount: merchantDetail.billing.topupfeevalueforcount,
                                          topupfeevalueforamount: merchantDetail.billing.topupfeevalueforamount,  
                                          isloyaltycardapplicable: merchantDetail.billing.isloyaltycardapplicable,              
                                          loyaltyfeepercentforcount: merchantDetail.billing.loyaltyfeepercentforcount,
                                          loyaltyfeepercentforamount: merchantDetail.billing.loyaltyfeepercentforamount,
                                          loyaltyfeevalueforcount: merchantDetail.billing.loyaltyfeevalueforcount,
                                          loyaltyfeevalueforamount:merchantDetail.billing.loyaltyfeevalueforamount,
                                          status: 'Approved'                                          
                                      }                                   
                      
                      
                                  }
                                  if(merchantDetail.billing.giftfeepercentforcount !=0){
                                    self.$scope.editMerchant.GtransactionRadio="total";
                                    self.$scope.showText=true ;
                                }
                                else if(merchantDetail.billing.giftfeevalueforcount !=0){
                                    self.$scope.showValue=true ;
                                    self.$scope.editMerchant.GtransactionRadio="value"
                                }
                                else if(merchantDetail.billing.topupfeepercentforcount!=0){
                                    self.$scope.showTopupTotal=true ;      
                                    self.$scope.editMerchant.topupTransactionRadio="topCount"
                                }
                                else if(merchantDetail.billing.topupfeevalueforcount!=0){
                                    self.$scope.showTopupValue=true ;  
                                    self.$scope.editMerchant.topupTransactionRadio="topValue"
                                }
                                else if(merchantDetail.billing.loyaltyfeepercentforcount!=0){
                                    self.$scope.showLTotal=true ;   
                                    self.$scope.editMerchant.LtransactionRadio="LCount"
                                }
                                else if(merchantDetail.billing.loyaltyfeevalueforcount!=0){
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
