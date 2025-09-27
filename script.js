// Your deployed Web App URL
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxTLbNXAl4AxQJfDyFbX71TlR3KUt3ReFOl0afBGYn5baO1GbKQVsOh4JIhgTmxH36i/exec";

// Configure scanner with multiple formats
const html5QrcodeScanner = new Html5QrcodeScanner(
  "reader",
  {
    fps: 10,
    qrbox: 400, // larger scanning box
    formatsToSupport: [
      Html5QrcodeSupportedFormats.QR_CODE, 
      Html5QrcodeSupportedFormats.DATA_MATRIX, 
      Html5QrcodeSupportedFormats.AZTEC, 
      Html5QrcodeSupportedFormats.PDF_417
    ]
  }
);

function onScanSuccess(decodedText, decodedResult) {
  // Fill form automatically
  document.getElementById("idNumber").value = decodedText;
  document.getElementById("date").value = new Date().toLocaleString();
  document.getElementById("saleForm").style.display = "block";
  html5QrcodeScanner.clear(); // Stop scanner until form submitted
}

html5QrcodeScanner.render(onScanSuccess);

function submitSale() {
  const sale = {
    idNumber: document.getElementById("idNumber").value,
    date: document.getElementById("date").value,
    customerName: document.getElementById("customerName").value,
    customerPhone: document.getElementById("customerPhone").value,
    qty: Number(document.getElementById("qty").value),
    rate: Number(document.getElementById("rate").value)
  };

  fetch(WEB_APP_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sale)
  }).then(() => {
    alert("Sale recorded successfully!");
    document.getElementById("saleForm").reset();
    document.getElementById("saleForm").style.display = "none";
    html5QrcodeScanner.render(onScanSuccess); // Restart scanner
  }).catch(err => {
    alert("Error recording sale: " + err);
  });
}
