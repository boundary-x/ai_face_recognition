/*
 * sketch.js
 * Boundary X - Face Recognition (Final Version)
 * Features: Face Mesh (Black/Thin), Correct Roll/Eye Logic, Stop Command
 */

import { FaceLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

// --- Bluetooth UUIDs ---
const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const UART_TX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const UART_RX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

// 주어진 프로미스가 정해진 시간 안에 끝나지 않으면 강제로 실패 처리 (BLE 응답이 영영 안 올 때 대비)
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('BLE write timeout')), ms))
  ]);
}

// --- Variables ---
let bluetoothDevice = null;
let rxCharacteristic = null;
let isConnected = false;
let isSendingData = false;
let lastSentTime = 0; 
const SEND_INTERVAL = 100;
let lastSendErrorTime = 0;

let video;
let faceLandmarker;
let lastVideoTime = -1;
let isModelLoaded = false;
let isDetecting = false;
let detectionResults = null;

let facingMode = "user";
let isFlipped = true;
let isVideoReady = false;

// Default Roll -> 5 (Center)
let params = { x: 50, y: 50, z: 50, yaw: 50, pitch: 50, roll: 5, mouth: 0, lEye: 0, rEye: 0, smile: 0, visible: 0 };

// UI Elements
let els = {};
let btnSwitch, btnConn, btnDisc, btnStart, btnStop;

// --- Init ---
async function initializeFaceLandmarker() {
  const filesetResolver = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
      delegate: "GPU"
    },
    outputFaceBlendshapes: true,
    runningMode: "VIDEO",
    numFaces: 1
  });
  isModelLoaded = true;
  console.log("FaceLandmarker Loaded!");
  btnStart.html("얼굴 인식 시작");
}

// --- p5.js ---
function setup() {
  let canvas = createCanvas(400, 300);
  canvas.parent('p5-container');
  
  setupCamera();
  createUI();
  
  initializeFaceLandmarker();
}

function draw() {
  background(0);

  if (!isVideoReady || !video || video.width === 0) {
    fill(255); textAlign(CENTER); textSize(16);
    text("카메라 로딩 중...", width/2, height/2);
    return;
  }

  push();
  if (isFlipped) { translate(width, 0); scale(-1, 1); }
  image(video, 0, 0, width, height);
  pop();

  if (isDetecting && detectionResults && detectionResults.faceLandmarks.length > 0) {
    drawFaceMesh(detectionResults.faceLandmarks[0]);
    calculateParameters(detectionResults.faceLandmarks[0], detectionResults.faceBlendshapes[0]);
    params.visible = 1;
  } else {
    params.visible = 0;
    params.smile = 0;
    params.mouth = 0;
  }

  updateGraphUI();
  
  if (isDetecting) {
    let currentTime = millis();
    if (currentTime - lastSentTime > SEND_INTERVAL) {
      sendPacket();
      lastSentTime = currentTime;
    }
  }
}

// --- Logic ---
async function predictWebcam() {
  if (!faceLandmarker || !isVideoReady) return;
  let startTimeMs = performance.now();
  if (video.elt.currentTime !== lastVideoTime) {
    lastVideoTime = video.elt.currentTime;
    detectionResults = faceLandmarker.detectForVideo(video.elt, startTimeMs);
  }
  if (isDetecting) window.requestAnimationFrame(predictWebcam);
}

function drawFaceMesh(landmarks) {
  // [스타일] 검은색, 얇게
  noFill(); stroke(0); strokeWeight(3);
  let scaleX = width;
  let scaleY = height;
  beginShape(POINTS);
  for (let pt of landmarks) {
    let x = pt.x * scaleX;
    let y = pt.y * scaleY;
    if (isFlipped) x = width - x;
    vertex(x, y);
  }
  endShape();
  
  // [스타일] 코 끝 (약간 작게)
  let nose = landmarks[1]; 
  let nx = nose.x * scaleX; 
  if(isFlipped) nx = width - nx;
  
  fill(255, 0, 0); noStroke(); circle(nx, nose.y * scaleY, 10);
  noFill(); stroke(255); strokeWeight(1.5); circle(nx, nose.y * scaleY, 10);
}

