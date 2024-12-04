const url4="https://eason112.github.io/tiger";
// time.js 也可以選擇只保留倒數計時的邏輯
let holes = [];
let score = 0;  // 初始化分數
function updateScore() {
  const scoreElement = document.getElementById('score');
  scoreElement.textContent = `分數: ${score}`;
}
function showTideMessage() {
  const tideMessage = document.getElementById('tideMessage');
  tideMessage.style.opacity = 1; // 讓文字顯示出來
  tideMessage.style.animation = 'pulse 1.5s ease-in-out infinite'; 


  // 在 5 秒後隱藏文字（動畫播放完）
  setTimeout(function() {
    tideMessage.style.opacity = 0; // 隱藏文字
    tideMessage.style.animation = 'none'; // 移除動畫
  }, 5000); // 5 秒後隱藏文字
}
function showScoreText(x, y, points,color) {
  // 創建顯示分數的文本元素
  const scoreText = document.createElement('span');
  scoreText.textContent = `+${points}`;  // 顯示 + 幾分
  scoreText.classList.add('score-text');  // 添加樣式
  console.log(x,y);
  // 設置文本位置，基於洞的 x, y 坐標
  scoreText.style.left = `${x + 50}px`;
  scoreText.style.top = `${y - 10}px`;  // 讓文本顯示在洞的上方
  console.log(scoreText.style.left,scoreText.style.top);
  // 加入背景中顯示
  document.querySelector('.background').appendChild(scoreText);
  scoreText.style.color=color;
  // 為分數文本添加動畫
  scoreText.style.animation = 'scorePopup 1s ease-out forwards';

  // 動畫結束後，移除分數文本
  scoreText.addEventListener('animationend', () => {
    scoreText.remove();
  });
}
function startGame() {
  const bgm = document.getElementById('bgm');
  const bgm2 = document.getElementById('bgm2');
  /*document.addEventListener('touchmove', function(){
    console.log("123");
  }); */
    let first = 0;
    const usedPositions = [];
    const clickedHoles = new Set();  // 用於記錄已點擊的洞的索引
    const balls = [];  // 用來儲存已生成的球元素
    const holeElements = []; 
    const background = document.querySelector('.background');
    const beachArea = document.querySelector('.beach-area'); 
    // 獲取沙灘區域的尺寸
    const beachRect = beachArea.getBoundingClientRect();
    const beachWidth = beachRect.width;
    const beachHeight = beachRect.height;
     // 隨機生成圖片的數量
    const MaxnumberOfImages = 10;
  // 儲存已經生成圖片的位置
   // 用來儲存洞的元素，以便移除
  const timerElement = document.getElementById('timer');
  let timeLeft = 60;
  timerElement.textContent = timeLeft;
  // 使用範例：將桶子放置在 (200, 300) 的位置
  placeBucket(background,30, 2);
  const bucket=document.querySelector('.bucket');
  //console.log(bucket.getBoundingClientRect().left, bucket.getBoundingClientRect().top);
  const countdown = setInterval(function() {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft === 40||timeLeft === 20) {
      showTideMessage();  // 開始播放漲潮效果
    }
    if (timeLeft === 35||timeLeft === 15) {
      if(first===1||first===2)first=0;
      hideGuideArrow();
      triggerTideEffect();  // 開始播放漲潮效果
    }
    if(timeLeft===10)
    {
      playSound('finalcountdown')
    }
    if (timeLeft <= 0) {
      clearInterval(countdown);
      timerElement.textContent = "時間到！";
      // 清空先前的洞和球
      holeElements.forEach(hole => hole.remove());  // 移除先前的洞
      balls.forEach(ball => ball.remove());  // 移除先前的球
      usedPositions.length = 0;  // 清空位置
      clickedHoles.clear();  // 清空已點擊的洞
      holeElements.length = 0;  // 清空洞元素陣列
      console.log("timeout");
      endGame();
    }
  }, 1000);
  function generateHoles() {
    // 清空先前的洞和球
    let numberOfImages=MaxnumberOfImages;
    holes = [];
    holeElements.forEach(hole => hole.remove());  // 移除先前的洞
    balls.forEach(ball => ball.remove());  // 移除先前的球
    usedPositions.length = 0;  // 清空位置
    clickedHoles.clear();  // 清空已點擊的洞
    holeElements.length = 0;  // 清空洞元素陣列
    const maxRetries = 10;
    playSound('generatehole',1);
    // 隨機生成可點擊的叉叉
    for (let i = 0; i < MaxnumberOfImages; i++) {
      //console.log(i);
      let randomX, randomY, overlapFound;
      let retries = 0; 
      // 確保圖片不會重疊
      do {
        overlapFound = false;
        // 隨機位置 (限制在沙灘範圍內)
        randomX = Math.random() * beachWidth;
        randomY = Math.random() * beachHeight;
  
        // 檢查新位置是否與已經存在的位置重疊
        for (let j = 0; j < usedPositions.length; j++) {
          const distance = Math.sqrt(Math.pow(randomX - usedPositions[j].x, 2) + Math.pow(randomY - usedPositions[j].y, 2));
          if (distance < beachRect.width*beachRect.height/1000) {  // 設定最小距離，避免重疊 (可以根據圖片大小調整)
            overlapFound = true;
            break;
          }
        }
        retries++;  // 增加重試計數

        // 如果達到最大重試次數，停止嘗試並跳出循環
        if (retries > maxRetries) {
          //console.log(`No available position for image ${i}`);
          numberOfImages--;
          break;  // 跳出 `do...while` 循環
        }
      } while (overlapFound);  // 如果有重疊，重新生成位置
      //console.log(beachRect.width*beachRect.height/2000)
      let hole = {x:0,y:0};
      if(retries > maxRetries) {

        continue;
      }
      // 創建圖片元素
      
      const img = document.createElement('img');
      img.src = url4+'/littlegame/new/images/hole.png';  // 初始的可點擊叉叉
      //console.log(img.src);
      img.dataset.canclick='false';
      img.alt = 'Click me!';
      img.classList.add('clickable-image');
      // 設置隨機位置
      //console.log(beachRect.left,beachRect.top)
      const percentageX = (beachRect.left + randomX)/15 ;

// 計算圖片的 Y 位置，以百分比表示
      const percentageY = (beachRect.top + randomY)/10 ;
      //console.log(percentageX ,percentageY)
      //img.style.left = `${percentageX}%`;
      //img.style.top = `${percentageY}%`;
      img.style.left = beachRect.left + randomX + 'px'; // 計算相對於頁面的位置
      img.style.top = beachRect.top + randomY + 'px';
      if(first===0)
      {
        img.dataset.canclick='true';
        //showGuideArrow(percentageX+2,percentageY+3,0);
        showGuideArrow(beachRect.left + randomX+20,beachRect.top + randomY+15,0);
        first=1;
      }
      
      hole.x=img.style.left;
      hole.y=img.style.top;
      holes.push(hole);
      // 增加點擊事件
      img.addEventListener('touchstart', handleClick);
      img.addEventListener('click', handleClick);
        function handleClick() {
        // 點擊後變更為坑洞
        if(img.dataset.canclick==='false') return;
        playSound('dig');
        const isRare = Math.random() < 0.1;
        showScoreText(parseInt(img.style.left, 10), parseInt(img.style.top, 10), 5,'white');
        score += 5;
        updateScore();
        if(first===1)
        {
          hideGuideArrow();
          showGuideArrow(beachRect.left + randomX ,beachRect.top + randomY,true)
          first=2;
        }
        img.src = url4+'/littlegame/new/images/newhole.png';  // 新的圖片來源
  
        // 禁用點擊事件，使圖片不能再點擊
        img.removeEventListener('click', handleClick);  // 移除點擊事件
        img.style.pointerEvents = 'none';  // 禁用點擊（使其不可再點擊）
        const tool = document.createElement('img');
        tool.classList.add('tool');
        tool.src = url4+'/littlegame/new/images/tool.png';
        tool.style.left = beachRect.left + randomX+20 + 'px';  // 設置耙子的位置（與圖片相同）
        tool.style.top = beachRect.top + randomY+10 + 'px';
        tool.addEventListener('animationend', function() {
                  
          tool.remove();
        })
        //tool.style.animation = 'rakeSwing 1s ease-in-out forwards';
        background.appendChild(tool);
        // 創建並顯示球（使用 img 元素）
        if(isRare)
        {
          const ball = document.createElement('img');
          ball.classList.add('ball');  // 添加球的樣式
          ball.dataset.scored='false';
          ball.src = url4+'/littlegame/new/images/rareball.png';  // 設定球的圖片
          ball.alt = 'Ball';
          ball.style.left = beachRect.left + randomX + 'px';  // 設置球的位置（與圖片相同）
          ball.style.top = beachRect.top + randomY + 'px';
          
          // 將球添加到背景中
          background.appendChild(ball);
    
          // 為球添加到balls陣列中
          balls.push(ball);
    
          // 給球加上動畫，讓它彈出來
          setTimeout(function() {
            ball.style.animation = 'ballBounce 1s ease-out forwards';
          }, 10);  // 確保動畫能夠被觸發
          // 為球添加滑鼠移動事件
          document.addEventListener('touchmove', handleMoverare,{ passive: false }); 
          ball.addEventListener('mousemove', handleMoverare );
            function handleMoverare(event) {
              //console.log("enter");
              //event.preventDefault();
              const isTouchEvent = event.type === 'touchmove';
              const pageX = isTouchEvent ? event.touches[0].pageX : event.pageX;
              const pageY = isTouchEvent ? event.touches[0].pageY : event.pageY;
              // 檢查滑鼠是否按住左鍵
              if (isTouchEvent ||event.buttons === 1) {  // 左鍵被按住
              // 檢查滑鼠與球的碰撞
              const ballRect = ball.getBoundingClientRect();
              const ballX = ballRect.left + ballRect.width / 2;
              const ballY = ballRect.top + ballRect.height / 2;
    
              const distance = Math.sqrt(Math.pow(pageX - ballX, 2) + Math.pow(pageY - ballY, 2));
              if (distance < ballRect.width / 2) {
                if(ball.dataset.scored==='true')return;
                // 滑鼠觸碰到球，觸發事件
                //document.addEventListener('touchmove', handleMoverare); 
                playSound('getrare',0.5);
                ball.dataset.scored='true';
                ball.style.pointerEvents = 'none';
                showScoreText(parseInt(img.style.left, 10), parseInt(img.style.top, 10), 50,'red');
                score+=50;
                updateScore();
                console.log('滑鼠觸碰到球！');
                if(first===2)
                  {
                    holeElements.forEach(img=>{
                      img.dataset.canclick='true';
                    });
                    hideGuideArrow();
                    first=3;
                  }
                launchBall(ball,0, 0, bucket.getBoundingClientRect().left, bucket.getBoundingClientRect().top);
                // 執行球的彈跳並消失效果
                //ball.style.animation = 'ballleave 1s ease-out forwards';
    
                // 動畫結束後將球移除
                ball.addEventListener('animationend', function() {
                  
                  //ball.remove();  // 移除球元素
                  // 紀錄該洞已被點擊
                  clickedHoles.add(i);
                  // 檢查是否所有洞和球都被撿起來
                  if (clickedHoles.size === numberOfImages) {
                    console.log("所有洞和球都已經被撿起來，重新生成洞...");
                    generateHoles();  // 重新生成洞
                  }
                });
              }
            }
          }
        }
        else
        {
          const ball = document.createElement('img');
          ball.classList.add('ball');  // 添加球的樣式
          ball.src = url4+'/littlegame/new/images/ball.png';  // 設定球的圖片
          ball.dataset.scored='false';
          ball.alt = 'Ball';
          ball.style.left = beachRect.left + randomX + 'px';  // 設置球的位置（與圖片相同）
          ball.style.top = beachRect.top + randomY + 'px';
          
          // 將球添加到背景中
          background.appendChild(ball);
    
          // 為球添加到balls陣列中
          balls.push(ball);
    
          // 給球加上動畫，讓它彈出來
          setTimeout(function() {
            ball.style.animation = 'ballBounce 1s ease-out forwards';
          }, 10);  // 確保動畫能夠被觸發
          
          ball.addEventListener('mousemove', handleMove);
          document.addEventListener('touchmove', handleMove,{ passive: false });
          function handleMove(event) {
            //event.preventDefault();
            //document.addEventListener('touchmove', handleMove);
            const isTouchEvent = event.type === 'touchmove';
            const pageX = isTouchEvent ? event.touches[0].pageX : event.pageX;
            const pageY = isTouchEvent ? event.touches[0].pageY : event.pageY;
            // 檢查滑鼠是否按住左鍵
            if (isTouchEvent ||event.buttons === 1) {  // 左鍵被按住
              // 檢查滑鼠與球的碰撞
              //console.log(pageX,pageY);
              const ballRect = ball.getBoundingClientRect();
              const ballX = ballRect.left + ballRect.width / 2;
              const ballY = ballRect.top + ballRect.height / 2;
              
              const distance = Math.sqrt(Math.pow(pageX - ballX, 2) + Math.pow(pageY - ballY, 2));
              if (distance < ballRect.width / 2 ) {
                // 滑鼠觸碰到球，觸發事件
                
                //console.log(ball.dataset.scored);
                if(ball.dataset.scored==='true')return;
                //document.addEventListener('touchmove', handleMove);
                playSound('get');
                ball.dataset.scored='true';
                ball.style.pointerEvents = 'none';
                showScoreText(parseInt(img.style.left, 10), parseInt(img.style.top, 10), 10,'rgb(8, 184, 17)');
                score+=10;
                updateScore();
                console.log('滑鼠觸碰到球！');
                if(first===2)
                  {
                    holeElements.forEach(img=>{
                      img.dataset.canclick='true';
                    });
                    hideGuideArrow();
                    first=3;
                  }
                launchBall(ball,0, 0,bucket.getBoundingClientRect().left, bucket.getBoundingClientRect().top);
                // 執行球的彈跳並消失效果
                //ball.style.animation = 'ballleave 1s ease-out forwards';
    
                // 動畫結束後將球移除
                ball.addEventListener('animationend', function() {
                  //document.removeEventListener('touchmove',handleMove);
                  //ball.remove();  // 移除球元素
                  // 紀錄該洞已被點擊
                  //console.log(clickedHoles.size,numberOfImages);
                  clickedHoles.add(i);
                  // 檢查是否所有洞和球都被撿起來
                  if (clickedHoles.size === numberOfImages) {
                    console.log("所有洞和球都已經被撿起來，重新生成洞...");
                    generateHoles();  // 重新生成洞
                  }
                });
                
                
              }
            }
          }
        }
      }
    
      // 將圖片添加到背景容器中
      background.appendChild(img);
      
      // 儲存新圖片的位置和洞元素
      usedPositions.push({ x: randomX, y: randomY });
      holeElements.push(img);  // 將生成的洞添加到洞元素陣列中
      if(first===3)
        {
          holeElements.forEach(img=>{
            img.dataset.canclick='true';
          });
        }
    }
  }
  function triggerTideEffect() {
    const tideImageLayer = document.querySelector('.tide-image');
    balls.forEach(ball => {
      ball.dataset.scored='true';
      ball.remove();
    });
    // 顯示背景並開始動畫
    pauseBGM(bgm);
    setVolume(bgm2,0.4);
    playBGM(bgm2);
    playSound('wave');

    tideImageLayer.style.animation = 'upBackground 5s steps(10) 1';
    tideImageLayer.style.pointerEvents = 'auto'
    setTimeout(function() {
      generateHoles();
      // 你可以在這裡執行任意的操作
    }, 2500); // 
    function checkHolePositions() {
      // 每一幀檢查洞的位置
      holes.forEach(hole => {
        // 這裡可以根據需要檢查或處理每個洞的位置
        console.log(`洞的X位置: ${hole.x}, Y位置: ${hole.y}`);
      });
  
      // 繼續進行下一幀的檢查
      if (parseFloat(tideImageLayer.style.opacity) > 0) {
        requestAnimationFrame(checkHolePositions);
      }
    }
    requestAnimationFrame(checkHolePositions);
    tideImageLayer.removeEventListener('animationend',upanimate);
    tideImageLayer.addEventListener('animationend', upanimate);
  
  }
    // 初始化生成洞
    generateHoles();
   
}

