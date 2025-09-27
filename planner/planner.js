function slidbar() {
  document.body.classList.toggle("open");
  const sliderBtn = document.getElementById("slider-btn");
  sliderBtn.textContent = document.body.classList.contains("open") ? "✖" : "☰";
}

// Planner Logic
let manualMode = false;

function switchMode(mode) {
  manualMode = (mode === "manual");
  document.getElementById("manualSection").style.display = manualMode ? "block" : "none";
  document.getElementById("aiSection").style.display = manualMode ? "none" : "block";
  if (manualMode) loadManualSchedule();
  else resetTable();
}

function addTask() {
  if (!manualMode) return;
  let day = document.getElementById("daySelect").value;
  let task = document.getElementById("taskInput").value.trim();
  if (!task) { alert("Please enter a task!"); return; }

  let rows = document.querySelectorAll("#plannerTable tbody tr");
  rows.forEach(row => {
    if (row.cells[0].innerText === day) {
      let tasksCell = row.cells[1];
      if (tasksCell.innerText === "No tasks") {
        tasksCell.innerHTML = createTaskItem(task, day);
      } else {
        tasksCell.innerHTML += " " + createTaskItem(task, day);
      }
    }
  });
  document.getElementById("taskInput").value = "";
}

function createTaskItem(task, day) {
  const taskId = generateTaskId();
  return `<span class="task-item">${task}<button class="delete-task-btn" onclick="deleteTask('${taskId}', '${day}')" title="Delete task">✖</button></span>`;
}

function generateTaskId() {
  return "task_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
}

function deleteTask(taskId, day) {
  let rows = document.querySelectorAll("#plannerTable tbody tr");
  rows.forEach(row => {
    if (row.cells[0].innerText === day) {
      let tasksCell = row.cells[1];
      // Remove the specific task item
      let taskItems = tasksCell.querySelectorAll(".task-item");
      taskItems.forEach(item => {
        let deleteBtn = item.querySelector(".delete-task-btn");
        if (deleteBtn && deleteBtn.onclick.toString().includes(taskId)) {
          item.remove();
        }
      });

      // If no tasks left, show "No tasks"
      if (tasksCell.innerHTML.trim() === "" || tasksCell.querySelectorAll(".task-item").length === 0) {
        tasksCell.innerHTML = "No tasks";
      }
    }
  });
}

function deleteAllTasks(day) {
  if (confirm(`Are you sure you want to delete all tasks for ${day}?`)) {
    let rows = document.querySelectorAll("#plannerTable tbody tr");
    rows.forEach(row => {
      if (row.cells[0].innerText === day) {
        row.cells[1].innerHTML = "No tasks";
      }
    });
  }
}

async function saveManualSchedule() {
  let rows = document.querySelectorAll("#plannerTable tbody tr");
  let schedule = {};
  rows.forEach(row => {
    let day = row.cells[0].innerText;
    let tasksCell = row.cells[1];
    let tasks = [];

    if (tasksCell.innerText !== "No tasks") {
      let taskItems = tasksCell.querySelectorAll(".task-item");
      taskItems.forEach(item => {
        let taskText = item.childNodes[0].textContent.trim();
        if (taskText) tasks.push(taskText);
      });
    }

    schedule[day] = tasks;
  });

  // For demo purposes, we'll use localStorage instead of server
  localStorage.setItem("manualSchedule", JSON.stringify(schedule));
  alert("✅ Manual schedule saved!");
}

async function loadManualSchedule() {
  // For demo purposes, load from localStorage
  let savedSchedule = localStorage.getItem("manualSchedule");
  if (!savedSchedule) return;

  let data = JSON.parse(savedSchedule);
  resetTable();

  let rows = document.querySelectorAll("#plannerTable tbody tr");
  rows.forEach(row => {
    let day = row.cells[0].innerText;
    if (data[day] && data[day].length > 0) {
      let tasksHtml = "";
      data[day].forEach(task => {
        tasksHtml += createTaskItem(task, day) + " ";
      });
      row.cells[1].innerHTML = tasksHtml.trim();
    }
  });
}

async function clearManualSchedule() {
  if (confirm("Are you sure you want to clear the entire schedule?")) {
    resetTable();
    localStorage.removeItem("manualSchedule");
    alert("🗑 Manual schedule cleared!");
  }
}

function resetTable() {
  let rows = document.querySelectorAll("#plannerTable tbody tr");
  rows.forEach(row => row.cells[1].innerHTML = "No tasks");
}

async function generateAISchedule() {
  let subjects = document.getElementById("subjectsInput").value.split(",").map(s => s.trim());
  let hours = parseInt(document.getElementById("timeInput").value);

  if (!subjects[0] || !hours) {
    alert("Please enter subjects and hours per day!");
    return;
  }

  // Simple AI schedule generation for demo
  let schedule = generateSimpleSchedule(subjects, hours);
  resetTable();

  let rows = document.querySelectorAll("#plannerTable tbody tr");
  rows.forEach(row => {
    let day = row.cells[0].innerText;
    if (schedule[day] && schedule[day].length > 0) {
      let tasksHtml = "";
      schedule[day].forEach(task => {
        tasksHtml += createTaskItem(task, day) + " ";
      });
      row.cells[1].innerHTML = tasksHtml.trim();
    }
  });

  alert("🤖 AI schedule generated!");
}

function generateSimpleSchedule(subjects, hours) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  let schedule = {};

  days.forEach((day, index) => {
    schedule[day] = [];
    subjects.forEach(subject => {
      let taskHours = Math.ceil(hours / subjects.length);
      schedule[day].push(`Study ${subject} (${taskHours}h)`);
    });
  });

  return schedule;
}