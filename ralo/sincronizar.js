function sincronizarUniverso(universo) {
    universosSelecionados[coluna] = universo;
    const id = `col${coluna}-universo`;
    document.getElementById(id).textContent = universo;
    document.getElementById('escUniverso').classList.remove('ativo');
}
window.sincronizarUniverso = sincronizarUniverso;

function sincronizarHabilidade(nomeHabilidade, rank) {
    const slotId = `col${coluna}-habilidade${linha}`;
    const slotElemento = document.getElementById(slotId);
    
    if (slotElemento) {
        slotElemento.classList.add('preenchido');
        slotElemento.setAttribute('data-nome', nomeHabilidade);

        // Tratamento de aspas para evitar quebra no JavaScript
        const nomeTratado = nomeHabilidade.replace(/'/g, "\\'");

        // HIGIENIZAÇÃO DO RANK
        let classeRank = rank.replace(/[+\-]/g, '').trim();
        if (classeRank == '???' || classeRank == '??' || classeRank == '?') classeRank = 'Desconecido';
        if (classeRank === 'Lv.1' || classeRank === 'Lv.2') classeRank = 'Lv';
        if (classeRank  == 'Lv.MAX') classeRank = 'MAX';

        // Injeta o HTML e a classe
        slotElemento.innerHTML = `<p>${nomeHabilidade} <strong class="rank${classeRank.replace(/Nv\.\d+/g, "Lv").replace("Nv.MAX", "Épico")}">${rank}</strong></p>`;

        // MUDANÇA: Altera o clique da célula para ABRIR OS DETALHES em vez de escolher uma nova
        slotElemento.setAttribute('onclick', `abrirDetalhes(${coluna}, ${linha}, '${nomeTratado}', 'habilidade')`);
    }
    document.getElementById('escHabilidade').classList.remove('ativo');
}

function sincronizarItem(nomeItem, rank) {
    const slotId = `col${coluna}-habilidade${linha}`; 
    const slotElemento = document.getElementById(slotId);
    
    if (slotElemento) {
        slotElemento.classList.add('preenchido');
        slotElemento.setAttribute('data-nome', nomeItem);
        const nomeTratado = nomeItem.replace(/'/g, "\\'");

        let classeRank = rank.replace(/[+\-]/g, '').trim();
        if (classeRank === '???') classeRank = 'Desconecido';

        slotElemento.innerHTML = `<p>${nomeItem} <strong class="rank${classeRank.replace(/Nv\.\d+/g, "Lv").replace("Nv.MAX", "Épico")}">${rank}</strong></p>`;
        
        // Passa o tipo 'item' para o clique de detalhes
        slotElemento.setAttribute('onclick', `abrirDetalhes(${coluna}, ${linha}, '${nomeTratado}', 'item')`);
    }

    document.getElementById('escHabilidade').classList.remove('ativo');
}

function sincronizarConstituicao(nomeConst, rank) {
    const slotId = `col${coluna}-habilidade${linha}`; 
    const slotElemento = document.getElementById(slotId);
    
    if (slotElemento) {
        slotElemento.classList.add('preenchido');
        slotElemento.setAttribute('data-nome', nomeConst); // Para o bloqueio de duplicadas
        
        const nomeTratado = nomeConst.replace(/'/g, "\\'");
        let classeRank = rank.replace(/[+\-]/g, '').trim();
        if (classeRank === '???') classeRank = 'Desconecido';

        slotElemento.innerHTML = `<p>${nomeConst} <strong class="rank${classeRank}">${rank}</strong></p>`;
        
        // Passa o tipo 'constituicao' para a janela de detalhes
        slotElemento.setAttribute('onclick', `abrirDetalhes(${coluna}, ${linha}, '${nomeTratado}', 'constituicao')`);
    }

    document.getElementById('escHabilidade').classList.remove('ativo');
}