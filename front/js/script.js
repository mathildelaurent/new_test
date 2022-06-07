console.log('connectée');

// Recherche des API //
async function apiDatas() {
    const promise = await fetch("http://localhost:3000/api/products");
    const reponseJs = await promise.json();
    console.log(reponseJs);

    // Insertion des produits dans la page accueil HTML //
    for (let item of reponseJs) {
        console.log(document.getElementById('items'));
        // Insertion du lien a //
        var a = document.createElement('a');
        a.href = `"./product.html?id="${item._id}`
        document.getElementById('items').appendChild(a);

        // Insertion de la balise article //
        var article = document.createElement('article');
        a.appendChild(article);

        // Insertion de l'image //
        var image = document.createElement('img');
        image.src = item.imageUrl;
        image.alt = item.altTxt;
        article.appendChild(image);

        // Insertion de la balise h3 (nom) //
        var title = document.createElement('h3');
        title.setAttribute('class', 'productName');
        var name = document.createTextNode(item.name);
        title.appendChild(name);
        article.appendChild(title);

        // Insertion de la balise p (description) //
        var p = document.createElement('p');
        p.setAttribute('class', 'productDescription');
        var description = document.createTextNode(item.description);
        p.appendChild(description);
        article.appendChild(p);
    }
}

apiDatas();



    
