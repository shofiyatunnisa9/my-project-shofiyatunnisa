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

    window.location.href = mailtoLink;
  });
});
