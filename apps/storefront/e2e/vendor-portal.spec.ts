import { test, expect } from '@playwright/test'

test.describe('Vendor Portal', () => {
  test.beforeEach(async ({ page }) => {
    // Assume vendor is logged in
    await page.goto('/us/vendor')
  })

  test('should display vendor dashboard', async ({ page }) => {
    // Should show dashboard stats
    await expect(page.locator('[data-testid="total-sales"]')).toBeVisible()
    await expect(page.locator('[data-testid="total-orders"]')).toBeVisible()
    await expect(page.locator('[data-testid="pending-orders"]')).toBeVisible()
    
    // Should show recent orders
    const recentOrders = page.locator('[data-testid="recent-orders"]')
    await expect(recentOrders).toBeVisible()
  })

  test('should navigate to products management', async ({ page }) => {
    await page.locator('[data-testid="nav-products"]').click()
    
    // Should navigate to products page
    await expect(page).toHaveURL(/\/us\/vendor\/products/)
    
    // Should show products list
    await expect(page.locator('[data-testid="vendor-products-list"]')).toBeVisible()
  })

  test('should navigate to orders page', async ({ page }) => {
    await page.locator('[data-testid="nav-orders"]').click()
    
    // Should navigate to orders page
    await expect(page).toHaveURL(/\/us\/vendor\/orders/)
    
    // Should show orders list or empty state
    const ordersList = page.locator('[data-testid="vendor-orders-list"]')
    const emptyState = page.locator('[data-testid="orders-empty"]')
    
    await expect(ordersList.or(emptyState)).toBeVisible()
  })

  test('should display commission tracking', async ({ page }) => {
    await page.locator('[data-testid="nav-commissions"]').click()
    
    // Should navigate to commissions page
    await expect(page).toHaveURL(/\/us\/vendor\/commissions/)
    
    // Should show commission summary
    await expect(page.locator('[data-testid="commission-summary"]')).toBeVisible()
  })

  test('should display payouts section', async ({ page }) => {
    await page.locator('[data-testid="nav-payouts"]').click()
    
    // Should navigate to payouts page
    await expect(page).toHaveURL(/\/us\/vendor\/payouts/)
    
    // Should show payout information
    const payoutsList = page.locator('[data-testid="payouts-list"]')
    const emptyState = page.locator('[data-testid="payouts-empty"]')
    
    await expect(payoutsList.or(emptyState)).toBeVisible()
  })

  test('should allow fulfilling an order', async ({ page }) => {
    // Go to orders page
    await page.goto('/us/vendor/orders')
    
    // Find a pending order if available
    const pendingOrder = page.locator('[data-testid="order-pending"]').first()
    
    if (await pendingOrder.isVisible()) {
      await pendingOrder.click()
      
      // Click fulfill button
      await page.locator('[data-testid="fulfill-order-btn"]').click()
      
      // Fill tracking information
      await page.fill('[name="trackingNumber"]', 'TRACK123456')
      await page.selectOption('[name="carrier"]', 'ups')
      
      // Submit fulfillment
      await page.locator('[data-testid="submit-fulfillment"]').click()
      
      // Should show success message
      await expect(page.locator('[data-testid="fulfillment-success"]')).toBeVisible()
    }
  })
})
