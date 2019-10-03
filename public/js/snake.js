const ground = new Image();
const foodImg = new Image();
const dead = new Audio();
const eat = new Audio();
const up = new Audio();
const right = new Audio();
const left = new Audio();
const down = new Audio();
// Declare canvas
const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");
const box = 32;

// load images
ground.src = "/public/img/ground.png";
foodImg.src = "/public/img/food.png";
// load audio files
dead.src = "/public/audio/dead.mp3";
eat.src = "/public/audio/eat.mp3";
up.src = "/public/audio/up.mp3";
right.src = "/public/audio/right.mp3";
left.src = "/public/audio/left.mp3";
down.src = "/public/audio/down.mp3";

// make sound
const sound = (key) => {
    if( key == "LEFT"){
        left.play();
    }else if(key == "UP"){
        up.play();
    }else if(key == "RIGHT"){
        right.play();
    }else if(key == "DOWN"){
        down.play();
    }else if(key == "EAT") {
        eat.play();
    }
}

// draw everything to the canvas
const draw = ({snake, food, score}) => {
    // draw playground
    ctx.drawImage(ground,0,0);
    
    // draw snake
    for( let i = 0; i < snake.length ; i++){
        // choose green for snake head
        ctx.fillStyle = ( i == 0 )? "green" : "white";
        ctx.fillRect(snake[i].x,snake[i].y,box,box);
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x,snake[i].y,box,box);
    }
    
    // draw food
    ctx.drawImage(foodImg, food.x, food.y);
    
    // draw score
    ctx.fillStyle = "white";
    ctx.font = "45px Changa one";
    ctx.fillText(score,2*box,1.6*box);
}

// create socket
const socket = io();

// catch message from server chat channel
socket.on('chat', function(msg){
    // Create p tag with msg from server
    const element = document.createElement("P");
    const text = document.createTextNode(msg);
    element.appendChild(text);
    const messages = document.getElementById("messages");
    messages.insertBefore(element, messages.childNodes[0]);
    // make noise
    sound(msg);
});

// catch message from server game channel
socket.on('game', function(state){
    // Set game state
    draw(state);
});

// send message to server via input
document.getElementById("form").onsubmit = (e) => {
    e.preventDefault();
    // send message to server
    const input = document.getElementById("m");
    const msg = input.value;
    socket.emit('chat', msg);
    // clear input
    input.value = '';
    return false;
};

alert("控制方法: 輸入 LEFT / RIGHT / UP / DOWN 任一指令")