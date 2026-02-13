// @ts-nocheck
import { MedusaService } from "@medusajs/framework/utils"
import UtilityAccount from "./models/utility-account"
import UtilityBill from "./models/utility-bill"
import MeterReading from "./models/meter-reading"
import UsageRecord from "./models/usage-record"

class UtilitiesModuleService extends MedusaService({
  UtilityAccount,
  UtilityBill,
  MeterReading,
  UsageRecord,
}) {
  async getActiveAccounts(tenantId: string, filters?: { utilityType?: string; status?: string }) {
    const queryFilters: Record<string, any> = {
      tenant_id: tenantId,
      status: "active",
    }

    if (filters?.utilityType) {
      queryFilters.utility_type = filters.utilityType
    }

    if (filters?.status) {
      queryFilters.status = filters.status
    }

    const accounts = await this.listUtilityAccounts(queryFilters, {
      order: { created_at: "DESC" },
    })

    return Array.isArray(accounts) ? accounts : [accounts].filter(Boolean)
  }

  async calculateUsageCharges(
    accountId: string,
    startDate: Date,
    endDate: Date,
    ratePerUnit?: number
  ) {
    const account = await this.retrieveUtilityAccount(accountId)

    const meterReadings = await this.listMeterReadings({
      account_id: accountId,
      reading_date: {
        $gte: startDate,
        $lte: endDate,
      },
    })

    const readings = Array.isArray(meterReadings)
      ? meterReadings
      : [meterReadings].filter(Boolean)

    if (readings.length === 0) {
      return {
        accountId,
        period: { startDate, endDate },
        consumption: 0,
        charges: 0,
        readings: [],
      }
    }

    const sortedReadings = readings.sort(
      (a, b) => new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime()
    )

    let totalConsumption = 0
    const readingDetails = []

    for (let i = 1; i < sortedReadings.length; i++) {
      const current = sortedReadings[i]
      const previous = sortedReadings[i - 1]
      const consumption = current.reading_value - previous.reading_value

      if (consumption >= 0) {
        totalConsumption += consumption
        readingDetails.push({
          from: previous.reading_value,
          to: current.reading_value,
          consumption,
          date: current.reading_date,
        })
      }
    }

    const rate = ratePerUnit || 5.0
    const charges = totalConsumption * rate

    return {
      accountId,
      period: { startDate, endDate },
      consumption: totalConsumption,
      unit: sortedReadings[0]?.unit || "kWh",
      ratePerUnit: rate,
      charges,
      readingDetails,
    }
  }

  async generateBill(accountId: string, billingPeriod: string) {
    const account = await this.retrieveUtilityAccount(accountId)

    const [startYear, startMonth, endYear, endMonth] = billingPeriod
      .split("-")
      .map((v) => parseInt(v, 10))

    const startDate = new Date(startYear, startMonth - 1, 1)
    const endDate = new Date(endYear, endMonth, 0, 23, 59, 59)

    const chargesData = await this.calculateUsageCharges(accountId, startDate, endDate)

    const dueDate = new Date(endDate)
    dueDate.setDate(dueDate.getDate() + 15)

    const billNumber = `BILL-${accountId.slice(0, 8)}-${billingPeriod}`

    const bill = await (this as any).createUtilityBills({
      tenant_id: account.tenant_id,
      account_id: accountId,
      bill_number: billNumber,
      billing_period_start: startDate,
      billing_period_end: endDate,
      due_date: dueDate,
      amount: chargesData.charges,
      currency_code: "USD",
      consumption: chargesData.consumption,
      consumption_unit: chargesData.unit,
      status: "generated",
      metadata: {
        rate_per_unit: chargesData.ratePerUnit,
        provider: account.provider_name,
      },
    })

    return bill
  }

  async processPayment(billId: string, amount: number, paymentReference?: string) {
    const bill = await this.retrieveUtilityBill(billId)

    const billAmount = Number(bill.amount)
    if (amount > billAmount) {
      throw new Error(`Payment amount exceeds bill amount of ${billAmount}`)
    }

    let newStatus = bill.status
    const remainingAmount = billAmount - amount

    if (remainingAmount <= 0) {
      newStatus = "paid"
    }

    const updatedBill = await (this as any).updateUtilityBills({
      id: billId,
      status: newStatus,
      paid_at: newStatus === "paid" ? new Date() : bill.paid_at,
      payment_reference: paymentReference || `PAY-${Date.now()}`,
    })

    const paymentRecord = await (this as any).createUsageRecords({
      tenant_id: bill.tenant_id,
      account_id: bill.account_id,
      record_type: "payment",
      amount,
      currency_code: bill.currency_code,
      reference_id: billId,
      timestamp: new Date(),
      metadata: {
        payment_reference: paymentReference,
        remaining_balance: remainingAmount,
      },
    })

    return {
      bill: updatedBill,
      payment: paymentRecord,
      remaining: remainingAmount,
    }
  }

  async getUsageSummary(accountId: string, months: number = 12) {
    const account = await this.retrieveUtilityAccount(accountId)

    const endDate = new Date()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - months)

    const meterReadings = await this.listMeterReadings({
      account_id: accountId,
      reading_date: {
        $gte: startDate,
        $lte: endDate,
      },
    })

    const readings = Array.isArray(meterReadings)
      ? meterReadings
      : [meterReadings].filter(Boolean)

    const bills = await this.listUtilityBills({
      account_id: accountId,
      billing_period_start: { $gte: startDate },
    })

    const billList = Array.isArray(bills) ? bills : [bills].filter(Boolean)

    let totalConsumption = 0
    let totalCharges = 0
    let paidAmount = 0
    let pendingAmount = 0

    const sortedReadings = readings.sort(
      (a, b) => new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime()
    )

    if (sortedReadings.length > 1) {
      totalConsumption = sortedReadings[sortedReadings.length - 1].reading_value - sortedReadings[0].reading_value
    }

    for (const bill of billList) {
      const billAmount = Number(bill.amount)
      totalCharges += billAmount

      if (bill.status === "paid") {
        paidAmount += billAmount
      } else {
        pendingAmount += billAmount
      }
    }

    const averageMonthlyConsumption = readings.length > 0 ? totalConsumption / months : 0
    const averageMonthlyCharge = billList.length > 0 ? totalCharges / billList.length : 0

    return {
      accountId,
      accountNumber: account.account_number,
      utilityType: account.utility_type,
      provider: account.provider_name,
      status: account.status,
      period: {
        startDate,
        endDate,
        months,
      },
      consumption: {
        total: totalConsumption,
        average: Math.round(averageMonthlyConsumption * 100) / 100,
        unit: readings[0]?.unit || "kWh",
      },
      charges: {
        total: totalCharges,
        paid: paidAmount,
        pending: pendingAmount,
        average: Math.round(averageMonthlyCharge * 100) / 100,
      },
      readingCount: readings.length,
      billCount: billList.length,
    }
  }
}

export default UtilitiesModuleService
