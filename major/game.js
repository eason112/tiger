const url2="https://eason112.github.io/tiger";

const canvas2 = document.getElementById('gameCanvas2');
const ctx2 = canvas2.getContext('2d');

// 設定畫布大小
canvas2.width = 2000;
canvas2.height = 940;


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
const minimapX = gameCanvas2.width - minimapWidth - 10; // 右上角
const minimapY = 10;

const groundHeight =0;
let Touches = [];
let Touchesindex=[{name:'joystick',id:-1},
                   {name:'button',id:-1}
];
function getTouchesByName(name) {
    let touch = Touchesindex.find(touch => touch.name === name);
    return touch; // 如果找到則返回 index，否則返回 null
}
function getTouchesByid(id) {
    let touch = Touches.find(touch => touch.identifier === id);
    return touch; // 如果找到則返回 index，否則返回 null
}
/*const platforms = [
    { x: 100, y: 600, width: 200, height: 100 },
    { x: 700, y: 650, width: 500, height: 100 },
    { x: 1650, y: 700, width: 200, height: 100 },
];*/

// 定義搖桿的基本參數
const joystickBackgroundRadius = 100; // 背景半徑
const joystickKnobRadius = 30; // 按鈕半徑
let isJoystickActive = false;
let joystickCenter =  { x: joystickBackgroundRadius + 50, y: canvas2.height - joystickBackgroundRadius - 50 } // 中心位置
let joystickDirection = { x: 0, y: 0 }; // 左右和上下的控制值
let joystickhover=false;

// 設置搖桿背景和按鈕的初始位置
function drawJoystick() {
    // 清空畫布
    // 繪製搖桿背景
    if(!isMobileDevice()){
        if(joystickhover||isJoystickActive||buttonHovered){
        canvas2.style.cursor = 'pointer';
        }
        else{
        canvas2.style.cursor = 'default';
        }
    }
    ctx2.beginPath();
    ctx2.arc(joystickCenter.x, joystickCenter.y, joystickBackgroundRadius, 0, Math.PI * 2);
    ctx2.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx2.fill();
    ctx2.lineWidth = 2;
    ctx2.strokeStyle = 'black';
    ctx2.stroke();
  
    // 繪製搖桿控制按鈕
    ctx2.beginPath();
    ctx2.arc(joystickCenter.x + joystickDirection.x * joystickBackgroundRadius, joystickCenter.y + joystickDirection.y * joystickBackgroundRadius, joystickKnobRadius, 0, Math.PI * 2);
    ctx2.fillStyle = 'gray';
    ctx2.fill();
    ctx2.strokeStyle = 'black';
    ctx2.lineWidth = 2;
    ctx2.stroke();
  }

// 檢查鼠標/觸摸點是否在搖桿範圍內
function isInJoystickArea(x, y) {
    const deltaX = x - joystickCenter.x;
    const deltaY = y - joystickCenter.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    return {isInArea: distance <= joystickBackgroundRadius,  // 是否在範圍內
            isInKnob: distance <= joystickKnobRadius}// 判斷是否在搖桿背景的圓形範圍內
}
// 更新搖桿狀態
function updateJoystick(offsetX,offsetY,isstop=false) {
    // 計算搖桿的最大可移動範圍（背景半徑）
    const maxDistance = joystickBackgroundRadius;
  
    // 計算搖桿的偏移量，並限制它在範圍內
    const deltaX = offsetX - joystickCenter.x;
    const deltaY = offsetY - joystickCenter.y;
  
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance < maxDistance) {
      joystickDirection.x = deltaX / maxDistance;
      joystickDirection.y = deltaY / maxDistance;
    } else {
      const angle = Math.atan2(deltaY, deltaX);
      joystickDirection.x = Math.cos(angle);
      joystickDirection.y = Math.sin(angle);
    }
    if(isstop)joystickDirection = { x: 0, y: 0 };

  // 更新搖桿顯示
  //drawJoystick();

  // 更新角色移動（或其他遊戲控制邏輯）
  keys.left = joystickDirection.x < -0.2;  // 左邊
  keys.right = joystickDirection.x > 0.2;  // 右邊

}

