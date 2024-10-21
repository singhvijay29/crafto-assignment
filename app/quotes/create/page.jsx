"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";

export default function LoginForm() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError("Please select an image");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // 1. Upload image
      const formData = new FormData();
      formData.append("file", image);
      const uploadResponse = await fetch(
        "https://crafto.app/crafto/v1.0/media/assignment/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const { mediaUrl } = await uploadResponse.json();

      // 2. Create quote
      const token = localStorage.getItem("token");
      const createResponse = await fetch(
        "https://assignment.stage.crafto.app/postQuote",
        {
          method: "POST",
          headers: {
            Authorization: token || "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, mediaUrl }),
        }
      );

      if (!createResponse.ok) {
        throw new Error("Failed to create quote");
      }
      router?.push("/quotes");
    } catch (err) {
      setError("An error occurred while creating the quote. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview("");
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center h-[100vh]">
        <div className="px-6 w-full max-w-[524px]">
          <div class="p-6 bg-white border border-gray-200 rounded-lg shadow  dark:bg-gray-800 dark:border-gray-700">
            <h5 class="text-xl font-medium text-gray-900 dark:text-white mb-5">
              Create Quote
            </h5>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 text-white"
            >
              <div className="space-y-2">
                <label
                  for="email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Quote Text
                </label>
                <textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Enter Quote Text"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white "
                />
              </div>
              <div className="flex gap-2 items-center">
                <label
                  htmlFor="image"
                  className="px-3 py-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg "
                >
                  Upload Image
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  disabled={isLoading}
                  style={{
                    display: "none",
                  }}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    className="w-full h-8 w-12"
                  />
                )}
              </div>
              <button
                type="submit"
                class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                disabled={isLoading} // Disable button when loading
              >
                {isLoading ? "Creating Quote..." : "Create Quote"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
