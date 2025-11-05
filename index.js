// Tab Navigation
const tabs = document.querySelectorAll('.tab-btn');
const contents = document.querySelectorAll('.tab-content');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// To-Do List
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const prioritySelect = document.getElementById('prioritySelect');
const todoList = document.getElementById('todoList');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let tasksCompleted = 0;

function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach((task, i) => {
    const li = document.createElement('li');
    li.textContent = task.text;
    const span = document.createElement('span');
    span.textContent = task.priority;
    span.classList.add('priority', task.priority);
    li.appendChild(span);

    const doneBtn = document.createElement('button');
    doneBtn.textContent = '✓';
    doneBtn.style.marginLeft = '1rem';
    doneBtn.onclick = () => {
      todos.splice(i, 1);
      tasksCompleted++;
      document.getElementById('tasksCompleted').textContent = tasksCompleted;
      saveTodos();
      renderTodos();
    };
    li.appendChild(doneBtn);

    todoList.appendChild(li);
  });
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

todoForm.addEventListener('submit', e => {
  e.preventDefault();
  todos.push({text: todoInput.value, priority: prioritySelect.value});
  saveTodos();
  renderTodos();
  todoInput.value = '';
});

renderTodos();

// Schedule Organizer
const scheduleForm = document.getElementById('scheduleForm');
const className = document.getElementById('className');
const classTime = document.getElementById('classTime');
const scheduleList = document.getElementById('scheduleList');

