import { Form, json, Link, redirect, useSearchParams } from "react-router-dom";
import classes from "./AuthForm.module.css";

function AuthForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";
  return (
    <>
      <Form method="post" className={classes.form}>
        <h1>{isLogin ? "Log in" : "Create a new user"}</h1>
        <p>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required />
        </p>
        <p>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" required />
        </p>
        <div className={classes.actions}>
          <Link to={`?mode=${isLogin ? "signup" : "login"}`} type="button">
            {isLogin ? "Create new user" : "Login"}
          </Link>
          <button>Save</button>
        </div>
      </Form>
    </>
  );
}

export default AuthForm;

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
