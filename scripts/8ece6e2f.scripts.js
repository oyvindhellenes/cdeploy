"use strict";angular.module("corsaneApp",["ngCookies","ngResource","ngSanitize","ngRoute","ui.bootstrap","ngAnimate","ui.sortable","summernote"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/home.html",controller:"HomeCtrl"}).when("/search",{templateUrl:"views/home.html",controller:"SearchCtrl"}).when("/submit",{templateUrl:"views/submit.html",controller:"SubmitCtrl"}).when("/playlist",{templateUrl:"views/home.html",controller:"PlaylistCtrl"}).when("/playlistbar",{templateUrl:"views/playlistbar.html",controller:"PlaylistbarCtrl"}).when("/resource",{templateUrl:"views/resource.html",controller:"ResourceCtrl"}).otherwise({redirectTo:"/"})}]).constant("config",{apiBaseUrl:"http://localhost:8888/Corsane/web/app_dev.php/api/"}),angular.module("corsaneApp").controller("HomeCtrl",["$scope","global",function(a,b){a.setResource=b.setResource(),a.isPlaylist=b.isPlaylist(),a.searchTab=b.searchTab(),a.playlistTab=b.playlistTab(),a.submitTab=b.submitTab()}]),angular.module("corsaneApp").controller("PlaylistCtrl",["$scope","resource","$log","list","global",function(a,b,c,d,e){a.showResource=function(d){b.show(d),c.info("Playlist url: "+d.url+d.name),a.isSelected=function(a){return a===d?"info":""}},a.removeResource=function(b,f){c.info("$scope.playlist: "+e.setList()+"Index:"+f),d.removeListElement(b,e.setList(),f,a.result)},a.toSubmit=function(){e.submitTab(!0),e.toPlaylist(!0)};var f="";a.$watch("result",function(a,b){if(a!=b&&void 0!=b){for(var c=0;c<a.length;c++)f=f+a[c].list_element_id+",";f=f.slice(0,f.length-1);var g=e.setList();d.moveListElements(g.value,f)}f=""},!0)}]),angular.module("corsaneApp").filter("reverse",function(){return function(a){return a.slice().reverse()}}),angular.module("corsaneApp").controller("SearchCtrl",["$scope","$log","resource","global",function(a,b,c,d){d.setResource(null),a.showResource=function(e){d.isPlaylist(!1),b.info("$scope.playlist"+a.playlist),c.show(e),a.isSelected=function(a){return a===e?"info":""}},a.resources=c.get()}]),angular.module("corsaneApp").controller("SubmitCtrl",["$scope","resource","global",function(a,b,c){a.toPlaylist=c.toPlaylist(),a.thisList=c.setList(),a.oneAtATime=!0,a.resource={name:"",url:"",type:"",text:""},a.status={isFirstOpen:!0,isFirstDisabled:!1},a.options={height:300,focus:!0,toolbar:[["style",["bold","italic"]],["fontsize",["fontsize"]],["para",["ul","ol","paragraph"]],["misc",["fullscreen"]]]},a.submit=function(){b.post(a.resource.name,a.resource.url,a.resource.type,a.result),a.resource={name:"",url:"",type:"",text:""}}}]),angular.module("corsaneApp").controller("NavbarCtrl",["$scope","global","$location","resource",function(a,b,c,d){a.search=function(e){b.isPlaylist(!1),b.searchTab(!0),c.path("/search").search(e),d.search(e),a.searchTerm=""}}]),angular.module("corsaneApp").factory("resource",["$http","$log","$resource","$sce","list","global","config",function(a,b,c,d,e,f,g){var h=null;return{post:function(c,d,h,i){var j="http";d.substr(0,j.length)!==j&&(d=j+"://"+d,b.info("NewUrl "+d)),a.post(g.apiBaseUrl+"resources?name="+c+"&url="+d+"&format="+h).success(function(a){var c=f.toPlaylist();if(b.info("Data"+a.url+a.name+"Bool"+c.value),alert("Success"),c.value){var d=f.setList();e.addListElement(a,d.value),i.push(a)}}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},get:function(){return h},search:function(a){var b=c(g.apiBaseUrl+"resources/"+a,{id:"@id"},{});h=b.query()},show:function(a){b.info("Playlist id Test: "+a.resource_id),b.info("Playlist id Test2: "+a.name),b.info("Playlist id Test2: "+a.url),f.setResource(a)}}}]),angular.module("corsaneApp").controller("PlaylistbarCtrl",["$scope","$log","list","global","$filter",function(a,b,c,d,e){a.lists=d.lists(c.getLists()),a.addPlaylist=function(){c.addList()};var f={name:"Playlists"};a.rootList={value:[f]},a.goTo=function(e,g){var h=!1;b.info("Index: "+g),"Playlists"===e.name?(b.info("I clicked Playlists!"),a.rootList.value=[f],a.lists=d.lists(c.getLists())):(b.info("I clicked TestList!"),a.lists=d.lists(c.getElements(e,h,a.rootList)),a.rootList.value=a.rootList.value.slice(0,g+1))},a.result="",a.passPlaylist=function(b){var f=!0;d.setResource(!1),a.res=c.getElements(b,f,a.rootList),a.res.$promise.then(function(b){a.result=e("orderBy")(b.elements,"index_in_list")}),d.setList(b),d.isPlaylist(!0),a.isSelected=function(a){return a===b?"info":""},a.clickedId=b.id},a.isEditable=!1,a.editName=function(c){a.isEditable?(a.isEditable=!1,b.info("False"+c.id)):c.section_id?(a.isEditable=c.section_id,b.info("Seksjon id?:"+c.section_id)):(b.info("Liste id?:"+c.id),a.isEditable=c.id)},a.setNewName=function(d,e){d.name=e,b.info("Navntest:"+e),c.changeListName(d,e),a.isEditable=!1},a.deleteAlert=function(d,e){b.info("Index: "+e);var f=confirm("Do you want to delete this playlist? "+e);f&&(a.rootList.value[1]?(b.info("SlettTest"),c.removeListSection(a.rootList.value[1],d,e)):(c.removeList(d.id,e),b.info("SlettTest2")))},a.addSection=function(d,e){b.info("FunkId: "+d.id),c.addListSection(d,a.rootList),a.passPlaylist(d,e)}}]),angular.module("corsaneApp").controller("ResourceCtrl",["$scope","$log","global","list",function(a,b,c,d){a.resource=c.setResource(),a.isCollapsed=!0,a.add={value:[]},a.add.value[0]=d.getLists(),a.goToSub=function(b,e){d.getElementsToAdd(b,a.add),a.add.value=a.add.value.slice(0,e),c.setList(b),a.isHighlighted=function(a){return a===b?"selected":""}},a.addToList=function(){var a=c.setResource(),e=c.setList();b.info("resource: "+a.value.id+"global: "+c.setResource()),d.addListElement(a.value,e.value)}}]),angular.module("corsaneApp").factory("list",["$http","$log","$resource","$sce","global","config","$filter",function(a,b,c,d,e,f){return{addList:function(){a.post(f.apiBaseUrl+"lists/addlists?name=TestList").success(function(a){var c=e.lists();c.value.push(a),b.info("It worked!"+a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},getLists:function(){var a=c(f.apiBaseUrl+"lists",{id:"@id"},{});return a.query()},addListElement:function(c,d){d.section_id?a.post(f.apiBaseUrl+"lists/addlistelements?resourceId="+c.id+"&listSectionId="+d.section_id+"&type=resource").success(function(){}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)}):a.post(f.apiBaseUrl+"lists/addlistelements?resourceId="+c.id+"&listId="+d.id+"&type=resource").success(function(){}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},changeListName:function(c,d){c.section_id?a.post(f.apiBaseUrl+"lists/editsections?listSectionId="+c.section_id+"&name="+d).success(function(a){b.info("It worked!"+a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)}):a.post(f.apiBaseUrl+"lists/editlists?listId="+c.id+"&name="+d).success(function(a){b.info("It worked!"+a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},removeList:function(c,d){a.post(f.apiBaseUrl+"lists/removelists?listId="+c).success(function(a){b.info("It worked!"+a);var c=e.lists();c.value.splice(d,1)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},removeListElement:function(c,d,e,g){a.post(f.apiBaseUrl+"lists/removelistelements?listElementId="+c.list_element_id+"&listId="+d.value.id).success(function(a){g.splice(e,1),b.info("It worked!"+a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},addListSection:function(c,d){b.info("section_id: "+c.section_id);var e="";c.section_id&&(e="&parentSectionId="+c.section_id,b.info(e)),d.value[1]&&(c=d.value[1],b.info("rootList.value[1]"+d.value[1])),a.post(f.apiBaseUrl+"lists/addlistsections?listId="+c.id+"&name=SubList"+e).success(function(a){b.info("It worked!"+a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},removeListSection:function(c,d,g){a.post(f.apiBaseUrl+"lists/removelistsections?listSectionId="+d.section_id+"&listId="+c.id).success(function(a){var c=e.lists();c.value.splice(g,1),b.info("It worked!"+a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},getElements:function(a,b,d){if(a.section_id)var g=c(f.apiBaseUrl+"lists/elementsinsection?sectionId="+a.section_id,{},{query:{method:"GET",isArray:!1}});else var g=c(f.apiBaseUrl+"lists/elementsinlist?listId="+a.id,{},{query:{method:"GET",isArray:!1}});return g.query().$promise.then(function(c){c.sections.length>0&&(e.lists(c.sections),b&&d.value.push(a))}),g.query()},getElementsToAdd:function(a,b){if(a.section_id)var d=c(f.apiBaseUrl+"lists/elementsinsection?sectionId="+a.section_id,{},{query:{method:"GET",isArray:!1}});else var d=c(f.apiBaseUrl+"lists/elementsinlist?listId="+a.id,{},{query:{method:"GET",isArray:!1}});d.query().$promise.then(function(a){a.sections.length>0&&b.value.push(a.sections)})},moveListElement:function(c,d,e){c.section_id?a.post(f.apiBaseUrl+"lists/movelistelements?listElementId="+d.list_element_id+"&listSectionId="+c.section_id+"&indexInSection="+e).success(function(a){b.info("It worked!"+a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)}):a.post(f.apiBaseUrl+"lists/movelistelements?listElementId="+d.list_element_id+"&listId="+c.id+"&indexInList="+e).success(function(a){b.info("It worked!"+a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})},moveListElements:function(c,d){a.post(f.apiBaseUrl+"lists/editpositionings?listId="+c.id+"&listElementIds="+d).success(function(a){b.info("It worked!"+a)}).error(function(a,c,d,e){b.info("It doesnt work!"+c+e)})}}}]),angular.module("corsaneApp").directive("csResource",["$log","list",function(){return{restrict:"E",scope:{playlist:"=",resource:"=",lists:"=",add:"&"},template:'<section>Playlist: {{playlist.name}} Resource: {{resource.name}}, {{resource.url}}<div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"> Add to list</button><ul class="dropdown-menu" role="menu"><li><a ng-repeat="list in lists" ng-click="add(playlist.name)">{{list.name}}</a></li></ul></div><div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" ng-click="removeResource(resource, idx)> Remove resource</button></div></section>',link:function(){}}}]),angular.module("corsaneApp").controller("PlaylistinfoCtrl",["$scope","global",function(a,b){a.thisList=b.setList()}]),angular.module("corsaneApp").factory("global",["$http","$log","$resource","$sce",function(a,b,c,d){var e={value:!1},f={value:!0},g={value:!1},h={value:!1},i={value:!1},j={value:null},k={value:null},l={value:null};return{isPlaylist:function(a){return void 0!==a&&(e.value=a),e},setList:function(a){return a&&(k.value=a),k},setResource:function(a){return(a||a===!1)&&(j.value=a,j.value.url=d.trustAsResourceUrl(String(j.value.url))),j},lists:function(a){return a&&(l.value=a),l},searchTab:function(a){return a&&(f.value=!0,g.value=!1,h.value=!1),f},playlistTab:function(a){return a&&(f.value=!1,g.value=!0,h.value=!1),g},submitTab:function(a){return a&&(f.value=!1,g.value=!1,h.value=!0),h},toPlaylist:function(a){return a&&(i.value=a),i}}}]),angular.module("ui.sortable",[]).value("uiSortableConfig",{}).directive("uiSortable",["uiSortableConfig","$timeout","$log",function(a,b,c){return{require:"?ngModel",link:function(d,e,f,g){function h(a,b){return b&&"function"==typeof b?function(c,d){a(c,d),b(c,d)}:a}function i(a,b){var c=a.sortable("option","helper");return"clone"===c||"function"==typeof c&&b.item.sortable.isCustomHelperUsed()}var j,k={},l={receive:null,remove:null,start:null,stop:null,update:null},m={helper:null};return angular.extend(k,a,d.$eval(f.uiSortable)),angular.element.fn&&angular.element.fn.jquery?(g?(d.$watch(f.ngModel+".length",function(){b(function(){e.data("ui-sortable")&&e.sortable("refresh")})}),l.start=function(a,b){b.item.sortable={index:b.item.index(),cancel:function(){b.item.sortable._isCanceled=!0},isCanceled:function(){return b.item.sortable._isCanceled},isCustomHelperUsed:function(){return!!b.item.sortable._isCustomHelperUsed},_isCanceled:!1,_isCustomHelperUsed:b.item.sortable._isCustomHelperUsed}},l.activate=function(){j=e.contents();var a=e.sortable("option","placeholder");if(a&&a.element&&"function"==typeof a.element){var b=a.element();b=angular.element(b);var c=e.find('[class="'+b.attr("class")+'"]');j=j.not(c)}},l.update=function(a,b){b.item.sortable.received||(b.item.sortable.dropindex=b.item.index(),b.item.sortable.droptarget=b.item.parent(),e.sortable("cancel")),i(e,b)&&!b.item.sortable.received&&(j=j.not(j.last())),j.appendTo(e),b.item.sortable.received&&!b.item.sortable.isCanceled()&&d.$apply(function(){g.$modelValue.splice(b.item.sortable.dropindex,0,b.item.sortable.moved)})},l.stop=function(a,b){!b.item.sortable.received&&"dropindex"in b.item.sortable&&!b.item.sortable.isCanceled()?d.$apply(function(){g.$modelValue.splice(b.item.sortable.dropindex,0,g.$modelValue.splice(b.item.sortable.index,1)[0])}):"dropindex"in b.item.sortable&&!b.item.sortable.isCanceled()||i(e,b)||j.appendTo(e)},l.receive=function(a,b){b.item.sortable.received=!0},l.remove=function(a,b){"dropindex"in b.item.sortable||(e.sortable("cancel"),b.item.sortable.cancel()),b.item.sortable.isCanceled()||d.$apply(function(){b.item.sortable.moved=g.$modelValue.splice(b.item.sortable.index,1)[0]})},m.helper=function(a){return a&&"function"==typeof a?function(b,c){var d=a(b,c);return c.sortable._isCustomHelperUsed=c!==d,d}:a},d.$watch(f.uiSortable,function(a){e.data("ui-sortable")&&angular.forEach(a,function(a,b){l[b]?("stop"===b&&(a=h(a,function(){d.$apply()})),a=h(l[b],a)):m[b]&&(a=m[b](a)),e.sortable("option",b,a)})},!0),angular.forEach(l,function(a,b){k[b]=h(a,k[b])})):c.info("ui.sortable: ngModel not provided!",e),void e.sortable(k)):void c.error("ui.sortable: jQuery should be included before AngularJS!")}}}]);