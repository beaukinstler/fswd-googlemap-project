
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
        "name": "marker1",
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

    // var marker = new google.maps.Marker({
    //     position: center,
    //     map: map
    //   });

    var ViewModel = function() {
        
        var self = this;
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
    
        // self.incrementCounter = function() {
        //     self.currentSearch().clickCount(self.currentSearch().clickCount() + 1);
        // };
    
        self.setCurrentSearch = function(){
            console.log(self.savedsearches.indexOf(this));
            self.currentSearch(this);
        }
    
        self.filterTerm = ko.observable('');
    
        self.filterList = function() {
            self.currentSearch().searchterms.push({ nick: self.filterTerm(),nickClicks:0 });
    
        };
        var center = self.places()[0].coords();
        var markerCenter = new google.maps.Marker({
            position: center,
            map: map
          });
        console.log(markerCenter);

        for (i = 1; i < defaultMarkers.length; i++ ){
            var marker = new google.maps.Marker({
                position: self.places()[i].coords(),
                map: map
              });
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








