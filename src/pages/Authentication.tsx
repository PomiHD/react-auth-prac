import AuthForm from "../components/AuthForm";
import { json, redirect } from "react-router-dom";

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function action({ request, params }) {
  const method = request.method;
  const data = await request.formData();
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login";

  if (mode !== "login" && mode !== "signup") {
    throw json({ message: "Invalid mode" }, { status: 422 });
  }
  const url = "http://localhost:8080/" + mode;

  const authData = {
    email: data.get("email"),
    password: data.get("password"),
  };

  const response = await fetch(url, {
    method: method.toUpperCase(),
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  // when the user is not authenticated or the user is not authorized
  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    throw json({ message: "Could not authenticate user" }, { status: 500 });
  }

  //soon: manage token
  return redirect("/");
}
