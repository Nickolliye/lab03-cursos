class CursoService {
    static gerarId(tabela) {
        const itens = listarRegistros(tabela);
        return itens.length > 0 ? itens[itens.length - 1][Object.keys(itens[0])[0]] + 1 : 1;
    }

    static salvarCategoria(nome, descricao) {
        const novaCat = new Categoria(this.gerarId('categorias'), nome, descricao);
        inserirRegistro('categorias', novaCat);
        return novaCat;
    }

    static listarCategorias() {
        return listarRegistros('categorias');
    }

    static salvarCurso(titulo, descricao, idCategoria, nivel) {

        const novoCurso = new Curso(this.gerarId('cursos'), titulo, descricao, 0, idCategoria, nivel, 0, 0);
        inserirRegistro('cursos', novoCurso);
        return novoCurso;
    }

    static listarCursos(filtroIdCat = null) {
        let cursos = listarRegistros('cursos');
        if (filtroIdCat) {
            cursos = cursos.filter(c => c.idCategoria === parseInt(filtroIdCat));
        }
        return cursos;
    }

    static salvarModulo(idCurso, titulo, ordem) {
        const mod = new Modulo(this.gerarId('modulos'), parseInt(idCurso), titulo, parseInt(ordem));
        inserirRegistro('modulos', mod);
        return mod;
    }

    static listarModulos(idCurso = null) {
        let modulos = listarRegistros('modulos');
        if (idCurso) {
            modulos = modulos.filter(m => m.idCurso === parseInt(idCurso));
        }
        return modulos;
    }

    static salvarAula(idModulo, titulo, duracao, ordem) {
        const aula = new Aula(this.gerarId('aulas'), parseInt(idModulo), titulo, 'Vídeo', '', parseInt(duracao), parseInt(ordem));
        inserirRegistro('aulas', aula);
        return aula;
    }

    static listarAulas(idModulo = null) {
        let aulas = listarRegistros('aulas');
        if (idModulo) {
            aulas = aulas.filter(a => a.idModulo === parseInt(idModulo));
        }
        return aulas;
    }

    static salvarTrilha(titulo, descricao, idCategoria) {
        const novaTri = new Trilha(this.gerarId('trilhas'), titulo, descricao, parseInt(idCategoria));
        inserirRegistro('trilhas', novaTri);
        return novaTri;
    }

    static listarTrilhas() {
        return listarRegistros('trilhas');
    }
}
