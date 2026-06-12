import { staticSkills } from './banco/my.js';
import { universos } from './banco/univeros.js';
import { universeSkills } from './banco/skills.js'; 
import { universeItens } from './banco/items.js';
import { universeConstitution } from './banco/const.js';

var coluna = 0;
var linha = 0; // Nova variável global para controlar a linha selecionada
const universosSelecionados = { 1: null, 2: null, 3: null };

function openModal(tipo, escolha, numLinha) {
    let colunaAlvo = coluna; 
    if (escolha === 'col1') colunaAlvo = 1;
    if (escolha === 'col2') colunaAlvo = 2;
    if (escolha === 'col3') colunaAlvo = 3;

    if (tipo === 'descHabilidade') {
        const modalElement = document.getElementById('descHabilidade');
        
        if (!document.getElementById('titulo-habilidade')) {
            modalElement.innerHTML = `
                <div class="moldura-habilidade">
                    <div class="linha-principal">
                        <h1 class="titulo" id="titulo-habilidade"></h1>
                        <p class="descricao" id="descricao-habilidade"></p>
                        <div id="extra-habilidade"></div>
                    </div>
                    <div class="canto tl"></div>
                    <div class="canto tr"></div>
                    <div class="canto bl"></div>
                    <div class="canto br"></div>
                </div>
            `;
        }

        document.getElementById('titulo-habilidade').textContent = staticSkills[escolha].title;
        document.getElementById('descricao-habilidade').textContent = staticSkills[escolha].desc;
        document.getElementById('extra-habilidade').innerHTML = staticSkills[escolha].extra;
        
        modalElement.classList.add('ativo');
    } 
    else if (tipo === 'escUniverso') {
        coluna = colunaAlvo; 
        document.getElementById('escUniverso').classList.toggle('ativo');
        document.getElementById('descricao-sincronizacao').textContent = `Selecione um universo do registro para a coluna [${coluna}].`;
        renderizarMenu('universo');
    } 
    else if (tipo === 'escCoisa') {
        coluna = colunaAlvo; 
        linha = numLinha; 

        if (!universosSelecionados[coluna]) return;
        document.getElementById('escCoisa').classList.toggle('ativo');
    } 
    else if (tipo === 'escHabilidade') {
        coluna = colunaAlvo; 
        if (!universosSelecionados[coluna]) return; 

        const universoAtual = universosSelecionados[coluna];
        document.getElementById('titulo-universo').textContent = `Sincronizado: ${universoAtual}`;
        document.getElementById('descricao-escolha').textContent = `Selecione uma habilidade do registro para a linha [${linha}].`;

        renderizarMenu('habilidades');

        document.getElementById('escCoisa').classList.remove('ativo');
        setTimeout(() => { document.getElementById('escHabilidade').classList.add('ativo'); }, 180);
    }
    else if (tipo === 'escItens') {
        coluna = colunaAlvo; 
        if (!universosSelecionados[coluna]) return; 

        const universoAtual = universosSelecionados[coluna];
        document.getElementById('titulo-universo').textContent = `Sincronizado: ${universoAtual}`;
        document.getElementById('descricao-escolha').textContent = `Selecione um item do registro para a linha [${linha}].`;

        renderizarMenu('itens');

        document.getElementById('escCoisa').classList.remove('ativo');
        setTimeout(() => { document.getElementById('escHabilidade').classList.add('ativo'); }, 180);
    }
    else if (tipo === 'escConstituicoes') {
        coluna = colunaAlvo; 
        if (!universosSelecionados[coluna]) return; 

        const universoAtual = universosSelecionados[coluna];
        document.getElementById('titulo-universo').textContent = `Sincronizado: ${universoAtual}`;
        document.getElementById('descricao-escolha').textContent = `Selecione uma constituição do registro para a linha [${linha}].`;

        renderizarMenu('constituicoes');

        document.getElementById('escCoisa').classList.remove('ativo');
        setTimeout(() => { document.getElementById('escHabilidade').classList.add('ativo'); }, 180);
    }
}
window.openModal = openModal;
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) { event.target.classList.remove('ativo'); }
});

function obterEquipados() {
    const equipados = [];
    for (let c = 1; c <= 3; c++) {
        for (let l = 1; l <= 3; l++) {
            const slot = document.getElementById(`col${c}-habilidade${l}`);
            if (slot && slot.hasAttribute('data-nome')) {
                equipados.push(slot.getAttribute('data-nome'));
            }
        }
    }
    return equipados;
}

