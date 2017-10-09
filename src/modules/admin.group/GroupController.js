export default class GroupController {
    constructor($scope, $state, $stateParams, AuthService, GroupService, Flash, EditableMap, NgTableParams, ParamsMap, $q, LevelService, Validation, $filter, DataService, PosService, TransferService) {
        if (!AuthService.isGranted('ROLE_ADMIN')) {
            $state.go('admin-login')
        }
              this.$scope = $scope;
              this.$scope.dateNow = new Date();
              this.GroupService = GroupService;
              this.$scope.newGroup = {};
              this.$scope.newCatagory={};
              this.groupValidation={
                name: '@assert:not_blank|min-4|max-50',
                active: '@assert:not_blank',
              }
              this.catagoryValidation={
                name: '@assert:not_blank|min-4|max-50',
                active: '@assert:not_blank'
              }
              this.$state = $state;
              this.AuthService = AuthService;
              this.Flash = Flash;
              this.EditableMap = EditableMap;
              this.groupId = $stateParams.groupId || null;
              this.NgTableParams = NgTableParams;
              this.ParamsMap = ParamsMap;
              this.$q = $q;
              this.Validation = Validation;
              this.$filter = $filter;
              // this.country = DataService.getCountries();
              this.config = DataService.getConfig();
              this.countryConfig = {
                  valueField: 'code',
                  labelField: 'name',
                  create: false,
                  sortField: 'name',
                  maxItems: 1,
              };
              this.loaderStates = {
                  customerTabs: true,
                  customerDetails: true,
                  groupList: true,
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
                  deactivateGroup: false
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
            this.activeConfig = {
                valueField: 'type',
                labelField: 'name',
                create: false,
                sortField: 'name',
                maxItems: 1
            };


            }
            /*  getData() {
                  let self = this;

                  self.tableParams = new self.NgTableParams({
                      count: self.config.perPage,
                      sorting: {
                          createdAt: 'desc'
                      }
                  }, {
                      getData: function (params) {
                          let dfd = self.$q.defer();
                          self.loaderStates.groupList = true;
                          self.GroupService.getGroups(self.ParamsMap.params(params.url()))
                              .then(
                                  res => {
                                      self.loaderStates.groupList = false;
                                      self.loaderStates.coverLoader = false;
                                      self.$scope.groups = res;
                                      params.total(res.total);
                                      dfd.resolve(res)
                                  },
                                  () => {
                                      let message = self.$filter('translate')('xhr.get_customers.error');
                                      self.Flash.create('danger', message);
                                      self.loaderStates.groupList = false;
                                      self.loaderStates.coverLoader = false;
                                      dfd.reject();
                                  }
                              );

                          return dfd.promise;
                      }
                  });
              }*/
              closeGroup(){
                let self=this;
                self.linkAddGroupModal=false

            }

            closeCatagory(){
                let self=this;
                self.linkAddCatagoryModal=false

            }
            openModal(){
                let self=this

            this.$scope.newGroup={};
            self.$scope.groupValidate={};
            self.linkAddGroupModal = true
            }
            openEditModal(group){

                let self=this
                self.$scope.temobject=angular.copy(group)
                self.$scope.editableCatagory=angular.copy(group);

                self.$scope.categoryValidator={}
                self.linkEditCatagoryModal = true
            }


            openEditGroupModal(group){
                                let self=this
                                self.$scope.temgroupobject=angular.copy(group)
                                self.$scope.editableGroup=angular.copy(group);
                                self.linkEditGroupModal = true
                                self.$scope.EditgroupValidate={}
                            }

            openCatagoryModal(){
                let self=this

            self.$scope.newCatagory={}
            self.$scope.categoryValidate={}
            self.linkAddCatagoryModal = true

            }

            addGroup(newGroup){
                let self=this
                let idx;
                let validateFields = angular.copy(self.groupValidation);
                let frontValidation = self.Validation.frontValidation(newGroup, validateFields);
                if(newGroup.name == undefined || newGroup.active == undefined){
                     idx=-1
                }else{
                     idx= _.findIndex(self.tableParams.settings().dataset, function(o) { return o.name == newGroup.name; });
                }
                if(!(idx > -1) ){
                if (!_.isEmpty(frontValidation)) {
                    self.$scope.groupValidate = frontValidation;
                    let message = 'Please give a valid input';
                    self.Flash.create('danger', message);
                    self.loaderStates.coverLoader=false
                }
               else{
                 self.GroupService.postGroup(newGroup)
                 .then(
                     res=>{
                        newGroup.groupId=res.groupId;
                        newGroup.noofmerchants=0;
                        self.tableParams.settings().dataset.unshift(  newGroup
                     );
                     self.tableParams.sorting({});
                     self.tableParams.page(1);
                     self.tableParams.reload();
                     let message = 'Group Added successfully';
                     self.Flash.create('success', message);
                    self.linkAddGroupModal = false
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
            addCatagory(newCatagory){
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
                }else{
                     idx= _.findIndex(self.catagorytableParams.settings().dataset, function(o) { return o.name == newCatagory.name; });
                }

                if(!(idx > -1)){
                if (!_.isEmpty(frontValidation)) {
                    self.$scope.categoryValidate = frontValidation;
                }
               else{
            //newCatagory.status="approved"
                 self.GroupService.postCategory(newCatagory)
                 .then(
                     res=>{
                         newCatagory.categoryId=res.categoryId;
                        self.catagorytableParams.settings().dataset.unshift(  newCatagory
                     );
                     self.catagorytableParams.sorting({});
                     self.catagorytableParams.page(1);
                     self.catagorytableParams.reload();
                     let message = 'New Category  Added successfully';
                     self.Flash.create('success', message);
                    self.linkAddCatagoryModal = false
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
            // editCatagory(ModifiedCatagory){
            //     let self=this;
            //     console.log(self.$scope.temobject,ModifiedCatagory)
            //     if( !_.isEqual(self.$scope.temobject,ModifiedCatagory)){
            //         console.log("it is equal",self.groupValidation)
            //         let validateFields = angular.copy(self.catagoryValidation);
            //         let frontValidation = self.Validation.frontValidation(ModifiedCatagory, validateFields);
            //         console.log("frontValidation",frontValidation)

            //         if (!_.isEmpty(ModifiedCatagory.Catagory)) {
            //             console.log("changes are saved")
            //             self.linkEditCatagoryModal=false
            //         }
            //         else{
            //             let message = self.$filter('translate')('xhr.get_customers.error');
            //             self.Flash.create('danger', message);
            //             self.loaderStates.terminalList = false;
            //             self.loaderStates.coverLoader = false;
            //             self.Catagoryerror=['front_error.not_blank']
            //         }

            //     }else{
            //         let message = self.$filter('translate')('xhr.get_customers.error');
            //         self.Flash.create('danger', message);
            //         self.loaderStates.terminalList = false;
            //         self.loaderStates.coverLoader = false;
            //     }



            // }

            editCatagory(ModifiedCatagory){
                let self=this;

                var oldobject={
                    name:self.$scope.temobject.name,
                    active:parseInt(self.$scope.temobject.active),
                    categorycode:self.$scope.temobject.categorycode
                }
                var newobject={
                    name:ModifiedCatagory.name,
                    active:parseInt(ModifiedCatagory.active),
                    categorycode:ModifiedCatagory.categorycode
                }
               if( !_.isEqual(oldobject,newobject)){
                 let idx;
                if(ModifiedCatagory.name == undefined || ModifiedCatagory.active == undefined){
                    idx=-1
               }else{
                    idx= _.findIndex(self.catagorytableParams.settings().dataset, function(o) { return o.name == ModifiedCatagory.name; });
               }
               var changeequal=oldobject.name == newobject.name;
               if(!(idx > -1) || changeequal ){

                    if((ModifiedCatagory.categorycode != undefined) &&  (!_.isNull(ModifiedCatagory.categorycode))){
                        self.catagoryValidation.categorycode = '@assert:min-1|max-8';
                    }else{
                        delete self.catagoryValidation.categorycode;
                    }

                    let validateFields = angular.copy(self.catagoryValidation);
                    let frontValidation = self.Validation.frontValidation(ModifiedCatagory, validateFields);
                    if (_.isEmpty(frontValidation)) {
                       // ModifiedCatagory.status="Approved"
                       self.GroupService.putCategory(ModifiedCatagory)
                       .then(
                           res =>{

                            self.linkEditCatagoryModal=false
                            _.remove(self.catagorytableParams.settings().dataset, function(item) {
                                return ModifiedCatagory.categoryId == item.categoryId;
                              });
                            self.catagorytableParams.settings().dataset.unshift(  ModifiedCatagory
                            );
                            self.catagorytableParams.sorting({});
                            self.catagorytableParams.page(1);
                            self.catagorytableParams.reload();
                            let message = 'Category Updated Successfully'
                            self.Flash.create('success', message);
                           },
                           error=>{
                            let message = 'Something Went Wrong Please Try again sometime';
                            self.Flash.create('danger', message);
                            self.loaderStates.terminalList = false;
                            self.loaderStates.coverLoader = false;
                           }
                       )
                    }
                    else{
                        let message = "Please give valid input";
                        self.Flash.create('danger', message);
                        self.loaderStates.terminalList = false;
                        self.loaderStates.coverLoader = false;
                        self.$scope.categoryValidator = frontValidation;
                    }

            }else{
                let message = 'Category Name is Already Exists';
                self.Flash.create('danger', message);
            }
        }

            // }
            else{
                    let message = 'No changes ';
                    self.Flash.create('danger', message);
                    self.loaderStates.terminalList = false;
                    self.loaderStates.coverLoader = false;
                }
            }



            editGroup(ModifiedGroup){
                let self=this;
                var oldobject={
                    name:self.$scope.temgroupobject.name,
                    active:parseInt(self.$scope.temgroupobject.active)
                }
                var newobject={
                    name:ModifiedGroup.name,
                    active:parseInt(ModifiedGroup.active)
                }
             if( !_.isEqual(oldobject,newobject)){
                             let idx;
                 if(ModifiedGroup.name == undefined || ModifiedGroup.active == undefined){
                    idx=-1
               }else{
                    idx= _.findIndex(self.tableParams.settings().dataset, function(o) { return o.name == ModifiedGroup.name; });
               }
               var changeequal=oldobject.name == newobject.name;
               if((!(idx > -1)) || changeequal  ){

                    let validateFields = angular.copy(self.groupValidation);
                    let frontValidation = self.Validation.frontValidation(ModifiedGroup, validateFields);
                    if (_.isEmpty(frontValidation)) {
                       self.GroupService.putGroup(ModifiedGroup)
                       .then(
                           res =>{
                            self.linkEditGroupModal=false
                            _.remove(self.tableParams.settings().dataset, function(item) {
                                return ModifiedGroup.groupId == item.groupId;
                              });
                            self.tableParams.settings().dataset.unshift(  ModifiedGroup
                            );
                            self.tableParams.sorting({});
                            self.tableParams.page(1);
                            self.tableParams.reload();

                            let message = 'Group Updated Successfully'
                            self.Flash.create('success', message);
                           },
                           error=>{
                            let message = 'Something Went Wrong Please Try again sometime';
                            self.Flash.create('danger', message);
                            self.loaderStates.terminalList = false;
                            self.loaderStates.coverLoader = false;
                           }
                       )
                    }
                    else{
                        let message = "Please give valid input";
                        self.Flash.create('danger', message);
                        self.loaderStates.terminalList = false;
                        self.loaderStates.coverLoader = false;
                        self.$scope.EditgroupValidate = frontValidation;
                    }
               }else{
                    let message = 'Group Name is Already Exists';
                    self.Flash.create('danger', message);
               }
               }else{
                    let message = 'No changes ';
                    self.Flash.create('danger', message);
                    self.loaderStates.terminalList = false;
                    self.loaderStates.coverLoader = false;
                }

            }


            showDeleteGroupModel(group){
                console.log("delete")
                let self=this;
                self.deleteGroup=group;
                self.showStoreRemoveModal=true;
               };
               showDeleteCatagoryModel (Catagory){
                console.log("delete")
                let self=this;
                self.deleteCatagory=Catagory
                self.showCatagoryRemoveModal=true;
               };

               deleteCatagoryConform(){
                let self=this;
                self.loaderStates.deleteStore=true;
                self.GroupService.deleteCategory( self.deleteCatagory.categoryId)
                .then(
                    res =>{
                        _.remove(self.catagorytableParams.settings().dataset, function(item) {
                            return self.deleteCatagory === item;
                          });
                          self.catagorytableParams.reload().then(function(data) {
                            if (data.length === 0 && self.catagorytableParams.total() > 0) {
                              self.catagorytableParams.page(self.catagorytableParams.page() - 1);
                              self.catagorytableParams.reload();
                            }
                          });
                          let message = "Category Deleted Successfully";
                          self.Flash.create('success', message);
                          self.loaderStates.deleteStore=false;
                          self.showCatagoryRemoveModal=false;
                },
                () =>{
                    let message = "Cannot delete category,Please try again later";
                    self.Flash.create('danger', message);
                    self.loaderStates.deleteStore=false;
                    self.showCatagoryRemoveModal=false;
                }
            )

            }
            deleteGroupConform(){
                   let self=this;
                   self.loaderStates.deleteStore=true;
                   self.GroupService.deleteGroup(self.deleteGroup.groupId)
                   .then(
                       res =>{
                        _.remove(self.tableParams.settings().dataset, function(item) {
                            return self.deleteGroup === item;
                          });
                          self.tableParams.reload().then(function(data) {
                            if (data.length === 0 && self.tableParams.total() > 0) {
                              self.tableParams.page(self.tableParams.page() - 1);
                              self.tableParams.reload();
                            }
                          });
                          let message = "Group Deleted Successfully";
                          self.Flash.create('success', message);
                          self.loaderStates.deleteStore=false;
                          self.showStoreRemoveModal=false;
                   },
                   ()=>{
                    let message = "Cannot Delete Group,Please Try Again Later";
                    self.Flash.create('danger', message);
                   self.loaderStates.deleteStore=false;
                   self.showStoreRemoveModal=false;
                   }
                )


               }
               closedeleteModal() {
                this.showStoreRemoveModal=false;
                this.showCatagoryRemoveModal=false;
                }
               getCatagory () {
                let self = this;
                        //let dfd = self.$q.defer();
                        //self.ParamsMap.params(params.url())
                        self.loaderStates.groupList = true;
                        self.GroupService.getCatagory()
                            .then(
                                res => {
                                    self.loaderStates.groupList = false;
                                    self.loaderStates.coverLoader = false;
                                    self.$scope.Catagorys = res;
                                    //params.total(res.total);
                                    //dfd.resolve(res)
                                    self.catagorytableParams = new self.NgTableParams({
                                        count: self.config.perPage,
                                        sorting: {
                                            created: 'desc'
                                        }
                                    }, {
                                        dataset: res


                                    });
                                },
                                () => {
                                    let message = self.$filter('translate')('xhr.get_customers.error');
                                    self.Flash.create('danger', message);
                                    self.loaderStates.groupList = false;
                                    self.loaderStates.coverLoader = false;
                                   // dfd.reject();
                                }
                            );
            };
              getData() {
                let self = this;
                        //let dfd = self.$q.defer();
                        //self.ParamsMap.params(params.url())
                        self.loaderStates.groupList = true;
                        self.GroupService.getGroups()
                            .then(
                                res => {
                                    console.log("res",res)
                                    self.loaderStates.groupList = false;
                                    self.loaderStates.coverLoader = false;
                                    self.$scope.groups = res;
                                    //params.total(res.total);
                                    //dfd.resolve(res)
                                    var result = _.reverse(res);
                                    self.tableParams = new self.NgTableParams({
                                        count: self.config.perPage,
                                        sorting: {
                                            created: 'desc'
                                        }
                                    }, {
                                        dataset: result


                                    });
                                },
                                () => {
                                    let message = self.$filter('translate')('xhr.get_customers.error');
                                    self.Flash.create('danger', message);
                                    self.loaderStates.groupList = false;
                                    self.loaderStates.coverLoader = false;
                                   // dfd.reject();
                                }
                            );
            }

              getGroupData() {
                  let self = this;

                  self.loaderStates.GroupDetails = true;

                  if (self.groupId) {
                      self.$q.all([
                          self.GroupService.getGroup(self.groupId)
                              .then(
                                  res => {
                                      self.$scope.group = res;
                                      self.$scope.editableFields = self.EditableMap.humanizeCustomer(res);
                                      self.$scope.showAddress = !(_.isEmpty(self.$scope.editableFields.address));
                                      self.$scope.showCompany = !(_.isEmpty(self.$scope.editableFields.company));
                                      self.loaderStates.groupDetails = false;
                                  },
                                  () => {
                                      let message = self.$filter('translate')('xhr.get_customer.error');
                                      self.Flash.create('danger', message);
                                      self.loaderStates.groupDetails = false;
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

            //   addGroup(newGroup) {
            //       console.log("enter to submit",newGroup);
            //       let self = this;
            //       let validateFields = angular.copy(self.$scope.frontValidate);
            //       let frontValidation = self.Validation.frontValidation(newGroup, validateFields);
            //       if (_.isEmpty(frontValidation)) {
            //           self.GroupService.postGroup(newGroup)
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


            //   editGroup(editedGroup) {
            //       let self = this;

            //       let validateFields = angular.copy(self.$scope.frontValidate);

            //       let frontValidation = self.Validation.frontValidation(editedGroup, validateFields);
            //       if (_.isEmpty(frontValidation)) {
            //           self.GroupService.putGroup(editedGroup)
            //               .then(
            //                   res => {
            //                       let message = self.$filter('translate')('xhr.put_customer.success');
            //                       self.Flash.create('success', message);
            //                       self.$state.go('admin.single-customer', {customerId: res.customerId});
            //                   },
            //                   res => {
            //                       self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
            //                       let message = self.$filter('translate')('xhr.put_customer.error');
            //                       self.Flash.create('danger', message);
            //                   }
            //               )
            //       } else {
            //           let message = self.$filter('translate')('xhr.post_customer.error');
            //           self.Flash.create('danger', message);
            //           self.$scope.validate = frontValidation;
            //       }
            //   }

              deactivateGroup(groupId) {
                  let self = this;
                  self.loaderStates.deactivateGroup= true;

                  self.GroupService.deactivateGroup(groupId)
                      .then(
                          res => {
                              let message = self.$filter('translate')('xhr.post_deactivate_customer.success');
                              self.Flash.create('success', message);
                              self.getData();
                              self.loaderStates.deactivateGroup = false;
                          },
                          () => {
                              let message = self.$filter('translate')('xhr.post_deactivate_customer.error');
                              self.Flash.create('danger', message);
                              self.loaderStates.deactivateGroup = false;
                          }
                      )
              }

              // activateStore(storeId) {
              //     let self = this;
              //
              //     self.CustomerService.activatestore(storeId)
              //         .then(
              //             res => {
              //                 let message = self.$filter('translate')('xhr.post_activate_customer.success');
              //                 self.Flash.create('success', message);
              //                 self.getData();
              //             },
              //             () => {
              //                 let message = self.$filter('translate')('xhr.post_activate_customer.error');
              //                 self.Flash.create('danger', message);
              //             }
              //         )
              // }

}
GroupController.$inject = ['$scope', '$state', '$stateParams', 'AuthService', 'GroupService', 'Flash', 'EditableMap', 'NgTableParams', 'ParamsMap', '$q', 'LevelService', 'Validation', '$filter', 'DataService', 'PosService', 'TransferService'];
