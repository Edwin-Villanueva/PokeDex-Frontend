const pokeAPI = "https://pokeapi.co/api/v2/pokemon?"; //api
const limite = "offset=0&limit=20";
const prevfin = "https://pokeapi.co/api/v2/pokemon?offset=1080&limit=20";
document.addEventListener("DOMContentLoaded", () => {
	//document.querySelector(".lista-pokemones").innerHTML = "";
	crearListaDePokemons(`${pokeAPI}${limite}`);
});

function obtenerJson(url, unaFuncion, otroParametro) {
	fetch(url)
		.then((res) => res.json())
		.then((data) => {
			unaFuncion(data, otroParametro);
		});
}
//------------------------------CREO LA LISTA DE POKEMONS-------------------------
function crearListaDePokemons(url) {
	document.querySelector(".lista-pokemones").innerHTML = "";
	obtenerJson(url, loadPokemons);
}

function loadPokemons(data) {
	//DATA ES EL JSON YA GENERADO
	document.querySelector(".lista-pokemones").innerHTML = "";

	cargarFlechas(data);
	console.log(document.getElementById("previous").value);
	console.log(document.getElementById("next").value);

	for (let i = 0; i < data.results.length; i++) {//proceso cada elemendo de data que contiene nombre y link de cada pokemon
		agregarElemento(data.results[i].name, data.results[i].url);
		obtenerJson(data.results[i].url, setearElement, data.results[i].name);
	}
}

//nuevo codigo
function cargarFlechas(data) {
	let $previous = document.getElementById("previous");
	$previous.value = data.previous;
	let $next = document.getElementById("next");
	$next.value = data.next;
	if (data.previous == null) {
		previous.disabled = true;
	} else {
		previous.disabled = false;
	}
	if (data.next == null) {
		next.disabled = true;
		document.getElementById("previous").value = prevfin;
	} else {
		next.disabled = false;
	}
	// console.count("cargar-flechas");
}

//CREO UN ELEMENTO ,LE SETEO LO NECESARIO PARA LUEGO MANIPULARLO Y LO AGREGO AL DOM
function agregarElemento(name, url) {
	var $pokeList = document.querySelector(".lista-pokemones"); //este es elemento padre
	var $fig = document.createElement("figure");
	$fig.className = "poke"; // seteo el elemento contenedor con nombre de clase poke
	$fig.id = name;
	$fig.src = url;
	var div=document.createElement("div");

	div.appendChild($fig);// SE AGREGA UN ELEMENTO HIJO A LA LISTA DE POKEMONS
	$pokeList.appendChild(div);
	$fig.onclick = function () {
		detalleCompleto(this.id);
	};
}
//***********************************************************************/

//SETEO EL NOMBRE Y LA IMAGEN DE UN ELEMENTO
function setearElement(data, nombre) {
	//PASO DATA QUE SERIA EL JSON DEL POKEMON Y NOMBRE DEL POKEMON
	if (data) {
		let url = data.sprites.front_default;
		if (url === null) {
			//agregue recien
			url = data.sprites.other["official-artwork"].front_default;
		}
		let name = nombre;

		const parent = document.getElementById(name);
		const $img = document.createElement("img");
		const $figCap = document.createElement("figcaption");
		$img.src = url;
		$img.width = "96";
		$img.height = "96";

		$figCap.innerText =name;
		let tamList =
			document.querySelector(".lista-pokemones").children.length;
		if ((parent !== null && tamList == 20) || tamList == 18) {
			/*console.log(
				"parent es = " +
					parent +
					" con cantidad de hijos  = a " +
					tamList
			);*/
			parent.appendChild($figCap);
			parent.appendChild($img);
		}
	}
}

//************************************************************************************ */

function setearNombre(id) {
	document.getElementById("nombre").innerHTML = id.toUpperCase();
}
function detalleCompleto(id) {
	setearNombre(id);
	let url = document.getElementById(id).src;
	obtenerJson(url, mostrarDatos);
}
function mostrarImagenPokemon(url) {
	let imagen = document.getElementById("img");
	let img = url.sprites.other["official-artwork"].front_default; // ESTAN SON LA IMAGENES CENTRALES
	if (img === null) {
		img = url.sprites.front_default;
	}
	imagen.src = img;
}

