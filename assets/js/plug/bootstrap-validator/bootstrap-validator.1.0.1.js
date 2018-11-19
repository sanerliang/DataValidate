(function(global,factory,plug){
    factory.call(global, global.jQuery, plug);
}(typeof window === 'undefined' ? this: window, function($, plug){
    // 默认配置
    var __I18N__ = {
        "en": {
            "notForm": "is not form element",
            "errorMsg": "* valid fail"
        },
        "zh": {
            "notForm": "目标元素非表单元素",
            "errorMsg": "* 您输入的内容不合法"
        }
    }

    var __DEFS__ = {
        raise: "change", // 默认事件
        pix: "bv-", // 前缀
        i18n: "en",
        errorMsg: null, // 默认的错误提示信息
        lang: "zh",
    };
    // 默认规则引擎
    var __RULES__ = {
        "require": function(){
            return (this.val() && this.val()!=="");
        },
        "number": function(){
            return (this.val()!=="" && !isNaN(this.val()))
        },
        "integer": function(){
            return true;
        },
        "email": function(){
            return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(this.val());
        },
        "length": function(){
            return this.val().length === Number(this.data(__DEFS__.pix + "length"));
        },
        "regex": function(){
            return new RegExp(this.data(__DEFS__.pix + "regex")).test(this.val());
        }
        // ...
    };

    // 真正被创建的闭包，并且只执行一次的内存结构
    $.fn[plug] = function(ops){
        this.getMessage = $.fn[plug].getMessage;
        var that = $.extend(this, __DEFS__, ops); // 先扩展默认值，再用用户配置覆盖默认值。
        if (this.is("form")) {
            var $fields = this.find("input,textarea,select").not("[type=submit],[type=button],[type=reset]"); //目标表单元素
            $fields.on(this.raise, function(){
                var $field = $(this); // 当前被校验的元素
                var $group = $field.parents(".form-group:first"); //找到它所在的group元素
                $group.removeClass("has-error has-success");
                $group.find(".help-block").remove();
                // 当前校验元素到底配置哪些
                $.each(__RULES__, function(rule, active){
                    if ($field.data(that.pix + rule)) {
                        var result = active.call($field);
                        if (!result) {
                            var msg = $field.data(that.pix + rule + "-message") || that.getMessage(that.lang, "errorMsg");
                            $group.addClass("has-error");
                            $field.after("<span class=\"help-block\">" + msg + "</span>")
                            return false;
                        } else {
                            // 代表成功
                            $group.addClass("has-success");
                        }
                    }
                })
            });
            this.extendRules = $.fn[plug].extendRules;
            return this;
        } else {
            throw new Error(that.getMessage(that.lang, "notForm"));
        }
    }
    $.fn[plug].extendRules = function(rules) {
        $.extend(__RULES__, rules);
    }
    //zh en
    $.fn[plug].addLocal = function(lang,data){
        __I18N__[lang] = data;
    }
    $.fn[plug].getMessage = function(lang,key){
        try{
            return __I18N__[lang][key];
        }
        catch{
            return __I18N__["en"][key];
        }
    }
},"bootstrapValidate"));