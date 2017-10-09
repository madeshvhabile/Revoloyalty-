export default class OrderService {
    constructor(Restangular, EditableMap) {
        this.Restangular = Restangular;
        this.EditableMap = EditableMap;
    }
    getGroups() {
        return this.Restangular.all('group').getList();

      }
    getMerchants(groupId) {
         return this.Restangular.one('groupbymerchant',groupId).get();
    }
    getStores(merchantId) {
        return this.Restangular.one('store', merchantId).get();
    }
    getCardScheme(){
        return this.Restangular.all('cardscheme').getList();
    }

    getCardSchemebyId(cardId){
        return this.Restangular.one('cardscheme', cardId).get();
    }

    getOrders(){
        return this.Restangular.all('orderpurchase').getList();
    }

    getOrderData(orderId){
        return this.Restangular.one('orderpurchase',orderId).get();
    }

    postOrder(order){
        let data={
            merchantId:order.merchantId,
            storeId:order.storeId,
            cardSchemeId:order.cardSchemeId,
            cardAssignmentData:order.cardAssignmentData
        }

       return this.Restangular.one('orderpurchase').customPOST({data:data})
    }


    putOrder(orderId,order) {

        let data={
            merchantId:order.merchantId,
            storeId:order.storeId,
            cardSchemeId:order.cardSchemeId,
            cardAssignmentData:order.cardAssignmentData
        }

          console.log('data',data);
         return this.Restangular.one('orderpurchase',orderId).customPUT({data:data})
      }

    deleteOrder(orderId){
        return this.Restangular.one('orderpurchase',orderId).customDELETE();
    }

    getCardDetailData(orderId){
        return this.Restangular.one('order').one('carddetails',orderId).getList();
    }

    setStatus(status,orderId){
        var data = {
            status:status.status,
            reasonForReject:status.reasonForReject
        }
        return this.Restangular.one('orderpurchase').one('status',orderId).customPUT({data:data})
    }

    createCard(){
        return this.Restangular.one('carddetails').customPOST();
    }

}

OrderService.$inject = ['Restangular', 'EditableMap'];
