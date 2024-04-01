/* eslint-disable no-undef */

describe("My First Test", () => {
  it("Visits the login and click on forgotten password", () => {
    cy.visit("http://localhost:3001/login");

    cy.contains("Olvidé mi contraseña").click();

    cy.url().should("include", "/send-email");

    cy.get("h4").should("exist").contains("Recuperar contraseña");

    cy.get("input").type("fake@email.com");

    cy.get("input").should("have.value", "fake@email.com");
  });
});
