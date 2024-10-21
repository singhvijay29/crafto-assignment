import React from "react";
import { format } from "date-fns";

const QuoteCard = ({ quote }) => {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 shadow-md cursor-pointer">
      <div className="relative p-2 rounded-lg overflow-hidden">
        <img
          style={{
            objectFit: "cover",
          }}
          className="rounded-lg h-[200px] w-full cover"
          src={quote?.mediaUrl}
          alt="product image"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex h-full w-full items-center justify-center">
          <div
            title={quote?.text}
            className="text-white text-xl font-semibold text-center line-clamp-3 px-4"
          >
            {quote?.text}
          </div>
        </div>
      </div>
      <div className="px-5 py-3 w-full">
        <div className="flex items-center justify-between  w-full">
          <div className="font-bold text-gray-900 dark:text-white flex justify-between w-full">
            <div className="text-[14px]">{quote?.username}</div>
            <div className="text-[12px]">
              {quote?.updatedAt
                ? format(new Date(quote.updatedAt), "HH:mm - dd-MM-yyyy")
                : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCard;
