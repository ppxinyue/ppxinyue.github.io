(() => {
  const overlay = document.getElementById("project-detail-overlay");
  if (!overlay || !window.crypto?.subtle) return;

  const title = document.getElementById("project-detail-title");
  const form = overlay.querySelector(".project-detail-form");
  const input = document.getElementById("project-detail-password");
  const status = overlay.querySelector(".project-detail-status");
  const viewer = overlay.querySelector(".project-detail-viewer");
  const preview = viewer?.querySelector("img");
  const openLink = overlay.querySelector(".project-detail-open-link");
  const download = overlay.querySelector(".project-detail-download");

  let currentUrl = "";
  let currentPdfUrl = "";
  let currentPreviewUrl = "";
  let lastFocused = null;

  const decodeBase64 = (value) => {
    const binary = window.atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  };

  const setStatus = (message, isError = false) => {
    status.textContent = message;
    status.classList.toggle("is-error", isError);
  };

  const clearViewer = () => {
    if (currentPdfUrl) {
      URL.revokeObjectURL(currentPdfUrl);
      currentPdfUrl = "";
    }
    if (currentPreviewUrl) {
      URL.revokeObjectURL(currentPreviewUrl);
      currentPreviewUrl = "";
    }
    if (preview) preview.removeAttribute("src");
    [openLink, download].forEach((link) => {
      if (!link) return;
      link.removeAttribute("href");
      link.removeAttribute("download");
    });
    if (download) {
      download.textContent = "Download this page PDF →";
    }
    if (viewer) viewer.hidden = true;
  };

  const closeModal = () => {
    overlay.hidden = true;
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("project-detail-overlay-open");
    input.value = "";
    currentUrl = "";
    setStatus("");
    clearViewer();
    if (lastFocused) lastFocused.focus();
  };

  const openModal = (button) => {
    lastFocused = button;
    currentUrl = button.dataset.projectUrl || "";
    title.textContent = button.dataset.projectTitle || "Project details";
    clearViewer();
    setStatus("");
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
    setStatus("Decrypting...");
    clearViewer();
    const response = await fetch(currentUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("detail-not-found");

    const payload = await response.json();
    const salt = decodeBase64(payload.salt);
    const key = await deriveKey(password, salt, payload.iterations || 250000);
    const [pdfBuffer, previewBuffer] = await Promise.all([
      decryptFile(payload.pdf, key),
      decryptFile(payload.preview, key),
    ]);

    const pdfBlob = new Blob([pdfBuffer], { type: payload.pdf.mime || "application/pdf" });
    const previewBlob = new Blob([previewBuffer], { type: payload.preview.mime || "image/jpeg" });
    currentPdfUrl = URL.createObjectURL(pdfBlob);
    currentPreviewUrl = URL.createObjectURL(previewBlob);

    preview.src = currentPreviewUrl;
    openLink.href = currentPdfUrl;
    download.href = currentPdfUrl;
    download.download = payload.pdf.filename || "project-detail.pdf";
    viewer.hidden = false;
    setStatus("");
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
      setStatus("Please enter the password.", true);
      input.focus();
      return;
    }

    try {
      await openEncryptedPdf(password);
    } catch (error) {
      setStatus("Password incorrect or file unavailable.", true);
      input.select();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!overlay.hidden && event.key === "Escape") closeModal();
  });
})();
