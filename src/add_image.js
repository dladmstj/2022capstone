const reader = new FileReader();
const imageInput = document.getElementById("image_input");


faceapi.nets.ssdMobilenetv1.load("/weights/");
faceapi.loadFaceExpressionModel("/weights/");

setEvent();

let emotions = ["무표정이에요", "행복해보여요!", "슬퍼보여요", "화를 내고 있어요", "무서워보여요", "혐오스러운 표정이에요", "놀라워하고 있어요!"];

async function submit() {
  const formData = new FormData();

  if (imageInput.files.length === 0) {
    console.log("0000");
    return;
  }

  const file = imageInput.files[0];
  formData.append("img", file);

  const res = await fetch("/upload", { method: "POST", body: formData });

  if (res.status === 200 || res.status === 201) {
    reader.readAsDataURL(file);
  } else {
    console.error(res.statusText);
  }
}

async function changeImg() {
  const img = document.querySelector("#img");
  img.style.visibility = "visible";

  img.src = reader.result;

  const minConfidence = 0.5;
  const options = faceapi.SsdMobilenetv1Options({ minConfidence });
  console.log(img);

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

  var text = emotions[maxIndex];
  var msg = new SpeechSynthesisUtterance();
  msg.text = text;
  window.speechSynthesis.speak(msg);
  swal(emotions[maxIndex]);

  const dataTranster = new DataTransfer();
  imageInput.files = dataTranster.files;
}

function setEvent() {
  imageInput.addEventListener("change", submit);
  reader.addEventListener("load", changeImg);

  const backBtn = document.querySelector(".backBtn");
  backBtn.addEventListener("click", (e) => {
    location.href = "/education_emotion";
  });
}
