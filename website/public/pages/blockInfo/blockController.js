

ethChainApp.controller("blockCtrl", function($scope, $http){

    var url = (window.location.href).split("/")[4];
    console.log(url);

    var searchParams = {blockNumber:(url)}

    $scope.number = url;

    $http.get('/eth/blockData', { params:searchParams })
        .then(function(response){

            console.log(response.data);

            if(response.data){
                $scope.hash = response.data.hash;
                $scope.timestamp = response.data.timestamp;
                $scope.miner = response.data.miner;
                $scope.difficulty = response.data.difficulty;
                $scope.size = response.data.size;
                $scope.gasUsed = response.data.gasUsed;
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