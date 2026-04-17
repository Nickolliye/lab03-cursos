class FinanceiroService {
    static gerarId(tabela) {
        const itens = listarRegistros(tabela);
        return itens.length > 0 ? itens[itens.length - 1][Object.keys(itens[0])[0]] + 1 : 1;
    }

    static listarPlanos() {
        return listarRegistros('planos');
    }

    static realizarPagamento(idUsuario, idPlano, metodo) {
        const planoRef = this.listarPlanos().find(p => p.idPlano === parseInt(idPlano));
        if (!planoRef) throw new Error("Plano não encontrado");

        const trxID = 'TRX-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        
        const dataAtual = new Date();
        const dataFim = new Date();
        dataFim.setMonth(dataFim.getMonth() + planoRef.duracaoMeses);
        
        const novaAssin = new Assinatura(
            this.gerarId('assinaturas'), 
            parseInt(idUsuario), 
            parseInt(idPlano), 
            dataAtual.toISOString(), 
            dataFim.toISOString()
        );
        inserirRegistro('assinaturas', novaAssin);
        
        const novoPag = new Pagamento(
            this.gerarId('pagamentos'), 
            novaAssin.idAssinatura, 
            planoRef.preco, 
            metodo, 
            trxID, 
            dataFim.toISOString()
        );
        inserirRegistro('pagamentos', novoPag);
        
        return { assinatura: novaAssin, pagamento: novoPag };
    }
}
