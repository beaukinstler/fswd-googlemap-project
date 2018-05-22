


var NYTApi = function(searchTerm){
    // Arg: string - A terms to search the NY Times article API
    // Required: 
    //          div with ID nytStatus to return errors to the DOM.
    //          div in the DOM with ID openInfoWindow to display the results
    //              of the AJAX data.

    
    var $nytStatus = $('#nytStatus');
    var $infoWindowDiv = $('#openInfoWindow')

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
        "name":"Filter List 1",
        "searchterms":[
                {"searchText":'Playground'}
                // {"searchText":'Charles'},
                // {"searchText":'Denise'}
            ]
    },
    {
        "name":"Filter List 2",
        "searchterms":[
                {"searchText":'Park'}
                
                // {"searchText":'Test1'},
                // {"searchText":'Test2'}
            ]
    }
]


var defaultMarkers = [
    {
        "addressString": "",
        "name": "Dimattina Playground",
        "lat": 40.680311,
        "lng": -74.002211
    },
    {
        "addressString": "",
        "name": "Brooklyn Bridge Park",
        "lat": 40.700291,
        "lng": -73.996699
    },
    {
        "addressString": "",
        "name": "Cadman Plaza Park",
        "lat": 40.698476,
        "lng": -73.990469
    },
    {
        "addressString": "",
        "name": "Trinity Park",
        "lat": 40.699344,
        "lng": -73.984105
    },
    {
        "addressString": "",
        "name": "Prospect Park",
        "lat": 40.660204,
        "lng": -73.968956
    },
    {
        "addressString": "",
        "name": "Herbert Von King Park",
        "lat": 40.689612,
        "lng": -73.946732
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


        // //define the center
        // var center = new Place({
        //     "addressString": "",
        //     "name": "marker0",
        //     "lat": LAT,
        //     "lng": LNG,
        //     // "menuShow": true
        // });



        // load up list of places to tie to markers
        // first push the 'center' object
        // self.places().push(center);
        defaultMarkers.forEach(function(tempPlace){
            self.places().push(new Place(tempPlace));
        });


        self.currentSearch = ko.observable(self.savedsearches()[0]);

        self.setCurrentSearch = function(){


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
            self.filterTerm(null);

        };

        self.updateMenu = function(){
            self.menuItems.removeAll();



            for (i = 0 ; i < self.markers.length; i++){
                if (!(self.markers[i].map == null)){

                    self.menuItems.push(self.markers[i]);
                }
            }

        }

        self.debug = function(stuff){
            console.log("Starting DEBUG function");
            console.log(stuff);
        }

        self.searchForMarkerName = function(markerName,searchTerm){

            return markerName.toLowerCase().split(" ",10).indexOf((searchTerm.searchText.toLowerCase()))>-1;
        }

        self.applyFilter = function(){
            infowindow.close();

            var searchTerms = self.currentSearch().searchterms();

            // if there are search terms
            // else show call the a function to load defaults and set map on all markers
            if (searchTerms.length > 0 ){
                for (i=0; i < self.markers.length; i++){
                    self.markers[i].setMap(null);
                    // self.markers[i].menuShow(false);
                    self.markers[i].visible = false;


                    for (term in searchTerms){

                        if (self.markers[i].name == searchTerms[term].searchText
                            ||  self.searchForMarkerName(self.markers[i].name,searchTerms[term])){

                            self.markers[i].setMap(map);
                            self.markers[i].visible = true;
                            
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


            // self.removeTest();
        };

        self.openInfoWindow = function(){

            placeInfoWindow(this, infowindow)
        };

        var center = self.places()[0].coords();
        var name = self.places()[0].name();

        setDefaultMarkers();
        map.fitBounds(bounds);

        function bounceMarker(marker, timeout){
            marker.setAnimation(google.maps.Animation.BOUNCE);
            window.setTimeout(function() {
                marker.setAnimation(null);
            },timeout);
        }
        
        function placeInfoWindow(marker, infowindow ){
            bounceMarker(marker,2000);
            var content = "<h1>" + marker.name + "</h1>";
            content += "<div id='openInfoWindow'>Waiting for NYT stories...</div>"
        
            if (infowindow.marker != marker){
                infowindow.setContent(content);
                infowindow.open(map, marker);
                infowindow.addListener('closeclick',function(){
                    infowindow.setMarker = null;
                });
                NYTApi(marker.name);
            }

        }


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
        

        self.matchAny =  function(name){
            var result = false;
            var arr = name.split(" ", 10);

            // push the original name as well, in case the search term is the full name
            arr.push(name);
            // tesArr = arr;
            if (arr.length > 0){

                //look for any match in nameParts
                self.terms().forEach(function(part){

                    arr.forEach(function(arrElement){


                        if (arrElement.toLowerCase() == part.toLowerCase()){
                           result = true || result;
                        }
                    });
                });
            }

            return result;
        }


    };

    var Place = function(data){
        var self = this;

        self.name = ko.observable(data.name);


        self.lat = ko.observable(data.lat);
        self.lng = ko.observable(data.lng);
        self.addressString = ko.observable(data.addressString);

        self.coords = ko.computed(function(){
            var obj = {}
            obj.lat = self.lat();
            obj.lng = self.lng();

            return obj;
        })

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








