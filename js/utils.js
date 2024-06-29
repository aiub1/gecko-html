///////////////// VARIAVEIS GLOBAIS //////////////////

// Referência ao elemento <canvas> no documento HTML
var canvas = document.querySelector("canvas");

// Contexto 2D do canvas usado para desenhar
var c = canvas.getContext("2d");

// Indica se o jogo foi iniciado ou não
var gameStarted = false;

// Indica se o jogo foi vencido
var gameReseted = false;

// Variável para armazenar o tempo inicial quando o jogo é iniciado
let timeCounter;

// Valor da gravidade aplicada ao jogo
var gravity = 0.2;

// Conta o número de pulos realizados durante o jogo
let jumpCounter = 0;

// Conta o número de pulos rebotes durante o jogo
let bouncingCounter = 0;

//////////////// FUNÇÕES UTILITARIAS /////////////////

// Função para iniciar o contador de tempo
function startTime() {
  timeCounter = Date.now();
  console.log(timeCounter); // Mostra o tempo inicial no console
}

// Função para calcular e retornar o tempo decorrido desde startTime()
function getElapsedTime() { 
  if (gameStarted) {
    let currentTime = Date.now();
    let elapsedTime = currentTime - timeCounter;
  
    // Calcula minutos e segundos formatados com zero à esquerda se necessário
    let minutes = Math.floor(elapsedTime / 60000);
    let seconds = Math.floor((elapsedTime % 60000) / 1000);
  
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
}


// Função para verificar colisão entre dois objetos
function collision({ object1, object2 }) {
  return (
    // Verifica colisão no lado inferior do objeto1 com o lado superior do objeto2
    object1.position.y + object1.height >= object2.position.y &&
    // Verifica colisão no lado superior do objeto1 com o lado inferior do objeto2
    object1.position.y <= object2.position.y + object2.height &&
    // Verifica colisão no lado esquerdo do objeto1 com o lado direito do objeto2
    object1.position.x <= object2.position.x + object2.width &&
    // Verifica colisão no lado direito do objeto1 com o lado esquerdo do objeto2
    object1.position.x + object1.width >= object2.position.x
  );
}

// Função para verificar colisão no lado inferior (chão)
function floorCollision({ player, object1, object2 }) {
  // Adiciona uma margem de erro para lidar com imprecisões de ponto flutuante
  const marginOfError = 0.5;

  // Verifica se o jogador está colidindo com o chão (object2)
  return (
    // Verifica se a velocidade y do jogador é positiva (descendo)
    player.velocity.y >= 0 &&
    // Verifica se o lado inferior do objeto1 está próximo ao lado superior do objeto2 com margem de erro
    object1.position.y + object1.height >= object2.position.y - marginOfError &&
    object1.position.y + object1.height <= object2.position.y + marginOfError
  );
}
