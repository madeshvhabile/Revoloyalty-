export default class CardSchemeService {
    constructor(Restangular, EditableMap) {
        this.Restangular = Restangular;
        this.EditableMap = EditableMap;
    }

    getCardSchemesList() {
        return  this.Restangular.all('cardscheme').getList();
    }
    getCardSchemesByMerchant(merchantId) {
        return  this.Restangular.one('cardschemebymerchant',merchantId).getList();
    }
    postCardscheme(cardscheme){
        console.log("cards",cardscheme)
        return this.Restangular.one('cardscheme').customPOST({data:cardscheme})
    }

    getCardScheme(cardschmeId) {
         return this.Restangular.one('cardscheme', cardschmeId).get();
     }

    deleteCardScheme(cardschmeId){
         return this.Restangular.one('cardscheme',cardschmeId).customDELETE();
     }

    // getOrder(Order) {
    //     return this.Restangular.one('Order', Order).get();
    // }

    // OrdertOrder(newOrder) {
    //     let self = this;

    //     return this.Restangular.one('Order').customOrderT({Order: self.EditableMap.Order(newOrder)});
    // }

    // putOrder(OrderId, editedOrder) {
    //     let self = this;

    //     return self.Restangular.one('Order', OrderId).customPUT({Order: self.Restangular.stripRestangular(self.EditableMap.Order(editedOrder))});
    // }

}

CardSchemeService.$inject = ['Restangular', 'EditableMap'];
