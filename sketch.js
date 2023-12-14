var trex, trex_running, edges;
var ground;
var score;
var PLAY=1;
var END=0;
var end=2;
var x=0.5;
var gamestate=PLAY;
var restartImg;
var gameoverImg;
var bird, bird_flying

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  bird_flying = loadAnimation("bird1.png", "bird2.png");
  trex_crouch = loadAnimation("trex_crouch1.png", "trex_crouch2.png");
  ground_image = loadImage("ground2.png");
  cloudImg = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  trexCollided = loadAnimation("trex_collided.png");
  gameoverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkpointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);

  ground = createSprite(300, 180, 600, 20);
  ground.addImage(ground_image);

  gameover = createSprite(300,50)
  gameover.addImage(gameoverImg)
  gameover.visible=false
  restart = createSprite(300,100)
  restart.addImage(restartImg)
  restart.visible=false
  gameover.scale = 0.5
  restart.scale = 0.5

  // creating trex
  trex = createSprite(50, 160, 20, 70);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trexCollided);
  trex.addAnimation("crouch",trex_crouch);
  trex.scale = 0.5;

  trex.setCollider("rectangle",0,0,70,110)
  trex.debug=false

  edges = createEdgeSprites();

  invisible_ground = createSprite(300, 200, 600, 20);
  invisible_ground.visible = false;

  obstacleGroup=new Group()
  cloudGroup=new Group()
  birdGroup=new Group()

  score=0;
}

function draw() {
  //set background color
  background("gray");

  if (gamestate==PLAY){
    if ((keyDown("up")||keyDown("space")) && trex.y >= 150) {
      trex.velocityY = -10;
      x=0.5;
      jumpSound.play()
    }

    if (keyWentDown("down")){
      x+=2
      trex.changeAnimation("crouch")
    }  

    if (keyWentUp("down")){
      trex.changeAnimation("running")
      x=0.5
    }  

    fill("white")
    text("Score:"+score,500,50)
  if (frameCount%20==0){
    score+=1
  }

  ground.velocityX = -(2+score/10);
  if (ground.x < 0) {
    ground.x = width / 2;
  }

  trex.velocityY += x;
  spawnClouds();
  spawnObstacles();
  spawnBirds();

  if (score>0&&score%20 == 0){
    checkpointSound.play()
  }

  if (obstacleGroup.isTouching(trex)){
    gamestate=END 
    dieSound.play()
  }

  if (birdGroup.isTouching(trex)){
    gamestate=end 
    dieSound.play()
  }
  }

  else if (gamestate==end){
    ground.velocityX=0
    cloudGroup.setVelocityXEach(0)
    obstacleGroup.setVelocityXEach(0)
    obstacleGroup.setLifetimeEach(-1)
    cloudGroup.setLifetimeEach(-1)

    trex.changeAnimation("collided")
    
    gameover.visible=true
    restart.visible=true

    if (mousePressedOver(restart)){
      reset()
        }
  }

  else if (gamestate==END){
    ground.velocityX=0
    cloudGroup.setVelocityXEach(0)
    obstacleGroup.setVelocityXEach(0)
    obstacleGroup.setLifetimeEach(-1)
    cloudGroup.setLifetimeEach(-1)
    trex.velocityY=0

    trex.changeAnimation("collided")
    
    gameover.visible=true
    restart.visible=true

    if (mousePressedOver(restart)){
      reset()
        }
  }

  trex.collide(invisible_ground);
  trex.collide(edges[2]);

  drawSprites();
}

function spawnClouds() {
  if (frameCount % 120 == 0) {
    cloud = createSprite(600, 50, 40, 10);
    cloud.addImage(cloudImg);
    cloud.y = Math.round(random(20, 60));
    cloud.velocityX = -2;
    
    cloud.depth=trex.depth
    trex.depth+=1
    
    cloud.lifetime=330
    
    console.log(trex.depth)
    console.log(cloud.depth)
    cloud.scale=0.5

    cloudGroup.add(cloud)
  }
}

function spawnObstacles() {
  if (frameCount%300 == 0){
    obstacle = createSprite(600,160,10,40)

    obstacle.velocityX = -(4+score/5)

    var rand=Math.round(random(1,6))
    switch(rand){
      case 1:obstacle.addImage(obstacle1);
            break;
      case 2:obstacle.addImage(obstacle2);
            break;
      case 3:obstacle.addImage(obstacle3);
            break;
      case 4:obstacle.addImage(obstacle4)
            break;
      case 5:obstacle.addImage(obstacle5)
            break;
      case 6:obstacle.addAnimation("flying",bird_flying)
            break;
      default:break
    }
obstacle.scale=0.5
obstacle.lifetime=330

    obstacleGroup.add(obstacle)

  }
    
}

function spawnBirds(){
  if (score>0&&frameCount%122 == 0){
    bird = createSprite(600,Math.round(random(100,180)),10,40)
    bird.addAnimation("flying",bird_flying)
    bird.velocityX = -(4+score/5)
    birdGroup.add(bird)
    bird.setCollider("rectangle",0,0,50,30)
    bird.debug=false

  }
}

function reset(){
  gamestate=PLAY
  score=0
  trex.changeAnimation("running",trex_running)
  obstacleGroup.destroyEach()
  cloudGroup.destroyEach()
  gameover.visible=false
  restart.visible=false

}
