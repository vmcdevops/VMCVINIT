
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


var productInfo = null;
var mobileNumber = '';
var otpNumber = '';

var fullName = '';
var firstName = '';
var lastName = '';
var email = '';
var selectedRegion = null;
var regionList = [];
var countryCode = 'IN';
var countryMobileCode = '+91';

var productIdGlobal = "11920";
var couponCodeGlobal = "VMCNAT49";
var marchantKeyGlobal = "qoCStF";

var userInfo = { firstName: '', lastName: '', userType: '', otp: '', mobileNumber: '', guestLevelId: null, countryCode: countryCode };
var cartInfo = { cartType: null, cartMode: null, item_id: '', name: '', price: '', product_type: '', qty: '', quote_id: '', cartId: '', sku: '', productInfo: "books store", enablePg: "true" };
var userCartSummery = null;
var newUserUuid = '';

let STG_MARKETPLACE_API = "https://stgvmcmarketplace.fliplearn.com";
let STG_BL_API = "https://stgvmcbl.fliplearn.com";

let LIVE_MARKETPLACE_API = "https://marketplace.vidyamandir.com";
let LIVE_BL_API = "https://bl.vidyamandir.com";

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
    if(requestInProcessing <= 0) {
        return;
    }
    document.getElementById("processing_overlay").hidden = false;
}

function hideLoader() {
    if(requestInProcessing > 0) {
        return;
    }
    document.getElementById("processing_overlay").hidden = true;
}

function callApiForValues(requestType, apiUrl, callback, headers, payload = null) {
    requestInProcessing++;
    showLoader();
    let xhttp = new XMLHttpRequest();
    xhttp.open(requestType, apiUrl, true);
    xhttp.onreadystatechange = function () {        
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
    for(let key in headers){
        xhttp.setRequestHeader(key, headers[key]) 
    }
    xhttp.send(payload);
}

function callMarketPlaceApi(requestType, apiName, callback, headers, payload = null) {
    var url = LIVE_MARKETPLACE_API + apiName;
    callApiForValues(requestType, url, callback, headers, payload);
}

function callBLApi(requestType, apiName, callback, headers, payload = null) {
    var url = LIVE_BL_API + apiName;
    callApiForValues(requestType, url, callback, headers, payload);
}

function pageLoaded() {
    //mobile_country_code
    document.getElementById("mobile_country_code").innerHTML = countryMobileCode + '-' + countryCode + ' : ';

    //get products
    fetchProductInfo();

    //get regions
    getMarketPlaceRegionsForCountry();
}

function pageLoaded2() {
    //mobile_country_code
    document.getElementById("mobile_country_code").innerHTML = countryMobileCode + '-' + countryCode + ' : ';

    //get products
    fetchProductInfo();

    //get regions
    getMarketPlaceRegionsForCountry();

    
}

/* Fetch Products */
var fetchProductInfo = function () {
    var apiName = '/rest/api/v2/getProductList?start=0&end=20&cat=61&classLevelId=undefined&productId=' + productIdGlobal;
    var headers = {'Content-Type':'application/json','SupportedApiVersion':'1'};
    callMarketPlaceApi('GET', apiName, fetchProductInfoSuccess, headers);
}

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
    var apiName = '/rest/api/v2/cart/addToCart';
    var json = { items: [{ id: productInfo.id, skuCode: productInfo.sku, configurable_item_options: productInfo.configurable_item_options, couponCode: couponCodeGlobal, uuid: null, quote_id: "", count: 1, schoolName: "" }] };
    var jsonStr = JSON.stringify(json);
    var headers = {'Content-Type':'application/json','SupportedApiVersion':'1'};
    callMarketPlaceApi('POST', apiName, addToCartSuccess, headers, jsonStr);
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

    //show info view
    // toggleMobileVerifyAndStudent();

    //update coupon code in UI
    updateCouponCodeInUI();

    //couponCode applied successfully
    if(couponCodeGlobal == undefined || couponCodeGlobal == null || couponCodeGlobal.length == 0) {
        couponCodeRemoved();
    }else{
        couponCodeAppliedSuccessfully();
    }

    //get cart
    getCart(cartInfo.cartId);
}

