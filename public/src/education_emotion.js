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

      for (let i = 0; i < buttons.length; i++) {
        buttons[i].style["background-color"] = "white";
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

async function onCCTV() {
  let result = null;
  result = await faceapi
    .detectSingleFace(inputVideo, options)
    .withFaceLandmarks()
    .withFaceExpressions();

  if (result != undefined) {
    //console.log(result.landmarks["_positions"]);
    faceMove(result.landmarks["_positions"]);
  } else {
    console.log("nono");
  }

  setTimeout(() => onCCTV());
}

function faceMove(result) {
  if (
    Math.abs(result[39].x - result[36].x - (result[45].x - result[42].x)) > 8
  ) {
    console.log("beeeeeeeeeeeeeep");
  }
}
