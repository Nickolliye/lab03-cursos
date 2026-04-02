// Lógica do Módulo Financeiro

document.addEventListener('DOMContentLoaded', () => {
    carregarUsuariosCheckout();
    carregarPlanosCheckout();
});

document.getElementById('formCheckout').addEventListener('submit', btnFinalizarPagamento);

function gerarId(tabela) {
    const itens = listarRegistros(tabela);
    return itens.length > 0 ? itens[itens.length - 1][Object.keys(itens[0])[0]] + 1 : 1;
}

function carregarUsuariosCheckout() {
    const usuarios = listarRegistros('usuarios');
    let html = '<option value="">-- Selecione o Usuário --</option>';
    usuarios.forEach(u => { html += `<option value="${u.idUsuario}">${u.nomeCompleto} (${u.email})</option>`; });
    document.getElementById('checkoutUsuario').innerHTML = html;
}

function carregarPlanosCheckout() {
    const planos = listarRegistros('planos');
    let html = '<option value="">-- Escolha um Plano --</option>';
    planos.forEach(p => { 
        html += `<option value="${p.idPlano}" data-preco="${p.preco.toFixed(2)}">${p.nome} - ${p.duracaoMeses} Meses</option>`; 
    });
    document.getElementById('checkoutPlano').innerHTML = html;
}

function renderizarPreco() {
    const select = document.getElementById('checkoutPlano');
    const valorSpan = document.getElementById('checkoutValor');
    
    if(select.selectedIndex === 0){
        valorSpan.innerText = '0,00';
    }else{
        const preco = select.options[select.selectedIndex].getAttribute('data-preco');
        valorSpan.innerText = preco.replace('.', ',');
    }
}

function btnFinalizarPagamento(e) {
    e.preventDefault();
    
    const idUsuario = parseInt(document.getElementById('checkoutUsuario').value);
    const idPlano = parseInt(document.getElementById('checkoutPlano').value);
    const metodo = document.getElementById('checkoutMetodo').value;
    
    const selectP = document.getElementById('checkoutPlano');
    const valorPago = parseFloat(selectP.options[selectP.selectedIndex].getAttribute('data-preco'));
    
    const planoRef = listarRegistros('planos').find(p => p.idPlano === idPlano);
    
    const trxID = 'TRX-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    
    // Calcula datas do plano
    const dataAtual = new Date();
    const dataFim = new Date();
    dataFim.setMonth(dataFim.getMonth() + planoRef.duracaoMeses);
    
    // Gerar objeto Assinatura
    const novaAssin = new Assinatura(gerarId('assinaturas'), idUsuario, idPlano, dataAtual.toISOString(), dataFim.toISOString());
    inserirRegistro('assinaturas', novaAssin);
    
    // Gerar objeto Pagamento
    const novoPag = new Pagamento(gerarId('pagamentos'), novaAssin.idAssinatura, valorPago, metodo, trxID, dataFim.toISOString());
    inserirRegistro('pagamentos', novoPag);
    
    // Exibe Recibo Simulando Compra
    document.getElementById('reciboTrx').innerText = trxID;
    document.getElementById('reciboMetodo').innerText = metodo;
    document.getElementById('reciboValor').innerText = valorPago.toFixed(2).replace('.', ',');
    
    document.getElementById('cardRecibo').style.display = 'block';
    
    alert('Pagamento aprovado e assinatura ativa!');
    document.getElementById('formCheckout').reset();
    renderizarPreco();
}
