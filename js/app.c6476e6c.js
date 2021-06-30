(function(e){function t(t){for(var s,i,r=t[0],o=t[1],u=t[2],b=0,f=[];b<r.length;b++)i=r[b],Object.prototype.hasOwnProperty.call(a,i)&&a[i]&&f.push(a[i][0]),a[i]=0;for(s in o)Object.prototype.hasOwnProperty.call(o,s)&&(e[s]=o[s]);l&&l(t);while(f.length)f.shift()();return c.push.apply(c,u||[]),n()}function n(){for(var e,t=0;t<c.length;t++){for(var n=c[t],s=!0,r=1;r<n.length;r++){var o=n[r];0!==a[o]&&(s=!1)}s&&(c.splice(t--,1),e=i(i.s=n[0]))}return e}var s={},a={app:0},c=[];function i(t){if(s[t])return s[t].exports;var n=s[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=s,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)i.d(n,s,function(t){return e[t]}.bind(null,s));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/";var r=window["webpackJsonp"]=window["webpackJsonp"]||[],o=r.push.bind(r);r.push=t,r=r.slice();for(var u=0;u<r.length;u++)t(r[u]);var l=o;c.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("cd49")},"7e6c":function(e,t,n){},"87b1":function(e,t,n){},bd00:function(e,t,n){"use strict";n("87b1")},cd49:function(e,t,n){"use strict";n.r(t);var s={};n.r(s),n.d(s,"level1",(function(){return ue})),n.d(s,"level2",(function(){return le}));var a={};n.r(a),n.d(a,"ladder",(function(){return be})),n.d(a,"fallTest",(function(){return fe})),n.d(a,"verticalPlatform",(function(){return he})),n.d(a,"jump",(function(){return pe})),n.d(a,"impossiblePlatform",(function(){return ge})),n.d(a,"impossibleTrampoline",(function(){return de})),n.d(a,"thinGap",(function(){return we})),n.d(a,"chunkPads",(function(){return ke})),n.d(a,"chunkBedHop",(function(){return Le})),n.d(a,"chunkTreeTrunk",(function(){return Ee})),n.d(a,"chunkStairCase",(function(){return Ce})),n.d(a,"chunkTightLeap",(function(){return Se})),n.d(a,"chunkFlamingDeath",(function(){return Pe})),n.d(a,"chunkShortDrop",(function(){return Ge})),n.d(a,"chunkWallGap",(function(){return Te}));n("e260"),n("e6cf"),n("cca6"),n("a79d");var c=n("7a23"),i={id:"app"};function r(e,t,n,s,a,r){var o=Object(c["l"])("game");return Object(c["h"])(),Object(c["c"])("div",i,[Object(c["f"])(o)])}n("b0c0"),n("a4d3"),n("e01a");var o=Object(c["r"])("data-v-7765df94");Object(c["j"])("data-v-7765df94");var u={class:"game"},l={ref:"canvas"},b={key:0},f={key:1},h=Object(c["e"])(" show vectors "),j=Object(c["f"])("br",null,null,-1),O=Object(c["e"])(" show ghosts "),p=Object(c["f"])("br",null,null,-1),g=Object(c["e"])(" show collisions ");Object(c["i"])();var d=o((function(e,t,n,s,a,i){return Object(c["h"])(),Object(c["c"])("div",u,[Object(c["f"])("div",null,[Object(c["p"])(Object(c["f"])("select",{class:"level-select","onUpdate:modelValue":t[1]||(t[1]=function(t){return e.level=t})},[(Object(c["h"])(!0),Object(c["c"])(c["a"],null,Object(c["k"])(e.levels,(function(e,t){return Object(c["h"])(),Object(c["c"])("option",{value:t,key:t},Object(c["m"])(e.config.name||t),9,["value"])})),128))],512),[[c["o"],e.level]])]),Object(c["f"])("canvas",l,null,512),e.dat.state&&e.dat.state.isWinner&&e.currentLevel.config.nextLevel?(Object(c["h"])(),Object(c["c"])("pre",b,[Object(c["f"])("a",{href:"",onClick:t[2]||(t[2]=Object(c["q"])((function(){return e.nextLevel&&e.nextLevel.apply(e,arguments)}),["prevent"]))},"next level")])):(Object(c["h"])(),Object(c["c"])("pre",f,Object(c["m"])(e.currentLevel.config.description),1)),e.debug?(Object(c["h"])(),Object(c["c"])(c["a"],{key:2},[Object(c["f"])("label",null,[Object(c["p"])(Object(c["f"])("input",{type:"checkbox","onUpdate:modelValue":t[3]||(t[3]=function(t){return e.state.showVectors=t})},null,512),[[c["n"],e.state.showVectors]]),h]),j,Object(c["f"])("label",null,[Object(c["p"])(Object(c["f"])("input",{type:"checkbox","onUpdate:modelValue":t[4]||(t[4]=function(t){return e.state.showGhosts=t})},null,512),[[c["n"],e.state.showGhosts]]),O]),p,Object(c["f"])("label",null,[Object(c["p"])(Object(c["f"])("input",{type:"checkbox","onUpdate:modelValue":t[5]||(t[5]=function(t){return e.state.showCollisions=t})},null,512),[[c["n"],e.state.showCollisions]]),g])],64)):Object(c["d"])("",!0)])})),y=n("1da1"),v=n("5530");n("96cf"),n("159b"),n("d3b7"),n("3ca3"),n("ddb0"),n("2b3d"),n("ac1f"),n("841c");function w(){return new Worker(n.p+"js/game.worker.9101dfe8.worker.js")}var x=n("2909"),m=n("3835");n("4fad"),n("d81d"),n("dca8"),n("caad"),n("2532"),n("7db0"),n("a15b"),n("4e82"),n("4de4"),n("99af");var k="static",L="collideable",E="killer",_="win-zone",C="drawable",S={name:"",description:"",showCollisions:!1,showVectors:!1,showGhosts:!1};function P(e){for(var t=0,n=Object.entries(e);t<n.length;t++){var s=Object(m["a"])(n[t],2),a=s[0],c=s[1];e[a]=G(c)}return e}function G(e){var t=e.config,n=e.map,s={config:Object.freeze(Object.assign({},S,t)),map:n};return s.config=Object.freeze(s.config),s}function T(){}function D(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1e3,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:T,s={};return function(e,a){var c=Date.now(),i="burndown",r="timer";0===e.dy&&(clearTimeout(s[r]),delete s[i]),null==s[i]&&(s[i]=c+t);var o=0;return c<=s[i]&&(o=(s[i]-c)/1e3),n.call(this,e,a,o)}}D("accel",500,(function(e,t,n){return t.state.up&&n>0?{dy:1.001*n}:{dy:e.dy-.08}}));function A(e){var t=e.map.find((function(e){return"camera"===e.type}));return t.x}function M(e,t){var n=e.getContext("2d"),s=t.map.find((function(e){return"camera"===e.type}));return e.width=2*s.w,e.height=2*s.h,e.style.width="".concat(s.w,"px"),e.style.height="".concat(s.h,"px"),n.scale(2,2),n}function V(e,t){var n=t.getContext("2d");n.clearRect(0,0,t.width,t.height),n.drawImage(e,0,0,t.width/2,t.height/2)}function R(e,t,n){var s=t.map.find((function(e){return"camera"===e.type})),a=n.x,c=s.h-n.y-n.h,i=n.w,r=n.h;e.fillStyle=n.color,t.state.showCollisions&&n.inCollision&&(e.fillStyle="red"),e.fillRect(a-A(t),c,i,r)}function q(e,t){var n=t.map.filter((function(e){return e.properties.includes(C)})),s=t.map.find((function(e){return"camera"===e.type}));n.forEach((function(n){e.strokeStyle="red",e.beginPath();var a=n.x-A(t)+n.w/2,c=s.h-n.y-n.h+n.h/2,i=50*n.dx,r=50*n.dy;e.moveTo(a,c),e.lineTo(a+i,c-r),e.stroke()}))}function F(e,t){var n=t.map.find((function(e){return"camera"===e.type})),s=t.map.filter((function(e){return e.properties.includes(C)}));s.forEach((function(s){e.fillStyle="blue",e.fillRect(s.x0-A(t),n.h-s.y0-s.h,s.w,s.h)}))}function W(e,t){var n=t.map.filter((function(e){return e.properties.includes(C)}));n.forEach((function(n){return R(e,t,n)}))}function z(e,t){var n=t.map.find((function(e){return"camera"===e.type}));e.fillStyle="#333333",e.textAlign="center",e.font="24px monospace",e.fillText("Game Over",n.w/2,n.h/2)}function U(e,t){var n=t.map.find((function(e){return"camera"===e.type}));e.fillStyle="#efefef",e.textAlign="center",e.font="24px monospace",e.fillText(t.config.nextLevel?"You Win!":"Kill Screen",n.w/2,n.h/2)}function H(e,t){var n=e.getContext("2d");n.clearRect(0,0,e.width,e.height),t.state.showGhosts&&F(n,t),W(n,t),t.state.showVectors&&q(n,t),t.state.isAlive||z(n,t),t.state.isWinner&&U(n,t)}function N(e){this.name=e,this.callbacks=[]}function B(){this.events={}}function I(e){if(!(this instanceof I))return new I(e);this.events=new B,this.events.registerEvent("tick"),this.running=!1,this.last=Date.now(),this._frame=0,this._tick=this.tick.bind(this),e&&this.events.addEventListener("tick",e)}N.prototype.registerCallback=function(e){this.callbacks.push(e)},B.prototype.registerEvent=function(e){var t=new N(e);this.events[e]=t},B.prototype.dispatchEvent=function(e,t){this.events[e].callbacks.forEach((function(e){e(t)}))},B.prototype.addEventListener=function(e,t){this.events[e].registerCallback(t)},I.prototype.start=function(){if(!this.running)return this.running=!0,this.last=Date.now(),this._frame=requestAnimationFrame(this._tick),this},I.prototype.stop=function(){return this.running=!1,0!==this._frame&&cancelAnimationFrame(this._frame),this._frame=0,this},I.prototype.tick=function(){this._frame=requestAnimationFrame(this._tick);var e=Date.now(),t=e-this.last;this.events.dispatchEvent("tick",t),this.last=e};var J=n("8785"),K={type:"camera",properties:[],h:300,w:300,x:0,y:0,x0:0,y0:0,dx:.25,dy:0},Y={type:"shape",properties:[C],h:0,w:0,x:0,y:0},Q=Object.assign({},Y,{type:"obstacle",color:"#333333",properties:[k,C,L,E]}),X=Object.assign({},Y,{type:"wall",color:"#999999",properties:[k,C,L]}),Z=Object.assign({},Y,{type:"platform",color:"#333333",properties:[k,C,L],h:1}),$=Object.assign({},Y,{type:"win-zone",color:"#454545",properties:[k,C,L,_]}),ee=Object.assign({},Y,{type:"hero",color:"#333333",properties:[C,L],h:10,w:10,x:30,x0:0,y0:0,dx:.25,dy:0});function te(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:10,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:100,s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:100,c=arguments.length>5&&void 0!==arguments[5]?arguments[5]:{},i=[],r=0;r<e;r++)i.push(Object.assign({},Y,c,{x:Math.random()*(n-t)+t,y:Math.random()*(a-s)+s,w:100*Math.random(),h:1,x0:0,y0:0,dx:-.1*Math.random(),dy:0}));return i}var ne,se;n("5319");function ae(e){return e[0].replace(/^\n/,"").replace(/^(\s+)/gm,"")}for(var ce,ie,re,oe,ue={config:{name:"Level 1",description:ae(ne||(ne=Object(J["a"])(["\n      press any button to begin\n      press any button to jump"]))),nextLevel:"level2"},map:[Object.assign({},K),Object.assign({},$,{w:300,h:300,x:2050,y:0})].concat(Object(x["a"])(te(100,0,2350,150,300,{color:"#dfdfdf"})),[Object.assign({},ee,{x:30,y:1}),Object.assign({},Q,{w:2350,y:-100}),Object.assign({},Z,{x:0,y:0,w:1200}),Object.assign({},Z,{x:1250,w:300}),Object.assign({},Z,{x:1800,w:500}),Object.assign({},Z,{x:1450,y:50,w:400}),Object.assign({},Q,{w:20,y:0,h:10,x:450}),Object.assign({},Q,{w:20,y:0,h:10,x:750}),Object.assign({},Q,{w:20,y:0,h:50,x:900}),Object.assign({},Q,{w:20,y:150,h:1500,x:1800})])},le={config:{name:"Level 2",description:ae(se||(se=Object(J["a"])(["\n      Rinse & repeat"])))},map:[Object.assign({},K),Object.assign({},$,{w:300,h:300,x:3200,y:0})].concat(Object(x["a"])(te(100,0,3500,150,300,{color:"#dfdfdf"})),[Object.assign({},ee,{x:30,y:1}),Object.assign({},Q,{w:3500,y:-100}),Object.assign({},Z,{y:0,w:300}),Object.assign({},Z,{w:100,x:200,y:40}),Object.assign({},Z,{w:500,x:400,y:40}),Object.assign({},Z,{w:50,x:1e3,y:40}),Object.assign({},Z,{w:50,x:1150,y:40}),Object.assign({},Z,{w:50,x:1300,y:40}),Object.assign({},Z,{w:50,x:1450,y:40}),Object.assign({},Z,{w:500,x:1650,y:40}),Object.assign({},Z,{w:200,x:2150,y:160}),Object.assign({},Z,{w:300,x:2530,y:70}),Object.assign({},Z,{w:150,x:2610,y:120}),Object.assign({},Q,{w:20,y:190,h:1e3,x:2860}),Object.assign({},Z,{w:200,x:2950,y:160})])},be=(n("a9e3"),{map:[Object.assign({},K),Object.assign({},ee,{x:30,y:1}),Object.assign({},Q,{w:99999,y:-100}),Object.assign({},Z,{x:0,y:0,w:300}),Object.assign({},Z,{x:200,y:6,w:300}),Object.assign({},Z,{x:400,y:11,w:300})]}),fe={config:{showCollisions:!0,description:ae(ce||(ce=Object(J["a"])(["\n      demonstrates issues with collision\n      detection around two near collidables\n\n      play a few times to see the various responses"])))},map:[Object.assign({},K),Object.assign({},ee,{x:2,y:180,dx:0}),Object.assign({},Z,{x:0,y:110,w:14}),Object.assign({},Q,{x:0,y:-999,w:14,h:1099})]},he={config:{description:ae(ie||(ie=Object(J["a"])(["\n      Platforms do not handle horizontal collisions very well"])))},map:[Object.assign({},K),Object.assign({},ee,{x:30,y:1,dx:.3}),Object.assign({},Z,{x:0,y:0,w:300}),Object.assign({},Z,{x:200,y:0,w:1,h:50}),Object.assign({},Q,{x:250,y:0,w:10,h:50})]},je=[],Oe=0;Oe<30;Oe++)je.push(Object.assign({},Q,{x:200+300*Oe,y:0,w:10,h:10*Oe+1}));for(var pe={map:[Object.assign({},K),Object.assign({},ee,{x:30,y:1}),Object.assign({},Z,{x:0,y:0,w:99999}),Object.assign({},Q,{x:0,y:-100,w:99999,h:0})].concat(je)},ge={config:{description:ae(re||(re=Object(J["a"])(["\n    this platform shouldn't be reachable\n    "])))},map:[Object.assign({},K),Object.assign({},Z,{x:0,y:0,w:300}),Object.assign({},ee,{x:30,y:1,dx:0}),Object.assign({},Z,{x:0,y:140,w:150}),Object.assign({},Q,{x:0,y:270,w:150,h:20})]},de={config:{description:ae(oe||(oe=Object(J["a"])(["\n    Bounce bounce bounce\n    "])))},map:[Object.assign({},K),Object.assign({},Z,{x:0,y:0,w:300}),Object.assign({},ee,{x:30,y:1,dx:0}),Object.assign({},Z,{x:40,y:50,w:50}),Object.assign({},Z,{x:-20,y:50,w:50})]},ye=[],ve=0;ve<500;ve++)ye=ye.concat([Object.assign({},Z,{x:100*ve,y:50,w:100-Number(2*ve)})]);for(var we={config:{showCollisions:!0},map:[Object.assign({},K)].concat(Object(x["a"])(ye),[Object.assign({},ee,{x:30,y:52}),Object.assign({},Q,{x:0,y:0,w:99999,h:10})])},xe=[],me=0;me<50;me++)xe.push(Object.assign({},Z,{x:450+150*me,y:50,w:100-Number(me)}));var ke={map:[Object.assign({},K),Object.assign({},ee,{x:30,y:1}),Object.assign({},Z,{x:0,y:0,w:450})].concat(xe,[Object.assign({},Q,{x:0,y:-100,w:99999,h:0})])},Le={map:[Object.assign({},K),Object.assign({},ee,{x:30,y:1}),Object.assign({},Z,{x:0,y:0,w:900}),Object.assign({},Z,{x:450,y:50,w:200}),Object.assign({},Q,{x:400,y:0,w:300,h:20}),Object.assign({},Q,{x:0,y:-100,w:99999,h:0})]},Ee={map:[Object.assign({},K),Object.assign({},ee,{x:30,y:1}),Object.assign({},Z,{x:0,y:0,w:900}),Object.assign({},Q,{x:450,y:0,w:20,h:60}),Object.assign({},Z,{x:500,y:100,w:100}),Object.assign({},Q,{x:600,y:30,w:20,h:150}),Object.assign({},Z,{x:620,y:150,w:100}),Object.assign({},Q,{x:700,y:0,w:20,h:80}),Object.assign({},Q,{x:0,y:-100,w:99999,h:0})]};function _e(e){for(var t=[],n=1;n<=e.count;n++){var s=e.stepWidth,a=e.x+s*n,c=e.stepHeight*n,i=c-e.gap,r=a-e.overhang;t.push(Object.assign({},Z,{x:r,y:c,w:s})),t.push(Object.assign({},Q,{x:a,y:0,w:s,h:i}))}return t}var Ce={map:[Object.assign({},K),Object.assign({},ee,{x:30,y:1}),Object.assign({},Z,{x:0,y:0,w:900})].concat(Object(x["a"])(_e({count:4,x:450,y:0,stepHeight:30,stepWidth:150,gap:10,overhang:75})),[Object.assign({},Q,{x:0,y:-100,w:99999,h:0})])},Se={map:[Object.assign({},K),Object.assign({},ee,{x:30,y:1}),Object.assign({},Q,{x:0,y:-100,w:99999,h:0}),Object.assign({},Z,{x:0,y:0,w:400}),Object.assign({},Q,{x:450,y:120,w:20,h:300}),Object.assign({},Z,{x:520,y:0,w:300}),Object.assign({},Q,{x:840,y:80,w:20,h:300}),Object.assign({},Z,{x:880,y:0,w:300})]},Pe={map:[Object.assign({},K),Object.assign({},ee,{x:30,y:1}),Object.assign({},Z,{x:0,y:0,w:500}),Object.assign({},Q,{x:0,y:-100,w:99999,h:0}),Object.assign({},Q,{x:290,y:0,w:20,h:40}),Object.assign({},Q,{x:290,y:80,w:20,h:300})]},Ge={map:[Object.assign({},K),Object.assign({},ee,{x:30,y:51}),Object.assign({},Z,{x:0,y:50,w:250}),Object.assign({},Q,{x:0,y:-100,w:99999,h:0}),Object.assign({},Q,{x:290,y:55,w:20,h:300}),Object.assign({},X,{x:450,y:80,w:10,h:300}),Object.assign({},Z,{x:275,y:10,w:50}),Object.assign({},Z,{x:400,y:80,w:500})]},Te={map:[Object.assign({},K),Object.assign({},ee,{x:30,y:1}),Object.assign({},Z,{x:0,y:0,w:1500}),Object.assign({},Q,{x:0,y:-100,w:99999,h:0}),Object.assign({},Z,{x:0,y:80,w:900}),Object.assign({},X,{x:0,y:70,w:400,h:10}),Object.assign({},X,{x:500,y:70,w:400,h:10}),Object.assign({},Z,{x:1e3,y:80,w:500}),Object.assign({},X,{x:1e3,y:70,w:500,h:10})]},De=n("5c40"),Ae=n("a1e9"),Me=new w,Ve=new I;function Re(e,t){var n={};return t.forEach((function(t){n[t]=function(){for(var n=arguments.length,s=new Array(n),a=0;a<n;a++)s[a]=arguments[a];e.postMessage({event:t,args:s})}})),n}var qe=Object(De["k"])({setup:function(){var e=Object(v["a"])({},Re(Me,["loadGame","requestFrame"])),t=e.loadGame,n=e.requestFrame;function c(e){H(g.value,e),V(g.value,p.value)}function i(){return r.apply(this,arguments)}function r(){return r=Object(y["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:t(d.value);case 1:case"end":return e.stop()}}),e)}))),r.apply(this,arguments)}function o(){d.value.config.nextLevel&&(Ve.stop(),j.value=d.value.config.nextLevel,i())}function u(e){var t=e.data,n=t.event,s=t.response;O.value=s,"requestFrame"===n&&c(s),s.state.isAlive||Ve.stop(),"loadGame"===n&&(M(g.value,s),M(p.value,s),c(s))}var l=new URLSearchParams(window.location.search,!0),b=l.has("debug"),f=Object(Ae["j"])({up:!1,showVectors:!1,showGhosts:!1,showCollisions:!1}),h=P(Object(v["a"])(Object(v["a"])({},s),a)),j=Object(Ae["k"])("level1"),O=Object(Ae["k"])({config:{}}),p=Object(Ae["k"])(),g=Object(Ae["k"])(),d=Object(De["d"])((function(){return h[j.value]}));return Object(De["q"])((function(){g.value=p.value.cloneNode(),Ve.events.addEventListener("tick",(function(e){return n(Object(v["a"])(Object(v["a"])({},f),{},{dt:e}))})),Me.addEventListener("message",(function(e){return u(e)}));var e=function(){f.up=!0,O.value.state&&!O.value.state.isAlive?i():Ve.running||Ve.start()},t=function(e){e.preventDefault(),e.stopPropagation(),f.up=!1};document.addEventListener("contextmenu",(function(e){return e.preventDefault()})),document.addEventListener("touchstart",e),document.addEventListener("keydown",e),document.addEventListener("touchend",t),document.addEventListener("keyup",t)})),Object(De["r"])((function(){Me.terminate()})),Object(De["D"])("level",(function(){return i()}),{immediate:!0}),Object(De["D"])("state",(function(){return c(O.value)})),{debug:b,levels:h,level:j,currentLevel:d,state:f,dat:O,canvas:p,nextLevel:o}}});n("fff1");qe.render=d,qe.__scopeId="data-v-7765df94";var Fe=qe,We=Object(c["g"])({components:{Game:Fe},name:"app"});n("bd00");We.render=r;var ze=We;Object(c["b"])(ze).mount("#app")},fff1:function(e,t,n){"use strict";n("7e6c")}});
//# sourceMappingURL=app.c6476e6c.js.map