function updateUIAsPerCartInfo() {
    var htmlInfo = '';
    let isDiscount = (userCartSummery.list[0].discount != undefined && userCartSummery.list[0].discount != null) ? true : false;
    console.log(parseInt(userCartSummery.total_amount));
    if(isDiscount) {
        htmlInfo = '<span style="font-size: 22px; text-decoration: line-through; text-decoration-color: red;">&#8377 500</span><span style="font-size: 22px; margin-left: 20px;">&#8377 '+ parseInt(userCartSummery.total_amount) +' Only</span>';
    } else {
        htmlInfo = '<span style="font-size: 22px; margin-left: 20px;">&#8377 '+ parseInt(userCartSummery.total_amount) +' Only</span>';
    }
    document.getElementById("registration_fee").innerHTML = htmlInfo;
}


function getCart(cartId) {
    var apiName = '/rest/api/v1/cart/getCart/0?quote_id=' + cartId;
    var headers = {'Content-Type':'application/json','SupportedApiVersion':'1'};
    callMarketPlaceApi('GET', apiName, getCartSuccess, headers);
}
function getCartSuccess(responseText) {
    var response = JSON.parse(responseText);
    if (response.error) {
        alert(response.error.errorMessage);
        return;
    }

    userCartSummery = response.data;
    updateUIAsPerCartInfo();
    //applyCouponWithCouponCode(couponCodeGlobal);
}



/* Apply - Remove Coupon */

function couponCodeAppliedSuccessfully() {
    let htmlInfo = '<img id="couponcode_status_img" src="./assets/images/coupon_apply_success.png"/><span id="couponcode_status_msg" style="margin-left:10px">Coupon code applied successfully.</span>';
    document.getElementById("couponcode_status").innerHTML = htmlInfo;
}

function couponCodeApplyError(errorMessage) {
    let htmlInfo = '<img id="couponcode_status_img" src="./assets/images/coupon_apply_error.png"/><span id="couponcode_status_msg" style="margin-left:10px">'+errorMessage+'</span>';
    document.getElementById("couponcode_status").innerHTML = htmlInfo;
}

function couponCodeRemoved() {
    document.getElementById("couponcode_status").innerHTML = '';
}

function updateCouponCodeInUI() {
    document.getElementById("couponCode").value = couponCodeGlobal;
    if(couponCodeGlobal == undefined || couponCodeGlobal == null || couponCodeGlobal.length == 0) {
        document.getElementById("couponCode").disabled = false;
        document.getElementById("couponCode").focus();
        document.getElementById("couponCode").select();
        document.getElementById("btn_apply_coupon").hidden = false;
        document.getElementById("btn_remove_coupon").hidden = true;
        document.getElementById("coupon_code_val").hidden = false;
    } else {
        document.getElementById("couponCode").disabled = true;
        document.getElementById("btn_apply_coupon").hidden = true;
        document.getElementById("btn_remove_coupon").hidden = false;
        document.getElementById("coupon_code_val").hidden = true;       
    }
}

function applyCouponSuccess(responseText) {
    var response = JSON.parse(responseText);
    if (response.response.error) {
        let errorMessage = response.response.error.errorMessage;
        couponCodeApplyError(errorMessage);
        return;
    }

    couponCodeAppliedSuccessfully();
    updateCouponCodeInUI();
    getCart(cartInfo.cartId);
}

function applyCouponWithCouponCode(couponCode) {
    var apiName = '/rest/api/v2/applyCouponCode';
    var json = {
        quote_id: userCartSummery.cart_id,
        coupon_code: couponCodeGlobal,
        sku: userCartSummery.list[0].parentSku,
        product_id: userCartSummery.list[0].child_product_id ? userCartSummery.list[0].child_product_id : userCartSummery.list[0].product_id
    };

    var jsonStr = JSON.stringify(json);
    var headers = {'Content-Type':'application/json','SupportedApiVersion':'1'};

    callMarketPlaceApi('POST', apiName, applyCouponSuccess, headers, jsonStr);
}

function applyCoupon() {
    couponCodeGlobal = document.getElementById("couponCode").value.trim();
    if(couponCodeGlobal == undefined || couponCodeGlobal == null || couponCodeGlobal.length == 0) {
        document.getElementById("couponCode_error").innerHTML = "Please enter a coupon code first";
        return;
    }

    document.getElementById("couponCode_error").innerHTML = "";
    applyCouponWithCouponCode(couponCodeGlobal);
}

