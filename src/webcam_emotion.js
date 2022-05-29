faceapi.nets.ssdMobilenetv1.load("/weights/");
const canvas = document.querySelector("#overlay");
let context = canvas.getContext("2d");

const minConfidence = 0.5;
const options = faceapi.SsdMobilenetv1Options({ minConfidence });

const inputVideo = document.querySelector("#inputVideo");
inputVideo.addEventListener("loadedmetadata", onPlay);
let btn1 = false;
let img = new Image();
img.src = "/mainimage/robot.png";
run();

let count = 0;
let expressions = new Array(7).fill(0);
let emotions = [
  "무표정이에요",
  "행복해보여요",
  "슬퍼보여요",
  "화나보여요",
  "무서워보여요",
  "혐오스러워보여요",
  "놀라워보여요",
];

async function onPlay() {
  let coordinate = null;
  let result = null;

  if (count < 10) {
    result = await faceapi
      .detectSingleFace(inputVideo, options)
      .withFaceLandmarks()
      .withFaceExpressions();

    if (result != undefined) {
      console.log(result.landmarks["_positions"]);
      count++;
      Object.values(result.expressions).map(
        (value, index) => (expressions[index] += value)
      );
      coordinate = result.detection["_box"];
    }
  } else {
    const result = await faceapi.detectSingleFace(inputVideo, options);

    if (result != undefined) {
      coordinate = result["_box"];
    }

    if (count == 10) {
      giveAnswer();
      count++;
    }
  }

  if (coordinate != null && btn1 == true) {
    const x = coordinate["_x"] - 50;
    const y = coordinate["_y"] - 50;
    const width = coordinate["_width"];
    const height = coordinate["_height"];

    context.clearRect(0, 0, canvas.width, canvas.height);
    const videoEl = $("#inputVideo").get(0);
    const dims = faceapi.matchDimensions(canvas, videoEl, true);
    // const resizedResult = faceapi.resizeResults(result, dims);
    // faceapi.draw.drawFaceLandmarks(canvas, resizedResult);
    context.drawImage(img, x, y, width * 1.8, height * 1.8);
  } else {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  setTimeout(() => onPlay());
}

async function run() {
  //console.log("run");

  await faceapi.loadFaceExpressionModel("/weights/");
  await faceapi.loadFaceLandmarkModel("/weights/");
  const stream = await navigator.mediaDevices.getUserMedia({ video: {} });

  inputVideo.srcObject = stream;
}

function eye() {
  btn1 = !btn1;
  document.getElementById("inputVideo").style.visibility = "visible";
}

function restart() {
  count = 0;
  expressions = new Array(7).fill(0);
  document.body.style.backgroundColor = "#ebf2f5";
  document.getElementById("imgid").style.visibility = "hidden";
  //onPlay();
}

function giveAnswer() {
  let maxIndex = 0;
  for (let i = 1; i < 7; i++) {
    if (expressions[maxIndex] < expressions[i]) {
      maxIndex = i;
    }
  }
  var text = emotions[maxIndex];
  var msg = new SpeechSynthesisUtterance();
  msg.text = text;
  window.speechSynthesis.speak(msg);

  document.getElementById("imgid").style.visibility = "visible";

  switch (maxIndex) {
    case 0:
      document.getElementById("imgid").src = "ddarahae/neutral.png";
      document.body.style.backgroundColor = "rgba(240,220,210,0.55)";
      break;
    case 1:
      document.getElementById("imgid").src = "ddarahae/smile.png";
      document.body.style.backgroundColor = "rgba(220,210,280,0.55)";
      break;
    case 2:
      document.getElementById("imgid").src = "ddarahae/sad.png";
      document.body.style.backgroundColor = "rgba(200,240,255,0.55)";
      break;
    case 3:
      document.getElementById("imgid").src = "ddarahae/angry.png";
      document.body.style.backgroundColor = "rgba(240,230,285,0.55)";
      break;
    case 4:
      document.getElementById("imgid").src = "ddarahae/fearful.png";
      document.body.style.backgroundColor = "rgba(230,200,245,0.55)";
      break;
    case 5:
      document.getElementById("imgid").src = "ddarahae/disgust.png";
      document.body.style.backgroundColor = "rgba(210,270,205,0.55)";
      break;
    case 6:
      document.getElementById("imgid").src = "ddarahae/surprised.png";
      document.body.style.backgroundColor = "rgba(210,230,225,0.55)";
      break;
  }

  swal({
    title: emotions[maxIndex],
    text: "아래 표정을 따라해보세요",
    closeOnClickOutside: false,
  });
}
