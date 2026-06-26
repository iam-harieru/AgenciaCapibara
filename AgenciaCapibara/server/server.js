const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const frontendPath = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendPath));
app.use(express.static(__dirname));

const produtosPath = path.join(__dirname, "produtos", "produtos.json");
const pedidosPath = path.join(__dirname, "pedidos", "pedidos.json");

function carregarProdutos() {
 const dados = fs.readFileSync(produtosPath, "utf8");
 return JSON.parse(dados);
}

function carregarPedidos() {
 if (!fs.existsSync(pedidosPath)) {
   return [];
 }

 const dados = fs.readFileSync(pedidosPath, "utf8");
 return JSON.parse(dados);
}

function salvarPedidos(pedidos) {
 fs.writeFileSync(pedidosPath, JSON.stringify(pedidos, null, 2), "utf8");
}

app.get("/api/produtos", (req, res) => {
 const produtos = carregarProdutos();
 res.json(produtos);
});

app.get("/api/produtos/:id", (req, res) => {

 const produtos = carregarProdutos();

 const produto = produtos.find(
    p => p.idProduto == req.params.id
  );

  if (!produto) {
    return res.status(404).json({
      mensagem: "Produto não encontrado"
});
  }

  res.json(produto);

});

app.get("/api/pedidos", (req, res) => {
  const pedidos = carregarPedidos();
  res.json(pedidos);
});

app.post("/api/pedidos", (req, res) => {
  const { items, total, customer } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      mensagem: "Carrinho inválido. Envie pelo menos um item."
    });
  }

  const novoPedido = {
    id: Date.now(),
    items,
    total: typeof total === "number" ? total : items.reduce((sum, item) => sum + (item.precoValor || 0) * (item.quantidade || 1), 0),
    customer: customer || {},
    dataCriacao: new Date().toISOString(),
    status: "recebido"
  };

  const pedidos = carregarPedidos();
  pedidos.push(novoPedido);
  salvarPedidos(pedidos);

  res.status(201).json({
    mensagem: "Pedido criado com sucesso",
    pedidoId: novoPedido.id
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando:");
 console.log("http://localhost:3000");
});
