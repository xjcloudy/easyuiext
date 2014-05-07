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
                var opt = $(this).linkbutton('options');
                if (!opt.disabled) {
                    $.fn.linkbutton.methods.disable($(this), param);
                    $(this).ajaxbutton({disabled: true, iconCls: 'icon-loading', oldicon: opt.iconCls});
                }
            });


        },
        "enable": function (jq, param) {
            jq.each(function () {
                var opt = $(this).linkbutton('options');
                if (opt.disabled) {
                    $.fn.linkbutton.methods.enable($(this), param);
                    $(this).one("click", clickhandle);
                    $(this).ajaxbutton({disabled: false, iconCls: opt.oldicon});
                }
            });


        }
    };

    $.fn.ajaxbutton.parseOptions = function (target) {
        return $.fn.linkbutton.parseOptions(target);


    };

    $.fn.ajaxbutton.defaults = $.extend({}, $.fn.linkbutton.defaults, {clickHandle: null, disabled: false});

})(jQuery);
/**
 * Author: XieJing
 * Date:    2013-05-13
 * Time:   11:32
 * E-mail:  xiejingcloudy@gmail.com
 * Description: dialog全局管理工具,封装了easyui dialog。
 * 1：分离窗口的调用方和提供方。
 * 2：实现窗口通信的功能。
 * 3：窗口实例的按需创建，解决easyui dialog的dom爆炸问题。
 * dependence:uuid.js
 */
;
(function ($) {
    if (parent != window && parent.jQuery && parent.jQuery.DM) {
        $.DM = parent.jQuery.DM;
        return;
    }
    var TEMP = "<div class='easyui-dialog j_dialog'></div>";
    var CACHE = [];
    var ACTIVE_STACK = [];
    /**
     * 默认属性。
     * @type {{close: boolean, width: string|number, height:string|number, modal: boolean, href: string, content: string}}
     */
    var DEFAULT = {
        close: true,
        width: 'auto',
        height: 'auto',
        modal: true,
        href: "",
        content: ""

    };
    function _create() {
        var t = $(TEMP);
        var uid = Math.uuidFast();
        t.attr("id", uid);
        CACHE.push(t);
        $('body').append(t);
        t._extid = uid;
        return t;
    }

    function _onCloseHandler() {
        var p = ACTIVE_STACK.pop();
        if (p) {
            CACHE.push(p);
            $(p).unbind();
        }
    }

    function _getdialog() {
        var _d;
        if (CACHE.length == 0) {
            _d = _create();
        }
        _d = CACHE.pop();
        return _d;
    }

    function _parserEvent(opt, target) {
        if (opt && opt.customEvent && (typeof opt.customEvent == "object")) {
            for (var eve in opt.customEvent) {
                $(target).bind(eve, opt.customEvent[eve]);
            }
        }
    }

    function mergeOptions(opt) {
        if (opt.href) {
            opt.href = opt.href + "?_r" + Math.random();
        }
        return $.extend($.extend({}, DEFAULT, opt), FREEZE_ATTRS);
    }

    /**
     * 无法覆盖的属性。屏蔽掉一定的灵活性。减少混乱发生。
     * @type {{minimizable: boolean, maximizable: boolean, resizable: boolean, toolbar: null, closable: boolean, draggable: boolean, fit: boolean, border: boolean, noheader: boolean, collapsible: boolean, cache: boolean, loadingMessage: string, onClose: Function}}
     */
    var FREEZE_ATTRS = {
        minimizable: false,
        maximizable: false,
        resizable: false,
        toolbar: null,
        closable: true,
        draggable: true,
        fit: false,
        border: true,
        noheader: false,
        collapsible: false,
        cache: false,
        loadingMessage: "Loading.....",
        onClose: _onCloseHandler,
        buttons: null
    };
    $.DM = {
        /**
         * 打开窗口的方法。
         * @param options 窗口参数。

         */
        open: function (options) {
            var _d = _getdialog();
            ACTIVE_STACK.push(_d);
            _parserEvent(options, _d);
            if (options.onLoad != null) {
                options._onLoad = options.onLoad;
            }
            options.onLoad = function () {
                var _bar = $("#" + _d._extid + " .easyuiext_dialog_bar")[0];
                if (_bar) {
                    $(_bar).removeClass("easyuiext_dialog_bar").attr("id", "ext_bar_" + _d._extid);
                }
                $(_d).dialog(
                    {
                        href: null,
                        buttons: "#" + "ext_bar_" + _d._extid
                    }
                );
                options._onLoad && options._onLoad.apply(_d);

            };
            $(_d).dialog(mergeOptions(options));

        },
        /**
         * 窗口关闭的函数。
         */
        close: function () {
            var p = ACTIVE_STACK[ACTIVE_STACK.length - 1];
            p && p.dialog("close");

        },
        /**
         * 触发自定义事件，用于窗口和调用者通信
         * @param type 自定义事件
         * @param params 参数,参考jquery $.trigger
         */
        trigger: function (type, params) {
            var p = ACTIVE_STACK[ACTIVE_STACK.length - 1];
            $(p).trigger(type, params);
        }

    }

})(jQuery);

/**
 *  Document   : mask 1.1
 *  Created on : 2011-12-11, 14:37:38
 *  Author     : GodSon
 *  Email      : wmails@126.com
 *  Link       : www.btboys.com
 *  updated by :xiejing
 *
 */

