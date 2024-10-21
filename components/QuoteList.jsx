"use client";

import React, { useEffect, useState, useCallback } from "react";
import QuoteCard from "./QuoteCard";
import { useRouter } from "next/navigation";

// Debounce function
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

const QuoteList = () => {
  const [quotes, setQuotes] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchQuotes = useCallback(async () => {
    const response = await fetch(
      `https://assignment.stage.crafto.app/getQuotes?limit=24&offset=${offset}`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    const data = await response.json();
    if (data?.data.length === 0) {
      setLoading(false);
      return;
    }
    setQuotes((prevQuotes) => [...prevQuotes, ...data?.data]);
    setLoading(false);
  }, [offset]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  useEffect(() => {
    const handleScroll = debounce(() => {
      // Debounced scroll handler
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 200 &&
        !loading
      ) {
        setOffset((prevOffset) => prevOffset + 20);
      }
    }, 200); // Adjust the delay as needed

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  // New effect to refetch quotes on route change
  useEffect(() => {
    setQuotes([]);
    setOffset(0);
    fetchQuotes();
  }, [router.asPath]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-around px-6 pt-28">
        {quotes?.map((quote, index) => (
          <div key={index}>
            <QuoteCard quote={quote} />
          </div>
        ))}
        {loading && <div className="text-white text-center">Loading...</div>}
      </div>
      <button
        onClick={() => router?.push("/quotes/create")}
        className="fixed bottom-6 right-6 rounded-full bg-gray-800 p-4 scale-[1] hover:scale-[1.2] transition duration-300"
      >
        <svg
          class="w-6 h-6 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 12h14m-7 7V5"
          />
        </svg>
      </button>
    </>
  );
};

export default QuoteList;
