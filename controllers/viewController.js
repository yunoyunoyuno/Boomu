exports.getHomePage = (req, res) => {
  res.status(200).render("homepage", {
    title: "Home Page",
    currentUser: res.locals.user || false
  });
};

exports.login = (req, res) => {
  res.status(200).render("loginpage", {
    title: "Login",
    currentUser: res.locals.user || false
  });
};

exports.signup = (req, res) => {
  res.status(200).render("signup", {
    title: "Sign Up",
    currentUser: res.locals.user || false
  });
};

exports.getTests = (req, res) => {
  res.status(200).render("test", {
    title: "Test Page",
    currentUser: res.locals.user || false
  });
};
