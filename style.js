

var DayNightModeNow = "day";

var Coworkers = {
    "egoing" : "Teacher",
    "panghwi" : "Mentor",
    "yebaaa" : "Student",

    findCoworker:function(name){
    
        
        for(var key in Coworkers){
           
            if(key===name){
                document.getElementById("CoworkerProfile").innerText = ">> "+key+": "+Coworkers[key];
                break;
            }
           
        }
        
        if(key!=name){
            document.getElementById("CoworkerProfile").innerText = ">> 해당되는 이름이 없습니다.";
        }


       
    }
}




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

function CoworkerHandler(self){
    
    var name = document.getElementById("coworker").value;
   


    Coworkers.findCoworker(name);
}