(function ($) {
    if (parent != window && parent.jQuery && parent.jQuery.mask && parent.jQuery.fn.mask) {
        $.mask = parent.jQuery.mask;
        $.fn.mask = parent.jQuery.fn.mask;
        return;
    }
    function init(target, options) {
        var wrap = $(target);
        if ($("div.mask", wrap).length) wrap.mask("hide");
        wrap.attr("position", wrap.css("position"));
        wrap.attr("overflow", wrap.css("overflow"));
        wrap.css("position", "relative");
        wrap.css("overflow", "hidden");
        var maskCss = {
            position: "absolute",
            left: 0,
            top: 0,
            cursor: "wait",
            background: "#ccc",
            opacity: options.opacity,
            filter: "alpha(opacity=" + options.opacity * 100 + ")",
            display: "none"
        };

        var maskMsgCss = {
            position: "absolute",
            width: "auto",
            padding: "10px 20px",
            border: "2px solid #ccc",
            color: "white",
            cursor: "wait",
            display: "none",
            borderRadius: 5,
            background: "black",
            opacity: 0.6,
            filter: "alpha(opacity=60)"
        };
        var width, height, left, top;
        if (target == 'body') {
            width = Math.max(document.documentElement.clientWidth, document.body.clientWidth);
            height = Math.max(document.documentElement.clientHeight, document.body.clientHeight);
        } else {
            width = wrap.outerWidth() || "100%";
            height = wrap.outerHeight() || "100%";
        }
        $('<div class="mask"></div>').css($.extend({}, maskCss, {
            display: 'block',
            width: width,
            height: height,
            zIndex: options.zIndex
        })).appendTo(wrap);

        var maskm = $('<div class="mask-msg"></div>').html(options.maskMsg).appendTo(wrap).css(maskMsgCss);

        if (target == 'body') {
            left = (Math.max(document.documentElement.clientWidth, document.body.clientWidth) - $('div.mask-msg', wrap).outerWidth()) / 2;
            if (document.documentElement.clientHeight > document.body.clientHeight) {
                top = (Math.max(document.documentElement.clientHeight, document.body.clientHeight) - $('div.mask-msg', wrap).outerHeight()) / 2;
            } else {
                top = (Math.min(document.documentElement.clientHeight, document.body.clientHeight) - $('div.mask-msg', wrap).outerHeight()) / 2;
            }

        } else {
            left = (wrap.width() - $('div.mask-msg', wrap).outerWidth()) / 2;
            top = (wrap.height() - $('div.mask-msg', wrap).outerHeight()) / 2;
        }

        maskm.css({
            display: 'block',
            zIndex: options.zIndex + 1,
            left: left,
            top: top
        });

        setTimeout(function () {
            wrap.mask("hide");
        }, options.timeout);

        return wrap;
    }

    $.fn.mask = function (options) {
        if (typeof options == 'string') {
            return $.fn.mask.methods[options](this);
        }
        options = $.extend({}, $.fn.mask.defaults, options);
        return init(this, options);
    };
    $.mask = function (options) {
        if (typeof options == 'string') {
            return $.fn.mask.methods[options]("body");
        }
        options = $.extend({}, $.fn.mask.defaults, options);
        return init("body", options);
    };

    $.mask.hide = function () {
        $("body").mask("hide");
    };

    $.fn.mask.methods = {
        hide: function (jq) {
            return jq.each(function () {
                var wrap = $(this);
                $("div.mask", wrap).fadeOut(function () {
                    $(this).remove();
                });
                $("div.mask-msg", wrap).fadeOut(function () {
                    $(this).remove();
                    wrap.css("position", wrap.attr("position"));
                    wrap.css("overflow", wrap.attr("overflow"));
                });
            });
        }
    };

    $.fn.mask.defaults = {
        //加载中......
        maskMsg: '\u52A0\u8F7D\u4E2D......',
        zIndex: 100000,
        timeout: 30000,
        opacity: 0.6
    };
})(jQuery);
/**
 * Author: XieJing
 * Date:    2013-07-31
 * Time:   10:12
 * E-mail:  xiejingcloudy@gmail.com
 * Description:math工具
 */
;(function($){
        var DECMAP={ "0":"零","1":"一","2":"二","3":"三","4":"四","5":"五","6":"六", "7":"七","8":"八","9":"九"} ;
        var NLEN=["千","百","十","亿","千","百","十","万","千","百","十",""];
    /**
     * 数字转换为中文格式
     * @param dec
     * @returns {string}
     */
    $.MathUtil.formatDecimals=function(dec){
            var _td=dec+"";
            var out="";
            if(_td.indexOf(".")>=0){
                  var sp=_td.split(".");
                  for(var i=0;i<sp[0].length;i++){
                    out+=DECMAP[(sp[0].charAt(i))];
                    out+=NLEN[NLEN.length-sp[0].length+i];
                  }
                out+="点";
                for(var j=0;j<sp[1].length;j++){
                    out+=DECMAP[(sp[1].charAt(j))];
                }
            }else{
                for(var g=0;g<_td.length;g++){
                    out+=DECMAP[(_td.charAt(g))];
                    out+=NLEN[NLEN.length-_td.length+g];
                }
            }
            return out;
        }


})(jQuery);