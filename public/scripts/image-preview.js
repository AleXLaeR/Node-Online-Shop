const imagePickerEl = document.getElementById('image');
const imagePreviewEl = document.getElementById('preview-image');
const resetButtonEl = document.querySelector(
    '#control-btns button[type=reset]'
);

imagePickerEl.addEventListener('change', () => {
    const files = imagePickerEl.files;
    if (!files) {
        imagePreviewEl.style.display = 'none';
        return;
    }
    imagePreviewEl.src = URL.createObjectURL(files[0]);
    imagePreviewEl.style.display = 'block';
});

resetButtonEl.addEventListener('click', () => {
    imagePreviewEl.style.display = 'none';
})
