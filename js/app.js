!function(){

    //All possible winning patterns
    const WINNING_PATTERNS = [
        [0,1,2], [3,4,5], [6,7,8], //Horizontal 
        [0,3,6], [1,4,7], [2,5,8], //Vertical 
        [0,4,8], [2,4,6] //Diagonal 
    ];

    //String constants to use in code
    const WINNER_OPTIONS = {
        player1: "player1",
        player2: "player2",
        tie: "tie",
        undetermined : ""
    }

    //Basic game state model
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

            //Setting which player is filling boxes
            let filldBoxes = (state.isPlayer1Turn) ? state.player1Boxes : state.player2Boxes;

            filldBoxes.push(boxIndex);  

            //Checking if a winning or tie condition has been reached by matching all the boxes filled by players with predefined patterns
            if(filldBoxes.length > 2){

                for(let i = 0; i < WINNING_PATTERNS.length; i++){

                   let winningPattern = WINNING_PATTERNS[i];

                    let matchesCount = 0;

                    for(let t = 0; t < filldBoxes.length; t++){
                        
                        let filledBox = filldBoxes[t];

                        if(winningPattern.indexOf(filledBox) > -1){
                            matchesCount++;
                        }

                        //If there are more than 2 matches with a winning pattern, the current player wins
                        if(matchesCount > 2){
                            state.winner = (state.isPlayer1Turn) ? WINNER_OPTIONS.player1 : WINNER_OPTIONS.player2;
                            ui.displayGameState("win");           
                            return;
                        }
                    }
                }
            }

            //If no win has happended yet but all 9 boxes are filled, end the game with a tie
            if(state.player1Boxes.length + state.player2Boxes.length === 9){
                state.winner = WINNER_OPTIONS.tie;
                ui.displayGameState("win");      
                return;
            }

            //Alternate player turns in the logic and visually
            state.isPlayer1Turn = !state.isPlayer1Turn;
            ui.indicateTurn();

            //After the player's turn run the AI player
            if(!state.isPlayer1Turn && state.winner === WINNER_OPTIONS.undetermined){
                this.playAiTurn();
            }
        },
       
        //All the AI logic is here.

        //I haven't looked up existing Tic Tac Toe AI patterns for reference since I wanted to give it a shot myself
        //TODO: add logic for the AI to prevent the user from winning. Currently it only cares about itself winning
        playAiTurn: function(){

            //Give the AI logic a small timeout so that the game feels more natural
            let timeout = setTimeout(()=>{
                
                let boxIndex; //Holds the index of the box the AI ends up picking
                
                let possibleWinningCondition = {};
                let isAiWinPossible = false;

                //Loop through all winning patterns
                for(let i = 0; i < WINNING_PATTERNS.length; i++){
                    
                    let currentPatern = WINNING_PATTERNS[i];

                    let p1BoxesCount = 0,
                        p2BoxesCount = 0;                  
                    
                    //Loop through each box in each pattern
                    for(let t = 0; t < currentPatern.length; t++){
                
                        let boxIndexInPattern = currentPatern[t];

                        //Count how many boxes in this pattern the user has already picked
                        if(state.player1Boxes.indexOf(boxIndexInPattern) > -1){    
                            p1BoxesCount+=1;
                        }

                        //Count how many boxes in this pattern the AI has already picked
                        if(state.player2Boxes.indexOf(boxIndexInPattern) > -1){
                            p2BoxesCount+=1;
                        }                                           
                    }            

                    //isAiWinPossible is false by default but every time a pattern is found where the user has not yet touched, it is set to true
                    if(p1BoxesCount === 0){
                        isAiWinPossible = true;    
                    }
                    
                    //Find 
                    if(p1BoxesCount === 0 && 
                       (possibleWinningCondition.p2BoxesCount <= p2BoxesCount || 
                        typeof possibleWinningCondition.p2BoxesCount === 'undefined')  
                    ) {
                        possibleWinningCondition.pattern = currentPatern;
                        possibleWinningCondition.p1BoxesCount = p1BoxesCount;
                        possibleWinningCondition.p2BoxesCount = p2BoxesCount;
                    } 
                }               

                //If there are no user Os in  the pattern, proceed with filling the boxes sequentially
                if(isAiWinPossible){
                    for(let k = 0; k < possibleWinningCondition.pattern.length; k++){

                        let index = possibleWinningCondition.pattern[k];

                        if(state.player2Boxes.indexOf(index) === -1){
                            boxIndex = index;
                            break;
                        }
                    }
                }else{
                    //As soon as there are no available winnable patterns, just try to randomly pick and fill the last available boxes
                    boxIndex = Math.floor(Math.random() * 8);  

                    while(state.player1Boxes.indexOf(boxIndex) > -1 || 
                        state.player2Boxes.indexOf(boxIndex) > -1){ 

                        boxIndex = Math.floor(Math.random() * 8);
                    }     
                }                

                //Fill the box and check the results of the turn
                ui.fillBox(boxIndex);
                this.handleTurnResults(boxIndex);

                clearTimeout(timeout);
            },500);            
        },

        //Set everything to initial state
        resetGame: function(){          
            state.isPlayer1Turn = true;
            state.player1Boxes = [];
            state.player2Boxes = [];
            state.winner = WINNER_OPTIONS.undetermined;
            ui.resetBoard();            
        }
    }

    //All UI logic is here
    const ui = {
        
        //Prepare what's needed for the game to run
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

            //Only allow to proceed if it's the player's turn
            if(state.isPlayer1Turn && state.winner === WINNER_OPTIONS.undetermined){ 
                let box = event.target; 

                //Only allow filling empty boxes
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

            //Only allow to proceed if it's the player's turn
            if(state.isPlayer1Turn && state.winner === WINNER_OPTIONS.undetermined){
                let box = event.target;
                let playerImage = (state.isPlayer1Turn) ? "o" : "x";

                 //Only allow filling empty boxes
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

        //Managing transitions between screens 
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
                //Adding a slight delay before the win screen appears so that the user has a bit of time to review the board
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
                        winnerName = "It's a Tie!";
                    }
                    this.screenWinMessageContainer.innerText = winnerName;
                    this.screenWin.classList.remove("screen-win-one", "screen-win-two", "screen-win-tie");
                    this.screenWin.classList.add(winnerClass);
                    
                    clearTimeout(timeout);
                }, 1000);               
            }
        },

        //Reset board visuals
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