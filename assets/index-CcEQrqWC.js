import{b as O,j as s,r as ae}from"./react-CMFr3qCg.js";import{c as ce}from"./react-dom-DX5UQ9U7.js";import{A as le,T as M,P as V,a as F,B as X,M as $,b as _,L as de,c as Oe,d as w,e as me,U as ue,S as fe,C as v,f as he,V as pe,I as Se,H as Pe,g as D,h as ge,i as ke,u as j,D as ye,j as be,k as we,l as xe,m as Te,n as Qe,o as Ye,p as ve,q as Ze}from"./@mui-DI8l9HUk.js";import{R as I}from"./@uiw-PGa3NKDv.js";import{V as Xe,G as Ie,H as Q,L as We,I as De,J as Re,K as Ce,M as Ue,N as Ne,O as Be,P as Me,Q as Ve}from"./@codemirror-HnVgEYRi.js";import{L as Fe,s as $e,a as h}from"./@lezer-CRier5-m.js";import{d as R}from"./fastest-levenshtein-ChoUA_u9.js";import{x as _e}from"./xmlbuilder2-DPvUJURa.js";import"./hoist-non-react-statics-VTAvmUN5.js";import"./scheduler-Bb8JjhAW.js";import"./@emotion-D3xeAZ7B.js";import"./@babel-BtohYyOd.js";import"./stylis-DDa9OTMq.js";import"./clsx-B-dksMZM.js";import"./@popperjs-CMBiYTiD.js";import"./@base-ui-k8nSAhao.js";import"./reselect-D6JaGe0o.js";import"./use-sync-external-store-DgWmawwA.js";import"./react-transition-group-D_SqvwCt.js";import"./react-is-BPJnJB5S.js";import"./crelt-C8TCjufn.js";import"./@marijn-DXwl3gUT.js";import"./style-mod-Bs6eFhZE.js";import"./w3c-keyname-Vcq4gwWv.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function i(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(o){if(o.ep)return;o.ep=!0;const r=i(o);fetch(o.href,r)}})();const L=["Freestyle","Free","Fr","Backstroke","Back","Bk","Breaststroke","Breast","Br","Butterfly","Fly","Fl","Choice","IndividualMedley","Medley","Im","ReverseIndividualMedley","ReverseMedley","ReverseIm","IndividualMedleyOverlap","MedleyOverlap","ImOverlap","IndividualMedleyOrder","MedleyOrder","ImOrder","ReverseIndividualMedleyOrder","ReverseMedleyOrder","ReverseImOrder","NumberOne","NumberTwo","NumberThree","NumberFour","NotFreestyle","NotFree","NotFr","NotBackstroke","NotBack","NotBk","NotBreastroke","NotBreast","NotBr","NotButterfly","NotFly","NotFl"],A=["Pull","Kick","Drill"],E=["Board","Pads","PullBuoy","Fins","Snorkel","Chute","StretchCord"],q=["Title","Description","Date","PoolLength","LengthUnit","Align","NumeralSystem","HideIntro","LayoutWidth"],je=["True","False"];function C(e){const t=new Set,i=Q(e).cursor();do{if(i.name!=="PaceDefinition"||!i.firstChild())continue;const n=e.sliceDoc(i.from,i.to);t.add(n),i.parent()}while(i.next());return t}const K=Re.define({create:C,update(e,t){return t.docChanged?C(t.state):e}}),Le=L.map(e=>({label:e,type:"constant",boost:e.length})),Ae=E.map(e=>({label:e,type:"constant"})),Ee=A.map(e=>({label:e,type:"constant"})),qe=q.map(e=>({label:e,type:"constant"})),U={0:{priorNodeName:"Distance",nodeName:"Stroke",completions:Le},1:{priorNodeName:"EquipmentSpecification",nodeName:"EquipmentName",completions:Ae},2:{priorNodeName:"Pace",nodeName:"PaceAlias",completions:[]},3:{priorNodeName:"",nodeName:"StrokeModifier",completions:Ee},4:{priorNodeName:"",nodeName:"ConstantName",completions:qe}};function Ke(e){const t=Q(e.state).resolveInner(e.pos,-1);U[2].completions=Array.from(e.state.field(K)).map(i=>({label:i,type:"variable"}));for(const{priorNodeName:i,nodeName:n,completions:o}of Object.values(U)){if(t.name===i)return{from:e.pos,options:o,validFor:/^[A-Za-z]/};if(t.name===n)return{from:t.from,to:t.to,options:o,validFor:/^[A-Za-z]/}}return null}function z(e,t){const[i,...n]=t;return n.reduce(([o,r],a)=>{const c=R(e,a);return c<r?[a,c]:[o,r]},[i,R(e,i)])}const G=2;function ze(e,t){const i=[];if(t.size>0){const[n,o]=z(e,Array.from(t));o<=G&&i.push({name:`Did you mean '${n}'?`,apply(r,a,c){r.dispatch({changes:{from:a,to:c,insert:n}})}})}return i.push({name:"Define pace name",apply(n){n.dispatch({changes:{from:0,to:0,insert:`pace ${e} = _%
`}})}}),i}function Ge(e){return[{name:"Remove duplicated definition",apply(t){t.dispatch({changes:{from:e.from,to:e.to}})}}]}function Je(e,t){const[i,n]=z(e,t);return n>G?[]:[{name:`Did you mean ${i}`,apply(o,r,a){o.dispatch({changes:{from:r,to:a,insert:i}})}}]}function He(e,t,i){return{from:t.from,to:t.to,severity:"error",message:`A pace named '${e}' has already been defined`,actions:Ge(i)}}function et(e,t,i){return{from:e.from,to:e.to,severity:"error",actions:ze(t,i),message:`'${t}' is not a defined pace name.
If you wish to be able to use '${t}' in the place of a pace percentage, please define it with the following line:
Pace ${t} = _%`}}function tt(e){return{from:e.from,to:e.to,severity:"error",message:"Syntax error"}}function it(e,t){return{from:e,to:t,severity:"error",message:"Duplicate equipment specified. Please do not use the same equipment multiple times"}}function nt(e,t,i,n){return{from:e,to:t,severity:"error",message:`'${i}' is not compatible with stroke type '${n}'`}}function ot(e,t){return{from:e,to:t,severity:"error",message:"Multiple rest times specified. Please only specify at most one rest time per instruction."}}function st(e){return e.replace(/([a-z])([A-Z])/g,"$1 $2").toLowerCase()}function rt(e,t,i,n){return{from:e.from,to:e.to,severity:"error",message:`${t} is not a valid ${st(i)}.`,actions:Je(t,n)}}function at(e){return{from:e.from,to:e.to,severity:"error",message:"Number too large for duration"}}const ct=59;function lt(e,t,i,n){if(e.name!=="PaceAlias")return;const o=i.sliceDoc(e.from,e.to);t.has(o)||n.push(et(e,o,t))}function dt(e,t,i,n){if(e.name!=="PaceDefinitionName")return;const o=i.sliceDoc(e.from,e.to),r=e.node.parent;r!==null&&(t.has(o)?n.push(He(o,e,r)):t.add(o))}function Ot(e,t){e.name==="⚠"&&t.push(tt(e))}const mt=new Map([["Default",new Set(["Board","PullBuoy"])],["Kick",new Set(["PullBuoy","Pads"])],["Pull",new Set(["Board","Fins"])]]);function ut(e,t,i){if(e.name!=="Instruction")return;const n=e.node.getChild("EquipmentSpecification");if(n===null)return;const o=e.node.getChild("StrokeType"),r=o!==null?t.sliceDoc(o.from,o.to):"Default",a=o!==null?o.from:n.from,c=n.getChildren("EquipmentName").map(u=>t.sliceDoc(u.from,u.to)),d=new Set(c);d.size!==c.length&&i.push(it(a,n.to));const f=mt.get(r);if(f!==void 0)for(const u of d)f.has(u)&&i.push(nt(a,n.to,u,r))}function ft(e,t){var a;if(e.name!=="Rest")return;const i=e.node.parent;if(!i)return;const n=i.getChildren("Rest");if(n.length<=1||((a=n[0])==null?void 0:a.from)!==e.from)return;const o=n[0],r=n[n.length-1];r!==void 0&&t.push(ot(o.from,r.to))}function x(e,t,i,n,o){if(e.name!==i)return;const r=t.sliceDoc(e.from,e.to);n.includes(r)||o.push(rt(e,r,i,n))}function ht(e,t,i){if(e.name!=="Duration")return;const n=e.node.getChildren("Number");for(const o of n)Number(t.sliceDoc(o.from,o.to))>ct&&i.push(at(o))}function pt(e){const t=[],i=new Set,n=e.state,o=Q(n).cursor();do lt(o,i,n,t),dt(o,i,n,t),Ot(o,t),ut(o,n,t),x(o,n,"Stroke",L,t),x(o,n,"StrokeModifier",A,t),x(o,n,"EquipmentName",E,t),x(o,n,"Boolean",je,t),x(o,n,"ConstantName",q,t),ht(o,n,t),ft(o,t);while(o.next());return t}var St=Ce(pt);const Pt=Fe.deserialize({version:14,states:"+pQYQPOOOnQPO'#CcOOQO'#Ce'#CeOOQO'#Cb'#CbO|QPO'#CaO!RQPO'#ChO#OQPO'#C_OOQO'#DW'#DWO#lQPO'#CxO#qQPO'#C{O#vQPO'#C|OOQO'#DV'#DVOOQO'#DO'#DOQYQPOOO#{QQO'#DWOOQO,59O,59OO$QQPO,59QO$VQPO,58yOOQO'#Cg'#CgOOQO,58{,58{OOQO'#DP'#DPO$_QPO,59SOOQO'#Ci'#CiO$mQPO'#CjO$rQPO'#CoO$rQPO'#CpO$wQPO'#CqOOQO'#Cn'#CnOOQO'#Cr'#CrO$|QPO'#CsO#qQPO'#CtOOQO'#Cv'#CvOOQO'#D_'#D_OOQO'#DQ'#DQO%RQPO,58yO%RQPO,58yO&YQPO'#D_OOQO'#Cy'#CyO&bQPO,59dO&mQSO'#DkO#qQPO,59gOOQO'#C}'#C}O&rQPO,59hOOQO-E6|-E6|OOQO,59r,59rOOQO1G.l1G.lOqQPO'#CcO&wQPO1G.eOOQO-E6}-E6}OOQO1G.n1G.nOOQO'#Ck'#CkOOQO'#DR'#DRO'eQPO,59UO(oQPO'#CfOOQO,59Z,59ZOOQO,59[,59[OOQO,59],59]OOQO,59_,59_OOQO,59`,59`OOQO-E7O-E7OO(tQPO1G.eOOQO'#Cm'#CmOOQO'#Db'#DbO)bQPO'#ClO*lQPO'#DbOOQO,59y,59yOOQO'#Cz'#CzOOQO'#Dp'#DpOOQO1G/O1G/OO*qQPO,5:VO*vQPO1G/RO&YQPO1G/SO+bQPO7+$PO+bQPO7+$POOQO-E7P-E7PO&YQPO,59WOOQO,59|,59|OOQO1G/q1G/qOOQO7+$m7+$mOOQO7+$n7+$nO,OQPO<<GkOOQO1G.r1G.r",stateData:",}~OxOSPOS~OSPO!PTO!b^O!cWO!eXO!fYO~O{aO|_O}`O!OVX~O!ObO~OSPO!PTO!b^O~O!OfO!SgO!TtO!XhO!YiO!ZjO![lO!]mO!^nO!aoO~OSRXvRX!PRX!bRX!cRX!eRX!fRX!QRX~P!^O!OuO~O!`wO~O!OyO~Ok|O~OS}O~OS!OO!PTO~OSPO!PTO!Q!RO!b^O~O!O!SO~OS!VO~OS!YO~OS!ZO~O!SgO!TtO!XhO!YiO!ZjO![lO!]mO!^nO!aoOSRavRa!PRa!bRa!cRa!eRa!fRa!QRa~OS!bO!O!_O~OS!eO!O!dO!`wO~Oi!gO~O!g!iO~OSRivRi!PRi!bRi!cRi!eRi!fRi!QRi~P!^O!O!SOS^av^a!P^a!S^a!T^a!X^a!Y^a!Z^a![^a!]^a!^^a!a^a!b^a!c^a!e^a!f^a!Q^a~O}`O~OSRivRi!PRi!bRi!cRi!eRi!fRi!QRi~P!aO!W!mOS`Xv`X!P`X!S`X!T`X!X`X!Y`X!Z`X![`X!]`X!^`X!a`X!b`X!c`X!e`X!f`X!Q`X~O!V!nO~O!`!oO~O!`wOSoivoi!Poi!boi!coi!eoi!foi~OSRqvRq!PRq!bRq!cRq!eRq!fRq!QRq~P!aOSRyvRy!PRy!bRy!cRy!eRy!fRy!QRy~P!aOi!Z!Y!]![!a|x!X!e!c!fPk{!O~",goto:"&d!ePPP!fP!l!u!|!|!|#T#b!l#e#k#u#y$P#k$U$U$U#k#k#kP#kP$`$d$g$`$`$j$m$s$y%]PPP%c%gPPPPPP%oPP%yPPPPPPPP&QPPPP&aXVOT]eWUOT]eR!PaZSOT]aeZROT]aeYQOT]aeQ!WhR!XiRcSQsUR!k!PapUrs!P!^!j!k!rT!Tg!UQ!ctR!q!iV!`t!i!makUrs!P!^!j!k!rTZO]RvWR!evRzYQ]OR{]QeTR!QeQrUW!]r!^!j!rQ!^sQ!j!PR!r!kQ!UgR!l!UT[O]SZO]TdTeaqUrs!P!^!j!k!rS!at!iR!s!mQxXQ![nQ!evQ!hxR!p!hR!fv",nodeNames:"⚠ Comment SwimProgramme SwimInstruction Number SingleInstruction Length LengthAsDistance LengthAsLaps LengthAsTime Duration Stroke BlockInstruction StrokeModifier EquipmentSpecification EquipmentName Pace PaceAlias Rest RestSinceStart RestAfterStop RestInOut Underwater Breathe InstructionDescription StringContent ExcludeAlignSpecification Message ConstantDefinition ConstantName Boolean AuthorDefinition PaceDefinition PaceDefinitionName",maxTerm:69,skippedNodes:[0,1],repeatNodeCount:4,tokenData:"!I|~R!eOX%dXY)_YZ+cZ^)_^p%dpq)_qr%drs-[st-otu%duv0Zv{%d{|1P|}%d}!O1u!O!Q%d!Q![4a![!]5]!]!_%d!_!`6R!`!a6w!a!b%d!b!c7m!c!}8c!}#O%d#O#P(U#P#T%d#T#U9e#U#V@c#V#]8c#]#^Hf#^#`8c#`#aNY#a#b8c#b#c!$u#c#d!,x#d#e!/U#e#g8c#g#h!3o#h#i8c#i#j!7T#j#k8c#k#l!Bp#l#m!G^#m#o8c#o#p!Hb#p#q%d#q#r!IW#r#y%d#y#z)_#z$f%d$f$g)_$g#BY%d#BY#BZ)_#BZ$IS%d$IS$I_)_$I_$I|%d$I|$JO)_$JO$JT%d$JT$JU)_$JU$KV%d$KV$KW)_$KW&FU%d&FU&FV)_&FV;'S%d;'S;=`)X<%lO%dU%kXiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dS&]UiSOr&Ws#O&W#O#P&o#P;'S&W;'S;=`'g<%lO&WS&rRO;'S&W;'S;=`&{;=`O&WS'QViSOr&Ws#O&W#O#P&o#P;'S&W;'S;=`'g;=`<%l&W<%lO&WS'jP;=`<%l&WQ'rSkQOY'mZ;'S'm;'S;=`(O<%lO'mQ(RP;=`<%l'mU(ZUkQOY%dYZ&WZ;'S%d;'S;=`(m;=`<%l&W<%lO%dU(rViSOr&Ws#O&W#O#P&o#P;'S&W;'S;=`'g;=`<%l%d<%lO&WU)[P;=`<%l%d~)hmiSx~kQOX%dXY)_YZ+cZ^)_^p%dpq)_qr%drs'ms#O%d#O#P(U#P#y%d#y#z)_#z$f%d$f$g)_$g#BY%d#BY#BZ)_#BZ$IS%d$IS$I_)_$I_$I|%d$I|$JO)_$JO$JT%d$JT$JU)_$JU$KV%d$KV$KW)_$KW&FU%d&FU&FV)_&FV;'S%d;'S;=`)X<%lO%d~+jjiSx~OX&WX^+c^p&Wpq+cqr&Ws#O&W#O#P&o#P#y&W#y#z+c#z$f&W$f$g+c$g#BY&W#BY#BZ+c#BZ$IS&W$IS$I_+c$I_$I|&W$I|$JO+c$JO$JT&W$JT$JU+c$JU$KV&W$KV$KW+c$KW&FU&W&FU&FV+c&FV;'S&W;'S;=`'g<%lO&WR-cS!`PkQOY'mZ;'S'm;'S;=`(O<%lO'm~-xXiSP~kQOY-oYZ&WZr-ors.es#O-o#O#P/O#P;'S-o;'S;=`0T<%lO-o~.lSP~kQOY.eZ;'S.e;'S;=`.x<%lO.e~.{P;=`<%l.e~/VUP~kQOY-oYZ&WZ;'S-o;'S;=`/i;=`<%l&W<%lO-o~/nViSOr&Ws#O&W#O#P&o#P;'S&W;'S;=`'g;=`<%l-o<%lO&W~0WP;=`<%l-oV0dX!VPiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV1YX!SPiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV1|]iSkQOY%dYZ&WZr%drs'ms}%d}!O2u!O!`%d!`!a3k!a#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV3OX!^PiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV3tX!WPiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV4jZSPiSkQOY%dYZ&WZr%drs'ms!Q%d!Q![4a![#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV5fX}PiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV6[X!gPiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV7QX!bPiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV7vX!TPiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV8l]iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV9n_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#i8c#i#j:m#j#o8c#o;'S%d;'S;=`)X<%lO%dV:v_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#h8c#h#i;u#i#o8c#o;'S%d;'S;=`)X<%lO%dV<O_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#[8c#[#]<}#]#o8c#o;'S%d;'S;=`)X<%lO%dV=W_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#c8c#c#d>V#d#o8c#o;'S%d;'S;=`)X<%lO%dV>`_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#f8c#f#g?_#g#o8c#o;'S%d;'S;=`)X<%lO%dV?j]iS!ePkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV@l_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#f8c#f#gAk#g#o8c#o;'S%d;'S;=`)X<%lO%dVAt_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#X8c#X#YBs#Y#o8c#o;'S%d;'S;=`)X<%lO%dVB|^iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#UCx#U#o8c#o;'S%d;'S;=`)X<%lO%dVDR_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#h8c#h#iEQ#i#o8c#o;'S%d;'S;=`)X<%lO%dVEZ_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#[8c#[#]FY#]#o8c#o;'S%d;'S;=`)X<%lO%dVFc_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#X8c#X#YGb#Y#o8c#o;'S%d;'S;=`)X<%lO%dVGm]iS!]PkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dVHo_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#b8c#b#cIn#c#o8c#o;'S%d;'S;=`)X<%lO%dVIw_iSkQ!OPOY%dYZ&WZr%drs'ms}%d}!OJv!O!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dVJ}ZiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P#c%d#c#dKp#d;'S%d;'S;=`)X<%lO%dVKwZiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P#i%d#i#jLj#j;'S%d;'S;=`)X<%lO%dVLqZiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P#h%d#h#iMd#i;'S%d;'S;=`)X<%lO%dVMmXiS!ZPkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dVNc^iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#U! _#U#o8c#o;'S%d;'S;=`)X<%lO%dV! h_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#d8c#d#e!!g#e#o8c#o;'S%d;'S;=`)X<%lO%dV!!r_iS|PkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#g8c#g#h!#q#h#o8c#o;'S%d;'S;=`)X<%lO%dV!#|]iS|PkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!%O_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#c8c#c#d!%}#d#o8c#o;'S%d;'S;=`)X<%lO%dV!&W^iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#U!'S#U#o8c#o;'S%d;'S;=`)X<%lO%dV!']_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#`8c#`#a!([#a#o8c#o;'S%d;'S;=`)X<%lO%dV!(e_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#]8c#]#^!)d#^#o8c#o;'S%d;'S;=`)X<%lO%dV!)m_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#Z8c#Z#[!*l#[#o8c#o;'S%d;'S;=`)X<%lO%dV!*u_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#b8c#b#c!+t#c#o8c#o;'S%d;'S;=`)X<%lO%dV!,P]iS!aPkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!-R_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#b8c#b#c!.Q#c#o8c#o;'S%d;'S;=`)X<%lO%dV!.]]iS!XPkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!/_^iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#U!0Z#U#o8c#o;'S%d;'S;=`)X<%lO%dV!0d_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#V8c#V#W!1c#W#o8c#o;'S%d;'S;=`)X<%lO%dV!1l_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#X8c#X#Y!2k#Y#o8c#o;'S%d;'S;=`)X<%lO%dV!2v]iS!fPkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!3x_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#X8c#X#Y!4w#Y#o8c#o;'S%d;'S;=`)X<%lO%dV!5Q_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#h8c#h#i!6P#i#o8c#o;'S%d;'S;=`)X<%lO%dV!6[]iS!cPkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!7^_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#b8c#b#c!8]#c#o8c#o;'S%d;'S;=`)X<%lO%dV!8f_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#W8c#W#X!9e#X#o8c#o;'S%d;'S;=`)X<%lO%dV!9n_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#X8c#X#Y!:m#Y#o8c#o;'S%d;'S;=`)X<%lO%dV!:v_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#f8c#f#g!;u#g#o8c#o;'S%d;'S;=`)X<%lO%dV!<O_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#k8c#k#l!<}#l#o8c#o;'S%d;'S;=`)X<%lO%dV!=W^iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#U!>S#U#o8c#o;'S%d;'S;=`)X<%lO%dV!>]_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#h8c#h#i!?[#i#o8c#o;'S%d;'S;=`)X<%lO%dV!?e_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#X8c#X#Y!@d#Y#o8c#o;'S%d;'S;=`)X<%lO%dV!@m_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#f8c#f#g!Al#g#o8c#o;'S%d;'S;=`)X<%lO%dV!Aw]iS![PkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!By_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#]8c#]#^!Cx#^#o8c#o;'S%d;'S;=`)X<%lO%dV!DR_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#h8c#h#i!EQ#i#o8c#o;'S%d;'S;=`)X<%lO%dV!EZ_iSkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#[8c#[#]!FY#]#o8c#o;'S%d;'S;=`)X<%lO%dV!Fe]iS!YPkQ!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!Gi]iSkQ{P!OPOY%dYZ&WZr%drs'ms!c%d!c!}8c!}#O%d#O#P(U#P#T%d#T#o8c#o;'S%d;'S;=`)X<%lO%dV!HkX!PPiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%dV!IaX!QPiSkQOY%dYZ&WZr%drs'ms#O%d#O#P(U#P;'S%d;'S;=`)X<%lO%d",tokenizers:[0,1,2],topRules:{SwimProgramme:[0,2]},tokenPrec:534});function J(e,t){e.firstChild();const i={isAlias:e.name==="PaceAlias",value:t.sliceDoc(e.from,e.to)};let n;return e.nextSibling()&&(n={isAlias:e.name==="PaceAlias",value:t.sliceDoc(e.from,e.to)}),e.parent(),{modifier:1,startIntensity:i,stopIntensity:n}}function gt(e,t){e.firstChild();const i=t.sliceDoc(e.from,e.to);e.nextSibling();const n=J(e,t);return e.parent(),{statement:2,name:i,pace:n}}function kt(e,t){e.firstChild();const i=t.sliceDoc(e.from,e.to);return e.parent(),{modifier:4,breatheStrokes:i}}function yt(e,t){return e.name==="SwimInstruction"?ee(e,t):te(e,t)}function H(e,t){e.firstChild();const i=t.sliceDoc(e.from,e.to);e.nextSibling();const n=t.sliceDoc(e.from,e.to);return e.parent(),{minutes:i,seconds:n}}function bt(e){switch(e){case"Board":return"board";case"Pads":return"pads";case"PullBuoy":return"pullBuoy";case"Fins":return"fins";case"Snorkel":return"snorkel";case"Chute":return"chute";case"StretchCord":return"stretchCord";default:return""}}function wt(e,t){if(e.name==="EquipmentSpecification"){const i=[];e.firstChild();do{const n=t.sliceDoc(e.from,e.to);i.push(bt(n))}while(e.nextSibling());return e.parent(),{modifier:0,equipment:i}}return e.name==="Pace"?J(e,t):e.name==="ExcludeAlignSpecification"?{modifier:3}:e.name==="Breathe"?kt(e,t):e.name==="InstructionDescription"?Zt(e,t):e.name==="Underwater"?{modifier:5,isTrue:!0}:xt(e,t)}function xt(e,t){e.firstChild();let i;if(e.name==="RestInOut"){e.firstChild();const n=t.sliceDoc(e.from,e.to);e.parent(),i={modifier:2,type:"InOut",swimmersIn:n}}else{const n=e.name==="RestAfterStop"?"AfterStop":"SinceStart";e.firstChild();const o=H(e,t);e.parent(),i={modifier:2,type:n,...o}}return e.parent(),i}function Tt(e){switch(e){case"Freestyle":case"Free":case"Fr":return"freestyle";case"Backstroke":case"Back":case"Bk":return"backstroke";case"Breaststroke":case"Breast":case"Br":return"breaststroke";case"Butterfly":case"Fly":case"Fl":return"butterfly";case"IndividualMedley":case"Medley":case"Im":return"individualMedley";case"ReverseIndividualMedley":case"ReverseMedley":case"ReverseIm":return"reverseIndividualMedley";case"IndividualMedleyOverlap":case"MedleyOverlap":case"ImOverlap":return"individualMedleyOverlap";case"IndividualMedleyOrder":case"MedleyOrder":case"ImOrder":return"individualMedleyOrder";case"ReverseIndividualMedleyOrder":case"ReverseMedleyOrder":case"ReverseImOrder":return"reverseIndividualMedleyOrder";case"NumberOne":return"nr1";case"NumberTwo":return"nr2";case"NumberThree":return"nr3";case"NumberFour":return"nr4";case"NotFreestyle":case"NotFree":case"NotFr":return"notFreestyle";case"NotBackstroke":case"NotBack":case"NotBk":return"notBackstroke";case"NotBreastroke":case"NotBreast":case"NotBr":return"notBreastroke";case"NotButterfly":case"NotFly":case"NotFl":return"notButterfly";case"Choice":default:return"any"}}function Qt(e){switch(e){case"Kick":return"kicking";case"Pull":return"pulling";case"Drill":return"drill";default:return"standardStroke"}}function ee(e,t){let i=1,n="standardStroke",o;const r=[];if(e.firstChild(),e.name==="Number"&&(i=Number(t.sliceDoc(e.from,e.to)),e.nextSibling()),e.name==="BlockInstruction"){e.firstChild();const a=[];do a.push(yt(e,t));while(e.nextSibling());o={isBlock:!0,instructions:a}}else{e.firstChild(),e.firstChild();let a;switch(e.name){case"LengthAsDistance":a="distance";break;case"LengthAsLaps":a="laps";break;case"LengthAsTime":a="time";break;default:a="distance"}e.firstChild();let c;a==="time"?c={kind:a,...H(e,t)}:c={kind:a,value:t.sliceDoc(e.from,e.to)},e.parent(),e.parent(),e.nextSibling();const d=Tt(t.sliceDoc(e.from,e.to));o={isBlock:!1,length:c,stroke:d}}if(e.parent(),e.nextSibling()){let a=!0;if(e.name==="StrokeModifier"&&(n=Qt(t.sliceDoc(e.from,e.to)),a=e.nextSibling()),a)do r.push(wt(e,t));while(e.nextSibling())}return e.parent(),{statement:0,repetitions:i,instruction:o,strokeModifier:n,instructionModifiers:r}}function te(e,t){return{statement:1,message:t.sliceDoc(e.from,e.to)}}function Yt(e,t){e.firstChild();const i=t.sliceDoc(e.from,e.to);e.nextSibling();const n=t.sliceDoc(e.from,e.to);return e.parent(),{statement:3,constantName:i,value:n}}function vt(e,t){e.firstChild();const i=t.sliceDoc(e.from,e.to);e.nextSibling();const n=t.sliceDoc(e.from,e.to);let o;return e.nextSibling()&&(o=t.sliceDoc(e.from,e.to)),e.parent(),{statement:4,firstName:i,lastName:n,emailAddress:o}}function Zt(e,t){e.firstChild();const i=t.sliceDoc(e.from,e.to);return e.parent(),{modifier:6,description:i}}function Xt(e,t){const i=[];function n(){do{let o=null;switch(e.type.name){case"SwimInstruction":o=ee(e,t);break;case"Message":o=te(e,t);break;case"PaceDefinition":o=gt(e,t);break;case"ConstantDefinition":o=Yt(e,t);break;case"AuthorDefinition":o=vt(e,t);break}o!==null&&i.push(o)}while(e.nextSibling())}return e.firstChild(),n(),{statements:i}}const It="https://github.com/bartneck/swiML",Wt="http://www.w3.org/2001/XMLSchema-instance",Dt="https://github.com/bartneck/swiML https://raw.githubusercontent.com/bartneck/swiML/main/version/latest/swiML.xsd";function Z(e,t){let i="PT";return Number(e)>0&&(i+=e,i+="M"),Number(t)>0&&(i+=t,i+="S"),i}function Rt(e,t){switch(t.statement){case 0:ie(e,t);break;case 1:ne(e,t);break}}function N(e,t){t.isAlias?e.ele("zone").txt(t.value):e.ele("percentageEffort").txt(t.value)}function Ct(e,t){switch(t.modifier){case 1:{const i=e.ele("intensity");N(i.ele("startIntensity"),t.startIntensity),t.stopIntensity&&N(i.ele("stopIntensity"),t.stopIntensity);break}case 0:for(const i of t.equipment)e.ele("equipment").txt(i);break;case 4:e.ele("breath").txt(t.breatheStrokes);break;case 2:switch(t.type){case"SinceStart":e.ele("rest").ele("sinceStart").txt(Z(t.minutes,t.seconds));break;case"AfterStop":e.ele("rest").ele("afterStop").txt(Z(t.minutes,t.seconds));break;case"InOut":e.ele("rest").ele("inOut").txt(t.swimmersIn);break}break;case 3:e.ele("excludeAlign").txt("true");break;case 5:e.ele("underwater").txt(t.isTrue.toString());break;case 6:e.ele("instructionDescription").txt(t.description);break}}function ie(e,t){let i=e.ele("instruction");if(t.repetitions>1&&(i=i.ele("repetition"),i.ele("repetitionCount").txt(String(t.repetitions)).up()),t.instruction.isBlock)for(const n of t.instruction.instructions)Rt(i,n);else{const n=t.instruction.length,o=i.ele("length");n.kind==="distance"?o.ele("lengthAsDistance").txt(n.value):n.kind=="laps"?o.ele("lengthAsLaps").txt(n.value):o.ele("lengthAsTime").txt(Z(n.minutes,n.seconds)),t.strokeModifier==="kicking"?i.ele("stroke").ele("kicking").ele("standardKick").txt(t.instruction.stroke):i.ele("stroke").ele("standardStroke").txt(t.instruction.stroke)}if(t.instructionModifiers.length>0)for(const n of t.instructionModifiers)Ct(i,n)}function ne(e,t){e.ele("instruction").ele("segmentName").txt(t.message)}function Ut(e,t){switch(t.constantName){case"Title":e.ele("title").txt(t.value);break;case"Description":e.ele("programDescription").txt(t.value);break;case"Date":e.ele("creationDate").txt(t.value);break;case"PoolLength":e.ele("poolLength").txt(t.value);break;case"LengthUnit":e.ele("lengthUnit").txt(t.value);break;case"Align":e.ele("programAlign").txt(t.value.toLowerCase());break;case"NumeralSystem":e.ele("numeralSystem").txt(t.value);break;case"HideIntro":e.ele("hideIntro").txt(t.value.toLowerCase());break;case"LayoutWidth":e.ele("layoutWidth").txt(t.value);break}}function Nt(e,t){const i=e.ele("author");i.ele("firstName").txt(t.firstName),i.ele("lastName").txt(t.lastName),t.emailAddress&&i.ele("email").txt(t.emailAddress)}function Bt(e){const t=_e.create({version:"1.0",encoding:"UTF-8"}).ele("program",{xmlns:It,"xmlns:xsi":Wt,"xsi:schemaLocation":Dt});for(const i of e.statements)switch(i.statement){case 0:ie(t,i);break;case 1:ne(t,i);break;case 2:break;case 3:Ut(t,i);break;case 4:Nt(t,i);break}return t.end({prettyPrint:!0})}function Mt(e){return Xe.fromClass(class{constructor(t){this.view=t,this.run(this.view)}update(t){!t.docChanged||Ie(t.state)!==0||this.run(t.view)}run(t){const i=Q(t.state).cursor(),n=Xt(i,t.state),o=Bt(n);e(o)}})}const Vt=Pt.configure({props:[Ue.add({Application:Be({closing:")",align:!1})}),Ne.add({Application:Me}),$e({Stroke:h.className,StrokeModifier:h.typeName,Duration:h.integer,Percentage:h.integer,Number:h.integer,Identifier:h.variableName,EquipmentName:h.macroName,Comment:h.comment,SetKeyword:h.keyword,RestKeyword:h.keyword,PaceKeyword:h.keyword,OnKeyword:h.keyword})]}),Ft=De.define({name:"swimdsl",parser:Vt,languageData:{commentTokens:{line:"#"},autocomplete:Ke,closeBrackets:["{"]}});function oe(){return new We(Ft,[K.extension,St])}function $t(e){const t=document.createElement("input");t.type="file",t.accept=".txt",t.onchange=i=>{const n=i.target;if(!n.files||n.files.length<=0){console.warn("No files were selected");return}const o=n.files[0],r=new FileReader;r.onload=a=>{var d;const c=(d=a.target)==null?void 0:d.result;typeof c=="string"&&e(c)},r.readAsText(o)},t.click()}function W(e,t){const i=URL.createObjectURL(e),n=document.createElement("a");n.href=i,n.download=t,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(i)}function _t(e){const t=new Blob([e],{type:"text/plain;charset=utf-8"});W(t,"SwimProgramme.txt")}function jt(e){const t=new Blob([e],{type:"application/xml"});W(t,"SwimProgramme.xml")}function Lt(e){const t=new Blob([e],{type:"text/html"});W(t,"SwimProgramme.html")}function At(e){e.contentWindow!==null&&e.contentWindow.print()}function Et({swimdslProgramme:e,setSwimdslProgramme:t,setNewProgrammeOpen:i,swimlXml:n,htmlString:o,renderNode:r,children:a}){const[c,d]=O.useState(null),f=!!c;function u(m){d(m.currentTarget)}function p(){d(null)}function S(){i(!0)}const l=[{text:"New Programme",icon:s.jsx(me,{fontSize:"small"}),onclick:S},{text:"Open",icon:s.jsx(ue,{fontSize:"small"}),onclick:()=>{$t(t)}},{text:"Save As",icon:s.jsx(fe,{fontSize:"small"}),onclick:()=>{_t(e)}},{text:"Export swiML XML",icon:s.jsx(v,{fontSize:"small"}),onclick:()=>{jt(n)}},{text:"Export HTML",icon:s.jsx(v,{fontSize:"small"}),onclick:()=>{Lt(o)}},{text:"Export as PDF",icon:s.jsx(he,{fontSize:"small"}),onclick:()=>{r.current!==null&&At(r.current)}}];return s.jsx(le,{sx:{zIndex:m=>m.zIndex.drawer+1},position:"static",children:s.jsxs(M,{children:[s.jsx(V,{sx:{paddingX:"1em"},children:s.jsx(F,{variant:"h6",component:"div",children:"SwimDSL"})}),s.jsx(X,{id:"basic-button",onClick:u,color:"inherit",children:"File"}),s.jsx($,{open:f,anchorEl:c,onClose:p,children:l.map(({text:m,icon:P,onclick:y},b)=>s.jsxs(_,{onClick:y,children:[s.jsx(de,{children:P}),s.jsx(Oe,{children:m})]},b))}),s.jsx(w,{sx:{ml:"auto"},children:a})]})})}const qt='<?xml version="1.0" encoding="UTF-8"?><program xmlns="https://github.com/bartneck/swiML"/>';async function Kt(e){return(await SaxonJS.transform({stylesheetText:e,sourceText:qt},"async")).stylesheetInternal}async function zt(e,t){return(await SaxonJS.transform({stylesheetInternal:t,sourceText:e,destination:"serialized"},"async")).principalResult}function Gt({xmlString:e,htmlString:t,setHtmlString:i,nodeRef:n}){const[o,r]=O.useState({});return O.useEffect(()=>{fetch("./swiML.sef.json").then(a=>a.text()).then(Kt).then(r).catch(console.error)},[]),O.useEffect(()=>{Object.keys(o).length!==0&&zt(e,o).then(i).catch(console.error)},[o,e,i]),s.jsx("iframe",{ref:n,width:"100%",height:"100%",style:{border:"none"},srcDoc:t})}var k=(e=>(e[e.TUTORIAL=0]="TUTORIAL",e[e.RENDER=1]="RENDER",e[e.SWIML_XML=2]="SWIML_XML",e))(k||{});const Jt=[{page:null,icon:s.jsx(pe,{}),label:"Hide panel"},{page:k.RENDER,icon:s.jsx(Se,{}),label:"Show render"},{page:k.TUTORIAL,icon:s.jsx(Pe,{}),label:"Show tutorial"},{page:k.SWIML_XML,icon:s.jsx(v,{}),label:"Show swiML XML"}];function Ht({setPanelPage:e,activePanelPage:t,selectorOpen:i,setSelectorOpen:n}){return s.jsxs(V,{children:[Jt.map(({icon:o,page:r,label:a},c)=>s.jsx(D,{title:a,children:s.jsx("span",{children:s.jsx(X,{onClick:()=>{e(r)},disabled:t===r,color:"inherit",children:o})})},c)),s.jsx(D,{title:"Show/hide file picker",children:s.jsx(ge,{onClick:()=>{n(!i)},children:s.jsx(ke,{})})})]})}function ei({xmlContent:e}){const t=j();return s.jsx(I,{readOnly:!0,value:e,height:"100%",width:"100%",style:{height:"100%"},theme:t.palette.mode,extensions:[Ve()]})}const ti=`### Welcome ###################################################################

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
`;function ii(){const[e,t]=O.useState(ti),i=j();return s.jsx(I,{value:e,height:"100%",width:"100%",style:{height:"100%"},theme:i.palette.mode,extensions:[oe()],onChange:n=>{t(n)}})}function ni(e,t,i){e!==""&&(localStorage.removeItem(e),t(""),i(""))}function T(e,t,i,n,o,r=!0){r&&t&&localStorage.setItem(t,i),n(e),o(localStorage.getItem(e)??"")}function oi({selectorOpen:e,selectedFile:t,setSelectedFile:i,swimdslProgramme:n,setSwimdslProgramme:o}){const[r,a]=O.useState(null),[c,d]=O.useState(""),f=Object.keys(localStorage),u=(l,m)=>{l.preventDefault(),l.stopPropagation(),d(m),T(m,t,n,i,o),a({mouseX:l.clientX+2,mouseY:l.clientY-6})},p=l=>{var b;l.preventDefault();const P=document.elementsFromPoint(l.clientX,l.clientY).find(Y=>Y.closest("[data-key]")),y=(b=P==null?void 0:P.closest("[data-key]"))==null?void 0:b.getAttribute("data-key");y?(d(y),T(y,t,n,i,o),a({mouseX:l.clientX+2,mouseY:l.clientY-6})):a(null)},S=()=>{a(null),d("")};return s.jsxs(s.Fragment,{children:[s.jsxs(ye,{variant:"persistent",anchor:"right",open:e,sx:{width:250,flexShrink:0,"& .MuiDrawer-paper":{width:250,boxSizing:"border-box",backgroundColor:"lightgray"}},children:[s.jsx(M,{}),s.jsx(be,{style:{marginTop:10},selectedItems:t,onSelectedItemsChange:(l,m)=>{T(m??"",t,n,i,o)},children:f.map(l=>s.jsx(we,{itemId:l,"data-key":l,label:l,onContextMenu:m=>{u(m,l)}},l))})]}),s.jsx($,{open:r!==null,onClose:S,anchorReference:"anchorPosition",...r!==null&&{anchorPosition:{top:r.mouseY,left:r.mouseX}},slotProps:{backdrop:{onContextMenu:p},paper:{sx:{width:150}}},children:s.jsx(_,{onClick:()=>{ni(c,i,o),S()},children:"Delete"})})]})}const si={position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:400,bgcolor:"background.paper",border:"2px solid #000",boxShadow:24,p:4,flexDirection:"column",display:"flex"};function ri({newProgrammeOpen:e,setNewProgrammeOpen:t,selectedFile:i,swimdslProgramme:n,setSelectedFile:o,setSwimdslProgramme:r}){const[a,c]=O.useState(""),[d,f]=O.useState("");function u(){c(""),t(!1)}function p(){d.trim().length===0?c("Please enter a programme name."):d in localStorage?c("Programme name already in use. Please choose another name."):(localStorage.setItem(d,""),T(d,i,n,o,r),u())}return s.jsx(s.Fragment,{children:s.jsx(xe,{open:e,onClose:u,"aria-labelledby":"modal-modal-title","aria-describedby":"modal-modal-description",children:s.jsxs(w,{sx:si,children:[s.jsx(F,{variant:"h6",component:"div",children:"New Programme:"}),s.jsx(Te,{id:"outlined-basic",label:"Programme name",variant:"outlined",error:a.length>0,helperText:a,onChange:S=>{f(S.target.value)}}),s.jsx(X,{onClick:()=>{p()},children:"Create"})]})})})}function ai(){const[e,t]=O.useState(!1),[i,n]=O.useState(""),[o,r]=O.useState(""),a=Qe("(prefers-color-scheme: dark)"),[c,d]=O.useState(k.RENDER),[f,u]=O.useState(!0),[p,S]=O.useState(""),[l,m]=O.useState(""),P=O.useRef(null),y=O.useMemo(()=>Mt(S),[]),b=O.useMemo(()=>oe(),[]),Y=O.useMemo(()=>Ye({palette:{mode:a?"dark":"light"}}),[a]),se=O.useCallback(g=>{r(g),i&&localStorage.setItem(i,g)},[i]);localStorage.length===0&&(localStorage.setItem("First Programme",""),T("First Programme",i,o,n,r));function re(g){switch(g){case k.TUTORIAL:return s.jsx(ii,{});case k.RENDER:return s.jsx(Gt,{xmlString:p,htmlString:l,setHtmlString:m,nodeRef:P});case k.SWIML_XML:return s.jsx(ei,{xmlContent:p})}}return s.jsxs(ve,{theme:Y,children:[s.jsx(Ze,{}),s.jsxs(w,{sx:{display:"flex",flexDirection:"column",height:"100vh"},children:[s.jsx(ri,{newProgrammeOpen:e,setNewProgrammeOpen:t,selectedFile:i,setSelectedFile:n,swimdslProgramme:o,setSwimdslProgramme:r}),s.jsx(Et,{swimdslProgramme:o,setSwimdslProgramme:r,setNewProgrammeOpen:t,swimlXml:p,htmlString:l,renderNode:P,children:s.jsx(Ht,{activePanelPage:c,setPanelPage:d,selectorOpen:f,setSelectorOpen:u})}),s.jsxs(w,{sx:{display:"flex",flex:1,overflow:"hidden",minHeight:0},children:[s.jsx(w,{sx:{width:c!==null?"50%":"100%",minWidth:0,minHeight:0},borderRight:"1px solid",children:s.jsx(I,{value:o,style:{height:"100%"},width:"100%",height:"100%",theme:a?"dark":"light",extensions:[b,y],onChange:se})}),c!==null&&s.jsx(w,{sx:{width:"50%",overflow:"hidden",minWidth:0,minHeight:0,flexGrow:1,transition:g=>g.transitions.create("margin",{easing:g.transitions.easing.sharp,duration:g.transitions.duration.leavingScreen}),marginRight:f?0:"-250px"},children:re(c)}),s.jsx(oi,{selectedFile:i,setSelectedFile:n,swimdslProgramme:o,setSwimdslProgramme:r,selectorOpen:f})]})]})]})}const B=document.getElementById("root");B!==null?ce.createRoot(B).render(s.jsx(ae.StrictMode,{children:s.jsx(ai,{})})):console.error("Root element does not exist!");
