import{b as h,r as F,j as c}from"./react-CMFr3qCg.js";import{c as Ve}from"./react-dom-DX5UQ9U7.js";import{B as b,D as Le,a as Ae,b as Ee,F as B,R as ne,c as C,d as D,e as qe,S as ie,T as Q,f as Ge,A as ze,g as he,P as pe,h as Se,M as Pe,i as ge,L as Ke,j as He,k as T,l as Je,U as et,m as tt,C as _,n as nt,V as it,I as st,H as ot,o as se,p as rt,q as at,u as ye,r as ct,s as lt,t as dt,v as ut,w as mt,x as ft,y as Ot,z as ht}from"./@mui-Ca0AzxLg.js";import{R as q}from"./@uiw-PGa3NKDv.js";import{V as pt,G as St,H as W,L as Pt,I as gt,J as yt,K as kt,M as wt,N as bt,O as xt,P as Tt,Q as vt}from"./@codemirror-HnVgEYRi.js";import{L as Rt,s as jt,a as g}from"./@lezer-CRier5-m.js";import{d as oe}from"./fastest-levenshtein-ChoUA_u9.js";import{x as Qt}from"./xmlbuilder2-DPvUJURa.js";import"./hoist-non-react-statics-VTAvmUN5.js";import"./scheduler-Bb8JjhAW.js";import"./@emotion-D3xeAZ7B.js";import"./@babel-BtohYyOd.js";import"./stylis-DDa9OTMq.js";import"./clsx-B-dksMZM.js";import"./react-transition-group-D_SqvwCt.js";import"./@popperjs-CMBiYTiD.js";import"./@base-ui-k8nSAhao.js";import"./reselect-D6JaGe0o.js";import"./use-sync-external-store-DgWmawwA.js";import"./react-is-BPJnJB5S.js";import"./crelt-C8TCjufn.js";import"./@marijn-DXwl3gUT.js";import"./style-mod-Bs6eFhZE.js";import"./w3c-keyname-Vcq4gwWv.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function n(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=n(s);fetch(s.href,o)}})();const ke=["Freestyle","Free","Fr","Backstroke","Back","Bk","Breaststroke","Breast","Br","Butterfly","Fly","Fl","Choice","IndividualMedley","Medley","Im","ReverseIndividualMedley","ReverseMedley","ReverseIm","IndividualMedleyOverlap","MedleyOverlap","ImOverlap","IndividualMedleyOrder","MedleyOrder","ImOrder","ReverseIndividualMedleyOrder","ReverseMedleyOrder","ReverseImOrder","NumberOne","NumberTwo","NumberThree","NumberFour","NotFreestyle","NotFree","NotFr","NotBackstroke","NotBack","NotBk","NotBreastroke","NotBreast","NotBr","NotButterfly","NotFly","NotFl"],we=["Pull","Kick","Drill"],be=["Board","Pads","PullBuoy","Fins","Snorkel","Chute","StretchCord"],xe=["Title","Description","Date","PoolLength","LengthUnit","Align","NumeralSystem","HideIntro","LayoutWidth"],Yt=["True","False"];function re(e){const t=new Set,n=W(e).cursor();do{if(n.name!=="PaceDefinition"||!n.firstChild())continue;const i=e.sliceDoc(n.from,n.to);t.add(i),n.parent()}while(n.next());return t}const Te=yt.define({create:re,update(e,t){return t.docChanged?re(t.state):e}}),It=ke.map(e=>({label:e,type:"constant",boost:e.length})),Mt=be.map(e=>({label:e,type:"constant"})),Zt=we.map(e=>({label:e,type:"constant"})),Ct=xe.map(e=>({label:e,type:"constant"})),ae={0:{priorNodeName:"Distance",nodeName:"Stroke",completions:It},1:{priorNodeName:"EquipmentSpecification",nodeName:"EquipmentName",completions:Mt},2:{priorNodeName:"Pace",nodeName:"PaceAlias",completions:[]},3:{priorNodeName:"",nodeName:"StrokeModifier",completions:Zt},4:{priorNodeName:"",nodeName:"ConstantName",completions:Ct}};function Dt(e){const t=W(e.state).resolveInner(e.pos,-1);ae[2].completions=Array.from(e.state.field(Te)).map(n=>({label:n,type:"variable"}));for(const{priorNodeName:n,nodeName:i,completions:s}of Object.values(ae)){if(t.name===n)return{from:e.pos,options:s,validFor:/^[A-Za-z]/};if(t.name===i)return{from:t.from,to:t.to,options:s,validFor:/^[A-Za-z]/}}return null}function ve(e,t){const[n,...i]=t;return i.reduce(([s,o],r)=>{const a=oe(e,r);return a<o?[r,a]:[s,o]},[n,oe(e,n)])}const Re=2;function Wt(e,t){const n=[];if(t.size>0){const[i,s]=ve(e,Array.from(t));s<=Re&&n.push({name:`Did you mean '${i}'?`,apply(o,r,a){o.dispatch({changes:{from:r,to:a,insert:i}})}})}return n.push({name:"Define pace name",apply(i){i.dispatch({changes:{from:0,to:0,insert:`pace ${e} = _%
`}})}}),n}function Xt(e){return[{name:"Remove duplicated definition",apply(t){t.dispatch({changes:{from:e.from,to:e.to}})}}]}function Nt(e,t){const[n,i]=ve(e,t);return i>Re?[]:[{name:`Did you mean ${n}`,apply(s,o,r){s.dispatch({changes:{from:o,to:r,insert:n}})}}]}function Ut(e,t,n){return{from:t.from,to:t.to,severity:"error",message:`A pace named '${e}' has already been defined`,actions:Xt(n)}}function Bt(e,t,n){return{from:e.from,to:e.to,severity:"error",actions:Wt(t,n),message:`'${t}' is not a defined pace name.
If you wish to be able to use '${t}' in the place of a pace percentage, please define it with the following line:
Pace ${t} = _%`}}function Ft(e){return{from:e.from,to:e.to,severity:"error",message:"Syntax error"}}function _t(e,t){return{from:e,to:t,severity:"error",message:"Duplicate equipment specified. Please do not use the same equipment multiple times"}}function $t(e,t,n,i){return{from:e,to:t,severity:"error",message:`'${n}' is not compatible with stroke type '${i}'`}}function Vt(e,t){return{from:e,to:t,severity:"error",message:"Multiple rest times specified. Please only specify at most one rest time per instruction."}}function Lt(e){return e.replace(/([a-z])([A-Z])/g,"$1 $2").toLowerCase()}function At(e,t,n,i){return{from:e.from,to:e.to,severity:"error",message:`${t} is not a valid ${Lt(n)}.`,actions:Nt(t,i)}}function Et(e){return{from:e.from,to:e.to,severity:"error",message:"Number too large for duration"}}const qt=59;function Gt(e,t,n,i){if(e.name!=="PaceAlias")return;const s=n.sliceDoc(e.from,e.to);t.has(s)||i.push(Bt(e,s,t))}function zt(e,t,n,i){if(e.name!=="PaceDefinitionName")return;const s=n.sliceDoc(e.from,e.to),o=e.node.parent;o!==null&&(t.has(s)?i.push(Ut(s,e,o)):t.add(s))}function Kt(e,t){e.name==="⚠"&&t.push(Ft(e))}const Ht=new Map([["Default",new Set(["Board","PullBuoy"])],["Kick",new Set(["PullBuoy","Pads"])],["Pull",new Set(["Board","Fins"])]]);function Jt(e,t,n){if(e.name!=="Instruction")return;const i=e.node.getChild("EquipmentSpecification");if(i===null)return;const s=e.node.getChild("StrokeType"),o=s!==null?t.sliceDoc(s.from,s.to):"Default",r=s!==null?s.from:i.from,a=i.getChildren("EquipmentName").map(u=>t.sliceDoc(u.from,u.to)),l=new Set(a);l.size!==a.length&&n.push(_t(r,i.to));const d=Ht.get(o);if(d!==void 0)for(const u of l)d.has(u)&&n.push($t(r,i.to,u,o))}function en(e,t){var r;if(e.name!=="Rest")return;const n=e.node.parent;if(!n)return;const i=n.getChildren("Rest");if(i.length<=1||((r=i[0])==null?void 0:r.from)!==e.from)return;const s=i[0],o=i[i.length-1];o!==void 0&&t.push(Vt(s.from,o.to))}function j(e,t,n,i,s){if(e.name!==n)return;const o=t.sliceDoc(e.from,e.to);i.includes(o)||s.push(At(e,o,n,i))}function tn(e,t,n){if(e.name!=="Duration")return;const i=e.node.getChildren("Number");for(const s of i)Number(t.sliceDoc(s.from,s.to))>qt&&n.push(Et(s))}function nn(e){const t=[],n=new Set,i=e.state,s=W(i).cursor();do Gt(s,n,i,t),zt(s,n,i,t),Kt(s,t),Jt(s,i,t),j(s,i,"Stroke",ke,t),j(s,i,"StrokeModifier",we,t),j(s,i,"EquipmentName",be,t),j(s,i,"Boolean",Yt,t),j(s,i,"ConstantName",xe,t),tn(s,i,t),en(s,t);while(s.next());return t}var sn=kt(nn);const on=Rt.deserialize({version:14,states:"+vQYQPOOOnQPO'#CcOOQO'#Ce'#CeOOQO'#Cb'#CbO|QPO'#CaO!RQPO'#ChO#OQPO'#C_OOQO'#DX'#DXO#lQPO'#CyO#qQPO'#C|O#vQPO'#C}OOQO'#DW'#DWOOQO'#DP'#DPQYQPOOO#{QQO'#DXOOQO,59O,59OO$QQPO,59QO$VQPO,58yOOQO'#Cg'#CgOOQO,58{,58{OOQO'#DQ'#DQO$_QPO,59SOOQO'#Ci'#CiO$mQPO'#CjO$rQPO'#CpO$rQPO'#CqO$wQPO'#CrOOQO'#Co'#CoOOQO'#Cs'#CsO$|QPO'#CtO#qQPO'#CuOOQO'#Cw'#CwOOQO'#D`'#D`OOQO'#DR'#DRO%RQPO,58yO%RQPO,58yO&YQPO'#D`OOQO'#Cz'#CzO&bQPO,59eO&mQSO'#DmO#qQPO,59hOOQO'#DO'#DOO&rQPO,59iOOQO-E6}-E6}OOQO,59s,59sOOQO1G.l1G.lOqQPO'#CcO&wQPO1G.eOOQO-E7O-E7OOOQO1G.n1G.nOOQO'#Ck'#CkOOQO'#DS'#DSO'eQPO,59UO(oQPO'#CfOOQO,59[,59[OOQO,59],59]OOQO,59^,59^OOQO,59`,59`OOQO,59a,59aOOQO-E7P-E7PO(tQPO1G.eO)bQPO'#CmOOQO'#Cn'#CnOOQO'#Dc'#DcO)jQPO'#ClOOQO,59z,59zOOQO'#C{'#C{OOQO'#Dr'#DrOOQO1G/P1G/PO*tQPO,5:XO*yQPO1G/SO&YQPO1G/TO+eQPO7+$PO+eQPO7+$POOQO-E7Q-E7QOOQO,59X,59XOOQO,59},59}O&YQPO,59WOOQO1G/s1G/sOOQO7+$n7+$nOOQO7+$o7+$oO,RQPO<<GkOOQO1G.r1G.r",stateData:"-R~OyOSPOS~OSPO!QTO!d^O!eWO!gXO!hYO~O|aO}_O!O`O!PVX~O!PbO~OSPO!QTO!d^O~O!PfO!TgO!UtO!ZhO![iO!]jO!^lO!_mO!`nO!coO~OSRXwRX!QRX!dRX!eRX!gRX!hRX!RRX~P!^O!PuO~O!bwO~O!PyO~Ol|O~OS}O~OS!OO!QTO~OSPO!QTO!R!RO!d^O~O!P!SO~OS!VO~OS!YO~OS!ZO~O!TgO!UtO!ZhO![iO!]jO!^lO!_mO!`nO!coOSRawRa!QRa!dRa!eRa!gRa!hRa!RRa~OS!_O!P!`O~OS!eO!P!dO!bwO~Oj!gO~O!i!iO~OSRiwRi!QRi!dRi!eRi!gRi!hRi!RRi~P!^O!P!SOS^aw^a!Q^a!T^a!U^a!Z^a![^a!]^a!^^a!_^a!`^a!c^a!d^a!e^a!g^a!h^a!R^a~O!O`O~OSRiwRi!QRi!dRi!eRi!gRi!hRi!RRi~P!aO!W!nO!X!mO~O!Y!oOS`Xw`X!Q`X!T`X!U`X!Z`X![`X!]`X!^`X!_`X!``X!c`X!d`X!e`X!g`X!h`X!R`X~O!b!pO~O!bwOSpiwpi!Qpi!dpi!epi!gpi!hpi~OSRqwRq!QRq!dRq!eRq!gRq!hRq!RRq~P!aOSRywRy!QRy!dRy!eRy!gRy!hRy!RRy~P!aOj!X!]![!_!^!c}y!Z!g!e!hPl|!P~",goto:"&f!gPPP!hP!n!w#O#O#O#V#d!n#g#m#w#{$R$R#m$W$W$W#m#m#mP#mP$b$f$i$b$b$l$o$u${%_PPP%e%iPPPPPP%qPP%{PPPPPPPPP&SPPPP&cXVOT]eWUOT]eR!PaZSOT]aeZROT]aeYQOT]aeQ!WhR!XiRcSQsUR!k!PapUrs!P!^!j!k!sT!Tg!UQ!ctR!r!iV!at!i!oakUrs!P!^!j!k!sTZO]RvWR!evRzYQ]OR{]QeTR!QeQrUW!]r!^!j!sQ!^sQ!j!PR!s!kQ!UgR!l!UT[O]SZO]TdTeaqUrs!P!^!j!k!sS!bt!iR!t!oQxXQ![nQ!evQ!hxR!q!hR!fv",nodeNames:"⚠ Comment SwimProgramme SwimInstruction Number SingleInstruction Length LengthAsDistance LengthAsLaps LengthAsTime Duration Stroke BlockInstruction StrokeModifier EquipmentSpecification EquipmentName Pace HeartRate PaceAlias Rest RestSinceStart RestAfterStop RestInOut Underwater Breathe InstructionDescription StringContent ExcludeAlignSpecification Message ConstantDefinition ConstantName Boolean AuthorDefinition PaceDefinition PaceDefinitionName",maxTerm:71,skippedNodes:[0,1],repeatNodeCount:4,tokenData:"!L`~R!eOX%dXY)_YZ+cZ^)_^p%dpq)_qr%drs-[st-otu%duv0Zv{%d{|1P|}%d}!O1u!O!Q%d!Q![4a![!]5]!]!_%d!_!`6R!`!a6w!a!b%d!b!c7m!c!}8c!}#O%d#O#P(U#P#T%d#T#U9e#U#V@c#V#]8c#]#^Jx#^#`8c#`#a!!l#a#b8c#b#c!'X#c#d!/[#d#e!1h#e#g8c#g#h!6R#h#i8c#i#j!9g#j#k8c#k#l!ES#l#m!Ip#m#o8c#o#p!Jt#p#q%d#q#r!Kj#r#y%d#y#z)_#z$f%d$f$g)_$g#BY%d#BY#BZ)_#BZ$IS%d$IS$I_)_$I_$I|%d$I|$JO)_$JO$JT%d$JT$JU)_$JU$KV%d$KV$KW)_$KW&FU%d&FU&FV)_&FV;'S%d;'S;=`)X<%lO%dU%kXjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dS&]UjSOr&Ws#O&W#O#P&o#P;'S&W;'S;=`'g<%lO&WS&rRO;'S&W;'S;=`&{;=`O&WS'QVjSOr&Ws#O&W#O#P&o#P;'S&W;'S;=`'g;=`<%l&W<%lO&WS'jP;=`<%l&WQ'rSlQOY'mZ;'S'm;'S;=`(O<%lO'mQ(RP;=`<%l'mU(ZUlQOY%dYZ&WZ;'S%d;'S;=`(m;=`<%l&W<%lO%dU(rVjSOr&Ws#O&W#O#P&o#P;'S&W;'S;=`'g;=`<%l%d<%lO&WU)[P;=`<%l%d~)hmjSy~lQOX%dXY)_YZ+cZ^)_^p%dpq)_qr%drs'ms#O%d#O#P(U#P#y%d#y#z)_#z$f%d$f$g)_$g#BY%d#BY#BZ)_#BZ$IS%d$IS$I_)_$I_$I|%d$I|$JO)_$JO$JT%d$JT$JU)_$JU$KV%d$KV$KW)_$KW&FU%d&FU&FV)_&FV;'S%d;'S;=`)X<%lO%d~+jjjSy~OX&WX^+c^p&Wpq+cqr&Ws#O&W#O#P&o#P#y&W#y#z+c#z$f&W$f$g+c$g#BY&W#BY#BZ+c#BZ$IS&W$IS$I_+c$I_$I|&W$I|$JO+c$JO$JT&W$JT$JU+c$JU$KV&W$KV$KW+c$KW&FU&W&FU&FV+c&FV;'S&W;'S;=`'g<%lO&WR-cS!bPlQOY'mZ;'S'm;'S;=`(O<%lO'm~-xXjSP~lQOY-oYZ&WZr-ors.es#O-o#O#P/O#P;'S-o;'S;=`0T<%lO-o~.lSP~lQOY.eZ;'S.e;'S;=`.x<%lO.e~.{P;=`<%l.e~/VUP~lQOY-oYZ&WZ;'S-o;'S;=`/i;=`<%l&W<%lO-o~/nVjSOr&Ws#O&W#O#P&o#P;'S&W;'S;=`'g;=`<%l-o<%lO&W~0WP;=`<%l-oV0dX!WPjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV1YX!TPjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV1|]jSlQOY%dYZ&WZr%drs'ms}%d}!O2u!O!`%d!`!a3k!a#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV3OX!`PjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV3tX!YPjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV4jZSPjSlQOY%dYZ&WZr%drs'ms!Q%d!Q![4a![#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV5fX!OPjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV6[X!iPjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV7QX!dPjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV7vX!UPjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV8l]jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV9n_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#i8c#i#j:m#j#o8c#o;'S%d;'S;=`)X<%lO%dV:v_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#h8c#h#i;u#i#o8c#o;'S%d;'S;=`)X<%lO%dV<O_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#[8c#[#]<}#]#o8c#o;'S%d;'S;=`)X<%lO%dV=W_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#c8c#c#d>V#d#o8c#o;'S%d;'S;=`)X<%lO%dV>`_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#f8c#f#g?_#g#o8c#o;'S%d;'S;=`)X<%lO%dV?j]jS!gPlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV@lajSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#d8c#d#eAq#e#f8c#f#gC}#g#o8c#o;'S%d;'S;=`)X<%lO%dVAz_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#a8c#a#bBy#b#o8c#o;'S%d;'S;=`)X<%lO%dVCU]jS!XPlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dVDW_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#X8c#X#YEV#Y#o8c#o;'S%d;'S;=`)X<%lO%dVE`^jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#UF[#U#o8c#o;'S%d;'S;=`)X<%lO%dVFe_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#h8c#h#iGd#i#o8c#o;'S%d;'S;=`)X<%lO%dVGm_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#[8c#[#]Hl#]#o8c#o;'S%d;'S;=`)X<%lO%dVHu_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#X8c#X#YIt#Y#o8c#o;'S%d;'S;=`)X<%lO%dVJP]jS!_PlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dVKR_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#b8c#b#cLQ#c#o8c#o;'S%d;'S;=`)X<%lO%dVLZ_jSlQ!PPOY%dYZ&WZr%drs'ms}%d}!OMY!O!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dVMaZjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P#c%d#c#dNS#d;'S%d;'S;=`)X<%lO%dVNZZjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P#i%d#i#jN|#j;'S%d;'S;=`)X<%lO%dV! TZjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P#h%d#h#i! v#i;'S%d;'S;=`)X<%lO%dV!!PXjS!]PlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV!!u^jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#U!#q#U#o8c#o;'S%d;'S;=`)X<%lO%dV!#z_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#d8c#d#e!$y#e#o8c#o;'S%d;'S;=`)X<%lO%dV!%U_jS}PlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#g8c#g#h!&T#h#o8c#o;'S%d;'S;=`)X<%lO%dV!&`]jS}PlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!'b_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#c8c#c#d!(a#d#o8c#o;'S%d;'S;=`)X<%lO%dV!(j^jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#U!)f#U#o8c#o;'S%d;'S;=`)X<%lO%dV!)o_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#`8c#`#a!*n#a#o8c#o;'S%d;'S;=`)X<%lO%dV!*w_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#]8c#]#^!+v#^#o8c#o;'S%d;'S;=`)X<%lO%dV!,P_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#Z8c#Z#[!-O#[#o8c#o;'S%d;'S;=`)X<%lO%dV!-X_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#b8c#b#c!.W#c#o8c#o;'S%d;'S;=`)X<%lO%dV!.c]jS!cPlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!/e_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#b8c#b#c!0d#c#o8c#o;'S%d;'S;=`)X<%lO%dV!0o]jS!ZPlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!1q^jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#U!2m#U#o8c#o;'S%d;'S;=`)X<%lO%dV!2v_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#V8c#V#W!3u#W#o8c#o;'S%d;'S;=`)X<%lO%dV!4O_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#X8c#X#Y!4}#Y#o8c#o;'S%d;'S;=`)X<%lO%dV!5Y]jS!hPlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!6[_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#X8c#X#Y!7Z#Y#o8c#o;'S%d;'S;=`)X<%lO%dV!7d_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#h8c#h#i!8c#i#o8c#o;'S%d;'S;=`)X<%lO%dV!8n]jS!ePlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!9p_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#b8c#b#c!:o#c#o8c#o;'S%d;'S;=`)X<%lO%dV!:x_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#W8c#W#X!;w#X#o8c#o;'S%d;'S;=`)X<%lO%dV!<Q_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#X8c#X#Y!=P#Y#o8c#o;'S%d;'S;=`)X<%lO%dV!=Y_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#f8c#f#g!>X#g#o8c#o;'S%d;'S;=`)X<%lO%dV!>b_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#k8c#k#l!?a#l#o8c#o;'S%d;'S;=`)X<%lO%dV!?j^jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#U!@f#U#o8c#o;'S%d;'S;=`)X<%lO%dV!@o_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#h8c#h#i!An#i#o8c#o;'S%d;'S;=`)X<%lO%dV!Aw_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#X8c#X#Y!Bv#Y#o8c#o;'S%d;'S;=`)X<%lO%dV!CP_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#f8c#f#g!DO#g#o8c#o;'S%d;'S;=`)X<%lO%dV!DZ]jS!^PlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!E]_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#]8c#]#^!F[#^#o8c#o;'S%d;'S;=`)X<%lO%dV!Fe_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#h8c#h#i!Gd#i#o8c#o;'S%d;'S;=`)X<%lO%dV!Gm_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#[8c#[#]!Hl#]#o8c#o;'S%d;'S;=`)X<%lO%dV!Hw]jS![PlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!I{]jSlQ|P!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!J}X!QPjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV!KsX!RPjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%d",tokenizers:[0,1,2],topRules:{SwimProgramme:[0,2]},tokenPrec:537});function je(e,t){e.firstChild();const n=ce(e,t);let i;return e.nextSibling()&&(i=ce(e,t)),e.parent(),{modifier:1,startIntensity:n,stopIntensity:i}}function ce(e,t){if(e.name==="PaceAlias")return{kind:"alias",value:t.sliceDoc(e.from,e.to)};const n=e.name==="HeartRate"?"heartRate":"percentage";e.firstChild();const i=t.sliceDoc(e.from,e.to);return e.parent(),{kind:n,value:i}}function rn(e,t){e.firstChild();const n=t.sliceDoc(e.from,e.to);e.nextSibling();const i=je(e,t);return e.parent(),{statement:2,name:n,pace:i}}function an(e,t){e.firstChild();const n=t.sliceDoc(e.from,e.to);return e.parent(),{modifier:4,breatheStrokes:n}}function cn(e,t){return e.name==="SwimInstruction"?Ye(e,t):Ie(e,t)}function Qe(e,t){e.firstChild();const n=t.sliceDoc(e.from,e.to);e.nextSibling();const i=t.sliceDoc(e.from,e.to);return e.parent(),{minutes:n,seconds:i}}function ln(e){switch(e){case"Board":return"board";case"Pads":return"pads";case"PullBuoy":return"pullBuoy";case"Fins":return"fins";case"Snorkel":return"snorkel";case"Chute":return"chute";case"StretchCord":return"stretchCord";default:return""}}function dn(e,t){if(e.name==="EquipmentSpecification"){const n=[];e.firstChild();do{const i=t.sliceDoc(e.from,e.to);n.push(ln(i))}while(e.nextSibling());return e.parent(),{modifier:0,equipment:n}}return e.name==="Pace"?je(e,t):e.name==="ExcludeAlignSpecification"?{modifier:3}:e.name==="Breathe"?an(e,t):e.name==="InstructionDescription"?gn(e,t):e.name==="Underwater"?{modifier:5,isTrue:!0}:un(e,t)}function un(e,t){e.firstChild();let n;if(e.name==="RestInOut"){e.firstChild();const i=t.sliceDoc(e.from,e.to);e.parent(),n={modifier:2,type:"InOut",swimmersIn:i}}else{const i=e.name==="RestAfterStop"?"AfterStop":"SinceStart";e.firstChild();const s=Qe(e,t);e.parent(),n={modifier:2,type:i,...s}}return e.parent(),n}function mn(e){switch(e){case"Freestyle":case"Free":case"Fr":return"freestyle";case"Backstroke":case"Back":case"Bk":return"backstroke";case"Breaststroke":case"Breast":case"Br":return"breaststroke";case"Butterfly":case"Fly":case"Fl":return"butterfly";case"IndividualMedley":case"Medley":case"Im":return"individualMedley";case"ReverseIndividualMedley":case"ReverseMedley":case"ReverseIm":return"reverseIndividualMedley";case"IndividualMedleyOverlap":case"MedleyOverlap":case"ImOverlap":return"individualMedleyOverlap";case"IndividualMedleyOrder":case"MedleyOrder":case"ImOrder":return"individualMedleyOrder";case"ReverseIndividualMedleyOrder":case"ReverseMedleyOrder":case"ReverseImOrder":return"reverseIndividualMedleyOrder";case"NumberOne":return"nr1";case"NumberTwo":return"nr2";case"NumberThree":return"nr3";case"NumberFour":return"nr4";case"NotFreestyle":case"NotFree":case"NotFr":return"notFreestyle";case"NotBackstroke":case"NotBack":case"NotBk":return"notBackstroke";case"NotBreastroke":case"NotBreast":case"NotBr":return"notBreastroke";case"NotButterfly":case"NotFly":case"NotFl":return"notButterfly";case"Choice":default:return"any"}}function fn(e){switch(e){case"Kick":return"kicking";case"Pull":return"pulling";case"Drill":return"drill";default:return"standardStroke"}}function On(e,t){e.firstChild();let n;switch(e.name){case"LengthAsLaps":n="laps";break;case"LengthAsTime":n="time";break;case"LengthAsDistance":default:n="distance";break}e.firstChild();const i=n==="time"?{kind:n,...Qe(e,t)}:{kind:n,value:t.sliceDoc(e.from,e.to)};return e.parent(),e.parent(),i}function hn(e,t){e.firstChild();const n=On(e,t);e.nextSibling();const i=mn(t.sliceDoc(e.from,e.to));return e.parent(),{isBlock:!1,length:n,stroke:i}}function pn(e,t){e.firstChild();const n=[];do n.push(cn(e,t));while(e.nextSibling());return e.parent(),{isBlock:!0,instructions:n}}function Ye(e,t){let n=1,i="standardStroke";const s=[];e.firstChild(),e.name==="Number"&&(n=Number(t.sliceDoc(e.from,e.to)),e.nextSibling());const o=e.name==="BlockInstruction"?pn(e,t):hn(e,t);if(e.nextSibling()){let r=!0;if(e.name==="StrokeModifier"&&(i=fn(t.sliceDoc(e.from,e.to)),r=e.nextSibling()),r)do s.push(dn(e,t));while(e.nextSibling())}return e.parent(),{statement:0,repetitions:n,instruction:o,strokeModifier:i,instructionModifiers:s}}function Ie(e,t){return{statement:1,message:t.sliceDoc(e.from,e.to)}}function Sn(e,t){e.firstChild();const n=t.sliceDoc(e.from,e.to);e.nextSibling();const i=t.sliceDoc(e.from,e.to);return e.parent(),{statement:3,constantName:n,value:i}}function Pn(e,t){e.firstChild();const n=t.sliceDoc(e.from,e.to);e.nextSibling();const i=t.sliceDoc(e.from,e.to);let s;return e.nextSibling()&&(s=t.sliceDoc(e.from,e.to)),e.parent(),{statement:4,firstName:n,lastName:i,emailAddress:s}}function gn(e,t){e.firstChild();const n=t.sliceDoc(e.from,e.to);return e.parent(),{modifier:6,description:n}}function yn(e,t){const n=[];function i(){do{let s=null;switch(e.type.name){case"SwimInstruction":s=Ye(e,t);break;case"Message":s=Ie(e,t);break;case"PaceDefinition":s=rn(e,t);break;case"ConstantDefinition":s=Sn(e,t);break;case"AuthorDefinition":s=Pn(e,t);break}s!==null&&n.push(s)}while(e.nextSibling())}return e.firstChild(),i(),{statements:n}}const kn="https://github.com/bartneck/swiML",wn="http://www.w3.org/2001/XMLSchema-instance",bn="https://github.com/bartneck/swiML https://raw.githubusercontent.com/bartneck/swiML/main/version/latest/swiML.xsd";function $(e,t){let n="PT";return Number(e)>0&&(n+=e,n+="M"),Number(t)>0&&(n+=t,n+="S"),n}function xn(e,t){switch(t.statement){case 0:Me(e,t);break;case 1:Ze(e,t);break}}function le(e,t){switch(t.kind){case"alias":e.ele("zone").txt(t.value);break;case"heartRate":e.ele("percentageHeartRate").txt(t.value);break;case"percentage":default:e.ele("percentageEffort").txt(t.value);break}}function Tn(e,t){switch(t.modifier){case 1:{const n=e.ele("intensity");le(n.ele("startIntensity"),t.startIntensity),t.stopIntensity&&le(n.ele("stopIntensity"),t.stopIntensity);break}case 0:for(const n of t.equipment)e.ele("equipment").txt(n);break;case 4:e.ele("breath").txt(t.breatheStrokes);break;case 2:switch(t.type){case"SinceStart":e.ele("rest").ele("sinceStart").txt($(t.minutes,t.seconds));break;case"AfterStop":e.ele("rest").ele("afterStop").txt($(t.minutes,t.seconds));break;case"InOut":e.ele("rest").ele("inOut").txt(t.swimmersIn);break}break;case 3:e.ele("excludeAlign").txt("true");break;case 5:e.ele("underwater").txt(t.isTrue.toString());break;case 6:e.ele("instructionDescription").txt(t.description);break}}function Me(e,t){let n=e;if(t.repetitions>1&&(n=e.ele("instruction"),n=n.ele("repetition"),n.ele("repetitionCount").txt(String(t.repetitions))),t.instruction.isBlock){t.repetitions<=1&&(n=e.ele("instruction"),n=n.ele("repetition"),n.ele("repetitionCount").txt("1"));for(const i of t.instruction.instructions)xn(n,i)}else{n=n.ele("instruction");const i=t.instruction.length,s=n.ele("length");i.kind==="distance"?s.ele("lengthAsDistance").txt(i.value):i.kind=="laps"?s.ele("lengthAsLaps").txt(i.value):s.ele("lengthAsTime").txt($(i.minutes,i.seconds)),t.strokeModifier==="kicking"?n.ele("stroke").ele("kicking").ele("standardKick").txt(t.instruction.stroke):n.ele("stroke").ele("standardStroke").txt(t.instruction.stroke)}if(t.instructionModifiers.length>0)for(const i of t.instructionModifiers)Tn(n,i)}function Ze(e,t){e.ele("instruction").ele("segmentName").txt(t.message)}function vn(e,t){switch(t.constantName){case"Title":e.ele("title").txt(t.value);break;case"Description":e.ele("programDescription").txt(t.value);break;case"Date":e.ele("creationDate").txt(t.value);break;case"PoolLength":e.ele("poolLength").txt(t.value);break;case"LengthUnit":e.ele("lengthUnit").txt(t.value);break;case"Align":e.ele("programAlign").txt(t.value.toLowerCase());break;case"NumeralSystem":e.ele("numeralSystem").txt(t.value);break;case"HideIntro":e.ele("hideIntro").txt(t.value.toLowerCase());break;case"LayoutWidth":e.ele("layoutWidth").txt(t.value);break}}function Rn(e,t){const n=e.ele("author");n.ele("firstName").txt(t.firstName),n.ele("lastName").txt(t.lastName),t.emailAddress&&n.ele("email").txt(t.emailAddress)}function jn(e){const t=Qt.create({version:"1.0",encoding:"UTF-8"}).ele("program",{xmlns:kn,"xmlns:xsi":wn,"xsi:schemaLocation":bn});for(const n of e.statements)switch(n.statement){case 0:Me(t,n);break;case 1:Ze(t,n);break;case 2:break;case 3:vn(t,n);break;case 4:Rn(t,n);break}return t.end({prettyPrint:!0})}function Qn(e){return pt.fromClass(class{constructor(t){this.view=t,this.run(this.view)}update(t){!t.docChanged||St(t.state)!==0||this.run(t.view)}run(t){const n=W(t.state).cursor(),i=yn(n,t.state),s=jn(i);e(s)}})}const Yn=on.configure({props:[wt.add({Application:xt({closing:")",align:!1})}),bt.add({Application:Tt}),jt({Stroke:g.className,StrokeModifier:g.typeName,Duration:g.integer,Percentage:g.integer,Number:g.integer,Identifier:g.variableName,EquipmentName:g.macroName,Comment:g.comment,SetKeyword:g.keyword,RestKeyword:g.keyword,PaceKeyword:g.keyword,OnKeyword:g.keyword})]}),In=gt.define({name:"swimdsl",parser:Yn,languageData:{commentTokens:{line:"#"},autocomplete:Dt,closeBrackets:["{"]}});function Ce(){return new Pt(In,[Te.extension,sn])}function Mn(e){const t=document.createElement("input");t.type="file",t.accept=".txt",t.onchange=n=>{const i=n.target;if(!i.files||i.files.length<=0){console.warn("No files were selected");return}const s=i.files[0],o=new FileReader;o.onload=r=>{var l;const a=(l=r.target)==null?void 0:l.result;typeof a=="string"&&e(a)},o.readAsText(s)},t.click()}function G(e,t){const n=URL.createObjectURL(e),i=document.createElement("a");i.href=n,i.download=t,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(n)}function Zn(e){const t=new Blob([e],{type:"text/plain;charset=utf-8"});G(t,"SwimProgramme.txt")}function Cn(e){const t=new Blob([e],{type:"application/xml"});G(t,"SwimProgramme.xml")}function Dn(e){const t=new Blob([e],{type:"text/html"});G(t,"SwimProgramme.html")}function Wn(e){e.contentWindow!==null&&e.contentWindow.print()}function Xn(e,t,n,i){localStorage.getItem(n)?console.log(n," already exist"):(localStorage.setItem(n,i),t(e))}function Nn(e,t,n){e!==""&&(localStorage.removeItem(e),t(""),n(""))}function I(e,t,n,i,s,o=!0){o&&t&&localStorage.setItem(t,n),i(e),s(localStorage.getItem(e)??"")}const Un=15;function M(e){const[t=0,n=0]=e.split(":").map(Number);return(Number.isNaN(t)?0:t)*60+(Number.isNaN(n)?0:n)}function v(e){const t=Math.max(0,Math.round(e)),n=Math.floor(t/60),i=t%60;return`${n}:${i.toString().padStart(2,"0")}`}function X(e,t){return e/100*t}function Bn(e,t){return Un}const Fn=25,z=/^(?:(\d+)(\s*x\s+))?(\d+:\d+|\d+(?:\s+laps?)?)(\s+)(?=\S)/,K=/^(?:(\d+)(\s*x\s+))?\{/,_n=/^\s*set\s+PoolLength\s+(\d+)/;function x(e){let t="",n=!1;for(let i=0;i<e.length;i++){const s=e[i]??"";if(n){if(s==="\\"&&i+1<e.length){t+="  ",i++;continue}s==='"'?(n=!1,t+='"'):t+=" ";continue}if(s==='"'){n=!0,t+='"';continue}if(s==="#"){t+=" ".repeat(e.length-i);break}t+=s}return t}function $n(e){for(const t of e.split(`
`)){const n=_n.exec(x(t)),i=Number(n==null?void 0:n[1]);if(i>0)return i}return Fn}function Vn(e){const t=e.toLowerCase().replace(/[^a-z]/g,"");return t.includes("warmup")?"warmUp":t.includes("warmdown")||t.includes("cooldown")||t.includes("swimdown")?"warmDown":t.includes("main")?"mainSet":"other"}function De(e,t){var i;if(e.includes(":"))return{kind:"time",seconds:M(e)};const n=Number(((i=/^\d+/.exec(e))==null?void 0:i[0])??"0");return/laps?$/.test(e)?{kind:"laps",laps:n,metres:n*t}:{kind:"distance",metres:n}}function V(e){const t=x(e),n=/(?:^|\s)on\s+(\d+:\d+)/.exec(t);if((n==null?void 0:n[1])!==void 0)return{kind:"sinceStart",seconds:M(n[1])};const i=/(?:^|\s)with\s+(\d+:\d+)/.exec(t);if((i==null?void 0:i[1])!==void 0)return{kind:"afterStop",seconds:M(i[1])};const s=/(?:^|\s)in-out\s+(\d+)/.exec(t);return(s==null?void 0:s[1])!==void 0?{kind:"inOut",swimmers:Number(s[1])}:{kind:"none"}}function Ln(e){let t=0;for(const n of e)n==="{"&&t++,n==="}"&&t--;return t}function An(e,t){const n=[],i=[1];for(let s=1;s<e.length-1;s++){const o=e[s]??"",r=x(o).trim();if(r===""||r.startsWith(">"))continue;const a=i[i.length-1]??1,l=K.exec(r);if(l){i.push(a*(Number(l[1]??"1")||1));continue}if(r.startsWith("}")){i.length>1&&i.pop();continue}const d=z.exec(r);if((d==null?void 0:d[3])===void 0)continue;const u=De(d[3],t);n.push({lineIndex:s,multiplier:a,repetitions:Number(d[1]??"1")||1,metres:u.kind==="distance"||u.kind==="laps"?u.metres:0,fixedSeconds:u.kind==="time"?u.seconds:0,rest:V(o)})}return n}function En(e){let t=0,n=0;for(const i of e){const s=i.multiplier*i.repetitions;t+=s*i.metres,n+=s*i.fixedSeconds}return{metres:t,fixedSeconds:n}}function qn(e,t){const n=e.split(`
`),i=[];let s="other";for(let o=0;o<n.length;o++){const r=n[o]??"",a=x(r).trim();if(a.startsWith(">")){s=Vn(a),i.push({kind:"header",lines:[r],section:s});continue}const l=K.exec(a);if(l){const u=[];let f=0;for(;o<n.length;){const m=n[o]??"";if(u.push(m),f+=Ln(x(m)),f<=0)break;o++}if(f>0){i.push({kind:"verbatim",lines:u});continue}const O=An(u,t);i.push({kind:"instruction",lines:u,section:s,repetitions:Number(l[1]??"1")||1,hasRepetitionOperator:l[1]!==void 0,length:{kind:"block",...En(O)},rest:V(u[u.length-1]??""),inner:O});continue}const d=z.exec(a);if((d==null?void 0:d[3])!==void 0){i.push({kind:"instruction",lines:[r],section:s,repetitions:Number(d[1]??"1")||1,hasRepetitionOperator:d[1]!==void 0,length:De(d[3],t),rest:V(r),inner:[]});continue}i.push({kind:"verbatim",lines:[r]})}return i}function Gn(e){return e.map(t=>t.kind!=="instruction"?{...t,lines:[...t.lines]}:{...t,lines:[...t.lines],length:{...t.length},rest:{...t.rest},inner:t.inner.map(n=>({...n,rest:{...n.rest}}))})}function zn(e){return e.flatMap(t=>t.lines).join(`
`)}function Kn(e,t){switch(e.kind){case"distance":return String(e.metres);case"laps":return t.replace(/^\d+/,String(e.laps));default:return t}}function Z(e,t,n){var f;const i=e.lines[0]??"",s=((f=/^\s*/.exec(i))==null?void 0:f[0])??"",o=i.slice(s.length),r=x(i).slice(s.length),a=K.exec(r);if(a){if(a[1]!==void 0){const O=a[1]+(a[2]??" x ");e.lines[0]=s+String(t)+(a[2]??" x ")+o.slice(O.length),e.repetitions=t}return}const l=z.exec(r);if((l==null?void 0:l[3])===void 0)return;const d=l[1]===void 0?"":String(t)+(l[2]??" x "),u=n===null?l[3]:Kn(n,l[3]);e.lines[0]=s+d+u+(l[4]??" ")+o.slice(l[0].length),l[1]!==void 0&&(e.repetitions=t),n!==null&&(e.length=n)}function de(e,t,n,i=e.lines.length-1){const s=e.lines[i]??"",o=new RegExp(`(^|\\s)(${t})(\\s+)(\\d+:\\d+)`).exec(x(s));if(!o)return;const r=o.index+(o[1]??"").length+(o[2]??"").length+(o[3]??"").length;e.lines[i]=s.slice(0,r)+n+s.slice(r+(o[4]??"").length)}const Hn=.5,Jn=[.25,.5,1,1/0],ei=.25,ti=64,ni=2,ii=5,si=.5;function oi(e,t){const n=new Map,i=(o,r)=>{const a=n.get(o);a?a.push(r):n.set(o,[r])};for(const o of e)if(o.kind==="instruction"){o.rest.kind==="sinceStart"&&i(L(o,t),o.rest.seconds);for(const r of o.inner)r.rest.kind==="sinceStart"&&i(r.metres,r.rest.seconds)}const s=(o,r)=>{const a=n.get(o);if(!a||a.length===0)return 1;const l=a.reduce((d,u)=>d+u,0)/a.length;return l>0?r/l:1};return e.map(o=>{if(o.kind!=="instruction")return[];const r=new Array(o.lines.length).fill(1);o.rest.kind==="sinceStart"&&(r[o.lines.length-1]=s(L(o,t),o.rest.seconds));for(const a of o.inner)a.rest.kind==="sinceStart"&&(r[a.lineIndex]=s(a.metres,a.rest.seconds));return r})}function ri(e,t,n,i,s,o){const r=Gn(e),a=li(r,t,s),l=i.durationSeconds!==null||i.volumeMetres!==null;let d=r,u=a;if(l&&o==="trim"){const f=Pi(r,a,n,i);d=f.elements,u=f.units}else l&&gi(a,n,i,s);return yi(a,n),{source:zn(d),summary:ki(u,n)}}const We="# Fitted to a ";function ai(e,t){const n=t.durationSeconds===null?"":` of ${v(t.durationSeconds)}`;return`${We}${v(e.paceSecondsPer100)} per 100 pace: ${e.totalMetres} metres in ${v(e.totalSeconds)}${n}, training load ${v(e.loadSeconds)}.`}function ci(e){var n;const t=e.split(`
`);for(;(n=t[0])!=null&&n.startsWith(We);)t.shift();return t.join(`
`)}function L(e,t){const n=e.length;switch(n.kind){case"distance":return n.metres;case"laps":return n.laps*t;case"block":return n.metres;case"time":return 0}}function li(e,t,n){const i=[];return e.forEach((s,o)=>{if(s.kind!=="instruction")return;const r=L(s,n),a=s.length,l=t[o]??[];i.push({instruction:s,intervalRatio:l[s.lines.length-1]??1,innerModels:s.inner.map(d=>({inner:d,intervalRatio:l[d.lineIndex]??1})),perRepetitionMetres:r,perRepetitionFixedSeconds:a.kind==="time"?a.seconds:a.kind==="block"?a.fixedSeconds:0,originalMetres:r*s.repetitions,changedMetres:0,canChangeRepetitions:s.hasRepetitionOperator,canChangeLength:a.kind==="distance"||a.kind==="laps"})}),i}function Xe(e,t){return X(e.perRepetitionMetres,t)+e.perRepetitionFixedSeconds}function H(e,t){const n=e+Bn();return Math.max(e,Math.round(n*t))}function Ne(e,t,n){switch(t.kind){case"sinceStart":return H(e,n);case"afterStop":return e+t.seconds;case"inOut":return e+t.swimmers*ii;case"none":return e}}function Ue(e,t){return H(Xe(e,t),e.intervalRatio)}function di(e,t){if(e.innerModels.length===0)return Xe(e,t);let n=0;for(const{inner:i,intervalRatio:s}of e.innerModels){const o=X(i.metres,t)+i.fixedSeconds;n+=i.multiplier*i.repetitions*Ne(o,i.rest,s)}return n}function J(e,t){const n=e.instruction.rest;return(n.kind==="sinceStart"?Ue(e,t):Ne(di(e,t),n,e.intervalRatio))*e.instruction.repetitions}function ee(e){return e.perRepetitionMetres*e.instruction.repetitions}function N(e,t){let n=0,i=0;for(const s of e)n+=J(s,t),i+=ee(s);return{seconds:n,metres:i}}function Be(e,t){const n=ee(e);return n>0?J(e,t)/n:0}function Y(e,t,n){const{seconds:i,metres:s}=N(e,t);return n.durationSeconds!==null&&i>n.durationSeconds+si||n.volumeMetres!==null&&s>n.volumeMetres}function ue(e,t,n,i){const{seconds:s,metres:o}=N(e,t),r=Be(i,t),a=n.volumeMetres===null?0:o-n.volumeMetres,l=n.durationSeconds===null||r<=0?0:(s-n.durationSeconds)/r;return Math.max(a,l)}function ui(e,t,n,i){const{seconds:s,metres:o}=N(e,t),r=Be(i,t),a=n.volumeMetres===null?1/0:n.volumeMetres-o,l=n.durationSeconds===null||r<=0?1/0:(n.durationSeconds-s)/r;return Math.min(a,l)}function Fe(e,t,n){const i=e.instruction.length;return i.kind==="distance"?{kind:"distance",metres:t}:i.kind==="laps"?{kind:"laps",laps:Math.round(t/n),metres:t}:null}function me(e,t,n,i,s){const o=e.instruction.repetitions,r=e.perRepetitionMetres;if(r<=0||n<=0||t<=0&&!s)return 0;const a=Math.min(t,n);let l=0,d=!1;e.canChangeRepetitions&&o>1&&(l=Math.min(o-1,Math.floor(a/r)),l===0&&s&&(l=1,d=!0));const u=o*i;let f=0,O=!1;if(e.canChangeLength){const S=Math.floor((r-i)/i);f=Math.max(0,Math.min(S,Math.floor(a/u))),f===0&&s&&S>0&&(f=1,O=!0)}const m=l*r,p=f*u;if(m>0&&(d===O?d?m<=p||p===0:m*2>=p:!d))return Z(e.instruction,o-l,null),m;if(p>0){const S=r-f*i,y=Fe(e,S,i);if(y)return Z(e.instruction,o,y),e.perRepetitionMetres=S,p}return 0}function mi(e,t,n,i){const s=e.instruction.repetitions,o=e.perRepetitionMetres;if(o<=0)return 0;const r=Math.min(t,n);if(r<=0)return 0;const a=e.canChangeRepetitions?Math.floor(r/o):0,l=s*i,d=e.canChangeLength?Math.floor(r/l):0,u=a*o,f=d*l;if(u>0)return Z(e.instruction,s+a,null),u;if(f>0){const O=o+d*i,m=Fe(e,O,i);if(m)return Z(e.instruction,s,m),e.perRepetitionMetres=O,f}return 0}function te(e){return e==="warmUp"||e==="warmDown"}function fi(e){const t=[],n=[],i=[];for(const s of e){const o=s.instruction.section;te(o)?t.push(s):o==="mainSet"?i.push(s):n.push(s)}return[t,n,i]}function A(e,t){return te(e.instruction.section)?t.remaining:1/0}function E(e,t,n){e.changedMetres+=n,te(e.instruction.section)&&(t.remaining-=n)}function _e(e,t,n=1){return t===1/0?1/0:Math.max(0,n*t*e.originalMetres-e.changedMetres)}function Oi(e){return e.canChangeRepetitions?ni:1}function hi(e){const t=[...e].reverse();return[...t.filter(n=>n.canChangeRepetitions),...t.filter(n=>!n.canChangeRepetitions)]}function pi(e,t,n,i,s,o){for(const r of t){for(const a of Jn){let l=!0;for(;l&&Y(e,n,i);){l=!1;for(let d=r.length-1;d>=0;d--){const u=r[d];if(!u)continue;if(!Y(e,n,i))return;const f=ue(e,n,i,u);if(f<=0)continue;const O=me(u,Math.min(f,_e(u,a)),A(u,o),s,!1);O>0&&(E(u,o,O),l=!0)}}}for(;Y(e,n,i);){let a=0;for(let l=r.length-1;l>=0&&a===0;l--){const d=r[l];d&&(a=me(d,ue(e,n,i,d),A(d,o),s,!0),a>0&&E(d,o,a))}if(a===0)break}if(!Y(e,n,i))return}}function Si(e,t,n,i,s,o){for(const r of t)for(let a=ei;a<=ti;a*=2){let l=!0;for(;l;){l=!1;for(const d of hi(r)){const u=ui(e,n,i,d);if(u<=0)continue;const f=mi(d,Math.min(u,_e(d,a,Oi(d))),A(d,o),s);f>0&&(E(d,o,f),l=!0)}}}}function Pi(e,t,n,i){const s=new Map(t.map(f=>[f.instruction,f])),o=i.durationSeconds??1/0,r=i.volumeMetres??1/0,a=[],l=[];let d=0,u=0;for(const f of e){if(f.kind!=="instruction"){a.push(f);continue}const O=s.get(f);if(!O)continue;const m=f.repetitions,p=J(O,n)/m,P=ee(O)/m,S=Math.min(m,p>0?Math.floor((o-d)/p):m,P>0?Math.floor((r-u)/P):m);if(S>=m){d+=p*m,u+=P*m,a.push(f),l.push(O);continue}S>=1&&O.canChangeRepetitions&&(Z(f,S,null),a.push(f),l.push(O));break}return{elements:a,units:l}}function gi(e,t,n,i){var a;const s=fi(e),o=(a=s[0])==null?void 0:a.reduce((l,d)=>l+d.originalMetres,0),r={remaining:Hn*(o??0)};Y(e,t,n)?pi(e,s,t,n,i,r):Si(e,[...s].reverse(),t,n,i,r)}function yi(e,t){for(const n of e){if(n.instruction.rest.kind==="sinceStart"){const i=Ue(n,t);de(n.instruction,"on",v(i)),n.instruction.rest={kind:"sinceStart",seconds:i}}for(const{inner:i,intervalRatio:s}of n.innerModels){if(i.rest.kind!=="sinceStart")continue;const o=X(i.metres,t)+i.fixedSeconds,r=H(o,s);de(n.instruction,"on",v(r),i.lineIndex),i.rest={kind:"sinceStart",seconds:r}}}}function ki(e,t){const{seconds:n,metres:i}=N(e,t);return{paceSecondsPer100:t,totalSeconds:Math.round(n),totalMetres:Math.round(i),loadSeconds:Math.round(X(i,t))}}function fe(e,t){const n=e.trim();if(n==="")return null;const i=n.includes(":")?M(n):Number(n)*t;return Number.isFinite(i)&&i>0?i:null}function wi(e,t){const n=ci(e),i=$n(n),s=qn(n,i),o=oi(s,i),r={durationSeconds:fe(t.duration,60),volumeMetres:fe(t.volume,1)};return t.paces.map(a=>{const l=ri(s,o,M(a),r,i,t.fit);return{pace:a,source:ai(l.summary,r)+`
`+l.source,summary:l.summary}})}function bi(e,t,n,i){for(const s of wi(e,i))Xn(t,n,`${s.pace} (${t})`,s.source)}function xi({swimdslProgramme:e,selectedFile:t,setSelectedFile:n}){const[i,s]=h.useState(!1),[o,r]=F.useState({group:"",paces:[],duration:"",volume:"",fit:"rescale"}),[a,l]=F.useState(""),d=()=>{s(!0)},u=()=>{s(!1)},f=O=>{if(O.preventDefault(),o.paces.length===0){alert("Please add at least one pace");return}bi(e,t,n,o),console.log(JSON.stringify(o,null,2)),u()};return c.jsxs(c.Fragment,{children:[c.jsx(b,{color:"inherit",onClick:d,children:"Modify Programme"}),c.jsxs(Le,{open:i,onClose:u,fullWidth:!0,maxWidth:"md",children:[c.jsx(Ae,{children:"Modification Details"}),c.jsx(Ee,{children:c.jsxs("form",{onSubmit:f,id:"modification-form",children:[c.jsx(B,{children:c.jsxs(ne,{row:!0,"aria-label":"Basic RadioGroup",name:"GroupSize",value:o.group,defaultValue:"group",onChange:O=>{r(m=>({...m,group:O.target.value}))},children:[c.jsx(C,{value:"individual",control:c.jsx(D,{}),label:"Individual"}),c.jsx(C,{value:"group",control:c.jsx(D,{}),label:"Group"})]})}),c.jsxs(B,{children:[c.jsx(qe,{id:"fit-method-label",children:"Fitting the session"}),c.jsxs(ne,{row:!0,"aria-labelledby":"fit-method-label",name:"FitMethod",value:o.fit,onChange:O=>{r(m=>({...m,fit:O.target.value}))},children:[c.jsx(C,{value:"rescale",control:c.jsx(D,{}),label:"Adjust the sets to fit"}),c.jsx(C,{value:"trim",control:c.jsx(D,{}),label:"Stop when the time runs out"})]})]}),c.jsxs(ie,{direction:"column",spacing:2,children:[c.jsx(B,{children:c.jsxs(ie,{direction:"row",spacing:2,children:[c.jsx(Q,{label:"Add Pace",name:"addPace",type:"text",value:a,onChange:O=>{l(O.target.value)}}),c.jsx(b,{onClick:()=>{r(O=>({...O,paces:[...O.paces,a]})),l("")},color:"inherit",children:"Add Pace"})]})}),c.jsx(Q,{label:"Swimmer Paces (m:ss/100m)",name:"swimmerPaces",type:"text",value:o.paces.join(","),"aria-readonly":!0}),c.jsx(Q,{label:"Session Duration (mins)",name:"sessionDuration",type:"number",value:o.duration,onChange:O=>{r(m=>({...m,duration:O.target.value}))}}),c.jsx(Q,{label:"Session Volume (meters)",name:"sessionVolume",type:"number",value:o.volume,onChange:O=>{r(m=>({...m,volume:O.target.value}))}})]})]})}),c.jsxs(Ge,{children:[c.jsx(b,{onClick:u,children:"Cancel"}),c.jsx(b,{type:"submit",form:"modification-form",children:"Submit"})]})]})]})}function Ti({selectedFile:e,swimdslProgramme:t,setSwimdslProgramme:n,setSelectedFile:i,setNewProgrammeOpen:s,swimlXml:o,htmlString:r,renderNode:a,children:l}){const[d,u]=h.useState(null),f=!!d;function O(S){u(S.currentTarget)}function m(){u(null)}function p(){s(!0)}const P=[{text:"New Programme",icon:c.jsx(Je,{fontSize:"small"}),onclick:p},{text:"Open",icon:c.jsx(et,{fontSize:"small"}),onclick:()=>{Mn(n)}},{text:"Save As",icon:c.jsx(tt,{fontSize:"small"}),onclick:()=>{Zn(t)}},{text:"Export swiML XML",icon:c.jsx(_,{fontSize:"small"}),onclick:()=>{Cn(o)}},{text:"Export HTML",icon:c.jsx(_,{fontSize:"small"}),onclick:()=>{Dn(r)}},{text:"Export as PDF",icon:c.jsx(nt,{fontSize:"small"}),onclick:()=>{a.current!==null&&Wn(a.current)}}];return c.jsx(ze,{sx:{zIndex:S=>S.zIndex.drawer+1},position:"static",children:c.jsxs(he,{children:[c.jsx(pe,{sx:{paddingX:"1em"},children:c.jsx(Se,{variant:"h6",component:"div",children:"SwimDSL"})}),c.jsx(b,{id:"basic-button",onClick:O,color:"inherit",children:"File"}),c.jsx(xi,{swimdslProgramme:t,selectedFile:e,setSelectedFile:i}),c.jsx(Pe,{open:f,anchorEl:d,onClose:m,children:P.map(({text:S,icon:y,onclick:R},U)=>c.jsxs(ge,{onClick:R,children:[c.jsx(Ke,{children:y}),c.jsx(He,{children:S})]},U))}),c.jsx(T,{sx:{ml:"auto"},children:l})]})})}const vi='<?xml version="1.0" encoding="UTF-8"?><program xmlns="https://github.com/bartneck/swiML"/>';async function Ri(e){return(await SaxonJS.transform({stylesheetText:e,sourceText:vi},"async")).stylesheetInternal}async function ji(e,t){return(await SaxonJS.transform({stylesheetInternal:t,sourceText:e,destination:"serialized"},"async")).principalResult}function Qi({xmlString:e,htmlString:t,setHtmlString:n,nodeRef:i}){const[s,o]=h.useState({});return h.useEffect(()=>{fetch("./swiML.sef.json").then(r=>r.text()).then(Ri).then(o).catch(console.error)},[]),h.useEffect(()=>{Object.keys(s).length!==0&&ji(e,s).then(n).catch(console.error)},[s,e,n]),c.jsx("iframe",{ref:i,width:"100%",height:"100%",style:{border:"none"},srcDoc:t})}var w=(e=>(e[e.TUTORIAL=0]="TUTORIAL",e[e.RENDER=1]="RENDER",e[e.SWIML_XML=2]="SWIML_XML",e))(w||{});const Yi=[{page:null,icon:c.jsx(it,{}),label:"Hide panel"},{page:w.RENDER,icon:c.jsx(st,{}),label:"Show render"},{page:w.TUTORIAL,icon:c.jsx(ot,{}),label:"Show tutorial"},{page:w.SWIML_XML,icon:c.jsx(_,{}),label:"Show swiML XML"}];function Ii({setPanelPage:e,activePanelPage:t,selectorOpen:n,setSelectorOpen:i}){return c.jsxs(pe,{children:[Yi.map(({icon:s,page:o,label:r},a)=>c.jsx(se,{title:r,children:c.jsx("span",{children:c.jsx(b,{onClick:()=>{e(o)},disabled:t===o,color:"inherit",children:s})})},a)),c.jsx(se,{title:"Show/hide file picker",children:c.jsx(rt,{onClick:()=>{i(!n)},children:c.jsx(at,{})})})]})}function Mi({xmlContent:e}){const t=ye();return c.jsx(q,{readOnly:!0,value:e,height:"100%",width:"100%",style:{height:"100%"},theme:t.palette.mode,extensions:[vt()]})}const Zi=`### Welcome ###################################################################

