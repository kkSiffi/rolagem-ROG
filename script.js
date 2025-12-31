const atributos = [
 "Acrobacia","Briga","Charme","Corte Rápido","Duro na Queda",
 "Encontrar","Escola","Esconder","Esperteza","Estilo",
 "Força","Habilidade","Intuição","Malandragem","Medicina",
 "Pilantragem","Piloto de Fuga","Poder","Sabixão","Sorte","Tiro"
];

const tabela = {
 1:{normal:20},2:{normal:19,bom:20},3:{normal:18,bom:20},
 4:{normal:17,bom:19},5:{normal:16,bom:19,critico:20},
 6:{normal:15,bom:18,critico:20},7:{normal:14,bom:18,critico:20},
 8:{normal:13,bom:17,critico:20},9:{normal:12,bom:17,critico:20},
 10:{normal:11,bom:16,critico:19},11:{normal:10,bom:16,critico:19},
 12:{normal:9,bom:15,critico:19},13:{normal:8,bom:15,critico:19},
 14:{normal:7,bom:14,critico:19},15:{normal:6,bom:14,critico:18},
 16:{normal:5,bom:13,critico:18},17:{normal:4,bom:13,critico:18},
 18:{normal:3,bom:12,critico:18},19:{normal:2,bom:12,critico:18},
 20:{normal:1,bom:11,critico:17}
};

let usuarioAtual = "";

/* ===== LOGIN ===== */
function login() {
  const u = usuario.value.trim();
  const s = senha.value.trim();
  if (!u || !s) return;

  const contas = JSON.parse(localStorage.getItem("contas")) || {};
  if (!contas[u]) contas[u] = s;
  else if (contas[u] !== s) {
    erro.innerText = "Senha incorreta";
    return;
  }

  localStorage.setItem("contas", JSON.stringify(contas));
  usuarioAtual = u;
  mostrar("ficha");
  carregarFicha();
}

/* ===== FICHA ===== */
function carregarFicha() {
  let ficha = JSON.parse(localStorage.getItem("ficha_" + usuarioAtual));

  if (!ficha) {
    ficha = {
      foto: "",
      vidaAtual: 10,
      vidaMax: 10,
      sanAtual: 30,
      sanMax: 30,
      atributos: {}
    };
    atributos.forEach(a => ficha.atributos[a] = 0);
    localStorage.setItem("ficha_" + usuarioAtual, JSON.stringify(ficha));
  }

  let html = `
  <div class="perfil">
    <img id="fotoPerfil"
      src="${ficha.foto || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='}">

    <input type="file" accept="image/*" onchange="salvarFoto(event)">
    <h3>${usuarioAtual}</h3>
  </div>

  <p>Vida ${ficha.vidaAtual}/${ficha.vidaMax}</p>
  <div class="barra-container">
    <div class="barra vida" style="width:${(ficha.vidaAtual / ficha.vidaMax) * 100}%"></div>
  </div>

  <p>Sanidade ${ficha.sanAtual}/${ficha.sanMax}</p>
  <div class="barra-container">
    <div class="barra sanidade" style="width:${(ficha.sanAtual / ficha.sanMax) * 100}%"></div>
  </div>

  <h3>Atributos</h3>
  `;

  atributos.forEach(a => {
    html += `
    <div class="atributo">
      ${a}
      <input type="number" value="${ficha.atributos[a]}"
        onchange="salvarAtributo('${a}', this.value)">
      <button onclick="abrirRolagem(${ficha.atributos[a]})">🎲</button>
    </div>`;
  });

  fichaDiv().innerHTML = html;
}

/* ===== FOTO (FUNCIONA) ===== */
function salvarFoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const ficha = JSON.parse(localStorage.getItem("ficha_" + usuarioAtual));
    ficha.foto = reader.result;
    localStorage.setItem("ficha_" + usuarioAtual, JSON.stringify(ficha));
    carregarFicha();
  };
  reader.readAsDataURL(file);
}

/* ===== ATRIBUTOS ===== */
function salvarAtributo(nome, valor) {
  const ficha = JSON.parse(localStorage.getItem("ficha_" + usuarioAtual));
  ficha.atributos[nome] = Number(valor);
  localStorage.setItem("ficha_" + usuarioAtual, JSON.stringify(ficha));
}

/* ===== ROLAGEM ===== */
function abrirRolagem(valor) {
  pericia.value = valor;
  dado.value = "";
  resultado.innerText = "";
  mostrar("rolagem");
}

function rolar() {
  const p = Number(pericia.value);
  const d = Number(dado.value);

  if (!tabela[p] || d < 1 || d > 20) {
    resultado.innerText = "Valores inválidos";
    return;
  }

  const r = tabela[p];
  if (r.critico && d >= r.critico) resultado.innerText = "Sucesso Crítico";
  else if (r.bom && d >= r.bom) resultado.innerText = "Sucesso Bom";
  else if (d >= r.normal) resultado.innerText = "Sucesso Normal";
  else resultado.innerText = "Fracasso";
}

/* ===== TELAS ===== */
function mostrar(id) {
  ["login","ficha","rolagem"].forEach(sec =>
    document.getElementById(sec).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
}

function voltar() {
  mostrar("ficha");
}

function fichaDiv() {
  return document.getElementById("ficha");
}
