const url2="https://eason112.github.io/tiger";//https://eason112.github.io/tiger
//import '../all.js'
const canvas2 = document.getElementById('gameCanvas2');
const ctx2 = canvas2.getContext('2d');
const video = document.getElementById('myVideo');

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
playerImage.src = url2+'/major/images/player.png';//玩家

const npcImage = new Image();
npcImage.src = url2+'/major/images/NPC.png';//NPC

const petImage = new Image();
petImage.src = url2+'/major/images/NPC.png';//寵物

const minimapImage = new Image();
minimapImage.src = url2+'/major/images/minimap.png';  //小地圖

const teachImage = new Image();
teachImage.src = url2+'/littlegame/new/images/teach.png';  //教學

const teacharrowImage = new Image();
teacharrowImage.src = url2+'/major/images/teacharrow.png';  //箭頭

//後景移動
let background1X = 0;
let background2X = 4000;

//後景移動速度
const backgroundspeed=0.2;

//小地圖
const minimapWidth =800;
const minimapHeight = 188;
const minimapX = gameCanvas2.width - minimapWidth - 130; // 右上角
const minimapY = 20;

//地面高度
const groundHeight =0;

let isplayvideo=false;

let Touches = [];
let Touchesindex=[
    {name:'joystick',id:-1},
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

//教學參數
const teach={
    index:-1,
    animationProgress : 0,
    teachdirection : 1,// 1 代表向右，-1 代表向回中間
    teachscale: 1,// 控制图像的缩放
    scaleDirection: 1,  // 控制缩放方向，1 为放大，-1 为缩小
    scaleSpeed: 0.01,  // 控制缩放的速度
    width:100,
    height:100,
    canmove:true,
}

const misson={
    animationProgress : 0,
    direction : 1,// 1 代表向右，-1 代表向回中間
    minianimationProgress : 0,
    minidirection : 1,// 1 代表向右，-1 代表向回中間
    scale: 1,// 控制图像的缩放
    scaleDirection: 1,  // 控制缩放方向，1 为放大，-1 为缩小
    scaleSpeed: 0.01,  // 控制缩放的速度
}

// 搖桿繪製
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

    if(teach.index==0){
        let maxX = joystickCenter.x + joystickBackgroundRadius - teachImage.width / 2;  // 右邊界
        let minX = joystickCenter.x - teachImage.width / 2;  // 中心位置

        // 更新動畫進度
        teach.animationProgress += teach.teachdirection * 0.02; // 控制圖片移動速度
        let currentX = minX + teach.animationProgress * (maxX - minX);
        // 當圖片到達右邊界時，直接跳回中間
        if (teach.animationProgress >= 1) {
            teach.animationProgress = 0; // 保證圖片停在最右邊
            currentX=minX;
            //teachdirection = -1; // 改變方向回到中間
        }

        // 當圖片到達中間時，改變方向
        if (teach.animationProgress <= 0) {
            //animationProgress = 0; // 保證圖片停在最中間
        }

        // 計算圖片的 X 坐標
    

        // 繪製圖片
        ctx2.drawImage(teachImage, currentX, joystickCenter.y - teach.height/4,teach.width,teach.height);
    }
}

// 檢查鼠標/觸摸點是否在搖桿範圍內
function isInJoystickArea(x, y) {
    if(!isplayvideo){
        const deltaX = x - joystickCenter.x;
        const deltaY = y - joystickCenter.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        return {isInArea: distance <= joystickBackgroundRadius,  // 是否在範圍內
                isInKnob: distance <= joystickKnobRadius}// 判斷是否在搖桿背景的圓形範圍內
    }
    else{
        return {isInArea: false,  // 是否在範圍內
                isInKnob: false}// 判斷是否在搖桿背景的圓形範圍內
    }
}

// 更新搖桿狀態
function updateJoystick(offsetX,offsetY,isstop=false) {
    // 計算搖桿的最大可移動範圍（背景半徑）
    if(teach.canmove&&!isplayvideo){
        if(teach.index==0){
            setTimeout(() => {
                teach.canmove=false;
                isJoystickActive = false;
                joystickDirection = { x: 0, y: 0 }; // 停止移動
                keys.right=false;
                keys.left=false
                if(teach.index==0)
                teach.index++;
            }, 1000);
        }
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

        // 更新角色移動（或其他遊戲控制邏輯）
        keys.left = joystickDirection.x < -0.2;  // 左邊
        keys.right = joystickDirection.x > 0.2;  // 右邊
    }

}

//控制教學圖縮放
function updateImageScale() {
    if (teach.teachscale >= 1.5) {
        teach.scaleDirection = -1;  // 当达到最大值时开始缩小
    } else if (teach.teachscale <= 1) {
        teach.scaleDirection = 1;  // 当达到最小值时开始放大
    }

    teach.teachscale += teach.scaleSpeed * teach.scaleDirection;  // 使用 scaleSpeed 控制缩放速度
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


//角色屬性
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
    isJumping: false,
    name: "玩家1"  // 添加角色名稱屬性
};

//NPC屬性
let npc = {
    x: 2500,  // NPC的起始X位置
    y: 550 ,  // NPC的Y位置，放在地面之上
    width: 293,  // NPC的寬度
    height: 377, // NPC的高度
    name:'小朋老師',
};

//寵物屬性
let pet = {
    x: player.x - 50, // 寵物的初始位置 (稍微在玩家右側)
    y: player.y, // 寵物與玩家 y 位置一致
    width: 146, // 寵物的寬度
    height: 188, // 寵物的高度
    speed: 5, // 寵物的移動速度
    dy: 0,
    gravity: 1,
    jumpPower: -25,
    isJumping: false,
    wear:false,
};

// 控制按鍵
let keys = {
    right: false,
    left: false,
    up: false
};

//移動方向
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

//NPC對話框屬性
const npcDialog = [
    { name: npc.name, text: "現在是海洋退潮的時間 小朋友們我們今天要來挖蛤蠣喔！",  logo:"!"},
    { name: npc.name, text: "現在你知道海洋漲潮與退潮的意思了 很棒喔！老師給你一些獎勵", logo:"?"},
];

//獎勵對話框屬性
const rewardDialog = [
    { name: "reward", text: "恭喜你獲得新服裝!",img:url2+'/major/images/player.png',imageWidth:293/1.5,imageHeight:377/1.5 },
    { name: "reward", text: "恭喜你獲得新寵物!",img:url2+'/major/images/NPC.png' ,imageWidth:293/1.5,imageHeight:377/1.5},
    { name: "reward", text: "恭喜你獲得新AR內容!",img:url2+'/major/images/ARicon.png' ,imageWidth:250,imageHeight:250},
];

//可獲得服裝屬性
let clothingImage = [
    { index:0,hasget: true,name:"經典", text: "已穿戴",img:url2+'/major/images/player.png',imageWidth:293,imageHeight:377,weared:true },
    { index:1,hasget: false,name:"海灘", text: "穿戴",img:url2+'/major/images/NPC.png' ,imageWidth:293,imageHeight:377,weared:false},
];

//可獲得寵物屬性
let petImages = [
    { index:0,hasget: true,name:"無", text: "",img:'',imageWidth:293,imageHeight:377,weared:false },
    { index:1,hasget: false,name:"寄居蟹", text: "穿戴",img:url2+'/major/images/NPC.png',imageWidth:293,imageHeight:377,weared:false },
];

let ARImages = [
    { index:0,hasget: true,name:"無", text: "",img:'',imageWidth:293,imageHeight:377,weared:false },
    { index:1,hasget: false,name:"海灘巧虎", text: "開啟",img:url2+'/major/images/ARicon.png',imageWidth:300,imageHeight:300,weared:false },
];

// 當前介面顯示index&&是否顯示
let currentDialogIndex = 0;
let showDialog = false;
let currentRewardIndex = 0;
let showReward = false;
let currentclothingIndex = 0;
let showclothingBox = false;
let currentpetIndex = 0; 
let showpetBox = false;
let currentARIndex = 0; 
let showARBox = false;

//選單屬性
let menuOpen = false;  // 用來控制選單是否打開
let menuX = canvas2.width;  // 選單的初始 X 座標，位於畫面右側外部
let menuY = 0;  // 選單的初始 X 座標，位於畫面右側外部
const menuWidth = 300;  // 選單的寬度
const menuHeight = canvas2.height/2;  // 選單的高度與視窗高度一致
const menuSpeed = 15;  // 控制選單滑動的速度


