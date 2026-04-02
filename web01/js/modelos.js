// Modelagem de Dados Baseadas nas Entidades (Tabelas)

class Usuario {
    constructor(idUsuario, nomeCompleto, email, senhaHash) {
        this.idUsuario = idUsuario;
        this.nomeCompleto = nomeCompleto;
        this.email = email;
        this.senhaHash = senhaHash;
        this.dataCadastro = new Date().toISOString();
    }
}

class Categoria {
    constructor(idCategoria, nome, descricao) {
        this.idCategoria = idCategoria;
        this.nome = nome;
        this.descricao = descricao;
    }
}

class Curso {
    constructor(idCurso, titulo, descricao, idInstrutor, idCategoria, nivel, totalAulas, totalHoras) {
        this.idCurso = idCurso;
        this.titulo = titulo;
        this.descricao = descricao;
        this.idInstrutor = idInstrutor;
        this.idCategoria = idCategoria;
        this.nivel = nivel;
        this.dataPublicacao = new Date().toISOString();
        this.totalAulas = totalAulas;
        this.totalHoras = totalHoras;
    }
}

class Modulo {
    constructor(idModulo, idCurso, titulo, ordem) {
        this.idModulo = idModulo;
        this.idCurso = idCurso;
        this.titulo = titulo;
        this.ordem = ordem;
    }
}

class Aula {
    constructor(idAula, idModulo, titulo, tipoConteudo, urlConteudo, duracaoMinutos, ordem) {
        this.idAula = idAula;
        this.idModulo = idModulo;
        this.titulo = titulo;
        this.tipoConteudo = tipoConteudo;
        this.urlConteudo = urlConteudo;
        this.duracaoMinutos = duracaoMinutos;
        this.ordem = ordem;
    }
}

class Matricula {
    constructor(idMatricula, idUsuario, idCurso) {
        this.idMatricula = idMatricula;
        this.idUsuario = idUsuario;
        this.idCurso = idCurso;
        this.dataMatricula = new Date().toISOString();
        this.dataConclusao = null;
    }
}

class ProgressoAula {
    constructor(idUsuario, idAula, status) {
        this.idUsuario = idUsuario;
        this.idAula = idAula;
        this.dataConclusao = status === 'Concluído' ? new Date().toISOString() : null;
        this.status = status;
    }
}

class Avaliacao {
    constructor(idAvaliacao, idUsuario, idCurso, nota, comentario) {
        this.idAvaliacao = idAvaliacao;
        this.idUsuario = idUsuario;
        this.idCurso = idCurso;
        this.nota = nota;
        this.comentario = comentario;
        this.dataAvaliacao = new Date().toISOString();
    }
}

class Trilha {
    constructor(idTrilha, titulo, descricao, idCategoria) {
        this.idTrilha = idTrilha;
        this.titulo = titulo;
        this.descricao = descricao;
        this.idCategoria = idCategoria;
    }
}

class TrilhaCurso {
    constructor(idTrilha, idCurso, ordem) {
        this.idTrilha = idTrilha;
        this.idCurso = idCurso;
        this.ordem = ordem;
    }
}

class Certificado {
    constructor(idCertificado, idUsuario, idCurso, idTrilha, codigoVerificacao) {
        this.idCertificado = idCertificado;
        this.idUsuario = idUsuario;
        this.idCurso = idCurso;
        this.idTrilha = idTrilha;
        this.codigoVerificacao = codigoVerificacao;
        this.dataEmissao = new Date().toISOString();
    }
}

class Plano {
    constructor(idPlano, nome, descricao, preco, duracaoMeses) {
        this.idPlano = idPlano;
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.duracaoMeses = duracaoMeses;
    }
}

class Assinatura {
    constructor(idAssinatura, idUsuario, idPlano, dataInicio, dataFim) {
        this.idAssinatura = idAssinatura;
        this.idUsuario = idUsuario;
        this.idPlano = idPlano;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
    }
}

class Pagamento {
    constructor(idPagamento, idAssinatura, valorPago, metodoPagamento, idTransacaoGateway, dataFim) {
        this.idPagamento = idPagamento;
        this.idAssinatura = idAssinatura;
        this.valorPago = valorPago;
        this.dataPagamento = new Date().toISOString();
        this.metodoPagamento = metodoPagamento;
        this.idTransacaoGateway = idTransacaoGateway;
        this.dataFim = dataFim;
    }
}