# swimDSL is part of a larger project, swiML! Information about the swiML
# project can be found online at https://swiml.org

### Basic Instructions ########################################################

# Writing your first swim instruction:
# Basic swim instructions are written using a distance and a stroke name.
200 Freestyle
100 Breaststroke

# Stroke names can be written in full form as shown above, short form,
# and abbreviated form. The following three instructions are equivalent.
50 Freestyle
50 Free
50 Fr

# Same again for other strokes. I prefer to use the full form, so I will
# continue to use it for the rest of this tutorial. In general I recommend
# choosing one form (full, short, or abbreviated) and sticking with it
# throughout your whole programme for concistancy.
100 Backstroke
100 Back
100 Bk

100 Breaststroke
100 Breast
100 Br

100 Butterfly
100 Fly
100 Fl

# Please note that SwimDSL is case-sensitive, so the following is
# considered an error!
100 butterfly

# Pay attention to the red underline. The SwimDSL editor will provide
# these underlines whenever there is a mistake in your programme.
# Try hovering your cursor over the underlined text. The editor will
# provide you with an error message and often a button to correct your
# mistake too.


### Stroke Modifiers ###########################################################

# One can specify stroke types (kick, pull, or drill) after the stroke name.
100 Backstroke Kick
50 Breaststroke Pull

