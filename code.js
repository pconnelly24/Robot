words = ['gray','grey','maroon','robotics','motor','gear','extrusion','wheel','servo','sprocket','intake','claw'];
falling = [];

startingHeight = 0;
endingHeight = 0;
heightOffset = 0;

totalWords = 60;

running = null;

function startUp(){
    endingHeight = visualViewport.height;
    screenWidth = visualViewport.width;
    heightOffset = Math.floor(visualViewport.width/50);

    var offset = Math.floor(visualViewport.width/totalWords);

    for(var i = 0; i < totalWords; i++){
        var leftSide = offset*i
        falling.push(new Word(startingHeight, endingHeight, leftSide, heightOffset));
    }
    runTime();
}

function refresh(){
    clearTimeout(running);
    for(var i = 0; i < falling.length; i++){
        falling[i].kill();
    }
    falling = [];
    startUp();
}

function runTime(){
    for(var i = 0; i < falling.length; i++){
        falling[i].move();
    }
    running = setTimeout(function(){runTime()},100)
}

function Word(inputStartPos,inputEndPos, inputLeftSide, inputHeight){
    this.startPos = inputStartPos;
    this.endPos = inputEndPos;
    this.leftSide = inputLeftSide;
    this.height = inputHeight;
    
    this.letters = [];

    this.word = words[Math.floor(Math.random()*words.length)];
    this.letterColor = "#"+Math.floor(Math.random()*16777215).toString(16);
    this.startingOffset = (Math.floor(Math.random()*1000));


    this.init = function(){
        for (var i = 0; i < this.word.length; i++) {
            this.addLetter(this.word[i], i, i);   
        }
    }

    this.move = function(){
        for (var i = 0; i < this.letters.length; i++) {
            var newHeight = parseInt(this.letters[i].style.top)+this.height;
            if(newHeight > this.endPos){
                if(i == 0){
                    this.reset();
                }
                else if(i == this.letters.length-1){
                    if(this.letters.length<this.word.length){
                        for(var j = i+1; j < this.word.length; j++){
                            this.addLetter(this.word[j], j-i+1, j);
                        }
                    }
                }

                if(i<this.word.length){
                    this.letters[i].innerHTML = this.word[i];
                    this.letters[i].style.color = this.letterColor;
                    this.letters[i].style.top = this.startPos-this.startingOffset+"px";
                    this.letters[i].style.opacity = 1-((i/this.word.length))+0.2;
                }
                else{
                    this.removeLetter(this.letters.pop(this.letters[i]));
                }
            }
            else{
                this.letters[i].style.top = newHeight+"px";
            }
        }
    }

    this.reset = function(){
        this.word = words[Math.floor(Math.random()*words.length)];
        this.letterColor = "#"+Math.floor(Math.random()*16777215).toString(16);
        this.startingOffset = (Math.floor(Math.random()*1000));
    }

    this.kill = function(){
        for (var i = 0; i < this.letters.length; i++) {
            this.removeLetter(this.letters[i]);
        }
    }

    this.addLetter = function(letter, offset, opacityOff){
        var holderH = document.createElement("H1");
        var textH = document.createTextNode(letter);
        holderH.appendChild(textH);
        holderH.style.position = 'absolute';
        holderH.style.top = this.startPos-this.startingOffset-(offset*this.height)+"px";
        holderH.style.left = this.leftSide+"px";
        holderH.style.opacity = 1-((opacityOff/this.word.length))+0.2
        holderH.style.color=this.letterColor;
        this.letters.push(holderH);
        document.body.appendChild(holderH);
    }

    this.removeLetter = function(letter){
        document.body.removeChild(letter);
    }
    this.init();
    return this;
}