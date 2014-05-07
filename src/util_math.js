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