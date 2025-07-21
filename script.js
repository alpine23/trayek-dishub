function toggleMenu() {
  document.getElementById("mobileMenu").classList.toggle("active");
}

window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".dinas-navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("shrink");
  } else {
    navbar.classList.remove("shrink");
  }
});

async function fetchTrayeks() {
  const lokasi = document.getElementById("halteAsal").value;

  if (!lokasi) {
    alert("Pilih lokasi terlebih dahulu");
    return;
  }

  try {
    // Cek jika API tersedia dengan benar
    console.log(`Fetching trayeks for lokasi: ${lokasi}`);

    const response = await fetch(
      `https://trayek-api-vercel.vercel.app/api/trayeks?lokasi=${lokasi}`
    );

    // Cek apakah response berhasil (status 200)
    if (!response.ok) {
      console.error("Failed to fetch data:", response.status, response.statusText);
      throw new Error("Gagal mengambil data trayek.");
    }

    // Menampilkan isi response
    const data = await response.json();
    console.log("API Response:", data);

    // Filter trayek yang sesuai dengan lokasi yang dipilih
    const filteredTrayeks = data.filter((trayek) =>
      trayek.rute.some((r) =>
        r.toLowerCase().includes(lokasi.trim().toLowerCase())
      )
    );

    // Jika trayek ditemukan
    if (filteredTrayeks.length > 0) {
      const trayekList = filteredTrayeks
        .map((trayek) => {
          return `
        <div class="col-md-4 mb-4">
          <div class="card trayek-card">
            <div class="card-body">
              <i class="fas fa-bus"></i>
              <h5 class="card-title">${trayek.trayek}</h5>
              <p class="card-text">Rute yang dilalui: ${trayek.rute.join(
                " → "
              )}</p>
            </div>
          </div>
        </div>
      `;
        })
        .join("");

      document.getElementById("hasilJadwal").innerHTML = `
        <h5>Trayek yang melewati lokasi <strong>${lokasi}</strong>:</h5>
        <div class="row">
          ${trayekList}
        </div>
      `;
    } else {
      document.getElementById(
        "hasilJadwal"
      ).innerHTML = `<p>Tidak ada trayek yang melewati lokasi tersebut.</p>`;
    }
  } catch (error) {
    console.error("Error saat mengambil data trayek:", error);
    document.getElementById("hasilJadwal").innerHTML =
      "<p>Terjadi kesalahan saat mengambil data. Silakan coba lagi.</p>";
  }
}
