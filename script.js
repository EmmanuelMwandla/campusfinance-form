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

  // Deploy apps-script/Code.gs as a Web App and paste its /exec URL here.
  const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycby9Wo2CBqem6TWlac6RogacV1m2aYH7H62JAejKWOIQAorBbtghZ1WkFdEXTfvvsLch/exec";

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const uploadFieldIds = ["idUpload", "bankStatement", "bankConfirmation"];

  function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      for (const fieldId of uploadFieldIds) {
        const fileInput = document.getElementById(fieldId);
        const file = fileInput && fileInput.files[0];
        if (file && file.size > MAX_FILE_SIZE) {
          alert(
            `"${file.name}" is too large (max 5MB). Please upload a smaller file.`
          );
          return;
        }
      }

      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton ? submitButton.textContent : "Submit application";

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";
      }

      try {
        const formData = new FormData(form);
        const fields = {};
        let gotcha = "";

        for (const [key, value] of formData.entries()) {
          if (value instanceof File) continue;
          if (key === "_gotcha") {
            gotcha = value;
          } else if (key !== "_subject") {
            fields[key] = value;
          }
        }

        const files = [];
        for (const fieldId of uploadFieldIds) {
          const fileInput = document.getElementById(fieldId);
          const file = fileInput && fileInput.files[0];
          if (file) {
            files.push({
              fieldName: fileInput.name,
              filename: file.name,
              mimeType: file.type || "application/octet-stream",
              base64: await readFileAsBase64(file),
            });
          }
        }

        const response = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ fields, files, gotcha }),
        });

        const data = await response.json();

        if (data.success) {
          form.reset();

          const firstCard = document.querySelector('.loan-card[data-option="Option 1"]');
          if (firstCard) {
            updateLoan(firstCard);
          }

          if (thankYouModal) {
            thankYouModal.classList.remove("hidden");
          }
        } else {
          alert(
            data.error ||
              "There was a problem submitting your application. Please try again."
          );
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
