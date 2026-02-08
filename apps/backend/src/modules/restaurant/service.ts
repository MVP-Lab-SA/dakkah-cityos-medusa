import { MedusaService } from "@medusajs/framework/utils"
import Restaurant from "./models/restaurant"
import Menu from "./models/menu"
import MenuItem from "./models/menu-item"
import ModifierGroup from "./models/modifier-group"
import Modifier from "./models/modifier"
import TableReservation from "./models/table-reservation"
import KitchenOrder from "./models/kitchen-order"

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
