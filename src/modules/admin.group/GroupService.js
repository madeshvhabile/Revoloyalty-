export default class GroupService {
    constructor(Restangular, EditableMap, $q) {
        this.Restangular = Restangular;
        this.EditableMap = EditableMap;
        this.$q = $q;
        this.Group=[{
            "Id":"065450001",
            "Group":"Robinsons",
            "Merchants":"5",
            "Stores":"200",
            "Status":"Active"
          },
          {
            "Id":"06442001",
            "Group":"Batman",
            "Merchants":"5",
            "Stores":"543",
            "Status":"Active"
          },
          {
            "Id":"06555501",
            "Group":"Justice League",
            "Merchants":"7",
            "Stores":"54",
            "Status":"Active"
          },
          {
            "Id":"06575001",
            "Group":"Star Wars",
            "Merchants":"457",
            "Stores":"7891",
            "Status":"Active"
          },
          {
            "Id":"06311001",
            "Group":"star Treck",
            "Merchants":"459",
            "Stores":"7894",
            "Status":"Active"
          },
          {
            "Id":"06230001",
            "Group":"Marvels",
            "Merchants":"7898",
            "Stores":"85247",
            "Status":"Active"
          },
          {
            "Id":"06423001",
            "Group":"GI joe",
            "Merchants":"524",
            "Stores":"4531",
            "Status":"Active"
          },
          {
            "Id":"04245001",
            "Group":"Cobra",
            "Merchants":"754",
            "Stores":"857",
            "Status":"Inactive"
          },
          {
            "Id":"06523001",
            "Group":"Avangers",
            "Merchants":"6",
            "Stores":"85",
            "Status":"Active"
          },
          {
            "Id":"06513201",
            "Group":"zombie",
            "Merchants":"741",
            "Stores":"963",
            "Status":"Inactive"
          }];
          this.Catagory=[{
            "Id":"065450001",
            "Catagory":"Robinsons",
            "Merchants":"5",
            "Stores":"200",
            "Status":"Active"
          },
          {
            "Id":"06442001",
            "Catagory":"Batman",
            "Merchants":"5",
            "Stores":"543",
            "Status":"Active"
          },
          {
            "Id":"06555501",
            "Catagory":"Justice League",
            "Merchants":"7",
            "Stores":"54",
            "Status":"Active"
          },
          {
            "Id":"06575001",
            "Catagory":"Star Wars",
            "Merchants":"457",
            "Stores":"7891",
            "Status":"Active"
          },
          {
            "Id":"06311001",
            "Catagory":"star Treck",
            "Merchants":"459",
            "Stores":"7894",
            "Status":"Active"
          },
          {
            "Id":"06230001",
            "Catagory":"Marvels",
            "Merchants":"7898",
            "Stores":"85247",
            "Status":"Active"
          },
          {
            "Id":"06423001",
            "Catagory":"GI joe",
            "Merchants":"524",
            "Stores":"4531",
            "Status":"Active"
          },
          {
            "Id":"04245001",
            "Catagory":"Cobra",
            "Merchants":"754",
            "Stores":"857",
            "Status":"Inactive"
          },
          {
            "Id":"06523001",
            "Catagory":"Avangers",
            "Merchants":"6",
            "Stores":"85",
            "Status":"Active"
          },
          {
            "Id":"06513201",
            "Catagory":"zombie",
            "Merchants":"741",
            "Stores":"963",
            "Status":"Inactive"
          }]
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
        status:'Approved'
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
        status:editedCategory.status
      }
      return self.Restangular.one('category', editedCategory.categoryId).customPUT({category: category});
  }

    deactivateGroup(groupId) {
        return this.Restangular.one('admin').one('merchant', merchantId).one('deactivate').customPOST();
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
