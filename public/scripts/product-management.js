const deleteProductButtonEls =
    document.querySelectorAll('.product-item button');

for (const button of deleteProductButtonEls) {
    button.addEventListener('click',async (event) => {
        const productId = event.target.dataset.productid;
        const csrfToken = event.target.dataset.csrftoken;

        const response = await fetch(
            `/admin/products/${productId}?_csrf=${csrfToken}`,
            { method: 'DELETE' }
        );

        if (!response.ok) {
            return alert('Something went wrong');
        }
        button
            .closest('.product-item')
            .parentElement
            .remove();
    })
}
