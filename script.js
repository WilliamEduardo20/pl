import { staticSkills } from './banco/my.js';
import { universos } from './banco/univeros.js';

// Categorias
import { universeSkills } from './banco/skills.js'; 
import { universeItens } from './banco/items.js';
import { universeConstitution } from './banco/const.js';

// Sub Categorias
import { universeArmors } from './banco/armaduras.js';
import { universeWepons } from './banco/armas.js';
import { universeConsumibles } from './banco/consumiveis.js';
import { universeMaterials } from './banco/materiais.js';

// --- SISTEMA DE CONFIGURAÇÕES (LOCALSTORAGE) ---
function inicializarConfiguracoes() {
    const chkSubClasses = document.getElementById('config-subclasses');
    const chkTitulos = document.getElementById('config-titulos');
    if (!chkSubClasses || !chkTitulos) return;

    const tipoSalvo = localStorage.getItem('config_separar_itens_tipo') || 'subclasses';
    
    if (tipoSalvo === 'titulos') {
        chkTitulos.checked = true;
        chkSubClasses.checked = false;
    } else {
        chkSubClasses.checked = true;
        chkTitulos.checked = false;
    }

    chkSubClasses.addEventListener('change', (e) => {
        if (e.target.checked) localStorage.setItem('config_separar_itens_tipo', 'subclasses');
    });

    chkTitulos.addEventListener('change', (e) => {
        if (e.target.checked) localStorage.setItem('config_separar_itens_tipo', 'titulos');
    });
}

window.addEventListener('DOMContentLoaded', inicializarConfiguracoes);

// --- CONTROLE DINÂMICO DE UPGRADE DO ÍNDICE MULTIVERSAL ---
let maxColunas = 3;
let maxLinhas = 3;
let nivelIndice = 1;
let escolhasFeitas = 0;

var coluna = 0, linha = 0;
const universosSelecionados = { 1: null, 2: null, 3: null };

