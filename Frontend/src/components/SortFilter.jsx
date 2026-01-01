import { useState } from "react";
import { SORT_TYPE } from "../constants/sortType";

export default function SortFilter({ value, onChange }) {
  const [open, setOpen] = useState(false);

  const options = [
    { label: "Newest", value: SORT_TYPE.NEWEST },
    { label: "Oldest", value: SORT_TYPE.OLDEST },
  ];

  const selectedLabel =
    options.find((o) => o.value === value)?.label || "Newest";

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded 
        hover:bg-gray-100 text-sm shadow flex items-center gap-2"
      >
        Sort: {selectedLabel}
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute mt-2 w-full bg-white border border-gray-300 
        rounded shadow z-20">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm
              ${
                value === opt.value
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
