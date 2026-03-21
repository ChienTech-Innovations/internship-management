import * as yup from "yup";

export const loginSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required")
});

export const createUserSchema = yup.object({
  fullName: yup.string().required("Full name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  phoneNumber: yup
    .string()
    .matches(/^\d+$/, "Phone number must be digits only")
    .required("Phone number is required"),
  role: yup
    .string()
    .oneOf(["INTERN", "MENTOR", "ADMIN"])
    .required("Role is required"),
  dob: yup.string().required("Date of birth is required"),
  address: yup.string().required("Address is required"),
  status: yup.string().required("Status is required"),
  department: yup.string().when("role", {
    is: (val: string) => val === "INTERN" || val === "MENTOR",
    then: (schema) => schema.required("Department is required"),
    otherwise: (schema) => schema.notRequired()
  }),
  startDate: yup.string().when("role", {
    is: (val: string) => val === "INTERN",
    then: (schema) => schema.required("Start date is required"),
    otherwise: (schema) => schema.notRequired()
  }),
  endDate: yup.string().when("role", {
    is: (val: string) => val === "INTERN",
    then: (schema) => schema.required("End date is required"),
    otherwise: (schema) => schema.notRequired()
  })
});
