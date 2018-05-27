'use strict';

// var newViewModel =  {
//     nytStatus: ko.observable()
// }

var NYTApi = function(searchTerm,domErrorDiv,infowindow){
    // Arg: string - A terms to search the NY Times article API
    // Required:
    //          div with ID nytStatus to return errors to the DOM.
    //          div in the DOM with ID openInfoWindow to display the results
    //              of the AJAX data.


    // var $nytStatus = $('#nytStatus');
    // var $infoWindowDiv = $('#openInfoWindow');

    // $nytStatus.text('');
    var contentStr = "Stories from NYT about " + searchTerm;
    var returnArr = [];
    var nyt_url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    nyt_url += '?' + $.param({'api-key': "0ed23d00f2c04eac9afd964837eeba1e","q":searchTerm+  " Park",'sort':"newest"});
    nyt_url += '&fq=glocations:("NEW YORK CITY")';

    $.getJSON( nyt_url, function( data ) {
        if ( data.response.docs.length > 0 ){
            // $infoWindowDiv.text("Stories from NYT about " + searchTerm);
            $.each( data.response.docs, function( key, val ) {

                contentStr += "<li><a href='" +
                                val.web_url + "'  target='new'>" +
                                val.headline.main +
                                "</a></li><br>";

            });

            infowindow.setContent("<div class='infowWindowDiv' style='overflow:scroll;max-height:15em'>" + infowindow.getContent() + contentStr + "</div>");
        }
        else {
            infowindow.setContent(infowindow.getContent() + "Couldn't find stories from NYT about " + searchTerm);
        }
}).fail(function(data){
                        domErrorDiv("New York Times Articles returned a fail");
                        infoWindowDiv(infowindow.getContent() + "Connections to the New York Times didn't work. Please try again later.");
                });
}


// Below are some help
// var namesOfMarkers = defaultMarkers.map(function(markerToConvert) {
//     return markerToConvert['name'];
//   });

// var namesOfMarkers = defaultMarkers.map(function(markerToConvert) {
//     return markerToConvert['name'];
//   });


// Set the primary "map" object.
var map;

// Vars to set initial map center and zoom level.
const LAT = 40.68, LNG = -73.9980300, ZOOM = 14;

var googleError = function(){
    console.log("hi");
    window.alert("There was a problem getting Google Maps APIs info.  Please try again..");
}

