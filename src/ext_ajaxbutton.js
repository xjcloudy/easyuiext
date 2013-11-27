/**
 * Author: XieJing
 * Date:    2013-07-10
 * Time:   18:06
 * E-mail:  xiejingcloudy@gmail.com
 * Description:
 * ajaxbutton 用于有后台操作动作的按钮，可以起到防止重复操作的作用。
 * 点击时自动 disable,需要在事件完成时手动enable。
 * 支持html中声明onclick事件，也可以通过设置clickhandle属性来传递事件响应函数。
 * 其他途径注册的事件会在初始化时自动被unbind掉。
 */
(function ($) {
    //注册组件
    "use strict";
    if ($.inArray('ajaxbutton', $.parser.plugins) === -1) {
        $.parser.plugins.push('ajaxbutton');
    } else {
        return;
    }
    $.fn.ajaxbutton = function (options, param) {
        if (typeof options === 'string') {
            if ($.fn.ajaxbutton.methods.hasOwnProperty(options)) {
                return $.fn.ajaxbutton.methods[options](this, param);
            } else {
                return $.fn.linkbutton.methods[options](this, param);

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
                this.dom_click_handle = $(this)[0].onclick;
                $(this)[0].onclick = null;
                $(this).one("click", clickhandle);
            }

            $(this).linkbutton(options, param);

        });
    };
    function clickhandle() {
        $(this).ajaxbutton("disable");
        var opt = $(this).linkbutton("options");
        if (opt && opt.clickHandle && typeof opt.clickHandle === "function") {
            opt.clickHandle(this);
        } else if (this.dom_click_handle) {
            this.dom_click_handle(this);
        }


    }

    $.fn.ajaxbutton.methods = {
        "disable": function (jq, param) {
            jq.each(function () {
                var _opt = $(this).linkbutton('options');
                if (!_opt.disabled) {
                    $.fn.linkbutton.methods.disable($(this), param);
                    $(this).ajaxbutton({disabled: true, iconCls: 'icon-loading', oldicon: _opt.iconCls});
                }
            });


        },
        "enable": function (jq, param) {
            jq.each(function () {
                var _opt = $(this).linkbutton('options');
                if (_opt.disabled) {
                    $.fn.linkbutton.methods.enable($(this), param);
                    $(this).one("click", clickhandle);
                    $(this).ajaxbutton({disabled: false, iconCls: _opt.oldicon});
                }
            });


        }
    };

    $.fn.ajaxbutton.parseOptions = function (target) {
        return $.fn.linkbutton.parseOptions(target);

    };
    $.fn.ajaxbutton.defaults = $.extend({}, $.fn.linkbutton.defaults, {clickHandle: null, disabled: false});

})(jQuery)