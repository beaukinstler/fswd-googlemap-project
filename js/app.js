
var initialCats = [
    {
        "clickCount": 0,
        "name":"Tabby",
        "imgSrc":"img/434164568_fea0ad4013_z.jpg",
        "imgAttr":"",
        "nicknames":[
                {"nick":'Bert',"nickClicks":3},
                {"nick":'Charles',"nickClicks":0},
                {"nick":'Denise',"nickClicks":0}
            ]   
    },
    {
        "clickCount": 0,
        "name":"Flabby",
        "imgSrc":"img/434164568_fea0ad4013_z.jpg",
        "imgAttr":"",
        "nicknames":[
                {"nick":'Flub',"nickClicks":3},
                {"nick":'Fan',"nickClicks":0},
                {"nick":'Fibber',"nickClicks":0}
            ]
    }
]




var ViewModel = function() {

    var self = this;
    self.cats = ko.observableArray([]);

    initialCats.forEach(function(catItem){
        self.cats().push(new Cat(catItem))});

    self.currentCat =   ko.observable(self.cats()[1]);

    self.incrementCounter = function() {
        self.currentCat().clickCount(self.currentCat().clickCount() + 1);
    };

    self.setCurrentCat = function(){
        console.log(self.cats.indexOf(this));
        self.currentCat(this);
    }

    self.filterTerm = ko.observable('enter a new nickname');

    self.filterList = function() {
        self.currentCat().nicknames.push({ nick: self.filterTerm(),nickClicks:0 });
    };



};


var Cat = function(data){
    var self = this;

    self.clickCount = ko.observable(data.clickCount);
    self.name = ko.observable(data.name);
    self.imgSrc = ko.observable(data.imgSrc);
    self.imgAttr = ko.observable(data.imgAttr);

    self.level = ko.computed(
        function(){
            switch (true) {
                case (self.clickCount() < 10):
                  return "Meh...."
                  break;
                case (self.clickCount() < 20):
                  return "Lovable"
                  break;
                case (self.clickCount() < 30):
                  return "Irresistible";
                  break;
                default:
                  return "Help!!! Stop!!"
            }}
        ,self);

    self.nickClicksAdd = function(){
        console.log(this.nick);
        var temp = Object.create(this);
        temp.nickClicks += 1;
        self.nicknames.replace(this,temp);
    };

    self.removeTerm = function () {
        console.log(this.nick);
        var name = this.nick;
        self.nicknames.remove(function(term) {
            return term.nick == name;
        });
    }

    self.nicknames = ko.observableArray(data.nicknames);


       
};


ko.applyBindings(new ViewModel());

