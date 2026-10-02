const products = [
 {id:1,name:"Classic Milk Tea",cat:"milk",price:2.50,image:"images/classic-milk-tea.jpg",description:"Rich, creamy milk tea with chewy boba pearls and a smooth tea finish.",ingredients:["Black tea","Fresh milk","Brown sugar","Boba pearls"],sizes:[["Regular",0],["Large",0.7]]},
 {id:2,name:"Brown Sugar Milk Tea",cat:"boba",price:3.00,image:"images/classic-milk-tea.jpg",description:"Creamy milk tea layered with caramel-like brown sugar and boba pearls.",ingredients:["Milk tea","Brown sugar","Tapioca pearls","Cream"],sizes:[["Regular",0],["Large",0.7]]},
 {id:3,name:"Taro Milk Tea",cat:"milk",price:2.80,image:"images/taro-milk-tea.jpg",description:"Smooth and creamy taro drink with a gentle sweet flavor and boba.",ingredients:["Taro","Milk","Tea","Boba pearls"],sizes:[["Regular",0],["Large",0.7]]},
 {id:4,name:"Mango Fruit Tea",cat:"fruit",price:3.50,image:"images/mango-fruit-tea.jpg",description:"Bright tropical mango tea made for a fresh, fruity sip.",ingredients:["Mango","Fruit tea","Ice","Jelly"],sizes:[["Regular",0],["Large",0.7]]},
 {id:5,name:"Strawberry Fruit Tea",cat:"fruit",price:3.50,image:"images/strawberry-fruit-tea.jpg",description:"Sweet and refreshing strawberry fruit tea with a vibrant finish.",ingredients:["Strawberry","Fruit tea","Ice","Fruit jelly"],sizes:[["Regular",0],["Large",0.7]]},
 {id:6,name:"Matcha Milk Tea",cat:"milk",price:3.20,image:"images/matcha-milk-tea.jpg",description:"Premium matcha blended with milk for an earthy, creamy cup.",ingredients:["Matcha","Milk","Brown sugar","Boba pearls"],sizes:[["Regular",0],["Large",0.7]]},
 {id:7,name:"Oreo Milk Tea",cat:"special",price:3.50,image:"images/oreo-milk-tea.jpg",description:"Creamy milk tea topped with crushed chocolate cookies and boba.",ingredients:["Milk tea","Oreo","Cream","Boba pearls"],sizes:[["Regular",0],["Large",0.7]]},
 {id:8,name:"Peach Fruit Tea",cat:"fruit",price:3.50,image:"images/mango-fruit-tea.jpg",description:"Fresh peach-inspired fruit tea with a clean and refreshing taste.",ingredients:["Peach","Fruit tea","Ice","Fruit jelly"],sizes:[["Regular",0],["Large",0.7]]},
 {id:9,name:"Blueberry Fruit Tea",cat:"fruit",price:3.50,image:"images/strawberry-fruit-tea.jpg",description:"Fruity blueberry tea with a cool, refreshing finish.",ingredients:["Blueberry","Fruit tea","Ice","Jelly"],sizes:[["Regular",0],["Large",0.7]]},
 {id:10,name:"Chocolate Milk Tea",cat:"special",price:3.20,image:"images/signature-milk-tea.jpg",description:"Chocolate-forward milk tea for a rich, dessert-style sip.",ingredients:["Chocolate","Milk","Tea","Boba pearls"],sizes:[["Regular",0],["Large",0.7]]}
];

let cart = JSON.parse(localStorage.getItem("sipTeaCart") || "[]");
let currentProduct = null, detailQty = 1, currentSize = 0;
const $ = s => document.querySelector(s);

function money(n){return `$${n.toFixed(2)}`}
function saveCart(){localStorage.setItem("sipTeaCart",JSON.stringify(cart)); renderCart(); updateCount();}
function updateCount(){$("#cartCount").textContent=cart.reduce((s,i)=>s+i.qty,0)}
function renderProducts(filter="all"){
 const list=filter==="all"?products:products.filter(p=>p.cat===filter);
 $("#productGrid").innerHTML=list.map(p=>`
 <article class="product-card" data-id="${p.id}">
   <img src="${p.image}" alt="${p.name}">
   <div class="product-body">
    <h3>${p.name}</h3><p>${p.description}</p>
    <div class="product-foot"><b class="product-price">${money(p.price)}</b><button class="plus" aria-label="View ${p.name}">+</button></div>
   </div>
 </article>`).join("");
 document.querySelectorAll(".product-card").forEach(card=>card.addEventListener("click",()=>openDetails(Number(card.dataset.id))));
}
function setFilter(filter){
 document.querySelectorAll(".filters button").forEach(b=>b.classList.toggle("active",b.dataset.filter===filter));
 renderProducts(filter);
}
document.querySelectorAll(".filters button").forEach(b=>b.addEventListener("click",()=>setFilter(b.dataset.filter)));
document.querySelectorAll(".categories button").forEach(b=>b.addEventListener("click",()=>{setFilter(b.dataset.filter);location.hash="menu"}));

