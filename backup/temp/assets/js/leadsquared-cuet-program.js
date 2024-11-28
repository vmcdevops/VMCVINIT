var USE_STAGING = false;
var SURL = "https://marketplace.vidyamandir.com/api/status/success?source=web";
var FURL = "https://marketplace.vidyamandir.com/api/status/failure?source=web&cb=";
var CURL = "https://marketplace.vidyamandir.com/api/status/cancel?source=web&cb=";
let API_MARKET_PLACE = "https://marketplace.vidyamandir.com";
let API_BL = "https://bl.vidyamandir.com";
let APP_URL = "https://webapp.vidyamandir.com";
// Added By Ajay
var API_WP = "https://registrations.vidyamandir.com/wp-json/vmc/v1";
// End

console.log('API_WP', API_WP);

// if (window.location.origin == "https://stgvmcweb.vidyamandir.com" || window.location.hostname == "127.0.0.1" || window.location.hostname == "localhost") {
// 	USE_STAGING = true;
// 	SURL = "https://stgvmcmarketplace.vidyamandir.com/api/status/success?source=web";
// 	FURL = "https://stgvmcmarketplace.vidyamandir.com/api/status/failure?source=web&cb=";
// 	CURL = "https://stgvmcmarketplace.vidyamandir.com/api/status/cancel?source=web&cb=";
// 	API_MARKET_PLACE = "https://stgvmcmarketplace.vidyamandir.com";
// 	API_BL = "https://stgvmcbl.vidyamandir.com";
//     APP_URL = "https://webapp.vidyamandir.com";


// }
//API_BL = "http://vmc.net"; 
// Added By ajay

var selectedRegion = null;
var regionList = [];
var countryCode = "IN";

/* Ready state */
/*
Value   State               Description
0       UNSENT              Client has been created. open() not called yet.
1       OPENED              open() has been called.
2       HEADERS_RECEIVED    send() has been called, and headers and status are available.
3       LOADING             Downloading; responseText holds partial data.
4       DONE                The operation is complete.
*/
/* API - HTTP - XML HTTP Request */





var requestInProcessing = 0;

function showLoader() {
    if (requestInProcessing <= 0) {
        return;
    }
    document.getElementById("processing_overlay").hidden = false;
}

function hideLoader() {
    if (requestInProcessing > 0) {
        return;
    }
    document.getElementById("processing_overlay").hidden = true;
}


function callApiForValues(requestType, apiUrl, callback, headers, payload = null) {
    requestInProcessing++;
    //showLoader();
    let xhttp = new XMLHttpRequest();
    xhttp.open(requestType, apiUrl, true);
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
            requestInProcessing--;
            //hideLoader();
            if (this.status === 200) {
                callback(this.responseText);
            } else if (this.response == null && this.status === 0) {
                console.log("The computer appears to be offline.");
            } else {
                console.log("Some error occured in api ", apiName);
            }
        }
    };
    for (let key in headers) {
        xhttp.setRequestHeader(key, headers[key]);
    }
    xhttp.send(payload);
}

function callMarketPlaceApi(requestType, apiName, callback, headers, payload = null) {
    var url = API_MARKET_PLACE + apiName;
    callApiForValues(requestType, url, callback, headers, payload);
}

function callWPApi(requestType, apiName, callback, headers, payload = null) {
    var url = API_WP + apiName;
    callApiForValues(requestType, url, callback, headers, payload);
}

function pageLoaded() {
    //get regions
    getMarketPlaceRegionsForCountry();
}

// $('#city1').Click(function(){
// 	if(selectedRegion == 0){
// 		$('#select_region_error').innerHTML('Please select state first');
// 	}
// });

/* User data */

function prepareRegionOptionsSelection(regionList) { //need
    var regionChoice = document.getElementById("select_region");
    for (i = 0; i < regionList.length; i++) {
        var region = regionList[i];
        var option = document.createElement("option");
        option.text = region.name;
        regionChoice.add(option);
    }

    //no region selected initially
    regionChoice.selectedIndex = 0;
}

