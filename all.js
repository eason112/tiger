let loadedImages = 0;
let loadedSounds = 0;
const url="https://eason112.github.io/tiger";


document.getElementById('exit-btn').addEventListener('click', function() {
    //loadedImages = imagesToPreload.length;
    loadGame2();
  });
  document.getElementById('jumpBtn').addEventListener('click', function() {
    console.log(this.textContent)
    if(this.textContent==='對話'){
      showDialog("你好，玩家！一起去挖蛤蠣吧！");
      //loadGame1();
    }
    
    //preloadImages();
  });
  // 初始化遊戲2的邏輯
  function loadGame2() {
    console.log("已經切換到巧虎遊戲！");
    document.getElementById('game1').style.display = 'none';
    document.getElementById('game2').style.display = 'block';
    
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

    //const script1 = document.getElementById('game1-script1');
    //script1.src = 'littlegame/new/game.js';
    //const script2 = document.getElementById('game1-script2');
    //script2.src = 'littlegame/new/script.js';
    //const script3 = document.getElementById('game1-script3');
    //script3.src = 'littlegame/new/sound.js';
    const startButton = document.getElementById('start-btn');
    const rect = startButton.getBoundingClientRect();
    console.log(rect.x,rect.y)
    console.log(rect.width,rect.height)
    showGuideArrow(rect.left+rect.width-rect.width/6,rect.top+rect.height-rect.height/2,0);
    //loadgame();
    
    // 啟用遊戲2的樣式和JavaScript
    //document.getElementById('game1-stylesheet').disabled = false;
    //document.getElementById('game1-script').disabled = true;
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
];
const soundsToPreload = [

  url+'/littlegame/new/sound/clickbutton.mp3',
  url+'/littlegame/new/sound/countdown.mp3',
  url+'/littlegame/new/sound/dig.mp3',
  url+'/littlegame/new/sound/finalcountdown.mp3',
  url+'/littlegame/new/sound/generatehole.mp3',
  url+'/littlegame/new/sound/get.mp3',
  url+'/littlegame/new/sound/getrare.mp3',
  url+'/littlegame/new/sound/wave.mp3',
];



function preloadImages() {
    imagesToPreload.forEach((src) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            console.log(img.src);
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

function preloadSounds() {
  soundsToPreload.forEach((src) => {
    
      const audio = new Audio();
      audio.src = src;
      audio.load();
      audio.preload = 'auto'; // 確保音效文件提前加載
      audio.onload = () => {
          loadedSounds++;
          console.log(loadedSounds);
          if (loadedSounds === soundsToPreload.length) {
              // 所有音效已加載完成，可以開始遊戲  
               
          }
      };
  });
}

function loadCSS() {
  const cssFiles = [
      url+'/littlegame/new/styles.css',
      url+'/major/style.css',
      url+'/style.css'  // 你需要載入的所有CSS檔案
  ];
  console.log('所有CSS檔案已經載入');
  cssFiles.forEach((file) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = file;
      document.head.appendChild(link);
  });

  console.log('所有CSS檔案已經載入');
}


const dialogBox = document.getElementById('dialogBox');
const dialogText = document.getElementById('dialogText');
const receiveDialogBtn = document.getElementById('receiveDialogBtn');

receiveDialogBtn.addEventListener('click', function() {
  hideDialog();  // 點擊後隱藏對話框
  loadGame1();
});

document.getElementById("dialogBox").addEventListener("click", function(e) {
  // 確保點擊的是對話框的背景區域，而不是內容
  hideDialog();
  
});

function showDialog(text) {
  dialogBox.style.display = 'block';  // 顯示對話框
  dialogText.textContent = text;      // 更新對話框內容
}

// 隱藏對話框的函數
function hideDialog() {
  dialogBox.style.display = 'none';   // 隱藏對話框
}

function hideLoadingScreen() {
  document.getElementById('loadingScreen').style.display = 'none';
  //document.getElementById('gameScreen').style.display = 'block';
}