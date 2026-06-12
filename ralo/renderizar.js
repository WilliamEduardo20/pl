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
    
    const equipados = obterEquipados(); // NOVO: Puxa a lista de bloqueio

    if (listaHabilidades && listaHabilidades.length > 0) {
        for (let i = 0; i < listaHabilidades.length; i++) {
            const habilidade = listaHabilidades[i];
            if (!habilidade.name) continue; 

            const nomeTratado = habilidade.name.replace(/'/g, "\\'");
            let classeRank = habilidade.rank.replace(/[+\-]/g, '').trim();
            if (classeRank == '???' || classeRank == '??' || classeRank == '?') classeRank = 'Desconecido';
            if (classeRank === 'Lv.1' || classeRank === 'Lv.2') classeRank = 'Lv';
            if (classeRank  == 'Lv.MAX') classeRank = 'MAX';

            // NOVO: Verifica se já está em uso
            if (equipados.includes(habilidade.name)) {
                menu.innerHTML += `
                    <p class="habilidade" style="opacity: 0.4; cursor: not-allowed;">
                        ${habilidade.name} <strong class="direita" style="color: #94a3b8;">[Equipado]</strong>
                    </p>`;
            } else {
                menu.innerHTML += `
                    <p class="habilidade" onclick="sincronizarHabilidade('${nomeTratado}', '${habilidade.rank}')">
                        ${habilidade.name} <strong class="rank${classeRank.replace(/Nv\.\d+/g, "Lv").replace("Nv.MAX", "Épico")} direita">[${habilidade.rank}]</strong>
                    </p>`;
            }
        }
    } else {
        menu.innerHTML = `<p class="descricao" style="text-align:center; padding: 20px;">Nenhuma habilidade cadastrada para este universo ainda.</p>`;
    }
}

function renderizarMenuItems() {
    const menu = document.getElementById("menu-habilidades"); 
    if (!menu) return;
    menu.innerHTML = ""; 

    const universoAtual = universosSelecionados[coluna];
    const universoIndex = universos.indexOf(universoAtual);
    const listaItens = universeItens[universoIndex];
    
    const equipados = obterEquipados(); // NOVO: Puxa a lista de bloqueio

    if (listaItens && listaItens.length > 0) {
        for (let i = 0; i < listaItens.length; i++) {
            const item = listaItens[i];
            if (!item.name) continue; 

            const nomeTratado = item.name.replace(/'/g, "\\'");
            let classeRank = item.rank.replace(/[+\-]/g, '').trim();
            if (classeRank === '???') classeRank = 'Desconecido';

            // NOVO: Verifica se já está em uso
            if (equipados.includes(item.name)) {
                menu.innerHTML += `
                    <p class="habilidade" style="opacity: 0.4; cursor: not-allowed;">
                        ${item.name} <strong class="direita" style="color: #94a3b8;">[Equipado]</strong>
                    </p>`;
            } else {
                menu.innerHTML += `
                    <p class="habilidade" onclick="sincronizarItem('${nomeTratado}', '${item.rank}')">
                        ${item.name} <strong class="rank${classeRank.replace(/Nv\.\d+/g, "Lv").replace("Nv.MAX", "Épico")} direita">[${item.rank}]</strong>
                    </p>`;
            }
        }
    } else {
        menu.innerHTML = `<p class="descricao" style="text-align:center; padding: 20px;">Nenhum item cadastrado para este universo ainda.</p>`;
    }
}

function renderizarMenuConstituicoes() {
    const menu = document.getElementById("menu-habilidades"); 
    if (!menu) return;
    menu.innerHTML = ""; 

    const universoAtual = universosSelecionados[coluna];
    const universoIndex = universos.indexOf(universoAtual);
    const listaConst = universeConstitution[universoIndex];
    
    const equipados = obterEquipados(); 

    if (listaConst && listaConst.length > 0) {
        for (let i = 0; i < listaConst.length; i++) {
            const constituicao = listaConst[i];
            if (!constituicao.name) continue; 

            const nomeTratado = constituicao.name.replace(/'/g, "\\'");
            let classeRank = constituicao.rank.replace(/[+\-]/g, '').trim();
            if (classeRank === '???') classeRank = 'Desconecido';

            // Se você usou o corte de letras no item (Javascript), use aqui também:
            let nomeExibido = constituicao.name;
            if (nomeExibido.length > 40) nomeExibido = nomeExibido.substring(0, 40) + "...";

            if (equipados.includes(constituicao.name)) {
                menu.innerHTML += `
                    <p class="habilidade" style="opacity: 0.4; cursor: not-allowed;">
                        ${nomeExibido} <strong class="direita" style="color: #94a3b8;">[Equipado]</strong>
                    </p>`;
            } else {
                menu.innerHTML += `
                    <p class="habilidade" onclick="sincronizarConstituicao('${nomeTratado}', '${constituicao.rank}')">
                        ${nomeExibido} <strong class="rank${classeRank} direita">[${constituicao.rank}]</strong>
                    </p>`;
            }
        }
    } else {
        menu.innerHTML = `<p class="descricao" style="text-align:center; padding: 20px;">Nenhuma constituição cadastrada para este universo ainda.</p>`;
    }
}