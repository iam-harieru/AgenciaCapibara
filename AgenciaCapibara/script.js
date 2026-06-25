const celulares = [
  {
    id: "iphone-15",
    nome: "iPhone 15",
    preco: "R$ 5.999",
    precoValor: 5999,
    imagem: "imgs/Iphone15.webp",
    pagina: "produtos/iphone-15.html",
    descricao: "Potência premium com câmera avançada e tela brilhante."
  },
  {
    id: "galaxy-s24",
    nome: "Galaxy S24",
    preco: "R$ 4.299",
    precoValor: 4299,
    imagem: "imgs/S24.jpg",
    pagina: "produtos/galaxy-s24.html",
    descricao: "Design elegante e excelente desempenho para quem quer tudo."
  },
  {
    id: "moto-g84",
    nome: "Moto G84",
    preco: "R$ 1.899",
    precoValor: 1899,
    imagem: "imgs/Moto G84.webp",
    pagina: "produtos/moto-g84.html",
    descricao: "Ótima relação custo-benefício para uso diário e multimídia."
  },
  {
    id: "redmi-note-13",
    nome: "Redmi Note 13",
    preco: "R$ 1.499",
    precoValor: 1499,
    imagem: "imgs/Redmi Note 13.webp",
    pagina: "produtos/redmi-note-13.html",
    descricao: "Leve, rápido e prático para estudar, trabalhar e se divertir."
  },
  {
    id: "iphone-14",
    nome: "iPhone 14",
    preco: "R$ 4.799",
    precoValor: 4799,
    imagem: "imgs/iPhone 14.jpg",
    pagina: "produtos/iphone-14.html",
    descricao: "Excelente câmera, acabamento premium e desempenho confiável."
  },
  {
    id: "galaxy-a55",
    nome: "Galaxy A55",
    preco: "R$ 2.299",
    precoValor: 2299,
    imagem: "imgs/Galaxy A55.webp",
    pagina: "produtos/galaxy-a55.html",
    descricao: "Modelo equilibrado com boas câmeras e ótima tela."
  }
];

const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const cartButton = document.getElementById("cartButton");
const closeCartButton = document.getElementById("closeCartButton");
const cartOverlay = document.getElementById("cartOverlay");
const cartPanel = document.getElementById("cartPanel");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const currentPage = window.location.pathname.split("/").pop();

let cart = JSON.parse(localStorage.getItem("capibaraCart") || "[]");

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

function resolveImagePath(path) {
  return currentPage.includes("produtos") ? `../${path}` : path;
}

function saveCart() {
  localStorage.setItem("capibaraCart", JSON.stringify(cart));
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantidade, 0);
  cartCount.textContent = totalItems;

  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Seu carrinho está vazio.</p>';
    cartTotal.textContent = formatCurrency(0);
    return;
  }

  cartItemsContainer.innerHTML = cart
    .map(item => `
      <div class="cart-item">
        <img src="${resolveImagePath(item.imagem)}" alt="${item.nome}">
        <div class="cart-item-info">
          <h4>${item.nome}</h4>
          <p>${formatCurrency(item.precoValor)}</p>
          <div class="cart-item-actions">
            <button type="button" class="qty-btn" data-action="decrease" data-id="${item.id}">−</button>
            <span>${item.quantidade}</span>
            <button type="button" class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>
    `)
    .join("");

  const total = cart.reduce((sum, item) => sum + item.precoValor * item.quantidade, 0);
  cartTotal.textContent = formatCurrency(total);
}

function addToCart(productId) {
  const produto = celulares.find(item => item.id === productId);
  if (!produto) return;

  const existingItem = cart.find(item => item.id === produto.id);

  if (existingItem) {
    existingItem.quantidade += 1;
  } else {
    cart.push({ ...produto, quantidade: 1 });
  }

  saveCart();
  updateCartUI();
  openCart();
}

function openCart() {
  if (!cartPanel) return;
  cartPanel.classList.add("open");
  cartOverlay?.classList.add("open");
}

function closeCart() {
  if (!cartPanel) return;
  cartPanel.classList.remove("open");
  cartOverlay?.classList.remove("open");
}

function renderProducts(lista) {
  if (!productsGrid) return;

  productsGrid.innerHTML = "";

  lista.forEach(produto => {
    productsGrid.innerHTML += `
      <div class="card">
        <img src="${resolveImagePath(produto.imagem)}" alt="${produto.nome}">
        <h3>${produto.nome}</h3>
        <p class="price">${produto.preco}</p>
        <div class="card-actions">
          <a class="card-button" href="${produto.pagina}">Ver características</a>
          <button class="card-button secondary" data-product-id="${produto.id}" type="button">Adicionar</button>
        </div>
      </div>
    `;
  });

  document.querySelectorAll("[data-product-id]").forEach(button => {
    button.addEventListener("click", () => addToCart(button.getAttribute("data-product-id")));
  });
}

if (productsGrid) {
  renderProducts(celulares);
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const valor = searchInput.value.toLowerCase();

    const filtrados = celulares.filter(produto =>
      produto.nome.toLowerCase().includes(valor)
    );

    renderProducts(filtrados);
  });
}

if (cartButton) {
  cartButton.addEventListener("click", openCart);
}

if (closeCartButton) {
  closeCartButton.addEventListener("click", closeCart);
}

if (cartOverlay) {
  cartOverlay.addEventListener("click", closeCart);
}

if (cartItemsContainer) {
  cartItemsContainer.addEventListener("click", (event) => {
    const button = event.target.closest(".qty-btn");
    if (!button) return;

    const id = button.getAttribute("data-id");
    const action = button.getAttribute("data-action");
    const item = cart.find(product => product.id === id);

    if (!item) return;

    if (action === "increase") {
      item.quantidade += 1;
    } else if (action === "decrease") {
      item.quantidade -= 1;
      if (item.quantidade <= 0) {
        cart = cart.filter(product => product.id !== id);
      }
    }

    saveCart();
    updateCartUI();
  });
}

const detailButton = document.getElementById("detailAddToCart");
if (detailButton) {
  const currentProduct = celulares.find(item => item.pagina.endsWith(currentPage));
  if (currentProduct) {
    detailButton.addEventListener("click", () => addToCart(currentProduct.id));
  }
}

updateCartUI();

// Slides: unifica controles manuais e autoplay
let slideIndex = 1;
let slideInterval = null;
const SLIDE_DELAY = 3000; // ms

function getSlides() {
  return document.getElementsByClassName("mySlides");
}

function getDots() {
  return document.getElementsByClassName("dot");
}

function showSlides(n) {
  const slides = getSlides();
  const dots = getDots();
  if (!slides || slides.length === 0) return;

  if (typeof n === "number") slideIndex = n;

  if (slideIndex > slides.length) slideIndex = 1;
  if (slideIndex < 1) slideIndex = slides.length;

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex - 1].style.display = "block";
  if (dots[slideIndex - 1]) dots[slideIndex - 1].className += " active";
}

function plusSlides(n) {
  slideIndex += n;
  showSlides(slideIndex);
  resetSlideInterval();
}

function currentSlide(n) {
  slideIndex = n;
  showSlides(slideIndex);
  resetSlideInterval();
}

function startSlideInterval() {
  stopSlideInterval();
  slideInterval = setInterval(() => {
    slideIndex++;
    showSlides(slideIndex);
  }, SLIDE_DELAY);
}

function stopSlideInterval() {
  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = null;
  }
}

function resetSlideInterval() {
  startSlideInterval();
}

// inicia quando DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  showSlides(slideIndex);
  startSlideInterval();
});
