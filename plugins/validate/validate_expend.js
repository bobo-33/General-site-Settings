
$(function(){
jQuery.validator.addMethod("phone", function(value, element) {
	var length = value.length;
	var regPhone = /^1[345789]\d{9}$/;
    return this.optional(element) || ( length == 11 && regPhone.test( value ) );  
}, "手机号码格式不正确");

jQuery.validator.addMethod("suUsername", function(value, element) {
	//用户名正则，4到16位（字母，数字，下划线，减号）
	var regUsername = /^[a-zA-Z0-9_-]{4,16}$/;
	return this.optional(element) || ( regUsername.test( value ) );  
}, "用户名格式不正确(4到16位（字母，数字，下划线，减号)");

jQuery.validator.addMethod("suPassword", function(value, element) {
	//密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
	var regPassword = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/;
	return this.optional(element) || ( regPassword.test( value ) );  
}, "密码格式不正确(最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符)");







});

