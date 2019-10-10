const signup = async (name, email, password, passwordConfirm) => {
  console.log(name, email, password, passwordConfirm);
  try {
    const res = await axios({
      method: "POST",
      url: "/playground/users/signup",
      data: {
        name: name,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm
      }
    });

    if (res.data.status === "success") {
      alert("Complete ... Don't for get to loggin");
      window.setTimeout(() => {
        location.assign("/");
      }, 300);
    } else {
      alert("Invalid signup form");
    }
  } catch (err) {
    alert(err.response.data.message);
    console.log(err.response.data);
  }
};

document.querySelector(".form").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("passwordConfirm").value;

  signup(name, email, password, passwordConfirm);
});