# When performing kick and pull, it is common to use special equipment. These
# can be specified using the + symbol. You can specify multiple pieces
# of equipment by separating each one with a space. The SwimDSL editor will
# show you an error message if you make an invalid combination of equipment
# for the specified stroke type.
100 Backstroke Kick + Fins Board
200 Freestyle + Fins
50 Freestyle Pull + PullBuoy Pads

# It is also common to specify lengths as being swum completely underwater or
# only breathing after a certain number of strokes.
25 Freestyle underwater
100 Freestyle breathe 5


### Swimming Intensity #########################################################

# To specify intensity for a particular instruction, use the @ symbol.
# Intensity is specified as a percentage of the swimmer's perceived rate of
# excertion.
100 Backstroke @ 60%
50 Backstroke @ 90%

# We can also specify increasing or decreasing effort using a hyphen and a
# greater-than symbol (->).
50 Butterfly @ 55% -> 75%
100 Freestyle @ 80% -> 50%

# Sometimes its nice to use words rather than numbers to specify pace.
# Pace names can be defined using the pace keyword and a specific
# percentage. I recomend placing these definitions close to the top of
# the file before the first instruction.
pace easy = 45%
pace medium = 65%
pace hard = 90%

150 Backstroke @ medium
200 Freestyle @ easy -> hard

