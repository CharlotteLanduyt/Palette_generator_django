let rotation = 360;

function send(event) {
    document.getElementById("click").style.transform = `rotate(${rotation}deg)`;

    fetch('http://127.0.0.1:8000/get_random_theme_colors/')
        .then(response => response.json())
        .then(data => {
            updateColors(data.colors);
            rotation += 360
        })
        .catch(error => console.error('Error:', error));
}

function updateColors(colors) {
    const introduction = document.getElementById('introduction');
    const numberColors = document.getElementById('number_colors');
    const numberThemes = document.getElementById('number_themes');
    const images = document.querySelectorAll(".image")

    introduction.style.backgroundColor = `rgb(${colors[0].r}, ${colors[0].g}, ${colors[0].b})`;
    numberColors.style.backgroundColor = `rgb(${colors[3].r}, ${colors[3].g}, ${colors[3].b})`;
    numberThemes.style.backgroundColor = `rgb(${colors[1].r}, ${colors[1].g}, ${colors[1].b})`;

    images.forEach((image) => {
        image.style.backgroundColor = `rgb(${colors[4].r}, ${colors[4].g}, ${colors[4].b})`;
    })
}
