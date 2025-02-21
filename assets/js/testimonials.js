// let testimonials = [
//   {
//     autor: "shofiyatunnisa",
//     rating: 5,
//     caption: "keren banget",
//     image: "coding.jpg",
//   },
//   {
//     autor: "Min Yoongi",
//     rating: 3,
//     caption: "Manatapuuuuu",
//     image: "coding.jpg",
//   },
//   {
//     autor: "Kin Namjoon",
//     rating: 2,
//     caption: "Luar biazaa, tabarakallah",
//     image: "blog-img.png",
//   },
//   {
//     autor: "Lalamove",
//     rating: 5,
//     caption: "keren banget",
//     image: "coding.jpg",
//   },
// ];

// const testimonialsContainer = document.getElementById("testimonialsContainer");

function fetchTestimonials() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", "https://api.npoint.io/3b7fd364ea48f5420749", true);

    xhr.onload = function () {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        // console.log("Response :", response);
        resolve(response.testimonials);
      } else {
        // console.error("Error :", xhr.status);
        reject("Error :", xhr.status);
      }
    };
    xhr.onerror = () => reject("network error");
    xhr.send();
  });
}
const testimonialsContainer = document.getElementById("testimonialsContainer");
const testimonialsHTML = (daftarTestimoni) => {
  return daftarTestimoni
    .map(
      (testimonial) => `
          <article>
              <img src="${testimonial.image}" alt="testimonials_img">
              <p class="testimonial_item_caption">
                  <i>${testimonial.caption}</i>
              </p>
              <p style="text-align: right;"> - ${testimonial.author}</p>
              <p style="text-align: right; font-weight: bold;" >${testimonial.rating}★</p>
          </article>
          `
    )
    .join("");
};

async function showAllTestimonials() {
  const testimonials = await fetchTestimonials();
  console.log(testimonials);

  testimonialsContainer.innerHTML = testimonialsHTML(testimonials);
}
showAllTestimonials();

async function filterTestimonialsByStar(rating) {
  const testimonials = await fetchTestimonials();

  const filteredTestimonials = testimonials.filter(
    (testimonial) => testimonial.rating === rating
  );
  console.log(filteredTestimonials);

  if (filteredTestimonials.length === 0) {
    return (testimonialsContainer.innerHTML = `<p> No Testimonials</p>`);
  }
  testimonialsContainer.innerHTML = testimonialsHTML(filteredTestimonials);
}
