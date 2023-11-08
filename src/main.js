// INDEX.HTML DO PROJETO DE JOGO DO DETONA RALPH 
// POR RAFAEL_SOL_MAKER (RSM)
// EDITADO: 08/11/23

// ============================== ELEMENTOS ===============================

// Variáveis e constantes que controlam o estado do jogo
const gameState = {
    view:{
        squares: document.body.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timer: document.querySelector("#time-left"),
        score: document.querySelector("#game-score"),
    },
    values:{ 
        score: -1,
        currentTime: -1,
        currentDifficulty: -1,
    },
    consts:{ 
        // Inimigo       
        EnemyStartingTime: 1200,
        EnemyTimeDecrease: 130,
        // Placar
        ScoreHit: 100,
        ScoreMiss: -10,
        BonusScorePerDifficulty: 50,
        // Configurações da Fase
        StageTime: 120 + 1, // 120 segundos: 2 minutos
        // Dificuldade
        DifficultyInterval: 20,
        MaximumDifficult: 5,
    },
    timers: {
        // Inimigo aparece a cada 1 segundo, mas fica mais rápido com a dificuldade
        enemyTimer: null,
        clockTimer: null, 
        difficultyTimer: null,
    }
};

// ============================== SOM ===============================

function playHit() {
    playSound("hit", 10.0);
}

function playMiss() {
    playSound("error", 25.0);
}

function playDifficultyUp() {
    playSound("harder", 5.0);
}

function playSound(filename, volume = 100.0, loop = false/*, autoPlay = false*/) {
    let audio = new Audio("./assets/audio/"+ filename + ".m4a");
    audio.volume = volume / 100.0;
    audio.loop = loop;
    // audio.autoplay = autoPlay;
    audio.play();
}

// ============================== EVENTOS ===============================

function addListerners (){
    const squares = gameState.view.squares;
    squares.forEach((square)=> {
        square.addEventListener("click", checkClick.bind(this, square));
    });
    const enemy = gameState.view.enemy;
    enemy.addEventListener("click", checkClick.bind(this, enemy));
    // Botão de resetar
    document.getElementById("reset-button").addEventListener("click", askReset.bind(this));
}

function askReset () {
    const reset = confirm("Are you sure you want to reset the game?");
    if (reset == true) {
        resetGame();
    }
}

function checkClick(element) {       
    if (element.className === "enemy") {
        // Toca acerto
        playHit();
        // Calculate e atualiza placar
        let hit = gameState.consts.ScoreHit;
        let score = calculateScore(hit);
        updateScore(score);
        // Limpar quadrado
        element.className = "square";    
    } else {
        // Toca erro
        playMiss();
        // Calculate e atualiza placar
        let miss = gameState.consts.ScoreMiss 
        let score = miss * gameState.values.currentDifficulty;
        updateScore(score);   
    }
}

// ============================== TEMPORIZADORES ===============================

function updateClock() {
    gameState.values.currentTime--;
    let time =  gameState.values.currentTime;
    const mins = Math.floor(time/60);
    const segs = (time % 60);
    gameState.view.timer.innerHTML = String(mins).padStart(2, '0') + ":" + String(segs).padStart(2, '0');

    if (time < 0) {
        alert("GAME OVER!\nYour Final Score: " + gameState.values.score + "\nThanks for playing!");
        resetGame();
    }
}

function setupTimers (){
    // Atualiza relógio a cada segundo
    gameState.timers.clockTimer = setInterval(updateClock, 1000);
    let diffInterval = gameState.consts.DifficultyInterval;
    gameState.timers.difficultyTimer = setInterval(increaseDifficulty, diffInterval * 1000);    
    let enemyTimer = gameState.consts.EnemyStartingTime;
    gameState.timers.enemyTimer = setInterval(setupEnemy, enemyTimer);
}

function increaseDifficulty () {
    playDifficultyUp();
    let currDiff = gameState.values.currentDifficulty;
    let maxDiff = gameState.consts.MaximumDifficult;
    if (currDiff < maxDiff) {
        gameState.values.currentDifficulty++; 
        let currDiff = gameState.values.currentDifficulty; // Precisa???

        // Limpa timer do inimigo e reseta ele. Poderia ser numa função diferente
        clearInterval(gameState.timers.enemyTimer);
        let startTimer = gameState.consts.EnemyStartingTime;
        let decrease = gameState.consts.EnemyTimeDecrease;
        let enemyTimer = startTimer - (currDiff * decrease);
        gameState.timers.enemyTimer = setInterval(setupEnemy, enemyTimer);
    }   
}

// ============================== INTERNOS ===============================

function calculateScore(baseScore) {
    let currDiff = gameState.values.currentDifficulty;
    let bonus = gameState.consts.BonusScorePerDifficulty;
    let score = baseScore + ((currDiff - 1) * bonus);
    return score;    
}

function updateScore(points) {    
    // Update das variáveis internas
    gameState.values.score += points;
    // Update do texto
    let score = gameState.values.score;
    // Converter pra valor absoluto pra evitar bug de valor negativo
    let scoreText =  String(Math.abs(score)).padStart(6, '0'); 
    if (score >= 0) {
        gameState.view.score.innerHTML = scoreText;
    } else {
        gameState.view.score.innerHTML = "-" + scoreText;
    }    
}

function clearAllSquares (){
    for (let i = 0; i < 9; i++) {
        const element = document.querySelector("#s"+i.toString()); 
        element.className = "square";
    }
}

function setupEnemy (){
    clearAllSquares();
    let number = Math.floor(Math.random()*9);
    gameState.view.squares[number].className = "enemy";
}

function resetGame () {
    clearTimers();
    resetVariables();
    setupTimers();
}

function clearTimers () {
    clearInterval(gameState.timers.clockTimer);
    clearInterval(gameState.timers.difficultyTimer);
    clearInterval(gameState.timers.enemyTimer);
}

function resetVariables (){
    gameState.values.score = 0;
    gameState.values.currentDifficulty = 1;
    gameState.values.currentTime = gameState.consts.StageTime;
    updateClock();
    updateScore(0);
} 

// ============================== INIT ===============================

function initialize(){
    addListerners();
    setupTimers();
    setupEnemy();
    resetVariables();
}

window.addEventListener("load", initialize);