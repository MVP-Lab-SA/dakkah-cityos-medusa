import { MedusaService } from "@medusajs/framework/utils";
import UtilityAccount from "./models/utility-account";
import UtilityBill from "./models/utility-bill";
import MeterReading from "./models/meter-reading";
import UsageRecord from "./models/usage-record";

type UtilityAccountRecord = {
  id: string;
  tenant_id: string;
  account_number: string;
  utility_type: string;
  provider_name: string;
  status: string;
};

type MeterReadingRecord = {
  id: string;
  account_id: string;
  reading_value: number;
  reading_date: Date | string;
  unit: string;
};

type UtilityBillRecord = {
  id: string;
  tenant_id: string;
  account_id: string;
  bill_number: string;
  billing_period_start: Date | string;
  billing_period_end: Date | string;
  due_date: Date | string;
  amount: number | string;
  currency_code: string;
  consumption: number | string;
  consumption_unit: string;
  status: string;
  paid_at?: Date | null;
  payment_reference?: string | null;
  metadata: Record<string, unknown> | null;
};

type UsageRecordEntry = {
  id: string;
  account_id: string;
  amount: number;
};

interface UtilitiesServiceBase {
  listUtilityAccounts(
    filters: Record<string, unknown>,
    options?: Record<string, unknown>,
  ): Promise<UtilityAccountRecord[]>;
  retrieveUtilityAccount(id: string): Promise<UtilityAccountRecord>;
  listMeterReadings(
    filters: Record<string, unknown>,
  ): Promise<MeterReadingRecord[]>;
  listUtilityBills(
    filters: Record<string, unknown>,
  ): Promise<UtilityBillRecord[]>;
  retrieveUtilityBill(id: string): Promise<UtilityBillRecord>;
  createUtilityBills(data: Record<string, unknown>): Promise<UtilityBillRecord>;
  updateUtilityBills(
    data: { id: string } & Record<string, unknown>,
  ): Promise<UtilityBillRecord>;
  createUsageRecords(data: Record<string, unknown>): Promise<UsageRecordEntry>;
}

