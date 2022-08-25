const cartItemUpdateFormEls =
    document.querySelectorAll('.cart-item-management');
const cartTotalPriceEl =
    document.getElementById('cart-total-price');
const cartBadgeEls =
    document.querySelectorAll('.nav-items .cart-badge');

for (const formElement of cartItemUpdateFormEls) {
    formElement.addEventListener('submit', async (event) => {
        event.preventDefault();

        const form = event.target;
        const productId = form.dataset.productid;
        const csrfToken = form.dataset.csrftoken;
        const itemQuantity = form.firstElementChild.value;

        let response;
        try {
            response = await fetch('/cart/items', {
                method: 'PATCH',
                body: JSON.stringify({
                    productId: productId,
                    quantity: itemQuantity,
                    _csrf: csrfToken,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            return alert('Something went wrong!');
        }

        if (!response.ok) {
            return alert('Something went wrong!');
        }

        const responseData = await response.json();

        if (responseData.updatedCartData.updatedItemPrice === 0) {
            form.parentElement.parentElement.remove();
        }

        const cartItemTotalPriceEl =
            form.parentElement.querySelector('.cart-item-price');
        cartItemTotalPriceEl.textContent = responseData
            .updatedCartData
            .updatedItemPrice
            .toFixed(2);

        cartTotalPriceEl.textContent = responseData
            .updatedCartData
            .newTotalPrice
            .toFixed(2);

        for (const badgeEl of cartBadgeEls) {
            badgeEl.textContent = responseData
                .updatedCartData
                .newTotalQuantity;
        }
    });
}
