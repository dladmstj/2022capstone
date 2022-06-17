faceapi.nets.ssdMobilenetv1.load("/weights/");

const minConfidence = 0.5;
const options = faceapi.SsdMobilenetv1Options({ minConfidence });

const monitor = document.querySelector("#monitor");
const monitorRect = monitor.getBoundingClientRect();

const scene = new THREE.Scene();
const inputVideo = document.querySelector("#inputVideo");
inputVideo.addEventListener("loadedmetadata", landmark);
const camera = new THREE.PerspectiveCamera(
  75,
  monitorRect.width / monitorRect.height,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(monitorRect.width / 2, monitorRect.height / 2, false);
renderer.setClearColor("rgb(135,206,250)", 0.0);
document.querySelector("#monitor").appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

document.querySelector("canvas").style.width = `${monitorRect.width}px`;
document.querySelector("canvas").style.height = `${monitorRect.height}px`;

let result = null;

function animate() {
  requestAnimationFrame(animate);

  if (result != undefined) {
    const dims = faceapi.matchDimensions(monitor, inputVideo, true);
    const resizedResult = faceapi.resizeResults(result, dims);
    let tmp = resizedResult.landmarks["_positions"];

    //크기 변경
    let scale_num = (tmp[16].x - tmp[0].x) / 70;
    cube.scale.set(scale_num, scale_num, scale_num);

    //위치 변경
    cube.position.set((tmp[19].x - 300) / 60, (200 - tmp[19].y) / 50);

    let rotate_num = tmp[39].x - tmp[36].x - (tmp[45].x - tmp[42].x);
    console.log(Math.round(rotate_num) / 2);
    cube.rotation.y = -Math.round(rotate_num / 5) * 4.5 * 5;
  }

  renderer.render(scene, camera);
}
animate();
init();

async function init() {
  await faceapi.loadFaceLandmarkModel("/weights/");
  const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  inputVideo.srcObject = stream;
}

async function landmark() {
  result = await faceapi
    .detectSingleFace(inputVideo, options)
    .withFaceLandmarks();

  setTimeout(() => landmark());
}
