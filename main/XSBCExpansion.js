!function(){"use strict";const XSBE_VERSION="v0.0.1",DEBUG=!1;function getDefaultExportFromCjs(x){return x&&x.__esModule&&Object.prototype.hasOwnProperty.call(x,"default")?x.default:x}var exports,bcmodsdk={};exports=bcmodsdk,function(){const e="1.1.0";function o(e){alert("Mod ERROR:\n"+e);const o=new Error(e);throw console.error(o),o}const t=new TextEncoder;function n(e){return!!e&&"object"==typeof e&&!Array.isArray(e)}function r(e){const o=new Set;return e.filter((e=>!o.has(e)&&o.add(e)))}const i=new Map,a=new Set;function d(e){a.has(e)||(a.add(e),console.warn(e))}function s(e){const o=[],t=new Map,n=new Set;for(const r of p.values()){const i=r.patching.get(e.name);if(i){o.push(...i.hooks);for(const[o,a]of i.patches.entries())t.has(o)&&t.get(o)!==a&&d(`ModSDK: Mod '${r.name}' is patching function ${e.name} with same pattern that is already applied by different mod, but with different pattern:\nPattern:\n${o}\nPatch1:\n${t.get(o)||""}\nPatch2:\n${a}`),t.set(o,a),n.add(r.name)}}o.sort(((e,o)=>o.priority-e.priority));const r=function(e,o){if(0===o.size)return e;let t=e.toString().replaceAll("\r\n","\n");for(const[n,r]of o.entries())t.includes(n)||d(`ModSDK: Patching ${e.name}: Patch ${n} not applied`),t=t.replaceAll(n,r);return(0,eval)(`(${t})`)}(e.original,t);let i=function(o){var t,i;const a=null===(i=(t=m.errorReporterHooks).hookChainExit)||void 0===i?void 0:i.call(t,e.name,n),d=r.apply(this,o);return null==a||a(),d};for(let t=o.length-1;t>=0;t--){const n=o[t],r=i;i=function(o){var t,i;const a=null===(i=(t=m.errorReporterHooks).hookEnter)||void 0===i?void 0:i.call(t,e.name,n.mod),d=n.hook.apply(this,[o,e=>{if(1!==arguments.length||!Array.isArray(o))throw new Error(`Mod ${n.mod} failed to call next hook: Expected args to be array, got ${typeof e}`);return r.call(this,e)}]);return null==a||a(),d}}return{hooks:o,patches:t,patchesSources:n,enter:i,final:r}}function c(e,o=!1){let r=i.get(e);if(r)o&&(r.precomputed=s(r));else{let o=window;const a=e.split(".");for(let t=0;t<a.length-1;t++)if(o=o[a[t]],!n(o))throw new Error(`ModSDK: Function ${e} to be patched not found; ${a.slice(0,t+1).join(".")} is not object`);const d=o[a[a.length-1]];if("function"!=typeof d)throw new Error(`ModSDK: Function ${e} to be patched not found`);const c=function(e){let o=-1;for(const n of t.encode(e)){let e=255&(o^n);for(let o=0;o<8;o++)e=1&e?-306674912^e>>>1:e>>>1;o=o>>>8^e}return((-1^o)>>>0).toString(16).padStart(8,"0").toUpperCase()}(d.toString().replaceAll("\r\n","\n")),l={name:e,original:d,originalHash:c};r=Object.assign(Object.assign({},l),{precomputed:s(l),router:()=>{},context:o,contextProperty:a[a.length-1]}),r.router=function(e){return function(...o){return e.precomputed.enter.apply(this,[o])}}(r),i.set(e,r),o[r.contextProperty]=r.router}return r}function l(){const e=new Set;for(const o of p.values())for(const t of o.patching.keys())e.add(t);for(const o of i.keys())e.add(o);for(const o of e)c(o,!0)}function f(){const e=new Map;for(const[o,t]of i)e.set(o,{name:o,original:t.original,originalHash:t.originalHash,sdkEntrypoint:t.router,currentEntrypoint:t.context[t.contextProperty],hookedByMods:r(t.precomputed.hooks.map((e=>e.mod))),patchedByMods:Array.from(t.precomputed.patchesSources)});return e}const p=new Map;function u(e){p.get(e.name)!==e&&o(`Failed to unload mod '${e.name}': Not registered`),p.delete(e.name),e.loaded=!1,l()}function g(e,t,r){"string"==typeof e&&"string"==typeof t&&(alert(`Mod SDK warning: Mod '${e}' is registering in a deprecated way.\nIt will work for now, but please inform author to update.`),e={name:e,fullName:e,version:t},t={allowReplace:!0===r}),e&&"object"==typeof e||o("Failed to register mod: Expected info object, got "+typeof e),"string"==typeof e.name&&e.name||o("Failed to register mod: Expected name to be non-empty string, got "+typeof e.name);let i=`'${e.name}'`;"string"==typeof e.fullName&&e.fullName||o(`Failed to register mod ${i}: Expected fullName to be non-empty string, got ${typeof e.fullName}`),i=`'${e.fullName} (${e.name})'`,"string"!=typeof e.version&&o(`Failed to register mod ${i}: Expected version to be string, got ${typeof e.version}`),e.repository||(e.repository=void 0),void 0!==e.repository&&"string"!=typeof e.repository&&o(`Failed to register mod ${i}: Expected repository to be undefined or string, got ${typeof e.version}`),null==t&&(t={}),t&&"object"==typeof t||o(`Failed to register mod ${i}: Expected options to be undefined or object, got ${typeof t}`);const a=!0===t.allowReplace,d=p.get(e.name);d&&(d.allowReplace&&a||o(`Refusing to load mod ${i}: it is already loaded and doesn't allow being replaced.\nWas the mod loaded multiple times?`),u(d));const s=e=>{"string"==typeof e&&e||o(`Mod ${i} failed to patch a function: Expected function name string, got ${typeof e}`);let t=g.patching.get(e);return t||(t={hooks:[],patches:new Map},g.patching.set(e,t)),t},f={unload:()=>u(g),hookFunction:(e,t,n)=>{g.loaded||o(`Mod ${i} attempted to call SDK function after being unloaded`);const r=s(e);"number"!=typeof t&&o(`Mod ${i} failed to hook function '${e}': Expected priority number, got ${typeof t}`),"function"!=typeof n&&o(`Mod ${i} failed to hook function '${e}': Expected hook function, got ${typeof n}`);const a={mod:g.name,priority:t,hook:n};return r.hooks.push(a),l(),()=>{const e=r.hooks.indexOf(a);e>=0&&(r.hooks.splice(e,1),l())}},patchFunction:(e,t)=>{g.loaded||o(`Mod ${i} attempted to call SDK function after being unloaded`);const r=s(e);n(t)||o(`Mod ${i} failed to patch function '${e}': Expected patches object, got ${typeof t}`);for(const[n,a]of Object.entries(t))"string"==typeof a?r.patches.set(n,a):null===a?r.patches.delete(n):o(`Mod ${i} failed to patch function '${e}': Invalid format of patch '${n}'`);l()},removePatches:e=>{g.loaded||o(`Mod ${i} attempted to call SDK function after being unloaded`),s(e).patches.clear(),l()},callOriginal:(e,t,n)=>(g.loaded||o(`Mod ${i} attempted to call SDK function after being unloaded`),"string"==typeof e&&e||o(`Mod ${i} failed to call a function: Expected function name string, got ${typeof e}`),Array.isArray(t)||o(`Mod ${i} failed to call a function: Expected args array, got ${typeof t}`),function(e,o,t=window){return c(e).original.apply(t,o)}(e,t,n)),getOriginalHash:e=>("string"==typeof e&&e||o(`Mod ${i} failed to get hash: Expected function name string, got ${typeof e}`),c(e).originalHash)},g={name:e.name,fullName:e.fullName,version:e.version,repository:e.repository,allowReplace:a,api:f,loaded:!0,patching:new Map};return p.set(e.name,g),Object.freeze(f)}function h(){const e=[];for(const o of p.values())e.push({name:o.name,fullName:o.fullName,version:o.version,repository:o.repository});return e}let m;const y=function(){if(void 0===window.bcModSdk)return window.bcModSdk=function(){const o={version:e,apiVersion:1,registerMod:g,getModsInfo:h,getPatchingInfo:f,errorReporterHooks:Object.seal({hookEnter:null,hookChainExit:null})};return m=o,Object.freeze(o)}();if(n(window.bcModSdk)||o("Failed to init Mod SDK: Name already in use"),1!==window.bcModSdk.apiVersion&&o(`Failed to init Mod SDK: Different version already loaded ('1.1.0' vs '${window.bcModSdk.version}')`),window.bcModSdk.version!==e&&(alert(`Mod SDK warning: Loading different but compatible versions ('1.1.0' vs '${window.bcModSdk.version}')\nOne of mods you are using is using an old version of SDK. It will work for now but please inform author to update`),window.bcModSdk.version.startsWith("1.0.")&&void 0===window.bcModSdk._shim10register)){const e=window.bcModSdk,o=Object.freeze(Object.assign(Object.assign({},e),{registerMod:(o,t,n)=>o&&"object"==typeof o&&"string"==typeof o.name&&"string"==typeof o.version?e.registerMod(o.name,o.version,"object"==typeof t&&!!t&&!0===t.allowReplace):e.registerMod(o,t,n),_shim10register:!0}));window.bcModSdk=o}return window.bcModSdk}();Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=y}();const bcModSDK=getDefaultExportFromCjs(bcmodsdk).registerMod({name:"XSBE",fullName:"Xiaosu's BC Expansion",version:XSBE_VERSION.startsWith("v")?XSBE_VERSION.slice(1):XSBE_VERSION,repository:"https://github.com/iceriny/XiaosuBCExpansion"});function hookFunction(target,priority,hook){return bcModSDK.hookFunction(target,priority,hook)}var DebugMSGType,name,value;function conDebug(msg,isError=!1,color=null,style=null){if(!1===DEBUG)return;const result="string"==typeof msg?{name:"XiaoSuActivity_Debug",type:DebugMSGType.DebugLog,content:msg,time:(new Date).toLocaleString(),ModVersion:XSBE_VERSION}:{name:msg.name,type:msg.type,content:msg.content,time:(new Date).toLocaleString(),ModVersion:XSBE_VERSION};if(style)console.debug("%c小酥的模组信息: ",style,result);else{let theColor="rgba(191, 154, 175, 1)";isError&&(theColor="rgba(255, 0, 0, 1)"),color&&(theColor=color),console.debug("%c小酥的模组信息: ",`background-color: ${theColor}; font-weight: bold;`,result)}}function SetSkillModifier(name,value,duration){const realLevel=SkillGetLevelReal(Player,name),targetValue=Math.floor(realLevel*value);SkillSetModifier(Player,name,targetValue-realLevel,duration)}!function(DebugMSGType){DebugMSGType[DebugMSGType.DebugLog=0]="DebugLog",DebugMSGType[DebugMSGType.Workflow_Log=1]="Workflow_Log",DebugMSGType[DebugMSGType.Error=2]="Error"}(DebugMSGType||(DebugMSGType={})),name="XSBE_Debug",value=conDebug,window.XSBE_API?window.XSBE_API[name]=value:window.XSBE_API={[name]:value};const MOAN=[" ❤呀~"," 嗯❤~"," 姆嗯❤~"," 昂~❤"," ❤啊~"," 哈啊.."," 呜❤.."," --嘶❤~"," 唔❤.."," ❤嘶哈~"," ❤呀嗯.."," ❤.哦~"];function getDynamicProbability(value,min=0,max=100,alpha=1,beta=.5,reverse=!1){const x=(value-min)/(max-min);let probability=1/(1+Math.exp(-alpha*max*(x-beta)));return reverse&&(probability=1-probability),function(min,max,value){return Math.min(max,Math.max(min,value))}(0,1,probability)}var _a$1;const ExtensionStorage=()=>Player.ExtensionSettings?.XSBE;class DataBody{constructor(data,onlineKeys,settingKeys,localKeys){this.data=data,this.onlineKeys=new Set(onlineKeys),this.settingKeys=new Set(settingKeys),this.localKeys=new Set(localKeys),Player.XSBE||(Player.XSBE=_a$1.defaultXSBE),Player.OnlineSharedSettings?.XSBE||(Player.OnlineSharedSettings.XSBE=_a$1.defaultCharacterOnlineSharedSettings);for(const k in this.data)this.initSingleDataHandle(k,this.data[k]);ExtensionStorage()&&this.compareServerDataAndLocalDataAndUpdate(),this.updateExtensionSettings()}compareServerDataAndLocalDataAndUpdate(){let ExtObj=this.getExtensionSettings();ExtObj||(ExtObj={});const serverExtensionSettingObject=ExtObj,serverTimestamp=serverExtensionSettingObject.timestamp??0,localTimestamp=this.getDataFromLocalStorage("timestamp")??0;if(serverExtensionSettingObject&&serverTimestamp>localTimestamp){for(const k in serverExtensionSettingObject)if(Object.hasOwnProperty.call(this.data,k)){if("version"==k)continue;const dataValue=this.data[k],serverValue=serverExtensionSettingObject[k];dataValue!==serverValue&&this.set(k,serverValue,!1)}this.setTimestampToLocalStorage()}}get(key){return this.data[key]}set(key,value,upload=!1,updateLocalTimestamp=!0){this.data[key]=value;let isSettings=!1;this.localKeys.has(key)&&(localStorage.setItem(this.getLocalKeyFromKey(key),JSON.stringify(value)),updateLocalTimestamp&&this.setTimestampToLocalStorage(),this.settingKeys.has(key)?(Player.XSBE.Settings[key]=value,isSettings=!0):this.onlineKeys.has(key)&&Player.OnlineSharedSettings&&(Player.OnlineSharedSettings.XSBE[key]=value),upload&&this.updateExtensionSettings()),isSettings||(Player.XSBE[key]=value)}initSingleDataHandle(key,value){let _value=value,updatePlayer=!0;if(this.localKeys.has(key)){const localValue=this.getDataFromLocalStorage(key);localValue&&(_value=localValue),this.settingKeys.has(key)?(Player.XSBE.Settings[key]=_value,updatePlayer=!1):this.onlineKeys.has(key)&&(Player.OnlineSharedSettings?.XSBE?.[key]?_value=Player.OnlineSharedSettings.XSBE[key]:Player.OnlineSharedSettings.XSBE[key]=_value)}"timestamp"===key&&(_value=CommonTime()),updatePlayer&&(Player.XSBE[key]=_value),this.data[key]=_value}updateExtensionSettings(){const ExtensionSettingsObject={};for(const key in this.data)Object.hasOwnProperty.call(this.data,key)&&this.localKeys.has(key)&&(ExtensionSettingsObject[key]=this.data[key]);ExtensionStorage()||(Player.ExtensionSettings.XSBE=""),Player.ExtensionSettings.XSBE=LZString.compressToBase64(JSON.stringify(ExtensionSettingsObject)),ServerPlayerExtensionSettingsSync("XSBE")}getExtensionSettings(){let result;try{result=JSON.parse(LZString.decompressFromBase64(ExtensionStorage())??"")}catch(error){conDebug({name:"Decompress ExtensionSettings Fail!!!  返回 null !!",content:error},!0),result=null}return result}getLocalStorage(){const localStorageObject={};for(const k of this.localKeys){const value=localStorage.getItem(this.getLocalKeyFromKey(k));value&&(localStorageObject[k]=JSON.parse(value))}return localStorageObject}getDataFromLocalStorage(key){const value=localStorage.getItem(this.getLocalKeyFromKey(key));if(value)return JSON.parse(value)}getLocalKeyFromKey(key){return`XSBE_${key}`}setTimestampToLocalStorage(){localStorage.setItem(this.getLocalKeyFromKey("timestamp"),CommonTime().toString())}}_a$1=DataBody,DataBody.defaultCharacterOnlineSharedSettings={version:"",hasWombTattoos:!1,aftertaste:0},DataBody.defaultSetting={enabled:!1},DataBody.defaultXSBE={version:"",timestamp:0,hasWombTattoos:!1,aftertaste:0,Settings:_a$1.defaultSetting};class DataManager{static Init(){DataManager.private_data=new DataBody({version:XSBE_VERSION,timestamp:0,enabled:!1,hasWombTattoos:!1,aftertaste:0,resistCount:0,aftertasteEffect:new Set,progress:0},this.onlineKeys,this.settingKeys,this.localKeys),window.XSBE_Data=DataManager.private_data}static get data(){return DataManager.private_data}static get(name){this.private_data.get(name)}static set(key,value,upload=!1,updateLocalTimestamp=!0){this.private_data.set(key,value,upload,updateLocalTimestamp)}}DataManager.onlineKeys=["version","hasWombTattoos","aftertaste"],DataManager.settingKeys=["enabled"],DataManager.localKeys=["timestamp","resistCount","aftertasteEffect","progress","version","hasWombTattoos","aftertaste","enabled"];class TimerProcessInjector{static Init(){this.ProcessSequence=new TimerProcessInjectorSequence,this.RegisteredProcess=new Map,this.ProcessCodeMap=new Map,this.activatedProcess=[],this.processSortList=[]}static Load(){this.sortProcessList();for(const name of this.processSortList){const item=this.RegisteredProcess.get(name),itemInterval=item.interval;item.nextInterval="function"==typeof itemInterval?itemInterval():itemInterval}}static Run(){hookFunction("TimerProcess",100,((args,next)=>{this.activatedProcess=[];const currentTime=Date.now();for(const name of this.processSortList){const item=this.RegisteredProcess.get(name);0!=item.interval?(item.nextTriggerTime<=currentTime&&(item.nextTriggerTime=currentTime+item.nextInterval,item.condition()&&this.activatedProcess.push(name)),"function"==typeof item.interval&&(item.nextInterval=item.interval())):this.activatedProcess.push(name)}this.ProcessSequence.clear();for(const name of this.activatedProcess)this.ProcessSequence.add({code:this.ProcessCodeMap.get(name),name:name});return this.ProcessSequence.run(this.activatedProcess),next(args)}))}static sortProcessList(){this.processSortList.sort(((a,b)=>this.RegisteredProcess.get(b).priority-this.RegisteredProcess.get(a).priority))}static add(priority,interval,condition,codeItem){this.RegisteredProcess.has(codeItem.name)||(this.RegisteredProcess.set(codeItem.name,{interval:interval,nextInterval:-1,condition:condition,priority:priority,nextTriggerTime:0}),this.ProcessCodeMap.set(codeItem.name,codeItem.code),this.processSortList.push(codeItem.name))}}class TimerProcessInjectorSequence{constructor(){this.codeMap=new Map,this.size=0}add(codeItem){this.codeMap.has(codeItem.name)||(this.codeMap.set(codeItem.name,codeItem),this.size++)}has(name){return this.codeMap.has(name)}remove(name){this.codeMap.delete(name),this.size--}clear(){this.codeMap.clear(),this.size=0}run(runList){for(const name of runList)this.codeMap.get(name)?.code()}}var ModulePriority,_a;!function(ModulePriority){ModulePriority[ModulePriority.Bottom=-100]="Bottom",ModulePriority[ModulePriority.Observe=0]="Observe",ModulePriority[ModulePriority.AddBehavior=1]="AddBehavior",ModulePriority[ModulePriority.ModifyBehavior=5]="ModifyBehavior",ModulePriority[ModulePriority.OverrideBehavior=10]="OverrideBehavior",ModulePriority[ModulePriority.Top=100]="Top"}(ModulePriority||(ModulePriority={}));class BaseModule{constructor(info){this.Info={name:"base",priority:ModulePriority.Bottom,description:"模块基类，所有的模块都继承这个模块"},this.Loaded=!1,this.Info=info}letSuccessfullyLoad(){this.Loaded=!0}}class AssetManager{static cacheImg(src,name){const img=new Image;return img.src=src,img.onload=()=>{this.AssetMap.get("img").set(name,img)},img}static cacheSound(src,name){const audio=new Audio;return audio.src=src,audio.load(),this.AssetMap.get("sound").set(name,audio),audio}static cacheAssets(){for(const src of _a.imgSrcList)this.cacheImg(src[1],src[0]);for(const src of _a.soundSrcList)this.cacheSound(src[1],src[0])}static getAssets(name,type){if("img"===type){return this.AssetMap.get("img").get(name)}if("sound"===type){return this.AssetMap.get("sound").get(name)}}static GatImg(name){return this.AssetMap.get("img").get(name)}static PlayAudio(name,volume){const vol=null!=volume?volume:Player.AudioSettings?.Volume??1;if(vol>0){const audio=this.AssetMap.get("sound").get(name);audio.volume=Math.min(vol,1);try{audio.play()}catch(error){conDebug(`声音播放失败: ${error}   Message: ${audio.error}`)}}}static PlayerOriginalAudio(name,volume){AudioPlayInstantSound(`Audio/${name}.mp3`,volume)}}_a=AssetManager,AssetManager.AssetMap=new Map([["img",new Map],["sound",new Map]]),AssetManager.IOAssetSrc="https://iceriny.github.io/XiaosuBCExpansion",AssetManager.suffix=DEBUG?"dev":"main",AssetManager.imgSrcList=[["logo",`${_a.IOAssetSrc}/${_a.suffix}/Assets/Img/logo.png`]],AssetManager.soundSrcList=[["heartbeat",`${_a.IOAssetSrc}/${_a.suffix}/Assets/Audio/heartbeat.mp3`],["clock",`${_a.IOAssetSrc}/${_a.suffix}/Assets/Audio/clock.mp3`],["snapFingers",`${_a.IOAssetSrc}/${_a.suffix}/Assets/Audio/snapFingers.mp3`],["faultSound",`${_a.IOAssetSrc}/${_a.suffix}/Assets/Audio/faultSound.mp3`],["sleep",`${_a.IOAssetSrc}/${_a.suffix}/Assets/Audio/sleep.mp3`]];class HookManager{static get NewHookItem(){return new HookItem}static setHook(functionName,name,priority,code){const hookItem=HookManager._hookMap.get(functionName);if(hookItem)priority>=0?hookItem[0].add(name,{priority:priority,code:code}):hookItem[1].add(name,{priority:priority,code:code});else{const topItem=this.NewHookItem,bottom=this.NewHookItem,_item=[topItem,bottom,new Set];priority>=0?(topItem.add(name,{priority:priority,code:code}),_item[2].add(name)):bottom.add(name,{priority:priority,code:code}),HookManager.addHook(functionName,_item),HookManager._hookMap.set(functionName,_item)}}static removeHook(functionName,name){const hookItem=HookManager._hookMap.get(functionName);hookItem&&(hookItem[2].has(name)?(hookItem[2].delete(name),hookItem[0].delete(name)):hookItem[1].delete(name),0===hookItem[0].size&&0===hookItem[1].size&&(hookItem[2].has(name)?this._hookMap.get(functionName)?.[3]?.[0]?.():hookItem[3]?.[1]?.(),this._hookMap.delete(functionName)))}static addHook(functionName,completeHookItem){const topRemoveCallback=hookFunction(functionName,100,((args,next)=>{let topLastResult=null;for(const item of completeHookItem[0]){const result=item.code(args,topLastResult);void 0!==result&&(args=result.args,void 0!==result.result&&(topLastResult=result.result))}return null!==topLastResult?topLastResult:next(args)})),bottomRemoveCallback=hookFunction(functionName,-100,((args,next)=>{let bottomLastResult=next(args);for(const item of completeHookItem[1]){const result=item.code(args,bottomLastResult);void 0!==result&&(args=result.args,void 0!==result.result&&(bottomLastResult=result.result))}return bottomLastResult}));completeHookItem[3]=[topRemoveCallback,bottomRemoveCallback]}static patchAdd(functionName,patches){!function(functionName,patches){bcModSDK.patchFunction(functionName,patches)}(functionName,patches)}static patchRemove(functionName){!function(functionName){bcModSDK.removePatches(functionName)}(functionName)}}HookManager._hookMap=new Map;class HookItem{constructor(...item){this.itemMap={},this.itemSequence=[],this.size=0,item.forEach((item=>{this.add(item.name,item.content)}))}add(name,content){this.itemMap[name]=content;let index=this.itemSequence.findIndex((item=>this.itemMap[item].priority<content.priority));-1===index&&(index=this.size),this.itemSequence.splice(index,0,name),this.size++}delete(name){delete this.itemMap[name];const index=this.itemSequence.indexOf(name);this.itemSequence.splice(index,1),this.size--}forEach(callback){const resultList=[];for(const key of this.itemSequence){const callbackResult=callback(this.itemMap[key],key);if(callbackResult&&(resultList.push(callbackResult),callbackResult.result))return resultList}return resultList}[Symbol.iterator](){let index=0;const keys=this.itemSequence,map=this.itemMap;return{next:()=>index<keys.length?{done:!1,value:map[keys[index++]]}:{done:!0,value:void 0}}}}const PH_s="{source}",PH_t="{target}";class MSGManager{static SendEmote(msg){null!=msg&&ServerSend("ChatRoomChat",{Content:msg,Type:"Emote"})}static SendChat(msg){null!=msg&&ServerSend("ChatRoomChat",{Type:"Chat",Content:msg})}static SendLocalMessage(msg,className=null,timeout=0){null!==className&&(msg=`<div class="${className}">${msg}</div>`),0===timeout?ChatRoomSendLocal(msg):ChatRoomSendLocal(msg,timeout)}static SendActivity(msg,sourceCharacter,targetCharacter){const sourceCharacterObj=ChatRoomCharacter.find((c=>c.MemberNumber==sourceCharacter)),targetCharacterObj=targetCharacter?ChatRoomCharacter.find((c=>c.MemberNumber==targetCharacter)):void 0;if(void 0===sourceCharacterObj&&void 0===targetCharacterObj)return;const sourceCharacterNickname=sourceCharacterObj?CharacterNickname(sourceCharacterObj):"",targetCharacterNickname=targetCharacterObj?CharacterNickname(targetCharacterObj):"",resultDict=[{Tag:"MISSING ACTIVITY DESCRIPTION FOR KEYWORD XSBE_ActMessage",Text:msg.replaceAll(PH_s,sourceCharacterNickname).replaceAll(PH_t,targetCharacterNickname)}];resultDict.push({SourceCharacter:sourceCharacter}),void 0!==targetCharacter&&resultDict.push({TargetCharacter:targetCharacter}),ServerSend("ChatRoomChat",{Type:"Activity",Content:"XSBE_ActMessage",Dictionary:resultDict,Sender:sourceCharacter})}}class ArousalModule extends BaseModule{constructor(){super(...arguments),this._aftertaste=0,this.descriptionOfEnduranceActivities=["{source}脚趾一蜷一缩，难耐的交织.","{source}闭眼忍耐，鼻息中泄露出粉红的喘息.","{source}蜷缩脚趾忍耐着连续的快感.","{source}难耐的双腿颤抖着，身体的每一处都充满快感.","{source}拼命咬住牙齿，却从鼻腔泄露出诱人的声音.","{source}在汹涌的快感下浑身粉红，奋力的想要忍住高潮.","{source}浑身颤抖的抵抗高潮的逼近."],this.needSendEnduringMessage=!1,this.getArousalSettings=C=>C.ArousalSettings,this.getOrgasmStage=C=>this.getArousalSettings(C)?.OrgasmStage??0,this.afterEffectSwitch={relax:!1,weakness:!1,twitch:!1,trance:!1,absentminded:!1},this.afterEffectDescribe={relax:[`${PH_s}的身体在快感冲击下软了下来。浑身软绵绵的使不上力气。`,`${PH_s}的身体渐渐恢复，重新恢复了正常的体力。`],weakness:[`${PH_s}的身体在连续的快感冲击中变得越来越软，越来越无力，已经难以控制自己的身体。`,`${PH_s}的身体虽然还是软绵绵的，但大概可以正常走路了。`],twitch:[`连续深度的高潮冲击下，${PH_s}的身体不自觉的开始抽搐，再这么下去...`,`${PH_s}停止了抽搐，但还是很难支撑起自己的身体。`],trance:[`高潮过于猛烈，${PH_s}的脑袋已经不清楚了。恍恍惚惚，意识断断续续。想要移动的话..应该需要很大的意志力才能挪动吧。`,`${PH_s}的意识恢复了，但身体还是时不时的抽动一下。`],absentminded:[`强大的、连续的、不可抵挡的高潮冲击下，${PH_s}已经完全无法控制自己的身体。只能在无意识中抽搐着身体，发出细软的声音。这样的话...`,`${PH_s}虽然还是恍恍惚惚，意识算是渐渐恢复了，希望这段时间没有发生什么。`]},this._aftertasteEffectSet=new Set,this.inputDefaultStyle=void 0,this.inputDisabled=!1}get getEndureDesc(){return this.descriptionOfEnduranceActivities[Math.floor(Math.random()*this.descriptionOfEnduranceActivities.length)]}Run(){this.HookList(),this.patchListHandler(),this.TimerProcess()}Unload(){}Init(){}Load(){this._aftertaste=DataManager.data.get("aftertaste")??0}set Aftertaste(level){DataManager.set("aftertaste",level,!0),this._aftertaste=level}get Aftertaste(){return this._aftertaste}HookList(){HookManager.setHook("ActivityOrgasmStart","AftertasteSet",2,(args=>{if(!args[0].IsPlayer())return;const addedNumber=ActivityOrgasmGameResistCount+1;this.Aftertaste=this._aftertaste+addedNumber,this._aftertaste>ArousalModule.MAX_AFTERTASTE&&(this.Aftertaste=ArousalModule.MAX_AFTERTASTE),this.AftertasteEffectSetHandler(!0)})),HookManager.setHook("ActivityOrgasmStart","AftertasteSet",-2,(args=>{args[0].IsPlayer()&&DataManager.set("resistCount",ActivityOrgasmGameResistCount,!0)})),HookManager.setHook("ChatRoomSync","Test HookManager",-10,(()=>{this.AftertasteEffectSetHandler(!1),ActivityOrgasmGameResistCount=DataManager.data.get("resistCount")})),HookManager.setHook("ActivityChatRoomArousalSync","ArousalSync",-10,(()=>{DataManager.set("progress",Player.ArousalSettings.Progress)})),HookManager.setHook("Player.GetSlowLevel","aftertasteWeaknessEffect",-9,((args,lastResult)=>{if(Player.RestrictionSettings?.SlowImmunity)return{args:args,result:0};let result=lastResult;if("number"==typeof result&&this.afterEffectSwitch.weakness){let slowLevel=1;this._aftertaste>55&&slowLevel++,this._aftertaste>60&&slowLevel++,this._aftertaste>70&&slowLevel++,result<slowLevel?result=slowLevel:result++}return{args:args,result:result}})),HookManager.setHook("Player.GetBlindLevel","aftertasteEffectAboutBlindLevel",-10,((args,lastResult)=>{let result=lastResult;if("number"==typeof result&&this.afterEffectSwitch.weakness){let blindLevel=1;this.afterEffectSwitch.twitch&&blindLevel++,this.afterEffectSwitch.trance&&blindLevel++,this.afterEffectSwitch.absentminded&&blindLevel++,result<blindLevel?result=blindLevel:result++}return{args:args,result:result}})),HookManager.setHook("Player.CanKneel","aftertasteEffectAboutCanKneel",9,(args=>{if(this.afterEffectSwitch.weakness)return{args:args,result:!1}})),HookManager.setHook("Player.GetDeafLevel","aftertasteEffectAboutDeafLevel",-11,((args,lastResult)=>{let result=lastResult;if("number"==typeof result&&this.afterEffectSwitch.trance){let deafLevel=1;this.afterEffectSwitch.absentminded&&deafLevel++,result<deafLevel?result=deafLevel:result++}return{args:args,result:result}})),HookManager.setHook("PoseAvailable","aftertasteEffectAboutPose",3,(args=>{if(args[0].IsPlayer()&&this.afterEffectSwitch.twitch)return{args:args,result:!1}})),HookManager.setHook("ChatRoomCanLeave","aftertasteEffectAboutCanLeave",10,(args=>{if(this.afterEffectSwitch.absentminded)return{args:args,result:!1}})),HookManager.setHook("CommandParse","aftertasteEffectAboutChat",10,(args=>{if(this.afterEffectSwitch.relax){let msg=args[0];const firstChar=msg.charAt(0);if("*"!==firstChar&&firstChar!==CommandsKey&&"."!==firstChar&&"@"!==firstChar&&"`"!==firstChar&&"!"!==firstChar){const segmentList=function(str){if(window.Intl&&window.Intl.Segmenter&&"cn"===TranslationLanguage.toLowerCase()){const segmenterResult=new Intl.Segmenter("zh",{granularity:"word"}).segment(str),results=[];for(const segment of segmenterResult)results.push(segment.segment);return conDebug(`segmentForCH: ${results}`),results}return null}(msg);if(null===segmentList)conDebug("程序正在处理 消息分词，但您的浏览器不支持该功能!!! 无法显示余韵的特殊字符串加工效果。");else{let cacheStr="";for(let i=0;i<segmentList.length;i++){const subStr=segmentList[i];0===i?cacheStr=subStr:cacheStr+=this.msgSubStringHandle(subStr)}msg=cacheStr}args[0]="*".concat(msg).concat("....^(虚弱)")}}return{args:args}}))}msgSubStringHandle(subStr){const probability_bold=Math.random()<getDynamicProbability(this._aftertaste,0,ArousalModule.MAX_AFTERTASTE,.2,.8),probability_moan=Math.random()<getDynamicProbability(this._aftertaste,0,ArousalModule.MAX_AFTERTASTE,.1,0,!0),probability_negative=Math.random()<getDynamicProbability(this._aftertaste,0,ArousalModule.MAX_AFTERTASTE,.05,-.02,!0);let formattedSubStr=subStr;return probability_bold&&(formattedSubStr=`..${"*".repeat(subStr.length)}..`),probability_moan&&(formattedSubStr+=`${MOAN[Math.floor(Math.random()*MOAN.length)]}...`),probability_negative&&(formattedSubStr+=`-${formattedSubStr}`),formattedSubStr}TimerProcess(){TimerProcessInjector.add(101,45e3,(()=>!!Player.ArousalSettings),{code:()=>{Player.ArousalSettings.Progress>=93?(ActivityOrgasmGameResistCount++,DataManager.set("resistCount",ActivityOrgasmGameResistCount,!0)):Player.ArousalSettings.Progress<60&&ActivityOrgasmGameResistCount>=1&&(ActivityOrgasmGameResistCount--,DataManager.set("resistCount",ActivityOrgasmGameResistCount,!0))},name:"EdgeTimer"}),TimerProcessInjector.add(100,15e3,(()=>this._aftertaste>0),{code:()=>{this.AftertasteFallBack(),this.AftertasteEffectSetHandler(!0)},name:"AftertasteFallBack"}),TimerProcessInjector.add(99,0,(()=>this._aftertaste>=20),{code:()=>{this._aftertasteEffectSet.has("relax")&&SkillGetModifier(Player,"Bondage")>=0&&(SetSkillModifier("Bondage",.4,5e3),SetSkillModifier("SelfBondage",.4,5e3),SetSkillModifier("LockPicking",.4,5e3),SetSkillModifier("Evasion",.1,5e3),SetSkillModifier("Willpower",.8,5e3),SetSkillModifier("Infiltration",.2,5e3),SetSkillModifier("Dressage",.2,5e3))},name:"AftertasteEffectHandle"}),TimerProcessInjector.add(-1,200,(()=>"ChatRoom"==CurrentScreen&&void 0!==Player.MemberNumber),{code:()=>{const orgasmStage=Player.ArousalSettings?.OrgasmStage;1==orgasmStage?(this.needSendEnduringMessage=!0,this.inputDisabled||this.DisableInput(!0)):0==orgasmStage?(this.needSendEnduringMessage=!1,this.inputDisabled&&this.DisableInput(!1)):2==orgasmStage&&(this.needSendEnduringMessage=!1)},name:"DisableInput"}),TimerProcessInjector.add(-2,2500,(()=>this.needSendEnduringMessage),{code:()=>{MSGManager.SendActivity(this.getEndureDesc,Player.MemberNumber)},name:"SendEnduringMessage"})}patchListHandler(){HookManager.patchAdd("ActivityOrgasmStart",{"C.ArousalSettings.OrgasmTimer = CurrentTime + (Math.random() * 10000) + 5000;":"if (Player.XSBE && C.IsPlayer()) {\n                const addedTime = (Math.random() + 0.3) * 1000 * ActivityOrgasmGameResistCount;\n                C.ArousalSettings.OrgasmTimer = CurrentTime + (addedTime > 20000 ? 20000 : addedTime) + 4000 + (3000 * Math.random());\n            } else {\n                C.ArousalSettings.OrgasmTimer = CurrentTime + (Math.random() * 10000) + 5000;\n            }","ActivityOrgasmGameResistCount = 0;":"ActivityOrgasmGameResistCount = Math.round(ActivityOrgasmGameResistCount / 2);"}),HookManager.patchAdd("ChatRoomMenuDraw",{'else if (name === "Kneel" && (Player.AllowedActivePoseMapping.BodyLower || Player.AllowedActivePoseMapping.BodyFull))':'else if (name === "Kneel" && (Player.AllowedActivePoseMapping.BodyLower || Player.AllowedActivePoseMapping.BodyFull|| (Player?.XSBE?.aftertasteEffect?.has("weakness"))))',"if (ChatRoomGetUpTimer === 0 && (ChatRoomCanAttemptStand() || ChatRoomCanAttemptKneel()))":'if (ChatRoomGetUpTimer === 0 && (ChatRoomCanAttemptStand() || ChatRoomCanAttemptKneel()) && !Player?.XSBE?.aftertasteEffect?.has("absentminded"))'})}AftertasteFallBack(){const n=20-ActivityOrgasmGameResistCount,fallBackNumber=n<=0?1:n;this.Aftertaste=this.Aftertaste-fallBackNumber,this._aftertaste<0&&(this.Aftertaste=0)}setAftertasteEffectSwitch(name,value){this.afterEffectSwitch[name]!=value&&(value?(this._aftertasteEffectSet.add(name),"relax"===name&&(AssetManager.PlayAudio("heartbeat",.5),Player.IsStanding()&&PoseSetActive(Player,"Kneel")),"weakness"===name&&AssetManager.PlayAudio("heartbeat"),"twitch"===name&&AssetManager.PlayAudio("faultSound"),"trance"===name&&AssetManager.PlayAudio("sleep"),"absentminded"===name&&AssetManager.PlayAudio("sleep"),MSGManager.SendActivity(this.afterEffectDescribe[name][0],Player.MemberNumber)):(this._aftertasteEffectSet.delete(name),MSGManager.SendActivity(this.afterEffectDescribe[name][1],Player.MemberNumber)),this.afterEffectSwitch[name]=value)}AftertasteEffectSetHandler(pushToServer){const effectThresholds=[{threshold:20,effect:"relax"},{threshold:50,effect:"weakness"},{threshold:70,effect:"twitch"},{threshold:90,effect:"trance"},{threshold:100,effect:"absentminded"}];for(const{threshold:threshold,effect:effect}of effectThresholds)this.setAftertasteEffectSwitch(effect,this._aftertaste>threshold);DataManager.set("aftertasteEffect",this._aftertasteEffectSet,pushToServer)}DisableInput(isAbsent){const inputElement=document.getElementById("InputChat");inputElement&&(isAbsent?inputElement.readOnly||(this.inputDefaultStyle||(this.inputDefaultStyle={backgroundColor:inputElement.style.backgroundColor,borderColor:inputElement.style.borderColor,borderRadius:inputElement.style.borderRadius}),inputElement.readOnly=!0,this.inputDisabled=!0,inputElement.style.backgroundColor="#8d6f83",inputElement.style.borderColor="#ea44a9",inputElement.style.borderRadius="5px"):inputElement.readOnly&&(inputElement.readOnly=!1,this.inputDisabled=!1,this.inputDefaultStyle&&(inputElement.style.backgroundColor=this.inputDefaultStyle.backgroundColor,inputElement.style.borderColor=this.inputDefaultStyle.borderColor,inputElement.style.borderRadius=this.inputDefaultStyle.borderRadius)))}}ArousalModule.MAX_AFTERTASTE=120;class WombTattoosModule extends BaseModule{Init(){}Load(){}Run(){}Unload(){}static haveWombTattoos(C){for(const item of C.Appearance)if(null!==item.Asset&&"WombTattoos"===item.Asset.Name)return!0;return!1}}class ModulesLoader{static registerModule(){for(const n in this.modulesBuilder){if("base"===n)continue;const module=this.modulesBuilder[n]();this.modulesList.push(module)}this.modulesList.sort(((a,b)=>a.Info.priority===b.Info.priority?0:a.Info.priority>b.Info.priority?1:-1));for(const m of this.modulesList)this.modules.set(m.Info.name,m)}static initModules(){for(const[name,module]of this.modules)module.Init(),conDebug(`模块 ${name} 初始化完成`);conDebug("模块初始化结束")}static loadModules(){for(const[name,m]of this.modules)m.Load(),this.loadedCount++,conDebug(`模块 ${name} 加载完成`);conDebug(`模块加载结束 ${this.loadedCount}/${this.fullLoadedCount}`),this.loadedCount===this.fullLoadedCount&&(this.successfulLoaded=!0,conDebug("模块加载完成!"))}static runModules(){for(const[name,module]of this.modules)module.Run(),conDebug(`模块 ${name} 运行完成`);conDebug("模块运行结束")}static getModule(name){return this.modules.get(name)}}ModulesLoader.modules=new Map,ModulesLoader.modulesList=[],ModulesLoader.successfulLoaded=!1,ModulesLoader.loadedCount=0,ModulesLoader.fullLoadedCount=2,ModulesLoader.modulesBuilder={base:()=>{throw new Error("BaseModule 不应该被创建")},WombTattoosModule:()=>new WombTattoosModule({name:"WombTattoosModule",priority:ModulePriority.Observe,description:"淫纹相关的模块。修改与拓展了游戏淫纹的功能。"}),ArousalModule:()=>new ArousalModule({name:"ArousalModule",priority:ModulePriority.Observe,description:"Arousal模块。修改与拓展了游戏Arousal的功能。包括高潮等机制。"})},conDebug({name:"Start Init",type:DebugMSGType.Workflow_Log,content:"Init wait"}),null!=CurrentScreen&&"Login"!==CurrentScreen||hookFunction("LoginResponse",-100,((args,next)=>{const result=next(args);conDebug({name:"Init! Login Response caught",content:args,type:DebugMSGType.Workflow_Log});const response=args[0];return response&&"object"==typeof response&&"string"==typeof response.Name&&"string"==typeof response.AccountName&&(ModulesLoader.successfulLoaded||(AssetManager.cacheAssets(),DataManager.Init(),conDebug({name:"Data Init Complete",type:DebugMSGType.Workflow_Log,content:DataManager.data}),TimerProcessInjector.Init(),ModulesLoader.registerModule(),ModulesLoader.initModules(),ModulesLoader.loadModules(),ModulesLoader.runModules(),TimerProcessInjector.Load(),TimerProcessInjector.Run())),result}))}();
//# sourceMappingURL=XSBCExpansion.js.map
