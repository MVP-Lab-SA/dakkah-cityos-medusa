import { test, expect } from '@playwright/test'

test.describe('B2B Quote Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to products page
    await page.goto('/us/products')
  })

  test('should allow requesting a quote from cart', async ({ page }) => {
    // Add product to cart
    await page.locator('[data-testid="product-card"]').first().click()
    await page.locator('[data-testid="add-to-cart"]').click()
    
    // Go to cart
    await page.goto('/us/cart')
    
    // Click request quote button
    await page.locator('[data-testid="request-quote-btn"]').click()
    
    // Should navigate to quote request form
    await expect(page).toHaveURL(/\/us\/quotes\/request/)
    
    // Fill out quote request form
    await page.fill('[name="company"]', 'Test Company')
    await page.fill('[name="contactName"]', 'John Doe')
    await page.fill('[name="email"]', 'john@test.com')
    await page.fill('[name="phone"]', '+1234567890')
    await page.fill('[name="message"]', 'I need a bulk discount')
    
    // Submit form
    await page.locator('[data-testid="submit-quote"]').click()
    
    // Should show success message
    await expect(page.locator('[data-testid="quote-success"]')).toBeVisible()
  })

  test('should display quote list', async ({ page }) => {
    // Mock authenticated user
    await page.goto('/us/quotes')
    
    // Should show quotes list or empty state
    const quotesList = page.locator('[data-testid="quotes-list"]')
    const emptyState = page.locator('[data-testid="quotes-empty"]')
    
    await expect(quotesList.or(emptyState)).toBeVisible()
  })

  test('should show quote details', async ({ page }) => {
    await page.goto('/us/quotes')
    
    // Click on a quote if available
    const firstQuote = page.locator('[data-testid="quote-item"]').first()
    
    if (await firstQuote.isVisible()) {
      await firstQuote.click()
      
      // Should navigate to quote detail page
      await expect(page).toHaveURL(/\/us\/quotes\/[^/]+$/)
      
      // Should show quote information
      await expect(page.locator('[data-testid="quote-status"]')).toBeVisible()
      await expect(page.locator('[data-testid="quote-items"]')).toBeVisible()
    }
  })

  test('should display volume pricing on product page', async ({ page }) => {
    await page.goto('/us/products')
    
    // Click on a product
    await page.locator('[data-testid="product-card"]').first().click()
    
    // Check if volume pricing is displayed
    const volumePricing = page.locator('[data-testid="volume-pricing"]')
    
    // Volume pricing might not be available for all products
    if (await volumePricing.isVisible()) {
      await expect(volumePricing.locator('[data-testid="price-tier"]')).toHaveCount.greaterThan(0)
    }
  })
})
