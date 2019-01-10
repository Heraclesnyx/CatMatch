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