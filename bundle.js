/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/main.js":
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _reqCmtJson__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./reqCmtJson */ \"./src/js/reqCmtJson.js\");\n/* harmony import */ var _reqVideoDoc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reqVideoDoc */ \"./src/js/reqVideoDoc.js\");\n//import reqAdJson from './reqAdJson';\n\n\n\n\nfunction drawGraph(drawTgt, cmtCnts) {\n    // Draw destination\n    let drawTgtRect = drawTgt.getBoundingClientRect();\n    let maxCnt = 0;\n\n    // Sum all comments\n    for(let i=0; i<cmtCnts.length; i++) {\n        if(cmtCnts[i] > maxCnt) {\n            maxCnt = cmtCnts[i];\n        }\n    }\n    if (maxCnt == 0) maxCnt = 1;\n        \n    // Insert a graph element\n    const graphId= 'CmtGraph';\n    let graphElem = document.getElementById(graphId);\n    // Remove before graph\n    if (graphElem) {\n        graphElem.remove();\n    }\n    graphElem = document.createElement('div');\n    graphElem.id = graphId;\n    graphElem.style.display = 'flex';\n    graphElem.style['flex-direction'] = 'row';\n    drawTgt.insertBefore(graphElem, drawTgt.firstChild);\n\n    // Create comment rectangles\n    let baseWidth = drawTgtRect.width / cmtCnts.length;\n    let frag = document.createDocumentFragment();\n    for(let i=0; i<cmtCnts.length; i++) {\n        // Create a rectangle element\n        let e = document.createElement('div');\n        e.className = 'CmtRect';\n        e.style.backgroundColor = '#66CCFF';\n        e.style.opacity =  0.5;\n        e.style.position = 'relative';\n\n        // Calc rectangle\n        let eWidth = baseWidth;\n        let eHeight = drawTgtRect.height * (cmtCnts[i] / maxCnt);\n        e.style.width = eWidth + 'px';\n        e.style.height = eHeight + 'px';\n        e.style.top = drawTgtRect.height - eHeight + 'px';\n\n        // Add element \n        frag.appendChild(e);\n    }\n    graphElem.appendChild(frag);\n}\n\n\nfunction aggrCmtCnts(jsonRes, divNum = 100) {\n    let vpos = [];\n    for (let obj of jsonRes) {\n        if ('chat' in obj) {\n            vpos.push(obj['chat']['vpos']);\n        }\n    }\n\n    let cmtCnts = new Array(divNum);\n    cmtCnts.fill(0);\n\n    let movieDuration = document.getElementsByClassName(\n        'PlayTimeFormatter PlayerPlayTime-duration')[0].innerHTML;\n    let durs = movieDuration.split(':');\n    let movieTime = durs[0]*60*100 + durs[1]*100;\n\n    // [Todo] Adapt to AdBlock\n    /*\n    // Check either display niconico advertisement or not\n    let adsTime = 0;\n    if (videoId) {\n        if (jsonAds.data.activePoint > 0) {\n            adsTime = 10*100;\n        }\n    }\n    */\n\n    let baseTime = movieTime / divNum;\n    //let baseTime = (movieTime + adsTime) / divNum;\n    for (let time of vpos) {\n        let p = parseInt(time / baseTime);\n        if (p >= divNum) p = divNum - 1;\n        cmtCnts[p] += 1;\n    }\n\n    return cmtCnts;\n}\n\n\nfunction addRedrawJobOnResize(drawTgt, cmtCnts) {\n    // In case of resizing seekbar\n    let prevWidth = drawTgt.getBoundingClientRect().width;\n    window.addEventListener('resize', () => {\n        let curWidth = drawTgt.getBoundingClientRect().width;\n        // If seekbar is resized\n        if (curWidth != prevWidth) {\n            // Re-draw\n            let cmtElems = document.getElementsByClassName('CmtRect');\n            let baseWidth = curWidth / cmtCnts.length;\n            for (let e of cmtElems) {\n                e.style.width = baseWidth + 'px';\n            }\n            prevWidth = curWidth;\n        }\n    });\n}\n\n\nfunction keepCmtGraph(cmtJson) {\n    // Draw graph over seekbar\n    let drawTgt = document.getElementsByClassName('XSlider')[0];\n    let cmtCnts = aggrCmtCnts(cmtJson);\n\n    drawGraph(drawTgt, cmtCnts);\n    addRedrawJobOnResize(drawTgt, cmtCnts);\n}\n\n\nfunction createCmtGraph(doc) {\n    // Get video data from html document\n    let dataStr = doc.getElementById('js-initial-watch-data').getAttribute('data-api-data');\n    let dataObj = JSON.parse(dataStr);\n\n    // Loop in case PlayerPlayTime-duration value is not updated yet\n    let timer = setInterval(() => {\n        let movieDuration = document.getElementsByClassName(\n            'PlayTimeFormatter PlayerPlayTime-duration')[0].innerHTML;\n\n        // PlayerPlayTime-document value is updated\n        if (movieDuration && movieDuration !== '00:00') {\n            let durs = movieDuration.split(':');\n            let timeRange = '0-' + parseInt(durs[0]) + ':100,1000';\n\n            // Access the comment server and draw the comment graph\n            (async () => {\n                try {\n                    let cmtJson = await Object(_reqCmtJson__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(dataObj, timeRange);\n                    keepCmtGraph(cmtJson);\n                } catch (err) {\n                    console.log(err);\n                }\n            })();\n\n            clearInterval(timer);\n        }\n    }, 100);\n}\n\n\nfunction addRedrawJobOnClickLink() {\n    let videoId = location.href.match(/s?[mo]?\\d+/)[0];   // e.g. 'sm12345'\n\n    // On click another video link: \n    // In this case, html document is not updated to new video page completely.\n    // So, we parse new video page html document by re-accessing it and extract \n    // needed information (e.g. thread id).\n    const observer = new MutationObserver(async (mutations) => {\n        let newVideoId = location.href.match(/s?[mo]?\\d+/)[0];\n        if (newVideoId !== videoId) {\n            // Re-draw comment graph with by new video\n            try {\n                let doc = await Object(_reqVideoDoc__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(newVideoId);\n                createCmtGraph(doc);\n            } catch (err) {\n                console.log(err);\n            }\n            videoId = newVideoId;\n        }\n    });\n\n    // On click another video link, A child element is inserted under\n    // 'ja-jp is-autoResize' class's element.\n    // So, monitor this element for now.\n    const target = document.getElementsByClassName('ja-jp is-autoResize')[0];\n    const config = {\n        childList: true\n    };\n    observer.observe(target, config);\n}\n\n\n// Main\nwindow.onload = () => {\n    createCmtGraph(document);\n    addRedrawJobOnClickLink();\n}\n\n\n//# sourceURL=webpack:///./src/js/main.js?");

