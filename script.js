// LocalStorage Key
const STORAGE_KEY = "routines";

// Initialize routines from localStorage
let routines = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// DOM Elements
const routinesDiv = document.getElementById("routines");
const routineFormSection = document.getElementById("routineForm");
const formTitle = document.getElementById("formTitle");
const routineIdField = document.getElementById("routineId");
const routineNameField = document.getElementById("routineName");
const tasksField = document.getElementById("tasks");
const addRoutineFab = document.getElementById("addRoutineFab");


// Save routines to localStorage
function saveRoutines() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
}

// Render routines 
function populateRoutines() {
  routinesDiv.innerHTML = ""; // Clear content
  routines.forEach((routine, index) => {
    const routineDiv = document.createElement("div");
    routineDiv.className = "routine";
    routineDiv.innerHTML = `
      <div class="menu" onclick="toggleMenu(event, ${index})">
        ⋮
        <div class="menu-content" id="menu-${index}">
          <button onclick="editRoutine(${index})">Edit</button>
          <button onclick="deleteRoutine(${index})">Delete</button>
        </div>
      </div>
      <h3>${routine.name}</h3>
<ul>
  ${routine.tasks
    .map(
      (task, taskIndex) => `
      <li class="${task.completed ? "completed" : ""}">
        <input type="checkbox" 
          id="task-${index}-${taskIndex}" 
          ${task.completed ? "checked" : ""} 
          onchange="toggleTask(${index}, ${taskIndex})">
        <label for="task-${index}-${taskIndex}">${task.name}</label>
      </li>
    `
    )
    .join("")}
</ul>
    `;
    routinesDiv.appendChild(routineDiv);
  });
}

// Initial Load
  updateProgressBar();
  populateRoutines();
  
// Toggle Task Completion
function toggleTask(routineIndex, taskIndex) {
  routines[routineIndex].tasks[taskIndex].completed =
    !routines[routineIndex].tasks[taskIndex].completed;
  saveRoutines();
  populateRoutines();
  updateProgressBar();
}

// Add Routine
function addRoutine(event) {
  event.preventDefault();
  const routineName = routineNameField.value.trim();
  const tasks = tasksField.value
    .split(",")
    .map((task) => ({ name: task.trim(), completed: false }))
    .filter((task) => task.name);

  if (routineName && tasks.length) {
    const routineId = routineIdField.value;
    if (routineId) {
      // Edit existing routine
      routines[routineId] = { name: routineName, tasks };
    } else {
      // Add new routine
      routines.push({ name: routineName, tasks });
    }
    saveRoutines();
    resetForm();
    populateRoutines();
    updateProgressBar();
    routineFormSection.style.display = "none";
  }
}

// Edit Routine
function editRoutine(index) {
  const routine = routines[index];
  routineIdField.value = index;
  routineNameField.value = routine.name;
  tasksField.value = routine.tasks.map((task) => task.name).join(", ");
  formTitle.innerText = "Edit Routine";
  routineFormSection.style.display = "block";
}

// Delete Routine
function deleteRoutine(index) {
  // Display a confirmation alert
  const userConfirmed = confirm("Are you sure you want to delete this routine?");
  
  if (userConfirmed) {
    // Proceed with deletion if the user confirms
    routines.splice(index, 1);
    saveRoutines();
    populateRoutines();
    updateProgressBar();
  }
}



// Reset Form
function resetForm() {
  routineIdField.value = "";
  routineNameField.value = "";
  tasksField.value = "";
  formTitle.innerText = "Add Routine";
}

