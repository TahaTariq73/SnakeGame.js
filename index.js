// Constants and variables
const field = document.getElementById('field');
const _score = document.getElementById('score');
const _highscore = document.getElementById('high-score');
const GAME_OVER = new Audio('Music/gameover.mp3');
const FOOD_EATEN = new Audio('Music/food.mp3'); 
const SPEED = 11;

let score = 0;
let direction = {x: 0, y: 0};
let head_position = {x: parseInt(Math.random() * 16), y: parseInt(Math.random() * 16)};
let food_position = {x: parseInt(Math.random() * 14) + 2, y: parseInt(Math.random() * 14) + 2};
let snake = [head_position];

// Getting highscore from local storage
let highscore = localStorage.getItem('highscore');
if (highscore === null) {
    localStorage.setItem('highscore', 0);
}
_highscore.innerText = highscore;

// Game functions
const gameFunctions = function () {};

gameFunctions.prototype.isCollide = function () {
    // When snake collide with the borders
    if (snake[0].x > 16 || snake[0].x < 0 || snake[0].y > 16 || snake[0].y < 0) {
        GAME_OVER.play()
        return true;
    }

    // When head collides with the body 
    for (let i = 0; i < snake.length; i++) {
        if (i != 0 && snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            GAME_OVER.play();
            return true;
        }
    }
}

gameFunctions.prototype.isEat = function () {
    if (snake[0].x === food_position.x && snake[0].y === food_position.y) {
        // Changing food position and increasing snake length
        FOOD_EATEN.play()
        food_position.x = parseInt(Math.random() * 14) + 2;
        food_position.y = parseInt(Math.random() * 14) + 2;
        snake.unshift({x: snake[0].x + direction.x, y: snake[0].y + direction.y});
        
        // Increasing score and highscore
        score += 1;
        if (score >= highscore) {
            localStorage.clear();
            localStorage.setItem('highscore', score);
        }
        _score.innerText = score;
        _highscore.innerText = localStorage.getItem('highscore');
    }
}

gameFunctions.prototype.createElements = function () {
    // Creating and deleting elements
    field.innerHTML = "";
    for (let index = 0; index < snake.length; index++) {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridColumnStart = snake[index].x;
        snakeElement.style.gridRowStart = snake[index].y;
        
        if (index === 0) {
            snakeElement.classList.add('head');
        }
        else {
            snakeElement.classList.add('body');
        }
        field.append(snakeElement);
    }

    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food_position.y;
    foodElement.style.gridColumnStart = food_position.x;
    foodElement.classList.add('food');
    field.append(foodElement);
}

gameFunctions.prototype.moveSnake = function () {
    for (let index = snake.length - 2; index >= 0; index--) {
        snake[index + 1] = {...snake[index]};
    }

    snake[0].x += direction.x;
    snake[0].y += direction.y;
}

gameFunctions.prototype.restartGame = function (event) {
    if (event.code === "Space") {
        window.location.reload();
    }
}

const GAME_FUNCTIONS = new gameFunctions();

// Gameloop for constantly changing styles of elements
let lastTime;
function gameLoop(time) {
    if (GAME_FUNCTIONS.isCollide() === true) {
        alert('Gameover! Press spacebar to playagain.')
        window.addEventListener('keydown', (e) => {GAME_FUNCTIONS.restartGame(e)});
        return;
    }

    window.requestAnimationFrame(gameLoop);
    if ((time - lastTime) / 1000 < 1 / SPEED) {
        return;
    }

    GAME_FUNCTIONS.isEat();
    GAME_FUNCTIONS.createElements();
    GAME_FUNCTIONS.moveSnake();
    lastTime = time;
}
window.requestAnimationFrame(gameLoop);

// Controls and events
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case "ArrowUp":
            direction.x = 0;
            direction.y = -1;           
            break;
    
        case "ArrowDown":
            direction.x = 0;
            direction.y = 1;
            break;

        case "ArrowLeft":
            direction.x = -1;
            direction.y = 0;
            break;
        
        case "ArrowRight":
            direction.x = 1;
            direction.y = 0;
            break;
        default:
            break;
    }
})

// Controls for small devices
const btns = {1: [0, -1], 2: [0, 1], 3: [-1, 0], 4: [1, 0]};
for (let [key, value] of Object.entries(btns)) {
    let button = document.getElementById(`btn${key}`);
    button.addEventListener('click', () => {
        direction.x = value[0];
        direction.y = value[1];
    });
}