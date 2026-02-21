# Microsserviço de Vendas (Sales)

Microsserviço responsável pelo cadastro de eventos e venda de ingressos.

## Tecnologias
- Java
- Spring Boot
- Spring Data JPA
- H2 Database

## Porta
Aplicação configurada para rodar na porta 4000.

## Como executar
1. Rodar o Gateway na porta 8080
2. Rodar a SalesApplication na porta 4000
3. Iniciar o Frontend

## Console do banco
http://localhost:4000/h2-console


****Importante para a execução: sempre colocar a data no formato LocalDateTime (ex 2026-03-20T20:00:00). Configurei assim no começo e fiquei com medo de alterar e algo se desregular, então sempre que for preencher o front, siga este formato. Sei que não é funcional para um projeto real, mas como a ideia aqui era apenas funcionar, mantive desta maneira.
