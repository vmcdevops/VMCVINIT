//Flow
//getproducts
//addtocart
//getcart
//fill user data
//getMobileValidationRules
//mobile number validation as per getMobileValidationRules regex
//send mobile verification code
//verify otp
//register user for guest purchase
//saveuser details
//get regions list related to states for India
//ask for payment options
//calculate pg hash
//make payment
var examType = "2";
var productInfo = null;
var mobileNumber = "";
var otpNumber = "";

var fullName = "";
var firstName = "";
var lastName = "";
var email = "";
var selectedRegion = null;
var regionList = [];
var countryCode = "IN";
var countryMobileCode = "+91";

var productIdGlobal = "11920";
var product_catID = 61;

var TEST_TYPE = "VMCVIQ";
var couponCodeGlobal = `${TEST_TYPE}499`;
var couponCodeSecondary = `${TEST_TYPE}299`;
var couponCodeTestdateSpecific = `${TEST_TYPE}299`;
var couponCodeforNEET = `${TEST_TYPE}499`;


var defaultCouponApplied = false;
var marchantKeyGlobal = "qoCStF";

var userInfo = {
    firstName: "",
    lastName: "",
    userType: "",
    otp: "",
    mobileNumber: "",
    guestLevelId: null,
    countryCode: countryCode,
};
var cartInfo = {
    cartType: null,
    cartMode: null,
    item_id: "",
    name: "",
    price: "",
    product_type: "",
    qty: "",
    quote_id: "",
    cartId: "",
    sku: "",
    productInfo: "books store",
    enablePg: "true",
    redirectUrl: "",
};
var userCartSummery = null;
var newUserUuid = "";
var natDatesList = null;
var selectedNatDate = null;
var is_app = false;
var USE_STAGING = false;
var SURL = "https://marketplace.vidyamandir.com/api/status/success?source=web";
var FURL = "https://marketplace.vidyamandir.com/api/status/failure?source=web&cb=";
var CURL = "https://marketplace.vidyamandir.com/api/status/cancel?source=web&cb=";
let API_MARKET_PLACE = "https://marketplace.vidyamandir.com";
let API_BL = "https://bl.vidyamandir.com";
let API_WP = "https://registrations.vidyamandir.com/wp-json/vmc/v1";
let LARAVEL_API = "https://vmcportal.vidyamandir.com";


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
    showLoader();
    let xhttp = new XMLHttpRequest();
    xhttp.open(requestType, apiUrl, true);
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
            requestInProcessing--;
            hideLoader();
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

function callBLApi(requestType, apiName, callback, headers, payload = null) {
    var url = API_BL + apiName;
    callApiForValues(requestType, url, callback, headers, payload);
}



/**************surendra 06-10-2023 ***************** */

function callBLApiMerito(requestType, apiName, callback, headers, payload = null) {
    var url = API_BL + apiName;
    callApiForValuesMerito(requestType, url, callback, headers, payload);
}


function callApiForValuesMerito(requestType, apiUrl, callback, headers, payload = null) {
    requestInProcessing++;
    showLoader();
    let xhttp = new XMLHttpRequest();
    xhttp.open(requestType, apiUrl, true);
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
            requestInProcessing--;
            hideLoader();
            
                callback(this.responseText);
           
        }
    };
    for (let key in headers) {
        xhttp.setRequestHeader(key, headers[key]);
    }
    xhttp.send(payload);
}

/**************end surendra 06-10-2023 ***************** */



function callWPApi(requestType, apiName, callback, headers, payload = null) {
    var url = API_WP + apiName;
    callApiForValues(requestType, url, callback, headers, payload);
}








/***Added By Ajay 2020-06-28*/
function callLaravelApi(requestType, apiName, callback, headers, payload = null) {
    var url = LARAVEL_API + apiName;
    callApiForValues(requestType, url, callback, headers, payload);
}
/**** END */

/** Added By Ajay */
function populateFieldsFromUrl() {

    var url = new URL(window.location.href);
    let params = ['mobile_input', 'fullname', 'dob', 'email',
        'school', 'select_course', 'select_center',
        'select_region', 'select_city', 'pincode', 'select_nat_date'
    ];

    params.forEach(element => {
        var ele = url.searchParams.get(element);
        if (typeof ele != 'undefined' && ele != null && ele != '') {
            if (['select_course', 'select_center', 'select_region', 'select_city', 'select_nat_date'].indexOf(element) !== -1) {
                setTimeout(function() {
                    $(`[name="${element}"]`).val(ele);
                    $(`[name="${element}"]`).trigger('change');
                    if (element == 'select_city') {
                        setTimeout(function() {
                            $(`[name="${element}"]`).val(ele);
                        }, 1000);
                    }
                }, 3000)
            } else if (element == 'dob') {
                let d = new Date(ele);
                var dd = (d.getDate() < 10 ? '0' : '') +
                    d.getDate();
                $(`#${element}`).val(`${d.getFullYear()}-${d.getMonth() + 1}-${dd}`);
            } else {
                $(`[name="${element}"]`).val(ele);
            }
        }
    });
}
/** END */

function natTestModeSelected() {
    var select_test_mode = document.getElementById("select_test_mode");
    elCourses = document.getElementById("select_nat_date");
    elCourses.selectedIndex = 0;
    document.getElementById("select_course").selectedIndex = 0;
    document.getElementById("select_center").selectedIndex = 0;
    document.getElementById("select_test_mode_error").innerHTML = "";

    if (!select_test_mode.value) {
        document.getElementById("select_test_mode_error").innerHTML = "Please Select Test Mode";
        $('.for_viq_offline').show();
    } else if (select_test_mode.value == 'Offline') {
        $('.for_viq_offline').show();
    } else {
        $('.for_viq_offline').hide();
    }
    $('.for_viq_offline').find('input,select').val("");

    fetchUpcomingNatDates(examType);
}

function getOfflineCenters() {
    var natDateChoice = document.getElementById("select_nat_date");
    var selectedIndex = natDateChoice.selectedIndex;
    if (selectedIndex == 0) {
        selectedNatDate = null;
    } else {
        selectedNatDate = natDatesList[selectedIndex - 1];
    }
    let json = {
        "type": "GET_OFFLINE_TEST_CENTER",
        "postdata": {
            "test_id": selectedNatDate.id
        }
    };
    var jsonStr = JSON.stringify(json);
    var headers = {
        "Content-Type": "application/json",
        SupportedApiVersion: "1",
    };
    callLaravelApi("POST", "/api/AJAX_DATA", updateOfflineCentre, headers, jsonStr);
}

function viqTestCityAddressSelected() {
    let address = $("#test_center").find(':selected').data('address');
    $("#test_center_address").html('Address : ' + address).css({
        "marginBottom": "1rem"
    });
}

