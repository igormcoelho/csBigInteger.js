!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.csbiginteger=e():t.csbiginteger=e()}(window,function(){return function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=1)}([function(t,e,r){!function(t){"use strict";function e(t,n=10){return t instanceof e?t:void 0===t?r:"string"==typeof t||"[object Array]"===Object.prototype.toString.call(t)?e.parse(t,n):void(this._data=Math.round(t))}e._construct=function(t){return new e(t)};var r=new e(0);e.ZERO=r;var n=new e(1);e.ONE=n;var o=new e(-1);e.M_ONE=o,e._0=r,e._1=n,e.prototype.toString=function(t=10){if(2!=t&&10!=t&&16!=t)throw new Error("illegal radix "+t+".");if(10===t)return this._data.toString();for(var e="",r=this._data.length-1;r>=0;r--){var n=this._data[r].toString(16);n.length<2&&(n="0"+n),e+=n}return e},e.parse=function(t,n=10){if("[object Array]"===Object.prototype.toString.call(t)){if(0==t.length)return r;u="";for(var o=0;o<t.length;o++){var i=t[o].toString(16);1==i.length&&(i="0"+i),u+=i}return e.parse(u,16)}var u=t.toString();return new e(10==n?parseInt(u,10):e.behex2bigint(u))},e.revertHexString=function(t){for(var e="",r=0;r<t.length-1;r+=2)e=""+t.substr(r,2)+e;return e},e.checkNegativeBit=function(t){var e=t.slice(t.length-2,t.length+2),r=parseInt(e,16).toString(2);return 8==r.length&&"1"==r[0]},e.behex2bigint=function(t){var r=t;if(r.length%2==1&&(r="0"+r),e.checkNegativeBit(r)){for(var n=parseInt(e.revertHexString(t),16).toString(2),o="",i=0;i<n.length;i++)o+="0"==n[i]?"1":"0";return-1*(parseInt(o,2)+1)}return parseInt(e.revertHexString(t),16)},e.prototype.toByteArray=function(){for(var t=this.toHexString(),e=[],r=0;r<t.length-1;r+=2)e.push(parseInt(t.substr(r,2),16));return e},e.prototype.toHexString=function(){var t=this._data;if(t>=0){var r=t.toString(16);return r.length%2==1&&(r="0"+r),r=e.revertHexString(r),e.checkNegativeBit(r)&&(r+="00"),r}return e.negbigint2behex(t)},e.negbigint2behex=function(t){if(t>=0)return null;var r=t,n=(r*=-1).toString(2);for(n="0"+n;n.length<8||n.length%8!=0;)n="0"+n;for(var o="",i=0;i<n.length;i++)o+="0"==n[i]?"1":"0";for(var u=parseInt(o,2),a=(u+=1).toString(2);a.length<8;)a="0"+a;var c=parseInt(a,2).toString(16);return e.revertHexString(c)},e.prototype.valueOf=function(){return parseInt(this.toString(),10)},t.csBigInteger=e}(e)},function(t,e,r){const n=r(0).csBigInteger,o=r(2).csFixed8;t.exports={csBigInteger:n,csFixed8:o}},function(t,e,r){!function(t){"use strict";const e=r(0).csBigInteger;function n(t){this._data=t instanceof n?t._data:t instanceof e?t:new e("number"==typeof t?o*t:parseInt(t,10))}n._construct=function(t){return new n(t)};var o=new e(1e8),i=new n(new e(Number.MAX_SAFE_INTEGER)),u=new n(new e(Number.MIN_SAFE_INTEGER)),a=new n(o),c=new n(new e(1)),f=new n(new e(0));n.Zero=f,n.One=a,n.MaxValue=i,n.MinValue=u,n.Satoshi=c,n.prototype.toHexString=function(){var t=this._data.toHexString();if(this._data>=0)for(;t.length<16;)t+="0";return t},n.prototype.toString=function(t=10){if(10!=t&&16!=t)throw new Error("illegal radix "+t+".");return 10==t?(this._data/o).toString():16==t?e.revertHexString(this.toHexString()):"?"},n.prototype.valueOf=function(){return this._data},t.csFixed8=n}(e)}])});