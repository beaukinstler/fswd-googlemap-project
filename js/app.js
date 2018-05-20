var parkStr = "Columbus" ;
var globalTest;


var NYTApi = function(searchTerm){

    //returns an array of objects based on the search term passed
    var $nytStatus = $('#nytStatus');
    var $infoWindowDiv = $('#openInfoWindow')
    console.log("DEBUG data : " +searchTerm);
    $nytStatus.text('');
    var returnArr = [];
    var nyt_url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    nyt_url += '?' + $.param({'api-key': "0ed23d00f2c04eac9afd964837eeba1e","q":searchTerm+  " Park",'sort':"newest"});
    nyt_url += '&fq=glocations:("NEW YORK CITY")';
    // console.log("DEBUG: nyt_url is " + nyt_url);
    $.getJSON( nyt_url, function( data ) {
        // $nytHeaderElem.text("New York Times Articles about " + cityStr );
        // console.log("DEBUG: type of data: " + typeof data)
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
                {"searchText":'Bert',"searchTextClicks":3},
                {"searchText":'Charles',"searchTextClicks":0},
                {"searchText":'Denise',"searchTextClicks":0}
            ]
    },
    {
        "name":"Example 2",
        "searchterms":[
                {"searchText":'Flub',"searchTextClicks":3},
                {"searchText":'Fan',"searchTextClicks":0},
                {"searchText":'Fibber',"searchTextClicks":0}
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

        //console.log(map);

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

        // console.log(center.menuShow());

        // load up list of places to tie to markers
        // first push the 'center' object
        self.places().push(center);
        defaultMarkers.forEach(function(tempPlace){
            self.places().push(new Place(tempPlace));
        });

        //console.log(self.places()[0].menuShow());
        // self.places()[0].menuShow(false);
        //console.log(self.places()[0].menuShow());
        self.currentSearch = ko.observable(self.savedsearches()[0]);
        // TODO Make a subscribe function that gets search terms with the
        // current search changes, to fire off an action to update the
        // list of map marks showing in the map and the side list


        self.setCurrentSearch = function(){
            // //console.log(self.savedsearches.indexOf(this));
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
            console.log(self.menuItems());
            console.log(self.menuItems());

            for (i = 0 ; i < self.markers.length; i++){
                if (!(self.markers[i].map == null)){
                    console.log("Found a map marker");
                    self.menuItems.push(self.markers[i]);
                }
            }
            console.log(self.menuItems());
        }

        self.applyFilter = function(){
            // //console.log(self.markers);
            var searchTerms = self.currentSearch().searchterms();
            //console.log(searchTerms[0].searchText);

            // if there are search terms

            // else show call the a function to load defaults and set map on all markers
            if (searchTerms.length > 0 ){
                for (i=0; i < self.markers.length; i++){
                    self.markers[i].setMap(null);
                    // self.markers[i].menuShow(false);
                    self.markers[i].visible = false;

                    for (term in searchTerms){
                        // loop through each search term, and if found set map
                        if (self.markers[i].name == searchTerms[term].searchText){
                            self.markers[i].setMap(map);
                            self.markers[i].visible = true;
                            // self.markers[i].menuShow(true);
                            // self.markers[i].setMap(map);
                            // self.markers[i].name = searchTerms[term].searchText;
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
            console.log(self.menuItems());
            // //console.log(self.currentSearch().searchterms());
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
        // //console.log(markerCenter);
        // self.markers.push(markerCenter);
        // Open an infowindow
        //
        // markerCenter.addListener('click', self.openInfoWindow );


        // bounds.extend(self.markers[0].position);
        setDefaultMarkers();
        map.fitBounds(bounds);


        function placeInfoWindow(marker, infowindow ){

            var content = "<h1>" + marker.name + "</h1>";


            // console.log("DEBUG: About to try to get NYT Data with " + marker.name);
            // console.dir(nytFunc);
            // console.log(nytFunc);

            // // marker.newsData = nytFunc.nytData;
            // console.log(nytFunc.nytData.length);
            // var first = marker.news.nytData[0];
            // console.log(marker.nytData.length);
            // console.log(nytFunc.length);
            // console.log(nytData.length);
            // console.log(first);

            // All of this doesn't work because it's asynchronous
            // Instead of building the content, the should be a way to
            // fill a div once the content is returned.
            // if (nytFunc.nytData.length > 0){
            //     console.log("DEBUG: there's data!!!");
            // }
            // nytFunc.nytData.forEach(function(article){
            //     console.log("web:" +article.web_url);
            //     content += "<a href=" + article.web_url + ">";
            //     content +=  article.headline.main + "</a>";
            //     content += "<p class='nytSnippet'>" + article.snippet + "</p>";
            // });
            content += "<div id='openInfoWindow'>Waiting for NYT stories...</div>"

            if (infowindow.marker != marker){
               console.log("DEBUG: content = " + content);
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
        //     console.log("DEBUG: current search terms:");
        //     console.log(self.currentSearch().searchterms());
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
            // //console.log(this.searchText);
            // //console.log(self.searchTermString());
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
                    // //console.log(self.searchterms()[i].searchText);
                    if (i+1 < self.searchterms().length){result += "+"};
                }
                return result;
            }
        );

        self.nameParts = ko.computed(function(){
            // split the name.  Just in case it's huge,
            // that's the the intent, so I'm limiting to 10
            return self.name().split(" ",10);

        })

        self.matchAny =  function(arr){
            var result = false;
            // var testArr = [];
            // tesArr = arr;
            if (arr.length > 0){
                console.log(arr);
                //look for any match in nameParts
                self.nameParts().forEach(function(part){
                    console.log("DEBUG: testing part: " + part)
                    arr.forEach(function(arrElement){
                        console.log("DEBUG: testing arrElement: " + arrElement)
                        console.log("DEBUG: match: " + (arrElement.toLowerCase() == part.toLowerCase()))
                        if (arrElement.toLowerCase() == part.toLowerCase()){
                           result = true;
                        }
                    });
                });
            }
            console.log(result);
            return result;
        }


    };

    var Place = function(data){
        var self = this;

        self.name = ko.observable(data.name);

        // var nyt_url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
        // nyt_url += '?' + $.param({'api-key': "0ed23d00f2c04eac9afd964837eeba1e","q":data.name,'sort':"newest"});
        // console.log(nyt_url);
        // $.ajax({
        //     dataType: "jsonp",
        //     url: nyt_url,
        //     success: function( response ) {
        //         console.log( response ); }
        // });

        // var test = NYTApi(self.name);
        // console.log(test.length);

        self.lat = ko.observable(data.lat);
        self.lng = ko.observable(data.lng);
        self.addressString = ko.observable(data.addressString);
        // self.menuShow = ko.observable(data.menuShow=true);

        self.coords = ko.computed(function(){
            var obj = {}
            obj.lat = self.lat();
            obj.lng = self.lng();
            //console.log(obj);
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








