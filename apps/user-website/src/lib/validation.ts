import { z } from "zod";
const TestTypeEnum = z.enum(["TIMER", "NOTIMER", "SIMULATION"]);

const UserTestDetailSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    isTimed: z.boolean(),
    testType: TestTypeEnum,
    duration: z.number().optional(),
    correctAnswers: z
      .string()
      .min(1, "Correct answers field is required")
      .optional(),
    numberOfQuestions: z
      .number()
      .min(1, "Number of questions must be at least 1"),
    categoryId: z.string().min(1, "Category ID is required"),
  })
  .refine(
    (data) => {
      if (data.isTimed) {
        return data.duration !== undefined;
      }
      return true;
    },
    {
      message: "Duration is required when isTimed is true",
      path: ["duration"],
    }
  );

export { UserTestDetailSchema };
