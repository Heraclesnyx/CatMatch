function scoreCats(cats) {
	const first = Math.round(Math.random() * cats.length - 1);
	let second = Math.round(Math.random() * cats.length - 1);


	//Méthode aléatoire dans ma boucle while

	while (first === second) {
		let second = Math.round(Math.random() * cats.length - 1);
	}

	const catsCollection = [cats[first], cats[second]];
	const promises = [];

	//Event clic sur nos images généré aléatoirement


	for (let i = 0, c = catsCollection.length; i < c; i++) {
		const img = new Image();

		img.src = catsCollection[i].url;

		img.onclick = () => fetch('/increment', {
			method: 'POST',
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({ url: catsCollection[i].url  }),
		})
		.then(() => {
			document.getElementsByClassName('root')[0].innerHTML = '';
			document.getElementsByClassName('root')[1].innerHTML = '';
			scoreCats(cats);
		}).catch(console.log);

		promises[i] = new Promise(resolve => img.onload = resolve(img));
	}

	Promise.all(promises).then(images => {
		const root = document.getElementsByClassName('root');

		for (let i = 0, c = images.length; i < c; i++) {
			root[i].appendChild(images[i]);			
		}
	});
}

//afficher éléments
function printCats(cats) {

	let i = 0;
	cats.forEach(cat => {
		let compteur = i === 0 ? 'col-md-8 col-md-offset-2 col-xs-12' : 'col-md-3 col-xs-12';
		i++;
		console.log(buildCatCard(cat, compteur));
		$(buildCatCard(cat, compteur)).appendTo("#list_card");
	});
}

//créer l'élément seul
function buildCatCard(cat, compteur) {
	

	let lister = document.createElement("div");
	lister.className = "card";

	let header = document.createElement("div");
	header.className = "card__header text-center";

	let bodyName = document.createElement("div");
	bodyName.className = "card__body text-center";

	let col = document.createElement("div");
	col.className = compteur;


	col.appendChild(lister);
	lister.appendChild(header);
	lister.appendChild(bodyName);


	let img = document.createElement("img");
	img.src = cat.url;
	header.style.backgroundImage = `url(${cat.url})`;

	let text = document.createTextNode("Le nombre de vote pour ce chaton est de : " + cat.score);

	bodyName.appendChild(text);
	header.appendChild(img);

	return col;

}