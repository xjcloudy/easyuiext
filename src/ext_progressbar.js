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
    $.fn.progressbar.methods = $.fn.extend($.fn.progressbar.methods, {"setBarColor": function (jq, color) {
        jq.find(".progressbar-value .progressbar-text").css("background-color", color);
    }});
})(jQuery);
