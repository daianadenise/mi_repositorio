// Tareas por defecto si la base de datos no está disponible (p. ej. al abrir el archivo en local)
const TAREAS_POR_DEFECTO = [
    "Escribir tus metas personales",
    "Practicar meditación durante 10 minutos",
    "Hacer ejercicio físico",
    "Escribir 3 cosas por las que agradeces",
].map((descripcion) => ({ id: null, descripcion, completada: false }));

async function api(ruta, opciones = {}) {
    const respuesta = await fetch(`api/${ruta}`, {
        headers: { "Content-Type": "application/json" },
        ...opciones,
    });
    if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
    return respuesta.json();
}

// Algoritmo condicional para mostrar mensaje motivacional personalizado
function mostrarMensajeMotivacional() {
    const estadoAnimo = document.getElementById("estadoAnimo").value;
    let mensaje = "";

    switch (estadoAnimo) {
        case "feliz":
            mensaje = "¡Felicidades! Hoy es un gran día para alcanzar tus metas.";
            break;
        case "triste":
            mensaje = "No te preocupes, los momentos difíciles también pasarán. ¡Ánimo!";
            break;
        case "ansioso":
            mensaje = "Respira profundamente y toma las cosas con calma. Todo saldrá bien.";
            break;
        case "motivado":
            mensaje = "¡Excelente elección! Hoy es el día perfecto para empezar a lograr tus sueños.";
            break;
        default:
            mensaje = "Selecciona un estado de ánimo para recibir tu mensaje motivacional.";
            break;
    }

    document.getElementById("mensajeMotivacional").textContent = mensaje;

    if (estadoAnimo) {
        localStorage.setItem("estadoAnimo", estadoAnimo);
        // Guardar el estado de ánimo en la base de datos
        api("animo.php", { method: "POST", body: JSON.stringify({ estado: estadoAnimo }) })
            .catch((error) => console.warn("No se pudo guardar el estado de ánimo:", error));
    }
}

// Algoritmo con ciclo para crear la lista de tareas
function pintarTareas(tareas) {
    const lista = document.getElementById("listaTareas");
    lista.innerHTML = "";

    tareas.forEach((tarea) => {
        const li = document.createElement("li");
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = tarea.completada;

        if (tarea.id !== null) {
            checkbox.addEventListener("change", () => {
                api("tareas.php", {
                    method: "POST",
                    body: JSON.stringify({ id: tarea.id, completada: checkbox.checked }),
                }).catch((error) => {
                    checkbox.checked = !checkbox.checked;
                    alert("No se pudo guardar la tarea. Inténtalo de nuevo.");
                    console.warn(error);
                });
            });
        }

        label.append(checkbox, " ", tarea.descripcion);
        li.appendChild(label);
        lista.appendChild(li);
    });
}

async function cargarTareas() {
    try {
        pintarTareas(await api("tareas.php"));
    } catch (error) {
        console.warn("Base de datos no disponible, usando tareas por defecto:", error);
        pintarTareas(TAREAS_POR_DEFECTO);
        document.getElementById("estadoConexion").textContent =
            "No se pudo conectar con la base de datos: los cambios no se guardarán.";
    }
}

// Cargar el estado de ánimo previamente seleccionado
const estadoAnimoGuardado = localStorage.getItem("estadoAnimo");
if (estadoAnimoGuardado) {
    document.getElementById("estadoAnimo").value = estadoAnimoGuardado;
}

cargarTareas();
