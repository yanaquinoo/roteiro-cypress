/// <reference types="cypress" />

describe('TodoMVC E2E Tests', () => {
  beforeEach(() => {
    // Ajuste a URL caso seu servidor dev rode em outra porta
    cy.visit('http://localhost:7001');
  });

  // --- Teste já existente (exemplo do roteiro) ---
  it('Deve adicionar uma nova tarefa e verificar que ela aparece na lista', () => {
    // Insere uma tarefa no campo "What needs to be done?"
    cy.get('.new-todo')
      .type('Comprar leite{enter}');

    // Verifica se aparece exatamente 1 item na lista
    cy.get('.todo-list li')
      .should('have.length', 1)
      .and('contain', 'Comprar leite');

    // Insere mais uma tarefa e verifica lista de 2 itens
    cy.get('.new-todo')
      .type('Enviar e-mail{enter}');
    cy.get('.todo-list li')
      .should('have.length', 2)
      .then($itens => {
        // Verifica que o primeiro item seja "Comprar leite" e o segundo "Enviar e-mail"
        expect($itens.eq(0)).to.contain('Comprar leite');
        expect($itens.eq(1)).to.contain('Enviar e-mail');
      });
  });

  // --- Novo Teste 1: Marcar e desmarcar tarefas como concluídas ---
  it('Deve marcar uma tarefa como concluída e depois desmarcá-la', () => {
    // Primeiro, adiciona duas tarefas
    cy.get('.new-todo').type('Tarefa A{enter}');
    cy.get('.new-todo').type('Tarefa B{enter}');

    // Marca a primeira tarefa como concluída
    cy.get('.todo-list li').first().find('.toggle').click();
    // Verifica que o <li> agora tem a classe "completed"
    cy.get('.todo-list li').first().should('have.class', 'completed');

    // Desmarca a mesma tarefa
    cy.get('.todo-list li').first().find('.toggle').click();
    // Verifica que a classe "completed" foi removida
    cy.get('.todo-list li').first().should('not.have.class', 'completed');
  });

  // --- Novo Teste 2: Filtrar tarefas Ativas e Concluídas ---
  it('Deve filtrar a exibição para tarefas Ativas e Concluídas corretamente', () => {
    // Adiciona três tarefas
    cy.get('.new-todo').type('Tarefa 1{enter}');
    cy.get('.new-todo').type('Tarefa 2{enter}');
    cy.get('.new-todo').type('Tarefa 3{enter}');

    // Conclui "Tarefa 1" e "Tarefa 3"
    cy.get('.todo-list li').eq(0).find('.toggle').click();
    cy.get('.todo-list li').eq(2).find('.toggle').click();

    // Clica no filtro "Active"
    cy.contains('Active').click();
    // Deve exibir apenas a tarefa não concluída: "Tarefa 2"
    cy.get('.todo-list li')
      .should('have.length', 1)
      .and('contain', 'Tarefa 2');

    // Clica no filtro "Completed"
    cy.contains('Completed').click();
    // Deve exibir apenas as tarefas marcadas como concluídas
    cy.get('.todo-list li')
      .should('have.length', 2)
      .then($itens => {
        const textos = [$itens.eq(0).text(), $itens.eq(1).text()];
        expect(textos).to.include('Tarefa 1');
        expect(textos).to.include('Tarefa 3');
      });

    // Clica em "All" para voltar a exibir todas as tarefas
    cy.contains('All').click();
    cy.get('.todo-list li').should('have.length', 3);
  });

  // --- Novo Teste 3: Excluir tarefas concluídas usando o botão "Clear completed" ---
  it('Deve limpar somente as tarefas concluídas ao clicar em "Clear completed"', () => {
    // Adiciona duas tarefas
    cy.get('.new-todo').type('Limpar casa{enter}');
    cy.get('.new-todo').type('Fazer compras{enter}');

    // Conclui apenas a segunda tarefa ("Fazer compras")
    cy.get('.todo-list li').eq(1).find('.toggle').click();
    cy.get('.todo-list li').eq(1).should('have.class', 'completed');

    // Verifica que o botão "Clear completed" está visível e clica nele
    cy.contains('Clear completed')
      .should('be.visible')
      .click();

    // Agora só deve restar a tarefa não concluída ("Limpar casa")
    cy.get('.todo-list li')
      .should('have.length', 1)
      .and('contain', 'Limpar casa');

    // Verifica que não há nenhuma tarefa com a classe "completed"
    cy.get('.todo-list li').should('not.have.class', 'completed');

    // Verifica que o contador de tarefas restantes mostra "1 item left"
    cy.get('.todo-count').should('contain', '1 item left');
  });
});
