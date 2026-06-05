import { staticSkills } from './banco/my.js';
import { universos } from './banco/univeros.js';
import { universeSkills } from './banco/skills.js'; 
import { universeItens } from './banco/items.js';

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
        
        // SEGURANÇA: Se a janela do "SSS Class Revival" estiver montada, nós restauramos o design original antes de tentar colocar texto.
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
        renderizarMenuUniverso();
    } 
    else if (tipo === 'escCoisa') {
        coluna = colunaAlvo; 
        linha = numLinha; // Guarda dinamicamente a linha clicada (1, 2 ou 3)

        if (!universosSelecionados[coluna]) {
            return; // Bloqueio silencioso sem alertas caso não tenha universo definido
        }
        document.getElementById('escCoisa').classList.toggle('ativo');
    } 
    else if (tipo === 'escHabilidade') {
        coluna = colunaAlvo; 
        if (!universosSelecionados[coluna]) {
            return; 
        }

        // 1. Pega o nome do universo salvo para esta coluna
        const universoAtual = universosSelecionados[coluna];

        // 2. Modifica dinamicamente o título e descrição internos do modal de habilidades
        document.getElementById('titulo-universo').textContent = `${universoAtual}`;
        document.getElementById('descricao-escolha').textContent = `Selecione uma habilidade do registro para a linha [${linha}].`;

        // Carrega as habilidades específicas do universo antes de mostrar a tela
        renderizarMenuHabilidades();

        // Fecha o menu de escolha ("Habilidades / Itens") e abre o de habilidades
        document.getElementById('escCoisa').classList.remove('ativo');
        setTimeout(() => {
            document.getElementById('escHabilidade').classList.add('ativo');
        }, 180);
    } 
    else if (tipo === 'escItens') {
        coluna = colunaAlvo; 
        if (!universosSelecionados[coluna]) return; 

        const universoAtual = universosSelecionados[coluna];
        
        // Reaproveitamos a janela do escHabilidade, mudando só os textos
        document.getElementById('titulo-universo').textContent = `Sincronizado: ${universoAtual}`;
        document.getElementById('descricao-escolha').textContent = `Selecione um item do registro para a linha [${linha}].`;

        renderizarMenuItems(); // Chama a nova função de itens

        document.getElementById('escCoisa').classList.remove('ativo');
        setTimeout(() => { document.getElementById('escHabilidade').classList.add('ativo'); }, 180);
    }
}
window.openModal = openModal;
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('ativo');
    }
});

function sincronizarUniverso(universo) {
    universosSelecionados[coluna] = universo;
    const id = `col${coluna}-universo`;
    document.getElementById(id).textContent = universo;
    document.getElementById('escUniverso').classList.remove('ativo');
}
window.sincronizarUniverso = sincronizarUniverso;

function renderizarMenuUniverso() {
    const menu = document.getElementById("menu-sincronizacao");
    menu.innerHTML = ""; 
    const ocupados = Object.values(universosSelecionados);

    for(let i = 0; i < universos.length; i++) {
        const universo = universos[i];
        if (ocupados.includes(universo)) {
            menu.innerHTML += `<p class="habilidade equipado">${universo} (Escolhido)</p>`;
        } else {
            menu.innerHTML += `<p class="habilidade" onclick="sincronizarUniverso('${universo}')">${universo}</p>`;
        }
    }
}
renderizarMenuUniverso();

