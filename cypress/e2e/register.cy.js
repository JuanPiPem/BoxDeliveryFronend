/* eslint-disable no-undef */
const NEXT_PUBLIC_LOCAL_URL = "http://localhost:3001";

describe("Register component", () => {
  beforeEach("visit page", () => {
    cy.visit(`${NEXT_PUBLIC_LOCAL_URL}/register`);
  });

  it("should display the registration form", () => {
    cy.get('input[placeholder="Nombre"]').should("exist");
    cy.get('input[placeholder="Apellido"]').should("exist");
    cy.get('input[type="email"]').should("exist");
    cy.get('input[placeholder="**********"]').should("exist");
    cy.get('input[placeholder="Confirmar contraseña"]').should("exist");
    cy.contains("Crear").should("exist");
  });

  it("should show error message for invalid email", () => {
    cy.get('input[placeholder="Nombre"]').type("name");
    cy.get('input[placeholder="Apellido"]').type("lastname");
    cy.get('input[type="email"]').type("invalid");
    cy.get(".buttonDarkBlue_buttonStyle__FOWuA").click();
    cy.get('[data-content=""] > div').contains(
      "Ingrese un correo electronico valido"
    );
  });

  it("should show error message if passwords do not match", () => {
    cy.get('input[placeholder="**********"]').type("password");
    cy.get('input[placeholder="Confirmar contraseña"]')
      .type("differentpassword")
      .blur();
    cy.contains("Las contraseñas no coinciden.").should("exist");
  });

  it("should show error message if password format is incorrect", () => {
    cy.get('input[placeholder="**********"]').type("weakpassword").blur();
    cy.contains("La contraseña debe contener 8 caracteres").should("exist");
  });

  it("should redirect to login page when 'Iniciar sesión' button is clicked", () => {
    cy.contains("Ir al login").click();
    cy.url().should("include", "/login");
  });
});
