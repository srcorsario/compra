let lista = [];
let nombreLista = "";

// Mostrar notificación
function toast(msg) {
    const t = document.getElementById("toast");
    t.innerText = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2500);
}

// Guardar lista en localStorage
function guardarLocal() {
    localStorage.setItem("lista_compra", JSON.stringify(lista));
    localStorage.setItem("lista_nombre", nombreLista);

    // Guardar en índice de listas
    let index = JSON.parse(localStorage.getItem("listas_guardadas") || "[]");
    if (!index.includes(nombreLista)) {
        index.push(nombreLista);
        localStorage.setItem("listas_guardadas", JSON.stringify(index));
    }
}

// Cargar plantilla desde GitHub
async function cargarPlantilla() {
    const res = await fetch("plantilla.json");
    const data = await res.json();
    lista = data.items;
    nombreLista = "lista_habitual";
    guardarLocal();
    renderLista();
    toast("📘 Lista habitual cargada");
}

// Guardar lista semanal con nombre único
function guardarListaSemana() {
    const fecha = new Date().toISOString().split("T")[0];
    nombreLista = "lista_" + fecha;
    guardarLocal();
    renderLista();
    toast("✅ Lista guardada como: " + nombreLista);
}

// Mostrar selector de listas guardadas
function cargarLocal() {
    const index = JSON.parse(localStorage.getItem("listas_guardadas") || "[]");

    if (index.length === 0) {
        toast("⚠️ No hay listas guardadas");
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
    const guardada = localStorage.getItem("lista_compra");
    const index = JSON.parse(localStorage.getItem("listas_guardadas") || "[]");

    const listaGuardada = localStorage.getItem("lista_compra_" + nombre);

    if (!listaGuardada) {
        toast("❌ No se encontró la lista");
        return;
    }

    lista = JSON.parse(listaGuardada);
    nombreLista = nombre;

    renderLista();
    toast("📂 Lista cargada: " + nombre);

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
    nombreLista = "Sin lista cargada";
    renderLista();
};
