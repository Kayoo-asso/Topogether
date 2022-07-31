"use strict";var vr=Object.create;var oe=Object.defineProperty;var gr=Object.getOwnPropertyDescriptor;var mr=Object.getOwnPropertyNames;var yr=Object.getPrototypeOf,br=Object.prototype.hasOwnProperty;var f=(e,r)=>()=>(r||e((r={exports:{}}).exports,r),r.exports);var wr=(e,r,t,n)=>{if(r&&typeof r=="object"||typeof r=="function")for(let s of mr(r))!br.call(e,s)&&s!==t&&oe(e,s,{get:()=>r[s],enumerable:!(n=gr(r,s))||n.enumerable});return e};var R=(e,r,t)=>(t=e!=null?vr(yr(e)):{},wr(r||!e||!e.__esModule?oe(t,"default",{value:e,enumerable:!0}):t,e));var ae=f((ln,se)=>{var A=1e3,O=A*60,_=O*60,k=_*24,Er=k*365.25;se.exports=function(e,r){r=r||{};var t=typeof e;if(t==="string"&&e.length>0)return Cr(e);if(t==="number"&&isNaN(e)===!1)return r.long?Sr(e):xr(e);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(e))};function Cr(e){if(e=String(e),!(e.length>100)){var r=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(e);if(!!r){var t=parseFloat(r[1]),n=(r[2]||"ms").toLowerCase();switch(n){case"years":case"year":case"yrs":case"yr":case"y":return t*Er;case"days":case"day":case"d":return t*k;case"hours":case"hour":case"hrs":case"hr":case"h":return t*_;case"minutes":case"minute":case"mins":case"min":case"m":return t*O;case"seconds":case"second":case"secs":case"sec":case"s":return t*A;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return t;default:return}}}}function xr(e){return e>=k?Math.round(e/k)+"d":e>=_?Math.round(e/_)+"h":e>=O?Math.round(e/O)+"m":e>=A?Math.round(e/A)+"s":e+"ms"}function Sr(e){return B(e,k,"day")||B(e,_,"hour")||B(e,O,"minute")||B(e,A,"second")||e+" ms"}function B(e,r,t){if(!(e<r))return e<r*1.5?Math.floor(e/r)+" "+t:Math.ceil(e/r)+" "+t+"s"}});var z=f((u,ie)=>{u=ie.exports=j.debug=j.default=j;u.coerce=Ur;u.disable=_r;u.enable=Or;u.enabled=kr;u.humanize=ae();u.names=[];u.skips=[];u.formatters={};var G;function Ar(e){var r=0,t;for(t in e)r=(r<<5)-r+e.charCodeAt(t),r|=0;return u.colors[Math.abs(r)%u.colors.length]}function j(e){function r(){if(!!r.enabled){var t=r,n=+new Date,s=n-(G||n);t.diff=s,t.prev=G,t.curr=n,G=n;for(var o=new Array(arguments.length),a=0;a<o.length;a++)o[a]=arguments[a];o[0]=u.coerce(o[0]),typeof o[0]!="string"&&o.unshift("%O");var i=0;o[0]=o[0].replace(/%([a-zA-Z%])/g,function(l,b){if(l==="%%")return l;i++;var g=u.formatters[b];if(typeof g=="function"){var v=o[i];l=g.call(t,v),o.splice(i,1),i--}return l}),u.formatArgs.call(t,o);var d=r.log||u.log||console.log.bind(console);d.apply(t,o)}}return r.namespace=e,r.enabled=u.enabled(e),r.useColors=u.useColors(),r.color=Ar(e),typeof u.init=="function"&&u.init(r),r}function Or(e){u.save(e),u.names=[],u.skips=[];for(var r=(typeof e=="string"?e:"").split(/[\s,]+/),t=r.length,n=0;n<t;n++)!r[n]||(e=r[n].replace(/\*/g,".*?"),e[0]==="-"?u.skips.push(new RegExp("^"+e.substr(1)+"$")):u.names.push(new RegExp("^"+e+"$")))}function _r(){u.enable("")}function kr(e){var r,t;for(r=0,t=u.skips.length;r<t;r++)if(u.skips[r].test(e))return!1;for(r=0,t=u.names.length;r<t;r++)if(u.names[r].test(e))return!0;return!1}function Ur(e){return e instanceof Error?e.stack||e.message:e}});var le=f((m,ce)=>{m=ce.exports=z();m.log=Tr;m.formatArgs=Dr;m.save=Nr;m.load=ue;m.useColors=Fr;m.storage=typeof chrome<"u"&&typeof chrome.storage<"u"?chrome.storage.local:Pr();m.colors=["lightseagreen","forestgreen","goldenrod","dodgerblue","darkorchid","crimson"];function Fr(){return typeof window<"u"&&window.process&&window.process.type==="renderer"?!0:typeof document<"u"&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||typeof window<"u"&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)}m.formatters.j=function(e){try{return JSON.stringify(e)}catch(r){return"[UnexpectedJSONParseError]: "+r.message}};function Dr(e){var r=this.useColors;if(e[0]=(r?"%c":"")+this.namespace+(r?" %c":" ")+e[0]+(r?"%c ":" ")+"+"+m.humanize(this.diff),!!r){var t="color: "+this.color;e.splice(1,0,t,"color: inherit");var n=0,s=0;e[0].replace(/%[a-zA-Z%]/g,function(o){o!=="%%"&&(n++,o==="%c"&&(s=n))}),e.splice(s,0,t)}}function Tr(){return typeof console=="object"&&console.log&&Function.prototype.apply.call(console.log,console,arguments)}function Nr(e){try{e==null?m.storage.removeItem("debug"):m.storage.debug=e}catch{}}function ue(){var e;try{e=m.storage.debug}catch{}return!e&&typeof process<"u"&&"env"in process&&(e=process.env.DEBUG),e}m.enable(ue());function Pr(){try{return window.localStorage}catch{}}});var he=f((p,pe)=>{var fe=require("tty"),U=require("util");p=pe.exports=z();p.init=Hr;p.log=Lr;p.formatArgs=Ir;p.save=Mr;p.load=de;p.useColors=Br;p.colors=[6,2,3,4,5,1];p.inspectOpts=Object.keys(process.env).filter(function(e){return/^debug_/i.test(e)}).reduce(function(e,r){var t=r.substring(6).toLowerCase().replace(/_([a-z])/g,function(s,o){return o.toUpperCase()}),n=process.env[r];return/^(yes|on|true|enabled)$/i.test(n)?n=!0:/^(no|off|false|disabled)$/i.test(n)?n=!1:n==="null"?n=null:n=Number(n),e[t]=n,e},{});var x=parseInt(process.env.DEBUG_FD,10)||2;x!==1&&x!==2&&U.deprecate(function(){},"except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();var Rr=x===1?process.stdout:x===2?process.stderr:$r(x);function Br(){return"colors"in p.inspectOpts?Boolean(p.inspectOpts.colors):fe.isatty(x)}p.formatters.o=function(e){return this.inspectOpts.colors=this.useColors,U.inspect(e,this.inspectOpts).split(`
`).map(function(r){return r.trim()}).join(" ")};p.formatters.O=function(e){return this.inspectOpts.colors=this.useColors,U.inspect(e,this.inspectOpts)};function Ir(e){var r=this.namespace,t=this.useColors;if(t){var n=this.color,s="  \x1B[3"+n+";1m"+r+" \x1B[0m";e[0]=s+e[0].split(`
`).join(`
`+s),e.push("\x1B[3"+n+"m+"+p.humanize(this.diff)+"\x1B[0m")}else e[0]=new Date().toUTCString()+" "+r+" "+e[0]}function Lr(){return Rr.write(U.format.apply(U,arguments)+`
`)}function Mr(e){e==null?delete process.env.DEBUG:process.env.DEBUG=e}function de(){return process.env.DEBUG}function $r(e){var r,t=process.binding("tty_wrap");switch(t.guessHandleType(e)){case"TTY":r=new fe.WriteStream(e),r._type="tty",r._handle&&r._handle.unref&&r._handle.unref();break;case"FILE":var n=require("fs");r=new n.SyncWriteStream(e,{autoClose:!1}),r._type="fs";break;case"PIPE":case"TCP":var s=require("net");r=new s.Socket({fd:e,readable:!1,writable:!0}),r.readable=!1,r.read=null,r._type="pipe",r._handle&&r._handle.unref&&r._handle.unref();break;default:throw new Error("Implement me. Unknown stream file type!")}return r.fd=e,r._isStdio=!0,r}function Hr(e){e.inspectOpts={};for(var r=Object.keys(p.inspectOpts),t=0;t<r.length;t++)e.inspectOpts[r[t]]=p.inspectOpts[r[t]]}p.enable(de())});var ve=f((fn,W)=>{typeof process<"u"&&process.type==="renderer"?W.exports=le():W.exports=he()});var me=f((dn,ge)=>{var F=1e3,D=F*60,T=D*60,N=T*24,qr=N*365.25;ge.exports=function(e,r){r=r||{};var t=typeof e;if(t==="string"&&e.length>0)return Gr(e);if(t==="number"&&isNaN(e)===!1)return r.long?zr(e):jr(e);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(e))};function Gr(e){if(e=String(e),!(e.length>100)){var r=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(e);if(!!r){var t=parseFloat(r[1]),n=(r[2]||"ms").toLowerCase();switch(n){case"years":case"year":case"yrs":case"yr":case"y":return t*qr;case"days":case"day":case"d":return t*N;case"hours":case"hour":case"hrs":case"hr":case"h":return t*T;case"minutes":case"minute":case"mins":case"min":case"m":return t*D;case"seconds":case"second":case"secs":case"sec":case"s":return t*F;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return t;default:return}}}}function jr(e){return e>=N?Math.round(e/N)+"d":e>=T?Math.round(e/T)+"h":e>=D?Math.round(e/D)+"m":e>=F?Math.round(e/F)+"s":e+"ms"}function zr(e){return I(e,N,"day")||I(e,T,"hour")||I(e,D,"minute")||I(e,F,"second")||e+" ms"}function I(e,r,t){if(!(e<r))return e<r*1.5?Math.floor(e/r)+" "+t:Math.ceil(e/r)+" "+t+"s"}});var X=f((c,ye)=>{c=ye.exports=V.debug=V.default=V;c.coerce=Zr;c.disable=Vr;c.enable=Jr;c.enabled=Xr;c.humanize=me();c.names=[];c.skips=[];c.formatters={};var J;function Wr(e){var r=0,t;for(t in e)r=(r<<5)-r+e.charCodeAt(t),r|=0;return c.colors[Math.abs(r)%c.colors.length]}function V(e){function r(){if(!!r.enabled){var t=r,n=+new Date,s=n-(J||n);t.diff=s,t.prev=J,t.curr=n,J=n;for(var o=new Array(arguments.length),a=0;a<o.length;a++)o[a]=arguments[a];o[0]=c.coerce(o[0]),typeof o[0]!="string"&&o.unshift("%O");var i=0;o[0]=o[0].replace(/%([a-zA-Z%])/g,function(l,b){if(l==="%%")return l;i++;var g=c.formatters[b];if(typeof g=="function"){var v=o[i];l=g.call(t,v),o.splice(i,1),i--}return l}),c.formatArgs.call(t,o);var d=r.log||c.log||console.log.bind(console);d.apply(t,o)}}return r.namespace=e,r.enabled=c.enabled(e),r.useColors=c.useColors(),r.color=Wr(e),typeof c.init=="function"&&c.init(r),r}function Jr(e){c.save(e),c.names=[],c.skips=[];for(var r=(typeof e=="string"?e:"").split(/[\s,]+/),t=r.length,n=0;n<t;n++)!r[n]||(e=r[n].replace(/\*/g,".*?"),e[0]==="-"?c.skips.push(new RegExp("^"+e.substr(1)+"$")):c.names.push(new RegExp("^"+e+"$")))}function Vr(){c.enable("")}function Xr(e){var r,t;for(r=0,t=c.skips.length;r<t;r++)if(c.skips[r].test(e))return!1;for(r=0,t=c.names.length;r<t;r++)if(c.names[r].test(e))return!0;return!1}function Zr(e){return e instanceof Error?e.stack||e.message:e}});var Ee=f((y,we)=>{y=we.exports=X();y.log=Qr;y.formatArgs=Kr;y.save=et;y.load=be;y.useColors=Yr;y.storage=typeof chrome<"u"&&typeof chrome.storage<"u"?chrome.storage.local:rt();y.colors=["lightseagreen","forestgreen","goldenrod","dodgerblue","darkorchid","crimson"];function Yr(){return typeof window<"u"&&window.process&&window.process.type==="renderer"?!0:typeof document<"u"&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||typeof window<"u"&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)}y.formatters.j=function(e){try{return JSON.stringify(e)}catch(r){return"[UnexpectedJSONParseError]: "+r.message}};function Kr(e){var r=this.useColors;if(e[0]=(r?"%c":"")+this.namespace+(r?" %c":" ")+e[0]+(r?"%c ":" ")+"+"+y.humanize(this.diff),!!r){var t="color: "+this.color;e.splice(1,0,t,"color: inherit");var n=0,s=0;e[0].replace(/%[a-zA-Z%]/g,function(o){o!=="%%"&&(n++,o==="%c"&&(s=n))}),e.splice(s,0,t)}}function Qr(){return typeof console=="object"&&console.log&&Function.prototype.apply.call(console.log,console,arguments)}function et(e){try{e==null?y.storage.removeItem("debug"):y.storage.debug=e}catch{}}function be(){var e;try{e=y.storage.debug}catch{}return!e&&typeof process<"u"&&"env"in process&&(e=process.env.DEBUG),e}y.enable(be());function rt(){try{return window.localStorage}catch{}}});var Ae=f((h,Se)=>{var Ce=require("tty"),P=require("util");h=Se.exports=X();h.init=ut;h.log=st;h.formatArgs=ot;h.save=at;h.load=xe;h.useColors=nt;h.colors=[6,2,3,4,5,1];h.inspectOpts=Object.keys(process.env).filter(function(e){return/^debug_/i.test(e)}).reduce(function(e,r){var t=r.substring(6).toLowerCase().replace(/_([a-z])/g,function(s,o){return o.toUpperCase()}),n=process.env[r];return/^(yes|on|true|enabled)$/i.test(n)?n=!0:/^(no|off|false|disabled)$/i.test(n)?n=!1:n==="null"?n=null:n=Number(n),e[t]=n,e},{});var S=parseInt(process.env.DEBUG_FD,10)||2;S!==1&&S!==2&&P.deprecate(function(){},"except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();var tt=S===1?process.stdout:S===2?process.stderr:it(S);function nt(){return"colors"in h.inspectOpts?Boolean(h.inspectOpts.colors):Ce.isatty(S)}h.formatters.o=function(e){return this.inspectOpts.colors=this.useColors,P.inspect(e,this.inspectOpts).split(`
`).map(function(r){return r.trim()}).join(" ")};h.formatters.O=function(e){return this.inspectOpts.colors=this.useColors,P.inspect(e,this.inspectOpts)};function ot(e){var r=this.namespace,t=this.useColors;if(t){var n=this.color,s="  \x1B[3"+n+";1m"+r+" \x1B[0m";e[0]=s+e[0].split(`
`).join(`
`+s),e.push("\x1B[3"+n+"m+"+h.humanize(this.diff)+"\x1B[0m")}else e[0]=new Date().toUTCString()+" "+r+" "+e[0]}function st(){return tt.write(P.format.apply(P,arguments)+`
`)}function at(e){e==null?delete process.env.DEBUG:process.env.DEBUG=e}function xe(){return process.env.DEBUG}function it(e){var r,t=process.binding("tty_wrap");switch(t.guessHandleType(e)){case"TTY":r=new Ce.WriteStream(e),r._type="tty",r._handle&&r._handle.unref&&r._handle.unref();break;case"FILE":var n=require("fs");r=new n.SyncWriteStream(e,{autoClose:!1}),r._type="fs";break;case"PIPE":case"TCP":var s=require("net");r=new s.Socket({fd:e,readable:!1,writable:!0}),r.readable=!1,r.read=null,r._type="pipe",r._handle&&r._handle.unref&&r._handle.unref();break;default:throw new Error("Implement me. Unknown stream file type!")}return r.fd=e,r._isStdio=!0,r}function ut(e){e.inspectOpts={};for(var r=Object.keys(h.inspectOpts),t=0;t<r.length;t++)e.inspectOpts[r[t]]=h.inspectOpts[r[t]]}h.enable(xe())});var Oe=f((pn,Z)=>{typeof process<"u"&&process.type==="renderer"?Z.exports=Ee():Z.exports=Ae()});var ke=f((hn,_e)=>{"use strict";_e.exports=dt;var ct=/(?:[^\x21\x25\x26-\x3B\x3D\x3F-\x5B\x5D\x5F\x61-\x7A\x7E]|%(?:[^0-9A-Fa-f]|[0-9A-Fa-f][^0-9A-Fa-f]|$))+/g,lt=/(^|[^\uD800-\uDBFF])[\uDC00-\uDFFF]|[\uD800-\uDBFF]([^\uDC00-\uDFFF]|$)/g,ft="$1\uFFFD$2";function dt(e){return String(e).replace(lt,ft).replace(ct,encodeURI)}});var Fe=f((vn,Ue)=>{"use strict";var pt=/["'&<>]/;Ue.exports=ht;function ht(e){var r=""+e,t=pt.exec(r);if(!t)return r;var n,s="",o=0,a=0;for(o=t.index;o<r.length;o++){switch(r.charCodeAt(o)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 39:n="&#39;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}a!==o&&(s+=r.substring(a,o)),a=o+1,s+=n}return a!==o?s+r.substring(a,o):s}});var Te=f((gn,De)=>{"use strict";De.exports=vt;function vt(e,r){if(!Array.isArray(e))throw new TypeError("arg must be an array of [ee, events...] arrays");for(var t=[],n=0;n<e.length;n++){var s=e[n];if(!Array.isArray(s)||s.length<2)throw new TypeError("each array member must be [ee, events...]");for(var o=s[0],a=1;a<s.length;a++){var i=s[a],d=gt(i,l);o.on(i,d),t.push({ee:o,event:i,fn:d})}}function l(){b(),r.apply(null,arguments)}function b(){for(var v,C=0;C<t.length;C++)v=t[C],v.ee.removeListener(v.event,v.fn)}function g(v){r=v}return g.cancel=b,g}function gt(e,r){return function(n){for(var s=new Array(arguments.length),o=this,a=e==="error"?n:null,i=0;i<s.length;i++)s[i]=arguments[i];r(a,o,e,s)}}});var Re=f((mn,Y)=>{"use strict";Y.exports=yt;Y.exports.isFinished=Pe;var Ne=Te(),mt=typeof setImmediate=="function"?setImmediate:function(e){process.nextTick(e.bind.apply(e,arguments))};function yt(e,r){return Pe(e)!==!1?(mt(r,null,e),e):(wt(e,r),e)}function Pe(e){var r=e.socket;if(typeof e.finished=="boolean")return Boolean(e.finished||r&&!r.writable);if(typeof e.complete=="boolean")return Boolean(e.upgrade||!r||!r.readable||e.complete&&!e.readable)}function bt(e,r){var t,n,s=!1;function o(i){t.cancel(),n.cancel(),s=!0,r(i)}t=n=Ne([[e,"end","finish"]],o);function a(i){e.removeListener("socket",a),!s&&t===n&&(n=Ne([[i,"error","close"]],o))}if(e.socket){a(e.socket);return}e.on("socket",a),e.socket===void 0&&Ct(e,a)}function wt(e,r){var t=e.__onFinished;(!t||!t.queue)&&(t=e.__onFinished=Et(e),bt(e,t)),t.queue.push(r)}function Et(e){function r(t){if(e.__onFinished===r&&(e.__onFinished=null),!!r.queue){var n=r.queue;r.queue=null;for(var s=0;s<n.length;s++)n[s](t,e)}}return r.queue=[],r}function Ct(e,r){var t=e.assignSocket;typeof t=="function"&&(e.assignSocket=function(s){t.call(this,s),r(s)})}});var Q=f((yn,K)=>{"use strict";var Ie=require("url"),Be=Ie.parse,L=Ie.Url;K.exports=Le;K.exports.original=xt;function Le(e){var r=e.url;if(r!==void 0){var t=e._parsedUrl;return $e(r,t)?t:(t=Me(r),t._raw=r,e._parsedUrl=t)}}function xt(e){var r=e.originalUrl;if(typeof r!="string")return Le(e);var t=e._parsedOriginalUrl;return $e(r,t)?t:(t=Me(r),t._raw=r,e._parsedOriginalUrl=t)}function Me(e){if(typeof e!="string"||e.charCodeAt(0)!==47)return Be(e);for(var r=e,t=null,n=null,s=1;s<e.length;s++)switch(e.charCodeAt(s)){case 63:n===null&&(r=e.substring(0,s),t=e.substring(s+1),n=e.substring(s));break;case 9:case 10:case 12:case 13:case 32:case 35:case 160:case 65279:return Be(e)}var o=L!==void 0?new L:{};return o.path=e,o.href=e,o.pathname=r,n!==null&&(o.query=t,o.search=n),o}function $e(e,r){return typeof r=="object"&&r!==null&&(L===void 0||r instanceof L)&&r._raw===e}});var He=f((bn,St)=>{St.exports={"100":"Continue","101":"Switching Protocols","102":"Processing","103":"Early Hints","200":"OK","201":"Created","202":"Accepted","203":"Non-Authoritative Information","204":"No Content","205":"Reset Content","206":"Partial Content","207":"Multi-Status","208":"Already Reported","226":"IM Used","300":"Multiple Choices","301":"Moved Permanently","302":"Found","303":"See Other","304":"Not Modified","305":"Use Proxy","306":"(Unused)","307":"Temporary Redirect","308":"Permanent Redirect","400":"Bad Request","401":"Unauthorized","402":"Payment Required","403":"Forbidden","404":"Not Found","405":"Method Not Allowed","406":"Not Acceptable","407":"Proxy Authentication Required","408":"Request Timeout","409":"Conflict","410":"Gone","411":"Length Required","412":"Precondition Failed","413":"Payload Too Large","414":"URI Too Long","415":"Unsupported Media Type","416":"Range Not Satisfiable","417":"Expectation Failed","418":"I'm a teapot","421":"Misdirected Request","422":"Unprocessable Entity","423":"Locked","424":"Failed Dependency","425":"Unordered Collection","426":"Upgrade Required","428":"Precondition Required","429":"Too Many Requests","431":"Request Header Fields Too Large","451":"Unavailable For Legal Reasons","500":"Internal Server Error","501":"Not Implemented","502":"Bad Gateway","503":"Service Unavailable","504":"Gateway Timeout","505":"HTTP Version Not Supported","506":"Variant Also Negotiates","507":"Insufficient Storage","508":"Loop Detected","509":"Bandwidth Limit Exceeded","510":"Not Extended","511":"Network Authentication Required"}});var je=f((wn,Ge)=>{"use strict";var qe=He();Ge.exports=w;w.STATUS_CODES=qe;w.codes=At(w,qe);w.redirect={300:!0,301:!0,302:!0,303:!0,305:!0,307:!0,308:!0};w.empty={204:!0,205:!0,304:!0};w.retry={502:!0,503:!0,504:!0};function At(e,r){var t=[];return Object.keys(r).forEach(function(s){var o=r[s],a=Number(s);e[a]=o,e[o]=a,e[o.toLowerCase()]=a,t.push(a)}),t}function w(e){if(typeof e=="number"){if(!w[e])throw new Error("invalid status code: "+e);return e}if(typeof e!="string")throw new TypeError("code must be a number or string");var r=parseInt(e,10);if(!isNaN(r)){if(!w[r])throw new Error("invalid status code: "+r);return r}if(r=w[e.toLowerCase()],!r)throw new Error('invalid status message: "'+e+'"');return r}});var We=f((En,ze)=>{"use strict";ze.exports=_t;function Ot(e){for(var r=e.listeners("data"),t=0;t<r.length;t++)if(r[t].name==="ondata")return!0;return!1}function _t(e){if(!e)throw new TypeError("argument stream is required");if(typeof e.unpipe=="function"){e.unpipe();return}if(!!Ot(e))for(var r,t=e.listeners("close"),n=0;n<t.length;n++)r=t[n],!(r.name!=="cleanup"&&r.name!=="onclose")&&r.call(e)}});var Ye=f((Cn,Ze)=>{"use strict";var ee=Oe()("finalhandler"),kt=ke(),Ut=Fe(),Ve=Re(),Ft=Q(),Xe=je(),Dt=We(),Tt=/\x20{2}/g,Nt=/\n/g,Pt=typeof setImmediate=="function"?setImmediate:function(e){process.nextTick(e.bind.apply(e,arguments))},Rt=Ve.isFinished;function Bt(e){var r=Ut(e).replace(Nt,"<br>").replace(Tt," &nbsp;");return`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>`+r+`</pre>
</body>
</html>
`}Ze.exports=It;function It(e,r,t){var n=t||{},s=n.env||process.env.NODE_ENV||"development",o=n.onerror;return function(a){var i,d,l;if(!a&&Je(r)){ee("cannot 404 after headers sent");return}if(a?(l=$t(a),l===void 0?l=qt(r):i=Lt(a),d=Mt(a,l,s)):(l=404,d="Cannot "+e.method+" "+kt(Ht(e))),ee("default %s",l),a&&o&&Pt(o,a,e,r),Je(r)){ee("cannot %d after headers sent",l),e.socket.destroy();return}Gt(e,r,l,i,d)}}function Lt(e){if(!(!e.headers||typeof e.headers!="object")){for(var r=Object.create(null),t=Object.keys(e.headers),n=0;n<t.length;n++){var s=t[n];r[s]=e.headers[s]}return r}}function Mt(e,r,t){var n;return t!=="production"&&(n=e.stack,!n&&typeof e.toString=="function"&&(n=e.toString())),n||Xe[r]}function $t(e){if(typeof e.status=="number"&&e.status>=400&&e.status<600)return e.status;if(typeof e.statusCode=="number"&&e.statusCode>=400&&e.statusCode<600)return e.statusCode}function Ht(e){try{return Ft.original(e).pathname}catch{return"resource"}}function qt(e){var r=e.statusCode;return(typeof r!="number"||r<400||r>599)&&(r=500),r}function Je(e){return typeof e.headersSent!="boolean"?Boolean(e._header):e.headersSent}function Gt(e,r,t,n,s){function o(){var a=Bt(s);if(r.statusCode=t,r.statusMessage=Xe[t],jt(r,n),r.setHeader("Content-Security-Policy","default-src 'none'"),r.setHeader("X-Content-Type-Options","nosniff"),r.setHeader("Content-Type","text/html; charset=utf-8"),r.setHeader("Content-Length",Buffer.byteLength(a,"utf8")),e.method==="HEAD"){r.end();return}r.end(a,"utf8")}if(Rt(e)){o();return}Dt(e),Ve(e,o),e.resume()}function jt(e,r){if(!!r)for(var t=Object.keys(r),n=0;n<t.length;n++){var s=t[n];e.setHeader(s,r[s])}}});var er=f((Ke,Qe)=>{Ke=Qe.exports=function(e,r){if(e&&r)for(var t in r)e[t]=r[t];return e}});var ar=f((xn,sr)=>{"use strict";var tr=ve()("connect:dispatcher"),zt=require("events").EventEmitter,Wt=Ye(),nr=require("http"),rr=er(),Jt=Q();sr.exports=Xt;var or=process.env.NODE_ENV||"development",M={},Vt=typeof setImmediate=="function"?setImmediate:function(e){process.nextTick(e.bind.apply(e,arguments))};function Xt(){function e(r,t,n){e.handle(r,t,n)}return rr(e,M),rr(e,zt.prototype),e.route="/",e.stack=[],e}M.use=function(r,t){var n=t,s=r;if(typeof r!="string"&&(n=r,s="/"),typeof n.handle=="function"){var o=n;o.route=s,n=function(a,i,d){o.handle(a,i,d)}}return n instanceof nr.Server&&(n=n.listeners("request")[0]),s[s.length-1]==="/"&&(s=s.slice(0,-1)),tr("use %s %s",s||"/",n.name||"anonymous"),this.stack.push({route:s,handle:n}),this};M.handle=function(r,t,n){var s=0,o=Kt(r.url)||"",a="",i=!1,d=this.stack,l=n||Wt(r,t,{env:or,onerror:Yt});r.originalUrl=r.originalUrl||r.url;function b(g){i&&(r.url=r.url.substr(1),i=!1),a.length!==0&&(r.url=o+a+r.url.substr(o.length),a="");var v=d[s++];if(!v){Vt(l,g);return}var C=Jt(r).pathname||"/",E=v.route;if(C.toLowerCase().substr(0,E.length)!==E.toLowerCase())return b(g);var q=C.length>E.length&&C[E.length];if(q&&q!=="/"&&q!==".")return b(g);E.length!==0&&E!=="/"&&(a=E,r.url=o+r.url.substr(o.length+a.length),!o&&r.url[0]!=="/"&&(r.url="/"+r.url,i=!0)),Zt(v.handle,E,g,r,t,b)}b()};M.listen=function(){var r=nr.createServer(this);return r.listen.apply(r,arguments)};function Zt(e,r,t,n,s,o){var a=e.length,i=t,d=Boolean(t);tr("%s %s : %s",e.name||"<anonymous>",r,n.originalUrl);try{if(d&&a===4){e(t,n,s,o);return}else if(!d&&a<4){e(n,s,o);return}}catch(l){i=l}o(i)}function Yt(e){or!=="test"&&console.error(e.stack||e.toString())}function Kt(e){if(!(e.length===0||e[0]==="/")){var r=e.indexOf("://");return r!==-1&&e.lastIndexOf("?",r)===-1?e.substr(0,e.indexOf("/",3+r)):void 0}}});var ur=f((Sn,H)=>{var Qt=require("fs"),ir=require("path"),en=require("os"),rn=/(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;function tn(e){let r={},t=e.toString();t=t.replace(/\r\n?/mg,`
`);let n;for(;(n=rn.exec(t))!=null;){let s=n[1],o=n[2]||"";o=o.trim();let a=o[0];o=o.replace(/^(['"`])([\s\S]*)\1$/mg,"$2"),a==='"'&&(o=o.replace(/\\n/g,`
`),o=o.replace(/\\r/g,"\r")),r[s]=o}return r}function re(e){console.log(`[dotenv][DEBUG] ${e}`)}function nn(e){return e[0]==="~"?ir.join(en.homedir(),e.slice(1)):e}function on(e){let r=ir.resolve(process.cwd(),".env"),t="utf8",n=Boolean(e&&e.debug),s=Boolean(e&&e.override);e&&(e.path!=null&&(r=nn(e.path)),e.encoding!=null&&(t=e.encoding));try{let o=$.parse(Qt.readFileSync(r,{encoding:t}));return Object.keys(o).forEach(function(a){Object.prototype.hasOwnProperty.call(process.env,a)?(s===!0&&(process.env[a]=o[a]),n&&re(s===!0?`"${a}" is already defined in \`process.env\` and WAS overwritten`:`"${a}" is already defined in \`process.env\` and was NOT overwritten`)):process.env[a]=o[a]}),{parsed:o}}catch(o){return n&&re(`Failed to load ${r} ${o.message}`),{error:o}}}var $={config:on,parse:tn};H.exports.config=$.config;H.exports.parse=$.parse;H.exports=$});var lr=R(ar()),fr=R(require("http")),dr=R(require("sharp")),te=require("stream"),pr=R(ur());pr.default.config();var ne=(0,lr.default)(),sn=process.env.NODE_ENV==="production",hr=process.env.BUNNY_API_TOKEN;if(!hr)throw new Error("Undefined Bunny CDN API token");var an="topogether-images",cr=64;ne.use(async function(e,r,t){console.log("Writing CORS headers"),r.setHeader("Access-Control-Allow-Origin",sn?"https://topogether.com":"http://localhost:3000"),r.setHeader("Access-Control-Allow-Methods","GET, PUT, POST"),r.setHeader("Access-Control-Allow-Headers","Content-Type, Origin, Accept, Authorization, x-image-id"),t()});ne.use("/images/upload",async function(e,r){if(console.log("/images/upload"),e.method==="OPTIONS"){r.writeHead(200),r.end();return}let t=e.headers["x-image-id"];if(e.method!=="PUT"||!t){r.writeHead(400),r.end();return}let n=process.env.NODE_ENV==="production"?"":"dev",s=e.pipe(new te.PassThrough),o=e.pipe(new te.PassThrough),a=fetch(`https://storage.bunnycdn.com/${an}/${n}/${t}`,{method:"PUT",headers:{"Content-Type":"application/octet-stream",AccessKey:hr},body:s}),i=un(o).then(b=>(0,dr.default)(b).rotate().resize(cr,cr,{fit:"inside"}).normalize().modulate({saturation:1.2,brightness:1}).removeAlpha().toBuffer({resolveWithObject:!0}).then(({data:g,info:v})=>`data:image/${v.format};base64,${g.toString("base64")}`)),[d,l]=await Promise.all([i,a]);l.ok?(r.writeHead(200,{"Content-Type":"application/json"}),r.write(JSON.stringify({placeholder:d})),r.end()):(console.error("Upload failed:",await l.text()),r.writeHead(l.status),r.end())});fr.default.createServer(ne).listen(5043);function un(e){return new Promise((r,t)=>{let n=[];e.on("data",s=>n.push(s)),e.on("end",()=>{var s=Buffer.concat(n);r(s)}),e.on("error",t)})}
/*!
 * connect
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
/*!
 * ee-first
 * Copyright(c) 2014 Jonathan Ong
 * MIT Licensed
 */
/*!
 * encodeurl
 * Copyright(c) 2016 Douglas Christopher Wilson
 * MIT Licensed
 */
/*!
 * escape-html
 * Copyright(c) 2012-2013 TJ Holowaychuk
 * Copyright(c) 2015 Andreas Lubbe
 * Copyright(c) 2015 Tiancheng "Timothy" Gu
 * MIT Licensed
 */
/*!
 * finalhandler
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 * MIT Licensed
 */
/*!
 * on-finished
 * Copyright(c) 2013 Jonathan Ong
 * Copyright(c) 2014 Douglas Christopher Wilson
 * MIT Licensed
 */
/*!
 * parseurl
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 * MIT Licensed
 */
/*!
 * statuses
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2016 Douglas Christopher Wilson
 * MIT Licensed
 */
/*!
 * unpipe
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
