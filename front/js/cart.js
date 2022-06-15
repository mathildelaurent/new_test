console.log("connectée");

const originalData = JSON.parse(localStorage.getItem('myBasket'));
console.log(originalData);

// Implémentation dynamique du panier // 
async function productSearch() {
    let totalPrice = 0;
    for (let object of originalData) {
        let idKanap = object.id;
        let productCard = "http://localhost:3000/api/products/"+idKanap;
        const promise = await fetch(productCard);
        const reponseJs = await promise.json();

        // Insertion de la balise <article> //
        var article = document.createElement('article');
        article.setAttribute('class', 'cart__item');
        article.setAttribute('data-id', object.id);
        article.setAttribute('data-color', object.colors);
        document.getElementById('cart__items').appendChild(article);

        // Insertion de la balise <div> (cart__item__img) //
        var divImg = document.createElement('div');
        divImg.setAttribute('class', 'cart__item__img');
        article.appendChild(divImg);

        // Insertion de l'image //
        var image = document.createElement('img');
        image.src = reponseJs.imageUrl;
        image.alt = reponseJs.altTxt;
        divImg.appendChild(image);

        // Insertion de la balise <div> (cart__item__content) //
        var divContent = document.createElement('div');
        divContent.setAttribute('class', 'cart__item__content');
        article.appendChild(divContent);

        // Insertion de la balise <div> (cart__item__content__description) //
        var divDescription = document.createElement('div');
        divDescription.setAttribute('class', 'cart__item__content__description');
        divContent.appendChild(divDescription);

        // Insertion de la balise <h2> (nom) //
        var title = document.createElement('h2');
        var name = document.createTextNode(reponseJs.name);
        title.appendChild(name);
        divDescription.appendChild(title);

        // Insertion de la balise <p> (couleur) //
        var color = document.createElement('p');
        var textColor = document.createTextNode(object.colors);
        color.appendChild(textColor);
        divDescription.appendChild(color);

        // Insertion de la balise <p> (price) //
        var price = document.createElement('p');
        var textPrice = document.createTextNode(reponseJs.price + " €");
        price.appendChild(textPrice);
        divDescription.appendChild(price);
        totalPrice = totalPrice + (object.quantity * reponseJs.price);

        // Insertion de le balise <div> (cart__item__content__settings) //
        var divSettings = document.createElement('div');
        divSettings.setAttribute('class', 'cart__item__content__settings');
        divContent.appendChild(divSettings);

        // Insertion de la balise <div> (cart__item__content__settings__quantity) //
        var divQuantity = document.createElement('div');
        divQuantity.setAttribute('class', 'cart__item__content__settings__quantity');
        divSettings.appendChild(divQuantity);

        // Insertion de la balise <p> (quantités) //
        var pQuantity = document.createElement('p');
        var textQuantity = document.createTextNode('Qté : ');
        pQuantity.appendChild(textQuantity);
        divQuantity.appendChild(pQuantity);

        // Insertion de l'input (quantités) //
        var inputQuantity = document.createElement('input');
        inputQuantity.setAttribute('type', 'number');
        inputQuantity.setAttribute('class', 'itemQuantity');
        inputQuantity.setAttribute('name', 'itemQuantity');
        inputQuantity.setAttribute('min', '1');
        inputQuantity.setAttribute('max', '100');
        inputQuantity.setAttribute('value', object.quantity);
        divQuantity.appendChild(inputQuantity);

        // Insertion de la balise <div> (cart__item__content__settings__delete) //
        var divDelete = document.createElement('div');
        divDelete.setAttribute('class', 'cart__item__content__settings__delete');
        divSettings.appendChild(divDelete);

        // Insertion du "bouton" de suppression //
        var pDelete = document.createElement('p');
        pDelete.setAttribute('class', 'deleteItem');
        var textDelete = document.createTextNode('Supprimer');
        pDelete.appendChild(textDelete);
        divDelete.appendChild(pDelete);
    }
    // Insertion de la quantité totale //
    var quantityProduct = document.createTextNode(quantityCalculation());
    document.getElementById('totalQuantity').appendChild(quantityProduct);

    // Insertion du montant total //
    var totalAmount = document.createTextNode(totalPrice);
    document.getElementById('totalPrice').appendChild(totalAmount);
    deleteProduct();
    quantityModification();
}

productSearch();

// Suppression dynamique d'un produit //

function deleteProduct() {
    let deleteBtn = document.querySelectorAll('.deleteItem');
    for (let btn of deleteBtn) {
        btn.addEventListener('click', function(e) {
            let productCard = e.target.closest('article');
            let newOrder = [];
            for(let object of originalData) {
                if(object.id != productCard.dataset.id || object.colors != productCard.dataset.color) {
                    newOrder.push(object);
                }
            }
            let stringNewOrder = JSON.stringify(newOrder);
            localStorage.setItem('myBasket', stringNewOrder);
            window.location.href = window.location.href;
        })
    }
}

