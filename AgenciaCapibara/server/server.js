const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));

const produtosPath = path.join(__dirname, "produtos", "produtos.json");

function carregarProdutos() {
 const dados = fs.readFileSync(produtosPath, "utf8");
 return JSON.parse(dados);
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

app.listen(3000, () => {
  console.log("Servidor rodando:");
 console.log("http://localhost:3000");
});
