let filteredTrayeks = []; // Declare the global variable

window.addEventListener("load", function () {
  // Call fetchTrayeks when the page first loads to display all trayeks
  fetchTrayeks();
});

async function fetchTrayeks() {
  const lokasi = document.getElementById("halteAsal")
    ? document.getElementById("halteAsal").value
    : null;

  try {
    console.log(`Fetching trayeks...`);

    const response = await fetch(
      `https://trayek-api-vercel.vercel.app/api/trayeks`
    );

    // Check if the response was successful (status 200)
    if (!response.ok) {
      console.error(
        "Failed to fetch data:",
        response.status,
        response.statusText
      );
      throw new Error("Gagal mengambil data trayek.");
    }

    const data = await response.json();
    console.log("API Response:", data);

    // Save the fetched trayeks data to filteredTrayeks
    filteredTrayeks = data;

    // Filter trayeks that match the selected location (if any)
    let filteredTrayeksData = data;
    if (lokasi && lokasi.trim() !== "") {
      filteredTrayeksData = data.filter((trayek) =>
        trayek.rute.some((r) =>
          r.toLowerCase().includes(lokasi.trim().toLowerCase())
        )
      );
    }

    // Display trayeks
    const trayekList = filteredTrayeksData
      .map((trayek) => {
        return `
      <div class="col-md-4 mb-4">
        <div class="card trayek-card" id="trayek-${
          trayek.id
        }" onclick="showRouteDetails(${trayek.id})">
          <div class="trayek-card-icon">
            <i class="fas fa-bus"></i>
          </div>
          <div class="trayek-card-info">
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

    if (filteredTrayeksData.length > 0) {
      document.getElementById("hasilJadwal").innerHTML = `
    <h5>Trayek yang ${
      lokasi ? `melewati lokasi <strong>${lokasi}</strong>` : "tersedia"
    }:</h5>
    <div class="row">
      ${trayekList}
    </div>
  `;
    } else {
      document.getElementById("hasilJadwal").innerHTML = `
    <p>Tidak ada trayek yang ${
      lokasi ? `melewati lokasi <strong>${lokasi}</strong>` : "tersedia"
    }.</p>
  `;
    }
  } catch (error) {
    console.error("Error saat mengambil data trayek:", error);
    document.getElementById("hasilJadwal").innerHTML =
      "<p>Terjadi kesalahan saat mengambil data. Silakan coba lagi.</p>";
  }
}

// Function to show the route details when a trayek card is clicked
function showRouteDetails(trayekId) {
  console.log(`Clicked trayek ID: ${trayekId}`); // Debugging
  // Find the trayek by ID from filteredTrayeks
  const trayek = filteredTrayeks.find((t) => t.id === trayekId); // Find the trayek by ID

  // Check if the trayek exists
  if (!trayek) {
    console.error("Trayek not found!");
    return;
  }

  console.log(`Found trayek: ${JSON.stringify(trayek)}`); // Debugging

  // Generate route details with arrows between each stop
  let detailRoute = "";
  trayek.detail.forEach((location, index) => {
    detailRoute += `
      <span>${location}</span>
      ${index < trayek.detail.length - 1 ? '<span class="arrow">↓</span>' : ""}
    `;
  });

  // Display the details in the modal
  document.getElementById("detailRoute").innerHTML = `
    <h5>${trayek.trayek} :</h5>
    <p>${detailRoute}</p>
  `;

  // Show the modal with route details using Bootstrap 5
  const modal = new bootstrap.Modal(
    document.getElementById("routeDetailsModal")
  );
  modal.show();
}

// Event listener to filter trayeks based on the selected location, only when the button is clicked
document.querySelector("button").addEventListener("click", function () {
  fetchTrayeks(); // Display trayeks based on the selected location
});
