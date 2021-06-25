const d = document;
const $templatePokemon = d.getElementById("templatePokemon").content;
const $fragment = d.createDocumentFragment();
const $main = d.querySelector("main");
const pokeAPI = "https://pokeapi.co/api/v2/pokemon";

const limpiarHTML = () => {
	while ($main.firstChild) {
		$main.removeChild($main.firstChild);
	}
};

const showPagination = (previous, next) => {
	if (previous) {
		d.querySelector("[data-previous]").classList.remove("hidden");
		d.querySelector("[data-previous]").href = previous;
	} else {
		d.querySelector("[data-previous]").classList.add("hidden");
	}
	if (next) {
		d.querySelector("[data-next]").classList.remove("hidden");
		d.querySelector("[data-next]").href = next;
	} else {
		d.querySelector("[data-next]").classList.add("hidden");
	}
};

const showPokemons = (pokemons) => {
	limpiarHTML();
	pokemons.forEach((pokemon) => {
		const {
			name,
			sprites: { front_default: image },
		} = pokemon;
		$templatePokemon.querySelector(".pokemon__name").textContent = name;
		$templatePokemon.querySelector(".pokemon__image").src = image;

		const $clone = $templatePokemon.cloneNode(true);
		$fragment.appendChild($clone);
	});
	$main.appendChild($fragment);
};

const showSpinner = () => {
	limpiarHTML();
	const divSpinner = d.createElement("div");
	divSpinner.classList.add("spinner");
	$main.appendChild(divSpinner);
};

const getPokemons = async (url) => {
	showSpinner();
	try {
		const res = await fetch(url);
		if (res.ok) {
			const json = await res.json();
			const { next, previous } = json;
			const pokemons = json.results;
			const responses = await Promise.all(
				pokemons.map((el) => fetch(el.url))
			);
			const jsonResponses = await Promise.all(
				responses.map((el) => el.json())
			);
			showPokemons(jsonResponses);
			showPagination(previous, next);
		} else {
			throw `Error ${res.status}: ${
				res.statusText || "Ocurrio un error"
			}`;
		}
	} catch (err) {
		console.log(err);
	}
};

d.addEventListener("DOMContentLoaded", getPokemons(pokeAPI));
d.addEventListener("click", (e) => {
	if (e.target.matches("nav a")) {
		e.preventDefault();
		const URL = e.target.href;
		getPokemons(URL);
	}
});
