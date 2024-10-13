function toggleHeight(elementId) {
    const element = document.getElementById(elementId);
    
    if (element.style.height === '30vh') {
        element.style.height = '0';
    } else {
        element.style.height = '30vh';
    }
}