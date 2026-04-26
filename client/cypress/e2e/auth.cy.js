describe("Authentication Flow", () => {
  it("should successfully log in a user and redirect to shopping view", () => {
    // Visit the login page
    cy.visit("/auth/login");

    // Enter credentials
    // Note: Assuming a test user exists. If not, this might fail, but it demonstrates the E2E flow.
    cy.get('input[name="email"]').type("test@test.com");
    cy.get('input[name="password"]').type("password123");

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Verify successful toast message appears
    cy.contains("Logged in successfully").should("be.visible");

    // Verify redirection to shopping view
    cy.url().should("include", "/shop/home");

    // Verify header or user avatar is present
    cy.get("header").should("exist");
  });

  it("should show an error for invalid credentials", () => {
    cy.visit("/auth/login");

    cy.get('input[name="email"]').type("invalid@test.com");
    cy.get('input[name="password"]').type("wrongpassword");
    cy.get('button[type="submit"]').click();

    // The backend should return an error, which the frontend shows in a toast
    cy.contains(/Incorrect|doesn't exist/i).should("be.visible");
  });

  it("should allow a new user to register", () => {
    cy.visit("/auth/register");

    const randomNum = Math.floor(Math.random() * 10000);
    const testEmail = `newuser${randomNum}@test.com`;

    cy.get('input[name="userName"]').type("New User");
    cy.get('input[name="email"]').type(testEmail);
    cy.get('input[name="password"]').type("password123");

    cy.get('button[type="submit"]').click();

    // Verify successful registration and redirect to login
    cy.contains("Registration successful").should("be.visible");
    cy.url().should("include", "/auth/login");
  });
});