# Note that it is an error to use a pace name that isn't defined
50 Butterfly @ max

# Pace names must only contain letters. Numbers, spaces, and other
# symbols are not allowed.

# Oftentimes you may want to specify the swimmers intensity through an individual metric. An example of
# this would be heart rate. This can be done as a percentage of the swimmer's maximum heart rate.

100 Freestyle @ 60bpm -> 70bpm


### Resting ####################################################################

# There are multiple ways to specify rest in swimDSL.

# The first two ways to do so are rest since the start of the instruction, and
# rest after the end of the instruction. These are both written as durations,
# in minutes and seconds, for example, 1:00 specifies one minute.

# Rest since start indicates that the instruction should be completed in less
# time than the duration specified, and any remaining time is rest time. To
# specify rest since start, use the on keyword.
2 x 125 Breaststroke on 2:30
4 x 25 Freestyle on 0:25

# In the above example, the swimmer should not start the second 125 breaststroke
# until two and a half minutes have passed since they started the first 125.
# Similarly, they should not start their next 25 Freestyle until twenty five
# seconds since they started their previous length.

# To specify a fixed duration of rest (rest after finish), use the with keyword
100 Freestyle with 0:15
50 Butterfly with 1:00

# In addition to duration based rests, it is possible to specify a rest
# time as the number of swimmers to finish the instruction before a swimmer
# starts to swim again, this can be achieved with the in-out keyword.
4 x 50 Butterfly in-out 3
2 x 400 Freestyle in-out 2

