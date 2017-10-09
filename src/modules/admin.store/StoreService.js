export default class StoreService {
    constructor(Restangular, EditableMap,$q) {
        this.Restangular = Restangular;
        this.EditableMap = EditableMap;
        this.$q = $q;
      
           
    }

   

    // getStores(merchantId,params) {
    //     if(!params) {
    //         params = {};
    //     }
    //   return   this.Restangular.one('merchants', merchantId).getList('stores')
    // }, storeId)

    getMerchat(merchantId){
        return this.Restangular.one('merchant').one(merchantId).get();
    }

    getStores(merchantId) {
        // let stores =this.Restangular.all('store').getList()
        // console.log("stores",stores)
        return   this.Restangular.one('store').all(merchantId).getList()
        // return dfd.promise;
    }
    postTerminals(storeId,terminal){
        return this.Restangular.one('terminal').one(storeId).customPOST(
               {'data':terminal}
        )

    }

    getTerminal(storeId) {
        
        return this.Restangular.one('terminal').one(storeId).getList()
      
    }

    postStore(newStore,merchantId) {
        var data={
            merchantId:merchantId,
            store:[newStore]
        }
        return this.Restangular.one('store').customPOST({data:data})
    }

    getStore(storeId) {
        return this.Restangular.one('singlestore').one(storeId).get();
    }

    putStore(editedStore) {
        let self = this;
        let modifiedstore={
            name:editedStore.name ,
            contactperson: editedStore.contactperson,
            // noOfTerminals: '@assert:not_blank',
            email: editedStore.email,
            postalcode:editedStore.postalcode,
            address: editedStore.address,
            contactno: editedStore.contactno,
            alternatecontactperson:editedStore.alternatecontactperson,
            alternatecontactno:editedStore.alternatecontactno,
            bankaccno: editedStore.bankaccno,
            bankname: editedStore.bankname,
            storetype: editedStore.storetype,
            city:editedStore.city,
            country:editedStore.country,
            active:editedStore.active
        }

        return this.Restangular.one('store').one(editedStore.storeId).customPUT({
            data:{
                store:[modifiedstore]
            }});
    }

    deactivateStore(storeId) {
        return this.Restangular.one('admin').one('stroe', storeId).one('deactivate').customPOST();
    }

    deleteTerminal(terminalId){
        return this.Restangular.one('terminal',terminalId).customDELETE();
    }

    deleteStore(storeId){
        return this.Restangular.one('store',storeId).customDELETE();
    }

    activatestore(storeId) {
        return this.Restangular.one('admin').one('store', storeId).one('activate').customPOST();
    }

    addTerminal(storeId){

    }

    deactivateTerminal(TerminalId) {
        return this.Restangular.one('admin').one('terminal', TerminalId).one('deactivate').customPOST();
    }

    activateTerminal(TerminalId) {
        return this.Restangular.one('admin').one('store', storeId).one('activate').customPOST();
    }

   RejectTerminal(reason,TerminalId){
    return 'deleted'
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

StoreService.$inject = ['Restangular', 'EditableMap','$q'];
