window.addEventListener("load", function () {
  // Panggil fetchTrayeks ketika halaman pertama kali dimuat untuk menampilkan semua trayek
  fetchTrayeks();
});

async function fetchTrayeks() {
  const lokasi = document.getElementById("halteAsal") ? document.getElementById("halteAsal").value : null;

  try {
    console.log(`Fetching trayeks...`);

    const response = await fetch(
      `https://trayek-api-vercel.vercel.app/api/trayeks`
    );

    // Cek apakah response berhasil (status 200)
    if (!response.ok) {
      console.error("Failed to fetch data:", response.status, response.statusText);
      throw new Error("Gagal mengambil data trayek.");
    }

    const data = await response.json();
    console.log("API Response:", data);

    // Filter trayek yang sesuai dengan lokasi yang dipilih (jika ada)
    let filteredTrayeks = data;
    if (lokasi && lokasi.trim() !== "") {
      filteredTrayeks = data.filter((trayek) =>
        trayek.rute.some((r) =>
          r.toLowerCase().includes(lokasi.trim().toLowerCase())
        )
      );
    }

    // Menampilkan hasil trayek
    const trayekList = filteredTrayeks
      .map((trayek) => {
        return `
      <div class="col-md-4 mb-4">
        <div class="card trayek-card">
          <div class="card-body">
            <i class="fas fa-bus"></i>
            <h5 class="card-title">${trayek.trayek}</h5>
            <p class="card-text">Rute yang dilalui: <br> ${trayek.rute.join(
              " → "
            )}</p>
          </div>
        </div>
      </div>
    `;
      })
      .join("");

    if (filteredTrayeks.length > 0) {
      document.getElementById("hasilJadwal").innerHTML = `
        <h5>Trayek yang ${lokasi ? `melewati lokasi <strong>${lokasi}</strong>` : "tersedia"}:</h5>
        <div class="row">
          ${trayekList}
        </div>
      `;
    } else {
      document.getElementById("hasilJadwal").innerHTML = `
        <p>Tidak ada trayek yang ${lokasi ? `melewati lokasi <strong>${lokasi}</strong>` : "tersedia"}.</p>
      `;
    }
  } catch (error) {
    console.error("Error saat mengambil data trayek:", error);
    document.getElementById("hasilJadwal").innerHTML =
      "<p>Terjadi kesalahan saat mengambil data. Silakan coba lagi.</p>";
  }
}

// Event listener untuk memfilter trayek berdasarkan lokasi yang dipilih, hanya saat tombol diklik
document.querySelector("button").addEventListener("click", function () {
  fetchTrayeks();  // Menampilkan trayek sesuai lokasi yang dipilih
});