//選單繪製
function drawMenu() {
    if (menuOpen) {
        // 控制選單從右邊滑入
        if (menuX > canvas2.width - menuWidth) {
            buttons.forEach(button => {
                if(button.type=='menu'||button.type=='menuclose')
                button.x-= menuSpeed;
            });
            menuX -= menuSpeed;  // 當選單開啟時，將選單向左移動
        }
    } else {
        // 控制選單滑回右邊
        if (menuX < canvas2.width) {
            buttons.forEach(button => {
                if(button.type=='menu'||button.type=='menuclose')
                button.x+= menuSpeed;
            });
            menuX += menuSpeed;  // 當選單關閉時，將選單向右移動
        }
    }

    // 畫選單背景
    ctx2.fillStyle = "rgba(0, 0, 0, 0.5)";  // 選單背景顏色
    ctx2.fillRect(menuX, menuY, menuWidth, menuHeight);
}

//遊戲邏輯
function updateGame2() {
    // 更新玩家位置
    if (keys.right) {
        playSoundloop();
        pet.x = player.x - 100; 
        player.dx = player.speed;
        direction.right=true;
    }
    if (keys.left) {
        playSoundloop();
        pet.x = player.x + 250; 
        player.dx = -player.speed;
        direction.right=false;
    }
    if (!keys.right && !keys.left) {
        stopSoundloop();
        player.dx = 0;
    }

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
    drawMenu();
    drawemojiMenu();
    drawclothingbox();
    drawpetbox();
    drawarbox();
    drawButton();

    drawJoystick();
    drawDialogBox();
    drawRewardBox();
    drawArrow();

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

//暫停遊戲更新
function stopGame() {
    cancelAnimationFrame(animationFrameId);  // 停止 updateGame
}

//開始遊戲更新
function startGame() {
    updateGame2();  // 开始更新
}

//重製遊戲數據
function resetGame(){
    player.x=50;
    direction.right=true;
    background1X=0;
    background2X=4000;
    clothingImage = [
        { index:0,hasget: true,name:"經典", text: "已穿戴",img:url2+'/major/images/player.png',imageWidth:293,imageHeight:377,weared:true },
        { index:1,hasget: false,name:"海灘", text: "穿戴",img:url2+'/major/images/NPC.png' ,imageWidth:293,imageHeight:377,weared:false},
    ];
    petImages = [
        { index:0,hasget: true,name:"無", text: "",img:'',imageWidth:293,imageHeight:377,weared:false },
        { index:1,hasget: false,name:"寄居蟹", text: "穿戴",img:url2+'/major/images/NPC.png',imageWidth:293,imageHeight:377,weared:false },
    ];
    ARImages = [
        { index:0,hasget: true,name:"無", text: "",img:'',imageWidth:293,imageHeight:377,weared:false },
        { index:1,hasget: false,name:"海灘巧虎", text: "開啟",img:url2+'/major/images/ARicon.png',imageWidth:250,imageHeight:250,weared:false },
    ];
    teach.index=0;
    currentDialogIndex = 0;
    currentRewardIndex = 0;
    currentclothingIndex = 0;  // 當前顯示的圖片索引
    currentpetIndex = 0;  // 當前顯示的圖片索引
    currentARIndex = 0;  // 當前顯示的圖片索引
    pet.wear=false;
    getButtonByName('wearpet').canclick=false;
    getButtonByName('openar').canclick=false;
    stopSoundloop();
}

//繪製玩家
function drawPlayer() {
    ctx2.font = "bold 30px Arial"; // 設定字體大小與類型
    ctx2.fillStyle = "black"; // 設定文字顏色
    ctx2.textAlign = 'center';
    ctx2.textBaseline = 'middle';
    // 繪製角色名稱在角色上方
    ctx2.fillText(player.name, player.x- camera.x + player.width / 2 , player.y - 10);
    if(emojiOpen){
        ctx2.drawImage(emojiImage, player.x - camera.x+50, player.y-200, 200, 200);
    }
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

//繪製NPC
function drawNPC() {
    ctx2.font = "bold 30px Arial"; // 設定字體大小與類型
    ctx2.fillStyle = "white"; // 設定文字顏色
    ctx2.textAlign = 'center';
    ctx2.textBaseline = 'middle';
    ctx2.lineWidth = 5;  // 外框的寬度
    ctx2.strokeStyle = 'black';  // 外框顏色，這裡設置為黑色
    ctx2.strokeText(npc.name, npc.x- camera.x + npc.width / 2, npc.y - 10); // 繪製外框
    ctx2.fillText(npc.name, npc.x- camera.x + npc.width / 2 , npc.y - 10);
    if(teach.index<=4){
        let maxY = npc.y - 150 ;  // 右邊界
        let minY = npc.y - 100 ;  // 中心位置

        // 更新動畫進度
        misson.animationProgress += misson.direction * 0.02; // 控制圖片移動速度
        let currentY = minY + misson.animationProgress * (maxY - minY);
        // 當圖片到達右邊界時，直接跳回中間
        if (misson.animationProgress >= 1) {
            misson.animationProgress = 1; // 保證圖片停在最右邊
            misson.direction = -1; // 改變方向回到中間
        }

        // 當圖片到達中間時，改變方向
        if (misson.animationProgress <= 0) {
            misson.animationProgress = 0; // 保證圖片停在最中間
            misson.direction = 1; // 改變方向
        }
        ctx2.font = "bold 150px Arial"; // 設定字體大小與類型
        ctx2.fillStyle = "yellow"; // 設定文字顏色
        ctx2.strokeText(npcDialog[currentDialogIndex].logo, npc.x- camera.x + npc.width / 2, currentY); // 繪製外框
        ctx2.fillText(npcDialog[currentDialogIndex].logo, npc.x- camera.x + npc.width / 2 , currentY);
    }
    ctx2.drawImage(npcImage, npc.x- camera.x, npc.y, npc.width, npc.height);  // 使用圖片繪製角色
}

//繪製寵物
function drawPet() {
    if(pet.wear){
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
}

//繪製小地圖
function drawMinimap() {
    // 設定小地圖的邊框
    ctx2.lineWidth = 5;   // 邊框寬度
    ctx2.strokeStyle = 'black'; // 邊框顏色
    ctx2.strokeRect(minimapX - 3, minimapY - 3, minimapWidth + 5, minimapHeight + 5);
    //ctx2.drawImage(minimapImage, 0, 0, 4000, 940, minimapX, minimapY, minimapWidth, minimapHeight);
    ctx2.drawImage(background3, 0, 0, 4000, 940, minimapX, minimapY, minimapWidth, minimapHeight);
    ctx2.drawImage(background1, 0, 0, 4000, 940, minimapX, minimapY, minimapWidth, minimapHeight);

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
    if(teach.index<=4){
        let maxY = NPCMinimapY - 70 ;  // 右邊界
        let minY = NPCMinimapY - 50 ;  // 中心位置

        // 更新動畫進度
        misson.minianimationProgress += misson.minidirection * 0.02; // 控制圖片移動速度
        let currentY = minY + misson.minianimationProgress * (maxY - minY);
        // 當圖片到達右邊界時，直接跳回中間
        if (misson.minianimationProgress >= 1) {
            misson.minianimationProgress = 1; // 保證圖片停在最右邊
            misson.minidirection = -1; // 改變方向回到中間
        }

        // 當圖片到達中間時，改變方向
        if (misson.minianimationProgress <= 0) {
            misson.minianimationProgress = 0; // 保證圖片停在最中間
            misson.minidirection = 1; // 改變方向
        }
        ctx2.font = "bold 60px Arial"; // 設定字體大小與類型
        ctx2.fillStyle = "yellow"; // 設定文字顏色
        ctx2.strokeText(npcDialog[currentDialogIndex].logo, minimapX + NPCMinimapX+25, minimapY+50 + currentY); // 繪製外框
        ctx2.fillText(npcDialog[currentDialogIndex].logo, minimapX + NPCMinimapX+25 , minimapY+50 + currentY);
    }
    // 轉換玩家世界座標為小地圖座標
    const playerMinimapX = player.x * minimapScaleX;
    const playerMinimapY = player.y * minimapScaleY;

    // 繪製玩家在小地圖上的位置
    ctx2.beginPath();
    ctx2.arc(minimapX + playerMinimapX+25, minimapY+50 + playerMinimapY, 10, 0, Math.PI * 2);
    ctx2.fillStyle = 'red';
    ctx2.fill();

    ctx2.drawImage(background2, 0, 0, 4000, 940, minimapX, minimapY, minimapWidth, minimapHeight);
}

//服裝介面屬性
const clothingBox = {
    width: 800, // 寬度
    height: 800, // 高度
    padding: 20, // 內邊距
    borderRadius: 15, // 圓角半徑
    bgColor: 'rgba(0, 0, 0, 0.5)', // 背景顏色
    borderColor: 'white', // 邊框顏色
    get imageX() {
        return (this.x+this.width/2-clothingImage[currentclothingIndex].imageWidth/2); // 居中對話框
    },
    get imageY() {
        return (this.y+this.height/2-clothingImage[currentclothingIndex].imageHeight/2); // 居中對話框
    },
    // 直接在這裡設置對話框的位置
    get x() {
        return (canvas2.width - this.width) / 2; // 居中對話框
    },
    get y() {
        return (canvas2.height - this.height)/2; // 使對話框靠近畫布底部
    },
    buttonWidth : 200,
    buttonHeight : 100,
    arrowSize : 30,  // 左右箭頭的大小
    closeButtonSize : 100,  // 關閉按鈕的大小
};

//寵物介面屬性
const petBox = {
    width: 800, // 寬度
    height: 800, // 高度
    padding: 20, // 內邊距
    borderRadius: 15, // 圓角半徑
    bgColor: 'rgba(0, 0, 0, 0.5)', // 背景顏色
    borderColor: 'white', // 邊框顏色
    get imageX() {
        return (this.x+this.width/2-petImages[currentpetIndex].imageWidth/2); // 居中對話框
    },
    get imageY() {
        return (this.y+this.height/2-petImages[currentpetIndex].imageHeight/2); // 居中對話框
    },
    // 直接在這裡設置對話框的位置
    get x() {
        return (canvas2.width - this.width) / 2; // 居中對話框
    },
    get y() {
        return (canvas2.height - this.height)/2; // 使對話框靠近畫布底部
    },
    buttonWidth : 200,
    buttonHeight : 100,
    arrowSize : 30,  // 左右箭頭的大小
    closeButtonSize : 100,  // 關閉按鈕的大小
};

const ARBox = {
    width: 800, // 寬度
    height: 800, // 高度
    padding: 20, // 內邊距
    borderRadius: 15, // 圓角半徑
    bgColor: 'rgba(0, 0, 0, 0.5)', // 背景顏色
    borderColor: 'white', // 邊框顏色
    get imageX() {
        return (this.x+this.width/2-ARImages[currentARIndex].imageWidth/2); // 居中對話框
    },
    get imageY() {
        return (this.y+this.height/2-ARImages[currentARIndex].imageHeight/2); // 居中對話框
    },
    // 直接在這裡設置對話框的位置
    get x() {
        return (canvas2.width - this.width) / 2; // 居中對話框
    },
    get y() {
        return (canvas2.height - this.height)/2; // 使對話框靠近畫布底部
    },
    buttonWidth : 200,
    buttonHeight : 100,
    arrowSize : 30,  // 左右箭頭的大小
    closeButtonSize : 100,  // 關閉按鈕的大小
};


// 按鈕的位置和大小（右下角）
const buttonWidth = 200;
const buttonHeight = 200;
const padding = 50;  // 按鈕距離右下角的邊距
const buttonX = canvas2.width - buttonWidth - padding;
const buttonY = canvas2.height - buttonHeight - padding;
let buttonHovered=false;

//表情符號按鈕屬性
const emojimenuWidth = 250;  // 選單的寬度
const emojimenuHeight = 300;  // 選單的高度與視窗高度一致
let emojimenuOpen = false;  // 用來控制選單是否打開
let emojimenuX=buttonX-100-emojimenuWidth;  // 選單的初始 X 座標，位於畫面右側外部
let emojimenuY=buttonY+150-emojimenuHeight;  // 選單的初始 X 座標，位於畫面右側外部
let emojiOpen=false;
let emojiImage=new Image();

//所有按鈕屬性
let buttons = [
    {draw:true ,type:"",name:"jump",x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight, fontSize: 60, text: "↑" ,buttonClicked : false ,buttonHover:false,canclick:true,sound:'jump'},// 按鈕1
    {draw:false, type:"",name:"dialog",x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight, fontSize: 60, text: "對話" ,buttonClicked : false,buttonHover:false ,canclick:true,sound:'majorclick'},// 按鈕2
    {draw:true, type:"",name:"menu",x: canvas2.width-110, y: 10, width: 100, height: 100, fontSize: 35, text: "選單" ,buttonClicked : false ,buttonHover:false,canclick:true,sound:'dig'},// 按鈕1
    {draw:true, type:"menuclose",name:"close",x: menuX+menuWidth-60, y:menuY+10, width: 50, height: 50, fontSize: 30, text: "X" ,buttonClicked : false ,buttonHover:false,canclick:true,sound:'dig'},// 按鈕1
    {draw:true, type:"menu",name:"ar",x: menuX+menuWidth-280, y: menuY+100, width: 50, height: 50, fontSize: 30, text: "AR" ,buttonClicked : false,buttonHover:false ,img: url2+'/major/images/ar.png',canclick:true,sound:'dig'},// 按鈕2
    {draw:true, type:"menu",name:"status",x: menuX+menuWidth-180, y: menuY+100, width: 50, height: 50, fontSize: 30, text: "狀態" ,buttonClicked : false ,buttonHover:false,img: url2+'/major/images/status.png',canclick:true,sound:'dig'},// 按鈕1
    {draw:true, type:"menu",name:"clothing",x: menuX+menuWidth-80, y: menuY+100, width: 50, height: 50, fontSize: 30, text: "服裝" ,buttonClicked : false ,buttonHover:false,img: url2+'/major/images/clothing.png',canclick:true,sound:'dig'},// 按鈕1
    {draw:true, type:"menu",name:"pet",x: menuX+menuWidth-280, y: menuY+210, width: 50, height: 50, fontSize: 30, text: "寵物" ,buttonClicked : false ,buttonHover:false,img: url2+'/major/images/pet.png',canclick:true,sound:'dig'},// 按鈕1
    {draw:true, type:"menu",name:"hint",x: menuX+menuWidth-180, y: menuY+210, width: 50, height: 50, fontSize: 30, text: "提示" ,buttonClicked : false ,buttonHover:false,img: url2+'/major/images/hint.png',canclick:true,sound:'dig'},// 按鈕1
    {draw:true, type:"menu",name:"shop",x: menuX+menuWidth-80, y: menuY+210, width: 50, height: 50, fontSize: 30, text: "商城" ,buttonClicked : false ,buttonHover:false,img: url2+'/major/images/shop.png',canclick:true,sound:'dig'},// 按鈕1
    {draw:true, type:"menu",name:"history",x: menuX+menuWidth-280, y: menuY+320, width: 50, height: 50, fontSize: 30, text: "歷史" ,buttonClicked : false ,buttonHover:false,img: url2+'/major/images/history.png',canclick:true,sound:'dig'},// 按鈕1
    {draw:true, type:"menu",name:"map",x: menuX+menuWidth-180, y: menuY+320, width: 70, height: 50, fontSize: 30, text: "地圖" ,buttonClicked : false ,buttonHover:false,img: url2+'/major/images/map.png',canclick:true,sound:'dig'},// 按鈕1
    {draw:true, type:"menu",name:"friend",x: menuX+menuWidth-80, y: menuY+320, width: 70, height: 50, fontSize: 30, text: "好友" ,buttonClicked : false ,buttonHover:false,img: url2+'/major/images/friend.png',canclick:true,sound:'dig'},// 按鈕1
    {draw:true, type:"",name:"emoji",x:buttonX-100, y: buttonY+150, width: 100, height: 100, fontSize: 30, text: "" ,buttonClicked : false ,buttonHover:false, img: url2+'/major/images/emoji.png',canclick:true,sound:'dig'},
    {draw:emojimenuOpen, type:"emoji",name:"laugh",x:emojimenuX+10, y: emojimenuY+10, width: 70, height: 70, fontSize: 30, text: "" ,buttonClicked : false ,buttonHover:false, img: url2+'/major/images/emoji.png',canclick:true,sound:'dig'},// 按鈕1
    {draw:emojimenuOpen, type:"emoji",name:"laugh2",x:emojimenuX+90, y: emojimenuY+10, width: 70, height: 70, fontSize: 30, text: "" ,buttonClicked : false ,buttonHover:false, img: url2+'/major/images/emoji.png',canclick:true,sound:'dig'},// 按鈕1
    {draw:emojimenuOpen, type:"emoji",name:"laugh3",x:emojimenuX+170, y: emojimenuY+10, width: 70, height: 70, fontSize: 30, text: "" ,buttonClicked : false ,buttonHover:false, img: url2+'/major/images/emoji.png',canclick:true,sound:'dig'},// 按鈕1
    {draw:emojimenuOpen, type:"emoji",name:"laugh4",x:emojimenuX+10, y: emojimenuY+115, width: 70, height: 70, fontSize: 30, text: "" ,buttonClicked : false ,buttonHover:false, img: url2+'/major/images/emoji.png',canclick:true,sound:'dig'},// 按鈕1
    {draw:emojimenuOpen, type:"emoji",name:"laugh5",x:emojimenuX+90, y: emojimenuY+115, width: 70, height: 70, fontSize: 30, text: "" ,buttonClicked : false ,buttonHover:false, img: url2+'/major/images/emoji.png',canclick:true,sound:'dig'},// 按鈕1
    {draw:emojimenuOpen, type:"emoji",name:"laugh6",x:emojimenuX+170, y: emojimenuY+115, width: 70, height: 70, fontSize: 30, text: "" ,buttonClicked : false ,buttonHover:false, img: url2+'/major/images/emoji.png',canclick:true,sound:'dig'},// 按鈕1
    {draw:emojimenuOpen, type:"emoji",name:"laugh7",x:emojimenuX+10, y: emojimenuY+220, width: 70, height: 70, fontSize: 30, text: "" ,buttonClicked : false ,buttonHover:false, img: url2+'/major/images/emoji.png',canclick:true,sound:'dig'},// 按鈕1
    {draw:emojimenuOpen, type:"emoji",name:"laugh8",x:emojimenuX+90, y: emojimenuY+220, width: 70, height: 70, fontSize: 30, text: "" ,buttonClicked : false ,buttonHover:false, img: url2+'/major/images/emoji.png',canclick:true,sound:'dig'},// 按鈕1
    {draw:emojimenuOpen, type:"emoji",name:"laugh9",x:emojimenuX+170, y: emojimenuY+220, width: 70, height: 70, fontSize: 30, text: "" ,buttonClicked : false ,buttonHover:false, img: url2+'/major/images/emoji.png',canclick:true,sound:'dig'},// 按鈕1
    {draw:showclothingBox, type:"clothing",name:"closeclothing",x:clothingBox.x+clothingBox.width-70, y: clothingBox.y, width: 70, height: 70, fontSize: 50, text: "X" ,buttonClicked : false ,buttonHover:false, img: '',canclick:true,sound:'dig'},// 按鈕1
    {draw:showclothingBox, type:"clothing",name:"clothingright",x:clothingBox.x+clothingBox.width-70, y: clothingBox.y+clothingBox.height/2, width: 70, height: 70, fontSize: 50, text: "▶" ,buttonClicked : false ,buttonHover:false, img: '',canclick:true,sound:'dig'},// 按鈕1
    {draw:showclothingBox, type:"clothing",name:"clothingleft",x:clothingBox.x, y: clothingBox.y+clothingBox.height/2, width: 70, height: 70, fontSize: 50, text: "◀" ,buttonClicked : false ,buttonHover:false, img: '',canclick:true,sound:'dig'},// 按鈕1
    {draw:showclothingBox, type:"clothing",name:"wearclothing",x:clothingBox.x+clothingBox.width/2-100, y: clothingBox.y+clothingBox.height-100, width: 200, height: 100, fontSize: 50, text: "" ,buttonClicked : false ,buttonHover:false, img: '',canclick:false,sound:'dig'},// 按鈕1
    {draw:showpetBox, type:"pet",name:"closepet",x:petBox.x+petBox.width-70, y: petBox.y, width: 70, height: 70, fontSize: 50, text: "X" ,buttonClicked : false ,buttonHover:false, img: '',canclick:true,sound:'dig'},// 按鈕1
    {draw:showpetBox, type:"pet",name:"petright",x:petBox.x+petBox.width-70, y: petBox.y+petBox.height/2, width: 70, height: 70, fontSize: 50, text: "▶" ,buttonClicked : false ,buttonHover:false, img: '',canclick:true,sound:'dig'},// 按鈕1
    {draw:showpetBox, type:"pet",name:"petleft",x:petBox.x, y: petBox.y+petBox.height/2, width: 70, height: 70, fontSize: 50, text: "◀" ,buttonClicked : false ,buttonHover:false, img: '',canclick:true,sound:'dig'},// 按鈕1
    {draw:showpetBox, type:"pet",name:"wearpet",x:petBox.x+petBox.width/2-100, y: petBox.y+petBox.height-100, width: 200, height: 100, fontSize: 50, text: "" ,buttonClicked : false ,buttonHover:false, img: '',canclick:false,sound:'dig'},// 按鈕1
    {draw:showARBox, type:"ar",name:"closear",x:ARBox.x+ARBox.width-70, y: ARBox.y, width: 70, height: 70, fontSize: 50, text: "X" ,buttonClicked : false ,buttonHover:false, img: '',canclick:true,sound:'dig'},// 按鈕1
    {draw:showARBox, type:"ar",name:"arright",x:ARBox.x+ARBox.width-70, y: ARBox.y+ARBox.height/2, width: 70, height: 70, fontSize: 50, text: "▶" ,buttonClicked : false ,buttonHover:false, img: '',canclick:true,sound:'dig'},// 按鈕1
    {draw:showARBox, type:"ar",name:"arleft",x:ARBox.x, y: ARBox.y+ARBox.height/2, width: 70, height: 70, fontSize: 50, text: "◀" ,buttonClicked : false ,buttonHover:false, img: '',canclick:true,sound:'dig'},// 按鈕1
    {draw:showARBox, type:"ar",name:"openar",x:ARBox.x+ARBox.width/2-100, y: ARBox.y+ARBox.height-100, width: 200, height: 100, fontSize: 50, text: "" ,buttonClicked : false ,buttonHover:false, img: '',canclick:false,sound:'dig'},// 按鈕
]

//得到按鈕
function getButtonByName(name) {
    return buttons.find(button => button.name === name);
}

//繪製表情符號介面
function drawemojiMenu() {
    if (emojimenuOpen) {
        // 畫選單背景
        ctx2.fillStyle = "rgba(0, 0, 0, 0.5)";  // 選單背景顏色
        ctx2.fillRect(emojimenuX, emojimenuY, emojimenuWidth, emojimenuHeight);
    }
}

//繪製按鈕
function drawButton() {
    // 繪製按鈕
    buttons.forEach(button => {
        if(button.draw){
            ctx2.fillStyle = "rgba(0, 0, 0, 0.5)";   
            let scaleFactor = button.buttonClicked ? 0.95 : 1;  // 當點擊時稍微放大
            if(button.buttonHover) {
                ctx2.fillStyle = "rgba(0, 0, 0, 0.6)";   
                canvas2.style.cursor = 'pointer';
            }
            else{
                ctx2.fillStyle = "rgba(0, 0, 0, 0.5)";   
                canvas2.style.cursor = 'default';
            }
            
            // 重新繪製圓形按鈕
            if(button.img){
                const image = new Image();
                image.src=button.img;
                ctx2.drawImage(image,button.x,button.y,button.width*scaleFactor, button.height*scaleFactor )
            }
            else if((button.type=='clothing'||button.type=='pet'||button.type=='ar')&&button.canclick){
                ctx2.fillStyle = button.buttonClicked?'#006394':button.buttonHover?'#0085c7':'#00aaff';
                ctx2.fillRect(button.x, button.y, button.width, button.height);
            }
            else if(button.type!="clothing"&&button.type!="pet"&&button.type!="ar"){
                ctx2.beginPath();
                ctx2.arc(button.x + button.width / 2, button.y + button.height / 2, button.width / 2 * scaleFactor, 0, Math.PI * 2);
                ctx2.fill();
                ctx2.lineWidth = 2;
                ctx2.strokeStyle = 'black';
                ctx2.stroke();
            }



            if(button.type=='menu'){
                ctx2.fillStyle = "white";
                ctx2.font = `${button.fontSize}px Arial`;
                ctx2.textAlign = "center";
                ctx2.textBaseline = "middle";
                ctx2.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2+button.height);
            }
            else{
                ctx2.fillStyle = "white";
                ctx2.font = `${button.fontSize}px Arial`;
                ctx2.textAlign = "center";
                ctx2.textBaseline = "middle";
                ctx2.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);
            }

            if(button.name=='jump'&&teach.index==1){
                updateImageScale();
                ctx2.drawImage(
                    teachImage, 
                    button.x+button.width / 2,  // 图像 X 轴位置：右下角
                    button.y+button.height / 2,  // 图像 Y 轴位置：右下角
                    teach.width * teach.teachscale,  // 图像的缩放宽度
                    teach.height * teach.teachscale  // 图像的缩放高度
                );
            }
            else if(button.name=='dialog'&&teach.index==3){
                updateImageScale();
                ctx2.drawImage(
                    teachImage, 
                    button.x+button.width / 2,  // 图像 X 轴位置：右下角
                    button.y+button.height / 2,  // 图像 Y 轴位置：右下角
                    teach.width * teach.teachscale,  // 图像的缩放宽度
                    teach.height * teach.teachscale  // 图像的缩放高度
                );
            }
            else if(button.name=='menu'&&(teach.index==6||teach.index==11||teach.index==15)){
                updateImageScale();
                ctx2.drawImage(
                    teachImage, 
                    button.x+button.width / 2,  // 图像 X 轴位置：右下角
                    button.y+button.height / 2,  // 图像 Y 轴位置：右下角
                    teach.width/2 * teach.teachscale,  // 图像的缩放宽度
                    teach.height/2 * teach.teachscale  // 图像的缩放高度
                );
            }
            else if(button.name=='clothing'&&teach.index==7){
                updateImageScale();
                ctx2.drawImage(
                    teachImage, 
                    button.x+button.width / 2,  // 图像 X 轴位置：右下角
                    button.y+button.height / 2,  // 图像 Y 轴位置：右下角
                    teach.width/2 * teach.teachscale,  // 图像的缩放宽度
                    teach.height/2 * teach.teachscale  // 图像的缩放高度
                );
            }
            else if(button.name=='clothingright'&&teach.index==8){
                updateImageScale();
                ctx2.drawImage(
                    teachImage, 
                    button.x+button.width / 2,  // 图像 X 轴位置：右下角
                    button.y+button.height / 2,  // 图像 Y 轴位置：右下角
                    teach.width/2 * teach.teachscale,  // 图像的缩放宽度
                    teach.height/2 * teach.teachscale  // 图像的缩放高度
                );
            }
            else if(button.name=='wearclothing'&&teach.index==9){
                updateImageScale();
                ctx2.drawImage(
                    teachImage, 
                    button.x+button.width / 2,  // 图像 X 轴位置：右下角
                    button.y+button.height / 2,  // 图像 Y 轴位置：右下角
                    teach.width/2 * teach.teachscale,  // 图像的缩放宽度
                    teach.height/2 * teach.teachscale  // 图像的缩放高度
                );
            }
            else if(button.name=='closeclothing'&&teach.index==10){
                updateImageScale();
                ctx2.drawImage(
                    teachImage, 
                    button.x+button.width / 2,  // 图像 X 轴位置：右下角
                    button.y+button.height / 2,  // 图像 Y 轴位置：右下角
                    teach.width/2 * teach.teachscale,  // 图像的缩放宽度
                    teach.height/2 * teach.teachscale  // 图像的缩放高度
                );
            }
            else if(button.name=='pet'&&teach.index==12){
                updateImageScale();
                ctx2.drawImage(
                    teachImage, 
                    button.x+button.width / 2,  // 图像 X 轴位置：右下角
                    button.y+button.height / 2,  // 图像 Y 轴位置：右下角
                    teach.width/2 * teach.teachscale,  // 图像的缩放宽度
                    teach.height/2 * teach.teachscale  // 图像的缩放高度
                );
            }
            else if(button.name=='wearpet'&&teach.index==13){
                updateImageScale();
                ctx2.drawImage(
                    teachImage, 
                    button.x+button.width / 2,  // 图像 X 轴位置：右下角
                    button.y+button.height / 2,  // 图像 Y 轴位置：右下角
                    teach.width/2 * teach.teachscale,  // 图像的缩放宽度
                    teach.height/2 * teach.teachscale  // 图像的缩放高度
                );
            }
            else if(button.name=='closepet'&&teach.index==14){
                updateImageScale();
                ctx2.drawImage(
                    teachImage, 
                    button.x+button.width / 2,  // 图像 X 轴位置：右下角
                    button.y+button.height / 2,  // 图像 Y 轴位置：右下角
                    teach.width/2 * teach.teachscale,  // 图像的缩放宽度
                    teach.height/2 * teach.teachscale  // 图像的缩放高度
                );
            }
            else if(button.name=='ar'&&teach.index==16){
                updateImageScale();
                ctx2.drawImage(
                    teachImage, 
                    button.x+button.width / 2,  // 图像 X 轴位置：右下角
                    button.y+button.height / 2,  // 图像 Y 轴位置：右下角
                    teach.width/2 * teach.teachscale,  // 图像的缩放宽度
                    teach.height/2 * teach.teachscale  // 图像的缩放高度
                );
            }
            else if(button.name=='openar'&&teach.index==17){
                updateImageScale();
                ctx2.drawImage(
                    teachImage, 
                    button.x+button.width / 2,  // 图像 X 轴位置：右下角
                    button.y+button.height / 2,  // 图像 Y 轴位置：右下角
                    teach.width/2 * teach.teachscale,  // 图像的缩放宽度
                    teach.height/2 * teach.teachscale  // 图像的缩放高度
                );
            }
            else if(button.name=='closear'&&teach.index==18){
                updateImageScale();
                ctx2.drawImage(
                    teachImage, 
                    button.x+button.width / 2,  // 图像 X 轴位置：右下角
                    button.y+button.height / 2,  // 图像 Y 轴位置：右下角
                    teach.width/2 * teach.teachscale,  // 图像的缩放宽度
                    teach.height/2 * teach.teachscale  // 图像的缩放高度
                );
            }

            else if(button.name=='emoji'&&teach.index==19){
                updateImageScale();
                ctx2.drawImage(
                    teachImage, 
                    button.x+button.width / 2,  // 图像 X 轴位置：右下角
                    button.y+button.height / 2,  // 图像 Y 轴位置：右下角
                    teach.width/2 * teach.teachscale,  // 图像的缩放宽度
                    teach.height/2 * teach.teachscale  // 图像的缩放高度
                );
            }
            else if(button.name=='laugh'&&teach.index==20){
                updateImageScale();
                ctx2.drawImage(
                    teachImage, 
                    button.x+button.width / 2,  // 图像 X 轴位置：右下角
                    button.y+button.height / 2,  // 图像 Y 轴位置：右下角
                    teach.width/2 * teach.teachscale,  // 图像的缩放宽度
                    teach.height/2 * teach.teachscale  // 图像的缩放高度
                );
            }
        }
    });   
}

//偵測玩家和NPC是否重疊
function collisiondetect(){
    // 檢查角色是否接近NPC
  const npcDist = Math.sqrt((player.x - npc.x) ** 2 + (player.y - npc.y) ** 2);
  const isNearNPC = npcDist < 200; // 假設接近範圍為200px
  
  if (isNearNPC) {
    // 顯示對話按鈕，隱藏跳躍按鈕
    if(teach.index==2)teach.index++;
    getButtonByName("jump").draw=false;
    getButtonByName("dialog").draw=true;
  } else {
    // 顯示跳躍按鈕，隱藏對話按鈕
    getButtonByName("jump").draw=true;
    getButtonByName("dialog").draw=false;
  }
}

// 監聽鼠標移動事件 (適用於桌面端)
canvas2.addEventListener('mousemove', function(event) {
    if(!isMobileDevice())
    handleMouseEvent(event,false);
});

// 監聽點擊事件 (適用於桌面端)
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
        isClickInReward(mouseX, mouseY);
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
        isClickInReward(touchX, touchY);

    });
    event.preventDefault(); // 防止觸摸移動時頁面滾動
}

