// Declare backend service
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 80;

// Declare game parameter
const movingSpeed = process.env.SPEED || 500;
const leftCommand = ['LEFT', 'l'];
const rightCommand = ['RIGHT', 'r'];
const upCommand = ['UP', 'u'];
const downCommand = ['DOWN', 'd'];

app.use(helmet());
app.use(compression());
app.use('/public', express.static(__dirname+'/public'));
// show html file
app.get('/', function (req, res) {
  res.sendFile('/public/index.html', {root: __dirname});
});

// Create game
const game = new (require('./snake'))();

// Brocast game state to all client
const broadcastGameState = () => {
  game.changeState();
  // If game over restart it automatelly
  !game.lived && game.reset();
  io.emit('game', game.getState());
}
setInterval(broadcastGameState, movingSpeed);

// new socket client connect
io.on('connection', function(socket){
  // receive client message
  socket.on('chat', function(msg){
    // set new direction
    const d = game.direction;
    if( leftCommand.includes(msg) && d !== "RIGHT") game.setDirection("LEFT");
    else if( rightCommand.includes(msg) && d !== "LEFT") game.setDirection("RIGHT");
    else if( upCommand.includes(msg) && d !== "DOWN") game.setDirection("UP");
    else if( downCommand.includes(msg) && d !== "UP") game.setDirection("DOWN");
    else if( msg == "高雄") msg = "發大財";
    else if( msg == "韓國瑜") msg = "***";
    // broadcast message to all client
    io.emit('chat', msg);
  });
});

// start backend engine
http.listen(port, () => {
  console.log(`[INFO][PORT LISTEN]: ${port}, ${new Date().toLocaleString()}`);
});