function calculateParameters(landmarks, blendshapes) {
  let nose = landmarks[1];
  let rawX = isFlipped ? (1 - nose.x) : nose.x;
  params.x = constrain(Math.floor(rawX * 100), 0, 99);
  params.y = constrain(Math.floor(nose.y * 100), 0, 99);

  let widthVal = Math.abs(landmarks[234].x - landmarks[454].x);
  params.z = constrain(map(widthVal, 0.1, 0.7, 0, 99), 0, 99);
  params.z = Math.floor(params.z);

  // Yaw
  let dLeft = Math.abs(landmarks[1].x - landmarks[454].x);
  let dRight = Math.abs(landmarks[1].x - landmarks[234].x);
  let yawRatio = dRight / (dLeft + dRight); 
  if(isFlipped) yawRatio = 1 - yawRatio;
  params.yaw = constrain(Math.floor(yawRatio * 100), 0, 99);

  // Pitch
  let midEyeY = landmarks[168].y;
  let mouthY = landmarks[13].y;
  let noseY = landmarks[1].y;
  let pitchRatio = (noseY - midEyeY) / (mouthY - midEyeY); 
  params.pitch = constrain(map(pitchRatio, 0.8, 0.2, 0, 99), 0, 99);
  params.pitch = Math.floor(params.pitch);

  // [Roll] (Tilt)
  // landmarks[33]: Left Eye, landmarks[263]: Right Eye
  // dy calculation order: Right - Left
  let dy = landmarks[263].y - landmarks[33].y;
  let dx = landmarks[263].x - landmarks[33].x;
  let angle = Math.atan2(dy, dx); 
  
  if(isFlipped) angle = -angle;

  // Map -0.5 ~ 0.5 radians to 0 ~ 9
  let rollVal = map(angle, -0.5, 0.5, 0, 9);
  params.roll = constrain(Math.round(rollVal), 0, 9);

  // Blendshapes
  let shapes = {};
  if (blendshapes && blendshapes.categories) {
    blendshapes.categories.forEach(s => shapes[s.categoryName] = s.score);
  }
  let mOpen = shapes['jawOpen'] || 0;
  params.mouth = Math.floor(constrain(mOpen * 100, 0, 99));

  let lBlink = shapes['eyeBlinkLeft'] || 0;
  let rBlink = shapes['eyeBlinkRight'] || 0;
  params.lEye = Math.floor(constrain((1 - lBlink) * 100, 0, 99));
  params.rEye = Math.floor(constrain((1 - rBlink) * 100, 0, 99));

  let smileVal = ((shapes['mouthSmileLeft'] || 0) + (shapes['mouthSmileRight'] || 0)) / 2;
  params.smile = Math.floor(constrain(smileVal * 10, 0, 9)); 
}

function sendPacket() {
  if (!isConnected || !rxCharacteristic) return;
  const pad = (num) => String(num).padStart(2, '0');
  let p = params;
  let packet = "" + pad(p.x) + pad(p.y) + pad(p.z) + pad(p.yaw) + pad(p.pitch) + pad(p.mouth) + pad(p.lEye) + pad(p.rEye) + String(p.roll) + String(p.smile) + String(p.visible);
  select('#dataDisplay').html(packet);
  sendBluetoothData(packet);
}

// 성공하면 true, 스킵되거나 실패하면 false를 반환
async function sendBluetoothData(data) {
  if (!isConnected || !rxCharacteristic) return false;
  if (isSendingData) return false;

  try {
    isSendingData = true;
    const encoder = new TextEncoder();
    // writeValue가 끝내 응답하지 않는 경우를 대비해 2초 타임아웃을 둠 (전송 영구 정지 방지)
    await withTimeout(rxCharacteristic.writeValue(encoder.encode(data + "\n")), 2000);
    return true;
  } catch (err) {
    console.error("Error sending data:", err);
    const now = Date.now();
    if (now - lastSendErrorTime > 3000) {
      lastSendErrorTime = now;
      const statusEl = select('#bluetoothStatus');
      if (statusEl) statusEl.html("⚠️ 데이터 전송 실패 - 연결 상태를 확인해주세요").removeClass('status-connected').addClass('status-error');
    }
    return false;
  } finally {
    isSendingData = false;
  }
}

// 'stop'처럼 반드시 전달되어야 하는 명령을 위한 재시도 버전
async function sendBluetoothDataReliable(data, maxRetries = 5, retryDelayMs = 80) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const sent = await sendBluetoothData(data);
    if (sent) return true;
    await new Promise(resolve => setTimeout(resolve, retryDelayMs));
  }
  console.error(`전송 재시도 실패: ${data}`);
  return false;
}

function updateGraphUI() {
  const setVal = (id, val, max) => {
    if(els[id]) {
        let percent = (val / max) * 100;
        els[id].bar.style('width', `${percent}%`);
        els[id].txt.html(val);
    }
  };
  setVal('x', params.x, 99); setVal('y', params.y, 99); setVal('z', params.z, 99);
  setVal('yaw', params.yaw, 99); setVal('pitch', params.pitch, 99);
  setVal('mouth', params.mouth, 99); 
  setVal('leye', params.lEye, 99); 
  setVal('reye', params.rEye, 99);
  setVal('roll', params.roll, 9); setVal('smile', params.smile, 9); setVal('vis', params.visible, 1);
}

