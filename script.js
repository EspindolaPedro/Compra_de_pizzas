//div model have models that will be copied to show the pizzas using js


let cart = [];

//pop reset
let modalQt = 1;

let modalkey = 0;

const q = (el) => document.querySelector(el);
const qs = (el) => document.querySelectorAll(el);

/*List the pizzas: do a map in pizzaJson, having the item and index from item*/
pizzaJson.map((item, index)=> {
    /*clone using cloneNode(true) the structure model fill the info and show the data in the screen*/
    let pizzaItem = q('.models .pizza-item').cloneNode(true);

    /*The data-key contains all the pizzas information*/
    pizzaItem.setAttribute('data-key', index);

    /*1º taking the information from json array*/
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;

    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;

    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;

    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    /*show the popup and preventDefault*/
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault()
        /*Closest function will look for the closest element around ('a') which must contain '.pizza-item' and on click get the attribute data-key */
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalkey = key;

        /*Fiiling the popup informations */
        q('.pizzaBig img').src = pizzaJson[key].img
        q('.pizzaInfo h1').innerHTML = pizzaJson[key].name ;
        q('.pizzaInfo .pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        q('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

        q('.pizzaInfo--size.selected').classList.remove('selected');
        qs('.pizzaInfo--size').forEach((size, sizeIndex) => {    
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        /*it shows the quantity ordered incremented on screen */
        q('.pizzaInfo--qt').innerHTML = modalQt;


        /*animation to open the popup*/
        q('.pizzaWindowArea').style.opacity = 0;
        q('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{ 
                   q('.pizzaWindowArea').style.opacity = 1;},300);});



    /*Fill the pizzaItem info */
    q('.pizza-area').append(pizzaItem);
});

// Popup Event
 function closePopup() {
    q('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=> {
        q('.pizzaWindowArea').style.display = 'none';
          }, 500);
    
 }
qs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=> item.addEventListener('click', closePopup));

//increment and decrement function
q('.pizzaInfo--qtmenos').addEventListener('click',()=>{
    modalQt--;
    if(modalQt <= 1) {
        modalQt = 1}
    q('.pizzaInfo--qt').innerHTML = modalQt;
});
q('.pizzaInfo--qtmais').addEventListener('click',()=>{
    modalQt++;
    q('.pizzaInfo--qt').innerHTML = modalQt;
});

//removing the selected item and change to the item clicked 
qs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', ()=>{
        q('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

//Add to cart
q('.pizzaInfo--addButton').addEventListener('click',()=>{
    //Logic to add to cart: We need to know which pizza is selected?; What is the size selected?; How many pizzas selected?
    let size = parseInt(q('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalkey].id+'@'+size;

    let key = cart.findIndex((item)=> item.identifier == identifier);

    if(key > -1) {
        cart[key].qt += modalQt;
    }else {
        cart.push({
            identifier,
            id:pizzaJson[modalkey].id,
            size,
            qt:modalQt
        });
    }
    updateCart();
   closePopup();
});

q('.menu-openner').addEventListener('click',()=>{
    if(cart.length > 0) {
        q('aside').style.left = '0';
        
    } 
})
q('.menu-closer').addEventListener('click',()=>{
    q('aside').style.left = '100vw'
})

function updateCart() {
    q('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        q('aside').classList.add('show');
        q('.cart').innerHTML = ''; //zera a lista

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);

            subtotal += pizzaItem.price * cart[i].qt

            let cartItem = q('.models .cart-item').cloneNode(true);

            let pizzaSizeName;
            switch (cart[i].size) {
                case 0: pizzaSizeName = 'P'
                    break;
                case 1: pizzaSizeName = 'M';
                    break;
                case 2: pizzaSizeName = 'G';
                    break;
                     
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName});`

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart-item--name').innerHTML = pizzaName;
            cartItem.querySelector('.cart-item--qt').innerHTML = cart[i].qt
            q('.cart').append(cartItem);
            cartItem.querySelector('.cart-item-qtmenos').addEventListener('click',()=> {
               if(cart[i].qt > 1) {
                cart[i].qt--
               } else {
                cart.splice(i, 1); //Close the cart when there are no pizzas added
               }
                updateCart();
            });
            cartItem.querySelector('.cart-item-qtmais').addEventListener('click',()=> {
                cart[i].qt++
                updateCart();
            });

        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        q('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        q('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        q('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`


    } else {
        q('aside').classList.remove('show')
        q('aside').style.left = '100vw'
    }
};