# In the examples above, a swimmer should not start their next 50 Butterfly until
# 3 other swimmers have finished the same 50 Butterfly rep.
# In the same vein, a swimmer should not start their second 400 Freestyle until
# 2 other swimmers have finished the first 400 Freestyle.


### Repeition ##################################################################

# To repeat an instruction multiple times, use the x symbol.
8 x 25 Freestyle on 0:30
4 x 75 Backstroke

# When using repitition and pace together on an individual instruction,
# the time applies to each individual repitition, rather than grouping
# them all into a single item.

# The following should take a total of four minutes, rather than just one.
4 x 75 Freestyle on 1:00

# The following instruction builds pace six times, over each 100 rather
# than once over the full 600
6 x 100 Freestyle @ 60% -> 80%


### Grouping Instructions ######################################################

# Instructions can be grouped together to apply a repition, pace, stroke
# type, or equipment to many different instructions as a single one.
2 x {
  50 Backstroke
  100 Freestyle
  50 Breaststroke
  0:30 rest
} Pull + PullBuoy @ 70%

# When specifying a pace on a grouped isntruction, the pace applies to
# the whole group as a single item.

# The following medely should be swum in under two minutes, rather than
# having 2 minutes for each length.
{
  25 Butterfly
  25 Backstroke
  25 Breaststroke
  25 Freestyle
} on 2:00

