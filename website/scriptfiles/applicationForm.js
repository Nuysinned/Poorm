// 돔
const applicationFormButton = document.querySelector('#applicationFormButton');
const applicationFormContent = document.querySelector(
  '#applicationFormContent'
);
const applicationFormTable = document.querySelector('#applicationFormTable');
const grade = document.querySelector('#grade');
const className = document.querySelector('#class');
const number = document.querySelector('#number');
const myname = document.querySelector('#name');
const submit = document.querySelector('#submit');
const removeall = document.querySelector('#removeall');
const getcsv = document.querySelector('#getcsv');
const release = document.querySelector('#release');

let applicationFormButtonState = 1;

// 데이타베이스
let applicants = [];

if (localStorage.getItem('database') === null) {
  // applicants.push({
  //   gcn: 10616,
  //   grade: '1',
  //   className: '6',
  //   number: '16',
  //   myname: '윤동현',
  //   ox: 0,
  // });
  localStorage.setItem('database', JSON.stringify(applicants));
} else {
  applicants = JSON.parse(localStorage.getItem('database'));
}

createTableFor(applicants);

// 신청자 작성란 버튼
applicationFormButton.addEventListener('click', () => {
  applicationFormButtonState = !applicationFormButtonState;
  if (applicationFormButtonState) {
    applicationFormButton.textContent = '▼ 신청자 표 열기';
    applicationFormContent.classList.add('hide');
  } else {
    applicationFormButton.textContent = '▲ 신청자 표 닫기';
    applicationFormContent.classList.remove('hide');
  }
});

// 신청자 입력
function dosubmit() {
  let conditions = 0;
  if (
    grade.value !== '' &&
    parseInt(grade.value) >= 1 &&
    parseInt(grade.value) <= 3
  ) {
    conditions++;
  }
  if (
    className.value !== '' &&
    parseInt(className.value) >= 1 &&
    parseInt(className.value) <= 7
  ) {
    conditions++;
  }
  if (
    number.value !== '' &&
    parseInt(number.value) >= 1 &&
    parseInt(number.value) <= 32
  ) {
    conditions++;
  }
  if (myname.value !== '') {
    conditions++;
  }

  if (conditions === 4) {
    applicants.push({
      gcn: parseInt(
        `${grade.value}0${className.value}${
          parseInt(number.value) >= 10 ? '' : '0'
        }${number.value}`
      ),
      grade: grade.value,
      className: className.value,
      number: number.value,
      myname: myname.value,
      ox: 0,
    });

    clearTable();
    createTableFor(applicants);
    localStorage.setItem('database', JSON.stringify(applicants));

    grade.value = '';
    className.value = '';
    number.value = '';
    myname.value = '';
    grade.focus();
  } else {
    console.log('fail');
  }
}

submit.addEventListener('click', dosubmit);
document.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    dosubmit();
  }
});

// 신청자 표로 표시
function clearTable() {
  const trs = document.querySelectorAll('.removable');
  trs.forEach((element) => {
    element.remove();
  });
}

function createTableFor(information) {
  for (let i = 0; i < information.length; i++) {
    const tr = document.createElement('tr');
    const counting = document.createElement('td');
    const grading = document.createElement('td');
    const classing = document.createElement('td');
    const numbering = document.createElement('td');
    const naming = document.createElement('td');
    const oxing = document.createElement('td');

    tr.classList.add('removable');
    counting.textContent = (i + 1).toString();
    grading.textContent = information[i].grade;
    classing.textContent = information[i].className;
    numbering.textContent = information[i].number;
    naming.textContent = information[i].myname;
    oxing.textContent = information[i].ox ? 'O' : 'X';
    oxing.classList.add(information[i].ox ? 'blue' : 'red');

    tr.appendChild(counting);
    tr.appendChild(grading);
    tr.appendChild(classing);
    tr.appendChild(numbering);
    tr.appendChild(naming);
    tr.appendChild(oxing);

    applicationFormTable.appendChild(tr);
  }
}

// 내용 다 지우기
removeall.addEventListener('click', () => {
  applicants = [];
  localStorage.setItem('database', JSON.stringify(applicants));
  clearTable();
  createTableFor(applicants);
});

// csv 파일 받아오기
getcsv.onchange = () => {
  const selectedFile = getcsv.files[0];
  const fileReader = new FileReader();
  fileReader.readAsText(selectedFile);
  fileReader.onload = () => {
    const csv = fileReader.result.split('\r\n').map((v) => v.split(','));
    console.log(csv);
    csv.shift();
    applicants = [];
    for (let line of csv) {
      if (line.length !== 4) {
        continue;
      }
      applicants.push({
        gcn: parseInt(
          `${line[0]}0${line[1]}${line[2] >= 10 ? '' : '0'}${line[2]}`
        ),
        grade: line[0],
        className: line[1],
        number: line[2],
        myname: line[3],
        ox: 0,
      });
    }
    localStorage.setItem('database', JSON.stringify(applicants));
    clearTable();
    createTableFor(applicants);
  };
};

// csv 파일 내보내기
release.addEventListener('click', () => {
  let result =
    ['grade', 'class', 'number', 'gcn', 'name', 'ox'].reduce(
      (p, c) => p + ',' + c
    ) + '\n';

  for (let applicant of applicants) {
    result +=
      [
        applicant.grade,
        applicant.className,
        applicant.number,
        applicant.gcn,
        applicant.myname,
        applicant.ox ? 'O' : 'X',
      ].reduce((p, c) => p + ',' + c) + '\n';
  }
  console.log(result);
  const file = new File(['\ufeff' + result], 'result.csv', {
    type: 'text/csv',
  });
  saveAs(file);
});
['grade', 'class', 'number', 'gcn', 'name', 'ox'].reduce((p, c) => p + c);
