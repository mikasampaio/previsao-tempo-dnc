const cep = document.getElementById("cep");
const street = document.getElementById("street");
const neighborhood = document.getElementById("neighborhood");
const state = document.getElementById("state");
const button = document.getElementsByTagName("button")[0];
const wheaterForecast = document.getElementById("wheaterForecast");
const error = document.getElementById("error");

const searchCep = async () => {
  const cepValue = cep.value.replace("-", "");

  const latitude = document.getElementById("latitude").value;
  const longitude = document.getElementById("longitude").value;

  error.innerHTML = "";
  try {
    if (!cepValue || cepValue === 8) {
      throw new Error("CEP inválido.");
    }

    const responseCep = await fetch(
      `https://viacep.com.br/ws/${cepValue}/json/`
    );

    const data = await responseCep.json();

    if (data.erro) {
      throw new Error("CEP não encontrado.");
    }

    street.innerHTML = `
      <span>${data.logradouro}</span>`;

    neighborhood.innerHTML = `<span>${data.bairro}</span>`;

    state.innerHTML = `<span>${data.localidade} - ${data.uf}</span>`;

    if (!latitude && !longitude) {
      throw new Error("Latitude e longitude são obrigatórios.");
    }

    const responseForecast = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&forecast_days=2`
    );

    if (!responseCep.ok) {
      throw new Error(`Erro ao buscar CEP: ${responseCep.status}`);
    }

    if (!responseForecast.ok) {
      throw new Error(
        `Status ${responseForecast.status}: Erro ao buscar previsão do tempo`
      );
    }

    const forecastData = await responseForecast.json();

    const date = new Date();
    const formatDate =
      date.getFullYear() +
      "-" +
      (date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth()) +
      "-" +
      (date.getDate() + 1) +
      "T" +
      date.getHours() +
      ":00";

    const findForecast = forecastData.hourly.time.findIndex((data) => {
      return data === formatDate;
    });

    const temperature = forecastData.hourly.temperature_2m[findForecast];

    wheaterForecast.innerHTML += temperature
      ? `${temperature}°C`
      : "Não encontrado";
  } catch (err) {
    if (err) {
      error.innerHTML = `
    <div class="bg-danger text-center text-white py-2 rounded">${err.message}</div>`;
    }
  }
};

button.addEventListener("click", searchCep);