// 檢查是否點擊按鈕
function checkButtonClick(x, y, ismouse) {
    buttons.forEach(button => {
        if(button.draw&&button.canclick&&!isplayvideo){
            let centerX = button.x + button.width / 2;
            let centerY = button.y + button.height / 2;
            let radius = button.width / 2;

            let distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

            if (distance <= radius) {
                console.log("按鈕" + button.name);
                if(!ismouse) button.buttonHover=false;
                playSound(button.sound);
                button.buttonClicked = true;  // 設置被點擊的按鈕狀態
                setTimeout(() => {
                    button.buttonClicked = false;  // 延遲後恢復按鈕原狀
                    switch(button.name){
                        case "menu":{
                            buttonHovered=false;
                            if(teach.index==6||teach.index==11||teach.index==15){
                                teach.index++;
                                toggleMenu();
                            }
                            break;
                        }
                        case "close":{
                            if(teach.index>=20){
                                toggleMenu();
                            }
                            break;
                        }
                        case "emoji":{
                            if(teach.index==19){
                                teach.index++;
                                toggleemojiMenu();
                            }
                            break;
                        }
                        case "clothing":{
                            buttonHovered=false;
                            if(teach.index==7){
                                teach.index++;
                                toggleMenu();
                                toggleclothing(true);
                                togglepet(false);
                                togglear(false);
                            }
                            break;
                        }    
                        case "closeclothing":{
                            buttonHovered=false;
                            if(teach.index==10){
                                teach.index++;
                                toggleclothing(false);
                            }
                            break;
                        }  
                        case "clothingright":{
                            if(teach.index==8){
                                teach.index++;
                                changeclothing('right');
                            }
                            break;
                        }   
                        case "clothingleft":{
                            if(teach.index>=20){
                                changeclothing('left');
                            }
                            break;
                        }    
                        case "wearclothing":{
    
                            if(teach.index==9){
                                teach.index++;
                                wearclothing();
                            }
                            break;
                        }   
                        case "pet":{
                            buttonHovered=false;
                            if(teach.index==12){
                                teach.index++;
                                toggleMenu();
                                togglepet(true);
                                toggleclothing(false);
                                togglear(false);
                            }
                            break;
                        }    
                        case "closepet":{
                            buttonHovered=false;
                            if(teach.index==14){
                                teach.index++;
                                togglepet(false);
                            }
                            break;
                        }  
                        case "petright":{
                            changepet('right');
                            break;
                        }   
                        case "petleft":{
                            changepet('left');
                            break;
                        }    
                        case "wearpet":{
                            if(teach.index==13){
                                teach.index++;
                                if(getButtonByName('wearpet').text=='穿戴'){
                                    wearpet(true);
                                }
                                else{
                                    wearpet(false);
                                }
                            }
                            break;
                        }  
                        case "ar":{
                            buttonHovered=false;
                            if(teach.index==16){
                                teach.index++;
                                toggleMenu();
                                togglear(true);
                                togglepet(false);
                                toggleclothing(false);
                            }
                            break;
                        }    
                        case "closear":{
                            buttonHovered=false;
                            if(teach.index==18){
                                teach.index++;
                                togglear(false);
                            }
                            break;
                        }  
                        case "arright":{
                            changear('right');
                            break;
                        }   
                        case "arleft":{
                            changear('left');
                            break;
                        }    
                        case "openar":{
                            if(teach.index==17){
                                teach.index++;
                            if(getButtonByName('openar').text=='開啟'){
                                openar();
                            }
                        }
                            break;
                        }              
                    }
                    if(button.type=='emoji'){
                        buttonHovered=false;
                        if(teach.index==20)teach.index++;
                        toggleemojiMenu();
                        if(emojiOpen==false){
                            setTimeout(() => {
                                emojiOpen= false;  // 延遲後恢復按鈕原狀
                            }, 1000);
                            if(teach.index==21){
                                setTimeout(() => {
                                    loadlogin();
                                    resetGame();
                                }, 2000);
                            }
                            emojiOpen=true;
                            emojiImage.src=button.img;
                        }
                    }

                }, 200);
                switch(button.name){
                    case "jump":{
                        if(teach.index==1){
                            setTimeout(() => {
                                teach.index++;
                                teach.canmove=true;
                            }, 1000);     
                        }
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
                        if(teach.index==3){
                            teach.index++;
                            if(currentDialogIndex!=0){
                                nextDialog();
                            }
                            else{
                                showDialog=!showDialog;
                                if(showDialog==false)currentDialogIndex=0;
                                break;
                            }
                        }
                    }
                }
            }
        }
    });
}

