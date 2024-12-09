const url5="https://eason112.github.io/tiger"
const canvas = document.getElementById("gameCanvas1");
const ctx = canvas.getContext("2d");
canvas.width = 2000;
canvas.height = 940;
let lastFrameTime = 0;
let backgroundSwitchInterval = 500; // 每500毫秒切换一次背景
let currentBackgroundIndex = 0;
// 當前遊戲狀態
let gameState = "gameInfo"; // 可選 "gameInfo", "difficulty", "gameStart", "playing", "gameOver"

const backgroundImages = [
    url5+'/littlegame/new/images/image1.png',
    url5+'/littlegame/new/images/image2.png',
    url5+'/littlegame/new/images/image3.png',
    url5+'/littlegame/new/images/image4.png',
    url5+'/littlegame/new/images/image5.png',
    url5+'/littlegame/new/images/image5.png',
    url5+'/littlegame/new/images/image4.png',
    url5+'/littlegame/new/images/image3.png',
    url5+'/littlegame/new/images/image2.png',
    url5+'/littlegame/new/images/image1.png',
    // 其他背景圖像
];
const tideImages = [
    url5+'/littlegame/new/images/up1.png',
    url5+'/littlegame/new/images/up2.png',
    url5+'/littlegame/new/images/up3.png',
    url5+'/littlegame/new/images/up2.png',
    url5+'/littlegame/new/images/up1.png',
    // 其他背景圖像
];
const otherImages = [
    url5+'/littlegame/new/images/ball.png',
    url5+'/littlegame/new/images/box.png',
    url5+'/littlegame/new/images/hole.png',
    url5+'/littlegame/new/images/newhole.png',
    url5+'/littlegame/new/images/rareball.png',
    url5+'/littlegame/new/images/teach.png',
    url5+'/littlegame/new/images/tool.png',
    // 其他背景圖像
];
const soundsToPreload = [
    url5+'/littlegame/new/sound/clickbutton.mp3',
    url5+'/littlegame/new/sound/countdown.mp3',
    url5+'/littlegame/new/sound/dig.mp3',
    url5+'/littlegame/new/sound/finalcountdown.mp3',
    url5+'/littlegame/new/sound/generatehole.mp3',
    url5+'/littlegame/new/sound/get.mp3',
    url5+'/littlegame/new/sound/getrare.mp3',
    url5+'/littlegame/new/sound/wave.mp3',
];
const bgm = document.getElementById('bgm');
const bgm2 = document.getElementById('bgm2');


