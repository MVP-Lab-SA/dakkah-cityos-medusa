import { MedusaService } from "@medusajs/framework/utils"
import Restaurant from "./models/restaurant.js"
import Menu from "./models/menu.js"
import MenuItem from "./models/menu-item.js"
import ModifierGroup from "./models/modifier-group.js"
import Modifier from "./models/modifier.js"
import TableReservation from "./models/table-reservation.js"
import KitchenOrder from "./models/kitchen-order.js"

class RestaurantModuleService extends MedusaService({
  Restaurant,
  Menu,
  MenuItem,
  ModifierGroup,
  Modifier,
  TableReservation,
  KitchenOrder,
}) {}

export default RestaurantModuleService
