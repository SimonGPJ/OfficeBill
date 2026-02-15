// ===============================
// VARIABLES GLOBALES
// ===============================
const form = document.getElementById("form");
const tabla = document.querySelector("#tabla tbody");
const inputCSV = document.getElementById("inputCSV");

let centrosData = [];
let filaSeleccionada = null;

// ===============================
// CARGAR CENTROS DESDE JSON
// ===============================
fetch("../assets/data/centros.json")
    .then(res => res.json())
    .then(data => centrosData = data);

// ===============================
// AGREGAR FILA
// ===============================
form.addEventListener("submit", e => {
    e.preventDefault();

    const centro = document.getElementById("centro").value;
    const cantidad = Number(document.getElementById("cantidad").value);
    const descripcion = document.getElementById("descripcion").value;
    const vrUnitario = Number(document.getElementById("vrUnitario").value);

    const info = centrosData.find(c => c.centro === centro);
    if (!info) {
        alert("Centro de costo no encontrado");
        return;
    }

    const rubro = "6251 - Suministros tecnológicos";
    const subTotal = cantidad * vrUnitario;
    const iva = subTotal * 0.19;
    const total = subTotal + iva;

    const fila = document.createElement("tr");
    fila.innerHTML = `
        <td>${centro}</td>
        <td>${info.div}</td>
        <td>${info.dep}</td>
        <td>${rubro}</td>
        <td>${cantidad}</td>
        <td>${descripcion}</td>
        <td>${vrUnitario.toFixed(2)}</td>
        <td>19%</td>
        <td>${subTotal.toFixed(2)}</td>
        <td>${iva.toFixed(2)}</td>
        <td>${total.toFixed(2)}</td>
    `;

    fila.addEventListener("click", () => seleccionarFila(fila));

    tabla.appendChild(fila);
    form.reset();
});

// ===============================
// SELECCIONAR FILA
// ===============================
function seleccionarFila(fila) {
    filaSeleccionada = fila;

    document.querySelectorAll("#tabla tbody tr")
        .forEach(tr => tr.classList.remove("seleccionado"));

    fila.classList.add("seleccionado");

    document.getElementById("centro").value = fila.cells[0].innerText;
    document.getElementById("cantidad").value = fila.cells[4].innerText;
    document.getElementById("descripcion").value = fila.cells[5].innerText;
    document.getElementById("vrUnitario").value = fila.cells[6].innerText;
}

// ===============================
// EDITAR FILA
// ===============================
function editarFila() {
    if (!filaSeleccionada) {
        alert("Seleccione una fila para editar");
        return;
    }

    const centro = document.getElementById("centro").value;
    const cantidad = Number(document.getElementById("cantidad").value);
    const descripcion = document.getElementById("descripcion").value;
    const vrUnitario = Number(document.getElementById("vrUnitario").value);

    const info = centrosData.find(c => c.centro === centro);
    if (!info) {
        alert("Centro de costo no válido");
        return;
    }

    const subTotal = cantidad * vrUnitario;
    const iva = subTotal * 0.19;
    const total = subTotal + iva;

    filaSeleccionada.innerHTML = `
        <td>${centro}</td>
        <td>${info.div}</td>
        <td>${info.dep}</td>
        <td>6251 - Suministros tecnológicos</td>
        <td>${cantidad}</td>
        <td>${descripcion}</td>
        <td>${vrUnitario.toFixed(2)}</td>
        <td>19%</td>
        <td>${subTotal.toFixed(2)}</td>
        <td>${iva.toFixed(2)}</td>
        <td>${total.toFixed(2)}</td>
    `;

    filaSeleccionada.classList.remove("seleccionado");
    filaSeleccionada = null;
    form.reset();
}
function eliminarFilaSeleccionada() {

    if (!filaSeleccionada) {
        alert("Seleccione una fila para eliminar");
        return;
    }

    filaSeleccionada.remove();
    filaSeleccionada = null;

    actualizarTotalGeneral();
}


function exportarCSV() {

    const titulo = document.getElementById("tituloFactura").value;

    if (!titulo) {
        alert("Ingrese un título de factura");
        return;
    }

    let csv = [];
    let totalFactura = 0;

    // Recorremos la tabla
    document.querySelectorAll("#tabla tr").forEach((fila, index) => {

        let row = [];

        fila.querySelectorAll("th, td").forEach((celda, i) => {
            row.push(celda.innerText);

            // La columna 10 (índice 10) es el total
            if (index !== 0 && i === 10) {
                totalFactura += parseFloat(celda.innerText);
            }
        });

        csv.push(row.join(";"));
    });

    const contenidoCSV = csv.join("\n");

    // ===============================
    // DESCARGAR ARCHIVO
    // ===============================
    const blob = new Blob([contenidoCSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = titulo + ".csv";
    a.click();

    URL.revokeObjectURL(url);

    // ===============================
    // GUARDAR EN LOCALSTORAGE
    // ===============================
    let facturas = JSON.parse(localStorage.getItem("facturas")) || [];

    facturas.push({
        nombre: titulo,
        fecha: new Date().toLocaleDateString(),
        total: totalFactura.toFixed(2),
        contenido: contenidoCSV
    });

    localStorage.setItem("facturas", JSON.stringify(facturas));

    alert("Factura guardada correctamente");
}
inputCSV.addEventListener("change", function (e) {

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {

        const contenido = event.target.result;
        const lineas = contenido.split("\n");

        tabla.innerHTML = "";

        let encabezados = [];

        lineas.forEach((linea, index) => {

            if (linea.trim() === "") return;

            // Detectar si usa ; o ,
            const separador = linea.includes(";") ? ";" : ",";
            const columnas = linea.split(separador).map(c => c.trim());

            // Guardar encabezados
            if (index === 0) {
                encabezados = columnas;
                return;
            }

            // Buscar índices por nombre exacto
            const idxCentro = encabezados.indexOf("Centro");
            const idxDiv = encabezados.indexOf("Div");
            const idxDep = encabezados.indexOf("Dep");
            const idxRubro = encabezados.indexOf("Rubro");
            const idxCantidad = encabezados.indexOf("Cantidad");
            const idxDescripcion = encabezados.indexOf("Descripción");
            const idxVrUnitario = encabezados.indexOf("Vr. unitario");
            const idxImp = encabezados.indexOf("Imp");
            const idxSubTotal = encabezados.indexOf("Sub total");
            const idxVrIVA = encabezados.indexOf("Vr IVA");
            const idxVrTotal = encabezados.indexOf("Vr total");

            // Si no encuentra las columnas necesarias, ignora
            if (idxCentro === -1 || idxCantidad === -1) {
                return;
            }

            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${columnas[idxCentro] || ""}</td>
                <td>${columnas[idxDiv] || ""}</td>
                <td>${columnas[idxDep] || ""}</td>
                <td>${columnas[idxRubro] || ""}</td>
                <td>${columnas[idxCantidad] || ""}</td>
                <td>${columnas[idxDescripcion] || ""}</td>
                <td>${columnas[idxVrUnitario] || ""}</td>
                <td>${columnas[idxImp] || ""}</td>
                <td>${columnas[idxSubTotal] || ""}</td>
                <td>${columnas[idxVrIVA] || ""}</td>
                <td>${columnas[idxVrTotal] || ""}</td>
            `;

            fila.addEventListener("click", () => seleccionarFila(fila));

            tabla.appendChild(fila);
        });

        actualizarTotalGeneral();
    };

    reader.readAsText(file);
});