let schedules = JSON.parse(localStorage.getItem('schedules')) || [];
function renderSchedules() {
  scheduleList.innerHTML = '';
  schedules.forEach((item, i) => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - ${item.time}`;
    const delBtn = document.createElement('button');
    delBtn.textContent = 'X';
    delBtn.style.marginLeft = '1rem';
    delBtn.onclick = () => {
      schedules.splice(i, 1);
      saveSchedules();
      renderSchedules();
    };
    li.appendChild(delBtn);
    scheduleList.appendChild(li);
  });
}
function saveSchedules(){
  localStorage.setItem('schedules', JSON.stringify(schedules));
}
scheduleForm.addEventListener('submit', e => {
  e.preventDefault();
  schedules.push({name: className.value, time: classTime.value});
  saveSchedules();
  renderSchedules();
  className.value = '';
  classTime.value = '';
});
renderSchedules();

// Assignments Tracker
const assignmentForm = document.getElementById('assignmentForm');
const assignmentName = document.getElementById('assignmentName');
const assignmentDue = document.getElementById('assignmentDue');
const assignmentsList = document.getElementById('assignmentsList');

let assignments = JSON.parse(localStorage.getItem('assignments')) || [];
let assignmentsCompleted = 0;

function renderAssignments() {
  assignmentsList.innerHTML = '';
  assignments.forEach((assgn, i) => {
    const li = document.createElement('li');
    li.textContent = `${assgn.name} - Due: ${assgn.due}`;
    const doneBtn = document.createElement('button');
    doneBtn.textContent = '✓';
    doneBtn.style.marginLeft = '1rem';
    doneBtn.onclick = () => {
      assignments.splice(i, 1);
      assignmentsCompleted++;
      document.getElementById('assignmentsCompleted').textContent = assignmentsCompleted;
      saveAssignments();
      renderAssignments();
    };
    li.appendChild(doneBtn);

    assignmentsList.appendChild(li);
  });
}
function saveAssignments(){
  localStorage.setItem('assignments', JSON.stringify(assignments));
}
assignmentForm.addEventListener('submit', e => {
  e.preventDefault();
  assignments.push({name: assignmentName.value, due: assignmentDue.value});
  saveAssignments();
  renderAssignments();
  assignmentName.value = '';
  assignmentDue.value = '';
});
renderAssignments();

// Pomodoro Timer
let timerDuration = 25 * 60; // 25 minutes
let timer = timerDuration;
let intervalId = null;
const timerDisplay = document.getElementById('timerDisplay');
const startTimerBtn = document.getElementById('startTimer');
const pauseTimerBtn = document.getElementById('pauseTimer');
const resetTimerBtn = document.getElementById('resetTimer');

function updateDisplay() {
  let minutes = Math.floor(timer / 60).toString().padStart(2, '0');
  let seconds = (timer % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function startTimer() {
  if (intervalId) return;
  intervalId = setInterval(() => {
    if (timer > 0) {
      timer--;
      updateDisplay();
    } else {
      clearInterval(intervalId);
      intervalId = null;
      alert('Pomodoro session completed! Time for a break.');
    }
  }, 1000);
}

function pauseTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function resetTimer() {
  pauseTimer();
  timer = timerDuration;
  updateDisplay();
}

startTimerBtn.addEventListener('click', startTimer);
pauseTimerBtn.addEventListener('click', pauseTimer);
resetTimerBtn.addEventListener('click', resetTimer);
updateDisplay();

// Document Reader with Time Tracker
const fileInput = document.getElementById('fileInput');
const docContent = document.getElementById('docContent');
const pdfViewer = document.getElementById('pdfViewer');
const timeSpentEl = document.getElementById('timeSpent');

let docTimerInterval = null;
let docTimeSeconds = 0;
let docOpenTime = null;

fileInput.addEventListener('change', function() {
  const file = this.files[0];
  if (!file) return;
  docContent.textContent = '';
  pdfViewer.innerHTML = '';
  docTimeSeconds = 0;
  timeSpentEl.textContent = 'Time spent on document: 0 seconds';
  if (docTimerInterval) clearInterval(docTimerInterval);

  if (file.type === 'application/pdf') {
    const fileReader = new FileReader();
    fileReader.onload = function() {
      const typedarray = new Uint8Array(this.result);

      pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
        pdfViewer.innerHTML = '';
        for(let pageNum=1; pageNum <= pdf.numPages; pageNum++){
          pdf.getPage(pageNum).then(function(page){
            const viewport = page.getViewport({scale:1.5});
            const canvas = document.createElement('canvas');
            canvas.style.display = 'block';
            const ctx = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            pdfViewer.appendChild(canvas);
            page.render({canvasContext: ctx, viewport: viewport});
          });
        }
      });
    };
    fileReader.readAsArrayBuffer(file);
    docOpenTime = Date.now();
    docTimerInterval = setInterval(() => {
      docTimeSeconds++;
      timeSpentEl.textContent = `Time spent on document: ${docTimeSeconds} seconds`;
    }, 1000);
  } else if (file.type === 'text/plain') {
    const reader = new FileReader();
    reader.onload = function(e) {
      docContent.textContent = e.target.result;
      docOpenTime = Date.now();
      docTimerInterval = setInterval(() => {
        docTimeSeconds++;
        timeSpentEl.textContent = `Time spent on document: ${docTimeSeconds} seconds`;
      }, 1000);
    }
    reader.readAsText(file);
  } else {
    docContent.textContent = 'Preview unavailable for this file type.';
  }
});

// Notifications for upcoming assignments
function notifyUser(message){
  if(Notification.permission === 'granted'){
      new Notification(message);
  }
}
if(Notification.permission !== 'granted') {
  Notification.requestPermission();
}
setInterval(()=>{
  const now = new Date();
  assignments.forEach(assignment => {
    const dueDate = new Date(assignment.due);
    const diffMinutes = (dueDate - now)/60000;
    if(diffMinutes > 0 && diffMinutes < 60){
      notifyUser(`Reminder: ${assignment.name} is due soon!`);
    }
  });
}, 60000);

// Random Motivational Videos - YouTube video IDs related to study motivation
const motivationVideos = [
  '5MgBikgcWnY',
  'xvFZjo5PgG0',
  'WrsFXgQk5UI',
  '2Xc9gXyf2G4',
  'dQw4w9WgXcQ'
];

function loadRandomMotivationVideo() {
  const iframe = document.getElementById('motivationVideo');
  const randomIndex = Math.floor(Math.random() * motivationVideos.length);
  iframe.src = `https://www.youtube.com/embed/${motivationVideos[randomIndex]}?rel=0&autoplay=0`;
}

loadRandomMotivationVideo();

// Random Study Tips Array
const studyTips = [
  'Break study sessions into chunks using the Pomodoro technique.',
  'Use active recall and spaced repetition to improve memory.',
  'Set clear and achievable goals before starting any session.',
  'Eliminate distractions from your study environment.',
  'Stay hydrated and take regular breaks to improve concentration.',
  'Explain what you learned to someone else to reinforce understanding.',
  'Keep a consistent study schedule to build habits.'
];

function showRandomStudyTip() {
  const tipElement = document.getElementById('studyTip');
  const randomIndex = Math.floor(Math.random() * studyTips.length);
  tipElement.textContent = studyTips[randomIndex];
}

showRandomStudyTip();