function updateOfflineCentre(courseListJSON) {
    var courseListArr = JSON.parse(courseListJSON);
    // console.log(courseListArr.data);
    courseListArr = courseListArr.data;
    var elCourses = document.getElementById("test_center");
    /** Added By Ajay  2022-06-28*/
    elCourses.innerHTML = "";
    var option = document.createElement("option");
    option.value = "";
    option.disabled = true;
    option.text = "Select Offline Test Center *";
    elCourses.add(option);
    /**END*/
    for (i = 0; i < courseListArr.length; i++) {
        var course = courseListArr[i];
        var option = document.createElement("option");
        option.value = course.code;
        option.text = course.value;
        option.dataset.address = course.address;
        elCourses.add(option);
    }

    elCourses.selectedIndex = 0;
}

$('[name="select_test_type"]').change(pageLoaded);

$(function() {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);

    let exam_types_ar = ['viq', 'nat'];
    let EXAM_NAME = {
        "viq": 3,
        "nat": 2
    };
    if (urlParams.has('exam_type')) {

        let exam_type = urlParams.get('exam_type').toLowerCase();
        if (exam_types_ar.includes(exam_type)) {
            $(`[name="select_test_type"][value="${EXAM_NAME[exam_type]}"]`).prop('checked', true);
            $(`#${exam_type}_tab`).trigger('click');
        } else {
            $(`[name="select_test_type"][value="3"]`).prop('checked', true);
            $('#viq_tab').trigger('click');
        }


    } else {
        $(`[name="select_test_type"][value="3"]`).prop('checked', true);
        $('#viq_tab').trigger('click');
    }

    pageLoaded();
});

function changeExamType() {
    var select_test_type = $('[name="select_test_type"]:checked').val();
    if (select_test_type && select_test_type == "2") {
        examType = 2;
        TEST_TYPE = "VMCNAT";
        //$('.for_viq').hide();
        productIdGlobal = 11920;
        product_catID = 61;
    } else {
        examType = 3;
        TEST_TYPE = "VIQ";
        $('.for_viq').show();
        productIdGlobal = 11992;
        product_catID = 61;
    }
    $('.for_viq_offline').hide();
    couponCodeGlobal = `${TEST_TYPE}999`;
    couponCodeSecondary = `${TEST_TYPE}299`;
    couponCodeTestdateSpecific = `${TEST_TYPE}299`;
    couponCodeforNEET = `${TEST_TYPE}499`;
    $('.for_viq, .for_viq_offline').find('input,select').val("");
}

function pageLoaded() {

    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    if (urlParams.has('appstudentid') && urlParams.get('appstudentid') != "") {
        is_app = true;
        $('#is_app').addClass('d-none');
    } else {
        $('#is_app').removeClass('d-none');
        is_app = false;
    }
    $('body').find('select').val("");
    defaultCouponApplied = false;
    changeExamType();
    //fetch nat dates
    //fetchUpcomingNatDates(examType);
    //get products
    fetchProductInfo();
    //get regions
    getMarketPlaceRegionsForCountry();

    /** Added By Ajay */
    // populate Fields from URL

    populateFieldsFromUrl();
    /** END */



}

/* Fetch NAT Registration Dates */
var fetchUpcomingNatDates = function(examType) {
    let test_mode = "online";
    let select_test_mode = document.getElementById('select_test_mode');
    if (select_test_mode.value) {
        test_mode = select_test_mode.value;
    }
    //  console.log(select_test_mode, test_mode);

    var apiName = `/getUpcomingNatDates?type=${examType}&test_mode=${test_mode}`;
    var headers = {
        "Content-Type": "application/json",
        SupportedApiVersion: "1",
    };
    callBLApi("GET", apiName, fetchUpcomingNatDatesSuccess, headers, null);
};

var fetchUpcomingNatDatesSuccess = function(responseText) {

    var response = JSON.parse(responseText);
    if (response.error) {
        document.getElementById("select_nat_date").hidden = true;
        document.getElementById("select_nat_date").style.height = 0;
        document.getElementById("select_nat_date_error").hidden = true;
        document.getElementById("select_nat_date_error").style.height = 0;
        return;
    }

    if (response.response != undefined && response.response != null && response.response.length > 0) {

        document.getElementById("select_nat_date").hidden = false;
        document.getElementById("select_nat_date").style.height = 38;
        document.getElementById('select_nat_date').setAttribute("style", "height:38px");
        document.getElementById("select_nat_date_error").hidden = false;
        document.getElementById("select_nat_date_error").style.height = 20;
        natDatesList = response.response;

        prepareNatDateOptionsSelection(natDatesList);
    } else {

        document.getElementById("select_nat_date").hidden = true;
        document.getElementById("select_nat_date").style.height = 0;
        document.getElementById("select_nat_date_error").hidden = true;
        document.getElementById("select_nat_date_error").style.height = 0;
    }
};