class UtilitiesModuleService extends MedusaService({
  UtilityAccount,
  UtilityBill,
  MeterReading,
  UsageRecord,
}) {
  async getActiveAccounts(
    tenantId: string,
    filters?: { utilityType?: string; status?: string },
  ): Promise<UtilityAccountRecord[]> {
    const queryFilters: Record<string, unknown> = {
      tenant_id: tenantId,
      status: "active",
    };
    if (filters?.utilityType) queryFilters.utility_type = filters.utilityType;
    if (filters?.status) queryFilters.status = filters.status;

    return (this as unknown as UtilitiesServiceBase).listUtilityAccounts(
      queryFilters,
      {
        order: { created_at: "DESC" },
      },
    );
  }

  async calculateUsageCharges(
    accountId: string,
    startDate: Date,
    endDate: Date,
    ratePerUnit?: number,
  ): Promise<{
    accountId: string;
    period: { startDate: Date; endDate: Date };
    consumption: number;
    unit?: string;
    ratePerUnit: number;
    charges: number;
    readingDetails?: Array<{
      from: number;
      to: number;
      consumption: number;
      date: Date | string;
    }>;
  }> {
    const [, readings] = await Promise.all([
      (this as unknown as UtilitiesServiceBase).retrieveUtilityAccount(
        accountId,
      ),
      (this as unknown as UtilitiesServiceBase).listMeterReadings({
        account_id: accountId,
        reading_date: { $gte: startDate, $lte: endDate },
      }),
    ]);

    if (readings.length === 0) {
      return {
        accountId,
        period: { startDate, endDate },
        consumption: 0,
        charges: 0,
        ratePerUnit: ratePerUnit ?? 5.0,
        readingDetails: [],
      };
    }

    const sorted = readings.sort(
      (a, b) =>
        new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime(),
    );

    let totalConsumption = 0;
    const readingDetails: Array<{
      from: number;
      to: number;
      consumption: number;
      date: Date | string;
    }> = [];

    for (let i = 1; i < sorted.length; i++) {
      const consumption = sorted[i].reading_value - sorted[i - 1].reading_value;
      if (consumption >= 0) {
        totalConsumption += consumption;
        readingDetails.push({
          from: sorted[i - 1].reading_value,
          to: sorted[i].reading_value,
          consumption,
          date: sorted[i].reading_date,
        });
      }
    }

    const rate = ratePerUnit ?? 5.0;
    return {
      accountId,
      period: { startDate, endDate },
      consumption: totalConsumption,
      unit: sorted[0]?.unit ?? "kWh",
      ratePerUnit: rate,
      charges: totalConsumption * rate,
      readingDetails,
    };
  }

  async generateBill(
    accountId: string,
    billingPeriod: string,
  ): Promise<UtilityBillRecord> {
    const svc = this as unknown as UtilitiesServiceBase;
    const account = await svc.retrieveUtilityAccount(accountId);

    const parts = billingPeriod.split("-").map((v) => parseInt(v, 10));
    const [startYear, startMonth, endYear, endMonth] = parts;

    const startDate = new Date(startYear, startMonth - 1, 1);
    const endDate = new Date(endYear, endMonth, 0, 23, 59, 59);
    const chargesData = await this.calculateUsageCharges(
      accountId,
      startDate,
      endDate,
    );

    const dueDate = new Date(endDate);
    dueDate.setDate(dueDate.getDate() + 15);

    return svc.createUtilityBills({
      tenant_id: account.tenant_id,
      account_id: accountId,
      bill_number: `BILL-${accountId.slice(0, 8)}-${billingPeriod}`,
      billing_period_start: startDate,
      billing_period_end: endDate,
      due_date: dueDate,
      amount: chargesData.charges,
      currency_code: "USD",
      consumption: chargesData.consumption,
      consumption_unit: chargesData.unit ?? "kWh",
      status: "generated",
      metadata: {
        rate_per_unit: chargesData.ratePerUnit,
        provider: account.provider_name,
      },
    });
  }

  async processPayment(
    billId: string,
    amount: number,
    paymentReference?: string,
  ): Promise<{
    bill: UtilityBillRecord;
    payment: UsageRecordEntry;
    remaining: number;
  }> {
    const svc = this as unknown as UtilitiesServiceBase;
    const bill = await svc.retrieveUtilityBill(billId);
    const billAmount = Number(bill.amount);

    if (amount > billAmount) {
      throw new Error(`Payment amount exceeds bill amount of ${billAmount}`);
    }

    const remainingAmount = billAmount - amount;
    const newStatus = remainingAmount <= 0 ? "paid" : bill.status;

    const [updatedBill, paymentRecord] = await Promise.all([
      svc.updateUtilityBills({
        id: billId,
        status: newStatus,
        paid_at: newStatus === "paid" ? new Date() : bill.paid_at,
        payment_reference: paymentReference ?? `PAY-${Date.now()}`,
      }),
      svc.createUsageRecords({
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
      }),
    ]);

    return {
      bill: updatedBill,
      payment: paymentRecord,
      remaining: remainingAmount,
    };
  }

  async getUsageSummary(
    accountId: string,
    months: number = 12,
  ): Promise<{
    accountId: string;
    accountNumber: string;
    utilityType: string;
    provider: string;
    status: string;
    period: { startDate: Date; endDate: Date; months: number };
    consumption: { total: number; average: number; unit: string };
    charges: { total: number; paid: number; pending: number; average: number };
    readingCount: number;
    billCount: number;
  }> {
    const svc = this as unknown as UtilitiesServiceBase;
    const account = await svc.retrieveUtilityAccount(accountId);

    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const [readings, bills] = await Promise.all([
      svc.listMeterReadings({
        account_id: accountId,
        reading_date: { $gte: startDate, $lte: endDate },
      }),
      svc.listUtilityBills({
        account_id: accountId,
        billing_period_start: { $gte: startDate },
      }),
    ]);

    const sorted = readings.sort(
      (a, b) =>
        new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime(),
    );
    let totalConsumption = 0;
    if (sorted.length > 1) {
      totalConsumption =
        sorted[sorted.length - 1].reading_value - sorted[0].reading_value;
    }

    let totalCharges = 0;
    let paidAmount = 0;
    let pendingAmount = 0;
    for (const bill of bills) {
      const billAmount = Number(bill.amount);
      totalCharges += billAmount;
      if (bill.status === "paid") paidAmount += billAmount;
      else pendingAmount += billAmount;
    }

    return {
      accountId,
      accountNumber: account.account_number,
      utilityType: account.utility_type,
      provider: account.provider_name,
      status: account.status,
      period: { startDate, endDate, months },
      consumption: {
        total: totalConsumption,
        average:
          Math.round(
            (readings.length > 0 ? totalConsumption / months : 0) * 100,
          ) / 100,
        unit: readings[0]?.unit ?? "kWh",
      },
      charges: {
        total: totalCharges,
        paid: paidAmount,
        pending: pendingAmount,
        average:
          Math.round(
            (bills.length > 0 ? totalCharges / bills.length : 0) * 100,
          ) / 100,
      },
      readingCount: readings.length,
      billCount: bills.length,
    };
  }

  async generateBillingSummary(
    accountId: string,
    year: number,
    month: number,
  ): Promise<{
    accountId: string;
    accountNumber: string;
    period: { year: number; month: number; startDate: Date; endDate: Date };
    billCount: number;
    totalAmount: number;
    totalPaid: number;
    totalPending: number;
    bills: UtilityBillRecord[];
  }> {
    const svc = this as unknown as UtilitiesServiceBase;
    const account = await svc.retrieveUtilityAccount(accountId);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const bills = await svc.listUtilityBills({
      account_id: accountId,
      billing_period_start: { $gte: startDate },
      billing_period_end: { $lte: endDate },
    });

    let totalAmount = 0;
    let totalPaid = 0;
    let totalPending = 0;

    for (const bill of bills) {
      const amount = Number(bill.amount);
      totalAmount += amount;
      if (bill.status === "paid") totalPaid += amount;
      else totalPending += amount;
    }

    return {
      accountId,
      accountNumber: account.account_number,
      period: { year, month, startDate, endDate },
      billCount: bills.length,
      totalAmount: Math.round(totalAmount * 100) / 100,
      totalPaid: Math.round(totalPaid * 100) / 100,
      totalPending: Math.round(totalPending * 100) / 100,
      bills,
    };
  }

  async detectAnomalousUsage(
    accountId: string,
    thresholdMultiplier?: number,
  ): Promise<{
    accountId: string;
    accountNumber: string;
    recentConsumption: number;
    averageConsumption: number;
    thresholdMultiplier: number;
    threshold: number;
    isAnomalous: boolean;
    deviationPercent: number;
  }> {
    const svc = this as unknown as UtilitiesServiceBase;
    const multiplier = thresholdMultiplier ?? 2.0;
    const account = await svc.retrieveUtilityAccount(accountId);

    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const [historicalReadings, recentReadings] = await Promise.all([
      svc.listMeterReadings({
        account_id: accountId,
        reading_date: { $gte: threeMonthsAgo, $lte: oneMonthAgo },
      }),
      svc.listMeterReadings({
        account_id: accountId,
        reading_date: { $gte: oneMonthAgo, $lte: now },
      }),
    ]);

    const sortedHistorical = historicalReadings.sort(
      (a, b) =>
        new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime(),
    );
    let historicalConsumption = 0;
    if (sortedHistorical.length > 1) {
      historicalConsumption =
        sortedHistorical[sortedHistorical.length - 1].reading_value -
        sortedHistorical[0].reading_value;
    }

    const sortedRecent = recentReadings.sort(
      (a, b) =>
        new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime(),
    );
    let recentConsumption = 0;
    if (sortedRecent.length > 1) {
      recentConsumption =
        sortedRecent[sortedRecent.length - 1].reading_value -
        sortedRecent[0].reading_value;
    }

    const avgMonthlyConsumption =
      historicalReadings.length > 1 ? historicalConsumption / 2 : 0;
    const isAnomalous =
      avgMonthlyConsumption > 0 &&
      recentConsumption > avgMonthlyConsumption * multiplier;

    return {
      accountId,
      accountNumber: account.account_number,
      recentConsumption,
      averageConsumption: Math.round(avgMonthlyConsumption * 100) / 100,
      thresholdMultiplier: multiplier,
      threshold: Math.round(avgMonthlyConsumption * multiplier * 100) / 100,
      isAnomalous,
      deviationPercent:
        avgMonthlyConsumption > 0
          ? Math.round(
              ((recentConsumption - avgMonthlyConsumption) /
                avgMonthlyConsumption) *
                10000,
            ) / 100
          : 0,
    };
  }

  async getServiceOutages(
    tenantId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{
    tenantId: string;
    period: { startDate: Date; endDate: Date };
    outageCount: number;
    outages: Array<{
      accountId: string;
      accountNumber: string;
      utilityType: string;
      outageStart: Date | string;
      outageEnd: Date | string;
      durationHours: number;
    }>;
  }> {
    const svc = this as unknown as UtilitiesServiceBase;
    const accounts = await svc.listUtilityAccounts({ tenant_id: tenantId });

    const outages: Array<{
      accountId: string;
      accountNumber: string;
      utilityType: string;
      outageStart: Date | string;
      outageEnd: Date | string;
      durationHours: number;
    }> = [];

    for (const account of accounts) {
      const readings = await svc.listMeterReadings({
        account_id: account.id,
        reading_date: { $gte: startDate, $lte: endDate },
      });

      const sorted = readings.sort(
        (a, b) =>
          new Date(a.reading_date).getTime() -
          new Date(b.reading_date).getTime(),
      );

      for (let i = 1; i < sorted.length; i++) {
        const gap =
          new Date(sorted[i].reading_date).getTime() -
          new Date(sorted[i - 1].reading_date).getTime();
        const gapHours = gap / (1000 * 60 * 60);

        if (
          gapHours > 48 &&
          sorted[i].reading_value === sorted[i - 1].reading_value
        ) {
          outages.push({
            accountId: account.id,
            accountNumber: account.account_number,
            utilityType: account.utility_type,
            outageStart: sorted[i - 1].reading_date,
            outageEnd: sorted[i].reading_date,
            durationHours: Math.round(gapHours * 100) / 100,
          });
        }
      }
    }

    return {
      tenantId,
      period: { startDate, endDate },
      outageCount: outages.length,
      outages,
    };
  }
}

export default UtilitiesModuleService;
