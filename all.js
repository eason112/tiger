let loadedImages = 0;
let loadedSounds = 0;
const url="https://eason112.github.io/tiger";

window.onload = function() {
  preloadImages();
  //hideLoadingScreen();
  updateGame();
  updateLogin();
};

  // 初始化遊戲2的邏輯
function loadGame2() {
    console.log("已經切換到巧虎遊戲！");
    document.getElementById('login').style.display = 'none';
    document.getElementById('game1').style.display = 'none';
    document.getElementById('game2').style.display = 'block';
    startGame();
    //document.getElementById('game2').classList.add('visible');
    //document.getElementById('game1').classList.remove('visible');
    
    //unloadGame1Scripts();
    // 啟用遊戲2的樣式和JavaScript
    //document.getElementById('game1-stylesheet').disabled = true;
    //document.getElementById('game2-stylesheet').disabled = false;
    //document.getElementById('game1-script').disabled = true;
    //const script = document.getElementById('game2-script');
    //script.src = 'major/game.js';  // 設定腳本來源
  }
function loadGame1() {
    console.log("已經切換到巧虎遊戲！");
    document.getElementById('game1').style.display = 'block';
    document.getElementById('game2').style.display = 'none';
    stopGame();
    //document.getElementById('game1').classList.add('visible');
    //document.getElementById('game2').classList.remove('visible');
    //loadGame1Scripts();

    //const script1 = document.getElementById('game1-script1');
    //script1.src = 'littlegame/new/game.js';
    //const script2 = document.getElementById('game1-script2');
    //script2.src = 'littlegame/new/script.js';
    //const script3 = document.getElementById('game1-script3');
    //script3.src = 'littlegame/new/sound.js';
    //loadgame();
    
    // 啟用遊戲2的樣式和JavaScript
    //document.getElementById('game1-stylesheet').disabled = false;
    //document.getElementById('game1-script').disabled = true;
  }
  function loadlogin() {
    console.log("已經切換到巧虎遊戲！");
    document.getElementById('game1').style.display = 'none';
    document.getElementById('game2').style.display = 'none';
    document.getElementById('login').style.display = 'block';
    stopGame();

}

    // 動態載入遊戲1的所有JavaScript
function loadGame1Scripts() {
  // 如果遊戲1的腳本尚未加載，則加載它們
  if (!document.getElementById('game1-script1')) {
    const script1 = document.createElement('script');
    script1.id = 'game1-script1';
    script1.src = 'littlegame/new/canvasscript.js';
    document.body.appendChild(script1);
  }

  if (!document.getElementById('game1-script2')) {
    const script2 = document.createElement('script');
    script2.id = 'game1-script2';
    script2.src = 'littlegame/new/sound.js';
    document.body.appendChild(script2);
  }
}

    // 卸載遊戲1的JavaScript
function unloadGame1Scripts() {
  // 移除遊戲1的 JavaScript
  const script1 = document.getElementById('game1-script1');
  const script2 = document.getElementById('game1-script2');

  if (script1) script1.remove();
  if (script2) script2.remove();
}

const imagesToPreload = [
    url+'/littlegame/new/images/image1.png',
    url+'/littlegame/new/images/image2.png',
    url+'/littlegame/new/images/image3.png',
    url+'/littlegame/new/images/image4.png',
    url+'/littlegame/new/images/image5.png',
    url+'/littlegame/new/images/up0.png',
    url+'/littlegame/new/images/up1.png',
    url+'/littlegame/new/images/up2.png',
    url+'/littlegame/new/images/up3.png',
    url+'/littlegame/new/images/ball.png',
    url+'/littlegame/new/images/box.png',
    url+'/littlegame/new/images/hole.png',
    url+'/littlegame/new/images/newhole.png',
    url+'/littlegame/new/images/rareball.png',
    url+'/littlegame/new/images/teach.png',
    url+'/littlegame/new/images/tool.png',
];




function preloadImages() {
    imagesToPreload.forEach((src) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            //console.log(img.src);
            loadedImages++;
            // 当所有图片加载完毕后，可以开始渲染或启动动画
            if (loadedImages === imagesToPreload.length) {
                //loadGame1();
                //loadCSS();
                
                
                hideLoadingScreen();
            }
        };
    });
}




function showLoadingScreen() {
  document.getElementById('loadingScreen').style.display = 'block';
  
  //document.getElementById('gameScreen').style.display = 'block';
}

function hideLoadingScreen() {
  document.getElementById('loadingScreen').style.display = 'none';
  
  //document.getElementById('gameScreen').style.display = 'block';
}
function isMobileDevice() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /iphone|ipod|android|windows phone|blackberry|iemobile/.test(userAgent);
}