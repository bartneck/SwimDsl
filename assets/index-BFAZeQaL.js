import{b as c,j as r,r as J}from"./react-CMFr3qCg.js";import{c as G}from"./react-dom-DX5UQ9U7.js";import{A as H,T as ee,P as R,a as te,B as T,M as ne,b as ie,L as oe,c as se,d as w,e as re,U as ae,S as le,C as g,f as ce,V as ue,I as me,H as de,g as Oe,u as B,h as fe,i as pe,j as he,k as we}from"./@mui-CmKafNEk.js";import{R as b}from"./@uiw-PGa3NKDv.js";import{V as Se,G as $e,H as S,L as ye,I as ke,J as Pe,K as ge,M as be,N as xe,O as ve,P as Ie,Q as Qe}from"./@codemirror-HnVgEYRi.js";import{L as Ne,s as Re,a as u}from"./@lezer-CRier5-m.js";import{d as Te}from"./fastest-levenshtein-ChoUA_u9.js";import{x as Be}from"./xmlbuilder2-DPvUJURa.js";import"./hoist-non-react-statics-VTAvmUN5.js";import"./scheduler-Bb8JjhAW.js";import"./@emotion-D3xeAZ7B.js";import"./@babel-BtohYyOd.js";import"./stylis-DDa9OTMq.js";import"./clsx-B-dksMZM.js";import"./react-transition-group-D_SqvwCt.js";import"./react-is-BPJnJB5S.js";import"./@popperjs-CMBiYTiD.js";import"./crelt-C8TCjufn.js";import"./@marijn-DXwl3gUT.js";import"./style-mod-Bs6eFhZE.js";import"./w3c-keyname-Vcq4gwWv.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();const C=["Freestyle","Free","Fr","Backstroke","Back","Bk","Breaststroke","Breast","Br","Butterfly","Fly","Fl","Choice","IndividualMedley","Medley","Im","ReverseIndividualMedley","ReverseMedley","ReverseIm","IndividualMedleyOverlap","MedleyOverlap","ImOverlap","IndividualMedleyOrder","MedleyOrder","ImOrder","ReverseIndividualMedleyOrder","ReverseMedleyOrder","ReverseImOrder","NumberOne","NumberTwo","NumberThree","NumberFour","NotFreestyle","NotFree","NotFr","NotBackstroke","NotBack","NotBk","NotBreastroke","NotBreast","NotBr","NotButterfly","NotFly","NotFl"],D=["Pull","Kick","Drill"],M=["Board","Pads","PullBuoy","Fins","Snorkel","Chute","StretchCord"],Y=["Title","Author","Description","Date","PoolLength","LengthUnit","Align","NumeralSystem","HideIntro","LayoutWidth"],Ce=["True","False"];function v(e){const t=new Set,n=S(e).cursor();do{if(n.name!=="PaceDefinition"||!n.firstChild())continue;const i=e.sliceDoc(n.from,n.to);t.add(i),n.parent()}while(n.next());return t}const Z=Pe.define({create:v,update(e,t){return t.docChanged?v(t.state):e}}),De=C.map(e=>({label:e,type:"constant",boost:e.length})),Me=M.map(e=>({label:e,type:"constant"})),Ye=D.map(e=>({label:e,type:"constant"})),Ze=Y.map(e=>({label:e,type:"constant"})),I={0:{priorNodeName:"Distance",nodeName:"Stroke",completions:De},1:{priorNodeName:"EquipmentSpecification",nodeName:"EquipmentName",completions:Me},2:{priorNodeName:"Pace",nodeName:"PaceAlias",completions:[]},3:{priorNodeName:"",nodeName:"StrokeType",completions:Ye},4:{priorNodeName:"",nodeName:"ConstantName",completions:Ze}};function _e(e){const t=S(e.state).resolveInner(e.pos,-1);I[2].completions=Array.from(e.state.field(Z)).map(n=>({label:n,type:"variable"}));for(const{priorNodeName:n,nodeName:i,completions:o}of Object.values(I)){if(t.name===n)return{from:e.pos,options:o,validFor:/^[A-Za-z]/};if(t.name===i)return{from:t.from,to:t.to,options:o,validFor:/^[A-Za-z]/}}return null}function _(e,t){let n=1/0,i=0;for(let o=0;o<t.length;o++){const s=Te(e,t[o]);s<n&&(n=s,i=o)}return[t[i],n]}const F=2;function Fe(e,t){const[n,i]=_(e,Array.from(t)),o=[];return i<=F&&o.push({name:`Did you mean '${n}'?`,apply(s,a,l){s.dispatch({changes:{from:a,to:l,insert:n}})}}),o.push({name:"Define pace name",apply(s){s.dispatch({changes:{from:0,to:0,insert:`Pace ${e} = _%
`}})}}),o}function ze(e){return[{name:"Remove duplicated definition",apply(t){t.dispatch({changes:{from:e.from,to:e.to}})}}]}function Le(e,t){const[n,i]=_(e,t);return i>F?[]:[{name:`Did you mean ${n}`,apply(o,s,a){o.dispatch({changes:{from:s,to:a,insert:n}})}}]}function We(e,t,n){return{from:t.from,to:t.to,severity:"error",message:`A pace named '${e}' has already been defined`,actions:ze(n)}}function Xe(e,t,n){return{from:e.from,to:e.to,severity:"error",actions:Fe(t,n),message:`'${t}' is not a defined pace name.
If you wish to be able to use '${t}' in the place of a pace percentage, please define it with the following line:
Pace ${t} = _%`}}function Ee(e){return{from:e.from,to:e.to,severity:"error",message:"Syntax error"}}function je(e,t){return{from:e,to:t,severity:"error",message:"Duplicate equipment specified. Please do not use the same equipment multiple times"}}function qe(e,t,n,i){return{from:e,to:t,severity:"error",message:`'${n}' is not compatible with stroke type '${i}'`}}function Ae(e){return e.replace(/([a-z])([A-Z])/g,"$1 $2").toLowerCase()}function Ue(e,t,n,i){return{from:e.from,to:e.to,severity:"error",message:`${t} is not a valid ${Ae(n)}.`,actions:Le(t,i)}}function Ve(e){return{from:e.from,to:e.to,severity:"error",message:"Number too large for duration"}}const Ke=59;function Je(e,t,n,i){if(e.name!=="PaceAlias")return;const o=n.sliceDoc(e.from,e.to);t.has(o)||i.push(Xe(e,o,t))}function Ge(e,t,n,i){if(e.name!=="PaceDefinitionName")return;const o=n.sliceDoc(e.from,e.to),s=e.node.parent;s!==null&&(t.has(o)?i.push(We(o,e,s)):t.add(o))}function He(e,t){e.name==="⚠"&&t.push(Ee(e))}const et=new Map([["Default",new Set(["Board","PullBuoy"])],["Kick",new Set(["PullBuoy","Pads"])],["Pull",new Set(["Board","Fins"])]]);function tt(e,t,n){if(e.name!=="Instruction")return;const i=e.node.getChild("EquipmentSpecification");if(i===null)return;const o=e.node.getChild("StrokeType"),s=o!==null?t.sliceDoc(o.from,o.to):"Default",a=o!==null?o.from:i.from,l=i.getChildren("EquipmentName").map(f=>t.sliceDoc(f.from,f.to)),O=new Set(l);O.size!==l.length&&n.push(je(a,i.to));const p=et.get(s);if(p!==void 0)for(const f of O)p.has(f)&&n.push(qe(a,i.to,f,s))}function h(e,t,n,i,o){if(e.name!==n)return;const s=t.sliceDoc(e.from,e.to);i.includes(s)||o.push(Ue(e,s,n,i))}function nt(e,t,n){if(e.name!=="Duration")return;const i=e.node.getChildren("Number");for(const o of i)Number(t.sliceDoc(o.from,o.to))>Ke&&n.push(Ve(o))}function it(e){const t=[],n=new Set,i=e.state,o=S(i).cursor();do Je(o,n,i,t),Ge(o,n,i,t),He(o,t),tt(o,i,t),h(o,i,"Stroke",C,t),h(o,i,"StrokeModifier",D,t),h(o,i,"EquipmentName",M,t),h(o,i,"Boolean",Ce,t),h(o,i,"ConstantName",Y,t),nt(o,i,t);while(o.next());return t}var ot=ge(it);const st=Ne.deserialize({version:14,states:")`QYQPOOOkQPO'#CcOvQPO'#CaO!RQPO'#C_O!vQQO'#CjOOQO'#Cz'#CzO!{QPO'#ClO#QQPO'#CpOOQO'#Cy'#CyOOQO'#Cr'#CrQYQPOOO#VQSO'#CzOOQO'#Cs'#CsO#[QPO,58}OOQO'#Cb'#CbO#jQPO,59TO#oQPO,58yOOQO,58{,58{OOQO'#Cd'#CdO#wQPO'#CeOOQO'#DP'#DPOOQO'#Ct'#CtO#|QPO,58yO#|QPO,58yO$nQPO'#DPO$vQPO'#DPOOQO,59U,59UOOQO'#Cm'#CmO${QPO,59WOOQO'#Cq'#CqO%WQPO,59[OOQO-E6p-E6pOOQO,59f,59fOOQO-E6q-E6qOOQO1G.i1G.iOOQO1G.o1G.oO%}QPO1G.eO&UQPO'#CaOOQO'#Cf'#CfOOQO'#Cu'#CuO&ZQPO,59POOQO-E6r-E6rO%]QPO1G.eOOQO'#Ch'#ChOOQO'#DS'#DSO'OQPO'#CgO'sQPO'#DSOOQO,59k,59kO|QPO'#CiO'xQWO'#D]OOQO'#Co'#CoOOQO'#D['#D[OOQO1G.r1G.rO$nQPO1G.vO'}QPO7+$PO'}QPO7+$POOQO-E6s-E6sO$nQPO,59ROOQO,59n,59nO(oQPO,59wOOQO7+$b7+$bO(tQPO<<GkOOQO1G.m1G.mOOQO1G/c1G/c",stateData:")p~OlOSPOS~OSQOqPO|ZO}UO!RVO~OSQOqPO|ZO~Oo`Op^Oz_O~OpbOtcOuhOyiOSRXjRXqRX|RX}RX!RRXrRX~O{jO~OpkO~OpmO~O_pO~OSQOqPOrrO|ZO~OSsO~OSuOqPO~OpvO~OtcOuhOyiOSRajRaqRa|Ra}Ra!RRarRa~OS!OOp{O~OS!QO~OS!TOp!SO!Q!RO~O!S!VO~OtcOuhOyiOSRijRiqRi|Ri}Ri!RRirRi~OpbO~P%]Op^O~OpvOSXajXaqXatXauXayXa|Xa}Xa!RXarXa~Ox!ZOSZXjZXqZXtZXuZXyZX|ZX}ZX!RZXrZX~Ow![O~Ob!]O~OtcOuhOyiOSRqjRqqRq|Rq}Rq!RRqrRq~O!Q!aO~OtcOuhOyiOSRyjRyqRy|Ry}Ry!RRyrRy~Obly}!RP_op~",goto:"%T!QPPP!RP!X!b!X!f!l!v!z#Q#V!RP#`#dP#g#`#j#m#s#y$]PPP$c$gPPPP$oPP$yPPPPPPP%Q#gXTOPY]WROPY]Rt`TaQuQgRR!XtadRfgtz!W!X!_TwcxQ!PhR!^!VV|h!V!ZWSOPY]R!PiTWOYRlUR!TlRnVQYORoYQ]PRq]QfRWyfz!W!_QzgQ!WtR!_!XQxcR!YxTXOYSWOYT[P]aeRfgtz!W!X!_S}h!VR!`!ZR!Ul",nodeNames:"⚠ Comment SwimProgramme SwimInstruction Number SingleInstruction Stroke BlockInstruction StrokeModifier EquipmentSpecification EquipmentName Pace PaceAlias Duration RestInstruction Message ConstantDefinition ConstantName StringContent Boolean PaceDefinition PaceDefinitionName",maxTerm:50,skippedNodes:[0,1],repeatNodeCount:4,tokenData:"Ie~R![OX$wXY(rYZ*vZ^(r^p$wpq(rqr$wrs,ost-Stu$wuv/nv{$w{|0d|}$w}!O1Y!O!Q$w!Q![2x![!]3t!]!_$w!_!`4j!`!a5`!a!b$w!b!c6U!c!}6z!}#O$w#O#P'i#P#T$w#T#c6z#c#d7|#d#e:Y#e#f6z#f#g>s#g#hCa#h#l6z#l#mFu#m#o6z#o#pGy#p#q$w#q#rHo#r#y$w#y#z(r#z$f$w$f$g(r$g#BY$w#BY#BZ(r#BZ$IS$w$IS$I_(r$I_$I|$w$I|$JO(r$JO$JT$w$JT$JU(r$JU$KV$w$KV$KW(r$KW&FU$w&FU&FV(r&FV;'S$w;'S;=`(l<%lO$w[%OXbW_SOY$wYZ%kZr$wrs'Qs#O$w#O#P'i#P;'S$w;'S;=`(l<%lO$wW%pUbWOr%ks#O%k#O#P&S#P;'S%k;'S;=`&z<%lO%kW&VRO;'S%k;'S;=`&`;=`O%kW&eVbWOr%ks#O%k#O#P&S#P;'S%k;'S;=`&z;=`<%l%k<%lO%kW&}P;=`<%l%kS'VS_SOY'QZ;'S'Q;'S;=`'c<%lO'QS'fP;=`<%l'Q['nU_SOY$wYZ%kZ;'S$w;'S;=`(Q;=`<%l%k<%lO$w[(VVbWOr%ks#O%k#O#P&S#P;'S%k;'S;=`&z;=`<%l$w<%lO%k[(oP;=`<%l$w~({mbWl~_SOX$wXY(rYZ*vZ^(r^p$wpq(rqr$wrs'Qs#O$w#O#P'i#P#y$w#y#z(r#z$f$w$f$g(r$g#BY$w#BY#BZ(r#BZ$IS$w$IS$I_(r$I_$I|$w$I|$JO(r$JO$JT$w$JT$JU(r$JU$KV$w$KV$KW(r$KW&FU$w&FU&FV(r&FV;'S$w;'S;=`(l<%lO$w~*}jbWl~OX%kX^*v^p%kpq*vqr%ks#O%k#O#P&S#P#y%k#y#z*v#z$f%k$f$g*v$g#BY%k#BY#BZ*v#BZ$IS%k$IS$I_*v$I_$I|%k$I|$JO*v$JO$JT%k$JT$JU*v$JU$KV%k$KV$KW*v$KW&FU%k&FU&FV*v&FV;'S%k;'S;=`&z<%lO%kT,vS!QP_SOY'QZ;'S'Q;'S;=`'c<%lO'Q~-]XbWP~_SOY-SYZ%kZr-Srs-xs#O-S#O#P.c#P;'S-S;'S;=`/h<%lO-S~.PSP~_SOY-xZ;'S-x;'S;=`.]<%lO-x~.`P;=`<%l-x~.jUP~_SOY-SYZ%kZ;'S-S;'S;=`.|;=`<%l%k<%lO-S~/RVbWOr%ks#O%k#O#P&S#P;'S%k;'S;=`&z;=`<%l-S<%lO%k~/kP;=`<%l-S]/wXwPbW_SOY$wYZ%kZr$wrs'Qs#O$w#O#P'i#P;'S$w;'S;=`(l<%lO$w]0mXtPbW_SOY$wYZ%kZr$wrs'Qs#O$w#O#P'i#P;'S$w;'S;=`(l<%lO$w]1aZbW_SOY$wYZ%kZr$wrs'Qs!`$w!`!a2S!a#O$w#O#P'i#P;'S$w;'S;=`(l<%lO$w]2]XxPbW_SOY$wYZ%kZr$wrs'Qs#O$w#O#P'i#P;'S$w;'S;=`(l<%lO$w]3RZSPbW_SOY$wYZ%kZr$wrs'Qs!Q$w!Q![2x![#O$w#O#P'i#P;'S$w;'S;=`(l<%lO$w]3}XzPbW_SOY$wYZ%kZr$wrs'Qs#O$w#O#P'i#P;'S$w;'S;=`(l<%lO$w]4sX!SPbW_SOY$wYZ%kZr$wrs'Qs#O$w#O#P'i#P;'S$w;'S;=`(l<%lO$w]5iX|PbW_SOY$wYZ%kZr$wrs'Qs#O$w#O#P'i#P;'S$w;'S;=`(l<%lO$w]6_XuPbW_SOY$wYZ%kZr$wrs'Qs#O$w#O#P'i#P;'S$w;'S;=`(l<%lO$w]7T]bW_SpPOY$wYZ%kZr$wrs'Qs!c$w!c!}6z!}#O$w#O#P'i#P#T$w#T#o6z#o;'S$w;'S;=`(l<%lO$w]8V_bW_SpPOY$wYZ%kZr$wrs'Qs!c$w!c!}6z!}#O$w#O#P'i#P#T$w#T#b6z#b#c9U#c#o6z#o;'S$w;'S;=`(l<%lO$w]9a]bWyP_SpPOY$wYZ%kZr$wrs'Qs!c$w!c!}6z!}#O$w#O#P'i#P#T$w#T#o6z#o;'S$w;'S;=`(l<%lO$w]:c^bW_SpPOY$wYZ%kZr$wrs'Qs!c$w!c!}6z!}#O$w#O#P'i#P#T$w#T#U;_#U#o6z#o;'S$w;'S;=`(l<%lO$w];h_bW_SpPOY$wYZ%kZr$wrs'Qs!c$w!c!}6z!}#O$w#O#P'i#P#T$w#T#V6z#V#W<g#W#o6z#o;'S$w;'S;=`(l<%lO$w]<p_bW_SpPOY$wYZ%kZr$wrs'Qs!c$w!c!}6z!}#O$w#O#P'i#P#T$w#T#X6z#X#Y=o#Y#o6z#o;'S$w;'S;=`(l<%lO$w]=z]bW!RP_SpPOY$wYZ%kZr$wrs'Qs!c$w!c!}6z!}#O$w#O#P'i#P#T$w#T#o6z#o;'S$w;'S;=`(l<%lO$w_>|_bW_SpPOY$wYZ%kZr$wrs'Qs!c$w!c!}6z!}#O$w#O#P'i#P#T$w#T#X6z#X#Y?{#Y#o6z#o;'S$w;'S;=`(l<%lO$w_@U_bW_SpPOY$wYZ%kZr$wrs'Qs!c$w!c!}6z!}#O$w#O#P'i#P#T$w#T#g6z#g#hAT#h#o6z#o;'S$w;'S;=`(l<%lO$w_A^_bW_SpPOY$wYZ%kZr$wrs'Qs!c$w!c!}6z!}#O$w#O#P'i#P#T$w#T#h6z#h#iB]#i#o6z#o;'S$w;'S;=`(l<%lO$w_Bh]{QbW_SpPOY$wYZ%kZr$wrs'Qs!c$w!c!}6z!}#O$w#O#P'i#P#T$w#T#o6z#o;'S$w;'S;=`(l<%lO$w]Cj_bW_SpPOY$wYZ%kZr$wrs'Qs!c$w!c!}6z!}#O$w#O#P'i#P#T$w#T#X6z#X#YDi#Y#o6z#o;'S$w;'S;=`(l<%lO$w]Dr_bW_SpPOY$wYZ%kZr$wrs'Qs!c$w!c!}6z!}#O$w#O#P'i#P#T$w#T#h6z#h#iEq#i#o6z#o;'S$w;'S;=`(l<%lO$w]E|]bW}P_SpPOY$wYZ%kZr$wrs'Qs!c$w!c!}6z!}#O$w#O#P'i#P#T$w#T#o6z#o;'S$w;'S;=`(l<%lO$w]GQ]bW_SoPpPOY$wYZ%kZr$wrs'Qs!c$w!c!}6z!}#O$w#O#P'i#P#T$w#T#o6z#o;'S$w;'S;=`(l<%lO$w]HSXqPbW_SOY$wYZ%kZr$wrs'Qs#O$w#O#P'i#P;'S$w;'S;=`(l<%lO$w]HxXrPbW_SOY$wYZ%kZr$wrs'Qs#O$w#O#P'i#P;'S$w;'S;=`(l<%lO$w",tokenizers:[0,1,2,3],topRules:{SwimProgramme:[0,2]},tokenPrec:390});function z(e,t){e.firstChild();const n={isAlias:e.name==="PaceAlias",value:t.sliceDoc(e.from,e.to)};let i;return e.nextSibling()&&(i={isAlias:e.name==="PaceAlias",value:t.sliceDoc(e.from,e.to)}),e.parent(),{modifier:1,startIntensity:n,stopIntensity:i}}function rt(e,t){e.firstChild();const n=t.sliceDoc(e.from,e.to);e.nextSibling();const i=z(e,t);return e.parent(),{statement:3,name:n,pace:i}}function at(e,t){return e.name==="SwimInstruction"?W(e,t):e.name==="RestInstruction"?X(e,t):E(e,t)}function L(e,t){e.firstChild();const n=t.sliceDoc(e.from,e.to);e.nextSibling();const i=t.sliceDoc(e.from,e.to);return e.parent(),{minutes:n,seconds:i}}function lt(e){switch(e){case"Board":return"board";case"Pads":return"pads";case"PullBuoy":return"pullBuoy";case"Fins":return"fins";case"Snorkel":return"snorkel";case"Chute":return"chute";case"StretchCord":return"stretchCord";default:return""}}function ct(e,t){if(e.name==="EquipmentSpecification"){const n=[];e.firstChild();do{const i=t.sliceDoc(e.from,e.to);n.push(lt(i))}while(e.nextSibling());return e.parent(),{modifier:0,equipment:n}}return e.name==="Pace"?z(e,t):{modifier:2,...L(e,t)}}function ut(e){switch(e){case"Freestyle":case"Free":case"Fr":return"freestyle";case"Backstroke":case"Back":case"Bk":return"backstroke";case"Breaststroke":case"Breast":case"Br":return"breaststroke";case"Butterfly":case"Fly":case"Fl":return"butterfly";case"IndividualMedley":case"Medley":case"Im":return"individualMedley";case"ReverseIndividualMedley":case"ReverseMedley":case"ReverseIm":return"reverseIndividualMedley";case"IndividualMedleyOverlap":case"MedleyOverlap":case"ImOverlap":return"individualMedleyOverlap";case"IndividualMedleyOrder":case"MedleyOrder":case"ImOrder":return"individualMedleyOrder";case"ReverseIndividualMedleyOrder":case"ReverseMedleyOrder":case"ReverseImOrder":return"reverseIndividualMedleyOrder";case"NumberOne":return"nr1";case"NumberTwo":return"nr2";case"NumberThree":return"nr3";case"NumberFour":return"nr4";case"NotFreestyle":case"NotFree":case"NotFr":return"notFreestyle";case"NotBackstroke":case"NotBack":case"NotBk":return"notBackstroke";case"NotBreastroke":case"NotBreast":case"NotBr":return"notBreastroke";case"NotButterfly":case"NotFly":case"NotFl":return"notButterfly";case"Choice":default:return"any"}}function W(e,t){let n=1,i="default",o;const s=[];if(e.firstChild(),e.name==="Number"&&(n=Number(t.sliceDoc(e.from,e.to)),e.nextSibling()),e.name==="BlockInstruction"){e.firstChild();const a=[];do a.push(at(e,t));while(e.nextSibling());o={isBlock:!0,instructions:a}}else{e.firstChild();const a=t.sliceDoc(e.from,e.to);e.nextSibling();const l=ut(t.sliceDoc(e.from,e.to));o={isBlock:!1,distance:a,stroke:l}}if(e.parent(),e.nextSibling()){let a=!0;if(e.name==="StrokeModifier"&&(i=t.sliceDoc(e.from,e.to),a=e.nextSibling()),a)do s.push(ct(e,t));while(e.nextSibling())}return e.parent(),{statement:0,repetitions:n,instruction:o,strokeModifier:i,instructionModifiers:s}}function X(e,t){e.firstChild();const n=L(e,t);return e.parent(),{statement:1,...n}}function E(e,t){return{statement:2,message:t.sliceDoc(e.from,e.to)}}function mt(e,t){e.firstChild();const n=t.sliceDoc(e.from,e.to);e.nextSibling();const i=t.sliceDoc(e.from,e.to);return e.parent(),{statement:4,constantName:n,value:i}}function dt(e,t){const n=[];function i(){do{let o=null;switch(e.type.name){case"SwimInstruction":o=W(e,t);break;case"RestInstruction":o=X(e,t);break;case"Message":o=E(e,t);break;case"PaceDefinition":o=rt(e,t);break;case"ConstantDefinition":o=mt(e,t);break}o!==null&&n.push(o)}while(e.nextSibling())}return e.firstChild(),i(),{statements:n}}const Ot="https://github.com/bartneck/swiML",ft="http://www.w3.org/2001/XMLSchema-instance",pt="https://github.com/bartneck/swiML https://raw.githubusercontent.com/bartneck/swiML/main/version/latest/swiML.xsd";function j(e,t){let n="PT";return Number(e)>0&&(n+=e,n+="M"),Number(t)>0&&(n+=t,n+="S"),n}function ht(e,t){switch(t.statement){case 0:q(e,t);break;case 1:A(e,t);break;case 2:U(e,t);break}}function Q(e,t){t.isAlias?e.ele("zone").txt(t.value):e.ele("percentageEffort").txt(t.value)}function wt(e,t){switch(t.modifier){case 1:{const n=e.ele("intensity");Q(n.ele("startIntensity"),t.startIntensity),t.stopIntensity&&Q(n.ele("stopIntensity"),t.stopIntensity);break}case 0:for(const n of t.equipment)e.ele("equipment").txt(n);break;case 2:e.ele("rest").ele("sinceStart").txt(j(t.minutes,t.seconds));break}}function q(e,t){let n=e.ele("instruction");if(t.repetitions>1&&(n=n.ele("repetition"),n.ele("repetitionCount").txt(String(t.repetitions)).up()),t.instruction.isBlock)for(const i of t.instruction.instructions)ht(n,i);else n.ele("length").ele("lengthAsDistance").txt(t.instruction.distance),n.ele("stroke").ele("standardStroke").txt(t.instruction.stroke);if(t.instructionModifiers.length>0)for(const i of t.instructionModifiers)wt(n,i)}function A(e,t){e.ele("instruction").ele("rest").ele("afterStop").txt(j(t.minutes,t.seconds))}function U(e,t){e.ele("instruction").ele("segmentName").txt(t.message)}function St(e,t){switch(t.constantName){case"Title":e.ele("title").txt(t.value);break;case"Author":e.ele("author").ele("firstName").txt(t.value);break;case"Description":e.ele("programDescription").txt(t.value);break;case"Date":e.ele("creationDate").txt(t.value);break;case"PoolLength":e.ele("poolLength").txt(t.value);break;case"LengthUnit":e.ele("lengthUnit").txt(t.value);break;case"Align":e.ele("programAlign").txt(t.value.toLowerCase());break;case"NumeralSystem":e.ele("numeralSystem").txt(t.value);break;case"HideIntro":e.ele("hideIntro").txt(t.value.toLowerCase());break;case"LayoutWidth":e.ele("layoutWidth").txt(t.value);break}}function $t(e){const t=Be.create({version:"1.0",encoding:"UTF-8"}).ele("program",{xmlns:Ot,"xmlns:xsi":ft,"xsi:schemaLocation":pt});for(const n of e.statements)switch(n.statement){case 0:q(t,n);break;case 1:A(t,n);break;case 2:U(t,n);break;case 3:break;case 4:St(t,n);break}return t.end({prettyPrint:!0})}function yt(e){return Se.fromClass(class{constructor(t){this.view=t,this.run(this.view)}update(t){!t.docChanged||$e(t.state)!==0||this.run(t.view)}run(t){const n=S(t.state).cursor(),i=dt(n,t.state),o=$t(i);e(o)}})}const kt=st.configure({props:[be.add({Application:ve({closing:")",align:!1})}),xe.add({Application:Ie}),Re({Stroke:u.className,StrokeModifier:u.typeName,Duration:u.integer,Percentage:u.integer,Number:u.integer,Identifier:u.variableName,EquipmentName:u.macroName,Comment:u.comment,SetKeyword:u.keyword,RestKeyword:u.keyword,PaceKeyword:u.keyword,OnKeyword:u.keyword})]}),Pt=ke.define({name:"swimdsl",parser:kt,languageData:{commentTokens:{line:"#"},autocomplete:_e,closeBrackets:["{"]}});function V(){return new ye(Pt,[Z.extension,ot])}function gt(e){const t=document.createElement("input");t.type="file",t.accept=".txt",t.onchange=n=>{const i=n.target;if(i.files&&i.files.length>0){const o=i.files[0],s=new FileReader;s.onload=a=>{var O;const l=(O=a.target)==null?void 0:O.result;typeof l=="string"&&e(l)},s.readAsText(o)}},t.click()}function x(e,t){const n=URL.createObjectURL(e),i=document.createElement("a");i.href=n,i.download=t,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(n)}function bt(e){const t=new Blob([e],{type:"text/plain;charset=utf-8"});x(t,"SwimProgramme.txt")}function xt(e){const t=new Blob([e],{type:"application/xml"});x(t,"SwimProgramme.xml")}function vt(e){const t=new Blob([e],{type:"text/html"});x(t,"SwimProgramme.html")}function It(e){e.contentWindow!==null&&e.contentWindow.print()}function Qt({swimdslProgramme:e,setSwimdslProgramme:t,swimlXml:n,htmlString:i,renderNode:o,children:s}){const[a,l]=c.useState(null),O=!!a;function p(d){l(d.currentTarget)}function f(){l(null)}function $(){var d;(d=window.open("./","_blank"))==null||d.focus()}const y=[{text:"New Programme",icon:r.jsx(re,{fontSize:"small"}),onclick:$},{text:"Open",icon:r.jsx(ae,{fontSize:"small"}),onclick:()=>{gt(t)}},{text:"Save As",icon:r.jsx(le,{fontSize:"small"}),onclick:()=>{bt(e)}},{text:"Export swiML XML",icon:r.jsx(g,{fontSize:"small"}),onclick:()=>{xt(n)}},{text:"Export HTML",icon:r.jsx(g,{fontSize:"small"}),onclick:()=>{vt(i)}},{text:"Export as PDF",icon:r.jsx(ce,{fontSize:"small"}),onclick:()=>{o.current!==null&&It(o.current)}}];return r.jsx(H,{sx:{zIndex:d=>d.zIndex.drawer+1},position:"static",children:r.jsxs(ee,{children:[r.jsx(R,{sx:{paddingX:"1em"},children:r.jsx(te,{variant:"h6",component:"div",children:"SwimDSL"})}),r.jsx(T,{id:"basic-button",onClick:p,color:"inherit",children:"File"}),r.jsx(ne,{open:O,anchorEl:a,onClose:f,children:y.map(({text:d,icon:k,onclick:P},K)=>r.jsxs(ie,{onClick:P,children:[r.jsx(oe,{children:k}),r.jsx(se,{children:d})]},K))}),r.jsx(w,{sx:{ml:"auto"},children:s})]})})}const Nt='<?xml version="1.0" encoding="UTF-8"?><program xmlns="https://github.com/bartneck/swiML"/>';async function Rt(e){return(await SaxonJS.transform({stylesheetText:e,sourceText:Nt},"async")).stylesheetInternal}async function Tt(e,t){return(await SaxonJS.transform({stylesheetInternal:t,sourceText:e,destination:"serialized"},"async")).principalResult}function Bt({xmlString:e,htmlString:t,setHtmlString:n,nodeRef:i}){const[o,s]=c.useState({});return c.useEffect(()=>{fetch("./swiML.sef.json").then(a=>a.text()).then(Rt).then(s).catch(console.error)},[]),c.useEffect(()=>{Object.keys(o).length!==0&&Tt(e,o).then(a=>a.replace("https://bartneck.github.io/swiML/swiML.css","./swiML.css")).then(n).catch(console.error)},[o,e,n]),r.jsx("iframe",{ref:i,width:"100%",height:"100%",style:{border:"none"},srcDoc:t})}var m=(e=>(e[e.NONE=0]="NONE",e[e.TUTORIAL=1]="TUTORIAL",e[e.RENDER=2]="RENDER",e[e.SWIML_XML=3]="SWIML_XML",e))(m||{});const Ct=[{page:m.NONE,icon:r.jsx(ue,{}),label:"Hide panel"},{page:m.RENDER,icon:r.jsx(me,{}),label:"Show render"},{page:m.TUTORIAL,icon:r.jsx(de,{}),label:"Show tutorial"},{page:m.SWIML_XML,icon:r.jsx(g,{}),label:"Show swiML XML"}];function Dt({setPanelPage:e,activePanelPage:t}){return r.jsx(R,{children:Ct.map(({icon:n,page:i,label:o},s)=>r.jsx(Oe,{title:o,children:r.jsx("span",{children:r.jsx(T,{onClick:()=>{e(i)},disabled:t===i,color:"inherit",children:n})})},s))})}function Mt({xmlContent:e}){const t=B();return r.jsx(b,{readOnly:!0,value:e,height:`calc(100vh - ${t.mixins.toolbar.minHeight}px)`,width:"100%",theme:t.palette.mode,extensions:[Qe()]})}const Yt=`### Welcome ###################################################################

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
`;function Zt(){const[e,t]=c.useState(Yt),n=B();return r.jsx(b,{value:e,height:`calc(100vh - ${n.mixins.toolbar.minHeight}px)`,width:"100%",theme:n.palette.mode,extensions:[V()],onChange:i=>{t(i)}})}function _t(){const[e,t]=c.useState(""),n=fe("(prefers-color-scheme: dark)"),[i,o]=c.useState(m.RENDER),[s,a]=c.useState(""),[l,O]=c.useState(""),p=c.useRef(null),f=c.useMemo(()=>yt(a),[]),$=c.useMemo(()=>V(),[]),y=c.useMemo(()=>pe({palette:{mode:n?"dark":"light"}}),[n]),d=c.useCallback(P=>{t(P)},[]);function k(){switch(i){case m.TUTORIAL:return r.jsx(Zt,{});case m.RENDER:return r.jsx(Bt,{xmlString:s,htmlString:l,setHtmlString:O,nodeRef:p});case m.SWIML_XML:return r.jsx(Mt,{xmlContent:s})}}return r.jsxs(he,{theme:y,children:[r.jsx(we,{}),r.jsxs(w,{sx:{display:"flex",flexDirection:"column",height:"100vh"},children:[r.jsx(Qt,{swimdslProgramme:e,setSwimdslProgramme:t,swimlXml:s,htmlString:l,renderNode:p,children:r.jsx(Dt,{activePanelPage:i,setPanelPage:o})}),r.jsxs(w,{sx:{display:"flex",flex:1,overflow:"hidden"},children:[r.jsx(w,{sx:{width:i!==m.NONE?"50%":"100%"},borderRight:"1px solid",children:r.jsx(b,{value:e,style:{height:"100%"},width:"100%",height:"100%",theme:n?"dark":"light",extensions:[$,f],onChange:d})}),i!==m.NONE&&r.jsx(w,{sx:{width:"50%",overflow:"auto"},children:k()})]})]})]})}const N=document.getElementById("root");N!==null?G.createRoot(N).render(r.jsx(J.StrictMode,{children:r.jsx(_t,{})})):console.error("Root element does not exist!");
