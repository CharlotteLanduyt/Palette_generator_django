function iaPaletteData() {
    return fetch('http://127.0.0.1:8000/ia_palette_choice')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        applyNewColors(data.palette)
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
        throw error;
    });
}

function rgbToHex(rgbArray) {
    const [r, g, b] = rgbArray;

    const hex = (x) => {
        const hexValue = x.toString(16);
        return hexValue.length === 1 ? '0' + hexValue : hexValue;
    };

    return `#${hex(r)}${hex(g)}${hex(b)}`;
}


function applyNewColors(palette){
    document.querySelectorAll(".input_couleur").forEach((element, index) => {
        element.value = rgbToHex(palette[index])

        const event = new Event('change', { bubbles: true });
        element.dispatchEvent(event);
    })
}


document.querySelectorAll(".tool").forEach((element) => {
    element.querySelector(".tool_open").addEventListener('click', () => {
        element.querySelector(".expand").classList.add("opened");
    });

    element.querySelector(".tool_close").addEventListener('click', () => {
        element.querySelector(".expand").classList.remove("opened");
    });
});
