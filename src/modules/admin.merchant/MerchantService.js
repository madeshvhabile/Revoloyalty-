export default class MerchantService {
    constructor(Restangular, EditableMap,$q) {
        this.Restangular = Restangular;
        this.EditableMap = EditableMap;
        this.$q = $q;
        
          this.merchantDetail ={
            "id":"065 2845678594",
            "name":"Mohan",
            "group":"Habile",
            "contact":"saranya",
            "roc":"123124",
            "address":"janaki complex",
            "phone":"9796586989",
            "store":[{
                "store":"alpha",
                "Terminals":"270",
                "status":"1",
                "Action":""
                 },
                 {
                "store":"Beta",
                "Terminals":"374",
                "status":"1",
                "Action":""
                 },
                 {
                "store":"banshee",
                "Terminals":"3",
                "status":"1",
                "Action":""
                 },
                 {
                "store":"omeha",
                "Terminals":"824",
                "status":"1",
                "Action":""
                 },
                 {
                "store":"Cayoty",
                "Terminals":"585",
                "status":"0",
                "Action":""
                 }]
            }
        
    }

    getMerchants() {
        return  this.Restangular.all('merchant').getList();
      }

    getGroups() {
        return this.Restangular.all('group').getList();
        
      }
      getCatagory() {
        return this.Restangular.all('category').getList();
      }

    postMerchant(merchantDetail) {
        let data={
            minfo:[merchantDetail.merchantMaster],
            binfo:[merchantDetail.billingMaster]
        }
        console.log('data',data);
       return this.Restangular.one('merchant').customPOST({data:data})
    }

    putMerchant(merchantDetail) {
      
        let data={
            minfo:[merchantDetail.merchantMaster],
            binfo:[merchantDetail.billingMaster]
        }

        console.log('data',data);
       return this.Restangular.one('merchant',merchantDetail.merchantId).customPUT({data:data})
    }

    postCategory(newCatagory) {
        return this.Restangular.one('category').customPOST({category:newCatagory})
    }
    
    postStore(newStore,merchantId) {
        var data={
            merchantId:merchantId,
            store:newStore
        }
        return this.Restangular.one('store').customPOST({data:data})
    }
    postGroup(newGroup) {
        let group={
          name:newGroup.name,
          active:parseInt(newGroup.active),
        }
          return this.Restangular.one('group').customPOST({group:group})
      }

    getMerchant(merchantId) {
         return this.Restangular.one('merchant', merchantId).get();
     }

     getStore(merchantId) {
        return this.Restangular.one('store', merchantId).get();
    }


    

    deactivateMerchant(merchantId) {
        return this.Restangular.one('admin').one('merchant', merchantId).one('deactivate').customPOST();
    }

    activatestore(storeId) {
        return this.Restangular.one('admin').one('store', storeId).one('activate').customPOST();
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

MerchantService.$inject = ['Restangular', 'EditableMap','$q'];