function getMarketPlaceRegionsForCountrySuccess(responseText) { //need
    var response = JSON.parse(responseText);
    if (response.error) {
        alert(response.error.errorMessage);
        return;
    }

    regionList = response.available_regions;
    if (regionList == undefined || regionList.length == null || regionList.length == 0) {
        alert("States can't be fetched for India. Please try again.");
        return;
    }

    prepareRegionOptionsSelection(response.available_regions);
}

function getMarketPlaceRegionsForCountry() { //need
    var apiName = "/rest/V1/directory/countries/" + countryCode;
    var headers = {
        "Content-Type": "application/json",
        SupportedApiVersion: "1",
    };
    callMarketPlaceApi("GET", apiName, getMarketPlaceRegionsForCountrySuccess, headers);
}


var cityListArr = null;

function updateCitiesOptions(cityListJSON) { //need 
    cityListArr = JSON.parse(cityListJSON);
    var elCity = document.getElementById("city1");

    // for (o = elCity.options.length -1; i >= 1; i--) {
    // 	elCity.remove(i);
    // }

    var select = document.getElementById("city1");
    var length = select.options.length;
    for (i = length - 1; i >= 0; i--) {
        select.options[i] = null;
    }

    console.log(selectedRegion);
    for (i = 0; i < cityListArr.length; i++) {
        var course = cityListArr[i];
        var option = document.createElement("option");
        //option.value = course.code;
        option.value = course.value;
        option.text = course.value;
        elCity.add(option);
    }

    //elCity.selectedIndex = 0;
}


function regionOptionSelected() { // need
    var regionChoice = document.getElementById("select_region");
    var selectedIndex = regionChoice.selectedIndex;
    if (selectedIndex == 0) {
        selectedRegion = null;
    } else {
        callWPApi("GET", "/cities/" + regionChoice.selectedOptions[0].text, updateCitiesOptions, {}, null);
        selectedRegion = regionList[selectedIndex - 1];
    }
}


function regionOptionSelectedslider() { // need
    var regionChoice = document.getElementById("select_region1");
    var selectedIndex = regionChoice.selectedIndex;
    if (selectedIndex == 0) {
        selectedRegion = null;
    } else {
        callWPApi("GET", "/cities/" + regionChoice.selectedOptions[0].text, updateCitiesOptionsslider, {}, null);
        selectedRegion = regionList[selectedIndex - 1];
    }
}


function updateCitiesOptionsslider(cityListJSON) { //need 
    cityListArr = JSON.parse(cityListJSON);
    var elCity = document.getElementById("city2");

    // for (o = elCity.options.length -1; i >= 1; i--) {
    // 	elCity.remove(i);
    // }

    var select = document.getElementById("city2");
    var length = select.options.length;
    for (i = length - 1; i >= 0; i--) {
        select.options[i] = null;
    }


    for (i = 0; i < cityListArr.length; i++) {
        var course = cityListArr[i];
        var option = document.createElement("option");
        //option.value = course.code;
        option.value = course.value;
        option.text = course.value;
        elCity.add(option);
    }

    //elCity.selectedIndex = 0;
}

//End

function callApiForLead(requestType, apiUrl, headers, payload = null) {
    requestInProcessing++;
    // showLoader();
    let xhttp = new XMLHttpRequest();
    xhttp.open(requestType, apiUrl, true);
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
            requestInProcessing--;
            // hideLoader();
            if (this.status === 200) {

                window.location = "https://webapp.vidyamandir.com/#!/#!/learn-payment?pid=12243";


                /*}else{

                	console.log("Some error occured in leadsquared api ", apiUrl);
                	
                }*/

            } else if (this.status === 0) {
                console.log("The computer appears to be offline.");
            } else {
                console.log(apiUrl);
                console.log(this.status);
                var apiResponse = JSON.parse(this.response);
                console.log(apiResponse);
                console.log("Some error occured in api ", apiUrl);
            }
        }
    };
    for (let key in headers) {
        xhttp.setRequestHeader(key, headers[key]);
    }
    xhttp.send(payload);
}



function callLeadApi(requestType, apiName, headers, payload = null) {
    var url = API_BL + apiName;
    //var prdUrl= APP_URL+prdAPI;
    callApiForLead(requestType, url, headers, payload);
}



function callLeadApiSlider(requestType, apiName, headers, payload = null) {
    var url = API_BL + apiName;
    //var prdUrl= APP_URL+prdAPI;
    callApiForLeadslider(requestType, url, headers, payload);
}

