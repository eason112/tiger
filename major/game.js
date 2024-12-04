const url2="https://eason112.github.io/tiger";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 設定畫布大小
canvas.width = 2000;
canvas.height = 940;


// 加載背景圖像
const background1 = new Image();
background1.src = url2+'/major/images/middle.png';  // 第一層背景

const background2 = new Image();
background2.src = url2+'/major/images/front.png';  // 第二層背景

const background3 = new Image();
background3.src = url2+'/major/images/back.png';  // 第三層背景

const playerImage = new Image();
playerImage.src = url2+'/major/images/player.png';

const npcImage = new Image();
npcImage.src = url2+'/major/images/NPC.png';

const petImage = new Image();
petImage.src = url2+'/major/images/NPC.png';

const minimapImage = new Image();
minimapImage.src = url2+'/major/images/minimap.png';  // 替換成你的圖像路徑


let background1X = 0;
let background2X = 4000;

const minimapWidth =800;
const minimapHeight = 188;
const minimapX = gameCanvas.width - minimapWidth - 10; // 右上角
const minimapY = 10;

const groundHeight =0;

/*const platforms = [
    { x: 100, y: 600, width: 200, height: 100 },
    { x: 700, y: 650, width: 500, height: 100 },
    { x: 1650, y: 700, width: 200, height: 100 },
];*/
const joystickBackground = document.getElementById('joystick-background');
const joystickKnob = document.getElementById('joystick-knob');

let isJoystickActive = false;
let joystickCenter = { x: joystickBackground.offsetWidth / 2, y: joystickBackground.offsetHeight / 2 };
let joystickDirection = { x: 0, y: 0 };  // 左右和上下的控制值

// 按下搖桿時
joystickKnob.addEventListener('mousedown', (e) => {
  isJoystickActive = true;
  updateJoystick(e);
});

// 鼠標移動時更新搖桿位置
document.addEventListener('mousemove', (e) => {
  if (isJoystickActive) {
    updateJoystick(e);
  }
});

// 鼠標放開時停止搖桿移動
document.addEventListener('mouseup', () => {
  isJoystickActive = false;
  joystickKnob.style.left = '50%';
  joystickKnob.style.top = '50%';
  joystickDirection = { x: 0, y: 0 }; // 停止移動
});
// 支援觸摸設備
joystickKnob.addEventListener('touchstart', (e) => {
    isJoystickActive = true;
    updateJoystick(e.touches[0]); // 使用觸摸點的第一個點
  });
  
  document.addEventListener('touchmove', (e) => {
    if (isJoystickActive) {
      updateJoystick(e.touches[0]);
      //e.preventDefault(); // 防止觸摸移動時頁面滾動
    }
  });
  
  document.addEventListener('touchend', () => {
    isJoystickActive = false;
    joystickKnob.style.left = '50%';
    joystickKnob.style.top = '50%';
    joystickDirection = { x: 0, y: 0 }; // 停止移動
  });
  
  document.addEventListener('touchcancel', () => {
    isJoystickActive = false;
    joystickKnob.style.left = '50%';
    joystickKnob.style.top = '50%';
    joystickDirection = { x: 0, y: 0 }; // 停止移動
  });
  

// 更新搖桿的邏輯
function updateJoystick(e) {
    joystickCenter = { x: joystickBackground.offsetWidth / 2, y: joystickBackground.offsetHeight / 2 };
  const offsetX = e.clientX - joystickBackground.getBoundingClientRect().left - joystickCenter.x;
  const offsetY = e.clientY - joystickBackground.getBoundingClientRect().top - joystickCenter.y;
  // 計算搖桿的最大可移動範圍（背景半徑）
  const maxDistance = joystickBackground.offsetWidth / 2;

  // 計算搖桿的偏移量，並限制它在範圍內
  const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
  if (distance < maxDistance) {
    joystickKnob.style.left = joystickCenter.x + offsetX + 'px';
    joystickKnob.style.top = joystickCenter.y + offsetY + 'px';
  } else {
    const angle = Math.atan2(offsetY, offsetX);
    joystickKnob.style.left = joystickCenter.x + Math.cos(angle) * (maxDistance - 10) + 'px';
    joystickKnob.style.top = joystickCenter.y + Math.sin(angle) * (maxDistance - 10) + 'px';
  }

  // 根據搖桿的位置計算左右和上下方向
  joystickDirection.x = offsetX / maxDistance;
  joystickDirection.y = offsetY / maxDistance;

  // 更新角色移動
  keys.left = joystickDirection.x < -0.2;  // 左邊
  keys.right = joystickDirection.x > 0.2;  // 右邊
}

// 角色屬性
let player = {
    x: 50,
    y: canvas.height- groundHeight,
    width: 293,
    height: 377,
    speed: 10,
    dx: 0,
    dy: 0,
    gravity: 1,
    jumpPower: -30,
    isJumping: false
};

