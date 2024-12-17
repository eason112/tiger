const url3="https://eason112.github.io/tiger";
const soundEffects = {
    clickbutton: url3+'/littlegame/new/sound/clickbutton.mp3',
    countdown: url3+'/littlegame/new/sound/countdown.mp3',
    finalcountdown: url3+'/littlegame/new/sound/finalcountdown.mp3',
    dig:url3+'/littlegame/new/sound/dig.mp3',
    get:url3+'/littlegame/new/sound/get.mp3',
    getrare:url3+'/littlegame/new/sound/getrare.mp3',
    generatehole:url3+'/littlegame/new/sound/generatehole.mp3',
    wave:url3+'/littlegame/new/sound/wave.mp3',
  };
const walk = new Audio();
walk.src=soundEffects['generatehole'];
walk.loop=true;
walk.volume = 0.1;
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
function playBGM(BGM,volume=1) {
    BGM.volume = volume; // 音量範圍是 0.0 到 1.0
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

function playSoundloop() {

    // 播放音效
    if (!walk.paused) {
        return;
    }
    walk.play();

}

function stopSoundloop() {
    walk.pause();
    walk.currentTime = 0; // 確保音效回到起始點，避免重複播放時聽到音效開頭
}
