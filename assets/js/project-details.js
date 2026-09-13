(() => {
  const overlay = document.getElementById("project-detail-overlay");
  if (!overlay || !window.crypto?.subtle) return;

  const form = overlay.querySelector(".project-detail-form");
  const input = document.getElementById("project-detail-password");

  let currentUrl = "";
  let currentPdfUrl = "";
  let lastFocused = null;

  const decodeBase64 = (value) => {
    const binary = window.atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  };

  const setError = (hasError = false) => {
    form.classList.toggle("has-error", hasError);
    input.setAttribute("aria-invalid", hasError ? "true" : "false");
  };

  const clearPdfUrl = () => {
    if (currentPdfUrl) {
      URL.revokeObjectURL(currentPdfUrl);
      currentPdfUrl = "";
    }
  };

  const closeModal = () => {
    overlay.hidden = true;
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("project-detail-overlay-open");
    input.value = "";
    currentUrl = "";
    setError(false);
    clearPdfUrl();
    if (lastFocused) lastFocused.focus();
  };

  const openModal = (button) => {
    lastFocused = button;
    currentUrl = button.dataset.projectUrl || "";
    clearPdfUrl();
    setError(false);
    overlay.hidden = false;
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("project-detail-overlay-open");
    window.setTimeout(() => input.focus(), 0);
  };

  const deriveKey = async (password, salt, iterations) => {
    const material = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations,
        hash: "SHA-256",
      },
      material,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
  };

  const decryptFile = async (file, key) => {
    const iv = decodeBase64(file.iv);
    const encrypted = decodeBase64(file.data);
    const tag = decodeBase64(file.tag);
    const combined = new Uint8Array(encrypted.length + tag.length);
    combined.set(encrypted);
    combined.set(tag, encrypted.length);
    return crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, combined);
  };

  const openEncryptedPdf = async (password) => {
    setError(false);
    clearPdfUrl();
    const response = await fetch(currentUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("detail-not-found");

    const payload = await response.json();
    const salt = decodeBase64(payload.salt);
    const key = await deriveKey(password, salt, payload.iterations || 250000);
    const pdfBuffer = await decryptFile(payload.pdf, key);

    const pdfBlob = new Blob([pdfBuffer], { type: payload.pdf.mime || "application/pdf" });
    currentPdfUrl = URL.createObjectURL(pdfBlob);
    return currentPdfUrl;
  };

  document.querySelectorAll(".project-detail-button").forEach((button) => {
    button.addEventListener("click", () => openModal(button));
  });

  overlay.querySelectorAll("[data-project-detail-close]").forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = input.value.trim();
    if (!password) {
      setError(true);
      input.focus();
      return;
    }

    const pdfWindow = window.open("", "_blank");

    try {
      const pdfUrl = await openEncryptedPdf(password);
      if (pdfWindow) {
        pdfWindow.location.href = pdfUrl;
      } else {
        window.location.href = pdfUrl;
      }
      currentPdfUrl = "";
      closeModal();
      window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);
    } catch (error) {
      if (pdfWindow) pdfWindow.close();
      setError(true);
      input.select();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!overlay.hidden && event.key === "Escape") closeModal();
  });
})();
