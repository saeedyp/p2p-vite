if(!self.define){let e,i={};const n=(n,r)=>(n=new URL(n+".js",r).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(r,s)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(i[c])return;let o={};const d=e=>n(e,c),f={module:{uri:c},exports:o,require:d};i[c]=Promise.all(r.map((e=>f[e]||d(e)))).then((e=>(s(...e),o)))}}define(["./workbox-7cfec069"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index-0e930e87.css",revision:null},{url:"assets/index-ae4945c7.js",revision:null},{url:"index.html",revision:"c2f7d3ebf954edc145f410bdd7bdd4bb"},{url:"registerSW.js",revision:"a8cb852e1423dcdb087ce81be8dc5be9"},{url:"favicon.ico",revision:"cae8226c6d9e9a88c70a46575320cbf9"},{url:"apple-touch-icon.png",revision:"674b3d6f35430984f23eff7f9a452659"},{url:"android-chrome-192x192.png",revision:"faae8462fd6953b2305e951843c55205"},{url:"android-chrome-512x512.png",revision:"d780f4be662e09af7962d7242fca2f4b"},{url:"manifest.webmanifest",revision:"b9f20cbfec2c39125f0b96ac49fd6dc0"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