function prepareNatDateOptionsSelection(natDatesList) {
    console.log(natDatesList);
    var natDateChoice = document.getElementById("select_nat_date");
    natDateChoice.innerHTML = "";
    natDateChoice.innerHTML = "<option value='' selected = ''>Please select Test *</option>";
    var defaultIndex = 0;

    /***************** surendra 18-08-2023 **************/
    for (i = 0; i < natDatesList.length; i++) {
        var natDate = natDatesList[i];
        if ( natDate.testDate == '2023-10-13') {

            var option = document.createElement("option");
            option.text = natDate.testName;
            option.value = natDate.id;
            natDateChoice.add(option);
            //if (natDate.isDefault == true || natDate.isDefault == 1 || natDate.isDefault == "1") {
            // defaultIndex = i;
            //  }
        }
    }
    /***************** surendra 18-08-2023 **************/

    if (defaultIndex != 0) {
        var natDateChoice = document.getElementById("select_nat_date");
        natDateChoice.selectedIndex = defaultIndex + 1;
        natDateOptionSelected();
    } else {
        var natDateChoice = document.getElementById("select_nat_date");
        natDateChoice.selectedIndex = 0;
    }

    //To fetch dates from Select options to show in frontend
    var x = document.getElementById("select_nat_date");
    //input = x.option[x.selectedIndex].text;
    var i;
    var testdate = '';
    var monthNames = ['month', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    for (i = 1; i < x.length; i++) {
        var testday = x.options[i].text.split('-')[0];
        var testmonth = x.options[i].text.split('-')[1];
        var testyear = x.options[i].text.split('-')[2];
        testdate = testdate + '<span class="upcoming-dates">' + testday + ' ' + monthNames[prependZero(testmonth)] + ' ' + testyear + '</span>';
    }

    const test_date = document.getElementById('test-dates');
    if (typeof test_date != 'undefined' && test_date != null) {
        test_date.innerHTML = '<span class="Dates-Holder">' + testdate + '</span>';
    }
}

function prependZero(number) {
    if (number <= 9) return ("0" + number).slice(-1);
    else return number;
}

function formatDate(dateString) {
    var thisDate = dateString.split("-");
    var newDate = [thisDate[2], thisDate[1], thisDate[0]].join("-");
    return newDate;
}

function natDateOptionSelected() {
    //alert("dfgf");
    let isOffline = false;
    //if (examType == 3) {
    var select_test_mode = document.getElementById("select_test_mode");

    if (!select_test_mode.value) {
        document.getElementById("select_nat_date").value = "";
        document.getElementById("select_test_mode_error").innerHTML = "Please Select Test Mode";
        return;
    }
    isOffline = true;
    // }

    var natDateChoice = document.getElementById("select_nat_date");
    // alert(natDateChoice);
    var selectedIndex = natDateChoice.selectedIndex;
    //alert(selectedIndex);
    //var gender = document.getElementById('select_gender').value.trim();

    if (selectedIndex == 0) {
        selectedNatDate = null;
    } else {
        selectedNatDate = natDatesList[selectedIndex - 1];
    }


    /***Added By Ajay 2020-06-28*/
    let json = {
        "type": "GET_CLASS_AGAINST_TEST_REGISTRATION",
        "postdata": {
            "exam_type": examType,
            "test_id": selectedNatDate.id
        }
    };
    var jsonStr = JSON.stringify(json);
    var headers = {
        "Content-Type": "application/json",
        SupportedApiVersion: "1",
    };
    callLaravelApi("POST", "/api/AJAX_DATA", updateCoursesOptions, headers, jsonStr);
    /*** END */

    var select_test_mode = document.getElementById("select_test_mode");
    if (select_test_mode.value == "Online" || select_test_mode.value == "online") {
        if (examType == 3) {
            if (selectedNatDate.id == 326 || selectedNatDate.id == 327 || selectedNatDate.id == 328 || selectedNatDate.id == 329) {
                couponCodeGlobal = 'VIQRUD99';
                applyCouponWithCouponCode(couponCodeGlobal);
                document.getElementById("couponCode").disabled = dalse;
                document.getElementById("couponCode").value = couponCodeGlobal;

            } else {
                couponCodeGlobal = 'VIQRUD99';
                applyCouponWithCouponCode(couponCodeGlobal);
                document.getElementById("couponCode").disabled = dalse;
                document.getElementById("couponCode").value = couponCodeGlobal;
            }

        }
    }


    if (isOffline) {
        getOfflineCenters();
    }
    changePriceCoupon();
}


/****
 * 2022-07-15
 * Added by Ajay for change amount on basis of test date and selected class
 */



function changePriceCoupon() {

    var select_course = document.getElementById("select_course");

    var natDateChoice = document.getElementById("select_nat_date");
    var selectedIndex = natDateChoice.selectedIndex;
    var selectedNatDate = natDatesList[selectedIndex - 1];

    const limitDate = new Date('2023-08-15');
    const today = new Date();
    let centre_code = document.getElementById("select_center").value;
    centre_code = +centre_code;
    const centre_include = [138, 129];

    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);

    var centre_code_url = null;
    if (urlParams.has('centre_code')) {
        centre_code_url = +urlParams.get('centre_code');
    }

    var select_test_mode = document.getElementById("select_test_mode");

    if (is_app) {

        if (examType == 2) {
            document.getElementById("couponCode").value = `${TEST_TYPE}499`;
        }
        document.getElementById("btn_remove_coupon").disabled = true;
        applyCoupon();

    } else if (select_test_mode.value == "Offline" || select_test_mode.value == "offline") {
        if (examType == 3) {
            const limitDate2 = new Date('2023-10-29');
            if (today <= limitDate2) {
                document.getElementById("couponCode").value = `${TEST_TYPE}299`;
            } else {
                document.getElementById("couponCode").value = `${TEST_TYPE}299`;
            }
            document.getElementById("btn_remove_coupon").disabled = true;
            applyCoupon();
        }
    } else if (select_test_mode.value == "Online" || select_test_mode.value == "online") {
        if (examType == 3) {
            if (selectedNatDate.id == 326 || selectedNatDate.id == 327 || selectedNatDate.id == 328 || selectedNatDate.id == 329) {
                //  document.getElementById("couponCode").value = 'VIQ49';
            } else {
                // document.getElementById("couponCode").value = 'VIQTOI0';

            }
            document.getElementById("btn_remove_coupon").disabled = true;
            applyCoupon();
        }
        if (examType == 2) {
            if (selectedNatDate.id == 330 || selectedNatDate.id == 331) {
                document.getElementById("couponCode").value = 'VMCNAT99';
            } else {
                document.getElementById("couponCode").value = 'VMCNAT499';

            }
            document.getElementById("btn_remove_coupon").disabled = true;
            applyCoupon();
        }
    } else {

        let amount = selectedNatDate.amount ? selectedNatDate.amount : 499;
        document.getElementById("couponCode").value = `${TEST_TYPE}${amount}`;
        document.getElementById("btn_remove_coupon").disabled = true;
        applyCoupon();
    }
}
/******surendra 05-08-2023 get state against center---- 05-05-2023 */
document.getElementById("select_center").onchange = function() {
    var centre_code = document.getElementById("select_center").value;
    let json = {
        "type": "GET_STATE_AGAINST_CENTER",
        "center_code": centre_code

    };
    var jsonStr = JSON.stringify(json);
    var headers = {
        "Content-Type": "application/json",
        SupportedApiVersion: "1",
    };

    callLaravelApi("POST", "/api/statedatacenterwisetest", updateStateOptions, headers, jsonStr);
    changePriceCoupon();
}


function updateStateOptions(responseText) {
    var response = JSON.parse(responseText);

    var regionList = response.available_regions;
    var regionChoice = document.getElementById("select_region");
    for (i = 0; i < regionList.length; i++) {
        var region = regionList[i];
        var option = document.createElement("option");
        option.text = region.default_name;
        /***surendra 05-08-2023  comment below line in all js*/
        regionChoice.add(option);
    }


    regionChoice.selectedIndex = 0;


}



/******END surendra get state against center---- */




/*** END */


/***Added By Ajay 2020-06-28*/
document.getElementById("select_course").onchange = function() {
        var select_course = document.getElementById("select_course");
        let json = {
            "type": "GET_CENTER_AGAINST_CLASS_REGISTRATION",
            "postdata": {
                "exam_type": examType,
                "registration_code": select_course.value,
                "test_id": get_exam_test_id()
            }
        };
        var jsonStr = JSON.stringify(json);
        var headers = {
            "Content-Type": "application/json",
            SupportedApiVersion: "1",
        };

        callLaravelApi("POST", "/api/AJAX_DATA", updateCentersOptions, headers, jsonStr);
        changePriceCoupon();
    }
    /*** END */


/* Fetch Products */
var fetchProductInfo = function() {
    var apiName = `/rest/api/v2/getProductList?start=0&end=20&cat=${product_catID}&classLevelId=undefined&productId=${productIdGlobal}`;
    var headers = {
        "Content-Type": "application/json",
        SupportedApiVersion: "1",
    };
    callMarketPlaceApi("GET", apiName, fetchProductInfoSuccess, headers);
};

function fetchProductInfoSuccess(responseText) {
    var response = JSON.parse(responseText);
    if (response.error) {
        alert(response.error.errorMessage);
        return;
    }
    productInfo = response.result.docs[0];
    addToCart();
}

/* Add  to cart & get cart */
function addToCart() {
    var apiName = "/rest/api/v2/cart/addToCart";
    var json = {
        items: [{
            id: productInfo.id,
            skuCode: productInfo.sku,
            configurable_item_options: productInfo.configurable_item_options,
            couponCode: "",
            uuid: null,
            quote_id: "",
            count: 1,
            schoolName: ""

        }, ],
    };
    var jsonStr = JSON.stringify(json);
    var headers = {
        "Content-Type": "application/json",
        SupportedApiVersion: "1",
    };
    callMarketPlaceApi("POST", apiName, addToCartSuccess, headers, jsonStr);
}

