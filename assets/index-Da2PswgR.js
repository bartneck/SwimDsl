import{b as c,j as r,r as G}from"./react-CMFr3qCg.js";import{c as H}from"./react-dom-DX5UQ9U7.js";import{A as ee,T as te,P as I,a as ne,B as N,M as se,b as oe,L as ie,c as re,d as S,e as ae,U as le,S as ce,C as W,f as ue,V as Oe,I as de,H as me,g as Te,u as C,h as fe,i as pe,j as he,k as Se}from"./@mui-CmKafNEk.js";import{R as x}from"./@uiw-PGa3NKDv.js";import{V as Pe,G as we,H as P,L as ye,I as ge,J as We,K as xe,M as be,N as ke,O as ve,P as Ye,Q as Ze}from"./@codemirror-HnVgEYRi.js";import{L as Re,s as Ie,a as u}from"./@lezer-CRier5-m.js";import{d as k}from"./fastest-levenshtein-ChoUA_u9.js";import{x as Ne}from"./xmlbuilder2-DPvUJURa.js";import"./hoist-non-react-statics-VTAvmUN5.js";import"./scheduler-Bb8JjhAW.js";import"./@emotion-D3xeAZ7B.js";import"./@babel-BtohYyOd.js";import"./stylis-DDa9OTMq.js";import"./clsx-B-dksMZM.js";import"./react-transition-group-D_SqvwCt.js";import"./react-is-BPJnJB5S.js";import"./@popperjs-CMBiYTiD.js";import"./crelt-C8TCjufn.js";import"./@marijn-DXwl3gUT.js";import"./style-mod-Bs6eFhZE.js";import"./w3c-keyname-Vcq4gwWv.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function n(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(o){if(o.ep)return;o.ep=!0;const i=n(o);fetch(o.href,i)}})();const B=["Freestyle","Free","Fr","Backstroke","Back","Bk","Breaststroke","Breast","Br","Butterfly","Fly","Fl","Choice","IndividualMedley","Medley","Im","ReverseIndividualMedley","ReverseMedley","ReverseIm","IndividualMedleyOverlap","MedleyOverlap","ImOverlap","IndividualMedleyOrder","MedleyOrder","ImOrder","ReverseIndividualMedleyOrder","ReverseMedleyOrder","ReverseImOrder","NumberOne","NumberTwo","NumberThree","NumberFour","NotFreestyle","NotFree","NotFr","NotBackstroke","NotBack","NotBk","NotBreastroke","NotBreast","NotBr","NotButterfly","NotFly","NotFl"],D=["Pull","Kick","Drill"],X=["Board","Pads","PullBuoy","Fins","Snorkel","Chute","StretchCord"],Q=["Title","Description","Date","PoolLength","LengthUnit","Align","NumeralSystem","HideIntro","LayoutWidth"],Ce=["True","False"];function v(e){const t=new Set,n=P(e).cursor();do{if(n.name!=="PaceDefinition"||!n.firstChild())continue;const s=e.sliceDoc(n.from,n.to);t.add(s),n.parent()}while(n.next());return t}const M=We.define({create:v,update(e,t){return t.docChanged?v(t.state):e}}),Be=B.map(e=>({label:e,type:"constant",boost:e.length})),De=X.map(e=>({label:e,type:"constant"})),Xe=D.map(e=>({label:e,type:"constant"})),Qe=Q.map(e=>({label:e,type:"constant"})),Y={0:{priorNodeName:"Distance",nodeName:"Stroke",completions:Be},1:{priorNodeName:"EquipmentSpecification",nodeName:"EquipmentName",completions:De},2:{priorNodeName:"Pace",nodeName:"PaceAlias",completions:[]},3:{priorNodeName:"",nodeName:"StrokeModifier",completions:Xe},4:{priorNodeName:"",nodeName:"ConstantName",completions:Qe}};function Me(e){const t=P(e.state).resolveInner(e.pos,-1);Y[2].completions=Array.from(e.state.field(M)).map(n=>({label:n,type:"variable"}));for(const{priorNodeName:n,nodeName:s,completions:o}of Object.values(Y)){if(t.name===n)return{from:e.pos,options:o,validFor:/^[A-Za-z]/};if(t.name===s)return{from:t.from,to:t.to,options:o,validFor:/^[A-Za-z]/}}return null}function $(e,t){const[n,...s]=t;return s.reduce(([o,i],a)=>{const l=k(e,a);return l<i?[a,l]:[o,i]},[n,k(e,n)])}const F=2;function $e(e,t){const n=[];if(t.size>0){const[s,o]=$(e,Array.from(t));o<=F&&n.push({name:`Did you mean '${s}'?`,apply(i,a,l){i.dispatch({changes:{from:a,to:l,insert:s}})}})}return n.push({name:"Define pace name",apply(s){s.dispatch({changes:{from:0,to:0,insert:`pace ${e} = _%
`}})}}),n}function Fe(e){return[{name:"Remove duplicated definition",apply(t){t.dispatch({changes:{from:e.from,to:e.to}})}}]}function Le(e,t){const[n,s]=$(e,t);return s>F?[]:[{name:`Did you mean ${n}`,apply(o,i,a){o.dispatch({changes:{from:i,to:a,insert:n}})}}]}function _e(e,t,n){return{from:t.from,to:t.to,severity:"error",message:`A pace named '${e}' has already been defined`,actions:Fe(n)}}function je(e,t,n){return{from:e.from,to:e.to,severity:"error",actions:$e(t,n),message:`'${t}' is not a defined pace name.
If you wish to be able to use '${t}' in the place of a pace percentage, please define it with the following line:
Pace ${t} = _%`}}function Ee(e){return{from:e.from,to:e.to,severity:"error",message:"Syntax error"}}function qe(e,t){return{from:e,to:t,severity:"error",message:"Duplicate equipment specified. Please do not use the same equipment multiple times"}}function Ae(e,t,n,s){return{from:e,to:t,severity:"error",message:`'${n}' is not compatible with stroke type '${s}'`}}function Ue(e){return e.replace(/([a-z])([A-Z])/g,"$1 $2").toLowerCase()}function Ve(e,t,n,s){return{from:e.from,to:e.to,severity:"error",message:`${t} is not a valid ${Ue(n)}.`,actions:Le(t,s)}}function ze(e){return{from:e.from,to:e.to,severity:"error",message:"Number too large for duration"}}const Je=59;function Ke(e,t,n,s){if(e.name!=="PaceAlias")return;const o=n.sliceDoc(e.from,e.to);t.has(o)||s.push(je(e,o,t))}function Ge(e,t,n,s){if(e.name!=="PaceDefinitionName")return;const o=n.sliceDoc(e.from,e.to),i=e.node.parent;i!==null&&(t.has(o)?s.push(_e(o,e,i)):t.add(o))}function He(e,t){e.name==="⚠"&&t.push(Ee(e))}const et=new Map([["Default",new Set(["Board","PullBuoy"])],["Kick",new Set(["PullBuoy","Pads"])],["Pull",new Set(["Board","Fins"])]]);function tt(e,t,n){if(e.name!=="Instruction")return;const s=e.node.getChild("EquipmentSpecification");if(s===null)return;const o=e.node.getChild("StrokeType"),i=o!==null?t.sliceDoc(o.from,o.to):"Default",a=o!==null?o.from:s.from,l=s.getChildren("EquipmentName").map(m=>t.sliceDoc(m.from,m.to)),d=new Set(l);d.size!==l.length&&n.push(qe(a,s.to));const f=et.get(i);if(f!==void 0)for(const m of d)f.has(m)&&n.push(Ae(a,s.to,m,i))}function h(e,t,n,s,o){if(e.name!==n)return;const i=t.sliceDoc(e.from,e.to);s.includes(i)||o.push(Ve(e,i,n,s))}function nt(e,t,n){if(e.name!=="Duration")return;const s=e.node.getChildren("Number");for(const o of s)Number(t.sliceDoc(o.from,o.to))>Je&&n.push(ze(o))}function st(e){const t=[],n=new Set,s=e.state,o=P(s).cursor();do Ke(o,n,s,t),Ge(o,n,s,t),He(o,t),tt(o,s,t),h(o,s,"Stroke",B,t),h(o,s,"StrokeModifier",D,t),h(o,s,"EquipmentName",X,t),h(o,s,"Boolean",Ce,t),h(o,s,"ConstantName",Q,t),nt(o,s,t);while(o.next());return t}var ot=xe(st);const it=Re.deserialize({version:14,states:"*[QYQPOOOnQPO'#CcOyQPO'#CaO!jQPO'#C_O#WQQO'#ClOOQO'#C}'#C}O#]QPO'#CnO#bQPO'#CrO#gQPO'#CsOOQO'#C|'#C|OOQO'#Cu'#CuQYQPOOO#lQSO'#C}OOQO'#Cv'#CvO#qQPO,58}OOQO'#Cb'#CbO$PQPO,59TO$UQPO,58yOOQO,58{,58{OOQO'#Cd'#CdO$^QPO'#CeOOQO'#Cj'#CjO$cQPO'#CkOOQO'#DS'#DSOOQO'#Cw'#CwO$hQPO,58yO$hQPO,58yO%cQPO'#DSO%kQPO'#DSOOQO,59W,59WOOQO'#Co'#CoO%pQPO,59YO%{QWO'#DbO#bQPO,59^OOQO'#Ct'#CtO&QQPO,59_OOQO-E6s-E6sOOQO,59i,59iOOQO-E6t-E6tOOQO1G.i1G.iOOQO1G.o1G.oO&VQPO1G.eO&sQPO'#CaOOQO'#Cf'#CfOOQO'#Cx'#CxO&xQPO,59POOQO,59V,59VOOQO-E6u-E6uO'vQPO1G.eOOQO'#Ch'#ChOOQO'#DV'#DVO(dQPO'#CgO)bQPO'#DVOOQO,59n,59nO!PQPO'#CiOOQO'#Cq'#CqOOQO'#Da'#DaOOQO1G.t1G.tO)gQPO,59|O)lQPO1G.xO%cQPO1G.yO*WQPO7+$PO*WQPO7+$POOQO-E6v-E6vO%cQPO,59ROOQO,59q,59qOOQO1G/h1G/hOOQO7+$d7+$dOOQO7+$e7+$eO*tQPO<<GkOOQO1G.m1G.m",stateData:"+o~OoOSPOS~OSQOtPO!R[O!SUO!WVO!XWO~OSQOtPO!R[O~OraOs_O}`O~OscOwdOxkO|lO!OeO!PfO~OSRXmRXtRX!RRX!SRX!WRX!XRXuRX~P!UO!QmO~OsnO~O!VpO~OsrO~OauO~OSQOtPOuwO!R[O~OSxO~OSzOtPO~Os{O~OS!OO~OwdOxkO|lO!OeO!PfOSRamRatRa!RRa!SRa!WRa!XRauRa~OS!UOs!RO~OS!WO~OS!YOs!XO!VpO~Od![O~O!Y!^O~OSRimRitRi!RRi!SRi!WRi!XRiuRi~P!UOs_O~Os{OSXamXatXawXaxXa|Xa!OXa!PXa!RXa!SXa!WXa!XXauXa~OSRimRitRi!RRi!SRi!WRi!XRiuRi~P!XO{!bOSZXmZXtZXwZXxZX|ZX!OZX!PZX!RZX!SZX!WZX!XZXuZX~Oz!cO~O!V!dO~O!VpOSfimfitfi!Rfi!Sfi!Wfi!Xfi~OSRqmRqtRq!RRq!SRq!WRq!XRquRq~P!XOSRymRytRy!RRy!SRy!WRy!XRyuRy~P!XOd!P!Oo|!W!S!XPars~",goto:"%f!VPPP!WP!^!g!^!k!q!{#P#V#[!q!q!WP#e#iP#l#e#e#o#r#x$O$bPPP$h$lPPPP$tPP%OPPPPPPPPP%V%YXTOPZ^WROPZ^RyaTbQzQjRR!`yagRijy!Q!_!`!gT|d}Q!VkR!f!^V!Sk!^!bWSOPZ^R!VlTXOZRoUR!YoRsWQZORtZQ^PRv^QiRW!Pi!Q!_!gQ!QjQ!_yR!g!`Q}dR!a}TYOZSXOZT]P^ahRijy!Q!_!`!gS!Tk!^R!h!bR!ZoQqVQ!YoQ!]qR!e!]",nodeNames:"⚠ Comment SwimProgramme SwimInstruction Number SingleInstruction Stroke BlockInstruction StrokeModifier EquipmentSpecification EquipmentName Pace PaceAlias Duration Underwater Breathe RestInstruction Message ConstantDefinition ConstantName StringContent Boolean AuthorDefinition PaceDefinition PaceDefinitionName",maxTerm:56,skippedNodes:[0,1],repeatNodeCount:4,tokenData:"!6_~R!`OX%TXY)OYZ+SZ^)O^p%Tpq)Oqr%Trs,{st-`tu%Tuv/zv{%T{|0p|}%T}!O1f!O!Q%T!Q![3U![!]4Q!]!_%T!_!`4v!`!a5l!a!b%T!b!c6b!c!w7W!w!x8Y!x!}7W!}#O%T#O#P'u#P#T%T#T#UCu#U#VJs#V#c7W#c#d!$v#d#e!'S#e#f7W#f#g!+m#g#h!0Z#h#l7W#l#m!3o#m#o7W#o#p!4s#p#q%T#q#r!5i#r#y%T#y#z)O#z$f%T$f$g)O$g#BY%T#BY#BZ)O#BZ$IS%T$IS$I_)O$I_$I|%T$I|$JO)O$JO$JT%T$JT$JU)O$JU$KV%T$KV$KW)O$KW&FU%T&FU&FV)O&FV;'S%T;'S;=`(x<%lO%T[%[XdWaSOY%TYZ%wZr%Trs'^s#O%T#O#P'u#P;'S%T;'S;=`(x<%lO%TW%|UdWOr%ws#O%w#O#P&`#P;'S%w;'S;=`'W<%lO%wW&cRO;'S%w;'S;=`&l;=`O%wW&qVdWOr%ws#O%w#O#P&`#P;'S%w;'S;=`'W;=`<%l%w<%lO%wW'ZP;=`<%l%wS'cSaSOY'^Z;'S'^;'S;=`'o<%lO'^S'rP;=`<%l'^['zUaSOY%TYZ%wZ;'S%T;'S;=`(^;=`<%l%w<%lO%T[(cVdWOr%ws#O%w#O#P&`#P;'S%w;'S;=`'W;=`<%l%T<%lO%w[({P;=`<%l%T~)XmdWo~aSOX%TXY)OYZ+SZ^)O^p%Tpq)Oqr%Trs'^s#O%T#O#P'u#P#y%T#y#z)O#z$f%T$f$g)O$g#BY%T#BY#BZ)O#BZ$IS%T$IS$I_)O$I_$I|%T$I|$JO)O$JO$JT%T$JT$JU)O$JU$KV%T$KV$KW)O$KW&FU%T&FU&FV)O&FV;'S%T;'S;=`(x<%lO%T~+ZjdWo~OX%wX^+S^p%wpq+Sqr%ws#O%w#O#P&`#P#y%w#y#z+S#z$f%w$f$g+S$g#BY%w#BY#BZ+S#BZ$IS%w$IS$I_+S$I_$I|%w$I|$JO+S$JO$JT%w$JT$JU+S$JU$KV%w$KV$KW+S$KW&FU%w&FU&FV+S&FV;'S%w;'S;=`'W<%lO%wT-SS!VPaSOY'^Z;'S'^;'S;=`'o<%lO'^~-iXdWP~aSOY-`YZ%wZr-`rs.Us#O-`#O#P.o#P;'S-`;'S;=`/t<%lO-`~.]SP~aSOY.UZ;'S.U;'S;=`.i<%lO.U~.lP;=`<%l.U~.vUP~aSOY-`YZ%wZ;'S-`;'S;=`/Y;=`<%l%w<%lO-`~/_VdWOr%ws#O%w#O#P&`#P;'S%w;'S;=`'W;=`<%l-`<%lO%w~/wP;=`<%l-`]0TXzPdWaSOY%TYZ%wZr%Trs'^s#O%T#O#P'u#P;'S%T;'S;=`(x<%lO%T]0yXwPdWaSOY%TYZ%wZr%Trs'^s#O%T#O#P'u#P;'S%T;'S;=`(x<%lO%T]1mZdWaSOY%TYZ%wZr%Trs'^s!`%T!`!a2`!a#O%T#O#P'u#P;'S%T;'S;=`(x<%lO%T]2iX{PdWaSOY%TYZ%wZr%Trs'^s#O%T#O#P'u#P;'S%T;'S;=`(x<%lO%T]3_ZSPdWaSOY%TYZ%wZr%Trs'^s!Q%T!Q![3U![#O%T#O#P'u#P;'S%T;'S;=`(x<%lO%T]4ZX}PdWaSOY%TYZ%wZr%Trs'^s#O%T#O#P'u#P;'S%T;'S;=`(x<%lO%T]5PX!YPdWaSOY%TYZ%wZr%Trs'^s#O%T#O#P'u#P;'S%T;'S;=`(x<%lO%T]5uX!RPdWaSOY%TYZ%wZr%Trs'^s#O%T#O#P'u#P;'S%T;'S;=`(x<%lO%T]6kXxPdWaSOY%TYZ%wZr%Trs'^s#O%T#O#P'u#P;'S%T;'S;=`(x<%lO%T]7a]dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#o7W#o;'S%T;'S;=`(x<%lO%T]8c_dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#b7W#b#c9b#c#o7W#o;'S%T;'S;=`(x<%lO%T]9k_dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#W7W#W#X:j#X#o7W#o;'S%T;'S;=`(x<%lO%T]:s_dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#X7W#X#Y;r#Y#o7W#o;'S%T;'S;=`(x<%lO%T];{_dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#f7W#f#g<z#g#o7W#o;'S%T;'S;=`(x<%lO%T]=T_dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#k7W#k#l>S#l#o7W#o;'S%T;'S;=`(x<%lO%T]>]^dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#U?X#U#o7W#o;'S%T;'S;=`(x<%lO%T]?b_dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#h7W#h#i@a#i#o7W#o;'S%T;'S;=`(x<%lO%T]@j_dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#X7W#X#YAi#Y#o7W#o;'S%T;'S;=`(x<%lO%T]Ar_dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#f7W#f#gBq#g#o7W#o;'S%T;'S;=`(x<%lO%T]B|]dW!OPaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#o7W#o;'S%T;'S;=`(x<%lO%T]DO_dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#i7W#i#jD}#j#o7W#o;'S%T;'S;=`(x<%lO%T]EW_dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#h7W#h#iFV#i#o7W#o;'S%T;'S;=`(x<%lO%T]F`_dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#[7W#[#]G_#]#o7W#o;'S%T;'S;=`(x<%lO%T]Gh_dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#c7W#c#dHg#d#o7W#o;'S%T;'S;=`(x<%lO%T]Hp_dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#f7W#f#gIo#g#o7W#o;'S%T;'S;=`(x<%lO%T]Iz]dW!WPaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#o7W#o;'S%T;'S;=`(x<%lO%T]J|_dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#f7W#f#gK{#g#o7W#o;'S%T;'S;=`(x<%lO%T]LU_dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#X7W#X#YMT#Y#o7W#o;'S%T;'S;=`(x<%lO%T]M^^dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#UNY#U#o7W#o;'S%T;'S;=`(x<%lO%T]Nc_dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#h7W#h#i! b#i#o7W#o;'S%T;'S;=`(x<%lO%T]! k_dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#[7W#[#]!!j#]#o7W#o;'S%T;'S;=`(x<%lO%T]!!s_dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#X7W#X#Y!#r#Y#o7W#o;'S%T;'S;=`(x<%lO%T]!#}]dW!PPaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#o7W#o;'S%T;'S;=`(x<%lO%T]!%P_dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#b7W#b#c!&O#c#o7W#o;'S%T;'S;=`(x<%lO%T]!&Z]dW|PaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#o7W#o;'S%T;'S;=`(x<%lO%T]!']^dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#U!(X#U#o7W#o;'S%T;'S;=`(x<%lO%T]!(b_dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#V7W#V#W!)a#W#o7W#o;'S%T;'S;=`(x<%lO%T]!)j_dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#X7W#X#Y!*i#Y#o7W#o;'S%T;'S;=`(x<%lO%T]!*t]dW!XPaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#o7W#o;'S%T;'S;=`(x<%lO%T_!+v_dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#X7W#X#Y!,u#Y#o7W#o;'S%T;'S;=`(x<%lO%T_!-O_dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#g7W#g#h!-}#h#o7W#o;'S%T;'S;=`(x<%lO%T_!.W_dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#h7W#h#i!/V#i#o7W#o;'S%T;'S;=`(x<%lO%T_!/b]!QQdWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#o7W#o;'S%T;'S;=`(x<%lO%T]!0d_dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#X7W#X#Y!1c#Y#o7W#o;'S%T;'S;=`(x<%lO%T]!1l_dWaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#h7W#h#i!2k#i#o7W#o;'S%T;'S;=`(x<%lO%T]!2v]dW!SPaSsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#o7W#o;'S%T;'S;=`(x<%lO%T]!3z]dWaSrPsPOY%TYZ%wZr%Trs'^s!c%T!c!}7W!}#O%T#O#P'u#P#T%T#T#o7W#o;'S%T;'S;=`(x<%lO%T]!4|XtPdWaSOY%TYZ%wZr%Trs'^s#O%T#O#P'u#P;'S%T;'S;=`(x<%lO%T]!5rXuPdWaSOY%TYZ%wZr%Trs'^s#O%T#O#P'u#P;'S%T;'S;=`(x<%lO%T",tokenizers:[0,1,2,3],topRules:{SwimProgramme:[0,2]},tokenPrec:478});function L(e,t){e.firstChild();const n={isAlias:e.name==="PaceAlias",value:t.sliceDoc(e.from,e.to)};let s;return e.nextSibling()&&(s={isAlias:e.name==="PaceAlias",value:t.sliceDoc(e.from,e.to)}),e.parent(),{modifier:1,startIntensity:n,stopIntensity:s}}function rt(e,t){e.firstChild();const n=t.sliceDoc(e.from,e.to);e.nextSibling();const s=L(e,t);return e.parent(),{statement:3,name:n,pace:s}}function at(e,t){e.firstChild();const n=t.sliceDoc(e.from,e.to);return e.parent(),{modifier:3,breatheStrokes:n}}function lt(e,t){return e.name==="SwimInstruction"?j(e,t):e.name==="RestInstruction"?E(e,t):q(e,t)}function _(e,t){e.firstChild();const n=t.sliceDoc(e.from,e.to);e.nextSibling();const s=t.sliceDoc(e.from,e.to);return e.parent(),{minutes:n,seconds:s}}function ct(e){switch(e){case"Board":return"board";case"Pads":return"pads";case"PullBuoy":return"pullBuoy";case"Fins":return"fins";case"Snorkel":return"snorkel";case"Chute":return"chute";case"StretchCord":return"stretchCord";default:return""}}function ut(e,t){if(e.name==="EquipmentSpecification"){const n=[];e.firstChild();do{const s=t.sliceDoc(e.from,e.to);n.push(ct(s))}while(e.nextSibling());return e.parent(),{modifier:0,equipment:n}}return e.name==="Pace"?L(e,t):e.name==="Breathe"?at(e,t):e.name==="Underwater"?{modifier:4,isTrue:!0}:{modifier:2,..._(e,t)}}function Ot(e){switch(e){case"Freestyle":case"Free":case"Fr":return"freestyle";case"Backstroke":case"Back":case"Bk":return"backstroke";case"Breaststroke":case"Breast":case"Br":return"breaststroke";case"Butterfly":case"Fly":case"Fl":return"butterfly";case"IndividualMedley":case"Medley":case"Im":return"individualMedley";case"ReverseIndividualMedley":case"ReverseMedley":case"ReverseIm":return"reverseIndividualMedley";case"IndividualMedleyOverlap":case"MedleyOverlap":case"ImOverlap":return"individualMedleyOverlap";case"IndividualMedleyOrder":case"MedleyOrder":case"ImOrder":return"individualMedleyOrder";case"ReverseIndividualMedleyOrder":case"ReverseMedleyOrder":case"ReverseImOrder":return"reverseIndividualMedleyOrder";case"NumberOne":return"nr1";case"NumberTwo":return"nr2";case"NumberThree":return"nr3";case"NumberFour":return"nr4";case"NotFreestyle":case"NotFree":case"NotFr":return"notFreestyle";case"NotBackstroke":case"NotBack":case"NotBk":return"notBackstroke";case"NotBreastroke":case"NotBreast":case"NotBr":return"notBreastroke";case"NotButterfly":case"NotFly":case"NotFl":return"notButterfly";case"Choice":default:return"any"}}function j(e,t){let n=1,s="default",o;const i=[];if(e.firstChild(),e.name==="Number"&&(n=Number(t.sliceDoc(e.from,e.to)),e.nextSibling()),e.name==="BlockInstruction"){e.firstChild();const a=[];do a.push(lt(e,t));while(e.nextSibling());o={isBlock:!0,instructions:a}}else{e.firstChild();const a=t.sliceDoc(e.from,e.to);e.nextSibling();const l=Ot(t.sliceDoc(e.from,e.to));o={isBlock:!1,distance:a,stroke:l}}if(e.parent(),e.nextSibling()){let a=!0;if(e.name==="StrokeModifier"&&(s=t.sliceDoc(e.from,e.to),a=e.nextSibling()),a)do i.push(ut(e,t));while(e.nextSibling())}return e.parent(),{statement:0,repetitions:n,instruction:o,strokeModifier:s,instructionModifiers:i}}function E(e,t){e.firstChild();const n=_(e,t);return e.parent(),{statement:1,...n}}function q(e,t){return{statement:2,message:t.sliceDoc(e.from,e.to)}}function dt(e,t){e.firstChild();const n=t.sliceDoc(e.from,e.to);e.nextSibling();const s=t.sliceDoc(e.from,e.to);return e.parent(),{statement:4,constantName:n,value:s}}function mt(e,t){e.firstChild();const n=t.sliceDoc(e.from,e.to);e.nextSibling();const s=t.sliceDoc(e.from,e.to);let o;return e.nextSibling()&&(o=t.sliceDoc(e.from,e.to)),e.parent(),{statement:5,firstName:n,lastName:s,emailAddress:o}}function Tt(e,t){const n=[];function s(){do{let o=null;switch(e.type.name){case"SwimInstruction":o=j(e,t);break;case"RestInstruction":o=E(e,t);break;case"Message":o=q(e,t);break;case"PaceDefinition":o=rt(e,t);break;case"ConstantDefinition":o=dt(e,t);break;case"AuthorDefinition":o=mt(e,t);break}o!==null&&n.push(o)}while(e.nextSibling())}return e.firstChild(),s(),{statements:n}}const ft="https://github.com/bartneck/swiML",pt="http://www.w3.org/2001/XMLSchema-instance",ht="https://github.com/bartneck/swiML https://raw.githubusercontent.com/bartneck/swiML/main/version/latest/swiML.xsd";function A(e,t){let n="PT";return Number(e)>0&&(n+=e,n+="M"),Number(t)>0&&(n+=t,n+="S"),n}function St(e,t){switch(t.statement){case 0:U(e,t);break;case 1:V(e,t);break;case 2:z(e,t);break}}function Z(e,t){t.isAlias?e.ele("zone").txt(t.value):e.ele("percentageEffort").txt(t.value)}function Pt(e,t){switch(t.modifier){case 1:{const n=e.ele("intensity");Z(n.ele("startIntensity"),t.startIntensity),t.stopIntensity&&Z(n.ele("stopIntensity"),t.stopIntensity);break}case 0:for(const n of t.equipment)e.ele("equipment").txt(n);break;case 3:e.ele("breath").txt(t.breatheStrokes);break;case 2:e.ele("rest").ele("sinceStart").txt(A(t.minutes,t.seconds));break;case 4:e.ele("underwater").txt(t.isTrue.toString());break}}function U(e,t){let n=e.ele("instruction");if(t.repetitions>1&&(n=n.ele("repetition"),n.ele("repetitionCount").txt(String(t.repetitions)).up()),t.instruction.isBlock)for(const s of t.instruction.instructions)St(n,s);else n.ele("length").ele("lengthAsDistance").txt(t.instruction.distance),n.ele("stroke").ele("standardStroke").txt(t.instruction.stroke);if(t.instructionModifiers.length>0)for(const s of t.instructionModifiers)Pt(n,s)}function V(e,t){e.ele("instruction").ele("rest").ele("afterStop").txt(A(t.minutes,t.seconds))}function z(e,t){e.ele("instruction").ele("segmentName").txt(t.message)}function wt(e,t){switch(t.constantName){case"Title":e.ele("title").txt(t.value);break;case"Description":e.ele("programDescription").txt(t.value);break;case"Date":e.ele("creationDate").txt(t.value);break;case"PoolLength":e.ele("poolLength").txt(t.value);break;case"LengthUnit":e.ele("lengthUnit").txt(t.value);break;case"Align":e.ele("programAlign").txt(t.value.toLowerCase());break;case"NumeralSystem":e.ele("numeralSystem").txt(t.value);break;case"HideIntro":e.ele("hideIntro").txt(t.value.toLowerCase());break;case"LayoutWidth":e.ele("layoutWidth").txt(t.value);break}}function yt(e,t){const n=e.ele("author");n.ele("firstName").txt(t.firstName),n.ele("lastName").txt(t.lastName),t.emailAddress&&n.ele("email").txt(t.emailAddress)}function gt(e){const t=Ne.create({version:"1.0",encoding:"UTF-8"}).ele("program",{xmlns:ft,"xmlns:xsi":pt,"xsi:schemaLocation":ht});for(const n of e.statements)switch(n.statement){case 0:U(t,n);break;case 1:V(t,n);break;case 2:z(t,n);break;case 3:break;case 4:wt(t,n);break;case 5:yt(t,n);break}return t.end({prettyPrint:!0})}function Wt(e){return Pe.fromClass(class{constructor(t){this.view=t,this.run(this.view)}update(t){!t.docChanged||we(t.state)!==0||this.run(t.view)}run(t){const n=P(t.state).cursor(),s=Tt(n,t.state),o=gt(s);e(o)}})}const xt=it.configure({props:[be.add({Application:ve({closing:")",align:!1})}),ke.add({Application:Ye}),Ie({Stroke:u.className,StrokeModifier:u.typeName,Duration:u.integer,Percentage:u.integer,Number:u.integer,Identifier:u.variableName,EquipmentName:u.macroName,Comment:u.comment,SetKeyword:u.keyword,RestKeyword:u.keyword,PaceKeyword:u.keyword,OnKeyword:u.keyword})]}),bt=ge.define({name:"swimdsl",parser:xt,languageData:{commentTokens:{line:"#"},autocomplete:Me,closeBrackets:["{"]}});function J(){return new ye(bt,[M.extension,ot])}function kt(e){const t=document.createElement("input");t.type="file",t.accept=".txt",t.onchange=n=>{const s=n.target;if(!s.files||s.files.length<=0){console.warn("No files were selected");return}const o=s.files[0],i=new FileReader;i.onload=a=>{var d;const l=(d=a.target)==null?void 0:d.result;typeof l=="string"&&e(l)},i.readAsText(o)},t.click()}function b(e,t){const n=URL.createObjectURL(e),s=document.createElement("a");s.href=n,s.download=t,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(n)}function vt(e){const t=new Blob([e],{type:"text/plain;charset=utf-8"});b(t,"SwimProgramme.txt")}function Yt(e){const t=new Blob([e],{type:"application/xml"});b(t,"SwimProgramme.xml")}function Zt(e){const t=new Blob([e],{type:"text/html"});b(t,"SwimProgramme.html")}function Rt(e){e.contentWindow!==null&&e.contentWindow.print()}function It({swimdslProgramme:e,setSwimdslProgramme:t,swimlXml:n,htmlString:s,renderNode:o,children:i}){const[a,l]=c.useState(null),d=!!a;function f(O){l(O.currentTarget)}function m(){l(null)}function w(){var O;(O=window.open("./","_blank"))==null||O.focus()}const y=[{text:"New Programme",icon:r.jsx(ae,{fontSize:"small"}),onclick:w},{text:"Open",icon:r.jsx(le,{fontSize:"small"}),onclick:()=>{kt(t)}},{text:"Save As",icon:r.jsx(ce,{fontSize:"small"}),onclick:()=>{vt(e)}},{text:"Export swiML XML",icon:r.jsx(W,{fontSize:"small"}),onclick:()=>{Yt(n)}},{text:"Export HTML",icon:r.jsx(W,{fontSize:"small"}),onclick:()=>{Zt(s)}},{text:"Export as PDF",icon:r.jsx(ue,{fontSize:"small"}),onclick:()=>{o.current!==null&&Rt(o.current)}}];return r.jsx(ee,{sx:{zIndex:O=>O.zIndex.drawer+1},position:"static",children:r.jsxs(te,{children:[r.jsx(I,{sx:{paddingX:"1em"},children:r.jsx(ne,{variant:"h6",component:"div",children:"SwimDSL"})}),r.jsx(N,{id:"basic-button",onClick:f,color:"inherit",children:"File"}),r.jsx(se,{open:d,anchorEl:a,onClose:m,children:y.map(({text:O,icon:g,onclick:p},K)=>r.jsxs(oe,{onClick:p,children:[r.jsx(ie,{children:g}),r.jsx(re,{children:O})]},K))}),r.jsx(S,{sx:{ml:"auto"},children:i})]})})}const Nt='<?xml version="1.0" encoding="UTF-8"?><program xmlns="https://github.com/bartneck/swiML"/>';async function Ct(e){return(await SaxonJS.transform({stylesheetText:e,sourceText:Nt},"async")).stylesheetInternal}async function Bt(e,t){return(await SaxonJS.transform({stylesheetInternal:t,sourceText:e,destination:"serialized"},"async")).principalResult}function Dt({xmlString:e,htmlString:t,setHtmlString:n,nodeRef:s}){const[o,i]=c.useState({});return c.useEffect(()=>{fetch("./swiML.sef.json").then(a=>a.text()).then(Ct).then(i).catch(console.error)},[]),c.useEffect(()=>{Object.keys(o).length!==0&&Bt(e,o).then(a=>a.replace("https://bartneck.github.io/swiML/swiML.css","./swiML.css")).then(n).catch(console.error)},[o,e,n]),r.jsx("iframe",{ref:s,width:"100%",height:"100%",style:{border:"none"},srcDoc:t})}var T=(e=>(e[e.TUTORIAL=0]="TUTORIAL",e[e.RENDER=1]="RENDER",e[e.SWIML_XML=2]="SWIML_XML",e))(T||{});const Xt=[{page:null,icon:r.jsx(Oe,{}),label:"Hide panel"},{page:T.RENDER,icon:r.jsx(de,{}),label:"Show render"},{page:T.TUTORIAL,icon:r.jsx(me,{}),label:"Show tutorial"},{page:T.SWIML_XML,icon:r.jsx(W,{}),label:"Show swiML XML"}];function Qt({setPanelPage:e,activePanelPage:t}){return r.jsx(I,{children:Xt.map(({icon:n,page:s,label:o},i)=>r.jsx(Te,{title:o,children:r.jsx("span",{children:r.jsx(N,{onClick:()=>{e(s)},disabled:t===s,color:"inherit",children:n})})},i))})}function Mt({xmlContent:e}){const t=C();return r.jsx(x,{readOnly:!0,value:e,height:`calc(100vh - ${t.mixins.toolbar.minHeight}px)`,width:"100%",theme:t.palette.mode,extensions:[Ze()]})}const $t=`### Welcome ###################################################################

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
`;function Ft(){const[e,t]=c.useState($t),n=C();return r.jsx(x,{value:e,height:`calc(100vh - ${n.mixins.toolbar.minHeight}px)`,width:"100%",theme:n.palette.mode,extensions:[J()],onChange:s=>{t(s)}})}function Lt(){const[e,t]=c.useState(""),n=fe("(prefers-color-scheme: dark)"),[s,o]=c.useState(T.RENDER),[i,a]=c.useState(""),[l,d]=c.useState(""),f=c.useRef(null),m=c.useMemo(()=>Wt(a),[]),w=c.useMemo(()=>J(),[]),y=c.useMemo(()=>pe({palette:{mode:n?"dark":"light"}}),[n]),O=c.useCallback(p=>{t(p)},[]);function g(p){switch(p){case T.TUTORIAL:return r.jsx(Ft,{});case T.RENDER:return r.jsx(Dt,{xmlString:i,htmlString:l,setHtmlString:d,nodeRef:f});case T.SWIML_XML:return r.jsx(Mt,{xmlContent:i})}}return r.jsxs(he,{theme:y,children:[r.jsx(Se,{}),r.jsxs(S,{sx:{display:"flex",flexDirection:"column",height:"100vh"},children:[r.jsx(It,{swimdslProgramme:e,setSwimdslProgramme:t,swimlXml:i,htmlString:l,renderNode:f,children:r.jsx(Qt,{activePanelPage:s,setPanelPage:o})}),r.jsxs(S,{sx:{display:"flex",flex:1,overflow:"hidden"},children:[r.jsx(S,{sx:{width:s!==null?"50%":"100%"},borderRight:"1px solid",children:r.jsx(x,{value:e,style:{height:"100%"},width:"100%",height:"100%",theme:n?"dark":"light",extensions:[w,m],onChange:O})}),s!==null&&r.jsx(S,{sx:{width:"50%",overflow:"auto"},children:g(s)})]})]})]})}const R=document.getElementById("root");R!==null?H.createRoot(R).render(r.jsx(G.StrictMode,{children:r.jsx(Lt,{})})):console.error("Root element does not exist!");
