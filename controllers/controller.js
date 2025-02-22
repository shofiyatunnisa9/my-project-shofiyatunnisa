const { Sequelize, QueryTypes, where } = require("sequelize");
const bcrypt = require("bcrypt");
const config = require("../config/config.json");
const { Project, User } = require("../models");
const sequelize = new Sequelize(config.development);

const saltRounds = 10;

async function renderHome(req, res) {
  const user = req.session.user;
  res.render("index", { user: user });
}
async function renderContact(req, res) {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  console.log("New Contact Form Submission:", {
    name,
    email,
    phone,
    subject,
    message,
  });
  res.status(200).json({ message: "Form submitted successfully" });
}
// async function renderContact(req, res) {
//   const user = req.session.user;
//   res.render("contact", { user: user });
// }
// async function renderContact(req, res) {
//   const user = req.session.user;

//   const { name, phone, subject, message } = req.body;

//   const newProject = {
//     name, //ini asma saja dengan menulisakan title : totle
//     phone,
//     subject,
//     message,
//   };
//   const resultSubmit = await Project.create(newProject);
//   console.log();
//   res.redirect("/contact"); // URL, bukan nama file
// }

async function renderTestimonials(req, res) {
  const user = req.session.user;
  res.render("testimonials", { user: user });
}
async function renderLogin(req, res) {
  const user = req.session.user;
  if (user) {
    req.flash("warning", "User tidak ditemukan");
    res.redirect("/");
  } else {
    res.render("auth-login", { user: user });
  }
}
async function renderRegister(req, res) {
  const user = req.session.user;
  if (user) {
    res.redirect("/");
  } else {
    res.render("auth-register", { user: user });
  }
}

async function authLogin(req, res) {
  const { email, password } = req.body;
  // console.log(`yang mau login : ${email}  ${password}`);

  //check kalau usernya ada atau tidak
  const user = await User.findOne({
    where: {
      email: email,
    },
  });
  if (!user) {
    req.flash("error", "User tidak ditemukan");
    return res.redirect("/login");
  }
  //check kalau passwordnya salah

  const isValidated = await bcrypt.compare(password, user.password); //return sebuah booleh apakah true atau false
  if (!isValidated) {
    req.flash("error", "Password missmatch");
    return res.redirect("/login");
  }
  let loggedInUser = user.toJSON(); //convert dari object sequelize ke object biasa

  delete loggedInUser.password;
  console.log("user setelah passwordnya di delete", loggedInUser);

  req.session.user = loggedInUser;
  req.flash("success", `Selamat datang, ${loggedInUser.name}`);
  res.redirect("/");
}

async function authRegister(req, res) {
  const { name, email, password, confirmPassword } = req.body; //object destructuring

  if (password != confirmPassword) {
    req.flash("error", "Password dan Confirm password tidak sesuai");
    return res.render("/register");
  }
  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  if (user) {
    req.flash("error", "Email sudah terpakai");
    return res.redirect("/register");
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newUser = {
    name: name,
    email: email,
    password: hashedPassword,
  };

  console.log("user baru :", newUser);

  const userInsert = await User.create(newUser);

  req.flash("success", "Berhasil register silahkan login");
  res.redirect("/login");
}

async function renderProject(req, res) {
  const user = req.session.user;
  //kalau usernya ada atau kalau

  const projects = await Project.findAll({
    include: {
      model: User,
      as: "user",
      attributes: { exclude: ["password"] },
    },
    order: [["createdAt", "DESC"]],
  });

  console.log("hasil fetch data dari controller", projects);

  if (user) {
    res.render("myproject-list", { projects: projects, user: user });
  } else {
    res.render("myproject-list", { projects: projects });
  }
}
async function renderProjectDetail(req, res) {
  const id = req.params.id;

  const projectYangDipilih = await Project.findOne({
    where: { id: id },
  });

  if (projectYangDipilih === null) {
    res.render("page-404");
  } else {
    console.log("v2 project detail :", projectYangDipilih);
    res.render("myproject-detail", { project: projectYangDipilih, user: user });
  }
}

async function authLogout(req, res) {
  //hapus user dari session
  req.session.user = null;
  res.redirect("/login");
}
async function renderProjectCreate(req, res) {
  res.render("myproject-create");
}
async function createProject(req, res) {
  const user = req.session.user;

  if (!user) {
    req.flash("error", "Please login");
    return res.redirect("/login");
  }
  const { name, description } = req.body;

  let dummyImage = "https://picsum.photos/200/250";

  const image = req.file.path;
  const newProject = {
    name, //ini asma saja dengan menulisakan title : totle
    description,
    authorId: user.id,
    image: image,
  };
  const resultSubmit = await Project.create(newProject);
  console.log();
  res.redirect("/myproject"); // URL, bukan nama file
}

async function renderProjectEdit(req, res) {
  const user = req.session.user;

  const id = req.params.id;
  const projectYangDipilih = await Project.findOne({
    where: { id: id },
  });
  if (projectYangDipilih === null) {
    res.render("page-404");
  } else {
    console.log("v2 project detail :", projectYangDipilih);
    res.render("myproject-edit", { project: projectYangDipilih, user: user });
  }
}

async function updateProject(req, res) {
  const id = req.params.id;
  const { title, content } = req.body;
  console.log("Judulnya adalah ", title);
  console.log("content ", content);

  const updateResult = await Project.update(
    {
      //form edit
      title,
      content,
      updatedAt: sequelize.fn("NOW"),
    },
    {
      //where clause atau filter yang mau di dedit
      where: {
        id,
      },
    }
  );
  console.log("result update :", updateResult);

  res.redirect("/myproject");
}
async function deleteProject(req, res) {
  const id = req.params.id;
  const deleteResult = await Project.destroy({
    where: {
      id: id,
    },
  });
  console.log("result query delete :", deleteResult);

  res.redirect("/myproject");
}
async function renderError(req, res) {
  const user = req.session.user;
  res.render("page-404", { user: user });
}

module.exports = {
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
};
