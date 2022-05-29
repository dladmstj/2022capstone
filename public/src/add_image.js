const reader = new FileReader();
const imageInput = document.getElementById("image_input");


faceapi.nets.ssdMobilenetv1.load("/weights/");
faceapi.loadFaceExpressionModel("/weights/");

setEvent();

let emotions = ["무표정", "행복", "슬픔", "분노", "공포", "혐오", "놀라움"];

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
  alert(emotions[maxIndex]);

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
