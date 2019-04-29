

ethChainApp.controller("homeCtrl", function($scope, $http){

    $scope.registerLayout = function(){

        document.getElementById('registerBox').style.display = "flex";
        document.getElementById('loginBox').style.display = "none";

        document.getElementById("bkError").style.display = "none";
        document.getElementById("emailError").style.display = "none";
        document.getElementById("passwordError").style.display = "none";
        document.getElementById("postcodeError").style.display = "none";

    }


    $scope.loginLayout = function(){

        (document.getElementById('loginBox')).style.display = "flex";
        document.getElementById('registerBox').style.display = "none";

    }

    $scope.validateRegistration = function(){

        //Disable register button
        document.getElementById('regRegisterButton').disabled = true;

        //Check if fields are empty
        if($scope.checkIfEmpty() == false){
            document.getElementById("emptyError").style.display = "block";
            return;
        }

        //Check if passwords match
        if(document.getElementById("regPassword").value !=
            document.getElementById("regConfirmPassword").value)
        {
            document.getElementById("passwordError").style.display = "block";
            document.getElementById('regRegisterButton').disabled = false;
            return;
        }
        else {

            document.getElementById("passwordError").style.display = "none";

            //If they match, check to see if email exists in Mongo already
            var email = document.getElementById('regUsername').value;

            $http.get('/mongo/checkEmail', {params:{email:email}})
                .then(function(response){

                    if(response.data == "1"){

                        document.getElementById("emailError").style.display = "none";

                        //Validate postcode against postcodes.io api
                        var postcode = document.getElementById('regPostcode').value;
                        postcode = postcode.replace(/ +/g, "");

                        $http.get('/externalApis/checkPostcode', {params:{postcode:postcode}})
                            .then(function(response){

                                if(response.data == "1"){

                                    document.getElementById("postcodeError").style.display = "none";

                                    //Validate business key against MongoDB
                                    var businessKey = document.getElementById('regBusinessKey').value;
                                    businessKey = businessKey.replace(/ +/g, "");
                                    $http.get('/mongo/checkBusinessKey', {params:{businessKey:businessKey}})
                                        .then(function(response){

                                            if(response.data == "1"){
                                                document.getElementById("bkError").style.display = "none";

                                                //Attempt to insert the new user to the DB
                                                $scope.insertNewUser();

                                            }
                                            else{
                                                document.getElementById("bkError").style.display = "block";
                                                document.getElementById('regRegisterButton').disabled = false;
                                                return;
                                            }

                                        });


                                }
                                else{
                                    document.getElementById("postcodeError").style.display = "block";
                                    document.getElementById('regRegisterButton').disabled = false;
                                    return;
                                }

                            });

                    }
                    else{
                        document.getElementById("emailError").style.display = "block";
                        document.getElementById('regRegisterButton').disabled = false;
                        return;
                    }


                });

        }

    }

    //Checks to see if any fields are empty
    $scope.checkIfEmpty = function(){

        if((document.getElementById("regUsername").value).length == 0 ||
            (document.getElementById("regPassword").value).length == 0 ||
            (document.getElementById("regConfirmPassword").value).length == 0 ||
            (document.getElementById("regAddress").value).length == 0 ||
            (document.getElementById("regPostcode").value).length == 0 ||
            (document.getElementById("regBusinessKey").value).length == 0)
        {
            return false;
        }

    }


    //Inserts a new user into the DB
    $scope.insertNewUser = function(){
        document.getElementById('regRegisterButton').disabled = true
        document.getElementById("insertError").style.display = "none";

        var userParams = {

            email: document.getElementById("regUsername").value,
            password: document.getElementById("regPassword").value,
            address: document.getElementById("regAddress").value,
            postcode: document.getElementById("regPostcode").value,
            businessKey: document.getElementById("regBusinessKey").value

        };

        //Insert the new user and then check to see if they exist
        $http.get('/mongo/insertUser', {params:userParams})
            .then(function(response){

                var email = document.getElementById("regUsername").value;

                $http.get('/mongo/checkEmail', {params:{email:email}})
                    .then(function(response){

                        if(response.data == "0"){
                            $scope.loginLayout();
                            document.getElementById('regRegisterButton').disabled = false;
                        }
                        else{
                            document.getElementById("insertError").style.display = "block";
                            document.getElementById('regRegisterButton').disabled = false;
                        }

                    });
            });
    }


});