// --- NOVAS FUNÇÕES: VER DETALHES E DESVINCULAR ---
function abrirDetalhes(c, l, nomeCoisa, tipoCoisa = 'habilidade') {
    const universoAtual = universosSelecionados[c];
    const universoIndex = universos.indexOf(universoAtual);
    
    // Busca do banco correspondente ao clique
    let listaAtual;
    if (tipoCoisa === 'item') listaAtual = universeItens[universoIndex];
    else if (tipoCoisa === 'constituicao') listaAtual = universeConstitution[universoIndex];
    else listaAtual = universeSkills[universoIndex];

    const objeto = listaAtual.find(o => o.name === nomeCoisa);

    if (!objeto) return;

    const habilidade = objeto; 
    const descFormatada = habilidade.desc.replace(/\n/g, '<br>');
    
    // Suporte para Ranks
    let rankColor = "#C5A344"; 
    if (habilidade.rank === 'EX' || habilidade.rank === 'Mítico') rankColor = "#23EEC4";
    if (habilidade.rank === 'SSS' || habilidade.rank === 'SS' || habilidade.rank === 'Lendário') rankColor = "#FFD700";
    if (habilidade.rank === 'Único') rankColor = "#D946EF"; 

    const modalWindow = document.getElementById('descHabilidade');

    // MUDANÇA: Verifica se é o Universo 2 e injeta a sua estrutura personalizada
    if (universoAtual === "SSS Class Revival Hunter") {
        modalWindow.innerHTML = `
            <div class="ui-container">
                <div class="top-bracket"></div>

                <div class="card-outer">
                    <div class="card-middle">
                        <div class="card-inner">
                            <div class="skill-title">[${habilidade.name.toUpperCase()}]</div>
                            <div class="skill-rank">RANK: ${habilidade.rank.toUpperCase()}</div>
                            
                            <div class="skill-description">${descFormatada}</div>

                            <div style="margin-top: 25px; display: flex; gap: 10px; width: 100%;">
                                <button style="flex: 1; padding: 10px; background: #e2e8f0; color: #475569; border: 1px solid #cbd5e1; font-weight: 700; cursor: pointer;" onclick="fecharModalDetalhes()">FECHAR</button>
                                <button style="flex: 1; padding: 10px; border: 1px solid #ff3366; color: #ff3366; background: rgba(255,51,102,0.05); font-weight: 700; cursor: pointer;" onclick="desvincular(${c}, ${l})">DESVINCULAR</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (universoAtual === "Climbing The Tower With a Time Stop Ability") {
        // Formata dinamicamente as palavras-chave do banco de dados para ficarem em destaque e com a linha tracejada
        let descClimbing = descFormatada
            .replace(/EFEITO:/g, '<span style="color: #0f172a; font-weight: 800;">EFEITO:</span>')
            .replace(/CLASSIFICAÇÃO:/g, '<div style="margin-top: 25px; padding-top: 15px; border-top: 1px dashed #cbd5e1;"><span style="color: #0f172a; font-weight: 800;">CLASSIFICAÇÃO:</span>')
            .replace(/CUSTO DE FORÇA DE VONTADE:/g, '<span style="color: #0f172a; font-weight: 800;">CUSTO DE FORÇA DE VONTADE:</span>')
            .replace(/TEMPO DE RECARGA:/g, '<span style="color: #0f172a; font-weight: 800;">TEMPO DE RECARGA:</span>');
            
        // Fecha a div gerada pela CLASSIFICAÇÃO para não quebrar o layout
        if (descClimbing.includes('border-top')) descClimbing += '</div>';

        modalWindow.innerHTML = `
            <div class="system-window-wrapper" style="margin-top: -50px;">
                <div class="top-tab-outer">
                    <div class="top-tab-middle">
                        <div class="top-tab-inner"></div>
                    </div>
                </div>

                <div class="main-body-outer">
                    <div class="main-body-middle">
                        <div class="main-body-inner" style="background-color: #f8fafc; padding: 20px;">
                            <div class="quest-content-box">
                                <div class="skill-title" style="font-size: 24px; font-weight: 700; color: #0f172a; text-align: center; margin-bottom: 20px; letter-spacing: 0.5px;">
                                    [SKILL: ${habilidade.name.toUpperCase()} <span>(${habilidade.rank.toUpperCase()})</span>]
                                </div>
                                
                                <div class="skill-description" style="font-size: 14px; color: #475569; line-height: 1.7; text-align: justify; text-transform: uppercase; font-weight: 600; letter-spacing: 0.2px;">
                                    <div class="text-block" style="margin-bottom: 15px;">${descClimbing}</div>

                                    <div style="display: flex; gap: 10px; width: 100%; border-top: 1px dashed #cbd5e1; padding-top: 15px; margin-top: 15px;">
                                        <button class="close-btn" style="flex: 1; padding: 10px; margin: 0; background: #e2e8f0; color: #475569; border: 1px solid #cbd5e1; font-family: 'Segoe UI', sans-serif; font-weight: 700; cursor: pointer;" onclick="fecharModalDetalhes()">FECHAR</button>
                                        <button class="close-btn" style="flex: 1; padding: 10px; margin: 0; border: 1px solid #ff3366; color: #ff3366; background: rgba(255,51,102,0.05); font-family: 'Segoe UI', sans-serif; font-weight: 700; cursor: pointer;" onclick="desvincular(${c}, ${l})">DESVINCULAR</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bottom-tab-outer">
                    <div class="bottom-tab-middle">
                        <div class="bottom-tab-inner"></div>
                    </div>
                </div>
            </div>`;
    } else {
        // Se for qualquer outro Universo (Regressão, Solo Leveling, etc.), usa a estrutura padrão do sistema
        modalWindow.innerHTML = `
            <div class="moldura-habilidade">
                <div class="linha-principal">
                    <h1 class="titulo" id="titulo-habilidade">
                        [${habilidade.name.toUpperCase()}] <br>
                        <span style="color: ${rankColor}; font-size: 0.6em; text-shadow: 0 0 8px ${rankColor}aa;">RANK: ${habilidade.rank.toUpperCase()}</span>
                    </h1>
                    <p class="descricao" id="descricao-habilidade">${descFormatada}</p>
                    <div id="extra-habilidade">
                        <div style="margin-top: 15px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">
                            ORIGEM: ${universoAtual}
                        </div>
                        <div style="margin-top: 25px; display: flex; gap: 10px; width: 100%;">
                            <button style="flex: 1; padding: 10px; background: #1e293b; color: #f8fafc; border: 1px solid #475569; cursor: pointer; font-weight: bold; text-transform: uppercase;" onclick="fecharModalDetalhes()">Fechar</button>
                            <button style="flex: 1; padding: 10px; border: 1px solid #ff3366; color: #ff3366; background: rgba(255,51,102,0.1); cursor: pointer; font-weight: bold; text-transform: uppercase; box-shadow: inset 0 0 10px rgba(255,51,102,0.1);" onclick="desvincular(${c}, ${l})">Desvincular</button>
                        </div>
                    </div>
                </div>
                <div class="canto tl"></div>
                <div class="canto tr"></div>
                <div class="canto bl"></div>
                <div class="canto br"></div>
            </div>
        `;
    }

    modalWindow.classList.add('ativo');
}
window.abrirDetalhes = abrirDetalhes;

function fecharModalDetalhes() { document.getElementById('descHabilidade').classList.remove('ativo'); }
window.fecharModalDetalhes = fecharModalDetalhes;

//3 Passos
function renderizarMenu(tipo) {
    // 1. LÓGICA EXCLUSIVA PARA O MENU DE UNIVERSOS
    if (tipo === 'universo') {
        const menu = document.getElementById("menu-sincronizacao");
        if (!menu) return;
        menu.innerHTML = ""; 
        const ocupados = Object.values(universosSelecionados);

        const universosOrdenados = [...universos].sort((a, b) => a.localeCompare(b));

        for (let i = 0; i < universos.length; i++) {
            const universo = universosOrdenados[i];
            const nomeTratado = universo.replace(/'/g, "\\'"); // Tratamento de aspas

            if (ocupados.includes(universo)) {
                // Mantive o padrão visual das outras categorias para ficar harmonioso
                menu.innerHTML += `
                    <p class="habilidade equipado" style="opacity: 0.4; cursor: not-allowed;">
                        ${universo} <strong class="direita" style="color: #94a3b8;">[Escolhido]</strong>
                    </p>`;
            } else {
                // Chama a função unificada passando o tipo 'universo' (rank fica vazio)
                menu.innerHTML += `<p class="habilidade" onclick="sincronizar('${nomeTratado}', '', 'universo')">${universo}</p>`;
            }
        }
        return; // Encerra a função aqui para não rodar a lógica de itens/habilidades
    }

    // 2. LÓGICA PARA HABILIDADES, ITENS E CONSTITUIÇÕES
    const menu = document.getElementById("menu-habilidades");
    if (!menu) return;
    menu.innerHTML = ""; 

    const universoAtual = universosSelecionados[coluna];
    const universoIndex = universos.indexOf(universoAtual);
    
    const configuracoes = {
        habilidades: {
            dados: universeSkills,
            mensagemVazio: "Nenhuma habilidade cadastrada para este universo ainda.",
            tipoSincronizacao: "habilidade"
        },
        itens: {
            dados: universeItens,
            mensagemVazio: "Nenhum item cadastrado para este universo ainda.",
            tipoSincronizacao: "item"
        },
        constituicoes: {
            dados: universeConstitution,
            mensagemVazio: "Nenhuma constituição cadastrada para este universo ainda.",
            tipoSincronizacao: "constituicao"
        }
    };

    const configAtual = configuracoes[tipo];
    
    if (!configAtual) {
        console.error(`O tipo de menu '${tipo}' não existe nas configurações.`);
        return;
    }

    const listaElementos = configAtual.dados[universoIndex];
    const equipados = obterEquipados(); 

    if (listaElementos && listaElementos.length > 0) {
        for (let i = 0; i < listaElementos.length; i++) {
            const item = listaElementos[i];
            if (!item.name) continue; 

            const nomeTratado = item.name.replace(/'/g, "\\'");
            let nomeExibido = item.name;
            if (nomeExibido.length > 40) nomeExibido = nomeExibido.substring(0, 40) + "...";

            let classeRank = item.rank.replace(/[+\-]/g, '').trim();
            if (['???', '??', '?'].includes(classeRank)) classeRank = 'Desconecido';
            if (['Lv.1', 'Lv.2'].includes(classeRank)) classeRank = 'Lv';
            if (classeRank === 'Lv.MAX') classeRank = 'MAX';
            
            let rankClassFinal = classeRank.replace(/Nv\.\d+/g, "Lv").replace("Nv.MAX", "Épico");

            if (equipados.includes(item.name)) {
                menu.innerHTML += `
                    <p class="habilidade" style="opacity: 0.4; cursor: not-allowed;">
                        ${nomeExibido} <strong class="direita" style="color: #94a3b8;">[Equipado]</strong>
                    </p>`;
            } else {
                menu.innerHTML += `
                    <p class="habilidade" onclick="sincronizar('${nomeTratado}', '${item.rank}', '${configAtual.tipoSincronizacao}')">
                        ${nomeExibido} <strong class="rank${rankClassFinal} direita">[${item.rank}]</strong>
                    </p>`;
            }
        }
    } else {
        menu.innerHTML = `<p class="descricao" style="text-align:center; padding: 20px;">${configAtual.mensagemVazio}</p>`;
    }
}

function sincronizar(nome, rank, tipo) {
    const nomeTratado = nome.replace(/'/g, "\\'");

    // 1. LÓGICA EXCLUSIVA DE SINCRONIZAÇÃO DE UNIVERSO
    if (tipo === 'universo') {
        universosSelecionados[coluna] = nome; // No caso do universo, o 'nome' é a própria string do universo
        const id = `col${coluna}-universo`;
        const elemento = document.getElementById(id);
        
        if (elemento) elemento.textContent = nome;
        
        const escUniverso = document.getElementById('escUniverso');
        if (escUniverso) escUniverso.classList.remove('ativo');
        
        return; // Encerra aqui
    }

    // 2. LÓGICA DE SINCRONIZAÇÃO DE ITENS, HABILIDADES E CONSTS
    const slotId = `col${coluna}-habilidade${linha}`;
    const slotElemento = document.getElementById(slotId);
    
    if (slotElemento) {
        slotElemento.classList.add('preenchido');
        slotElemento.setAttribute('data-nome', nome); 

        let classeRank = rank.replace(/[+\-]/g, '').trim();
        if (['???', '??', '?'].includes(classeRank)) classeRank = 'Desconecido';
        if (['Lv.1', 'Lv.2'].includes(classeRank)) classeRank = 'Lv';
        if (classeRank === 'Lv.MAX') classeRank = 'MAX';
        
        let rankClassFinal = classeRank.replace(/Nv\.\d+/g, "Lv").replace("Nv.MAX", "Épico");

        slotElemento.innerHTML = `<p>${nome} <strong class="rank${rankClassFinal}">${rank}</strong></p>`;
        slotElemento.setAttribute('onclick', `abrirDetalhes(${coluna}, ${linha}, '${nomeTratado}', '${tipo}')`);
    }

    const escHabilidade = document.getElementById('escHabilidade');
    if (escHabilidade) escHabilidade.classList.remove('ativo');
}

function desvincular(c, l) {
    const slotId = `col${c}-habilidade${l}`;
    const slotElemento = document.getElementById(slotId);

    if (slotElemento) {
        slotElemento.classList.remove('preenchido');
        slotElemento.removeAttribute('data-nome'); // LINHA NOVA
        slotElemento.innerHTML = '[Selecionar]';
        slotElemento.setAttribute('onclick', `openModal('escCoisa', 'col${c}', ${l})`);
    }
    
    // Fecha o modal logo após desvincular
    fecharModalDetalhes();
}

window.renderizarMenu = renderizarMenu;
window.sincronizar = sincronizar;
window.desvincular = desvincular;