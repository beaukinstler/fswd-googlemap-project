var ViewModel = function() {

    var self = this;
    self.currentCat =   ko.observable(new Cat());

    self.incrementCounter = function() {
        self.currentCat().clickCount(self.currentCat().clickCount() + 1);
    };

    // this.incrementNickCounter = function() {
    //     this.currentCat().clickNickCount(this.currentCat().clickNickCount() + 1);
    // };

    // this.changeFirstNick = function() {
    //     this.currentCat().nicknames()[0].nick = "Ted";
    // };



    self.newNickName = ko.observable('enter a new nickname');
    self.addNick = function() {
        self.currentCat().nicknames.push({ nick: self.newNickName(),nickClicks:0 });
    };

    // function addAClick(obj){
    //     obj.nickClicks +=1;
    //     return obj;
    // };


}


var Cat = function(){
    var self = this;

    self.clickCount = ko.observable(0);
    self.clickNickCount = ko.observable(0);
    self.name = ko.observable('Tabby');
    self.imgSrc = ko.observable('img/434164568_fea0ad4013_z.jpg');
    self.imgAttr = ko.observable('');

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
        console.log(this);
        var temp = Object.create(this);
        temp.nickClicks += 1;
        self.nicknames.replace(this,temp);
        console.log(self.nicknames());

    }
    self.nicknames = ko.observableArray([
        {"nick":'Bert',"nickClicks":3},
        {"nick":'Charles',"nickClicks":0},
        {"nick":'Denise',"nickClicks":0}
    ]);

    self.topNickName = ko.computed(function() {
        var temp = Object.create(self.nicknames())
        return temp.sort(function (left, right) { return left.nickClicks == right.nickClicks ? 0 : (left.nickClicks < right.nickClicks ? 1 :-1)})[0].nick ;
    }, self);        
}


ko.applyBindings(new ViewModel());

