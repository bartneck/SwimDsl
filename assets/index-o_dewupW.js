import{b as d,j as r,r as z}from"./react-CMFr3qCg.js";import{c as J}from"./react-dom-DX5UQ9U7.js";import{A as G,T as H,P as I,a as ee,B as R,M as te,b as ie,L as ne,c as se,d as P,e as oe,U as re,S as ae,C as w,f as ce,V as de,I as le,H as Oe,g as me,u as D,h as ue,i as fe,j as he,k as pe}from"./@mui-CmKafNEk.js";import{R as Q}from"./@uiw-PGa3NKDv.js";import{V as Se,G as Pe,H as k,L as ke,I as ye,J as ge,K as be,M as we,N as Te,O as Qe,P as Ye,Q as xe}from"./@codemirror-HnVgEYRi.js";import{L as Ze,s as ve,a as l}from"./@lezer-CRier5-m.js";import{d as x}from"./fastest-levenshtein-ChoUA_u9.js";import{x as Xe}from"./xmlbuilder2-DPvUJURa.js";import"./hoist-non-react-statics-VTAvmUN5.js";import"./scheduler-Bb8JjhAW.js";import"./@emotion-D3xeAZ7B.js";import"./@babel-BtohYyOd.js";import"./stylis-DDa9OTMq.js";import"./clsx-B-dksMZM.js";import"./react-transition-group-D_SqvwCt.js";import"./react-is-BPJnJB5S.js";import"./@popperjs-CMBiYTiD.js";import"./crelt-C8TCjufn.js";import"./@marijn-DXwl3gUT.js";import"./style-mod-Bs6eFhZE.js";import"./w3c-keyname-Vcq4gwWv.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function i(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(s){if(s.ep)return;s.ep=!0;const o=i(s);fetch(s.href,o)}})();const U=["Freestyle","Free","Fr","Backstroke","Back","Bk","Breaststroke","Breast","Br","Butterfly","Fly","Fl","Choice","IndividualMedley","Medley","Im","ReverseIndividualMedley","ReverseMedley","ReverseIm","IndividualMedleyOverlap","MedleyOverlap","ImOverlap","IndividualMedleyOrder","MedleyOrder","ImOrder","ReverseIndividualMedleyOrder","ReverseMedleyOrder","ReverseImOrder","NumberOne","NumberTwo","NumberThree","NumberFour","NotFreestyle","NotFree","NotFr","NotBackstroke","NotBack","NotBk","NotBreastroke","NotBreast","NotBr","NotButterfly","NotFly","NotFl"],N=["Pull","Kick","Drill"],B=["Board","Pads","PullBuoy","Fins","Snorkel","Chute","StretchCord"],C=["Title","Description","Date","PoolLength","LengthUnit","Align","NumeralSystem","HideIntro","LayoutWidth"],We=["True","False"];function Z(e){const t=new Set,i=k(e).cursor();do{if(i.name!=="PaceDefinition"||!i.firstChild())continue;const n=e.sliceDoc(i.from,i.to);t.add(n),i.parent()}while(i.next());return t}const V=ge.define({create:Z,update(e,t){return t.docChanged?Z(t.state):e}}),Ie=U.map(e=>({label:e,type:"constant",boost:e.length})),Re=B.map(e=>({label:e,type:"constant"})),De=N.map(e=>({label:e,type:"constant"})),Ue=C.map(e=>({label:e,type:"constant"})),v={0:{priorNodeName:"Distance",nodeName:"Stroke",completions:Ie},1:{priorNodeName:"EquipmentSpecification",nodeName:"EquipmentName",completions:Re},2:{priorNodeName:"Pace",nodeName:"PaceAlias",completions:[]},3:{priorNodeName:"",nodeName:"StrokeModifier",completions:De},4:{priorNodeName:"",nodeName:"ConstantName",completions:Ue}};function Ne(e){const t=k(e.state).resolveInner(e.pos,-1);v[2].completions=Array.from(e.state.field(V)).map(i=>({label:i,type:"variable"}));for(const{priorNodeName:i,nodeName:n,completions:s}of Object.values(v)){if(t.name===i)return{from:e.pos,options:s,validFor:/^[A-Za-z]/};if(t.name===n)return{from:t.from,to:t.to,options:s,validFor:/^[A-Za-z]/}}return null}function M(e,t){const[i,...n]=t;return n.reduce(([s,o],a)=>{const c=x(e,a);return c<o?[a,c]:[s,o]},[i,x(e,i)])}const F=2;function Be(e,t){const i=[];if(t.size>0){const[n,s]=M(e,Array.from(t));s<=F&&i.push({name:`Did you mean '${n}'?`,apply(o,a,c){o.dispatch({changes:{from:a,to:c,insert:n}})}})}return i.push({name:"Define pace name",apply(n){n.dispatch({changes:{from:0,to:0,insert:`pace ${e} = _%
`}})}}),i}function Ce(e){return[{name:"Remove duplicated definition",apply(t){t.dispatch({changes:{from:e.from,to:e.to}})}}]}function Ve(e,t){const[i,n]=M(e,t);return n>F?[]:[{name:`Did you mean ${i}`,apply(s,o,a){s.dispatch({changes:{from:o,to:a,insert:i}})}}]}function Me(e,t,i){return{from:t.from,to:t.to,severity:"error",message:`A pace named '${e}' has already been defined`,actions:Ce(i)}}function Fe(e,t,i){return{from:e.from,to:e.to,severity:"error",actions:Be(t,i),message:`'${t}' is not a defined pace name.
If you wish to be able to use '${t}' in the place of a pace percentage, please define it with the following line:
Pace ${t} = _%`}}function $e(e){return{from:e.from,to:e.to,severity:"error",message:"Syntax error"}}function _e(e,t){return{from:e,to:t,severity:"error",message:"Duplicate equipment specified. Please do not use the same equipment multiple times"}}function Le(e,t,i,n){return{from:e,to:t,severity:"error",message:`'${i}' is not compatible with stroke type '${n}'`}}function Ae(e,t){return{from:e,to:t,severity:"error",message:"Multiple rest times specified. Please only specify at most one rest time per instruction."}}function je(e){return e.replace(/([a-z])([A-Z])/g,"$1 $2").toLowerCase()}function Ee(e,t,i,n){return{from:e.from,to:e.to,severity:"error",message:`${t} is not a valid ${je(i)}.`,actions:Ve(t,n)}}function qe(e){return{from:e.from,to:e.to,severity:"error",message:"Number too large for duration"}}const Ke=59;function ze(e,t,i,n){if(e.name!=="PaceAlias")return;const s=i.sliceDoc(e.from,e.to);t.has(s)||n.push(Fe(e,s,t))}function Je(e,t,i,n){if(e.name!=="PaceDefinitionName")return;const s=i.sliceDoc(e.from,e.to),o=e.node.parent;o!==null&&(t.has(s)?n.push(Me(s,e,o)):t.add(s))}function Ge(e,t){e.name==="⚠"&&t.push($e(e))}const He=new Map([["Default",new Set(["Board","PullBuoy"])],["Kick",new Set(["PullBuoy","Pads"])],["Pull",new Set(["Board","Fins"])]]);function et(e,t,i){if(e.name!=="Instruction")return;const n=e.node.getChild("EquipmentSpecification");if(n===null)return;const s=e.node.getChild("StrokeType"),o=s!==null?t.sliceDoc(s.from,s.to):"Default",a=s!==null?s.from:n.from,c=n.getChildren("EquipmentName").map(u=>t.sliceDoc(u.from,u.to)),O=new Set(c);O.size!==c.length&&i.push(_e(a,n.to));const h=He.get(o);if(h!==void 0)for(const u of O)h.has(u)&&i.push(Le(a,n.to,u,o))}function tt(e,t){var a;if(e.name!=="Rest")return;const i=e.node.parent;if(!i)return;const n=i.getChildren("Rest");if(n.length<=1||((a=n[0])==null?void 0:a.from)!==e.from)return;const s=n[0],o=n[n.length-1];o!==void 0&&t.push(Ae(s.from,o.to))}function S(e,t,i,n,s){if(e.name!==i)return;const o=t.sliceDoc(e.from,e.to);n.includes(o)||s.push(Ee(e,o,i,n))}function it(e,t,i){if(e.name!=="Duration")return;const n=e.node.getChildren("Number");for(const s of n)Number(t.sliceDoc(s.from,s.to))>Ke&&i.push(qe(s))}function nt(e){const t=[],i=new Set,n=e.state,s=k(n).cursor();do ze(s,i,n,t),Je(s,i,n,t),Ge(s,t),et(s,n,t),S(s,n,"Stroke",U,t),S(s,n,"StrokeModifier",N,t),S(s,n,"EquipmentName",B,t),S(s,n,"Boolean",We,t),S(s,n,"ConstantName",C,t),it(s,n,t),tt(s,t);while(s.next());return t}var st=be(nt);const ot=Ze.deserialize({version:14,states:"+pQYQPOOOnQPO'#CcOOQO'#Ce'#CeOOQO'#Cb'#CbO|QPO'#CaO!RQPO'#ChO#OQPO'#C_OOQO'#DW'#DWO#lQPO'#CxO#qQPO'#C{O#vQPO'#C|OOQO'#DV'#DVOOQO'#DO'#DOQYQPOOO#{QQO'#DWOOQO,59O,59OO$QQPO,59QO$VQPO,58yOOQO'#Cg'#CgOOQO,58{,58{OOQO'#DP'#DPO$_QPO,59SOOQO'#Ci'#CiO$mQPO'#CjO$rQPO'#CoO$rQPO'#CpO$wQPO'#CqOOQO'#Cn'#CnOOQO'#Cr'#CrO$|QPO'#CsO#qQPO'#CtOOQO'#Cv'#CvOOQO'#D_'#D_OOQO'#DQ'#DQO%RQPO,58yO%RQPO,58yO&YQPO'#D_OOQO'#Cy'#CyO&bQPO,59dO&mQSO'#DkO#qQPO,59gOOQO'#C}'#C}O&rQPO,59hOOQO-E6|-E6|OOQO,59r,59rOOQO1G.l1G.lOqQPO'#CcO&wQPO1G.eOOQO-E6}-E6}OOQO1G.n1G.nOOQO'#Ck'#CkOOQO'#DR'#DRO'eQPO,59UO(oQPO'#CfOOQO,59Z,59ZOOQO,59[,59[OOQO,59],59]OOQO,59_,59_OOQO,59`,59`OOQO-E7O-E7OO(tQPO1G.eOOQO'#Cm'#CmOOQO'#Db'#DbO)bQPO'#ClO*lQPO'#DbOOQO,59y,59yOOQO'#Cz'#CzOOQO'#Dp'#DpOOQO1G/O1G/OO*qQPO,5:VO*vQPO1G/RO&YQPO1G/SO+bQPO7+$PO+bQPO7+$POOQO-E7P-E7PO&YQPO,59WOOQO,59|,59|OOQO1G/q1G/qOOQO7+$m7+$mOOQO7+$n7+$nO,OQPO<<GkOOQO1G.r1G.r",stateData:",}~OxOSPOS~OSPO!PTO!b^O!cWO!eXO!fYO~O{aO|_O}`O!OVX~O!ObO~OSPO!PTO!b^O~O!OfO!SgO!TtO!XhO!YiO!ZjO![lO!]mO!^nO!aoO~OSRXvRX!PRX!bRX!cRX!eRX!fRX!QRX~P!^O!OuO~O!`wO~O!OyO~Ok|O~OS}O~OS!OO!PTO~OSPO!PTO!Q!RO!b^O~O!O!SO~OS!VO~OS!YO~OS!ZO~O!SgO!TtO!XhO!YiO!ZjO![lO!]mO!^nO!aoOSRavRa!PRa!bRa!cRa!eRa!fRa!QRa~OS!bO!O!_O~OS!eO!O!dO!`wO~Oi!gO~O!g!iO~OSRivRi!PRi!bRi!cRi!eRi!fRi!QRi~P!^O!O!SOS^av^a!P^a!S^a!T^a!X^a!Y^a!Z^a![^a!]^a!^^a!a^a!b^a!c^a!e^a!f^a!Q^a~O}`O~OSRivRi!PRi!bRi!cRi!eRi!fRi!QRi~P!aO!W!mOS`Xv`X!P`X!S`X!T`X!X`X!Y`X!Z`X![`X!]`X!^`X!a`X!b`X!c`X!e`X!f`X!Q`X~O!V!nO~O!`!oO~O!`wOSoivoi!Poi!boi!coi!eoi!foi~OSRqvRq!PRq!bRq!cRq!eRq!fRq!QRq~P!aOSRyvRy!PRy!bRy!cRy!eRy!fRy!QRy~P!aOi!Z!Y!]![!a|x!X!e!c!fPk{!O~",goto:"&d!ePPP!fP!l!u!|!|!|#T#b!l#e#k#u#y$P#k$U$U$U#k#k#kP#kP$`$d$g$`$`$j$m$s$y%]PPP%c%gPPPPPP%oPP%yPPPPPPPP&QPPPP&aXVOT]eWUOT]eR!PaZSOT]aeZROT]aeYQOT]aeQ!WhR!XiRcSQsUR!k!PapUrs!P!^!j!k!rT!Tg!UQ!ctR!q!iV!`t!i!makUrs!P!^!j!k!rTZO]RvWR!evRzYQ]OR{]QeTR!QeQrUW!]r!^!j!rQ!^sQ!j!PR!r!kQ!UgR!l!UT[O]SZO]TdTeaqUrs!P!^!j!k!rS!at!iR!s!mQxXQ![nQ!evQ!hxR!p!hR!fv",nodeNames:"⚠ Comment SwimProgramme SwimInstruction Number SingleInstruction Length LengthAsDistance LengthAsLaps LengthAsTime Duration Stroke BlockInstruction StrokeModifier EquipmentSpecification EquipmentName Pace PaceAlias Rest RestSinceStart RestAfterStop RestInOut Underwater Breathe InstructionDescription StringContent ExcludeAlignSpecification Message ConstantDefinition ConstantName Boolean AuthorDefinition PaceDefinition PaceDefinitionName",maxTerm:69,skippedNodes:[0,1],repeatNodeCount:4,tokenData:"!I|~R!eOX%dXY)_YZ+cZ^)_^p%dpq)_qr%drs-[st-otu%duv0Zv{%d{|1P|}%d}!O1u!O!Q%d!Q![4a![!]5]!]!_%d!_!`6R!`!a6w!a!b%d!b!c7m!c!}8c!}#O%d#O#P(U#P#T%d#T#U9e#U#V@c#V#]8c#]#^Hf#^#`8c#`#aNY#a#b8c#b#c!$u#c#d!,x#d#e!/U#e#g8c#g#h!3o#h#i8c#i#j!7T#j#k8c#k#l!Bp#l#m!G^#m#o8c#o#p!Hb#p#q%d#q#r!IW#r#y%d#y#z)_#z$f%d$f$g)_$g#BY%d#BY#BZ)_#BZ$IS%d$IS$I_)_$I_$I|%d$I|$JO)_$JO$JT%d$JT$JU)_$JU$KV%d$KV$KW)_$KW&FU%d&FU&FV)_&FV;'S%d;'S;=`)X<%lO%dU%kXiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dS&]UiSOr&Ws#O&W#O#P&o#P;'S&W;'S;=`'g<%lO&WS&rRO;'S&W;'S;=`&{;=`O&WS'QViSOr&Ws#O&W#O#P&o#P;'S&W;'S;=`'g;=`<%l&W<%lO&WS'jP;=`<%l&WQ'rSkQOY'mZ;'S'm;'S;=`(O<%lO'mQ(RP;=`<%l'mU(ZUkQOY%dYZ&WZ;'S%d;'S;=`(m;=`<%l&W<%lO%dU(rViSOr&Ws#O&W#O#P&o#P;'S&W;'S;=`'g;=`<%l%d<%lO&WU)[P;=`<%l%d~)hmiSx~kQOX%dXY)_YZ+cZ^)_^p%dpq)_qr%drs'ms#O%d#O#P(U#P#y%d#y#z)_#z$f%d$f$g)_$g#BY%d#BY#BZ)_#BZ$IS%d$IS$I_)_$I_$I|%d$I|$JO)_$JO$JT%d$JT$JU)_$JU$KV%d$KV$KW)_$KW&FU%d&FU&FV)_&FV;'S%d;'S;=`)X<%lO%d~+jjiSx~OX&WX^+c^p&Wpq+cqr&Ws#O&W#O#P&o#P#y&W#y#z+c#z$f&W$f$g+c$g#BY&W#BY#BZ+c#BZ$IS&W$IS$I_+c$I_$I|&W$I|$JO+c$JO$JT&W$JT$JU+c$JU$KV&W$KV$KW+c$KW&FU&W&FU&FV+c&FV;'S&W;'S;=`'g<%lO&WR-cS!`PkQOY'mZ;'S'm;'S;=`(O<%lO'm~-xXiSP~kQOY-oYZ&WZr-ors.es#O-o#O#P/O#P;'S-o;'S;=`0T<%lO-o~.lSP~kQOY.eZ;'S.e;'S;=`.x<%lO.e~.{P;=`<%l.e~/VUP~kQOY-oYZ&WZ;'S-o;'S;=`/i;=`<%l&W<%lO-o~/nViSOr&Ws#O&W#O#P&o#P;'S&W;'S;=`'g;=`<%l-o<%lO&W~0WP;=`<%l-oV0dX!VPiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV1YX!SPiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV1|]iSkQOY%dYZ&WZr%drs'ms}%d}!O2u!O!`%d!`!a3k!a#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV3OX!^PiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV3tX!WPiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV4jZSPiSkQOY%dYZ&WZr%drs'ms!Q%d!Q![4a![#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV5fX}PiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV6[X!gPiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV7QX!bPiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV7vX!TPiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV8l]iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV9n_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#i8c#i#j:m#j#o8c#o;'S%d;'S;=`)X<%lO%dV:v_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#h8c#h#i;u#i#o8c#o;'S%d;'S;=`)X<%lO%dV<O_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#[8c#[#]<}#]#o8c#o;'S%d;'S;=`)X<%lO%dV=W_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#c8c#c#d>V#d#o8c#o;'S%d;'S;=`)X<%lO%dV>`_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#f8c#f#g?_#g#o8c#o;'S%d;'S;=`)X<%lO%dV?j]iS!ePkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV@l_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#f8c#f#gAk#g#o8c#o;'S%d;'S;=`)X<%lO%dVAt_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#X8c#X#YBs#Y#o8c#o;'S%d;'S;=`)X<%lO%dVB|^iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#UCx#U#o8c#o;'S%d;'S;=`)X<%lO%dVDR_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#h8c#h#iEQ#i#o8c#o;'S%d;'S;=`)X<%lO%dVEZ_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#[8c#[#]FY#]#o8c#o;'S%d;'S;=`)X<%lO%dVFc_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#X8c#X#YGb#Y#o8c#o;'S%d;'S;=`)X<%lO%dVGm]iS!]PkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dVHo_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#b8c#b#cIn#c#o8c#o;'S%d;'S;=`)X<%lO%dVIw_iSkQ!OPOY%dYZ&WZr%drs'ms}%d}!OJv!O!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dVJ}ZiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P#c%d#c#dKp#d;'S%d;'S;=`)X<%lO%dVKwZiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P#i%d#i#jLj#j;'S%d;'S;=`)X<%lO%dVLqZiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P#h%d#h#iMd#i;'S%d;'S;=`)X<%lO%dVMmXiS!ZPkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dVNc^iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#U! _#U#o8c#o;'S%d;'S;=`)X<%lO%dV! h_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#d8c#d#e!!g#e#o8c#o;'S%d;'S;=`)X<%lO%dV!!r_iS|PkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#g8c#g#h!#q#h#o8c#o;'S%d;'S;=`)X<%lO%dV!#|]iS|PkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!%O_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#c8c#c#d!%}#d#o8c#o;'S%d;'S;=`)X<%lO%dV!&W^iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#U!'S#U#o8c#o;'S%d;'S;=`)X<%lO%dV!']_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#`8c#`#a!([#a#o8c#o;'S%d;'S;=`)X<%lO%dV!(e_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#]8c#]#^!)d#^#o8c#o;'S%d;'S;=`)X<%lO%dV!)m_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#Z8c#Z#[!*l#[#o8c#o;'S%d;'S;=`)X<%lO%dV!*u_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#b8c#b#c!+t#c#o8c#o;'S%d;'S;=`)X<%lO%dV!,P]iS!aPkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!-R_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#b8c#b#c!.Q#c#o8c#o;'S%d;'S;=`)X<%lO%dV!.]]iS!XPkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!/_^iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#U!0Z#U#o8c#o;'S%d;'S;=`)X<%lO%dV!0d_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#V8c#V#W!1c#W#o8c#o;'S%d;'S;=`)X<%lO%dV!1l_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#X8c#X#Y!2k#Y#o8c#o;'S%d;'S;=`)X<%lO%dV!2v]iS!fPkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!3x_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#X8c#X#Y!4w#Y#o8c#o;'S%d;'S;=`)X<%lO%dV!5Q_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#h8c#h#i!6P#i#o8c#o;'S%d;'S;=`)X<%lO%dV!6[]iS!cPkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!7^_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#b8c#b#c!8]#c#o8c#o;'S%d;'S;=`)X<%lO%dV!8f_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#W8c#W#X!9e#X#o8c#o;'S%d;'S;=`)X<%lO%dV!9n_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#X8c#X#Y!:m#Y#o8c#o;'S%d;'S;=`)X<%lO%dV!:v_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#f8c#f#g!;u#g#o8c#o;'S%d;'S;=`)X<%lO%dV!<O_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#k8c#k#l!<}#l#o8c#o;'S%d;'S;=`)X<%lO%dV!=W^iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#U!>S#U#o8c#o;'S%d;'S;=`)X<%lO%dV!>]_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#h8c#h#i!?[#i#o8c#o;'S%d;'S;=`)X<%lO%dV!?e_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#X8c#X#Y!@d#Y#o8c#o;'S%d;'S;=`)X<%lO%dV!@m_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#f8c#f#g!Al#g#o8c#o;'S%d;'S;=`)X<%lO%dV!Aw]iS![PkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!By_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#]8c#]#^!Cx#^#o8c#o;'S%d;'S;=`)X<%lO%dV!DR_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#h8c#h#i!EQ#i#o8c#o;'S%d;'S;=`)X<%lO%dV!EZ_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#[8c#[#]!FY#]#o8c#o;'S%d;'S;=`)X<%lO%dV!Fe]iS!YPkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!Gi]iSkQ{P!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!HkX!PPiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV!IaX!QPiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%d",tokenizers:[0,1,2],topRules:{SwimProgramme:[0,2]},tokenPrec:534});function $(e,t){e.firstChild();const i={isAlias:e.name==="PaceAlias",value:t.sliceDoc(e.from,e.to)};let n;return e.nextSibling()&&(n={isAlias:e.name==="PaceAlias",value:t.sliceDoc(e.from,e.to)}),e.parent(),{modifier:1,startIntensity:i,stopIntensity:n}}function rt(e,t){e.firstChild();const i=t.sliceDoc(e.from,e.to);e.nextSibling();const n=$(e,t);return e.parent(),{statement:2,name:i,pace:n}}function at(e,t){e.firstChild();const i=t.sliceDoc(e.from,e.to);return e.parent(),{modifier:4,breatheStrokes:i}}function ct(e,t){return e.name==="SwimInstruction"?L(e,t):A(e,t)}function _(e,t){e.firstChild();const i=t.sliceDoc(e.from,e.to);e.nextSibling();const n=t.sliceDoc(e.from,e.to);return e.parent(),{minutes:i,seconds:n}}function dt(e){switch(e){case"Board":return"board";case"Pads":return"pads";case"PullBuoy":return"pullBuoy";case"Fins":return"fins";case"Snorkel":return"snorkel";case"Chute":return"chute";case"StretchCord":return"stretchCord";default:return""}}function lt(e,t){if(e.name==="EquipmentSpecification"){const i=[];e.firstChild();do{const n=t.sliceDoc(e.from,e.to);i.push(dt(n))}while(e.nextSibling());return e.parent(),{modifier:0,equipment:i}}return e.name==="Pace"?$(e,t):e.name==="ExcludeAlignSpecification"?{modifier:3}:e.name==="Breathe"?at(e,t):e.name==="InstructionDescription"?pt(e,t):e.name==="Underwater"?{modifier:5,isTrue:!0}:Ot(e,t)}function Ot(e,t){e.firstChild();let i;if(e.name==="RestInOut"){e.firstChild();const n=t.sliceDoc(e.from,e.to);e.parent(),i={modifier:2,type:"InOut",swimmersIn:n}}else{const n=e.name==="RestAfterStop"?"AfterStop":"SinceStart";e.firstChild();const s=_(e,t);e.parent(),i={modifier:2,type:n,...s}}return e.parent(),i}function mt(e){switch(e){case"Freestyle":case"Free":case"Fr":return"freestyle";case"Backstroke":case"Back":case"Bk":return"backstroke";case"Breaststroke":case"Breast":case"Br":return"breaststroke";case"Butterfly":case"Fly":case"Fl":return"butterfly";case"IndividualMedley":case"Medley":case"Im":return"individualMedley";case"ReverseIndividualMedley":case"ReverseMedley":case"ReverseIm":return"reverseIndividualMedley";case"IndividualMedleyOverlap":case"MedleyOverlap":case"ImOverlap":return"individualMedleyOverlap";case"IndividualMedleyOrder":case"MedleyOrder":case"ImOrder":return"individualMedleyOrder";case"ReverseIndividualMedleyOrder":case"ReverseMedleyOrder":case"ReverseImOrder":return"reverseIndividualMedleyOrder";case"NumberOne":return"nr1";case"NumberTwo":return"nr2";case"NumberThree":return"nr3";case"NumberFour":return"nr4";case"NotFreestyle":case"NotFree":case"NotFr":return"notFreestyle";case"NotBackstroke":case"NotBack":case"NotBk":return"notBackstroke";case"NotBreastroke":case"NotBreast":case"NotBr":return"notBreastroke";case"NotButterfly":case"NotFly":case"NotFl":return"notButterfly";case"Choice":default:return"any"}}function ut(e){switch(e){case"Kick":return"kicking";case"Pull":return"pulling";case"Drill":return"drill";default:return"standardStroke"}}function L(e,t){let i=1,n="standardStroke",s;const o=[];if(e.firstChild(),e.name==="Number"&&(i=Number(t.sliceDoc(e.from,e.to)),e.nextSibling()),e.name==="BlockInstruction"){e.firstChild();const a=[];do a.push(ct(e,t));while(e.nextSibling());s={isBlock:!0,instructions:a}}else{e.firstChild(),e.firstChild();let a;switch(e.name){case"LengthAsDistance":a="distance";break;case"LengthAsLaps":a="laps";break;case"LengthAsTime":a="time";break;default:a="distance"}e.firstChild();let c;a==="time"?c={kind:a,..._(e,t)}:c={kind:a,value:t.sliceDoc(e.from,e.to)},e.parent(),e.parent(),e.nextSibling();const O=mt(t.sliceDoc(e.from,e.to));s={isBlock:!1,length:c,stroke:O}}if(e.parent(),e.nextSibling()){let a=!0;if(e.name==="StrokeModifier"&&(n=ut(t.sliceDoc(e.from,e.to)),a=e.nextSibling()),a)do o.push(lt(e,t));while(e.nextSibling())}return e.parent(),{statement:0,repetitions:i,instruction:s,strokeModifier:n,instructionModifiers:o}}function A(e,t){return{statement:1,message:t.sliceDoc(e.from,e.to)}}function ft(e,t){e.firstChild();const i=t.sliceDoc(e.from,e.to);e.nextSibling();const n=t.sliceDoc(e.from,e.to);return e.parent(),{statement:3,constantName:i,value:n}}function ht(e,t){e.firstChild();const i=t.sliceDoc(e.from,e.to);e.nextSibling();const n=t.sliceDoc(e.from,e.to);let s;return e.nextSibling()&&(s=t.sliceDoc(e.from,e.to)),e.parent(),{statement:4,firstName:i,lastName:n,emailAddress:s}}function pt(e,t){e.firstChild();const i=t.sliceDoc(e.from,e.to);return e.parent(),{modifier:6,description:i}}function St(e,t){const i=[];function n(){do{let s=null;switch(e.type.name){case"SwimInstruction":s=L(e,t);break;case"Message":s=A(e,t);break;case"PaceDefinition":s=rt(e,t);break;case"ConstantDefinition":s=ft(e,t);break;case"AuthorDefinition":s=ht(e,t);break}s!==null&&i.push(s)}while(e.nextSibling())}return e.firstChild(),n(),{statements:i}}const Pt="https://github.com/bartneck/swiML",kt="http://www.w3.org/2001/XMLSchema-instance",yt="https://github.com/bartneck/swiML https://raw.githubusercontent.com/bartneck/swiML/main/version/latest/swiML.xsd";function T(e,t){let i="PT";return Number(e)>0&&(i+=e,i+="M"),Number(t)>0&&(i+=t,i+="S"),i}function gt(e,t){switch(t.statement){case 0:j(e,t);break;case 1:E(e,t);break}}function X(e,t){t.isAlias?e.ele("zone").txt(t.value):e.ele("percentageEffort").txt(t.value)}function bt(e,t){switch(t.modifier){case 1:{const i=e.ele("intensity");X(i.ele("startIntensity"),t.startIntensity),t.stopIntensity&&X(i.ele("stopIntensity"),t.stopIntensity);break}case 0:for(const i of t.equipment)e.ele("equipment").txt(i);break;case 4:e.ele("breath").txt(t.breatheStrokes);break;case 2:switch(t.type){case"SinceStart":e.ele("rest").ele("sinceStart").txt(T(t.minutes,t.seconds));break;case"AfterStop":e.ele("rest").ele("afterStop").txt(T(t.minutes,t.seconds));break;case"InOut":e.ele("rest").ele("inOut").txt(t.swimmersIn);break}break;case 3:e.ele("excludeAlign").txt("true");break;case 5:e.ele("underwater").txt(t.isTrue.toString());break;case 6:e.ele("instructionDescription").txt(t.description);break}}function j(e,t){let i=e.ele("instruction");if(t.repetitions>1&&(i=i.ele("repetition"),i.ele("repetitionCount").txt(String(t.repetitions)).up()),t.instruction.isBlock)for(const n of t.instruction.instructions)gt(i,n);else{const n=t.instruction.length,s=i.ele("length");n.kind==="distance"?s.ele("lengthAsDistance").txt(n.value):n.kind=="laps"?s.ele("lengthAsLaps").txt(n.value):s.ele("lengthAsTime").txt(T(n.minutes,n.seconds)),t.strokeModifier==="kicking"?i.ele("stroke").ele("kicking").ele("standardKick").txt(t.instruction.stroke):i.ele("stroke").ele("standardStroke").txt(t.instruction.stroke)}if(t.instructionModifiers.length>0)for(const n of t.instructionModifiers)bt(i,n)}function E(e,t){e.ele("instruction").ele("segmentName").txt(t.message)}function wt(e,t){switch(t.constantName){case"Title":e.ele("title").txt(t.value);break;case"Description":e.ele("programDescription").txt(t.value);break;case"Date":e.ele("creationDate").txt(t.value);break;case"PoolLength":e.ele("poolLength").txt(t.value);break;case"LengthUnit":e.ele("lengthUnit").txt(t.value);break;case"Align":e.ele("programAlign").txt(t.value.toLowerCase());break;case"NumeralSystem":e.ele("numeralSystem").txt(t.value);break;case"HideIntro":e.ele("hideIntro").txt(t.value.toLowerCase());break;case"LayoutWidth":e.ele("layoutWidth").txt(t.value);break}}function Tt(e,t){const i=e.ele("author");i.ele("firstName").txt(t.firstName),i.ele("lastName").txt(t.lastName),t.emailAddress&&i.ele("email").txt(t.emailAddress)}function Qt(e){const t=Xe.create({version:"1.0",encoding:"UTF-8"}).ele("program",{xmlns:Pt,"xmlns:xsi":kt,"xsi:schemaLocation":yt});for(const i of e.statements)switch(i.statement){case 0:j(t,i);break;case 1:E(t,i);break;case 2:break;case 3:wt(t,i);break;case 4:Tt(t,i);break}return t.end({prettyPrint:!0})}function Yt(e){return Se.fromClass(class{constructor(t){this.view=t,this.run(this.view)}update(t){!t.docChanged||Pe(t.state)!==0||this.run(t.view)}run(t){const i=k(t.state).cursor(),n=St(i,t.state),s=Qt(n);e(s)}})}const xt=ot.configure({props:[we.add({Application:Qe({closing:")",align:!1})}),Te.add({Application:Ye}),ve({Stroke:l.className,StrokeModifier:l.typeName,Duration:l.integer,Percentage:l.integer,Number:l.integer,Identifier:l.variableName,EquipmentName:l.macroName,Comment:l.comment,SetKeyword:l.keyword,RestKeyword:l.keyword,PaceKeyword:l.keyword,OnKeyword:l.keyword})]}),Zt=ye.define({name:"swimdsl",parser:xt,languageData:{commentTokens:{line:"#"},autocomplete:Ne,closeBrackets:["{"]}});function q(){return new ke(Zt,[V.extension,st])}function vt(e){const t=document.createElement("input");t.type="file",t.accept=".txt",t.onchange=i=>{const n=i.target;if(!n.files||n.files.length<=0){console.warn("No files were selected");return}const s=n.files[0],o=new FileReader;o.onload=a=>{var O;const c=(O=a.target)==null?void 0:O.result;typeof c=="string"&&e(c)},o.readAsText(s)},t.click()}function Y(e,t){const i=URL.createObjectURL(e),n=document.createElement("a");n.href=i,n.download=t,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(i)}function Xt(e){const t=new Blob([e],{type:"text/plain;charset=utf-8"});Y(t,"SwimProgramme.txt")}function Wt(e){const t=new Blob([e],{type:"application/xml"});Y(t,"SwimProgramme.xml")}function It(e){const t=new Blob([e],{type:"text/html"});Y(t,"SwimProgramme.html")}function Rt(e){e.contentWindow!==null&&e.contentWindow.print()}function Dt({swimdslProgramme:e,setSwimdslProgramme:t,swimlXml:i,htmlString:n,renderNode:s,children:o}){const[a,c]=d.useState(null),O=!!a;function h(m){c(m.currentTarget)}function u(){c(null)}function y(){var m;(m=window.open("./","_blank"))==null||m.focus()}const g=[{text:"New Programme",icon:r.jsx(oe,{fontSize:"small"}),onclick:y},{text:"Open",icon:r.jsx(re,{fontSize:"small"}),onclick:()=>{vt(t)}},{text:"Save As",icon:r.jsx(ae,{fontSize:"small"}),onclick:()=>{Xt(e)}},{text:"Export swiML XML",icon:r.jsx(w,{fontSize:"small"}),onclick:()=>{Wt(i)}},{text:"Export HTML",icon:r.jsx(w,{fontSize:"small"}),onclick:()=>{It(n)}},{text:"Export as PDF",icon:r.jsx(ce,{fontSize:"small"}),onclick:()=>{s.current!==null&&Rt(s.current)}}];return r.jsx(G,{sx:{zIndex:m=>m.zIndex.drawer+1},position:"static",children:r.jsxs(H,{children:[r.jsx(I,{sx:{paddingX:"1em"},children:r.jsx(ee,{variant:"h6",component:"div",children:"SwimDSL"})}),r.jsx(R,{id:"basic-button",onClick:h,color:"inherit",children:"File"}),r.jsx(te,{open:O,anchorEl:a,onClose:u,children:g.map(({text:m,icon:b,onclick:p},K)=>r.jsxs(ie,{onClick:p,children:[r.jsx(ne,{children:b}),r.jsx(se,{children:m})]},K))}),r.jsx(P,{sx:{ml:"auto"},children:o})]})})}const Ut='<?xml version="1.0" encoding="UTF-8"?><program xmlns="https://github.com/bartneck/swiML"/>';async function Nt(e){return(await SaxonJS.transform({stylesheetText:e,sourceText:Ut},"async")).stylesheetInternal}async function Bt(e,t){return(await SaxonJS.transform({stylesheetInternal:t,sourceText:e,destination:"serialized"},"async")).principalResult}function Ct({xmlString:e,htmlString:t,setHtmlString:i,nodeRef:n}){const[s,o]=d.useState({});return d.useEffect(()=>{fetch("./swiML.sef.json").then(a=>a.text()).then(Nt).then(o).catch(console.error)},[]),d.useEffect(()=>{Object.keys(s).length!==0&&Bt(e,s).then(i).catch(console.error)},[s,e,i]),r.jsx("iframe",{ref:n,width:"100%",height:"100%",style:{border:"none"},srcDoc:t})}var f=(e=>(e[e.TUTORIAL=0]="TUTORIAL",e[e.RENDER=1]="RENDER",e[e.SWIML_XML=2]="SWIML_XML",e))(f||{});const Vt=[{page:null,icon:r.jsx(de,{}),label:"Hide panel"},{page:f.RENDER,icon:r.jsx(le,{}),label:"Show render"},{page:f.TUTORIAL,icon:r.jsx(Oe,{}),label:"Show tutorial"},{page:f.SWIML_XML,icon:r.jsx(w,{}),label:"Show swiML XML"}];function Mt({setPanelPage:e,activePanelPage:t}){return r.jsx(I,{children:Vt.map(({icon:i,page:n,label:s},o)=>r.jsx(me,{title:s,children:r.jsx("span",{children:r.jsx(R,{onClick:()=>{e(n)},disabled:t===n,color:"inherit",children:i})})},o))})}function Ft({xmlContent:e}){const t=D();return r.jsx(Q,{readOnly:!0,value:e,height:"100%",width:"100%",style:{height:"100%"},theme:t.palette.mode,extensions:[xe()]})}const $t=`### Welcome ###################################################################

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
`;function _t(){const[e,t]=d.useState($t),i=D();return r.jsx(Q,{value:e,height:"100%",width:"100%",style:{height:"100%"},theme:i.palette.mode,extensions:[q()],onChange:n=>{t(n)}})}function Lt(){const[e,t]=d.useState(""),i=ue("(prefers-color-scheme: dark)"),[n,s]=d.useState(f.RENDER),[o,a]=d.useState(""),[c,O]=d.useState(""),h=d.useRef(null),u=d.useMemo(()=>Yt(a),[]),y=d.useMemo(()=>q(),[]),g=d.useMemo(()=>fe({palette:{mode:i?"dark":"light"}}),[i]),m=d.useCallback(p=>{t(p)},[]);function b(p){switch(p){case f.TUTORIAL:return r.jsx(_t,{});case f.RENDER:return r.jsx(Ct,{xmlString:o,htmlString:c,setHtmlString:O,nodeRef:h});case f.SWIML_XML:return r.jsx(Ft,{xmlContent:o})}}return r.jsxs(he,{theme:g,children:[r.jsx(pe,{}),r.jsxs(P,{sx:{display:"flex",flexDirection:"column",height:"100vh"},children:[r.jsx(Dt,{swimdslProgramme:e,setSwimdslProgramme:t,swimlXml:o,htmlString:c,renderNode:h,children:r.jsx(Mt,{activePanelPage:n,setPanelPage:s})}),r.jsxs(P,{sx:{display:"flex",flex:1,overflow:"hidden",minHeight:0},children:[r.jsx(P,{sx:{width:n!==null?"50%":"100%",minWidth:0,minHeight:0},borderRight:"1px solid",children:r.jsx(Q,{value:e,style:{height:"100%"},width:"100%",height:"100%",theme:i?"dark":"light",extensions:[y,u],onChange:m})}),n!==null&&r.jsx(P,{sx:{width:"50%",overflow:"hidden",minWidth:0,minHeight:0},children:b(n)})]})]})]})}const W=document.getElementById("root");W!==null?J.createRoot(W).render(r.jsx(z.StrictMode,{children:r.jsx(Lt,{})})):console.error("Root element does not exist!");
