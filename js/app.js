// Registrar el service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("../service-worker.js")
      .then(() => console.log("Service Worker registrado ✅"))
      .catch((err) => console.log("Error al registrar:", err));
}

// Lógica para el saludo
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('greetButton');
    const nombreInput = document.getElementById('nombre');

    if (btn && nombreInput) {
        btn.addEventListener('click', () => {
            
            const nombre = nombreInput.value.trim();
            if (nombre !== '') {
                alert(`¡Hola, un gusto saludarte ${nombre}! 👋`);
                nombreInput.value = ''; // Limpiar el campo de texto
            } else {
                alert("Por favor, ingresa tu nombre.");
            }
        });
    }
});