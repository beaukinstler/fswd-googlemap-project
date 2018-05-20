var parkStr = "Columbus" ;
var globalTest;


var NYTApi = function(searchTerm){

    //returns an array of objects based on the search term passed
    var $nytStatus = $('#nytStatus');
    var $infoWindowDiv = $('#openInfoWindow')
//console.log("DEBUG data : " +searchTerm);
    $nytStatus.text('');
    var returnArr = [];
    var nyt_url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    nyt_url += '?' + $.param({'api-key': "0ed23d00f2c04eac9afd964837eeba1e","q":searchTerm+  " Park",'sort':"newest"});
    nyt_url += '&fq=glocations:("NEW YORK CITY")';

    $.getJSON( nyt_url, function( data ) {
        // $nytHeaderElem.text("New York Times Articles about " + cityStr );

        if ( data.response.docs.length > 0 ){
            $infoWindowDiv.text("Stories from NYT about " + searchTerm);
            $.each( data.response.docs, function( key, val ) {

                $infoWindowDiv.append( "<li><a href='" +
                                val.web_url + "'>" +
                                val.headline.main +
                                "</a></li><br>" );

            });
        }
        else {
            $infoWindowDiv.text("Couldn't find stories from NYT about " + searchTerm);
        }


}).fail(function(data){$nytStatus.text("New York Times Articles returned a fail"); });
// this.nytData = returnArr;

}


var initialSearches = [
    {
        "name":"Example 1",
        "searchterms":[
                {"searchText":'Bert'},
                {"searchText":'Charles'},
                {"searchText":'Denise'}
            ]
    },
    {
        "name":"Example 2",
        "searchterms":[
                {"searchText":'Flub'},
                {"searchText":'Fan'},
                {"searchText":'Fibber'}
            ]
    }
]


var defaultMarkers = [
    {
        "addressString": "",
        "name": "Dimattina Playground",
        "lat": 40.8,
        "lng": -73.9980300
    },
    {
        "addressString": "",
        "name": "Brooklyn Bridge Park",
        "lat": 40.9,
        "lng": -73.9980300
    },
    {
        "addressString": "",
        "name": "Cadman Plaza Park",
        "lat": 40.6,
        "lng": -73.9980300
    },
    {
        "addressString": "",
        "name": "June Wine Bar",
        "lat": 40.55,
        "lng": -73.9980300
    },
    {
        "addressString": "",
        "name": "Prospect Park",
        "lat": 40.5,
        "lng": -73.9980300
    },
    {
        "addressString": "",
        "name": "Herbert Von King Park",
        "lat": 40.45,
        "lng": -73.9980300
    },
    {
        "addressString": "",
        "name": "June Wine Bar",
        "lat": 40.4,
        "lng": -73.9980300
    }
]

var namesOfMarkers = defaultMarkers.map(function(markerToConvert) {
    return markerToConvert['name'];
  });

var namesOfMarkers = defaultMarkers.map(function(markerToConvert) {
    return markerToConvert['name'];
  });

var map;

