(function () {
  "use strict";

  var form = document.getElementById("consultation-form");
  if (!form) return;

  var service = document.getElementById("service");
  var name = document.getElementById("name");
  var email = document.getElementById("email");
  var whatsapp = document.getElementById("whatsapp");
  var message = document.getElementById("message");
  var status = document.getElementById("form-status");

  var requestedService = new URLSearchParams(window.location.search).get("layanan");
  if (requestedService && Array.from(service.options).some(function (option) {
    return option.value === requestedService;
  })) {
    service.value = requestedService;
  }

  function setError(field, errorId, text) {
    var error = document.getElementById(errorId);
    error.textContent = text;
    var wrapper = field.closest(".kon-field");
    if (wrapper) wrapper.classList.toggle("has-error", Boolean(text));
    field.setAttribute("aria-invalid", text ? "true" : "false");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    status.hidden = true;

    setError(service, "service-error", service.value ? "" : "Pilih layanan yang ingin ditanyakan.");
    setError(name, "name-error", name.value.trim() ? "" : "Nama lengkap perlu diisi.");
    setError(message, "message-error", message.value.trim() ? "" : "Pesan perlu diisi.");

    var hasContact = email.value.trim() || whatsapp.value.trim();
    var contactError = document.getElementById("contact-error");
    var invalidEmail = email.value.trim() && email.validity.typeMismatch;
    var contactMessage = invalidEmail
      ? "Masukkan alamat email dengan format yang benar."
      : hasContact
        ? ""
        : "Isi email atau nomor WhatsApp agar sekretariat dapat menghubungi Anda.";
    contactError.textContent = contactMessage;
    email.setAttribute("aria-invalid", contactMessage ? "true" : "false");
    whatsapp.setAttribute("aria-invalid", contactMessage ? "true" : "false");

    if (!service.value || !name.value.trim() || !message.value.trim() || !hasContact || invalidEmail) {
      var firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    status.textContent = "Isian sudah lengkap, tetapi belum dikirim atau disimpan. Form ini masih demo dan perlu backend agar sekretariat dapat menerima konsultasi Anda.";
    status.hidden = false;
    status.focus();
  });
})();
