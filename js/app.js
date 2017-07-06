!function(){

    const WINNING_CONDITIONS = [
        [0,1,2], [3,4,5], [6,7,8], //Horizontal 
        [0,3,6], [1,3,7], [2,4,8], //Vertical 
        [0,4,8], [2,4,6] //Diagonal 
    ];

    const state = {

        boxesX: [],
        boxesO: []

    }

    const logic = {
        startNewGame: function(){
            ui.showBoardState();
        },

        handleBoxEvent: function(event){

            let box = event.target;

            if(event.type === "mouseover" && !box.classList.contains("checked")) {

                box.style.backgroundImage = "url(img/x.svg)";

            }else if(event.type === "mouseout" && !box.classList.contains("checked")){

                box.style.backgroundImage = "";

            }else{
                box.classList.add("checked");
                box.style.backgroundImage = "url(img/x.svg)";
            }
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
            let boxes = this.screenBoard.querySelector(".boxes");

            boxes.addEventListener("click", (event)=>{
                logic.handleBoxEvent(event);
            });
            boxes.addEventListener("mouseover", (event)=>{
                logic.handleBoxEvent(event);
            });
            boxes.addEventListener("mouseout", (event)=>{
                logic.handleBoxEvent(event);
            });


            this.screenWin = document.querySelector("#finish");

            this.showStartState();
        },

        showStartState: function(){
            this.screenStart.style.display = "block";
            this.screenBoard.style.display = "none";
            this.screenWin.style.display = "none";
        },

        showBoardState: function(){
            this.screenStart.style.display = "none";
            this.screenBoard.style.display = "block";
            this.screenWin.style.display = "none";
        }        
    }    

    //Run the initial setup when the DOM is ready
    document.addEventListener("DOMContentLoaded", function(event) {
        ui.init();
    });
    

    

}();