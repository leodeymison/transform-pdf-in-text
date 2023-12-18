const QuestionsQuery = "INSERT INTO `questoes` (`cadastrante`, `nome_prova`, `ano`, `numero_questao`, `conteudo`, `imagens`, `alternativas`, `gabarito`, `resolucao`, `teoria`, `banca`, `orgao_cargo`, `materia_assunto`, `area`, `escolaridade`, `formacao`) VALUES";

const AreaQuery = "INSERT INTO `area` (`nome`, `pai`) VALUES";

const BancaQuery = "INSERT INTO `banca` (`nome`) VALUES";

const FormacaoQuery = "INSERT INTO `formacao` (`nome`) VALUES";

const ProvaNameQuery = "INSERT INTO `nome_prova` (`nome`, `anos`) VALUES";

const OrgaoQuery = "INSERT INTO `orgao_cargo` (`nome`, `pai`) VALUES";

module.exports = {
    QuestionsQuery,
    AreaQuery,
    BancaQuery,
    FormacaoQuery,
    ProvaNameQuery,
    OrgaoQuery
}