// 檢查是否覆蓋按鈕
function checkButtonHover(x, y) {
    buttonHovered=false;
    buttons.forEach(button => {
        if(button.draw&&button.canclick&&!isplayvideo){
            let centerX = button.x + button.width / 2;
            let centerY = button.y + button.height / 2;
            let radius = button.width / 2;

            let distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

            button.buttonHover = distance <= radius;
                
            if ( button.buttonHover) {
                buttonHovered=true;
                //console.log("hover"+button.name)  // 只要有一個按鈕被 hover，就設置 isHovering 為 true
            }
        }
    });
    
}

//NPC對話框介面屬性
const dialogBox = {
    width: 800, // 寬度
    height: 200, // 高度
    padding: 20, // 內邊距
    borderRadius: 15, // 圓角半徑
    bgColor: 'rgba(0, 0, 0, 0.5)', // 背景顏色
    borderColor: 'white', // 邊框顏色
    imageWidth:293,
    imageHeight:377,
    get imageX() {
        return (this.x-this.imageWidth); // 居中對話框
    },
    get imageY() {
        return (this.y-100); // 居中對話框
    },
    // 直接在這裡設置對話框的位置
    get x() {
        return (canvas2.width - this.width) / 2; // 居中對話框
    },
    get y() {
        return canvas2.height - this.height - 30; // 使對話框靠近畫布底部
    },
    arrowYOffset:0,
    arrowDirection: 1,
    arrowSpeed: 0.005
};

