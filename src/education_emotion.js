faceapi.nets.ssdMobilenetv1.load("/weights/");

const minConfidence = 0.5;
const options = faceapi.SsdMobilenetv1Options({ minConfidence });

const inputVideo = document.querySelector("#inputCCTV");
inputVideo.addEventListener("loadedmetadata", onCCTV);

const img = document.querySelector("#img");
const imageDirectory = "/images";

let selectedBtn = null;
let emotionIndex;
let score = 0;
init();

let emotions = [
  "neutral",
  "happy",
  "sad",
  "angry",
  "fearful",
  "disqusted",
  "surprised",
];

async function init() {
  setEvent();
  await setImage();
  await faceapi.loadFaceLandmarkModel("/weights/");
  await faceapi.loadFaceExpressionModel("/weights/");

  const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  inputVideo.srcObject = stream;
  emotionIndex = await getEmotionIndex();
}

async function setImage() {
  let title;
  await fetch("/img-title")
    .then((res) => res.json())
    .then((result) => {
      title = result.title;
    });

  img.src = imageDirectory + "/" + title;
}

async function getEmotionIndex() {
  const result = await faceapi
    .detectSingleFace(img, options)
    .withFaceExpressions();
  let maxIndex = 0;
  let data_emotion = Object.values(result.expressions);

  for (let i = 1; i < 7; i++) {
    if (data_emotion[maxIndex] < data_emotion[i]) {
      maxIndex = i;
    }
  }
  return maxIndex;
}

function setEvent() {
  const buttons = document.querySelectorAll(".emotionBtn");

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", (e) => {
      buttons[i].style["background-color"] = "gray";
      console.log(i);
      if (selectedBtn != null) {
        buttons[selectedBtn].style["background-color"] = "white";
      }
      selectedBtn = i;
    });
  }

  const nextBtn = document.querySelector(".nextBtn");
  nextBtn.addEventListener("click", async (e) => {
    if (selectedBtn === emotionIndex) {
      score++;
      setImage();
      emotionIndex = await getEmotionIndex();
      console.log("answer" + emotionIndex);
      selectedBtn = null;

      for (let i = 0; i < buttons.length; i++) {
        buttons[i].style["background-color"] = "rgb(247, 241, 197)";
      }
    } else {
      alert("다시 시도하세요");
    }
  });

  const stopBtn = document.querySelector(".stopBtn");
  stopBtn.addEventListener("click", (e) => {
    alert(`학습을 종료합니다.\n점수: ${score}`);
    location.href = "/";
  });

  const plusBtn = document.querySelector(".plusBtn");
  plusBtn.addEventListener("click", (e) => {
    location.href = "/add_image";
  });
}

function beep() {
  var snd = new Audio(
    "data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU="
  );

  snd.play();
}

let num = 0;
let cnt = 0;
let count = 0;
async function onCCTV() {
  let check_diff;
  let result = null;
  result = await faceapi
    .detectSingleFace(inputVideo, options)
    .withFaceLandmarks()
    .withFaceExpressions();

  if (result != undefined) {
    //console.log(result.landmarks["_positions"]);
    faceMove(result.landmarks["_positions"]);
  } else {
    //console.log("얼굴 일부분 감지 안됨");
    cnt = 0;
    num++;
    count += num;
    //console.log("num:", num);
    if (num == 1) {
      console.log("깜빡인 횟수:", count);
      if (count == 6) {
        beep();
        alert("경고! 잦은 눈깜빡임이 의심됩니다");
        num = 0;
        count = 0;
      }
    }
  }

  setTimeout(() => onCCTV());
}

function faceMove(result) {
  ear_ar = 0.03;

  rh1 = Math.abs(result[37].x - result[41].x);
  rh2 = Math.abs(result[38].x - result[40].x);
  rw = Math.abs(result[36].x - result[39].x);
  ear1 = (rh1 + rh2) / (2 * rw);

  lh1 = Math.abs(result[43].x - result[47].x);
  lh2 = Math.abs(result[44].x - result[46].x);
  lw = Math.abs(result[42].x - result[45].x);
  ear2 = (lh1 + lh2) / (2 * lw);

  if (ear1 < ear_ar && ear2 < ear_ar) {
    //눈감음
    /* onCCTV의 else로 옮김 */
  } else {
    //눈안감음

    num = 0;
    console.log("눈 뜸");
    cnt++;
    console.log(cnt);
    if (cnt > 40) {
      beep();
      alert("경고! 장시간 눈 깜빡임이 없습니다");
      cnt = 0;
    }
    if (cnt > 9) {
      //3초 넘게 깜빡임 없으면 num 초기화
      count = 0;
    }
  }
}
