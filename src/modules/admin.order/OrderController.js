export default class OrderController {
    constructor($scope, $state, AuthService, OrderService,CardSchemeService, Flash, NgTableParams, $q, ParamsMap, $stateParams, EditableMap, DataService, Validation, $filter) {
        if (!AuthService.isGranted('ROLE_ADMIN')) {
            AuthService.logout();
        }
        this.$scope = $scope;
        this.OrderService = OrderService;
        this.CardSchemeService=CardSchemeService;
        this.$state = $state;
        this.Flash = Flash;
        this.$scope.newOrder = {};
        this.$scope.editableFields = {};
        this.OrderId = $stateParams.OrderId || null;
        this.NgTableParams = NgTableParams;
        this.ParamsMap = ParamsMap;
        this.EditableMap = EditableMap;
        //this.countries = DataService.getCountries();
        this.orderId = $stateParams.orderId;
        this.$q = $q;
        this.Validation = Validation;
        this.$filter = $filter;
        this.config = DataService.getConfig();
        this.country = DataService.getCountries();
        this.$scope.choosen ={};
        this.$scope.editChoosen={};
        this.$scope.selectedScheme={

        }
        this.$scope.editSelectedScheme={

            }
        this.$scope.newOrder = {
        };
        this.cardreasonstatus={
            reasonForReject:'@assert:not_blank'
        }
        this.$scope.editOrder = {
        };
        this.$scope.cardStatus={};

        this.$scope.finaleditordersbyIdJson={};

        this.$scope.isStoreSelect=false;

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
        this.groupConfig = {
            valueField: 'groupId',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField:'name',
            maxItems: 1,
        };
        this.merchantConfig = {
            valueField: 'merchantId',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField:'name',
            maxItems: 1,
        };

        this.cardConfig = {
            valueField: 'cardschemeId',
            labelField: 'cardschemename',
            create: false,
            sortField: 'name',
            searchField:'name',
            maxItems: 1,
        };

        this.storesConfig = {
            valueField: 'storeId',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField:'name',
            maxItems: 1,
        };

       this.merchantdetailValidation={
        // storeId:'@assert:not_blank',
        groupId:'@assert:not_blank',
        merchantId:'@assert:not_blank',
        cardId:'@assert:not_blank'
       },

        this.loaderStates = {
            OrderList: true,
            OrderDetails: true,
            orderDetails:true
        }
    }

    stepOneValidation(merchantInfo){

        let self=this;
        console.log("newOrder",self.$scope.newOrder);
        let validateFields={};
         validateFields= angular.copy(self.merchantdetailValidation);
        let frontValidation = self.Validation.frontValidation(merchantInfo, validateFields);

        let message = self.$filter('translate')('xhr.post_customer.error');
        self.$scope.validate = frontValidation;

        if(!(_.isEmpty(frontValidation))){
                self.Flash.create('danger', message);
        }
        else{
            $( ".tabs li:nth-child(1)" ).removeClass( "is-active" );
            $( ".tabs li:nth-child(2)" ).addClass( "is-active" );
            $( "#order2" ).addClass( "is-active" ).attr("aria-hidden","false");
            $( "#order1" ).removeClass( "is-active" ).attr("aria-hidden","true");
            self.getCardSchemeForChoosen();
       }

    }

    stepTwoValidation(choosenScheme){
        let self=this;
        var Boolean = [choosenScheme.isGiftCardApplicable,choosenScheme.isLoyaltyCardApplicable,choosenScheme.isEGiftCardApplicable,choosenScheme.isELoyaltyCardApplicable];
       var index = Boolean.indexOf(true);
       if(index > -1){
        $( ".tabs li:nth-child(2)" ).removeClass( "is-active" );
        $( ".tabs li:nth-child(3)" ).addClass( "is-active" );
        $( "#order3" ).addClass( "is-active" ).attr("aria-hidden","false");
        $( "#order2" ).removeClass( "is-active" ).attr("aria-hidden","true");
        self.getCardAssignment();
       }
       else{
        let message = "You must be Select any one CardScheme";
        self.Flash.create('danger', message);
       }
    }

    stepEditTwoValidation(choosenScheme){
        let self=this;
        var Boolean = [choosenScheme.isGiftCardApplicable,choosenScheme.isLoyaltyCardApplicable,choosenScheme.isEGiftCardApplicable,choosenScheme.isELoyaltyCardApplicable];
        console.log("Chosen scheme",choosenScheme);
       var index = Boolean.indexOf(true);
       if(index > -1){
        $( ".tabs li:nth-child(2)" ).removeClass( "is-active" );
        $( ".tabs li:nth-child(3)" ).addClass( "is-active" );
        $( "#order3" ).addClass( "is-active" ).attr("aria-hidden","false");
        $( "#order2" ).removeClass( "is-active" ).attr("aria-hidden","true");
        console.log("Chosen scheme true",index);
       self.getEditCardAssignment();
       }
       else{
        let message = "You must be Select any one CardScheme";
        self.Flash.create('danger', message);
       }
    }

    backToOne(){
        $( ".tabs li:nth-child(2)" ).removeClass( "is-active" );
        $( ".tabs li:nth-child(1)" ).addClass( "is-active" );
        $( "#order1" ).addClass( "is-active" ).attr("aria-hidden","false");
        $( "#order2" ).removeClass( "is-active" ).attr("aria-hidden","true");
    }
    backToTwo(){
        let self=this;
        $( ".tabs li:nth-child(3)" ).removeClass( "is-active" );
        $( ".tabs li:nth-child(2)" ).addClass( "is-active" );
        $( "#order2" ).addClass( "is-active" ).attr("aria-hidden","false");
        $( "#order3" ).removeClass( "is-active" ).attr("aria-hidden","true");
        self.$scope.cardassign.$setPristine();

    }

    proceedToTwo(){
        $( ".tabs li:nth-child(1)" ).removeClass( "is-active" );
        $( ".tabs li:nth-child(2)" ).addClass( "is-active" );
        $( "#order2" ).addClass( "is-active" ).attr("aria-hidden","false");
        $( "#order1" ).removeClass( "is-active" ).attr("aria-hidden","true");
    }



    togglePreLoadSelection(preload){
        let self=this;
        console.log('preload',self.preloads);
        if(!(self.$scope.selectedScheme.giftCardSchemeData.hasOwnProperty("preload"))){
            self.$scope.selectedScheme.giftCardSchemeData={
                preload:[]
            }
        }
        var idx = self.$scope.selectedScheme.giftCardSchemeData.preload.indexOf(preload);
        if(idx > -1){
            self.$scope.selectedScheme.giftCardSchemeData.preload.splice(idx, 1);
        }
        else{
            self.$scope.selectedScheme.giftCardSchemeData.preload.push(preload);
        }
        if(_.isEmpty(self.$scope.selectedScheme.giftCardSchemeData.preload)){
            delete self.$scope.selectedScheme.giftCardSchemeData.preload;
        }
        self.checkGiftSchemeIsselected();
     }

     toggleSelection(preload){
        let self=this;
        console.log('preload',self.preloads);
        if(!(self.$scope.selectedScheme.eGiftCardSchemeData.hasOwnProperty("preload"))){
            self.$scope.selectedScheme.eGiftCardSchemeData={
                preload:[]
            }
        }
        var idx = self.$scope.selectedScheme.eGiftCardSchemeData.preload.indexOf(preload);
        if(idx > -1){
            self.$scope.selectedScheme.eGiftCardSchemeData.preload.splice(idx, 1);
        }
        else{
            self.$scope.selectedScheme.eGiftCardSchemeData.preload.push(preload);
        }
        if(_.isEmpty(self.$scope.selectedScheme.eGiftCardSchemeData.preload)){
            delete self.$scope.selectedScheme.eGiftCardSchemeData.preload;
        }
        self.checkeGiftSchemeIsselected();
     }

     toggleEditSelection(preload){
        let self=this;
        console.log('preload',self.preloads);
        if(!(self.$scope.editSelectedScheme.hasOwnProperty("eGiftCardSchemeData"))){
            self.$scope.editSelectedScheme.eGiftCardSchemeData={};
            self.$scope.editSelectedScheme.eGiftCardSchemeData={preload:[]}
        }
        else{
            if(!(self.$scope.editSelectedScheme.eGiftCardSchemeData.hasOwnProperty("preload"))){
            self.$scope.editSelectedScheme.eGiftCardSchemeData.preload=[];
            }
        }

        var idx = self.$scope.editSelectedScheme.eGiftCardSchemeData.preload.indexOf(preload);
        if(!(self.$scope.finalEditCardSchemeJson.cardAssignmentData.hasOwnProperty("eGiftCardSchemeData"))){
            self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData={};
        }
        if(self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.hasOwnProperty('preload')){
         var editIdx =  _.findIndex(self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.preload, function(o) { return o.value == preload; });
        }
        if(idx > -1){
            self.$scope.editSelectedScheme.eGiftCardSchemeData.preload.splice(idx, 1);
        }
        else{
            self.$scope.editSelectedScheme.eGiftCardSchemeData.preload.push(preload);
        }

        if(editIdx > -1){
            self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.preload.splice(idx, 1);
        }
        else{
            if(self.$scope.ordersbyId.cardassignmentdata.hasOwnProperty("eGiftCardSchemeData")){
            var index = _.findIndex(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.preload, function(o) { return o.value == preload; });
            if( index > -1){
                if(!(self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.hasOwnProperty("preload"))){
                    self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.preload=[];
                }
                // self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.preload[index]={
                //     value:self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.preload[index].value,
                //     quantity:self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.preload[index].quantity,
                //     expiryMonths:self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.preload[index].expiryMonths
                // };
                self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.preload.push(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.preload[index]);
             }
        }
    }
        if(_.isEmpty(self.$scope.editSelectedScheme.eGiftCardSchemeData.preload)){
            delete self.$scope.editSelectedScheme.eGiftCardSchemeData.preload;
        }
        self.checkEditeGiftSchemeIsselected();
     }


     toggleEditFreecardSelection(freecard){
        let self=this;
        if(self.$scope.editSelectedScheme.giftCardSchemeData.hasOwnProperty("freecard")){
            self.$scope.editChoosen.freecard =false;
            delete self.$scope.editSelectedScheme.giftCardSchemeData.freecard ;
            if(self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.hasOwnProperty("freecard")){
              delete self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.freecard
            }
        }
        else{
            self.$scope.editChoosen.freecard =true;
            self.$scope.editSelectedScheme.giftCardSchemeData.freecard={
                min:self.$scope.editSelectedScheme.freecards.min,
                max:self.$scope.editSelectedScheme.freecards.max
            }
            if(!(self.$scope.finalEditCardSchemeJson.cardAssignmentData.hasOwnProperty("giftCardSchemeData"))){
            self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData={}
            }
            if(self.$scope.ordersbyId.cardassignmentdata.hasOwnProperty("giftCardSchemeData")){
            if(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.hasOwnProperty("freecard")){
            self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.freecard={
                expiryMonths:parseInt(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.freecard.expiryMonths),
                quantity:parseInt(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.freecard.quantity),
                min:parseInt(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.freecard.min),
                max:parseInt(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.freecard.max)

            }
        }
    }
        }

      self.checkEditGiftSchemeIsselected();

     }

     toggleFreecardSelection(freecard){
        let self=this;
        if(self.$scope.selectedScheme.giftCardSchemeData.hasOwnProperty("freecard")){
            self.$scope.choosen.freecard =false;
            delete self.$scope.selectedScheme.giftCardSchemeData.freecard ;
        }
        else{
            self.$scope.choosen.freecard =true;
            self.$scope.selectedScheme.giftCardSchemeData.freecard={
                min:self.$scope.selectedScheme.freecards.min,
                max:self.$scope.selectedScheme.freecards.max
            }
        }

    self.checkGiftSchemeIsselected();

     }

     toggleEditPreLoadSelection(preload){
        let self=this;
        console.log('preload',self.preloads);
        if(!(self.$scope.editSelectedScheme.hasOwnProperty("giftCardSchemeData"))){
            self.$scope.editSelectedScheme.giftCardSchemeData ={};
            self.$scope.editSelectedScheme.giftCardSchemeData={
                preload:[]
            }
        }
        else{
        if(!(self.$scope.editSelectedScheme.giftCardSchemeData.hasOwnProperty("preload"))){
            self.$scope.editSelectedScheme.giftCardSchemeData.preload=[]
            }
        }

        var idx = self.$scope.editSelectedScheme.giftCardSchemeData.preload.indexOf(preload);
        if(!(self.$scope.finalEditCardSchemeJson.cardAssignmentData.hasOwnProperty("giftCardSchemeData"))){
            self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData={};
        }
        if(self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.hasOwnProperty('preload')){
            var editIdx =  _.findIndex(self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.preload, function(o) { return o.value == preload; });
        }
        if(idx > -1){
            self.$scope.editSelectedScheme.giftCardSchemeData.preload.splice(idx, 1);
        }
        else{
            self.$scope.editSelectedScheme.giftCardSchemeData.preload.push(preload);
        }
        if(editIdx > -1){
            self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.preload.splice(idx, 1);
        }
        else{
            if(self.$scope.ordersbyId.cardassignmentdata.hasOwnProperty("giftCardSchemeData")){
            var index = _.findIndex(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.preload, function(o) { return o.value == preload; });
            if(index > -1){
                if(!(self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.hasOwnProperty("preload"))){
                    self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.preload=[];
                }
                // self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.preload[index]={
                //     value:self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.preload[index].value,
                //     quantity:self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.preload[index].quantity,
                //     expiryMonths:self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.preload[index].expiryMonths
                // };
                self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.preload.push(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.preload[index]);
            }
        }
        }
        if(_.isEmpty(self.$scope.editSelectedScheme.giftCardSchemeData.preload)){
            delete self.$scope.editSelectedScheme.giftCardSchemeData.preload;
        }
        self.checkEditGiftSchemeIsselected();
     }

     toggleEFreecardSelection(freecard){
        let self=this;
        if(self.$scope.selectedScheme.eGiftCardSchemeData.hasOwnProperty("freecard")){
            self.$scope.choosen.eFreecard =false;
            delete self.$scope.selectedScheme.eGiftCardSchemeData.freecard ;
        }
        else{
            self.$scope.choosen.eFreecard =true;
            self.$scope.selectedScheme.eGiftCardSchemeData.freecard={
                min:self.$scope.selectedScheme.eFreecard.min,
                max:self.$scope.selectedScheme.eFreecard.max
            }
        }

    self.checkeGiftSchemeIsselected();

     }

     toggleEditEFreecardSelection(freecard){
        let self=this;
        if(!(self.$scope.editSelectedScheme.hasOwnProperty("eGiftCardSchemeData"))){
            self.$scope.editSelectedScheme.eGiftCardSchemeData={};
        }
        if(self.$scope.editSelectedScheme.eGiftCardSchemeData.hasOwnProperty("freecard")){
            self.$scope.editChoosen.eFreecard =false;
            delete self.$scope.editSelectedScheme.eGiftCardSchemeData.freecard ;
            if(self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.hasOwnProperty('freecard')){
                delete self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.freecard
            }
        }
        else{
            self.$scope.editChoosen.eFreecard =true;
            self.$scope.editSelectedScheme.eGiftCardSchemeData.freecard={
                min:self.$scope.editSelectedScheme.eFreecard.min,
                max:self.$scope.editSelectedScheme.eFreecard.max
            }
            if(!(self.$scope.finalEditCardSchemeJson.cardAssignmentData.hasOwnProperty("eGiftCardSchemeData"))){
                self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData={}
            }
            if(self.$scope.ordersbyId.cardassignmentdata.hasOwnProperty("eGiftCardSchemeData")){
            if(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.hasOwnProperty("freecard")){
                self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.freecard={
                          expiryMonths:parseInt(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.freecard.expiryMonths),
                          quantity:parseInt(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.freecard.quantity),
                          min:parseInt(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.freecard.min),
                          max:parseInt(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.freecard.max)

                     }         }
                    }
        }

    self.checkEditeGiftSchemeIsselected();

     }

     toggleCrossborderSelection(crossborder){
        let self=this;
        if(self.$scope.selectedScheme.giftCardSchemeData.hasOwnProperty("crossborder")) {
            self.$scope.choosen.crossborder = false;
            delete self.$scope.selectedScheme.giftCardSchemeData.crossborder ;
        }
        else{
            self.$scope.choosen.crossborder = true;
            self.$scope.selectedScheme.giftCardSchemeData.crossborder={
                country:self.$scope.cardScheme.giftcardschemedata.crossborder.country,
                min:self.$scope.cardScheme.giftcardschemedata.crossborder.min,
                max:self.$scope.cardScheme.giftcardschemedata.crossborder.max
            }

     }
     self.checkGiftSchemeIsselected();
    }

    toggleEditCrossborderSelection(crossborder){
        let self=this;
        if(!(self.$scope.editSelectedScheme.hasOwnProperty("giftCardSchemeData"))){
            self.$scope.editSelectedScheme.giftCardSchemeData={};
        }
        if(self.$scope.editSelectedScheme.giftCardSchemeData.hasOwnProperty("crossborder")) {
            self.$scope.editChoosen.crossborder = false;
            delete self.$scope.editSelectedScheme.giftCardSchemeData.crossborder ;
            if(self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.hasOwnProperty('crossborder')){
               delete self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.crossborder
            }
        }
        else{
            self.$scope.editChoosen.crossborder = true;
            if(!(self.$scope.editSelectedScheme.hasOwnProperty("giftCardSchemeData"))){
                self.$scope.editSelectedScheme.giftCardSchemeData={};
            }
            self.$scope.editSelectedScheme.giftCardSchemeData.crossborder={
                country:self.$scope.ordersbyId.cardscheme.giftcardschemedata.crossborder.country,
                min:self.$scope.ordersbyId.cardscheme.giftcardschemedata.crossborder.min,
                max:self.$scope.ordersbyId.cardscheme.giftcardschemedata.crossborder.max
            }
            if(!(self.$scope.ordersbyId.cardassignmentdata.hasOwnProperty("giftCardSchemeData"))){
                 self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData={};
            }
            if(self.$scope.ordersbyId.cardassignmentdata.hasOwnProperty("giftCardSchemeData")){
            if(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.hasOwnProperty("crossborder")){
               if(!(self.$scope.finalEditCardSchemeJson.cardAssignmentData.hasOwnProperty("giftCardSchemeData"))){
                self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData={};
               }
            self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.crossborder={
                    country : self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.crossborder.country,
                    min:self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.crossborder.min,
                    max:self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.crossborder.max,
                    expiryMonths: parseInt(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.crossborder.expiryMonths),
                    quantity: parseInt(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.crossborder.quantity)
                };
     }
    }
    }
     self.checkEditGiftSchemeIsselected();
    }

    toggleECrossborderSelection(crossborder){
        let self=this;
        if(self.$scope.selectedScheme.eGiftCardSchemeData.hasOwnProperty("crossborder")) {
            self.$scope.choosen.Ecrossborder = false;
            delete self.$scope.selectedScheme.eGiftCardSchemeData.crossborder ;
        }
        else{
            self.$scope.choosen.Ecrossborder = true;
            self.$scope.selectedScheme.eGiftCardSchemeData.crossborder={
                country:self.$scope.cardScheme.egiftcardschemedata.crossborder.country,
                min:self.$scope.cardScheme.egiftcardschemedata.crossborder.min,
                max:self.$scope.cardScheme.egiftcardschemedata.crossborder.max
            }

     }
     self.checkeGiftSchemeIsselected();
    }

    toggleEditECrossborderSelection(crossborder){
        let self=this;
        if(!(self.$scope.editSelectedScheme.hasOwnProperty("eGiftCardSchemeDat"))){
            self.$scope.editSelectedScheme.eGiftCardSchemeDat={};
        }
        if(self.$scope.editSelectedScheme.eGiftCardSchemeData.hasOwnProperty("crossborder")) {
            self.$scope.editChoosen.Ecrossborder = false;
            delete self.$scope.editSelectedScheme.eGiftCardSchemeData.crossborder ;
            if(self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.hasOwnProperty('crossborder')){
                 delete self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.crossborder
            }
        }
        else{
            self.$scope.editChoosen.Ecrossborder = true;
            if(!(self.$scope.editSelectedScheme.hasOwnProperty("egiftcardschemedata"))){
                self.$scope.editSelectedScheme.egiftcardschemedata={};
            }
            self.$scope.editSelectedScheme.eGiftCardSchemeData.crossborder={
//                country:self.$scope.cardScheme.egiftcardschemedata.crossborder.country,
                country:self.$scope.ordersbyId.cardscheme.egiftcardschemedata.crossborder.country,
                min:self.$scope.ordersbyId.cardscheme.egiftcardschemedata.crossborder.min,
                max:self.$scope.ordersbyId.cardscheme.egiftcardschemedata.crossborder.max

            }
            if(!(self.$scope.finalEditCardSchemeJson.cardAssignmentData.hasOwnProperty("eGiftCardSchemeData"))){
                self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData={};
            }
            if(self.$scope.ordersbyId.cardassignmentdata.hasOwnProperty("eGiftCardSchemeData")){
            if(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.hasOwnProperty("crossborder")){
                if(!(self.$scope.finalEditCardSchemeJson.cardAssignmentData.hasOwnProperty("eGiftCardSchemeData"))){
                    self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData={};
                }
                self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.crossborder={
                        country : self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.crossborder.country,
                        min:self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.crossborder.min,
                        max:self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.crossborder.max,
                        expiryMonths: parseInt(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.crossborder.expiryMonths),
                        quantity:parseInt(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.crossborder.quantity)
                    };
                }
            }

     }
     self.checkEditeGiftSchemeIsselected();
    }

    toggleRedeemSelection(redeem){
        let self=this;
        if( self.$scope.selectedScheme.loyaltyCardSchemeData.hasOwnProperty("rewardRedeem")){
            self.$scope.choosen.rewardRedeem = false;
            delete self.$scope.selectedScheme.loyaltyCardSchemeData.rewardRedeem ;
        }
        else{
            self.$scope.choosen.rewardRedeem=true;
            self.$scope.selectedScheme.loyaltyCardSchemeData.rewardRedeem={
                quantity:''
            }
     }
     self.checkLoyaltySchemeIsselected();
    }

    toggleEditRedeemSelection(redeem){
        let self=this;
        if(!(self.$scope.editSelectedScheme.hasOwnProperty("loyaltyCardSchemeData"))){
            self.$scope.editSelectedScheme.loyaltyCardSchemeData={};
        }
        if( self.$scope.editSelectedScheme.loyaltyCardSchemeData.hasOwnProperty("rewardRedeem")){
            self.$scope.editChoosen.rewardRedeem = false;
            delete self.$scope.editSelectedScheme.loyaltyCardSchemeData.rewardRedeem ;
            if(self.$scope.finalEditCardSchemeJson.cardAssignmentData.loyaltyCardSchemeData.hasOwnProperty('rewardRedeem')){
                delete self.$scope.finalEditCardSchemeJson.cardAssignmentData.loyaltyCardSchemeData.rewardRedeem
            }
        }
        else{
            self.$scope.editChoosen.rewardRedeem=true;
            self.$scope.editSelectedScheme.loyaltyCardSchemeData.rewardRedeem={
                quantity:''
            }
            if(!(self.$scope.finalEditCardSchemeJson.cardAssignmentData.hasOwnProperty("loyaltyCardSchemeData"))){
                self.$scope.finalEditCardSchemeJson.cardAssignmentData.loyaltyCardSchemeData={};
            }
            if(self.$scope.ordersbyId.cardassignmentdata.hasOwnProperty("loyaltyCardSchemeData")){
            if(self.$scope.ordersbyId.cardassignmentdata.loyaltyCardSchemeData.hasOwnProperty("rewardRedeem")){
                self.$scope.finalEditCardSchemeJson.cardAssignmentData.loyaltyCardSchemeData.rewardRedeem={
                          quantity:parseInt(self.$scope.ordersbyId.cardassignmentdata.loyaltyCardSchemeData.rewardRedeem.quantity),

                      }
                }
            }
     }
     self.checkEditLoyaltySchemeIsselected();
    }

    toggleErewardRedeemSelection(redeem){
        let self=this;
        if( self.$scope.selectedScheme.eLoyaltyCardSchemeData.hasOwnProperty("rewardRedeem")){
            self.$scope.choosen.ErewardRedeem = false;
            delete self.$scope.selectedScheme.eLoyaltyCardSchemeData.rewardRedeem ;
        }
        else{
            self.$scope.choosen.ErewardRedeem=true;
            self.$scope.selectedScheme.eLoyaltyCardSchemeData.rewardRedeem={
                quantity:''
            }
     }
     self.checkELoyaltySchemeIsselected();
    }

    toggleEditErewardRedeemSelection(redeem){
        let self=this;
        if(!(self.$scope.editSelectedScheme.hasOwnProperty("eLoyaltyCardSchemeData"))){
            self.$scope.editSelectedScheme.eLoyaltyCardSchemeData = {};
        }
        if( self.$scope.editSelectedScheme.eLoyaltyCardSchemeData.hasOwnProperty("rewardRedeem")){
            self.$scope.editChoosen.ErewardRedeem = false;
            delete self.$scope.editSelectedScheme.eLoyaltyCardSchemeData.rewardRedeem ;
            if(self.$scope.finalEditCardSchemeJson.cardAssignmentData.eLoyaltyCardSchemeData.hasOwnProperty('rewardRedeem')){
                delete self.$scope.finalEditCardSchemeJson.cardAssignmentData.eLoyaltyCardSchemeData.rewardRedeem
            }
        }
        else{
            self.$scope.editChoosen.ErewardRedeem=true;
            self.$scope.editSelectedScheme.eLoyaltyCardSchemeData.rewardRedeem={
                quantity:''
            }
            if(!(self.$scope.finalEditCardSchemeJson.cardAssignmentData.hasOwnProperty("eLoyaltyCardSchemeData"))){
                self.$scope.finalEditCardSchemeJson.cardAssignmentData.eLoyaltyCardSchemeData={};
            }
            if(self.$scope.ordersbyId.cardassignmentdata.hasOwnProperty("eLoyaltyCardSchemeData")){
            if(self.$scope.ordersbyId.cardassignmentdata.eLoyaltyCardSchemeData.hasOwnProperty("rewardRedeem")){
                self.$scope.finalEditCardSchemeJson.cardAssignmentData.eLoyaltyCardSchemeData.rewardRedeem={
                          quantity:parseInt(self.$scope.ordersbyId.cardassignmentdata.eLoyaltyCardSchemeData.rewardRedeem.quantity),

                      }
                }
            }
     }
     self.checkEditELoyaltySchemeIsselected();
    }

    toggleCrossSelection(crossborder){
        let self=this;
        if(self.$scope.selectedScheme.loyaltyCardSchemeData.hasOwnProperty("crossborder")) {
            self.$scope.choosen.Lcrossborder=false;
            delete self.$scope.selectedScheme.loyaltyCardSchemeData.crossborder ;

        }
        else{
            self.$scope.choosen.Lcrossborder=true;
            self.$scope.selectedScheme.loyaltyCardSchemeData.crossborder={
                country:self.$scope.cardScheme.loyaltycardschemedata.crossBorder.country,

            }

     }
     self.checkLoyaltySchemeIsselected();
    }

    toggleEditCrossSelection(crossborder){
        let self=this;
        if(!(self.$scope.editSelectedScheme.hasOwnProperty("loyaltyCardSchemeData"))){
            self.$scope.editSelectedScheme.loyaltyCardSchemeData={};
        }
        if(self.$scope.editSelectedScheme.loyaltyCardSchemeData.hasOwnProperty("crossborder")) {
            self.$scope.editChoosen.Lcrossborder=false;
            delete self.$scope.editSelectedScheme.loyaltyCardSchemeData.crossborder ;
        if( self.$scope.finalEditCardSchemeJson.cardAssignmentData.loyaltyCardSchemeData.hasOwnProperty('crossBorder')){
            delete  self.$scope.finalEditCardSchemeJson.cardAssignmentData.loyaltyCardSchemeData.crossBorder
             }
        }
        else{
            self.$scope.editChoosen.Lcrossborder=true;
            self.$scope.editSelectedScheme.loyaltyCardSchemeData.crossborder={
                country:self.$scope.ordersbyId.cardscheme.loyaltycardschemedata.crossBorder.country
            }
            if(!(self.$scope.finalEditCardSchemeJson.cardAssignmentData.hasOwnProperty("loyaltyCardSchemeData"))){
                self.$scope.finalEditCardSchemeJson.cardAssignmentData.loyaltyCardSchemeData={};
            }
            if(self.$scope.ordersbyId.cardassignmentdata.hasOwnProperty("loyaltyCardSchemeData")){
            if(self.$scope.ordersbyId.cardassignmentdata.loyaltyCardSchemeData.hasOwnProperty("crossBorder")){
                self.$scope.finalEditCardSchemeJson.cardAssignmentData.loyaltyCardSchemeData.crossBorder={
                        country : self.$scope.ordersbyId.cardassignmentdata.loyaltyCardSchemeData.crossBorder.country,
                         quantity: parseInt(self.$scope.ordersbyId.cardassignmentdata.loyaltyCardSchemeData.crossBorder.quantity)
                    };
                }
            }
     }
     self.checkEditLoyaltySchemeIsselected();
    }

    toggleElCrossborderSelection(crossborder){
        let self=this;
        if(self.$scope.selectedScheme.eLoyaltyCardSchemeData.hasOwnProperty("crossborder")) {
            self.$scope.choosen.eLcrossborder=false;
            delete self.$scope.selectedScheme.eLoyaltyCardSchemeData.crossborder ;

        }
        else{
            self.$scope.choosen.eLcrossborder=true;
            self.$scope.selectedScheme.eLoyaltyCardSchemeData.crossborder={
                country:self.$scope.cardScheme.eloyaltycardschemedata.crossBorder.country,

            }

     }
     self.checkELoyaltySchemeIsselected();
    }

    toggleEditElCrossborderSelection(crossborder){
        let self=this;
        if(!(self.$scope.editSelectedScheme.hasOwnProperty("eLoyaltyCardSchemeData"))){
            self.$scope.editSelectedScheme.eLoyaltyCardSchemeData={};
        }
        if(self.$scope.editSelectedScheme.eLoyaltyCardSchemeData.hasOwnProperty("crossborder")) {
            self.$scope.editChoosen.eLcrossborder=false;
            delete self.$scope.editSelectedScheme.eLoyaltyCardSchemeData.crossborder ;
            if(self.$scope.finalEditCardSchemeJson.cardAssignmentData.eLoyaltyCardSchemeData.hasOwnProperty('crossBorder')){
                delete self.$scope.finalEditCardSchemeJson.cardAssignmentData.eLoyaltyCardSchemeData.crossBorder
            }
        }
        else{
            self.$scope.editChoosen.eLcrossborder=true;
            self.$scope.editSelectedScheme.eLoyaltyCardSchemeData.crossborder={
                country:self.$scope.ordersbyId.cardscheme.eloyaltycardschemedata.crossBorder.country,

            }
            if(!(self.$scope.finalEditCardSchemeJson.cardAssignmentData.hasOwnProperty('eLoyaltyCardSchemeData'))){
                self.$scope.finalEditCardSchemeJson.cardAssignmentData.eLoyaltyCardSchemeData={}
            }
            if(self.$scope.ordersbyId.cardassignmentdata.hasOwnProperty("eLoyaltyCardSchemeData")){
            if(self.$scope.ordersbyId.cardassignmentdata.eLoyaltyCardSchemeData.hasOwnProperty("crossBorder")){
            self.$scope.finalEditCardSchemeJson.cardAssignmentData.eLoyaltyCardSchemeData.crossBorder={
                country : self.$scope.ordersbyId.cardassignmentdata.eLoyaltyCardSchemeData.crossBorder.country,
                 quantity: parseInt(self.$scope.ordersbyId.cardassignmentdata.eLoyaltyCardSchemeData.crossBorder.quantity)
            };
        }
    }

     }
     self.checkELoyaltySchemeIsselected();
    }

    checkGiftSchemeIsselected(){
        let self =this;
        console.log("self.$scope.selectedScheme",self.$scope.selectedScheme);
        if(_.isEmpty(self.$scope.selectedScheme.giftCardSchemeData)){
            self.$scope.selectedScheme.isGiftCardApplicable  =false;
            console.log("please choose any one option")
        }
        else{
            self.$scope.selectedScheme.isGiftCardApplicable  =true;
        }

    }

    checkEditGiftSchemeIsselected(){
        let self =this;
        console.log("self.$scope.editSelectedScheme",self.$scope.editSelectedScheme);
        if(_.isEmpty(self.$scope.editSelectedScheme.giftCardSchemeData)){
            self.$scope.editSelectedScheme.isGiftCardApplicable  =false;
            self.checkEditGiftSelectedAll(true);
        }
        else{
            self.$scope.editSelectedScheme.isGiftCardApplicable  =true;

        }
    }

    checkeGiftSchemeIsselected(){
        let self =this;

        if(_.isEmpty(self.$scope.selectedScheme.eGiftCardSchemeData)){
            self.$scope.selectedScheme.isEGiftCardApplicable  =false;
            console.log("please choose any one option")
        }
        else{
            self.$scope.selectedScheme.isEGiftCardApplicable  =true;
        }
    }

    checkEditeGiftSchemeIsselected(){
        let self =this;

        if(_.isEmpty(self.$scope.editSelectedScheme.eGiftCardSchemeData)){
            self.$scope.editSelectedScheme.isEGiftCardApplicable  =false;
            self.checkEditEleGiftSelectedAll(true)
        }
        else{
            self.$scope.editSelectedScheme.isEGiftCardApplicable  =true;

        }
    }


    checkLoyaltySchemeIsselected(){
        let self =this;
        if(_.isEmpty(self.$scope.selectedScheme.loyaltyCardSchemeData)){
            self.$scope.selectedScheme.isLoyaltyCardApplicable =false;
            }
        else{
            self.$scope.selectedScheme.isLoyaltyCardApplicable =true;
        }
    }

    checkEditLoyaltySchemeIsselected(){
        let self =this;
        if(_.isEmpty(self.$scope.editSelectedScheme.loyaltyCardSchemeData)){
            self.$scope.editSelectedScheme.isLoyaltyCardApplicable =false;
            self.checkEditLoyaltySelectedAll(true);
            }
        else{
            self.$scope.editSelectedScheme.isLoyaltyCardApplicable =true;

        }
    }

    checkELoyaltySchemeIsselected(){
        let self =this;
        if(_.isEmpty(self.$scope.selectedScheme.eLoyaltyCardSchemeData)){
            self.$scope.selectedScheme.isELoyaltyCardApplicable =false;
            }
        else{
            self.$scope.selectedScheme.isELoyaltyCardApplicable =true;
        }
    }

    checkEditELoyaltySchemeIsselected(){
        let self =this;
        if(_.isEmpty(self.$scope.editSelectedScheme.eLoyaltyCardSchemeData)){
            self.$scope.editSelectedScheme.isELoyaltyCardApplicable =false;
            self.checkEditEleLoyaltySelectedAll(true);
            }
        else{
            self.$scope.editSelectedScheme.isELoyaltyCardApplicable =true;

        }
    }

    checkGiftSelectedAll(param){
        let self =this;
        if(param){
            if(self.$scope.cardScheme.giftcardschemedata.hasOwnProperty('preload')){
            self.$scope.selectedScheme.giftCardSchemeData.preload = [];
            }
            self.$scope.choosen.freecard = false;
            self.$scope.choosen.crossborder = false;
            self.$scope.selectedScheme.isGiftCardApplicable =false;
            delete self.$scope.selectedScheme.giftCardSchemeData.preload;
            delete self.$scope.selectedScheme.giftCardSchemeData.freecard;
            delete self.$scope.selectedScheme.giftCardSchemeData.crossborder;
        }
        else{
            if(self.$scope.cardScheme.giftcardschemedata.hasOwnProperty('preload')){
            self.$scope.selectedScheme.giftCardSchemeData.preload =  self.$scope.cardScheme.giftcardschemedata.preload;
            }
            self.$scope.choosen.freecard = true;
            self.$scope.choosen.crossborder = true;
            self.$scope.selectedScheme.isGiftCardApplicable =true;
            self.$scope.selectedScheme.giftCardSchemeData.freecard =
            {
                min:self.$scope.selectedScheme.freecards.min,
                max:self.$scope.selectedScheme.freecards.max
            };
            self.$scope.selectedScheme.giftCardSchemeData.crossborder =
            {
                country:self.$scope.cardScheme.giftcardschemedata.crossborder.country,
                min:self.$scope.cardScheme.giftcardschemedata.crossborder.min,
                max:self.$scope.cardScheme.giftcardschemedata.crossborder.max
            };
        }
    }

    checkEditGiftSelectedAll(param){
        let self =this;
        if(param){
            if(self.$scope.ordersbyId.cardscheme.giftcardschemedata.hasOwnProperty('preload')){
            self.$scope.editSelectedScheme.giftCardSchemeData.preload = [];
            }
            self.$scope.editChoosen.freecard = false;
            self.$scope.editChoosen.crossborder = false;
            self.$scope.editSelectedScheme.isGiftCardApplicable =false;
            delete self.$scope.editSelectedScheme.giftCardSchemeData.preload;
            delete self.$scope.editSelectedScheme.giftCardSchemeData.freecard;
            delete self.$scope.editSelectedScheme.giftCardSchemeData.crossborder;
            delete self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData
            // if(self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.hasOwnProperty('crossborder')){
            //    delete self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.crossborder
            // }
            // if(self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.hasOwnProperty('preload')){
            //     delete self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.preload
            //  }
            //  if(self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.hasOwnProperty('freecard')){
            //     delete self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.freecard
            //  }

        }
        else{
            if(!(self.$scope.editSelectedScheme.hasOwnProperty("eGiftCardSchemeData"))){
                self.$scope.editSelectedScheme.giftCardSchemeData={};
            }
            if(self.$scope.ordersbyId.cardscheme.giftcardschemedata.hasOwnProperty('preload')){
                self.$scope.editSelectedScheme.giftCardSchemeData.preload =[];
            self.$scope.editSelectedScheme.giftCardSchemeData.preload =  self.$scope.ordersbyId.cardscheme.giftcardschemedata.preload;
            }
            self.$scope.editChoosen.freecard = true;
            self.$scope.editChoosen.crossborder = true;
            self.$scope.editSelectedScheme.isGiftCardApplicable =true;
            self.$scope.editSelectedScheme.giftCardSchemeData.freecard =
            {
                min:self.$scope.editSelectedScheme.freecards.min,
                max:self.$scope.editSelectedScheme.freecards.max
            };
            self.$scope.editSelectedScheme.giftCardSchemeData.crossborder =
            {
                country:self.$scope.ordersbyId.cardscheme.giftcardschemedata.crossborder.country,
                min:self.$scope.ordersbyId.cardscheme.giftcardschemedata.crossborder.min,
                max:self.$scope.ordersbyId.cardscheme.giftcardschemedata.crossborder.max
            };
            self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData={};
            if(self.$scope.ordersbyId.cardassignmentdata.hasOwnProperty("giftCardSchemeData")){
;            if(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.hasOwnProperty("crossborder")){
                self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.crossborder={
                    country : self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.crossborder.country,
                    expiryMonths: parseInt(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.crossborder.expiryMonths),
                    quantity: parseInt(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.crossborder.quantity),
                    min:parseInt(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.crossborder.min),
                    max:parseInt(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.crossborder.max)
                };


             };

            if(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.hasOwnProperty("preload")){
                self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.preload=[];
                self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.preload = angular.copy(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.preload);

            }
            if(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.hasOwnProperty("freecard")){
              self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.freecard={
                        expiryMonths:parseInt(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.freecard.expiryMonths),
                        quantity:parseInt(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.freecard.quantity),
                        min:parseInt(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.freecard.min),
                        max:parseInt(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.freecard.max)

                    }

            }
        }
        }
    }

    checkLoyaltySelectedAll(param){
        let self =this;
        if(param){
        self.$scope.choosen.rewardRedeem =false;
        self.$scope.choosen.Lcrossborder = false;
        self.$scope.selectedScheme.isLoyaltyCardApplicable =false;
        delete self.$scope.selectedScheme.loyaltyCardSchemeData.rewardRedeem;
        delete self.$scope.selectedScheme.loyaltyCardSchemeData.crossborder;
        }
        else{
            self.$scope.choosen.rewardRedeem =true;
            self.$scope.choosen.Lcrossborder = true;
            self.$scope.selectedScheme.isLoyaltyCardApplicable =true;
            self.$scope.selectedScheme.loyaltyCardSchemeData.rewardRedeem=self.redeem;
            self.$scope.selectedScheme.loyaltyCardSchemeData.crossborder={
                country :self.$scope.cardScheme.loyaltycardschemedata.crossBorder.country};
        }
    }

    checkEditLoyaltySelectedAll(param){
        let self =this;
        if(param){
        self.$scope.editChoosen.rewardRedeem =false;
        self.$scope.editChoosen.Lcrossborder = false;
        self.$scope.editSelectedScheme.isLoyaltyCardApplicable =false;
        delete self.$scope.editSelectedScheme.loyaltyCardSchemeData.rewardRedeem;
        delete self.$scope.editSelectedScheme.loyaltyCardSchemeData.crossborder;
        delete self.$scope.finalEditCardSchemeJson.cardAssignmentData.loyaltyCardSchemeData
        /*if(self.$scope.finalEditCardSchemeJson.cardAssignmentData.loyaltyCardSchemeData.hasOwnProperty('crossBorder')){
            delete self.$scope.finalEditCardSchemeJson.cardAssignmentData.loyaltyCardSchemeData.crossBorder;
        }
        if(self.$scope.finalEditCardSchemeJson.cardAssignmentData.loyaltyCardSchemeData.hasOwnProperty('rewardRedeem')){
            delete self.$scope.finalEditCardSchemeJson.cardAssignmentData.loyaltyCardSchemeData.rewardRedeem;
        }*/
        }
        else{
            self.$scope.editChoosen.rewardRedeem =true;
            self.$scope.editChoosen.Lcrossborder = true;
            self.$scope.editSelectedScheme.isLoyaltyCardApplicable =true;
            if(!(self.$scope.editSelectedScheme.hasOwnProperty("loyaltyCardSchemeData"))){
                self.$scope.editSelectedScheme.loyaltyCardSchemeData={};
            }
            self.$scope.editSelectedScheme.loyaltyCardSchemeData.rewardRedeem=self.editredeem;
            self.$scope.editSelectedScheme.loyaltyCardSchemeData.crossborder={
                country :self.$scope.ordersbyId.cardscheme.loyaltycardschemedata.crossBorder.country};
                 self.$scope.finalEditCardSchemeJson.cardAssignmentData.loyaltyCardSchemeData = {};
                 if(self.$scope.ordersbyId.cardassignmentdata.hasOwnProperty("loyaltyCardSchemeData")){
                if(self.$scope.ordersbyId.cardassignmentdata.loyaltyCardSchemeData.hasOwnProperty("crossBorder")){
                    self.$scope.finalEditCardSchemeJson.cardAssignmentData.loyaltyCardSchemeData.crossBorder={
                            country : self.$scope.ordersbyId.cardassignmentdata.loyaltyCardSchemeData.crossBorder.country,
                             quantity: parseInt(self.$scope.ordersbyId.cardassignmentdata.loyaltyCardSchemeData.crossBorder.quantity)
                        };

                        if(self.$scope.editChoosen.Lcrossborder){
                         self.$scope.editSelectedScheme.loyaltyCardSchemeData.crossborder={
                             country : self.$scope.ordersbyId.cardassignmentdata.loyaltyCardSchemeData.crossBorder.country
                         }
                     }
                    }

                    if(self.$scope.ordersbyId.cardassignmentdata.loyaltyCardSchemeData.hasOwnProperty("rewardRedeem")){
                      self.$scope.finalEditCardSchemeJson.cardAssignmentData.loyaltyCardSchemeData.rewardRedeem={
                                quantity:parseInt(self.$scope.ordersbyId.cardassignmentdata.loyaltyCardSchemeData.rewardRedeem.quantity),

                            }


                    }
                }
        }
    }

    checkEleGiftSelectedAll(param){
        let self =this;
        if(param){
            if(self.$scope.cardScheme.egiftcardschemedata.hasOwnProperty('preload')){
                self.$scope.selectedScheme.eGiftCardSchemeData.preload = [];
            }
            self.$scope.choosen.eFreecard = false;
            self.$scope.choosen.Ecrossborder = false;
            self.$scope.selectedScheme.isEGiftCardApplicable =false;
            delete self.$scope.selectedScheme.eGiftCardSchemeData.preload;
            delete self.$scope.selectedScheme.eGiftCardSchemeData.freecard;
            delete self.$scope.selectedScheme.eGiftCardSchemeData.crossborder
        }
        else{
            if(self.$scope.cardScheme.egiftcardschemedata.hasOwnProperty('preload')){
            self.$scope.selectedScheme.eGiftCardSchemeData.preload =  self.$scope.cardScheme.egiftcardschemedata.preload;;
            }
            self.$scope.choosen.eFreecard = true;
            self.$scope.choosen.Ecrossborder = true;
            self.$scope.selectedScheme.isEGiftCardApplicable =true;
            self.$scope.selectedScheme.eGiftCardSchemeData.freecard =
            {
                min:self.$scope.selectedScheme.eFreecard.min,
                max:self.$scope.selectedScheme.eFreecard.max
            };
            self.$scope.selectedScheme.eGiftCardSchemeData.crossborder =
            {
                country:self.$scope.cardScheme.egiftcardschemedata.crossborder.country,
                min:self.$scope.cardScheme.egiftcardschemedata.crossborder.min,
                max:self.$scope.cardScheme.egiftcardschemedata.crossborder.max
            };
        }
    }

    checkEditEleGiftSelectedAll(param){
        let self =this;
        if(param){
            if(self.$scope.ordersbyId.cardscheme.egiftcardschemedata.hasOwnProperty('preload')){
                self.$scope.editSelectedScheme.eGiftCardSchemeData.preload = [];
            }
            self.$scope.editChoosen.eFreecard = false;
            self.$scope.editChoosen.Ecrossborder = false;
            self.$scope.editSelectedScheme.isEGiftCardApplicable =false;
            delete self.$scope.editSelectedScheme.eGiftCardSchemeData.preload;
            delete self.$scope.editSelectedScheme.eGiftCardSchemeData.freecard;
            delete self.$scope.editSelectedScheme.eGiftCardSchemeData.crossborder
            delete self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData;
           /* if( self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.hasOwnProperty('preload')){
                delete self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.preload;
            };
            if( self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.hasOwnProperty('crossborder')){
                delete self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.crossborder;
            }

            if( self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.hasOwnProperty('freecard')){
                delete self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.freecard;
            }*/

        }
        else{
            if(!(self.$scope.editSelectedScheme.hasOwnProperty("eGiftCardSchemeData"))){
                self.$scope.editSelectedScheme.eGiftCardSchemeData={};
            }
            if(self.$scope.ordersbyId.cardscheme.egiftcardschemedata.hasOwnProperty('preload')){
                self.$scope.editSelectedScheme.eGiftCardSchemeData.preload=[];
            self.$scope.editSelectedScheme.eGiftCardSchemeData.preload =  self.$scope.ordersbyId.cardscheme.egiftcardschemedata.preload;;
            }
            self.$scope.editChoosen.eFreecard = true;
            self.$scope.editChoosen.Ecrossborder = true;
            self.$scope.editSelectedScheme.isEGiftCardApplicable =true;
            self.$scope.editSelectedScheme.eGiftCardSchemeData.freecard =
            {
                min:self.$scope.editSelectedScheme.eFreecard.min,
                max:self.$scope.editSelectedScheme.eFreecard.max
            };
            self.$scope.editSelectedScheme.eGiftCardSchemeData.crossborder =
            {
                country:self.$scope.ordersbyId.cardscheme.egiftcardschemedata.crossborder.country,
                min:self.$scope.ordersbyId.cardscheme.egiftcardschemedata.crossborder.min,
                max:self.$scope.ordersbyId.cardscheme.egiftcardschemedata.crossborder.max
            };
            self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData = {};
            if(self.$scope.ordersbyId.cardassignmentdata.hasOwnProperty('eGiftCardSchemeData')){
            if(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.hasOwnProperty("crossborder")){
                self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.crossborder={
                        country : self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.crossborder.country,
                        min:parseInt(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.crossborder.min),
                        max:parseInt(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.crossborder.max),
                        expiryMonths: parseInt(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.crossborder.expiryMonths),
                        quantity:parseInt(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.crossborder.quantity)
                    };

                    if( self.$scope.editChoosen.Ecrossborder){
                    self.$scope.editSelectedScheme.eGiftCardSchemeData.crossborder={
                            country : self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.crossborder.country,
                            min:parseInt(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.crossborder.min),
                            max:parseInt(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.crossborder.max)
                        };
                    }

                }
                if(self.$scope.ordersbyId.cardassignmentdata.hasOwnProperty("eGiftCardSchemeData")){
                if(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.hasOwnProperty("preload")){
                    self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.preload=[];
                    self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.preload = angular.copy(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.preload);
                }
                if(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.hasOwnProperty("freecard")){
                  self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.freecard={
                            expiryMonths:parseInt(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.freecard.expiryMonths),
                            quantity:parseInt(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.freecard.quantity),
                            min:parseInt(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.freecard.min),
                            max:parseInt(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.freecard.max)

                        }


                }
            }
            }

             }

    }

    checkEleLoyaltySelectedAll(param){
        let self =this;
        if(param){
        self.$scope.choosen.ErewardRedeem = false;
        self.$scope.choosen.eLcrossborder = false;
        self.$scope.selectedScheme.isELoyaltyCardApplicable =false;
        delete self.$scope.selectedScheme.eLoyaltyCardSchemeData.rewardRedeem;
        delete self.$scope.selectedScheme.eLoyaltyCardSchemeData.crossborder;
        }
        else{
            self.$scope.choosen.ErewardRedeem =true;
            self.$scope.choosen.eLcrossborder = true;
            self.$scope.selectedScheme.isELoyaltyCardApplicable =true;
            self.$scope.selectedScheme.eLoyaltyCardSchemeData.rewardRedeem=self.redeem;
            self.$scope.selectedScheme.eLoyaltyCardSchemeData.crossborder={country:self.$scope.cardScheme.eloyaltycardschemedata.crossBorder.country};
        }
    }

    checkEditEleLoyaltySelectedAll(param){
        let self =this;
        if(param){
        self.$scope.editChoosen.ErewardRedeem = false;
        self.$scope.editChoosen.eLcrossborder = false;
        self.$scope.editSelectedScheme.isELoyaltyCardApplicable =false;
        delete self.$scope.editSelectedScheme.eLoyaltyCardSchemeData.rewardRedeem;
        delete self.$scope.editSelectedScheme.eLoyaltyCardSchemeData.crossborder;
        delete self.$scope.finalEditCardSchemeJson.cardAssignmentData.eLoyaltyCardSchemeData;
       /* if(self.$scope.finalEditCardSchemeJson.cardAssignmentData.eLoyaltyCardSchemeData.hasOwnProperty('crossBorder')){
            delete self.$scope.finalEditCardSchemeJson.cardAssignmentData.eLoyaltyCardSchemeData.crossBorder;
        }
        if(self.$scope.finalEditCardSchemeJson.cardAssignmentData.eLoyaltyCardSchemeData.hasOwnProperty('rewardRedeem')){
            delete self.$scope.finalEditCardSchemeJson.cardAssignmentData.eLoyaltyCardSchemeData.rewardRedeem;
        }*/

        }
        else{
            self.$scope.editChoosen.ErewardRedeem =true;
            self.$scope.editChoosen.eLcrossborder = true;
            self.$scope.editSelectedScheme.isELoyaltyCardApplicable =true;
            if(!(self.$scope.editSelectedScheme.hasOwnProperty("eLoyaltyCardSchemeData"))){
                self.$scope.editSelectedScheme.eLoyaltyCardSchemeData={};
            }
            self.$scope.editSelectedScheme.eLoyaltyCardSchemeData.rewardRedeem=self.editElredeem;
            self.$scope.editSelectedScheme.eLoyaltyCardSchemeData.crossborder={country:self.$scope.ordersbyId.cardscheme.eloyaltycardschemedata.crossBorder.country};
            self.$scope.finalEditCardSchemeJson.cardAssignmentData.eLoyaltyCardSchemeData={};
            if(self.$scope.ordersbyId.cardassignmentdata.hasOwnProperty("eLoyaltyCardSchemeData")){
            if(self.$scope.ordersbyId.cardassignmentdata.eLoyaltyCardSchemeData.hasOwnProperty("crossBorder")){
                self.$scope.finalEditCardSchemeJson.cardAssignmentData.eLoyaltyCardSchemeData.crossBorder={
                        country : self.$scope.ordersbyId.cardassignmentdata.eLoyaltyCardSchemeData.crossBorder.country,
                         quantity: parseInt(self.$scope.ordersbyId.cardassignmentdata.eLoyaltyCardSchemeData.crossBorder.quantity)
                    };

                }

                if(self.$scope.ordersbyId.cardassignmentdata.eLoyaltyCardSchemeData.hasOwnProperty("rewardRedeem")){
                  self.$scope.finalEditCardSchemeJson.cardAssignmentData.eLoyaltyCardSchemeData.rewardRedeem={
                            quantity:parseInt(self.$scope.ordersbyId.cardassignmentdata.eLoyaltyCardSchemeData.rewardRedeem.quantity),

                        }


                }
            }
        }
    }

    getGroup() {
        let self = this;

                //let dfd = self.$q.defer();
                //self.ParamsMap.params(params.url())

                self.OrderService.getGroups()
                    .then(
                        res => {
                            console.log("res",res)
                            self.loaderStates.coverLoader = false;
                            var  tempGroups = [];
                            var length = res.total;
                            if(length==0){
                              let message = "No groups present. Please add group to proceed..!" ;
                              self.Flash.create('danger', message);
                            }
                            for(var i=0; i<length ;i++){
                                if(res[i].active==1)
                                tempGroups.push(res[i]);
                            }
                            self.groups= tempGroups;
                            if(tempGroups.length==0&&length!=0){
                              let message = "No active groups present. Please add active group to proceed..!" ;
                              self.Flash.create('danger', message);
                            }
                            self.loaderStates.coverLoader = false;
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

    getCardAssignment(){
        let self =this;
        console.log('AssignMent',self.$scope.selectedScheme);
        self.$scope.finalCardSchemeJson={
            merchantId:self.$scope.newOrder.merchantId,
            storeId:self.$scope.newOrder.storeId,
            cardSchemeId: self.$scope.newOrder.cardId
        };
        if(self.$scope.selectedScheme.hasOwnProperty('giftCardSchemeData')){
            if(self.$scope.selectedScheme.giftCardSchemeData.hasOwnProperty("preload")){
                this.finalPreLoad = true;

            }
            else{
                this.finalPreLoad = false;
            }
            if(self.$scope.selectedScheme.giftCardSchemeData.hasOwnProperty("freecard")){
                this.finalFreecard = true;

            }
            else{
                this.finalFreecard = false;
            }
            if(self.$scope.selectedScheme.giftCardSchemeData.hasOwnProperty("crossborder")){
                this.finalCrossborder = true;

            }
            else{
                this.finalCrossborder = false;
            }
    }
    if(self.$scope.selectedScheme.hasOwnProperty('eGiftCardSchemeData')){
        if(self.$scope.selectedScheme.eGiftCardSchemeData.hasOwnProperty("preload")){
            this.finalePreLoad = true;

        }
        else{
            this.finalePreLoad = false;
        }
        if(self.$scope.selectedScheme.eGiftCardSchemeData.hasOwnProperty("freecard")){
            this.finaleFreecard = true;

        }
        else{
            this.finaleFreecard = false;
        }
        if(self.$scope.selectedScheme.eGiftCardSchemeData.hasOwnProperty("crossborder")){
            this.finaleCrossborder = true;
          }
        else{
            this.finaleCrossborder = false;
        }
    }
    if(self.$scope.selectedScheme.hasOwnProperty('loyaltyCardSchemeData')){
        if(self.$scope.selectedScheme.loyaltyCardSchemeData.hasOwnProperty("crossborder")){
            this.finalLoyalCrossborder =true;

        }
        else{
            this.finalLoyalCrossborder =false;
        }
    }
    if(self.$scope.selectedScheme.hasOwnProperty('eLoyaltyCardSchemeData')){
        if(self.$scope.selectedScheme.eLoyaltyCardSchemeData.hasOwnProperty("crossborder")){
            this.finaleLoyalCrossborder =true;

        }
        else{
            this.finaleLoyalCrossborder =false;
        }
    }
}

    getMerchant(groupId) {
        let self = this;

                //let dfd = self.$q.defer();
                //self.ParamsMap.params(params.url())
              self.loaderStates.merchant=true;

                self.OrderService.getMerchants(groupId)
                    .then(
                        res => {

                            self.loaderStates.coverLoader = false;
                            var  tempMerchants = [];
                            var length = res.total;

                            if(length==0)
                            {
                              let message = "No merchant present under selected group. Please add a merchant to proceed..!";
                              self.Flash.create('danger', message);
                            }
                            for(var i=0; i<length ;i++){
                                if(res.merchant[i].active == "1"){
                                tempMerchants.push(res.merchant[i]);
                            }
                          }
                            if(tempMerchants.length==0&&length!=0)
                            {
                              let message = "No active merchant present under selected group. Please add a active merchant to proceed..!";
                              self.Flash.create('danger', message);
                            }
                            self.merchants= tempMerchants;
                            self.loaderStates.merchant=false;

                            console.log(this.merchants);
                        },
                        () => {
                            let message = "Cannot fetch merchants,Please try again later.";
                            self.Flash.create('danger', message);
                            self.loaderStates.coverLoader = false;
                            self.loaderStates.merchant=false;
                           // dfd.reject();
                        }
                    );
    }

    addOrder(orderValue,form){
        let self =this;
    if(form.$invalid){
        let message = "Fill the Inputs with valid data";
        self.Flash.create('danger', message);
        form.$dirty=true;
    }else{
        self.OrderService.postOrder(orderValue)
        .then(
            res =>{
                self.$state.go('admin.order-list');
                let message = "Order Added Successfully";
                self.Flash.create('success', message);
            },
            ()=>{
                let message = "Something went wrong,Order cannot be created";
                self.Flash.create('danger', message);
            }
        )
    }

    }

    checkMerchantSelect(param){
        let self= this;
      if(param){
          self.getStore(param);
          self.getCardSchemesByMerchant(param);
      }
    }

    getData(){
        let self =this;

        self.OrderService.getOrders()
        .then(
            res => {

                //self.loaderStates.merchantList = false;
                self.loaderStates.coverLoader = false;
                self.$scope.orders = res;
                //self.merchants=res;
                this.orderList=res;
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
                let message = "Cannot get OrderList";
                self.Flash.create('danger', message);
                self.loaderStates.merchantList = false;
                self.loaderStates.coverLoader = false;
                // dfd.reject();
            }
        );
    }

    getOrderData() {
        let self = this;
        self.loaderStates.orderDetails = true;
        self.cardGenerate = false;
        console.log("Get Order",self.OrderId);
        if (self.OrderId) {
            self.$q.all([
                self.OrderService.getOrderData(self.OrderId)
                    .then(
                        res => {
                            self.$scope.orderDetails = res;
                            self.loaderStates.orderDetails = false;

                        },
                        () => {
                          let message = "Cannot get order details";
                            self.Flash.create('danger', message);
                            self.loaderStates.orderDetails = false;
                        }
                    ),
                    self.OrderService.getCardDetailData(self.OrderId)
                    .then(
                        res =>{
                            console.log('response',res);
                            self.getCardDetailData(res);
                        },
                        ()=>{
                            let message = "Cannot get Card details for this order,please check order status";
                            self.Flash.create('danger', message);
                        }
                    )

            ]).then(
                (res)=>{
                    console.log('Success');
                },
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
        self.loaderStates.coverLoader = false;
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


       exportExcel(orderDetails){
           let self =this;
           var newArr = _.map(self.$scope.totalCardobj, function(o) { return _.omit(o, '$$hashKey'); });
               //newArr =  _.map(newArr, function(o) { return _.upperCase(o);  });
            var JSONData= newArr;
            //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
            var ReportTitle= self.OrderId;
            var ShowLabel = true;
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

            var CSV = '';
            var dateTime = (orderDetails.created).split("T");;
            dateTime =dateTime[0];

            CSV += "OrderId"+','+ReportTitle + '\r\n'+"CreateDate"+","+dateTime +'\r\n'+"MerchantId"+","+orderDetails.merchantId+'\r\n'+"MerchantName"+","+orderDetails.merchantname+'\r\n\n';

            if (ShowLabel) {
                var row = "";

                //This loop will extract the label from 1st index of on array
                for (var index in arrData[0]) {
                    var str =   index.toUpperCase();
                    //Now convert each value to string and comma-seprated
                    row += str + ',';
                }

                row = row.slice(0, -1);

                //append Label row with line break
                CSV += row + '\r\n';
            }

            //1st loop is to extract each row
            for (var i = 0; i < arrData.length; i++) {
                var row = "";

                //2nd loop will extract each column and convert it in string comma-seprated
                for (var index in arrData[i]) {
                    row += '"' + arrData[i][index] + '",';
                }

                row.slice(0, row.length - 1);

                //add a line break after each row
                CSV += row + '\r\n';
            }

            if (CSV == '') {
                alert("Invalid data");
                return;
            }

            //Generate a file name
            var fileName = "CardListOfOrder_";
            //this will remove the blank-spaces from the title and replace it with an underscore
            fileName += ReportTitle.replace(/ /g,"_");

            //Initialize file format you want csv or xls
            var uri = 'data:text/xls;charset=utf-8,' + escape(CSV);

            // Now the little tricky part.
            // you can use either>> window.open(uri);
            // but this will not work in some browsers
            // or you will not get the correct file extension

            //this trick will generate a temp <a /> tag
            var link = document.createElement("a");
            link.href = uri;

            //set the visibility hidden so it will not effect on your web-layout
            link.style = "visibility:hidden";
            link.download = fileName + ".xls";

            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }


    getStore(param) {
        let self = this;

                //let dfd = self.$q.defer();
                //self.ParamsMap.params(params.url())
                self.loaderStates.store=true;
                $( ".store" ).attr("disabled","true");
                self.OrderService.getStores(param)
                    .then(
                        res => {
                            console.log("res",res)
                            self.loaderStates.coverLoader = false;
                            var  tempStores = [];
                            var length = res.total;
                            this.stores= res.store;
                            self.loaderStates.store=false;
                            $( ".store" ).attr("disabled","false");
                        },
                        () => {
                              let message = "Cannot fetch stores.Please try again larer";
                            self.Flash.create('danger', message);
                            self.loaderStates.store = false;
                           // dfd.reject();
                        }
                    );
    }


    getCardSchemesByMerchant(merchantId){
        let self= this;
        self.loaderStates.cardschemes=true;
        self.CardSchemeService.getCardSchemesByMerchant(merchantId)
        .then(
           res=> {
             var  tempCardSchemes = [];
             var length = res.total;

             if(length==0)
             {
               let message = "No card schemes present under selected merchant. Please add a card scheme to proceed..!";
               self.Flash.create('danger', message);
             }
             for(var i=0; i<length ;i++){
                 if(res[i].active == "1"){
                 tempCardSchemes.push(res[i]);
             }
            }
            if(tempCardSchemes.length==0&&length!=0)
            {
              let message = "No active card schemes present under selected merchant. Please add a active card scheme to proceed..!";
              self.Flash.create('danger', message);
            }

                self.cardScheme =tempCardSchemes;
                self.loaderStates.cardschemes=false;
                $( ".cardScheme" ).attr("disabled","false");
            },
            ()=>{
                let message = "Cannot fetch card schemes.Please try again larer";
                self.Flash.create('danger', message);
                self.loaderStates.coverLoader = false;
                self.loaderStates.cardschemes = false;
                $( ".cardScheme" ).attr("disabled","false");
            }
        )
        }




      getCardlist(){
        let self= this;
        self.CardSchemeService.getCardSchemesList()
        .then(
           res=> {
             var  tempCardSchemes = [];
             var length = res.total
             for(var i=0; i<length ;i++){
                 if(res[i].active == "1"){
                 tempCardSchemes.push(res[i]);
             }
         }
                self.cardScheme =tempCardSchemes;
            },
            ()=>{
                let message = "Cannot fetch card schemes.Please try again larer";
                self.Flash.create('danger', message);
                self.loaderStates.coverLoader = false;
            }
        )
    }

    getCardSchemeForChoosen(){
        let self= this;
        self.OrderService.getCardSchemebyId(self.$scope.newOrder.cardId)
        .then(
           res=> {
               console.log('view',res)
               self.$scope.cardScheme=res;
               self.getCardData();
            },
            ()=>{
                let message = "Something went wrong,Please Try Again later";
                self.Flash.create('danger', message);
                self.loaderStates.coverLoader = false;
            }
        )



    }

    getCardData(){
        let self =this;
        self.$scope.selectedScheme.isGiftCardApplicable=  self.$scope.cardScheme.isgiftcardapplicable;
        self.$scope.selectedScheme.isLoyaltyCardApplicable =  self.$scope.cardScheme.isloyaltycardapplicable;
        self.$scope.selectedScheme.isEGiftCardApplicable =  self.$scope.cardScheme.isegiftcardapplicable;
        self.$scope.selectedScheme.isELoyaltyCardApplicable =  self.$scope.cardScheme.iseloyaltycardapplicable;
        if(self.$scope.cardScheme.hasOwnProperty('loyaltycardschemedata')){
            self.$scope.selectedScheme.loyaltyCardSchemeData ={};
          if(self.$scope.cardScheme.loyaltycardschemedata.hasOwnProperty("crossBorder")){
            this.lCrossborder = self.$scope.cardScheme.loyaltycardschemedata.crossBorder.isSelected;
            self.$scope.choosen.Lcrossborder = self.$scope.cardScheme.loyaltycardschemedata.crossBorder.isSelected;
            if(this.lCrossborder){
            self.$scope.selectedScheme.loyaltyCardSchemeData.crossborder={
                country : self.$scope.cardScheme.loyaltycardschemedata.crossBorder.country
            }
          }
            let countryName =_.find(self.country, ['code',self.$scope.cardScheme.loyaltycardschemedata.crossBorder.country]);
             self.$scope.selectedScheme.Lcountry =countryName.name;
           }
            if(self.$scope.cardScheme.loyaltycardschemedata.hasOwnProperty("rewardRedeem")){
                this.redeem = self.$scope.cardScheme.loyaltycardschemedata.rewardRedeem.isSelected;
                self.$scope.choosen.rewardRedeem = self.$scope.cardScheme.loyaltycardschemedata.rewardRedeem.isSelected;
                self.$scope.selectedScheme.loyaltyCardSchemeData.rewardRedeem=self.$scope.cardScheme.loyaltycardschemedata.rewardRedeem.isSelected;
         }
        }
         if(self.$scope.cardScheme.hasOwnProperty('eloyaltycardschemedata')){
           self.$scope.selectedScheme.eLoyaltyCardSchemeData={};
            if(self.$scope.cardScheme.eloyaltycardschemedata.hasOwnProperty("crossBorder")){
                this.EloyaCrossborder = self.$scope.cardScheme.eloyaltycardschemedata.crossBorder.isSelected;
                self.$scope.choosen.eLcrossborder = self.$scope.cardScheme.eloyaltycardschemedata.crossBorder.isSelected;
                 let countryName =_.find(self.country, ['code',self.$scope.cardScheme.eloyaltycardschemedata.crossBorder.country]);
                 self.$scope.selectedScheme.eLoyaltyCardSchemeData.crossborder={
                         country :self.$scope.cardScheme.eloyaltycardschemedata.crossBorder.country
                     };
                 self.$scope.selectedScheme.Elcountry = countryName.name;
                }
                if(self.$scope.cardScheme.eloyaltycardschemedata.hasOwnProperty("rewardRedeem")){
                    this.Elredeem = self.$scope.cardScheme.eloyaltycardschemedata.rewardRedeem.isSelected;
                    self.$scope.choosen.ErewardRedeem = self.$scope.cardScheme.eloyaltycardschemedata.rewardRedeem.isSelected;
                    self.$scope.selectedScheme.eLoyaltyCardSchemeData.rewardRedeem=self.$scope.cardScheme.eloyaltycardschemedata.rewardRedeem.isSelected;
                  }
          }
          if(self.$scope.cardScheme.hasOwnProperty('giftcardschemedata')){
            self.$scope.selectedScheme.giftCardSchemeData={};
            if(self.$scope.cardScheme.giftcardschemedata.hasOwnProperty("crossborder")){
            this.crossborder = self.$scope.cardScheme.giftcardschemedata.crossborder.isSelected;
            self.$scope.choosen.crossborder=self.$scope.cardScheme.giftcardschemedata.crossborder.isSelected;
            if(this.crossborder){
            self.$scope.selectedScheme.giftCardSchemeData.crossborder={
                    country : self.$scope.cardScheme.giftcardschemedata.crossborder.country,
                    min:self.$scope.cardScheme.giftcardschemedata.crossborder.min,
                    max:self.$scope.cardScheme.giftcardschemedata.crossborder.max
                };
              }
            let countryName =_.find(self.country, ['code',self.$scope.cardScheme.giftcardschemedata.crossborder.country]);
             self.$scope.selectedScheme.country =countryName.name;
             self.$scope.selectedScheme.crossborder={
                 min:self.$scope.cardScheme.giftcardschemedata.crossborder.min,
                 max:self.$scope.cardScheme.giftcardschemedata.crossborder.max
             }

            }
            if(self.$scope.cardScheme.giftcardschemedata.hasOwnProperty("preload")){
                // self.$scope.selectedScheme.giftCardSchemeData={
                //     preload:[]
                // };
                this.preloads = angular.copy(self.$scope.cardScheme.giftcardschemedata.preload);
                self.$scope.selectedScheme.giftCardSchemeData.preload = angular.copy(self.$scope.cardScheme.giftcardschemedata.preload);
            }
            if(self.$scope.cardScheme.giftcardschemedata.hasOwnProperty("freecard")){
                this.freecard=self.$scope.cardScheme.giftcardschemedata.freecard.isSelected;
                self.$scope.choosen.freecard = self.$scope.cardScheme.giftcardschemedata.freecard.isSelected;
                if(this.freecard){
                    self.$scope.selectedScheme.giftCardSchemeData.freecard={
                        min:self.$scope.cardScheme.giftcardschemedata.freecard.min,
                        max:self.$scope.cardScheme.giftcardschemedata.freecard.max
                    }

                    self.$scope.selectedScheme.freecards={
                        min:self.$scope.cardScheme.giftcardschemedata.freecard.min,
                        max:self.$scope.cardScheme.giftcardschemedata.freecard.max
                    }
                }
            }
            else{
                self.$scope.choosen.freecard = false;
                this.freecard=false;
            }
         }
         if(self.$scope.cardScheme.hasOwnProperty('egiftcardschemedata')){
           self.$scope.selectedScheme.eGiftCardSchemeData={};
         if(self.$scope.cardScheme.egiftcardschemedata.hasOwnProperty("crossborder")){
            this.eCrossborder = self.$scope.cardScheme.egiftcardschemedata.crossborder.isSelected;
            self.$scope.choosen.Ecrossborder = self.$scope.cardScheme.egiftcardschemedata.crossborder.isSelected;
            if(this.eCrossborder){
            self.$scope.selectedScheme.eGiftCardSchemeData.crossborder={
                    country : self.$scope.cardScheme.egiftcardschemedata.crossborder.country,
                    min:self.$scope.cardScheme.egiftcardschemedata.crossborder.min,
                    max:self.$scope.cardScheme.egiftcardschemedata.crossborder.max
                };
          }
            let countryName =_.find(self.country, ['code',self.$scope.cardScheme.egiftcardschemedata.crossborder.country]);
            self.$scope.selectedScheme.Ecountry =countryName.name;
            self.$scope.selectedScheme.eCrossborder={
                min:self.$scope.cardScheme.egiftcardschemedata.crossborder.min,
                max:self.$scope.cardScheme.egiftcardschemedata.crossborder.max
            }

        }
        if(self.$scope.cardScheme.egiftcardschemedata.hasOwnProperty("preload")){
            // self.$scope.selectedScheme.egiftcardschemedata={
            //     preload:[]
            // }
            self.Epreload = self.$scope.cardScheme.egiftcardschemedata.preload;
            self.$scope.selectedScheme.eGiftCardSchemeData.preload =angular.copy(self.$scope.cardScheme.egiftcardschemedata.preload);
        }
        if(self.$scope.cardScheme.egiftcardschemedata.hasOwnProperty("freecard")){
            this.eFreecard=self.$scope.cardScheme.egiftcardschemedata.freecard.isSelected;
            self.$scope.choosen.eFreecard = self.$scope.cardScheme.egiftcardschemedata.freecard.isSelected;
            if(this.eFreecard){
                self.$scope.selectedScheme.eGiftCardSchemeData.freecard={
                    min:self.$scope.cardScheme.egiftcardschemedata.freecard.min,
                    max:self.$scope.cardScheme.egiftcardschemedata.freecard.max
                 }
                self.$scope.selectedScheme.eFreecard={
                    min:self.$scope.cardScheme.egiftcardschemedata.freecard.min,
                    max:self.$scope.cardScheme.egiftcardschemedata.freecard.max
                }
            }
        }
        else{
            self.$scope.choosen.eFreecard = false;
            this.efreecard=false;
        }
      }
       /* if(self.$scope.cardScheme.hasOwnProperty('giftcardschemedata')){
                this.preloads = angular.copy(self.$scope.cardScheme.giftcardschemedata.preload);
                self.$scope.selectedScheme.giftCardSchemeData.preload = angular.copy(self.$scope.cardScheme.giftcardschemedata.preload);
            }
            if(self.$scope.cardScheme.hasOwnProperty('egiftcardschemedata')){
                self.Epreload = self.$scope.cardScheme.egiftcardschemedata.preload;
                self.$scope.selectedScheme.eGiftCardSchemeData={preload :angular.copy(self.$scope.cardScheme.egiftcardschemedata.preload)};
            }
            if(self.$scope.cardScheme.hasOwnProperty("loyaltyCardSchemeData")){
                self.loyaltyLabel=[];
               if(self.$scope.cardScheme.loyaltycardschemedata.hasOwnProperty("rewardRedeem")){
                 this.redeem = self.$scope.cardScheme.loyaltycardschemedata.rewardRedeem.isSelected;
                 self.$scope.choosen.rewardRedeem = self.$scope.cardScheme.loyaltycardschemedata.rewardRedeem.isSelected;
                 self.$scope.selectedScheme.loyaltyCardSchemeData={rewardRedeem :self.$scope.cardScheme.loyaltycardschemedata.rewardRedeem.isSelected};
               }
            }
            if(self.$scope.cardScheme.hasOwnProperty("eloyaltycardschemedata")){
                self.loyaltyLabel=[];
                if(self.$scope.cardScheme.eloyaltycardschemedata.hasOwnProperty("rewardRedeem")){
                    this.Elredeem = self.$scope.cardScheme.eloyaltycardschemedata.rewardRedeem.isSelected;
                    self.$scope.choosen.ErewardRedeem = self.$scope.cardScheme.eloyaltycardschemedata.rewardRedeem.isSelected;
                    self.$scope.selectedScheme.eLoyaltyCardSchemeData={rewardRedeem :self.$scope.cardScheme.eloyaltycardschemedata.rewardRedeem.isSelected};
                  }

            }*/

            /*if(self.$scope.cardScheme.hasOwnProperty('giftcardschemedata')){
            if(self.$scope.cardScheme.giftcardschemedata.hasOwnProperty("freecard")){
                this.freecard=true;
                self.$scope.choosen.freecard = true;
                self.$scope.selectedScheme.giftCardSchemeData={
                    freecard:{
                    min:self.$scope.cardScheme.giftcardschemedata.freecard.min,
                    max:self.$scope.cardScheme.giftcardschemedata.freecard.max
                }
            }
                self.$scope.selectedScheme.freecards={
                    min:self.$scope.cardScheme.giftcardschemedata.freecard.min,
                    max:self.$scope.cardScheme.giftcardschemedata.freecard.max
                }
            }
            else{
                self.$scope.choosen.freecard = false;
                this.freecard=false;
            }
         }
         if(self.$scope.cardScheme.hasOwnProperty('egiftcardschemedata')){
            if(self.$scope.cardScheme.egiftcardschemedata.hasOwnProperty("freecard")){
                this.eFreecard=true;
                self.$scope.choosen.eFreecard = true;
                self.$scope.selectedScheme.eGiftCardSchemeData={
                    freecard:{
                    min:self.$scope.cardScheme.egiftcardschemedata.freecard.min,
                    max:self.$scope.cardScheme.egiftcardschemedata.freecard.max
                }
            }
                self.$scope.selectedScheme.eFreecard={
                    min:self.$scope.cardScheme.egiftcardschemedata.freecard.min,
                    max:self.$scope.cardScheme.egiftcardschemedata.freecard.max
                }
            }
            else{
                self.$scope.choosen.eFreecard = false;
                this.efreecard=false;
            }

         }*/
    }

    showDeleteOrdertModel(selctedRow){
        let self=this;
        self.deleteOrder=selctedRow
        self.showOrderRemoveModal=true;
       };

    deleteOrderConform(){
        let self = this;
        self.loaderStates.deleteOrder = true;
        self.OrderService.deleteOrder(self.deleteOrder.orderpurchaseId)
        .then(
            res =>{

                _.remove(self.tableParams.settings().dataset, function (item) {
                    return self.deleteOrder === item;
                });
                self.tableParams.reload().then(function (data) {
                    if (data.length === 0 && self.tableParams.total() > 0) {
                        self.tableParams.page(self.tableParams.page() - 1);
                        self.tableParams.reload();
                    }
                });
                let message = "Order Deleted Successfully";
                self.Flash.create('success', message);
                self.showOrderRemoveModal=false;
                self.loaderStates.deleteOrder = false;
            }
        ),
         ()=>{
            let message = "Cannot Delete Order,Please Try Again Later";
            self.Flash.create('danger', message);
            self.loaderStates.deleteOrder = false;
            self.showOrderRemoveModal=false;
        }
    }

    editOrderbyOrderId(){
        let self= this;
        self.OrderService.getOrderData(this.orderId)
        .then(
           res=> {

               self.$scope.ordersbyId=res;
               console.log('ordersbyId',self.$scope.ordersbyId);
               self.$scope.editSelectedScheme={};
               self.getEditCardData();
               self.getCardSchemeForChoosen();
            },
            ()=>{
                let message = "Something went wrong,Please Try Again later";
                self.Flash.create('danger', message);
                self.loaderStates.coverLoader = false;
            }
        )
    }

    getEditCardData(){
        let self =this;
        self.$scope.editOrder={
            merchantId:self.$scope.ordersbyId.merchantId,
            merchantname:self.$scope.ordersbyId.merchantname,
            cardId:self.$scope.ordersbyId.cardscheme.cardschemeId,
            cardschemename:self.$scope.ordersbyId.cardschemename,
            groupId:self.$scope.ordersbyId.groupId,
            groupname:self.$scope.ordersbyId.groupname
        }

        if(self.$scope.ordersbyId.hasOwnProperty('storeId')){
            self.$scope.editOrder.storeId=self.$scope.ordersbyId.storeId ,
            self.$scope.editOrder.storename=self.$scope.ordersbyId.storename
        }

       /* self.$scope.editSelectedScheme.isGiftCardApplicable=  self.$scope.ordersbyId.cardscheme.isgiftcardapplicable;
        self.$scope.editSelectedScheme.isLoyaltyCardApplicable =  self.$scope.ordersbyId.cardscheme.isloyaltycardapplicable;
        self.$scope.editSelectedScheme.isEGiftCardApplicable =  self.$scope.ordersbyId.cardscheme.isegiftcardapplicable;
        self.$scope.editSelectedScheme.isELoyaltyCardApplicable =  self.$scope.ordersbyId.cardscheme.iseloyaltycardapplicable;*/
        if(self.$scope.ordersbyId.cardscheme.hasOwnProperty('loyaltycardschemedata')){
            self.$scope.editSelectedScheme.loyaltyCardSchemeData ={
                crossborder:'',
                rewardRedeem:''
            }
          if(self.$scope.ordersbyId.cardscheme.loyaltycardschemedata.hasOwnProperty("crossBorder")){
            this.editCrossborder = true;

            let countryName =_.find(self.country, ['code',self.$scope.ordersbyId.cardscheme.loyaltycardschemedata.crossBorder.country]);
             self.$scope.editSelectedScheme.Lcountry =countryName.name;
          }
            if(self.$scope.ordersbyId.cardscheme.loyaltycardschemedata.hasOwnProperty("rewardRedeem")){
                this.editredeem = true;

         }
        }
         if(self.$scope.ordersbyId.cardscheme.hasOwnProperty('eloyaltycardschemedata')){
            if(self.$scope.ordersbyId.cardscheme.eloyaltycardschemedata.hasOwnProperty("crossBorder")){
                this.editEloyaCrossborder = true;

                let countryName =_.find(self.country, ['code',self.$scope.ordersbyId.cardscheme.eloyaltycardschemedata.crossBorder.country]);
                 self.$scope.editSelectedScheme.Elcountry = countryName.name;
                }
                if(self.$scope.ordersbyId.cardscheme.eloyaltycardschemedata.hasOwnProperty("rewardRedeem")){
                    this.editElredeem = true;
                  }
          }
          if(self.$scope.ordersbyId.cardscheme.hasOwnProperty('giftcardschemedata')){
            self.$scope.editSelectedScheme.giftCardSchemeData={}
            if(self.$scope.ordersbyId.cardscheme.giftcardschemedata.hasOwnProperty("crossborder")){
                this.editcrossborder = true;
                let countryName =_.find(self.country, ['code',self.$scope.ordersbyId.cardscheme.giftcardschemedata.crossborder.country]);
                self.$scope.editSelectedScheme.country =countryName.name;
                self.$scope.editSelectedScheme.crossborder={
                    min:self.$scope.ordersbyId.cardscheme.giftcardschemedata.crossborder.min,
                    max:self.$scope.ordersbyId.cardscheme.giftcardschemedata.crossborder.max
                }
            }
            if(self.$scope.ordersbyId.cardscheme.giftcardschemedata.hasOwnProperty("preload")){

                this.preloads = angular.copy(self.$scope.ordersbyId.cardscheme.giftcardschemedata.preload);
            }
            if(self.$scope.ordersbyId.cardscheme.giftcardschemedata.hasOwnProperty("freecard")){
                this.editfreecard=true;
                self.$scope.editSelectedScheme.freecards={
                    min:self.$scope.ordersbyId.cardscheme.giftcardschemedata.freecard.min,
                    max:self.$scope.ordersbyId.cardscheme.giftcardschemedata.freecard.max
                }
            }

         }
       if(self.$scope.ordersbyId.cardscheme.hasOwnProperty('egiftcardschemedata')){

         if(self.$scope.ordersbyId.cardscheme.egiftcardschemedata.hasOwnProperty("crossborder")){
            this.editElecrossborder = true;
            let countryName =_.find(self.country, ['code',self.$scope.ordersbyId.cardscheme.egiftcardschemedata.crossborder.country]);
            self.$scope.editSelectedScheme.Ecountry =countryName.name;
            self.$scope.editSelectedScheme.eCrossborder={
                min:self.$scope.ordersbyId.cardscheme.egiftcardschemedata.crossborder.min,
                max:self.$scope.ordersbyId.cardscheme.egiftcardschemedata.crossborder.max
            }
        }
        if(self.$scope.ordersbyId.cardscheme.egiftcardschemedata.hasOwnProperty("preload")){

            self.Epreload = self.$scope.ordersbyId.cardscheme.egiftcardschemedata.preload;

        }
        if(self.$scope.ordersbyId.cardscheme.egiftcardschemedata.hasOwnProperty("freecard")){
            this.editElefreecard=true;

                self.$scope.editSelectedScheme.eFreecard={
                    min:self.$scope.ordersbyId.cardscheme.egiftcardschemedata.freecard.min,
                    max:self.$scope.ordersbyId.cardscheme.egiftcardschemedata.freecard.max
                }
            }

        else{
            self.$scope.editChoosen.eFreecard = false;
            this.editEleFreecard=false;
        }
      }

      if(self.$scope.ordersbyId.hasOwnProperty('cardassignmentdata')){
        self.$scope.finalEditCardSchemeJson={
            merchantId:self.$scope.editOrder.merchantId,
            cardSchemeId: self.$scope.editOrder.cardId,
            cardAssignmentData:{

            }
        }

        if(self.$scope.ordersbyId.cardassignmentdata.hasOwnProperty('giftCardSchemeData')){
           // if(!(_.isEmpty(self.$scope.finalEditCardSchemeJson.cardAssignmentData)))
            self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData={} ;
            self.$scope.editSelectedScheme.giftCardSchemeData={}

            if(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.hasOwnProperty("crossborder")){
                self.$scope.editChoosen.crossborder=true;
                self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.crossborder={
                    country : self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.crossborder.country,
                    expiryMonths: parseInt(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.crossborder.expiryMonths),
                    quantity: parseInt(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.crossborder.quantity),
                    min:parseInt(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.crossborder.min),
                    max:parseInt(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.crossborder.max)
                };
                if(self.$scope.editChoosen.crossborder){
                    self.$scope.editSelectedScheme.giftCardSchemeData.crossborder={
                            country : self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.crossborder.country,
                            min:parseInt(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.crossborder.min),
                            max:parseInt(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.crossborder.max)
                        };
                        self.$scope.editSelectedScheme.crossborder={
                            min:self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.crossborder.min,
                            max:self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.crossborder.max
                        };
                        self.$scope.editSelectedScheme.country=self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.crossborder.country;
                    }

            };

            if(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.hasOwnProperty("preload")){
                self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.preload=[];
                self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.preload = angular.copy(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.preload);
                self.$scope.editSelectedScheme.giftCardSchemeData.preload=[];
                for(var i in self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.preload){
                    self.$scope.editSelectedScheme.giftCardSchemeData.preload.push(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.preload[i].value);
                }

            }
            if(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.hasOwnProperty("freecard")){
              self.$scope.finalEditCardSchemeJson.cardAssignmentData.giftCardSchemeData.freecard={
                        expiryMonths:parseInt(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.freecard.expiryMonths),
                        quantity:parseInt(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.freecard.quantity),
                        min:parseInt(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.freecard.min),
                        max:parseInt(self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.freecard.max)

                    }
                    self.$scope.editChoosen.freecard =true;

                    if( self.$scope.editChoosen.freecard){
                        self.$scope.editSelectedScheme.giftCardSchemeData.freecard
                            ={
                            min:self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.freecard.min,
                            max:self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.freecard.max
                            }


                        self.$scope.editSelectedScheme.freecards={
                            min:self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.freecard.min,
                            max:self.$scope.ordersbyId.cardassignmentdata.giftCardSchemeData.freecard.max
                        }
                    }


            }
            if(!(_.isEmpty(self.$scope.editSelectedScheme.giftCardSchemeData))){
                self.$scope.editSelectedScheme.isGiftCardApplicable= true;
            }
         }

        if(self.$scope.ordersbyId.cardassignmentdata.hasOwnProperty('eGiftCardSchemeData')){
            self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData={};
            self.$scope.editSelectedScheme.eGiftCardSchemeData={};
            if(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.hasOwnProperty("crossborder")){
            self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.crossborder={
                    country : self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.crossborder.country,
                    expiryMonths: parseInt(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.crossborder.expiryMonths),
                    quantity:parseInt(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.crossborder.quantity),
                    min:parseInt(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.crossborder.min),
                    max:parseInt(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.crossborder.max)
                };
                self.$scope.editChoosen.Ecrossborder = true
                if( self.$scope.editChoosen.Ecrossborder){
                self.$scope.editSelectedScheme.eGiftCardSchemeData.crossborder={
                        country : self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.crossborder.country,
                        min:parseInt(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.crossborder.min),
                        max:parseInt(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.crossborder.max)
                    };
                }

            }
            if(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.hasOwnProperty("preload")){
                self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.preload=[];
                self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.preload = angular.copy(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.preload);
                self.$scope.editSelectedScheme.eGiftCardSchemeData.preload=[];
                for(var i in self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.preload){
                    self.$scope.editSelectedScheme.eGiftCardSchemeData.preload.push(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.preload[i].value);
                }

            }
            if(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.hasOwnProperty("freecard")){
              self.$scope.finalEditCardSchemeJson.cardAssignmentData.eGiftCardSchemeData.freecard={
                        expiryMonths:parseInt(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.freecard.expiryMonths),
                        quantity:parseInt(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.freecard.quantity),
                        min:parseInt(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.freecard.min),
                        max:parseInt(self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.freecard.max)

                    }
                    self.$scope.editChoosen.eFreecard = true;
                    if( self.$scope.editChoosen.eFreecard){
                        self.$scope.editSelectedScheme.eGiftCardSchemeData.freecard={
                            min:self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.freecard.min,
                            max:self.$scope.ordersbyId.cardassignmentdata.eGiftCardSchemeData.freecard.max
                         }
            }

         }
         if(!(_.isEmpty(self.$scope.editSelectedScheme.eGiftCardSchemeData))){
            self.$scope.editSelectedScheme.isEGiftCardApplicable= true;
        }

        }

        if(self.$scope.ordersbyId.cardassignmentdata.hasOwnProperty('loyaltyCardSchemeData')){
            self.$scope.finalEditCardSchemeJson.cardAssignmentData.loyaltyCardSchemeData={};
            self.$scope.editSelectedScheme.loyaltyCardSchemeData={};
            if(self.$scope.ordersbyId.cardassignmentdata.loyaltyCardSchemeData.hasOwnProperty("crossBorder")){
            self.$scope.finalEditCardSchemeJson.cardAssignmentData.loyaltyCardSchemeData.crossBorder={
                    country : self.$scope.ordersbyId.cardassignmentdata.loyaltyCardSchemeData.crossBorder.country,
                     quantity: parseInt(self.$scope.ordersbyId.cardassignmentdata.loyaltyCardSchemeData.crossBorder.quantity)
                };
                self.$scope.editChoosen.Lcrossborder = true;
                if(self.$scope.editChoosen.Lcrossborder){
                 self.$scope.editSelectedScheme.loyaltyCardSchemeData.crossborder={
                     country : self.$scope.ordersbyId.cardassignmentdata.loyaltyCardSchemeData.crossBorder.country
                 }
             }
            }

            if(self.$scope.ordersbyId.cardassignmentdata.loyaltyCardSchemeData.hasOwnProperty("rewardRedeem")){
              self.$scope.finalEditCardSchemeJson.cardAssignmentData.loyaltyCardSchemeData.rewardRedeem={
                        quantity:parseInt(self.$scope.ordersbyId.cardassignmentdata.loyaltyCardSchemeData.rewardRedeem.quantity),

                    }
                    self.$scope.editChoosen.rewardRedeem = true;
                    self.$scope.editSelectedScheme.loyaltyCardSchemeData.rewardRedeem=true;

            }

            if(!(_.isEmpty(self.$scope.editSelectedScheme.loyaltyCardSchemeData))){
                self.$scope.editSelectedScheme.isLoyaltyCardApplicable= true;
            }


         }

        if(self.$scope.ordersbyId.cardassignmentdata.hasOwnProperty('eLoyaltyCardSchemeData')){
            self.$scope.finalEditCardSchemeJson.cardAssignmentData.eLoyaltyCardSchemeData={};
            self.$scope.editSelectedScheme.eLoyaltyCardSchemeData={}
            if(self.$scope.ordersbyId.cardassignmentdata.eLoyaltyCardSchemeData.hasOwnProperty("crossBorder")){
            self.$scope.finalEditCardSchemeJson.cardAssignmentData.eLoyaltyCardSchemeData.crossBorder={
                     country : self.$scope.ordersbyId.cardassignmentdata.eLoyaltyCardSchemeData.crossBorder.country,
                     quantity: parseInt(self.$scope.ordersbyId.cardassignmentdata.eLoyaltyCardSchemeData.crossBorder.quantity)
                };
                self.$scope.editChoosen.eLcrossborder = true;
                if(self.$scope.editChoosen.eLcrossborder){
                 self.$scope.editSelectedScheme.eLoyaltyCardSchemeData.crossborder={
                         country :self.$scope.ordersbyId.cardassignmentdata.eLoyaltyCardSchemeData.crossBorder.country
                     }

                }
            }

            if(self.$scope.ordersbyId.cardassignmentdata.eLoyaltyCardSchemeData.hasOwnProperty("rewardRedeem")){
              self.$scope.finalEditCardSchemeJson.cardAssignmentData.eLoyaltyCardSchemeData.rewardRedeem={
                        quantity:parseInt(self.$scope.ordersbyId.cardassignmentdata.eLoyaltyCardSchemeData.rewardRedeem.quantity),

                    }
                    self.$scope.editChoosen.ErewardRedeem = true;
                    self.$scope.editSelectedScheme.eLoyaltyCardSchemeData.rewardRedeem =true;
            }

            if(!(_.isEmpty(self.$scope.editSelectedScheme.eLoyaltyCardSchemeData))){
                self.$scope.editSelectedScheme.isELoyaltyCardApplicable= true;
            }

         }

         if(self.$scope.editOrder.hasOwnProperty('storeId')){
            self.$scope.finalEditCardSchemeJson.storeId = self.$scope.editOrder.storeId
         }

    }
}

    getEditCardAssignment(){
        let self =this;

        if(self.$scope.editSelectedScheme.hasOwnProperty('giftCardSchemeData')){
            if(self.$scope.editSelectedScheme.giftCardSchemeData.hasOwnProperty("preload")){
                this.finalPreLoad = true;

            }
            else{
                this.finalPreLoad = false;
            }
            if(self.$scope.editSelectedScheme.giftCardSchemeData.hasOwnProperty("freecard")){
                if(self.$scope.editChoosen.freecard){
                this.finalFreecard = true;
                }

            }
            else{
                this.finalFreecard = false;
            }
            if(self.$scope.editSelectedScheme.giftCardSchemeData.hasOwnProperty("crossborder")){
                if( self.$scope.editChoosen.crossborder){
                this.finalCrossborder = true;
                }
            }
            else{
                this.finalCrossborder = false;
            }
    }
    if(self.$scope.editSelectedScheme.hasOwnProperty('eGiftCardSchemeData')){
        if(self.$scope.editSelectedScheme.eGiftCardSchemeData.hasOwnProperty("preload")){
            this.finalePreLoad = true;

        }
        else{
            this.finalePreLoad = false;
        }
        if(self.$scope.editSelectedScheme.eGiftCardSchemeData.hasOwnProperty("freecard")){
            if(self.$scope.editChoosen.eFreecard){
             this.finaleFreecard = true;
            }

        }
        else{
            this.finaleFreecard = false;
        }
        if(self.$scope.editSelectedScheme.eGiftCardSchemeData.hasOwnProperty("crossborder")){
            if(self.$scope.editChoosen.Ecrossborder){
            this.finaleCrossborder = true;
            }
          }
        else{
            this.finaleCrossborder = false;
        }
    }
    if(self.$scope.editSelectedScheme.hasOwnProperty('loyaltyCardSchemeData')){
        if(self.$scope.editSelectedScheme.loyaltyCardSchemeData.hasOwnProperty("crossborder")){
            if(self.$scope.editChoosen.Lcrossborder){
            this.finalLoyalCrossborder =true;
            }


        }
        else{
            this.finalLoyalCrossborder =false;
        }
    }
    if(self.$scope.editSelectedScheme.hasOwnProperty('eLoyaltyCardSchemeData')){
        if(self.$scope.editSelectedScheme.eLoyaltyCardSchemeData.hasOwnProperty("crossborder")){
            this.finaleLoyalCrossborder =true;

        }
        else{
            this.finaleLoyalCrossborder =false;
        }
    }
}

    saveEditOrder(editdata,form){
        let self =this;
        console.log('save',editdata);
        if(form.$invalid){
            let message = "Please fill the inputs with valid data..!";
            self.Flash.create('danger', message);
            form.$dirty=true;
        }
        else{
        if(_.isEqual(editdata.cardAssignmentData , self.$scope.ordersbyId.cardassignmentdata)){
            let message = 'No change to save';
            self.Flash.create('danger', message);
        }
        else{
                self.OrderService.putOrder(this.orderId,editdata)
                .then(
                    res=>{
                        self.$state.go('admin.order-list');
                        let message = "Order Updated Successfully";
                        self.Flash.create('success', message);
                },
                res=> {
                    self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                    let message = "Something went wrong!Please try again later";
                    self.Flash.create('danger', message);
                }
            )
            }
        }
    }

    showRejectreason(){
        let self =this;
        self.showModelRejectreason =true;
        self.$scope.cardStatus.status="Rejected"
    }

    PostCardStatus(cardstatus,orderId){
        let self = this;
        let validateFields = angular.copy(self.cardreasonstatus);
        let frontValidation = self.Validation.frontValidation(cardstatus, validateFields);
        if (_.isEmpty(frontValidation)) {
            self.OrderService.setStatus(cardstatus,orderId)
            .then(
                res=>{
                    let message = 'This Order Rejected Successfully'
                    self.Flash.create('success', message);
                    self.showModelRejectreason =false;
                    self.$scope.cardStatus={};
                    self.getOrderData();
            },
            ()=>{
                let message = 'Oops ..! Something went wrong,Please try again later.';
                self.Flash.create('danger', message);
            }
        )
        }
    }

    Approved(orderId,merchantId){
        let self=this;
        let message = 'Please wait while we generate cards..! This may take some moments.'
        self.Flash.create('success', message);
        self.loaderStates.coverLoader = true;
        self.$scope.cardStatus.status="Approved",
        self.OrderService.setStatus(self.$scope.cardStatus,orderId)
        .then(
            res=>{
                self.showModelRejectreason =false;
                self.$scope.cardStatus={};
                self.getOrderData();
                self.loaderStates.coverLoader = false;
        },
        ()=>{
            let message = 'Oops ..! Something went wrong,Please try again later.';
            self.Flash.create('danger', message);
            self.loaderStates.coverLoader = false;
        }
    )

}

}

OrderController.$inject = ['$scope', '$state', 'AuthService', 'OrderService','CardSchemeService', 'Flash', 'NgTableParams', '$q', 'ParamsMap', '$stateParams', 'EditableMap', 'DataService', 'Validation', '$filter'];
