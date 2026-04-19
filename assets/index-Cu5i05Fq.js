import{b as c,j as r,r as G}from"./react-CMFr3qCg.js";import{c as H}from"./react-dom-DX5UQ9U7.js";import{A as ee,T as te,P as N,a as ne,B as Z,M as oe,b as ie,L as se,c as re,d as S,e as ae,U as le,S as ce,C as b,f as ue,V as me,I as de,H as Oe,g as fe,u as C,h as pe,i as he,j as $e,k as Se}from"./@mui-CmKafNEk.js";import{R as w}from"./@uiw-PGa3NKDv.js";import{V as ze,G as ye,H as z,L as Pe,I as ge,J as be,K as we,M as ke,N as Te,O as xe,P as ve,Q as Ie}from"./@codemirror-HnVgEYRi.js";import{L as Re,s as Ne,a as u}from"./@lezer-CRier5-m.js";import{d as T}from"./fastest-levenshtein-ChoUA_u9.js";import{x as Ze}from"./xmlbuilder2-DPvUJURa.js";import"./hoist-non-react-statics-VTAvmUN5.js";import"./scheduler-Bb8JjhAW.js";import"./@emotion-D3xeAZ7B.js";import"./@babel-BtohYyOd.js";import"./stylis-DDa9OTMq.js";import"./clsx-B-dksMZM.js";import"./react-transition-group-D_SqvwCt.js";import"./react-is-BPJnJB5S.js";import"./@popperjs-CMBiYTiD.js";import"./crelt-C8TCjufn.js";import"./@marijn-DXwl3gUT.js";import"./style-mod-Bs6eFhZE.js";import"./w3c-keyname-Vcq4gwWv.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();const D=["Freestyle","Free","Fr","Backstroke","Back","Bk","Breaststroke","Breast","Br","Butterfly","Fly","Fl","Choice","IndividualMedley","Medley","Im","ReverseIndividualMedley","ReverseMedley","ReverseIm","IndividualMedleyOverlap","MedleyOverlap","ImOverlap","IndividualMedleyOrder","MedleyOrder","ImOrder","ReverseIndividualMedleyOrder","ReverseMedleyOrder","ReverseImOrder","NumberOne","NumberTwo","NumberThree","NumberFour","NotFreestyle","NotFree","NotFr","NotBackstroke","NotBack","NotBk","NotBreastroke","NotBreast","NotBr","NotButterfly","NotFly","NotFl"],B=["Pull","Kick","Drill"],Y=["Board","Pads","PullBuoy","Fins","Snorkel","Chute","StretchCord"],Q=["Title","Description","Date","PoolLength","LengthUnit","Align","NumeralSystem","HideIntro","LayoutWidth"],Ce=["True","False"];function x(e){const t=new Set,n=z(e).cursor();do{if(n.name!=="PaceDefinition"||!n.firstChild())continue;const o=e.sliceDoc(n.from,n.to);t.add(o),n.parent()}while(n.next());return t}const M=be.define({create:x,update(e,t){return t.docChanged?x(t.state):e}}),De=D.map(e=>({label:e,type:"constant",boost:e.length})),Be=Y.map(e=>({label:e,type:"constant"})),Ye=B.map(e=>({label:e,type:"constant"})),Qe=Q.map(e=>({label:e,type:"constant"})),v={0:{priorNodeName:"Distance",nodeName:"Stroke",completions:De},1:{priorNodeName:"EquipmentSpecification",nodeName:"EquipmentName",completions:Be},2:{priorNodeName:"Pace",nodeName:"PaceAlias",completions:[]},3:{priorNodeName:"",nodeName:"StrokeType",completions:Ye},4:{priorNodeName:"",nodeName:"ConstantName",completions:Qe}};function Me(e){const t=z(e.state).resolveInner(e.pos,-1);v[2].completions=Array.from(e.state.field(M)).map(n=>({label:n,type:"variable"}));for(const{priorNodeName:n,nodeName:o,completions:i}of Object.values(v)){if(t.name===n)return{from:e.pos,options:i,validFor:/^[A-Za-z]/};if(t.name===o)return{from:t.from,to:t.to,options:i,validFor:/^[A-Za-z]/}}return null}function _(e,t){const[n,...o]=t;return o.reduce(([i,s],a)=>{const l=T(e,a);return l<s?[a,l]:[i,s]},[n,T(e,n)])}const q=2;function _e(e,t){const n=[];if(t.size>0){const[o,i]=_(e,Array.from(t));i<=q&&n.push({name:`Did you mean '${o}'?`,apply(s,a,l){s.dispatch({changes:{from:a,to:l,insert:o}})}})}return n.push({name:"Define pace name",apply(o){o.dispatch({changes:{from:0,to:0,insert:`pace ${e} = _%
`}})}}),n}function qe(e){return[{name:"Remove duplicated definition",apply(t){t.dispatch({changes:{from:e.from,to:e.to}})}}]}function We(e,t){const[n,o]=_(e,t);return o>q?[]:[{name:`Did you mean ${n}`,apply(i,s,a){i.dispatch({changes:{from:s,to:a,insert:n}})}}]}function Fe(e,t,n){return{from:t.from,to:t.to,severity:"error",message:`A pace named '${e}' has already been defined`,actions:qe(n)}}function Le(e,t,n){return{from:e.from,to:e.to,severity:"error",actions:_e(t,n),message:`'${t}' is not a defined pace name.
If you wish to be able to use '${t}' in the place of a pace percentage, please define it with the following line:
Pace ${t} = _%`}}function Xe(e){return{from:e.from,to:e.to,severity:"error",message:"Syntax error"}}function je(e,t){return{from:e,to:t,severity:"error",message:"Duplicate equipment specified. Please do not use the same equipment multiple times"}}function Ee(e,t,n,o){return{from:e,to:t,severity:"error",message:`'${n}' is not compatible with stroke type '${o}'`}}function Ae(e){return e.replace(/([a-z])([A-Z])/g,"$1 $2").toLowerCase()}function Ve(e,t,n,o){return{from:e.from,to:e.to,severity:"error",message:`${t} is not a valid ${Ae(n)}.`,actions:We(t,o)}}function Ue(e){return{from:e.from,to:e.to,severity:"error",message:"Number too large for duration"}}const Ke=59;function Je(e,t,n,o){if(e.name!=="PaceAlias")return;const i=n.sliceDoc(e.from,e.to);t.has(i)||o.push(Le(e,i,t))}function Ge(e,t,n,o){if(e.name!=="PaceDefinitionName")return;const i=n.sliceDoc(e.from,e.to),s=e.node.parent;s!==null&&(t.has(i)?o.push(Fe(i,e,s)):t.add(i))}function He(e,t){e.name==="⚠"&&t.push(Xe(e))}const et=new Map([["Default",new Set(["Board","PullBuoy"])],["Kick",new Set(["PullBuoy","Pads"])],["Pull",new Set(["Board","Fins"])]]);function tt(e,t,n){if(e.name!=="Instruction")return;const o=e.node.getChild("EquipmentSpecification");if(o===null)return;const i=e.node.getChild("StrokeType"),s=i!==null?t.sliceDoc(i.from,i.to):"Default",a=i!==null?i.from:o.from,l=o.getChildren("EquipmentName").map(O=>t.sliceDoc(O.from,O.to)),d=new Set(l);d.size!==l.length&&n.push(je(a,o.to));const p=et.get(s);if(p!==void 0)for(const O of d)p.has(O)&&n.push(Ee(a,o.to,O,s))}function $(e,t,n,o,i){if(e.name!==n)return;const s=t.sliceDoc(e.from,e.to);o.includes(s)||i.push(Ve(e,s,n,o))}function nt(e,t,n){if(e.name!=="Duration")return;const o=e.node.getChildren("Number");for(const i of o)Number(t.sliceDoc(i.from,i.to))>Ke&&n.push(Ue(i))}function ot(e){const t=[],n=new Set,o=e.state,i=z(o).cursor();do Je(i,n,o,t),Ge(i,n,o,t),He(i,t),tt(i,o,t),$(i,o,"Stroke",D,t),$(i,o,"StrokeModifier",B,t),$(i,o,"EquipmentName",Y,t),$(i,o,"Boolean",Ce,t),$(i,o,"ConstantName",Q,t),nt(i,o,t);while(i.next());return t}var it=we(ot);const st=Re.deserialize({version:14,states:")xQYQPOOOnQPO'#CcOyQPO'#CaO!UQPO'#C_O!|QQO'#CjOOQO'#C{'#C{O#RQPO'#ClO#WQPO'#CpO#]QPO'#CqOOQO'#Cz'#CzOOQO'#Cs'#CsQYQPOOO#bQSO'#C{OOQO'#Ct'#CtO#gQPO,58}OOQO'#Cb'#CbO#uQPO,59TO#zQPO,58yOOQO,58{,58{OOQO'#Cd'#CdO$SQPO'#CeOOQO'#DQ'#DQOOQO'#Cu'#CuO$XQPO,58yO$XQPO,58yO$|QPO'#DQO%UQPO'#DQOOQO,59U,59UOOQO'#Cm'#CmO%ZQPO,59WO%fQWO'#D^O#WQPO,59[OOQO'#Cr'#CrO%kQPO,59]OOQO-E6q-E6qOOQO,59g,59gOOQO-E6r-E6rOOQO1G.i1G.iOOQO1G.o1G.oO&eQPO1G.eO&lQPO'#CaOOQO'#Cf'#CfOOQO'#Cv'#CvO&qQPO,59POOQO-E6s-E6sO%pQPO1G.eOOQO'#Ch'#ChOOQO'#DT'#DTO'iQPO'#CgO(aQPO'#DTOOQO,59l,59lO!PQPO'#CiOOQO'#Co'#CoOOQO'#D]'#D]OOQO1G.r1G.rO(fQPO,59xO(kQPO1G.vO$|QPO1G.wO)VQPO7+$PO)VQPO7+$POOQO-E6t-E6tO$|QPO,59ROOQO,59o,59oOOQO1G/d1G/dOOQO7+$b7+$bOOQO7+$c7+$cO)zQPO<<GkOOQO1G.m1G.m",stateData:"*z~OmOSPOS~OSQOrPO}[O!OUO!SVO!TWO~OSQOrPO}[O~OpaOq_O{`O~OqcOudOviOzjOSRXkRXrRX}RX!ORX!SRX!TRXsRX~O|kO~OqlO~O!RnO~OqpO~O_sO~OSQOrPOsuO}[O~OSvO~OSxOrPO~OqyO~OudOviOzjOSRakRarRa}Ra!ORa!SRa!TRasRa~OS!ROq!OO~OS!TO~OS!VOq!UO!RnO~Ob!XO~O!U!ZO~OudOviOzjOSRikRirRi}Ri!ORi!SRi!TRisRi~OqcO~P%pOq_O~OqyOSXakXarXauXavXazXa}Xa!OXa!SXa!TXasXa~Oy!_OSZXkZXrZXuZXvZXzZX}ZX!OZX!SZX!TZXsZX~Ox!`O~O!R!aO~O!RnOSdikdirdi}di!Odi!Sdi!Tdi~OudOviOzjOSRqkRqrRq}Rq!ORq!SRq!TRqsRq~OudOviOzjOSRykRyrRy}Ry!ORy!SRy!TRysRy~Obmz!S!O!TP_pq~",goto:"%b!RPPP!SP!Y!c!Y!g!m!w!{#R#W!SP#a#eP#h#a#a#k#n#t#z$^PPP$d$hPPPP$pPP$zPPPPPPP%R%UXTOPZ^WROPZ^RwaTbQxQhRR!]waeRghw}![!]!dTzd{Q!SiR!c!ZV!Pi!Z!_WSOPZ^R!SjTXOZRmUR!VmRqWQZORrZQ^PRt^QgRW|g}![!dQ}hQ![wR!d!]Q{dR!^{TYOZSXOZT]P^afRghw}![!]!dS!Qi!ZR!e!_R!WmQoVQ!VmQ!YoR!b!Y",nodeNames:"⚠ Comment SwimProgramme SwimInstruction Number SingleInstruction Stroke BlockInstruction StrokeModifier EquipmentSpecification EquipmentName Pace PaceAlias Duration RestInstruction Message ConstantDefinition ConstantName StringContent Boolean AuthorDefinition PaceDefinition PaceDefinitionName",maxTerm:52,skippedNodes:[0,1],repeatNodeCount:4,tokenData:"!!f~R!]OX$zXY(uYZ*yZ^(u^p$zpq(uqr$zrs,rst-Vtu$zuv/qv{$z{|0g|}$z}!O1]!O!Q$z!Q![2{![!]3w!]!_$z!_!`4m!`!a5c!a!b$z!b!c6X!c!}6}!}#O$z#O#P'l#P#T$z#T#U8P#U#c6}#c#d>}#d#eAZ#e#f6}#f#gEt#g#hJb#h#l6}#l#mMv#m#o6}#o#pNz#p#q$z#q#r! p#r#y$z#y#z(u#z$f$z$f$g(u$g#BY$z#BY#BZ(u#BZ$IS$z$IS$I_(u$I_$I|$z$I|$JO(u$JO$JT$z$JT$JU(u$JU$KV$z$KV$KW(u$KW&FU$z&FU&FV(u&FV;'S$z;'S;=`(o<%lO$z[%RXbW_SOY$zYZ%nZr$zrs'Ts#O$z#O#P'l#P;'S$z;'S;=`(o<%lO$zW%sUbWOr%ns#O%n#O#P&V#P;'S%n;'S;=`&}<%lO%nW&YRO;'S%n;'S;=`&c;=`O%nW&hVbWOr%ns#O%n#O#P&V#P;'S%n;'S;=`&};=`<%l%n<%lO%nW'QP;=`<%l%nS'YS_SOY'TZ;'S'T;'S;=`'f<%lO'TS'iP;=`<%l'T['qU_SOY$zYZ%nZ;'S$z;'S;=`(T;=`<%l%n<%lO$z[(YVbWOr%ns#O%n#O#P&V#P;'S%n;'S;=`&};=`<%l$z<%lO%n[(rP;=`<%l$z~)OmbWm~_SOX$zXY(uYZ*yZ^(u^p$zpq(uqr$zrs'Ts#O$z#O#P'l#P#y$z#y#z(u#z$f$z$f$g(u$g#BY$z#BY#BZ(u#BZ$IS$z$IS$I_(u$I_$I|$z$I|$JO(u$JO$JT$z$JT$JU(u$JU$KV$z$KV$KW(u$KW&FU$z&FU&FV(u&FV;'S$z;'S;=`(o<%lO$z~+QjbWm~OX%nX^*y^p%npq*yqr%ns#O%n#O#P&V#P#y%n#y#z*y#z$f%n$f$g*y$g#BY%n#BY#BZ*y#BZ$IS%n$IS$I_*y$I_$I|%n$I|$JO*y$JO$JT%n$JT$JU*y$JU$KV%n$KV$KW*y$KW&FU%n&FU&FV*y&FV;'S%n;'S;=`&}<%lO%nT,yS!RP_SOY'TZ;'S'T;'S;=`'f<%lO'T~-`XbWP~_SOY-VYZ%nZr-Vrs-{s#O-V#O#P.f#P;'S-V;'S;=`/k<%lO-V~.SSP~_SOY-{Z;'S-{;'S;=`.`<%lO-{~.cP;=`<%l-{~.mUP~_SOY-VYZ%nZ;'S-V;'S;=`/P;=`<%l%n<%lO-V~/UVbWOr%ns#O%n#O#P&V#P;'S%n;'S;=`&};=`<%l-V<%lO%n~/nP;=`<%l-V]/zXxPbW_SOY$zYZ%nZr$zrs'Ts#O$z#O#P'l#P;'S$z;'S;=`(o<%lO$z]0pXuPbW_SOY$zYZ%nZr$zrs'Ts#O$z#O#P'l#P;'S$z;'S;=`(o<%lO$z]1dZbW_SOY$zYZ%nZr$zrs'Ts!`$z!`!a2V!a#O$z#O#P'l#P;'S$z;'S;=`(o<%lO$z]2`XyPbW_SOY$zYZ%nZr$zrs'Ts#O$z#O#P'l#P;'S$z;'S;=`(o<%lO$z]3UZSPbW_SOY$zYZ%nZr$zrs'Ts!Q$z!Q![2{![#O$z#O#P'l#P;'S$z;'S;=`(o<%lO$z]4QX{PbW_SOY$zYZ%nZr$zrs'Ts#O$z#O#P'l#P;'S$z;'S;=`(o<%lO$z]4vX!UPbW_SOY$zYZ%nZr$zrs'Ts#O$z#O#P'l#P;'S$z;'S;=`(o<%lO$z]5lX}PbW_SOY$zYZ%nZr$zrs'Ts#O$z#O#P'l#P;'S$z;'S;=`(o<%lO$z]6bXvPbW_SOY$zYZ%nZr$zrs'Ts#O$z#O#P'l#P;'S$z;'S;=`(o<%lO$z]7W]bW_SqPOY$zYZ%nZr$zrs'Ts!c$z!c!}6}!}#O$z#O#P'l#P#T$z#T#o6}#o;'S$z;'S;=`(o<%lO$z]8Y_bW_SqPOY$zYZ%nZr$zrs'Ts!c$z!c!}6}!}#O$z#O#P'l#P#T$z#T#i6}#i#j9X#j#o6}#o;'S$z;'S;=`(o<%lO$z]9b_bW_SqPOY$zYZ%nZr$zrs'Ts!c$z!c!}6}!}#O$z#O#P'l#P#T$z#T#h6}#h#i:a#i#o6}#o;'S$z;'S;=`(o<%lO$z]:j_bW_SqPOY$zYZ%nZr$zrs'Ts!c$z!c!}6}!}#O$z#O#P'l#P#T$z#T#[6}#[#];i#]#o6}#o;'S$z;'S;=`(o<%lO$z];r_bW_SqPOY$zYZ%nZr$zrs'Ts!c$z!c!}6}!}#O$z#O#P'l#P#T$z#T#c6}#c#d<q#d#o6}#o;'S$z;'S;=`(o<%lO$z]<z_bW_SqPOY$zYZ%nZr$zrs'Ts!c$z!c!}6}!}#O$z#O#P'l#P#T$z#T#f6}#f#g=y#g#o6}#o;'S$z;'S;=`(o<%lO$z]>U]bW!SP_SqPOY$zYZ%nZr$zrs'Ts!c$z!c!}6}!}#O$z#O#P'l#P#T$z#T#o6}#o;'S$z;'S;=`(o<%lO$z]?W_bW_SqPOY$zYZ%nZr$zrs'Ts!c$z!c!}6}!}#O$z#O#P'l#P#T$z#T#b6}#b#c@V#c#o6}#o;'S$z;'S;=`(o<%lO$z]@b]bWzP_SqPOY$zYZ%nZr$zrs'Ts!c$z!c!}6}!}#O$z#O#P'l#P#T$z#T#o6}#o;'S$z;'S;=`(o<%lO$z]Ad^bW_SqPOY$zYZ%nZr$zrs'Ts!c$z!c!}6}!}#O$z#O#P'l#P#T$z#T#UB`#U#o6}#o;'S$z;'S;=`(o<%lO$z]Bi_bW_SqPOY$zYZ%nZr$zrs'Ts!c$z!c!}6}!}#O$z#O#P'l#P#T$z#T#V6}#V#WCh#W#o6}#o;'S$z;'S;=`(o<%lO$z]Cq_bW_SqPOY$zYZ%nZr$zrs'Ts!c$z!c!}6}!}#O$z#O#P'l#P#T$z#T#X6}#X#YDp#Y#o6}#o;'S$z;'S;=`(o<%lO$z]D{]bW!TP_SqPOY$zYZ%nZr$zrs'Ts!c$z!c!}6}!}#O$z#O#P'l#P#T$z#T#o6}#o;'S$z;'S;=`(o<%lO$z_E}_bW_SqPOY$zYZ%nZr$zrs'Ts!c$z!c!}6}!}#O$z#O#P'l#P#T$z#T#X6}#X#YF|#Y#o6}#o;'S$z;'S;=`(o<%lO$z_GV_bW_SqPOY$zYZ%nZr$zrs'Ts!c$z!c!}6}!}#O$z#O#P'l#P#T$z#T#g6}#g#hHU#h#o6}#o;'S$z;'S;=`(o<%lO$z_H__bW_SqPOY$zYZ%nZr$zrs'Ts!c$z!c!}6}!}#O$z#O#P'l#P#T$z#T#h6}#h#iI^#i#o6}#o;'S$z;'S;=`(o<%lO$z_Ii]|QbW_SqPOY$zYZ%nZr$zrs'Ts!c$z!c!}6}!}#O$z#O#P'l#P#T$z#T#o6}#o;'S$z;'S;=`(o<%lO$z]Jk_bW_SqPOY$zYZ%nZr$zrs'Ts!c$z!c!}6}!}#O$z#O#P'l#P#T$z#T#X6}#X#YKj#Y#o6}#o;'S$z;'S;=`(o<%lO$z]Ks_bW_SqPOY$zYZ%nZr$zrs'Ts!c$z!c!}6}!}#O$z#O#P'l#P#T$z#T#h6}#h#iLr#i#o6}#o;'S$z;'S;=`(o<%lO$z]L}]bW!OP_SqPOY$zYZ%nZr$zrs'Ts!c$z!c!}6}!}#O$z#O#P'l#P#T$z#T#o6}#o;'S$z;'S;=`(o<%lO$z]NR]bW_SpPqPOY$zYZ%nZr$zrs'Ts!c$z!c!}6}!}#O$z#O#P'l#P#T$z#T#o6}#o;'S$z;'S;=`(o<%lO$z]! TXrPbW_SOY$zYZ%nZr$zrs'Ts#O$z#O#P'l#P;'S$z;'S;=`(o<%lO$z]! yXsPbW_SOY$zYZ%nZr$zrs'Ts#O$z#O#P'l#P;'S$z;'S;=`(o<%lO$z",tokenizers:[0,1,2,3],topRules:{SwimProgramme:[0,2]},tokenPrec:445});function W(e,t){e.firstChild();const n={isAlias:e.name==="PaceAlias",value:t.sliceDoc(e.from,e.to)};let o;return e.nextSibling()&&(o={isAlias:e.name==="PaceAlias",value:t.sliceDoc(e.from,e.to)}),e.parent(),{modifier:1,startIntensity:n,stopIntensity:o}}function rt(e,t){e.firstChild();const n=t.sliceDoc(e.from,e.to);e.nextSibling();const o=W(e,t);return e.parent(),{statement:3,name:n,pace:o}}function at(e,t){return e.name==="SwimInstruction"?L(e,t):e.name==="RestInstruction"?X(e,t):j(e,t)}function F(e,t){e.firstChild();const n=t.sliceDoc(e.from,e.to);e.nextSibling();const o=t.sliceDoc(e.from,e.to);return e.parent(),{minutes:n,seconds:o}}function lt(e){switch(e){case"Board":return"board";case"Pads":return"pads";case"PullBuoy":return"pullBuoy";case"Fins":return"fins";case"Snorkel":return"snorkel";case"Chute":return"chute";case"StretchCord":return"stretchCord";default:return""}}function ct(e,t){if(e.name==="EquipmentSpecification"){const n=[];e.firstChild();do{const o=t.sliceDoc(e.from,e.to);n.push(lt(o))}while(e.nextSibling());return e.parent(),{modifier:0,equipment:n}}return e.name==="Pace"?W(e,t):{modifier:2,...F(e,t)}}function ut(e){switch(e){case"Freestyle":case"Free":case"Fr":return"freestyle";case"Backstroke":case"Back":case"Bk":return"backstroke";case"Breaststroke":case"Breast":case"Br":return"breaststroke";case"Butterfly":case"Fly":case"Fl":return"butterfly";case"IndividualMedley":case"Medley":case"Im":return"individualMedley";case"ReverseIndividualMedley":case"ReverseMedley":case"ReverseIm":return"reverseIndividualMedley";case"IndividualMedleyOverlap":case"MedleyOverlap":case"ImOverlap":return"individualMedleyOverlap";case"IndividualMedleyOrder":case"MedleyOrder":case"ImOrder":return"individualMedleyOrder";case"ReverseIndividualMedleyOrder":case"ReverseMedleyOrder":case"ReverseImOrder":return"reverseIndividualMedleyOrder";case"NumberOne":return"nr1";case"NumberTwo":return"nr2";case"NumberThree":return"nr3";case"NumberFour":return"nr4";case"NotFreestyle":case"NotFree":case"NotFr":return"notFreestyle";case"NotBackstroke":case"NotBack":case"NotBk":return"notBackstroke";case"NotBreastroke":case"NotBreast":case"NotBr":return"notBreastroke";case"NotButterfly":case"NotFly":case"NotFl":return"notButterfly";case"Choice":default:return"any"}}function L(e,t){let n=1,o="default",i;const s=[];if(e.firstChild(),e.name==="Number"&&(n=Number(t.sliceDoc(e.from,e.to)),e.nextSibling()),e.name==="BlockInstruction"){e.firstChild();const a=[];do a.push(at(e,t));while(e.nextSibling());i={isBlock:!0,instructions:a}}else{e.firstChild();const a=t.sliceDoc(e.from,e.to);e.nextSibling();const l=ut(t.sliceDoc(e.from,e.to));i={isBlock:!1,distance:a,stroke:l}}if(e.parent(),e.nextSibling()){let a=!0;if(e.name==="StrokeModifier"&&(o=t.sliceDoc(e.from,e.to),a=e.nextSibling()),a)do s.push(ct(e,t));while(e.nextSibling())}return e.parent(),{statement:0,repetitions:n,instruction:i,strokeModifier:o,instructionModifiers:s}}function X(e,t){e.firstChild();const n=F(e,t);return e.parent(),{statement:1,...n}}function j(e,t){return{statement:2,message:t.sliceDoc(e.from,e.to)}}function mt(e,t){e.firstChild();const n=t.sliceDoc(e.from,e.to);e.nextSibling();const o=t.sliceDoc(e.from,e.to);return e.parent(),{statement:4,constantName:n,value:o}}function dt(e,t){e.firstChild();const n=t.sliceDoc(e.from,e.to);e.nextSibling();const o=t.sliceDoc(e.from,e.to);let i;return e.nextSibling()&&(i=t.sliceDoc(e.from,e.to)),e.parent(),{statement:5,firstName:n,lastName:o,emailAddress:i}}function Ot(e,t){const n=[];function o(){do{let i=null;switch(e.type.name){case"SwimInstruction":i=L(e,t);break;case"RestInstruction":i=X(e,t);break;case"Message":i=j(e,t);break;case"PaceDefinition":i=rt(e,t);break;case"ConstantDefinition":i=mt(e,t);break;case"AuthorDefinition":i=dt(e,t);break}i!==null&&n.push(i)}while(e.nextSibling())}return e.firstChild(),o(),{statements:n}}const ft="https://github.com/bartneck/swiML",pt="http://www.w3.org/2001/XMLSchema-instance",ht="https://github.com/bartneck/swiML https://raw.githubusercontent.com/bartneck/swiML/main/version/latest/swiML.xsd";function E(e,t){let n="PT";return Number(e)>0&&(n+=e,n+="M"),Number(t)>0&&(n+=t,n+="S"),n}function $t(e,t){switch(t.statement){case 0:A(e,t);break;case 1:V(e,t);break;case 2:U(e,t);break}}function I(e,t){t.isAlias?e.ele("zone").txt(t.value):e.ele("percentageEffort").txt(t.value)}function St(e,t){switch(t.modifier){case 1:{const n=e.ele("intensity");I(n.ele("startIntensity"),t.startIntensity),t.stopIntensity&&I(n.ele("stopIntensity"),t.stopIntensity);break}case 0:for(const n of t.equipment)e.ele("equipment").txt(n);break;case 2:e.ele("rest").ele("sinceStart").txt(E(t.minutes,t.seconds));break}}function A(e,t){let n=e.ele("instruction");if(t.repetitions>1&&(n=n.ele("repetition"),n.ele("repetitionCount").txt(String(t.repetitions)).up()),t.instruction.isBlock)for(const o of t.instruction.instructions)$t(n,o);else n.ele("length").ele("lengthAsDistance").txt(t.instruction.distance),n.ele("stroke").ele("standardStroke").txt(t.instruction.stroke);if(t.instructionModifiers.length>0)for(const o of t.instructionModifiers)St(n,o)}function V(e,t){e.ele("instruction").ele("rest").ele("afterStop").txt(E(t.minutes,t.seconds))}function U(e,t){e.ele("instruction").ele("segmentName").txt(t.message)}function zt(e,t){switch(t.constantName){case"Title":e.ele("title").txt(t.value);break;case"Description":e.ele("programDescription").txt(t.value);break;case"Date":e.ele("creationDate").txt(t.value);break;case"PoolLength":e.ele("poolLength").txt(t.value);break;case"LengthUnit":e.ele("lengthUnit").txt(t.value);break;case"Align":e.ele("programAlign").txt(t.value.toLowerCase());break;case"NumeralSystem":e.ele("numeralSystem").txt(t.value);break;case"HideIntro":e.ele("hideIntro").txt(t.value.toLowerCase());break;case"LayoutWidth":e.ele("layoutWidth").txt(t.value);break}}function yt(e,t){const n=e.ele("author");n.ele("firstName").txt(t.firstName),n.ele("lastName").txt(t.lastName),t.emailAddress&&n.ele("email").txt(t.emailAddress)}function Pt(e){const t=Ze.create({version:"1.0",encoding:"UTF-8"}).ele("program",{xmlns:ft,"xmlns:xsi":pt,"xsi:schemaLocation":ht});for(const n of e.statements)switch(n.statement){case 0:A(t,n);break;case 1:V(t,n);break;case 2:U(t,n);break;case 3:break;case 4:zt(t,n);break;case 5:yt(t,n);break}return t.end({prettyPrint:!0})}function gt(e){return ze.fromClass(class{constructor(t){this.view=t,this.run(this.view)}update(t){!t.docChanged||ye(t.state)!==0||this.run(t.view)}run(t){const n=z(t.state).cursor(),o=Ot(n,t.state),i=Pt(o);e(i)}})}const bt=st.configure({props:[ke.add({Application:xe({closing:")",align:!1})}),Te.add({Application:ve}),Ne({Stroke:u.className,StrokeModifier:u.typeName,Duration:u.integer,Percentage:u.integer,Number:u.integer,Identifier:u.variableName,EquipmentName:u.macroName,Comment:u.comment,SetKeyword:u.keyword,RestKeyword:u.keyword,PaceKeyword:u.keyword,OnKeyword:u.keyword})]}),wt=ge.define({name:"swimdsl",parser:bt,languageData:{commentTokens:{line:"#"},autocomplete:Me,closeBrackets:["{"]}});function K(){return new Pe(wt,[M.extension,it])}function kt(e){const t=document.createElement("input");t.type="file",t.accept=".txt",t.onchange=n=>{const o=n.target;if(!o.files||o.files.length<=0){console.warn("No files were selected");return}const i=o.files[0],s=new FileReader;s.onload=a=>{var d;const l=(d=a.target)==null?void 0:d.result;typeof l=="string"&&e(l)},s.readAsText(i)},t.click()}function k(e,t){const n=URL.createObjectURL(e),o=document.createElement("a");o.href=n,o.download=t,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(n)}function Tt(e){const t=new Blob([e],{type:"text/plain;charset=utf-8"});k(t,"SwimProgramme.txt")}function xt(e){const t=new Blob([e],{type:"application/xml"});k(t,"SwimProgramme.xml")}function vt(e){const t=new Blob([e],{type:"text/html"});k(t,"SwimProgramme.html")}function It(e){e.contentWindow!==null&&e.contentWindow.print()}function Rt({swimdslProgramme:e,setSwimdslProgramme:t,swimlXml:n,htmlString:o,renderNode:i,children:s}){const[a,l]=c.useState(null),d=!!a;function p(m){l(m.currentTarget)}function O(){l(null)}function y(){var m;(m=window.open("./","_blank"))==null||m.focus()}const P=[{text:"New Programme",icon:r.jsx(ae,{fontSize:"small"}),onclick:y},{text:"Open",icon:r.jsx(le,{fontSize:"small"}),onclick:()=>{kt(t)}},{text:"Save As",icon:r.jsx(ce,{fontSize:"small"}),onclick:()=>{Tt(e)}},{text:"Export swiML XML",icon:r.jsx(b,{fontSize:"small"}),onclick:()=>{xt(n)}},{text:"Export HTML",icon:r.jsx(b,{fontSize:"small"}),onclick:()=>{vt(o)}},{text:"Export as PDF",icon:r.jsx(ue,{fontSize:"small"}),onclick:()=>{i.current!==null&&It(i.current)}}];return r.jsx(ee,{sx:{zIndex:m=>m.zIndex.drawer+1},position:"static",children:r.jsxs(te,{children:[r.jsx(N,{sx:{paddingX:"1em"},children:r.jsx(ne,{variant:"h6",component:"div",children:"SwimDSL"})}),r.jsx(Z,{id:"basic-button",onClick:p,color:"inherit",children:"File"}),r.jsx(oe,{open:d,anchorEl:a,onClose:O,children:P.map(({text:m,icon:g,onclick:h},J)=>r.jsxs(ie,{onClick:h,children:[r.jsx(se,{children:g}),r.jsx(re,{children:m})]},J))}),r.jsx(S,{sx:{ml:"auto"},children:s})]})})}const Nt='<?xml version="1.0" encoding="UTF-8"?><program xmlns="https://github.com/bartneck/swiML"/>';async function Zt(e){return(await SaxonJS.transform({stylesheetText:e,sourceText:Nt},"async")).stylesheetInternal}async function Ct(e,t){return(await SaxonJS.transform({stylesheetInternal:t,sourceText:e,destination:"serialized"},"async")).principalResult}function Dt({xmlString:e,htmlString:t,setHtmlString:n,nodeRef:o}){const[i,s]=c.useState({});return c.useEffect(()=>{fetch("./swiML.sef.json").then(a=>a.text()).then(Zt).then(s).catch(console.error)},[]),c.useEffect(()=>{Object.keys(i).length!==0&&Ct(e,i).then(a=>a.replace("https://bartneck.github.io/swiML/swiML.css","./swiML.css")).then(n).catch(console.error)},[i,e,n]),r.jsx("iframe",{ref:o,width:"100%",height:"100%",style:{border:"none"},srcDoc:t})}var f=(e=>(e[e.TUTORIAL=0]="TUTORIAL",e[e.RENDER=1]="RENDER",e[e.SWIML_XML=2]="SWIML_XML",e))(f||{});const Bt=[{page:null,icon:r.jsx(me,{}),label:"Hide panel"},{page:f.RENDER,icon:r.jsx(de,{}),label:"Show render"},{page:f.TUTORIAL,icon:r.jsx(Oe,{}),label:"Show tutorial"},{page:f.SWIML_XML,icon:r.jsx(b,{}),label:"Show swiML XML"}];function Yt({setPanelPage:e,activePanelPage:t}){return r.jsx(N,{children:Bt.map(({icon:n,page:o,label:i},s)=>r.jsx(fe,{title:i,children:r.jsx("span",{children:r.jsx(Z,{onClick:()=>{e(o)},disabled:t===o,color:"inherit",children:n})})},s))})}function Qt({xmlContent:e}){const t=C();return r.jsx(w,{readOnly:!0,value:e,height:`calc(100vh - ${t.mixins.toolbar.minHeight}px)`,width:"100%",theme:t.palette.mode,extensions:[Ie()]})}const Mt=`### Welcome ###################################################################

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

# There are multiple ways to specify rest in swimDSL. Currently, these are rest
# since the start of the instruction, and rest after the end of the instruction.
# These are both written as durations, in minutes and seconds, for example, 1:00
# specifies one minute.

# Rest since start indicates that the instruction should be completed in less
# time than the duration specified, and any remaining time is rest time. To
# specify rest since start, use the on keyword.
2 x 125 Breaststroke on 2:30
4 x 25 Freestyle on 0:25

# In the above example, the swimmer should not start the second 125 breaststroke
# until two and a half minutes have passed since they started the first 125.
# Similarly, they should not start their next 25 Freestyle until twenty five
# seconds since they started their previous length.

# To specify a fixed duration of rest (rest after finish), use the rest keyword
1:00 rest
0:30 rest


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
`;function _t(){const[e,t]=c.useState(Mt),n=C();return r.jsx(w,{value:e,height:`calc(100vh - ${n.mixins.toolbar.minHeight}px)`,width:"100%",theme:n.palette.mode,extensions:[K()],onChange:o=>{t(o)}})}function qt(){const[e,t]=c.useState(""),n=pe("(prefers-color-scheme: dark)"),[o,i]=c.useState(f.RENDER),[s,a]=c.useState(""),[l,d]=c.useState(""),p=c.useRef(null),O=c.useMemo(()=>gt(a),[]),y=c.useMemo(()=>K(),[]),P=c.useMemo(()=>he({palette:{mode:n?"dark":"light"}}),[n]),m=c.useCallback(h=>{t(h)},[]);function g(h){switch(h){case f.TUTORIAL:return r.jsx(_t,{});case f.RENDER:return r.jsx(Dt,{xmlString:s,htmlString:l,setHtmlString:d,nodeRef:p});case f.SWIML_XML:return r.jsx(Qt,{xmlContent:s})}}return r.jsxs($e,{theme:P,children:[r.jsx(Se,{}),r.jsxs(S,{sx:{display:"flex",flexDirection:"column",height:"100vh"},children:[r.jsx(Rt,{swimdslProgramme:e,setSwimdslProgramme:t,swimlXml:s,htmlString:l,renderNode:p,children:r.jsx(Yt,{activePanelPage:o,setPanelPage:i})}),r.jsxs(S,{sx:{display:"flex",flex:1,overflow:"hidden"},children:[r.jsx(S,{sx:{width:o!==null?"50%":"100%"},borderRight:"1px solid",children:r.jsx(w,{value:e,style:{height:"100%"},width:"100%",height:"100%",theme:n?"dark":"light",extensions:[y,O],onChange:m})}),o!==null&&r.jsx(S,{sx:{width:"50%",overflow:"auto"},children:g(o)})]})]})]})}const R=document.getElementById("root");R!==null?H.createRoot(R).render(r.jsx(G.StrictMode,{children:r.jsx(qt,{})})):console.error("Root element does not exist!");
