/**
 * Author: XieJing
 * Date:    2014-05-07
 * Time:   10:34
 * E-mail:  xiejingcloudy@gmail.com
 * Description:
 */
(function ($) {
    "use strict";
    if (!$.fn.progressbar) {
        return;
    }
    $.fn.progressbar.methods = $.fn.extend($.fn.progressbar.methods, {"setBarStyle": function (jq, style) {
        jq.find(".progressbar-value .progressbar-text").css(style);
    }});
})(jQuery);
