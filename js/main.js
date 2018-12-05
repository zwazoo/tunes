;(function() {
	"use strict";

	function msToTime(duration) {
		var milliseconds = parseInt((duration % 1000) / 100),
			seconds = parseInt((duration / 1000) % 60),
			minutes = parseInt((duration / (1000 * 60)) % 60),
			hours = parseInt((duration / (1000 * 60 * 60)) % 24);
	
		hours = (hours < 10) ? "0" + hours : hours;
		minutes = (minutes < 10) ? "0" + minutes : minutes;
		seconds = (seconds < 10) ? "0" + seconds : seconds;
	
		return minutes + ":" + seconds;
	}

	const xhr = new XMLHttpRequest();

	const tuneList = document.querySelector('.ba-tunes-list'),
		tuneTmpl = document.querySelector('#tune-tmpl').innerHTML;

	let tuneListHTML;

	xhr.onload = function () {		
		let ajax = this;

		const data = JSON.parse(ajax.response);
		const tunes = data.results;

		console.log(data);

		tuneListHTML = '';

		tunes.forEach(function(tune) {
			//Create tune card from tmpl and result data
			let duration = msToTime(tune.trackTimeMillis);
			let largeImg = tune.artworkUrl100.replace('100x100', '600x600');

			tuneListHTML += tuneTmpl
					.replace(/{{duration}}/ig, duration)
					.replace(/{{artworkUrl100}}/ig, largeImg)
					.replace(/{{previewUrl}}/ig, tune.previewUrl)
					.replace(/{{artistName}}/ig, tune.artistName)
					.replace(/{{trackName}}/ig, tune.trackName)
					.replace(/{{collectionName}}/ig, tune.collectionName)
					.replace(/{{primaryGenreName}}/ig, tune.primaryGenreName)
					.replace(/{{collectionPrice}}/ig, tune.collectionPrice)
					.replace(/{{trackId}}/ig, tune.trackId)
					.replace(/{{collectionViewUrl}}/ig, tune.collectionViewUrl);
		});

		//Insert tune list into HTML doc
		tuneList.innerHTML = tuneListHTML;
	};

	
	const form = document.querySelector('.ba-search-form');
	let query,
		url;
	
	form.addEventListener('submit', function(e) {
		e.preventDefault();
		
		query = form['search-query'].value;
		url = `https://itunes.apple.com/search?term=${query}&limit=10`;
		
		xhr.open('GET', url);

		xhr.send();
	});

	tuneList.addEventListener('click', function (e) {
		e.preventDefault();
		let action = e.target.dataset.action;

		if(action !='play') return;

		const audioBtn = e.target;// элемент на который мы нажали
		const audioId = audioBtn.dataset.id;

		const audio = document.getElementById(audioId);

		audioBtn.classList.toggle('pulse');

		audio.paused ? audio.play() : audio.pause();
	})

})();

