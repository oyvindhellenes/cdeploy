"use strict";angular.module("corsaneApp",["ngCookies","ngResource","ngSanitize","ui.bootstrap","ngAnimate","ui.sortable","summernote","ui.router","angularFileUpload"]).config(["$stateProvider","$urlRouterProvider","$httpProvider",function(a,b,c){b.otherwise("/"),a.state("home",{url:"/",templateUrl:"pages/home/home.html"}).state("search",{url:"/search/:id",templateUrl:"pages/search/search.html",controller:"SearchCtrl"}).state("playlist",{url:"/playlist",templateUrl:"pages/mycontent/mycontent.html"}).state("playlist.id",{url:"/:id",templateUrl:"pages/mycontent/mycontent.html"}).state("submit",{url:"/submit",templateUrl:"pages/submit/submit.html",controller:"SubmitCtrl"}).state("login",{url:"/login",templateUrl:"pages/login/login.html",controller:"LoginCtrl"}),c.interceptors.push("httpInterceptor")}]).constant("config",{apiBaseUrl:"https://test.corsane.com/api/"}).run(["api",function(a){a.init()}]),$("a").embedly({key:"66f17f93fa884646a88c25cc4a78e9f5"}),angular.module("corsaneApp").controller("HomeCtrl",["$scope","global","listService","$log","$location",function(a,b,c){a.setResource=b.setResource(),a.lists=b.lists(c.getLists()),a.listElements="",a.isPlaylist=b.isPlaylist()}]),angular.module("corsaneApp").controller("SearchCtrl",["$scope","$log","resourceService","global","$sce",function(a,b,c,d,e){a.searchRes={value:""};var f=c.get();f&&f.$promise.then(function(c){for(var d in c.resources)b.info("Log data: "+angular.toJson(c.resources[d])),c.resources[d].text&&"string"==typeof c.resources[d].text.text&&(c.resources[d].text.text=e.trustAsHtml(c.resources[d].text.text));a.searchRes.value=c.resources})}]),angular.module("corsaneApp").controller("SubmitCtrl",["$scope","resourceService","global","$upload","config","fileService","$log",function(a,b,c,d,e,f,g){a.toPlaylist=c.toPlaylist(),a.thisList=c.setList(),a.resource={name:"",url:"",type:"url",text:"",file:""},a.status={isFirstOpen:!0,isFirstDisabled:!1},a.options={height:300,focus:!0,toolbar:[["style",["bold","italic"]],["fontsize",["fontsize"]],["para",["ul","ol","paragraph"]],["misc",["fullscreen"]]]},a.submit=function(){a.resource.url.indexOf("youtube")>-1&&(a.resource.type="video"),b.post(a.resource.name,a.resource,a.resource.type,a.listElements),a.resource={name:"",url:"",type:"",text:""}},a.tab="url",a.setTab=function(b){a.resource.type=b,a.tab=b},a.tabIsSelected=function(b){return a.tab===b},a.showPic=function(){a.picture=f.get(1),g.info("data:"+angular.toJson(a.picture))},a.submitFile=function(){f.post(a.resource.file)}}]),angular.module("corsaneApp").directive("csUpload",["$parse","$log",function(a){return{restrict:"A",link:function(b,c,d){console.log(c),c.bind("change",function(){a(d.csUpload).assign(b,c[0].files[0]),b.$apply()})}}}]),angular.module("corsaneApp").controller("MyContentCtrl",["$scope","$log","listService","global","$filter","$location","$state","$stateParams","$sce",function(){}]),angular.module("corsaneApp").controller("LoginCtrl",["$scope","$location","$log","authService","$cookieStore","api",function(a,b,c,d,e,f){a.login=function(){var a={username:this.username,token:this.token},c=function(a){var c=a.token;f.init(c),e.put("token",c),b.path("/")},g=function(){};d.login(a).success(c).error(g)}}]),angular.module("corsaneApp").controller("PlaylistbarCtrl",["$scope","resourceService","$log","listService","global","$state","$anchorScroll","$location",function(a,b,c,d,e,f,g,h){a.indentLevel=function(a){return"indent"+a},a.showResource=function(b,d){if("list_section"==b.list_element_type)if(b.open){var f=[];for(var i in a.listElements.elements)c.info("x: "+i),a.listElements.elements[i].level>b.level&&(c.info("level hot?: "+a.listElements.elements[i].name),f.push(a.listElements.elements.indexOf(a.listElements.elements[i])));a.listElements.elements.splice(f[0],f.length),b.open=!1}else{for(var j in b.elements)a.listElements.elements.splice(d+1,0,b.elements[j]);b.open=!0}h.hash("element"+d),g(),a.idx.value=d,b&&(e.setResource(b),c.info("Playlist url: "+b.url+b.name+d),a.isSelected=function(a){return a===b?"selectedElement":""}),document.getElementById("listTable").focus()},a.toSubmit=function(){f.go("submit"),e.toPlaylist(!0)};var i="";a.$watch("listElements",function(a,b){if(a!=b&&void 0!=b&&void 0!=a.elements){for(var c=0;c<a.elements.length;c++)i=i+a.elements[c].list_element_id+",";i=i.slice(0,i.length-1);var f=e.setList();i&&(d.moveListElements(f.value,i),document.getElementById("listTable").focus())}i=""},!0),a.idx={value:""},a.keyPress=function(b){c.info("Why not?"+b),c.info("idx?"+a.idx),38==b&&0!=a.idx.value?(c.info("Up!"),a.showResource(a.listElements.elements[a.idx.value-1],a.idx.value-1)):40==b&&a.listElements.elements.length-1!=a.idx.value?(c.info("Down!"),a.showResource(a.listElements.elements[a.idx.value+1],a.idx.value+1)):13==b&&a.listElements.elements[a.idx.value]?window.open(a.listElements.elements[a.idx.value].url):c.info("Nothing")}}]),angular.module("corsaneApp").directive("playlistbar",["$log","$sce","listService",function(){return{restrict:"E",controller:"PlaylistbarCtrl",templateUrl:"components/playlistbar/playlistbar.html",link:function(){}}}]),angular.module("corsaneApp").controller("NavbarCtrl",["$scope","global","$location","resourceService","$state","$log","listService","$filter",function(a,b,c,d,e){a.search=function(e){b.isPlaylist(!1),c.path("/search/"+e),e&&d.search(e),a.searchTerm=""},a.goHome=function(){e.go("home")},a.isActive=function(a){var b="/none";return c.path().slice(0,9)==a&&(b=c.path().slice(0,9)),a===b}}]),angular.module("corsaneApp").directive("navbar",["$log","$sce","listService",function(){return{restrict:"E",controller:"NavbarCtrl",templateUrl:"components/navbar/navbar.html",link:function(){}}}]),angular.module("corsaneApp").controller("ResourceCtrl",["$scope","$log","global","listService",function(a,b,c,d){a.resource=c.setResource(),a.introduction="",a.isCollapsed=!0,a.isCollapsed2=!0,a.add={value:[]},a.add.value[0]=d.getLists();var e="";a.goToSub=function(b,c){d.getElementsToAdd(b,a.add),a.add.value=a.add.value.slice(0,c),e=b,a.isHighlighted=function(a){return a===e?"selected":""}},a.addToList=function(){var a=c.setResource();b.info("resource: "+a.value.id+"global: "+c.setResource()),d.addListElement(a.value,e)},a.boxChecked=!1,a.boxClicked=function(){b.info("Value: "+a.boxChecked)},a.editNote=!1,a.note="Description",a.onEnter=function(b){13==b&&(a.editNote=!1)},a.setResource=function(a){c.setResource(a)};var f=0,g=0;a.percentage=50,a.votes=0,a.vote=function(b){b?f+=1:g+=1,a.votes++,a.percentage=f/(f+g)*100},a.removeResource=function(e,f){b.info("$scope.playlist: "+c.setList()+"Index:"+f),d.removeListElement(e,c.setList(),f,a.listElements)}}]),angular.module("corsaneApp").directive("resource",["$log","$sce","listService",function(a,b){return{restrict:"E",scope:{element:"="},controller:"ResourceCtrl",templateUrl:"components/resource/resourceinfo.html",link:function(c){a.info("attrs: "+toString(c.element)+"+"+c.element.url),c.element.url=b.trustAsResourceUrl(String(c.element.url))}}}]),angular.module("corsaneApp").directive("youtube",function(){return{restrict:"E",scope:{movie:"@"},link:function(a,b){var c='<object width="500" height="325"><param name="movie" value="'+a.movie+'" /><param name="allowFullScreen" value="true" /><param name="allowscriptaccess" value="always" /><embed   src="'+a.movie+'"   type="application/x-shockwave-flash"   allowfullscreen="true"   allowscriptaccess="always"   width="500"   height="325" /></object>';b.replaceWith(c)}}}),angular.module("corsaneApp").directive("csCheckbox",["$log","$sce","listService",function(){return{restrict:"E",scope:{element:"="},template:"",link:function(){}}}]),angular.module("corsaneApp").directive("myplaylists",["$log","$sce","listService",function(){return{restrict:"E",controller:"MyPlaylistsCtrl",templateUrl:"components/myplaylists/myplaylists.html",link:function(){}}}]),angular.module("corsaneApp").controller("MyPlaylistsCtrl",["$scope","$log","listService","global","$filter","$location","$state","$stateParams","$sce",function(a,b,c,d,e,f,g,h,i){if(a.open=!1,a.thisList=d.setList(),b.info("Parms:"+h.id),h.id>0){var j=c.getLists();j.$promise.then(function(c){b.info("data:"+c[0].name);for(var d in c)b.info("el:"+c[d].id),c[d].id==h.id&&a.passPlaylist(c[d])})}a.passPlaylist=function(f){d.setResource(!1),a.listElements=c.getElements(f),a.listElements.$promise.then(function(b){for(var c in b.elements)b.elements[c].text&&(b.elements[c].text.text=i.trustAsHtml(b.elements[c].text.text));a.listElements.elements=e("orderBy")(b.elements,"index_in_list")}),d.setList(f),d.isPlaylist(!0),b.info("Open = "+a.open),g.go("playlist.id",{id:f.id})},a.createNewList=function(){c.addList();var a=d.lists();b.info("newlist: "+angular.toJson(a))},a.isActiveList=function(a){var b=f.path();return a==b.slice(b.length-1)},a.isEditable=!1,a.editName=function(c){b.info("tom?: "+c),a.isEditable?(a.isEditable=!1,b.info("False"+c.id)):c.section_id?(a.isEditable=c.section_id,b.info("Seksjon id?:"+c.section_id)):(b.info("Liste id?:"+c.id),a.isEditable=c.id)},a.setNewName=function(d,e){d.name=e,b.info("Navntest:"+e),c.changeListName(d,e),a.isEditable=!1},a.deleteAlert=function(e,f){b.info("Index: "+f);var g=confirm("Do you want to delete this playlist? "+f);g&&(e.section_id?(b.info("SlettTest"),c.removeListElement(e,d.setList(),f,a.listElements)):(c.removeList(e.id,f),b.info("SlettTest2")))},a.addSection=function(d){b.info("FunkId: "+d.id),c.addListSection(d,a.listElements)}}]),angular.module("corsaneApp").filter("reverse",function(){return function(a){return a.slice().reverse()}}),angular.module("corsaneApp").factory("resourceService",["$http","$log","$resource","$sce","listService","global","config",function(a,b,c,d,e,f,g){var h={value:null};return{post:function(c,d,h){var i="http",j="";d.url.substr(0,i.length)!==i&&(d.url=i+"://"+d.url,b.info("NewUrl "+d.url)),j="text"==h?"&text="+d.text:"&url="+d.url,b.info("tekst1: "+angular.toJson(j)),a.post(g.apiBaseUrl+"resources?name="+c+j+"&format="+h).success(function(a){var c=f.toPlaylist();if(b.info("tekst2: "+angular.toJson(a)),alert("Success"),c.value){var d=f.setList();e.addListElement(a,d.value)}}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},get:function(){return h.value},search:function(a){var b=c(g.apiBaseUrl+"searches/"+a,{id:"@id"},{query:{method:"GET",isArray:!1}});return h.value=b.query(),console.log("hva returneres?"+h.value.id),h}}}]),angular.module("corsaneApp").factory("listService",["$http","$log","$resource","$sce","global","config","$filter",function(a,b,c,d,e,f){return{addList:function(){a.post(f.apiBaseUrl+"lists/addlists?name=TestList").success(function(a){var c=e.lists();c.value.push(a),e.setList(a),b.info("It worked!"+a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},getLists:function(){var a=c(f.apiBaseUrl+"lists",{id:"@id"},{});return a.query()},addListElement:function(c,d){d.section_id?a.post(f.apiBaseUrl+"lists/addlistelements?resourceId="+c.id+"&listSectionId="+d.section_id).success(function(){}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)}):a.post(f.apiBaseUrl+"lists/addlistelements?resourceId="+c.id+"&listId="+d.id).success(function(){}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},changeListName:function(c,d){c.section_id?a.post(f.apiBaseUrl+"lists/editsections?listSectionId="+c.section_id+"&name="+d).success(function(a){b.info("It worked!"+a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)}):a.post(f.apiBaseUrl+"lists/editlists?listId="+c.id+"&name="+d).success(function(a){b.info("It worked!"+a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},removeList:function(c,d){a.post(f.apiBaseUrl+"lists/removelists?listId="+c).success(function(a){b.info("It worked!"+a);var c=e.lists();c.value.splice(d,1)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},removeListElement:function(c,d,e,g){a.post(f.apiBaseUrl+"lists/removelistelements?listElementId="+c.list_element_id+"&listId="+d.value.id).success(function(a){g.elements.splice(e,1),b.info("It worked!"+a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},addListSection:function(c,d){var g=e.setList();b.info("section_id: "+c.section_id);var h="";c.section_id&&(h="&parentSectionId="+c.section_id,b.info(h)),a.post(f.apiBaseUrl+"lists/addlistsections?listId="+g.value.id+"&name=SubList"+h).success(function(a){b.info("It worked!"+a),c.index_in_list?d.elements.splice(c.index_in_list+1,0,a):d.elements.push(a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},removeListSection:function(c,d,g){var h=e.setList();a.post(f.apiBaseUrl+"lists/removelistsections?listSectionId="+c.section_id+"&listId="+h.value.id).success(function(a){g.elements.splice(d,g.elements.length),b.info("It worked!"+a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},getElements:function(a){if(a.section_id)var b=c(f.apiBaseUrl+"lists/elementsinsection?sectionId="+a.section_id,{},{query:{method:"GET",isArray:!1}});else var b=c(f.apiBaseUrl+"lists/elementsinlist?listId="+a.id,{},{query:{method:"GET",isArray:!1}});return b.query()},getElementsToAdd:function(a,d){if(a.section_id)var e=c(f.apiBaseUrl+"lists/elementsinsection?sectionId="+a.section_id,{},{query:{method:"GET",isArray:!1}});else var e=c(f.apiBaseUrl+"lists/elementsinlist?listId="+a.id,{},{query:{method:"GET",isArray:!1}});e.query().$promise.then(function(a){b.info("data"+angular.toJson(a,"pretty"));var c=[];for(var e in a.elements)"list_section"==a.elements[e].list_element_type&&c.push(a.elements[e]);c.length>0&&d.value.push(c)})},moveListElement:function(c,d,e){c.section_id?a.post(f.apiBaseUrl+"lists/movelistelements?listElementId="+d.list_element_id+"&listSectionId="+c.section_id+"&indexInSection="+e).success(function(a){b.info("It worked!"+a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)}):a.post(f.apiBaseUrl+"lists/movelistelements?listElementId="+d.list_element_id+"&listId="+c.id+"&indexInList="+e).success(function(a){b.info("It worked!"+a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},moveListElements:function(c,d){a.post(f.apiBaseUrl+"lists/editpositionings?listId="+c.id+"&listElementIds="+d).success(function(a){b.info("It worked!"+a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})}}}]),angular.module("corsaneApp").factory("global",["$http","$log","$resource","$sce",function(a,b,c,d){var e={value:!1},f={value:!1},g={value:null},h={value:null},i={value:null};return{isPlaylist:function(a){return void 0!==a&&(e.value=a),b.info("Boool:"+e.value),e},setList:function(a){return a&&(h.value=a),h},setResource:function(a){return(a||a===!1)&&(g.value=a,g.value.url=d.trustAsResourceUrl(String(g.value.url))),g},lists:function(a){return a&&(i.value=a),i},toPlaylist:function(a){return a&&(f.value=a),f}}}]),angular.module("ui.sortable",[]).value("uiSortableConfig",{}).directive("uiSortable",["uiSortableConfig","$timeout","$log",function(a,b,c){return{require:"?ngModel",link:function(d,e,f,g){function h(a,b){return b&&"function"==typeof b?function(c,d){a(c,d),b(c,d)}:a}function i(a,b){var c=a.sortable("option","helper");return"clone"===c||"function"==typeof c&&b.item.sortable.isCustomHelperUsed()}var j,k={},l={receive:null,remove:null,start:null,stop:null,update:null},m={helper:null};return angular.extend(k,a,d.$eval(f.uiSortable)),angular.element.fn&&angular.element.fn.jquery?(g?(d.$watch(f.ngModel+".length",function(){b(function(){e.data("ui-sortable")&&e.sortable("refresh")})}),l.start=function(a,b){b.item.sortable={index:b.item.index(),cancel:function(){b.item.sortable._isCanceled=!0},isCanceled:function(){return b.item.sortable._isCanceled},isCustomHelperUsed:function(){return!!b.item.sortable._isCustomHelperUsed},_isCanceled:!1,_isCustomHelperUsed:b.item.sortable._isCustomHelperUsed}},l.activate=function(){j=e.contents();var a=e.sortable("option","placeholder");if(a&&a.element&&"function"==typeof a.element){var b=a.element();b=angular.element(b);var c=e.find('[class="'+b.attr("class")+'"]');j=j.not(c)}},l.update=function(a,b){b.item.sortable.received||(b.item.sortable.dropindex=b.item.index(),b.item.sortable.droptarget=b.item.parent(),e.sortable("cancel")),i(e,b)&&!b.item.sortable.received&&(j=j.not(j.last())),j.appendTo(e),b.item.sortable.received&&!b.item.sortable.isCanceled()&&d.$apply(function(){g.$modelValue.splice(b.item.sortable.dropindex,0,b.item.sortable.moved)})},l.stop=function(a,b){!b.item.sortable.received&&"dropindex"in b.item.sortable&&!b.item.sortable.isCanceled()?d.$apply(function(){g.$modelValue.splice(b.item.sortable.dropindex,0,g.$modelValue.splice(b.item.sortable.index,1)[0])}):"dropindex"in b.item.sortable&&!b.item.sortable.isCanceled()||i(e,b)||j.appendTo(e)},l.receive=function(a,b){b.item.sortable.received=!0},l.remove=function(a,b){"dropindex"in b.item.sortable||(e.sortable("cancel"),b.item.sortable.cancel()),b.item.sortable.isCanceled()||d.$apply(function(){b.item.sortable.moved=g.$modelValue.splice(b.item.sortable.index,1)[0]})},m.helper=function(a){return a&&"function"==typeof a?function(b,c){var d=a(b,c);return c.sortable._isCustomHelperUsed=c!==d,d}:a},d.$watch(f.uiSortable,function(a){e.data("ui-sortable")&&angular.forEach(a,function(a,b){l[b]?("stop"===b&&(a=h(a,function(){d.$apply()})),a=h(l[b],a)):m[b]&&(a=m[b](a)),e.sortable("option",b,a)})},!0),angular.forEach(l,function(a,b){k[b]=h(a,k[b])})):c.info("ui.sortable: ngModel not provided!",e),void e.sortable(k)):void c.error("ui.sortable: jQuery should be included before AngularJS!")}}}]),angular.module("corsaneApp").factory("authService",["$http","config",function(a,b){var c=b.apiBaseUrl;return{login:function(b){return a.post(c+"auth/checktokens?username="+b.username+"$token="+b.token)}}}]),angular.module("corsaneApp").factory("httpInterceptor",["$q","$location",function(a,b){return function(c){var d=function(a){return a},e=function(c){return 401===c.status&&b.url("/login"),a.reject(c)};return c.then(d,e)}}]),angular.module("corsaneApp").factory("api",["$http","$cookies",function(a,b){return{init:function(c){a.defaults.headers.common["X-Access-Token"]=c||b.token}}}]),angular.module("corsaneApp").factory("fileService",["$http","$log","$resource","global","config",function(a,b,c,d,e){return{post:function(c){var d=new FormData;d.append("file",c),b.info("data:"+angular.toJson(d)),a.post(e.apiBaseUrl+"files/files",d,{transformRequest:angular.identity,headers:{"Content-Type":void 0}}).success(function(a){b.info("It worked!"+angular.toJson(a))}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},get:function(a){var b=c(e.apiBaseUrl+"file/filedownload?fileId="+a,{},{query:{method:"GET",isArray:!1}});return b.query()}}}]);