function openModal(tipo, escolha, numLinha) {
    let colunaAlvo = coluna; 
    if (typeof escolha === 'string' && escolha.startsWith('col')) {
        colunaAlvo = parseInt(escolha.replace('col', ''), 10);
    }

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
                    <div class="canto tl"></div><div class="canto tr"></div><div class="canto bl"></div><div class="canto br"></div>
                </div>
            `;
        }

        document.getElementById('titulo-habilidade').textContent = staticSkills[escolha].title;
        document.getElementById('descricao-habilidade').textContent = staticSkills[escolha].desc;
        document.getElementById('extra-habilidade').innerHTML = staticSkills[escolha].extra;
        
        modalElement.classList.add('ativo');
    } 
    else if (tipo === 'configuracoes') {
        document.getElementById('configuracoes').classList.toggle('ativo');
        document.getElementById('descricao').textContent = `Personalize a Visualização das Informações.`;
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
        const nomeLinha = linha === '-extra' ? 'Extra' : linha;
        
        document.getElementById('titulo-universo').textContent = `Sincronizado: ${universoAtual}`;
        document.getElementById('descricao-escolha').textContent = `Selecione uma habilidade do registro para a linha [${nomeLinha}].`;

        renderizarMenu('habilidades');

        document.getElementById('escCoisa').classList.remove('ativo');
        setTimeout(() => { document.getElementById('escHabilidade').classList.add('ativo'); }, 180);
    }
    else if (tipo === 'escItens') {
        coluna = colunaAlvo; 
        if (!universosSelecionados[coluna]) return; 

        document.getElementById('escCoisa').classList.remove('ativo');
        const tipoSalvo = localStorage.getItem('config_separar_itens_tipo') || 'subclasses';

        setTimeout(() => { 
            if (tipoSalvo === 'subclasses') {
                document.getElementById('escSubItens').classList.add('ativo'); 
            } else {
                const universoAtual = universosSelecionados[coluna];
                const nomeLinha = linha === '-extra' ? 'Extra' : linha;
                
                document.getElementById('titulo-universo').textContent = `Sincronizado: ${universoAtual}`;
                document.getElementById('descricao-escolha').textContent = `Selecione um item do registro para a linha [${nomeLinha}].`;
                
                renderizarMenu('itens_gerais'); 
                document.getElementById('escHabilidade').classList.add('ativo');
            }
        }, 180);
    }
    else if (tipo === 'escFiltroItens') {
        if (!universosSelecionados[coluna]) return; 

        const universoAtual = universosSelecionados[coluna];
        const nomeFormatado = escolha.charAt(0).toUpperCase() + escolha.slice(1); 
        const nomeLinha = linha === '-extra' ? 'Extra' : linha;
        
        document.getElementById('titulo-universo').textContent = `Sincronizado: ${universoAtual}`;
        document.getElementById('descricao-escolha').textContent = `Selecione um(a) ${nomeFormatado.toLowerCase()} do registro para a linha [${nomeLinha}].`;

        renderizarMenu(escolha); 

        document.getElementById('escSubItens').classList.remove('ativo');
        setTimeout(() => { document.getElementById('escHabilidade').classList.add('ativo'); }, 180);
    }
    else if (tipo === 'escConstituicoes') {
        coluna = colunaAlvo; 
        if (!universosSelecionados[coluna]) return; 

        const universoAtual = universosSelecionados[coluna];
        const nomeLinha = linha === '-extra' ? 'Extra' : linha;
        
        document.getElementById('titulo-universo').textContent = `Sincronizado: ${universoAtual}`;
        document.getElementById('descricao-escolha').textContent = `Selecione uma constituição do registro para a linha [${nomeLinha}].`;

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
    for (let c = 1; c <= maxColunas; c++) {
        for (let l = 1; l <= maxLinhas; l++) {
            const slot = document.getElementById(`col${c}-habilidade${l}`);
            if (slot && slot.hasAttribute('data-nome')) {
                equipados.push(slot.getAttribute('data-nome'));
            }
        }
        const slotExtra = document.getElementById(`col${c}-habilidade-extra`);
        if (slotExtra && slotExtra.hasAttribute('data-nome')) {
            equipados.push(slotExtra.getAttribute('data-nome'));
        }
    }
    return equipados;
}

function abrirDetalhes(c, l, nomeCoisa, tipoCoisa = 'habilidade') {
    const universoAtual = universosSelecionados[c];
    const universoIndex = universos.indexOf(universoAtual);
    
    let listaAtual;
    if (tipoCoisa === 'armadura') listaAtual = universeArmors[universoIndex];
    else if (tipoCoisa === 'arma') listaAtual = universeWepons[universoIndex];
    else if (tipoCoisa === 'consumivel') listaAtual = universeConsumibles[universoIndex];
    else if (tipoCoisa === 'material') listaAtual = universeMaterials[universoIndex]; 
    else if (tipoCoisa === 'constituicao') listaAtual = universeConstitution[universoIndex];
    else if (tipoCoisa === 'item_geral') { 
        listaAtual = [
            ...(universeArmors[universoIndex] || []),
            ...(universeWepons[universoIndex] || []),
            ...(universeConsumibles[universoIndex] || []),
            ...(universeMaterials[universoIndex] || [])
        ];
    }
    else listaAtual = universeSkills[universoIndex]; 

    if (!listaAtual) return;

    const objeto = listaAtual.find(o => o.name === nomeCoisa);
    if (!objeto) return;

    const habilidade = objeto; 
    let descFormatada = habilidade.desc.replace(/\n/g, '<br>');
    
    if (habilidade.name === "Espada do Vazio") {
        const chavesMovimentos = {
            "Técnica Aplicada [Diabo (魔)]": "zero_aplicado_diabo", 
            "Vontade Profunda Aplicada [Sem Nome (無名)]": "zero_profunda_sem_nome",
            "Vontade Profunda Vinculada [Diabo Zero (零魔)]": "zero_vinculada",
            "Técnica Aplicada [Senhor (君)]": "rei_aplicado_senhor",
            "Profundidade Aplicada [Imperador (帝)]": "rei_profunda_imperador",
            "Técnica Aplicada [Preto (玄)]": "luz_aplicado", 
            "Profundidade Aplicada [Brilhante (明)]": "luz_profundidade", 
            "Técnica Aplicada [Rede (羅)]": "ceu_aplicado_rede",
            "Técnica Aplicada [Destino (命)]": "ceu_aplicado_destino",
            "Técnica Aplicada [Grande (大)]": "superior_aplicado_grande",
            "Técnica Aplicada [Deus (神)]": "superior_aplicado_deus", 
            "Profundidade Final": "esperanca_final", 
            "Profundidade Vinculada [Superior Céu Futuro Rei (上天未来王)]": "esperanca_vinculada" 
        };

        const estiloLink = "color: black; text-decoration: none; cursor: pointer; font-weight: bold; text-shadow: 0 0 5px rgba(14,165,233,0.3);";

        for (const [texto, chave] of Object.entries(chavesMovimentos)) {
            const textoEscapado = texto.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            const regex = new RegExp(textoEscapado, 'g');
            
            descFormatada = descFormatada.replace(
                regex, 
                `<span style="${estiloLink}" onclick="openModal('descHabilidade', '${chave}')">${texto}</span>`
            );
        }
        
        descFormatada = descFormatada.replace(/Zero \(零\): <br> - Forma Básica/g, `Zero (零): <br> - <span style="${estiloLink}" onclick="openModal('descHabilidade', 'zero_basico')">Forma Básica</span>`);
        descFormatada = descFormatada.replace(/Rei \(王\): <br> - Forma Básica/g, `Rei (王): <br> - <span style="${estiloLink}" onclick="openModal('descHabilidade', 'rei_basico')">Forma Básica</span>`);
        descFormatada = descFormatada.replace(/Luz \(光\): <br> - Forma Básica/g, `Luz (光): <br> - <span style="${estiloLink}" onclick="openModal('descHabilidade', 'luz_basico')">Forma Básica</span>`);
        descFormatada = descFormatada.replace(/Céu \(天\): <br> - Forma Básica/g, `Céu (天): <br> - <span style="${estiloLink}" onclick="openModal('descHabilidade', 'ceu_basico')">Forma Básica</span>`);
        descFormatada = descFormatada.replace(/Superior \(上\): <br> - Forma Básica/g, `Superior (上): <br> - <span style="${estiloLink}" onclick="openModal('descHabilidade', 'superior_basico')">Forma Básica</span>`);
        descFormatada = descFormatada.replace(/Futuro \(未來\): <br> - Forma Básica/g, `Futuro (未來): <br> - <span style="${estiloLink}" onclick="openModal('descHabilidade', 'futuro_basico')">Forma Básica</span>`); 
    }
    
    let rankColor = "#C5A344"; 
    if (habilidade.rank === 'EX' || habilidade.rank === 'Mítico') rankColor = "#23EEC4";
    if (habilidade.rank === 'SSS' || habilidade.rank === 'SS' || habilidade.rank === 'Lendário') rankColor = "#FFD700";
    if (habilidade.rank === 'Único') rankColor = "#D946EF";
    
    const modalWindow = document.getElementById('descHabilidade');

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
                                <button style="flex: 1; padding: 10px; border: 1px solid #ff3366; color: #ff3366; background: rgba(255,51,102,0.05); font-weight: 700; cursor: pointer;" onclick="desvincular(${c}, ${l === '-extra' ? "'-extra'" : l})">DESVINCULAR</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (universoAtual === "Climbing The Tower With a Time Stop Ability") {
        let descClimbing = descFormatada
            .replace(/EFEITO:/g, '<span style="color: #0f172a; font-weight: 800;">EFEITO:</span>')
            .replace(/<br><br>CLASSIFICAÇÃO:/g, '<div style="margin-top: 25px; padding-top: 15px; border-top: 1px dashed #cbd5e1;"><span style="color: #0f172a; font-weight: 800;">CLASSIFICAÇÃO:</span>')
            .replace(/CUSTO DE FORÇA DE VONTADE:/g, '<span style="color: #0f172a; font-weight: 800;">CUSTO DE FORÇA DE VONTADE:</span>')
            .replace(/TEMPO DE RECARGA:/g, '<span style="color: #0f172a; font-weight: 800;">TEMPO DE RECARGA:</span>');
            
        if (descClimbing.includes('border-top')) descClimbing += '</div>';

        modalWindow.innerHTML = `
            <div class="system-window-wrapper">
                <div class="top-tab-outer"><div class="top-tab-middle"><div class="top-tab-inner"></div></div></div>
                <div class="main-body-outer">
                    <div class="main-body-middle">
                        <div class="main-body-inner" style="background-color: #f8fafc; padding: 20px;">
                            <div class="quest-content-box">
                                <div class="skill-title" style="font-size: 24px; font-weight: 700; color: #0f172a; text-align: center; margin-bottom: 20px; letter-spacing: 0.5px;">
                                    [SKILL: ${habilidade.name.toUpperCase()} <span>(${habilidade.rank.toUpperCase()})</span>]
                                </div>
                                <div style="font-size: 14px; color: #475569; line-height: 1.7; text-align: justify; text-transform: uppercase; font-weight: 600; letter-spacing: 0.2px;">
                                    <div class="text-block" style="margin-bottom: 15px;">${descClimbing}</div>
                                    <div style="display: flex; gap: 10px; width: 100%; border-top: 1px dashed #cbd5e1; padding-top: 15px; margin-top: 15px;">
                                        <button class="close-btn" style="flex: 1; padding: 10px; margin: 0; background: #e2e8f0; color: #475569; border: 1px solid #cbd5e1; font-family: 'Segoe UI', sans-serif; font-weight: 700; cursor: pointer;" onclick="fecharModalDetalhes()">FECHAR</button>
                                        <button class="close-btn" style="flex: 1; padding: 10px; margin: 0; border: 1px solid #ff3366; color: #ff3366; background: rgba(255,51,102,0.05); font-family: 'Segoe UI', sans-serif; font-weight: 700; cursor: pointer;" onclick="desvincular(${c}, ${l === '-extra' ? "'-extra'" : l})">DESVINCULAR</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bottom-tab-outer"><div class="bottom-tab-middle"><div class="bottom-tab-inner"></div></div></div>
            </div>`;
    } else {
        const classeEspecial = habilidade.name === "Espada do Vazio" ? " tema-vazio" : "";

        modalWindow.innerHTML = `
            <div class="moldura-habilidade${classeEspecial}">
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
                            <button style="flex: 1; padding: 10px; border: 1px solid #ff3366; color: #ff3366; background: rgba(255,51,102,0.1); cursor: pointer; font-weight: bold; text-transform: uppercase; box-shadow: inset 0 0 10px rgba(255,51,102,0.1);" onclick="desvincular(${c}, ${l === '-extra' ? "'-extra'" : l})">Desvincular</button>
                        </div>
                    </div>
                </div>
                <div class="canto tl"></div><div class="canto tr"></div><div class="canto bl"></div><div class="canto br"></div>
            </div>
        `;
    }

    modalWindow.classList.add('ativo');
}
window.abrirDetalhes = abrirDetalhes;

function fecharModalDetalhes() { document.getElementById('descHabilidade').classList.remove('ativo'); }
window.fecharModalDetalhes = fecharModalDetalhes;

function obterPesosRank(rankStr) {
    if (!rankStr) return { raridade: 0, nivel: 0 };
    let texto = rankStr.toUpperCase(); 
    let raridade = 0;
    
    if (texto.includes('???')) raridade = 28;
    else if (texto.includes('??')) raridade = 27; 
    else if (texto.includes('?')) raridade = 26;  
    else if (texto.includes('EX') || texto.includes('EXOTICO') || texto.includes('EXÓTICO')) raridade = 25;
    else if (texto.includes('SSS')) raridade = 24;
    else if (texto.includes('SS')) raridade = 23;
    else if (texto.includes('S+')) raridade = 22;
    else if (texto.includes('S-')) raridade = 20;
    else if (texto.match(/\bS\b/) || texto.includes('MÍTICO') || texto.includes('MITICO')) raridade = 21;
    else if (texto.includes('A+') || texto.includes('LENDÁRIO+') || texto.includes('LENDARIO+')) raridade = 19;
    else if (texto.includes('A-') || texto.includes('SSR')) raridade = 17;
    else if (texto.match(/\bA\b/) || texto.includes('LENDÁRIO') || texto.includes('LENDARIO') || texto.includes('HEROICO') || texto.includes('HERÓICO')) raridade = 18;
    else if (texto.includes('ÚNICO+') || texto.includes('UNICO+')) raridade = 16.6;
    else if (texto.includes('ÚNICO') || texto.includes('UNICO')) raridade = 16.5;
    else if (texto.includes('B+') || texto.includes('ÉPICO+') || texto.includes('EPICO+')) raridade = 16;
    else if (texto.includes('B-')) raridade = 14;
    else if (texto.match(/\bB\b/) || texto.includes('ÉPICO') || texto.includes('EPICO') || texto.includes('SR')) raridade = 15;
    else if (texto.includes('C+')  || texto.includes('RARO+')) raridade = 13;
    else if (texto.includes('C-')) raridade = 11;
    else if (texto.match(/\bC\b/) || texto.includes('RARO') || texto.includes('R')) raridade = 12;
    else if (texto.includes('D+')  || texto.includes('INCOMUM+')) raridade = 10;
    else if (texto.includes('D-')) raridade = 8;
    else if (texto.match(/\bD\b/) || texto.includes('INCOMUM')) raridade = 9;
    else if (texto.includes('E+')  || texto.includes('COMUM+')) raridade = 7;
    else if (texto.includes('E-')) raridade = 5;
    else if (texto.match(/\bE\b/) || texto.includes('COMUM') || texto.includes('N')) raridade = 6;
    else if (texto.includes('FFF')) raridade = 4; 
    else if (texto.includes('FF')) raridade = 3; 
    else if (texto.match(/\bF\b/)) raridade = 2; 
    else if (texto.includes('NENHUMA') || texto.includes('NENHUM')) raridade = 1;

    let nivel = 0;
    let matchNivel = texto.match(/(NV|LV|NÍVEL|NIVEL)\.?\s*(\d+|MAX)/);
    if (matchNivel) {
        nivel = matchNivel[2] === 'MAX' ? 999 : parseInt(matchNivel[2], 10);
    }
    return { raridade, nivel };
}

function renderizarMenu(tipo) {
    if (tipo === 'universo') {
        const menu = document.getElementById("menu-sincronizacao");
        if (!menu) return;
        menu.innerHTML = ""; 
        const ocupados = Object.values(universosSelecionados);

        const universosOrdenados = [...universos].sort((a, b) => a.localeCompare(b));
        for (let i = 0; i < universosOrdenados.length; i++) {
            const universo = universosOrdenados[i];
            const nomeTratado = universo.replace(/'/g, "\\'");

            if (ocupados.includes(universo)) {
                menu.innerHTML += `
                    <p class="habilidade equipado" style="opacity: 0.4; cursor: not-allowed;">
                        ${universo} <strong class="direita" style="color: #94a3b8;">[Escolhido]</strong>
                    </p>`;
            } else { 
                menu.innerHTML += `<p class="habilidade" onclick="sincronizar('${nomeTratado}', '', 'universo')">${universo}</p>`; 
            }
        }
        return;
    }

    const menu = document.getElementById("menu-habilidades");
    if (!menu) return;
    menu.innerHTML = ""; 

    const universoAtual = universosSelecionados[coluna];
    const universoIndex = universos.indexOf(universoAtual);
    
    const configuracoes = {
        habilidades: { dados: universeSkills, mensagemVazio: "Nenhuma habilidade cadastrada...", tipoSincronizacao: "habilidade" },
        constituicoes: { dados: universeConstitution, mensagemVazio: "Nenhuma constituição cadastrada...", tipoSincronizacao: "constituicao" },
        armaduras: { dados: universeArmors, mensagemVazio: "Nenhuma armadura cadastrada...", tipoSincronizacao: "armadura" },
        armas: { dados: universeWepons, mensagemVazio: "Nenhuma arma cadastrada...", tipoSincronizacao: "arma" },
        consumiveis: { dados: universeConsumibles, mensagemVazio: "Nenhum consumível cadastrado...", tipoSincronizacao: "consumivel" },
        materiais: { dados: universeMaterials, mensagemVazio: "Nenhum material cadastrado...", tipoSincronizacao: "material" },
        itens_gerais: { 
            dados: universos.map((_, i) => [
                ...(universeArmors[i] || []), 
                ...(universeWepons[i] || []), 
                ...(universeConsumibles[i] || []), 
                ...(universeMaterials[i] || [])
            ]), 
            mensagemVazio: "Nenhum item cadastrado...", 
            tipoSincronizacao: "item_geral" 
        }
    };

    const configAtual = configuracoes[tipo];
    
    if (!configAtual) {
        console.error(`O tipo de menu '${tipo}' não existe nas configurações.`);
        return;
    }

    const equipados = obterEquipados(); 
    let elementosOrdenados = [];

    if (tipo === 'itens_gerais') {
        const armadurasRaw = universeArmors[universoIndex] || [];
        const armasRaw = universeWepons[universoIndex] || [];
        const consumiveisRaw = universeConsumibles[universoIndex] || [];
        const materiaisRaw = universeMaterials[universoIndex] || [];

        const ordenarSubLista = (lista) => {
            if ([3, 4, 5].includes(universoIndex)) {
                return lista.filter(item => item && item.name);
            }
            return lista.filter(item => item && item.name).sort((a, b) => {
                const pesosA = obterPesosRank(a.rank);
                const pesosB = obterPesosRank(b.rank);
                
                if (pesosB.raridade !== pesosA.raridade) { return pesosB.raridade - pesosA.raridade; }
                const comparacaoNome = a.name.localeCompare(b.name);
                if (comparacaoNome !== 0) { return comparacaoNome; }
                return pesosB.nivel - pesosA.nivel;
            });
        };

        const armadurasOrd = ordenarSubLista(armadurasRaw);
        const armasOrd = ordenarSubLista(armasRaw);
        const consumiveisOrd = ordenarSubLista(consumiveisRaw);
        const materiaisOrd = ordenarSubLista(materiaisRaw);

        if (armadurasOrd.length > 0) {
            elementosOrdenados.push({ type: "Seraparação", name: "Armaduras" });
            elementosOrdenados.push(...armadurasOrd);
        }
        if (armasOrd.length > 0) {
            elementosOrdenados.push({ type: "Seraparação", name: "Armas" });
            elementosOrdenados.push(...armasOrd);
        }
        if (consumiveisOrd.length > 0) {
            elementosOrdenados.push({ type: "Seraparação", name: "Consumíveis" });
            elementosOrdenados.push(...consumiveisOrd);
        }
        if (materiaisOrd.length > 0) {
            elementosOrdenados.push({ type: "Seraparação", name: "Materiais" });
            elementosOrdenados.push(...materiaisOrd);
        }
    } else {
        let listaElementos = configAtual.dados[universoIndex] || [];
        if (listaElementos && listaElementos.length > 0) {
            if ([3, 4, 5].includes(universoIndex)) {
                elementosOrdenados = listaElementos.filter(item => item && item.name);
            } else {
                elementosOrdenados = listaElementos.filter(item => item && item.name).sort((a, b) => {
                    const pesosA = obterPesosRank(a.rank);
                    const pesosB = obterPesosRank(b.rank);
                    
                    if (pesosB.raridade !== pesosA.raridade) { return pesosB.raridade - pesosA.raridade; }
                    const comparacaoNome = a.name.localeCompare(b.name);
                    if (comparacaoNome !== 0) { return comparacaoNome; }
                    return pesosB.nivel - pesosA.nivel;
                });
            }
        }
    }

    if (elementosOrdenados.length > 0) {
        for (let i = 0; i < elementosOrdenados.length; i++) {
            const item = elementosOrdenados[i];
            
            if (item.type === "Seraparação") {
                menu.innerHTML += `<div class="linha-com-texto">${item.name}</div>`;
                continue; 
            }
            
            const nomeTratado = item.name.replace(/'/g, "\\'");
            let nomeExibido = item.name;
            if (nomeExibido.length > 40) nomeExibido = nomeExibido.substring(0, 40) + "...";

            let classeRank = (item.rank || '').replace(/[+\-]/g, '').trim();
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

// Lógica para verificar e gerenciar o display e rowspan dos Slots Extras
function atualizarSlotsExtras() {
    const linhaExtra = document.getElementById('linha-extra');
    if (!linhaExtra) return;

    let algumCompleto = false;
    for (let c = 1; c <= maxColunas; c++) {
        const universo = universosSelecionados[c];
        const slotExtra = document.getElementById(`col${c}-habilidade-extra`);
        if (!slotExtra) continue;

        if (universo && universo.includes('Completo')) {
            algumCompleto = true;
            slotExtra.classList.remove('inativo');
            if (!slotExtra.hasAttribute('data-nome')) {
                slotExtra.innerHTML = '[Slot Extra]';
            }
        } else {
            slotExtra.classList.add('inativo');
            slotExtra.removeAttribute('data-nome');
            slotExtra.classList.remove('preenchido');
            slotExtra.innerHTML = '';
        }
    }

    linhaExtra.style.display = algumCompleto ? '' : 'none';
    
    const btnColuna = document.getElementById('btn-upgrade-coluna');
    if (btnColuna) {
        const extraSpan = algumCompleto ? 1 : 0;
        btnColuna.setAttribute('rowspan', 1 + maxLinhas + extraSpan);
    }
}

function sincronizar(nome, rank, tipo) {
    const nomeTratado = nome.replace(/'/g, "\\'");
    const classeEspecial = nome === "Espada do Vazio" ? "tema-vazio-texto" : "";

    if (tipo === 'universo') {
        universosSelecionados[coluna] = nome; 
        const id = `col${coluna}-universo`;
        const elemento = document.getElementById(id);
        
        if (elemento) elemento.innerHTML = nome; // innerHTML para manter <i Completo> funcional
        
        const escUniverso = document.getElementById('escUniverso');
        if (escUniverso) escUniverso.classList.remove('ativo');

        atualizarSlotsExtras();
        return; 
    }

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

        slotElemento.innerHTML = `<p class="${classeEspecial}">${nome} <strong class="rank${rankClassFinal}">${rank}</strong></p>`;
        
        let paramL = linha === '-extra' ? "'-extra'" : linha;
        slotElemento.setAttribute('onclick', `abrirDetalhes(${coluna}, ${paramL}, '${nomeTratado}', '${tipo}')`);
    }

    const escHabilidade = document.getElementById('escHabilidade');
    if (escHabilidade) escHabilidade.classList.remove('ativo');
}

function desvincular(c, l) {
    const slotId = `col${c}-habilidade${l}`;
    const slotElemento = document.getElementById(slotId);

    if (slotElemento) {
        slotElemento.classList.remove('preenchido');
        slotElemento.removeAttribute('data-nome'); 
        slotElemento.innerHTML = l === '-extra' ? '[Slot Extra]' : '[Selecionar]';
        const paramL = l === '-extra' ? "'-extra'" : l;
        slotElemento.setAttribute('onclick', `openModal('escCoisa', 'col${c}', ${paramL})`);
    }
    fecharModalDetalhes();
}

window.renderizarMenu = renderizarMenu;
window.sincronizar = sincronizar;
window.desvincular = desvincular;

// Função de Alterar Nível
function alterarNivel(event, habilidade, mudanca) {
    event.stopPropagation();
    if (habilidade === 'indice') {
        const elementoNivel = document.getElementById('nivel-indice');
        let nivelAtual = parseInt(
            elementoNivel.textContent.match(/\d+/)[0]
        );

        let novoNivel = nivelAtual + mudanca;
        if (novoNivel >= 1 && novoNivel <= 15) {
            elementoNivel.textContent = `[Nv-${novoNivel}]`;

            const btnInc = document.getElementById('incrementar');
            const btnDec = document.getElementById('decrementar');

            if (btnDec) btnDec.classList.toggle('desapareca', novoNivel <= 1);
            if (btnInc) btnInc.classList.toggle('desapareca', novoNivel >= 15);
            
            // Atualiza os pontos caso o nível alterado atinja um novo patamar
            verificarPontosUpgrade();
        }
    }
}
window.alterarNivel = alterarNivel;

// --- NOVO: GERENCIAMENTO DE UPGRADES DA MATRIZ ---
function verificarPontosUpgrade() {
    // A cada 5 níveis se ganha 1 ponto (Nv 5 = 1, Nv 10 = 2, Nv 15 = 3)
    const totalDisponivel = Math.floor(nivelIndice / 5);
    const pontosAtuais = totalDisponivel - escolhasFeitas;
    
    const btnColuna = document.getElementById('btn-upgrade-coluna');
    const btnLinha = document.getElementById('btn-upgrade-linha');
    const trLinha = document.getElementById('linha-btn-upgrade'); // Pega a linha (tr) inteira do botão
    
    if (pontosAtuais > 0) {
        // Mostra os botões se houver pontos
        if (btnColuna) { 
            btnColuna.style.display = ''; // Volta a aparecer (comportamento normal da tabela)
            btnColuna.innerHTML = `Aumentar<br>Coluna (${pontosAtuais})`;
        }
        if (trLinha) { 
            trLinha.style.display = ''; // Volta a exibir a linha inferior
        }
        if (btnLinha) { 
            btnLinha.innerHTML = `Aumentar Linha (${pontosAtuais})`;
        }
    } else {
        // Oculta os botões completamente se não houver pontos
        if (btnColuna) { 
            btnColuna.style.display = 'none'; 
        }
        if (trLinha) { 
            trLinha.style.display = 'none'; 
        } else if (btnLinha) {
            btnLinha.style.display = 'none'; // Fallback caso a TR não seja encontrada
        }
    }
}

function expandirColuna() {
    maxColunas++;
    const tabela = document.querySelector('.matriz-multiversal table');
    if (!tabela) return;

    // 1. Adiciona a célula de Universo ANTES do botão lateral de Aumentar Coluna
    const linhaUniverso = tabela.querySelector('tr.universo');
    const btnColuna = document.getElementById('btn-upgrade-coluna');
    if (linhaUniverso && btnColuna) {
        const th = document.createElement('th');
        th.setAttribute('onclick', `openModal('escUniverso', 'col${maxColunas}')`);
        th.setAttribute('id', `col${maxColunas}-universo`);
        th.textContent = '[Selecione o Universo]';
        linhaUniverso.insertBefore(th, btnColuna);
    }

    // 2. Adiciona células TD vazias em todas as linhas regulares (ignorando cabeçalho, linha extra e botão)
    const linhasRegulares = tabela.querySelectorAll('tr:not(.universo):not(#linha-btn-upgrade):not(#linha-extra)');
    linhasRegulares.forEach((tr, index) => {
        const numLinha = index + 1;
        const td = document.createElement('td');
        td.setAttribute('onclick', `openModal('escCoisa', 'col${maxColunas}', ${numLinha})`);
        td.setAttribute('id', `col${maxColunas}-habilidade${numLinha}`);
        td.textContent = '[Selecionar]';
        tr.appendChild(td);
    });

    // 3. Adiciona a célula correspondente ao Slot Extra
    const linhaExtra = document.getElementById('linha-extra');
    if (linhaExtra) {
        const tdExtra = document.createElement('td');
        tdExtra.setAttribute('onclick', `openModal('escCoisa', 'col${maxColunas}', '-extra')`);
        tdExtra.setAttribute('id', `col${maxColunas}-habilidade-extra`);
        tdExtra.className = 'slot-extra inativo';
        linhaExtra.appendChild(tdExtra);
    }

    // 4. Aumenta a largura do botão "Aumentar Linha" (colspan) na base da tabela
    const btnLinha = document.getElementById('btn-upgrade-linha');
    if (btnLinha) btnLinha.setAttribute('colspan', maxColunas);

    // Inicializa a memória da nova coluna
    universosSelecionados[maxColunas] = null;
    atualizarSlotsExtras();
}

function expandirLinha() {
    maxLinhas++;
    const tabela = document.querySelector('.matriz-multiversal table');
    const linhaExtra = document.getElementById('linha-extra');
    if (!tabela) return;

    // 1. Cria nova linha e preenche com a quantidade atual de colunas
    const tr = document.createElement('tr');
    for (let c = 1; c <= maxColunas; c++) {
        const td = document.createElement('td');
        td.setAttribute('onclick', `openModal('escCoisa', 'col${c}', ${maxLinhas})`);
        td.setAttribute('id', `col${c}-habilidade${maxLinhas}`);
        td.textContent = '[Selecionar]';
        tr.appendChild(td);
    }
    
    // 2. CORREÇÃO: Insere a nova linha logo ANTES da linha Extra (ou do botão, se ela não existir)
    const refNode = linhaExtra ? linhaExtra : document.getElementById('linha-btn-upgrade');
    refNode.parentNode.insertBefore(tr, refNode);

    atualizarSlotsExtras(); // Atualiza rowspan após adicionar linha
}

// --- CONTROLE DOS OUVINTES DE BOTÕES ---
window.addEventListener('DOMContentLoaded', () => {
    verificarPontosUpgrade(); // Garante o carregamento com os visuais desativados se Nv < 5

    const btnInc = document.querySelector('.habilidade .incrementar');
    const btnDec = document.querySelector('.habilidade .decrementar');
    const txtNivel = document.getElementById('nivel-indice');

    if (btnInc && btnDec && txtNivel) {
        btnInc.addEventListener('click', (e) => {
            if (nivelIndice < 15) {
                nivelIndice++;
                txtNivel.textContent = `[Nv-${nivelIndice}]`;
                verificarPontosUpgrade();
            }
        });

        btnDec.addEventListener('click', (e) => {
            // Previne a regressão se um ponto já tiver sido gasto e o novo Nível não o suportar
            const tierAnterior = Math.floor((nivelIndice - 1) / 5);
            if (tierAnterior < escolhasFeitas) {
                alert("Ação Bloqueada: Você já gastou o ponto de expansão fornecido por este patamar!");
                return;
            }

            if (nivelIndice > 1) {
                nivelIndice--;
                txtNivel.textContent = `[Nv-${nivelIndice}]`;
                verificarPontosUpgrade();
            }
        });
    }

    // Botões físicos na tabela Multiversal
    document.getElementById('btn-upgrade-coluna')?.addEventListener('click', () => {
        const totalDisponivel = Math.floor(nivelIndice / 5);
        if (escolhasFeitas < totalDisponivel) {
            expandirColuna();
            escolhasFeitas++;
            verificarPontosUpgrade();
        }
    });

    document.getElementById('btn-upgrade-linha')?.addEventListener('click', () => {
        const totalDisponivel = Math.floor(nivelIndice / 5);
        if (escolhasFeitas < totalDisponivel) {
            expandirLinha();
            escolhasFeitas++;
            verificarPontosUpgrade();
        }
    });
});