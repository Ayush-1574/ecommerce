describe("Shopping Flow", () => {
  beforeEach(() => {
    // Log in before shopping tests
    cy.visit("/auth/login");
    cy.get('input[name="email"]').type("test@test.com"); // Using existing test user
    cy.get('input[name="password"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/shop/home");
  });

  it("should browse products and add to cart", () => {
    // Navigate to listing page
    cy.contains("Products").click();
    cy.url().should("include", "/shop/listing");

    // Click "Add to Cart" on the first product available
    cy.get("button").contains("Add to cart").first().click();

    // Verify toast for cart addition
    cy.contains("Cart updated successfully").should("be.visible");

    // Open Cart Sheet (Assuming header has a button with some cart icon or text)
    // We can target the header button that opens the cart
    cy.get("header button").last().click();

    // Verify Cart Sheet is open and shows checkout button
    cy.contains("Checkout").should("be.visible");
  });
});
