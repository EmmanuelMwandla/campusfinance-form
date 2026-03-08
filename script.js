document.addEventListener("DOMContentLoaded", () => {
  const loanButtons = document.querySelectorAll(".loan-option");
  const selectedLoan = document.getElementById("selectedLoan");
  const selectedRepayment = document.getElementById("selectedRepayment");
  const selectedMonths = document.getElementById("selectedMonths");

  const loanAmountInput = document.getElementById("loanAmountInput");
  const repaymentTotalInput = document.getElementById("repaymentTotalInput");
  const repaymentMonthsInput = document.getElementById("repaymentMonthsInput");

  const thankYouBox = document.getElementById("thankYouBox");

  function formatRand(value) {
    return "R" + Number(value).toLocaleString("en-ZA");
  }

  function updateLoan(amount, months, button) {
    const total = Math.round(amount * 1.3);

    if (selectedLoan) {
      selectedLoan.textContent = formatRand(amount);
    }

    if (selectedRepayment) {
      selectedRepayment.textContent = `Repay ${formatRand(total)}`;
    }

    if (selectedMonths) {
      selectedMonths.textContent = `${months} month${months > 1 ? "s" : ""}`;
    }

    if (loanAmountInput) {
      loanAmountInput.value = amount;
    }

    if (repaymentTotalInput) {
      repaymentTotalInput.value = total;
    }

    if (repaymentMonthsInput) {
      repaymentMonthsInput.value = months;
    }

    loanButtons.forEach((btn) => btn.classList.remove("active"));
    if (button) {
      button.classList.add("active");
    }
  }

  loanButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const amount = Number(button.dataset.loan);
      const months = Number(button.dataset.months);
      updateLoan(amount, months, button);
    });
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get("submitted") === "1" && thankYouBox) {
    thankYouBox.classList.remove("hidden");
  }
});
