let Board=(function(){
  let matrix,turn,hasWon;
  let bot=false;
  
  let initialize=function(){
    matrix=[[0,0,0],
            [0,0,0],
            [0,0,0]];
    randomTurn();
    render();
    hasWon=false;
    document.querySelector("#result").style.display='none';
  }
  
  function randomTurn(){
    let rand=Math.floor(Math.random()*2);
    if(rand==0){
      turn='O';
    }else if(rand==1){
      turn='X';
      if(bot){
        let location=Bot.bestMove(matrix,true);
        properMark(location.i,location.j);8
      }
    }
    
  }
  
  let mark=function(x,y,what){
    if(matrix[x][y]==0){
      matrix[x][y]=what;
      //success
      return true;
    }else{
      //failed
      return false;
    }
  }
  
  let checkWin=function(matrix){
    let check=function(arr,choice){
      for(let x of arr){
        if(x != choice){
          return false;
        }
      }
      return true;
    }
    
    for(let i=0;i<3;i++){
      //row
      if(check([matrix[i][0],matrix[i][1],matrix[i][2]],'O')){
        return 'O';
      }else if(check([matrix[i][0],matrix[i][1],matrix[i][2]],'X')){
        return 'X';
      }
      
      //column
      if(check([matrix[0][i],matrix[1][i],matrix[2][i]],'O')){
        return 'O';
      }else if(check([matrix[0][i],matrix[1][i],matrix[2][i]],'X')){
        return 'X';
      }
    }
    
    //diagonals
    if(check([matrix[0][0],matrix[1][1],matrix[2][2]],'O')){
      return 'O';
    }else if(check([matrix[0][0],matrix[1][1],matrix[2][2]],'X')){
      return 'X';
    }
    
    if(check([matrix[0][2],matrix[1][1],matrix[2][0]],'O')){
      return 'O';
    }else if(check([matrix[0][2],matrix[1][1],matrix[2][0]],'X')){
      return 'X';
    }
    
    
    for(let i=0;i<3;i++){
      for(let j=0;j<3;j++){
        if(matrix[i][j]==0){
          return 0;
        }
      }
    }
    
    return 'tie';
  }
  
  function getMatrix(){
    return matrix;
  }
  
  function properMark(x,y){
    if(turn=='X'){
      let success = px.mark(x,y);
      if(success){
        turn='O';
      }
    }else if(turn=='O'){
      let success=po.mark(x,y);
      if(success){
        turn='X';
      }
      if(success&&bot){
        for(let i=0;i<3;i++){
          for(let j=0;j<3;j++){
            if(matrix[i][j]==0){
              setTimeout(function(){
                let location=Bot.bestMove(matrix,true);
                properMark(location.i,location.j);
              },5);
              return;
            }
          }
        }
      }
    }
  }
  
  function getHasWon(set=10){
    if(set!=10){
      hasWon=set
    }else{
      return hasWon;
    }
  }
  
  function botStatus(state=10){
    if(state!= 10){
      bot=state;
    }else{
      return bot;
    }
    
  }
  
  function turnWho(){
    return turn;
  }
  
  return {
    initialize,
    mark,
    checkWin,
    getMatrix,
    properMark,
    getHasWon,
    turnWho,
    botStatus
  }
})();

let Player=function(choice,n){
  let score=0;
  let name=n;
  function increaseScore(){
    score++;
  }
  
  function getScore(){
    return score;
  }
  
  let mark=function(x,y){
    if(Board.getHasWon()){
      return;
    }
    let success=Board.mark(x,y,choice);
    let winner=Board.checkWin(Board.getMatrix());
    let result=document.querySelector("#result");
    let winnerCongrat=document.querySelector("#winner");
    let bot = Board.botStatus();
    if(winner!=0){
      result.style.display="block";
    }
    if(winner=="O"){
      po.increaseScore();
      Board.getHasWon(true);
      result.style.backgroundColor="#3399ff";
      result.style.color="#ff0000";
      if(!bot){
        winnerCongrat.innerHTML="Congrations "+po.getName()+".<br>You have defeated "+px.getName();
      }else{
        winnerCongrat.innerHTML="IMPOSSIBLE! <br>How did you beat my A.I?";
      }
      
    }else if(winner=="X"){
      px.increaseScore();
      Board.getHasWon(true);
      result.style.backgroundColor= "#ff0000"; 
      result.style.color= "#3399ff";
      if(!bot){
        winnerCongrat.innerHTML="Congrations "+px.getName()+".<br>You have defeated "+po.getName();
        console.log(bot);
      }else{
        winnerCongrat.innerHTML="Nice try, "+po.getName()+".<br>But you will need a lot more than that to beat the A.I";
      }
    }else if(winner=="tie"){
      result.style.backgroundColor= "#ffffff"; 
      result.style.color= "#3399ff";
      if(!bot){
        winnerCongrat.innerHTML="It's a tie!<br>Try again next time.";
      }else{
        winnerCongrat.innerHTML="Wow you made it quite far.<br>But you cant beat my A.I";
      }
    }
    render();
    return success;
  }
  function setName(n){
    name=n;
  }
  function getName(){
    return name;
  }
  return {
    mark,
    getName,
    increaseScore,
    getScore,
    setName
  }
}

