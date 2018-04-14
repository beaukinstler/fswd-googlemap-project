var ViewModel = function() {

    var self = this;

    var data = {
        "clickCount": 0,
        "name":"",
        "imgSrc":"img/434164568_fea0ad4013_z.jpg",
        "imgAttr":"",
        "nicknames":[
            {"nick":'Bert',"nickClicks":3},
            {"nick":'Charles',"nickClicks":0},
            {"nick":'Denise',"nickClicks":0}
        ]

    };

    self.currentCat =   ko.observable(new Cat(data));

    self.incrementCounter = function() {
        self.currentCat().clickCount(self.currentCat().clickCount() + 1);
    };

    self.newNickName = ko.observable('enter a new nickname');

    self.addNick = function() {
        self.currentCat().nicknames.push({ nick: self.newNickName(),nickClicks:0 });
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
        var temp = Object.create(this);
        temp.nickClicks += 1;
        self.nicknames.replace(this,temp);
    };

    self.nicknames = ko.observableArray(data.nicknames);


    self.topNickName = ko.computed(function() {
        var temp = Object.create(self.nicknames())
        return temp.sort(function (left, right) { return left.nickClicks == right.nickClicks ? 0 : (left.nickClicks < right.nickClicks ? 1 :-1)})[0].nick ;
    }, self);        
};


ko.applyBindings(new ViewModel());