# The following instruction builds pace slowly over the 500 total,
# rather than five times over each 100
{
  100 Freestyle
  100 Backstroke
  100 Freestyle
  100 Breaststroke
  100 Freestyle
} @ 70% -> 90%

# Groups and repitition can be infinitely nested. The following is perfectly
# valid SwimDSL.
2 x {
  50 Freestyle
  2 x {
    50 Backstroke
    2 x {
      50 Breaststroke
      2 x {
        50 Butterfly
        2 x 50 Freestyle
      }
    }
  }
}


### Additional Strokes #########################################################

# The earlier instruction of 25 butterfly, backstroke, breaststroke,
# and freestyle make up an individual medely and can be written more
# concisely using the IndividualMedley stroke.
100 IndividualMedley on 2:00

# To specify that the swimmer has the freedom to choose any stroke of
# their liking, use the Choice stroke.
100 Choice

# Number strokes indicate the swimmer should swim their first, second,
# third, or fourth favourite stoke.
100 NumberOne
100 NumberTwo
100 NumberThree
100 NumberFour


### Additional instruction details #############################################

# While it is possible to model a large variety of swim programs using swimDSL,
# there will always be different instructions that cannot be expressed with the
# options provided here. To solve this it is possible to provide a description
# to an instruction with extra details
100 Freestyle Kick -- "Focus on pointed toes"

