document.addEventListener("DOMContentLoaded", () => {

  const loanCards = document.querySelectorAll(".loan-card");
  const selectedType = document.getElementById("selectedType");
  const selectedRepayment = document.getElementById("selectedRepayment");
  const selectedTerm = document.getElementById("selectedTerm");

  const studentTypeInput = document.getElementById("studentTypeInput");
  const loanAmountInput = document.getElementById("loanAmountInput");
  const repaymentTotalInput = document.getElementById("repaymentTotalInput");
  const repaymentTermInput = document.getElementById("repaymentTermInput");

  const thankYouModal = document.getElementById("thankYouModal");
  const closeThankYou = document.getElementById("closeThankYou");

  const form = document.getElementById("loanForm");

  function formatRand(value) {
    return "R" + Number(value).toLocaleString("en-ZA");
  }

  function updateLoan(card) {
    const type = card.dataset.type;
    const loan = card.dataset.loan;
    const total = card.dataset.total;
    const months = card.dataset.months;

    if (selectedType) selectedType.textContent = `${type} · ${formatRand(loan)}`;
    if (selectedRepayment) selectedRepayment.textContent = `Repay ${formatRand(total)}`;
    if (selectedTerm) selectedTerm.textContent = `Repayment period: ${months} month`;

    if (studentTypeInput) studentTypeInput.value = type;
    if (loanAmountInput) loanAmountInput.value = loan;
    if (repaymentTotalInput) repaymentTotalInput.value = total;
    if (repaymentTermInput) repaymentTermInput.value = `${months} month`;

    loanCards.forEach((btn) => btn.classList.remove("active"));
    card.classList.add("active");
  }

  loanCards.forEach((card) => {
    card.addEventListener("click", () => updateLoan(card));
  });

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);

      await fetch("https://formspree.io/f/mreybwpd", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      form.reset();

      if (thankYouModal) {
        thankYouModal.classList.remove("hidden");
      }
    });
  }

  if (closeThankYou) {
    closeThankYou.addEventListener("click", () => {
      thankYouModal.classList.add("hidden");
    });
  }

});
