import { menuArray } from './data.js'
import { orderArray } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

// Seleciona elementos do DOM
const menu = document.getElementById("menu")
const order = document.getElementById("order")

const modal = document.getElementById("modal")
const modalOverlay = document.getElementById("modal-overlay")

const paymentForm = document.getElementById("payment-form")

// Adiciona eventos
document.addEventListener("click", function (e) {
    if (e.target.id === "add-btn" && e.target.dataset.menuItemId) {
        handleAddBtnClick(e.target.dataset.menuItemId)
    }
    else if (e.target.dataset.removeItemId) {
        handleRemoveItemClick(e.target.dataset.removeItemId)
    }
    else if (e.target.id === "complete-order-btn") {
        openModal()
    }
    else if (e.target.id === "modal-overlay") {
        closeModal()
    }
})

paymentForm.addEventListener("submit", handlePayment)

// Manipula clique no botão de adicionar
function handleAddBtnClick(menuItemId) {
    const menuItem = getMenuItem(menuItemId)
    const orderItem = getOrderItem(menuItemId)

    if (!orderItem) {
        orderArray.unshift({
            id: uuidv4(),
            menuItemId: Number(menuItemId),
            name: menuItem.name,
            quantity: 1,
            price: menuItem.price
        })
    }
    else {
        orderItem.quantity++
    }

    renderOrders()
}

// Obtém item do menu
function getMenuItem(id) {
    return menuArray.filter(function (item) {
        return item.id === Number(id)
    })[0]
}

// Obtém item do pedido
function getOrderItem(menuItemId) {
    return orderArray.filter(function (item) {
        return item.menuItemId === Number(menuItemId)
    })[0]
}

// Manipula clique para remover item
function handleRemoveItemClick(orderItemId) {
    const deleteOrderItemIndex = orderArray.map(function (orderItem) {
        return orderItem.id
    }).indexOf(orderItemId)

    const orderItem = orderArray[deleteOrderItemIndex]

    if (orderItem.quantity > 1) {
        orderItem.quantity--
    }
    else {
        orderArray.splice(deleteOrderItemIndex, 1)
    }

    renderOrders()
}

// Abre o modal
function openModal() {
    modal.style.display = "block";
    modalOverlay.classList.add("modal-active")
}

// Fecha o modal
function closeModal() {
    modal.style.display = "none"
    modalOverlay.classList.remove("modal-active")
}

// Manipula o pagamento
function handlePayment(e) {
    e.preventDefault()
    closeModal()
    clearOrders()

    const paymentFormData = new FormData(paymentForm)

    document.getElementById("order").innerHTML = `
    <p class="order-completed-text">Obrigado, ${paymentFormData.get("fullName")}. Seu pedido está a caminho!</p>
  `
}

// Limpa os pedidos
function clearOrders() {
    orderArray.length = 0;
}

// Renderiza o menu
function renderMenu() {
    let menuDom = ""

    for (let menuItem of menuArray) {
        menuDom += `
      <div class="menu-item">
        <div class="menu-item-img-container">
            <img src="${menuItem.imgPath}" alt="">
        </div>
        <div>
            <h4 class="menu-item-name">${menuItem.name}</h4>
            <p class="menu-item-description">${menuItem.ingredients.join(", ")}</p>
            <p class="menu-item-price">$${menuItem.price}</p>
        </div>
        <div class="align-right">
            <button class="add-btn" id="add-btn" data-menu-item-id="${menuItem.id}">+</button>
        </div>
      </div>    
    `
    }

    menu.innerHTML = menuDom;
}

// Renderiza os pedidos
function renderOrders() {
    let orderDom = "";
    let totalPrice = 0;

    orderDom += `
    <h2 class="text-align-center">Seu Pedido</h2>
    <div id="ordered-items">
  `

    orderArray.forEach(function (menuItem, index, array) {
        orderDom += `
      <div class="ordered-item ${index === array.length - 1 ? "padding-bottom-20 border-bottom-dark" : ""}">
        <h4 class="ordered-item-name">${menuItem.name}${menuItem.quantity > 1 ? ` x${menuItem.quantity}` : ""}</h4>
        <p class="ordered-item-remove" data-remove-item-id="${menuItem.id}">remover</p>
        <p class="ordered-item-price align-right">$${menuItem.price * menuItem.quantity}</p>
      </div>  
    `
        totalPrice += (menuItem.price * menuItem.quantity)
    })

    orderDom += `
    </div>
      <div class="order-total-price-container">
      <h2 class="order-total-price-label">Preço Total: </h2>
      <p class="order-total-price align-right" id="order-total-price">$${totalPrice}</p>
    </div>
    <button class="complete-order-btn" id="complete-order-btn">Completar pedido</button>   
  `

    order.innerHTML = totalPrice > 0 ? orderDom : ""
}

renderMenu()
