!function(){

    const WINNING_CONDITIONS = [
        [0,1,2], [3,4,5], [6,7,8], //Horizontal 
        [0,3,6], [1,4,7], [2,5,8], //Vertical 
        [0,4,8], [2,4,6] //Diagonal 
    ];

    const WINNER_OPTIONS = {
        player1: "player1",
        player2: "player2",
        tie: "tie",
        undetermined : ""
    }

    //Basic game state
    const state = {
        isPlayer1Turn: true,
        player1Boxes: [],
        player2Boxes: [],
        winner: WINNER_OPTIONS.undetermined
    }

    //An object to group all game logic methods
    const logic = {
        startNewGame: function(){
            ui.displayGameState("board");
        },

        handleTurnResults: function(boxIndex){

            let checkedBoxes = (state.isPlayer1Turn) ? state.player1Boxes : state.player2Boxes;

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
                            state.winner = (state.isPlayer1Turn) ? WINNER_OPTIONS.player1 : WINNER_OPTIONS.player2;
                            ui.displayGameState("win");           
                            return;
                        }
                    }
                }
            }

            if(state.player1Boxes.length + state.player2Boxes.length === 9){
                state.winner = WINNER_OPTIONS.tie;
                ui.displayGameState("win");      
                return;
            }

            state.isPlayer1Turn = !state.isPlayer1Turn;
            ui.indicateTurn();

            if(!state.isPlayer1Turn && state.winner === WINNER_OPTIONS.undetermined){
                this.playAiTurn();
            }
            
        },

        playAiTurn: function(){

            let timeout = setTimeout(()=>{
                let boxIndex = Math.floor(Math.random() * 8);  

                while(state.player1Boxes.indexOf(boxIndex) > -1 || 
                    state.player2Boxes.indexOf(boxIndex) > -1){ 

                    boxIndex = Math.floor(Math.random() * 8);
                }                  

                ui.fillBox(boxIndex);
                this.handleTurnResults(boxIndex);

                clearTimeout(timeout);
            },700);            
        },

        resetGame: function(){          
            state.isPlayer1Turn = true;
            state.player1Boxes = [];
            state.player2Boxes = [];
            state.winner = WINNER_OPTIONS.undetermined;
            ui.resetBoard();            
        }
    }

    //An object responsible for UI updates and handling player's input
    const ui = {
        
        init: function(){

            //Cache DOM references and attach event listeners
            this.screenStart = document.querySelector("#start");
            let startGameButton = this.screenStart.querySelector(".button");
            let playerNameField = this.screenStart.querySelector("#player1-name");
            this.player1Name = "Player 1";
            this.player2Name = "Computer";
            

            this.screenBoard = document.querySelector("#board");            
            let boxList = this.screenBoard.querySelector(".boxes");
            this.boxes = boxList.querySelectorAll("li");
            
            this.player1 = this.screenBoard.querySelector("#player1");   
            let player1NameTag = this.screenBoard.querySelector("#player1-name");  
            this.player2 = this.screenBoard.querySelector("#player2"); 
            let player2NameTag = this.screenBoard.querySelector("#player2-name");  

            startGameButton.addEventListener("click", (event)=>{

                if(playerNameField.value !== ""){
                    this.player1Name = playerNameField.value;
                }

                player1NameTag.innerText = this.player1Name;
                player2NameTag.innerText = this.player2Name;   
                
                logic.startNewGame();
            });

            boxList.addEventListener("click", this.handleClick.bind(this));
            boxList.addEventListener("mouseover", this.handleHover);
            boxList.addEventListener("mouseout", this.handleHover);

            this.screenWin = document.querySelector("#finish");
            this.screenWinMessageContainer = this.screenWin.querySelector(".message");
            let newGameButton = this.screenWin.querySelector(".button");
            newGameButton.addEventListener("click", (event)=>{
                logic.resetGame();
                ui.displayGameState("board");
            });

            this.displayGameState("start");
            this.indicateTurn();
        },

        handleClick: function(event){

            if(state.isPlayer1Turn && state.winner === WINNER_OPTIONS.undetermined){
                let box = event.target;

                if(!box.classList.contains("box-filled-1") && !box.classList.contains("box-filled-2")){                
                    let clickedIndex = Array.prototype.indexOf.call(this.boxes, box);
                    this.fillBox(clickedIndex);    
                    logic.handleTurnResults(clickedIndex);                                     
                }                 
            }
                      
        },

        fillBox: function(boxIndex){
            let box = this.boxes[boxIndex];
            let playerClass = (state.isPlayer1Turn) ? "box-filled-1" : "box-filled-2";
            box.classList.add(playerClass);
        },

        handleHover: function(event){

            if(state.isPlayer1Turn && state.winner === WINNER_OPTIONS.undetermined){
                let box = event.target;
                let playerImage = (state.isPlayer1Turn) ? "o" : "x";

                if(!box.classList.contains("box-filled-1") && !box.classList.contains("box-filled-2")){
                    if(event.type === "mouseover") {
                        box.style.backgroundImage = "url(img/" + playerImage + ".svg)";
                    }else{
                        box.style.backgroundImage = "";
                    }
                }  
            }         
        },

        indicateTurn: function(){
            
            if(state.isPlayer1Turn){
                this.player1.classList.add("active");
                this.player2.classList.remove("active");
            }else{
                this.player1.classList.remove("active");
                this.player2.classList.add("active");
            }
        },

        displayGameState: function(gameState){

            let timeout;

            if(gameState === "start"){
                this.screenStart.style.display = "block";
                this.screenBoard.style.display = "none";
                this.screenWin.style.display = "none";
            }else if(gameState === "board"){
                this.screenStart.style.display = "none";
                this.screenBoard.style.display = "block";
                this.screenWin.style.display = "none";
            }else{
                timeout = setTimeout(()=>{
                    this.screenStart.style.display = "none";
                    this.screenBoard.style.display = "none";
                    this.screenWin.style.display = "block";

                    let winnerClass;
                    let winnerName;
                    
                    if(state.winner === WINNER_OPTIONS.player1){
                        winnerClass = "screen-win-one";
                        winnerName = this.player1Name + " wins!";
                    }else if(state.winner === WINNER_OPTIONS.player2){
                    winnerClass = "screen-win-two";
                    winnerName = this.player2Name + " wins!";
                    }else{
                        winnerClass = "screen-win-tie";
                        winnerName = "It's a tie!";
                    }
                    this.screenWinMessageContainer.innerText = winnerName;
                    this.screenWin.classList.remove("screen-win-one", "screen-win-two");
                    this.screenWin.classList.add(winnerClass);
                    
                    clearTimeout(timeout);
                }, 1000);

                


            }
        },

        resetBoard: function(){
            for(let i = 0; i < this.boxes.length; i++){
                this.boxes[i].classList.remove("box-filled-1", "box-filled-2");
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