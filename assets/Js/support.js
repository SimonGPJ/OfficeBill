(function(){
    emailjs.init("crw9v5Fagep0OaHBa"); // ← CAMBIAR
})();

document.getElementById("formSoporte")
.addEventListener("submit", function(e){

    e.preventDefault();

    emailjs.sendForm("service_dkbqhgd", "template_g1d19ro", this)
        .then(function(){
            alert("Solicitud enviada correctamente ✅");
            document.getElementById("formSoporte").reset();
        }, function(error){
            alert("Error al enviar ❌");
            console.log(error);
        });
});
