import { apiFetch } from "./api";

export async function loginUser(email: string, password: string) {
  return apiFetch("/security/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function signupUser(form: {
  firstname: string;
  lastname: string;
  business_name: string;
  email: string;
  phone: string;
  location: string;
  password: string;
}) {
  return apiFetch("/security/signup", {
    method: "POST",
    body: JSON.stringify(form),
  });
}