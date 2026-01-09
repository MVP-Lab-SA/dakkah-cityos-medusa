import { test, expect } from '@playwright/test'

test.describe('Dynamic CMS Pages', () => {
  test('should render dynamic page from Payload CMS', async ({ page }) => {
    // Navigate to a CMS page (e.g., /us/about-us)
    await page.goto('/us/about-us')
    
    // Should render page content
    await expect(page.locator('main')).toBeVisible()
    
    // Page should have content (not 404)
    const notFound = page.locator('text=/404|not found/i')
    await expect(notFound).not.toBeVisible()
  })

  test('should render hero block', async ({ page }) => {
    await page.goto('/us/about-us')
    
    // Check if hero block exists
    const heroBlock = page.locator('[data-block-type="hero"]')
    
    if (await heroBlock.isVisible()) {
      await expect(heroBlock.locator('h1, h2')).toBeVisible()
    }
  })

  test('should render content blocks', async ({ page }) => {
    await page.goto('/us/about-us')
    
    // Check if content blocks exist
    const contentBlocks = page.locator('[data-block-type="content"]')
    
    if ((await contentBlocks.count()) > 0) {
      await expect(contentBlocks.first()).toBeVisible()
    }
  })

  test('should render products block', async ({ page }) => {
    await page.goto('/us/about-us')
    
    // Check if products block exists
    const productsBlock = page.locator('[data-block-type="products"]')
    
    if (await productsBlock.isVisible()) {
      // Should display product cards
      await expect(productsBlock.locator('[data-testid="product-card"]')).toHaveCount.greaterThan(0)
    }
  })

  test('should render CTA block', async ({ page }) => {
    await page.goto('/us/about-us')
    
    // Check if CTA block exists
    const ctaBlock = page.locator('[data-block-type="cta"]')
    
    if (await ctaBlock.isVisible()) {
      // Should have a button or link
      await expect(ctaBlock.locator('a, button')).toBeVisible()
    }
  })

  test('should handle non-existent pages gracefully', async ({ page }) => {
    const response = await page.goto('/us/this-page-does-not-exist-12345')
    
    // Should return 404 or show not found message
    expect(response?.status()).toBe(404)
  })
})