// 觸發搖桿更新
document.addEventListener('mousedown', (e) => {
    if(!isMobileDevice()){
        const rect = canvas2.getBoundingClientRect(); // 獲取畫布相對於視口的位置及大小
        let offsetX = (e.clientX - rect.left) * (canvas2.width / rect.width);
        let offsetY = (e.clientY - rect.top) * (canvas2.height / rect.height);
        if(isInJoystickArea(offsetX,offsetY).isInArea){
            isJoystickActive = true;
            updateJoystick(offsetX,offsetY);
        }
    }
});

document.addEventListener('mousemove', (e) => {
    if(!isMobileDevice()){
        const rect = canvas2.getBoundingClientRect(); // 獲取畫布相對於視口的位置及大小
        let offsetX = (e.clientX - rect.left) * (canvas2.width / rect.width);
        let offsetY = (e.clientY - rect.top) * (canvas2.height / rect.height);
        if(isInJoystickArea(offsetX,offsetY).isInKnob){
            joystickhover=true;
        }
        else{
            joystickhover=false;
        }
        if (isJoystickActive) {
            const rect = canvas2.getBoundingClientRect(); // 獲取畫布相對於視口的位置及大小
            let offsetX = (e.clientX - rect.left) * (canvas2.width / rect.width);
            let offsetY = (e.clientY - rect.top) * (canvas2.height / rect.height);
            updateJoystick(offsetX,offsetY);
        }
    }
});

document.addEventListener('mouseup', (e) => {
    if(!isMobileDevice()){
        isJoystickActive = false;
        joystickDirection = { x: 0, y: 0 }; // 停止移動
    }
});

// 支援觸摸設備
canvas2.addEventListener('touchstart', (e) => {
    if(isMobileDevice()){
        Array.from(e.touches).forEach(touch =>{
        //let touch = e.touches[0];
            let rect = canvas2.getBoundingClientRect();
            let offsetX = (touch.clientX - rect.left) * (canvas2.width / rect.width);
            let offsetY = (touch.clientY - rect.top) * (canvas2.height / rect.height);
            if(isInJoystickArea(offsetX,offsetY).isInArea){
                isJoystickActive = true;
                getTouchesByName('joystick').id=touch.identifier;
                updateJoystick(offsetX,offsetY); // 使用觸摸點的第一個點
            }
        });
    }
    e.preventDefault(); // 防止觸摸移動時頁面滾動
});

canvas2.addEventListener('touchmove', (e) => {
    if (isJoystickActive) {
        let touch = Array.from(e.touches).find(touch => touch.identifier === getTouchesByName('joystick').id);
        let rect = canvas2.getBoundingClientRect();
        let offsetX = (touch.clientX - rect.left) * (canvas2.width / rect.width);
        let offsetY = (touch.clientY - rect.top) * (canvas2.height / rect.height);
        updateJoystick(offsetX,offsetY);
        
    }
    e.preventDefault(); // 防止觸摸移動時頁面滾動
});

canvas2.addEventListener('touchend', (e) => {
    let touch = Array.from(e.changedTouches).find(touch => touch.identifier === getTouchesByName('joystick').id);
    if (touch) {
        //Touchesindex[0].index=-1;
        getTouchesByName('joystick').id=-1;
        isJoystickActive = false;
        joystickDirection = { x: 0, y: 0 }; // 停止移動
        updateJoystick(0,0,true); // 使用觸摸點的第一個點
    }
});

canvas2.addEventListener('touchcancel', (e) => {
    let touch = Array.from(e.changedTouches).find(touch => touch.identifier === getTouchesByName('joystick').id);
    if (touch) {
        getTouchesByName('joystick').id=-1;
        isJoystickActive = false;
        joystickDirection = { x: 0, y: 0 }; // 停止移動
        updateJoystick(0,0,true); // 使用觸摸點的第一個點
    }
});


