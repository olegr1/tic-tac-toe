!function(){

    const WINNING_CONDITIONS = [
        [0,1,2], [3,4,5], [6,7,8], //Horizontal 
        [0,3,6], [1,4,7], [2,5,8], //Vertical 
        [0,4,8], [2,4,6] //Diagonal 
    ];

    const state = {
        isOsTurn: true,
        boxesX: [],
        boxesO: []
    }

    const logic = {
        startNewGame: function(){
            ui.displayGameState("board");
        },

        handleTurn: function(boxIndex){

            let checkedBoxes = (state.isOsTurn) ? state.boxesO : state.boxesX;

            checkedBoxes.push(boxIndex);

            if(checkedBoxes.length > 2){

                for(let i = 0; i < WINNING_CONDITIONS.length; i++){

                   let winningCondition = WINNING_CONDITIONS[i];

                    let matchesCount = 0;

                    for(let t = 0; t < checkedBoxes.length; t++){
                        
                        let checkedBox = checkedBoxes[t];

                        if(winningCondition.indexOf(checkedBox) > -1){
                            matchesCount++;
                        }

                        if(matchesCount > 2){
                            console.log("WINNER");  
                            this.resetGame();              
                            return;
                        }
                    }
                }
            }

            state.isOsTurn = !state.isOsTurn;
            ui.indicateTurn();
        },

        resetGame: function(){
            
            ui.displayGameState("win");

            state.isOsTurn = true;
            state.boxesX = [];
            state.boxesO = [];

            ui.resetBoard();
            
        }
    }

    const ui = {
        
        init: function(){

            //Cache DOM references and attach event listeners
            this.screenStart = document.querySelector("#start");
            let startGameButton = this.screenStart.querySelector(".button");

            startGameButton.addEventListener("click", (event)=>{
                logic.startNewGame();
            });

            this.screenBoard = document.querySelector("#board");            
            let boxList = this.screenBoard.querySelector(".boxes");
            this.boxes = boxList.querySelectorAll("li");

            this.playerX = this.screenBoard.querySelector("#player1");   
            this.playerO = this.screenBoard.querySelector("#player2");   

            boxList.addEventListener("click", this.handleClick.bind(this));
            boxList.addEventListener("mouseover", this.handleHover);
            boxList.addEventListener("mouseout", this.handleHover);

            this.screenWin = document.querySelector("#finish");

            this.displayGameState("start");
            this.indicateTurn();
        },

        handleClick: function(event){

            let box = event.target;
            let playerImage = (state.isOsTurn) ? "o" : "x";

            if(!box.classList.contains("checked")){
                box.classList.add("checked");
                box.style.backgroundImage = "url(img/" + playerImage + ".svg)";

                let clickedIndex = Array.prototype.indexOf.call(this.boxes, box);

                logic.handleTurn(clickedIndex);
            }            
        },

        handleHover: function(event){

            let box = event.target;
            let playerImage = (state.isOsTurn) ? "o" : "x";

            if(!box.classList.contains("checked")){
                if(event.type === "mouseover") {
                    box.style.backgroundImage = "url(img/" + playerImage + ".svg)";
                }else{
                    box.style.backgroundImage = "";
                }
            }            
        },

        indicateTurn: function(){
            
            if(state.isOsTurn){
                this.playerX.classList.add("active");
                this.playerO.classList.remove("active");
            }else{
                this.playerO.classList.add("active");
                this.playerX.classList.remove("active");
            }
        },

        displayGameState: function(gameState){

            if(gameState === "start"){
                this.screenStart.style.display = "block";
                this.screenBoard.style.display = "none";
                this.screenWin.style.display = "none";
            }else if(gameState === "board"){
                this.screenStart.style.display = "none";
                this.screenBoard.style.display = "block";
                this.screenWin.style.display = "none";
            }else{
                this.screenStart.style.display = "none";
                this.screenBoard.style.display = "none";
                this.screenWin.style.display = "block";

                let winnerClass = (state.isOsTurn) ? "screen-win-one" : "screen-win-two";
                
                this.screenWin.classList.remove("screen-win-one", "screen-win-two");
                this.screenWin.classList.add(winnerClass);
            }
        },

        resetBoard: function(){
            for(let i = 0; i < this.boxes.length; i++){
                this.boxes[i].classList.remove("checked");
                this.boxes[i].style.backgroundImage = "";
            }

            this.indicateTurn();
        }
    }    

    //Run the initial setup when the DOM is ready
    document.addEventListener("DOMContentLoaded", function(event) {
        ui.init();
    });
    

    

}();