import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const query = req.scope.resolve("query")
  
  const { data: exceptions } = await query.graph({
    entity: "availability_exception",
    fields: ["*"],
    filters: { availability_id: id },
  })
  
  res.json({ exceptions })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const bookingService = req.scope.resolve("booking")
  
  const {
    exception_type,
    start_date,
    end_date,
    all_day,
    special_hours,
    title,
    reason,
    is_recurring,
    recurrence_rule,
  } = req.body as {
    exception_type: "time_off" | "holiday" | "special_hours" | "blocked"
    start_date: string
    end_date: string
    all_day?: boolean
    special_hours?: Array<{ start: string; end: string }>
    title?: string
    reason?: string
    is_recurring?: boolean
    recurrence_rule?: string
  }
  
  const exception = await bookingService.createAvailabilityExceptions([{
    availability_id: id,
    exception_type,
    start_date: new Date(start_date),
    end_date: new Date(end_date),
    all_day: all_day || false,
    special_hours,
    title,
    reason,
    is_recurring: is_recurring || false,
    recurrence_rule,
  }])
  
  res.status(201).json({ exception: exception[0] })
}
