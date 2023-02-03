var imageBubble = document.getElementById("image-bubble")
var image = document.getElementById("id_image")
image.addEventListener('change', () => {
    const img_data = image.files[0]
    const url = URL.createObjectURL(img_data)
    imageBubble.src = url
})