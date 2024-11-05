"use client";

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function UserRegister() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const { name, email, password, confirmPassword } = userInfo;

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleRegister = async (userInfo) => {
    const { name, email, password } = userInfo;

    const formBody = new URLSearchParams();
    formBody.append("name", name); 
    formBody.append("email", email);
    formBody.append("password", password);

    try {
      const response = await fetch(`http://20.189.124.237/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", 
        },
        body: formBody.toString(),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("Registration successful", data);
      } else {
        // Jika respons bukan JSON, tampilkan isi respons HTML
        const text = await response.text();
        console.log("Unexpected response:", text);
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill all the fields!");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match!");
      return;
    }
    handleRegister(userInfo); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Head>
        <title>BiliarD | Register</title>
      </Head>
      <main 
        className="bg-reg-bg bg-cover lg:bg-[center_50%] bg-[left_50%] flex-col lg:flex-row flex items-center justify-center w-full flex-1 py-100 text-center"
        // style={{ backgroundPosition: 'left top 100%' }}
      >
        {/* Logo section */}
        <div className="hidden lg:flex w-1/2 p-5 flex-col items-center justify-center">
          <img src="/assets/logo.png" className="img-logo1 mb-5 " alt="Logo" />
          <div className="py-2">
            <h2 className="text-5xl font-bold text-white mt-7 mb-7">BiliarD</h2>
          </div>
        </div>

        {/* Regis section */}
        <div className="bg-white md:py-12 lg:py-0 lg:min-h-screen w-11/12 md:w-9/12 lg:w-6/12 flex flex-col justify-center rounded-3xl lg:rounded-none">
          <div className="py-reg">
            <h2 className="text-2xl md:text-3xl font-bold text-darkgreen md:text-black mt-8 mb-4">Welcome to BiliarD!</h2>
            <div className="hidden text-neutral-800 text-xs mb-8 lg:block">
              <p className="">Create an account to get started with Biliard.</p>
              <p>Stay healthy, Stay sane!</p>
            </div>
            <div className="text-neutral-800 px-10 text-xs mb-8 lg:hidden">
              BiliarD, platform inovatif deteksi kadar bilirubin secara non-invasif!
            </div>
          </div>

          {errorMessage && <p className="text-red-500">{errorMessage}</p>} {/* Display error message */}

          <form onSubmit={handleSubmit} className="flex flex-col px-12 md:px-28 lg:px-36 xl:px-44">
            <div className="flex flex-col gap-2 md:gap-5">
              <div className="flex flex-col gap-1">
                <label className="font-medium text-sm md:text-base text-left">Name</label>
                <div>
                  <input
                    type="name"
                    onChange={handleChange}
                    value={name}
                    name="name"
                    className="border-2 border-main-black/20 focus:border-dark-green-1 focus:outline-none rounded-2xl px-6 py-2 w-full bg-gray-100"
                    placeholder="Enter name"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm md:text-base text-left">Email</label>
                <div className="relative">
                  <input
                    onChange={handleChange}
                    value={email}
                    name="email"
                    placeholder="Enter email"
                    className="border-2 border-main-black/20 focus:border-dark-green-1 focus:outline-none rounded-2xl px-6 py-2 w-full bg-gray-100"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm md:text-base text-left">Password</label>
                <div className="relative">
                  <input
                    onChange={handleChange}
                    value={password}
                    name="password"
                    placeholder="Enter password"
                    className="border-2 border-main-black/20 focus:border-dark-green-1 focus:outline-none rounded-2xl px-6 py-2 w-full bg-gray-100"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label className="font-medium text-sm md:text-base text-left">Confirm Password</label>
                <div className="relative">
                  <input
                    onChange={handleChange}
                    value={confirmPassword}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    className="border-2 border-main-black/20 focus:border-dark-green-1 focus:outline-none rounded-2xl px-6 py-2 w-full bg-gray-100"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <button type="submit" className="bg-darkgreen w-1/2 py-2 rounded-3xl text-white font-semibold mt-8">
                Sign Up
              </button>
            </div>
            <div className="flex items-center justify-center text-xs mb-4">
              <span>Already have an account?&nbsp;</span>
              <Link href="/login" className="underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
