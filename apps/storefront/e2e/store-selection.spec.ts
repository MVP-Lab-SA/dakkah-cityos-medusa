import { test, expect } from '@playwright/test'

test.describe('Store Selection', () => {
  test('should display store selection page', async ({ page }) => {
    await page.goto('/us/stores')
    
    // Check page title
    await expect(page).toHaveTitle(/Select.*Store/i)
    
    // Should have heading
    await expect(page.locator('h1')).toContainText(/Choose.*Store/i)
    
    // Should display stores grid
    await expect(page.locator('[data-testid="store-grid"]')).toBeVisible()
  })

  test('should allow selecting a store', async ({ page }) => {
    await page.goto('/us/stores')
    
    // Wait for stores to load
    await page.waitForSelector('[data-testid="store-card"]')
    
    // Click first store
    await page.locator('[data-testid="store-card"]').first().click()
    
    // Should navigate to store homepage
    await expect(page).toHaveURL(/\/us\/(products|$)/)
  })

  test('should persist store selection', async ({ page, context }) => {
    await page.goto('/us/stores')
    
    // Select a store
    const firstStore = page.locator('[data-testid="store-card"]').first()
    const storeName = await firstStore.locator('h3').textContent()
    await firstStore.click()
    
    // Navigate to another page
    await page.goto('/us/products')
    
    // Store should still be selected (check localStorage or branding)
    const selectedStore = await page.evaluate(() => localStorage.getItem('selectedStore'))
    expect(selectedStore).toBeTruthy()
  })

  test('should apply store branding', async ({ page }) => {
    await page.goto('/us/stores')
    
    // Select a store
    await page.locator('[data-testid="store-card"]').first().click()
    await page.waitForLoadState('networkidle')
    
    // Check if branding CSS variables are applied
    const primaryColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-primary')
    })
    
    expect(primaryColor).toBeTruthy()
  })

  test('should show store switcher in header', async ({ page }) => {
    await page.goto('/us/stores')
    await page.locator('[data-testid="store-card"]').first().click()
    
    // Wait for navigation
    await page.waitForLoadState('networkidle')
    
    // Store switcher should be visible
    const switcher = page.locator('[data-testid="store-switcher"]')
    await expect(switcher).toBeVisible()
  })
})
