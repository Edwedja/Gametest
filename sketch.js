// CRIANDO AS VARIÁVEIS: 
var trex, trex_correndo, trex_colidiu;
var solo,imagemdosolo, soloinvisivel;
var nuvem, imagemdanuvem;
var obstaculo, obstaculo1, obstaculo2,obstaculo3,obstaculo4,obstaculo5,obstaculo6;
var pontuacao = 0;
var estadodojogo = "JOGAR";
var grupodeobstaculos, grupodenuvens;
var fimdeJogo, gameOver, restart, reiniciar;
var somSalto, somMorte, somCheckpoint;

//loadAnimation/loadImage = carrega todas as imagens/animações 
function preload (){
  
  trex_correndo = loadAnimation ("trex1.png", "trex3.png", "trex4.png");
  trex_colidiu = loadAnimation ("trex_collided.png");
  
  imagemdosolo = loadImage ( "ground2.png");
  
  imagemdanuvem = loadImage ("cloud.png");
  
  obstaculo1 = loadImage ("obstacle1.png");
  obstaculo2 = loadImage ("obstacle2.png");
  obstaculo3 = loadImage ("obstacle3.png");
  obstaculo4 = loadImage ("obstacle4.png");
  obstaculo5 = loadImage ("obstacle5.png");
  obstaculo6 = loadImage ("obstacle6.png");
  
  gameOver = loadImage ("gameOver.png");
  restart = loadImage ("restart.png");
  
  //add sons:
  somSalto = loadSound("jump.mp3");
  somMorte = loadSound("die.mp3");
  somCheckpoint = loadSound("checkPoint.mp3");

}

//Padrões de configuração do jogo!
function setup(){ 
  
  createCanvas(windowWidth,windowHeight);
  
  //criar um sprite do trex
  trex = createSprite(50,160,20,50);  
  trex.addAnimation ("running", trex_correndo); 
  trex.addAnimation("collided" , trex_colidiu)
  
  trex.scale = 0.5; //scala do trex
  
  //SOLO
  solo = createSprite(300,188,600,20); 
  solo.addImage ("ground1", imagemdosolo)
  
  //solo invisível:
  soloinvisivel = createSprite(300,200,600,10); 
  soloinvisivel.visible = false; 
  
  //Crianda os grupos:
  grupodeobstaculos = new Group ();
  grupodenuvens = new Group();

  trex.setCollider("circle", 0,0,40); // raio de colisão
  //trex.debug = true; // Abilita um circulo verde
  
  //FIM DE JOGO: 
  fimdeJogo = createSprite (width/2,100);
  fimdeJogo.addImage(gameOver);
  fimdeJogo.visible = false;
  fimdeJogo.scale = 0.5;
  
  reiniciar = createSprite (width/2,140);
  reiniciar.addImage(restart);
  reiniciar.visible = false;
  reiniciar.scale = 0.5;
  
  //escopo de variáveis: 
  //var mensagem = " Isso é uma mensagem!";
  //console.log(mensagem);
  
  
}
 
function draw(){
  //console.log (frameRate());
  background ("white");
  text("Pontuação: " + pontuacao, width-100,50);
  
  //console.log(mensagem);
  
  //ESTADO JOGAR: 
  if (estadodojogo === "JOGAR"){
     solo.velocityX = -(4 + (2*pontuacao/100));
     pontuacao = pontuacao + Math.round(getFrameRate()/60);
    
    if(pontuacao>0 && pontuacao%100 === 0 ){
      somCheckpoint.play();
    }
    
    //SOLO:
    if(solo.x<0) {
      solo.x=solo.width/2;  //width == largura
    }
    
    //trex pulando
    if( touches.length>0   || keyDown("space") && trex.y >=100) {    
      trex.velocityY = -10;
      somSalto.play();
      touches=[];
    }
    
    
    
    trex.velocityY = trex.velocityY + 0.8; //"gravidade"  
    gerarNuvens(); //gerador de nuvens
    gerarObstaculos(); //gerador de obstáculos
 
    if(grupodeobstaculos.isTouching(trex)){
      estadodojogo = "ENCERRAR";
      somMorte.play();
      trex.velocityY = 0;
    }
    
  //ESTADO ENCERRAR: 
  }else if(estadodojogo === "ENCERRAR"){
      solo.velocityX = 0;
    
      // ALTERA A ANIMAÇÃO DO TREX: 
      trex.changeAnimation("collided", trex_colidiu);

      // lifetime dos objetos do fim do jogo: 
      grupodeobstaculos.setLifetimeEach(-1);
      grupodenuvens.setLifetimeEach(-1); 
    
      //fim de jogo:
      fimdeJogo.visible = true;
      reiniciar.visible = true;
    
      grupodeobstaculos.setVelocityXEach(0);
      grupodenuvens.setVelocityXEach(0); 
    
      //Reiniciar:
      if(mousePressedOver(reiniciar)){ 
      reset();
        }
  }
  
  trex.collide (soloinvisivel );
  
  drawSprites();
}

function gerarNuvens (){
  if (frameCount %60 === 0){ // Add uma nuvem a cada 60 quadros
    nuvem = createSprite (width,100,40,10);
    nuvem.addImage (imagemdanuvem);
    nuvem.y = Math.round(random(10,60))
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
    //tempo de vida: 
    nuvem.lifetime = 202;
    
    //Ajustando a profundidade:
    nuvem.depth = trex.depth;
    trex.depth = trex.depth +1;
    
    //add ao grupo de nuvens: 
    grupodenuvens.add(nuvem);
  }
}

function gerarObstaculos () {
  if (frameCount %120 === 0){
    obstaculo = createSprite (width,176,10,40);
    obstaculo.velocityX = -(4 + (2*pontuacao/100));
    
    var rand = Math.round (random(1,6))
    switch(rand){
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
              default: break;
    }
    
    obstaculo.scale = 0.4;
    obstaculo.lifetime = 300;
    
    //Adicionando o obj ao grupo:
    grupodeobstaculos.add(obstaculo);
    obstaculo.depth = trex.depth;
    trex.depth = trex.depth +1;
  }
}  

function reset (){
  estadodojogo = "JOGAR";
  fimdeJogo.visible = false;
  reiniciar.visible = false;
  
  grupodeobstaculos.destroyEach();
  grupodenuvens.destroyEach();  
  
  trex.changeAnimation("running", trex_correndo);
  
  pontuacao = 0;
}












