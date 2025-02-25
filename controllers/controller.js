const { Sequelize, QueryTypes, where } = require("sequelize");
const bcrypt = require("bcrypt");
const fs = require("fs");
// const path = require("path");
const config = require("../config/config.json");
const { Project, User } = require("../models");
// const filePath = path.join(__dirname, "projects.json");
const sequelize = new Sequelize(config.development);
const timeUtils = require("../utils/time");

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
const projects = []; // Penyimpanan sementara proyek (bisa diganti dengan database)

async function createProject(req, res) {
  try {
    const user = req.session.user;
    if (!user) {
      req.flash("error", "Please login");
      return res.redirect("/login");
    }

    const { name, startDate, endDate, description, technologies } = req.body;

    if (!name || !startDate || !endDate || !description || !technologies) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res
        .status(400)
        .json({ message: "End date must be after start date!" });
    }
    const techArray = Array.isArray(technologies)
      ? technologies
      : [technologies];
    // Fungsi menghitung durasi dalam bulan & hari
    const calculateDuration = (start, end) => {
      const startDate = new Date(start);
      const endDate = new Date(end);

      let months =
        (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth());
      let days = endDate.getDate() - startDate.getDate();

      if (days < 0) {
        months -= 1;
        const lastMonth = new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          0
        );
        days += lastMonth.getDate();
      }

      if (months > 0 && days > 0) return `${months} months, ${days} days`;
      if (months > 0) return `${months} months`;
      return `${days} days`;
    };

    const duration = calculateDuration(startDate, endDate);

    // Handle upload file gambar (jika ada)
    const image = req.file
      ? `/uploads/${req.file.filename}`
      : "/uploads/default.png";

    // Simpan proyek ke database
    await Project.create({
      name,
      startDate,
      endDate,
      duration, // Menyimpan format "X months, Y days"
      description,
      technologies: techArray,
      image,
      authorId: user.id,
    });

    // Redirect ke halaman /myproject setelah submit
    return res.redirect("/myproject");
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// async function createProject(req, res) {
//   const user = req.session.user;
//   if (!user) {
//     req.flash("error", "Please login");
//     return res.redirect("/login");
//   }
//   const { name, startDate, endDate, description } = req.body;
//   const technologies = Array.isArray(req.body.technologies)
//     ? req.body.technologies // Sudah array, gunakan langsung
//     : typeof req.body.technologies === "string"
//     ? req.body.technologies.split(",").map((tech) => tech.trim()) // Ubah string CSV jadi array
//     : [];

//   const image = req.file.path;
//   // Hitung durasi dalam hari
//   const duration = Math.ceil(
//     (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
//   );
//   const newProject = {
//     authorId: user.id,
//     image: image,
//     name,
//     startDate,
//     endDate,
//     duration,
//     description,
//     technologies: JSON.stringify(technologies),
//   };

//   const resultSubmit = await Project.create(newProject);

//   // let query = `INSERT INTO "Projects" (name, startDate, endDate, description, technologies, duration, image) VALUES ('${name}', '${startDate}', '${endDate}', '${description}', '${technologies}', '${duration}', '${image}') RETURNING *",
//   //     [name, startDate, endDate, description, technologies, duration, image]`;

//   // const newProject = await sequelize.query(query, { type: QueryTypes.INSERT });

//   res.redirect("/myproject");
// }

// async function createProject(req, res) {
//   const user = req.session.user;

//   if (!user) {
//     req.flash("error", "please login");
//     return res.redirect("/login");
//   }
//   function hitungDurasi(start, end) {
//     const diffMonths =
//       (endDate.getFullYear() - startDate.getFullYear()) * 12 +
//       (endDate.getMonth() - startDate.getMonth());
//     return diffMonths > 1 ? `${diffMonths} bulan` : `1 bulan`;
//   }
//   // Hitung durasi (dalam bulan)
//   const startDate = new Date(startDate);
//   const endDate = new Date(endDate);
//   const duration = hitungDurasi(startDate, endDate);

//   let projects = [];
//   if (fs.existsSync(filePath)) {
//     projects = JSON.parse(fs.readFileSync(filePath, "utf-8"));
//   }
//   function hitungDurasi(start, end) {
//     const startDate = new Date(start);
//     const endDate = new Date(end);
//     const diffMonths =
//       (endDate.getFullYear() - startDate.getFullYear()) * 12 +
//       (endDate.getMonth() - startDate.getMonth());
//     return diffMonths > 1 ? `${diffMonths} bulan` : `1 bulan`;
//   }

//   const { name, description, technologies } = req.body;
//   const image = req.file.path;
//   const newProject = {
//     authorId: user.id,
//     image: image,
//     name,
//     startDate,
//     endDate,
//     duration,
//     description,
//     technologies: JSON.stringify(technologies),
//   };
//   try {
//     const projects = await Project.findAll();
//     res.json(
//       projects.map((project) => ({
//         ...project.toJSON(),
//         technologies: JSON.parse(project.technologies), // Konversi kembali ke array
//       }))
//     );
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
//   const resultSubmit = await Project.create(newProject);
//   res.redirect("/myproject");
// }

// exports.getProjects = (req, res) => {
//     res.render("myproject-list", { projects });
// };

// async function createProject(req, res) {
//   const user = req.session.user;
//   if (!user) {
//     req.flash("error", "Please login.");
//     return res.redirect("/login");
//   }

//   const { name, startDate, endDate, description, technologies } = req.body;
//   const image = req.file ? `/uploads/${req.file.filename}` : null;

//   if (!name || !startDate || !endDate || !description) {
//     return res.status(400).send("All fields are required.");
//   }

//   const duration = timeUtils.calculateDuration(startDate, endDate);
//   try {
//     const newProject = await Project.create({
//       authorId: user.id,
//       name,
//       startDate,
//       endDate,
//       description,
//       technologies,
//       image,
//       duration,
//     });

//     console.log("Proyek baru ditambahkan:", newProject);
//     res.redirect("/myproject");
//   } catch (error) {
//     console.error("Gagal menambahkan proyek:", error);
//     res.status(500).send("Server error");
//   }
// }

// exports.deleteProject = (req, res) => {
//     const index = req.params.index;
//     projects.splice(index, 1);
//     res.sendStatus(200);
// };
// async function createProject(req, res) {
//   const user = req.session.user;

//   if (!user) {
//     req.flash("error", "Please login.");
//     return res.redirect("/login");
//   }
//   // create blog submission
//   const { name, startDate, endDate, duration, description, technologies } =
//     req.body; // title dan content adalah properti milik req.body

//   let dummyImage = "https://picsum.photos/200/150";

//   const image = req.file.path;
//   console.log("image yg di upload :", image);

//   const newProject = {
//     name, // ini sama saja dengan menuliskan title: title
//     startDate,
//     endDate,
//     duration,
//     description,
//     technologies,
//     authorId: user.id,
//     image: image,
//   };

//   const resultSubmit = await Project.create(newProject); // apa result nya ketika disubmit, gagal atau berhasil?

//   res.redirect("/blog"); // URL, bukan nama file
// }

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
  const { name, startDate, endDate, description, technologies } = req.body;
  console.log("Judulnya adalah ", name);
  console.log("Start date ", startDate);
  console.log("End date ", endDate);
  console.log("Description ", description);
  console.log("Technologies ", technologies);

  const updateResult = await Project.update(
    {
      //form edit
      name,
      startDate,
      endDate,
      description,
      technologies,
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
