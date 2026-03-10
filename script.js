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
    if (selectedTerm) selectedTerm.textContent = `${months} month · 30% interest`;

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

  const params = new URLSearchParams(window.location.search);
  if (params.get("submitted") === "1" && thankYouModal) {
    thankYouModal.classList.remove("hidden");
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  if (closeThankYou && thankYouModal) {
    closeThankYou.addEventListener("click", () => {
      thankYouModal.classList.add("hidden");
    });
  }
});
