"use strict";angular.module("corsaneApp",["ngCookies","ngResource","ngSanitize","ui.bootstrap","ngAnimate","ui.sortable","summernote","ui.router","angularFileUpload"]).config(["$stateProvider","$urlRouterProvider","$httpProvider",function(a,b,c){b.otherwise("/"),a.state("home",{url:"/",templateUrl:"pages/home/home.html"}).state("search",{url:"/search/:id",templateUrl:"pages/search/search.html",controller:"SearchCtrl"}).state("playlist",{url:"/playlist",templateUrl:"pages/mycontent/myplaylistpage.html"}).state("playlist.id",{url:"/:id",templateUrl:"pages/mycontent/myplaylistpage.html"}).state("submit",{url:"/submit",templateUrl:"pages/submit/submit.html",controller:"SubmitCtrl"}).state("profile",{url:"/profile",templateUrl:"pages/profile/profile.html",controller:"ProfileCtrl"}).state("topic",{url:"/topic/:id",templateUrl:"pages/topic/topic.html",controller:"TopicCtrl"}).state("login",{url:"/login",templateUrl:"pages/login/login.html",controller:"LoginCtrl"}),c.interceptors.push("httpInterceptor"),c.responseInterceptors.push(["$rootScope","$q","$injector","config",function(a,b,c,d){return function(e){return e.then(function(a){return a},function(e){if(401===e.status&&e.data.error&&"invalid_token"===e.data.error){var f=b.defer();return console.log("Trying refresh token"),c.get("$http").get(d.refresh_url+"oauth/v2/token?cb=JSON_CALLBACK").then(function(b){b.data?(console.log("Got data:"),console.log(b.data),a.oauth=b.data.oauth,c.get("$http")(e.config).then(function(a){f.resolve(a)},function(){f.reject()})):f.reject()},function(){f.reject(),console.log("Token retry failed. Routed to login"),c.get("$http").go("login")}),f.promise}return b.reject(e)})}}])}]).constant("config",{apiBaseUrl:"http://test.corsane.com/api/",baseUrl:"http://test.corsane.com/api/",client_id:"1_n53l8ne9d8gwswcwggsoog4sk4804csck8ow84owcgg0sg8ss",client_secret:"32dw2l922o84gccws88w80800sgss0ws044koggk0wwcocc8g0",refresh_url:this.baseUrl+"oauth/v2/token?client_id="+this.client_id+"&client_secret="+this.client_secret+"&grant_type=refresh_token&refresh_token="}).run(["api","$rootScope","$injector","$location","authService","$state",function(a,b,c){a.init(),c.get("$http").defaults.transformRequest=function(a,c){return b.oauth&&(c().Authorization="Bearer "+b.oauth.access_token),a?angular.toJson(a):void 0},b.$on("$locationChangeStart",function(){})}]),$("a").embedly({key:"66f17f93fa884646a88c25cc4a78e9f5"}),angular.module("corsaneApp").controller("HomeCtrl",["$scope","global","listService","$log","$location","topicService","$rootScope","authService","$state",function(a,b,c,d,e,f,g){a.setResource=b.setResource(),a.lists=b.lists(c.getLists()),d.info("lists"+angular.toJson(a.lists)),a.topics=f.getTopics(),a.listElements="",a.isPlaylist=b.isPlaylist(),g.user={},a.status={isFirstOpen:!0,isFirstDisabled:!1}}]),angular.module("corsaneApp").controller("SearchCtrl",["$scope","$log","resourceService","global","$sce",function(a,b,c,d){a.showSubmit=d.showSubmit(),a.showSubmitFunc=function(){a.showSubmit.value=!0,d.showSubmit(!0),b.info("Something")}}]),angular.module("corsaneApp").directive("csUpload",["$parse","$log",function(a){return{restrict:"A",link:function(b,c,d){console.log(c),c.bind("change",function(){a(d.csUpload).assign(b,c[0].files[0]),b.$apply()})}}}]),angular.module("corsaneApp").controller("MyContentCtrl",["$scope","$log","listService","global","$filter","$location","$state","$stateParams","$sce","topicService","$q",function(a,b,c,d,e,f,g,h,i,j,k){a.showSubmit=d.showSubmit(),a.showTopicForm=!1,a.showDiv={value:!1,index:""},a.showSubmitFunc=function(){a.showSubmit.value=!0,d.showSubmit(!0),b.info("Something")},a.addSection=function(a){c.addListSection(d.setList(),a)},a.isHover=function(b){a.showDiv.index==b&&(a.showDiv.value=!0)},a.saveOrder=function(a){var d="";for(var e in a)b.info(a[e].name),d=d+a[e].id+",";d=d.substring(0,d.length-1),b.info(d),c.moveListElements(a,d),d=""},a.topicName=a.thisSearch,a.topicDescription=" ",a.postTopic=function(){var b=k.defer(),c=j.post(a.topicName,a.topicDescription);return console.log("tmp"+c),b.resolve(c),b.promise},a.createNewTopic=function(){if(a.topicName&&a.topicDescription){var b=a.postTopic();console.log("tmp"+b)}else alert("Enter valid input");b.then(function(b){console.log("taaa"+b),a.search(b,!0)}),a.topicName="",a.topicDescription=" ",a.showTopicForm=!1}}]),angular.module("corsaneApp").controller("LoginCtrl",["$scope","$location","$log","authService","$cookieStore","api","$state","$rootScope","global",function(a,b,c,d,e,f,g,h){a.loginCredentials={},a.registerCredentials={},a.login=function(a){var b=function(a){h.oauth=a,d.user().success(function(a){h.user=a}).error(function(){c.info("Not working")}),c.info("funker det?"+angular.toJson(h.user)),c.info("funker det?"+angular.toJson(h.oauth)),g.go("home")},e=function(a){console.error("Login failed"),console.error(a)};d.login(a).success(b).error(e)},a.register=function(b){var c=function(){a.login(b)},e=function(a){console.error(a),console.error("Register failed")};d.register(b).success(c).error(e)},a.isLogin=function(a){return"leadText"==a}}]),angular.module("corsaneApp").controller("ProfileCtrl",["$scope","$location","$log","authService","$cookieStore","api","$state","$rootScope","global",function(){}]),angular.module("corsaneApp").controller("TopicCtrl",["$scope","$log","topicService","global","$sce","$stateParams",function(){}]),angular.module("corsaneApp").controller("SubmitCtrl",["$scope","resourceService","global","$upload","config","fileService","$log","topicService","listService",function(a,b,c,d,e,f,g){a.toPlaylist=c.toPlaylist(),a.thisList=c.setList(),a.showSubmit=c.showSubmit(),a.closeSubmit=function(){a.showSubmit.value=!1,c.showSubmit(!1)},a.resource={name:"",url:"",type:"url",text:"",file:""},a.status={isFirstOpen:!0,isFirstDisabled:!1},a.options={height:300,focus:!0,toolbar:[["style",["bold","italic"]],["fontsize",["fontsize"]],["para",["ul","ol","paragraph"]],["misc",["fullscreen"]]]},a.submit=function(c,d){a.resource.url.indexOf("youtube")>-1&&(a.resource.type="video"),g.info(angular.toJson(c)),b.post(a.resource.name,a.resource,a.resource.type,c,d),a.tab="url",a.resource={name:"",url:"",type:"url",text:""},a.showSubmit.value=!1},a.tab="url",a.setTab=function(b){a.resource.type=b,a.tab=b},a.tabIsSelected=function(b){return a.tab===b},a.showPic=function(){a.picture=f.get(1),g.info("data:"+angular.toJson(a.picture))},a.submitFile=function(){f.post(a.resource.file)}}]),angular.module("corsaneApp").directive("submit",["$log","$sce","listService",function(){return{restrict:"E",scope:{elements:"=",topic:"="},controller:"SubmitCtrl",templateUrl:"components/submit/submit.html",link:function(){}}}]),angular.module("corsaneApp").controller("PlaylistbarCtrl",["$scope","resourceService","$log","listService","global","$state","$anchorScroll","$location",function(a,b,c,d,e,f,g,h){a.indentLevel=function(a){return"indent"+a},a.showResource=function(b,d){if("list_section"==b.list_element_type)if(b.open){var f=[];for(var i in a.listElements.elements)c.info("x: "+i),a.listElements.elements[i].level>b.level&&(c.info("level hot?: "+a.listElements.elements[i].name),f.push(a.listElements.elements.indexOf(a.listElements.elements[i])));a.listElements.elements.splice(f[0],f.length),b.open=!1}else{for(var j in b.elements)a.listElements.elements.splice(d+1,0,b.elements[j]);b.open=!0}h.hash("element"+d),g(),a.idx.value=d,b&&(e.setResource(b),c.info("Playlist url: "+b.url+b.name+d),a.isSelected=function(a){return a===b?"selectedElement":""}),document.getElementById("listTable").focus()},a.toSubmit=function(){f.go("submit"),e.toPlaylist(!0)};var i="";a.$watch("listElements",function(a,b){if(a!=b&&void 0!=b&&void 0!=a.elements){for(var c=0;c<a.elements.length;c++)i=i+a.elements[c].list_element_id+",";i=i.slice(0,i.length-1);var f=e.setList();i&&(d.moveListElements(f.value,i),document.getElementById("listTable").focus())}i=""},!0),a.idx={value:""},a.keyPress=function(b){c.info("Why not?"+b),c.info("idx?"+a.idx),38==b&&0!=a.idx.value?(c.info("Up!"),a.showResource(a.listElements.elements[a.idx.value-1],a.idx.value-1)):40==b&&a.listElements.elements.length-1!=a.idx.value?(c.info("Down!"),a.showResource(a.listElements.elements[a.idx.value+1],a.idx.value+1)):13==b&&a.listElements.elements[a.idx.value]?window.open(a.listElements.elements[a.idx.value].url):c.info("Nothing")}}]),angular.module("corsaneApp").directive("playlistbar",["$log","$sce","listService",function(){return{restrict:"E",controller:"PlaylistbarCtrl",templateUrl:"components/playlistbar/playlistbar.html",link:function(){}}}]),angular.module("corsaneApp").controller("NavbarCtrl",["$scope","global","$location","resourceService","$state","$log","listService","$filter","topicService","$rootScope",function(a,b,c,d,e,f,g,h,i){a.search=function(c,g){if(b.isPlaylist(!1),a.searchRes=b.setSearchRes(),c){var h=d.search(c,g);h&&h.$promise.then(function(d){for(var g in d.resources)d.resources[g].text&&"string"==typeof d.resources[g].text.text&&(d.resources[g].text.text=$sce.trustAsHtml(d.resources[g].text.text));d.topicInfo?(f.info("Kom den igjennom?"),e.go("topic",{id:d.topicInfo.topicId})):(f.info("Eller kanskje her?"),e.go("search",{id:c})),a.searchRes.value=d.resources,a.searchRes.lists=d.lists,a.searchRes.topic=d.topicInfo,b.setSearchRes(a.searchRes.value)})}a.searchTerm="",a.shortPath="/none"},a.openAuto=function(){a.open=!0},a.goHome=function(){e.go("home")},a.shortPath="/none",a.isActive=function(b){return c.path().slice(0,9)==b&&(a.shortPath=c.path().slice(0,9)),b===a.shortPath};var j=0;a.isActiveTopic=function(a){return a==j},a.switchTopic=function(b){f.info("Why not?"+b),38==b?(f.info("Up!"),j+=-1):40==b?(f.info("Down!"),j+=1):(13==b||0==b)&&(f.info(a.autoResult+a.searchTerm+a.auto),a.search(a.autoResult.length>0?a.autoResult[j].name:a.searchTerm),a.autoResult="")},a.autoResult="",a.auto="",a.newInput=function(b){a.autoResult=i.autocomplete(b)},a.searchType={type:""}}]),angular.module("corsaneApp").directive("navbar",["$log","$sce","listService",function(){return{restrict:"E",controller:"NavbarCtrl",templateUrl:"components/navbar/navbar.html",link:function(){}}}]),angular.module("corsaneApp").controller("ResourceCtrl",["$scope","$log","global","listService",function(a,b,c,d){a.resource=c.setResource(),a.introduction="",a.isCollapsed=!0,a.isCollapsed2=!0,a.add={value:[]},a.add.value[0]=d.getLists();var e="";a.goToSub=function(b,c){d.getElementsToAdd(b,a.add),a.add.value=a.add.value.slice(0,c),e=b,a.isHighlighted=function(a){return a===e?"selected":""}},a.addToList=function(){var a=c.setResource();b.info("resource: "+a.value.id+"global: "+c.setResource()),d.addListElement(a.value,e)},a.boxChecked=!1,a.boxClicked=function(){b.info("Value: "+a.boxChecked)},a.editNote=!1,a.note="Description",a.onEnter=function(b){13==b&&(a.editNote=!1)},a.setResource=function(a){c.setResource(a)};var f=0,g=0;a.percentage=50,a.votes=0,a.vote=function(b){b?f+=1:g+=1,a.votes++,a.percentage=f/(f+g)*100},a.removeResource=function(a,e,f){b.info("$scope.playlist: "+c.setList()+"Index:"+e),d.removeListElement(a,c.setList(),e,f)},a.deleteAlert=function(a,e,f){b.info("Index: "+e),a.section_id?(b.info("SlettTest"),d.removeListElement(a,c.setList(),e,f)):(d.removeList(a.id,e),b.info("SlettTest2"))},a.isEditable=!1,a.editName=function(c){b.info("tom?: "+c),a.isEditable?(a.isEditable=!1,b.info("False"+c.id)):c.section_id?(a.isEditable=c.section_id,b.info("Seksjon id?:"+c.section_id)):(b.info("Liste id?:"+c.id),a.isEditable=c.id)},a.setNewName=function(c,e){c.name=e,b.info("Navntest:"+e),d.changeListName(c,e),a.isEditable=!1}}]),angular.module("corsaneApp").directive("resource",["$log","$sce","listService",function(a,b){return{restrict:"E",scope:{element:"=",elements:"=",index:"="},controller:"ResourceCtrl",templateUrl:"components/resource/resourceinfo.html",link:function(c){a.info("attrs: "+toString(c.element)+"+"+c.element.url),c.element.url=b.trustAsResourceUrl(String(c.element.url))}}}]),angular.module("corsaneApp").directive("youtube",function(){return{restrict:"E",scope:{movie:"@"},link:function(a,b){var c='<object width="500" height="325"><param name="movie" value="'+a.movie+'" /><param name="allowFullScreen" value="true" /><param name="allowscriptaccess" value="always" /><embed   src="'+a.movie+'"   type="application/x-shockwave-flash"   allowfullscreen="true"   allowscriptaccess="always"   width="500"   height="325" /></object>';b.replaceWith(c)}}}),angular.module("corsaneApp").directive("csCheckbox",["$log","$sce","listService",function(){return{restrict:"E",scope:{element:"="},template:"",link:function(){}}}]),angular.module("corsaneApp").directive("myplaylists",["$log","$sce","listService",function(){return{restrict:"E",controller:"MyPlaylistsCtrl",templateUrl:"components/myplaylists/myplaylists.html",link:function(){}}}]),angular.module("corsaneApp").controller("MyPlaylistsCtrl",["$scope","$log","listService","global","$filter","$location","$state","$stateParams","$sce",function(a,b,c,d,e,f,g,h,i){if(a.open=!1,a.thisList=d.setList(),h.id>0&&f.path().indexOf("playlist")>0){var j=c.getLists();j.$promise.then(function(b){for(var c in b)b[c].id==h.id&&a.passPlaylist(b[c])})}a.passPlaylist=function(f){d.setResource(null),a.listElements=c.getElements(f),a.listElements.$promise.then(function(b){for(var c in b.elements)b.elements[c].text&&(b.elements[c].text.text=i.trustAsHtml(b.elements[c].text.text));a.listElements.elements=e("orderBy")(b.elements,"index_in_list"),a.listElements.numberOfElements=b.elements.length}),d.setList(f),d.isPlaylist(!0),b.info("Open = "+a.open),g.go("playlist.id",{id:f.id})},a.createNewList=function(){c.addList();var a=d.lists();b.info("newlist: "+angular.toJson(a))},a.isActiveList=function(a){var b=f.path();return a==b.slice(b.length-1)},a.isEditable=!1,a.editName=function(c){b.info("tom?: "+c),a.isEditable?(a.isEditable=!1,b.info("False"+c.id)):c.section_id?(a.isEditable=c.section_id,b.info("Seksjon id?:"+c.section_id)):(b.info("Liste id?:"+c.id),a.isEditable=c.id)},a.setNewName=function(d,e){d.name=e,b.info("Navntest:"+e),c.changeListName(d,e),a.isEditable=!1},a.deleteAlert=function(e,f){b.info("Index: "+f);var g=confirm("Do you want to delete this playlist? "+f);g&&(e.section_id?(b.info("SlettTest"),c.removeListElement(e,d.setList(),f,a.listElements)):(c.removeList(e.id,f),b.info("SlettTest2")))}}]),angular.module("corsaneApp").controller("MyTopicsCtrl",["$scope","$log","listService","global","$filter","$location","$state","$stateParams","$sce","topicService",function(a,b,c,d,e,f,g,h,i,j){a.topicElements=null,a.passTopic=function(c){d.setTopic(c);var e=j.getTopicElements(c.id);e.$promise.then(function(c){b.info(angular.toJson(c)),a.topicElements=c.resources}),g.go("topic.id",{id:c.id})},a.isActiveTopic=function(a){var b=f.path();return a==b.slice(b.length-1)}}]),angular.module("corsaneApp").directive("mytopics",["$log","$sce","listService",function(){return{restrict:"E",controller:"MyTopicsCtrl",templateUrl:"components/mytopics/mytopics.html",link:function(){}}}]),angular.module("corsaneApp").controller("topicbarCtrl",["$scope","$log","listService","global","$filter","$location","$state","$stateParams","$sce","topicService","resourceService",function(a,b,c,d,e,f,g,h,i,j,k){a.showDescription=!1,a.showPlaylists=!1,a.showSubtopics=!1,a.thisTopic=d.setTopic(),a.thisSearch=k.searchTerm(),a.mylists=d.lists(),a.openPlaylist=function(f){var g="",h=d.setSearchRes();b.info("test:"+angular.toJson(h.value)),g=c.getElements(f),g.$promise.then(function(a){for(var b in a.elements)a.elements[b].text&&(a.elements[b].text.text=i.trustAsHtml(a.elements[b].text.text));h.value=e("orderBy")(a.elements,"index_in_list")}),a.isActiveList=function(a){return f.id==a}},a.addPlaylist=function(a,b){a&&b.topicId&&j.addPlaylist(b.topicId,a)}}]),angular.module("corsaneApp").directive("topicbar",["$log","$sce","listService",function(){return{restrict:"E",scope:{lists:"=",topic:"="},controller:"topicbarCtrl",templateUrl:"components/topicbar/topicbar.html",link:function(){}}}]),angular.module("corsaneApp").filter("reverse",function(){return function(a){return a.slice().reverse()}}),angular.module("corsaneApp").factory("resourceService",["$http","$log","$resource","$sce","listService","global","config","topicService",function(a,b,c,d,e,f,g){var h={value:null},i={value:null};return{post:function(c,d,h,i,j){var k="http",l="";d.url.substr(0,k.length)!==k&&(d.url=k+"://"+d.url,b.info("NewUrl "+d.url)),l="text"==h?"&text="+d.text:"&url="+d.url,b.info("tekst1: "+angular.toJson(l)),a.post(g.apiBaseUrl+"resources?name="+c+l+"&format="+h+"&topicId="+j).success(function(a){f.toPlaylist();if(j)i.push(a);else{var b=f.setList();e.addListElement(a,b.value),i.push(a)}}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},get:function(){return h.value},search:function(a,b){if(i.value=a,b)var d=c(g.apiBaseUrl+"searches?topicId="+a,{id:"@id"},{query:{method:"GET",isArray:!1}});else var d=c(g.apiBaseUrl+"searches?querystring="+a,{id:"@id"},{query:{method:"GET",isArray:!1}});return h.value=d.query(),console.log("hva returneres?"+h.value.id),h.value},searchTerm:function(){return i.value}}}]),angular.module("corsaneApp").factory("listService",["$http","$log","$resource","$sce","global","config","$filter",function(a,b,c,d,e,f){return{addList:function(){a.post(f.apiBaseUrl+"lists/addlists?name=NewList").success(function(a){var c=e.lists();c.value.push(a),e.setList(a),b.info("It worked!"+a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},getLists:function(){var a=c(f.apiBaseUrl+"lists",{id:"@id"},{});return a.query()},addListElement:function(c,d){d.section_id?a.post(f.apiBaseUrl+"lists/addlistelements?resourceId="+c.id+"&listSectionId="+d.section_id).success(function(){}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)}):a.post(f.apiBaseUrl+"lists/addlistelements?resourceId="+c.id+"&listId="+d.id).success(function(){}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},changeListName:function(c,d){c.section_id?a.post(f.apiBaseUrl+"lists/editsections?listSectionId="+c.section_id+"&name="+d).success(function(a){b.info("It worked!"+a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)}):a.post(f.apiBaseUrl+"lists/editlists?listId="+c.id+"&name="+d).success(function(a){b.info("It worked!"+a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},removeList:function(c,d){a.post(f.apiBaseUrl+"lists/removelists?listId="+c).success(function(a){b.info("It worked!"+a);var c=e.lists();c.value.splice(d,1)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},removeListElement:function(c,d,e,g){a.post(f.apiBaseUrl+"lists/removelistelements?listElementId="+c.list_element_id+"&listId="+d.value.id).success(function(a){g.splice(e,1),b.info("It worked!"+a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},addListSection:function(c,d){var g=e.setList();b.info("section_id: "+c.section_id);var h="";c.section_id&&(h="&parentSectionId="+c.section_id,b.info(h)),a.post(f.apiBaseUrl+"lists/addlistsections?listId="+g.value.id+"&name=SubList"+h).success(function(a){b.info("It worked!"+a),c.index_in_list?d.splice(c.index_in_list+1,0,a):d.push(a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},removeListSection:function(c,d,g){var h=e.setList();a.post(f.apiBaseUrl+"lists/removelistsections?listSectionId="+c.section_id+"&listId="+h.value.id).success(function(a){g.splice(d,g.length),b.info("It worked!"+a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},getElements:function(a){if(a.section_id)var b=c(f.apiBaseUrl+"lists/elementsinsection?sectionId="+a.section_id,{},{query:{method:"GET",isArray:!1}});else var b=c(f.apiBaseUrl+"lists/elementsinlist?listId="+a.id,{},{query:{method:"GET",isArray:!1}});return b.query()},getElementsToAdd:function(a,d){if(a.section_id)var e=c(f.apiBaseUrl+"lists/elementsinsection?sectionId="+a.section_id,{},{query:{method:"GET",isArray:!1}});else var e=c(f.apiBaseUrl+"lists/elementsinlist?listId="+a.id,{},{query:{method:"GET",isArray:!1}});e.query().$promise.then(function(a){b.info("data"+angular.toJson(a,"pretty"));var c=[];for(var e in a.elements)"list_section"==a.elements[e].list_element_type&&c.push(a.elements[e]);c.length>0&&d.value.push(c)})},moveListElement:function(c,d,e){c.section_id?a.post(f.apiBaseUrl+"lists/movelistelements?listElementId="+d.list_element_id+"&listSectionId="+c.section_id+"&indexInSection="+e).success(function(a){b.info("It worked!"+a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)}):a.post(f.apiBaseUrl+"lists/movelistelements?listElementId="+d.list_element_id+"&listId="+c.id+"&indexInList="+e).success(function(a){b.info("It worked!"+a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},moveListElements:function(c,d){a.post(f.apiBaseUrl+"lists/editpositionings?listId="+c.id+"&listElementIds="+d).success(function(a){b.info("It worked!"+a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})}}}]),angular.module("corsaneApp").factory("global",["$http","$log","$resource","$sce",function(a,b,c,d){var e={value:!1},f={value:!1},g={value:null},h={value:null},i={value:null},j={value:null},k={value:!1},l={value:"",lists:"",topic:""},m={value:null},n={value:""};return{isPlaylist:function(a){return void 0!==a&&(e.value=a),b.info("Boool:"+e.value),e},setList:function(a){return a&&(h.value=a),h},setResource:function(a){return(a||a===!1)&&(g.value=a,g.value.url=d.trustAsResourceUrl(String(g.value.url))),g},lists:function(a){return a&&(i.value=a),i},toPlaylist:function(a){return a&&(f.value=a),f},setTopic:function(a){return a&&(j.value=a),j},showSubmit:function(a){return a&&(k.value=a),k},setSearchRes:function(a){return a&&(l.value=a),l},user:function(a){return a&&(m.value=a),m},topicId:function(a){return a&&(n.value=a),n}}}]),angular.module("ui.sortable",[]).value("uiSortableConfig",{}).directive("uiSortable",["uiSortableConfig","$timeout","$log",function(a,b,c){return{require:"?ngModel",link:function(d,e,f,g){function h(a,b){return b&&"function"==typeof b?function(c,d){a(c,d),b(c,d)}:a}function i(a,b){var c=a.sortable("option","helper");return"clone"===c||"function"==typeof c&&b.item.sortable.isCustomHelperUsed()}var j,k={},l={receive:null,remove:null,start:null,stop:null,update:null},m={helper:null};return angular.extend(k,a,d.$eval(f.uiSortable)),angular.element.fn&&angular.element.fn.jquery?(g?(d.$watch(f.ngModel+".length",function(){b(function(){e.data("ui-sortable")&&e.sortable("refresh")})}),l.start=function(a,b){b.item.sortable={index:b.item.index(),cancel:function(){b.item.sortable._isCanceled=!0},isCanceled:function(){return b.item.sortable._isCanceled},isCustomHelperUsed:function(){return!!b.item.sortable._isCustomHelperUsed},_isCanceled:!1,_isCustomHelperUsed:b.item.sortable._isCustomHelperUsed}},l.activate=function(){j=e.contents();var a=e.sortable("option","placeholder");if(a&&a.element&&"function"==typeof a.element){var b=a.element();b=angular.element(b);var c=e.find('[class="'+b.attr("class")+'"]');j=j.not(c)}},l.update=function(a,b){b.item.sortable.received||(b.item.sortable.dropindex=b.item.index(),b.item.sortable.droptarget=b.item.parent(),e.sortable("cancel")),i(e,b)&&!b.item.sortable.received&&(j=j.not(j.last())),j.appendTo(e),b.item.sortable.received&&!b.item.sortable.isCanceled()&&d.$apply(function(){g.$modelValue.splice(b.item.sortable.dropindex,0,b.item.sortable.moved)})},l.stop=function(a,b){!b.item.sortable.received&&"dropindex"in b.item.sortable&&!b.item.sortable.isCanceled()?d.$apply(function(){g.$modelValue.splice(b.item.sortable.dropindex,0,g.$modelValue.splice(b.item.sortable.index,1)[0])}):"dropindex"in b.item.sortable&&!b.item.sortable.isCanceled()||i(e,b)||j.appendTo(e)},l.receive=function(a,b){b.item.sortable.received=!0},l.remove=function(a,b){"dropindex"in b.item.sortable||(e.sortable("cancel"),b.item.sortable.cancel()),b.item.sortable.isCanceled()||d.$apply(function(){b.item.sortable.moved=g.$modelValue.splice(b.item.sortable.index,1)[0]})},m.helper=function(a){return a&&"function"==typeof a?function(b,c){var d=a(b,c);return c.sortable._isCustomHelperUsed=c!==d,d}:a},d.$watch(f.uiSortable,function(a){e.data("ui-sortable")&&angular.forEach(a,function(a,b){l[b]?("stop"===b&&(a=h(a,function(){d.$apply()})),a=h(l[b],a)):m[b]&&(a=m[b](a)),e.sortable("option",b,a)})},!0),angular.forEach(l,function(a,b){k[b]=h(a,k[b])})):c.info("ui.sortable: ngModel not provided!",e),void e.sortable(k)):void c.error("ui.sortable: jQuery should be included before AngularJS!")}}}]),angular.module("corsaneApp").factory("authService",["$http","config","$rootScope",function(a,b,c){return{login:function(c){var d=b.baseUrl+"oauth/v2/token?client_id="+b.client_id+"&client_secret="+b.client_secret+"&grant_type=password&";return d+="username="+c.username,d+="&password="+c.password,a.get(d)},register:function(c){return a.post(b.baseUrl+"apiregister/users",{username:c.username,plainPassword:c.password,email:c.email})},user:function(){console.log(angular.toJson(c.oauth));var d=b.baseUrl+"api/user?";return a.get(d)}}}]),angular.module("corsaneApp").factory("httpInterceptor",["$q","$location",function(a,b){return function(c){var d=function(a){return a},e=function(c){return 401===c.status&&b.url("/login"),a.reject(c)};return c.then(d,e)}}]),angular.module("corsaneApp").factory("api",["$http","$cookies",function(){return{init:function(){}}}]),angular.module("corsaneApp").factory("fileService",["$http","$log","$resource","global","config",function(a,b,c,d,e){return{post:function(c){var d=new FormData;d.append("file",c),b.info("data:"+angular.toJson(d)),a.post(e.apiBaseUrl+"files/files",d,{transformRequest:angular.identity,headers:{"Content-Type":void 0}}).success(function(a){b.info("It worked!"+angular.toJson(a))}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},get:function(a){var b=c(e.apiBaseUrl+"file/filedownload?fileId="+a,{},{query:{method:"GET",isArray:!1}});return b.query()}}}]),angular.module("corsaneApp").factory("topicService",["$http","$log","$resource","$sce","listService","global","config",function(a,b,c,d,e,f,g){return{post:function(c,d){var e={value:""};a.post(g.apiBaseUrl+"topics?name="+c+"&description="+d).success(function(a){return e.value=a.topicId,console.log("ti"+a.topicId),e.value}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)}),console.log("tid"+e)},getTopics:function(a){if(a)var b=c(g.apiBaseUrl+"topic?id="+a,{id:"@id"},{query:{method:"GET",isArray:!0}});else var b=c(g.apiBaseUrl+"topic",{id:"@id"},{query:{method:"GET",isArray:!0}});return b.query()},addResource:function(c,d){a.post(g.apiBaseUrl+"topics/addtotopics?topicId="+c+"&resourceId="+d).success(function(){alert("Success")}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},addPlaylist:function(c,d){a.post(g.apiBaseUrl+"topics/addtotopics?topicId="+c+"&listId="+d.id).success(function(){var a=f.setSearchRes();a.lists.push(d),b.info("data"+angular.toJson(d))}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},getTopicElements:function(a){var b=c(g.apiBaseUrl+"searches?topicId="+a,{id:"@id"},{query:{method:"GET",isArray:!1}});return b.query()},autocomplete:function(a){var b=c(g.apiBaseUrl+"searches/"+a+"/autocomplete",{id:"@id"},{query:{method:"GET",isArray:!0}});return b.query()}}}]),angular.module("corsaneApp").directive("addresource",["$log","$sce","listService",function(){return{restrict:"E",controller:"MyContentCtrl",template:'<p id="addresource" ng-click="showSubmitFunc()"><span class="glyphicon glyphicon-plus"></span> Add New Resource </p>',link:function(){}}}]),angular.module("corsaneApp").directive("addsection",["$log","$sce","listService",function(){return{restrict:"E",scope:{elements:"="},controller:"MyContentCtrl",template:'<button type="button" ng-click="addSection(elements)" class="btn btn-success"><span class="glyphicon glyphicon-plus"></span> Add new section </button>',link:function(){}}}]),angular.module("corsaneApp").directive("addplaylist",["$log","$sce","listService",function(){return{restrict:"E",controller:"MyContentCtrl",template:'<p id="addplaylist" ng-click=""><span class="glyphicon glyphicon-plus"></span> Add playlist </p>',link:function(){}}}]),angular.module("corsaneApp").controller("ModalCtrl",["$scope","$log","listService","global","$filter","$location","$state","$stateParams","$sce","topicService",function(){}]),angular.module("corsaneApp").directive("modal",["$log","$sce","listService",function(){return{restrict:"E",scope:{name:"=",title:"=",modid:"=",style:"="},templateUrl:"commons/addons/modal/modal.html",transclude:!0,controller:"topicbarCtrl"}}]),angular.module("corsaneApp").directive("addtopic",["$log","$sce","listService",function(){return{restrict:"E",controller:"MyContentCtrl",templateUrl:"commons/addons/addtopic/addtopic.html",link:function(){}}}]);