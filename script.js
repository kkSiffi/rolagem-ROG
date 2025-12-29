const tabela = {
    1:  { normal: 20, bom: null, critico: null },
    2:  { normal: 19, bom: 20, critico: null },
    3:  { normal: 18, bom: 20, critico: null },
    4:  { normal: 17, bom: 19, critico: null },
    5:  { normal: 15, bom: 19, critico: 20 },
    6:  { normal: 15, bom: 18, critico: 20 },
    7:  { normal: 14, bom: 18, critico: 20 },
    8:  { normal: 13, bom: 17, critico: 20 },
    9:  { normal: 12, bom: 17, critico: 20 },
    10: { normal: 11, bom: 15, critico: 19 },
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

function verResultado() {
    const pericia = Number(document.getElementById("pericia").value);
    const dado = Number(document.getElementById("dado").value);
    const resultado = document.getElementById("resultado");

    if (pericia < 1 || pericia > 20 || dado < 1 || dado > 20) {
        resultado.innerText = "❗ Valores inválidos (1 a 20)";
        return;
    }

    const { normal, bom, critico } = tabela[pericia];

    if (critico !== null && dado >= critico) {
        resultado.innerText = "POIS TOME SUCESSO CRÍTICO";
    }
    else if (bom !== null && dado >= bom) {
        resultado.innerText = "oloco, sucesso bom";
    }
    else if (dado >= normal) {
        resultado.innerText = "Óia, foi sucesso normal";
    }
    else {
        resultado.innerText = "Eeeeeh... Fracasso";
    }
}