function openDetails(id){
 currentProduct=products.find(p=>p.id===id); detailQty=1; currentSize=0;
 $("#detailImage").src=currentProduct.image; $("#detailImage").alt=currentProduct.name;
 $("#detailName").textContent=currentProduct.name; $("#detailPrice").textContent=money(currentProduct.price);
 $("#detailDescription").textContent=currentProduct.description; $("#detailQty").textContent=detailQty;
 $("#detailIngredients").innerHTML=currentProduct.ingredients.map(x=>`<span class="ingredient">${x}</span>`).join("");
 $("#sizeOptions").innerHTML=currentProduct.sizes.map((s,i)=>`<button class="size ${i===0?"active":""}" data-size="${i}">${s[0]}${s[1]?` +${money(s[1])}`:""}</button>`).join("");
 document.querySelectorAll(".size").forEach(b=>b.addEventListener("click",()=>{currentSize=Number(b.dataset.size);document.querySelectorAll(".size").forEach(x=>x.classList.remove("active"));b.classList.add("active");updateDetailPrice()}));
 updateDetailPrice(); $("#detailsBackdrop").classList.add("open"); document.body.style.overflow="hidden";
}
function updateDetailPrice(){if(!currentProduct)return;$("#detailPrice").textContent=money(currentProduct.price+currentProduct.sizes[currentSize][1])}
function closeDetails(){$("#detailsBackdrop").classList.remove("open");document.body.style.overflow=""}
$("#closeDetails").addEventListener("click",closeDetails);
$("#detailsBackdrop").addEventListener("click",e=>{if(e.target.id==="detailsBackdrop")closeDetails()});
$("#qtyMinus").addEventListener("click",()=>{detailQty=Math.max(1,detailQty-1);$("#detailQty").textContent=detailQty});
$("#qtyPlus").addEventListener("click",()=>{detailQty++;$("#detailQty").textContent=detailQty});
$("#addDetail").addEventListener("click",()=>{
 const sizeName=currentProduct.sizes[currentSize][0], sizeExtra=currentProduct.sizes[currentSize][1];
 const key=`${currentProduct.id}-${currentSize}`;
 const existing=cart.find(i=>i.key===key);
 if(existing) existing.qty+=detailQty;
 else cart.push({key,id:currentProduct.id,qty:detailQty,size:sizeName,price:currentProduct.price+sizeExtra,image:currentProduct.image,name:currentProduct.name});
 saveCart(); closeDetails(); openCart();
});

function renderCart(){
 const box=$("#cartItems"), empty=$("#cartEmpty");
 if(!cart.length){box.innerHTML="";empty.classList.add("show");$("#cartTotal").textContent="$0.00";return}
 empty.classList.remove("show");
 box.innerHTML=cart.map(i=>`<div class="cart-item">
 <img src="${i.image}" alt="${i.name}"><div><h4>${i.name}</h4><small>${i.size} · Qty ${i.qty}</small><br><small>${money(i.price*i.qty)}</small></div>
 <button class="remove" data-key="${i.key}">Remove</button></div>`).join("");
 document.querySelectorAll(".remove").forEach(b=>b.addEventListener("click",()=>{cart=cart.filter(i=>i.key!==b.dataset.key);saveCart()}));
 $("#cartTotal").textContent=money(cart.reduce((s,i)=>s+i.price*i.qty,0));
}
function openCart(){$("#cartBackdrop").classList.add("open");renderCart();document.body.style.overflow="hidden"}
function closeCart(){$("#cartBackdrop").classList.remove("open");document.body.style.overflow=""}
$("#openCart").addEventListener("click",openCart);$("#closeCart").addEventListener("click",closeCart);
$("#cartBackdrop").addEventListener("click",e=>{if(e.target.id==="cartBackdrop")closeCart()});
$("#clearCart").addEventListener("click",()=>{cart=[];saveCart()});

function wa(){
 const text=cart.length?`Hello SIP TEA! I'd like to order:\n\n${cart.map(i=>`• ${i.name} (${i.size}) x${i.qty} — ${money(i.price*i.qty)}`).join("\n")}\n\nTotal: ${money(cart.reduce((s,i)=>s+i.price*i.qty,0))}`:`Hello SIP TEA! I'd like to ask about your drinks/menu.`;
 window.open("https://wa.me/252639319059?text="+encodeURIComponent(text),"_blank");
}
$("#headerWa").addEventListener("click",wa);$("#heroWa").addEventListener("click",wa);$("#visitWa").addEventListener("click",wa);$("#whatsappOrder").addEventListener("click",wa);

$("#mobileMenu").addEventListener("click",()=>$("#mobileNav").classList.toggle("open"));
document.querySelectorAll(".mobile-nav a").forEach(a=>a.addEventListener("click",()=>$("#mobileNav").classList.remove("open")));
$("#themeBtn").addEventListener("click",()=>document.body.classList.toggle("light-dark"));

window.addEventListener("load",()=>setTimeout(()=>$("#loader").classList.add("hide"),850));
renderProducts();renderCart();updateCount();
