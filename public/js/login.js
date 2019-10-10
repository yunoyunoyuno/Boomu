const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/playground/users/login",
      data: {
        email: email,
        password: password
      }
    });

    if (res.data.status === "success") {
      alert("Login successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 300);
    } else {
      alert("Wrong email or Password");
    }
  } catch (err) {
    if (err.response.data.message.startsWith("C")) alert("Can't Find This User in Database");
    else alert(err.response.data.message);
    console.log(err.response.data);
  }
};

document.querySelector(".form").addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  login(email, password);
});
