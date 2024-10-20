document.getElementById('form_theme').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    try {
        const response = await fetch(this.action, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken 
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la requête réseau');
        }

        const result = await response.json();
        document.querySelector('#theme_title h2').innerText = result.theme

    } catch (error) {
        console.error('Erreur avec la requête asynchrone :', error);
    }
});