function upanimate() {
  console.log('漲潮動畫結束！');
  const tideImageLayer = document.querySelector('.tide-image');
    // 動畫結束後清除動畫並隱藏層
    tideImageLayer.style.pointerEvents = 'none';
    tideImageLayer.style.animation = 'none';  // 清除動畫
    playBGM(bgm);
}

function endGame() {
  // 顯示結算畫面
  hideGuideArrow();
  const gameOverScreen = document.getElementById('game-over');
  const finalScoreElement = document.getElementById('final-score');
  gameOverScreen.style.display = 'block';

  finalScoreElement.textContent = score; 
  const scoreTexts = document.querySelectorAll('.score-text');
  scoreTexts.forEach(score => {
    score.remove();
  });
  const tools = document.querySelectorAll('.tool');
  tools.forEach(tool => {
    tool.remove();
  });
  // 隱藏遊戲區域
  const background = document.querySelector('.background');
  background.style.display = 'none';

  // 監聽再玩一次按鈕
  const retryButton = document.getElementById('retry-btn');
  retryButton.removeEventListener('click', retryButtonClickHandler);  // 移除舊的事件監聽器
  retryButton.addEventListener('click', retryButtonClickHandler);  // 綁定新的事件監聽器

  // 監聽離開遊戲按鈕
  const exitButton = document.getElementById('exit-btn');
  exitButton.removeEventListener('click', exitButtonClickHandler);  // 移除舊的事件監聽器
  exitButton.addEventListener('click', exitButtonClickHandler);  // 綁定新的事件監聽器
  holes = [];
  score = 0;
  updateScore();
}
function retryButtonClickHandler() {
  playSound('clickbutton');
  const gameOverScreen = document.getElementById('game-over');
  gameOverScreen.style.display = 'none';  // 隱藏結算畫面
  //document.getElementById('game-info').style.display = 'block';
  startNewGame();  // 開始新遊戲
}
function exitButtonClickHandler() {
  // 開始新遊戲
  const bgm = document.getElementById('bgm');
  stopBGM(bgm);
  document.getElementById('game-over').style.display = 'none';
  document.getElementById('game-info').style.display = 'block';
}

