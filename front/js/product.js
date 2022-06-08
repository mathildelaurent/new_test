console.log('connectée');

// Recherche de l'ID dans l'URL //
var urlParam = new URLSearchParams(window.location.search);
var idParam = urlParam.get('id');

// Recherche de l'API par ID produit //
async function apiDatas() {
    let apiUrl = "http://localhost:3000/api/products/"+idParam;
    const promise = await fetch(apiUrl);
    const reponseJs = await promise.json();
    console.log(reponseJs);

    // Insertion des éléments de manière dynamique dans le html //

    // Insertion de l'image //
    var picture = document.createElement('img');
    picture.src = reponseJs.imageUrl;
    picture.alt = reponseJs.altTxt;
    document.querySelector('.item__img').appendChild(picture);

    // Insertion de la balise h1 (nom) //
    var title = document.createElement('h1');
    var name = document.createTextNode(reponseJs.name);
    title.appendChild(name);
    document.getElementById('title').appendChild(title);

    // Insertion du prix //
    var price = document.createTextNode(reponseJs.price);
    document.getElementById('price').appendChild(price);

    // Insertion de la balise p (description) //
    var p = document.createElement('p');
    var description = document.createTextNode(reponseJs.description);
    p.appendChild(description);
    document.querySelector('.item__content__description').appendChild(p);

    // Insertion des optons de couleurs //
    for (let color of reponseJs.colors) {
        var option = document.createElement('option');
        option.setAttribute('value', color);
        var optionText = document.createTextNode(color);
        option.appendChild(optionText);
        document.getElementById('colors').appendChild(option);
    }

    addBasket();
};

apiDatas();

const addBtn = document.getElementById('addToCart');
console.log(addBtn);

function addBasket() {
    class item {
        constructor(id, quantity, colors) {
            this.id = id;
            this.quantity = quantity;
            this.colors = colors;
        };
    };

    addBtn.addEventListener('click', function() {
        if(localStorage.getItem('myBasket') == null) { // S'il n'y a rien dans le panier //
            let newItem = new item(idParam, quantity.value, colors.value);
            let totalOrder = [newItem];
            let storageConversion = JSON.stringify(totalOrder);
            localStorage.setItem('myBasket', storageConversion);
        }else{ // S'il y a déjà qqc dans le panier //
            const originalData = JSON.parse(localStorage.getItem('myBasket'));
            let exist = false;
            for (let object of originalData) {
                if (object.id == idParam && object.colors == colors.value) {
                    initialQuantity = parseFloat(object.quantity);
                    newQuantity = parseFloat(quantity.value);
                    object.quantity = initialQuantity + newQuantity
                    exist = true;
                }
            }
            if(exist == false) {
                let newItem = new item(idParam, quantity.value, colors.value);
                originalData.push(newItem);
            }
            let stringConversion = JSON.stringify(originalData);
            localStorage.setItem('myBasket', stringConversion);
        }
    })
}