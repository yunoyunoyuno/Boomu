const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/playground/users/logout"
    });
    location.reload(true);
    if (res.data.status === "success") {
      alert("Logout successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 300);
    }
  } catch (err) {
    console.log(err);
  }
};

document.querySelector(".logout").addEventListener("click", e => {
  e.preventDefault();
  logout();
});