// Modification dynamique des quantités //
function quantityModification() {
    let quantityBtn = document.querySelectorAll('.itemQuantity');
    for(let btn of quantityBtn) {
        btn.addEventListener('change', function(e) {
            let productCard = e.target.closest('article');
            let newBasket = [];
            for (let object of originalData) {
                let initialQuantity = parseFloat(object.quantity);
                let quantityChange = parseFloat(btn.value);
                if(productCard.dataset.id == object.id && productCard.dataset.color == object.colors && initialQuantity != quantityChange) {
                    object.quantity = quantityChange;
                }
                newBasket.push(object);
                let stringNewBasket = JSON.stringify(newBasket);
                console.log(stringNewBasket);
                localStorage.setItem('myBasket', stringNewBasket);
                window.location.href = window.location.href;
            }
        })
    }
}

// Insertion dynamique du nombre total du produit //
function quantityCalculation() {
    let sumQuantity = 0;
    for(let object of originalData) {
        sumQuantity += parseFloat(object.quantity);
    }
    return sumQuantity;
};

function order() {
    const btnOrder = document.getElementById('order');
    btnOrder.addEventListener('click', function(e) {
        e.preventDefault();
        let idProduct = [];
        let firstNameTextError = document.getElementById('firstNameErrorMsg').innerText;
        let lastNameTextError = document.getElementById('lastNameErrorMsg').innerText;
        let addressTextError = document.getElementById('addressErrorMsg').innerText;
        let cityTextError = document.getElementById('cityErrorMsg').innerText;
        let emailTextError = document.getElementById('emailErrorMsg').innerText;
        for (let object of originalData) {
            idProduct.push(object.id);
        }
        let formData = {
            'contact' :{
                'firstName': document.getElementById('firstName').value,
                'lastName': document.getElementById('lastName').value,
                'address': document.getElementById('address').value,
                'city': document.getElementById('city').value,
                'email': document.getElementById('email').value,
            },
            'products': idProduct,
        };
        if(firstNameTextError == "" && firstName.value != ""
        && lastNameTextError == "" && lastName.value != ""
        && addressTextError == "" && address.value != ""
        && cityTextError == "" && city.value != ""
        && emailTextError == "" && email.value != ""
        ) {
            fetch("http://localhost:3000/api/products/order", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                localStorage.clear('myBasket');
                localStorage.setItem('order', data.orderId);
                location.href = 'confirmation.html';

            })
        }

    })
}

order();

// Validation des champs du formulaire //
function formValidaton() {
    let firstName = document.getElementById('firstName');
    firstName.addEventListener('change', function() {
        validFirstName(this);
    });
    const validFirstName = function(input) {
        let firstNameRegExp = new RegExp('^[A-Z]{1}[A-Za-z\é\è\-\ê\ç\ï\î\â]+$')
        let testFirstName = firstNameRegExp.test(input.value);
        if(testFirstName == false) {
            document.getElementById('firstNameErrorMsg').innerHTML = "Ceci n'est pas un prénom";
            firstName.onchange = reStart;
            function reStart() {
                document.getElementById('firstNameErrorMsg').innerHTML = "";
            }
        }
    };

    let lastName = document.getElementById('lastName');
    lastName.addEventListener('change', function() {
        validLastName(this);
    });
    const validLastName = function(input) {
        let lastNameRegExp = new RegExp('[A-Z][A-Za-z\é\è\ê\'\ç\ï\î\â\-]+$');
        let testLastName = lastNameRegExp.test(input.value);
        if(testLastName == false) {
            document.getElementById('lastNameErrorMsg').innerHTML = "Il y a un problème avec votre nom de famille";
            lastName.onchange = reStart;
            function reStart() {
                document.getElementById('lastNameErrorMsg').innerHTML = "";
            }
        }
    };

    let address = document.getElementById('address');
    address.addEventListener('change', function() {
        validAddress(this);
    });

    const validAddress = function(input) {
        let addressRegExp = new RegExp('^[0-9]{1,4} [A-Z a-z\é\è\ê\ç\ï\î\â\-]{3,25}$');
        let testAddress = addressRegExp.test(input.value);
        if(testAddress == false) {
            document.getElementById('addressErrorMsg').innerHTML = "Veuillez saisir une adresse postale sans ponctuation";
            address.onchange = reStart;
            function reStart() {
                document.getElementById('addressErrorMsg').innerHTML = "";
            }
        }
    }

    let city = document.getElementById('city');
    city.addEventListener('change', function() {
        validCity(this);
    });

    const validCity = function(input) {
        let cityRegExp = new RegExp('^[A-Z a-z\é\è\ê\ç\'\ï\î\â\-]+$');
        let testCity = cityRegExp.test(input.value);
        if(testCity == false) {
            document.getElementById('cityErrorMsg').innerHTML = "Cette ville n'est pas reconnue";
            city.onchange = reStart;
            function reStart() {
                document.getElementById('cityErrorMsg').innerHTML = "";
            }
        }
    }

    let email = document.getElementById('email');
    email.addEventListener('change', function() {
        validEmail(this);
    });

    const validEmail = function(input) {
        let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{1,12}$');
        let testEmail = emailRegExp.test(input.value);
        if(testEmail == false) {
            document.getElementById('emailErrorMsg').innerHTML = "Veuillez saisir une adresse E-mail valide";
            email.onchange = reStart;
            function reStart() {
                document.getElementById('emailErrorMsg').innerHTML = "";
            }
        }
    }
}

formValidaton();