// Toggle Menu
function toggleMenu(event, index) {
  event.stopPropagation();
  const menu = document.getElementById(`menu-${index}`);
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Close all menus when clicking outside
document.addEventListener("click", () => {
  document.querySelectorAll(".menu-content").forEach((menu) => {
    menu.style.display = "none";
  });
});



// Event Listeners
addRoutineFab.addEventListener("click", () => {
  resetForm();
  routineFormSection.style.display = "block";
});

document
  .getElementById("saveRoutine")
  .addEventListener("click", addRoutine);
document
  .getElementById("cancelRoutine")
  .addEventListener("click", () => (routineFormSection.style.display = "none"));

// Initial Load
// populateRoutines();




// Update Daily Progress Bar
function updateProgressBar() {
  const totalTasks = routines.reduce((sum, routine) => sum + routine.tasks.length, 0);
  const completedTasks = routines.reduce(
    (sum, routine) =>
      sum + routine.tasks.filter((task) => task.completed).length,
    0
  );

  const percentage = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  document.getElementById("progressBar").style.width = `${percentage}%`;
}


// Function to reset checkmarks and populate routines for the new day
function resetTasks() {
	 const userConfirmed = confirm("Press Okay for Fresh Start!");
  
  if (userConfirmed) {// Loop through all routines and reset task checkmarks
	  routines.forEach((routine) => {
    routine.tasks.forEach((task) => {
      task.completed = false;  // Reset the checkmark (uncheck all tasks)
    });
  });
  saveRoutines();
  populateRoutines();
  updateProgressBar();

  }
}
resetTasks();
/*

// Trigger the function at the specified time
triggerFunctionAtSpecificTime();



function triggerFunctionAtSpecificTime() {
    // Set the specific time (e.g., 9:00 AM)
    const specificTime = new Date();
    specificTime.setHours(3, 03, 0, 0);  // Set time to 9:00 AM

    // Calculate the delay until the specific time
    const now = new Date();
    let delay = specificTime - now;

    // If the time has already passed today, set the delay for the next day
    if (delay < 0) {
        delay += 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    }

    // Set a timeout to trigger the function at the specific time
    setTimeout(() => {
        // Call your function here
        resetTasks();
        console.log("Function triggered!");
        // Refresh the page after the function call
        location.reload();

        // Set the function to trigger again the next day
        setInterval(() => {
           resetTasks();
		   console.log("Function triggered!");
            location.reload();
        }, 24 * 60 * 60 * 1000);  // 24 hours in milliseconds
    }, delay);
}


*/

// Export routines to JSON
function exportRoutines() {
  // Convert routines array to JSON string
  const dataStr = JSON.stringify(routines, null, 2);

  // Create a Blob and download it as a file
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Create a temporary link element to trigger download
  const link = document.createElement("a");
  link.href = url;
  link.download = "routines.json"; // File name for export
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Import routines from JSON
function importRoutines(event) {
  // Access the uploaded file
  const file = event.target.files[0];
  if (!file) {
    alert("No file selected for import.");
    return;
  }

  // Read the file as text
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedData = JSON.parse(e.target.result);

      // Validate the imported data structure
      if (Array.isArray(importedData) && importedData.every(validateRoutine)) {
        routines = importedData; // Replace current routines with imported data
          
		populateRoutines(); // Re-render the UI
		updateProgressBar();
        alert("Routines imported successfully!");
      } else {
        throw new Error("Invalid data format.");
      }
    } catch (error) {
      alert("Failed to import routines. Ensure the file format is correct.");
      console.error(error);
    }
  };
  reader.readAsText(file);
}

// Validate routine structure
function validateRoutine(routine) {
  return (
    typeof routine.name === "string" &&
    Array.isArray(routine.tasks) &&
    routine.tasks.every(task => typeof task.name === "string" && typeof task.completed === "boolean")
  );
}

// Add event listeners for export and import buttons
document.getElementById("exportBtn").addEventListener("click", exportRoutines);
document.getElementById("importInput").addEventListener("change", importRoutines);



// Toggle import/export menu visibility
document.getElementById("toggleMenu").addEventListener("click", () => {
  const menu = document.getElementById("importExportMenu");
  if (menu.style.display === "none" || !menu.style.display) {
    menu.style.display = "flex"; // Show menu
  } else {
    menu.style.display = "none"; // Hide menu
  }
});