function addToCartSuccess(responseText) {
    var response = JSON.parse(responseText);
    if (response.error) {
        alert(response.error.errorMessage);
        return;
    }
    cartInfo.item_id = response.data[0].response.data.item_id;
    cartInfo.name = response.data[0].response.data.name;
    cartInfo.price = response.data[0].response.data.price;
    cartInfo.product_type = response.data[0].response.data.product_type;
    cartInfo.qty = response.data[0].response.data.qty;
    cartInfo.quote_id = response.data[0].response.data.quote_id;
    cartInfo.cartId = response.data[0].response.data.quote_id;
    cartInfo.sku = response.data[0].response.data.sku;

    getCart(cartInfo.cartId);

}

function updateUIAsPerCartInfo() {
    var htmlInfo = "";
    let isDiscount = userCartSummery.list[0].discount != undefined && userCartSummery.list[0].discount != null ? true : false;
    if (isDiscount) {
        htmlInfo = '<span style="font-size: 14px; text-decoration: line-through; text-decoration-color: red;">&#8377 999</span><span style="font-size: 14px; margin-left: 10px;">&#8377 ' + parseInt(userCartSummery.total_amount) + " Only</span>";
    } else {
        htmlInfo = '<span style="font-size: 14px; margin-left: 20px;">&#8377 ' + parseInt(userCartSummery.total_amount) + " Only</span>";
    }
    var regfee = document.getElementsByClassName("registration_fee");
    var i;
    for (i = 0; i < regfee.length; i++) {
        regfee[i].innerHTML = htmlInfo;
    }
    //document.getElementById("registration_fee").innerHTML = htmlInfo;
}

function getCart(cartId) {
    var apiName = "/rest/api/v1/cart/getCart/0?quote_id=" + cartId;
    var headers = {
        "Content-Type": "application/json",
        SupportedApiVersion: "1",
    };
    callMarketPlaceApi("GET", apiName, getCartSuccess, headers);
}

function getCartSuccess(responseText) {

    var response = JSON.parse(responseText);
    if (response.error) {
        alert(response.error.errorMessage);
        return;
    }

    userCartSummery = response.data;
    updateUIAsPerCartInfo();

    if (defaultCouponApplied == false) {
        defaultCouponApplied = true;
        if (is_app) {
            if (examType == 3) {
                document.getElementById("couponCode").value = "VIQ0";
            }
        } else {

            if (examType == 2) {
                document.getElementById("couponCode").value = `${TEST_TYPE}99`;
            }

            if (examType == 3) {
                document.getElementById("couponCode").value = 'VIQRUD99';
            }
            /*if (examType == 2) {
             document.getElementById("couponCode").value = couponCodeGlobal;
            } else {
                document.getElementById("couponCode").value = `${TEST_TYPE}0`;
            }*/
        }
        applyCoupon();
    }
}

/* Apply - Remove Coupon */
var couponAppliedSuccessfullyFlag = false;

function couponCodeAppliedSuccessfully() {
    couponAppliedSuccessfullyFlag = true;
    let htmlInfo = '<img id="couponcode_status_img" width="20" src="https://www.vidyamandir.com/img/coupon_apply_success.png"/><span id="couponcode_status_msg" style="margin-left:10px;font-size:12px">Coupon code applied successfully.</span>';
    document.getElementById("couponcode_status").innerHTML = htmlInfo;
}

function couponCodeApplyError(errorMessage) {
    let htmlInfo = '<img id="couponcode_status_img" width="20" src="https://www.vidyamandir.com/img/coupon_apply_error.png"/><span id="couponcode_status_msg" style="margin-left:10px;font-size:12px">' + errorMessage + "</span>";
    var course = document.getElementById("select_course").value.trim();
    if (course == '23' || course == '13' || course == '63') {
        document.getElementById("couponcode_status").innerHTML = htmlInfo + ' \
		<button  \
			onclick="changeCouponCode()" \
			style="background: green;color: #fff;outline: 0;border: 0;padding: 4px 8px;border-radius: 4px;font-size: 12px;"> \
			Click here to apply ' + couponCodeforNEET + '</button>';
    } else

        document.getElementById("couponcode_status").innerHTML = htmlInfo + ' \
		<button  \
			onclick="applyExistingCode()" \
			style="background: green;color: #fff;outline: 0;border: 0;padding: 4px 8px;border-radius: 4px;font-size: 12px;"> \
			Click here to apply ' + couponCodeSecondary + '</button>';
}

function couponCodeRemoved() {
    couponAppliedSuccessfullyFlag = false;
    document.getElementById("couponcode_status").innerHTML = "";
}

function updateCouponCodeInUI() {
    document.getElementById("couponCode").value = couponCodeGlobal;
    if (couponCodeGlobal == undefined || couponCodeGlobal == null || couponCodeGlobal.length == 0) {
        document.getElementById("couponCode").disabled = false;
        document.getElementById("couponCode").focus();
        document.getElementById("couponCode").select();
        document.getElementById("btn_apply_coupon").hidden = false;
        document.getElementById("btn_remove_coupon").hidden = true;
        //document.getElementById("coupon_code_val").hidden = false;
    } else {
        document.getElementById("couponCode").disabled = true;
        document.getElementById("btn_apply_coupon").hidden = true;
        document.getElementById("btn_remove_coupon").hidden = false;
        //document.getElementById("coupon_code_val").hidden = true;
    }
}

function applyCouponSuccess(responseText) {
    var response = JSON.parse(responseText);
    if (response.response.error) {
        couponAppliedSuccessfullyFlag = false;
        let errorMessage = response.response.error.errorMessage;
        couponCodeApplyError(errorMessage);
        getCart(cartInfo.cartId);
        return;
    }

    couponCodeAppliedSuccessfully();
    updateCouponCodeInUI();
    getCart(cartInfo.cartId);
}

function applyCouponWithCouponCode(couponCode) {
    var apiName = "/rest/api/v2/applyCouponCode";
    var json = {
        quote_id: userCartSummery.cart_id,
        coupon_code: couponCode,
        sku: userCartSummery.list[0].parentSku,
        product_id: userCartSummery.list[0].child_product_id ? userCartSummery.list[0].child_product_id : userCartSummery.list[0].product_id,
    };

    var jsonStr = JSON.stringify(json);
    var headers = {
        "Content-Type": "application/json",
        SupportedApiVersion: "1",
    };

    callMarketPlaceApi("POST", apiName, applyCouponSuccess, headers, jsonStr);
}

function applyCoupon() {
    couponCodeGlobal = document.getElementById("couponCode").value.trim();
    document.getElementById("couponCode_error").innerHTML = "";
    applyCouponWithCouponCode(couponCodeGlobal);

}

