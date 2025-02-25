document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("project-form");

  if (form) {
    form.addEventListener("submit", (event) => {
      const startDate = new Date(document.getElementById("startDate").value);
      const endDate = new Date(document.getElementById("endDate").value);

      if (endDate < startDate) {
        event.preventDefault();
        alert("End date must be later than start date!");
      }
    });
  }

  const response = await fetch("/myproject");
  const data = await response.json();
  const container = document.querySelector(".project-list");

  if (container && data.projects) {
    container.innerHTML = data.projects
      .map(
        (project, index) => `
          <div class="project-card">
              <img src="${project.image}" alt="${project.name}">
              <h3>${project.name} - ${project.startDate}</h3>
              <p>Durasi: ${project.duration}</p>
              <p>${project.description}</p>
              <div class="tech-icons">
                  ${project.technologies
                    .map((tech) => `<img src="/img/${tech}.png" alt="${tech}">`)
                    .join("")}
              </div>
              <button class="btn btn-edit">Edit</button>
              <button class="btn btn-delete" onclick="deleteProject(${index})">Delete</button>
          </div>
      `
      )
      .join("");
  }

  function calculateDuration(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = endDate - startDate;

    const days = timeDiff / (1000 * 60 * 60 * 24);
    return days >= 0 ? `${days} days` : "Invalid dates";
  }
});
