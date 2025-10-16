import React from "react";

const SearchButton = ({ onClick = () => {} ,Name}) => {
  return (
    <>
      <button
        style={{
          backgroundColor: "#4BC0C0",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "5px",
          whiteSpace: "nowrap",
        }}
        onClick={onClick}
        className="me-2"
      >
        {Name}
      </button>
    </>
  );
};

export default SearchButton;