// 開始新遊戲的邏輯
function startNewGame() {
  // 顯示遊戲區域並重置倒數計時
  const background = document.querySelector('.background');
  background.style.display = 'block';
  startCountdown();  // 開始新的倒數計時 
}

function launchBall(ball,startX, startY, targetX, targetY) {

  // 設定起始位置
  const x=600-ball.x;
  const y=364-ball.y;
  const midX = (x - startX) / 2 + startX;
  const midY = startY - 150;
  console.log(targetX,targetY);
   // 動態創建唯一的動畫名稱
   const animationName = `parabola-${Date.now()}`;

   // 動態創建 keyframes 並添加到頁面
   const style = document.createElement('style');
   document.head.appendChild(style);
 
   style.sheet.insertRule(`
    @keyframes ${animationName} {
      0% {
        transform: translate(${0}px, ${-5}px) ;
      }
      50% {
        transform: translate(${midX}px, ${midY}px) ;
      }
      100% {
        transform: translate(${0}px, ${0}px) scale(0.5);
      }
    }
  `, style.sheet.cssRules.length);
 
   // 清除之前的動畫（如果有的話）
   ball.style.animation = '';
 
   // 設置新的動畫
   ball.style.animation = `${animationName} 2s ease-out forwards`;
 
   // 在動畫結束後清理
   ball.addEventListener('animationend', function handler() {
     // 清理事件監聽器
     ball.removeEventListener('animationend', handler);
     
     // 清除動畫樣式
     ball.style.animation = '';
 
     // 移除動態創建的 style 標籤
     document.head.removeChild(style);
 
     // 在動畫結束後執行其他動作（如果有需要）
     console.log('Animation finished, ready for next action');
   });

  // 更改動畫關鍵點以適應指定的目標位置
}


function placeBucket(background,x, y) {
  const rect = background.getBoundingClientRect();
  const bucket = document.createElement('img');  // 創建一個新的 img 元素
  bucket.src = url4+'/littlegame/new/images/box.png';  // 設置桶子的圖片路徑
  bucket.alt = 'Bucket';  // 設置圖片的替代文字
  bucket.classList.add('bucket');  // 設定為絕對定位

  bucket.style.right = `${x}%`;  // 設置桶子的 X 座標
  bucket.style.bottom = `${y}%`;   // 設置桶子的 Y 座標

  // 將桶子圖片添加到容器中
  background.appendChild(bucket);
}

