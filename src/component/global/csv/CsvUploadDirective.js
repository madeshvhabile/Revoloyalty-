export default class CsvUploadDirective {
    constructor() {
        this.restrict = 'A';
        this.scope = {ngModel: "=?"};
        this.replace = true;
        this.transclude = true;
        this.templateUrl = './templates/csv-upload.html';
        this.controller = ['$scope', '$element', ($scope, $element) => {
            $scope.fileName = '';
            $scope.chosenFile = '';
            $scope.error = '';
            $scope.showError = '';
            $scope.openFileDialog = () => {
                $element.find('input[type="file"]').trigger('click');
            };

            $scope.fileChanged = () => {
                let reader = new FileReader();
                let file = $element.find('input[type="file"]');
                $scope.file = file.get(0).files[0];


                var filext = $scope.file.name.split('.');
                if (filext[filext.length - 1] == 'xls' || filext[filext.length - 1] == 'xlsx') {
                    $scope.showError = false;
                    reader.readAsBinaryString($scope.file);
                    $scope.fileName = $scope.file.name;
                    $scope.$apply()
                } else {
                    $scope.showError = true;
                    $scope.error = 'Only Excel files are accepted';
                    $scope.$apply()
                }
                reader.onload =function(e){
                    let data = e.target['result'];
                    let cfb = XLSX.read(data, {
                      type: 'binary'
                    });
                    cfb.SheetNames.length = 1

                    cfb.SheetNames.forEach(function (sheetName) {
                        let headerNames = XLSX.utils.sheet_to_json(cfb.Sheets[sheetName], { header: 1 })[0];
                        $scope.ngModel = XLSX.utils.sheet_to_json( cfb.Sheets[sheetName]);
                         console.log("datac",$scope.ngModel)

                         $scope.$apply()
                        // headers2 = get_header_row(cfb.Sheets[sheetName])
                        // headerCamel = changeColumn(headers2)
                        // sCSV = XLSX.utils.sheet_to_json(cfb.Sheets[sheetName], {
                        //   defval: null,
                        //   header: headerCamel,
                        //   range: 1
                        // });
                        // if (sCSV.length > 0) fulldata.push(sCSV)
                      });

                    // let headerNames = XLSX.utils.sheet_to_json(cfb.Sheets[0], { header: 1 })[0];
                    // let datac = XLSX.utils.sheet_to_json( cfb.Sheets[0]);
                }

                // reader.onloadend = () => {
                //     setTimeout(() => {
                //         if (reader.result) {
                //             if ($scope.file.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                //                 $scope.showError = true;
                //                 $scope.error = 'Only CSV files are accepted';
                //                 $scope.$apply()
                //             } else {
                //                 $scope.showError = false;
                //                 $scope.ngModel = reader.result;
                //                 $scope.fileName = $scope.file.name;
                //                 $scope.$apply()
                //             }
                //         }
                //     }, 1000)
                // };
                // $scope.fileString = reader.result;

                $scope.$watch('ngModel', () => {
                    try {
                        console.log("$scope.ngModel",$scope.ngModel)
                        if($scope.ngModel.length)
                        $scope.ngModel = $scope.ngModel
                    } catch (err) {
                        console.log("err",err)
                        $scope.showError = true;
                        $scope.error = 'Invalid csv format';
                    }
                })
            }
        }]
    }
}

CsvUploadDirective.$inject = [];