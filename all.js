let loadedImages = 0;
let loadedSounds = 0;
const url="https://eason112.github.io/tiger";
let hasloadGame2=false;
//let arScript = null; // 用于保存动态加载的AR.js脚本
const loginbgm = document.getElementById('loginbgm');
const majorbgm = document.getElementById('majorbgm');

window.onload = function() {
  
  preloadImages();
  //hideLoadingScreen();
  updateGame();
  updateLogin();
};

  // 初始化遊戲2的邏輯
function loadGame2() {
  if(!hasloadGame2){
    console.log("已經切換到主畫面！");
    document.getElementById('login').style.display = 'none';
    //document.getElementById('AR').style.display = 'none';
    document.getElementById('game1').style.display = 'none';
    document.getElementById('game2').style.display = 'block';
    /*if (arScript) {
      //document.body.removeChild(arScript);
      //arScript = null; // 清除脚本引用
    }*/
    startGame();
    stopBGM(bgm);
    stopBGM(loginbgm);
    playBGM(majorbgm,0.3);
    hasloadGame2=true;
  }
}

function loadGame1() {
  if(hasloadGame2){
    console.log("已經切換到小遊戲！");
    document.getElementById('game1').style.display = 'block';
    document.getElementById('game2').style.display = 'none';
    stopBGM(majorbgm);
    playBGM(bgm,0.5);
    stopGame();
    hasloadGame2=false;
  }
}

function loadAR() {
  console.log("已經切換到AR！");
  //document.getElementById('AR').style.display = 'block';
  //document.getElementById('game2').style.display = 'none';
  // 检查浏览器是否支持获取相机权限
  window.open(url+"/AR/index.html", "_blank");
  //arScript.src = "https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/aframe/build/aframe-ar.js";
  //document.body.appendChild(arScript);
 // arScript.onload = function() {
    // 检查浏览器是否支持获取相机权限

  //}
  //stopGame();
  
}

function loadlogin() {
    console.log("已經切換到登入畫面！");
    document.getElementById('game1').style.display = 'none';
    document.getElementById('game2').style.display = 'none';
    document.getElementById('login').style.display = 'block';
    stopGame();
    stopBGM(majorbgm);
    playBGM(loginbgm,0.5);
    hasloadGame2=false;
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
    url+'/major/images/ar.png',
    url+'/major/images/ARicon.png',
    url+'/major/images/back.png',
    url+'/major/images/clothing.png',
    url+'/major/images/emoji.png',
    url+'/major/images/friend.png',
    url+'/major/images/front.png',
    url+'/major/images/hint.png',
    url+'/major/images/history.png',
    url+'/major/images/map.png',
    url+'/major/images/middle.png',
    url+'/major/images/minimap.png',
    url+'/major/images/NPC.png',
    url+'/major/images/pet.png',
    url+'/major/images/player.png',
    url+'/major/images/shop.png',
    url+'/major/images/status.png',
    url+'/major/images/teacharrow.png',
    url+'/major/images/emoji1.png',
    url+'/major/images/emoji2.png',
    url+'/major/images/emoji3.png',
    url+'/major/images/emoji4.png',
    url+'/major/images/emoji5.png',
    url+'/major/images/emoji6.png',
    url+'/major/images/emoji7.png',
    url+'/major/images/emoji8.png',
    url+'/major/images/emoji9.png',
];




function preloadImages() {
    imagesToPreload.forEach((src) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            //console.log(img.src);
            loginctx.drawImage(img, 0, 0, 10, 10);
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
}

function hideLoadingScreen() {
  document.getElementById('loadingScreen').style.display = 'none';
}

function isMobileDevice() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /iphone|ipod|android|windows phone|blackberry|iemobile/.test(userAgent);
}

/*document.getElementById('backButton').addEventListener('click', function() {
  // 隐藏AR容器
  loadGame2();
});*/