# It is also possible to provide a description for a set of repetitions to apply
# to all instructions being repeated
4 x {
100 Kick
50 Freestyle
} -- "Focus on pointed toes"

# In this example the extra description of "Focus on pointed toes" would apply to
# both the 100 Kick and the 50 Freestyle.


### Additional Distances #######################################################

# In addition to simply writing the distance, it is possible to specify the
# distance for an instruction as a number of laps or as a set amount of time.
1 lap Butterfly
4 laps Backstroke
5:00 Freestyle

# For the first two examples, the swimmer should swim 1 lap of Butterfly which in
# the case of a 25m pool would be 25 Butterfly. Similarly 4 laps of Backstroke
# would be the same as 100 Backstroke in a 25m pool. For 5:00 Freestyle, the
# swimmer should swim Freestyle for a continuous 5 minutes.


### Set Headers ################################################################

# You can create section headings using the > symbol. The text you specify will
# be copied verbatim into the document in a bold font.
> Warm up
100 Freestyle

> Set One
4 x 200 Backstroke


### Extras #####################################################################

# It is very usefull for SwimDSL to know information such as the length
# of the pool the programme is being swum in, and the unit that all
# distances are specified in. This allows for the rendered output to show
# the total distance and number of laps in the programme. These are best
# specified at the very top of the file, and should not appear more than once!

