const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://127.0.0.1:3000/playground/users/logout"
    });
    location.reload(true);
    if (res.data.status === "success") {
      alert("Logout successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 900);
    }
  } catch (err) {
    console.log(err);
  }
};

document.querySelector(".logout").addEventListener("click", logout);
