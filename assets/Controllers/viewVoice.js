document.addEventListener("DOMContentLoaded", function () {
    mostrarFacturas();
});

function mostrarFacturas() {
    const cuerpo = document.getElementById("cuerpoFacturas");
    cuerpo.innerHTML = "";

    const facturas = JSON.parse(localStorage.getItem("facturas")) || [];

    if (facturas.length === 0) {
        cuerpo.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;">
                    No hay facturas generadas
                </td>
            </tr>
        `;
        return;
    }

    facturas.forEach((factura, index) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${factura.nombre}</td>
            <td>${factura.fecha}</td>
            <td>$ ${factura.total}</td>
            <td>
                <button class="btn-descargar" onclick="descargarFactura(${index})">
                    Descargar
                </button>

                <button class="btn-eliminar" onclick="eliminarFactura(${index})">
                    Eliminar
                </button>
            </td>
        `;

        cuerpo.appendChild(fila);
    });
}

function descargarFactura(index) {
    const facturas = JSON.parse(localStorage.getItem("facturas")) || [];
    const factura = facturas[index];

    const blob = new Blob([factura.contenido], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${factura.nombre}.csv`;
    a.click();

    URL.revokeObjectURL(url);
}

function eliminarFactura(index) {
    let facturas = JSON.parse(localStorage.getItem("facturas")) || [];

    const confirmar = confirm("¿Seguro que deseas eliminar esta factura?");
    if (!confirmar) return;

    facturas.splice(index, 1);

    localStorage.setItem("facturas", JSON.stringify(facturas));

    mostrarFacturas(); // refresca la tabla
}