let npc = {
    x: 2500,  // NPC的起始X位置
    y: 550 ,  // NPC的Y位置，放在地面之上
    width: 293,  // NPC的寬度
    height: 377, // NPC的高度
};

let pet = {
    x: player.x - 50, // 寵物的初始位置 (稍微在玩家右側)
    y: player.y, // 寵物與玩家 y 位置一致
    width: 146, // 寵物的寬度
    height: 188, // 寵物的高度
    speed: 5, // 寵物的移動速度
    dy: 0,
    gravity: 1,
    jumpPower: -25,
    isJumping: false
};


// 控制按鍵
let keys = {
    right: false,
    left: false,
    up: false
};

let direction = {
    right: true,
};

document.getElementById('jumpBtn').addEventListener('mousedown', function(){
    if(this.textContent==='↑'){
        if (!player.isJumping) {
            player.dy = player.jumpPower;
            player.isJumping = true;
        }
        if (!pet.isJumping) {
            pet.dy = pet.jumpPower;
            pet.isJumping = true;
        }
    }
});

// 監聽按鈕松開事件
// 當按鈕鬆開時，停止移動
// 綁定全局的 mouseup 事件來處理按鈕鬆開的情況
document.addEventListener('mouseup', () => {
    keys.left = false;
    keys.right = false;
});
// 監聽鍵盤事件
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') keys.right = true;
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowUp') keys.up = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight') keys.right = false;
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowUp') keys.up = false;
});


document.getElementById('jumpBtn').addEventListener('touchstart', function (e) {
    e.stopPropagation(); // 阻止事件冒泡
    if(this.textContent==='↑'){
        if (!player.isJumping) {
            player.dy = player.jumpPower;
            player.isJumping = true;
        }
        if (!pet.isJumping) {
            pet.dy = pet.jumpPower;
            pet.isJumping = true;
        }
    }
});
document.addEventListener('touchend', () => {
    // 根據觸摸結束的區域停止移動
    keys.left = false;
    keys.right = false;
});

// 攝影機視角控制
const camera = {
    x: 0,  // 攝影機在遊戲世界中的X位置
    y: 0,  // 攝影機在遊戲世界中的Y位置
    width: canvas.width,  // 攝影機視窗的寬度（等於畫布寬度）
    height: canvas.height  // 攝影機視窗的高度（等於畫布高度）
};





