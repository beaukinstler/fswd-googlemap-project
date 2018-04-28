
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




var ViewModel = function() {

    var self = this;
    self.savedsearches = ko.observableArray([]);

    initialSearches.forEach(function(SearchItem){
        self.savedsearches().push(new Search(SearchItem))});

    self.currentSearch =   ko.observable(self.savedsearches()[1]);

    self.incrementCounter = function() {
        self.currentSearch().clickCount(self.currentSearch().clickCount() + 1);
    };

    self.setCurrentSearch = function(){
        console.log(self.savedsearches.indexOf(this));
        self.currentSearch(this);
    }

    self.filterTerm = ko.observable('enter a new nickname');

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
        console.log(this.nick);
        var name = this.nick;
        self.searchterms.remove(function(term) {
            return term.nick == name;
        });
    }

    self.searchterms = ko.observableArray(data.searchterms);


       
};


ko.applyBindings(new ViewModel());

