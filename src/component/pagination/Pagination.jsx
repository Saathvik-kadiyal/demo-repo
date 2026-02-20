import React from "react";
import activeArrow from "../../assets/paginatedactivearrow.svg";
import disabledArrow from "../../assets/paginateddisabledarrow.svg";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPagination = (current, total) => {
    const pages = [];

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    pages.push(1);

    if (current > 3) pages.push("...");

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 2) pages.push("...");

    pages.push(total);

    return pages;
  };

  const pages = getPagination(currentPage, totalPages);

  const handleKeyPress = (e, callback, disabled) => {
    if (!disabled && e.key === "Enter") {
      callback();
    }
  };

  return (

    <div className="flex justify-end items-center mt-4 gap-[6px] h-[28px] ">

      <div
        role="button"
        tabIndex={currentPage === 1 ? -1 : 0}
        className={`flex items-center gap-1 px-2 py-1 rounded ${
          currentPage === 1
            ? "text-[#727272] cursor-not-allowed"
            : "text-[#4A4A4A] hover:text-black"
          }`}
        onClick={() => currentPage !== 1 && onPageChange(1)}
        onKeyDown={(e) =>
          handleKeyPress(e, () => onPageChange(1), currentPage === 1)
        }
      >
        <img
          src={currentPage === 1 ? disabledArrow : activeArrow}
          alt=""
          style={{
            transform:
              currentPage === 1 ? "rotate(0deg)" : "rotate(180deg)",
          }}
        />
        <span>First</span>
      </div>

      <div
        role="button"
        tabIndex={currentPage === 1 ? -1 : 0}
        className={`flex items-center gap-1 px-2 py-1 rounded ${
          currentPage === 1
            ? "text-[#727272] cursor-not-allowed"
            : "text-[#4A4A4A] hover:text-black  cursor-pointer"
          }`}
        onClick={() =>
          currentPage > 1 && onPageChange(currentPage - 1)
        }
        onKeyDown={(e) =>
          handleKeyPress(
            e,
            () => onPageChange(currentPage - 1),
            currentPage === 1
          )
        }
      >
        <img
          src={currentPage === 1 ? disabledArrow : activeArrow}
          alt=""
          style={{
            transform:
              currentPage === 1 ? "rotate(0deg)" : "rotate(180deg)",
          }}
        />
        <span>Previous</span>
      </div>

      <div className="flex gap-[6px]">
        {pages.map((item, index) => {
          const isActive = item === currentPage;
          const isDots = item === "...";

          return (
            <div
              key={index}
              role={!isDots ? "button" : undefined}
              tabIndex={!isDots ? 0 : -1}
              className={`h-[28px] flex items-center px-2 text-sm border-b-2 ${isActive
                  ? "border-[#68B0DA] text-[#68B0DA]"
                  : "border-transparent text-[#4A4A4A]"
                } ${!isDots ? "cursor-pointer hover:text-black" : ""}`}

              onClick={() =>
                typeof item === "number" && onPageChange(item)
              }
              onKeyDown={(e) =>
                handleKeyPress(
                  e,
                  () => typeof item === "number" && onPageChange(item),
                  isDots
                )
              }
            >
              <span>{item}</span>
            </div>
          );
        })}
      </div>

      <div
        role="button"
        tabIndex={currentPage === totalPages ? -1 : 0}
        className={`flex items-center gap-1 px-2 py-1 rounded ${
          currentPage === totalPages
            ? "text-[#727272] cursor-not-allowed"
            : "text-[#4A4A4A] hover:text-black"
          }`}
        onClick={() =>
          currentPage < totalPages &&
          onPageChange(currentPage + 1)
        }
        onKeyDown={(e) =>
          handleKeyPress(
            e,
            () => onPageChange(currentPage + 1),
            currentPage === totalPages
          )
        }
      >
        <span>Next</span>
        <img
          src={currentPage === totalPages ? disabledArrow : activeArrow}
          alt=""
          style={{
            transform:
              currentPage === totalPages
                ? "rotate(180deg)"
                : "rotate(0deg)",
          }}
        />
      </div>

      <div
        role="button"
        tabIndex={currentPage === totalPages ? -1 : 0}
        className={`flex items-center gap-1 px-2 py-1 rounded ${
          currentPage === totalPages
            ? "text-[#727272] cursor-not-allowed"
            : "text-[#4A4A4A] hover:text-black"
          }`}
        onClick={() =>
          currentPage !== totalPages &&
          onPageChange(totalPages)
        }
        onKeyDown={(e) =>
          handleKeyPress(
            e,
            () => onPageChange(totalPages),
            currentPage === totalPages
          )
        }
      >
        <span>Last</span>
        <img
          src={currentPage === totalPages ? disabledArrow : activeArrow}
          alt=""
          style={{
            transform:
              currentPage === totalPages
                ? "rotate(180deg)"
                : "rotate(0deg)",
          }}
        />
      </div>
    </div>
  );
};

export default Pagination;
