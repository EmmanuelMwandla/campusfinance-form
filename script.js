const form = document.getElementById("loanApplicationForm");
const thankYouModal = document.getElementById("thankYouModal");
const closeThankYou = document.getElementById("closeThankYou");

if (form) {
  form.addEventListener("submit", function (e) {
    const idCopy = document.getElementById("idCopy").files.length;
    const bankStatements = document.getElementById("bankStatements").files.length;
    const bankLetter = document.getElementById("bankLetter").files.length;

    if (!idCopy || !bankStatements || !bankLetter) {
      e.preventDefault();
      alert("Please upload your ID copy, 3 months bank statements, and nominated bank account letter.");
      return;
    }

    e.preventDefault();
    thankYouModal.classList.remove("hidden");
    form.reset();
  });
}

if (closeThankYou) {
  closeThankYou.addEventListener("click", function () {
    thankYouModal.classList.add("hidden");
  });
}