function initMap() {
    // Primary function, used as the callback from Google Maps.

    // Create the google map and link to the html element
    map = new google.maps.Map(document.getElementById('mapDiv'), {
      center: {lat: LAT, lng: LNG},
      zoom: ZOOM
    });


    var ViewModel = function() {
        // Primary ViewModel for the app

        var self = this;

        // Create the objects needed by Google Maps
        var bounds = new google.maps.LatLngBounds();
        var infowindow = new google.maps.InfoWindow({maxWidth:250});

        // Define the variable used by the view model.

        // this will be the list of Google Maps markers stored.
        self.markers = [];

        // A ko array for storing the menu items on the side of the page
        self.menuItems = ko.observableArray();

        // an array to store the saved searches/filter groups on the page
        self.savedsearches = ko.observableArray([]);

        // an array of Places, used to create markers, and will be filled by the
        // "defaultMarkers" previously defined.
        self.places = ko.observableArray([]);


        // Load the the pre-set Search objects to store the filter groups
        initialSearches.forEach(function(SearchItem){
            self.savedsearches().push(new Search(SearchItem))
        });

        // Fill the array up with a list of places to tie to markers
        // first push the 'center' object
        // self.places().push(center);
        defaultMarkers.forEach(function(tempPlace){
            self.places().push(new Place(tempPlace));
        });

        // A holder of the current filter group
        // Default to the first one on the list of filter groups
        self.currentSearch = ko.observable(self.savedsearches()[0]);

        // Function used by the html to set the Filter Group
        // as it's clicked in the DOM.
        self.setCurrentSearch = function(){

            this.makeVisible();
            self.currentSearch(this);
            self.applyFilter();

        }

        // Used in the DOM for getting the filter term from a form field.
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
            self.currentSearch().makeNotVisible();
        }

        // Loop through to set the map, but don't change visible
        self.showCurrent = function() {
            var bounds = new google.maps.LatLngBounds();

            for (var i = 0; i < self.markers.length; i++) {
                if (self.markers[i].visible == true){
                    self.markers[i].setMap(map);
                    bounds.extend(self.markers[i].position);

                }
                // // keep the bounds using all markers, even invisible
                // bounds.extend(self.markers[i].position);
            }
            map.fitBounds(bounds);
            // if only one marker, it's too close, so zoom out a bit
            map.setZoom(map.getZoom()-2);
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

        // Called by the DOM to add a the form field to the list of filter terms
        self.filterList = function() {
            if (self.filterTerm()){
                // If there is a term, add it to the list.
                // This will prevent blank items added to the filter
                self.currentSearch().searchterms.push({ searchText: self.filterTerm() });
                self.filterTerm(null);
                // self.applyFilter(); //enable this to not have to press the "Apply filter"
                //                     //after the term is added to the list

            }
            else{
                self.currentSearch().makeVisible();
            }
        };


        self.updateMenu = function(){
            // Update the sidebar menu with the the Google Map Markers
            self.menuItems.removeAll();

            for (var i = 0 ; i < self.markers.length; i++){
                if (!(self.markers[i].map == null)){

                    self.menuItems.push(self.markers[i]);
                }
            }

        }

        // self.debug = function(stuff){
        //     console.log("Starting DEBUG function");
        //     console.log(stuff);
        // }

        self.searchForMarkerName = function(markerName,searchTerm){
            // Function for finding the search term in the name of a Marker
            // Convert the Marker name to an array, the find the index of the search term.
            // If it's in the name, it will return 0 or greater.
            return markerName.toLowerCase().split(" ",10).indexOf((searchTerm.searchText.toLowerCase()))>-1;
        }

        self.applyFilter = function(){
            // Primary function for altering the GUI with the filtered list.
            infowindow.close();

            var searchTerms = self.currentSearch().searchterms();

            // If there are search terms, try to use them to alter the Marker visible property
            // For each marker, set it's map to null and visible to false.
            // Then test to see if it's name parts match search terms.
            if (searchTerms.length > 0 ){
                for (var i=0; i < self.markers.length; i++){
                    self.markers[i].setMap(null);
                    // self.markers[i].menuShow(false);
                    self.markers[i].visible = false;


                    for (var term in searchTerms){

                        if (self.markers[i].name == searchTerms[term].searchText
                            ||  self.searchForMarkerName(self.markers[i].name,searchTerms[term])){

                            self.markers[i].setMap(map);
                            self.markers[i].visible = true;

                        }
                    }
                }
            }
            // else show call the a function to load defaults and set map on all markers
            else {
                // make all markers show
                self.showAll();
                self.currentSearch().makeVisible();
            }

            // now that markers are updated, update the side bar
            self.updateMenu()

        };
        self.infoWindowDiv = ko.observable();
        self.nytStatus = ko.observable();
        self.openInfoWindow = function(){
            placeInfoWindow(this, infowindow);

        };

        // var center = self.places()[0].coords();
        // var name = self.places()[0].name();

        setDefaultMarkers();
        map.fitBounds(bounds);

        function bounceMarker(marker, timeout){
            marker.setAnimation(google.maps.Animation.BOUNCE);
            window.setTimeout(function() {
                marker.setAnimation(null);
            },timeout);
        }

        // self.infoWindowDiv = ko.observable();
        // self.nytStatus = ko.observable();
        function placeInfoWindow(marker, infowindow ){
            map.setCenter(marker.getPosition());
            map.panBy(0,-90)
            bounceMarker(marker,2000);
            var content = "<h1>" + marker.name + "</h1>";
            // content += "";

            if (infowindow.marker != marker){
                infowindow.setContent(content);
                infowindow.open(map, marker);
                infowindow.addListener('closeclick',function(){
                    infowindow.setMarker = null;
                });
                //NYTApi(marker.name, self.nytStatus,self.infoWindowDiv);
                NYTApi(marker.name,self.nytStatus,infowindow);
            }

        }


        function setDefaultMarkers(){
            for (var i = 0; i < defaultMarkers.length; i++ ){
                var marker = new google.maps.Marker({
                    position: self.places()[i].coords(),
                    map: map,
                    name: self.places()[i].name()
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
        // Object to store the Search Filter Groups
        var self = this;

        self.isVisible = ko.observable(false);

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
                for (var i=0;i<self.searchterms().length; i++){
                    result += self.searchterms()[i].searchText;

                    if (i+1 < self.searchterms().length){result += "+"};
                }
                return result;
            }
        );

        // self.nameParts = ko.computed(function(){
        //     return self.name().split(" ",10);

        // });


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

        self.makeVisible = function(){
            self.isVisible(true);
        }

        self.makeNotVisible = function(){
            self.isVisible(false);
        }

        self.hasTerms = ko.computed(function(){
            return self.searchterms().length > 0;
        });

    };

    var Place = function(data){
        // Object to store details used for Markers, as well as
        // side bar menu.
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
            // that's not the the intent, so I'm limiting to 10
            return self.name().split(" ",10);

        })

    };



    ko.applyBindings(new ViewModel());
    // ko.applyBindings(new newViewModel());
}








