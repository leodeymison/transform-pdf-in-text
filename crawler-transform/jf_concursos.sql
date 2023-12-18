CREATE DATABASE IF NOT EXISTS if_concursos;

USE if_concursos;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

DROP TABLE IF EXISTS `area`;
CREATE TABLE IF NOT EXISTS `area` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` text NOT NULL,
  `pai` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `area` (`id`, `nome`, `pai`) VALUES
(12, 'Analista', 'main');

DROP TABLE IF EXISTS `banca`;
CREATE TABLE IF NOT EXISTS `banca` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(240) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `banca` (`id`, `nome`) VALUES
(11, 'CESPE');

DROP TABLE IF EXISTS `cadernos`;
CREATE TABLE IF NOT EXISTS `cadernos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(120) NOT NULL,
  `id_proprietario` int NOT NULL,
  `questoes` text NOT NULL,
  `resolucao` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `cadernos` (`id`, `nome`, `id_proprietario`, `questoes`, `resolucao`) VALUES
(18, 'nome', 1, '[131,132,133,134]', '[{\"131\":0,\"132\":2,\"133\":1,\"134\":3}]'),
(17, 'meu caderno', 1, '[131,132,133,134]', '[]');

DROP TABLE IF EXISTS `escolaridade`;
CREATE TABLE IF NOT EXISTS `escolaridade` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(240) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `escolaridade` (`id`, `nome`) VALUES
(16, 'Ensino Médio'),
(13, 'fundamental'),
(15, 'Ensino Fundamental'),
(14, 'Doutorado'),
(17, 'Especialização'),
(18, 'Mestrado'),
(19, 'Superior');

DROP TABLE IF EXISTS `formacao`;
CREATE TABLE IF NOT EXISTS `formacao` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `formacao` (`id`, `nome`) VALUES
(6, 'Administração'),
(7, 'Arquitetura'),
(8, 'Engenharia Civil');

DROP TABLE IF EXISTS `materia_assunto`;
CREATE TABLE IF NOT EXISTS `materia_assunto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` text NOT NULL,
  `pai` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `materia_assunto` (`id`, `nome`, `pai`) VALUES
(2, 'Administração de Recursos Materiais', 'main'),
(3, 'Classificação de Materiais', 'Administração de Recursos Materiais');

DROP TABLE IF EXISTS `nome_prova`;
CREATE TABLE IF NOT EXISTS `nome_prova` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(240) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `anos` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `nome_prova` (`id`, `nome`, `anos`) VALUES
(10, 'SERPRO', '[2013]');

DROP TABLE IF EXISTS `orgao_cargo`;
CREATE TABLE IF NOT EXISTS `orgao_cargo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` text NOT NULL,
  `pai` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `orgao_cargo` (`id`, `nome`, `pai`) VALUES
(15, 'ADI (ABDI)', 'ABDI - Agência Brasileira de Desenvolvimento Industrial'),
(14, 'ABDI - Agência Brasileira de Desenvolvimento Industrial', 'main'),
(16, 'ABEPRO - Associação Brasileira de Engenharia de Produção', 'main'),
(17, 'Teste (ABEPRO)', 'ABEPRO - Associação Brasileira de Engenharia de Produção'),
(18, 'Edital 001 - 2017', 'Teste (ABEPRO)');

DROP TABLE IF EXISTS `questoes`;
CREATE TABLE IF NOT EXISTS `questoes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cadastrante` varchar(30) COLLATE utf8mb3_unicode_ci NOT NULL,
  `nome_prova` varchar(240) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `ano` int NOT NULL,
  `numero_questao` int NOT NULL,
  `conteudo` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `imagens` text COLLATE utf8mb3_unicode_ci NOT NULL,
  `alternativas` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `gabarito` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `resolucao` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `teoria` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `banca` varchar(120) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `orgao_cargo` varchar(120) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `materia_assunto` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `area` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `escolaridade` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `formacao` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=135 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

