const name = document.querySelector("#setupName");
const calories = document.querySelector("#setupCalories");

document.addEventListener('pagedMenu:finish', (e) => {
  saveInitialSetup(e.detail.button);
});

await window.DB.getPreference("setupComplete").then(v => console.log(v));

async function saveInitialSetup() {
    if (!name.value || !calories.value) { alert("Preencha todos os campos!"); return; }
    await window.DB.setPreference("username", name.value);
    await window.DB.setPreference("calories", calories.value);
    await window.DB.setPreference("setupComplete", true);
    window.location.href = "index.html";
}