// Banco de Dados em Memória (usando localStorage para persistir entre as páginas)

const BANCO_DE_DADOS_CHAVE = 'DB_CURSOS_PLATAFORMA';

// Estrutura inicial do "Banco de Dados"
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
    return JSON.parse(localStorage.getItem(BANCO_DE_DADOS_CHAVE));
}

function salvarBancoDados(dados) {
    localStorage.setItem(BANCO_DE_DADOS_CHAVE, JSON.stringify(dados));
}

function obterDados() {
    return JSON.parse(localStorage.getItem(BANCO_DE_DADOS_CHAVE));
}

// Funções genéricas de inserção e listagem
function inserirRegistro(tabela, registro) {
    const dados = obterDados();
    dados[tabela].push(registro);
    salvarBancoDados(dados);
}

function listarRegistros(tabela) {
    const dados = obterDados();
    return dados[tabela];
}

// Inicializa no carregamento global do script
inicializarBancoDados();
