const addToCartButtonEl =
    document.querySelector('#products-details button');
const cartBadgeEls =
    document.querySelectorAll('.nav-items .cart-badge');

 addToCartButtonEl.addEventListener('click',async (event) => {
    let response;
     try {
         response = await fetch('/cart/items', {
             method: 'POST',
             body: JSON.stringify({
                 productId: addToCartButtonEl.dataset.productid,
                 _csrf: addToCartButtonEl.dataset.csrftoken,
             }),
             headers: {
                 'Content-Type': 'application/json'
             }},
         );
     } catch (error) {
         return alert('Something went wrong!');
     }

    if (!response.ok) {
        return alert('Something went wrong!');
    }

    const responseData = await response.json();
    for (const badgeEl of cartBadgeEls) {
        badgeEl.textContent = responseData.newItemTotal;
    }
})
