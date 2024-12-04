const soundEffects = {
    clickbutton: '/小遊戲/new/sound/clickbutton.mp3',
    countdown: '/小遊戲/new/sound/countdown.mp3',
    finalcountdown: '/小遊戲/new/sound/finalcountdown.mp3',
    dig:'/小遊戲/new/sound/dig.mp3',
    get:'/小遊戲/new/sound/get.mp3',
    getrare:'/小遊戲/new/sound/getrare.mp3',
    generatehole:'/小遊戲/new/sound/generatehole.mp3',
    wave:'/小遊戲/new/sound/wave.mp3',
  };

function playSound(type,volume=1) {
    // 根據音效類型動態創建新的 audio 元素
    const audio = new Audio();

    // 設置音效來源
    audio.src = soundEffects[type];

    // 設定音量
    audio.volume = volume;

    // 播放音效
    audio.play();

    // 音效播放完成後釋放資源（可選）
    /*audio.onended = function() {
      audio = null;
    };*/
}

    // 播放背景音樂
function playBGM(BGM) {
    BGM.play();
}

    // 暫停背景音樂
function pauseBGM(BGM) {
    BGM.pause();
}

    // 修改音量
function setVolume(BGM,volume) {
    BGM.volume = volume; // 音量範圍是 0.0 到 1.0
}

function stopBGM(BGM){
    BGM.pause();
    BGM.currentTime=0;
}