function applyExistingCode() {
    /* Added By Ajay */
    let natDateChoice = document.getElementById("select_nat_date");
    let selectedIndex = natDateChoice.selectedIndex;
    if (selectedIndex == 0) {
        /* */
        document.getElementById('couponCode').value = couponCodeSecondary;
        applyCoupon();
    }
    /* Added By Ajay */
    /** ***
     * 
     * Old Code  
       document.getElementById('couponCode').value = couponCodeSecondary;
    	applyCoupon();
    *****
    ***
    End Old Code 
    */
}

function changeCouponCode() {
    var course = document.getElementById("select_course").value.trim();
    if (course == '74' || course == '64') {
        let natDateChoice = document.getElementById("select_nat_date");
        let selectedIndex = natDateChoice.selectedIndex;
        if (selectedIndex == 0) {
            //document.getElementById('couponCode').value = "VIQ0";
            applyCoupon();
        }
    } else applyExistingCode();
}

function removeCoupon() {
    var apiName = "/rest/api/v2/removeCouponCode?quote_id=" + userCartSummery.cart_id;
    var json = {};
    var jsonStr = JSON.stringify(json);
    var headers = {
        "Content-Type": "application/json",
        SupportedApiVersion: "1",
    };
    callMarketPlaceApi("POST", apiName, removeCouponSuccess, headers, jsonStr);
}

function removeCouponSuccess(responseText) {
    var response = JSON.parse(responseText);
    if (response.error) {
        alert(response.error.errorMessage);
        return;
    }

    couponCodeGlobal = "";
    couponCodeRemoved();
    updateCouponCodeInUI();
    getCart(cartInfo.cartId);
}

/* Mobile Verification */

function getMobileValidationRules() {
    var apiName = "/getMobileValidationRules";
    var headers = {
        "Content-Type": "application/json",
        SupportedApiVersion: "1",
    };
    callBLApi("GET", apiName, getMobileValidationRulesSuccess, headers, null);
}

function getMobileValidationRulesSuccess() {
    var response = JSON.parse(responseText);
    if (response.error) {
        alert(response.error.errorMessage);
        return;
    }
}

function sendMobileVerificationCode() {
    mobileNumber = document.getElementById("mobile_input").value.trim();
    if (mobileNumber == undefined || mobileNumber == null || mobileNumber.length == 0) {
        document.getElementById("mobile_number_error").innerHTML = "Please enter student's mobile number";
        return;
    }
    var mobileRegex = /^[6-9][0-9]{9}$/;
    if (mobileRegex.test(String(mobileNumber).toLowerCase()) == false) {
        document.getElementById("mobile_number_error").innerHTML = "Please enter a valid mobile number";
        return true;
    }

    document.getElementById("mobile_number_error").innerHTML = "";
    document.getElementById("mobile_number_otp_error").innerHTML = "";

    var apiName = "/user/sendMobileVerificationCode/" + mobileNumber + "?countryCode=" + countryCode;
    var headers = {
        "Content-Type": "application/json",
        SupportedApiVersion: "1",
    };
    callBLApi("GET", apiName, sendMobileVerificationCodeSuccess, headers, null);
}

function sendMobileVerificationCodeSuccess(responseText) {
    var response = JSON.parse(responseText);
    if (response.error) {
        alert(response.error.errorMessage);
        return;
    }
    if (response.code) {
        document.getElementById("mobile_number_otp_error").innerHTML = "Didn't receive OTP? Use " + response.code + " as OTP";
    }

    toggleMobileAndOTPDiv();
}

function changeMobileNumber() {
    toggleMobileAndOTPDiv();
}

function toggleMobileAndOTPDiv() {
    var mobileNumberDiv = document.getElementById("mobile_number");
    if (mobileNumberDiv.classList.contains("height-0")) {
        mobileNumberDiv.classList.remove("height-0");
    } else {
        mobileNumberDiv.classList.add("height-0");
    }

    var mobileNumberOtpDiv = document.getElementById("mobile_number_otp");
    if (mobileNumberOtpDiv.classList.contains("height-0")) {
        mobileNumberOtpDiv.classList.remove("height-0");
    } else {
        mobileNumberOtpDiv.classList.add("height-0");
    }
}

function verifyOTPSuccess(responseText) {
    var response = JSON.parse(responseText);
    if (response.error) {
        alert(response.error.errorMessage);
        return;
    }

    //add to cart
    addToCart();
}

function verifyOTP() {
    otpNumber = document.getElementById("mobile_otp_input").value.trim();
    if (otpNumber == undefined || otpNumber == null || otpNumber.length == 0) {
        document.getElementById("mobile_number_otp_error").innerHTML = "Please enter OTP sent on student's mobile number";
        return;
    }

    document.getElementById("mobile_number_error").innerHTML = "";
    document.getElementById("mobile_number_otp_error").innerHTML = "";

    var apiName = "/user/isCodeValidForUser";
    var json = {
        mobileNo: mobileNumber,
        verifyCode: otpNumber,
        verifyFor: "Mobile",
        countryCode: countryCode,
    };
    var jsonStr = JSON.stringify(json);
    var headers = {
        "Content-Type": "application/json",
        SupportedApiVersion: "1",
    };
    callBLApi("POST", apiName, verifyOTPSuccess, headers, jsonStr);
}

/* User data */

function regionOptionSelected() {
    var regionChoice = document.getElementById("select_region");
    var selectedIndex = regionChoice.selectedIndex;
    if (selectedIndex == 0) {
        selectedRegion = null;
    } else {
        callWPApi("GET", "/cities/" + regionChoice.selectedOptions[0].text, updateCitiesOptions, {}, null);
        selectedRegion = regionList[selectedIndex - 1];
    }
}

function prepareRegionOptionsSelection(regionList) {
    var regionChoice = document.getElementById("select_region");
    for (i = 0; i < regionList.length; i++) {
        var region = regionList[i];
        var option = document.createElement("option");
        option.text = region.name;
        /***surendra 05-08-2023  comment below line in all js*/
        //regionChoice.add(option);
    }

    //no region selected initially
    regionChoice.selectedIndex = 0;
}