const minimapScale = 1;
const backgroundspeed=0.2;
// 遊戲邏輯
function updateGame() {
    // 更新玩家位置
    if (keys.right) {
        pet.x = player.x - 100; 
        player.dx = player.speed;
        direction.right=true;
    }
    if (keys.left) {
        pet.x = player.x + 250; 
        player.dx = -player.speed;
        direction.right=false;
    }
    if (!keys.right && !keys.left) player.dx = 0;

    if (keys.up && !player.isJumping) {
        player.dy = player.jumpPower;
        player.isJumping = true;
        pet.dy = pet.jumpPower;
        pet.isJumping = true;
    }

    // 更新玩家的物理狀態
    player.x += player.dx;
    player.y += player.dy;
    player.dy += player.gravity;

    pet.y+=pet.dy;
    pet.dy+=pet.gravity;

    // 防止角色移出畫布的左邊或右邊
    if (player.x < 0) player.x = 0;  // 左邊邊界
    if (player.x + player.width > background1.width) {
        player.x = background1.width - player.width;  // 讓角色停在背景的最右邊
    }

   // 使寵物稍微在玩家右邊

    // 碰撞檢測（玩家與地面）
    if (player.y >= canvas.height- groundHeight - player.height) {
        player.y = canvas.height - groundHeight- player.height;
        player.isJumping = false;
        player.dy = 0;
    }
    if (pet.y >= canvas.height- groundHeight - pet.height-10) {
        pet.y = canvas.height - groundHeight- pet.height-10;
        pet.isJumping = false;
        pet.dy = 0;
    }

    /*for (let platform of platforms) {
        if (player.x + player.width > platform.x && player.x < platform.x + platform.width &&
            player.y + player.height <= platform.y && player.y + player.height + player.dy >= platform.y) {
            // 當玩家在平台之上時
            player.y = platform.y - player.height;
            player.dy = 0;
            player.isJumping = false;
        }
    }*/
    


    // 更新攝影機位置，使其跟隨玩家
    camera.x = player.x - canvas.width /2.25;  // 攝影機X位置跟隨玩家，保持玩家在畫布中央

    // 限制攝影機不會顯示畫布外的區域
    if (camera.x < 0) camera.x = 0;  // 防止攝影機超出遊戲世界左邊界
    if (camera.x > background1.width - canvas.width) camera.x = background1.width - canvas.width;  // 防止攝影機超出遊戲世界右邊界

    // 清空畫布並繪製背景的一部分
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 繪製背景的部分，類似攝影機的視窗
    ctx.drawImage(background3, background1X, 0);
    ctx.drawImage(background3, background2X, 0);
    ctx.drawImage(background1, camera.x, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    drawNPC();
    drawPlayer();
    drawPet(); // 繪製寵物
    collisiondetect();
    
        // 繪製第二層背景
    ctx.drawImage(background2, camera.x*1.5, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
        // 繪製第三層背景
    drawMinimap();
    if (background1X < -4000) {
        background1X = 4000+background2X-backgroundspeed;  // 重置位置，使背景無縫循環
    }
    else
    {
        background1X -= backgroundspeed;  
    }
    if (background2X < -4000) {
        background2X = 4000+background1X-backgroundspeed;  // 重置位置，使背景無縫循環
    }
    else
    {
        background2X -= backgroundspeed;  
    }
     // 繪製平台
     /*ctx.fillStyle = 'brown'; // 設置平台顏色
     for (let platform of platforms) {
         ctx.fillRect(platform.x - camera.x, platform.y, platform.width, platform.height); // 繪製每個平台
     }
 
     // 繪製地面
     ctx.fillStyle = 'green';  // 設定地面的顏色
     ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);  // 繪製地面*/

    // 繪製玩家
    
    // 初始繪製按鈕

    // 重複執行遊戲更新
    requestAnimationFrame(updateGame);
}

// 繪製玩家
function drawPlayer() {
    if (!direction.right) {
        // 當玩家向左移動，將玩家圖片進行水平翻轉
        ctx.save(); // 保存當前狀態
        ctx.scale(-1, 1); // 水平翻轉
        ctx.drawImage(playerImage, -player.x - player.width + camera.x, player.y, player.width, player.height); // 調整x座標以適應翻轉
        ctx.restore(); // 恢復到之前的狀態
    } else {
        // 正常顯示玩家
        ctx.drawImage(playerImage, player.x - camera.x, player.y, player.width, player.height);
    }
}

function drawNPC() {
    ctx.drawImage(npcImage, npc.x- camera.x, npc.y, npc.width, npc.height);  // 使用圖片繪製角色
}

function drawPet() {
    if (direction.right) {
        // 當玩家向左移動，將寵物圖片進行水平翻轉
        ctx.save(); // 保存當前狀態
        ctx.scale(-1, 1); // 水平翻轉
        ctx.drawImage(petImage, -pet.x - pet.width + camera.x, pet.y, pet.width, pet.height); // 調整x座標以適應翻轉
        ctx.restore(); // 恢復到之前的狀態
    } else {
        // 正常顯示
        ctx.drawImage(petImage, pet.x - camera.x, pet.y, pet.width, pet.height);
    }
}

function drawMinimap() {
    // 設定小地圖的邊框
    ctx.lineWidth = 5;   // 邊框寬度
    ctx.strokeStyle = 'black'; // 邊框顏色
    ctx.strokeRect(minimapX - 3, minimapY - 3, minimapWidth + 5, minimapHeight + 5);
    ctx.drawImage(minimapImage, 0, 0, 4000, 940, minimapX, minimapY, minimapWidth, minimapHeight);

    // 計算玩家在小地圖中的位置，將玩家的世界坐標映射到小地圖的相對位置
    const minimapScaleX = minimapWidth / 4000;  // 小地圖寬度與完整地圖寬度的比例
    const minimapScaleY = minimapHeight / 940;  // 小地圖高度與完整地圖高度的比例

    // 轉換玩家世界座標為小地圖座標
    const playerMinimapX = player.x * minimapScaleX;
    const playerMinimapY = player.y * minimapScaleY;

    // 繪製玩家在小地圖上的位置
    ctx.beginPath();
    ctx.arc(minimapX + playerMinimapX+25, minimapY+50 + playerMinimapY, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    // 計算角色圖像的縮放大小
    //minimapCtx.drawImage(playerImage, playerMinimapX , playerMinimapY, 293/10, 377/5);
}

// 開始遊戲
updateGame();

function collisiondetect(){
    // 檢查角色是否接近NPC
  const npcDist = Math.sqrt((player.x - npc.x) ** 2 + (player.y - npc.y) ** 2);
  const isNearNPC = npcDist < 200; // 假設接近範圍為200px
  
  if (isNearNPC) {
    // 顯示對話按鈕，隱藏跳躍按鈕
    document.getElementById('jumpBtn').textContent = '對話';
  } else {
    // 顯示跳躍按鈕，隱藏對話按鈕
    document.getElementById('jumpBtn').textContent = '↑';
  }
}