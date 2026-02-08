import { model } from "@medusajs/framework/utils"

const PetProfile = model.define("pet_profile", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  owner_id: model.text(),
  name: model.text(),
  species: model.enum([
    "dog",
    "cat",
    "bird",
    "fish",
    "reptile",
    "rabbit",
    "hamster",
    "other",
  ]),
  breed: model.text().nullable(),
  date_of_birth: model.dateTime().nullable(),
  weight_kg: model.number().nullable(),
  color: model.text().nullable(),
  gender: model.enum([
    "male",
    "female",
    "unknown",
  ]).default("unknown"),
  is_neutered: model.boolean().default(false),
  microchip_id: model.text().nullable(),
  medical_notes: model.text().nullable(),
  allergies: model.json().nullable(),
  vaccinations: model.json().nullable(),
  photo_url: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default PetProfile
