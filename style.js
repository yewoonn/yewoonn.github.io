

var DayNightModeNow = "day";






var Content = {
    
    setBackColor:function(color){
        document.querySelector('body').style.backgroundColor=color;
    },

    setColor:function(color){
        document.querySelector('body').style.color=color;
        document.querySelector('h1').style.color=color;
    },

    setButtonValue:function(mode){
        var flag = document.getElementById("DayNightButton");
        flag.value = mode;
    },

    printText:function(){
        text = document.getElementById("changeText").value;
        document.getElementById("result").innerText += text+'\n';

    }
    
}

function DayNightHandler(self){

    if(DayNightModeNow === "day"){
        //밤으로 변경
        Content.setBackColor('black');
        Content.setColor('white');

        DayNightModeNow = "night";
        Content.setButtonValue("day");
    }
    else{
        Content.setBackColor('white');
        Content.setColor('black');

        DayNightModeNow = "day";
        Content.setButtonValue("night");
    }

}

function TextChangeHandler(self){

    Content.printText();

}