//繪製NPC對話框
function drawDialogBox() {
    if (showDialog) {
        //ctx2.scale(-1, 1); // 水平翻轉
        ctx2.drawImage(npcImage, dialogBox.imageX, dialogBox.imageY, dialogBox.imageWidth, dialogBox.imageHeight);
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
        ctx2.font = '40px Arial';
        let textX = dialogBox.x + dialogBox.padding;
        let textY = dialogBox.y + dialogBox.padding + 50;

        // 分割對話文本成多行，避免超出對話框範圍
        const maxLineWidth = dialogBox.width - 2 * dialogBox.padding;
        const lines = wrapText(npcDialog[currentDialogIndex].text, maxLineWidth);

        const arrowSize = 20;  // 箭頭的大小
        const arrowX = dialogBox.x + dialogBox.width - arrowSize - dialogBox.padding;
        const arrowY = dialogBox.y + dialogBox.height - arrowSize - dialogBox.padding+dialogBox.arrowYOffset;

        dialogBox.arrowYOffset = Math.sin(Date.now() * dialogBox.arrowSpeed) * 5; // 10 為擺動的範圍（最大偏移量）

        ctx2.fillStyle = dialogBox.borderColor;
        ctx2.beginPath();
        ctx2.moveTo(arrowX, arrowY); // 箭頭的起點
        ctx2.lineTo(arrowX + arrowSize, arrowY); // 箭頭的底邊
        ctx2.lineTo(arrowX + arrowSize / 2, arrowY + arrowSize); // 箭頭的頂點
        ctx2.closePath();
        ctx2.fill(); // 填充箭頭顏色
        if(teach.index==4){
            updateImageScale();
            ctx2.drawImage(
                teachImage, 
                dialogBox.x+dialogBox.width-teach.width/2,  // 图像 X 轴位置：右下角
                dialogBox.y+dialogBox.height-teach.height/2,  // 图像 Y 轴位置：右下角
                teach.width/2 * teach.teachscale,  // 图像的缩放宽度
                teach.height/2 * teach.teachscale  // 图像的缩放高度
            );
        }
        lines.forEach((line, index) => {
            ctx2.fillText(line, textX, textY + (index * 45)); // 顯示每行文本
        });
    }
}

