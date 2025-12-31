// ===== TABELA OFICIAL =====
const tabela = {
    1:  { normal: 20, bom: null, critico: null },
    2:  { normal: 19, bom: 20, critico: null },
    3:  { normal: 18, bom: 20, critico: null },
    4:  { normal: 17, bom: 19, critico: null },
    5:  { normal: 16, bom: 19, critico: 20 },
    6:  { normal: 15, bom: 18, critico: 20 },
    7:  { normal: 14, bom: 18, critico: 20 },
    8:  { normal: 13, bom: 17, critico: 20 },
    9:  { normal: 12, bom: 17, critico: 20 },
    10: { normal: 11, bom: 16, critico: 19 },
    11: { normal: 10, bom: 16, critico: 19 },
    12: { normal: 9,  bom: 15, critico: 19 },
    13: { normal: 8,  bom: 15, critico: 19 },
    14: { normal: 7,  bom: 14, critico: 19 },
    15: { normal: 6,  bom: 14, critico: 18 },
    16: { normal: 5,  bom: 13, critico: 18 },
    17: { normal: 4,  bom: 13, critico: 18 },
    18: { normal: 3,  bom: 12, critico: 18 },
    19: { normal: 2,  bom: 12, critico: 18 },
    20: { normal: 1,  bom: 11, critico: 17 }
};

// ===== LOGIN =====
btnLogin.onclick = loginUsuario;
inputFoto.onchange = trocarFoto;

document.querySelectorAll(".atributos input").forEach(i =>
    i.oninput = salvarFicha
);

[vidaAtual, vidaMax, sanidadeAtual, sanidadeMax].forEach(i =>
    i.oninput = atualizarBarras
);

function loginUsuario() {
    if (!usuario.value || !senha.value) return;

    let contas = JSON.parse(localStorage.getItem("contas")) || {};
    if (!contas[usuario.value]) contas[usuario.value] = senha.value;
    else if (contas[usuario.value] !== senha.value) return;

    localStorage.setItem("contas", JSON.stringify(contas));
    localStorage.setItem("usuarioAtual", usuario.value);

    nomePersonagem.innerText = usuario.value;
    trocarTela("ficha");
    carregarFicha();
    function login(event) {
  event.preventDefault(); 
}

// ===== FICHA =====
function carregarFicha() {
    const user = localStorage.getItem("usuarioAtual");
    const dados = JSON.parse(localStorage.getItem("ficha_" + user)) || {};

    Object.keys(dados).forEach(id => {
        if (document.getElementById(id))
            document.getElementById(id).value = dados[id];
    });

    foto.src = dados.foto || "";
    if (foto.src) inputFoto.style.display = "none";

    atualizarBarras();
}

function salvarFicha() {
    const user = localStorage.getItem("usuarioAtual");
    let dados = {};

    document.querySelectorAll("input").forEach(i => {
        if (i.id) dados[i.id] = i.value;
    });

    dados.foto = foto.src;
    localStorage.setItem("ficha_" + user, JSON.stringify(dados));
}

function atualizarBarras() {
    barraVida.style.width = (vidaAtual.value / vidaMax.value) * 100 + "%";
    barraSanidade.style.width = (sanidadeAtual.value / sanidadeMax.value) * 100 + "%";
    salvarFicha();
}

function trocarFoto(e) {
    const reader = new FileReader();
    reader.onload = () => {
        foto.src = reader.result;
        inputFoto.style.display = "none";
        salvarFicha();
    };
    reader.readAsDataURL(e.target.files[0]);
}

// ===== ATRIBUTO → ROLAGEM =====
function rolarAtributo(nome) {
    pericia.value = document.getElementById("attr-" + nome).value;
    dado.value = "";
    resultado.innerText = "";
    trocarTela("rolagem");
}

// ===== ROLAGEM (100% FIEL À TABELA) =====
function rolar() {
    const p = Number(pericia.value);
    const d = Number(dado.value);
    const regra = tabela[p];

    if (!regra) {
        resultado.innerText = "Perícia inválida";
        return;
    }

    if (regra.critico && d >= regra.critico)
        resultado.innerText = "Sucesso Crítico";
    else if (regra.bom && d >= regra.bom)
        resultado.innerText = "Sucesso Bom";
    else if (d >= regra.normal)
        resultado.innerText = "Sucesso Normal";
    else
        resultado.innerText = "Fracasso";
}

// ===== TELAS =====
function trocarTela(t) {
    login.classList.add("oculto");
    ficha.classList.add("oculto");
    rolagem.classList.add("oculto");
    document.getElementById(t).classList.remove("oculto");
    document.addEventListener("change", function (e) {
  if (e.target && e.target.id === "inputFoto") {
    salvarFoto(e);
  function salvarFoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const ficha = JSON.parse(
      localStorage.getItem("ficha_" + usuarioAtual)
    );

    ficha.foto = reader.result;
    localStorage.setItem(
      "ficha_" + usuarioAtual,
      JSON.stringify(ficha)
    );

    // atualiza só a imagem
    document.getElementById("fotoPerfil").src = reader.result;
  };

  reader.readAsDataURL(file);
}
