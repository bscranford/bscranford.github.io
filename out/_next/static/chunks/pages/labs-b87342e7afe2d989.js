(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[274],{7261:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/labs",function(){return n(4126)}])},6101:function(e,t){"use strict";var n,r,o,u;Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}(t,{ACTION_FAST_REFRESH:function(){return s},ACTION_NAVIGATE:function(){return f},ACTION_PREFETCH:function(){return a},ACTION_REFRESH:function(){return l},ACTION_RESTORE:function(){return c},ACTION_SERVER_ACTION:function(){return d},ACTION_SERVER_PATCH:function(){return i},PrefetchCacheEntryStatus:function(){return r},PrefetchKind:function(){return n},isThenable:function(){return p}});let l="refresh",f="navigate",c="restore",i="server-patch",a="prefetch",s="fast-refresh",d="server-action";function p(e){return e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof e.then}(o=n||(n={})).AUTO="auto",o.FULL="full",o.TEMPORARY="temporary",(u=r||(r={})).fresh="fresh",u.reusable="reusable",u.expired="expired",u.stale="stale",("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},7670:function(e,t,n){"use strict";function r(e,t,n,r){return!1}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"getDomainLocale",{enumerable:!0,get:function(){return r}}),n(1297),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},4116:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return O}});let r=n(8754),o=n(5893),u=r._(n(7294)),l=n(9975),f=n(2712),c=n(8547),i=n(4350),a=n(8109),s=n(4494),d=n(5716),p=n(388),h=n(7670),y=n(6220),b=n(6101),_=new Set;function v(e,t,n,r,o,u){if(u||(0,f.isLocalURL)(t)){if(!r.bypassPrefetchedCheck){let o=t+"%"+n+"%"+(void 0!==r.locale?r.locale:"locale"in e?e.locale:void 0);if(_.has(o))return;_.add(o)}(async()=>u?e.prefetch(t,o):e.prefetch(t,n,r))().catch(e=>{})}}function j(e){return"string"==typeof e?e:(0,c.formatUrl)(e)}let O=u.default.forwardRef(function(e,t){let n,r;let{href:c,as:_,children:O,prefetch:C=null,passHref:E,replace:g,shallow:P,scroll:T,locale:m,onClick:x,onMouseEnter:M,onTouchStart:R,legacyBehavior:A=!1,...k}=e;n=O,A&&("string"==typeof n||"number"==typeof n)&&(n=(0,o.jsx)("a",{children:n}));let I=u.default.useContext(s.RouterContext),N=u.default.useContext(d.AppRouterContext),w=null!=I?I:N,L=!I,S=!1!==C,U=null===C?b.PrefetchKind.AUTO:b.PrefetchKind.FULL,{href:H,as:K}=u.default.useMemo(()=>{if(!I){let e=j(c);return{href:e,as:_?j(_):e}}let[e,t]=(0,l.resolveHref)(I,c,!0);return{href:e,as:_?(0,l.resolveHref)(I,_):t||e}},[I,c,_]),F=u.default.useRef(H),D=u.default.useRef(K);A&&(r=u.default.Children.only(n));let V=A?r&&"object"==typeof r&&r.ref:t,[X,q,z]=(0,p.useIntersection)({rootMargin:"200px"}),B=u.default.useCallback(e=>{(D.current!==K||F.current!==H)&&(z(),D.current=K,F.current=H),X(e),V&&("function"==typeof V?V(e):"object"==typeof V&&(V.current=e))},[K,V,H,z,X]);u.default.useEffect(()=>{w&&q&&S&&v(w,H,K,{locale:m},{kind:U},L)},[K,H,q,m,S,null==I?void 0:I.locale,w,L,U]);let G={ref:B,onClick(e){A||"function"!=typeof x||x(e),A&&r.props&&"function"==typeof r.props.onClick&&r.props.onClick(e),w&&!e.defaultPrevented&&function(e,t,n,r,o,l,c,i,a){let{nodeName:s}=e.currentTarget;if("A"===s.toUpperCase()&&(function(e){let t=e.currentTarget.getAttribute("target");return t&&"_self"!==t||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.nativeEvent&&2===e.nativeEvent.which}(e)||!a&&!(0,f.isLocalURL)(n)))return;e.preventDefault();let d=()=>{let e=null==c||c;"beforePopState"in t?t[o?"replace":"push"](n,r,{shallow:l,locale:i,scroll:e}):t[o?"replace":"push"](r||n,{scroll:e})};a?u.default.startTransition(d):d()}(e,w,H,K,g,P,T,m,L)},onMouseEnter(e){A||"function"!=typeof M||M(e),A&&r.props&&"function"==typeof r.props.onMouseEnter&&r.props.onMouseEnter(e),w&&(S||!L)&&v(w,H,K,{locale:m,priority:!0,bypassPrefetchedCheck:!0},{kind:U},L)},onTouchStart:function(e){A||"function"!=typeof R||R(e),A&&r.props&&"function"==typeof r.props.onTouchStart&&r.props.onTouchStart(e),w&&(S||!L)&&v(w,H,K,{locale:m,priority:!0,bypassPrefetchedCheck:!0},{kind:U},L)}};if((0,i.isAbsoluteUrl)(K))G.href=K;else if(!A||E||"a"===r.type&&!("href"in r.props)){let e=void 0!==m?m:null==I?void 0:I.locale,t=(null==I?void 0:I.isLocaleDomain)&&(0,h.getDomainLocale)(K,e,null==I?void 0:I.locales,null==I?void 0:I.domainLocales);G.href=t||(0,y.addBasePath)((0,a.addLocale)(K,e,null==I?void 0:I.defaultLocale))}return A?u.default.cloneElement(r,G):(0,o.jsx)("a",{...k,...G,children:n})});("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},388:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"useIntersection",{enumerable:!0,get:function(){return c}});let r=n(7294),o=n(460),u="function"==typeof IntersectionObserver,l=new Map,f=[];function c(e){let{rootRef:t,rootMargin:n,disabled:c}=e,i=c||!u,[a,s]=(0,r.useState)(!1),d=(0,r.useRef)(null),p=(0,r.useCallback)(e=>{d.current=e},[]);return(0,r.useEffect)(()=>{if(u){if(i||a)return;let e=d.current;if(e&&e.tagName)return function(e,t,n){let{id:r,observer:o,elements:u}=function(e){let t;let n={root:e.root||null,margin:e.rootMargin||""},r=f.find(e=>e.root===n.root&&e.margin===n.margin);if(r&&(t=l.get(r)))return t;let o=new Map;return t={id:n,observer:new IntersectionObserver(e=>{e.forEach(e=>{let t=o.get(e.target),n=e.isIntersecting||e.intersectionRatio>0;t&&n&&t(n)})},e),elements:o},f.push(n),l.set(n,t),t}(n);return u.set(e,t),o.observe(e),function(){if(u.delete(e),o.unobserve(e),0===u.size){o.disconnect(),l.delete(r);let e=f.findIndex(e=>e.root===r.root&&e.margin===r.margin);e>-1&&f.splice(e,1)}}}(e,e=>e&&s(e),{root:null==t?void 0:t.current,rootMargin:n})}else if(!a){let e=(0,o.requestIdleCallback)(()=>s(!0));return()=>(0,o.cancelIdleCallback)(e)}},[i,n,t,a,d.current]),[p,a,(0,r.useCallback)(()=>{s(!1)},[])]}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},4126:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return l}});var r=n(5893),o=n(1664),u=n.n(o);function l(){return(0,r.jsxs)("main",{children:[(0,r.jsx)("header",{className:"wrapper",children:(0,r.jsx)("h1",{children:"Projects"})}),(0,r.jsx)("section",{className:"content-wrapper",children:(0,r.jsx)("ul",{children:(0,r.jsx)("li",{children:(0,r.jsx)(u(),{href:"/labs/jeopardy",children:"Jeopardy"})})})}),(0,r.jsx)("footer",{children:(0,r.jsx)(u(),{href:"/",children:"Home"})})]})}},1664:function(e,t,n){e.exports=n(4116)}},function(e){e.O(0,[888,774,179],function(){return e(e.s=7261)}),_N_E=e.O()}]);