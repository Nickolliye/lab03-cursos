document.addEventListener('DOMContentLoaded', () => {
    carregarUsuarioLogadoInfo();
    carregarPlanosCheckout();
});

const formCheckout = document.getElementById('formCheckout');
if(formCheckout) {
    formCheckout.addEventListener('submit', btnFinalizarPagamento);
}

function carregarUsuarioLogadoInfo() {
    const infoSpan = document.getElementById('infoUsuarioCheckout');
    if(!infoSpan) return;

    if(!window.obterUsuarioLogado) {
        infoSpan.innerHTML = `<span class="text-danger">Aviso: Módulo de Usuário não carregado.</span>`;
        return;
    }

    const usu = window.obterUsuarioLogado();
    if(usu) {
        infoSpan.innerHTML = `<strong>Logado como:</strong> ${usu.nomeCompleto} (${usu.email})`;
    } else {
        infoSpan.innerHTML = `<span class="text-danger">Atenção: Você não está logado! Simule o login na página de Contato.</span>`;
    }
}

function carregarPlanosCheckout() {
    const select = document.getElementById('checkoutPlano');
    if(!select) return;

    const planos = FinanceiroService.listarPlanos();
    let html = '<option value="">-- Escolha um Plano --</option>';
    planos.forEach(p => { 
        html += `<option value="${p.idPlano}" data-preco="${p.preco.toFixed(2)}">${p.nome} - R$ ${p.preco.toFixed(2)} (${p.duracaoMeses} Meses)</option>`; 
    });
    select.innerHTML = html;
}

window.renderizarPreco = function() {
    const select = document.getElementById('checkoutPlano');
    const valorSpan = document.getElementById('checkoutValor');
    if(!select || !valorSpan) return;
    
    if(select.selectedIndex === 0){
        valorSpan.innerText = '0,00';
    }else{
        const preco = select.options[select.selectedIndex].getAttribute('data-preco');
        valorSpan.innerText = preco.replace('.', ',');
    }
}

function btnFinalizarPagamento(e) {
    e.preventDefault();
    
    if(!window.obterUsuarioLogado) return;
    const usu = window.obterUsuarioLogado();
    
    if(!usu) {
        alert("Para realizar o checkout, você precisa estar logado! Vá para a aba Contato e simule um login.");
        return;
    }

    const idPlano = document.getElementById('checkoutPlano').value;
    const metodo = document.getElementById('checkoutMetodo').value;
    
    if(!idPlano) return;

    try {
        const result = FinanceiroService.realizarPagamento(usu.idUsuario, idPlano, metodo);
        
        document.getElementById('reciboTrx').innerText = result.pagamento.idTransacaoGateway;
        document.getElementById('reciboMetodo').innerText = result.pagamento.metodoPagamento;
        document.getElementById('reciboValor').innerText = result.pagamento.valorPago.toFixed(2).replace('.', ',');
        
        document.getElementById('cardRecibo').style.display = 'block';
        
        alert('Pagamento aprovado e assinatura ativa!');
        formCheckout.reset();
        window.renderizarPreco();
    } catch (error) {
        alert(error.message);
    }
}
