$.fn.bootstrapValidate.extendRules({
    "cardid": function(){
        return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.val());
    },
    "bankcard": function(){

    }
});