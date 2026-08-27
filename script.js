const NOTIFY_CC_EMAIL = "nkosilindikhaya@gmail.com";

document.addEventListener("DOMContentLoaded", () => {
  const ccEmailInput = document.getElementById("ccEmailInput");
  if (ccEmailInput) {
    ccEmailInput.value = NOTIFY_CC_EMAIL;
  }

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

  const studentNumberInput = document.getElementById("studentnumber");
  const studentNumberHint = document.getElementById("studentNumberHint");
  if (studentNumberInput) {
    studentNumberInput.addEventListener("input", () => {
      studentNumberInput.value = studentNumberInput.value.replace(/\D/g, "").slice(0, 13);

      if (studentNumberHint) {
        const count = studentNumberInput.value.length;
        studentNumberHint.textContent = `${count}/13 digits`;
        studentNumberHint.classList.toggle("is-complete", count === 13);
      }
    });
  }

  const collectionDateInput = document.getElementById("collectionDate");
  if (collectionDateInput) {
    collectionDateInput.min = new Date().toISOString().split("T")[0];
  }

  const idUploadInput = document.getElementById("idUpload");
  const bankStatementInput = document.getElementById("bankStatement");
  const uploadProgress = document.getElementById("uploadProgress");
  const uploadProgressBar = document.getElementById("uploadProgressBar");
  const uploadProgressLabel = document.getElementById("uploadProgressLabel");

  const COMPRESS_SKIP_BELOW_BYTES = 400 * 1024;
  const COMPRESS_MAX_DIMENSION = 1600;
  const COMPRESS_QUALITY = 0.8;

  function formatRand(value) {
    return "R" + Number(value).toLocaleString("en-ZA");
  }

  function setUploadProgress(percent, label) {
    if (uploadProgressBar) {
      uploadProgressBar.style.width = `${percent}%`;
    }

    if (uploadProgress) {
      uploadProgress.setAttribute("aria-valuenow", String(percent));
    }

    if (uploadProgressLabel) {
      uploadProgressLabel.textContent = label || "";
    }
  }

  function compressImageFile(file) {
    return new Promise((resolve) => {
      if (!file || !file.type.startsWith("image/") || file.size <= COMPRESS_SKIP_BELOW_BYTES) {
        resolve(file);
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        if (width > COMPRESS_MAX_DIMENSION || height > COMPRESS_MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * COMPRESS_MAX_DIMENSION) / width);
            width = COMPRESS_MAX_DIMENSION;
          } else {
            width = Math.round((width * COMPRESS_MAX_DIMENSION) / height);
            height = COMPRESS_MAX_DIMENSION;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);

            if (!blob || blob.size >= file.size) {
              resolve(file);
              return;
            }

            const compressedName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
            resolve(new File([blob], compressedName, { type: "image/jpeg" }));
          },
          "image/jpeg",
          COMPRESS_QUALITY
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };

      img.src = objectUrl;
    });
  }

  function submitWithProgress(url, formData, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.setRequestHeader("Accept", "application/json");

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      });

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Request failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error("Network error"));

      xhr.send(formData);
    });
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
        submitButton.textContent = "Preparing files...";
      }

      if (uploadProgress) {
        uploadProgress.classList.remove("hidden");
      }
      setUploadProgress(0, "Preparing files...");

      try {
        const [compressedId, compressedBank] = await Promise.all([
          compressImageFile(idUploadInput.files[0]),
          compressImageFile(bankStatementInput.files[0]),
        ]);

        const formData = new FormData(form);
        formData.delete("id_copy");
        formData.append("id_copy", compressedId, compressedId.name);
        formData.delete("bank_statement");
        formData.append("bank_statement", compressedBank, compressedBank.name);

        if (submitButton) {
          submitButton.textContent = "Submitting...";
        }
        setUploadProgress(0, "Uploading... 0%");

        await submitWithProgress("https://formspree.io/f/xqeylaoy", formData, (percent) => {
          setUploadProgress(percent, `Uploading... ${percent}%`);
        });

        form.reset();

        const firstCard = document.querySelector('.loan-card[data-option="Option 1"]');
        if (firstCard) {
          updateLoan(firstCard);
        }

        if (thankYouModal) {
          thankYouModal.classList.remove("hidden");
        }
      } catch (error) {
        console.error("Submission failed:", error);
        alert("There was a problem submitting your application. Please try again.");
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
        if (uploadProgress) {
          uploadProgress.classList.add("hidden");
        }
        setUploadProgress(0, "");
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
