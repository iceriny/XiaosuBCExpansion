// ==UserScript==
// @name 小酥的BC拓展
// @namespace https://www.bondageprojects.com/
// @version 0.0.1
// @description 小酥对BC的一些拓展，涉及很多方面 具体请看 https://github.com/Iceriny/XiaosuBCExpansion
// @author XiaoSu
// @match https://bondageprojects.elementfx.com/*
// @match https://www.bondageprojects.elementfx.com/*
// @match https://bondage-europe.com/*
// @match https://www.bondage-europe.com/*
// @run-at document-end
// @grant none
// ==/UserScript==

(function() {
    'use strict';
    var script = document.createElement("script");
    script.langauge = "JavaScript";
    script.setAttribute("crossorigin", "anonymous");
    script.src = `https://iceriny.github.io/XiaosuBCExpansion/main/XSBCExpansion.js?${Date.now()}`;
    document.head.appendChild(script);
})();