let score_new = 0;
let time=0;
function getUI(name){
    let UI = uiElements.find(ui => ui.name === name);
    return UI;
}
const uiElements = [
    {
        State:'gameInfo',
        name: 'gameInfo', // 游戏说明界面
        type: 'text', // 元素类型：文本
        x: canvas.width / 2, 
        y: canvas.height / 4,
        text: '遊戲說明',
        fontSize: 60,
        color: 'white',
        draw: function() {
            if(gameState===this.State){
                canvas.style.cursor = 'default';
                ctx.font = `${this.fontSize}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = this.color;
                ctx.fillText(this.text, this.x, this.y);
            }
        }
    },
    {
        State:'gameInfo',
        name: 'startButton', // 开始按钮
        type: 'button', // 元素类型：按钮
        x: canvas.width / 2,
        y: canvas.height / 2,
        width: 200,
        height: 80,
        scale:1,
        text: '開始遊戲',
        fontSize: 40,
        color: 'white',
        backgroundColor: '#f1c40f',
        isPressed: false,  // 添加一个标记按下状态的属性
        isHovered: false,  // 模拟 hover 效果
        teachscale: 1,  // 控制图像的缩放
        scaleDirection: 1,  // 控制缩放方向，1 为放大，-1 为缩小
        scaleSpeed: 0.01,  // 控制缩放的速度
        image: new Image(),  // 用来存储图像对象
        imageWidth: 50,  // 图像的初始宽度
        imageHeight: 50,  // 图像的初始高度
        draw: function() {
            if(gameState===this.State){
                ctx.fillStyle = this.isPressed ? '#ba770b' :this.isHovered ? '#f39c12': this.backgroundColor;
                ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
                ctx.fillStyle = this.color;
                ctx.font = `${this.fontSize*this.scale}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.text, this.x, this.y);
                this.updateImageScale();
                this.image.src=url5+'/littlegame/new/images/teach.png';
                ctx.drawImage(
                    this.image, 
                    this.x + this.width / 2 - this.imageWidth / 2,  // 图像 X 轴位置：右下角
                    this.y + this.height / 2 - this.imageHeight / 2,  // 图像 Y 轴位置：右下角
                    this.imageWidth * this.teachscale,  // 图像的缩放宽度
                    this.imageHeight * this.teachscale  // 图像的缩放高度
                );
            }
        },
        onClick: function(touchX, touchY) {
            // 判断点击是否在按钮区域内
            if(gameState===this.State){
                if (touchX >= this.x - this.width / 2 &&
                    touchX <= this.x + this.width / 2 &&
                    touchY >= this.y - this.height / 2 &&
                    touchY <= this.y + this.height / 2) {
                    // 按钮被点击时触发的操作
                    this.isPressed=true;
                    playSound('clickbutton');
                    console.log('click')
                    setTimeout(() => {
                        this.isPressed = false;  // 延遲後恢復按鈕原狀
                        playBGM(bgm);
                        gameState="difficulty";
                        
                    }, 200);
                    console.log('开始游戏');
                    
                }
            }
        },
        setHovered: function(state) {
            if(gameState===this.State){
                this.isHovered = state;  // 设置 hover 状态
            }
        },
        updateImageScale: function() {
            if (this.teachscale >= 1.5) {
                this.scaleDirection = -1;  // 当达到最大值时开始缩小
            } else if (this.teachscale <= 1) {
                this.scaleDirection = 1;  // 当达到最小值时开始放大
            }
    
            this.teachscale += this.scaleSpeed * this.scaleDirection;  // 使用 scaleSpeed 控制缩放速度
        },
        loadImage: function(src) {
            this.image.src = src;  // 设置图像的路径
        },
    },
    {
        State:'difficulty',
        name: 'gameInfo', // 游戏说明界面
        type: 'text', // 元素类型：文本
        x: canvas.width / 2, 
        y: canvas.height / 4,
        text: '難度選擇',
        fontSize: 60,
        color: 'white',
        draw: function() {
            if(gameState===this.State){
                ctx.font = `${this.fontSize}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = this.color;
                ctx.fillText(this.text, this.x, this.y);
            }
        }
    },
    {
        State:'difficulty',
        name: 'easyButton', // 开始按钮
        type: 'button', // 元素类型：按钮
        x: canvas.width / 2-200,
        y: canvas.height / 2,
        width: 150,
        height: 100,
        scale:1,
        text: '簡單',
        fontSize: 50,
        color: 'white',
        backgroundColor: '#f1c40f',
        isPressed: false,  // 添加一个标记按下状态的属性
        isHovered: false,  // 模拟 hover 效果
        teachscale: 1,  // 控制图像的缩放
        scaleDirection: 1,  // 控制缩放方向，1 为放大，-1 为缩小
        scaleSpeed: 0.01,  // 控制缩放的速度
        image: new Image(),  // 用来存储图像对象
        imageWidth: 50,  // 图像的初始宽度
        imageHeight: 50,  // 图像的初始高度
        draw: function() {
            if(gameState===this.State){
                ctx.fillStyle = this.isPressed ? '#ba770b' :this.isHovered ? '#f39c12': this.backgroundColor;
                ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
                ctx.fillStyle = this.color;
                ctx.font = `${this.fontSize*this.scale}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.text, this.x, this.y);

                this.updateImageScale();
                this.image.src=url5+'/littlegame/new/images/teach.png';
                ctx.drawImage(
                    this.image, 
                    this.x + this.width / 2 - this.imageWidth / 2,  // 图像 X 轴位置：右下角
                    this.y + this.height / 2 - this.imageHeight / 2,  // 图像 Y 轴位置：右下角
                    this.imageWidth * this.teachscale,  // 图像的缩放宽度
                    this.imageHeight * this.teachscale  // 图像的缩放高度
                );
            }
        },
        onClick: function(touchX, touchY) {
            // 判断点击是否在按钮区域内
            if(gameState===this.State){
                if (touchX >= this.x - this.width / 2 &&
                    touchX <= this.x + this.width / 2 &&
                    touchY >= this.y - this.height / 2 &&
                    touchY <= this.y + this.height / 2) {
                    // 按钮被点击时触发的操作
                    this.isPressed=true;
                    playSound('clickbutton');
                    setTimeout(() => {
                        this.isPressed = false;  // 延遲後恢復按鈕原狀
                        
                        playSound('countdown');
                        gameState="gameStart";
                        
                    }, 200);
                    console.log('开始游戏');
                    
                }
            }
        },
        setHovered: function(state) {
            if(gameState===this.State){
                this.isHovered = state;  // 设置 hover 状态
            }
        },
        updateImageScale: function() {
            if (this.teachscale >= 1.5) {
                this.scaleDirection = -1;  // 当达到最大值时开始缩小
            } else if (this.teachscale <= 1) {
                this.scaleDirection = 1;  // 当达到最小值时开始放大
            }
    
            this.teachscale += this.scaleSpeed * this.scaleDirection;  // 使用 scaleSpeed 控制缩放速度
        },
    },
    {
        State:'difficulty',
        name: 'normalButton', // 开始按钮
        type: 'button', // 元素类型：按钮
        x: canvas.width / 2,
        y: canvas.height / 2,
        width: 150,
        height: 100,
        scale:1,
        text: '普通',
        fontSize: 50,
        color: 'white',
        backgroundColor: '#f1c40f',
        isPressed: false,  // 添加一个标记按下状态的属性
        isHovered: false,  // 模拟 hover 效果
        draw: function() {
            if(gameState===this.State){
                ctx.fillStyle = this.isPressed ? '#ba770b' :this.isHovered ? '#f39c12': this.backgroundColor;
                ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
                ctx.fillStyle = this.color;
                ctx.font = `${this.fontSize*this.scale}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.text, this.x, this.y);
            }
        },
        onClick: function(touchX, touchY) {
            // 判断点击是否在按钮区域内
            if(gameState===this.State){
                if (touchX >= this.x - this.width / 2 &&
                    touchX <= this.x + this.width / 2 &&
                    touchY >= this.y - this.height / 2 &&
                    touchY <= this.y + this.height / 2) {
                    // 按钮被点击时触发的操作
                    this.isPressed=true;
                    setTimeout(() => {
                        this.isPressed = false;  // 延遲後恢復按鈕原狀
                    }, 200);
                    console.log('开始游戏');
                    
                }
            }
        },
        setHovered: function(state) {
            if(gameState===this.State){
                this.isHovered = state;  // 设置 hover 状态
            }
        }
    },
    {
        State:'difficulty',
        name: 'difficultButton', // 开始按钮
        type: 'button', // 元素类型：按钮
        x: canvas.width / 2+200,
        y: canvas.height / 2,
        width: 150,
        height: 100,
        scale:1,
        text: '困難',
        fontSize: 50,
        color: 'white',
        backgroundColor: '#f1c40f',
        isPressed: false,  // 添加一个标记按下状态的属性
        isHovered: false,  // 模拟 hover 效果
        draw: function() {
            if(gameState===this.State){
                ctx.fillStyle = this.isPressed ? '#ba770b' :this.isHovered ? '#f39c12': this.backgroundColor;
                ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
                ctx.fillStyle = this.color;
                ctx.font = `${this.fontSize*this.scale}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.text, this.x, this.y);
            }
        },
        onClick: function(touchX, touchY) {
            // 判断点击是否在按钮区域内
            if(gameState===this.State){
                if (touchX >= this.x - this.width / 2 &&
                    touchX <= this.x + this.width / 2 &&
                    touchY >= this.y - this.height / 2 &&
                    touchY <= this.y + this.height / 2) {
                    // 按钮被点击时触发的操作
                    this.isPressed=true;
                    setTimeout(() => {
                        this.isPressed = false;  // 延遲後恢復按鈕原狀
                    }, 200);
                    console.log('开始游戏');
                    
                }
            }
        },
        setHovered: function(state) {
            if(gameState===this.State){
                this.isHovered = state;  // 设置 hover 状态
            }
        }
    },
    {
        State:'gameStart',
        name: 'countdown', // 游戏说明界面
        type: 'text', // 元素类型：文本
        x: canvas.width / 2, 
        y: canvas.height / 2,
        text: ['3','2','1','START'],
        index:0,
        fontSize: 100,
        color: 'white',
        timer: null,  // 存储定时器
        draw: function() {
            if(gameState===this.State){
                if (this.timer === null) {
                    this.timer = Date.now(); // 记录游戏开始时间
                }
    
                // 计算当前的时间差
                let elapsedTime = Math.floor((Date.now() - this.timer) / 1000);
    
                // 更新倒计时文字
                if (elapsedTime < this.text.length) {
                    this.index = elapsedTime;  // 更新 index 来显示对应的倒计时数字
                    ctx.font = `${this.fontSize}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = this.color;
                    console.log(this.text[this.index])
                    ctx.strokeText(this.text[this.index], this.x, this.y);
                    ctx.fillText(this.text[this.index], this.x, this.y);
                } else {
                    // 怎麼在這裡更改countdown的start狀態
                    if(getUI('timer').start===false){
                        getUI('beach').cangeneratehole=true;
                        getUI('beach').generateHoles();
                    }
                    getUI('timer').start=true;
                    
                }
                
            }
        },
        reset: function(){
            this.index=0;
            this.timer=null;
        },
    },
    {
        State:'gameStart',
        name: 'timer', // 游戏说明界面
        type: 'text', // 元素类型：文本
        backgroundColor:'rgb(0,0,0,0.5)',
        width: 100,
        height: 60,
        x: canvas.width / 2, 
        y: 80 ,
        fontSize: 40,
        color: 'white',
        time:60,
        start:false,
        finalcountdown:true,
        timer: null,  // 存储定时器
        draw: function() {
            if(gameState===this.State){
                let elapsedTime=0;
                if(this.start){
                    if (this.timer === null) {
                        this.timer = Date.now(); // 记录游戏开始时间
                    }
        
                    // 计算当前的时间差
                    elapsedTime = Math.floor((Date.now() - this.timer) / 1000);
                    time=elapsedTime;
                    if(elapsedTime===20||elapsedTime===40){
                        if(getUI('beach').alarm===false){
                            getUI('beach').alarm=true;
                            getUI('beach').animateAlarm();
                        }
                    }
                    if(elapsedTime===25||elapsedTime===45){
                        if(getUI('beach').tide===false){
                            getUI('beach').alarm=false;
                            playSound('wave');
                            pauseBGM(bgm);
                            playBGM(bgm2,0.5);
                            getUI('beach').tide=true;
                        }
                    }
                    if(elapsedTime==50){
                        if(this.finalcountdown){
                            playSound('finalcountdown');
                            this.finalcountdown=false;
                        }
                    }
                    if(elapsedTime==60){
                        gameState="gameOver";
                    }
                }
                if (elapsedTime < this.time) {
                    this.index = elapsedTime;  // 更新 index 来显示对应的倒计时数字
                    
                    console.log()
                     // 計算文字的寬度和高度
                    const textWidth = this.width;
                    const textHeight = this.height;

                    const borderRadius = 15;

                // 設定外框（矩形框）的樣式
                    ctx.lineWidth = 5;  // 外框的寬度
                    ctx.strokeStyle = 'black';  // 外框顏色，這裡設置為黑色
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; // 半透明的背景顏色

                    // 先畫背景圓角矩形（帶有背景色）
                    ctx.beginPath();
                    ctx.moveTo(this.x - textWidth / 2 - 10 + borderRadius, this.y - textHeight / 2 - 10);
                    ctx.arcTo(this.x + textWidth / 2 + 10, this.y - textHeight / 2 - 10, this.x + textWidth / 2 + 10, this.y + textHeight / 2 + 10, borderRadius);
                    ctx.arcTo(this.x + textWidth / 2 + 10, this.y + textHeight / 2 + 10, this.x - textWidth / 2 - 10, this.y + textHeight / 2 + 10, borderRadius);
                    ctx.arcTo(this.x - textWidth / 2 - 10, this.y + textHeight / 2 + 10, this.x - textWidth / 2 - 10, this.y - textHeight / 2 - 10, borderRadius);
                    ctx.arcTo(this.x - textWidth / 2 - 10, this.y - textHeight / 2 - 10, this.x + textWidth / 2 + 10, this.y - textHeight / 2 - 10, borderRadius);
                    ctx.fill(); // 填充背景顏色

                    // 再畫外框圓角矩形
                    ctx.stroke();


                    ctx.font = `${this.fontSize}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = this.color;
                    ctx.lineWidth = 5;  // 外框的寬度
                    ctx.strokeStyle = 'black';  // 外框顏色，這裡設置為黑色
                    ctx.strokeText((this.time - elapsedTime)+'秒', this.x, this.y); // 繪製外框
                    ctx.fillText((this.time - elapsedTime)+'秒', this.x+2, this.y+2); // 繪製文字
                }
            }
        },
        reset: function(){
            this.time=60;
            this.start=false;
            this.timer=null;
            this.finalcountdown=true;
        },
    },
    {
        State:'gameStart',
        name: 'score', // 游戏说明界面
        type: 'text', // 元素类型：文本
        backgroundColor:'rgb(0,0,0,0.5)',
        width: 150,
        height: 80,
        x: canvas.width / 2, 
        y: 200 ,
        fontSize: 40,
        color: 'white',
        score:0,
        draw: function() {
            if(gameState===this.State){
                    
                    console.log()
                     // 計算文字的寬度和高度
                    const textWidth = this.width;
                    const textHeight = this.height;

                    const borderRadius = 15;

                // 設定外框（矩形框）的樣式
                    ctx.lineWidth = 5;  // 外框的寬度
                    ctx.strokeStyle = 'black';  // 外框顏色，這裡設置為黑色
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; // 半透明的背景顏色

                    // 先畫背景圓角矩形（帶有背景色）
                    ctx.beginPath();
                    ctx.moveTo(this.x - textWidth / 2 - 10 + borderRadius, this.y - textHeight / 2 - 10);
                    ctx.arcTo(this.x + textWidth / 2 + 10, this.y - textHeight / 2 - 10, this.x + textWidth / 2 + 10, this.y + textHeight / 2 + 10, borderRadius);
                    ctx.arcTo(this.x + textWidth / 2 + 10, this.y + textHeight / 2 + 10, this.x - textWidth / 2 - 10, this.y + textHeight / 2 + 10, borderRadius);
                    ctx.arcTo(this.x - textWidth / 2 - 10, this.y + textHeight / 2 + 10, this.x - textWidth / 2 - 10, this.y - textHeight / 2 - 10, borderRadius);
                    ctx.arcTo(this.x - textWidth / 2 - 10, this.y - textHeight / 2 - 10, this.x + textWidth / 2 + 10, this.y - textHeight / 2 - 10, borderRadius);
                    ctx.fill(); // 填充背景顏色

                    // 再畫外框圓角矩形
                    ctx.stroke();


                    ctx.font = `${this.fontSize}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = this.color;
                    ctx.lineWidth = 5;  // 外框的寬度
                    ctx.strokeStyle = 'black';  // 外框顏色，這裡設置為黑色
                    ctx.strokeText((this.score)+' 分', this.x, this.y); // 繪製外框
                    ctx.fillText((this.score)+' 分', this.x+2, this.y+2); // 繪製文字
                    

                
            }
        },
        reset: function(){
            this.score=0;
        },
    },
    {
        State:'gameStart',
        name: 'beach', // 游戏说明界面
        type: 'game', // 元素类型：文本
        backgroundColor:'rgb(0,0,0,0.5)',
        width: 1000,
        height: 300,
        x: canvas.width / 2, 
        y: canvas.height-200 ,
        fontSize: 40,
        color: 'white',
        holes: [], // 存储图片
        holeWidth: 100, // 图片宽度
        holeHeight: 100, // 图片高度
        bucketx:canvas.width-200,
        buckety:canvas.height-200,
        bucketimage: new Image(),
        bucketWidth: 200, // 图片宽度
        bucketHeight: 200, // 图片高度
        rakeWidth: 100,  // 设置耙子的宽度
        rakeHeight: 100,  // 设置耙子的高度
        bucketSource:  url5+'/littlegame/new/images/box.png', // 图片路径
        holeSource:  url5+'/littlegame/new/images/hole.png', // 图片路径
        newholeSource:  url5+'/littlegame/new/images/newhole.png', // 图片路径
        clamImageSource: url5+'/littlegame/new/images/ball.png', // 蛤蠣图片路径
        rareClamImageSource: url5+'/littlegame/new/images/rareball.png',// 稀有蛤蠣图片路径
        rakeImageSource: url5+'/littlegame/new/images/tool.png',// 稀有蛤蠣图片路径
        clams: [], // 当前蛤蠣
        holeDuration: 500, // 蛤蠣动画持续时间（单位：毫秒）
        cangeneratehole:false,
        getclam:0,
        tideImages: [], // 存储涨潮的连续图像
        tideImageIndex:-1,  // 当前显示的涨潮图像索引
        tideImageSwitchInterval: 1000, // 每张图切换的时间间隔（以毫秒为单位）
        lastTideImageSwitchTime: 0, // 上次切换时间
        tide:false,
        alarmtext: '即將漲潮!',
        alarmtextX:canvas.width / 2+400,
        alarmtextY:canvas.height / 2-100,
        alarmtextcolor:'red',
        alarmtextfontSize:80,
        scalealarmtextFactor: 1,  // 字体大小缩放因子
        scalealarmtextDirection: 1, // 1 为放大，-1 为缩小
        scaleSpeed:0.01,
        alarm:false,
        teachscale: 1,  // 控制图像的缩放
        teachscaleDirection: 1,  // 控制缩放方向，1 为放大，-1 为缩小
        teachscaleSpeed: 0.01,  // 控制缩放的速度
        teachimage: new Image(),  // 用来存储图像对象
        teachimageWidth: 50,  // 图像的初始宽度
        teachimageHeight: 50,  // 图像的初始高度
        canteach1:true,
        canteach2:true,
        t: 0,  // 控制动画的时间变量
        a: 50,  // 8字形的横向半径
        b: 30,  // 8字形的纵向半径
        speed: 0.05,  // 控制移动速度
        teachX:0,
        teachY:0,
        constteachX:0,
        constteachY:0,
        draw: function() {
            if(gameState===this.State){
                /*ctx.fillStyle = this.backgroundColor;
                ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);*/
                this.bucketimage.src=this.bucketSource;
                ctx.drawImage(this.bucketimage, this.bucketx, this.buckety, this.bucketWidth, this.bucketHeight);
                this.holes.forEach(hole => {
                    ctx.drawImage(hole.image, hole.x, hole.y, this.holeWidth, this.holeHeight);
                    if(hole.holeteach){
                        this.updateImageScale();
                        this.teachimage.src=url5+'/littlegame/new/images/teach.png';
                        ctx.drawImage(
                            this.teachimage, 
                            hole.x + this.holeWidth / 2 ,  // 图像 X 轴位置：右下角
                            hole.y + this.holeHeight / 2 ,  // 图像 Y 轴位置：右下角
                            this.teachimageWidth * this.teachscale,  // 图像的缩放宽度
                            this.teachimageHeight * this.teachscale  // 图像的缩放高度
                    
                        );
                    }
                });
                this.clams.forEach(clam => {
                    if(!this.tide){
                        if(!clam.isget){
                        ctx.drawImage(clam.image, clam.x, clam.y, clam.width, clam.height);
                        // 抛物线效果：蛤蠣飞向桶子
                            if (clam.isFlyingToBucket) {
                                this.drawscore(clam.scoretext,clam.scorecolor,clam.textX,clam.textY);
                                clam.textY+=1;
                                if(clam.highestPoint>0){
                                    clam.highestPoint-=clam.speedX;
                                    clam.x += clam.speedX; // x 轴移动
                                    clam.y += clam.speedY; // y 轴移动
                                }
                                else{
                                    //clam.x += clam.speedX; // x 轴移动
                                    clam.y -= clam.speedY*4; // y 轴移动
                                }

                                // 更新速度以模拟重力效果
                                //clam.speedY += clam.gravity; // 受到重力影响
                                //console.log(Math.abs(clam.x - this.bucketx))
                                // 检查是否到达桶子
                                if (clam.x > this.bucketx&&clam.y>this.buckety ) {
                                    clam.isFlyingToBucket = false;
                                    clam.isget=true;
                                    //clam.alpha = 0; // 蛤蠣消失
                                    this.getclam++;
                                    if(this.getclam===this.holes.length)
                                        {
                                            
                                            this.cangeneratehole=true;
                                            this.generateHoles();
                                        }
                                }
                                
                            }
                            // 绘制耙子（当它可见时）
                            if (clam.isRakeVisible) {
                                const rakeImage = new Image();
                                rakeImage.src = this.rakeImageSource;

                                ctx.save();
                                ctx.translate(clam.rakeX, clam.rakeY);
                                ctx.rotate(clam.rakeAngle);  // 旋转角度
                                ctx.drawImage(rakeImage, -this.rakeWidth / 2, -this.rakeHeight / 2, this.rakeWidth, this.rakeHeight);  // 绘制旋转的耙子
                                ctx.restore();
                            }
                            if(clam.clamteach){
                                this.updateImagePosition(this.constteachX,this.constteachY);
                                this.teachimage.src=url5+'/littlegame/new/images/teach.png';
                                ctx.drawImage(
                                    this.teachimage, 
                                    this.teachX + clam.width / 2 ,  // 图像 X 轴位置：右下角
                                    this.teachY + clam.height / 2 ,  // 图像 Y 轴位置：右下角
                                    this.teachimageWidth ,  // 图像的缩放宽度
                                    this.teachimageHeight  // 图像的缩放高度
                            
                                );
                            }
                        }
                    }
                });
                if (this.tide) {
                    // 绘制当前的涨潮图像
                    const currentTime = Date.now();
                    
                        // 如果当前时间和上次切换时间的差大于等于设置的间隔，就切换图像
                    if (currentTime - this.lastTideImageSwitchTime >= this.tideImageSwitchInterval) {
                        this.tideImageIndex++;; // 切换到下一张图像
                        this.lastTideImageSwitchTime = currentTime; // 更新上次切换时间
                        if(this.tideImageIndex===2){
                            this.cangeneratehole=true;
                            if(this.canteach2)this.canteach1=true;
                            this.generateHoles();
                        }
                        if(this.tideImageIndex===tideImages.length){
                            this.tideImageIndex=-1;
                            playBGM(bgm);
                            this.tide=false;
                            this.canteach1=false;
                        }
                    }
                    if (this.tide)
                    ctx.drawImage(this.tideImages[this.tideImageIndex], 0, 0, canvas.width, canvas.height);  
                }
                if(this.alarm){
                    ctx.font = `${this.alarmtextfontSize * this.scalealarmtextFactor}px Arial`;  // 动态字体大小
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = this.alarmtextcolor;

                    ctx.fillText(this.alarmtext, this.alarmtextX, this.alarmtextY);  // 绘制文本
                }
            }
        },
        generateHoles: function() {
            if(gameState===this.State){
                if(this.cangeneratehole){
                    playSound('generatehole');
                    holes=[];
                    let holeArray = [];
                    this.clams=[];
                    this.getclam=0;
                    // 随机生成不重叠的图片
                    while (holeArray.length < 10) {
                        let randomX = this.x - this.width / 2 + Math.random() * (this.width - this.holeWidth);
                        let randomY = this.y - this.height / 2 + Math.random() * (this.height - this.holeHeight);
                
            
                        // 检查新位置是否与已有图片重叠
                        let isOverlapping = false;
                        for (let hole of holeArray) {
                            if (this.isOverlap(randomX, randomY, hole.x, hole.y)) {
                                isOverlapping = true;
                                break;
                            }
                        }
            
                        // 如果不重叠，则添加新图片
                        if (!isOverlapping) {
                            console.log(this.canteach1)
                            holeArray.push({ x: randomX, y: randomY, image: new Image(),newhole:false,holeteach:this.canteach1});
                            this.canteach1=false;
                            holeArray[holeArray.length - 1].image.src = this.holeSource;
                        }
                    }
                    this.cangeneratehole=false;
            
                    // 将生成的图片数组存储到 images 中
                    this.holes = holeArray;
                }
            }
        },
        isOverlap: function(x1, y1, x2, y2) {
            return !(x1 + this.holeWidth < x2 || x1 > x2 + this.holeWidth || y1 + this.holeHeight < y2 || y1 > y2 + this.holeHeight);
        },
        handleHover: function(offsetX, offsetY) {
            if(gameState===this.State){
                // 获取鼠标点击的坐标
                // 遍历所有图片，检查是否点击在某个图片上
                canvas.style.cursor = 'default';
                this.holes.forEach(img => {
                    if (offsetX >= img.x && offsetX <= img.x + this.holeWidth && offsetY >= img.y && offsetY <= img.y + this.holeHeight&& !img.newhole) {
                        // 如果点击了，改变图片为新的图片
                        if(!isMobileDevice()){
                            canvas.style.cursor = 'pointer';
                        }
                    }
                });
            }
        },
        handleClick: function(offsetX, offsetY) {
            if(gameState===this.State){
                // 获取鼠标点击的坐标
                // 遍历所有图片，检查是否点击在某个图片上
                if(!this.tide){
                    this.holes.forEach(hole => {
                        if (offsetX >= hole.x && offsetX <= hole.x + this.holeWidth && offsetY >= hole.y && offsetY <= hole.y + this.holeHeight&& !hole.newhole&&(hole.holeteach||!this.canteach2) ) {
                            // 如果点击了，改变图片为新的图片
                            playSound('dig');
                            hole.image.src = this.newholeSource;
                            hole.newhole=true;
                            canvas.style.cursor = 'default';
                            // 遍历所有图片，检查是否点击在某个图片上
                            let isRare = Math.random() < 0.1;  // 10% 概率生成稀有蛤蠣
                            // 创建蛤蠣对象
                            let newClam = {
                                x: hole.x, 
                                y: hole.y, 
                                width: this.holeWidth, 
                                height: this.holeHeight,
                                image: new Image(),
                                targetY: hole.y-20, // 蛤蠣弹出后的位置
                                maxHeight: hole.y - 100, // 最大高度
                                speed: 4, // 弹出速度
                                isFalling: false, // 是否开始下落
                                gravity: 0.1, // 重力加速度
                                velocity: 5, // 初始向上速度
                                isRare:isRare,
                                speedX: 30,
                                speedY: -5,
                                highestPoint:(this.bucketx - hole.x)+50,
                                isFlyingToBucket: false, // 标记蛤蠣开始飞向桶子
                                alpha: 1, // 透明度
                                canget:false,
                                isget:false,
                                score:5,
                                scoretext:'+5',
                                scorecolor:'white',
                                textX:hole.x+100,
                                textY:hole.y,
                                rakeX:hole.x+100,
                                rakeY:hole.y+50,
                                textAlpha: 1,  // 文本的透明度，开始时为1
                                rakeAngle:0,  // 耙子的角度
                                rakeSwingSpeed: 0.1, // 耙子的摆动速度
                                isRakeVisible: true,  // 耙子是否可见
                                clamteach:this.canteach2,
                            };
                            if(hole.holeteach){
                                this.constteachX=hole.x-newClam.width/4;
                                this.constteachY=hole.y-newClam.height/4;
                            }
                            hole.holeteach=false;
                            this.canteach2=false;
                            getUI('score').score+=newClam.score;
                            newClam.image.src = isRare ? this.rareClamImageSource : this.clamImageSource;


                            // 将蛤蠣加入到数组中
                            this.clams.push(newClam);

                            // 动画效果
                            this.animateClam(newClam);
                            this.animateRake(newClam);
                                
                        }
                    });
                }
            }
        },
        // 蛤蠣弹出动画
        animateClam: function(clam) {
            const animationLoop = () => {
                if (!clam.isFalling) {
                    // 弹到空中的动画
                    this.drawscore(clam.scoretext,clam.scorecolor,clam.textX,clam.textY,true);
                    clam.textY+=1;
                    if (clam.y > clam.maxHeight) {
                        clam.y -= clam.velocity; // 蛤蠣向上移动
                        clam.velocity += clam.gravity; // 增加上升速度的重力效果
                        requestAnimationFrame(animationLoop); // 继续执行动画
                    } else {
                        // 达到最大高度后，开始下落
                        clam.isFalling = true;
                        clam.velocity = 4; // 让蛤蠣开始下落
                        requestAnimationFrame(animationLoop);
                    }
                } else {
                    // 蛤蠣下落的动画
                    if (clam.y < clam.targetY) {
                        clam.y += clam.velocity; // 蛤蠣向下移动
                        clam.velocity += clam.gravity; // 让蛤蠣受重力影响加速下落
                        requestAnimationFrame(animationLoop);
                    } else {
                        // 蛤蠣到达目标位置后停止
                        clam.y = clam.targetY;
                        clam.canget=true;
                        clam.isRakeVisible=false;
                        clam.score=clam.isRare? 50:10;
                        clam.scoretext=clam.isRare? '+50':'+10';
                        clam.scorecolor=clam.isRare? 'red':'green';
                    }
                }
            };
    
            // 启动动画
            animationLoop();
        },
        animateRake: function(clam) {
            const rakeSwing = () => {
                clam.rakeAngle += clam.rakeSwingSpeed;  // 持续增加角度，模拟摆动
                if (clam.rakeAngle > Math.PI / 4 || clam.rakeAngle < -Math.PI / 4) {
                    clam.rakeSwingSpeed = -clam.rakeSwingSpeed;  // 达到最大角度后反转摆动方向
                }
                requestAnimationFrame(rakeSwing);  // 继续动画
            };
            rakeSwing();
        },
        handleMouseMove: function(offsetX,offsetY) {
            if(gameState===this.State){
            // 遍历所有蛤蠣，检查是否滑过蛤蠣
                if(!this.tide){
                    this.clams.forEach(clam => {
                        if (offsetX >= clam.x && offsetX <= clam.x + clam.width && offsetY >= clam.y && offsetY <= clam.y + clam.height&&clam.canget) {
                            if (!clam.isFlyingToBucket) {
                                if(clam.isRare){
                                    playSound('getrare',0.5);
                                }
                                else{
                                    playSound('get');
                                }
                                
                                clam.isFlyingToBucket = true; // 开始弹起
                                console.log(this.getclam);
                                getUI('score').score+=clam.score;
                            }
                        }
                    });
                }
            }
        },
        drawscore:function(text,color,x,y,RakeVisible=false) {
                // 绘制蛤蠣
            //console.log(123);
            ctx.font = "60px Arial";  // 设置字体样式
            ctx.fillStyle = color;  // 设置文本颜色
            ctx.fillText(text, x, y);  // 绘制文本
            if (RakeVisible) {

            }
        },
        // 动画效果：让文本字体放大和缩小
        animateAlarm: function() {
            if(this.alarm)
                {
                if (this.scalealarmtextFactor >= 1.5) {
                    this.scalealarmtextDirection = -1;  // 当达到最大值时开始缩小
                } else if (this.scalealarmtextFactor <= 1) {
                    this.scalealarmtextDirection = 1;  // 当达到最小值时开始放大
                }
                //console.log(this.scalealarmtextFactor);
                this.scalealarmtextFactor += this.scaleSpeed * this.scalealarmtextDirection;  // 每帧调整字体缩放因子

                requestAnimationFrame(() => this.animateAlarm());  // 继续下一帧动画
            }
        },
        updateImageScale: function() {
            if (this.teachscale >= 1.5) {
                this.teachscaleDirection = -1;  // 当达到最大值时开始缩小
            } else if (this.teachscale <= 1) {
                this.teachscaleDirection = 1;  // 当达到最小值时开始放大
            }
    
            this.teachscale += this.teachscaleSpeed * this.teachscaleDirection;  // 使用 scaleSpeed 控制缩放速度
        },
        updateImagePosition: function(x,y) {
            // 使用正弦和余弦函数来沿8字形轨迹计算位置
            this.teachX = x + this.a * Math.sin(this.t);  // 横向位置
            this.teachY = y + this.b * Math.sin(this.t * 2);  // 纵向位置
            
            // 增加时间变量 t 来实现连续运动
            this.t += this.speed;  // 控制运动速度
    
            // 当 t 大于 2 * Math.PI 时，重置 t 为 0
            // 以避免无限增大 t，确保 8 字形路径是循环的
            if (this.t > Math.PI * 2) {
                this.t = 0;
            }
        },
        reset: function(){
            this.holes=[];
            this.clams=[];
            this.getclam=0;
            this.cangeneratehole=false;
            this.tideImageIndex=-1;
            this.lastTideImageSwitchTime=0;
            this.tide=false;
            this.alarm=false;
            this.scalealarmtextFactor=1;
        },
        

    },
    {
        State:'gameOver',
        name: 'gameover', // 游戏说明界面
        type: 'text', // 元素类型：文本
        x: canvas.width / 2, 
        y: canvas.height / 4,
        text: '遊戲結束',
        fontSize: 60,
        color: 'white',
        draw: function() {
            if(gameState===this.State){
                ctx.font = `${this.fontSize}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = this.color;
                ctx.lineWidth = 5;  // 外框的寬度
                ctx.strokeStyle = 'black';  // 外框顏色，這裡設置為黑色
                ctx.strokeText(this.text, this.x+2, this.y+2); // 繪製外框
                ctx.fillText(this.text, this.x, this.y);
            }
        }
    },
    {
        State:'gameOver',
        name: 'finalscore', // 游戏说明界面
        type: 'text', // 元素类型：文本
        x: canvas.width / 2, 
        y: canvas.height / 4+100,
        text: '最終分數: ',
        fontSize: 40,
        color: 'white',
        draw: function() {
            if(gameState===this.State){
                canvas.style.cursor = 'default';
                ctx.font = `${this.fontSize}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = this.color;
                ctx.lineWidth = 5;  // 外框的寬度
                ctx.strokeStyle = 'black';  // 外框顏色，這裡設置為黑色
                ctx.strokeText(this.text+getUI('score').score, this.x+2, this.y+2); // 繪製外框
                ctx.fillText(this.text+getUI('score').score, this.x, this.y);
            }
        }
    },
    {
        State:'gameOver',
        name: 'againButton', // 开始按钮
        type: 'button', // 元素类型：按钮
        x: canvas.width / 2-150,
        y: canvas.height / 2,
        width: 200,
        height: 80,
        scale:1,
        text: '再玩一次',
        fontSize: 40,
        color: 'white',
        backgroundColor: '#f1c40f',
        isPressed: false,  // 添加一个标记按下状态的属性
        isHovered: false,  // 模拟 hover 效果
        draw: function() {
            if(gameState===this.State){
                ctx.fillStyle = this.isPressed ? '#ba770b' :this.isHovered ? '#f39c12': this.backgroundColor;
                ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
                ctx.fillStyle = this.color;
                ctx.font = `${this.fontSize*this.scale}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.text, this.x, this.y);
            }
        },
        onClick: function(touchX, touchY) {
            // 判断点击是否在按钮区域内
            if(gameState===this.State){
                if (touchX >= this.x - this.width / 2 &&
                    touchX <= this.x + this.width / 2 &&
                    touchY >= this.y - this.height / 2 &&
                    touchY <= this.y + this.height / 2) {
                    // 按钮被点击时触发的操作
                    this.isPressed=true;
                    playSound('clickbutton');
                    setTimeout(() => {
                        this.isPressed = false;  // 延遲後恢復按鈕原狀
                        gameState="difficulty";
                        uiElements.forEach(element => {
                            element.isPressed=false;
                            element.isHovered=false;
                        });
                        getUI('countdown').reset();
                        getUI('timer').reset();
                        getUI('score').reset();
                        getUI('beach').reset();
                    }, 200);
                    console.log('开始游戏');
                }
            }
        },
        setHovered: function(state) {
            if(gameState===this.State){
                this.isHovered = state;  // 设置 hover 状态
            }
        }
    },
    {
        State:'gameOver',
        name: 'exitButton', // 开始按钮
        type: 'button', // 元素类型：按钮
        x: canvas.width / 2+150,
        y: canvas.height / 2,
        width: 200,
        height: 80,
        scale:1,
        text: '離開遊戲',
        fontSize: 40,
        color: 'white',
        backgroundColor: '#f1c40f',
        isPressed: false,  // 添加一个标记按下状态的属性
        isHovered: false,  // 模拟 hover 效果
        draw: function() {
            if(gameState===this.State){
                ctx.fillStyle = this.isPressed ? '#ba770b' :this.isHovered ? '#f39c12': this.backgroundColor;
                ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
                ctx.fillStyle = this.color;
                ctx.font = `${this.fontSize*this.scale}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.text, this.x, this.y);
            }
        },
        onClick: function(touchX, touchY) {
            // 判断点击是否在按钮区域内
            if(gameState===this.State){
                if (touchX >= this.x - this.width / 2 &&
                    touchX <= this.x + this.width / 2 &&
                    touchY >= this.y - this.height / 2 &&
                    touchY <= this.y + this.height / 2) {
                    // 按钮被点击时触发的操作
                    this.isPressed=true;
                    playSound('clickbutton');
                    setTimeout(() => {
                        this.isPressed = false;  // 延遲後恢復按鈕原狀
                        getUI('countdown').reset();
                        getUI('timer').reset();
                        getUI('score').reset();
                        getUI('beach').reset();
                        uiElements.forEach(element => {
                            element.isPressed=false;
                            element.isHovered=false;
                        });
                        gameState='gameInfo';
                        stopBGM(bgm);
                        loadGame2();
                    }, 200);
                    console.log('开始游戏');
                    
                }
            }
        },
        setHovered: function(state) {
            if(gameState===this.State){
                this.isHovered = state;  // 设置 hover 状态
            }
        }
    },
    // 可以继续添加其他界面元素...
];

// 遊戲參數

function updateGame(timestamp){
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除画布
    drawBackground(timestamp);


    drawGameInfo();


    requestAnimationFrame(updateGame);

}
let loadedBackgrounds = [];
let imagesLoaded = 0;
backgroundImages.forEach((src, index) => {
    let img = new Image();
    img.src = src;
    img.onload = () => {
        loadedBackgrounds[index] = img;
        imagesLoaded++;
        // 當所有圖片加載完成後，啟動動畫
        if (imagesLoaded === backgroundImages.length) {
            //animateBackground();
            //updateGame();
        }
    };
});
let imagesLoaded2 = 0;
tideImages.forEach((src, index) => {
    let img = new Image();
    img.src = src;
    img.onload = () => {
        imagesLoaded2++
        getUI('beach').tideImages[index] = img;
        if (imagesLoaded2 === tideImages.length) {
        }
    };
});
otherImages.forEach((src, index) => {
    let img = new Image();
    img.src = src;
    img.onload = () => {
    };
});
soundsToPreload.forEach((src) => {
      
    const audio = new Audio();
    audio.src = src;
    audio.load();
    audio.preload = 'auto'; // 確保音效文件提前加載
    audio.onload = () => {
    };
});

if (imagesLoaded === backgroundImages.length) {
    //animateBackground();
    updateGame();
}


  

function drawBackground(timestamp){
    if (!lastFrameTime) lastFrameTime = timestamp;
    let deltaTime = timestamp - lastFrameTime;
    if (deltaTime >= backgroundSwitchInterval) {
        // 如果时间差大于设定的切换间隔，则切换背景
        currentBackgroundIndex = (currentBackgroundIndex + 1) % loadedBackgrounds.length;
        lastFrameTime = timestamp; // 更新上一帧的时间
        // 更新画布
    }
    ctx.drawImage(loadedBackgrounds[currentBackgroundIndex], 0, 0, canvas.width, canvas.height);
}
// 顯示遊戲說明
function drawGameInfo() {
    uiElements.forEach(element => {
        element.draw();
    });
}



// 顯示遊戲結束畫面
function drawGameOver() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("遊戲結束", canvas.width / 2, 100);
  ctx.fillText(`最終得分: ${score}`, canvas.width / 2, 150);

  ctx.font = "20px Arial";
  ctx.fillText("點擊重試", canvas.width / 2, 200);
  ctx.fillText("點擊離開", canvas.width / 2, 250);
}

// 設置遊戲開始按鈕的點擊事件
canvas.addEventListener("mousedown", (e) => {
    let rect = canvas.getBoundingClientRect();
    let mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    let mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
    uiElements.forEach(element => {
        if (element.type === 'button') {
            element.onClick(mouseX, mouseY);
        }
    });
    getUI('beach').handleClick(mouseX,mouseY);
});
canvas.addEventListener("touchstart", (e) => {
    Array.from(e.touches).forEach(touch =>{
        let rect = canvas.getBoundingClientRect();
        let touchX = (touch.clientX - rect.left) * (canvas.width / rect.width);
        let touchY = (touch.clientY - rect.top) * (canvas.height / rect.height);
        uiElements.forEach(element => {
            if (element.type === 'button') {
                element.onClick(touchX, touchY);
            }
        });
        getUI('beach').handleClick(touchX,touchY);
        // 阻止觸摸事件的預設行為（防止頁面滾動）
        e.preventDefault();
    });
});
canvas.addEventListener('mousemove', (e) => {
    let rect = canvas.getBoundingClientRect();
    let offsetX = (e.clientX - rect.left) * (canvas.width / rect.width);
    let offsetY = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    // 遍历所有UI元素，检查是否鼠标悬停在按钮上
    uiElements.forEach(element => {
        if (element.type === 'button') {
            if (offsetX >= element.x - element.width / 2 &&
                offsetX <= element.x + element.width / 2 &&
                offsetY >= element.y - element.height / 2 &&
                offsetY <= element.y + element.height / 2) {
                element.setHovered(true);  // 鼠标悬停时设置 hover 状态
            } else {
                element.setHovered(false); // 不在按钮区域时，取消 hover 状态
            }
        }
    });
    if(e.buttons === 1){
        getUI('beach').handleMouseMove(offsetX,offsetY);
    }
    getUI('beach').handleHover(offsetX,offsetY);
});
canvas.addEventListener('touchmove', function(e) {
    Array.from(e.touches).forEach(touch =>{
        e.preventDefault();
        let rect = canvas.getBoundingClientRect();
        let offsetX = (touch.clientX - rect.left) * (canvas.width / rect.width);
        let offsetY = (touch.clientY - rect.top) * (canvas.height / rect.height);
        getUI('beach').handleMouseMove(offsetX,offsetY);
    });
});

// 每個 60 毫秒刷新一次畫面
