const BANCO_DE_DADOS_CHAVE = 'DB_CURSOS_PLATAFORMA';

function inicializarBancoDados() {
    let dados = localStorage.getItem(BANCO_DE_DADOS_CHAVE);
    if (!dados) {
        dados = {
            usuarios: [],
            categorias: [],
            cursos: [],
            modulos: [],
            aulas: [],
            matriculas: [],
            progressoAulas: [],
            avaliacoes: [],
            trilhas: [],
            trilhasCursos: [],
            certificados: [],
            planos: [
                new Plano(1, 'Básico', 'Acesso aos cursos iniciais', 29.90, 1),
                new Plano(2, 'Premium', 'Acesso irrestrito', 99.90, 6)
            ],
            assinaturas: [],
            pagamentos: []
        };
        salvarBancoDados(dados);
    }
    
    let obj = JSON.parse(localStorage.getItem(BANCO_DE_DADOS_CHAVE));
    
    if (obj.categorias.length === 0) {
        obj.categorias.push({ idCategoria: 1, nome: "Geral", descricao: "Categoria Geral para Cursos" });
    }
    
    // Força existirem apenas os cursos CSS de ID 1 e BigData, com link direto da imagem conforme solicitado pelo usuário
    obj.cursos = [
        { idCurso: 1, titulo: "CSS", descricao: "Estilização de páginas web com CSS.", idInstrutor: 1, idCategoria: 1, nivel: "Intermediário", dataPublicacao: new Date().toISOString(), totalAulas: 12, totalHoras: 24, imagem: './img/css.jpg' },
        { idCurso: 2, titulo: "BigData", descricao: "Aprenda tudo sobre Big Data.", idInstrutor: 1, idCategoria: 1, nivel: "Avançado", dataPublicacao: new Date().toISOString(), totalAulas: 15, totalHoras: 30, imagem: './img/bigdata.jpg' }
    ];
    
    salvarBancoDados(obj);
    
    return JSON.parse(localStorage.getItem(BANCO_DE_DADOS_CHAVE));
}

function salvarBancoDados(dados) {
    localStorage.setItem(BANCO_DE_DADOS_CHAVE, JSON.stringify(dados));
}

function obterDados() {
    return JSON.parse(localStorage.getItem(BANCO_DE_DADOS_CHAVE));
}

function inserirRegistro(tabela, registro) {
    const dados = obterDados();
    dados[tabela].push(registro);
    salvarBancoDados(dados);
}

function listarRegistros(tabela) {
    const dados = obterDados();
    return dados[tabela];
}

inicializarBancoDados();
