window.onload = function() {
  loadgame();
  preloadImages();

};

function loadgame(){

  const bgm = document.getElementById('bgm');
  const bgm2 = document.getElementById('bgm2');
  //var t = window.devicePixelRatio;
 // document.body.style.zoom=1/t;
    const startButton = document.getElementById('start-btn');
    const gameInstructions = document.getElementById('game-info');
    const background = document.querySelector('.background');
    const beachArea = document.querySelector('.beach-area');
    const rect = startButton.getBoundingClientRect();
    //showGuideArrow(parseInt(startButton.style.left,10),parseInt(startButton.style.top,10));
    showGuideArrow(rect.left,rect.top+30,0);
    // 遊戲開始邏輯
    //startButton.removeEventListener('click',starthandle);
    startButton.addEventListener('touchstart', starthandle);
    startButton.addEventListener('click', starthandle);
    function starthandle() {
      // 隱藏遊戲說明介面
      //console.log("123546")
      startButton.classList.add('active');  // 加入active類
      playSound('clickbutton');
      playBGM(bgm);
      document.getElementById('game-info').style.display = 'none';
      document.getElementById('difficulty-selection').style.display = 'block';
      hideGuideArrow();
      const rect = document.getElementById('easy-btn').getBoundingClientRect();
      showGuideArrow(rect.left+rect.width-rect.width/6,rect.top+rect.height-rect.height/3,0);
      
      // 顯示遊戲區域
      
    }
    //document.getElementById('easy-btn').removeEventListener('click', easyhandle);
    if(isMobileDevice()){
      document.getElementById('easy-btn').addEventListener('touchstart', easyhandle);
    }
    else{
      document.getElementById('easy-btn').addEventListener('click', easyhandle);
    }
    function easyhandle() {
        playSound('clickbutton');
        document.getElementById('difficulty-selection').style.display = 'none';
        background.style.display = 'block';
        hideGuideArrow();
  
      // 在這裡開始倒數計時（從 time.js 引入倒數計時邏輯）
        startCountdown(); // 設定為簡單模式
    }
    document.getElementById('easy-btn').addEventListener('touchend', function(){
      this.classList.remove('active');
    });
}

function startCountdown() {
    const timerElement = document.getElementById('timer');
    let timeLeft = 60;
    timerElement.textContent = timeLeft;
    const countdownDisplay = document.getElementById('countdown-display');
    let countdownTime = 2;  // 設定倒數時間為3秒
    countdownDisplay.textContent = 3;
    countdownDisplay.style.display = 'block';  // 顯示倒數顯示區域
  
    // 使用 setInterval 來控制倒數
    playSound('countdown');
    const countdownInterval = setInterval(function() {
      countdownDisplay.textContent = countdownTime;  // 顯示當前倒數數字
      countdownTime--;  // 倒數減1
  
      // 當倒數結束後顯示 START! 並開始遊戲
      if (countdownTime < 0) {
        clearInterval(countdownInterval);  // 停止倒數
        countdownDisplay.textContent = 'START!';  // 顯示「START!」
        setTimeout(function() {
            countdownDisplay.style.display = 'none';  // 隱藏倒數顯示區域
            startGame();  // 開始遊戲
          }, 1000);  // 1秒後開始遊戲
          // 顯示 1 秒後開始遊戲
      }
    }, 1000);  // 每秒更新一次倒數顯示
  }

  function showGuideArrow(x,y,move) {
    const guideArrow = document.getElementById('guide-arrow');
        // 轉換 px 為百分比
    const containerWidth = window.innerWidth; // 使用視窗寬度作為容器寬度
    const containerHeight = window.innerHeight; // 使用視窗高度作為容器高度
      
    // 計算百分比
    const xPercentage = (x / containerWidth) * 100;  // 將px轉為百分比
    const yPercentage = (y / containerHeight) * 100;  // 將px轉為百分比
    console.log(xPercentage,yPercentage);
    guideArrow.style.display = 'block';  // 顯示指引箭頭
    guideArrow.style.left = x + 'px';  // 設定箭頭的水平位置
    guideArrow.style.top = y + 'px';   // 設定箭頭的垂直位置
    guideArrow.style.left = xPercentage + '%';  // 設定箭頭的水平位置
    guideArrow.style.top = yPercentage + '%';   // 設定箭頭的垂直位置

    guideArrow.style.animation='pulse 1.5s ease-in-out infinite';
    if(move)
    {
      guideArrow.style.animation='arrowmove 4s linear infinite';
    }

  }
  function hideGuideArrow() {
    const guideArrow = document.getElementById('guide-arrow');
    guideArrow.style.display = 'none';  // 顯示指引箭頭
  }

  function isMobileDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    return /iphone|ipod|android|windows phone|blackberry|iemobile/.test(userAgent);
  }