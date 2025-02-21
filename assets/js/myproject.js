document
  .getElementById("project-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let start_date = new Date(document.getElementById("start_date").value);
    let end_date = new Date(document.getElementById("end_date").value);
    let description = document.getElementById("description").value;
    let image = document.getElementById("image").value;

    let imagefileName = URL.createObjectURL(image.files[0]);

    let techs = [];
    if (document.getElementById("nodejs").checked)
      techs.push("/img/nodejs.png");
    if (document.getElementById("reactjs").checked)
      techs.push("/img/react.png");
    if (document.getElementById("nextjs").checked)
      techs.push("/img/next.js.png");
    if (document.getElementById("typescript").checked)
      techs.push("/img/typescript.png");

    // Menghitung durasi dalam bulan
    function hitungDurasi() {
      // let start_date = new Date(document.getElementById("start_date").value);
      // let end_date = new Date(document.getElementById("end_date").value);

      if (isNaN(start_date) || isNaN(end_date)) {
        alert("Silakan masukkan tanggal yang valid.");
        return;
      }

      if (end_date < start_date) {
        alert("End Date harus lebih besar dari Start Date.");
        return;
      }

      let tahun = end_date.getFullYear() - start_date.getFullYear();
      let bulan = end_date.getMonth() - start_date.getMonth();

      let totalBulan = tahun * 12 + bulan;

      document.getElementById("result").innerText = totalBulan;
    }

    let projectList = document.getElementById("myProject_list");
    let projectCard = document.createElement("div");
    projectCard.classList.add("project-card");
    projectCard.innerHTML = `
                  <img src=${image} alt="myProject_img">
                  <h3 class="myProject_item_caption " style="font-weight: bold;">${name}</h3>
                  <p>${description}</p>
                  <p style="color: gray;">duration: ${durationMonths} bulan</p>
                  <div class='tech-images'>${techs
                    .map((img) => `<img src="${img}" alt="Tech">`)
                    .join("")}</div>
                  <div class="myProject_buttons">
                  <div class="button_myProject">
                  <button type="submit">Edit</button>
                  </div>
                  <div class="button_myProject">
                  <button type="submit">Delete</button>
                  </div>
                  </div>`;
    projectList.appendChild(projectCard);
  });
// function renderProject() {
//   let project_listElement = document.getElementById("myProject_list");

//   project_listElement.innerHTML = firstProjectContent();

//   for (let index = 0; index < blogs.length; index++) {
//     console.log(blogs[index]);

//     blog_listElement.innerHTML += ``
//   }}
// {/* <div id="myProject" class="myProject_list">
//         <article>
//             <img src="/img/pict2.jpg" alt="myProject_img">
//             <h4 class="myProject_item_caption " style="font-weight: bold;">
//                 Dumbways Mobile Apps - 2025
//             </h4>
//             <p style="color: gray;">durasi : 3 bulan</p>
//             <p>App that used for dumbways student, it way deployed and can downloaded on playstore or appstore. Happy
//                 download</p>
//             <div id="icon_myProject">
//                 <img src="/img/playstore.png" alt="">
//                 <img src="/img/android.png" alt="">
//                 <img src="/img/java.png" alt="">
//             </div>
//             <p></p>

//             <div class="myProject_buttons">
//                 <div class="button_myProject">
//                     <button type="submit">Edit</button>
//                 </div>
//                 <div class="button_myProject">
//                     <button type="submit">Delete</button>
//                 </div>
//             </div>

//         </article>
//         </div> */}
