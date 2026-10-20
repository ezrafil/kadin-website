(function () {
  "use strict";

  var HELPDESK_NUMBER = "6287770751419"; // +62 877-7075-1419, helpdesk Sekretariat KADIN Surabaya
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

  var cards = Array.prototype.slice.call(document.querySelectorAll(".kon-svc"));
  function syncCards() {
    cards.forEach(function (card) {
      card.setAttribute("aria-pressed", card.getAttribute("data-service") === service.value ? "true" : "false");
    });
  }
  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      service.value = card.getAttribute("data-service");
      service.dispatchEvent(new Event("change"));
      if (window.matchMedia("(max-width: 960px)").matches) {
        service.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      name.focus({ preventScroll: true });
    });
  });
  service.addEventListener("change", function () {
    syncCards();
    if (service.value) setError(service, "service-error", "");
  });
  syncCards();

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
    status.classList.remove("is-info");

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

    var serviceLabel = service.options[service.selectedIndex].text;
    var company = document.getElementById("company");
    var lines = [
      "Halo Sekretariat KADIN Surabaya, saya ingin bertanya tentang layanan:",
      serviceLabel,
      "",
      "Nama: " + name.value.trim()
    ];
    if (company && company.value.trim()) lines.push("Perusahaan: " + company.value.trim());
    if (email.value.trim()) lines.push("Email: " + email.value.trim());
    if (whatsapp.value.trim()) lines.push("WhatsApp: " + whatsapp.value.trim());
    lines.push("", "Pesan:", message.value.trim());

    var url = "https://wa.me/" + HELPDESK_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
    var opened = window.open(url, "_blank");
    if (opened) opened.opener = null;

    status.classList.add("is-info");
    status.textContent = "";
    status.appendChild(document.createTextNode(
      opened
        ? "WhatsApp dibuka dengan pesan Anda. Tekan tombol kirim di WhatsApp agar pesan sampai ke helpdesk. Jika tidak terbuka, "
        : "Browser memblokir jendela baru. "
    ));
    var link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = opened ? "buka WhatsApp di sini." : "Buka WhatsApp helpdesk di sini.";
    status.appendChild(link);
    status.hidden = false;
    status.focus();
  });
})();