set PoolLength 25
set LengthUnit "metres"


# As well as specifying pool length and the unit used for length, one can
# specify information about the programme itself, when it was written, and
# who it was written by.

set Title "Programme Title"
set Author "Programme Author"
set Description "Programme description"
set Date "2025-09-22"  # Must conform to YYYY-MM-DD


# Additional information can be added to configure the programme render. These
# options are shown below with their default values.

set Align True
set NumeralSystem "decimal"
set HideIntro False
set LayoutWidth 50

# Finally, you should have noticed already, any text preceeded by a
# hash symbol (#) is a comment, and completely ignored when rendering.

# Go fourth!
`;function Ci(){const[e,t]=h.useState(Zi),n=ye();return c.jsx(q,{value:e,height:"100%",width:"100%",style:{height:"100%"},theme:n.palette.mode,extensions:[Ce()],onChange:i=>{t(i)}})}function Di({selectorOpen:e,selectedFile:t,setSelectedFile:n,swimdslProgramme:i,setSwimdslProgramme:s}){const[o,r]=h.useState(null),[a,l]=h.useState(""),d=Object.keys(localStorage),u=(m,p)=>{m.preventDefault(),m.stopPropagation(),l(p),I(p,t,i,n,s),r({mouseX:m.clientX+2,mouseY:m.clientY-6})},f=m=>{var y;m.preventDefault();const P=document.elementsFromPoint(m.clientX,m.clientY).find(R=>R.closest("[data-key]")),S=(y=P==null?void 0:P.closest("[data-key]"))==null?void 0:y.getAttribute("data-key");S?(l(S),I(S,t,i,n,s),r({mouseX:m.clientX+2,mouseY:m.clientY-6})):r(null)},O=()=>{r(null),l("")};return c.jsxs(c.Fragment,{children:[c.jsxs(ct,{variant:"persistent",anchor:"right",open:e,sx:{width:250,flexShrink:0,"& .MuiDrawer-paper":{width:250,boxSizing:"border-box",backgroundColor:"lightgray"}},children:[c.jsx(he,{}),c.jsx(lt,{style:{marginTop:10},selectedItems:t,onSelectedItemsChange:(m,p)=>{I(p??"",t,i,n,s)},children:d.map(m=>c.jsx(dt,{itemId:m,"data-key":m,label:m,onContextMenu:p=>{u(p,m)}},m))})]}),c.jsx(Pe,{open:o!==null,onClose:O,anchorReference:"anchorPosition",...o!==null&&{anchorPosition:{top:o.mouseY,left:o.mouseX}},slotProps:{backdrop:{onContextMenu:f},paper:{sx:{width:150}}},children:c.jsx(ge,{onClick:()=>{Nn(a,n,s),O()},children:"Delete"})})]})}const Wi={position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:400,bgcolor:"background.paper",border:"2px solid #000",boxShadow:24,p:4,flexDirection:"column",display:"flex"};function Xi({newProgrammeOpen:e,setNewProgrammeOpen:t,selectedFile:n,swimdslProgramme:i,setSelectedFile:s,setSwimdslProgramme:o}){const[r,a]=h.useState(""),[l,d]=h.useState("");function u(){a(""),t(!1)}function f(){l.trim().length===0?a("Please enter a programme name."):l in localStorage?a("Programme name already in use. Please choose another name."):(localStorage.setItem(l,""),I(l,n,i,s,o),u())}return c.jsx(c.Fragment,{children:c.jsx(ut,{open:e,onClose:u,"aria-labelledby":"modal-modal-title","aria-describedby":"modal-modal-description",children:c.jsxs(T,{sx:Wi,children:[c.jsx(Se,{variant:"h6",component:"div",children:"New Programme:"}),c.jsx(Q,{id:"outlined-basic",label:"Programme name",variant:"outlined",error:r.length>0,helperText:r,onChange:O=>{d(O.target.value)}}),c.jsx(b,{onClick:()=>{f()},children:"Create"})]})})})}function Ni(){const[e,t]=h.useState(!1),[n,i]=h.useState(""),[s,o]=h.useState(""),r=mt("(prefers-color-scheme: dark)"),[a,l]=h.useState(w.RENDER),[d,u]=h.useState(!0),[f,O]=h.useState(""),[m,p]=h.useState(""),P=h.useRef(null),S=h.useMemo(()=>Qn(O),[]),y=h.useMemo(()=>Ce(),[]),R=h.useMemo(()=>ft({palette:{mode:r?"dark":"light"}}),[r]),U=h.useCallback(k=>{o(k),n&&localStorage.setItem(n,k)},[n]);localStorage.length===0&&(localStorage.setItem("First Programme",""),I("First Programme",n,s,i,o));function $e(k){switch(k){case w.TUTORIAL:return c.jsx(Ci,{});case w.RENDER:return c.jsx(Qi,{xmlString:f,htmlString:m,setHtmlString:p,nodeRef:P});case w.SWIML_XML:return c.jsx(Mi,{xmlContent:f})}}return c.jsxs(Ot,{theme:R,children:[c.jsx(ht,{}),c.jsxs(T,{sx:{display:"flex",flexDirection:"column",height:"100vh"},children:[c.jsx(Xi,{newProgrammeOpen:e,setNewProgrammeOpen:t,selectedFile:n,setSelectedFile:i,swimdslProgramme:s,setSwimdslProgramme:o}),c.jsx(Ti,{selectedFile:n,swimdslProgramme:s,setSelectedFile:i,setSwimdslProgramme:o,setNewProgrammeOpen:t,swimlXml:f,htmlString:m,renderNode:P,children:c.jsx(Ii,{activePanelPage:a,setPanelPage:l,selectorOpen:d,setSelectorOpen:u})}),c.jsxs(T,{sx:{display:"flex",flex:1,overflow:"hidden",minHeight:0},children:[c.jsx(T,{sx:{width:a!==null?"50%":"100%",minWidth:0,minHeight:0},borderRight:"1px solid",children:c.jsx(q,{value:s,style:{height:"100%"},width:"100%",height:"100%",theme:r?"dark":"light",extensions:[y,S],onChange:U})}),a!==null&&c.jsx(T,{sx:{width:"50%",overflow:"hidden",minWidth:0,minHeight:0,flexGrow:1,transition:k=>k.transitions.create("margin",{easing:k.transitions.easing.sharp,duration:k.transitions.duration.leavingScreen}),marginRight:d?0:"-250px"},children:$e(a)}),c.jsx(Di,{selectedFile:n,setSelectedFile:i,swimdslProgramme:s,setSwimdslProgramme:o,selectorOpen:d})]})]})]})}const Oe=document.getElementById("root");Oe!==null?Ve.createRoot(Oe).render(c.jsx(F.StrictMode,{children:c.jsx(Ni,{})})):console.error("Root element does not exist!");
