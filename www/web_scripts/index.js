const hTitle = document.getElementById('homeTitle');

async function loadHome(pageNumber) {
    switch (pageNumber) {
        case 0: // mainpage
            const username = await window.DB.getPreference("username");
            console.log(username);
            hTitle.textContent = `Olá, ${username}.`;
            break;
        
        case 3: // foods
            const foodName = document.getElementById('foodName');
            const foodCalories = document.getElementById('foodCalories');
            const foodDescription = document.getElementById('foodDescription');
            const foodServing = document.getElementById('foodServing');    
            const foodList = document.getElementById('foodPageList');

            function addNewFood() {
                const name = foodName.value;
                const calories = foodCalories.value;
                const description = foodDescription.value;
                const serving = foodServing.value;

                if (!name || !calories || !description || !serving) {
                    alert("Preencha todos os campos.");
                    return;
                }
            
                addFoodToList(name, calories, description, serving)
            }

            document.getElementById("addFood").addEventListener('click', () => {addNewFood()});
            break;
    
        default:
            break;
    }    
}

function addFoodToList(name, description, calories, serving) {
    html = `<div class="foodPageListItem">
        <p>${name}</p>
        <p>${description}</p>
        <p>${calories} per ${serving}</p>
    </div>`

    foodList.innerHTML += html;
}

document.addEventListener('pagedMenu:finish', (e) => {
  loadHome(e.detail.page);
});

loadHome();