function render(){
  setTimeout(function(){
    let matrix=Board.getMatrix();
    for(let i=0;i<3;i++){
      for(let j=0;j<3;j++){
        let dom=document.querySelector(`#b${i}${j}`);
        if(matrix[i][j]!=0){
          dom.innerText=matrix[i][j];
          if(matrix[i][j]=='O'){
            dom.classList.add("o");
          }else if(matrix[i][j]=='X'){
            dom.classList.add("x");
          }
        }else{
          dom.innerText=" ";
          dom.classList.remove("o");
          dom.classList.remove("x");
        }
      }
    }
    let turn = Board.turnWho();
    let oplayer=document.querySelector("#po");
    let xplayer=document.querySelector("#px");
    
    if(turn=='O'){
      oplayer.classList.add("playero");
      xplayer.classList.remove("playerx");
      
      oplayer.classList.remove("po");
      xplayer.classList.add("px");
    }else if(turn=='X'){
      xplayer.classList.add("playerx");
      oplayer.classList.remove("playero");
      
      xplayer.classList.remove("px");
      oplayer.classList.add("po");
    }
    document.querySelector("#po").innerHTML=po.getName()+"<br>"+po.getScore();
    document.querySelector("#px").innerHTML=px.getName()+"<br>"+px.getScore()
  },1);
}


let Bot=(function(){
  let matCopy=function(target){
    let mat=[[0,0,0],[0,0,0],[0,0,0]]
    for(let i=0;i<3;i++){
      for(let j=0;j<3;j++){
        mat[i][j]=target[i][j];
      }
    }
    return mat;
  }
  let minimax=function(mat,isMaximizing){
    let matrix=matCopy(mat);
    
    let score=Board.checkWin(matrix);
    
    if(score=='O'){
      return -1;
    }else if(score=='X'){
      return 1;
    }else if(score=="tie"){
      return 0;
    }
    
    if(isMaximizing){
      let maxScore=-Infinity;
      for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
          if(matrix[i][j]==0){
            matrix[i][j]='X';
            let score=minimax(matrix,false);
            matrix[i][j]=0;
            maxScore=Math.max(maxScore,score);
          }
        }
      }
      return maxScore;
    }else{
      let minScore=Infinity;
      for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
          if(matrix[i][j]==0){
            matrix[i][j]='O';
            let score=minimax(matrix,true);
            matrix[i][j]=0;
            minScore=Math.min(minScore,score);
          }
        }
      }
      return minScore;
    }
  }
  
  
  function bestMove(mat){
    let matrix=matCopy(mat);
    let maxScore=-Infinity;
    let location;
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
          if(matrix[i][j]==0){
            matrix[i][j]='X';
            let score=minimax(matrix,false);
            matrix[i][j]=0;
            
            if(score>maxScore){
              maxScore=score;
              location={i,j};
            }
          }
        }
     }
     return location;
  }
  
  return {
    minimax,
    bestMove
  }
})()

let po,px,dom;
window.onload=function(){
  po=Player('O',"O");
  px=Player('X',"X");
  Board.initialize();
  
  dom=(function(){
    let player='two';
    let select=document.querySelector("#playerNo");
    let input1=document.querySelector("#p1input");
    let input2=document.querySelector("#p2input");
    let startScreen=document.querySelector("#start");
    let selectPlayer=function(){
      player= select.value;
      if(player=='one'){
        input2.style.display='none';
      }else{
        input2.style.display='block';
      }
    }
    
    let start=function(){
      if(player=='one'){
        if(input1.value==""||input1.value==" "){
          return;
        }
        startScreen.style.display='none';
        po.setName(input1.value);
        px.setName("A.I");
        Board.botStatus(true);
        Board.initialize();
        input1.value="";
        input2.value="";
      }else if(player=='two'){
        if(input1.value==""||input2.value==""){
          
          return;
        }
        startScreen.style.display='none';
        po.setName(input1.value);
        px.setName(input2.value);
        Board.botStatus(false);
        Board.initialize();
        input1.value="";
        input2.value="";
        
      }
    }
    function home(){
      document.querySelector("#result").style.display='none';
      startScreen.style.display='block';
      select.value="two";
      input1.value=po.getName();
      input2.value=px.getName();
    }
    return {
      selectPlayer,
      start,
      home
    }
  })();
  
}
