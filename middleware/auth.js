function chechUser(req, res, next) {
  const user = req.session.user;
  if (!user) {
    req.flash("error", "Please login");
    return res.redirect("/login");
  }
  next();
}
module.exports = chechUser;
