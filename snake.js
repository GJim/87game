module.exports = function () {
  const box = 32;
  // create new food
  const create_food = () => {
    return {
      x : Math.floor(Math.random()*17+1) * box,
      y : Math.floor(Math.random()*15+3) * box
    }
  };
  // check if snake head and snake body collide
  const collision = (head, body) => {
    for(let i = 0, l=body.length; i < l; i++){
      if(head.x == body[i].x && head.y == body[i].y){
        return true;
      }
    }
    return false;
  }

  // contruct snake class
  this.lived = true;
  this.direction = "";
  this.score = 0;
  this.snake = [{
    x : 9 * box,
    y : 10 * box
  }];
  this.food = {x: 352, y: 224};
  // set direction of snake
  this.setDirection = (d) => {
    this.direction = d;
  }
  // get game state 
  // like position of snake and food or score
  this.getState = () => {
    return {
      score: this.score,
      snake: this.snake,
      food: this.food
    };
  }

  // change game state
  // like update new position or declare game over
  this.changeState = () => {
    const d = this.direction;
    if(d !== "") {
      // declare old head position
      let snakeX = this.snake[0].x;
      let snakeY = this.snake[0].y;

      // set new snake head position according to direction
      if( d === "LEFT") snakeX -= box;
      else if( d === "UP") snakeY -= box;
      else if( d === "RIGHT") snakeX += box;
      else if( d === "DOWN") snakeY += box;

      // if the snake eats the food
      if(snakeX == this.food.x && snakeY == this.food.y){
        this.score++;
        this.food = create_food();
      } else{
        // remove the tail
        this.snake.pop();
      }

      // create snake new head
      const newHead = {
        x : snakeX,
        y : snakeY
      }

      // game over
      // if snake head collide with playground boundary or it's body
      if(snakeX < box || snakeX > 17 * box || snakeY < 3*box || snakeY > 17*box || collision(newHead, this.snake)){
        this.lived = false;
      }
      
      // add new head to snake
      this.snake.unshift(newHead);
    }
  }
  // restart game
  this.reset = () => {
    this.lived = true;
    this.direction = "";
    this.score = 0;
    this.snake = [{
      x : 9 * box,
      y : 10 * box
    }];
    this.food = {x: 352, y: 224};
  }
}