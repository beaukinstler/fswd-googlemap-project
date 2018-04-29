
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

var map;

const LAT = 40.7413549, LNG = -73.9980244, ZOOM = 14;

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('mapDiv'), {
      center: {lat: LAT, lng: LNG},
      zoom: ZOOM
    });
}


var ViewModel = function() {

    var self = this;
    self.savedsearches = ko.observableArray([]);

    initialSearches.forEach(function(SearchItem){
        self.savedsearches().push(new Search(SearchItem))});

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


ko.applyBindings(new ViewModel());