function removeCoupon() {    
    var apiName = '/rest/api/v2/removeCouponCode?quote_id=' + userCartSummery.cart_id;
    var json = {};
    var jsonStr = JSON.stringify(json);
    var headers = {'Content-Type':'application/json','SupportedApiVersion':'1'};
    callMarketPlaceApi('POST', apiName, removeCouponSuccess, headers, jsonStr);
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
    var apiName = '/getMobileValidationRules';
    var headers = {'Content-Type':'application/json','SupportedApiVersion':'1'};
    callBLApi('GET', apiName, getMobileValidationRulesSuccess, headers, null);
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
    if(mobileNumber == undefined || mobileNumber == null || mobileNumber.length == 0) {
        document.getElementById("mobile_number_error").innerHTML = "Please enter student's mobile number";
        return;
    }
    var mobileRegex = /^[6-9][0-9]{9}$/;
    if(mobileRegex.test(String(mobileNumber).toLowerCase()) == false) {
        document.getElementById("mobile_number_error").innerHTML = "Please enter a valid mobile number";
        return true;        
    }

    document.getElementById("mobile_number_error").innerHTML = "";
    document.getElementById("mobile_number_otp_error").innerHTML = "";


    var apiName = '/user/sendMobileVerificationCode/'+mobileNumber+'?countryCode=' + countryCode;
    var headers = {'Content-Type':'application/json','SupportedApiVersion':'1'};
    callBLApi('GET', apiName, sendMobileVerificationCodeSuccess, headers, null);
}

