/**
 * Author: XieJing
 * Date:    2013-07-10
 * Time:   18:06
 * E-mail:  xiejingcloudy@gmail.com
 * Description:
 */
(function ($) {
    $.fn.ajaxbutton = function (options, param) {
        if (typeof options == 'string') {
            if($.fn.ajaxbutton.methods.hasOwnProperty(options)){
                return $.fn.ajaxbutton.methods[options](this,param);
            }else{
                return $.fn.ajaxbutton.methods[options](this, param);

            }
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'linkbutton');
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, 'linkbutton', {
                    options: $.extend({}, $.fn.ajaxbutton.defaults, $.fn.ajaxbutton.parseOptions(this), options)
                });
                $(this).removeAttr('disabled');
                $(this).unbind();
                $(this).one("click", clickhandle);
            }

            $(this).linkbutton(options, param);

        });
    };
    function clickhandle() {
        $(this).ajaxbutton("disable");
        var opt = $(this).linkbutton("options");
        if (opt && opt.clickHandle && typeof opt.clickHandle === "function") {
            opt.clickHandle.call(this);
        }

    };
    $.fn.ajaxbutton.methods = {
        "disable": function (jq, param) {
            jq.each(function () {
                var _opt = $(this).linkbutton('options');
                if (!_opt.disabled) {
                    $.fn.linkbutton.methods["disable"]($(this), param);
                    $(this).ajaxbutton({disabled: true, iconCls: 'icon-loading', oldicon: _opt.iconCls});
                }
            })


        },
        "enable": function (jq, param) {
            jq.each(function () {
                var _opt = $(this).linkbutton('options');
                if (_opt.disabled) {
                    $.fn.linkbutton.methods["enable"]($(this), param);
                    $(this).one("click", clickhandle);
                    $(this).ajaxbutton({disabled: false, iconCls: _opt.oldicon});
                }
            });


        }
    }

    $.fn.ajaxbutton.parseOptions = function (target) {
        return $.fn.linkbutton.parseOptions(target);

    };
    $.fn.ajaxbutton.defaults = $.extend({}, $.fn.linkbutton.defaults, {clickHandle: null, disabled: false});

})(jQuery)