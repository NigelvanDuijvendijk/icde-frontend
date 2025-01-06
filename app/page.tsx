import Head from "next/head";
import Image from "next/image";
import Login from "./login/page";

export default function Home() {
  return (
    <main className="h-screen flex items-center justify-center">
      <Login/>
    </main>
  );
}