function getMarketPlaceRegionsForCountrySuccess(responseText) {
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

function getMarketPlaceRegionsForCountry() {
    var apiName = "/rest/V1/directory/countries/" + countryCode;
    var headers = {
        "Content-Type": "application/json",
        SupportedApiVersion: "1",
    };
    callMarketPlaceApi("GET", apiName, getMarketPlaceRegionsForCountrySuccess, headers);
}

function registerGuestUserForPurchaseSuccess(responseText) {
    var response = JSON.parse(responseText);
    if (response.error) {
        alert(response.error.errorMessage);
        document.getElementById("proceed_to_pay").disabled = false;
        return;
    }

    newUserUuid = response.user.uuid;
    updateContactUserDetails();
}

function registerGuestUserForPurchase(responseText) {
    var response = JSON.parse(responseText);
    if (response.error) {
        alert(response.error.errorMessage);
        return;
    }
    otpNumber = response.code;
    fullName = document.getElementById("fullname").value.trim();
    var splitNames = fullName.split(" ");
    if (splitNames.length > 1) {
        firstName = splitNames.slice(0, splitNames.length - 1).join(" ");
        lastName = splitNames[splitNames.length - 1];
    } else {
        firstName = fullName;
        lastName = "";
    }
    emailId = document.getElementById("email").value.trim();

    //API
    var apiName = "/user/registerGuestUserForPurchase";
    var json = {
        user: {
            firstName: firstName,
            lastName: lastName,
            userType: "M",
            otp: otpNumber,
            mobileNumber: mobileNumber,
            guestLevelId: null,
            countryCode: countryCode,
        },
    };
    var jsonStr = JSON.stringify(json);
    var headers = {
        "Content-Type": "application/json",
        SupportedApiVersion: "1",
    };
    callBLApi("POST", apiName, registerGuestUserForPurchaseSuccess, headers, jsonStr);
}

function updateContactUserDetailsSuccess(responseText) {
    document.getElementById("proceed_to_pay").disabled = false;

    var response = JSON.parse(responseText);
    if (response.error) {
        alert(response.error.errorMessage);
        return;
    }

    cartInfo.firstName = firstName;
    cartInfo.lastName = lastName;
    cartInfo.emailId = emailId;
    cartInfo.mobileNumber = mobileNumber;

    calculateHashValuesForPG();
}

function updateContactUserDetails() {
    if (natDatesList != null && selectedNatDate == null) {
        document.getElementById("select_nat_date_error").innerHTML = "Please select exam Date";
        return true;
    }
    document.getElementById("select_nat_date_error").innerHTML = "";

    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);

    var utmCampaign = "";
    var utmSource = "";
    var utmMedium = "";
    var utmTerm = "";
    var utmContent = "";


    if (urlParams.has('utm_campaign')) {
        var utmCampaign = urlParams.get('utm_campaign');
    }
    if (urlParams.has('utm_source')) {
        var utmSource = urlParams.get('utm_source');
    }
    if (urlParams.has('utm_medium')) {
        var utmMedium = urlParams.get('utm_medium');
    }
    if (urlParams.has('utm_term')) {
        var utmTerm = urlParams.get('utm_term');
    }
    if (urlParams.has('utm_content')) {
        var utmContent = urlParams.get('utm_content');
    }

    let appstudentid = null;
    if (urlParams.has('appstudentid')) {
        appstudentid = urlParams.get('appstudentid');
    }
    var apiName = "/rest/api/v1/updateUserContactDetails";
    var preferedTestDateId = selectedNatDate != null ? selectedNatDate.id : "";
    var json = {
        params: {
            firstName: firstName,
            lastName: lastName,
            email: emailId,
            mobile: mobileNumber,
            pincode: null,
            addressLine1: null,
            addressLine2: null,
            city: null,
            /*10-08-2023---*/
            state: selectedRegion.state_code,
            //state: '09',
            /*10-08-2023---*/
            roll_number: null,
            uuid: newUserUuid,
            countryCode: countryCode,
            quoteId: cartInfo.cartId,
            preferedExamDate: preferedTestDateId,
            source_url: window.location.href,
            utm_content: utmContent,
            utm_term: utmTerm,
            utm_medium: utmMedium,
            utm_campaign: utmCampaign,
            utm_source: utmSource,

            name: document.getElementById('fullname').value,
            //school_name: document.getElementById('school').value,
            course_code: document.getElementById('select_course').value,
            center_code: document.getElementById('select_center').value,
            test_date: selectedNatDate.testDate,
            state_name: document.getElementById('select_region').value,
            //city_code: document.getElementById('select_city').value,
            //pincode: document.getElementById('pincode').value,
            //gender: document.getElementById('select_gender').value,
            appstudentid: appstudentid,
            //adhar_card: document.getElementById('adhar_card').value,
            exam_type: examType,
            test_type: document.getElementById('select_test_mode').value,
            test_center: document.getElementById('test_center').value
        },
    };
    var jsonStr = JSON.stringify(json);
    var headers = {
        "Content-Type": "application/json",
        SupportedApiVersion: "1",
    };
    callMarketPlaceApi("POST", apiName, updateContactUserDetailsSuccess, headers, jsonStr);
}

function calculateHashValuesSuccess(responseText) {
    document.getElementById("proceed_to_pay").disabled = false;

    var response = JSON.parse(responseText);
    if (response.error) {
        alert(response.error.errorMessage);
        return;
    }
    cartInfo.payableAmount = response.payableAmount;
    cartInfo.pgCharge = response.pgCharges;
    cartInfo.basePgCharges = response.basePgCharges;
    cartInfo.taxDetails = response.taxDetails;

    cartInfo.paymentHash = response.payment_hash;
    cartInfo.key = response.key == undefined || response.key == null || response.key == "" ? $scope.marchantKeyGlobal : response.key;
    cartInfo.txnId = response.txnid;
    cartInfo.enablePg = response.enablePg.toString();
    cartInfo.redirectUrl = response.redirectUrl;

    callWPApi("PUT", "/nat_registrations/" + newUserUuid, nat_registrations_success, {
        "Content-Type": "application/json",
    }, JSON.stringify({
        name: document.getElementById('fullname').value,
        course: document.getElementById('select_course').value,
        center: document.getElementById('select_center').value,
        //city: document.getElementById('select_city').value,
        //pincode: document.getElementById('pincode').value,
        //dob: document.getElementById('dob').value,
        //school_name: document.getElementById('school').value,
    }));
}

/**************surendra 06-10-2023 ***************** */

function nat_registrations_success(responseText) {
    if (cartInfo.enablePg == "true") {
        // payment gateway call
        //startPayment();
        
        var apiName = "/user/sendDataMerito";
        let json = {
            name: document.getElementById('fullname').value,
            course: document.getElementById('select_course').value,
            center: document.getElementById('select_center').value,
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("mobile_input").value.trim(),
            select_test_mode:document.getElementById("select_test_mode").value.trim(),
            exam_test_id : get_exam_test_id(),
            txnid: cartInfo.txnId,
            state:document.getElementById("select_region").value.trim(),
            url:window.location.href,
            source:'nat-national-admission-test.html',
        };
        var jsonStr = JSON.stringify(json);
        var headers = {
            "Content-Type": "application/json",
            SupportedApiVersion: "1",
        };

        callBLApiMerito("POST", apiName, lead_merito_success, headers, jsonStr); 
        //callLaravelApi("POST", "/api/send_data_merito", lead_merito_success, headers, jsonStr);

        
    } else {
        //no need to call Payment gateway
        //redirecting
        window.location = cartInfo.redirectUrl + '&sendadmitcard=1';
    }
}


function lead_merito_success(responseText) {
    
    startPayment();
}

/************** end surendra 06-10-2023 ***************** */

function getPaymentSuccessParams() {
    return 'name=' + encodeURIComponent(document.getElementById('fullname').value) +
        '&course=' + encodeURIComponent(document.getElementById('select_course').value) +
        '&center_code=' + encodeURIComponent(document.getElementById('select_center').value);
}

