// 돔
const video = document.createElement('video');
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const output = document.querySelector('#output');

// 리퀘스트에니메이션프레임을 위한 반글로벌 변수
let thickness = 50;
let targetThickness = 50;
let backgroundcolor = [0, 0, 0];
let targetBackgroundcolor = [0, 0, 0];

// 소리 반복 재생 막기 위한 현재 시간 변수
let played = 0;

// 카메라 띄우기
navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  video.srcObject = stream;
  video.play();
  requestAnimationFrame(tick);
});

// hash로 사람 찾기
function findByHash(string) {
  for (let crypto of cryptos) {
    if (crypto.hash === string) {
      // console.log(crypto.gcn);
      for (let applicant of applicants) {
        if (applicant.gcn === crypto.gcn) {
          applicant.ox = 1;
          clearTable();
          createTableFor(applicants);
          return `${crypto.gcn} ${applicant.myname}`;
        }
      }
    }
  }
  return 'none';
}

function tick() {
  // 섣부르다 싶으면 스톱
  if (video.readyState !== video.HAVE_ENOUGH_DATA) {
    requestAnimationFrame(tick);
    return;
  }

  // 캔버스에 카메라 그리기
  const shorter = Math.min(video.videoWidth, video.videoHeight);
  canvas.width = shorter;
  canvas.height = shorter;
  ctx.drawImage(
    video,
    canvas.width / 2 - shorter / 2,
    canvas.height / 2 - shorter / 2,
    shorter,
    shorter,
    0,
    0,
    shorter,
    shorter
  );

  // 보조선 그리기
  ctx.fillStyle = `rgba(${backgroundcolor[0]}, ${backgroundcolor[1]}, ${backgroundcolor[2]}, 0.7)`;
  ctx.rect(0, 0, thickness, shorter);
  ctx.rect(shorter - thickness, 0, shorter - thickness * 2, shorter);
  ctx.rect(thickness, 0, shorter - thickness * 2, thickness);
  ctx.rect(thickness, shorter - thickness, shorter - thickness * 2, thickness);
  ctx.fill();

  // QR 코드에 있는 내용 뱉기
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'dontInvert',
  });

  if (code) {
    targetThickness = 100;

    if (findByHash(code.data) === 'none') {
      if (played === 0) {
        played = 1;
        const audio = new Audio('soundfiles/wrongsound.mp3');
        audio.play();
      }
      output.textContent = '일치하는 사람 없음!';
      targetBackgroundcolor = [255, 0, 0];
    } else {
      if (played === 0) {
        played = 1;
        const audio = new Audio('soundfiles/iphoneoksound.mp3');
        audio.play();
      }
      localStorage.setItem('database', JSON.stringify(applicants));

      output.textContent = `환영합니다 ${findByHash(code.data)}님!`;
      targetBackgroundcolor = [102, 255, 102];
    }
  } else {
    played = 0;
    output.textContent = 'QR 코드 입력 바람~';
    targetThickness = 50;
    targetBackgroundcolor = [0, 0, 0];
  }
  thickness = thickness + (targetThickness - thickness) / 10;
  backgroundcolor = [
    backgroundcolor[0] + (targetBackgroundcolor[0] - backgroundcolor[0]) / 10,
    backgroundcolor[1] + (targetBackgroundcolor[1] - backgroundcolor[1]) / 10,
    backgroundcolor[2] + (targetBackgroundcolor[2] - backgroundcolor[2]) / 10,
  ];
  requestAnimationFrame(tick);
}