/***/ }),

/***/ "./src/js/reqCmtJson.js":
/*!******************************!*\
  !*** ./src/js/reqCmtJson.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return reqCmtJson; });\nfunction createCmtReqUser(threadId, userId, userKey, timeRange) {\n    var req = [\n        {\n            \"ping\": {\n                \"content\": \"rs:0\"\n            }\n        }, {\n            \"ping\": {\n                \"content\": \"ps:0\"\n            }\n        }, {\n            \"thread\": {\n                \"thread\": \"1463483922\",\n                \"version\": \"20090904\",\n                \"language\": 0,\n                \"user_id\": \"53842185\",\n                \"with_global\": 1,\n                \"scores\": 1,\n                \"nicoru\": 0,\n                \"userkey\": \"1502173042.~1~MzCxfaTZL7rDZztXT4fhmR3fXdyv-_24iGol36KOkRA\"\n            }\n        }, {\n            \"ping\": {\n                \"content\": \"pf:0\"\n            }\n        }, {\n            \"ping\": {\n                \"content\": \"ps:1\"\n            }\n        }, {\n            \"thread_leaves\": {\n                \"thread\": \"1463483922\",\n                \"language\": 0,\n                \"user_id\": \"53842185\",\n                \"content\": \"0-22:100,1000\", // The ceiling movie time of seconds\n                \"scores\": 1,\n                \"nicoru\": 0,\n                \"userkey\": \"1502173042.~1~MzCxfaTZL7rDZztXT4fhmR3fXdyv-_24iGol36KOkRA\"\n            }\n        }, {\n            \"ping\": {\n                \"content\": \"pf:1\"\n            }\n        }, {\n            \"ping\": {\n                \"content\": \"rf:0\"\n            }\n        }\n    ];\n\n    req[2]['thread']['thread'] = String(threadId);\n    req[2]['thread']['user_id'] = String(userId);\n    req[2]['thread']['userkey'] = String(userKey);\n\n    req[5]['thread_leaves']['thread'] = String(threadId);\n    req[5]['thread_leaves']['user_id'] = String(userId);\n    req[5]['thread_leaves']['content'] = String(timeRange);\n    req[5]['thread_leaves']['userkey'] = String(userKey);\n\n    return req;\n}\n\n\nfunction createCmtReqChannel(threadId1, threadId2, threadKey, force184, userId, userKey, timeRange) {\n    var req = [\n        {\n            \"ping\": {\n                \"content\": \"rs:0\"\n            }\n        }, {\n            \"ping\": {\n                \"content\": \"ps:0\"\n            }\n        }, {\n            \"thread\": {\n                \"thread\": \"1501742473\",\n                \"version\": \"20090904\",\n                \"language\": 0,\n                \"user_id\": \"53842185\",\n                \"with_global\": 1,\n                \"scores\": 1,\n                \"nicoru\": 0,\n                \"userkey\": \"1502173804.~1~fwFqcTlwtEbO4ggddXkZLdbowXV9TrcE_NTbhDTmFlo\"\n            }\n        }, {\n            \"ping\": {\n                \"content\": \"pf:0\"\n            }\n        }, {\n            \"ping\": {\n                \"content\": \"ps:1\"\n            }\n        }, {\n            \"thread_leaves\": {\n                \"thread\": \"1501742473\",\n                \"language\": 0,\n                \"user_id\": \"53842185\",\n                \"content\": \"0-13:100,1000\",\n                \"scores\": 1,\n                \"nicoru\": 0,\n                \"userkey\": \"1502173804.~1~fwFqcTlwtEbO4ggddXkZLdbowXV9TrcE_NTbhDTmFlo\"\n            }\n        }, {\n            \"ping\": {\n                \"content\": \"pf:1\"\n            }\n        }, {\n            \"ping\": {\n                \"content\": \"ps:2\"\n            }\n        }, {\n            \"thread\": {\n                \"thread\": \"1501742474\",\n                \"version\": \"20090904\",\n                \"language\": 0,\n                \"user_id\": \"53842185\",\n                \"force_184\": \"1\",\n                \"with_global\": 1,\n                \"scores\": 1,\n                \"nicoru\": 0,\n                \"threadkey\": \"1502173806.e_qPpM9yX3kUgW80nVYo32EdDCU\"\n            }\n        }, {\n            \"ping\": {\n                \"content\": \"pf:2\"\n            }\n        }, {\n            \"ping\": {\n                \"content\": \"ps:3\"\n            }\n        }, {\n            \"thread_leaves\": {\n                \"thread\": \"1501742474\",\n                \"language\": 0,\n                \"user_id\": \"53842185\",\n                \"content\": \"0-13:100,1000\",\n                \"scores\": 1,\n                \"nicoru\": 0,\n                \"force_184\": \"1\",\n                \"threadkey\": \"1502173806.e_qPpM9yX3kUgW80nVYo32EdDCU\"\n            }\n        }, {\n            \"ping\": {\n                \"content\": \"pf:3\"\n            }\n        }, {\n            \"ping\": {\n                \"content\": \"rf:0\"\n            }\n        }\n    ];\n\n    req[2]['thread']['thread'] = String(threadId1);\n    req[2]['thread']['user_id'] = String(userId);\n    req[2]['thread']['userkey'] = String(userKey);\n\n    req[5]['thread_leaves']['thread'] = String(threadId1);\n    req[5]['thread_leaves']['user_id'] = String(userId);\n    req[5]['thread_leaves']['content'] = String(timeRange);\n    req[5]['thread_leaves']['userkey'] = String(userKey);\n\n    req[8]['thread']['thread'] = String(threadId2);\n    req[8]['thread']['user_id'] = String(userId);\n    req[8]['thread']['force_184'] = String(force184);\n    req[8]['thread']['threadkey'] = String(threadKey);\n\n    req[11]['thread_leaves']['thread'] = String(threadId2);\n    req[11]['thread_leaves']['user_id'] = String(userId);\n    req[11]['thread_leaves']['content'] = String(timeRange);\n    req[11]['thread_leaves']['force_184'] = String(force184);\n    req[11]['thread_leaves']['threadkey'] = String(threadKey);\n\n    return req;\n}\n\n\nasync function reqThreadKey(threadId) {\n    return new Promise((resolve, reject) => {\n        const url = `http://flapi.nicovideo.jp/api/getthreadkey?thread=${threadId}`;\n\n        fetch(url).then((response) => {\n            return response;\n        }).then((text) => {\n            resolve(text);\n        }).catch((err) => {\n            reject(err);\n            //console.error(`[ERROR] Failed to GET request to ${url}`);\n            //console.error('url: ' + url);\n            //console.error('err: ', err);\n        });\n    });\n}\n\n\nasync function reqCmtSvr(req) {\n    return new Promise((resolve, reject) => {\n        const url = 'https://nmsg.nicovideo.jp/api.json/';\n        const headers = {'Content-Type': 'application/json'};\n        const body = JSON.stringify(req);\n\n        fetch(url, {method: \"POST\", headers: headers, body: body}).then((response) => {\n            return response;\n        }).then((json) => {\n            resolve(json);\n        }).catch((err) => {\n            reject(err);\n            //console.error(`[ERROR] Failed to POST request to ${url}`);\n            //console.error('url: ' + url);\n            //console.error('err: ', err);\n        });\n    });\n}\n\n\nasync function reqCmtJson(dataObj, timeRange) {\n    // Extract information to access the comment server\n    const userId = dataObj['viewer']['id'];\n    const userKey = dataObj['context']['userkey'];\n    const threads = dataObj['commentComposite']['threads'];\n\n    // Generate request JSON to comment server\n    let req = null;\n    if (threads.length >= 3) {\n        // Channel video (workaround)\n        const threadId1 = threads[1]['id'];\n        const threadId2 = threads[2]['id'];\n        const keys = await reqThreadKey(threadId2).split('&');\n        const threadKey = keys[0];\n        const force184 = keys[1];\n        req = createCmtReqChannel(threadId1, threadId2, threadKey, force184, userId, userKey, timeRange);\n    } else {\n        // User video (workaround)\n        const threadId = threads[0]['id'];\n        req = createCmtReqUser(threadId, userId, userKey, timeRange);\n    }\n\n    let cmtJson = await reqCmtSvr(req);\n\n    return cmtJson;\n}\n\n\n//# sourceURL=webpack:///./src/js/reqCmtJson.js?");

/***/ }),

/***/ "./src/js/reqVideoDoc.js":
/*!*******************************!*\
  !*** ./src/js/reqVideoDoc.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return reqVideoDoc; });\nasync function reqVideoDoc(videoId) {\n    return new Promise((resolve, reject) => {\n        const url = `https://www.nicovideo.jp/watch/${videoId}`;\n\n        fetch(url).then((response) => {\n            return response.text();\n        }).then((htmlText) => {\n            // Convert html text to document\n            let parser = new DOMParser();\n            let doc = parser.parseFromString(htmlText, 'text/html');\n            resolve(doc);\n        }).catch((err) => {\n            reject(err);\n            //console.error(`[ERROR] Failed to GET request to ${url}`);\n            //console.error('url: ' + url);\n            //console.error('err: ', err);\n        });\n    });\n}\n\n\n//# sourceURL=webpack:///./src/js/reqVideoDoc.js?");

/***/ })

/******/ });