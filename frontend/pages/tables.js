document.addEventListener("DOMContentLoaded", function () {
  const queryString = window.location.search;
  // Create a URLSearchParams object
  const urlParams = new URLSearchParams(queryString);
  // Get the value of a specific query parameter (e.g., "name")
  const name = urlParams.get("familyCode");

  const container = document.getElementById("guests");
  const loader = document.getElementById("loader");

  const table_color = {
    1: "green",
    2: "yellow",
    3: "orange",
    4: "cream",
    5: "blue",
    6: "pink",
    7: "purple",
    8: "green",
    9: "blue",
    10: "cream",
    11: "orange",
    12: "purple",
    13: "orange",
    14: "pink",
    15: "yellow",
    16: "blue",
    17: "green",
    18: "purple",
    19: "cream",
    20: "blue",
    21: "cream",
    22: "yellow",
    23: "green",
    24: "pink",
    25: "orange",
  };

  window.addEventListener("load", async function () {
    console.log(name);
    if (name) {
      try {
        const response = await fetch(
          `https://melbran-wed-invite.onrender.com/api/tables?familyCode=${name}`
        );
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          loader.remove();
          data.forEach((item) => {
            console.log(item);
            // Crear el div principal
            const guestDiv = document.createElement("div");
            guestDiv.classList.add("guest-name");

            // Crear el div table-space
            const tableSpace = document.createElement("div");
            tableSpace.classList.add("table-space");

            // Crear el elemento <i> para el número de mesa
            const tableNo = document.createElement("i");
            tableNo.classList.add("table-no", `tbl-${table_color[item.table]}`);
            tableNo.textContent = item.table;

            // Crear el elemento <p> para el nombre
            const nameP = document.createElement("p");
            nameP.textContent = item.name;

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