// 角色屬性
let player = {
    x: 50,
    y: canvas2.height- groundHeight,
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


// 監聽按鈕松開事件
// 當按鈕鬆開時，停止移動
// 綁定全局的 mouseup 事件來處理按鈕鬆開的情況
document.addEventListener('mouseup', () => {
    keys.left = false;
    keys.right = false;
});




// 攝影機視角控制
const camera = {
    x: 0,  // 攝影機在遊戲世界中的X位置
    y: 0,  // 攝影機在遊戲世界中的Y位置
    width: canvas2.width,  // 攝影機視窗的寬度（等於畫布寬度）
    height: canvas2.height  // 攝影機視窗的高度（等於畫布高度）
};

const npcDialog = [
    { name: "NPC", text: "你好，巧虎！一起挖蛤蠣吧。" },
];

// 當前對話框顯示的對話
let currentDialogIndex = 0;
let showDialog = false;

const dialogBox = {
    width: 800, // 寬度
    height: 200, // 高度
    padding: 20, // 內邊距
    borderRadius: 15, // 圓角半徑
    bgColor: 'rgba(0, 0, 0, 0.5)', // 背景顏色
    borderColor: 'white', // 邊框顏色
    // 直接在這裡設置對話框的位置
    get x() {
        return (canvas2.width - this.width) / 2; // 居中對話框
    },
    get y() {
        return canvas2.height - this.height - 30; // 使對話框靠近畫布底部
    }
};


const minimapScale = 1;
const backgroundspeed=0.2;
// 遊戲邏輯
function updateGame2() {
    // 更新玩家位置
    if (keys.right) {
        console.log(player);
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
    if (player.y >= canvas2.height- groundHeight - player.height) {
        player.y = canvas2.height - groundHeight- player.height;
        player.isJumping = false;
        player.dy = 0;
    }
    if (pet.y >= canvas2.height- groundHeight - pet.height-10) {
        pet.y = canvas2.height - groundHeight- pet.height-10;
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
    camera.x = player.x - canvas2.width /2.25;  // 攝影機X位置跟隨玩家，保持玩家在畫布中央

    // 限制攝影機不會顯示畫布外的區域
    if (camera.x < 0) camera.x = 0;  // 防止攝影機超出遊戲世界左邊界
    if (camera.x > background1.width - canvas2.width) camera.x = background1.width - canvas2.width;  // 防止攝影機超出遊戲世界右邊界

    // 清空畫布並繪製背景的一部分
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

    // 繪製背景的部分，類似攝影機的視窗
    ctx2.drawImage(background3, background1X, 0);
    ctx2.drawImage(background3, background2X, 0);
    ctx2.drawImage(background1, camera.x, 0, canvas2.width, canvas2.height, 0, 0, canvas2.width, canvas2.height);
    drawNPC();
    drawPlayer();
    drawPet(); // 繪製寵物
    collisiondetect();
    
        // 繪製第二層背景
    ctx2.drawImage(background2, camera.x*1.5, 0, canvas2.width, canvas2.height, 0, 0, canvas2.width, canvas2.height);
        // 繪製第三層背景
    drawMinimap();
    drawButton();
    drawJoystick();
    drawDialogBox();
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
    animationFrameId = requestAnimationFrame(updateGame2);
}
function stopGame() {
    cancelAnimationFrame(animationFrameId);  // 停止 updateGame
}
function startGame() {
    updateGame2();  // 开始更新
  }
// 繪製玩家
function drawPlayer() {
    if (!direction.right) {
        // 當玩家向左移動，將玩家圖片進行水平翻轉
        ctx2.save(); // 保存當前狀態
        ctx2.scale(-1, 1); // 水平翻轉
        ctx2.drawImage(playerImage, -player.x - player.width + camera.x, player.y, player.width, player.height); // 調整x座標以適應翻轉
        ctx2.restore(); // 恢復到之前的狀態
    } else {
        // 正常顯示玩家
        ctx2.drawImage(playerImage, player.x - camera.x, player.y, player.width, player.height);
    }
}

function drawNPC() {
    ctx2.drawImage(npcImage, npc.x- camera.x, npc.y, npc.width, npc.height);  // 使用圖片繪製角色
}

function drawPet() {
    if (direction.right) {
        // 當玩家向左移動，將寵物圖片進行水平翻轉
        ctx2.save(); // 保存當前狀態
        ctx2.scale(-1, 1); // 水平翻轉
        ctx2.drawImage(petImage, -pet.x - pet.width + camera.x, pet.y, pet.width, pet.height); // 調整x座標以適應翻轉
        ctx2.restore(); // 恢復到之前的狀態
    } else {
        // 正常顯示
        ctx2.drawImage(petImage, pet.x - camera.x, pet.y, pet.width, pet.height);
    }
}

function drawMinimap() {
    // 設定小地圖的邊框
    ctx2.lineWidth = 5;   // 邊框寬度
    ctx2.strokeStyle = 'black'; // 邊框顏色
    ctx2.strokeRect(minimapX - 3, minimapY - 3, minimapWidth + 5, minimapHeight + 5);
    ctx2.drawImage(minimapImage, 0, 0, 4000, 940, minimapX, minimapY, minimapWidth, minimapHeight);

    // 計算玩家在小地圖中的位置，將玩家的世界坐標映射到小地圖的相對位置
    const minimapScaleX = minimapWidth / 4000;  // 小地圖寬度與完整地圖寬度的比例
    const minimapScaleY = minimapHeight / 940;  // 小地圖高度與完整地圖高度的比例


    const NPCMinimapX = npc.x * minimapScaleX;
    const NPCMinimapY = npc.y * minimapScaleY;

    // 繪製NPC在小地圖上的位置
    ctx2.beginPath();
    ctx2.arc(minimapX + NPCMinimapX+25, minimapY+50 + NPCMinimapY, 10, 0, Math.PI * 2);
    ctx2.fillStyle = 'green';
    ctx2.fill();
    // 轉換玩家世界座標為小地圖座標
    const playerMinimapX = player.x * minimapScaleX;
    const playerMinimapY = player.y * minimapScaleY;

    // 繪製玩家在小地圖上的位置
    ctx2.beginPath();
    ctx2.arc(minimapX + playerMinimapX+25, minimapY+50 + playerMinimapY, 10, 0, Math.PI * 2);
    ctx2.fillStyle = 'red';
    ctx2.fill();

    // 計算角色圖像的縮放大小
    //minimapCtx.drawImage(playerImage, playerMinimapX , playerMinimapY, 293/10, 377/5);
}
// 按鈕的位置和大小（右下角）
const buttonWidth = 200;
const buttonHeight = 200;
const padding = 50;  // 按鈕距離右下角的邊距
const buttonX = canvas2.width - buttonWidth - padding;
const buttonY = canvas2.height - buttonHeight - padding;
let buttonHovered=false;

let buttons = [
    {draw:true, name:"jump",x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight, fontSize: 60, text: "↑" ,buttonClicked : false },// 按鈕1
    {draw:false, name:"dialog",x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight, fontSize: 60, text: "對話" ,buttonClicked : false },// 按鈕2
]

function getButtonByName(name) {
    return buttons.find(button => button.name === name);
}

function drawButton() {
    // 繪製按鈕（綠色的圓形背景）
    buttons.forEach(button => {
        if(button.draw){
            ctx2.fillStyle = "rgba(0, 0, 0, 0.5)";   
            let scaleFactor = button.buttonClicked ? 0.95 : 1;  // 當點擊時稍微放大
            if(button.buttonHovered) {
                ctx2.fillStyle = "rgba(0, 0, 0, 0.6)";   
                canvas2.style.cursor = 'pointer';
            }
            else{
                ctx2.fillStyle = "rgba(0, 0, 0, 0.5)";   
                canvas2.style.cursor = 'default';
            }
            // 重新繪製圓形按鈕
            ctx2.beginPath();
            ctx2.arc(button.x + button.width / 2, button.y + button.height / 2, buttonWidth / 2 * scaleFactor, 0, Math.PI * 2);
            ctx2.fill();

            // 繪製箭頭
            ctx2.fillStyle = "white";
            ctx2.font = `${button.fontSize}px Arial`;
            ctx2.textAlign = "center";
            ctx2.textBaseline = "middle";
            ctx2.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);
        }
    });   
}


// 開始遊戲
updateGame2();
function collisiondetect(){
    // 檢查角色是否接近NPC
  const npcDist = Math.sqrt((player.x - npc.x) ** 2 + (player.y - npc.y) ** 2);
  const isNearNPC = npcDist < 200; // 假設接近範圍為200px
  
  if (isNearNPC) {
    // 顯示對話按鈕，隱藏跳躍按鈕
    getButtonByName("jump").draw=false;
    getButtonByName("dialog").draw=true;
  } else {
    // 顯示跳躍按鈕，隱藏對話按鈕
    getButtonByName("jump").draw=true;
    getButtonByName("dialog").draw=false;
  }
}


canvas2.addEventListener('mousemove', function(event) {
    if(!isMobileDevice())
    handleMouseEvent(event,false);
});

// 監聽 canvas 上的點擊事件 (適用於桌面端)
canvas2.addEventListener('mousedown', function(event) {
    if(!isMobileDevice())
    handleMouseEvent(event,true);
});

// 監聽觸控開始事件 (適用於手機端)
canvas2.addEventListener('touchstart', function(event) {
    handleTouchEvent(event);
}, );


// 處理滑鼠點擊事件
function handleMouseEvent(event,ishover) {
    let rect = canvas2.getBoundingClientRect();
    let mouseX = (event.clientX - rect.left) * (canvas2.width / rect.width);
    let mouseY = (event.clientY - rect.top) * (canvas2.height / rect.height);
    if(ishover) {
        checkButtonClick(mouseX, mouseY, true);
        isClickInDialog(mouseX, mouseY);
    }
    else checkButtonHover(mouseX, mouseY);

}

// 處理觸控事件
function handleTouchEvent(event) {
    // 只取第一個觸控點
    Array.from(event.touches).forEach(touch =>{
        //let touch = event.touches[0];
        let rect = canvas2.getBoundingClientRect();
        let touchX = (touch.clientX - rect.left) * (canvas2.width / rect.width);
        let touchY = (touch.clientY - rect.top) * (canvas2.height / rect.height);
        checkButtonClick(touchX, touchY, false);
        isClickInDialog(touchX, touchY);

    });
    event.preventDefault(); // 防止觸摸移動時頁面滾動
}

// 檢查是否點擊在圓形按鈕上
function checkButtonClick(x, y, ismouse) {
    buttons.forEach(button => {
        if(button.draw){
            let centerX = button.x + button.width / 2;
            let centerY = button.y + button.height / 2;
            let radius = button.width / 2;

            let distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

            if (distance <= radius) {
                console.log("點擊在圓形按鈕內部，按鈕" + button.name);
                if(!ismouse) button.buttonHovered=false;
                button.buttonClicked = true;  // 設置被點擊的按鈕狀態
                setTimeout(() => {
                    button.buttonClicked = false;  // 延遲後恢復按鈕原狀
                }, 200);
                switch(button.name){
                    case "jump":{
                        if (!player.isJumping) {
                            player.dy = player.jumpPower;
                            player.isJumping = true;
                        }
                        if (!pet.isJumping) {
                            pet.dy = pet.jumpPower;
                            pet.isJumping = true;
                        }
                        break;
                    }
                    case "dialog":{
                        showDialog=!showDialog;
                        break;
                    }
                }
            }
        }
    });
}
function checkButtonHover(x, y) {
    buttons.forEach(button => {
        if(button.draw){
            let centerX = button.x + button.width / 2;
            let centerY = button.y + button.height / 2;
            let radius = button.width / 2;

            let distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

            buttonHovered = distance <= radius;
                
            if (buttonHovered) {
                console.log("hover"+button.name)  // 只要有一個按鈕被 hover，就設置 isHovering 為 true
            }
        }
    });
        
}
function drawDialogBox() {
    if (showDialog) {
        // 畫背景（圓角矩形）
        ctx2.fillStyle = dialogBox.bgColor;
        ctx2.beginPath();
        ctx2.moveTo(dialogBox.x + dialogBox.borderRadius, dialogBox.y);
        ctx2.arcTo(dialogBox.x + dialogBox.width, dialogBox.y, dialogBox.x + dialogBox.width, dialogBox.y + dialogBox.height, dialogBox.borderRadius);
        ctx2.arcTo(dialogBox.x + dialogBox.width, dialogBox.y + dialogBox.height, dialogBox.x, dialogBox.y + dialogBox.height, dialogBox.borderRadius);
        ctx2.arcTo(dialogBox.x, dialogBox.y + dialogBox.height, dialogBox.x, dialogBox.y, dialogBox.borderRadius);
        ctx2.arcTo(dialogBox.x, dialogBox.y, dialogBox.x + dialogBox.width, dialogBox.y, dialogBox.borderRadius);
        ctx2.fill();

        // 畫邊框
        ctx2.strokeStyle = dialogBox.borderColor;
        ctx2.lineWidth = 2;
        ctx2.stroke();

        // 設置字體和顏色
        ctx2.fillStyle = 'white';
        ctx2.font = '20px Arial';
        ctx2.textAlign = 'left';
        ctx2.textBaseline = 'top';

        // 顯示 NPC 名字
        ctx2.font = 'bold 30px Arial';
        ctx2.fillText(npcDialog[currentDialogIndex].name + ":", dialogBox.x + dialogBox.padding, dialogBox.y + dialogBox.padding);

        // 顯示對話文本
        ctx2.font = '30px Arial';
        let textX = dialogBox.x + dialogBox.padding;
        let textY = dialogBox.y + dialogBox.padding + 40;

        // 分割對話文本成多行，避免超出對話框範圍
        const maxLineWidth = dialogBox.width - 2 * dialogBox.padding;
        const lines = wrapText(npcDialog[currentDialogIndex].text, maxLineWidth);
        
        lines.forEach((line, index) => {
            ctx2.fillText(line, textX, textY + (index * 25)); // 顯示每行文本
        });
    }
}

// 文字換行處理
function wrapText(text, maxWidth) {
    let words = text.split(' ');
    let line = '';
    let lines = [];

    words.forEach(word => {
        let testLine = line + word + ' ';
        let testWidth = ctx2.measureText(testLine).width;
        if (testWidth > maxWidth) {
            lines.push(line);
            line = word + ' ';
        } else {
            line = testLine;
        }
    });

    if (line !== '') {
        lines.push(line);
    }

    return lines;
}

// 顯示下一行對話
function nextDialog() {
    currentDialogIndex++;
    if (currentDialogIndex >= npcDialog.length) {
        showDialog = false; // 對話結束後隱藏對話框
        currentDialogIndex=0;
        loadGame1();
    }
}

function isClickInDialog(x, y) {
    if(x >= dialogBox.x && x <= dialogBox.x + dialogBox.width &&
        y >= dialogBox.y && y <= dialogBox.y + dialogBox.height){
        if(showDialog){
            nextDialog(); 
        }

    }
}

document.addEventListener('keydown', (e) => {
    console.log(e.key);
    if (e.key === 'ArrowRight') keys.right = true;
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowUp') keys.up = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight') keys.right = false;
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowUp') keys.up = false;
});
