
var initialSearches = [
    {
        "name":"Example 1",
        "searchterms":[
                {"nick":'Bert',"nickClicks":3},
                {"nick":'Charles',"nickClicks":0},
                {"nick":'Denise',"nickClicks":0}
            ]   
    },
    {
        "name":"Example 2",
        "searchterms":[
                {"nick":'Flub',"nickClicks":3},
                {"nick":'Fan',"nickClicks":0},
                {"nick":'Fibber',"nickClicks":0}
            ]
    }
]

var defaultMarkers = [
    {
        "addressString": "",
        "name": "Bert",
        "lat": 40.8,
        "lng": -73.9980300
    },
    {
        "addressString": "",
        "name": "marker2",
        "lat": 40.9,
        "lng": -73.9980300
    },
    {
        "addressString": "",
        "name": "marker3",
        "lat": 40.6,
        "lng": -73.9980300
    },
    {
        "addressString": "",
        "name": "marker4",
        "lat": 40.55,
        "lng": -73.9980300
    },
    {
        "addressString": "",
        "name": "marker5",
        "lat": 40.5,
        "lng": -73.9980300
    },
    {
        "addressString": "",
        "name": "marker6",
        "lat": 40.45,
        "lng": -73.9980300
    },
    {
        "addressString": "",
        "name": "marker7",
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
            self.currentSearch().searchterms.push({ nick: self.filterTerm() });
    
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
            //console.log(searchTerms[0].nick);

            // if there are search terms

            // else show call the a function to load defaults and set map on all markers
            if (searchTerms.length > 0 ){
                for (i=0; i < self.markers.length; i++){
                    self.markers[i].setMap(null);
                    // self.markers[i].menuShow(false);
                    self.markers[i].visible = false;
                    
                    for (term in searchTerms){
                        // loop through each search term, and if found set map
                        if (self.markers[i].name == searchTerms[term].nick){
                            self.markers[i].setMap(map);
                            self.markers[i].visible = true;
                            // self.markers[i].menuShow(true);
                            // self.markers[i].setMap(map);
                            // self.markers[i].name = searchTerms[term].nick;
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
        var markerCenter = new google.maps.Marker({
            position: center,
            map: map,
            name: "Center Marker"
            // menuShow: self.places()[0].menuShow()
          });
        //console.log(markerCenter);
        self.markers.push(markerCenter);
        // Open an infowindow
        // 
        markerCenter.addListener('click', self.openInfoWindow );
        

        bounds.extend(self.markers[0].position);
        setDefaultMarkers();
        map.fitBounds(bounds);
        

        function placeInfoWindow(marker, infowindow ){
            var content = "<h1>" + marker.name + "</h1>"
            
            if (infowindow.marker != marker){
               infowindow.setContent(content);
               infowindow.open(map, marker);
                // TODO add content from thid party API
                infowindow.addListener('closeclick',function(){
                    infowindow.setMarker = null;
                });  
            }
            
        }


        function setCurrentMarkers(){
            for (i = 0; i < marker().length; i++ ){
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
    
                bounds.extend(markers[i].position);
            }
        }   

        

        function setDefaultMarkers(){
            for (i = 1; i < defaultMarkers.length; i++ ){
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
    
        // self.nickClicksAdd = function(){
        //     //console.log(this.nick);
        //     var temp = Object.create(this);
        //     temp.nickClicks += 1;
        //     self.searchterms.replace(this,temp);
        // };
    
        self.removeTerm = function () {
            // //console.log(this.nick);
            // //console.log(self.searchTermString());
            var name = this.nick;
            self.searchterms.remove(function(term) {
                return term.nick == name;
            });
        }
    
        self.searchterms = ko.observableArray(data.searchterms);
    
        // self.searchTermString = function () {
        //     // var temp = Object.create(self);
        //     var result = "temp";
        //     for (i=0;i<self.searchterms().length; i++){
        //         result += self.searchterms()[i].nick;
        //     }
        //     return result;
        // }
    
        self.searchTermString = ko.computed(
            function(){
                var result = "";
                for (i=0;i<self.searchterms().length; i++){
                    result += self.searchterms()[i].nick;
                    // //console.log(self.searchterms()[i].nick);
                    if (i+1 < self.searchterms().length){result += "+"};
                }
                return result;    
            }
        )
    
           
    };
    
    var Place = function(data){
        var self = this;
    
        self.name = ko.observable(data.name);
    
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
           
    };
    
    
    ko.applyBindings(new ViewModel());
}








