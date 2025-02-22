document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-contact");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    //Cek apakah elemen ada sebelum mengaksesnya
    let name = document.getElementById("name")?.value || "";
    let email = document.getElementById("email")?.value || "";
    let phone = document.getElementById("phone")?.value || "";
    let subject = document.getElementById("subject")?.value || "";
    let message = document.getElementById("message")?.value || "";

    let emailTujuan = "shofiyatunnisa939@gmail.com";

    let mailtoLink = `mailto:${emailTujuan}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(
      `Hello, my name is ${name}. Let's talk via ${phone} about ${subject}. This is my message: ${message}`
    )}`;
    // const mailtoLink = `mailto:shofiyatunnisa939@gmail.com?subject=${encodeURIComponent(
    //   formData.get("subject")
    // )}&body=${encodeURIComponent(
    //   `name: ${formData.get("name")}\n
    //   email: ${formData.get("email")}\n
    //   phone: ${formData.get("phone")}\n
    //   message: ${formData.get("message")}`
    // )}`;

    window.location.href = mailtoLink;
  });
});

// document.addEventListener("DOMContentLoaded", function () {
//   document
//     .getElementById("form-contact")
//     .addEventListener("submit", submitForm);
// });
// function submitForm(event) {
//   event.preventDefault(); // Mencegah reload halaman

//   // Cek apakah elemen ada sebelum mengaksesnya
//   let name = document.getElementById("name")?.value || "";
//   let email = document.getElementById("email")?.value || "";
//   let phone = document.getElementById("phone")?.value || "";
//   let subject = document.getElementById("subject")?.value || "";
//   let message = document.getElementById("message")?.value || "";

//   if (!name || !email || !phone || !subject || !message) {
//     alert("Please fill in all fields!");
//     return;
//   }

//   let emailTujuan = "shofiyatunnisa939@gmail.com";

//   let mailtoLink = `mailto:${emailTujuan}?subject=${encodeURIComponent(
//     subject
//   )}&body=${encodeURIComponent(
//     `Hello, my name is ${name}. Let's talk via ${phone} about ${subject}. This is my message: ${message}`
//   )}`;

//   window.location.href = mailtoLink;
// }
// // Membuka aplikasi email
// window.location.href = mailtoLink;

// // let a = document.createElement("a");

// // a.href = `mailto:${emailTujuan}?subject=${subject}&body=${`Hello, My name is ${name}.lets talk whit me in ${phone} about ${subject}. this my message: ${message}`} `;

// // a.click();
