const pokeAPI = "https://pokeapi.co/api/v2/pokemon?"; //api
const limite = "offset=0&limit=20";
const prevfin = "https://pokeapi.co/api/v2/pokemon?offset=1100&limit=20";
document.addEventListener("DOMContentLoaded", () => {
	//document.querySelector(".lista-pokemones").innerHTML = "";
	crearListaDePokemons(`${pokeAPI}${limite}`);
});

async function obtenerJson(url, unaFuncion, otroParametro) { //devuelvo una promesa desde donde fue invocada(otra funcion) para controlar con await
	
	return fetch(url)										//desde afuera que luego no hago nada con eso solo es para ejecutarlo
		.then((res) => res.json())
		.then((data) => {
			 return new Promise(function(resolve, reject) {unaFuncion(data, otroParametro)})
		} );
}
//------------------------------CREO LA LISTA DE POKEMONS-------------------------
async function crearListaDePokemons(url) {
	await obtenerJson(url, loadPokemons);//aca ejecuto la funcion con el await pero no se lo asigno a nada porq solo quiero q se ejecute 
}

 function loadPokemons(data) {
	//DATA ES EL JSON YA GENERADO
	document.querySelector(".lista-pokemones").innerHTML = "";

	cargarFlechas(data);
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
		$previous.disabled = true;
	} else {
		$previous.disabled = false;
	}

	if (data.next == null) {	
		$next.disabled = true;
		document.getElementById("previous").value = prevfin;
	} else {
		$next.disabled = false;
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
		var url = data.sprites.front_default || data.sprites.other["official-artwork"].front_default ;
		if (url === null) {
			url= data.sprites.other["official-artwork"].front_default || data.sprites.other["home"].front_default || data.sprites.front_shiny || data.sprites.versions["generation-viii"].icons.front_default;
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
		if ((parent !== null && tamList == 20) || tamList == 18 || tamList == 6) {//ACA CONTROLO LA CANTIDAD DE POKEMONS QUE ME TRAE LA API ANTES DE 
			parent.appendChild($figCap);//INCLUIRLA EN EL EL LA PAGINA
			parent.appendChild($img);
		}
	}
}

//************************************************************************************ */

function setearNombre(id) {
	document.getElementById("nombre").innerHTML = id.toUpperCase();
}
async function detalleCompleto(id) {
	setearNombre(id);
	let url = document.getElementById(id).src;
	await obtenerJson(url, mostrarDatos);
}
function mostrarImagenPokemon(url) {
	let imagen = document.getElementById("img");
	let img = url.sprites.other["official-artwork"].front_default; // ESTAN SON LA IMAGENES CENTRALES
	if (img === null) {
		img = url.sprites.front_default || url.sprites.front_shiny || url.sprites.versions["generation-viii"].icons.front_default;
	}
	imagen.src = img;
}

function mostrarHabilidades(array) {
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
			$p.innerHTML = `*${array[i]["move"]["name"]}`;
			$divaux.appendChild($p);
		}
		$div.appendChild($divaux)
	} else {
		for (let i = 0; i < array.length; i++) {
			let $p = document.createElement("p");
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

async function manejarFlechas(id) {
	let $previous = document.getElementById("previous");
	let $next = document.getElementById("next");

	if (id === "previous") {
		if ($previous.value !== "null") {
			if ($previous.value === prevfin) {
				//controlo cuando vuelvo desde la ultima pagina , volver a habilitar la siguiente
				$next.disabled = false;
				console.log("1")
			}
			$previous.classList.remove("disabled");
			$previous.disabled = true;

			// Desactivo la flecha siguiente para que no me genere error si la llegoo a apresionar
			$next.classList.remove("disabled");
			$next.disabled = true;

			//
			await (new Promise(function(resolve, reject) {
				resolve(crearListaDePokemons($previous.value))

			}));

			// vuelvo a activar la flecha siguiente r
				$next.classList.remove("disabled");
				$next.disabled = false;

			//
			
			


			console.log("1.1")
			$previous.classList.remove("disabled");
			$previous.disabled = false;
			crearListaDePokemons($previous.value); //data.previous);	
		} else {
			console.log("2")
			$previous.classList.add("disabled");
			$previous.disabled = true;
		}
	} 
	else {// el next elvalor
		if ($next.value !== null && $next.value.slice(-1) !== "6") {
			$next.classList.remove("disabled");
			$next.disabled = true;

			// Desactivo la flecha anterior para que no me genere error si la llegoo a apresionar
				
			$previous.classList.remove("disabled");
			$previous.disabled = true;
			
			//

			await (new Promise(function(resolve, reject) {
				resolve(crearListaDePokemons($next.value))

			}));

			// vuelvo a activar la flecha previa
			$previous.classList.remove("disabled");
			$previous.disabled = false;
			//
			$next.classList.remove("disabled");
			$next.disabled = false;
			$previous.classList.remove("disabled");
			$previous.disabled = false;
			// crearListaDePokemons($next.value);
		}
		else {
			// Desactivo la flecha anterior para que no me genere error si la llegoo a apresionar

			
			//
			await (new Promise(function(resolve, reject) {
				resolve(crearListaDePokemons($next.value))
		
			}));
			
			console.log("4.1")
			$next.classList.add(".disabled");
			$next.disabled = true;
			// document.getElementById("previous").value = prevfin; //controlo el fin para que cuando
			// // retroceda no me traiga los 18 pokemons
		}
   }
}
