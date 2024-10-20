function toggleHeight(elementId) {
    const element = document.getElementById(elementId);
    
    if (element.style.height === '30vh') {
        element.style.height = '0';
    } else {
        element.style.height = '30vh';
    }
}

function fetchSessionData() {
    return fetch('http://127.0.0.1:8000/get_session_data/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return data.palette;
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
            throw error;
        });
}

document.querySelectorAll('.input_couleur').forEach((input) => {
    input.addEventListener('change', handleColorChange);
});

function handleColorChange(e) {
    let input = e.target;
    let nouvelle_couleur = input.value;
    let hex = nouvelle_couleur.replace(/^#/, '');

    if (hex.length === 3) {
        hex = hex.split('').map(function(x) { return x + x; }).join('');
    }

   let r = parseInt(hex.slice(0, 2), 16);
   let g = parseInt(hex.slice(2, 4), 16);
   let b = parseInt(hex.slice(4, 6), 16);

    let index = input.id.match(/\d+/)[0]*1 - 1;

    color(r, g, b, index);
    updateColor(r,g,b,index)

    let id_vignette = input.id.replace('couleur_', 'vignette_couleur_');
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
    palette = palette;

    if(palette){
        palette.forEach(function(element, index) {
            let hsl = color(element[0], element[1], element[2], index);
    
            document.querySelector(`#rgb_${index + 1}`).innerHTML = `<span> rgb: </span> ${element[0]},${element[1]},${element[2]}`;
            document.querySelector(`#cmjn_${index + 1}`).innerHTML = rgbToCmyk(element[0], element[1], element[2]);
        });
    }
    
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


    if (hsl.h >= 0 && hsl.h < 15) {
        hue = "Red";
    } else if (hsl.h >= 15 && hsl.h < 20) {
        hue = "Reddish Brown";
    } else if (hsl.h >= 20 && hsl.h < 30) {
        hue = "Reddish Orange";
    } else if (hsl.h >= 30 && hsl.h < 40) {
        hue = "Orange";
    } else if (hsl.h >= 40 && hsl.h < 50) {
        hue = "Brownish Orange";
    } else if (hsl.h >= 50 && hsl.h < 60) {
        hue = "Yellowish Orange";
    } else if (hsl.h >= 60 && hsl.h < 75) {
        hue = "Yellow";
    } else if (hsl.h >= 75 && hsl.h < 90) {
        hue = "Yellowish Green";
    } else if (hsl.h >= 90 && hsl.h < 120) {
        hue = "Green";
    } else if (hsl.h >= 120 && hsl.h < 150) {
        hue = "Lime Green";
    } else if (hsl.h >= 150 && hsl.h < 160) {
        hue = "Cyanish Green";
    } else if (hsl.h >= 160 && hsl.h < 180) {
        hue = "Cyan";
    } else if (hsl.h >= 180 && hsl.h < 195) {
        hue = "Aquamarine";
    } else if (hsl.h >= 195 && hsl.h < 210) {
        hue = "Bluish Cyan";
    } else if (hsl.h >= 210 && hsl.h < 225) {
        hue = "Azure";
    } else if (hsl.h >= 225 && hsl.h < 240) {
        hue = "Blue";
    } else if (hsl.h >= 240 && hsl.h < 255) {
        hue = "Indigo";
    } else if (hsl.h >= 255 && hsl.h < 270) {
        hue = "Violet";
    } else if (hsl.h >= 270 && hsl.h < 290) {
        hue = "Purple";
    } else if (hsl.h >= 290 && hsl.h < 310) {
        hue = "Magenta";
    } else if (hsl.h >= 310 && hsl.h < 330) {
        hue = "Pinkish Purple";
    } else if (hsl.h >= 330 && hsl.h < 345) {
        hue = "Pink";
    } else if (hsl.h >= 345 && hsl.h <= 360) {
        hue = "Red";
    }

    colorRangeElement.innerText = saturation + ' ' + hue;
}


async function updateColor(r,g,b,index){
    let formData = new FormData()

    formData.append('r', r);
    formData.append('g', g);
    formData.append('b', b);

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    const response = await fetch(`http://127.0.0.1:8000/palette_update/${index}?action=update`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken 
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error('Erreur lors de la requête réseau');
    }
}


async function deleteColor(index){
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    const response = await fetch(`http://127.0.0.1:8000/palette_update/${index}?action=erase`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken 
        }
    });

    const data = await response.json();

    document.getElementById(`vignette_couleur_${index}`).remove()
    
    const paletteContainer = document.querySelector('#palette_form div');
    paletteContainer.innerHTML = ''

    data.palette.forEach((element)=>{
        paletteContainer.innerHTML += element;
    })

    if(data.number_color_inputs < 5){
        document.getElementById("add_color").style.display = "block"
    }

    if(data.number_color_inputs <= 0){
        document.getElementById("envoi_palette").style.display = "none"
    }
}



async function addColor(){
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    index = 0

    const response = await fetch(`http://127.0.0.1:8000/palette_update/${index}?action=add`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken 
        }
    });

    if (!response.ok) {
        throw new Error('Erreur lors de la requête réseau');
    }else{
        const data = await response.json();
        const paletteContainer = document.querySelector('#palette_form div');

        paletteContainer.innerHTML += data.html;

        document.querySelectorAll(".input_couleur").forEach((element) => {

            document.querySelectorAll('.input_couleur').forEach((input) => {
                input.addEventListener('change', handleColorChange);
            });

            const event = new Event('change', { bubbles: true });
            element.dispatchEvent(event);
        })

        if(data.number_color_inputs >= 5){
            document.getElementById("add_color").style.display = "none"
        }
    
        if(data.number_color_inputs > 0){
            document.getElementById("envoi_palette").style.display = "block"
        }
    }
    
}