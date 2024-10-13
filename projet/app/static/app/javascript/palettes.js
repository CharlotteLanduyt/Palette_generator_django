function fetchSessionData() {
    return fetch('http://127.0.0.1:8000/get_session_data/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return data.donnees_ia;
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
            throw error;
        });
}

document.querySelectorAll('.input_couleur').forEach(function(input) {
    input.addEventListener('input', handleColorChange);
    input.addEventListener('change', handleColorChange);
});

function handleColorChange(e) {
    var input = e.target;
    var nouvelle_couleur = input.value;
    var hex = nouvelle_couleur.replace(/^#/, '');

    if (hex.length === 3) {
        hex = hex.split('').map(function(x) { return x + x; }).join('');
    }

    var r = parseInt(hex.slice(0, 2), 16);
    var g = parseInt(hex.slice(2, 4), 16);
    var b = parseInt(hex.slice(4, 6), 16);

    var index = e.target.id.replace('couleur_', '') - 1;

    color(r, g, b, index);

    var id_vignette = input.id.replace('couleur_', 'vignette_couleur_');
    document.getElementById(id_vignette).style.backgroundColor = nouvelle_couleur;
    document.querySelector(`#rgb_${index + 1}`).innerHTML = `<span> rgb: </span> ${r},${g},${b}`;
    document.querySelector(`#cmjn_${index + 1}`).innerHTML = rgbToCmyk(r, g, b);
}

function rgbToCmyk(r, g, b) {
    let rPrime = r / 255;
    let gPrime = g / 255;
    let bPrime = b / 255;

    let k = 1 - Math.max(rPrime, gPrime, bPrime);

    if (k === 1) {
        return { c: 0, m: 0, y: 0, k: 100 };
    }

    let c = (1 - rPrime - k) / (1 - k);
    let m = (1 - gPrime - k) / (1 - k);
    let y = (1 - bPrime - k) / (1 - k);

    return `<span> cmjn: </span> ${Math.round(c * 100)}% ${Math.round(m * 100)}% ${Math.round(y * 100)}% ${Math.round(k * 100)}%`;
}


fetchSessionData().then(palette => {
    palette = palette.predicted_palette;

    palette.forEach(function(element, index) {
        let hsl = color(element[0], element[1], element[2], index);

        document.querySelector(`#rgb_${index + 1}`).innerHTML = `<span> rgb: </span> ${element[0]},${element[1]},${element[2]}`;
        document.querySelector(`#cmjn_${index + 1}`).innerHTML = rgbToCmyk(element[0], element[1], element[2]);
    });
}).catch(error => {
    console.error('Erreur lors de l\'insertion de la palette :', error);
});

function color(r, g, b, index) {
    r /= 255;
    g /= 255;
    b /= 255;

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, l;

    l = (max + min) / 2;

    if (max == min) {
        h = s = 0;
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    let hsl = { h: h * 360, s: s, l: l };

    let colorElement = document.querySelector(`#vignette_couleur_${index + 1}`);
    let colorRangeElement = document.getElementById(`color_range_${index + 1}`);
    let saturation = "";

    // Correction ici, utilisez '===' au lieu de '='
    if (hsl.l < 0.6) {
        colorElement.classList.add("light");
        colorElement.classList.remove("dark");
    } else {
        colorElement.classList.add("dark");
        colorElement.classList.remove("light");
    }

    if (hsl.l < 0.3) {
        saturation = "Dark";
    } else if (hsl.l > 0.9) {
        saturation = "White";
    } else if (hsl.l > 0.7) {
        saturation = "Light";
    } else if (hsl.s < 0.25) {
        saturation = "Grey";
    }

    var hue = "";
    if (hsl.h >= 0 && hsl.h < 15) hue = "Red";
    else if (hsl.h >= 15 && hsl.h < 30) hue = "Reddish Orange";
    else if (hsl.h >= 30 && hsl.h < 45) hue = "Orange";
    else if (hsl.h >= 45 && hsl.h < 60) hue = "Yellowish Orange";
    else if (hsl.h >= 60 && hsl.h < 75) hue = "Yellow";
    else if (hsl.h >= 75 && hsl.h < 90) hue = "Yellowish Green";
    else if (hsl.h >= 90 && hsl.h < 150) hue = "Green";
    else if (hsl.h >= 150 && hsl.h < 160) hue = "Cyanish Green";
    else if (hsl.h >= 160 && hsl.h < 180) hue = "Cyan";
    else if (hsl.h >= 180 && hsl.h < 210) hue = "Bluish Cyan";
    else if (hsl.h >= 210 && hsl.h < 240) hue = "Blue";
    else if (hsl.h >= 240 && hsl.h < 270) hue = "Violet";
    else if (hsl.h >= 270 && hsl.h < 310) hue = "Purple";
    else if (hsl.h >= 310 && hsl.h < 330) hue = "Magenta";
    else if (hsl.h >= 330 && hsl.h < 345) hue = "Pink";
    else if (hsl.h >= 345 && hsl.h <= 360) hue = "Red";

    // Gestion des couleurs spécifiques
    if (saturation == "Dark" && (hue == "Yellow" || hue == "Yellowish Orange" || hue == "Orange" || hue == "Reddish Orange" || hue == "Red")) {
        colorRangeElement.innerText = "Brown";
    } else if (saturation == "White") {
        colorRangeElement.innerText = saturation;
    } else {
        colorRangeElement.innerText = saturation + ' ' + hue;
    }
}

let tools = document.querySelectorAll(".tool");

tools.forEach((element) => {
    element.querySelector(".tool_open").addEventListener('click', () => {
        element.querySelector(".expand").classList.add("opened");
    });

    element.querySelector(".tool_close").addEventListener('click', () => {
        element.querySelector(".expand").classList.remove("opened");
    });
});