//獎勵對話框屬性
const rewardBox = {
    width: 800, // 寬度
    height: 400, // 高度
    padding: 20, // 內邊距
    borderRadius: 15, // 圓角半徑
    bgColor: 'rgba(0, 0, 0, 0.5)', // 背景顏色
    borderColor: 'white', // 邊框顏色
    get imageX() {
        return (this.x+this.width/2-rewardDialog[currentRewardIndex].imageWidth/2); // 居中對話框
    },
    get imageY() {
        return (this.y+this.height/1.7-rewardDialog[currentRewardIndex].imageHeight/2); // 居中對話框
    },
    // 直接在這裡設置對話框的位置
    get x() {
        return (canvas2.width - this.width) / 2; // 居中對話框
    },
    get y() {
        return (canvas2.height - this.height)/2; // 使對話框靠近畫布底部
    },
    arrowYOffset:0,
    arrowDirection: 1,
    arrowSpeed: 0.005
};

//繪製獎勵對話框
function drawRewardBox() {
    
    if (showReward) {
        const rewardimage=new Image();
        rewardimage.src=rewardDialog[currentRewardIndex].img;
        //ctx2.scale(-1, 1); // 水平翻轉
        
        // 畫背景（圓角矩形）
        ctx2.fillStyle = rewardBox.bgColor;
        ctx2.beginPath();
        ctx2.moveTo(rewardBox.x + rewardBox.borderRadius, rewardBox.y);
        ctx2.arcTo(rewardBox.x + rewardBox.width, rewardBox.y, rewardBox.x + rewardBox.width, rewardBox.y + rewardBox.height, rewardBox.borderRadius);
        ctx2.arcTo(rewardBox.x + rewardBox.width, rewardBox.y + rewardBox.height, rewardBox.x, rewardBox.y + rewardBox.height, rewardBox.borderRadius);
        ctx2.arcTo(rewardBox.x, rewardBox.y + rewardBox.height, rewardBox.x, rewardBox.y, rewardBox.borderRadius);
        ctx2.arcTo(rewardBox.x, rewardBox.y, rewardBox.x + rewardBox.width, rewardBox.y, rewardBox.borderRadius);
        ctx2.fill();

        ctx2.drawImage(rewardimage, rewardBox.imageX, rewardBox.imageY, rewardDialog[currentRewardIndex].imageWidth, rewardDialog[currentRewardIndex].imageHeight);
        // 畫邊框
        ctx2.strokeStyle = rewardBox.borderColor;
        ctx2.lineWidth = 2;
        ctx2.stroke();

        // 設置字體和顏色
        ctx2.fillStyle = 'white';
        ctx2.textAlign = 'center';
        ctx2.textBaseline = 'middle';

        // 顯示 NPC 名字
        //ctx2.font = 'bold 30px Arial';
        //ctx2.fillText(rewardDialog[currentRewardIndex].name + ":", rewardBox.x + rewardBox.padding, rewardBox.y + rewardBox.padding);

        // 顯示對話文本
        ctx2.font = 'bold 50px Arial';
        let textX = rewardBox.x+rewardBox.width/2 ;
        let textY = rewardBox.y + rewardBox.padding + 40;

        // 分割對話文本成多行，避免超出對話框範圍
        const maxLineWidth = rewardBox.width - 2 * rewardBox.padding;
        const lines = wrapText(rewardDialog[currentRewardIndex].text, maxLineWidth);

        const arrowSize = 20;  // 箭頭的大小
        const arrowX = rewardBox.x + rewardBox.width - arrowSize - rewardBox.padding;
        const arrowY = rewardBox.y + rewardBox.height - arrowSize - rewardBox.padding+rewardBox.arrowYOffset;

        rewardBox.arrowYOffset = Math.sin(Date.now() * rewardBox.arrowSpeed) * 5; // 10 為擺動的範圍（最大偏移量）

        ctx2.fillStyle = rewardBox.borderColor;
        ctx2.beginPath();
        ctx2.moveTo(arrowX, arrowY); // 箭頭的起點
        ctx2.lineTo(arrowX + arrowSize, arrowY); // 箭頭的底邊
        ctx2.lineTo(arrowX + arrowSize / 2, arrowY + arrowSize); // 箭頭的頂點
        ctx2.closePath();
        ctx2.fill(); // 填充箭頭顏色

        if(teach.index==5){
            updateImageScale();
            ctx2.drawImage(
                teachImage, 
                rewardBox.x+rewardBox.width-teach.width/2,  // 图像 X 轴位置：右下角
                rewardBox.y+rewardBox.height-teach.height/2,  // 图像 Y 轴位置：右下角
                teach.width/2 * teach.teachscale,  // 图像的缩放宽度
                teach.height/2 * teach.teachscale  // 图像的缩放高度
            );
        }

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
    
    if (currentDialogIndex == 0) {
        stopBGM(majorbgm);
        video.play();
        isplayvideo=true;
        //createYouTube();
        setTimeout(()=>{
            currentDialogIndex++;
        },1000)
    }
    if (currentDialogIndex >= npcDialog.length-1) {
        if(teach.index==4)teach.index++;
        showDialog = false; // 對話結束後隱藏對話框
        currentDialogIndex=0;
        if(currentRewardIndex==0){
            showReward=true;
        }
    }
    
}

// 顯示下一行對話
function nextReward() {
    currentRewardIndex++;
    if (currentRewardIndex >= rewardDialog.length) {
        if(teach.index==5)teach.index++;
        showReward = false; // 對話結束後隱藏對話框
        clothingImage[clothingImage.findIndex(item => item.name === '海灘')].hasget=true;
        petImages.splice(0, 1);
        petImages[petImages.findIndex(item => item.name === '寄居蟹')].hasget=true;
        ARImages.splice(0, 1);
        ARImages[ARImages.findIndex(item => item.name === '海灘巧虎')].hasget=true;
        getButtonByName('wearpet').canclick=true;
        getButtonByName('openar').canclick=true;
    }
}

//繪製服裝介面
function drawclothingbox() {
    if (!showclothingBox) return;

    // 畫背景矩形
    ctx2.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx2.fillRect(clothingBox.x, clothingBox.y, clothingBox.width, clothingBox.height);
    ctx2.fillStyle = "orange";
    ctx2.font = `bold 80px Arial`;
    ctx2.textAlign = "center";
    ctx2.textBaseline = "middle";
    ctx2.fillText('服裝', clothingBox.x + clothingBox.width / 2, clothingBox.y+80);
    ctx2.fillStyle = "white";
    ctx2.fillText(clothingImage[currentclothingIndex].name, clothingBox.x + clothingBox.width / 2, clothingBox.y+clothingBox.height-150);

    // 畫圖片
    const image = new Image();
    image.src=clothingImage[currentclothingIndex].img;
    ctx2.drawImage(image, clothingBox.imageX, clothingBox.imageY, clothingImage[currentclothingIndex].imageWidth, clothingImage[currentclothingIndex].imageHeight);
    

}

//繪製寵物介面
function drawpetbox() {
    if (!showpetBox) return;

    // 畫背景矩形
    ctx2.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx2.fillRect(petBox.x, petBox.y, petBox.width, petBox.height);
    ctx2.fillStyle = "orange";
    ctx2.font = `bold 80px Arial`;
    ctx2.textAlign = "center";
    ctx2.textBaseline = "middle";
    ctx2.fillText('寵物', petBox.x + petBox.width / 2, petBox.y+80);
    ctx2.fillStyle = "white";
    ctx2.fillText(petImages[currentpetIndex].name, petBox.x + petBox.width / 2, petBox.y+petBox.height-150);

    // 畫圖片
    const image = new Image();
    image.src=petImages[currentpetIndex].img;
    ctx2.drawImage(image, petBox.imageX, petBox.imageY, petImages[currentpetIndex].imageWidth, petImages[currentpetIndex].imageHeight);
    

}

function drawarbox() {
    if (!showARBox) return;

    // 畫背景矩形
    ctx2.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx2.fillRect(ARBox.x, ARBox.y, ARBox.width, ARBox.height);
    ctx2.fillStyle = "orange";
    ctx2.font = `bold 80px Arial`;
    ctx2.textAlign = "center";
    ctx2.textBaseline = "middle";
    ctx2.fillText('AR', ARBox.x + ARBox.width / 2, ARBox.y+80);
    ctx2.fillStyle = "white";
    ctx2.fillText(ARImages[currentARIndex].name, ARBox.x + ARBox.width / 2, ARBox.y+ARBox.height-150);
    ctx2.font = `30px Arial`;
    ctx2.fillText('建議使用手機或平板電腦開啟', ARBox.x + ARBox.width / 2, ARBox.y+150);
    ctx2.fillText('獲得完整的AR體驗', ARBox.x + ARBox.width / 2, ARBox.y+180);
    // 畫圖片
    const image = new Image();
    image.src=ARImages[currentARIndex].img;
    ctx2.drawImage(image, ARBox.imageX, ARBox.imageY, ARImages[currentARIndex].imageWidth, ARImages[currentARIndex].imageHeight);
    

}

//是否點擊NPC對話框
function isClickInDialog(x, y) {
    if(x >= dialogBox.x && x <= dialogBox.x + dialogBox.width &&
        y >= dialogBox.y && y <= dialogBox.y + dialogBox.height){
        if(showDialog&&!isplayvideo){
            playSound('dig');
            nextDialog(); 
        }

    }
}

//是否點擊獎勵對話框
function isClickInReward(x, y) {
    if(x >= rewardBox.x && x <= rewardBox.x + rewardBox.width &&
        y >= rewardBox.y && y <= rewardBox.y + rewardBox.height){
        if(showReward){
            playSound('dig');
            nextReward(); 
        }

    }
}

//繪製指示箭頭
function drawArrow(){
    if(teach.index==2){
        const teacharrowX=canvas2.width/1.3;
        const teacharrowY=canvas2.height/4;
        let maxX = teacharrowX +100 - teachImage.width / 2;  // 右邊界
        let minX = teacharrowX - teachImage.width / 2;  // 中心位置

        // 更新動畫進度
        teach.animationProgress += teach.teachdirection * 0.02; // 控制圖片移動速度
        let currentX = minX + teach.animationProgress * (maxX - minX);
        // 當圖片到達右邊界時，直接跳回中間
        if (teach.animationProgress >= 1) {
            teach.animationProgress = 0; // 保證圖片停在最右邊
            currentX=minX;
            //teachdirection = -1; // 改變方向回到中間
        }

        // 當圖片到達中間時，改變方向
        if (teach.animationProgress <= 0) {
            //animationProgress = 0; // 保證圖片停在最中間
        }

        // 計算圖片的 X 坐標


        // 繪製圖片
        ctx2.drawImage(teacharrowImage, currentX, teacharrowY - teach.height/4,teach.width*4,teach.height*4);
    }
}

//開關選單
function toggleMenu() {
    getButtonByName('menu').draw=menuOpen;
    menuOpen = !menuOpen;  // 切換選單開關狀態
}

//開關表情符號介面
function toggleemojiMenu() {
    
    emojimenuOpen = !emojimenuOpen;  // 切換選單開關狀態
    buttons.forEach(button => {
        if(button.type=='emoji')
        button.draw= emojimenuOpen;
    });
}

//開關服裝介面
function toggleclothing(isopen) {
    if(isopen){
        getButtonByName('wearclothing').text=clothingImage[currentclothingIndex].text;
        getButtonByName('wearclothing').canclick=!clothingImage[currentclothingIndex].weared;
    }
    else{
        buttonHovered=false;
    }
    showclothingBox = isopen;
    buttons.forEach(button => {
        if(button.type=='clothing')
        button.draw= showclothingBox;
    });
    
}

//開關寵物介面
function togglepet(isopen) {
    if(isopen){
        getButtonByName('wearpet').text=petImages[currentpetIndex].text;

    }
    else{
        buttonHovered=false;
    }
    showpetBox = isopen;
    buttons.forEach(button => {
        if(button.type=='pet')
        button.draw= showpetBox;
    });
    
}

function togglear(isopen) {
    if(isopen){
        getButtonByName('openar').text=ARImages[currentARIndex].text;

    }
    else{
        buttonHovered=false;
    }
    showARBox = isopen;
    buttons.forEach(button => {
        if(button.type=='ar')
        button.draw= showARBox;
    });
    
}

//更換服裝
function changeclothing(direction) {
    let length=0;
    clothingImage.forEach(clothing=>{
        if(clothing.hasget){
            length++; 
        }
    })
    if (direction === 'left') {
        currentclothingIndex = (currentclothingIndex - 1 + length) % length;
        getButtonByName('wearclothing').text=clothingImage[currentclothingIndex].text;
        getButtonByName('wearclothing').canclick=!clothingImage[currentclothingIndex].weared;
    } else if (direction === 'right') {
        currentclothingIndex = (currentclothingIndex + 1) % length;
        getButtonByName('wearclothing').text=clothingImage[currentclothingIndex].text;
        getButtonByName('wearclothing').canclick=!clothingImage[currentclothingIndex].weared;
    }
}

//更換寵物
function changepet(direction) {
    let length=0;
    petImages.forEach(pet=>{
        if(pet.hasget){
            length++; 
        }
    })
    if (direction === 'left') {
        currentpetIndex = (currentpetIndex - 1 + length) % length;
        getButtonByName('wearpet').text=petImages[currentpetIndex].text;
    } else if (direction === 'right') {
        currentpetIndex = (currentpetIndex + 1) % length;
        getButtonByName('wearpet').text=petImages[currentpetIndex].text;
    }
}

function changear(direction) {
    let length=0;
    ARImages.forEach(ar=>{
        if(ar.hasget){
            length++; 
        }
    })
    if (direction === 'left') {
        currentARIndex = (currentARIndex - 1 + length) % length;
        getButtonByName('openar').text=ARImages[currentARIndex].text;
    } else if (direction === 'right') {
        currentARIndex = (currentARIndex + 1) % length;
        getButtonByName('openar').text=ARImages[currentARIndex].text;
    }
}

//穿戴服裝
function wearclothing() {
    clothingImage.forEach(clothing=>{
        clothing.text='穿戴';
        clothing.weared=false;
    })
    clothingImage[currentclothingIndex].text='已穿戴';
    clothingImage[currentclothingIndex].weared=true;
    getButtonByName('wearclothing').text=clothingImage[currentclothingIndex].text;
    getButtonByName('wearclothing').canclick=!clothingImage[currentclothingIndex].weared;
    buttonHovered=false;
    playerImage.src=clothingImage[currentclothingIndex].img;
    console.log('穿戴了這個物品:', clothingImage[currentclothingIndex]);
}

//穿戴寵物
function wearpet(iswear) {
    pet.wear=false;
    petImages.forEach(pet=>{
        pet.text='穿戴';
        pet.weared=false;
    })
    getButtonByName('wearpet').text=petImages[currentpetIndex].text;
    if(iswear){
        pet.wear=true;
        petImages[currentpetIndex].text='卸下';
        petImages[currentpetIndex].weared=true;
        getButtonByName('wearpet').text=petImages[currentpetIndex].text;
        petImage.src=petImages[currentpetIndex].img;
        console.log('穿戴了這個物品:', petImages[currentpetIndex]);
    }
}

function openar() {

    loadAR();
    console.log('開啟了這個AR:', ARImages[currentARIndex]);
    
}

//鍵盤移動
document.addEventListener('keydown', (e) => {
    //console.log(e.key);
    if(!isplayvideo){
        if (e.key === 'ArrowRight'||e.key === 'd'||e.key === 'ArrowLeft'||e.key === 'a'){
            if(teach.canmove){
                if(teach.index==0){
                    setTimeout(() => {
                        teach.canmove=false;
                        keys.right=false;
                        keys.left=false
                        if(teach.index==0)
                        teach.index++;
                    }, 1000);
                }
                if (e.key === 'ArrowRight'||e.key === 'd') keys.right = true;
                if (e.key === 'ArrowLeft'||e.key === 'a') keys.left = true;
            }
        }
        if (e.key === 'ArrowUp'||e.key === 'w') {
            if(teach.index==1){
                setTimeout(() => {
                    teach.index++;
                    teach.canmove=true;
                }, 1000);         
            }
            keys.up = true;
        }
    }
});
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight'||e.key === 'd') keys.right = false;
    if (e.key === 'ArrowLeft'||e.key === 'a') keys.left = false;
    if (e.key === 'ArrowUp'||e.key === 'w') keys.up = false;
});

