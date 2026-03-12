document.addEventListener("DOMContentLoaded", () => {
  const loanCards = document.querySelectorAll(".loan-card");
  const selectedOption = document.getElementById("selectedOption");
  const selectedBorrow = document.getElementById("selectedBorrow");
  const selectedRepayment = document.getElementById("selectedRepayment");
  const selectedTerm = document.getElementById("selectedTerm");

  const loanOptionInput = document.getElementById("loanOptionInput");
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
    const option = card.dataset.option;
    const loan = card.dataset.loan;
    const total = card.dataset.total;
    const months = card.dataset.months;

    selectedOption.textContent = option;
    selectedBorrow.textContent = `Borrow ${formatRand(loan)}`;
    selectedRepayment.textContent = `Repay ${formatRand(total)}`;
    selectedTerm.textContent = `Repayment period: ${months} month${months > 1 ? "s" : ""}`;

    loanOptionInput.value = option;
    loanAmountInput.value = loan;
    repaymentTotalInput.value = total;
    repaymentTermInput.value = `${months} month${months > 1 ? "s" : ""}`;

    loanCards.forEach((btn) => btn.classList.remove("active"));
    card.classList.add("active");
  }

  loanCards.forEach((card) => {
    card.addEventListener("click", () => updateLoan(card));
  });

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;

      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";

      const formData = new FormData(form);

      try {
        const response = await fetch("https://formspree.io/f/mreybwpd", {
          method: "POST",
          body: formData,
          headers: {
            "Accept": "application/json"
          }
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok) {
          form.reset();
          const firstCard = document.querySelector('.loan-card[data-option="Option 1"]');
          if (firstCard) updateLoan(firstCard);
          thankYouModal.classList.remove("hidden");
        } else {
          const message = data.errors?.[0]?.message || "There was a problem submitting your application. Please try again.";
          alert(message);
        }
      } catch (error) {
        alert("Network error. Please check your connection and try again.");
        console.error(error);
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    });
  }

  if (closeThankYou) {
    closeThankYou.addEventListener("click", () => {
      thankYouModal.classList.add("hidden");
    });
  }
});