function renderizarMenuHabilidades() {
    const menu = document.getElementById("menu-habilidades");
    if (!menu) return;

    menu.innerHTML = ""; 

    const universoAtual = universosSelecionados[coluna];
    const universoIndex = universos.indexOf(universoAtual);
    const listaHabilidades = universeSkills[universoIndex];

    if (listaHabilidades && listaHabilidades.length > 0) {
        for (let i = 0; i < listaHabilidades.length; i++) {
            const habilidade = listaHabilidades[i];
            if (!habilidade.name) continue; 

            // Alterado para passar o nome e o rank como parâmetros de texto (escapando aspas simples caso existam)
            const nomeTratado = habilidade.name.replace(/'/g, "\\'");
            let classeRank = habilidade.rank.replace(/[+\-]/g, '').trim();
            if (classeRank === '???' || classeRank === '??' || classeRank === '?') classeRank = 'Desconecido';

            menu.innerHTML += `
                <p class="habilidade" onclick="sincronizarHabilidade('${nomeTratado}', '${habilidade.rank}')">
                    ${habilidade.name} <strong class="rank${classeRank} direita">[${habilidade.rank}]</strong>
                </p>`;
        }
    } else {
        menu.innerHTML = `<p class="descricao" style="text-align:center; padding: 20px;">Nenhuma habilidade cadastrada para este universo ainda.</p>`;
    }
}

function sincronizarHabilidade(nomeHabilidade, rank) {
    const slotId = `col${coluna}-habilidade${linha}`;
    const slotElemento = document.getElementById(slotId);
    
    if (slotElemento) {
        slotElemento.classList.add('preenchido');

        // Tratamento de aspas para evitar quebra no JavaScript
        const nomeTratado = nomeHabilidade.replace(/'/g, "\\'");

        // HIGIENIZAÇÃO DO RANK
        let classeRank = rank.replace(/[+\-]/g, '').trim();
        if (classeRank === '???' || classeRank === '??' || classeRank === '?') classeRank = 'Desconecido';

        // Injeta o HTML e a classe
        slotElemento.innerHTML = `<p>${nomeHabilidade} <strong class="rank${classeRank}">${rank}</strong></p>`;

        // MUDANÇA: Altera o clique da célula para ABRIR OS DETALHES em vez de escolher uma nova
        slotElemento.setAttribute('onclick', `abrirDetalhes(${coluna}, ${linha}, '${nomeTratado}', 'habilidade')`);
    }
    document.getElementById('escHabilidade').classList.remove('ativo');
}
window.sincronizarHabilidade = sincronizarHabilidade;

// --- NOVAS FUNÇÕES: VER DETALHES E DESVINCULAR ---
function abrirDetalhes(c, l, nomeCoisa, tipoCoisa = 'habilidade') {
    const universoAtual = universosSelecionados[c];
    const universoIndex = universos.indexOf(universoAtual);
    
    // Busca do banco de Habilidades OU Itens, dependendo do clique
    const listaAtual = tipoCoisa === 'item' ? universeItens[universoIndex] : universeSkills[universoIndex];
    const objeto = listaAtual.find(o => o.name === nomeCoisa);

    if (!objeto) return;

    // TRUQUE: Chamamos o objeto de "habilidade" para que o seu HTML original continue funcionando sem precisar alterar variáveis!
    const habilidade = objeto; 
    
    const descFormatada = habilidade.desc.replace(/\n/g, '<br>');
    
    // Suporte para Ranks de Itens (Mítico, Lendário, Único)
    let rankColor = "#C5A344"; 
    if (habilidade.rank === 'EX' || habilidade.rank === 'Mítico') rankColor = "#23EEC4";
    if (habilidade.rank === 'SSS' || habilidade.rank === 'SS' || habilidade.rank === 'Lendário') rankColor = "#FFD700";
    if (habilidade.rank === 'Único') rankColor = "#D946EF"; // Cor para o Rank Único (Rosa Neon/Roxo)

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
                                <button style="flex: 1; padding: 10px; border: 1px solid #ff3366; color: #ff3366; background: rgba(255,51,102,0.05); font-weight: 700; cursor: pointer;" onclick="desvincularHabilidade(${c}, ${l})">DESVINCULAR</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (universoAtual === "Climbing Tower With a Time Stop Ability") {
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
                                        <button class="close-btn" style="flex: 1; padding: 10px; margin: 0; border: 1px solid #ff3366; color: #ff3366; background: rgba(255,51,102,0.05); font-family: 'Segoe UI', sans-serif; font-weight: 700; cursor: pointer;" onclick="desvincularHabilidade(${c}, ${l})">DESVINCULAR</button>
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
                            <button style="flex: 1; padding: 10px; border: 1px solid #ff3366; color: #ff3366; background: rgba(255,51,102,0.1); cursor: pointer; font-weight: bold; text-transform: uppercase; box-shadow: inset 0 0 10px rgba(255,51,102,0.1);" onclick="desvincularHabilidade(${c}, ${l})">Desvincular</button>
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

function desvincularHabilidade(c, l) {
    const slotId = `col${c}-habilidade${l}`;
    const slotElemento = document.getElementById(slotId);
    
    if (slotElemento) {
        // 1. Remove os efeitos visuais (fundo, borda neon)
        slotElemento.classList.remove('preenchido');
        
        // 2. Devolve o texto padrão para a célula
        slotElemento.innerHTML = '[Selecionar]';
        
        // 3. Devolve a função original para a célula (abrir o menu de escolha)
        slotElemento.setAttribute('onclick', `openModal('escCoisa', 'col${c}', ${l})`);
    }
    
    // Fecha o modal logo após desvincular
    fecharModalDetalhes();
}
window.desvincularHabilidade = desvincularHabilidade;

function renderizarMenuItems() {
    const menu = document.getElementById("menu-habilidades"); // Reaproveita a div do modal
    if (!menu) return;
    menu.innerHTML = ""; 

    const universoAtual = universosSelecionados[coluna];
    const universoIndex = universos.indexOf(universoAtual);
    const listaItens = universeItens[universoIndex];

    if (listaItens && listaItens.length > 0) {
        for (let i = 0; i < listaItens.length; i++) {
            const item = listaItens[i];
            if (!item.name) continue; 

            const nomeTratado = item.name.replace(/'/g, "\\'");
            let classeRank = item.rank.replace(/[+\-]/g, '').trim();
            if (classeRank === '???') classeRank = 'Desconecido';

            menu.innerHTML += `
                <p class="habilidade" onclick="sincronizarItem('${nomeTratado}', '${item.rank}')">
                    ${item.name} <strong class="rank${classeRank} direita">[${item.rank}]</strong>
                </p>`;
        }
    } else {
        menu.innerHTML = `<p class="descricao" style="text-align:center; padding: 20px;">Nenhum item cadastrado para este universo ainda.</p>`;
    }
}

function sincronizarItem(nomeItem, rank) {
    const slotId = `col${coluna}-habilidade${linha}`; 
    const slotElemento = document.getElementById(slotId);
    
    if (slotElemento) {
        slotElemento.classList.add('preenchido');
        const nomeTratado = nomeItem.replace(/'/g, "\\'");

        let classeRank = rank.replace(/[+\-]/g, '').trim();
        if (classeRank === '???') classeRank = 'Desconecido';

        slotElemento.innerHTML = `<p>${nomeItem} <strong class="rank${classeRank}">${rank}</strong></p>`;
        
        // Passa o tipo 'item' para o clique de detalhes
        slotElemento.setAttribute('onclick', `abrirDetalhes(${coluna}, ${linha}, '${nomeTratado}', 'item')`);
    }

    document.getElementById('escHabilidade').classList.remove('ativo');
}
window.sincronizarItem = sincronizarItem;