function calculateHashValuesForPG() {
    var params = {
        cardmode: cartInfo.cartMode,
        cartId: cartInfo.cartId,
        paymentmode: "debitcard",
        placeOrder: true,
        productinfo: cartInfo.productInfo,
        platform: "Web",
        is_shippable: false,
    };

    var apiName = "/rest/api/v1/payment/order/hash";
    var jsonStr = JSON.stringify(params);
    var headers = {
        "Content-Type": "application/json",
        SupportedApiVersion: "1",
    };
    callMarketPlaceApi("POST", apiName, calculateHashValuesSuccess, headers, jsonStr);
}

function createAndAddElementWithTypeNameAndValue(type, name, value, createform) {
    var input = document.createElement("input");
    input.setAttribute("type", type);
    input.setAttribute("name", name);
    input.setAttribute("value", value);
    createform.appendChild(input);
}

function startPayment() {
    var createform = document.createElement("form"); // Create New Element Form
    createform.setAttribute("action", "https://secure.payu.in/_payment"); // Setting Action Attribute on Form
    createform.setAttribute("method", "post"); // Setting Method Attribute on Form
    this.createAndAddElementWithTypeNameAndValue("hidden", "key", cartInfo.key, createform);
    this.createAndAddElementWithTypeNameAndValue("hidden", "amount", cartInfo.payableAmount, createform);
    this.createAndAddElementWithTypeNameAndValue("hidden", "txnid", cartInfo.txnId, createform);
    this.createAndAddElementWithTypeNameAndValue("hidden", "productinfo", cartInfo.productInfo, createform);
    this.createAndAddElementWithTypeNameAndValue("hidden", "firstname", cartInfo.firstName, createform);
    this.createAndAddElementWithTypeNameAndValue("hidden", "phone", cartInfo.mobileNumber, createform);
    this.createAndAddElementWithTypeNameAndValue("hidden", "email", cartInfo.emailId, createform);
    this.createAndAddElementWithTypeNameAndValue("hidden", "surl", SURL + '&' + getPaymentSuccessParams(), createform);
    this.createAndAddElementWithTypeNameAndValue("hidden", "furl", FURL + btoa(window.location.href), createform);
    this.createAndAddElementWithTypeNameAndValue("hidden", "curl", CURL + btoa(window.location.href), createform);
    this.createAndAddElementWithTypeNameAndValue("hidden", "udf1", "", createform);
    this.createAndAddElementWithTypeNameAndValue("hidden", "udf2", "", createform);
    this.createAndAddElementWithTypeNameAndValue("hidden", "udf3", "", createform);
    this.createAndAddElementWithTypeNameAndValue("hidden", "hash", cartInfo.paymentHash, createform);
    document.getElementsByTagName("body")[0].appendChild(createform);
    createform.submit();
}

function toggleMobileVerifyAndStudent() {
    var mobileVerifyDiv = document.getElementById("mobile_verification_div");
    if (mobileVerifyDiv.classList.contains("height-0")) {
        mobileVerifyDiv.classList.remove("height-0");
    } else {
        mobileVerifyDiv.classList.add("height-0");
    }

    var userInfoDiv = document.getElementById("user_and_payment_info");
    if (userInfoDiv.classList.contains("height-0")) {
        userInfoDiv.classList.remove("height-0");
    } else {
        userInfoDiv.classList.add("height-0");
    }
}

function validateFields() {
    mobileNumber = document.getElementById("mobile_input").value.trim();
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

    fullName = document.getElementById("fullname").value.trim();
    if (fullName == undefined || fullName == null || fullName.length == 0) {
        document.getElementById("fullname_error").innerHTML = "Please enter student's full name";
        return true;
    }
    document.getElementById("fullname_error").innerHTML = "";

    /*var dob = document.getElementById("dob").value.trim();
    if (dob == undefined || dob == null || dob.length == 0) {
        document.getElementById("dob_error").innerHTML = "Please select date of birth";
        return true;
    }
    document.getElementById("dob_error").innerHTML = "";

    var adhar_card = document.getElementById('adhar_card').value.trim();
    if (adhar_card && adhar_card.length != 12) {
        document.getElementById("adhar_card_error").innerHTML = "Please enter 12 digit Aadhaar number";
        return true;
    }

    document.getElementById("adhar_card_error").innerHTML = "";

    var gender = document.getElementById('select_gender').value.trim();
    if (gender == undefined || gender == null || gender == 'Select Gender' || gender.length == 0) {
        document.getElementById("select_gender_error").innerHTML = "Please select student's gender";
        return true;
    }
    document.getElementById("select_gender_error").innerHTML = "";

    var school = document.getElementById("school").value.trim();
    if (school == undefined || school == null || school.length == 0) {
        document.getElementById("school_error").innerHTML = "Please enter student's school name";
        return true;
    }
    document.getElementById("school_error").innerHTML = "";*/

    var course = document.getElementById("select_course").value.trim();
    if (course == undefined || course == null || course == 'Select Course' || course.length == 0) {
        document.getElementById("select_course_error").innerHTML = "Please select course";
        return true;
    }
    document.getElementById("select_course_error").innerHTML = "";

    var center = document.getElementById("select_center").value.trim();
    if (center == undefined || center == null || center == 'Preferred Center' || center.length == 0) {
        document.getElementById("select_center_error").innerHTML = "Please select center";
        return true;
    }
    document.getElementById("select_center_error").innerHTML = "";

    emailId = document.getElementById("email").value.trim();
    if (emailId == undefined || emailId == null || emailId.length == 0) {
        document.getElementById("email_error").innerHTML = "Please enter student's email id";
        return true;
    }
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRegex.test(String(emailId).toLowerCase()) == false) {
        document.getElementById("email_error").innerHTML = "Please enter a valid email id";
        return true;
    }
    document.getElementById("email_error").innerHTML = "";

    if (natDatesList != null && selectedNatDate == null) {
        document.getElementById("select_nat_date_error").innerHTML = "Please select exam Date";
        return true;
    }
    document.getElementById("select_nat_date_error").innerHTML = "";

    /*10-08-2023---*/
    const selectedRegionADD = document.getElementById("select_region").value.trim();
    if (selectedRegion == null) {
        document.getElementById("select_region_error").innerHTML = "Please select student's state";
        return true;
    }
    document.getElementById("select_region_error").innerHTML = "";

    /*10-08-2023---*/





    /*var city = document.getElementById("select_city").value.trim();
    if (city == undefined || city == null || city == 'Select City' || city.length == 0) {
        document.getElementById("select_city_error").innerHTML = "Please select student's city";
        return true;
    }
    document.getElementById("select_city_error").innerHTML = "";

    var pincode = document.getElementById("pincode").value.trim();
    if (pincode == undefined || pincode == null || pincode.length == 0) {
        document.getElementById("pincode_error").innerHTML = "Please enter pincode";
        return true;
    } else if (pincode.length < 6) {
        document.getElementById("pincode_error").innerHTML = "Please enter valid pincode";
        return true;
    }
    document.getElementById("pincode_error").innerHTML = "";
*/

    var couponCode = document.getElementById("couponCode").value.trim();
    if (couponCode == undefined || couponCode == null || couponCode.length == 0) {
        couponCodeApplyError("Please enter coupon code");
        return true;
    } else if (!couponAppliedSuccessfullyFlag) {
        couponCodeApplyError("Please enter valid coupon code");
        return true;
    }
    document.getElementById("couponCode_error").innerHTML = "";

    if (examType == 3) {
        var select_test_mode = document.getElementById("select_test_mode").value.trim();
        if (select_test_mode == undefined || select_test_mode == null || select_test_mode.length == 0) {
            document.getElementById("select_test_mode_error").innerHTML = "Please Select Test Mode";
            return true;
        }
        document.getElementById("select_test_mode_error").innerHTML = "";
        if (select_test_mode == "Offline") {
            var test_center = document.getElementById("test_center").value.trim();
            if (test_center == undefined || test_center == null || test_center.length == 0) {
                document.getElementById("test_center_error").innerHTML = "Please Select Offline Test Center";
                return true;
            }
            document.getElementById("test_center_error").innerHTML = "";
        }

    }


    return false;
}

