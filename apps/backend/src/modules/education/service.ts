import { MedusaService } from "@medusajs/framework/utils"
import Course from "./models/course"
import Lesson from "./models/lesson"
import Enrollment from "./models/enrollment"
import Certificate from "./models/certificate"
import Quiz from "./models/quiz"
import Assignment from "./models/assignment"

class EducationModuleService extends MedusaService({
  Course,
  Lesson,
  Enrollment,
  Certificate,
  Quiz,
  Assignment,
}) {}

export default EducationModuleService
