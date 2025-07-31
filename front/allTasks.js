console.log("allTask");

window.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("/api/tasks");
  const tasks = await res.json();

  const taskList = document.getElementById("taskList");
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = `${task.id}: ${task.task}`;
    taskList.appendChild(li);
  });
});
