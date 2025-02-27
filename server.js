const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const methodOverride = require("method-override");
const flash = require("express-flash");
const session = require("express-session");
const cors = require("cors");

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

const upload = require("./middleware/upload-file");
const chechUser = require("./middleware/auth");

const port = 3100;

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./views"));

//modul apa saja yang kita gunakan didalam express

app.use(express.static("assets"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
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
hbs.registerHelper("split", function (technologies, separator) {
  if (typeof technologies === "string") {
    return technologies.split(separator);
  }
  return [];
});
hbs.registerHelper("includes", function (value, array) {
  return array && array.includes(value);
});
//HALAMAN HOME
app.get("/", renderHome);
app.get("/login", renderLogin);
app.get("/register", renderRegister);

app.get("/logout", authLogout);
app.post("/login", authLogin);

app.post("/register", authRegister);

//CONTACT ME
//app.get("/contact", renderContact);
app.get("/contact", (req, res) => {
  res.render("contact");
});

app.post("/contact", renderContact);

// PROJECT LIST
app.get("/myproject", renderProject);

//CREATE PROJECT PAGE
app.post("/myproject-create", chechUser, upload.single("image"), createProject);

//SUBMIT NEW PROJECT
app.get("/myproject-create", chechUser, renderProjectCreate);

//Edit PROJECT

app.get("/myproject-edit/:id", renderProjectEdit);

// SUBMIT/SAVE UPDATE PROJECT
app.patch("/myproject-update/:id", updateProject);

// DELETE EXISTING PROJECT
app.delete("/myproject/:id", deleteProject);

// PROJECT DETAIL
app.get("/myproject/:id", renderProjectDetail);

//TESTIMONIAL
app.get("/testimonials", renderTestimonials);

//404
app.get("*", renderError);

app.listen(port, () => {
  console.log(`My personal web and listening on post ${port}`);
});
