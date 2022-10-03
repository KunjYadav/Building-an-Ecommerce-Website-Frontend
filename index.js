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
});


function addToCart(productId) {
    axios.post('http://localhost:3000/cart', {productId: productId})
        .then(response =>{
            if(response.status === 200) {
                notifyUsers(response.data.message);
            } else {
                throw new Error(response.data.message);
            }
        })
        .catch(errMsg => {
            console.log(errMsg);
            notifyUsers(errMsg);
        })
}


function getCartDetails() {
    axios.get('http://localhost:3000/cart')
        .then(response => {
            if(response.status === 200) {
                response.data.products.forEach(product => {
                    const cartContainer = document.getElementById('cart');
                //    cartContainer.innerHTML += `<li>${product.title} - ${product.price} - ${product.cartItem.quantity}</li>`
                })
                document.querySelector('#cart').style = "display:block;"
            } else {
                throw new Error('Something went wrong')
            }

            // console.log(response);
        })
        .catch(error => {
            notifyUsers(error);
        })
}

function notifyUsers(message) {
    const container = document.getElementById('container');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `<h4>${message}<h4>`;
    container.appendChild(notification);
    setTimeout(()=>{
        notification.remove();
    },2500)
}


document.addEventListener('click',(e)=>{

    if (e.target.className=='cart-btn-bottom' || e.target.className=='cart-bottom' || e.target.className=='cart-holder'){
        // const cartContainer = document.getElementById('cart');
        // cartContainer.innerHTML = ''
        getCartDetails();
        displayInCart();
        
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

    if (e.target.innerText=='REMOVE'){
        axios.post('http://localhost:3000/cart-delete-item',{'productId':event.target.parentNode.parentNode.id.substring(8)})
        .then(response=>{
        removeFromFrontendCart(e)
        notifyUser(response.data.message);  
        })
        .catch(errmsg=>{
        console.log(errmsg)
        })

    }
})

function showProductsInCart(listofproducts){
    cart_items.innerHTML = "";
    listofproducts.forEach(product => {
        const id = `album-${product.id}`;
        const name = document.querySelector(`#${id} h3`).innerText;
        const img_src = document.querySelector(`#${id} img`).src;
        const price = product.price;
        document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText)+1
        const cart_item = document.createElement('div');
        cart_item.classList.add('cart-row');
        cart_item.setAttribute('id',`in-cart-${id}`);
        cart_item.innerHTML = `
        <span class='cart-item cart-column'>
        <img class='cart-img' src="${img_src}" alt="">
            <span>${name}</span>
        </span>
        <span class='cart-price cart-column'>${price}</span>
        <form onsubmit='deleteCartItem(event, ${product.id})' class='cart-quantity cart-column'>
            <input type="text" value="1">
            <button>REMOVE</button>
        </form>`
        cart_items.appendChild(cart_item)
    })
}
function deleteCartItem(e, prodId){
    e.preventDefault();
    axios.post('http://localhost:3000/cart-delete-item', {productId: prodId})
        .then(() => removeElementFromCartDom(prodId))
}


// function removeElementFromCartDom(prodId){
//         document.getElementById(`in-cart-album-${prodId}`).remove();
//         showNotification('Succesfuly removed product')
// }

function removeFromFrontendCart(event){
    let total_cart_price = document.querySelector('#total-value').innerText;
    let item_price=document.querySelector(`#${event.target.parentNode.parentNode.id} .cart-price`).innerText;
    let item_quantity=event.target.parentNode.firstElementChild.value;

    total_cart_price = parseFloat(total_cart_price).toFixed(2) - (parseFloat(item_price).toFixed(2) * parseInt(item_quantity)) ;
    document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText)-1
    document.querySelector('#total-value').innerText = `${total_cart_price.toFixed(2)}`
    event.target.parentNode.parentNode.remove()
}

function displayInCart(queryParams=''){
    axios.get(`http://localhost:3000/cart/${queryParams}`)
    .then(response=>{
        const cart_items = document.querySelector('#cart .cart-items');
        cart_items.innerHTML='';
        response.data.products.forEach((prod)=>{
        const cart_item = document.createElement('div');
        cart_item.classList.add('cart-row');
        cart_item.setAttribute('id',`in-cart-${prod.id}`)
        cart_item.innerHTML = `
        <span class='cart-item cart-column'>
        <img class='cart-img' src="${prod.imageUrl}" alt="">
            <span>${prod.title}</span>
        </span>
        <span class='cart-price cart-column'>${prod.price}</span>
        <span class='cart-quantity cart-column'>
        <input type="text" value="${prod.cartItem.quantity}">
        <button>REMOVE</button>
        </span>`
        cart_items.appendChild(cart_item)

        })
        //for amount and no. of products in cart
        let totalAmount=0;
        let totalproducts=0;

        response.data.allProducts.forEach((prod)=>{
            totalAmount+=(parseFloat(prod.price)*parseFloat(prod.cartItem.quantity))
            totalproducts++;
        })

        pagination(response,document.getElementById('cartPagination'),'cart');
        document.querySelector('#cart').style = "display:block"
        document.querySelector('#total-value').innerText=totalAmount.toFixed(2);
        document.querySelector('.cart-number').innerText=totalproducts;


    })
    .catch(err=>{
        console.log(err)
    })
    
}  