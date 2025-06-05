function showAlert(message, duration = 3000) {
  const alertBox = document.getElementById("alert");
  alertBox.textContent = message;
  alertBox.classList.add("show");
  setTimeout(() => {
    alertBox.classList.remove("show");
  }, duration);
}