function mostrarHabilidades(array) {
	//console.log(array);
	let $habilidades = document.querySelector(".habilidades");
	$habilidades.innerHTML = "";
	let $div = document.createElement("div");
	let $divaux= document.createElement("div");
	$divaux.classList.add("habContainer");
	$div.classList.add("elem-dato");
	$div.innerHTML = "<p><strong>Habilidades</strong></p>";
	array.forEach((e) => {
		
		let nombre = e.ability.name;
		let $p = document.createElement("p");
		$p.innerText = `*  ${nombre}`;
		$p.classList.add("habilidad");
		$divaux.appendChild($p);
	});
	
	$div.appendChild($divaux);
	$habilidades.appendChild($div);
}
function mostrarTipos(array) {
	let $div = document.createElement("div");
	$div.innerHTML = "<p><strong>tipo/base</strong></p>";
	let $divaux= document.createElement("div");
	$divaux.classList.add("habContainer");
	$div.classList.add("elem-dato");
	array.forEach((e) => {
		let $p = document.createElement("p");
		$p.innerText = `*  ${e.type.name}`;

		$divaux.appendChild($p);
	});
	$div.appendChild($divaux);
	document.querySelector(".habilidades").appendChild($div);
}
function mostrarPesoAltura(json) {
	let $div = document.createElement("div");
	let $divaux= document.createElement("div");
	$divaux.classList.add("habContainer");
	$divaux.innerHTML = `<p><strong>Peso: </strong>${json.weight}</p>
					<p><strong>Altura: </strong>${json.height}</p>`;
	$div.classList.add("elem-dato");
	
	
	$div.appendChild($divaux)
	document.querySelector(".habilidades").appendChild($div);
}

function mostrarMoves(array) {
	let $div = document.createElement("div");
	$div.classList.add("elem-dato");
	$div.innerHTML = "<p><strong>Ataques</strong></p>";
	let $divaux= document.createElement("div");
	$divaux.classList.add("habContainer");
	if (array.length >= 5) {
		for (let i = 0; i < 5; i++) {
			let $p = document.createElement("p");
			console.log(array[i]["move"]["name"]);
			$p.innerHTML = `*${array[i]["move"]["name"]}`;
			$divaux.appendChild($p);
		}
		$div.appendChild($divaux)
	} else {
		for (let i = 0; i < array.length; i++) {
			let $p = document.createElement("p");
			console.log(array[i]["move"]["name"]);
			$p.innerHTML = `<p>${array[i]["move"]["name"]}</p>`;
			$divaux.appendChild($p);
		}
		$div.appendChild($divaux)
	}
	document.querySelector(".habilidades").appendChild($div);
}

function mostrarDatos(url) {
	mostrarImagenPokemon(url);
	mostrarHabilidades(url.abilities);
	mostrarTipos(url.types);
	mostrarPesoAltura(url);
	mostrarMoves(url.moves);
}

//***************************************************************************************/

function manejarFlechas(id) {
	let $previous = document.getElementById("previous");
	let $next = document.getElementById("next");

	if (id === "previous") {
		if ($previous.value !== "null") {
			if ($previous.value === prevfin) {
				//controlo cuando vuelvo desde la ultima pagina , volver a habilitar la siguiente
				$next.disabled = false;
			}
			$previous.classList.remove("disabled");
			$previous.disabled = false;
			document.querySelector(".lista-pokemones").innerHTML = "";
			crearListaDePokemons($previous.value); //data.previous);
		} else {
			$previous.classList.add("disabled");
			$previous.disabled = true;
		}
	} else {
		if ($next.value != "null") {
			$next.classList.remove("disabled");
			$next.disabled = false;
			$previous.classList.remove("disabled");
			$previous.disabled = false;
			document.querySelector(".lista-pokemones").innerHTML = "";
			crearListaDePokemons($next.value);
		} else {
			$next.classList.add(".disabled");
			$next.disabled = true;
			document.getElementById("previous").value = prevfin; //controlo el fin para que cuando retroceda no me traiga
			//18 pokemons
		}
	}
}
