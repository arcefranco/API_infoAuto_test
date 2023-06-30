import axios from "axios";

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("consultaForm");
  const resultadoElemento = document.getElementById("resultado");

  const JSONElemento = document.getElementById("JSON");
  formulario.addEventListener("submit", async (event) => {
    event.preventDefault();

    const codia = formulario.elements.codia.value;
    const year = formulario.elements.year.value;
    const km = formulario.elements.km.value;

    try {
      const response = await axios.post("/test/price", {
        codia: codia,
        year: year,
        km: km,
      });

      const resultado = response.data;

      resultadoElemento.textContent = `Resultado: ${resultado.result}`;

      JSONElemento.textContent = JSON.stringify(resultado);

      const limpiarFormulario = () => {
        formulario.reset();
        resultadoElemento.textContent = "";
        JSONElemento.textContent = "";
      };

      const limpiarButton = document.getElementById("limpiarButton");
      limpiarButton.addEventListener("click", limpiarFormulario);
    } catch (error) {
      console.error("Error al realizar la consulta:", error);
    }
  });
});
