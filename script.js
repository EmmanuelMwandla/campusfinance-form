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
    const months = Number(card.dataset.months);

    if (selectedOption) {
      selectedOption.textContent = option;
    }

    if (selectedBorrow) {
      selectedBorrow.textContent = `Borrow ${formatRand(loan)}`;
    }

    if (selectedRepayment) {
      selectedRepayment.textContent = `Repay ${formatRand(total)}`;
    }

    if (selectedTerm) {
      selectedTerm.textContent = `Repayment period: ${months} month${months > 1 ? "s" : ""}`;
    }

    if (loanOptionInput) {
      loanOptionInput.value = option;
    }

    if (loanAmountInput) {
      loanAmountInput.value = loan;
    }

    if (repaymentTotalInput) {
      repaymentTotalInput.value = total;
    }

    if (repaymentTermInput) {
      repaymentTermInput.value = `${months} month${months > 1 ? "s" : ""}`;
    }

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
      const originalText = submitButton ? submitButton.textContent : "Submit application";

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";
      }

      const formData = new FormData(form);

      try {
        const response = await fetch("https://formspree.io/f/mreybwpd", {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          form.reset();

          const firstCard = document.querySelector('.loan-card[data-option="Option 1"]');
          if (firstCard) {
            updateLoan(firstCard);
          }

          if (thankYouModal) {
            thankYouModal.classList.remove("hidden");
          }
        } else {
          alert("There was a problem submitting your application. Please try again.");
        }
      } catch (error) {
        console.error("Submission failed:", error);
        alert("There was a problem submitting your application. Please try again.");
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
      }
    });
  }

  if (closeThankYou && thankYouModal) {
    closeThankYou.addEventListener("click", () => {
      thankYouModal.classList.add("hidden");
    });
  }

  if (thankYouModal) {
    thankYouModal.addEventListener("click", (event) => {
      if (event.target === thankYouModal) {
        thankYouModal.classList.add("hidden");
      }
    });
  }
});