INSERT INTO `questoes` (`id`, `cadastrante`, `nome_prova`, `ano`, `numero_questao`, `conteudo`, `imagens`, `alternativas`, `gabarito`, `resolucao`, `teoria`, `banca`, `orgao_cargo`, `materia_assunto`, `area`, `escolaridade`, `formacao`) VALUES
(131, 'painel_adm', 'SERPRO', 2013, 2, 'ccs', '0', '[\"asa\",\"caca\"]', '1', 'reas', 'rerere', 'CESPE', 'ABDI - Agência Brasileira de Desenvolvimento Industrial', 'Administração de Recursos Materiais', 'Analista', 'fundamental', 'Arquitetura'),
(132, 'painel_adm', 'SERPRO', 2013, 2, 'Acerca das diferentes modalidades profissionais da engenharia e\r\ncom base na Resolução CONFEA n.º 218/1973, julgue os itens\r\nseguintes.\r\n', '0', '[\" Em obras e projetos de pequeno vulto, o engenheiro poderá exercer atividades de modalidade diferente daquela de sua formação, cabendo somente a ele julgar se possui ou não capacidade técnica para atuar na referida obra ou projeto.\",\"Por se tratar de atividade comercial, o orçamento de obras pode ser elaborado por profissionais de diversas áreas, conforme conveniência da empresa executora.\",\"Na execução de obras, a condução da equipe de instalação ou montagem pode ser desempenhada por engenheiro ou técnico de grau médio, desde que dentro de sua modalidade de formação.\"]', '2', 'resolucao', 'teoria', 'CESPE', 'ABEPRO - Associação Brasileira de Engenharia de Produção', 'Administração de Recursos Materiais', 'Analista', 'fundamental', 'Engenharia Civil'),
(133, 'painel_adm', 'SERPRO', 2013, 3, 'A respeito do Código de Ética Profissional de Engenharia, julgue\r\nos itens a seguir.\r\n', '0', '[\"É conduta vedada pelo código de ética a imposição, por parte do profissional, de ritmo de trabalho excessivo sobre os colaboradores, mesmo com acréscimo de remuneração.\",\"O princípio ético da liberdade e segurança profissionais fundamenta que a profissão de engenheiro é de livre exercício aos qualificados.\"]', '1', 'resolucao', 'teoria', 'CESPE', 'ADI (ABDI)', 'Administração de Recursos Materiais', 'Analista', 'Ensino Fundamental', 'Arquitetura'),
(134, 'painel_adm', 'SERPRO', 2013, 4, 'Com relação a anotação de responsabilidade técnica (ART) sobre\r\natividades de engenharia, julgue os itens subsecutivos.\r\n', '0', '[\"As anotações de responsabilidade técnica de determinado empreendimento devem ser vinculadas à ART inicial, com o objetivo de facilitar a identificação da rede de responsabilidades técnicas da obra ou serviço.\",\"O contratante poderá requerer a baixa da ART de um serviço, desde que comprove a falta de iniciativa do profissional em fazê-lo.\",\"Nas atividades realizadas por engenheiros em funções da administração pública, a ART é dispensável se houver publicação em boletim administrativo.\",\"O profissional tem até a data de conclusão das atividades técnicas para elaborar a ART e efetuar o recolhimento do valor correspondente.\"]', '2', 'resolucao', 'teoria', 'CESPE', 'ABDI - Agência Brasileira de Desenvolvimento Industrial', 'Administração de Recursos Materiais', 'Analista', 'fundamental', 'Engenharia Civil');

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(240) NOT NULL,
  `email` text NOT NULL,
  `senha` text NOT NULL,
  `token` text NOT NULL,
  `tipo` varchar(30) NOT NULL,
  `plano` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cadernos` text NOT NULL,
  `questoes_feitas` int NOT NULL,
  `acertos` int NOT NULL,
  `erros` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` (`id`, `nome`, `email`, `senha`, `token`, `tipo`, `plano`, `cadernos`, `questoes_feitas`, `acertos`, `erros`) VALUES
(1, 'arthur_dev', 'dev@gmail.com', '123', '92162db3018874c82222369c8ac48002f3b5c3cc1ba9a13307f09389fbe6d792', 'desenvolvedor', 'Gratuito', '[17,18]', 0, 0, 0),
(2, 'arthur_usuario', 'arthur@gmail.com', '123', '78ef786afb581769aa0df21ebf71e3394046462941db1f540c8d9eb0a7a2bda6', 'usuario', 'Gratuito', '[]', 0, 0, 0),
(3, 'Arthur', 'arthur2@gmail.com', '123', '9d3475df14cfdcae3306d731e2393c8298a9d33bf246745676eb3dd6145c845a', 'usuario', 'Gratuito', '[]', 0, 0, 0),
(4, 'Artjir', 'arthur3@gmail.com', '123', 'f27061c39db36194b3ea52f4ffda57ee3671142d2c027aa22d6780cae2ad96b9', 'usuario', 'Gratuito', '[]', 0, 0, 0),
(5, 'jhonathan', 'jhonathan@gmail.com', '123', 'df78763b0467cdb2ac2213ab524381a1101cac006e89fa955b9b7ea4444efa30', 'usuario', 'Gratuito', '[]', 0, 0, 0),
(6, 'teste', 'testemda@gmail.com', '123', '', 'usuario', 'Gratuito', '[]', 0, 0, 0);
COMMIT;
