let loadedImages = 0;

function isMobileDevice() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /iphone|ipod|android|windows phone|blackberry|iemobile/.test(userAgent);
}

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
    const script = document.getElementById('game2-script');
    script.src = '網頁/game.js';  // 設定腳本來源
  }
  function loadGame1() {
    console.log("已經切換到巧虎遊戲！");
    document.getElementById('game1').style.display = 'block';
    document.getElementById('game2').style.display = 'none';

    const script1 = document.getElementById('game1-script1');
    script1.src = '小遊戲/new/game.js';
    const script2 = document.getElementById('game1-script2');
    script2.src = '小遊戲/new/script.js';
    const script3 = document.getElementById('game1-script3');
    script3.src = '小遊戲/new/sound.js';
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
    '小遊戲/new/images/image1.png',
    '小遊戲/new/images/image2.png',
    '小遊戲/new/images/image3.png',
    '小遊戲/new/images/image4.png',
    '小遊戲/new/images/image5.png',
    '小遊戲/new/images/up0.png',
    '小遊戲/new/images/up1.png',
    '小遊戲/new/images/up2.png',
    '小遊戲/new/images/up3.png',
];



function preloadImages() {
    imagesToPreload.forEach((src) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
           // console.log(img.src);
            loadedImages++;
            // 当所有图片加载完毕后，可以开始渲染或启动动画
            if (loadedImages === imagesToPreload.length) {
                //loadGame1();
                hideLoadingScreen();
            }
        };
    });
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