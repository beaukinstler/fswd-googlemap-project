
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

        self.markers = ko.observableArray();
        self.savedsearches = ko.observableArray([]);
        self.places = ko.observableArray([]);
    
        console.log(map);
    
        initialSearches.forEach(function(SearchItem){
            self.savedsearches().push(new Search(SearchItem))
        });


        //define the center
        var center = new Place({
            "addressString": "",
            "name": "marker0",
            "lat": LAT,
            "lng": LNG
        });

        // load up list of places to tie to markers
        // first push the 'center' object
        self.places().push(center);
        defaultMarkers.forEach(function(tempPlace){
            self.places().push(new Place(tempPlace));
        }); 

        console.log(self.places()[0].coords());
        
        self.currentSearch =   ko.observable(self.savedsearches()[0]);
    
        self.setCurrentSearch = function(){
            // console.log(self.savedsearches.indexOf(this));
            self.currentSearch(this);
        }
    
        self.filterTerm = ko.observable('');
    
        self.filterList = function() {
            self.currentSearch().searchterms.push({ nick: self.filterTerm() });
    
        };

        // test filtering the marker list
        self.removeTest = function(){
            self.markers.remove( function (item) { return item.name != "Bert"});
        };

        self.filterTest = function(){
            console.log(self.markers());
            for (i=0; i < self.markers().length; i++){
                if (self.markers()[i].name == 'Bert'){
                    self.markers()[i].setMap(map);
                }
                else{ self.markers()[i].setMap(null);}  
            }
            self.removeTest();
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
          });
        console.log(markerCenter);
        self.markers().push(markerCenter);
        // Open an infowindow
        // 
        markerCenter.addListener('click', self.openInfoWindow );
        self.markers().push(markerCenter);

        bounds.extend(self.markers()[0].position);
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
                  });
    
                // push marker onto the markers array
                self.markers().push(marker);
                // Open an infowindow
                marker.addListener('click', function() {
                    placeInfoWindow(this, infowindow);
                });
    
                bounds.extend(markers()[i].position);
            }
        }   

        

        function setDefaultMarkers(){
            for (i = 1; i < defaultMarkers.length; i++ ){
                var marker = new google.maps.Marker({
                    position: self.places()[i].coords(),
                    map: map,
                    name: self.places()[i].name()
                  });
    
                // push marker onto the markers array
                self.markers().push(marker);
                // Open an infowindow
                marker.addListener('click', function() {
                    placeInfoWindow(this, infowindow);
                });
    
                bounds.extend(self.markers()[i].position);
            }
        }


    };
    
    
    var Search = function(data){
        var self = this;
    
        self.name = ko.observable(data.name);
    
        // self.nickClicksAdd = function(){
        //     console.log(this.nick);
        //     var temp = Object.create(this);
        //     temp.nickClicks += 1;
        //     self.searchterms.replace(this,temp);
        // };
    
        self.removeTerm = function () {
            // console.log(this.nick);
            // console.log(self.searchTermString());
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
                    // console.log(self.searchterms()[i].nick);
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

        self.coords = ko.computed(function(){
            var obj = {}
            obj.lat = self.lat();
            obj.lng = self.lng();
            console.log(obj);
            return obj;
        })
           
    };
    
    
    ko.applyBindings(new ViewModel());
}








