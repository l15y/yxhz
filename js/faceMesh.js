const video2 = document.getElementsByClassName('input_video2')[0];
const out2 = document.getElementsByClassName('output2')[0];
const controlsElement2 = document.getElementsByClassName('control2')[0];
const canvasCtx = out2.getContext('2d');

landmarkDistance = (landmarks,l1, l2) => {
  l1=landmarks[l1]
  l2=landmarks[l2]
  // console.log( Math.sqrt(l1.x - l2.x) + Math.sqrt(l1.y - l2.y) + Math.sqrt(l1.z - l2.z))
  return Math.sqrt(
    Math.pow(l1.x - l2.x,2) + Math.pow(l1.y - l2.y,2) + Math.pow(l1.z - l2.z,2)
  )
}
function onResultsFaceMesh(results) {
  document.body.classList.add('loaded');

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, out2.width, out2.height);
  canvasCtx.drawImage(
    results.image, 0, 0, out2.width, out2.height);
  if (results.multiFaceLandmarks) {
    for (const landmarks of results.multiFaceLandmarks) {
      let lc=landmarkDistance(landmarks,10,152)
      let etc=landmarkDistance(landmarks,10,8)
      let lk=landmarkDistance(landmarks,234,454)
      let zt=landmarkDistance(landmarks,0,164)
        // console.log(lc/etc,lc/zt,lc/lk)
      
      drawConnectors(
        canvasCtx, landmarks, FACEMESH_TESSELATION,
        { color: '#C0C0C070', lineWidth: 1 });
      drawConnectors(
        canvasCtx, landmarks, FACEMESH_RIGHT_EYE,
        { color: '#30FF30', lineWidth: 1 });
      drawConnectors(
        canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW,
        { color: '#30FF30', lineWidth: 2 });
      drawConnectors(
        canvasCtx, landmarks, FACEMESH_LEFT_EYE,
        { color: '#30FF30', lineWidth: 1 });
      drawConnectors(
        canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW,
        { color: '#30FF30', lineWidth: 2 });
      drawConnectors(
        canvasCtx, landmarks, FACEMESH_FACE_OVAL,
        { color: '#E0E0E0' });
      drawConnectors(
        canvasCtx, landmarks, FACEMESH_LIPS,
        { color: '#FF3030', lineWidth: 2 });
    }
  }
  canvasCtx.restore();
}

const faceMesh = new FaceMesh({
  locateFile: (file) => {
    return `js/${file}`;
  }
});
faceMesh.onResults(onResultsFaceMesh);

const camera = new Camera(video2, {
  onFrame: async () => {
    await faceMesh.send({ image: video2 });
  }
});
camera.start();
out2.width=camera.h.width
out2.height=camera.h.height
new ControlPanel(controlsElement2, {
  selfieMode: true,
  maxNumFaces: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
})
  .add([
    new StaticText({ title: 'MediaPipe Face Mesh' }),
    new Toggle({ title: '镜像模式', field: 'selfieMode' })
  ])
  .on(options => {
    video2.classList.toggle('selfie', options.selfieMode);
    faceMesh.setOptions(options);
  });