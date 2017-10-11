export default class SellerLoginController {
    constructor($scope, $state, AuthService,DataService) {
        if (AuthService.getStoredRefreshToken()) {
            AuthService.getRefreshToken()
                .then(
                    res => {
                        AuthService.setStoredRefreshToken(res.refresh_token);
                        AuthService.setStoredToken(res.token);
                        if (AuthService.isGranted('ROLE_SELLER')) {
                            DataService.getSellerDetails().then(
                                res =>{
                                    DataService.sellerDetails=res
                                    $state.go('seller.panel.dashboard')
                                },
                                err =>{
                                    $state.go('seller-login')
                                }
                            )

                        } else {
                            $state.go('seller-login')
                        }
                    },
                    () => {
                        $state.go('seller-login');
                    }
                )
        }
        this.$scope = $scope;
        this.$state = $state;
        this.AuthService = AuthService;
        this.DataService=DataService
    }

    getMe(){
        let self = this;

    }

    submit() {
        let self = this;

        self.AuthService.setLogin(self.$scope._username);
        self.AuthService.setPassword(self.$scope._password);
        self.AuthService.getToken()
            .then(
                res => { //success
                    let redirectTo = self.AuthService.getLogoutFrom();

                    self.AuthService.setStoredToken(res.token);

                    if (self.$scope.rememberMe) {
                        self.AuthService.setStoredRefreshToken(res.refresh_token);
                    }

                    if (redirectTo) {

                        self.DataService.getSellerDetails().then(
                            res =>{
                                self.AuthService.setUserId(res.id)
                                self.$state.go(redirectTo);
                            },
                            err =>{
                                $state.go('seller-login')
                            }
                        )


                    } else {
                        self.DataService.getSellerDetails().then(
                            res =>{
                                self.DataService.sellerDetails=res
                                $state.go('seller.panel.dashboard')
                            },
                            err =>{
                                $state.go('seller-login')
                            }
                        )
                    }
                },
                res => { //error
                    self.$scope.showError = true;
                    self.$scope.errorMsg = res.data.message;
                }
            )
    }
}

SellerLoginController.$inject = ['$scope', '$state', 'AuthService','DataService'];