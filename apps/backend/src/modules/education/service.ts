import { MedusaService } from "@medusajs/framework/utils"
import Course from "./models/course.js"
import Lesson from "./models/lesson.js"
import Enrollment from "./models/enrollment.js"
import Certificate from "./models/certificate.js"
import Quiz from "./models/quiz.js"
import Assignment from "./models/assignment.js"

class EducationModuleService extends MedusaService({
  Course,
  Lesson,
  Enrollment,
  Certificate,
  Quiz,
  Assignment,
}) {}

export default EducationModuleService