const LAT = 40.68, LNG = -73.9980300, ZOOM = 14;

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    // var center = {lat: LAT, lng: LNG};


    map = new google.maps.Map(document.getElementById('mapDiv'), {
      center: {lat: LAT, lng: LNG},
      zoom: ZOOM
    });


    var ViewModel = function() {
        // var markers = ko.observableArray();
        // var markers = [];
        var self = this;
        var bounds = new google.maps.LatLngBounds();
        var infowindow = new google.maps.InfoWindow();

        self.markers = [];
        self.menuItems = ko.observableArray();
        self.savedsearches = ko.observableArray([]);
        self.places = ko.observableArray([]);



        initialSearches.forEach(function(SearchItem){
            self.savedsearches().push(new Search(SearchItem))
        });


        //define the center
        var center = new Place({
            "addressString": "",
            "name": "marker0",
            "lat": LAT,
            "lng": LNG,
            // "menuShow": true
        });



        // load up list of places to tie to markers
        // first push the 'center' object
        self.places().push(center);
        defaultMarkers.forEach(function(tempPlace){
            self.places().push(new Place(tempPlace));
        });


        // self.places()[0].menuShow(false);

        self.currentSearch = ko.observable(self.savedsearches()[0]);
        // TODO Make a subscribe function that gets search terms with the
        // current search changes, to fire off an action to update the
        // list of map marks showing in the map and the side list


        self.setCurrentSearch = function(){
//console.log("DEBUG: set current search");
//console.log(self.savedsearches.indexOf(this));
            self.currentSearch(this);
            self.applyFilter();
        }

        self.filterTerm = ko.observable('');

        // Loop through to reset the map and visible property
        self.showAll = function() {
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < self.markers.length; i++) {
                self.markers[i].setMap(map);
                self.markers[i].visible = true;
                bounds.extend(self.markers[i].position);
            }
            map.fitBounds(bounds);
            self.updateMenu();
        }

        // Loop through to set the map, but don't change visible
        self.showCurrent = function() {
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < self.markers.length; i++) {
                self.markers[i].setMap(map);
                bounds.extend(self.markers[i].position);
            }
            map.fitBounds(bounds);
            self.updateMenu();
            infowindow.setMarker = null;
        }

        // Loop through and hide all markers.
        self.hideAll = function() {
            for (var i = 0; i < self.markers.length; i++) {
                self.markers[i].setMap(null);
                infowindow.setMarker = null;
            }
            self.updateMenu();
        }

        self.filterList = function() {
            self.currentSearch().searchterms.push({ searchText: self.filterTerm() });

        };

        // // test filtering the marker list
        // self.removeTest = function(){
        //     self.markers.remove( function (item) { return item.name != "Bert"});
        // };

        self.updateMenu = function(){
            self.menuItems.removeAll();
//console.log(self.menuItems());
//console.log(self.menuItems());

            for (i = 0 ; i < self.markers.length; i++){
                if (!(self.markers[i].map == null)){
//console.log("Found a map marker");
                    self.menuItems.push(self.markers[i]);
                }
            }
//console.log(self.menuItems());
        }

        self.debug = function(stuff){
//console.log("Starting DEBUG function");
//console.log(self.currentSearch().searchterms());
//console.log(stuff);
        }

        self.searchForMarkerName = function(markerName,searchTerm){

            // self.debug(searchTerm.searchText);
            // self.debug(markerName.split(" ",10));
            // self.debug(markerName.split(" ",10).indexOf("Park"));
            return markerName.split(" ",10).indexOf((searchTerm.searchText))>-1;
        }

        self.applyFilter = function(){
            var searchTerms = self.currentSearch().searchterms();

//console.log("DEBUG: self.currentSearch()");
//console.log(self.currentSearch());

            // if there are search terms

            // else show call the a function to load defaults and set map on all markers
            if (searchTerms.length > 0 ){
                for (i=0; i < self.markers.length; i++){
                    self.markers[i].setMap(null);
                    // self.markers[i].menuShow(false);
                    self.markers[i].visible = false;
//console.log("DEBUG: match marker name: " + self.markers[i].name);
//console.log(self.currentSearch().matchAny(self.markers[i].name));
                    for (term in searchTerms){
                        self.debug(self.currentSearch().searchterms());
                        // loop through each search term, and if found set map
//console.log("DEBUG: searchTearms text and marker name broken out into pieces ");

                        // self.debug(self.markers[i].name);
                        // self.debug(searchTerms[term].searchText);

//console.log(self.searchForMarkerName(self.markers[i].name,searchTerms[term]));
                        if (self.markers[i].name == searchTerms[term].searchText
                            ||  self.markers[i].name.split(" ",10).indexOf(searchTerms[term].searchText)>-1){
                        // if (self.currentSearch().matchAny(self.markers[i].name)){
                            self.markers[i].setMap(map);
                            self.markers[i].visible = true;
                            // self.markers[i].menuShow(true);
                            // self.markers[i].setMap(map);
                            // self.markers[i].name = searchTerms[term].searchText;
//console.log("DEBUG: Found search term = ");
//console.log(searchTerms[term]);
                            
                        }
                    }
                }
            }
            else {
                // set all markers to map
                self.markers.forEach(function(){
                    this.setMap(map);

                })
            }
            self.updateMenu()
//console.log(self.menuItems());

            // self.removeTest();
        };

        self.openInfoWindow = function(){

            placeInfoWindow(this, infowindow)
        };

        var center = self.places()[0].coords();
        var name = self.places()[0].name();
        // var markerCenter = new google.maps.Marker({
        //     position: center,
        //     map: map,
        //     name: "Center Marker"
        //     // menuShow: self.places()[0].menuShow()
        //   });

        // self.markers.push(markerCenter);
        // Open an infowindow
        //
        // markerCenter.addListener('click', self.openInfoWindow );


        // bounds.extend(self.markers[0].position);
        setDefaultMarkers();
        map.fitBounds(bounds);


        function placeInfoWindow(marker, infowindow ){

            var content = "<h1>" + marker.name + "</h1>";






            // // marker.newsData = nytFunc.nytData;

            // var first = marker.news.nytData[0];





            // All of this doesn't work because it's asynchronous
            // Instead of building the content, the should be a way to
            // fill a div once the content is returned.
            // if (nytFunc.nytData.length > 0){

            // }
            // nytFunc.nytData.forEach(function(article){

            //     content += "<a href=" + article.web_url + ">";
            //     content +=  article.headline.main + "</a>";
            //     content += "<p class='nytSnippet'>" + article.snippet + "</p>";
            // });
            content += "<div id='openInfoWindow'>Waiting for NYT stories...</div>"

            if (infowindow.marker != marker){
//console.log("DEBUG: content = " + content);
               infowindow.setContent(content);

               infowindow.open(map, marker);
                // TODO add content from third party API
                infowindow.addListener('closeclick',function(){
                    infowindow.setMarker = null;
                });
                NYTApi(marker.name);
            }

        }


        // function setCurrentMarkers(){


        //     if (self.currentSearch().searchterms() > 0 ){
        //         for (i = 0; i < marker().length; i++ ){
        //             var marker = new google.maps.Marker({
        //                 position: self.places()[i].coords(),
        //                 map: map,
        //                 name: self.places()[i].name()
        //                 // menuShow: self.places()[i].menuShow()
        //             });

        //             // push marker onto the markers array
        //             self.markers.push(marker);
        //             // Open an infowindow
        //             marker.addListener('click', function() {
        //                 placeInfoWindow(this, infowindow);
        //             });

        //             bounds.extend(markers[i].position);
        //         }
        //     }
        // }



        function setDefaultMarkers(){
            for (i = 0; i < defaultMarkers.length; i++ ){
                var marker = new google.maps.Marker({
                    position: self.places()[i].coords(),
                    map: map,
                    name: self.places()[i].name()
                    // menuShow: self.places()[i].menuShow()
                  });

                // push marker onto the markers array
                self.markers.push(marker);
                // Open an infowindow
                marker.addListener('click', function() {
                    placeInfoWindow(this, infowindow);
                });

                bounds.extend(self.markers[i].position);
            }
            self.updateMenu();
        }


    };


    var Search = function(data){
        var self = this;

        self.name = ko.observable(data.name);


        self.removeTerm = function () {


            var name = this.searchText;
            self.searchterms.remove(function(term) {
                return term.searchText == name;
            });
        }

        self.searchterms = ko.observableArray(data.searchterms);

        // self.searchTermString = function () {
        //     // var temp = Object.create(self);
        //     var result = "temp";
        //     for (i=0;i<self.searchterms().length; i++){
        //         result += self.searchterms()[i].searchText;
        //     }
        //     return result;
        // }

        self.searchTermString = ko.computed(
            function(){
                var result = "";
                for (i=0;i<self.searchterms().length; i++){
                    result += self.searchterms()[i].searchText;

                    if (i+1 < self.searchterms().length){result += "+"};
                }
                return result;
            }
        );

        self.nameParts = ko.computed(function(){
            // split the name.  Just in case it's huge,
            // that's the the intent, so I'm limiting to 10
            return self.name().split(" ",10);

        });


        self.terms = ko.observableArray(self.searchterms().map(function(term) {
                return term['searchText'];
            }));
        

        // self.matchAny =  function(arr){
        //     var result = false;
        //     // var testArr = [];
        //     // tesArr = arr;
        //     if (arr.length > 0){

        //         //look for any match in nameParts
        //         self.nameParts().forEach(function(part){

        //             arr.forEach(function(arrElement){


        //                 if (arrElement.toLowerCase() == part.toLowerCase()){
        //                    result = true || result;
        //                 }
        //             });
        //         });
        //     }

        //     return result;
        // }

        self.matchAny =  function(name){
            var result = false;
            var arr = name.split(" ", 10);

            // push the original name as well, in case the search term is the full name
            arr.push(name);
            // tesArr = arr;
            if (arr.length > 0){

                //look for any match in nameParts
                self.terms().forEach(function(part){
//console.log("DEBUG: testing part: " + part)
                    arr.forEach(function(arrElement){
//console.log("DEBUG: testing arrElement: " + arrElement)
//console.log("DEBUG: match: " + (arrElement.toLowerCase() == part.toLowerCase()))
                        if (arrElement.toLowerCase() == part.toLowerCase()){
                           result = true || result;
                        }
                    });
                });
            }
//console.log(result);
            return result;
        }


    };

    var Place = function(data){
        var self = this;

        self.name = ko.observable(data.name);

        // var nyt_url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
        // nyt_url += '?' + $.param({'api-key': "0ed23d00f2c04eac9afd964837eeba1e","q":data.name,'sort':"newest"});

        // $.ajax({
        //     dataType: "jsonp",
        //     url: nyt_url,
        //     success: function( response ) {

        // });

        // var test = NYTApi(self.name);


        self.lat = ko.observable(data.lat);
        self.lng = ko.observable(data.lng);
        self.addressString = ko.observable(data.addressString);
        // self.menuShow = ko.observable(data.menuShow=true);

        self.coords = ko.computed(function(){
            var obj = {}
            obj.lat = self.lat();
            obj.lng = self.lng();

            return obj;
        })


        // self.web_content = ko.computed(function(){
        //     var content = ""
        //     content += "<h1>" + self.name + "</h1>";
        //     content += self.web_url;
        //     return content;
        // });

        // function to return split name
        self.nameParts = ko.computed(function(){
            // split the name.  Just in case it's huge,
            // that's the the intent, so I'm limiting to 10
            return self.name().split(" ",10);

        })

    };

    // function getNytData(){

    // }


    ko.applyBindings(new ViewModel());
}