function callApiForLeadslider(requestType, apiUrl, headers, payload = null) {
    requestInProcessing++;
    // showLoader();
    let xhttp = new XMLHttpRequest();
    xhttp.open(requestType, apiUrl, true);
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
            requestInProcessing--;
            // hideLoader();
            if (this.status === 200) {

                window.location = 'https://www.vidyamandir.com/VMC_ONLINE/PRIME/thank-you.html'


                /*}else{

                	console.log("Some error occured in leadsquared api ", apiUrl);
                	
                }*/

            } else if (this.status === 0) {
                console.log("The computer appears to be offline.");
            } else {
                console.log(apiUrl);
                console.log(this.status);
                var apiResponse = JSON.parse(this.response);
                console.log(apiResponse);
                console.log("Some error occured in api ", apiUrl);
            }
        }
    };
    for (let key in headers) {
        xhttp.setRequestHeader(key, headers[key]);
    }
    xhttp.send(payload);
}

function validateFields(i) {



    fullName = document.getElementById("fname").value.trim();
    if (fullName == undefined || fullName == null || fullName.length == 0) {
        document.getElementById("fullname_error").innerHTML = "Please enter student's first name";
        return true;
    }
    document.getElementById("fullname_error").innerHTML = "";


    //     	gender = document.getElementById("select_gender").value.trim();
    // 	if (gender == undefined || gender == null || gender.length == 0 || gender =='Select Gender') {
    // 		document.getElementById("gender_error").innerHTML = "Please select gender";
    // 		return true;
    // 	}
    // 	document.getElementById("gender_error").innerHTML = "";



    var mobileNumber = document.getElementById("mobile").value.trim();
    if (mobileNumber == undefined || mobileNumber == null || mobileNumber.length == 0) {
        document.getElementById("mobile_error").innerHTML = "Please enter Student's Phone Number";
        return true;
    }

    var mobileRegex = /^[6-9][0-9]{9}$/;
    if (mobileRegex.test(String(mobileNumber).toLowerCase()) === false) {
        document.getElementById("mobile_error").innerHTML = "Please enter a valid 10-digit mobile number";
        return true;
    }
    document.getElementById("mobile_error").innerHTML = "";


    email = document.getElementById("email").value.trim();
    if (email == undefined || email == null || email.length == 0) {
        document.getElementById("email_error").innerHTML = "Please enter student's email";
        return true;
    }
    document.getElementById("email_error").innerHTML = "";


    //     	school = document.getElementById("school").value.trim();
    // 	if (school == undefined || school == null || school.length == 0) {
    // 		document.getElementById("school_error").innerHTML = "Please enter student's school";
    // 		return true;
    // 	}
    // 	document.getElementById("school_error").innerHTML = "";


    var studentclass = document.getElementById("classSel").value.trim();
    if (studentclass == undefined || studentclass == null || studentclass == 'Select Class' || studentclass.length == 0) {
        document.getElementById("class_error").innerHTML = "Please select Class";
        return true;
    }
    document.getElementById("class_error").innerHTML = "";


    //     var courseSel = document.getElementById("courseSel").value.trim();
    // 	if (courseSel == undefined || courseSel == null || courseSel == 'Select Course' || courseSel.length == 0) {
    // 		document.getElementById("course_error").innerHTML = "Please Select Course";
    // 		return true;
    // 	}
    // 	document.getElementById("course_error").innerHTML = "";



    select_region = document.getElementById("select_region").value.trim();
    if (select_region == undefined || select_region == null || select_region.length == 0 || select_region == 'Select State') {
        document.getElementById("select_region_error").innerHTML = "Please select State";
        return true;
    }
    document.getElementById("select_region_error").innerHTML = "";





    city = document.getElementById("city1").value.trim();
    console.log(city);
    if (city == undefined || city == null || city.length == 0 || city == "Select City") {
        // console.log(selectedRegion);
        // if(selectedRegion == null || selectedRegion == 0){
        // 	document.getElementById("select_region_error").innerHTML = "Please select State";
        // 	return true;
        // }else{
        // 	document.getElementById("select_region_error").innerHTML = "";
        // }

        document.getElementById("city_error").innerHTML = "Please select city";
        return true;
    }
    document.getElementById("city_error").innerHTML = "";


    // //

    //     pincode = document.getElementById("pincode").value.trim();
    // 	if (pincode == undefined || pincode == null || pincode.length == 0) {
    // 		document.getElementById("pincode_error").innerHTML = "Please enter pincode";
    // 		return true;
    // 	}
    //     document.getElementById("pincode_error").innerHTML = "";



    return false;
}


