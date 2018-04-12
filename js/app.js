var ViewModel = function() {

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

      

    self.incrementCounter = function() {
        self.clickCount(self.clickCount() + 1);
    };

    self.incrementNickCounter = function() {
        self.clickNickCount(self.clickNickCount() + 1);
    };

    self.changeFirstNick = function() {
        self.nicknames()[0].nick = "Ted";
    };


    // data

    self.addNick = function() {
        self.nicknames.push({ nick: "newname",nickClicks:0 });
    };

    // function addAClick(obj){
    //     obj.nickClicks +=1;
    //     return obj;
    // };

    self.nickClicksAdd = function(){
        console.log(this);
        var temp = Object.create(this);
        temp.nickClicks += 1;
        self.nicknames.replace(this,temp);
        console.log(self.nicknames());
        // for (name in self.nicknames()){
        //     console.log(self.nicknames()[name].nick == this.nick)
        //     if (self.nicknames()[name].nick == this.nick){
        //         console.log("match" )
        //         console.log(self.nicknames()[name].nickClicks);
        //         self.nicknames()[name].nickClicks += 1;
        //         console.log(self.nicknames()[name].nickClicks);
        //     }
        // }
    }
    self.nicknames = ko.observableArray([
            {"nick":'Bert',"nickClicks":3},
            {"nick":'Charles',"nickClicks":0},
            {"nick":'Denise',"nickClicks":0}
        ]);

    self.topNickName = ko.computed(function() {
        return self.nicknames().sort(function (left, right) { return left.nickClicks == right.nickClicks ? 0 : (left.nickClicks < right.nickClicks ? 1 : 0)})[0].nick ;
    }, self);  
}

ko.applyBindings(new ViewModel());

