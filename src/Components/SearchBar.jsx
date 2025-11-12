import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaCheck,FaTimes } from "react-icons/fa";


const SearchBar = ({
    items = [],
    selectedItems = [],
    onChange,
    placeholder = "Search...",
    showSelectAll = false,
    Name = "Location"
}) => {
    const [searchInput, setSearchInput] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const containerRef = useRef(null);
    const dropdownRef = useRef(null);

    // Filter items based on search input
    const filteredItems = items.filter((item) =>
        item.toLowerCase().includes(searchInput.toLowerCase())
    );

    // Check if all filteredItems are selected
    const allSelected =
        filteredItems.length > 0 &&
        filteredItems.every((item) => selectedItems.includes(item));

    // Toggle selecting all filteredItems
    const handleSelectAll = () => {
        if (allSelected) {
            // Deselect all filteredItems
            onChange(selectedItems.filter((item) => !filteredItems.includes(item)));
        } else {
            // Select all filteredItems
            onChange([...new Set([...selectedItems, ...filteredItems])]);
        }
        setSearchInput("");
        setShowDropdown(false);
    };

    // Outside click handler
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowDropdown(false);
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // Scroll to highlighted item
    const scrollToItem = (index) => {
        if (dropdownRef.current && index >= 0) {
            const el = dropdownRef.current.children[index];
            if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
    };

    // Handle keyboard events
    const handleKeyDown = (e) => {
        if (!showDropdown) {
            setShowDropdown(true);
            return;
        }
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setHighlightedIndex((prev) => {
                    const nextIdx = prev < filteredItems.length - 1 ? prev + 1 : prev;
                    scrollToItem(nextIdx);
                    return nextIdx;
                });
                break;
            case "ArrowUp":
                e.preventDefault();
                setHighlightedIndex((prev) => {
                    const nextIdx = prev > 0 ? prev - 1 : -1;
                    scrollToItem(nextIdx);
                    return nextIdx;
                });
                break;
            case "Enter":
                e.preventDefault();
                if (filteredItems.length === 2) {
                    onChange([filteredItems[0]]);
                    setSearchInput("");
                    setShowDropdown(false);
                    setHighlightedIndex(-1);
                } else if (highlightedIndex >= 0 && filteredItems[highlightedIndex]) {
                    const selectedItem = filteredItems[highlightedIndex];
                    if (selectedItems.includes(selectedItem)) {
                        onChange(selectedItems.filter((i) => i !== selectedItem));
                    } else {
                        onChange([...selectedItems, selectedItem]);
                    }
                    setSearchInput("");
                    setShowDropdown(false);
                    setHighlightedIndex(-1);
                }
                break;
            case "Backspace":
                if (searchInput === "" && selectedItems.length > 0) {
                    onChange(selectedItems.slice(0, -1));
                }
                break;
            case "Escape":
                setShowDropdown(false);
                setHighlightedIndex(-1);
                break;
            default:
                break;
        }
    };

    return (
        <div style={{ position: "relative" }} ref={containerRef}>
            <div
                style={{
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    display: "flex",
                    alignItems: "center",
                }}
                onClick={() => setShowDropdown(true)}
            >
                {/* Show single label instead of tags */}
                {selectedItems.length > 0 && (
                    <div
                        style={{
                            color: "#797878ff",
                            fontWeight: 500,
                            fontSize: "14px",
                            marginRight: "8px",
                        }}
                    >

                        Selected {Name} {selectedItems.length}
                    </div>
                )}

                <input
                    style={{
                        border: "none",
                        outline: "none",
                        flex: 1,
                        minWidth: "60px",
                        padding: "4px 8px",
                    }}
                    placeholder={selectedItems.length === 0 ? placeholder : ""}
                    value={searchInput}
                    onChange={(e) => {
                        setSearchInput(e.target.value);
                        setShowDropdown(true);
                    }}
                    onKeyDown={handleKeyDown}
                />
            </div>

            {/* Dropdown menu */}
            {showDropdown && (
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        maxHeight: "200px",
                        overflowY: "auto",
                        border: "1px solid #ddd",
                        backgroundColor: "#fff",
                        zIndex: 1000,
                        marginTop: "2px",
                        borderRadius: "4px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                    ref={dropdownRef}
                >
                    <div style={{display:"flex",justifyContent:"flex-end"}}>
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            fontSize: "20px",
                            marginBottom: "-15px",
                            
                            width: "20px",
                            height: "20px",
                            alignItems: "center",
                            marginTop:"3px",
                            cursor:"pointer"
                        }} onClick={() => setShowDropdown(false)}
                          onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#f0f0f0";
                                e.currentTarget.style.color = "#333";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = "#666";
                            }}><FaTimes size={16} /></div>

                    </div>
                    
                    {showSelectAll && (
                        <div
                            style={{
                                padding: "8px",
                                borderBottom: "1px solid #eee",
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                            }}
                            onClick={handleSelectAll}
                        >
                            <input type="checkbox" checked={allSelected} readOnly />{" "}
                            <span style={{ marginLeft: "8px" }}>Select All</span>

                        </div>
                    )}
                    {filteredItems.length ? (
                        filteredItems.map((item, index) => {
                            const isSelected = selectedItems.includes(item);
                            return (
                                <div
                                    key={index}
                                    style={{
                                        padding: "8px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        backgroundColor:
                                            highlightedIndex === index ? "#f0f0f0" : "",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        if (isSelected) {
                                            onChange(selectedItems.filter((i) => i !== item));
                                        } else {
                                            onChange([...selectedItems, item]);
                                        }
                                        setSearchInput("");
                                        
                                        setHighlightedIndex(-1);
                                    }}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                >
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            readOnly
                                            style={{ marginRight: "8px" }}
                                        />
                                        {item}
                                    </div>
                                    {isSelected && <FaCheck style={{ color: "#107393" }} />}
                                </div>
                            );
                        })
                    ) : (
                        <div style={{ padding: "8px", color: "#999" }}>No data found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