function validateFieldsslider(i) {



    fullName = document.getElementById("fname1").value.trim();
    if (fullName == undefined || fullName == null || fullName.length == 0) {
        document.getElementById("fullname_error1").innerHTML = "Please enter student's first name";
        return true;
    }
    document.getElementById("fullname_error1").innerHTML = "";


    //     	gender = document.getElementById("select_gender").value.trim();
    // 	if (gender == undefined || gender == null || gender.length == 0 || gender =='Select Gender') {
    // 		document.getElementById("gender_error").innerHTML = "Please select gender";
    // 		return true;
    // 	}
    // 	document.getElementById("gender_error").innerHTML = "";



    var mobileNumber = document.getElementById("mobile1").value.trim();
    if (mobileNumber == undefined || mobileNumber == null || mobileNumber.length == 0) {
        document.getElementById("mobile_error1").innerHTML = "Please enter Student's Phone Number";
        return true;
    }

    var mobileRegex = /^[6-9][0-9]{9}$/;
    if (mobileRegex.test(String(mobileNumber).toLowerCase()) === false) {
        document.getElementById("mobile_error1").innerHTML = "Please enter a valid 10-digit mobile number";
        return true;
    }
    document.getElementById("mobile_error1").innerHTML = "";


    email = document.getElementById("email1").value.trim();
    if (email == undefined || email == null || email.length == 0) {
        document.getElementById("email_error1").innerHTML = "Please enter student's email";
        return true;
    }
    document.getElementById("email_error1").innerHTML = "";


    //     	school = document.getElementById("school").value.trim();
    // 	if (school == undefined || school == null || school.length == 0) {
    // 		document.getElementById("school_error").innerHTML = "Please enter student's school";
    // 		return true;
    // 	}
    // 	document.getElementById("school_error").innerHTML = "";


    var studentclass = document.getElementById("classSel1").value.trim();
    if (studentclass == undefined || studentclass == null || studentclass == 'Select Class' || studentclass.length == 0) {
        document.getElementById("class_error1").innerHTML = "Please select Class";
        return true;
    }
    document.getElementById("class_error1").innerHTML = "";


    //     var courseSel = document.getElementById("courseSel").value.trim();
    // 	if (courseSel == undefined || courseSel == null || courseSel == 'Select Course' || courseSel.length == 0) {
    // 		document.getElementById("course_error").innerHTML = "Please Select Course";
    // 		return true;
    // 	}
    // 	document.getElementById("course_error").innerHTML = "";



    select_region = document.getElementById("select_region1").value.trim();
    if (select_region == undefined || select_region == null || select_region.length == 0 || select_region == 'Select State') {
        document.getElementById("select_region_error1").innerHTML = "Please select State";
        return true;
    }
    document.getElementById("select_region_error1").innerHTML = "";





    city = document.getElementById("city2").value.trim();
    console.log(city);
    if (city == undefined || city == null || city.length == 0 || city == "Select City") {
        // console.log(selectedRegion);
        // if(selectedRegion == null || selectedRegion == 0){
        // 	document.getElementById("select_region_error").innerHTML = "Please select State";
        // 	return true;
        // }else{
        // 	document.getElementById("select_region_error").innerHTML = "";
        // }

        document.getElementById("city_error1").innerHTML = "Please select city";
        return true;
    }
    document.getElementById("city_error1").innerHTML = "";






    return false;
}



