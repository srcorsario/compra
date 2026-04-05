let lista = [];
let nombreLista = "";

// Mostrar notificación
function toast(msg) {
    const t = document.getElementById("toast");
    t.innerText = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2500);
}

// Generar nombre DD-MM-AAAA_XXXX
function generarNombreLista() {
    const hoy = new Date();
    const dd = String(hoy.getDate()).padStart(2, "0");
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const yyyy = hoy.getFullYear();

    const base = `${dd}-${mm}-${yyyy}`;

    let index = JSON.parse(localStorage.getItem("listas_guardadas") || "[]");
    let contador = 1;

    while (index.includes(`${base}_${String(contador).padStart(4, "0")}`)) {
        contador++;
    }

    return `${base}_${String(contador).padStart(4, "0")}`;
}

// Guardar lista bajo su nombre real
function guardarListaConNombre(nombre) {
    localStorage.setItem("lista_compra_" + nombre, JSON.stringify(lista));

    let index = JSON.parse(localStorage.getItem("listas_guardadas") || "[]");
    if (!index.includes(nombre)) {
        index.push(nombre);
        localStorage.setItem("listas_guardadas", JSON.stringify(index));
    }

    localStorage.setItem("lista_ultima", nombre);
}

// Guardar lista semanal con nombre DD-MM-AAAA_XXXX
function guardarListaSemana() {
    nombreLista = generarNombreLista();
    guardarListaConNombre(nombreLista);
    renderLista();
    toast("Lista guardada como: " + nombreLista);
}

// Guardar lista habitual o nueva lista
function guardarLocal() {
    guardarListaConNombre(nombreLista);
}

// Cargar plantilla desde GitHub
async function cargarPlantilla() {
    const res = await fetch("plantilla.json");
    const data = await res.json();
    lista = data.items;

    nombreLista = "lista_habitual";
    guardarListaConNombre(nombreLista);
    renderLista();

    toast("Lista habitual cargada");
}

// Mostrar selector de listas guardadas
function cargarLocal() {
    const index = JSON.parse(localStorage.getItem("listas_guardadas") || "[]");

    if (index.length === 0) {
        toast("No hay listas guardadas");
        return;
    }

    const selector = document.getElementById("selectorListas");
    const cont = document.getElementById("selectorContenido");

    cont.innerHTML = "";
    selector.style.display = "flex";

    index.forEach(nombre => {
        const div = document.createElement("div");
        div.className = "selector-item";
        div.innerText = nombre;
        div.onclick = () => cargarListaEspecifica(nombre);
        cont.appendChild(div);
    });
}

// Cargar una lista concreta
function cargarListaEspecifica(nombre) {
    const data = localStorage.getItem("lista_compra_" + nombre);

    if (!data) {
        toast("No se encontró la lista");
        return;
    }

    lista = JSON.parse(data);
    nombreLista = nombre;

    localStorage.setItem("lista_ultima", nombre);

    renderLista();
    toast("Lista cargada: " + nombre);

    document.getElementById("selectorListas").style.display = "none";
}

// Añadir producto
function agregarProducto() {
    const nombre = prompt("Nombre del producto:");
    if (!nombre) return;

    lista.push({ nombre, cantidad: 1, comprado: false });
    guardarLocal();
    renderLista();
}

// Cambiar cantidad
function cambiarCantidad(i, delta) {
    lista[i].cantidad = Math.max(0, lista[i].cantidad + delta);
    guardarLocal();
    renderLista();
}

// Eliminar producto
function eliminar(i) {
    lista.splice(i, 1);
    guardarLocal();
    renderLista();
}

// Marcar como comprado
function toggleComprado(i) {
    lista[i].comprado = !lista[i].comprado;
    guardarLocal();
    renderLista();
}

// Mostrar lista
function renderLista() {
    const cont = document.getElementById("lista");
    cont.innerHTML = "";

    lista.forEach((item, i) => {
        const div = document.createElement("div");
        div.className = "item" + (item.comprado ? " comprado" : "");

        div.innerHTML = `
            <span class="item-name" onclick="toggleComprado(${i})">${item.nombre} (${item.cantidad})</span>
            <div class="controls">
                <button class="btn-qty" onclick="cambiarCantidad(${i}, -1)">-</button>
                <button class="btn-qty" onclick="cambiarCantidad(${i}, 1)">+</button>
                <button class="btn-del" onclick="eliminar(${i})">×</button>
            </div>
        `;

        cont.appendChild(div);
    });

    document.getElementById("nombreLista").innerText = nombreLista;
}

// Inicialización
window.onload = () => {
    const ultima = localStorage.getItem("lista_ultima");

    if (ultima) {
        cargarListaEspecifica(ultima);
    } else {
        nombreLista = "Sin lista cargada";
        renderLista();
    }
};
