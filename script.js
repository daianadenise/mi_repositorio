
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
}

// Algoritmo con ciclo para crear la lista de tareas
const tareas = [
    "Escribir tus metas personales",
    "Practicar meditación durante 10 minutos",
    "Hacer ejercicio físico",
    "Leer un libro de desarrollo personal",
    "Escribir un diario de gratitud"
];

const listaTareas = document.getElementById("listaTareas");
tareas.forEach((tarea) => {
    const li = document.createElement("li");
    li.textContent = tarea;
    listaTareas.appendChild(li);
});