function createUI() {
  const link = (key, id) => { els[key] = { bar: select(`#bar-${id}`), txt: select(`#val-${id}`) }; };
  
  link('x', 'x'); link('y', 'y'); link('z', 'z'); 
  link('yaw', 'yaw'); link('pitch', 'pitch'); link('roll', 'roll');
  link('mouth', 'mouth'); 
  link('leye', 'leye'); 
  link('reye', 'reye'); 
  link('smile', 'smile'); link('vis', 'vis');

  btnSwitch = createButton("전후방 전환");
  btnSwitch.parent('camera-control-buttons').mousePressed(switchCamera);
  
  btnConn = createButton("기기 연결");
  btnConn.parent('bluetooth-control-buttons').addClass('start-button').mousePressed(connectBluetooth);

  btnDisc = createButton("연결 해제");
  btnDisc.parent('bluetooth-control-buttons').addClass('stop-button').mousePressed(disconnectBluetooth);

  btnStart = createButton("모델 로딩 중...");
  btnStart.parent('object-control-buttons').addClass('start-button');
  btnStart.mousePressed(() => {
    if (!isModelLoaded) return alert("모델 로딩 중입니다.");
    if (!isConnected) alert("주의: 블루투스가 연결되지 않았습니다.");
    isDetecting = true;
    predictWebcam();
  });

  // 인식 중지 버튼: "stop" 문자열 전송
  btnStop = createButton("인식 중지");
  btnStop.parent('object-control-buttons').addClass('stop-button');
  btnStop.mousePressed(async () => {
    isDetecting = false;
    params.visible = 0;
    updateGraphUI();
    
    // UI 업데이트 및 Stop 전송
    select('#dataDisplay').html("stop");
    
    await sendBluetoothDataReliable("stop");
  });
}

function setupCamera() {
  isVideoReady = false;
  video = createCapture({ video: { facingMode: facingMode }, audio: false });
  video.hide();
  let check = setInterval(() => {
    if (video.elt.readyState >= 2 && video.elt.videoWidth > 0) {
      isVideoReady = true;
      clearInterval(check);
      if(isDetecting) predictWebcam();
    }
  }, 100);
}

function switchCamera() {
  isDetecting = false;
  if(video) { video.remove(); video = null; }
  facingMode = facingMode === "user" ? "environment" : "user";
  isFlipped = (facingMode === "user");
  setTimeout(() => { setupCamera(); isDetecting = true; }, 500);
}

async function connectBluetooth() {
  try {
    bluetoothDevice = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "BBC micro:bit" }],
      optionalServices: [UART_SERVICE_UUID]
    });
    const server = await bluetoothDevice.gatt.connect();
    const service = await server.getPrimaryService(UART_SERVICE_UUID);
    rxCharacteristic = await service.getCharacteristic(UART_RX_CHARACTERISTIC_UUID);

    // 마이크로비트가 범위를 벗어나거나 전원이 꺼지는 등 예기치 않게 끊겼을 때도 상태를 동기화
    bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);

    isConnected = true;
    select('#bluetoothStatus').html("연결됨: " + bluetoothDevice.name).removeClass('status-error').addClass('status-connected');
  } catch (e) {
    console.error(e);
    select('#bluetoothStatus').html("연결 실패").removeClass('status-connected').addClass('status-error');
  }
}

// 사용자가 직접 '연결 해제' 버튼을 눌렀는지 구분하기 위한 플래그
let isManualDisconnect = false;

// 수동 해제든 예기치 않은 끊김이든 이 함수 하나로 상태를 정리
function onDisconnected() {
  isConnected = false;
  bluetoothDevice = null;
  rxCharacteristic = null;

  // 연결이 끊기면 인식도 함께 자동 중지 — 끊긴 채로 계속 돌아가는 것 방지
  if (isDetecting) {
    isDetecting = false;
    params.visible = 0;
    updateGraphUI();
    select('#dataDisplay').html("stop");
  }

  const statusEl = select('#bluetoothStatus');

  if (isManualDisconnect) {
    statusEl.html("연결 해제됨").removeClass('status-connected status-error');
  } else {
    statusEl.html("⚠️ 연결이 끊어졌습니다. 다시 연결해주세요").removeClass('status-connected').addClass('status-error');
  }
  isManualDisconnect = false;
}

function disconnectBluetooth() {
  if (bluetoothDevice && bluetoothDevice.gatt.connected) {
    // 실제 상태 정리는 'gattserverdisconnected' 이벤트를 받는 onDisconnected()가 담당
    isManualDisconnect = true;
    bluetoothDevice.gatt.disconnect();
  } else {
    isConnected = false;
    bluetoothDevice = null;
    rxCharacteristic = null;
    select('#bluetoothStatus').html("연결 해제됨").removeClass('status-connected status-error');
  }
}

window.setup = setup;
window.draw = draw;
