const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const methodOverride = require("method-override");
const flash = require("express-flash");
const session = require("express-session");

const {
  renderHome,
  renderLogin,
  renderRegister,
  renderContact,
  renderTestimonials,
  authLogin,
  authRegister,
  authLogout,
  renderProject,
  renderProjectDetail,
  deleteProject,
  renderProjectCreate,
  createProject,
  renderProjectEdit,
  updateProject,
  renderError,
} = require("./controllers/controller");
const { durationMonths } = require("./utils/time");
const upload = require("./middleware/upload-file");
const chechUser = require("./middleware/auth");

const port = 3100;

// const { log } = require("console");
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./views"));

//modul apa saja yang kita gunakan didalam express

app.use(express.static("assets"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static("assets")); //agar bisa mengakses assets
app.use("/uploads", express.static(path.join(__dirname, "./uploads"))); //agar bisa mengakses assets
app.use(methodOverride("_method"));
app.use(flash());
app.use(
  session({
    name: "my-session",
    secret: "akjhgt09876",
    resave: false,
    saveUninitialized: true,
  })
);

hbs.registerPartials(__dirname + "/views/partials", function (err) {});
hbs.registerHelper("equal", function (a, b) {
  return a === b;
});
hbs.registerHelper("durationMonths", durationMonths);
// hbs.registerHelper("end_date", end_date);

//HALAMAN HOME
app.get("/", renderHome);
app.get("/login", renderLogin);
app.get("/register", renderRegister);

app.get("/logout", authLogout);
app.post("/login", authLogin);

app.post("/register", authRegister);

//CONTACT ME
app.post("/contact", renderContact);

// BLOG LIST
app.get("/myproject", renderProject);

//CREATE BLOG PAGE
app.post("/myproject-create", chechUser, upload.single("image"), createProject);

//SUBMIT NEW BLOG
app.get("/myproject-create", chechUser, renderProjectCreate);

//Edit Blog
app.get("/myproject-edit/:id", renderProjectEdit);

// SUBMIT/SAVE UPDATE BLOG
app.patch("/myproject-update/:id", updateProject);

// DELETE EXISTING BLOG
app.delete("/myproject/:id", deleteProject);

// BLOG DETAIL
app.get("/myproject/:id", renderProjectDetail);

//TESTIMONIAL
app.get("/testimonials", renderTestimonials);

//404
app.get("*", renderError);

app.listen(port, () => {
  console.log(`My personal web and listening on post ${port}`);
});
