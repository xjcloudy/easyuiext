/**
 * Author: XieJing
 * Date:    2013-07-10
 * Time:   18:06
 * E-mail:  xiejingcloudy@gmail.com
 * Description:
 */
(function ($) {
    $.fn.ajaxbutton=function(options,param){
        if (typeof options == 'string'){

            return $.fn.ajaxbutton.methods[options](this, param);
        }
        options = options || {};
        return this.each(function(){
            var state = $.data(this, 'linkbutton');
            if (state){
                $.extend(state.options, options);
            } else {
                $.data(this, 'linkbutton', {
                    options: $.extend({}, $.fn.ajaxbutton.defaults, $.fn.ajaxbutton.parseOptions(this), options)
                });
                $(this).removeAttr('disabled');
            }
            $(this).linkbutton(options,param);
            $(this).one("click",clickhandle);

        });
    };
    function clickhandle(evt){
        $(this).linkbutton("disable");
          console.log("c")
//        $(this).unbind();
//        evt.stopImmediatePropagation();
    };
    $.fn.ajaxbutton.methods={
        "enable":function(jq,param){

            $.fn.linkbutton.methods["enable"](jq, param);
            $(jq).on("click",clickhandle);
//            jq.click();




        }


    };
    $.fn.ajaxbutton.parseOptions=function(target){
        return $.fn.linkbutton.parseOptions(target);

    };
    $.fn.ajaxbutton.defaults= $.extend({},$.fn.linkbutton.defaults);

})(jQuery)