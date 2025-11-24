// ------------------------------
//   GENERAR FACTURAS
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {

    const formFactura = document.getElementById("formFactura");

    // Si NO estamos en generateInvoice.html, no hacer nada
    if (!formFactura) return;

    formFactura.addEventListener("submit", function (e) {
        e.preventDefault();

        let cliente = document.getElementById("cliente").value;
        let monto = document.getElementById("monto").value;

        // Obtener facturas previas
        let facturas = JSON.parse(localStorage.getItem("facturas")) || [];

        // Crear nueva factura
        const nuevaFactura = {
            id: Date.now(),
            cliente: cliente,
            monto: monto
        };

        // Guardar factura
        facturas.push(nuevaFactura);
        localStorage.setItem("facturas", JSON.stringify(facturas));

        // Mostrar mensaje
        document.getElementById("mensaje").innerText = "Factura guardada correctamente ✔️";

        // Limpiar formulario
        formFactura.reset();
    });

});
