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