function sendMobileVerificationCodeSuccess(responseText) {
    var response = JSON.parse(responseText);
    if (response.error) {
        alert(response.error.errorMessage);
        return;
    }
    if(response.code){
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
    if(otpNumber == undefined || otpNumber == null || otpNumber.length == 0) {
        document.getElementById("mobile_number_otp_error").innerHTML = "Please enter OTP sent on student's mobile number";
        return;
    }

    document.getElementById("mobile_number_error").innerHTML = "";
    document.getElementById("mobile_number_otp_error").innerHTML = "";

    var apiName = '/user/isCodeValidForUser';
    var json = { "mobileNo": mobileNumber, "verifyCode": otpNumber, "verifyFor": "Mobile", "countryCode": countryCode };
    var jsonStr = JSON.stringify(json);
    var headers = {'Content-Type':'application/json','SupportedApiVersion':'1'};
    callBLApi('POST', apiName, verifyOTPSuccess, headers, jsonStr);
}

/* User data */

function regionOptionSelected() {
    var regionChoice = document.getElementById("select_region");
    var selectedIndex = regionChoice.selectedIndex;
    if(selectedIndex == 0) {
        selectedRegion = null;
    } else {
        selectedRegion = regionList[selectedIndex];    
    }
}

function prepareRegionOptionsSelection(regionList) {
    var regionChoice = document.getElementById("select_region");

    var optionDefault = document.createElement("option");
    optionDefault.text = "Select State";
    regionChoice.add(optionDefault)

    for (i = 0; i < regionList.length; i++) {
        var region = regionList[i];
        var option = document.createElement("option");
        option.text = region.name;
        regionChoice.add(option)
    }
}

function getMarketPlaceRegionsForCountrySuccess(responseText) {
    var response = JSON.parse(responseText);
    if (response.error) {
        alert(response.error.errorMessage);
        return;
    }

    regionList = response.available_regions;
    if(regionList == undefined || regionList.length == null || regionList.length == 0) {
        alert("States can't be fetched for India. Please try again.");
        return;
    }

    prepareRegionOptionsSelection(response.available_regions);
}

function getMarketPlaceRegionsForCountry() {
    var apiName = '/rest/V1/directory/countries/'+countryCode;
    var headers = {'Content-Type':'application/json','SupportedApiVersion':'1'};
    callMarketPlaceApi('GET', apiName, getMarketPlaceRegionsForCountrySuccess, headers);
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
    console.log(otpNumber);
    fullName = document.getElementById("fullname").value.trim();
    var splitNames = fullName.split(" ");
    if(splitNames.length > 1) {
        firstName = splitNames.slice(0, splitNames.length - 1).join(" ");
        lastName = splitNames[splitNames.length - 1];
    } else {
        firstName = fullName;
        lastName = '';
    }
    emailId = document.getElementById("email").value.trim();

    //API
    var apiName = '/user/registerGuestUserForPurchase';
    var json = { "user": { "firstName": firstName, "lastName": lastName, "userType": "M", "otp": otpNumber, "mobileNumber": mobileNumber, "guestLevelId": null, "countryCode": countryCode } };
    console.log(json);
    var jsonStr = JSON.stringify(json);
    var headers = {'Content-Type':'application/json','SupportedApiVersion':'1'};
    callBLApi('POST', apiName, registerGuestUserForPurchaseSuccess, headers, jsonStr);
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
    if(selectedRegion == null) {
        document.getElementById("select_region_error").innerHTML = "Please enter a valid mobile number";
        return;
    }

    document.getElementById("select_region_error").innerHTML = "";

    var apiName = '/rest/api/v1/updateUserContactDetails';
    var json = { "params": { "firstName": firstName, "lastName": lastName, "email": emailId, "mobile": mobileNumber, "pincode": null, "addressLine1": null, "addressLine2": null, "city": null, "state": selectedRegion.name, "roll_number": null, "uuid": newUserUuid, "countryCode": countryCode, "quoteId": cartInfo.cartId } };
    var jsonStr = JSON.stringify(json);
    var headers = {'Content-Type':'application/json','SupportedApiVersion':'1'};
    callMarketPlaceApi('POST', apiName, updateContactUserDetailsSuccess, headers, jsonStr);
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
    cartInfo.key = (response.key == undefined || response.key == null || response.key == "") ? $scope.marchantKeyGlobal : response.key;
    cartInfo.txnId = response.txnid;
    cartInfo.enablePg = response.enablePg.toString();

    // payment gateway call
    startPayment();
}

function calculateHashValuesForPG() {
    var params = {
        cardmode: cartInfo.cartMode,
        cartId: cartInfo.cartId,
        paymentmode: 'debitcard',
        placeOrder: true,
        productinfo: cartInfo.productInfo,
        platform: "Web",
        is_shippable: false
    };

    var apiName = '/rest/api/v1/payment/order/hash';
    var jsonStr = JSON.stringify(params);
    var headers = {'Content-Type':'application/json','SupportedApiVersion':'1'};
    callMarketPlaceApi('POST', apiName, calculateHashValuesSuccess, headers, jsonStr);
}

function createAndAddElementWithTypeNameAndValue(type, name, value, createform) {
    var input = document.createElement("input");
    input.setAttribute("type", type);
    input.setAttribute("name", name);
    input.setAttribute("value", value);
    createform.appendChild(input);
}

function startPayment() {
    var createform = document.createElement('form'); // Create New Element Form
    createform.setAttribute("action", "https://secure.payu.in/_payment"); // Setting Action Attribute on Form
    createform.setAttribute("method", "post"); // Setting Method Attribute on Form
    this.createAndAddElementWithTypeNameAndValue('hidden', 'key', cartInfo.key, createform);
    this.createAndAddElementWithTypeNameAndValue('hidden', 'amount', cartInfo.payableAmount, createform);
    this.createAndAddElementWithTypeNameAndValue('hidden', 'txnid', cartInfo.txnId, createform);
    this.createAndAddElementWithTypeNameAndValue('hidden', 'productinfo', cartInfo.productInfo, createform);
    this.createAndAddElementWithTypeNameAndValue('hidden', 'firstname', cartInfo.firstName, createform);
    this.createAndAddElementWithTypeNameAndValue('hidden', 'phone', cartInfo.mobileNumber, createform);
    this.createAndAddElementWithTypeNameAndValue('hidden', 'email', cartInfo.emailId, createform);
    this.createAndAddElementWithTypeNameAndValue('hidden', 'surl', 'https://marketplace.vidyamandir.com/api/status/success?source=web', createform);
    this.createAndAddElementWithTypeNameAndValue('hidden', 'furl', 'https://marketplace.vidyamandir.com/api/status/failure?source=web&cb=' + btoa(window.location.href), createform);
    this.createAndAddElementWithTypeNameAndValue('hidden', 'curl', 'https://marketplace.vidyamandir.com/api/status/cancel?source=web&cb=' + btoa(window.location.href), createform);
    this.createAndAddElementWithTypeNameAndValue('hidden', 'udf1', '', createform);
    this.createAndAddElementWithTypeNameAndValue('hidden', 'udf2', '', createform);
    this.createAndAddElementWithTypeNameAndValue('hidden', 'udf3', '', createform);
    this.createAndAddElementWithTypeNameAndValue('hidden', 'hash', cartInfo.paymentHash, createform);
    document.getElementsByTagName('body')[0].appendChild(createform);
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
    if(mobileNumber == undefined || mobileNumber == null || mobileNumber.length == 0) {
        document.getElementById("mobile_error").innerHTML = "Please enter Student's Phone Number";
        return true;
    }
    var mobileRegex = /^[6-9][0-9]{9}$/;
    if(mobileRegex.test(String(mobileNumber).toLowerCase()) === false) {
        document.getElementById("mobile_error").innerHTML = "Please enter a valid 10-digit mobile number";
        return true;        
    }
    document.getElementById("mobile_error").innerHTML = "";

    fullName = document.getElementById("fullname").value.trim();
    if(fullName == undefined || fullName == null || fullName.length == 0) {
        document.getElementById("fullname_error").innerHTML = "Please enter student's full name";
        return true;
    }
    document.getElementById("fullname_error").innerHTML = "";

    emailId = document.getElementById("email").value.trim();
    if(emailId == undefined || emailId == null || emailId.length == 0) {
        document.getElementById("email_error").innerHTML = "Please enter student's email id";
        return true;
    }
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(emailRegex.test(String(emailId).toLowerCase()) == false) {
        document.getElementById("email_error").innerHTML = "Please enter a valid email id";
        return true;        
    }
    document.getElementById("email_error").innerHTML = "";

    if(selectedRegion == null) {
        document.getElementById("select_region_error").innerHTML = "Please select student's state";
        return true;
    }
    document.getElementById("select_region_error").innerHTML = "";

    return false;
}

function startNATRegistrationProcess() {
    let validationError = validateFields();
    if(validationError) {
        return;
    }

    document.getElementById("proceed_to_pay").disabled = true;

    var apiName = '/user/sendMobileVerificationCode/'+mobileNumber+'?countryCode=' + countryCode;
    var headers = {'Content-Type':'application/json','SupportedApiVersion':'1'};
    callBLApi('GET', apiName, registerGuestUserForPurchase, headers, null);
}



function registerNowPressed() {
    $(window).scrollTop($("#registration_div").offset().top - 200);
    document.getElementById("mobile_input").focus();
    document.getElementById("mobile_input").select();
}


/*
<form name='pg' id="pg-place-order" action="getActionURL()" method='post' style="display:none"
ng-if="cart.enablePg == 'true'">
<input type='{{fieldType}}' name='key' value='{{cart.key}}'>
<input type='{{fieldType}}' name='amount' value='{{cart.payableAmount}}'>
<input type='{{fieldType}}' name='txnid' value='{{cart.txnId}}'>
<input type='{{fieldType}}' name='productInfo' value='{{cart.productInfo}}'>
<input type='{{fieldType}}' name='firstname' value='{{user.firstName}}'>
<input type='{{fieldType}}' name='phone' value='{{user.mobileNumber}}'>
<!--<input type='{{fieldType}}' name='enforce_paymethod' value='{{cart.cartType}}'>-->
<input type='{{fieldType}}' name='email' value='{{user.emailId}}'>
<input type='{{fieldType}}' name='surl' value='{{MERCHANT_SURL}}'>
<input type='{{fieldType}}' name='furl' value='{{MERCHANT_FURL}}'>
<input type='{{fieldType}}' name='curl' value='{{MERCHANT_CURL}}'>
<input type='{{fieldType}}' name='udf1' value=''>
<input type='{{fieldType}}' name='udf2' value=''>
<input type='{{fieldType}}' name='udf3' value=''>
<input type='{{fieldType}}' name='hash' value='{{cart.paymentHash}}'>
</form>
*/

// Reference
// https://iacst.aakash.ac.in/iacstexam?utm_source=Website_Banner&utm_medium=Organic&utm_campaign=Website_Banner_iACST

