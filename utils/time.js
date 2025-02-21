function hitungDurasi() {
  // let start_date = new Date(document.getElementById("start_date").value);
  // let end_date = new Date(document.getElementById("end_date").value);

  if (isNaN(start_date) || isNaN(end_date)) {
    alert("Silakan masukkan tanggal yang valid.");
    return;
  }

  if (end_date < start_date) {
    alert("End Date harus lebih besar dari Start Date.");
    return;
  }
}

// let durationMonths =
//   (end_date.getFullYear() - start_date.getFullYear()) * 12 +
//   (end_date.getMonth() - start_date.getMonth());
// if (durationMonths < 0) durationMonths = 0;
