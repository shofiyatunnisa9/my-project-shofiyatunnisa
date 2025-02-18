function submitForm(event) {
  event.preventDefault();

  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone").value;
  let subject = document.getElementById("subject").value;
  let message = document.getElementById("message").value;

  let emailTujuan = "shofiyatunnisa939@gmail.com";

  let a = document.createElement("a");

  a.href = `mailto:${emailTujuan}?subject=${subject}&body=${`Hello, My name is ${name}.lets talk whit me in ${phone} about ${subject}. this my message: ${message}`} `;

  a.click();
}