function startLeadProcessslider(i) {

    let validationError = validateFieldsslider(i);
    if (validationError) {
        return;
    }


    var fName = document.getElementById("fname1").value.trim();
    //var lName = document.getElementById("lname").value.trim();
    //var leadSource = document.getElementById("source").value.trim();
    var mobileNumber = document.getElementById("mobile1").value.trim();
    var emailAddress = document.getElementById("email1").value.trim();

    var studentclass = document.getElementById("classSel1").value.trim();
    //var courseSel = document.getElementById("courseSel").value.trim();
    var state = document.getElementById("select_region1").value.trim();
    var city = document.getElementById("city2").value.trim();
    //var pincode = document.getElementById("pincode").value.trim();
    //var school = document.getElementById("school").value.trim();
    //var gender = document.getElementById("select_gender").value.trim();





    var apiName = "/vmc/insertleadSquardRequest";

    var json = [

        {
            "Attribute": "FirstName",
            "Value": fName
        },
        {
            "Attribute": "LastName",
            "Value": 'prime-by-founders'
        },
        {
            "Attribute": "Phone",
            "Value": mobileNumber
        },
        {
            "Attribute": "mx_City",
            "Value": city
        },
        {
            "Attribute": "mx_Class",
            "Value": studentclass
        },
        // {
        //   "Attribute": "Source",
        // "Value": leadSource
        // },
        {
            "Attribute": "EmailAddress",
            "Value": emailAddress
        },
        // 				{
        // 				"Attribute": "mx_Zip_Code",
        // 				"Value": pincode
        // 				},
        // 				{
        // 				 "Attribute": "mx_School_Name",
        // 				 "Value": school
        // 				},

        {
            "Attribute": "mx_State",
            "Value": state
        },
        {
            "Attribute": "mx_Selected_Centre",
            "Value": 555
        },

        {
            "Attribute": "mx_Product_URL",
            "Value": window.location.href
        }


    ];
    var jsonStr = JSON.stringify(json);
    //console.log(jsonStr);
    var headers = {
        "Content-Type": "application/json",
        "SupportedApiVersion": 1
    };


    callLeadApiSlider("POST", apiName, headers, jsonStr);


}


function startLeadProcess(i) {

    let validationError = validateFields(i);
    if (validationError) {
        return;
    }


    var fName = document.getElementById("fname").value.trim();
    //var lName = document.getElementById("lname").value.trim();
    var leadSource = document.getElementById("source").value.trim();
    var mobileNumber = document.getElementById("mobile").value.trim();
    var emailAddress = document.getElementById("email").value.trim();

    var studentclass = document.getElementById("classSel").value.trim();
    //var courseSel = document.getElementById("courseSel").value.trim();
    var state = document.getElementById("select_region").value.trim();
    var city = document.getElementById("city1").value.trim();
    //var pincode = document.getElementById("pincode").value.trim();
    //var school = document.getElementById("school").value.trim();
    //var gender = document.getElementById("select_gender").value.trim();



    // var splitNames = fullName.split(" ");
    // if (splitNames.length > 1) {
    // 	firstName = splitNames.slice(0, splitNames.length - 1).join(" ");
    // 	lastName = splitNames[splitNames.length - 1];
    // } else {
    // 	firstName = fullName;
    // 	lastName = "";
    // }

    var apiName = "/vmc/insertleadSquardRequest";

    var json = [

        {
            "Attribute": "FirstName",
            "Value": fName
        },
        {
            "Attribute": "LastName",
            "Value": 'prime-by-founders'
        },
        {
            "Attribute": "Phone",
            "Value": mobileNumber
        },
        {
            "Attribute": "mx_City",
            "Value": city
        },
        {
            "Attribute": "mx_Class",
            "Value": studentclass
        },
        {
            "Attribute": "Source",
            "Value": leadSource
        },
        {
            "Attribute": "EmailAddress",
            "Value": emailAddress
        },
        // 				{
        // 				"Attribute": "mx_Zip_Code",
        // 				"Value": pincode
        // 				},
        // 				{
        // 				 "Attribute": "mx_School_Name",
        // 				 "Value": school
        // 				},

        {
            "Attribute": "mx_State",
            "Value": state
        },
        {
            "Attribute": "mx_Selected_Centre",
            "Value": 555
        },

        {
            "Attribute": "mx_Product_URL",
            "Value": window.location.href
        }


    ];
    var jsonStr = JSON.stringify(json);
    //console.log(jsonStr);
    var headers = {
        "Content-Type": "application/json",
        "SupportedApiVersion": 1
    };


    callLeadApi("POST", apiName, headers, jsonStr);


}