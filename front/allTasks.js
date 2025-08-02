console.log("allTask");

window.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("/api/tasks");
  const tasks = await res.json();

  const taskList = document.getElementById("taskList");
  if (tasks.length === 0) {
    const p = document.createElement("p");
    p.innerText = "タスクがありません";
    taskList.appendChild(p);
  } else {
    let i = 1;
    tasks.forEach((task) => {
      const li = document.createElement("li");
      const deleteButto = document.createElement("button");
      deleteButto.innerText = "削除";
      deleteButto.id = task.id;
      deleteButto.onclick = () => deleteTask(deleteButto.id);
      li.textContent = `${task.id}: ${task.task}:`;
      taskList.appendChild(li);
      li.appendChild(deleteButto);
      i++;
    });
  }
});

async function deleteTask(id) {
  const req = await fetch("api/delete/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
    }),
  });
  if (req.status === 200) {
    window.location.reload();
  }
}
