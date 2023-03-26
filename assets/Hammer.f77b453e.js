var Z=Object.defineProperty;var q=Object.getOwnPropertySymbols;var tt=Object.prototype.hasOwnProperty,et=Object.prototype.propertyIsEnumerable;var X=(h,u,r)=>u in h?Z(h,u,{enumerable:!0,configurable:!0,writable:!0,value:r}):h[u]=r,D=(h,u)=>{for(var r in u||(u={}))tt.call(u,r)&&X(h,r,u[r]);if(q)for(var r of q(u))et.call(u,r)&&X(h,r,u[r]);return h};function rt(h,u){return u.forEach(function(r){r&&typeof r!="string"&&!Array.isArray(r)&&Object.keys(r).forEach(function(e){if(e!=="default"&&!(e in h)){var s=Object.getOwnPropertyDescriptor(r,e);Object.defineProperty(h,e,s.get?s:{enumerable:!0,get:function(){return r[e]}})}})}),Object.freeze(Object.defineProperty(h,Symbol.toStringTag,{value:"Module"}))}var m=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{},z={exports:{}},b={exports:{}};/*!
 * Zdog v1.1.3
 * Round, flat, designer-friendly pseudo-3D engine
 * Licensed MIT
 * https://zzz.dog
 * Copyright 2020 Metafizzy
 */(function(h){(function(u,r){h.exports?h.exports=r():u.Zdog=r()})(m,function(){var r={};r.TAU=Math.PI*2,r.extend=function(s,a){for(var c in a)s[c]=a[c];return s},r.lerp=function(s,a,c){return(a-s)*c+s},r.modulo=function(s,a){return(s%a+a)%a};var e={2:function(s){return s*s},3:function(s){return s*s*s},4:function(s){return s*s*s*s},5:function(s){return s*s*s*s*s}};return r.easeInOut=function(s,a){if(a==1)return s;s=Math.max(0,Math.min(1,s));var c=s<.5,t=c?s:1-s;t/=.5;var o=e[a]||e[2],n=o(t);return n/=2,c?n:1-n},r})})(b);var L={exports:{}};(function(h){(function(u,r){h.exports?h.exports=r():u.Zdog.CanvasRenderer=r()})(m,function(){var r={isCanvas:!0};return r.begin=function(e){e.beginPath()},r.move=function(e,s,a){e.moveTo(a.x,a.y)},r.line=function(e,s,a){e.lineTo(a.x,a.y)},r.bezier=function(e,s,a,c,t){e.bezierCurveTo(a.x,a.y,c.x,c.y,t.x,t.y)},r.closePath=function(e){e.closePath()},r.setPath=function(){},r.renderPath=function(e,s,a,c){this.begin(e,s),a.forEach(function(t){t.render(e,s,r)}),c&&this.closePath(e,s)},r.stroke=function(e,s,a,c,t){!a||(e.strokeStyle=c,e.lineWidth=t,e.stroke())},r.fill=function(e,s,a,c){!a||(e.fillStyle=c,e.fill())},r.end=function(){},r})})(L);var U={exports:{}};(function(h){(function(u,r){h.exports?h.exports=r():u.Zdog.SvgRenderer=r()})(m,function(){var r={isSvg:!0},e=r.round=function(a){return Math.round(a*1e3)/1e3};function s(a){return e(a.x)+","+e(a.y)+" "}return r.begin=function(){},r.move=function(a,c,t){return"M"+s(t)},r.line=function(a,c,t){return"L"+s(t)},r.bezier=function(a,c,t,o,n){return"C"+s(t)+s(o)+s(n)},r.closePath=function(){return"Z"},r.setPath=function(a,c,t){c.setAttribute("d",t)},r.renderPath=function(a,c,t,o){var n="";t.forEach(function(i){n+=i.render(a,c,r)}),o&&(n+=this.closePath(a,c)),this.setPath(a,c,n)},r.stroke=function(a,c,t,o,n){!t||(c.setAttribute("stroke",o),c.setAttribute("stroke-width",n))},r.fill=function(a,c,t,o){var n=t?o:"none";c.setAttribute("fill",n)},r.end=function(a,c){a.appendChild(c)},r})})(U);var G={exports:{}};(function(h){(function(u,r){if(h.exports)h.exports=r(b.exports);else{var e=u.Zdog;e.Vector=r(e)}})(m,function(r){function e(t){this.set(t)}var s=r.TAU;e.prototype.set=function(t){return this.x=t&&t.x||0,this.y=t&&t.y||0,this.z=t&&t.z||0,this},e.prototype.write=function(t){return t?(this.x=t.x!=null?t.x:this.x,this.y=t.y!=null?t.y:this.y,this.z=t.z!=null?t.z:this.z,this):this},e.prototype.rotate=function(t){if(!!t)return this.rotateZ(t.z),this.rotateY(t.y),this.rotateX(t.x),this},e.prototype.rotateZ=function(t){a(this,t,"x","y")},e.prototype.rotateX=function(t){a(this,t,"y","z")},e.prototype.rotateY=function(t){a(this,t,"x","z")};function a(t,o,n,i){if(!(!o||o%s===0)){var p=Math.cos(o),f=Math.sin(o),d=t[n],l=t[i];t[n]=d*p-l*f,t[i]=l*p+d*f}}e.prototype.isSame=function(t){return t?this.x===t.x&&this.y===t.y&&this.z===t.z:!1},e.prototype.add=function(t){return t?(this.x+=t.x||0,this.y+=t.y||0,this.z+=t.z||0,this):this},e.prototype.subtract=function(t){return t?(this.x-=t.x||0,this.y-=t.y||0,this.z-=t.z||0,this):this},e.prototype.multiply=function(t){return t==null?this:(typeof t=="number"?(this.x*=t,this.y*=t,this.z*=t):(this.x*=t.x!=null?t.x:1,this.y*=t.y!=null?t.y:1,this.z*=t.z!=null?t.z:1),this)},e.prototype.transform=function(t,o,n){return this.multiply(n),this.rotate(o),this.add(t),this},e.prototype.lerp=function(t,o){return this.x=r.lerp(this.x,t.x||0,o),this.y=r.lerp(this.y,t.y||0,o),this.z=r.lerp(this.z,t.z||0,o),this},e.prototype.magnitude=function(){var t=this.x*this.x+this.y*this.y+this.z*this.z;return c(t)};function c(t){return Math.abs(t-1)<1e-8?1:Math.sqrt(t)}return e.prototype.magnitude2d=function(){var t=this.x*this.x+this.y*this.y;return c(t)},e.prototype.copy=function(){return new e(this)},e})})(G);var P={exports:{}};(function(h){(function(u,r){if(h.exports)h.exports=r(b.exports,G.exports,L.exports,U.exports);else{var e=u.Zdog;e.Anchor=r(e,e.Vector,e.CanvasRenderer,e.SvgRenderer)}})(m,function(r,e,s,a){var c=r.TAU,t={x:1,y:1,z:1};function o(i){this.create(i||{})}o.prototype.create=function(i){this.children=[],r.extend(this,this.constructor.defaults),this.setOptions(i),this.translate=new e(i.translate),this.rotate=new e(i.rotate),this.scale=new e(t).multiply(this.scale),this.origin=new e,this.renderOrigin=new e,this.addTo&&this.addTo.addChild(this)},o.defaults={},o.optionKeys=Object.keys(o.defaults).concat(["rotate","translate","scale","addTo"]),o.prototype.setOptions=function(i){var p=this.constructor.optionKeys;for(var f in i)p.indexOf(f)!=-1&&(this[f]=i[f])},o.prototype.addChild=function(i){this.children.indexOf(i)==-1&&(i.remove(),i.addTo=this,this.children.push(i))},o.prototype.removeChild=function(i){var p=this.children.indexOf(i);p!=-1&&this.children.splice(p,1)},o.prototype.remove=function(){this.addTo&&this.addTo.removeChild(this)},o.prototype.update=function(){this.reset(),this.children.forEach(function(i){i.update()}),this.transform(this.translate,this.rotate,this.scale)},o.prototype.reset=function(){this.renderOrigin.set(this.origin)},o.prototype.transform=function(i,p,f){this.renderOrigin.transform(i,p,f),this.children.forEach(function(d){d.transform(i,p,f)})},o.prototype.updateGraph=function(){this.update(),this.updateFlatGraph(),this.flatGraph.forEach(function(i){i.updateSortValue()}),this.flatGraph.sort(o.shapeSorter)},o.shapeSorter=function(i,p){return i.sortValue-p.sortValue},Object.defineProperty(o.prototype,"flatGraph",{get:function(){return this._flatGraph||this.updateFlatGraph(),this._flatGraph},set:function(i){this._flatGraph=i}}),o.prototype.updateFlatGraph=function(){this.flatGraph=this.getFlatGraph()},o.prototype.getFlatGraph=function(){var i=[this];return this.addChildFlatGraph(i)},o.prototype.addChildFlatGraph=function(i){return this.children.forEach(function(p){var f=p.getFlatGraph();Array.prototype.push.apply(i,f)}),i},o.prototype.updateSortValue=function(){this.sortValue=this.renderOrigin.z},o.prototype.render=function(){},o.prototype.renderGraphCanvas=function(i){if(!i)throw new Error("ctx is "+i+". Canvas context required for render. Check .renderGraphCanvas( ctx ).");this.flatGraph.forEach(function(p){p.render(i,s)})},o.prototype.renderGraphSvg=function(i){if(!i)throw new Error("svg is "+i+". SVG required for render. Check .renderGraphSvg( svg ).");this.flatGraph.forEach(function(p){p.render(i,a)})},o.prototype.copy=function(i){var p={},f=this.constructor.optionKeys;f.forEach(function(l){p[l]=this[l]},this),r.extend(p,i);var d=this.constructor;return new d(p)},o.prototype.copyGraph=function(i){var p=this.copy(i);return this.children.forEach(function(f){f.copyGraph({addTo:p})}),p},o.prototype.normalizeRotate=function(){this.rotate.x=r.modulo(this.rotate.x,c),this.rotate.y=r.modulo(this.rotate.y,c),this.rotate.z=r.modulo(this.rotate.z,c)};function n(i){return function(p){function f(d){this.create(d||{})}return f.prototype=Object.create(i.prototype),f.prototype.constructor=f,f.defaults=r.extend({},i.defaults),r.extend(f.defaults,p),f.optionKeys=i.optionKeys.slice(0),Object.keys(f.defaults).forEach(function(d){!f.optionKeys.indexOf(d)!=1&&f.optionKeys.push(d)}),f.subclass=n(f),f}}return o.subclass=n(o),o})})(P);var j={exports:{}};(function(h){(function(u,r){h.exports?h.exports=r():u.Zdog.Dragger=r()})(m,function(){var r=typeof window!="undefined",e="mousedown",s="mousemove",a="mouseup";r&&(window.PointerEvent?(e="pointerdown",s="pointermove",a="pointerup"):"ontouchstart"in window&&(e="touchstart",s="touchmove",a="touchend"));function c(){}function t(o){this.create(o||{})}return t.prototype.create=function(o){this.onDragStart=o.onDragStart||c,this.onDragMove=o.onDragMove||c,this.onDragEnd=o.onDragEnd||c,this.bindDrag(o.startElement)},t.prototype.bindDrag=function(o){o=this.getQueryElement(o),o&&(o.style.touchAction="none",o.addEventListener(e,this))},t.prototype.getQueryElement=function(o){return typeof o=="string"&&(o=document.querySelector(o)),o},t.prototype.handleEvent=function(o){var n=this["on"+o.type];n&&n.call(this,o)},t.prototype.onmousedown=t.prototype.onpointerdown=function(o){this.dragStart(o,o)},t.prototype.ontouchstart=function(o){this.dragStart(o,o.changedTouches[0])},t.prototype.dragStart=function(o,n){o.preventDefault(),this.dragStartX=n.pageX,this.dragStartY=n.pageY,r&&(window.addEventListener(s,this),window.addEventListener(a,this)),this.onDragStart(n)},t.prototype.ontouchmove=function(o){this.dragMove(o,o.changedTouches[0])},t.prototype.onmousemove=t.prototype.onpointermove=function(o){this.dragMove(o,o)},t.prototype.dragMove=function(o,n){o.preventDefault();var i=n.pageX-this.dragStartX,p=n.pageY-this.dragStartY;this.onDragMove(n,i,p)},t.prototype.onmouseup=t.prototype.onpointerup=t.prototype.ontouchend=t.prototype.dragEnd=function(){window.removeEventListener(s,this),window.removeEventListener(a,this),this.onDragEnd()},t})})(j);var Y={exports:{}};(function(h){(function(u,r){if(h.exports)h.exports=r(b.exports,P.exports,j.exports);else{var e=u.Zdog;e.Illustration=r(e,e.Anchor,e.Dragger)}})(m,function(r,e,s){function a(){}var c=r.TAU,t=e.subclass({element:void 0,centered:!0,zoom:1,dragRotate:!1,resize:!1,onPrerender:a,onDragStart:a,onDragMove:a,onDragEnd:a,onResize:a});r.extend(t.prototype,s.prototype),t.prototype.create=function(n){e.prototype.create.call(this,n),s.prototype.create.call(this,n),this.setElement(this.element),this.setDragRotate(this.dragRotate),this.setResize(this.resize)},t.prototype.setElement=function(n){if(n=this.getQueryElement(n),!n)throw new Error("Zdog.Illustration element required. Set to "+n);var i=n.nodeName.toLowerCase();i=="canvas"?this.setCanvas(n):i=="svg"&&this.setSvg(n)},t.prototype.setSize=function(n,i){n=Math.round(n),i=Math.round(i),this.isCanvas?this.setSizeCanvas(n,i):this.isSvg&&this.setSizeSvg(n,i)},t.prototype.setResize=function(n){this.resize=n,this.resizeListener||(this.resizeListener=this.onWindowResize.bind(this)),n?(window.addEventListener("resize",this.resizeListener),this.onWindowResize()):window.removeEventListener("resize",this.resizeListener)},t.prototype.onWindowResize=function(){this.setMeasuredSize(),this.onResize(this.width,this.height)},t.prototype.setMeasuredSize=function(){var n,i,p=this.resize=="fullscreen";if(p)n=window.innerWidth,i=window.innerHeight;else{var f=this.element.getBoundingClientRect();n=f.width,i=f.height}this.setSize(n,i)},t.prototype.renderGraph=function(n){this.isCanvas?this.renderGraphCanvas(n):this.isSvg&&this.renderGraphSvg(n)},t.prototype.updateRenderGraph=function(n){this.updateGraph(),this.renderGraph(n)},t.prototype.setCanvas=function(n){this.element=n,this.isCanvas=!0,this.ctx=this.element.getContext("2d"),this.setSizeCanvas(n.width,n.height)},t.prototype.setSizeCanvas=function(n,i){this.width=n,this.height=i;var p=this.pixelRatio=window.devicePixelRatio||1;this.element.width=this.canvasWidth=n*p,this.element.height=this.canvasHeight=i*p;var f=p>1&&!this.resize;f&&(this.element.style.width=n+"px",this.element.style.height=i+"px")},t.prototype.renderGraphCanvas=function(n){n=n||this,this.prerenderCanvas(),e.prototype.renderGraphCanvas.call(n,this.ctx),this.postrenderCanvas()},t.prototype.prerenderCanvas=function(){var n=this.ctx;if(n.lineCap="round",n.lineJoin="round",n.clearRect(0,0,this.canvasWidth,this.canvasHeight),n.save(),this.centered){var i=this.width/2*this.pixelRatio,p=this.height/2*this.pixelRatio;n.translate(i,p)}var f=this.pixelRatio*this.zoom;n.scale(f,f),this.onPrerender(n)},t.prototype.postrenderCanvas=function(){this.ctx.restore()},t.prototype.setSvg=function(n){this.element=n,this.isSvg=!0,this.pixelRatio=1;var i=n.getAttribute("width"),p=n.getAttribute("height");this.setSizeSvg(i,p)},t.prototype.setSizeSvg=function(n,i){this.width=n,this.height=i;var p=n/this.zoom,f=i/this.zoom,d=this.centered?-p/2:0,l=this.centered?-f/2:0;this.element.setAttribute("viewBox",d+" "+l+" "+p+" "+f),this.resize?(this.element.removeAttribute("width"),this.element.removeAttribute("height")):(this.element.setAttribute("width",n),this.element.setAttribute("height",i))},t.prototype.renderGraphSvg=function(n){n=n||this,o(this.element),this.onPrerender(this.element),e.prototype.renderGraphSvg.call(n,this.element)};function o(n){for(;n.firstChild;)n.removeChild(n.firstChild)}return t.prototype.setDragRotate=function(n){if(n)n===!0&&(n=this);else return;this.dragRotate=n,this.bindDrag(this.element)},t.prototype.dragStart=function(){this.dragStartRX=this.dragRotate.rotate.x,this.dragStartRY=this.dragRotate.rotate.y,s.prototype.dragStart.apply(this,arguments)},t.prototype.dragMove=function(n,i){var p=i.pageX-this.dragStartX,f=i.pageY-this.dragStartY,d=Math.min(this.width,this.height),l=p/d*c,y=f/d*c;this.dragRotate.rotate.x=this.dragStartRX-y,this.dragRotate.rotate.y=this.dragStartRY-l,s.prototype.dragMove.apply(this,arguments)},t})})(Y);var k={exports:{}};(function(h){(function(u,r){if(h.exports)h.exports=r(G.exports);else{var e=u.Zdog;e.PathCommand=r(e.Vector)}})(m,function(r){function e(t,o,n){this.method=t,this.points=o.map(s),this.renderPoints=o.map(a),this.previousPoint=n,this.endRenderPoint=this.renderPoints[this.renderPoints.length-1],t=="arc"&&(this.controlPoints=[new r,new r])}function s(t){return t instanceof r?t:new r(t)}function a(t){return new r(t)}e.prototype.reset=function(){var t=this.points;this.renderPoints.forEach(function(o,n){var i=t[n];o.set(i)})},e.prototype.transform=function(t,o,n){this.renderPoints.forEach(function(i){i.transform(t,o,n)})},e.prototype.render=function(t,o,n){return this[this.method](t,o,n)},e.prototype.move=function(t,o,n){return n.move(t,o,this.renderPoints[0])},e.prototype.line=function(t,o,n){return n.line(t,o,this.renderPoints[0])},e.prototype.bezier=function(t,o,n){var i=this.renderPoints[0],p=this.renderPoints[1],f=this.renderPoints[2];return n.bezier(t,o,i,p,f)};var c=9/16;return e.prototype.arc=function(t,o,n){var i=this.previousPoint,p=this.renderPoints[0],f=this.renderPoints[1],d=this.controlPoints[0],l=this.controlPoints[1];return d.set(i).lerp(p,c),l.set(f).lerp(p,c),n.bezier(t,o,d,l,f)},e})})(k);var E={exports:{}};(function(h){(function(u,r){if(h.exports)h.exports=r(b.exports,G.exports,k.exports,P.exports);else{var e=u.Zdog;e.Shape=r(e,e.Vector,e.PathCommand,e.Anchor)}})(m,function(r,e,s,a){var c=a.subclass({stroke:1,fill:!1,color:"#333",closed:!0,visible:!0,path:[{}],front:{z:1},backface:!0});c.prototype.create=function(i){a.prototype.create.call(this,i),this.updatePath(),this.front=new e(i.front||this.front),this.renderFront=new e(this.front),this.renderNormal=new e};var t=["move","line","bezier","arc"];c.prototype.updatePath=function(){this.setPath(),this.updatePathCommands()},c.prototype.setPath=function(){},c.prototype.updatePathCommands=function(){var i;this.pathCommands=this.path.map(function(p,f){var d=Object.keys(p),l=d[0],y=p[l],g=d.length==1&&t.indexOf(l)!=-1;g||(l="line",y=p);var w=l=="line"||l=="move",C=Array.isArray(y);w&&!C&&(y=[y]),l=f===0?"move":l;var R=new s(l,y,i);return i=R.endRenderPoint,R})},c.prototype.reset=function(){this.renderOrigin.set(this.origin),this.renderFront.set(this.front),this.pathCommands.forEach(function(i){i.reset()})},c.prototype.transform=function(i,p,f){this.renderOrigin.transform(i,p,f),this.renderFront.transform(i,p,f),this.renderNormal.set(this.renderOrigin).subtract(this.renderFront),this.pathCommands.forEach(function(d){d.transform(i,p,f)}),this.children.forEach(function(d){d.transform(i,p,f)})},c.prototype.updateSortValue=function(){var i=this.pathCommands.length,p=this.pathCommands[0].endRenderPoint,f=this.pathCommands[i-1].endRenderPoint,d=i>2&&p.isSame(f);d&&(i-=1);for(var l=0,y=0;y<i;y++)l+=this.pathCommands[y].endRenderPoint.z;this.sortValue=l/i},c.prototype.render=function(i,p){var f=this.pathCommands.length;if(!(!this.visible||!f)&&(this.isFacingBack=this.renderNormal.z>0,!(!this.backface&&this.isFacingBack))){if(!p)throw new Error("Zdog renderer required. Set to "+p);var d=f==1;p.isCanvas&&d?this.renderCanvasDot(i,p):this.renderPath(i,p)}};var o=r.TAU;c.prototype.renderCanvasDot=function(i){var p=this.getLineWidth();if(!!p){i.fillStyle=this.getRenderColor();var f=this.pathCommands[0].endRenderPoint;i.beginPath();var d=p/2;i.arc(f.x,f.y,d,0,o),i.fill()}},c.prototype.getLineWidth=function(){return this.stroke?this.stroke==!0?1:this.stroke:0},c.prototype.getRenderColor=function(){var i=typeof this.backface=="string"&&this.isFacingBack,p=i?this.backface:this.color;return p},c.prototype.renderPath=function(i,p){var f=this.getRenderElement(i,p),d=this.pathCommands.length==2&&this.pathCommands[1].method=="line",l=!d&&this.closed,y=this.getRenderColor();p.renderPath(i,f,this.pathCommands,l),p.stroke(i,f,this.stroke,y,this.getLineWidth()),p.fill(i,f,this.fill,y),p.end(i,f)};var n="http://www.w3.org/2000/svg";return c.prototype.getRenderElement=function(i,p){if(!!p.isSvg)return this.svgElement||(this.svgElement=document.createElementNS(n,"path"),this.svgElement.setAttribute("stroke-linecap","round"),this.svgElement.setAttribute("stroke-linejoin","round")),this.svgElement},c})})(E);var H={exports:{}};(function(h){(function(u,r){if(h.exports)h.exports=r(P.exports);else{var e=u.Zdog;e.Group=r(e.Anchor)}})(m,function(r){var e=r.subclass({updateSort:!1,visible:!0});return e.prototype.updateSortValue=function(){var s=0;this.flatGraph.forEach(function(a){a.updateSortValue(),s+=a.sortValue}),this.sortValue=s/this.flatGraph.length,this.updateSort&&this.flatGraph.sort(r.shapeSorter)},e.prototype.render=function(s,a){!this.visible||this.flatGraph.forEach(function(c){c.render(s,a)})},e.prototype.updateFlatGraph=function(){var s=[];this.flatGraph=this.addChildFlatGraph(s)},e.prototype.getFlatGraph=function(){return[this]},e})})(H);var N={exports:{}};(function(h){(function(u,r){if(h.exports)h.exports=r(E.exports);else{var e=u.Zdog;e.Rect=r(e.Shape)}})(m,function(r){var e=r.subclass({width:1,height:1});return e.prototype.setPath=function(){var s=this.width/2,a=this.height/2;this.path=[{x:-s,y:-a},{x:s,y:-a},{x:s,y:a},{x:-s,y:a}]},e})})(N);var _={exports:{}};(function(h){(function(u,r){if(h.exports)h.exports=r(E.exports);else{var e=u.Zdog;e.RoundedRect=r(e.Shape)}})(m,function(r){var e=r.subclass({width:1,height:1,cornerRadius:.25,closed:!1});return e.prototype.setPath=function(){var s=this.width/2,a=this.height/2,c=Math.min(s,a),t=Math.min(this.cornerRadius,c),o=s-t,n=a-t,i=[{x:o,y:-a},{arc:[{x:s,y:-a},{x:s,y:-n}]}];n&&i.push({x:s,y:n}),i.push({arc:[{x:s,y:a},{x:o,y:a}]}),o&&i.push({x:-o,y:a}),i.push({arc:[{x:-s,y:a},{x:-s,y:n}]}),n&&i.push({x:-s,y:-n}),i.push({arc:[{x:-s,y:-a},{x:-o,y:-a}]}),o&&i.push({x:o,y:-a}),this.path=i},e})})(_);var F={exports:{}};(function(h){(function(u,r){if(h.exports)h.exports=r(E.exports);else{var e=u.Zdog;e.Ellipse=r(e.Shape)}})(m,function(r){var e=r.subclass({diameter:1,width:void 0,height:void 0,quarters:4,closed:!1});return e.prototype.setPath=function(){var s=this.width!=null?this.width:this.diameter,a=this.height!=null?this.height:this.diameter,c=s/2,t=a/2;this.path=[{x:0,y:-t},{arc:[{x:c,y:-t},{x:c,y:0}]}],this.quarters>1&&this.path.push({arc:[{x:c,y:t},{x:0,y:t}]}),this.quarters>2&&this.path.push({arc:[{x:-c,y:t},{x:-c,y:0}]}),this.quarters>3&&this.path.push({arc:[{x:-c,y:-t},{x:0,y:-t}]})},e})})(F);var I={exports:{}};(function(h){(function(u,r){if(h.exports)h.exports=r(b.exports,E.exports);else{var e=u.Zdog;e.Polygon=r(e,e.Shape)}})(m,function(r,e){var s=e.subclass({sides:3,radius:.5}),a=r.TAU;return s.prototype.setPath=function(){this.path=[];for(var c=0;c<this.sides;c++){var t=c/this.sides*a-a/4,o=Math.cos(t)*this.radius,n=Math.sin(t)*this.radius;this.path.push({x:o,y:n})}},s})})(I);var K={exports:{}};(function(h){(function(u,r){if(h.exports)h.exports=r(b.exports,G.exports,P.exports,F.exports);else{var e=u.Zdog;e.Hemisphere=r(e,e.Vector,e.Anchor,e.Ellipse)}})(m,function(r,e,s,a){var c=a.subclass({fill:!0}),t=r.TAU;c.prototype.create=function(){a.prototype.create.apply(this,arguments),this.apex=new s({addTo:this,translate:{z:this.diameter/2}}),this.renderCentroid=new e},c.prototype.updateSortValue=function(){this.renderCentroid.set(this.renderOrigin).lerp(this.apex.renderOrigin,3/8),this.sortValue=this.renderCentroid.z},c.prototype.render=function(n,i){this.renderDome(n,i),a.prototype.render.apply(this,arguments)},c.prototype.renderDome=function(n,i){if(!!this.visible){var p=this.getDomeRenderElement(n,i),f=Math.atan2(this.renderNormal.y,this.renderNormal.x),d=this.diameter/2*this.renderNormal.magnitude(),l=this.renderOrigin.x,y=this.renderOrigin.y;if(i.isCanvas){var g=f+t/4,w=f-t/4;n.beginPath(),n.arc(l,y,d,g,w)}else i.isSvg&&(f=(f-t/4)/t*360,this.domeSvgElement.setAttribute("d","M "+-d+",0 A "+d+","+d+" 0 0 1 "+d+",0"),this.domeSvgElement.setAttribute("transform","translate("+l+","+y+" ) rotate("+f+")"));i.stroke(n,p,this.stroke,this.color,this.getLineWidth()),i.fill(n,p,this.fill,this.color),i.end(n,p)}};var o="http://www.w3.org/2000/svg";return c.prototype.getDomeRenderElement=function(n,i){if(!!i.isSvg)return this.domeSvgElement||(this.domeSvgElement=document.createElementNS(o,"path"),this.domeSvgElement.setAttribute("stroke-linecap","round"),this.domeSvgElement.setAttribute("stroke-linejoin","round")),this.domeSvgElement},c})})(K);var Q={exports:{}};(function(h){(function(u,r){if(h.exports)h.exports=r(b.exports,k.exports,E.exports,H.exports,F.exports);else{var e=u.Zdog;e.Cylinder=r(e,e.PathCommand,e.Shape,e.Group,e.Ellipse)}})(m,function(r,e,s,a,c){function t(){}var o=a.subclass({color:"#333",updateSort:!0});o.prototype.create=function(){a.prototype.create.apply(this,arguments),this.pathCommands=[new e("move",[{}]),new e("line",[{}])]},o.prototype.render=function(l,y){this.renderCylinderSurface(l,y),a.prototype.render.apply(this,arguments)},o.prototype.renderCylinderSurface=function(l,y){if(!!this.visible){var g=this.getRenderElement(l,y),w=this.frontBase,C=this.rearBase,R=w.renderNormal.magnitude(),B=w.diameter*R+w.getLineWidth();this.pathCommands[0].renderPoints[0].set(w.renderOrigin),this.pathCommands[1].renderPoints[0].set(C.renderOrigin),y.isCanvas&&(l.lineCap="butt"),y.renderPath(l,g,this.pathCommands),y.stroke(l,g,!0,this.color,B),y.end(l,g),y.isCanvas&&(l.lineCap="round")}};var n="http://www.w3.org/2000/svg";o.prototype.getRenderElement=function(l,y){if(!!y.isSvg)return this.svgElement||(this.svgElement=document.createElementNS(n,"path")),this.svgElement},o.prototype.copyGraph=t;var i=c.subclass();i.prototype.copyGraph=t;var p=s.subclass({diameter:1,length:1,frontFace:void 0,fill:!0}),f=r.TAU;p.prototype.create=function(){s.prototype.create.apply(this,arguments),this.group=new o({addTo:this,color:this.color,visible:this.visible});var l=this.length/2,y=this.backface||!0;this.frontBase=this.group.frontBase=new c({addTo:this.group,diameter:this.diameter,translate:{z:l},rotate:{y:f/2},color:this.color,stroke:this.stroke,fill:this.fill,backface:this.frontFace||y,visible:this.visible}),this.rearBase=this.group.rearBase=this.frontBase.copy({translate:{z:-l},rotate:{y:0},backface:y})},p.prototype.render=function(){};var d=["stroke","fill","color","visible"];return d.forEach(function(l){var y="_"+l;Object.defineProperty(p.prototype,l,{get:function(){return this[y]},set:function(g){this[y]=g,this.frontBase&&(this.frontBase[l]=g,this.rearBase[l]=g,this.group[l]=g)}})}),p})})(Q);var J={exports:{}};(function(h){(function(u,r){if(h.exports)h.exports=r(b.exports,G.exports,k.exports,P.exports,F.exports);else{var e=u.Zdog;e.Cone=r(e,e.Vector,e.PathCommand,e.Anchor,e.Ellipse)}})(m,function(r,e,s,a,c){var t=c.subclass({length:1,fill:!0}),o=r.TAU;t.prototype.create=function(){c.prototype.create.apply(this,arguments),this.apex=new a({addTo:this,translate:{z:this.length}}),this.renderApex=new e,this.renderCentroid=new e,this.tangentA=new e,this.tangentB=new e,this.surfacePathCommands=[new s("move",[{}]),new s("line",[{}]),new s("line",[{}])]},t.prototype.updateSortValue=function(){this.renderCentroid.set(this.renderOrigin).lerp(this.apex.renderOrigin,1/3),this.sortValue=this.renderCentroid.z},t.prototype.render=function(i,p){this.renderConeSurface(i,p),c.prototype.render.apply(this,arguments)},t.prototype.renderConeSurface=function(i,p){if(!!this.visible){this.renderApex.set(this.apex.renderOrigin).subtract(this.renderOrigin);var f=this.renderNormal.magnitude(),d=this.renderApex.magnitude2d(),l=this.renderNormal.magnitude2d(),y=Math.acos(l/f),g=Math.sin(y),w=this.diameter/2*f,C=w*g<d;if(!!C){var R=Math.atan2(this.renderNormal.y,this.renderNormal.x)+o/2,B=d/g,W=Math.acos(w/B),T=this.tangentA,O=this.tangentB;T.x=Math.cos(W)*w*g,T.y=Math.sin(W)*w,O.set(this.tangentA),O.y*=-1,T.rotateZ(R),O.rotateZ(R),T.add(this.renderOrigin),O.add(this.renderOrigin),this.setSurfaceRenderPoint(0,T),this.setSurfaceRenderPoint(1,this.apex.renderOrigin),this.setSurfaceRenderPoint(2,O);var M=this.getSurfaceRenderElement(i,p);p.renderPath(i,M,this.surfacePathCommands),p.stroke(i,M,this.stroke,this.color,this.getLineWidth()),p.fill(i,M,this.fill,this.color),p.end(i,M)}}};var n="http://www.w3.org/2000/svg";return t.prototype.getSurfaceRenderElement=function(i,p){if(!!p.isSvg)return this.surfaceSvgElement||(this.surfaceSvgElement=document.createElementNS(n,"path"),this.surfaceSvgElement.setAttribute("stroke-linecap","round"),this.surfaceSvgElement.setAttribute("stroke-linejoin","round")),this.surfaceSvgElement},t.prototype.setSurfaceRenderPoint=function(i,p){var f=this.surfacePathCommands[i].renderPoints[0];f.set(p)},t})})(J);var $={exports:{}};(function(h){(function(u,r){if(h.exports)h.exports=r(b.exports,P.exports,E.exports,N.exports);else{var e=u.Zdog;e.Box=r(e,e.Anchor,e.Shape,e.Rect)}})(m,function(r,e,s,a){var c=a.subclass();c.prototype.copyGraph=function(){};var t=r.TAU,o=["frontFace","rearFace","leftFace","rightFace","topFace","bottomFace"],n=r.extend({},s.defaults);delete n.path,o.forEach(function(f){n[f]=!0}),r.extend(n,{width:1,height:1,depth:1,fill:!0});var i=e.subclass(n);i.prototype.create=function(f){e.prototype.create.call(this,f),this.updatePath(),this.fill=this.fill},i.prototype.updatePath=function(){o.forEach(function(f){this[f]=this[f]},this)},o.forEach(function(f){var d="_"+f;Object.defineProperty(i.prototype,f,{get:function(){return this[d]},set:function(l){this[d]=l,this.setFace(f,l)}})}),i.prototype.setFace=function(f,d){var l=f+"Rect",y=this[l];if(!d){this.removeChild(y);return}var g=this.getFaceOptions(f);g.color=typeof d=="string"?d:this.color,y?y.setOptions(g):y=this[l]=new c(g),y.updatePath(),this.addChild(y)},i.prototype.getFaceOptions=function(f){return{frontFace:{width:this.width,height:this.height,translate:{z:this.depth/2}},rearFace:{width:this.width,height:this.height,translate:{z:-this.depth/2},rotate:{y:t/2}},leftFace:{width:this.depth,height:this.height,translate:{x:-this.width/2},rotate:{y:-t/4}},rightFace:{width:this.depth,height:this.height,translate:{x:this.width/2},rotate:{y:t/4}},topFace:{width:this.width,height:this.depth,translate:{y:-this.height/2},rotate:{x:-t/4}},bottomFace:{width:this.width,height:this.depth,translate:{y:this.height/2},rotate:{x:t/4}}}[f]};var p=["color","stroke","fill","backface","front","visible"];return p.forEach(function(f){var d="_"+f;Object.defineProperty(i.prototype,f,{get:function(){return this[d]},set:function(l){this[d]=l,o.forEach(function(y){var g=this[y+"Rect"],w=typeof this[y]=="string",C=f=="color"&&w;g&&!C&&(g[f]=l)},this)}})}),i})})($);(function(h){(function(u,r){h.exports&&(h.exports=r(b.exports,L.exports,U.exports,G.exports,P.exports,j.exports,Y.exports,k.exports,E.exports,H.exports,N.exports,_.exports,F.exports,I.exports,K.exports,Q.exports,J.exports,$.exports))})(m,function(r,e,s,a,c,t,o,n,i,p,f,d,l,y,g,w,C,R){return r.CanvasRenderer=e,r.SvgRenderer=s,r.Vector=a,r.Anchor=c,r.Dragger=t,r.Illustration=o,r.PathCommand=n,r.Shape=i,r.Group=p,r.Rect=f,r.RoundedRect=d,r.Ellipse=l,r.Polygon=y,r.Hemisphere=g,r.Cylinder=w,r.Cone=C,r.Box=R,r})})(z);var it=z.exports,nt=rt({__proto__:null,default:it},[z.exports]);const{TAU:S}=nt,A=35,ot=8,st=18,V=0,v=3,x=8,at={rotate:wt({x:-.13,y:-6.63,z:-1.2}),translate:{x:-2.6,y:7,z:0}},ht={metal1:"#9e9e9e",metal2:"#8c8c8c",metal3:"#7a7a7a",metal4:"#6b6b6b",wood:"#774722",lightningBolt:"#f4be34"};[z.exports.Shape,z.exports.Rect,z.exports.Ellipse].forEach(function(h){h.defaults.fill=!0,h.defaults.stroke=!1});class bt{constructor(u){if(this.illo=void 0,this.dragRotate=!1,this.onDragStart=void 0,!u)throw new Error("Missing `outerElem` argument");const r=pt(u);this.illoElem=r,this.colors=ht,this.perspective=at,this.handleDiameter=ot,this.handleLength=st,this.hideBackLightningBolt=!1}reset(){this.init()}updatePerspective(){this.illo&&(Object.assign(this.illo.rotate,this.perspective.rotate),Object.assign(this.illo.translate,this.perspective.translate),this.illo.updateRenderGraph())}init(){this.illo=ct(this),this.illo.updateRenderGraph()}update(){this.illo&&this.illo.updateRenderGraph()}}function pt(h){h.style.position="relative",h.innerHTML=`
<svg class="hammer"></svg>
<svg class="circle-square" width="100" height="100" version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
 <path d="m5e-7 -1.5e-6v100h100v-100zm50 20c16.62 0 30 13.38 30 30 0 16.62-13.38 30-30 30-16.62 0-30-13.38-30-30 0-16.62 13.38-30 30-30z" fill="#fff" />
</svg>
<svg class="circle-square circle" width="100" height="100" version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
 <ellipse cx="50" cy="50" rx="30" ry="30" fill="#eaeaea" />
</svg>
<style>
.circle-square {
  position: absolute;
  z-index: 1;
  width: 100%;
  left: 0;
  height: 100%;
  pointer-events: none;
}
.circle-square.circle {
  z-index: -1;
}
</style>
`;const u=h.querySelector("svg.hammer");return u.style.height="100%",u.style.width="100%",u}function ct(h){const{illoElem:u,perspective:r,dragRotate:e}=h;u.setAttribute("width","100"),u.setAttribute("height","100");const s=new z.exports.Illustration({element:u,dragRotate:e,onDragStart(){var p;(p=h.onDragStart)==null||p.call(h)},rotate:r.rotate,translate:r.translate}),{colors:a,hideBackLightningBolt:c}=h,t={colors:a,hideBackLightningBolt:c};var o=new z.exports.Group({addTo:s,updateSort:!0}),n=new z.exports.Anchor({addTo:o,rotate:{x:S/4}}),i=new z.exports.Anchor({addTo:o,rotate:{z:-1*S/4},translate:{x:-1*(A/2),y:-10}});ft(i,t);{const{handleDiameter:p,handleLength:f}=h;ut(n,a,p,f)}return s}function ut(h,u,r,e){const s=u.wood,a=u.metal3,c=u.metal4;let t=0;const o=(n,i,p=0)=>{i=i/2;const f=i+p;t+=f/2,new z.exports.Cylinder({addTo:h,diameter:r,stroke:i,length:p,fill:!0,color:n,translate:{x:0,y:0,z:0-1-t}}),t+=f/2};o(c,1,3),o(s,0,e),o(c,1,1),o(a,2,3)}function ft(h,u){lt(h,u.colors),dt(h,u)}function lt(h,u){xt(h,u).copyGraph({addTo:h,rotate:{x:S/2},translate:{y:A}})}function dt(h,u){yt(h,u),vt(h,u.colors)}function yt(h,u){const{colors:r}=u,s=(n=>new z.exports.Shape(D({stroke:V},n)))({path:[{x:-1,y:0,z:.5},{x:-1,y:0,z:-.5},{x:-1,y:1,z:-.5},{x:-1,y:1,z:.5}],translate:{y:v},scale:{x:x+v,y:A-2*v,z:2*x},color:r.metal3,addTo:h}),a=2*(x+v),c=s.copy({translate:{x:a,y:v},addTo:h});var t=new z.exports.Group({addTo:h});c.copy({rotate:{y:-1*S/4},translate:{x:0,y:v},addTo:t});const o=gt(t,r);t.copyGraph({rotate:{x:-1*S/2},translate:{x:0,y:A,z:0},addTo:h}),u.hideBackLightningBolt&&o.remove()}function vt(h,u){const r=n=>new z.exports.Shape(D({stroke:V,addTo:h},n)),e=-1*x,s=A-2*v,a=x+v,c=x,t=r({path:[{x:e,y:0,z:a},{x:e-v,y:0,z:c},{x:e-v,y:s,z:c},{x:e,y:s,z:a}],translate:{y:v},color:u.metal2}),o=2*x+v;t.copy({translate:{x:o,y:v,z:-1*o}}),t.copy({rotate:{x:S/2},translate:{y:A-v}}),t.copy({rotate:{x:S/2},translate:{x:o,y:A-v,z:1*o}})}function xt(h,u){const r=new z.exports.Anchor({addTo:h}),e=o=>new z.exports.Shape(D({stroke:V,addTo:r},o)),s=u.metal2,a=u.metal1;var c=e({path:[{x:0,y:0,z:1},{x:0,y:0,z:-1},{x:1,y:1,z:-1},{x:1,y:1,z:1}],translate:{x},scale:{x:v,y:v,z:x},color:s}),t=e({path:[{z:0,y:0,x:1},{z:0,y:0,x:-1},{z:1,y:1,x:-1},{z:1,y:1,x:1}],translate:{z:x},scale:{x,y:v,z:v},color:s});return e({path:[{x:0,y:0,z:0},{x:v,y:v,z:0},{x:0,y:v,z:v}],translate:{x,z:x},color:a}),t.copy({scale:{x,y:v,z:-1*v},translate:{z:-1*x},color:s}),e({path:[{x:0,y:0,z:0},{x:v,y:v,z:0},{x:0,y:v,z:-1*v}],translate:{x,z:-1*x},color:a}),c.copy({scale:{x:-1*v,y:v,z:x},translate:{x:-1*x},color:s}),e({path:[{x:0,y:0,z:0},{x:-v,y:v,z:0},{x:0,y:v,z:-1*v}],translate:{x:-1*x,z:-1*x},color:a}),e({path:[{x:0,y:0,z:0},{x:-1*v,y:v,z:0},{x:0,y:v,z:v}],translate:{x:-1*x,z:x},color:a}),e({path:[{x:-1,y:0,z:1},{x:-1,y:0,z:-1},{x:1,y:0,z:-1},{x:1,y:0,z:1}],scale:{x,y:x,z:x},color:u.metal3}),r}function gt(h,u){const e=h,s={x:6.5,y:8.2,z:x+v},a={z:1*S/4};return new z.exports.Shape({addTo:e,rotate:a,path:[{x:292.965,y:1.5744},{bezier:[{x:292.965,y:1.5744},{x:156.801,y:28.2552},{x:156.801,y:28.2552}]},{bezier:[{x:154.563,y:28.6937},{x:152.906,y:30.5903},{x:152.771,y:32.8664}]},{bezier:[{x:152.771,y:32.8664},{x:144.395,y:174.33},{x:144.395,y:174.33}]},{bezier:[{x:144.198,y:177.662},{x:147.258,y:180.248},{x:150.51,y:179.498}]},{bezier:[{x:150.51,y:179.498},{x:188.42,y:170.749},{x:188.42,y:170.749}]},{bezier:[{x:191.967,y:169.931},{x:195.172,y:173.055},{x:194.443,y:176.622}]},{bezier:[{x:194.443,y:176.622},{x:183.18,y:231.775},{x:183.18,y:231.775}]},{bezier:[{x:182.422,y:235.487},{x:185.907,y:238.661},{x:189.532,y:237.56}]},{bezier:[{x:189.532,y:237.56},{x:212.947,y:230.446},{x:212.947,y:230.446}]},{bezier:[{x:216.577,y:229.344},{x:220.065,y:232.527},{x:219.297,y:236.242}]},{bezier:[{x:219.297,y:236.242},{x:201.398,y:322.875},{x:201.398,y:322.875}]},{bezier:[{x:200.278,y:328.294},{x:207.486,y:331.249},{x:210.492,y:326.603}]},{bezier:[{x:210.492,y:326.603},{x:212.5,y:323.5},{x:212.5,y:323.5}]},{bezier:[{x:212.5,y:323.5},{x:323.454,y:102.072},{x:323.454,y:102.072}]},{bezier:[{x:325.312,y:98.3645},{x:322.108,y:94.137},{x:318.036,y:94.9228}]},{bezier:[{x:318.036,y:94.9228},{x:279.014,y:102.454},{x:279.014,y:102.454}]},{bezier:[{x:275.347,y:103.161},{x:272.227,y:99.746},{x:273.262,y:96.1583}]},{bezier:[{x:273.262,y:96.1583},{x:298.731,y:7.86689},{x:298.731,y:7.86689}]},{bezier:[{x:299.767,y:4.27314},{x:296.636,y:.855181},{x:292.965,y:1.5744}]}],closed:!0,stroke:1,fill:!0,color:u.lightningBolt,translate:{x:s.x,y:s.y,z:s.z},scale:{x:.04,y:.04,z:.04}})}function St({x:h,y:u,z:r}){const e=s=>(s=s*16/S,s=Math.floor(s*100)/100,s);return h=e(h),u=e(u),r=e(r),{x:h,y:u,z:r}}function mt(h){return S*(h/16)}function wt({x:h,y:u,z:r}){const e=mt;return h=e(h),u=e(u),r=e(r),{x:h,y:u,z:r}}export{bt as H,mt as f,St as t};
