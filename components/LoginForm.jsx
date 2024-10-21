"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://assignment.stage.crafto.app/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, otp: otp.join("") }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        router.push("/quotes");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("Wrong Otp");
    } finally {
      setIsLoading(false);
    }
  };

  console.log(error);

  return (
    <div className="px-6 w-full max-w-[424px] ">
      <div class="p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form class="space-y-6" action="#" onSubmit={handleSubmit}>
          <h5 class="text-xl font-medium text-gray-900 dark:text-white">
            Sign in to our platform
          </h5>
          <div>
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Username
            </label>
            <input
              name="username"
              id="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white "
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label
              for="otp1"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              OTP
            </label>
            <div class="flex justify-between gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <input
                  key={index}
                  type="text"
                  name={`otp${index + 1}`}
                  id={`otp${index + 1}`}
                  value={otp[index] || ""}
                  onChange={(e) => {
                    const newOtp = [...otp];
                    newOtp[index] = e.target.value;
                    setOtp(newOtp);

                    // Check if the input is filled and focus on the next input
                    if (e.target.value.length === 1 && index < 3) {
                      document.getElementById(`otp${index + 2}`).focus(); // Focus next input
                    }

                    // Check if backspace is pressed and focus on the previous input
                    if (
                      e.target.value.length === 0 &&
                      e.nativeEvent.inputType === "deleteContentBackward" &&
                      index > 0
                    ) {
                      document.getElementById(`otp${index}`).focus(); // Focus previous input
                    }
                  }}
                  placeholder="•"
                  class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white text-center"
                  maxLength={1} // Limit input to 1 character
                  required
                />
              ))}
            </div>
            <div className="text-red-200 text-[12px]">{error}</div>
          </div>
          <div class="flex items-start">
            <a
              href="#"
              class="ms-auto text-sm text-blue-700 hover:underline dark:text-blue-500"
            >
              Lost Password?
            </a>
          </div>
          <button
            type="submit"
            class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? "Loading..." : "Login to your account"}
          </button>
        </form>
      </div>
    </div>
  );
}
