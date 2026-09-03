import{b as d,j as s,r as le}from"./react-CMFr3qCg.js";import{c as ce}from"./react-dom-DX5UQ9U7.js";import{A as de,T as M,P as V,a as F,B as j,M as $,b as _,L as me,c as Oe,d as k,e as ue,U as fe,S as he,C as v,f as pe,V as Se,I as Pe,H as ge,g as R,h as ye,i as be,u as L,D as we,j as ke,k as Te,l as xe,m as Qe,n as Ye,o as ve,p as Ze,q as je}from"./@mui-DI8l9HUk.js";import{R as X}from"./@uiw-PGa3NKDv.js";import{V as Xe,G as Ie,H as Q,L as Re,I as We,J as De,K as Ue,M as Ce,N as Ne,O as Be,P as Me,Q as Ve}from"./@codemirror-HnVgEYRi.js";import{L as Fe,s as $e,a as h}from"./@lezer-CRier5-m.js";import{d as W}from"./fastest-levenshtein-ChoUA_u9.js";import{x as _e}from"./xmlbuilder2-DPvUJURa.js";import"./hoist-non-react-statics-VTAvmUN5.js";import"./scheduler-Bb8JjhAW.js";import"./@emotion-D3xeAZ7B.js";import"./@babel-BtohYyOd.js";import"./stylis-DDa9OTMq.js";import"./clsx-B-dksMZM.js";import"./@popperjs-CMBiYTiD.js";import"./@base-ui-k8nSAhao.js";import"./reselect-D6JaGe0o.js";import"./use-sync-external-store-DgWmawwA.js";import"./react-transition-group-D_SqvwCt.js";import"./react-is-BPJnJB5S.js";import"./crelt-C8TCjufn.js";import"./@marijn-DXwl3gUT.js";import"./style-mod-Bs6eFhZE.js";import"./w3c-keyname-Vcq4gwWv.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(o){if(o.ep)return;o.ep=!0;const r=n(o);fetch(o.href,r)}})();const A=["Freestyle","Free","Fr","Backstroke","Back","Bk","Breaststroke","Breast","Br","Butterfly","Fly","Fl","Choice","IndividualMedley","Medley","Im","ReverseIndividualMedley","ReverseMedley","ReverseIm","IndividualMedleyOverlap","MedleyOverlap","ImOverlap","IndividualMedleyOrder","MedleyOrder","ImOrder","ReverseIndividualMedleyOrder","ReverseMedleyOrder","ReverseImOrder","NumberOne","NumberTwo","NumberThree","NumberFour","NotFreestyle","NotFree","NotFr","NotBackstroke","NotBack","NotBk","NotBreastroke","NotBreast","NotBr","NotButterfly","NotFly","NotFl"],E=["Pull","Kick","Drill"],q=["Board","Pads","PullBuoy","Fins","Snorkel","Chute","StretchCord"],K=["Title","Description","Date","PoolLength","LengthUnit","Align","NumeralSystem","HideIntro","LayoutWidth"],Le=["True","False"];function D(e){const t=new Set,n=Q(e).cursor();do{if(n.name!=="PaceDefinition"||!n.firstChild())continue;const i=e.sliceDoc(n.from,n.to);t.add(i),n.parent()}while(n.next());return t}const z=De.define({create:D,update(e,t){return t.docChanged?D(t.state):e}}),Ae=A.map(e=>({label:e,type:"constant",boost:e.length})),Ee=q.map(e=>({label:e,type:"constant"})),qe=E.map(e=>({label:e,type:"constant"})),Ke=K.map(e=>({label:e,type:"constant"})),U={0:{priorNodeName:"Distance",nodeName:"Stroke",completions:Ae},1:{priorNodeName:"EquipmentSpecification",nodeName:"EquipmentName",completions:Ee},2:{priorNodeName:"Pace",nodeName:"PaceAlias",completions:[]},3:{priorNodeName:"",nodeName:"StrokeModifier",completions:qe},4:{priorNodeName:"",nodeName:"ConstantName",completions:Ke}};function ze(e){const t=Q(e.state).resolveInner(e.pos,-1);U[2].completions=Array.from(e.state.field(z)).map(n=>({label:n,type:"variable"}));for(const{priorNodeName:n,nodeName:i,completions:o}of Object.values(U)){if(t.name===n)return{from:e.pos,options:o,validFor:/^[A-Za-z]/};if(t.name===i)return{from:t.from,to:t.to,options:o,validFor:/^[A-Za-z]/}}return null}function J(e,t){const[n,...i]=t;return i.reduce(([o,r],a)=>{const l=W(e,a);return l<r?[a,l]:[o,r]},[n,W(e,n)])}const G=2;function Je(e,t){const n=[];if(t.size>0){const[i,o]=J(e,Array.from(t));o<=G&&n.push({name:`Did you mean '${i}'?`,apply(r,a,l){r.dispatch({changes:{from:a,to:l,insert:i}})}})}return n.push({name:"Define pace name",apply(i){i.dispatch({changes:{from:0,to:0,insert:`pace ${e} = _%
`}})}}),n}function Ge(e){return[{name:"Remove duplicated definition",apply(t){t.dispatch({changes:{from:e.from,to:e.to}})}}]}function He(e,t){const[n,i]=J(e,t);return i>G?[]:[{name:`Did you mean ${n}`,apply(o,r,a){o.dispatch({changes:{from:r,to:a,insert:n}})}}]}function et(e,t,n){return{from:t.from,to:t.to,severity:"error",message:`A pace named '${e}' has already been defined`,actions:Ge(n)}}function tt(e,t,n){return{from:e.from,to:e.to,severity:"error",actions:Je(t,n),message:`'${t}' is not a defined pace name.
If you wish to be able to use '${t}' in the place of a pace percentage, please define it with the following line:
Pace ${t} = _%`}}function nt(e){return{from:e.from,to:e.to,severity:"error",message:"Syntax error"}}function it(e,t){return{from:e,to:t,severity:"error",message:"Duplicate equipment specified. Please do not use the same equipment multiple times"}}function ot(e,t,n,i){return{from:e,to:t,severity:"error",message:`'${n}' is not compatible with stroke type '${i}'`}}function st(e,t){return{from:e,to:t,severity:"error",message:"Multiple rest times specified. Please only specify at most one rest time per instruction."}}function rt(e){return e.replace(/([a-z])([A-Z])/g,"$1 $2").toLowerCase()}function at(e,t,n,i){return{from:e.from,to:e.to,severity:"error",message:`${t} is not a valid ${rt(n)}.`,actions:He(t,i)}}function lt(e){return{from:e.from,to:e.to,severity:"error",message:"Number too large for duration"}}const ct=59;function dt(e,t,n,i){if(e.name!=="PaceAlias")return;const o=n.sliceDoc(e.from,e.to);t.has(o)||i.push(tt(e,o,t))}function mt(e,t,n,i){if(e.name!=="PaceDefinitionName")return;const o=n.sliceDoc(e.from,e.to),r=e.node.parent;r!==null&&(t.has(o)?i.push(et(o,e,r)):t.add(o))}function Ot(e,t){e.name==="⚠"&&t.push(nt(e))}const ut=new Map([["Default",new Set(["Board","PullBuoy"])],["Kick",new Set(["PullBuoy","Pads"])],["Pull",new Set(["Board","Fins"])]]);function ft(e,t,n){if(e.name!=="Instruction")return;const i=e.node.getChild("EquipmentSpecification");if(i===null)return;const o=e.node.getChild("StrokeType"),r=o!==null?t.sliceDoc(o.from,o.to):"Default",a=o!==null?o.from:i.from,l=i.getChildren("EquipmentName").map(u=>t.sliceDoc(u.from,u.to)),m=new Set(l);m.size!==l.length&&n.push(it(a,i.to));const f=ut.get(r);if(f!==void 0)for(const u of m)f.has(u)&&n.push(ot(a,i.to,u,r))}function ht(e,t){var a;if(e.name!=="Rest")return;const n=e.node.parent;if(!n)return;const i=n.getChildren("Rest");if(i.length<=1||((a=i[0])==null?void 0:a.from)!==e.from)return;const o=i[0],r=i[i.length-1];r!==void 0&&t.push(st(o.from,r.to))}function T(e,t,n,i,o){if(e.name!==n)return;const r=t.sliceDoc(e.from,e.to);i.includes(r)||o.push(at(e,r,n,i))}function pt(e,t,n){if(e.name!=="Duration")return;const i=e.node.getChildren("Number");for(const o of i)Number(t.sliceDoc(o.from,o.to))>ct&&n.push(lt(o))}function St(e){const t=[],n=new Set,i=e.state,o=Q(i).cursor();do dt(o,n,i,t),mt(o,n,i,t),Ot(o,t),ft(o,i,t),T(o,i,"Stroke",A,t),T(o,i,"StrokeModifier",E,t),T(o,i,"EquipmentName",q,t),T(o,i,"Boolean",Le,t),T(o,i,"ConstantName",K,t),pt(o,i,t),ht(o,t);while(o.next());return t}var Pt=Ue(St);const gt=Fe.deserialize({version:14,states:"+vQYQPOOOnQPO'#CcOOQO'#Ce'#CeOOQO'#Cb'#CbO|QPO'#CaO!RQPO'#ChO#OQPO'#C_OOQO'#DX'#DXO#lQPO'#CyO#qQPO'#C|O#vQPO'#C}OOQO'#DW'#DWOOQO'#DP'#DPQYQPOOO#{QQO'#DXOOQO,59O,59OO$QQPO,59QO$VQPO,58yOOQO'#Cg'#CgOOQO,58{,58{OOQO'#DQ'#DQO$_QPO,59SOOQO'#Ci'#CiO$mQPO'#CjO$rQPO'#CpO$rQPO'#CqO$wQPO'#CrOOQO'#Co'#CoOOQO'#Cs'#CsO$|QPO'#CtO#qQPO'#CuOOQO'#Cw'#CwOOQO'#D`'#D`OOQO'#DR'#DRO%RQPO,58yO%RQPO,58yO&YQPO'#D`OOQO'#Cz'#CzO&bQPO,59eO&mQSO'#DmO#qQPO,59hOOQO'#DO'#DOO&rQPO,59iOOQO-E6}-E6}OOQO,59s,59sOOQO1G.l1G.lOqQPO'#CcO&wQPO1G.eOOQO-E7O-E7OOOQO1G.n1G.nOOQO'#Ck'#CkOOQO'#DS'#DSO'eQPO,59UO(oQPO'#CfOOQO,59[,59[OOQO,59],59]OOQO,59^,59^OOQO,59`,59`OOQO,59a,59aOOQO-E7P-E7PO(tQPO1G.eO)bQPO'#CmOOQO'#Cn'#CnOOQO'#Dc'#DcO)jQPO'#ClOOQO,59z,59zOOQO'#C{'#C{OOQO'#Dr'#DrOOQO1G/P1G/PO*tQPO,5:XO*yQPO1G/SO&YQPO1G/TO+eQPO7+$PO+eQPO7+$POOQO-E7Q-E7QOOQO,59X,59XOOQO,59},59}O&YQPO,59WOOQO1G/s1G/sOOQO7+$n7+$nOOQO7+$o7+$oO,RQPO<<GkOOQO1G.r1G.r",stateData:"-R~OyOSPOS~OSPO!QTO!d^O!eWO!gXO!hYO~O|aO}_O!O`O!PVX~O!PbO~OSPO!QTO!d^O~O!PfO!TgO!UtO!ZhO![iO!]jO!^lO!_mO!`nO!coO~OSRXwRX!QRX!dRX!eRX!gRX!hRX!RRX~P!^O!PuO~O!bwO~O!PyO~Ol|O~OS}O~OS!OO!QTO~OSPO!QTO!R!RO!d^O~O!P!SO~OS!VO~OS!YO~OS!ZO~O!TgO!UtO!ZhO![iO!]jO!^lO!_mO!`nO!coOSRawRa!QRa!dRa!eRa!gRa!hRa!RRa~OS!_O!P!`O~OS!eO!P!dO!bwO~Oj!gO~O!i!iO~OSRiwRi!QRi!dRi!eRi!gRi!hRi!RRi~P!^O!P!SOS^aw^a!Q^a!T^a!U^a!Z^a![^a!]^a!^^a!_^a!`^a!c^a!d^a!e^a!g^a!h^a!R^a~O!O`O~OSRiwRi!QRi!dRi!eRi!gRi!hRi!RRi~P!aO!W!nO!X!mO~O!Y!oOS`Xw`X!Q`X!T`X!U`X!Z`X![`X!]`X!^`X!_`X!``X!c`X!d`X!e`X!g`X!h`X!R`X~O!b!pO~O!bwOSpiwpi!Qpi!dpi!epi!gpi!hpi~OSRqwRq!QRq!dRq!eRq!gRq!hRq!RRq~P!aOSRywRy!QRy!dRy!eRy!gRy!hRy!RRy~P!aOj!X!]![!_!^!c}y!Z!g!e!hPl|!P~",goto:"&f!gPPP!hP!n!w#O#O#O#V#d!n#g#m#w#{$R$R#m$W$W$W#m#m#mP#mP$b$f$i$b$b$l$o$u${%_PPP%e%iPPPPPP%qPP%{PPPPPPPPP&SPPPP&cXVOT]eWUOT]eR!PaZSOT]aeZROT]aeYQOT]aeQ!WhR!XiRcSQsUR!k!PapUrs!P!^!j!k!sT!Tg!UQ!ctR!r!iV!at!i!oakUrs!P!^!j!k!sTZO]RvWR!evRzYQ]OR{]QeTR!QeQrUW!]r!^!j!sQ!^sQ!j!PR!s!kQ!UgR!l!UT[O]SZO]TdTeaqUrs!P!^!j!k!sS!bt!iR!t!oQxXQ![nQ!evQ!hxR!q!hR!fv",nodeNames:"⚠ Comment SwimProgramme SwimInstruction Number SingleInstruction Length LengthAsDistance LengthAsLaps LengthAsTime Duration Stroke BlockInstruction StrokeModifier EquipmentSpecification EquipmentName Pace HeartRate PaceAlias Rest RestSinceStart RestAfterStop RestInOut Underwater Breathe InstructionDescription StringContent ExcludeAlignSpecification Message ConstantDefinition ConstantName Boolean AuthorDefinition PaceDefinition PaceDefinitionName",maxTerm:71,skippedNodes:[0,1],repeatNodeCount:4,tokenData:"!L`~R!eOX%dXY)_YZ+cZ^)_^p%dpq)_qr%drs-[st-otu%duv0Zv{%d{|1P|}%d}!O1u!O!Q%d!Q![4a![!]5]!]!_%d!_!`6R!`!a6w!a!b%d!b!c7m!c!}8c!}#O%d#O#P(U#P#T%d#T#U9e#U#V@c#V#]8c#]#^Jx#^#`8c#`#a!!l#a#b8c#b#c!'X#c#d!/[#d#e!1h#e#g8c#g#h!6R#h#i8c#i#j!9g#j#k8c#k#l!ES#l#m!Ip#m#o8c#o#p!Jt#p#q%d#q#r!Kj#r#y%d#y#z)_#z$f%d$f$g)_$g#BY%d#BY#BZ)_#BZ$IS%d$IS$I_)_$I_$I|%d$I|$JO)_$JO$JT%d$JT$JU)_$JU$KV%d$KV$KW)_$KW&FU%d&FU&FV)_&FV;'S%d;'S;=`)X<%lO%dU%kXjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dS&]UjSOr&Ws#O&W#O#P&o#P;'S&W;'S;=`'g<%lO&WS&rRO;'S&W;'S;=`&{;=`O&WS'QVjSOr&Ws#O&W#O#P&o#P;'S&W;'S;=`'g;=`<%l&W<%lO&WS'jP;=`<%l&WQ'rSlQOY'mZ;'S'm;'S;=`(O<%lO'mQ(RP;=`<%l'mU(ZUlQOY%dYZ&WZ;'S%d;'S;=`(m;=`<%l&W<%lO%dU(rVjSOr&Ws#O&W#O#P&o#P;'S&W;'S;=`'g;=`<%l%d<%lO&WU)[P;=`<%l%d~)hmjSy~lQOX%dXY)_YZ+cZ^)_^p%dpq)_qr%drs'ms#O%d#O#P(U#P#y%d#y#z)_#z$f%d$f$g)_$g#BY%d#BY#BZ)_#BZ$IS%d$IS$I_)_$I_$I|%d$I|$JO)_$JO$JT%d$JT$JU)_$JU$KV%d$KV$KW)_$KW&FU%d&FU&FV)_&FV;'S%d;'S;=`)X<%lO%d~+jjjSy~OX&WX^+c^p&Wpq+cqr&Ws#O&W#O#P&o#P#y&W#y#z+c#z$f&W$f$g+c$g#BY&W#BY#BZ+c#BZ$IS&W$IS$I_+c$I_$I|&W$I|$JO+c$JO$JT&W$JT$JU+c$JU$KV&W$KV$KW+c$KW&FU&W&FU&FV+c&FV;'S&W;'S;=`'g<%lO&WR-cS!bPlQOY'mZ;'S'm;'S;=`(O<%lO'm~-xXjSP~lQOY-oYZ&WZr-ors.es#O-o#O#P/O#P;'S-o;'S;=`0T<%lO-o~.lSP~lQOY.eZ;'S.e;'S;=`.x<%lO.e~.{P;=`<%l.e~/VUP~lQOY-oYZ&WZ;'S-o;'S;=`/i;=`<%l&W<%lO-o~/nVjSOr&Ws#O&W#O#P&o#P;'S&W;'S;=`'g;=`<%l-o<%lO&W~0WP;=`<%l-oV0dX!WPjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV1YX!TPjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV1|]jSlQOY%dYZ&WZr%drs'ms}%d}!O2u!O!`%d!`!a3k!a#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV3OX!`PjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV3tX!YPjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV4jZSPjSlQOY%dYZ&WZr%drs'ms!Q%d!Q![4a![#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV5fX!OPjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV6[X!iPjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV7QX!dPjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV7vX!UPjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV8l]jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV9n_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#i8c#i#j:m#j#o8c#o;'S%d;'S;=`)X<%lO%dV:v_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#h8c#h#i;u#i#o8c#o;'S%d;'S;=`)X<%lO%dV<O_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#[8c#[#]<}#]#o8c#o;'S%d;'S;=`)X<%lO%dV=W_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#c8c#c#d>V#d#o8c#o;'S%d;'S;=`)X<%lO%dV>`_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#f8c#f#g?_#g#o8c#o;'S%d;'S;=`)X<%lO%dV?j]jS!gPlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV@lajSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#d8c#d#eAq#e#f8c#f#gC}#g#o8c#o;'S%d;'S;=`)X<%lO%dVAz_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#a8c#a#bBy#b#o8c#o;'S%d;'S;=`)X<%lO%dVCU]jS!XPlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dVDW_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#X8c#X#YEV#Y#o8c#o;'S%d;'S;=`)X<%lO%dVE`^jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#UF[#U#o8c#o;'S%d;'S;=`)X<%lO%dVFe_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#h8c#h#iGd#i#o8c#o;'S%d;'S;=`)X<%lO%dVGm_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#[8c#[#]Hl#]#o8c#o;'S%d;'S;=`)X<%lO%dVHu_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#X8c#X#YIt#Y#o8c#o;'S%d;'S;=`)X<%lO%dVJP]jS!_PlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dVKR_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#b8c#b#cLQ#c#o8c#o;'S%d;'S;=`)X<%lO%dVLZ_jSlQ!PPOY%dYZ&WZr%drs'ms}%d}!OMY!O!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dVMaZjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P#c%d#c#dNS#d;'S%d;'S;=`)X<%lO%dVNZZjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P#i%d#i#jN|#j;'S%d;'S;=`)X<%lO%dV! TZjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P#h%d#h#i! v#i;'S%d;'S;=`)X<%lO%dV!!PXjS!]PlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV!!u^jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#U!#q#U#o8c#o;'S%d;'S;=`)X<%lO%dV!#z_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#d8c#d#e!$y#e#o8c#o;'S%d;'S;=`)X<%lO%dV!%U_jS}PlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#g8c#g#h!&T#h#o8c#o;'S%d;'S;=`)X<%lO%dV!&`]jS}PlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!'b_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#c8c#c#d!(a#d#o8c#o;'S%d;'S;=`)X<%lO%dV!(j^jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#U!)f#U#o8c#o;'S%d;'S;=`)X<%lO%dV!)o_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#`8c#`#a!*n#a#o8c#o;'S%d;'S;=`)X<%lO%dV!*w_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#]8c#]#^!+v#^#o8c#o;'S%d;'S;=`)X<%lO%dV!,P_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#Z8c#Z#[!-O#[#o8c#o;'S%d;'S;=`)X<%lO%dV!-X_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#b8c#b#c!.W#c#o8c#o;'S%d;'S;=`)X<%lO%dV!.c]jS!cPlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!/e_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#b8c#b#c!0d#c#o8c#o;'S%d;'S;=`)X<%lO%dV!0o]jS!ZPlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!1q^jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#U!2m#U#o8c#o;'S%d;'S;=`)X<%lO%dV!2v_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#V8c#V#W!3u#W#o8c#o;'S%d;'S;=`)X<%lO%dV!4O_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#X8c#X#Y!4}#Y#o8c#o;'S%d;'S;=`)X<%lO%dV!5Y]jS!hPlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!6[_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#X8c#X#Y!7Z#Y#o8c#o;'S%d;'S;=`)X<%lO%dV!7d_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#h8c#h#i!8c#i#o8c#o;'S%d;'S;=`)X<%lO%dV!8n]jS!ePlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!9p_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#b8c#b#c!:o#c#o8c#o;'S%d;'S;=`)X<%lO%dV!:x_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#W8c#W#X!;w#X#o8c#o;'S%d;'S;=`)X<%lO%dV!<Q_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#X8c#X#Y!=P#Y#o8c#o;'S%d;'S;=`)X<%lO%dV!=Y_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#f8c#f#g!>X#g#o8c#o;'S%d;'S;=`)X<%lO%dV!>b_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#k8c#k#l!?a#l#o8c#o;'S%d;'S;=`)X<%lO%dV!?j^jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#U!@f#U#o8c#o;'S%d;'S;=`)X<%lO%dV!@o_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#h8c#h#i!An#i#o8c#o;'S%d;'S;=`)X<%lO%dV!Aw_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#X8c#X#Y!Bv#Y#o8c#o;'S%d;'S;=`)X<%lO%dV!CP_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#f8c#f#g!DO#g#o8c#o;'S%d;'S;=`)X<%lO%dV!DZ]jS!^PlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!E]_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#]8c#]#^!F[#^#o8c#o;'S%d;'S;=`)X<%lO%dV!Fe_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#h8c#h#i!Gd#i#o8c#o;'S%d;'S;=`)X<%lO%dV!Gm_jSlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#[8c#[#]!Hl#]#o8c#o;'S%d;'S;=`)X<%lO%dV!Hw]jS![PlQ!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!I{]jSlQ|P!PPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!J}X!QPjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV!KsX!RPjSlQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%d",tokenizers:[0,1,2],topRules:{SwimProgramme:[0,2]},tokenPrec:537});function H(e,t){e.firstChild();const n=C(e,t);let i;return e.nextSibling()&&(i=C(e,t)),e.parent(),{modifier:1,startIntensity:n,stopIntensity:i}}function C(e,t){if(e.name==="PaceAlias")return{kind:"alias",value:t.sliceDoc(e.from,e.to)};const n=e.name==="HeartRate"?"heartRate":"percentage";e.firstChild();const i=t.sliceDoc(e.from,e.to);return e.parent(),{kind:n,value:i}}function yt(e,t){e.firstChild();const n=t.sliceDoc(e.from,e.to);e.nextSibling();const i=H(e,t);return e.parent(),{statement:2,name:n,pace:i}}function bt(e,t){e.firstChild();const n=t.sliceDoc(e.from,e.to);return e.parent(),{modifier:4,breatheStrokes:n}}function wt(e,t){return e.name==="SwimInstruction"?te(e,t):ne(e,t)}function ee(e,t){e.firstChild();const n=t.sliceDoc(e.from,e.to);e.nextSibling();const i=t.sliceDoc(e.from,e.to);return e.parent(),{minutes:n,seconds:i}}function kt(e){switch(e){case"Board":return"board";case"Pads":return"pads";case"PullBuoy":return"pullBuoy";case"Fins":return"fins";case"Snorkel":return"snorkel";case"Chute":return"chute";case"StretchCord":return"stretchCord";default:return""}}function Tt(e,t){if(e.name==="EquipmentSpecification"){const n=[];e.firstChild();do{const i=t.sliceDoc(e.from,e.to);n.push(kt(i))}while(e.nextSibling());return e.parent(),{modifier:0,equipment:n}}return e.name==="Pace"?H(e,t):e.name==="ExcludeAlignSpecification"?{modifier:3}:e.name==="Breathe"?bt(e,t):e.name==="InstructionDescription"?Rt(e,t):e.name==="Underwater"?{modifier:5,isTrue:!0}:xt(e,t)}function xt(e,t){e.firstChild();let n;if(e.name==="RestInOut"){e.firstChild();const i=t.sliceDoc(e.from,e.to);e.parent(),n={modifier:2,type:"InOut",swimmersIn:i}}else{const i=e.name==="RestAfterStop"?"AfterStop":"SinceStart";e.firstChild();const o=ee(e,t);e.parent(),n={modifier:2,type:i,...o}}return e.parent(),n}function Qt(e){switch(e){case"Freestyle":case"Free":case"Fr":return"freestyle";case"Backstroke":case"Back":case"Bk":return"backstroke";case"Breaststroke":case"Breast":case"Br":return"breaststroke";case"Butterfly":case"Fly":case"Fl":return"butterfly";case"IndividualMedley":case"Medley":case"Im":return"individualMedley";case"ReverseIndividualMedley":case"ReverseMedley":case"ReverseIm":return"reverseIndividualMedley";case"IndividualMedleyOverlap":case"MedleyOverlap":case"ImOverlap":return"individualMedleyOverlap";case"IndividualMedleyOrder":case"MedleyOrder":case"ImOrder":return"individualMedleyOrder";case"ReverseIndividualMedleyOrder":case"ReverseMedleyOrder":case"ReverseImOrder":return"reverseIndividualMedleyOrder";case"NumberOne":return"nr1";case"NumberTwo":return"nr2";case"NumberThree":return"nr3";case"NumberFour":return"nr4";case"NotFreestyle":case"NotFree":case"NotFr":return"notFreestyle";case"NotBackstroke":case"NotBack":case"NotBk":return"notBackstroke";case"NotBreastroke":case"NotBreast":case"NotBr":return"notBreastroke";case"NotButterfly":case"NotFly":case"NotFl":return"notButterfly";case"Choice":default:return"any"}}function Yt(e){switch(e){case"Kick":return"kicking";case"Pull":return"pulling";case"Drill":return"drill";default:return"standardStroke"}}function vt(e,t){e.firstChild();let n;switch(e.name){case"LengthAsLaps":n="laps";break;case"LengthAsTime":n="time";break;case"LengthAsDistance":default:n="distance";break}e.firstChild();const i=n==="time"?{kind:n,...ee(e,t)}:{kind:n,value:t.sliceDoc(e.from,e.to)};return e.parent(),e.parent(),i}function Zt(e,t){e.firstChild();const n=vt(e,t);e.nextSibling();const i=Qt(t.sliceDoc(e.from,e.to));return e.parent(),{isBlock:!1,length:n,stroke:i}}function jt(e,t){e.firstChild();const n=[];do n.push(wt(e,t));while(e.nextSibling());return e.parent(),{isBlock:!0,instructions:n}}function te(e,t){let n=1,i="standardStroke";const o=[];e.firstChild(),e.name==="Number"&&(n=Number(t.sliceDoc(e.from,e.to)),e.nextSibling());const r=e.name==="BlockInstruction"?jt(e,t):Zt(e,t);if(e.nextSibling()){let a=!0;if(e.name==="StrokeModifier"&&(i=Yt(t.sliceDoc(e.from,e.to)),a=e.nextSibling()),a)do o.push(Tt(e,t));while(e.nextSibling())}return e.parent(),{statement:0,repetitions:n,instruction:r,strokeModifier:i,instructionModifiers:o}}function ne(e,t){return{statement:1,message:t.sliceDoc(e.from,e.to)}}function Xt(e,t){e.firstChild();const n=t.sliceDoc(e.from,e.to);e.nextSibling();const i=t.sliceDoc(e.from,e.to);return e.parent(),{statement:3,constantName:n,value:i}}function It(e,t){e.firstChild();const n=t.sliceDoc(e.from,e.to);e.nextSibling();const i=t.sliceDoc(e.from,e.to);let o;return e.nextSibling()&&(o=t.sliceDoc(e.from,e.to)),e.parent(),{statement:4,firstName:n,lastName:i,emailAddress:o}}function Rt(e,t){e.firstChild();const n=t.sliceDoc(e.from,e.to);return e.parent(),{modifier:6,description:n}}function Wt(e,t){const n=[];function i(){do{let o=null;switch(e.type.name){case"SwimInstruction":o=te(e,t);break;case"Message":o=ne(e,t);break;case"PaceDefinition":o=yt(e,t);break;case"ConstantDefinition":o=Xt(e,t);break;case"AuthorDefinition":o=It(e,t);break}o!==null&&n.push(o)}while(e.nextSibling())}return e.firstChild(),i(),{statements:n}}const Dt="https://github.com/bartneck/swiML",Ut="http://www.w3.org/2001/XMLSchema-instance",Ct="https://github.com/bartneck/swiML https://raw.githubusercontent.com/bartneck/swiML/main/version/latest/swiML.xsd";function Z(e,t){let n="PT";return Number(e)>0&&(n+=e,n+="M"),Number(t)>0&&(n+=t,n+="S"),n}function Nt(e,t){switch(t.statement){case 0:ie(e,t);break;case 1:oe(e,t);break}}function N(e,t){switch(t.kind){case"alias":e.ele("zone").txt(t.value);break;case"heartRate":e.ele("percentageHeartRate").txt(t.value);break;case"percentage":default:e.ele("percentageEffort").txt(t.value);break}}function Bt(e,t){switch(t.modifier){case 1:{const n=e.ele("intensity");N(n.ele("startIntensity"),t.startIntensity),t.stopIntensity&&N(n.ele("stopIntensity"),t.stopIntensity);break}case 0:for(const n of t.equipment)e.ele("equipment").txt(n);break;case 4:e.ele("breath").txt(t.breatheStrokes);break;case 2:switch(t.type){case"SinceStart":e.ele("rest").ele("sinceStart").txt(Z(t.minutes,t.seconds));break;case"AfterStop":e.ele("rest").ele("afterStop").txt(Z(t.minutes,t.seconds));break;case"InOut":e.ele("rest").ele("inOut").txt(t.swimmersIn);break}break;case 3:e.ele("excludeAlign").txt("true");break;case 5:e.ele("underwater").txt(t.isTrue.toString());break;case 6:e.ele("instructionDescription").txt(t.description);break}}function ie(e,t){let n=e;if(t.repetitions>1&&(n=e.ele("instruction"),n=n.ele("repetition"),n.ele("repetitionCount").txt(String(t.repetitions))),t.instruction.isBlock){t.repetitions<=1&&(n=e.ele("instruction"),n=n.ele("repetition"),n.ele("repetitionCount").txt("1"));for(const i of t.instruction.instructions)Nt(n,i)}else{n=n.ele("instruction");const i=t.instruction.length,o=n.ele("length");i.kind==="distance"?o.ele("lengthAsDistance").txt(i.value):i.kind=="laps"?o.ele("lengthAsLaps").txt(i.value):o.ele("lengthAsTime").txt(Z(i.minutes,i.seconds)),t.strokeModifier==="kicking"?n.ele("stroke").ele("kicking").ele("standardKick").txt(t.instruction.stroke):n.ele("stroke").ele("standardStroke").txt(t.instruction.stroke)}if(t.instructionModifiers.length>0)for(const i of t.instructionModifiers)Bt(n,i)}function oe(e,t){e.ele("instruction").ele("segmentName").txt(t.message)}function Mt(e,t){switch(t.constantName){case"Title":e.ele("title").txt(t.value);break;case"Description":e.ele("programDescription").txt(t.value);break;case"Date":e.ele("creationDate").txt(t.value);break;case"PoolLength":e.ele("poolLength").txt(t.value);break;case"LengthUnit":e.ele("lengthUnit").txt(t.value);break;case"Align":e.ele("programAlign").txt(t.value.toLowerCase());break;case"NumeralSystem":e.ele("numeralSystem").txt(t.value);break;case"HideIntro":e.ele("hideIntro").txt(t.value.toLowerCase());break;case"LayoutWidth":e.ele("layoutWidth").txt(t.value);break}}function Vt(e,t){const n=e.ele("author");n.ele("firstName").txt(t.firstName),n.ele("lastName").txt(t.lastName),t.emailAddress&&n.ele("email").txt(t.emailAddress)}function Ft(e){const t=_e.create({version:"1.0",encoding:"UTF-8"}).ele("program",{xmlns:Dt,"xmlns:xsi":Ut,"xsi:schemaLocation":Ct});for(const n of e.statements)switch(n.statement){case 0:ie(t,n);break;case 1:oe(t,n);break;case 2:break;case 3:Mt(t,n);break;case 4:Vt(t,n);break}return t.end({prettyPrint:!0})}function $t(e){return Xe.fromClass(class{constructor(t){this.view=t,this.run(this.view)}update(t){!t.docChanged||Ie(t.state)!==0||this.run(t.view)}run(t){const n=Q(t.state).cursor(),i=Wt(n,t.state),o=Ft(i);e(o)}})}const _t=gt.configure({props:[Ce.add({Application:Be({closing:")",align:!1})}),Ne.add({Application:Me}),$e({Stroke:h.className,StrokeModifier:h.typeName,Duration:h.integer,Percentage:h.integer,Number:h.integer,Identifier:h.variableName,EquipmentName:h.macroName,Comment:h.comment,SetKeyword:h.keyword,RestKeyword:h.keyword,PaceKeyword:h.keyword,OnKeyword:h.keyword})]}),Lt=We.define({name:"swimdsl",parser:_t,languageData:{commentTokens:{line:"#"},autocomplete:ze,closeBrackets:["{"]}});function se(){return new Re(Lt,[z.extension,Pt])}function At(e){const t=document.createElement("input");t.type="file",t.accept=".txt",t.onchange=n=>{const i=n.target;if(!i.files||i.files.length<=0){console.warn("No files were selected");return}const o=i.files[0],r=new FileReader;r.onload=a=>{var m;const l=(m=a.target)==null?void 0:m.result;typeof l=="string"&&e(l)},r.readAsText(o)},t.click()}function I(e,t){const n=URL.createObjectURL(e),i=document.createElement("a");i.href=n,i.download=t,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(n)}function Et(e){const t=new Blob([e],{type:"text/plain;charset=utf-8"});I(t,"SwimProgramme.txt")}function qt(e){const t=new Blob([e],{type:"application/xml"});I(t,"SwimProgramme.xml")}function Kt(e){const t=new Blob([e],{type:"text/html"});I(t,"SwimProgramme.html")}function zt(e){e.contentWindow!==null&&e.contentWindow.print()}function Jt({swimdslProgramme:e,setSwimdslProgramme:t,setNewProgrammeOpen:n,swimlXml:i,htmlString:o,renderNode:r,children:a}){const[l,m]=d.useState(null),f=!!l;function u(O){m(O.currentTarget)}function p(){m(null)}function S(){n(!0)}const c=[{text:"New Programme",icon:s.jsx(ue,{fontSize:"small"}),onclick:S},{text:"Open",icon:s.jsx(fe,{fontSize:"small"}),onclick:()=>{At(t)}},{text:"Save As",icon:s.jsx(he,{fontSize:"small"}),onclick:()=>{Et(e)}},{text:"Export swiML XML",icon:s.jsx(v,{fontSize:"small"}),onclick:()=>{qt(i)}},{text:"Export HTML",icon:s.jsx(v,{fontSize:"small"}),onclick:()=>{Kt(o)}},{text:"Export as PDF",icon:s.jsx(pe,{fontSize:"small"}),onclick:()=>{r.current!==null&&zt(r.current)}}];return s.jsx(de,{sx:{zIndex:O=>O.zIndex.drawer+1},position:"static",children:s.jsxs(M,{children:[s.jsx(V,{sx:{paddingX:"1em"},children:s.jsx(F,{variant:"h6",component:"div",children:"SwimDSL"})}),s.jsx(j,{id:"basic-button",onClick:u,color:"inherit",children:"File"}),s.jsx($,{open:f,anchorEl:l,onClose:p,children:c.map(({text:O,icon:P,onclick:b},w)=>s.jsxs(_,{onClick:b,children:[s.jsx(me,{children:P}),s.jsx(Oe,{children:O})]},w))}),s.jsx(k,{sx:{ml:"auto"},children:a})]})})}const Gt='<?xml version="1.0" encoding="UTF-8"?><program xmlns="https://github.com/bartneck/swiML"/>';async function Ht(e){return(await SaxonJS.transform({stylesheetText:e,sourceText:Gt},"async")).stylesheetInternal}async function en(e,t){return(await SaxonJS.transform({stylesheetInternal:t,sourceText:e,destination:"serialized"},"async")).principalResult}function tn({xmlString:e,htmlString:t,setHtmlString:n,nodeRef:i}){const[o,r]=d.useState({});return d.useEffect(()=>{fetch("./swiML.sef.json").then(a=>a.text()).then(Ht).then(r).catch(console.error)},[]),d.useEffect(()=>{Object.keys(o).length!==0&&en(e,o).then(n).catch(console.error)},[o,e,n]),s.jsx("iframe",{ref:i,width:"100%",height:"100%",style:{border:"none"},srcDoc:t})}var y=(e=>(e[e.TUTORIAL=0]="TUTORIAL",e[e.RENDER=1]="RENDER",e[e.SWIML_XML=2]="SWIML_XML",e))(y||{});const nn=[{page:null,icon:s.jsx(Se,{}),label:"Hide panel"},{page:y.RENDER,icon:s.jsx(Pe,{}),label:"Show render"},{page:y.TUTORIAL,icon:s.jsx(ge,{}),label:"Show tutorial"},{page:y.SWIML_XML,icon:s.jsx(v,{}),label:"Show swiML XML"}];function on({setPanelPage:e,activePanelPage:t,selectorOpen:n,setSelectorOpen:i}){return s.jsxs(V,{children:[nn.map(({icon:o,page:r,label:a},l)=>s.jsx(R,{title:a,children:s.jsx("span",{children:s.jsx(j,{onClick:()=>{e(r)},disabled:t===r,color:"inherit",children:o})})},l)),s.jsx(R,{title:"Show/hide file picker",children:s.jsx(ye,{onClick:()=>{i(!n)},children:s.jsx(be,{})})})]})}function sn({xmlContent:e}){const t=L();return s.jsx(X,{readOnly:!0,value:e,height:"100%",width:"100%",style:{height:"100%"},theme:t.palette.mode,extensions:[Ve()]})}const rn=`### Welcome ###################################################################

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
`;function an(){const[e,t]=d.useState(rn),n=L();return s.jsx(X,{value:e,height:"100%",width:"100%",style:{height:"100%"},theme:n.palette.mode,extensions:[se()],onChange:i=>{t(i)}})}function ln(e,t,n){e!==""&&(localStorage.removeItem(e),t(""),n(""))}function x(e,t,n,i,o,r=!0){r&&t&&localStorage.setItem(t,n),i(e),o(localStorage.getItem(e)??"")}function cn({selectorOpen:e,selectedFile:t,setSelectedFile:n,swimdslProgramme:i,setSwimdslProgramme:o}){const[r,a]=d.useState(null),[l,m]=d.useState(""),f=Object.keys(localStorage),u=(c,O)=>{c.preventDefault(),c.stopPropagation(),m(O),x(O,t,i,n,o),a({mouseX:c.clientX+2,mouseY:c.clientY-6})},p=c=>{var w;c.preventDefault();const P=document.elementsFromPoint(c.clientX,c.clientY).find(Y=>Y.closest("[data-key]")),b=(w=P==null?void 0:P.closest("[data-key]"))==null?void 0:w.getAttribute("data-key");b?(m(b),x(b,t,i,n,o),a({mouseX:c.clientX+2,mouseY:c.clientY-6})):a(null)},S=()=>{a(null),m("")};return s.jsxs(s.Fragment,{children:[s.jsxs(we,{variant:"persistent",anchor:"right",open:e,sx:{width:250,flexShrink:0,"& .MuiDrawer-paper":{width:250,boxSizing:"border-box",backgroundColor:"lightgray"}},children:[s.jsx(M,{}),s.jsx(ke,{style:{marginTop:10},selectedItems:t,onSelectedItemsChange:(c,O)=>{x(O??"",t,i,n,o)},children:f.map(c=>s.jsx(Te,{itemId:c,"data-key":c,label:c,onContextMenu:O=>{u(O,c)}},c))})]}),s.jsx($,{open:r!==null,onClose:S,anchorReference:"anchorPosition",...r!==null&&{anchorPosition:{top:r.mouseY,left:r.mouseX}},slotProps:{backdrop:{onContextMenu:p},paper:{sx:{width:150}}},children:s.jsx(_,{onClick:()=>{ln(l,n,o),S()},children:"Delete"})})]})}const dn={position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:400,bgcolor:"background.paper",border:"2px solid #000",boxShadow:24,p:4,flexDirection:"column",display:"flex"};function mn({newProgrammeOpen:e,setNewProgrammeOpen:t,selectedFile:n,swimdslProgramme:i,setSelectedFile:o,setSwimdslProgramme:r}){const[a,l]=d.useState(""),[m,f]=d.useState("");function u(){l(""),t(!1)}function p(){m.trim().length===0?l("Please enter a programme name."):m in localStorage?l("Programme name already in use. Please choose another name."):(localStorage.setItem(m,""),x(m,n,i,o,r),u())}return s.jsx(s.Fragment,{children:s.jsx(xe,{open:e,onClose:u,"aria-labelledby":"modal-modal-title","aria-describedby":"modal-modal-description",children:s.jsxs(k,{sx:dn,children:[s.jsx(F,{variant:"h6",component:"div",children:"New Programme:"}),s.jsx(Qe,{id:"outlined-basic",label:"Programme name",variant:"outlined",error:a.length>0,helperText:a,onChange:S=>{f(S.target.value)}}),s.jsx(j,{onClick:()=>{p()},children:"Create"})]})})})}function On(){const[e,t]=d.useState(!1),[n,i]=d.useState(""),[o,r]=d.useState(""),a=Ye("(prefers-color-scheme: dark)"),[l,m]=d.useState(y.RENDER),[f,u]=d.useState(!0),[p,S]=d.useState(""),[c,O]=d.useState(""),P=d.useRef(null),b=d.useMemo(()=>$t(S),[]),w=d.useMemo(()=>se(),[]),Y=d.useMemo(()=>ve({palette:{mode:a?"dark":"light"}}),[a]),re=d.useCallback(g=>{r(g),n&&localStorage.setItem(n,g)},[n]);localStorage.length===0&&(localStorage.setItem("First Programme",""),x("First Programme",n,o,i,r));function ae(g){switch(g){case y.TUTORIAL:return s.jsx(an,{});case y.RENDER:return s.jsx(tn,{xmlString:p,htmlString:c,setHtmlString:O,nodeRef:P});case y.SWIML_XML:return s.jsx(sn,{xmlContent:p})}}return s.jsxs(Ze,{theme:Y,children:[s.jsx(je,{}),s.jsxs(k,{sx:{display:"flex",flexDirection:"column",height:"100vh"},children:[s.jsx(mn,{newProgrammeOpen:e,setNewProgrammeOpen:t,selectedFile:n,setSelectedFile:i,swimdslProgramme:o,setSwimdslProgramme:r}),s.jsx(Jt,{swimdslProgramme:o,setSwimdslProgramme:r,setNewProgrammeOpen:t,swimlXml:p,htmlString:c,renderNode:P,children:s.jsx(on,{activePanelPage:l,setPanelPage:m,selectorOpen:f,setSelectorOpen:u})}),s.jsxs(k,{sx:{display:"flex",flex:1,overflow:"hidden",minHeight:0},children:[s.jsx(k,{sx:{width:l!==null?"50%":"100%",minWidth:0,minHeight:0},borderRight:"1px solid",children:s.jsx(X,{value:o,style:{height:"100%"},width:"100%",height:"100%",theme:a?"dark":"light",extensions:[w,b],onChange:re})}),l!==null&&s.jsx(k,{sx:{width:"50%",overflow:"hidden",minWidth:0,minHeight:0,flexGrow:1,transition:g=>g.transitions.create("margin",{easing:g.transitions.easing.sharp,duration:g.transitions.duration.leavingScreen}),marginRight:f?0:"-250px"},children:ae(l)}),s.jsx(cn,{selectedFile:n,setSelectedFile:i,swimdslProgramme:o,setSwimdslProgramme:r,selectorOpen:f})]})]})]})}const B=document.getElementById("root");B!==null?ce.createRoot(B).render(s.jsx(le.StrictMode,{children:s.jsx(On,{})})):console.error("Root element does not exist!");
