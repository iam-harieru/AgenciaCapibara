const celulares = [
  {
    nome: "iPhone 15",
    preco: "R$ 5.999",
    imagem: "imgs/Iphone15.webp"
  },
  {
    nome: "Galaxy S24",
    preco: "R$ 4.299",
    imagem: "imgs/S24.jpg"
  },
  {
    nome: "Moto G84",
    preco: "R$ 1.899",
    imagem: "imgs/Moto G84.webp"
  },
  {
    nome: "Redmi Note 13",
    preco: "R$ 1.499",
    imagem: "imgs/Redmi Note 13.webp"
  },
  {
    nome: "iPhone 14",
    preco: "R$ 4.799",
    imagem: "imgs/iPhone 14.jpg"
  },
  {
    nome: "Galaxy A55",
    preco: "R$ 2.299",
    imagem: "imgs/Galaxy A55.webp"
  }
];

const productsGrid = document.getElementById("productsGrid");

function renderProducts(lista) {
  productsGrid.innerHTML = "";

  lista.forEach(produto => {
    productsGrid.innerHTML += `
      <div class="card">
        <img src="${produto.imagem}" alt="${produto.nome}">
        <h3>${produto.nome}</h3>
        <p class="price">${produto.preco}</p>
        <button>Comprar</button>
      </div>
    `;
  });
}

renderProducts(celulares);

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
  const valor = searchInput.value.toLowerCase();

  const filtrados = celulares.filter(produto =>
    produto.nome.toLowerCase().includes(valor)
  );

  renderProducts(filtrados);
});