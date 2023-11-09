import * as z from "zod";

const FormSchema = z.object({
  query: z
    .string()
    .min(2, {
      message: "최소 2글자 이상",
    })
    .max(5, { message: "최대 5글자 이하" }),
});

export { FormSchema };
