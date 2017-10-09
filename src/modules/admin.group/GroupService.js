export default class GroupService {
    constructor(Restangular, EditableMap, $q) {
        this.Restangular = Restangular;
        this.EditableMap = EditableMap;
        this.$q = $q;
       
    }

    // getGroups(params) {
    //     if(!params) {
    //         params = {};
    //     }

    //     
    // }

    getGroups() {
      return this.Restangular.all('group').getList();
      
    }
    getCatagory() {
      return this.Restangular.all('category').getList();
    }

    postGroup(newGroup) {
      let group={
        name:newGroup.name,
        active:parseInt(newGroup.active),
      }
        return this.Restangular.one('group').customPOST({group:group})
    }
    postCategory(newCatagory) {
      let category={
        name:newCatagory.name,
        active:parseInt(newCatagory.active),
        categorycode:newCatagory.categorycode
      }
        return this.Restangular.one('category').customPOST({category:category})
    }

    getGroup(groupId) {
        return this.Restangular.one('group', groupId).get();
    }

    putGroup(editedGroup) {
        let self = this;
        let group={
          name:editedGroup.name,
          active:parseInt(editedGroup.active),
        }

        return self.Restangular.one('group', editedGroup.groupId).customPUT({group: self.EditableMap.group(editedGroup)});
    }
    putCategory(editedCategory){
      let self = this;
      let category={
        name:editedCategory.name,
        active:editedCategory.active,
        categorycode:editedCategory.categorycode
      }
      return self.Restangular.one('category', editedCategory.categoryId).customPUT({category: category});
  }

    deactivateGroup(groupId) {
        return this.Restangular.one('admin').one('merchant', merchantId).one('deactivate').customPOST();
    }

  
    deleteGroup(groupId){
        return this.Restangular.one('group',groupId).customDELETE();
    }

    deleteCategory(categoryId){
        return this.Restangular.one('category',categoryId).customDELETE();
    }



    getCustomerStatus(customerId) {
        return this.Restangular.one('admin').one('customer', customerId).one('status').get();
    }

    getCustomerTransactions(params, customerId) {
        params.customerId = customerId;

        return this.Restangular.all('transaction').getList(params);
    }

    getCustomerTransfers(params, customerId) {
        params.customerId = customerId;

        return this.Restangular.one('points').all('transfer').getList(params);
    }

    getCustomerAvailableCampaigns(params, customerId) {
        params.customerId = customerId;

        return this.Restangular.one('admin').one('customer', customerId).one('campaign').all('available').getList(params);
    }

    getCustomerBoughtCampaigns(params, customerId) {
        params.customerId = customerId;
        params.includeDetails = true;

        return this.Restangular.one('admin').one('customer', customerId).one('campaign').all('bought').getList(params);
    }



    postUsage(customerId, campaignId, code, usage) {
        return this.Restangular.one('admin').one('customer').one(customerId).one('campaign').one(campaignId).one('coupon').one(code).customPOST({used: usage});
    }

    postLevel(editedCustomer, levelId) {
        return editedCustomer.customPOST({levelId: levelId}, 'level')
    }

    postPos(editedCustomer, posId) {
        return editedCustomer.customPOST({posId: posId}, 'pos')
    }
}

GroupService.$inject = ['Restangular', 'EditableMap','$q'];
