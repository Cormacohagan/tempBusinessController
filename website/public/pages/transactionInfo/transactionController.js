

ethChainApp.controller("transactionCtrl", function($scope, $http){

    var url = (window.location.href).split("/")[4];
    console.log(url);

    var searchParams = {transactionNumber:(url)}

    $scope.number = url;

    $http.get('/eth/transactionData', { params:searchParams })
        .then(function(response){

            if(response.data){
                $scope.hash = response.data.hash;
                $scope.block = response.data.block;
                $scope.from = response.data.from;
                $scope.to = response.data.to;
                $scope.value = (parseFloat(response.data.value)/1000000000000000000).toFixed(2);
                $scope.gasUsed = response.data.gasUsed;
                $scope.gasPrice = response.data.gasPrice;
            }

        });

    $scope.searchBox1 = function(){

        var text = document.getElementById('searchTxt1').value;

        if(text.length == 0){
            console.log("Stop trying to search the empty field");
        }
        else if(text.length <=15){
            window.location.href = "/block/"+text;
        }
        else{
            window.location.href = "/transaction/"+text;
        }
    }

});