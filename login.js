const url0='https://eason112.github.io/tiger';
const logincanvas = document.getElementById('loginCanvas');
const loginctx = logincanvas.getContext('2d');
const inputField = document.getElementById('inputField');
logincanvas.width = 2000;
logincanvas.height = 940;

let lastFrameTimeLogin = 0;
let LoginSwitchInterval = 500; // 每500毫秒切换一次背景
let currentLoginIndex = 0;

let loading=false;

let loginState = "start"; // 可選 "start","login", "experience", "line", "character", "name","end"

let loginbuttonHover=false;
let loginInputHover=false;

const loginImages = [
    url0+'/login.png',
    url0+'/login.png',
];

let focusIndex=null;

let playercharacter=0;
let playername='';

const characterImage = [
    { name:"妙妙",img:url0+'/major/images/player.png',imageWidth:293,imageHeight:377,choose:true },
    { name:"琪琪",img:url0+'/major/images/NPC.png' ,imageWidth:293,imageHeight:377,choose:false},
    { name:"桃樂比",img:url0+'/major/images/NPC.png' ,imageWidth:293,imageHeight:377,choose:false},
    { name:"巧虎",img:url0+'/major/images/player.png' ,imageWidth:293,imageHeight:377,choose:false},
    
];
function getloginUI(name){
    let UI = loginuiElements.find(ui => ui.name === name);
    return UI;
}
const loginuiElements = [
    {
        State:'start',
        name: 'startButton', // 开始按钮
        type: 'button', // 元素类型：按钮
        width: 200,
        height: 80,
        x: logincanvas.width / 2,
        y: logincanvas.height/1.1,
        scale:1,
        text: '開始遊戲',
        fontSize: 40,
        color: 'white',
        backgroundColor: '#00aaff',
        isPressed: false,  // 添加一个标记按下状态的属性
        isHovered: false,  // 模拟 hover 效果
        teachscale: 1,  // 控制图像的缩放
        scaleDirection: 1,  // 控制缩放方向，1 为放大，-1 为缩小
        scaleSpeed: 0.01,  // 控制缩放的速度
        image: new Image(),  // 用来存储图像对象
        imageWidth: 50,  // 图像的初始宽度
        imageHeight: 50,  // 图像的初始高度
        draw: function() {
            if(loginState===this.State){
                logincanvas.style.cursor =this.isHovered ? 'pointer' : 'default';
                loginctx.fillStyle = this.isPressed ? '#006394' :this.isHovered ? '#0085c7': this.backgroundColor;
                const radius=15;
                const BtnX=this.x-this.width/2;
                const BtnY=this.y-this.height/2;

                loginctx.beginPath();
                loginctx.moveTo(BtnX + radius, BtnY); // 从左上角的圆角开始
                loginctx.arcTo(BtnX + this.width, BtnY, BtnX + this.width, BtnY + this.height, radius); // 右上角
                loginctx.arcTo(BtnX + this.width, BtnY + this.height, BtnX, BtnY + this.height, radius); // 右下角
                loginctx.arcTo(BtnX, BtnY + this.height, BtnX, BtnY, radius); // 左下角
                loginctx.arcTo(BtnX, BtnY, BtnX + this.width, BtnY, radius); // 左上角
                loginctx.closePath();
                loginctx.fill(); // 填充颜色
        
                loginctx.fillStyle = this.color;
                loginctx.font = `${this.fontSize*this.scale}px Arial`;
                loginctx.textAlign = 'center';
                loginctx.textBaseline = 'middle';
                
                loginctx.fillText(this.text, this.x, this.y);
                this.updateImageScale();
                this.image.src=url5+'/littlegame/new/images/teach.png';
                loginctx.drawImage(
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
            if(loginState===this.State){
                if (touchX >= this.x - this.width / 2 &&
                    touchX <= this.x + this.width / 2 &&
                    touchY >= this.y - this.height / 2 &&
                    touchY <= this.y + this.height / 2) {
                    // 按钮被点击时触发的操作
                    this.isPressed=true;
                    
                    playSound('clickbutton');
                    setTimeout(() => {
                        playBGM(loginbgm,0.5);
                        this.isPressed = false;  // 延遲後恢復按鈕原狀
                        loginState="login";
                        loginbuttonHover=false;
                    }, 200);
                    
                }
            }
        },
        setHovered: function(state) {
            if(loginState===this.State){
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
    },//startButton
    {
        State:'login',
        name: 'loginbackground', // 开始按钮
        type: 'background', // 元素类型：按钮
        width: 1500,
        height: 800,
        x: logincanvas.width / 2,
        y: logincanvas.height/2,
        backgroundColor: '#ffb1f1',
        draw: function() {
            if(loginState===this.State){
                loginctx.fillStyle = this.backgroundColor;
                const radius=15;
                const BtnX=this.x-this.width/2;
                const BtnY=this.y-this.height/2;

                loginctx.beginPath();
                loginctx.moveTo(BtnX + radius, BtnY); // 从左上角的圆角开始
                loginctx.arcTo(BtnX + this.width, BtnY, BtnX + this.width, BtnY + this.height, radius); // 右上角
                loginctx.arcTo(BtnX + this.width, BtnY + this.height, BtnX, BtnY + this.height, radius); // 右下角
                loginctx.arcTo(BtnX, BtnY + this.height, BtnX, BtnY, radius); // 左下角
                loginctx.arcTo(BtnX, BtnY, BtnX + this.width, BtnY, radius); // 左上角
                loginctx.closePath();
                loginctx.fill(); // 填充颜色
            }
        },
    },//loginbackground
    {
        State:'login',
        name: 'account', // 开始按钮
        type: 'input', // 元素类型：按钮
        width: 500,
        height: 80,
        get x(){
            return getloginUI('loginbackground').x;
        },
        get y(){
            return getloginUI('loginbackground').y-getloginUI('loginbackground').height/3;
        },
        scale:1,
        text: '會員編號',
        inputtext:'',
        fontSize: 40,
        maxLength:12,
        color: 'white',
        backgroundColor: '#00aaff',
        isPressed: false,  // 添加一个标记按下状态的属性
        isHovered: false,  // 模拟 hover 效果
        draw: function() {
            if(loginState===this.State){
                loginctx.fillStyle = this.isPressed ? '#0066cb' :this.isHovered ? '#0066cb': this.backgroundColor;
                const radius=15;
                const BtnX=this.x-this.width/2;
                const BtnY=this.y-this.height/2;

                loginctx.beginPath();
                loginctx.moveTo(BtnX + radius, BtnY); // 从左上角的圆角开始
                loginctx.arcTo(BtnX + this.width, BtnY, BtnX + this.width, BtnY + this.height, radius); // 右上角
                loginctx.arcTo(BtnX + this.width, BtnY + this.height, BtnX, BtnY + this.height, radius); // 右下角
                loginctx.arcTo(BtnX, BtnY + this.height, BtnX, BtnY, radius); // 左下角
                loginctx.arcTo(BtnX, BtnY, BtnX + this.width, BtnY, radius); // 左上角
                loginctx.closePath();
                loginctx.fill(); // 填充颜色

                loginctx.fillStyle = this.color;
                loginctx.font = `${this.fontSize*this.scale}px Arial`;
                loginctx.textAlign = 'center';
                loginctx.textBaseline = 'middle';
                
                loginctx.fillText(this.text, this.x-this.width/1.4, this.y);
                loginctx.fillText(this.inputtext, this.x, this.y);
            }
        },
        onInput: function(touchX, touchY) {
            // 判断点击是否在按钮区域内
            if(loginState===this.State){
                if (touchX >= this.x - this.width / 2 &&
                    touchX <= this.x + this.width / 2 &&
                    touchY >= this.y - this.height / 2 &&
                    touchY <= this.y + this.height / 2) {
                    // 按钮被点击时触发的操作
                    this.isPressed=true;
                    inputField.blur();   // 移除焦點
                    setTimeout(() => {
                        this.isPressed = false;  // 延遲後恢復按鈕原狀
                        loginbuttonHover=false;
                        focusIndex=this.name;
                        inputField.value =this.inputtext;
                        inputField.focus(); // 聚焦到輸入框
                    }, 200);
                    
                }
            }
        },
        setHovered: function(state) {
            if(loginState===this.State){
                this.isHovered = state;  // 设置 hover 状态
            }
        },
    },//account
    {
        State:'login',
        name: 'password', // 开始按钮
        type: 'input', // 元素类型：按钮
        width: 500,
        height: 80,
        get x(){
            return getloginUI('loginbackground').x;
        },
        get y(){
            return getloginUI('loginbackground').y-getloginUI('loginbackground').height/3+130;
        },
        scale:1,
        text: '會員密碼',
        inputtext:'',
        passwordtext:'',
        fontSize: 40,
        maxLength:12,
        color: 'white',
        backgroundColor: '#00aaff',
        isPressed: false,  // 添加一个标记按下状态的属性
        isHovered: false,  // 模拟 hover 效果
        draw: function() {
            if(loginState===this.State){
                loginctx.fillStyle = this.isPressed ? '#0066cb' :this.isHovered ? '#0066cb': this.backgroundColor;
                const radius=15;
                const BtnX=this.x-this.width/2;
                const BtnY=this.y-this.height/2;

                loginctx.beginPath();
                loginctx.moveTo(BtnX + radius, BtnY); // 从左上角的圆角开始
                loginctx.arcTo(BtnX + this.width, BtnY, BtnX + this.width, BtnY + this.height, radius); // 右上角
                loginctx.arcTo(BtnX + this.width, BtnY + this.height, BtnX, BtnY + this.height, radius); // 右下角
                loginctx.arcTo(BtnX, BtnY + this.height, BtnX, BtnY, radius); // 左下角
                loginctx.arcTo(BtnX, BtnY, BtnX + this.width, BtnY, radius); // 左上角
                loginctx.closePath();
                loginctx.fill(); // 填充颜色
  
                loginctx.fillStyle = this.color;
                loginctx.font = `${this.fontSize*this.scale}px Arial`;
                loginctx.textAlign = 'center';
                loginctx.textBaseline = 'middle';
                
                loginctx.fillText(this.text, this.x-this.width/1.4, this.y);
                loginctx.fillText(this.inputtext, this.x, this.y);

            }
        },
        onInput: function(touchX, touchY) {
            // 判断点击是否在按钮区域内
            if(loginState===this.State){
                if (touchX >= this.x - this.width / 2 &&
                    touchX <= this.x + this.width / 2 &&
                    touchY >= this.y - this.height / 2 &&
                    touchY <= this.y + this.height / 2) {
                    // 按钮被点击时触发的操作
                    this.isPressed=true;
                    inputField.blur();   // 移除焦點
                    setTimeout(() => {
                        this.isPressed = false;  // 延遲後恢復按鈕原狀
                        loginbuttonHover=false;
                        focusIndex=this.name;
                        inputField.value =this.inputtext;
                        inputField.focus(); // 聚焦到輸入框
                    }, 200);
                    
                }
            }
        },
        setHovered: function(state) {
            if(loginState===this.State){
                this.isHovered = state;  // 设置 hover 状态
            }
        },
    },//password
    {
        State:'login',
        name: 'loginButton', // 开始按钮
        type: 'button', // 元素类型：按钮
        width: 200,
        height: 80,
        get x(){
            return getloginUI('loginbackground').x-150;
        },
        get y(){
            return getloginUI('loginbackground').y;
        },
        scale:1,
        text: '登入',
        fontSize: 40,
        color: 'white',
        backgroundColor: '#00aaff',
        isPressed: false,  // 添加一个标记按下状态的属性
        isHovered: false,  // 模拟 hover 效果
        image: new Image(),  // 用来存储图像对象
        imageWidth: 50,  // 图像的初始宽度
        imageHeight: 50,  // 图像的初始高度
        draw: function() {
            if(loginState===this.State){
                loginctx.fillStyle = this.isPressed ? '#006394' :this.isHovered ? '#0085c7': this.backgroundColor;
                const radius=15;
                const BtnX=this.x-this.width/2;
                const BtnY=this.y-this.height/2;

                loginctx.beginPath();
                loginctx.moveTo(BtnX + radius, BtnY); // 从左上角的圆角开始
                loginctx.arcTo(BtnX + this.width, BtnY, BtnX + this.width, BtnY + this.height, radius); // 右上角
                loginctx.arcTo(BtnX + this.width, BtnY + this.height, BtnX, BtnY + this.height, radius); // 右下角
                loginctx.arcTo(BtnX, BtnY + this.height, BtnX, BtnY, radius); // 左下角
                loginctx.arcTo(BtnX, BtnY, BtnX + this.width, BtnY, radius); // 左上角
                loginctx.closePath();
                loginctx.fill(); // 填充颜色
         
                loginctx.fillStyle = this.color;
                loginctx.font = `${this.fontSize*this.scale}px Arial`;
                loginctx.textAlign = 'center';
                loginctx.textBaseline = 'middle';
                
                loginctx.fillText(this.text, this.x, this.y);
            }
        },
        onClick: function(touchX, touchY) {
            // 判断点击是否在按钮区域内
            if(loginState===this.State){
                if (touchX >= this.x - this.width / 2 &&
                    touchX <= this.x + this.width / 2 &&
                    touchY >= this.y - this.height / 2 &&
                    touchY <= this.y + this.height / 2) {
                    // 按钮被点击时触发的操作
                    this.isPressed=true;
                    playSound('clickbutton');
                    setTimeout(() => {
                        this.isPressed = false;  // 延遲後恢復按鈕原狀
                        loginbuttonHover=false;
                    }, 200);
                    
                }
            }
        },
        setHovered: function(state) {
            if(loginState===this.State){
                this.isHovered = state;  // 设置 hover 状态
            }
        },
    },//loginButton
    {
        State:'login',
        name: 'forgetButton', // 开始按钮
        type: 'button', // 元素类型：按钮
        width: 200,
        height: 80,
        get x(){
            return getloginUI('loginbackground').x+150;
        },
        get y(){
            return getloginUI('loginbackground').y;
        },
        scale:1,
        text: '忘記密碼',
        fontSize: 40,
        color: 'white',
        backgroundColor: '#00aaff',
        isPressed: false,  // 添加一个标记按下状态的属性
        isHovered: false,  // 模拟 hover 效果
        image: new Image(),  // 用来存储图像对象
        imageWidth: 50,  // 图像的初始宽度
        imageHeight: 50,  // 图像的初始高度
        draw: function() {
            if(loginState===this.State){
                loginctx.fillStyle = this.isPressed ? '#006394' :this.isHovered ? '#0085c7': this.backgroundColor;
                const radius=15;
                const BtnX=this.x-this.width/2;
                const BtnY=this.y-this.height/2;

                loginctx.beginPath();
                loginctx.moveTo(BtnX + radius, BtnY); // 从左上角的圆角开始
                loginctx.arcTo(BtnX + this.width, BtnY, BtnX + this.width, BtnY + this.height, radius); // 右上角
                loginctx.arcTo(BtnX + this.width, BtnY + this.height, BtnX, BtnY + this.height, radius); // 右下角
                loginctx.arcTo(BtnX, BtnY + this.height, BtnX, BtnY, radius); // 左下角
                loginctx.arcTo(BtnX, BtnY, BtnX + this.width, BtnY, radius); // 左上角
                loginctx.closePath();
                loginctx.fill(); // 填充颜色

                loginctx.fillStyle = this.color;
                loginctx.font = `${this.fontSize*this.scale}px Arial`;
                loginctx.textAlign = 'center';
                loginctx.textBaseline = 'middle';
                
                loginctx.fillText(this.text, this.x, this.y);
            }
        },
        onClick: function(touchX, touchY) {
            // 判断点击是否在按钮区域内
            if(loginState===this.State){
                if (touchX >= this.x - this.width / 2 &&
                    touchX <= this.x + this.width / 2 &&
                    touchY >= this.y - this.height / 2 &&
                    touchY <= this.y + this.height / 2) {
                    // 按钮被点击时触发的操作
                    this.isPressed=true;
                    playSound('clickbutton');
                    setTimeout(() => {
                        this.isPressed = false;  // 延遲後恢復按鈕原狀
                        loginbuttonHover=false;
                    }, 200);
                }
            }
        },
        setHovered: function(state) {
            if(loginState===this.State){
                this.isHovered = state;  // 设置 hover 状态
            }
        },
    },//forgetButton
    {
        State:'login',
        name: 'registerButton', // 开始按钮
        type: 'button', // 元素类型：按钮
        width: 500,
        height: 80,
        get x(){
            return getloginUI('loginbackground').x;
        },
        get y(){
            return getloginUI('loginbackground').y+130;
        },
        scale:1,
        text: '我是現訂戶 我要註冊',
        fontSize: 40,
        color: 'white',
        backgroundColor: '#00aaff',
        isPressed: false,  // 添加一个标记按下状态的属性
        isHovered: false,  // 模拟 hover 效果
        image: new Image(),  // 用来存储图像对象
        imageWidth: 50,  // 图像的初始宽度
        imageHeight: 50,  // 图像的初始高度
        draw: function() {
            if(loginState===this.State){
                loginctx.fillStyle = this.isPressed ? '#006394' :this.isHovered ? '#0085c7': this.backgroundColor;
                const radius=15;
                const BtnX=this.x-this.width/2;
                const BtnY=this.y-this.height/2;

                loginctx.beginPath();
                loginctx.moveTo(BtnX + radius, BtnY); // 从左上角的圆角开始
                loginctx.arcTo(BtnX + this.width, BtnY, BtnX + this.width, BtnY + this.height, radius); // 右上角
                loginctx.arcTo(BtnX + this.width, BtnY + this.height, BtnX, BtnY + this.height, radius); // 右下角
                loginctx.arcTo(BtnX, BtnY + this.height, BtnX, BtnY, radius); // 左下角
                loginctx.arcTo(BtnX, BtnY, BtnX + this.width, BtnY, radius); // 左上角
                loginctx.closePath();
                loginctx.fill(); // 填充颜色
                
                loginctx.fillStyle = this.color;
                loginctx.font = `${this.fontSize*this.scale}px Arial`;
                loginctx.textAlign = 'center';
                loginctx.textBaseline = 'middle';
                
                loginctx.fillText(this.text, this.x, this.y);
            }
        },
        onClick: function(touchX, touchY) {
            // 判断点击是否在按钮区域内
            if(loginState===this.State){
                if (touchX >= this.x - this.width / 2 &&
                    touchX <= this.x + this.width / 2 &&
                    touchY >= this.y - this.height / 2 &&
                    touchY <= this.y + this.height / 2) {
                    // 按钮被点击时触发的操作
                    this.isPressed=true;
                    playSound('clickbutton');
                    setTimeout(() => {
                        this.isPressed = false;  // 延遲後恢復按鈕原狀
                        loginbuttonHover=false;
                    }, 200);  
                }
            }
        },
        setHovered: function(state) {
            if(loginState===this.State){
                this.isHovered = state;  // 设置 hover 状态
            }
        },
    },//registerButton
    {
        State:'login',
        name: 'experenceButton', // 开始按钮
        type: 'button', // 元素类型：按钮
        width: 200,
        height: 80,
        get x(){
            return getloginUI('loginbackground').x;
        },
        get y(){
            return getloginUI('loginbackground').y+getloginUI('loginbackground').height/3;
        },
        scale:1,
        text: '我要體驗',
        fontSize: 40,
        color: 'white',
        backgroundColor: '#00aaff',
        isPressed: false,  // 添加一个标记按下状态的属性
        isHovered: false,  // 模拟 hover 效果
        teachscale: 1,  // 控制图像的缩放
        scaleDirection: 1,  // 控制缩放方向，1 为放大，-1 为缩小
        scaleSpeed: 0.01,  // 控制缩放的速度
        image: new Image(),  // 用来存储图像对象
        imageWidth: 50,  // 图像的初始宽度
        imageHeight: 50,  // 图像的初始高度
        draw: function() {
            if(loginState===this.State){
                loginctx.fillStyle = this.isPressed ? '#006394' :this.isHovered ? '#0085c7': this.backgroundColor;
                const radius=15;
                const BtnX=this.x-this.width/2;
                const BtnY=this.y-this.height/2;

                loginctx.beginPath();
                loginctx.moveTo(BtnX + radius, BtnY); // 从左上角的圆角开始
                loginctx.arcTo(BtnX + this.width, BtnY, BtnX + this.width, BtnY + this.height, radius); // 右上角
                loginctx.arcTo(BtnX + this.width, BtnY + this.height, BtnX, BtnY + this.height, radius); // 右下角
                loginctx.arcTo(BtnX, BtnY + this.height, BtnX, BtnY, radius); // 左下角
                loginctx.arcTo(BtnX, BtnY, BtnX + this.width, BtnY, radius); // 左上角
                loginctx.closePath();
                loginctx.fill(); // 填充颜色
                
                loginctx.fillStyle = this.color;
                loginctx.font = `${this.fontSize*this.scale}px Arial`;
                loginctx.textAlign = 'center';
                loginctx.textBaseline = 'middle';
                
                loginctx.fillText(this.text, this.x, this.y);
                this.updateImageScale();
                this.image.src=url5+'/littlegame/new/images/teach.png';
                loginctx.drawImage(
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
            if(loginState===this.State){
                if (touchX >= this.x - this.width / 2 &&
                    touchX <= this.x + this.width / 2 &&
                    touchY >= this.y - this.height / 2 &&
                    touchY <= this.y + this.height / 2) {
                    // 按钮被点击时触发的操作
                    this.isPressed=true;
                    playSound('clickbutton');
                    setTimeout(() => {
                        this.isPressed = false;  // 延遲後恢復按鈕原狀
                        loginuiElements.forEach(element => {
                            element.isPressed=false;
                            element.isHovered=false;
                        });
                        loginbuttonHover=false;
                        console.log(getloginUI('password').passwordtext);
                        getloginUI('password').inputtext='';
                        getloginUI('password').passwordtext='';
                        getloginUI('characterbackground').currentcharacterIndex=0;
                        getloginUI('rightButton').teach=true;
                        getloginUI('chooseButton').teach=false;
                        getloginUI('nameButton').teach=false;
                        getloginUI('nameinput').teach=true;
                        getloginUI('nameinput').inputtext='';
                        playercharacter=0;
                        loginState="experience";
                    }, 200);
                    
                }
            }
        },
        setHovered: function(state) {
            if(loginState===this.State){
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
    },//experenceButton
    {
        State:'experience',
        name: 'experiencebackground', // 开始按钮
        type: 'background', // 元素类型：按钮
        width: 1500,
        height: 800,
        x: logincanvas.width / 2,
        y: logincanvas.height/2,
        backgroundColor: '#ffb1f1',
        draw: function() {
            if(loginState===this.State){
                loginctx.fillStyle = this.backgroundColor;
                const radius=15;
                const BtnX=this.x-this.width/2;
                const BtnY=this.y-this.height/2;

                loginctx.beginPath();
                loginctx.moveTo(BtnX + radius, BtnY); // 从左上角的圆角开始
                loginctx.arcTo(BtnX + this.width, BtnY, BtnX + this.width, BtnY + this.height, radius); // 右上角
                loginctx.arcTo(BtnX + this.width, BtnY + this.height, BtnX, BtnY + this.height, radius); // 右下角
                loginctx.arcTo(BtnX, BtnY + this.height, BtnX, BtnY, radius); // 左下角
                loginctx.arcTo(BtnX, BtnY, BtnX + this.width, BtnY, radius); // 左上角
                loginctx.closePath();
                loginctx.fill(); // 填充颜色
            }
        },
    },//experiencebackground
    {
        State:'experience',
        name: 'experienceInfo', // 游戏说明界面
        type: 'text', // 元素类型：文本
        get x(){
            return getloginUI('loginbackground').x;
        },
        get y(){
            return getloginUI('loginbackground').y-getloginUI('loginbackground').height/3;
        },
        text: '請問是初次體驗嗎',
        fontSize: 60,
        color: 'white',
        draw: function() {
            if(loginState===this.State){
                loginctx.font = `${this.fontSize}px Arial`;
                loginctx.textAlign = 'center';
                loginctx.textBaseline = 'middle';
                loginctx.fillStyle = this.color;
                loginctx.fillText(this.text, this.x, this.y);
            }
        }
    },//experienceInfo
    {
        State:'experience',
        name: 'yesButton', // 开始按钮
        type: 'button', // 元素类型：按钮
        width: 200,
        height: 80,
        get x(){
            return getloginUI('loginbackground').x-150;
        },
        get y(){
            return getloginUI('loginbackground').y+getloginUI('loginbackground').height/3;
        },
        scale:1,
        text: '是',
        fontSize: 40,
        color: 'white',
        backgroundColor: '#00aaff',
        isPressed: false,  // 添加一个标记按下状态的属性
        isHovered: false,  // 模拟 hover 效果
        image: new Image(),  // 用来存储图像对象
        imageWidth: 50,  // 图像的初始宽度
        imageHeight: 50,  // 图像的初始高度
        draw: function() {
            if(loginState===this.State){
                loginctx.fillStyle = this.isPressed ? '#006394' :this.isHovered ? '#0085c7': this.backgroundColor;
                const radius=15;
                const BtnX=this.x-this.width/2;
                const BtnY=this.y-this.height/2;

                loginctx.beginPath();
                loginctx.moveTo(BtnX + radius, BtnY); // 从左上角的圆角开始
                loginctx.arcTo(BtnX + this.width, BtnY, BtnX + this.width, BtnY + this.height, radius); // 右上角
                loginctx.arcTo(BtnX + this.width, BtnY + this.height, BtnX, BtnY + this.height, radius); // 右下角
                loginctx.arcTo(BtnX, BtnY + this.height, BtnX, BtnY, radius); // 左下角
                loginctx.arcTo(BtnX, BtnY, BtnX + this.width, BtnY, radius); // 左上角
                loginctx.closePath();
                loginctx.fill(); // 填充颜色
                
                loginctx.fillStyle = this.color;
                loginctx.font = `${this.fontSize*this.scale}px Arial`;
                loginctx.textAlign = 'center';
                loginctx.textBaseline = 'middle';
                
                loginctx.fillText(this.text, this.x, this.y);
            }
        },
        onClick: function(touchX, touchY) {
            // 判断点击是否在按钮区域内
            if(loginState===this.State){
                if (touchX >= this.x - this.width / 2 &&
                    touchX <= this.x + this.width / 2 &&
                    touchY >= this.y - this.height / 2 &&
                    touchY <= this.y + this.height / 2) {
                    // 按钮被点击时触发的操作
                    this.isPressed=true;
                    playSound('clickbutton');
                    setTimeout(() => {
                        this.isPressed = false;  // 延遲後恢復按鈕原狀
                        loginbuttonHover=false;
                        loginState="line";
                    }, 200);  
                }
            }
        },
        setHovered: function(state) {
            if(loginState===this.State){
                this.isHovered = state;  // 设置 hover 状态
            }
        },
    },//yesButton
    {
        State:'experience',
        name: 'noButton', // 开始按钮
        type: 'button', // 元素类型：按钮
        width: 200,
        height: 80,
        get x(){
            return getloginUI('loginbackground').x+150;
        },
        get y(){
            return getloginUI('loginbackground').y+getloginUI('loginbackground').height/3;
        },
        scale:1,
        text: '否',
        fontSize: 40,
        color: 'white',
        backgroundColor: '#00aaff',
        isPressed: false,  // 添加一个标记按下状态的属性
        isHovered: false,  // 模拟 hover 效果
        image: new Image(),  // 用来存储图像对象
        imageWidth: 50,  // 图像的初始宽度
        imageHeight: 50,  // 图像的初始高度
        draw: function() {
            if(loginState===this.State){
                loginctx.fillStyle = this.isPressed ? '#006394' :this.isHovered ? '#0085c7': this.backgroundColor;
                const radius=15;
                const BtnX=this.x-this.width/2;
                const BtnY=this.y-this.height/2;

                loginctx.beginPath();
                loginctx.moveTo(BtnX + radius, BtnY); // 从左上角的圆角开始
                loginctx.arcTo(BtnX + this.width, BtnY, BtnX + this.width, BtnY + this.height, radius); // 右上角
                loginctx.arcTo(BtnX + this.width, BtnY + this.height, BtnX, BtnY + this.height, radius); // 右下角
                loginctx.arcTo(BtnX, BtnY + this.height, BtnX, BtnY, radius); // 左下角
                loginctx.arcTo(BtnX, BtnY, BtnX + this.width, BtnY, radius); // 左上角
                loginctx.closePath();
                loginctx.fill(); // 填充颜色
           
                loginctx.fillStyle = this.color;
                loginctx.font = `${this.fontSize*this.scale}px Arial`;
                loginctx.textAlign = 'center';
                loginctx.textBaseline = 'middle';
                
                loginctx.fillText(this.text, this.x, this.y);
            }
        },
        onClick: function(touchX, touchY) {
            // 判断点击是否在按钮区域内
            if(loginState===this.State){
                if (touchX >= this.x - this.width / 2 &&
                    touchX <= this.x + this.width / 2 &&
                    touchY >= this.y - this.height / 2 &&
                    touchY <= this.y + this.height / 2) {
                    // 按钮被点击时触发的操作
                    this.isPressed=true;
                    playSound('clickbutton');
                    setTimeout(() => {
                        this.isPressed = false;  // 延遲後恢復按鈕原狀
                        loginbuttonHover=false;
                        loginState="character";
                    }, 200);
                    
                }
            }
        },
        setHovered: function(state) {
            if(loginState===this.State){
                this.isHovered = state;  // 设置 hover 状态
            }
        },
    },//noButton
    {
        State:'line',
        name: 'linebackground', // 开始按钮
        type: 'background', // 元素类型：按钮
        width: 1500,
        height: 800,
        x: logincanvas.width / 2,
        y: logincanvas.height/2,
        backgroundColor: '#ffb1f1',
        draw: function() {
            if(loginState===this.State){
                loginctx.fillStyle = this.backgroundColor;
                const radius=15;
                const BtnX=this.x-this.width/2;
                const BtnY=this.y-this.height/2;

                loginctx.beginPath();
                loginctx.moveTo(BtnX + radius, BtnY); // 从左上角的圆角开始
                loginctx.arcTo(BtnX + this.width, BtnY, BtnX + this.width, BtnY + this.height, radius); // 右上角
                loginctx.arcTo(BtnX + this.width, BtnY + this.height, BtnX, BtnY + this.height, radius); // 右下角
                loginctx.arcTo(BtnX, BtnY + this.height, BtnX, BtnY, radius); // 左下角
                loginctx.arcTo(BtnX, BtnY, BtnX + this.width, BtnY, radius); // 左上角
                loginctx.closePath();
                loginctx.fill(); // 填充颜色
            }
        },
    },//linebackground
    {
        State:'line',
        name: 'lineInfo', // 游戏说明界面
        type: 'text', // 元素类型：文本
        get x(){
            return getloginUI('loginbackground').x;
        },
        get y(){
            return getloginUI('loginbackground').y-getloginUI('loginbackground').height/3;
        },
        text: '請點擊下方按鈕綁定Line的小幫手',
        fontSize: 60,
        color: 'white',
        draw: function() {
            if(loginState===this.State){
                loginctx.font = `${this.fontSize}px Arial`;
                loginctx.textAlign = 'center';
                loginctx.textBaseline = 'middle';
                loginctx.fillStyle = this.color;
                loginctx.fillText(this.text, this.x, this.y);
            }
        }
    },//lineInfo
    {
        State:'line',
        name: 'lineButton', // 开始按钮
        type: 'button', // 元素类型：按钮
        width: 200,
        height: 80,
        get x(){
            return getloginUI('loginbackground').x;
        },
        get y(){
            return getloginUI('loginbackground').y+getloginUI('loginbackground').height/3;
        },
        scale:1,
        text: '確認',
        fontSize: 40,
        color: 'white',
        backgroundColor: '#00aaff',
        isPressed: false,  // 添加一个标记按下状态的属性
        isHovered: false,  // 模拟 hover 效果
        teachscale: 1,  // 控制图像的缩放
        scaleDirection: 1,  // 控制缩放方向，1 为放大，-1 为缩小
        scaleSpeed: 0.01,  // 控制缩放的速度
        image: new Image(),  // 用来存储图像对象
        imageWidth: 50,  // 图像的初始宽度
        imageHeight: 50,  // 图像的初始高度
        draw: function() {
            if(loginState===this.State){
                loginctx.fillStyle = this.isPressed ? '#006394' :this.isHovered ? '#0085c7': this.backgroundColor;
                const radius=15;
                const BtnX=this.x-this.width/2;
                const BtnY=this.y-this.height/2;

                loginctx.beginPath();
                loginctx.moveTo(BtnX + radius, BtnY); // 从左上角的圆角开始
                loginctx.arcTo(BtnX + this.width, BtnY, BtnX + this.width, BtnY + this.height, radius); // 右上角
                loginctx.arcTo(BtnX + this.width, BtnY + this.height, BtnX, BtnY + this.height, radius); // 右下角
                loginctx.arcTo(BtnX, BtnY + this.height, BtnX, BtnY, radius); // 左下角
                loginctx.arcTo(BtnX, BtnY, BtnX + this.width, BtnY, radius); // 左上角
                loginctx.closePath();
                loginctx.fill(); // 填充颜色
      
                loginctx.fillStyle = this.color;
                loginctx.font = `${this.fontSize*this.scale}px Arial`;
                loginctx.textAlign = 'center';
                loginctx.textBaseline = 'middle';
                
                loginctx.fillText(this.text, this.x, this.y);

                this.updateImageScale();
                this.image.src=url5+'/littlegame/new/images/teach.png';
                loginctx.drawImage(
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
            if(loginState===this.State){
                if (touchX >= this.x - this.width / 2 &&
                    touchX <= this.x + this.width / 2 &&
                    touchY >= this.y - this.height / 2 &&
                    touchY <= this.y + this.height / 2) {
                    // 按钮被点击时触发的操作
                    this.isPressed=true;
                    playSound('clickbutton');
                    setTimeout(() => {
                        this.isPressed = false;  // 延遲後恢復按鈕原狀
                        loginbuttonHover=false;
                        loginState="character";
                        window.open("https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=2006583270&redirect_uri=http://35.229.172.176/api/public/api/register&state=1321&bot_prompt=aggressive&scope=profile", "_blank");
                    }, 200);
                    
                }
            }
        },
        setHovered: function(state) {
            if(loginState===this.State){
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
    },//lineButton
    {
        State:'character',
        name: 'characterbackground', // 开始按钮
        type: 'background', // 元素类型：按钮
        width: 800,
        height: 800,
        text: '選擇角色',
        fontSize: 60,
        color: 'white',
        x: logincanvas.width / 2,
        y: logincanvas.height/2,
        image:new Image,
        get imageX() {
            return (this.x-characterImage[this.currentcharacterIndex].imageWidth/2); // 居中對話框
        },
        get imageY() {
            return (this.y-characterImage[this.currentcharacterIndex].imageHeight/2-50); // 居中對話框
        },
        backgroundColor: '#cfa56f',
        currentcharacterIndex:0,  // 當前顯示的圖片索引
        draw: function() {
            if(loginState===this.State){
                loginctx.fillStyle = this.backgroundColor;
                const radius=15;
                const BtnX=this.x-this.width/2;
                const BtnY=this.y-this.height/2;

                loginctx.beginPath();
                loginctx.moveTo(BtnX + radius, BtnY); // 从左上角的圆角开始
                loginctx.arcTo(BtnX + this.width, BtnY, BtnX + this.width, BtnY + this.height, radius); // 右上角
                loginctx.arcTo(BtnX + this.width, BtnY + this.height, BtnX, BtnY + this.height, radius); // 右下角
                loginctx.arcTo(BtnX, BtnY + this.height, BtnX, BtnY, radius); // 左下角
                loginctx.arcTo(BtnX, BtnY, BtnX + this.width, BtnY, radius); // 左上角
                loginctx.closePath();
                loginctx.fill(); // 填充颜色

                loginctx.fillStyle = this.color;
                loginctx.font = `bold ${this.fontSize}px Arial`;
                loginctx.textAlign = 'center';
                loginctx.textBaseline = 'middle';
                loginctx.fillText(this.text, this.x, this.y-this.height/2.5);
                loginctx.fillStyle = 'black';
                loginctx.fillText(characterImage[this.currentcharacterIndex].name, this.x, this.y+this.height/2-200);

                // 畫圖片
                this.image.src=characterImage[this.currentcharacterIndex].img;
                loginctx.drawImage(this.image, this.imageX, this.imageY, characterImage[this.currentcharacterIndex].imageWidth, characterImage[this.currentcharacterIndex].imageHeight);
            }
        },
        changecharacter: function(direction) {
            let length=characterImage.length;
            if (direction === 'left') {
                this.currentcharacterIndex = (this.currentcharacterIndex - 1 + length) % length;
            } else if (direction === 'right') {
                this.currentcharacterIndex = (this.currentcharacterIndex + 1) % length;
            }
            if(this.currentcharacterIndex==3){
                getloginUI('rightButton').teach=false;
                getloginUI('chooseButton').teach=true;
            }
        }
    },//characterbackground
    {
        State:'character',
        name: 'chooseButton', // 开始按钮
        type: 'button', // 元素类型：按钮
        width: 200,
        height: 80,
        get x(){
            return getloginUI('characterbackground').x;
        },
        get y(){
            return getloginUI('characterbackground').y+getloginUI('characterbackground').height/2.5;
        },
        scale:1,
        text: '確認',
        fontSize: 40,
        color: 'white',
        backgroundColor: '#00aaff',
        isPressed: false,  // 添加一个标记按下状态的属性
        isHovered: false,  // 模拟 hover 效果
        teachscale: 1,  // 控制图像的缩放
        scaleDirection: 1,  // 控制缩放方向，1 为放大，-1 为缩小
        scaleSpeed: 0.01,  // 控制缩放的速度
        image: new Image(),  // 用来存储图像对象
        imageWidth: 50,  // 图像的初始宽度
        imageHeight: 50,  // 图像的初始高度
        teach:false,
        draw: function() {
            if(loginState===this.State){
                loginctx.fillStyle = this.isPressed ? '#006394' :this.isHovered ? '#0085c7': this.backgroundColor;
                const radius=15;
                const BtnX=this.x-this.width/2;
                const BtnY=this.y-this.height/2;

                loginctx.beginPath();
                loginctx.moveTo(BtnX + radius, BtnY); // 从左上角的圆角开始
                loginctx.arcTo(BtnX + this.width, BtnY, BtnX + this.width, BtnY + this.height, radius); // 右上角
                loginctx.arcTo(BtnX + this.width, BtnY + this.height, BtnX, BtnY + this.height, radius); // 右下角
                loginctx.arcTo(BtnX, BtnY + this.height, BtnX, BtnY, radius); // 左下角
                loginctx.arcTo(BtnX, BtnY, BtnX + this.width, BtnY, radius); // 左上角
                loginctx.closePath();
                loginctx.fill(); // 填充颜色
      
                loginctx.fillStyle = this.color;
                loginctx.font = `${this.fontSize*this.scale}px Arial`;
                loginctx.textAlign = 'center';
                loginctx.textBaseline = 'middle';
                
                loginctx.fillText(this.text, this.x, this.y);
                if(this.teach){
                    this.updateImageScale();
                    this.image.src=url5+'/littlegame/new/images/teach.png';
                    loginctx.drawImage(
                        this.image, 
                        this.x + this.width / 2 - this.imageWidth / 2,  // 图像 X 轴位置：右下角
                        this.y + this.height / 2 - this.imageHeight / 2,  // 图像 Y 轴位置：右下角
                        this.imageWidth * this.teachscale,  // 图像的缩放宽度
                        this.imageHeight * this.teachscale  // 图像的缩放高度
                    );
                }
            }
        },
        onClick: function(touchX, touchY) {
            // 判断点击是否在按钮区域内
            if(loginState===this.State){
                if (touchX >= this.x - this.width / 2 &&
                    touchX <= this.x + this.width / 2 &&
                    touchY >= this.y - this.height / 2 &&
                    touchY <= this.y + this.height / 2) {
                    // 按钮被点击时触发的操作
                    this.isPressed=true;
                    playSound('clickbutton');
                    setTimeout(() => {
                        this.isPressed = false;  // 延遲後恢復按鈕原狀
                        if(this.teach){
                           
                            loginuiElements.forEach(element => {
                                element.isPressed=false;
                                element.isHovered=false;
                            });
                            loginbuttonHover=false;
                            playercharacter=getloginUI('characterbackground').currentcharacterIndex;
                            loginState='name';
                        }
                    }, 200);    
                }
            }
        },
        setHovered: function(state) {
            if(loginState===this.State){
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
    },//chooseButton
    {
        State:'character',
        name: 'leftButton', // 开始按钮
        type: 'button', // 元素类型：按钮
        width: 80,
        height: 80,
        get x(){
            return getloginUI('characterbackground').x-getloginUI('characterbackground').width/2+40;
        },
        get y(){
            return getloginUI('characterbackground').y;
        },
        scale:1,
        text: '◀',
        fontSize: 60,
        color: 'black',
        backgroundColor: '#00aaff',
        isPressed: false,  // 添加一个标记按下状态的属性
        isHovered: false,  // 模拟 hover 效果
        teachscale: 1,  // 控制图像的缩放
        scaleDirection: 1,  // 控制缩放方向，1 为放大，-1 为缩小
        scaleSpeed: 0.01,  // 控制缩放的速度
        image: new Image(),  // 用来存储图像对象
        imageWidth: 50,  // 图像的初始宽度
        imageHeight: 50,  // 图像的初始高度
        teach:false,
        draw: function() {
            if(loginState===this.State){
                loginctx.fillStyle = this.isPressed ? '#006394' :this.isHovered ? '#0085c7': this.backgroundColor;
                const radius=15;
                const BtnX=this.x-this.width/2;
                const BtnY=this.y-this.height/2;

                loginctx.beginPath();
                loginctx.moveTo(BtnX + radius, BtnY); // 从左上角的圆角开始
                loginctx.arcTo(BtnX + this.width, BtnY, BtnX + this.width, BtnY + this.height, radius); // 右上角
                loginctx.arcTo(BtnX + this.width, BtnY + this.height, BtnX, BtnY + this.height, radius); // 右下角
                loginctx.arcTo(BtnX, BtnY + this.height, BtnX, BtnY, radius); // 左下角
                loginctx.arcTo(BtnX, BtnY, BtnX + this.width, BtnY, radius); // 左上角
                loginctx.closePath();
                loginctx.fill(); // 填充颜色
              
                loginctx.fillStyle = this.color;
                loginctx.font = `${this.fontSize*this.scale}px Arial`;
                loginctx.textAlign = 'center';
                loginctx.textBaseline = 'middle';
                
                loginctx.fillText(this.text, this.x, this.y);
                if(this.teach){
                    this.updateImageScale();
                    this.image.src=url5+'/littlegame/new/images/teach.png';
                    loginctx.drawImage(
                        this.image, 
                        this.x + this.width / 2 - this.imageWidth / 2,  // 图像 X 轴位置：右下角
                        this.y + this.height / 2 - this.imageHeight / 2,  // 图像 Y 轴位置：右下角
                        this.imageWidth * this.teachscale,  // 图像的缩放宽度
                        this.imageHeight * this.teachscale  // 图像的缩放高度
                    );
                }
            }
        },
        onClick: function(touchX, touchY) {
            // 判断点击是否在按钮区域内
            if(loginState===this.State){
                if (touchX >= this.x - this.width / 2 &&
                    touchX <= this.x + this.width / 2 &&
                    touchY >= this.y - this.height / 2 &&
                    touchY <= this.y + this.height / 2) {
                    // 按钮被点击时触发的操作
                    this.isPressed=true;
                    playSound('clickbutton');
                    setTimeout(() => {
                        this.isPressed = false;  // 延遲後恢復按鈕原狀
                        if(this.teach){
                            getloginUI('characterbackground').changecharacter('left');
                            }
                    }, 200);
                }
            }
        },
        setHovered: function(state) {
            if(loginState===this.State){
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
    },//leftButton
    {
        State:'character',
        name: 'rightButton', // 开始按钮
        type: 'button', // 元素类型：按钮
        width: 80,
        height: 80,
        get x(){
            return getloginUI('characterbackground').x+getloginUI('characterbackground').width/2-40;
        },
        get y(){
            return getloginUI('characterbackground').y;
        },
        scale:1,
        text: '▶',
        fontSize: 60,
        color: 'black',
        backgroundColor: '#00aaff',
        isPressed: false,  // 添加一个标记按下状态的属性
        isHovered: false,  // 模拟 hover 效果
        teachscale: 1,  // 控制图像的缩放
        scaleDirection: 1,  // 控制缩放方向，1 为放大，-1 为缩小
        scaleSpeed: 0.01,  // 控制缩放的速度
        image: new Image(),  // 用来存储图像对象
        imageWidth: 50,  // 图像的初始宽度
        imageHeight: 50,  // 图像的初始高度
        teach:true,
        draw: function() {
            if(loginState===this.State){
                loginctx.fillStyle = this.isPressed ? '#006394' :this.isHovered ? '#0085c7': this.backgroundColor;
                const radius=15;
                const BtnX=this.x-this.width/2;
                const BtnY=this.y-this.height/2;

                loginctx.beginPath();
                loginctx.moveTo(BtnX + radius, BtnY); // 从左上角的圆角开始
                loginctx.arcTo(BtnX + this.width, BtnY, BtnX + this.width, BtnY + this.height, radius); // 右上角
                loginctx.arcTo(BtnX + this.width, BtnY + this.height, BtnX, BtnY + this.height, radius); // 右下角
                loginctx.arcTo(BtnX, BtnY + this.height, BtnX, BtnY, radius); // 左下角
                loginctx.arcTo(BtnX, BtnY, BtnX + this.width, BtnY, radius); // 左上角
                loginctx.closePath();
                loginctx.fill(); // 填充颜色
                
                loginctx.fillStyle = this.color;
                loginctx.font = `${this.fontSize*this.scale}px Arial`;
                loginctx.textAlign = 'center';
                loginctx.textBaseline = 'middle';
                
                loginctx.fillText(this.text, this.x, this.y);
                if(this.teach){
                    this.updateImageScale();
                    this.image.src=url5+'/littlegame/new/images/teach.png';
                    loginctx.drawImage(
                        this.image, 
                        this.x + this.width / 2 - this.imageWidth / 2,  // 图像 X 轴位置：右下角
                        this.y + this.height / 2 - this.imageHeight / 2,  // 图像 Y 轴位置：右下角
                        this.imageWidth * this.teachscale,  // 图像的缩放宽度
                        this.imageHeight * this.teachscale  // 图像的缩放高度
                    );
                }
            }
        },
        onClick: function(touchX, touchY) {
            // 判断点击是否在按钮区域内
            if(loginState===this.State){
                if (touchX >= this.x - this.width / 2 &&
                    touchX <= this.x + this.width / 2 &&
                    touchY >= this.y - this.height / 2 &&
                    touchY <= this.y + this.height / 2) {
                    // 按钮被点击时触发的操作
                    this.isPressed=true;
                    playSound('clickbutton');
                    setTimeout(() => {
                        this.isPressed = false;  // 延遲後恢復按鈕原狀
                        if(this.teach){
                            getloginUI('characterbackground').changecharacter('right');
                        }
                    }, 200);
                }
            }
        },
        setHovered: function(state) {
            if(loginState===this.State){
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
    },//rightButton
    {
        State:'character',
        name: 'characterbackButton', // 开始按钮
        type: 'button', // 元素类型：按钮
        width: 200,
        height: 80,
        get x(){
            return getloginUI('characterbackground').x-getloginUI('characterbackground').width/2+110;
        },
        get y(){
            return getloginUI('characterbackground').y-getloginUI('characterbackground').height/2+50;
        },
        scale:1,
        text: '⬅',
        fontSize: 80,
        color: 'white',
        backgroundColor: '#00aaff',
        isPressed: false,  // 添加一个标记按下状态的属性
        isHovered: false,  // 模拟 hover 效果
        teachscale: 1,  // 控制图像的缩放
        scaleDirection: 1,  // 控制缩放方向，1 为放大，-1 为缩小
        scaleSpeed: 0.01,  // 控制缩放的速度
        image: new Image(),  // 用来存储图像对象
        imageWidth: 50,  // 图像的初始宽度
        imageHeight: 50,  // 图像的初始高度
        teach:false,
        draw: function() {
            if(loginState===this.State){
                loginctx.fillStyle = this.isPressed ? '#006394' :this.isHovered ? '#0085c7': this.backgroundColor;
                const radius=15;
                const BtnX=this.x-this.width/2;
                const BtnY=this.y-this.height/2;

                loginctx.beginPath();
                loginctx.moveTo(BtnX + radius, BtnY); // 从左上角的圆角开始
                loginctx.arcTo(BtnX + this.width, BtnY, BtnX + this.width, BtnY + this.height, radius); // 右上角
                loginctx.arcTo(BtnX + this.width, BtnY + this.height, BtnX, BtnY + this.height, radius); // 右下角
                loginctx.arcTo(BtnX, BtnY + this.height, BtnX, BtnY, radius); // 左下角
                loginctx.arcTo(BtnX, BtnY, BtnX + this.width, BtnY, radius); // 左上角
                loginctx.closePath();
                loginctx.fill(); // 填充颜色
                
                loginctx.fillStyle = this.color;
                loginctx.font = `${this.fontSize*this.scale}px Arial`;
                loginctx.textAlign = 'center';
                loginctx.textBaseline = 'middle';
                
                loginctx.fillText(this.text, this.x, this.y);
                if(this.teach){
                    this.updateImageScale();
                    this.image.src=url5+'/littlegame/new/images/teach.png';
                    loginctx.drawImage(
                        this.image, 
                        this.x + this.width / 2 - this.imageWidth / 2,  // 图像 X 轴位置：右下角
                        this.y + this.height / 2 - this.imageHeight / 2,  // 图像 Y 轴位置：右下角
                        this.imageWidth * this.teachscale,  // 图像的缩放宽度
                        this.imageHeight * this.teachscale  // 图像的缩放高度
                    );
                }
                
            }
        },
        onClick: function(touchX, touchY) {
            // 判断点击是否在按钮区域内
            if(loginState===this.State){
                if (touchX >= this.x - this.width / 2 &&
                    touchX <= this.x + this.width / 2 &&
                    touchY >= this.y - this.height / 2 &&
                    touchY <= this.y + this.height / 2) {
                    // 按钮被点击时触发的操作
                    this.isPressed=true;
                    playSound('clickbutton');
                    setTimeout(() => {
                        this.isPressed = false;  // 延遲後恢復按鈕原狀
                        if(this.teach){
                            loginuiElements.forEach(element => {
                                element.isPressed=false;
                                element.isHovered=false;
                            });
                            loginbuttonHover=false;
                            getloginUI('characterbackground').currentcharacterIndex=0;
                            playercharacter=0;
                            loginState='login';
                        }
                    }, 200);
                }
            }
        },
        setHovered: function(state) {
            if(loginState===this.State){
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
    },//characterbackButton
    {
        State:'name',
        name: 'namebackground', // 开始按钮
        type: 'background', // 元素类型：按钮
        width: 800,
        height: 800,
        text: '玩家名稱',
        fontSize: 60,
        color: 'white',
        x: logincanvas.width / 2,
        y: logincanvas.height/2,
        image:new Image(),
        get imageX() {
            return (this.x-characterImage[playercharacter].imageWidth/2); // 居中對話框
        },
        get imageY() {
            return (this.y-characterImage[playercharacter].imageHeight/2-50); // 居中對話框
        },
        backgroundColor: '#cfa56f',
        draw: function() {
            if(loginState===this.State){
                loginctx.fillStyle = this.backgroundColor;
                const radius=15;
                const BtnX=this.x-this.width/2;
                const BtnY=this.y-this.height/2;

                loginctx.beginPath();
                loginctx.moveTo(BtnX + radius, BtnY); // 从左上角的圆角开始
                loginctx.arcTo(BtnX + this.width, BtnY, BtnX + this.width, BtnY + this.height, radius); // 右上角
                loginctx.arcTo(BtnX + this.width, BtnY + this.height, BtnX, BtnY + this.height, radius); // 右下角
                loginctx.arcTo(BtnX, BtnY + this.height, BtnX, BtnY, radius); // 左下角
                loginctx.arcTo(BtnX, BtnY, BtnX + this.width, BtnY, radius); // 左上角
                loginctx.closePath();
                loginctx.fill(); // 填充颜色

                loginctx.fillStyle = this.color;
                loginctx.font = `bold ${this.fontSize}px Arial`;
                loginctx.textAlign = 'center';
                loginctx.textBaseline = 'middle';
                loginctx.fillText(this.text, this.x, this.y-this.height/2.5);

                // 畫圖片
                this.image.src=characterImage[playercharacter].img;
                loginctx.drawImage(this.image, this.imageX, this.imageY, characterImage[playercharacter].imageWidth, characterImage[playercharacter].imageHeight);
            }
        },
    },//namebackground
    {
        State:'name',
        name: 'nameinput', // 开始按钮
        type: 'input', // 元素类型：按钮
        width: 400,
        height: 80,
        get x(){
            return getloginUI('namebackground').x;
        },
        get y(){
            return getloginUI('namebackground').y+getloginUI('namebackground').height/4;
        },
        scale:1,
        text: '',
        inputtext:'',
        fontSize: 40,
        maxLength:8,
        color: 'black',
        backgroundColor: '#00aaff',
        cursorVisible : true,  // 控制光標是否顯示
        cursorPosition : 0,  // 光標的位置，控制字符的插入位置
        cursorWidth : 2, // 設置光標的寬度
        isPressed: false,  // 添加一个标记按下状态的属性
        isHovered: false,  // 模拟 hover 效果
        teachscale: 1,  // 控制图像的缩放
        scaleDirection: 1,  // 控制缩放方向，1 为放大，-1 为缩小
        scaleSpeed: 0.01,  // 控制缩放的速度
        image: new Image(),  // 用来存储图像对象
        imageWidth: 50,  // 图像的初始宽度
        imageHeight: 50,  // 图像的初始高度
        teach:true,
        intervalId:null,
        draw: function() {
            if(loginState===this.State){
                loginctx.fillStyle = this.isPressed ? '#0066cb' :this.isHovered ? '#0066cb': this.backgroundColor;
                const radius=15;
                const BtnX=this.x-this.width/2;
                const BtnY=this.y-this.height/2;

                loginctx.beginPath();
                loginctx.moveTo(BtnX + radius, BtnY); // 从左上角的圆角开始
                loginctx.arcTo(BtnX + this.width, BtnY, BtnX + this.width, BtnY + this.height, radius); // 右上角
                loginctx.arcTo(BtnX + this.width, BtnY + this.height, BtnX, BtnY + this.height, radius); // 右下角
                loginctx.arcTo(BtnX, BtnY + this.height, BtnX, BtnY, radius); // 左下角
                loginctx.arcTo(BtnX, BtnY, BtnX + this.width, BtnY, radius); // 左上角
                loginctx.closePath();
                loginctx.fill(); // 填充颜色
                
                loginctx.fillStyle = this.color;
                loginctx.font = `${this.fontSize*this.scale}px Arial`;
                loginctx.textAlign = 'center';
                loginctx.textBaseline = 'middle';
                
                loginctx.fillText(this.inputtext, this.x, this.y);
                if(this.teach){
                    this.updateImageScale();
                    this.image.src=url5+'/littlegame/new/images/teach.png';
                    loginctx.drawImage(
                        this.image, 
                        this.x + this.width / 2 - this.imageWidth / 2,  // 图像 X 轴位置：右下角
                        this.y + this.height / 2 - this.imageHeight / 2,  // 图像 Y 轴位置：右下角
                        this.imageWidth * this.teachscale,  // 图像的缩放宽度
                        this.imageHeight * this.teachscale  // 图像的缩放高度
                    );
                }
                /*if (this.cursorVisible) {
                    const cursorX = loginctx.measureText(this.inputtext.slice(0, this.cursorPosition)).width;  // 計算光標位置
                    loginctx.fillStyle = 'black';
                    loginctx.fillRect(cursorX+this.x, this.y-this.fontSize/2, this.cursorWidth, this.fontSize);  // 繪製光標（豎線）
                    console.log(cursorX)
                }*/
            }
        },
        onInput: function(touchX, touchY) {
            // 判断点击是否在按钮区域内
            if(loginState===this.State){
                if (touchX >= this.x - this.width / 2 &&
                    touchX <= this.x + this.width / 2 &&
                    touchY >= this.y - this.height / 2 &&
                    touchY <= this.y + this.height / 2) {
                    // 按钮被点击时触发的操作
                    this.isPressed=true;
                    inputField.blur();   // 移除焦點
                    setTimeout(() => {
                        this.isPressed = false;  // 延遲後恢復按鈕原狀
                        loginbuttonHover=false;
                        focusIndex=this.name;
                        inputField.value =this.inputtext;
                        inputField.focus(); // 聚焦到輸入框
                        this.teach=false;
                        getloginUI('nameButton').teach=true;
                    }, 200);
                    /*this.intervalId = setInterval(() => {
                        this.cursorVisible = !this.cursorVisible;
                        console.log(this.cursorVisible)
                        
                    }, 1000);*/ 
                }
            }
        },
        setHovered: function(state) {
            if(loginState===this.State){
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
        StopcursorVisible:function(){
            clearInterval(this.intervalId);
        }
    },//nameinput
    {
        State:'name',
        name: 'nameButton', // 开始按钮
        type: 'button', // 元素类型：按钮
        width: 200,
        height: 80,
        get x(){
            return getloginUI('namebackground').x;
        },
        get y(){
            return getloginUI('namebackground').y+getloginUI('namebackground').height/2.5;
        },
        scale:1,
        text: '確認',
        fontSize: 40,
        color: 'white',
        backgroundColor: '#00aaff',
        isPressed: false,  // 添加一个标记按下状态的属性
        isHovered: false,  // 模拟 hover 效果
        teachscale: 1,  // 控制图像的缩放
        scaleDirection: 1,  // 控制缩放方向，1 为放大，-1 为缩小
        scaleSpeed: 0.01,  // 控制缩放的速度
        image: new Image(),  // 用来存储图像对象
        imageWidth: 50,  // 图像的初始宽度
        imageHeight: 50,  // 图像的初始高度
        teach:false,
        draw: function() {
            if(loginState===this.State){
                loginctx.fillStyle = this.isPressed ? '#006394' :this.isHovered ? '#0085c7': this.backgroundColor;
                const radius=15;
                const BtnX=this.x-this.width/2;
                const BtnY=this.y-this.height/2;

                loginctx.beginPath();
                loginctx.moveTo(BtnX + radius, BtnY); // 从左上角的圆角开始
                loginctx.arcTo(BtnX + this.width, BtnY, BtnX + this.width, BtnY + this.height, radius); // 右上角
                loginctx.arcTo(BtnX + this.width, BtnY + this.height, BtnX, BtnY + this.height, radius); // 右下角
                loginctx.arcTo(BtnX, BtnY + this.height, BtnX, BtnY, radius); // 左下角
                loginctx.arcTo(BtnX, BtnY, BtnX + this.width, BtnY, radius); // 左上角
                loginctx.closePath();
                loginctx.fill(); // 填充颜色
                
                loginctx.fillStyle = this.color;
                loginctx.font = `${this.fontSize*this.scale}px Arial`;
                loginctx.textAlign = 'center';
                loginctx.textBaseline = 'middle';
                
                loginctx.fillText(this.text, this.x, this.y);
                if(this.teach){
                    this.updateImageScale();
                    this.image.src=url5+'/littlegame/new/images/teach.png';
                    loginctx.drawImage(
                        this.image, 
                        this.x + this.width / 2 - this.imageWidth / 2,  // 图像 X 轴位置：右下角
                        this.y + this.height / 2 - this.imageHeight / 2,  // 图像 Y 轴位置：右下角
                        this.imageWidth * this.teachscale,  // 图像的缩放宽度
                        this.imageHeight * this.teachscale  // 图像的缩放高度
                    );
                }
                
            }
        },
        onClick: function(touchX, touchY) {
            // 判断点击是否在按钮区域内
            if(loginState===this.State){
                if (touchX >= this.x - this.width / 2 &&
                    touchX <= this.x + this.width / 2 &&
                    touchY >= this.y - this.height / 2 &&
                    touchY <= this.y + this.height / 2) {
                    // 按钮被点击时触发的操作
                    this.isPressed=true;
                    playSound('clickbutton');
                    setTimeout(() => {
                        this.isPressed = false;  // 延遲後恢復按鈕原狀
                        if(this.teach){
                            loginuiElements.forEach(element => {
                                element.isPressed=false;
                                element.isHovered=false;
                            });
                            loginbuttonHover=false;
                            playername=getloginUI('nameinput').inputtext;
                            player.name=playername;
                            playerImage.src=characterImage[playercharacter].img;
                            loading=true;
                            loginState='end';
                            setTimeout(() => {
                                teach.index=0;
                                teach.canmove=true;
                                loadGame2();
                                loading=false;
                            }, 3000);
                        }
                        //loadGame2();
                    }, 200);  
                }
            }
        },
        setHovered: function(state) {
            if(loginState===this.State){
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
    },//nameButton
    {
        State:'name',
        name: 'namebackButton', // 开始按钮
        type: 'button', // 元素类型：按钮
        width: 200,
        height: 80,
        get x(){
            return getloginUI('namebackground').x-getloginUI('namebackground').width/2+110;
        },
        get y(){
            return getloginUI('namebackground').y-getloginUI('namebackground').height/2+50;
        },
        scale:1,
        text: '⬅',
        fontSize: 80,
        color: 'white',
        backgroundColor: '#00aaff',
        isPressed: false,  // 添加一个标记按下状态的属性
        isHovered: false,  // 模拟 hover 效果
        teachscale: 1,  // 控制图像的缩放
        scaleDirection: 1,  // 控制缩放方向，1 为放大，-1 为缩小
        scaleSpeed: 0.01,  // 控制缩放的速度
        image: new Image(),  // 用来存储图像对象
        imageWidth: 50,  // 图像的初始宽度
        imageHeight: 50,  // 图像的初始高度
        teach:false,
        draw: function() {
            if(loginState===this.State){
                loginctx.fillStyle = this.isPressed ? '#006394' :this.isHovered ? '#0085c7': this.backgroundColor;
                const radius=15;
                const BtnX=this.x-this.width/2;
                const BtnY=this.y-this.height/2;

                loginctx.beginPath();
                loginctx.moveTo(BtnX + radius, BtnY); // 从左上角的圆角开始
                loginctx.arcTo(BtnX + this.width, BtnY, BtnX + this.width, BtnY + this.height, radius); // 右上角
                loginctx.arcTo(BtnX + this.width, BtnY + this.height, BtnX, BtnY + this.height, radius); // 右下角
                loginctx.arcTo(BtnX, BtnY + this.height, BtnX, BtnY, radius); // 左下角
                loginctx.arcTo(BtnX, BtnY, BtnX + this.width, BtnY, radius); // 左上角
                loginctx.closePath();
                loginctx.fill(); // 填充颜色
                
                loginctx.fillStyle = this.color;
                loginctx.font = `${this.fontSize*this.scale}px Arial`;
                loginctx.textAlign = 'center';
                loginctx.textBaseline = 'middle';
                
                loginctx.fillText(this.text, this.x, this.y);
                if(this.teach){
                    this.updateImageScale();
                    this.image.src=url5+'/littlegame/new/images/teach.png';
                    loginctx.drawImage(
                        this.image, 
                        this.x + this.width / 2 - this.imageWidth / 2,  // 图像 X 轴位置：右下角
                        this.y + this.height / 2 - this.imageHeight / 2,  // 图像 Y 轴位置：右下角
                        this.imageWidth * this.teachscale,  // 图像的缩放宽度
                        this.imageHeight * this.teachscale  // 图像的缩放高度
                    );
                }
            }
        },
        onClick: function(touchX, touchY) {
            // 判断点击是否在按钮区域内
            if(loginState===this.State){
                if (touchX >= this.x - this.width / 2 &&
                    touchX <= this.x + this.width / 2 &&
                    touchY >= this.y - this.height / 2 &&
                    touchY <= this.y + this.height / 2) {
                    // 按钮被点击时触发的操作
                    this.isPressed=true;
                    playSound('clickbutton');
                    setTimeout(() => {
                        this.isPressed = false;  // 延遲後恢復按鈕原狀
                        if(this.teach){
                            loginuiElements.forEach(element => {
                                element.isPressed=false;
                                element.isHovered=false;
                            });
                            loginbuttonHover=false;
                            getloginUI('nameinput').inputtext=''
                            getloginUI('nameButton').teach=false;
                            getloginUI('nameinput').teach=true;
                            loginState='character';
                        }
                    }, 200);    
                }
            }
        },
        setHovered: function(state) {
            if(loginState===this.State){
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
    },//namebackButton
    {
        State:'end',
        name: 'homeButton', // 开始按钮
        type: 'button', // 元素类型：按钮
        width: 200,
        height: 80,
        x: logincanvas.width / 2,
        y: logincanvas.height/1.1,
        scale:1,
        text: '回首頁',
        fontSize: 40,
        color: 'white',
        backgroundColor: '#00aaff',
        isPressed: false,  // 添加一个标记按下状态的属性
        isHovered: false,  // 模拟 hover 效果
        teachscale: 1,  // 控制图像的缩放
        scaleDirection: 1,  // 控制缩放方向，1 为放大，-1 为缩小
        scaleSpeed: 0.01,  // 控制缩放的速度
        image: new Image(),  // 用来存储图像对象
        imageWidth: 50,  // 图像的初始宽度
        imageHeight: 50,  // 图像的初始高度
        draw: function() {
            if(loginState===this.State){
                logincanvas.style.cursor =this.isHovered ? 'pointer' : 'default';
                loginctx.fillStyle = this.isPressed ? '#006394' :this.isHovered ? '#0085c7': this.backgroundColor;
                const radius=15;
                const BtnX=this.x-this.width/2;
                const BtnY=this.y-this.height/2;

                loginctx.beginPath();
                loginctx.moveTo(BtnX + radius, BtnY); // 从左上角的圆角开始
                loginctx.arcTo(BtnX + this.width, BtnY, BtnX + this.width, BtnY + this.height, radius); // 右上角
                loginctx.arcTo(BtnX + this.width, BtnY + this.height, BtnX, BtnY + this.height, radius); // 右下角
                loginctx.arcTo(BtnX, BtnY + this.height, BtnX, BtnY, radius); // 左下角
                loginctx.arcTo(BtnX, BtnY, BtnX + this.width, BtnY, radius); // 左上角
                loginctx.closePath();
                loginctx.fill(); // 填充颜色
                
                loginctx.fillStyle = this.color;
                loginctx.font = `${this.fontSize*this.scale}px Arial`;
                loginctx.textAlign = 'center';
                loginctx.textBaseline = 'middle';
                
                loginctx.fillText(this.text, this.x, this.y);
            }
        },
        onClick: function(touchX, touchY) {
            // 判断点击是否在按钮区域内
            if(loginState===this.State){
                if (touchX >= this.x - this.width / 2 &&
                    touchX <= this.x + this.width / 2 &&
                    touchY >= this.y - this.height / 2 &&
                    touchY <= this.y + this.height / 2) {
                    // 按钮被点击时触发的操作
                    this.isPressed=true;
                    playSound('clickbutton');
                    setTimeout(() => {
                        this.isPressed = false;  // 延遲後恢復按鈕原狀
                        loginState="start";
                        loginbuttonHover=false;
                    }, 200); 
                }
            }
        },
        setHovered: function(state) {
            if(loginState===this.State){
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
    },//homeButton
    {
        State:'end',
        name: 'endInfo', // 游戏说明界面
        type: 'text', // 元素类型：文本
        x: logincanvas.width / 2,
        y: logincanvas.height/1.6,
        text: 'Demo已結束 感謝你的體驗',
        fontSize: 60,
        color: 'white',
        maxLineWidth:10,
        draw: function() {
            if(loginState===this.State){
                loginctx.font = `${this.fontSize}px Arial`;
                loginctx.textAlign = 'center';
                loginctx.textBaseline = 'middle';
                loginctx.lineWidth = 5;  // 外框的寬度
                loginctx.strokeStyle = 'black';  // 外框顏色，這裡設置為黑色
                const lines = wrapText(this.text, this.maxLineWidth);
                lines.forEach((line, index) => {
                    loginctx.strokeText(line, this.x-2, this.y-2+index*70); // 繪製外框
                    loginctx.fillStyle = this.color;
                    loginctx.fillText(line, this.x, this.y+index*70);
                });
                
            }
        }
    },//endInfo
]
// 設定畫布背景

function updateLogin(timestamp){
    loginctx.clearRect(0, 0, logincanvas.width, logincanvas.height); // 清除画布
    drawLogin(timestamp);
    logincanvas.style.cursor =loginbuttonHover ? 'pointer' : loginInputHover?'text': 'default';
    drawloginInfo();
    if(loading){
        drawloading(timestamp);
    }
    requestAnimationFrame(updateLogin);

}

let loadedlogin = [];
let loginLoaded = 0;

loginImages.forEach((src, index) => {
    let img = new Image();
    img.src = src;
    img.onload = () => {
        loadedlogin[index] = img;
        loginLoaded++;
        // 當所有圖片加載完成後，啟動動畫
        if (loginLoaded === loginImages.length) {
            
        }
    };
});

function drawLogin(timestamp){
    if (!lastFrameTimeLogin) lastFrameTimeLogin = timestamp;
    let deltaTime = timestamp - lastFrameTimeLogin;
    if (deltaTime >= LoginSwitchInterval) {
        // 如果时间差大于设定的切换间隔，则切换背景
        currentLoginIndex = (currentLoginIndex + 1) % loadedlogin.length;
        lastFrameTimeLogin = timestamp; // 更新上一帧的时间
        // 更新画布
    }
    loginctx.drawImage(loadedlogin[currentLoginIndex], 0, 0, logincanvas.width, logincanvas.height);
}

function drawloading(timestamp){
    if (!lastFrameTime) lastFrameTime = timestamp;
    let deltaTime = timestamp - lastFrameTime;
    if (deltaTime >= backgroundSwitchInterval) {
        // 如果时间差大于设定的切换间隔，则切换背景
        currentBackgroundIndex = (currentBackgroundIndex + 1) % loadedBackgrounds.length;
        lastFrameTime = timestamp; // 更新上一帧的时间
        // 更新画布
    }
    loginctx.drawImage(loadedBackgrounds[currentBackgroundIndex], 0, 0, logincanvas.width, logincanvas.height);
    loginctx.font = 'bold 80px Arial';
    loginctx.textAlign = 'center';
    loginctx.textBaseline = 'middle';
    loginctx.lineWidth = 5;  // 外框的寬度
    loginctx.strokeStyle = 'black';  // 外框顏色，這裡設置為黑色
    loginctx.strokeText('Loading...', logincanvas.width/2-2, logincanvas.height/2-2); // 繪製外框
    loginctx.fillStyle = 'white';
    loginctx.fillText('Loading...', logincanvas.width/2, logincanvas.height/2);

}

function drawloginInfo() {
    loginuiElements.forEach(element => {
        element.draw();
    });
}

// 設置遊戲開始按鈕的點擊事件
logincanvas.addEventListener("mousedown", (e) => {
    let rect = logincanvas.getBoundingClientRect();
    let mouseX = (e.clientX - rect.left) * (logincanvas.width / rect.width);
    let mouseY = (e.clientY - rect.top) * (logincanvas.height / rect.height);
    loginuiElements.forEach(element => {
        if (element.type === 'button') {
            element.onClick(mouseX, mouseY);
        }
        else if(element.type ==='input'){
            element.onInput(mouseX, mouseY);
        }
        else{
            focusIndex=null;
        }     
    });
});
logincanvas.addEventListener("touchstart", (e) => {
    Array.from(e.touches).forEach(touch =>{
        let rect = logincanvas.getBoundingClientRect();
        let touchX = (touch.clientX - rect.left) * (logincanvas.width / rect.width);
        let touchY = (touch.clientY - rect.top) * (logincanvas.height / rect.height);
        loginuiElements.forEach(element => {
            if (element.type === 'button') {
                element.onClick(touchX, touchY);
            }
            else if(element.type ==='input'){
                element.onInput(touchX, touchY);
            }
            else{
                focusIndex=null;
            }   
        });
        // 阻止觸摸事件的預設行為（防止頁面滾動）
        e.preventDefault();
    });
});
logincanvas.addEventListener('mousemove', (e) => {
    let rect = logincanvas.getBoundingClientRect();
    let offsetX = (e.clientX - rect.left) * (logincanvas.width / rect.width);
    let offsetY = (e.clientY - rect.top) * (logincanvas.height / rect.height);
    loginbuttonHover=false;
    loginInputHover=false;
    // 遍历所有UI元素，检查是否鼠标悬停在按钮上
    loginuiElements.forEach(element => {
        if (element.type === 'button') {
            if (offsetX >= element.x - element.width / 2 &&
                offsetX <= element.x + element.width / 2 &&
                offsetY >= element.y - element.height / 2 &&
                offsetY <= element.y + element.height / 2) {
                if(element.State==loginState){
                    loginbuttonHover=true;
                }
                element.setHovered(true);  // 鼠标悬停时设置 hover 状态
            } else {
                element.setHovered(false); // 不在按钮区域时，取消 hover 状态
            }
        }
        else if(element.type === 'input'){
            if (offsetX >= element.x - element.width / 2 &&
                offsetX <= element.x + element.width / 2 &&
                offsetY >= element.y - element.height / 2 &&
                offsetY <= element.y + element.height / 2) {
                if(element.State==loginState){
                    loginInputHover=true;
                }
            }
        }
    });
});

let isComposing = false;  // 用來標記是否處於拼音輸入中

inputField.addEventListener('compositionstart', function(event) {
    // 開始拼音輸入，標記為拼音狀態
    isComposing = true;
});
inputField.addEventListener('compositionend', function(event) {
    // 拼音輸入結束，標記為結束
    isComposing = false;
    // 確保輸入完成後的字符計入
    handleInput(event);
});
inputField.addEventListener('input', function(event) {
    if (focusIndex === null) return;
    // 如果還在拼音輸入中，不做處理
    if (isComposing) {
        getloginUI(focusIndex).inputtext= event.target.value;
        return;
    }

    // 如果沒有在拼音輸入中，處理正常的文本輸入
    handleInput(event);
});

function handleInput(event) {
    if (focusIndex === null) return;
    const currentText = event.target.value;
    // 確保不超過最大長度
    if (event.inputType === 'deleteContentBackward') {
        getloginUI(focusIndex).inputtext = currentText.slice(0, getloginUI(focusIndex).maxLength);
        //getloginUI(focusIndex).cursorPosition = Math.max(0, getloginUI(focusIndex).cursorPosition - 1);
    }
    else {
        // 如果還沒有達到最大字數，更新文本
        if (currentText.length <= getloginUI(focusIndex).maxLength) {
            if(focusIndex=='password'){
                getloginUI(focusIndex).inputtext = '*'.repeat(currentText.length);
                getloginUI(focusIndex).passwordtext = currentText;
            }
            else{
                getloginUI(focusIndex).inputtext = currentText;
            }
            //getloginUI(focusIndex).cursorPosition++;
        } else {
            // 如果達到最大字數，截取文本至 maxLength
            if(focusIndex=='password'){
                getloginUI(focusIndex).inputtext = '*'.repeat(currentText.length);
                getloginUI(focusIndex).passwordtext = currentText.slice(0, getloginUI(focusIndex).maxLength);
            }
            else{
                getloginUI(focusIndex).inputtext = currentText.slice(0, getloginUI(focusIndex).maxLength);
            }
        }
    }
    if(focusIndex=='password'){
        inputField.value = getloginUI(focusIndex).passwordtext;
    }
    else{
        inputField.value = getloginUI(focusIndex).inputtext;
    }
}

