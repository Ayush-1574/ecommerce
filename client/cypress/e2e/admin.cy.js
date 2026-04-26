describe("Admin Flow", () => {
  beforeEach(() => {
    // Log in as an admin
    cy.visit("/auth/login");
    // This assumes there's an admin test account available.
    // Replace with a known admin credential in your database.
    cy.get('input[name="email"]').type("admin@test.com"); 
    cy.get('input[name="password"]').type("password123");
    cy.get('button[type="submit"]').click();
    
    // We assume the backend redirects admins to /admin/dashboard
    // If it doesn't wait a moment for the role to resolve and routing to happen
  });

  it("should navigate to admin product management", () => {
    // Verify admin dashboard is reachable
    cy.url().should("include", "/admin/dashboard");

    // Click on Products in the sidebar
    cy.contains("Products").click();

    // Verify product page loads
    cy.url().should("include", "/admin/products");

    // Ensure the Add New Product button exists
    cy.contains("Add New Product").should("be.visible");
  });
});