function get_exam_test_id() {
    let natDateChoice = document.getElementById("select_nat_date");
    let selectedIndex = natDateChoice.selectedIndex;
    if (selectedIndex == 0) {
        return false;

    } else {
        selectedNatDate = natDatesList[selectedIndex - 1];
        return selectedNatDate.id;
    }
}

function startNATRegistrationProcess() {
    let validationError = validateFields();
    if (validationError) {
        return;
    }

    //var center = document.getElementById("select_center").value.trim();

    //if (selectedNatDate.testDate == '2022-01-23' && (center == 151 || center == 152 || center == 153) ){

    //if(!confirm("On 23rd Jan for all Patna centers NAT is scheduled in offline mode only. Click ok if you want to proceed in offline mode.\n\nIn case you want online mode kindly select a different date & time.")) return ;
    //}

    var student_name = document.getElementById("fullname").value.trim();

    var student_dob = '';

    var student_email = document.getElementById("email").value.trim();

    var student_phone = document.getElementById("mobile_input").value.trim();

    let exam_test_id = get_exam_test_id();

    let select_center = document.getElementById("select_center").value.trim();
    let select_course = document.getElementById("select_course").value.trim();

    var apiurlPath = "/check_duplicate_nat_registrations?student_name=" + student_name + "&student_dob=" + student_dob + "&student_email=" + student_email + "&student_phone=" + student_phone + "&amount=" + userCartSummery.total_amount + '&exam_test_id=' + exam_test_id + '&select_center=' + select_center + '&select_course=' + select_course + "&exam_type=" + examType;


    callWPApi("GET", apiurlPath, check_duplicate, {}, null);


}



function check_duplicate(responseText) {

    const result = JSON.parse(responseText);

    if (result.status != 200) {

        if (result.status == 400) {
            if (examType == 2) {
                document.getElementById("couponCode").value = `${TEST_TYPE}${result.amount}`;
                applyCoupon();
            } else {
                document.getElementById("couponCode").value = `${TEST_TYPE}${result.amount}`;
                applyCoupon();

                setTimeout(
                    callapifunc(), 15000);
            }


        }



        document.getElementById("duplicate_record_error").innerHTML = result.message;
        //document.getElementById("duplicate_record_error").innerHTML = "Dear student you are already registered for test dated " + result.test_date + ".For further clarification kindly contact support@vidyamandir.com.";
        return false;
    } else {

        document.getElementById("proceed_to_pay").disabled = true;
        var exam_name = "NAT";
        if (examType == 3) {
            exam_name = "VIQ";
        }

        if (examType == 6) {
            exam_name = "VINIT";
        }
        var apiName = "/user/sendMobileVerificationCode/" + mobileNumber + "?countryCode=" + countryCode + "&registerFor=" + exam_name;
        var headers = {
            "Content-Type": "application/json",
            SupportedApiVersion: "1",
        };
        callBLApi("GET", apiName, registerGuestUserForPurchase, headers, null);


    }
}

function callapifunc() {
    document.getElementById("proceed_to_pay").disabled = true;
    var exam_name = "NAT";
    if (examType == 3) {
        exam_name = "VIQ";
    }

    if (examType == 6) {
        exam_name = "VINIT";
    }
    var apiName = "/user/sendMobileVerificationCode/" + mobileNumber + "?countryCode=" + countryCode + "&registerFor=" + exam_name;
    var headers = {
        "Content-Type": "application/json",
        SupportedApiVersion: "1",
    };
    callBLApi("GET", apiName, registerGuestUserForPurchase, headers, null);
}

function registerNowPressed() {
    $(window).scrollTop($("#registration_div").offset().top - 200);
    document.getElementById("mobile_input").focus();
    document.getElementById("mobile_input").select();
}

function updateCoursesOptions(courseListJSON) {
    var courseListArr = JSON.parse(courseListJSON);
    console.log(courseListArr);
    var elCourses = document.getElementById("select_course");
    /** Added By Ajay  2022-06-28*/
    elCourses.innerHTML = "";
    var option = document.createElement("option");
    option.value = "";
    option.disabled = true;
    option.text = "Select Course *";
    elCourses.add(option);
    /**END*/
    for (i = 0; i < courseListArr.length; i++) {
        var course = courseListArr[i];
        var option = document.createElement("option");
        option.value = course.code;
        option.text = course.value;
        elCourses.add(option);
    }

    elCourses.selectedIndex = 0;
}

function updateCentersOptions(centerListJSON) {
    var centerListArr = JSON.parse(centerListJSON);
    console.log(centerListArr);
    var elCenter = document.getElementById("select_center");
    /** Added By Ajay  2022-06-28*/
    elCenter.innerHTML = "";
    var option = document.createElement("option");
    option.value = "";
    option.disabled = true;
    option.text = "Select Study Center *";
    elCenter.add(option);
    /**END*/
    for (i = 0; i < centerListArr.length; i++) {
        var center = centerListArr[i];
        var option = document.createElement("option");
        option.value = center.code;
        if (center.code == '158' ) {
            option.text = center.value;
            elCenter.add(option);
        }
    }

    elCenter.selectedIndex = 0;
}


stateListArr = null;

function updateStatesOptions(stateListJSON) {
    stateListArr = JSON.parse(stateListJSON);
    console.log(stateListArr);
    var elState = document.getElementById("select_region");
    for (i = 0; i < stateListArr.length; i++) {
        var course = stateListArr[i];
        var option = document.createElement("option");
        option.value = course.code;
        option.text = course.value;
        elState.add(option);
    }

    elState.selectedIndex = 0;
}
var cityListArr = null;

function updateCitiesOptions(cityListJSON) {
    cityListArr = JSON.parse(cityListJSON);
    var elCity = document.getElementById("select_city");

    for (o = elCity.options.length - 1; i >= 1; i--) {
        elCity.remove(i);
    }

    console.log(selectedRegion);
    for (i = 0; i < cityListArr.length; i++) {
        var course = cityListArr[i];
        var option = document.createElement("option");
        option.value = course.code;
        option.text = course.value;
        elCity.add(option);
    }

    elCity.selectedIndex = 0;
}

(function() {
    //callWPApi("GET", "/courses", updateCoursesOptions, {}, null);
    //callWPApi("GET", "/centers", updateCentersOptions, {}, null);
}());