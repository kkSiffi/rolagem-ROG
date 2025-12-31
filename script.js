let usuarioAtual = null;

const listaAtributos = [
  "Acrobacia", "Briga", "Charme", "Corte Rápido", "Duro na Queda",
  "Encontrar", "Esconder", "Escola", "Esperteza", "Estilo",
  "Força", "Habilidade", "Intuição", "Malandragem", "Medicina",
  "Piloto de Fuga", "Pilantragem", "Poder", "Sabixão", "Sorte", "Tiro"
].sort();

function login() {
  const user = usuario.value.trim();
  const pass = senha.value;

  if (!user || !pass) return alert("Preencha tudo");

  let dados = JSON.parse(localStorage.getItem("usuarios")) || {};
  if (!dados[user]) {
    dados[user] = { senha: pass };
    localStorage.setItem("usuarios", JSON.stringify(dados));

    const ficha = {
      vidaAtual: 10, vidaMax: 10,
      sanAtual: 30, sanMax: 30,
      atributos: {},
      foto: null
    };
    listaAtributos.forEach(a => ficha.atributos[a] = 0);
    localStorage.setItem("ficha_" + user, JSON.stringify(ficha));
  } else if (dados[user].senha !== pass) {
    return alert("Senha incorreta");
  }

  usuarioAtual = user;
  loginDiv().classList.add("hidden");
  appDiv().classList.remove("hidden");
  carregarFicha();
}

function carregarFicha() {
  const ficha = JSON.parse(localStorage.getItem("ficha_" + usuarioAtual));

  nomePersonagem.textContent = usuarioAtual;

  fotoPerfil.src = ficha.foto || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

  vidaAtual.value = ficha.vidaAtual;
  vidaMax.value = ficha.vidaMax;
  sanAtual.value = ficha.sanAtual;
  sanMax.value = ficha.sanMax;

  atualizarBarra("vida");
  atualizarBarra("san");

  atributos.innerHTML = "";
  listaAtributos.forEach(nome => {
    const div = document.createElement("div");
    div.className = "atributo";
    div.innerHTML = `
      <span>${nome}</span>
      <input type="number" value="${ficha.atributos[nome]}"
        onchange="atualizarAtributo('${nome}', this.value)">
      <button onclick="preencherRolagem(${ficha.atributos[nome]})">🎲</button>
    `;
    atributos.appendChild(div);
  });
}

function atualizarAtributo(nome, valor) {
  const ficha = JSON.parse(localStorage.getItem("ficha_" + usuarioAtual));
  ficha.atributos[nome] = Number(valor);
  localStorage.setItem("ficha_" + usuarioAtual, JSON.stringify(ficha));
}

function atualizarBarra(tipo) {
  const ficha = JSON.parse(localStorage.getItem("ficha_" + usuarioAtual));

  if (tipo === "vida") {
    ficha.vidaAtual = Number(vidaAtual.value);
    ficha.vidaMax = Number(vidaMax.value);
    vidaBarra.style.width = (ficha.vidaAtual / ficha.vidaMax * 100) + "%";
  } else {
    ficha.sanAtual = Number(sanAtual.value);
    ficha.sanMax = Number(sanMax.value);
    sanBarra.style.width = (ficha.sanAtual / ficha.sanMax * 100) + "%";
  }

  localStorage.setItem("ficha_" + usuarioAtual, JSON.stringify(ficha));
}

document.addEventListener("change", e => {
  if (e.target.id === "inputFoto") {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ficha = JSON.parse(localStorage.getItem("ficha_" + usuarioAtual));
      ficha.foto = reader.result;
      localStorage.setItem("ficha_" + usuarioAtual, JSON.stringify(ficha));
      fotoPerfil.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});

function preencherRolagem(valor) {
  pericia.value = valor;
}

function rolar() {
  const p = Number(pericia.value);
  const d = Number(dado.value);
  let r = "Fracasso";

  const tabela = [
    [20, null, null],
    [19, 20, null],
    [18, 20, null],
    [17, 19, null],
    [16, 19, 20],
    [15, 18, 20],
    [14, 18, 20],
    [13, 17, 20],
    [12, 17, 20],
    [11, 16, 19],
    [10, 16, 19],
    [9, 15, 19],
    [8, 15, 19],
    [7, 14, 19],
    [6, 14, 18],
    [5, 13, 18],
    [4, 13, 18],
    [3, 12, 18],
    [2, 12, 18],
    [1, 11, 17]
  ];

  const [normal, bom, crit] = tabela[p - 1] || [];

  if (crit && d >= crit) r = "Crítico";
  else if (bom && d >= bom) r = "Sucesso Bom";
  else if (normal && d >= normal) r = "Sucesso Normal";

  resultado.textContent = r;
}

const loginDiv = () => document.getElementById("login");
const appDiv = () => document.getElementById("app");
