const cart_items = document.querySelector('#cart .cart-items');


window.addEventListener('DOMContentLoaded', () => {
    console.log('data');

    axios.get('http://localhost:3000/products').then((data) => {
        console.log(data);
        if(data.request.status === 200) {
            const products = data.data.products;
            const parentSection = document.getElementById('Products');
            products.forEach(product => {
                const productHtml = `
                <div id="album-${product.id}">
                    <h3>${product.title}</h3>
                    <div class="image-container">
                        <img class="prod-images" src=${product.imageUrl} alt="">
                    </div>
                        <div class="prod-details">
                        <span>$<span>${product.price}</span></span>
                    <button onClick="addToCart(${product.id})"> Add To Cart </button>
                    </div>
                    
                </div>`
                parentSection.innerHTML += productHtml;
            })
        }
        // products.data.forEach(product => {
        //     const productHtml = `
        //         <div id="album-${product.id}">
        //             <h3>${product.title}</h3>
        //             <div class="image-container">
        //                 <img class="prod-images" src=${product.imageUrl} alt="">
        //             </div>
        //                             <div class="prod-details">
        //                 <span>$<span>${product.price}</span></span>
        //                 <button class="shop-item-button" type='button'>ADD TO CART</button>
        //             </div>
        //         </div>`
        //     parentNode.innerHTML += productHtml

        // })
    })

})


document.addEventListener('click',(e)=>{

    if (e.target.className=='cart-btn-bottom' || e.target.className=='cart-bottom' || e.target.className=='cart-holder'){
        axios.get('http://localhost:3000/cart').then(carProducts => {
            showProductsInCart(carProducts.data);
            document.querySelector('#cart').style = "display:block;"

        })
    }
    if (e.target.className=='cancel'){
        document.querySelector('#cart').style = "display:none;"
    }
    if (e.target.className=='purchase-btn'){
        if (parseInt(document.querySelector('.cart-number').innerText) === 0){
            alert('You have Nothing in Cart , Add some products to purchase !');
            return
        }
        alert('This Feature is yet to be completed ')
    }
})


function deleteCartItem(e, prodId){
    e.preventDefault();
    axios.post('http://localhost:3000/cart-delete-item', {productId: prodId})
        .then(() => removeElementFromCartDom(prodId))
}


function removeElementFromCartDom(prodId){
        document.getElementById(`in-cart-album-${prodId}`).remove();
        showNotification('Succesfuly removed product')
}