function drawVideo() {
    if (!video.paused && !video.ended) {
        ctx2.drawImage(video, 0, 0, canvas2.width, canvas2.height); // 将视频帧绘制到canvas上
        requestAnimationFrame(drawVideo); // 下一帧继续绘制
    }
    else if (video.ended&&isplayvideo) {
        loadGame1();
        video.currentTime = 0; // 将视频时间设置为 0，即回到开始位置
        isplayvideo=false;
    }
    
}

video.addEventListener('play', function () {
    drawVideo();
});

let YTplayer=null;

function createYouTube() {
    YTplayer = new YT.Player('gameCanvas2', {
      height: '940',
      width: '2000',
      videoId: 'SKOiEpSM8-Q', // 这里是视频的 ID
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
}


  // 当播放器准备好时调用
function onPlayerReady(event) {
  
    event.target.playVideo(); // 播放视频
}

  // 监听播放器状态变化
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        console.log("开始播放");
        startTracking();  // 开始跟踪视频播放
    }
    else if (event.data === YT.PlayerState.PAUSED) {
        console.log("暂停");
        stopTracking();
    }
    else if (event.data === YT.PlayerState.ENDED) {
        console.log("播放完毕！");
        stopTracking();
        closePlayer();  // 关闭播放器或其他操作
    }
}


function closePlayer() {
    // 通过调用 stopVideo 来停止视频播放
    // 你可以选择隐藏播放器，或者做其他操作
    stopTracking();
    if(YTplayer!=null){
    YTplayer.destroy();
    loadGame1();
    }
}

function getYTCurrentTime() {
    let currentTime=0;
    if(YTplayer!=null){
    currentTime = YTplayer.getCurrentTime();
    console.log('当前播放时间: ' + currentTime + ' 秒');
    }
    return currentTime;
}

let trackingInterval;

function startTracking() {
    // 每2000毫秒（2秒）检查一次当前播放时间
    trackingInterval = setInterval(function() {
        if(getYTCurrentTime()>=70){
            closePlayer();
        }
    }, 100);
}

function stopTracking() {
    if (trackingInterval) {
      clearInterval(trackingInterval);  // 停止定时器
      console.log("停止进度跟踪");
    }
}


// 開始遊戲
//updateGame2();

