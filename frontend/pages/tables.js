document.addEventListener("DOMContentLoaded", function () {
  //const url "http://localhost:5000"
  // const url = "https://melbran-wed-invite.onrender.com"
  // Get the query string from the current URL
  const queryString = window.location.search;
  // Create a URLSearchParams object
  const urlParams = new URLSearchParams(queryString);
  // Get the value of a specific query parameter (e.g., "name")
  const name = urlParams.get("familyCode");

  const container = document.getElementById("guests-section");

  window.addEventListener("load", async function () {
    console.log(name);
    if (name) {
      try {
        const response = await fetch(`/api/tables?familyCode=${name}`);
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          data.forEach((item) => {
            // Crear el div principal
            const guestDiv = document.createElement("div");
            guestDiv.classList.add("guest-name");

            // Crear el div table-space
            const tableSpace = document.createElement("div");
            tableSpace.classList.add("table-space");

            // Crear el elemento <i> para el número de mesa
            const tableNo = document.createElement("i");
            tableNo.classList.add("table-no", "tbl-green");
            tableNo.textContent = item.numeroMesa;

            // Crear el elemento <p> para el nombre
            const nameP = document.createElement("p");
            nameP.textContent = item.nombre;

            // Agregar los elementos al div principal
            guestDiv.appendChild(tableSpace);
            guestDiv.appendChild(tableNo);
            guestDiv.appendChild(nameP);

            // Agregar el div principal al contenedor
            container.appendChild(guestDiv);
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
});
