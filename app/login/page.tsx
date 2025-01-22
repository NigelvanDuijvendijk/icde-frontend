'use client';
import LoginForm from "@/app/forms/login/loginForm";
import Head from "next/head";
 
export default function Login() {
  return (
  <div>
      <Head>
        <title>Login Page</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="vh-100 d-flex justify-content-center align-items-center">
        <LoginForm/>
      </main>
    </div>
  );
}
  