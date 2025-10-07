import { FaChevronDown } from "react-icons/fa";
import React, { useState, useRef, useEffect } from "react";


const SearchHeader = ( handleClick,handleReset)=>{
   const [locationSearchInput, setLocationSearchInput] = useState("");

    const [selectedLocations, setSelectedLocations] = useState([]);
    const [showLocation, setShowLocation] = useState(false);
    const dropdownRef = useRef(null);
    const locations = JSON.parse(localStorage.getItem("locations")) || [];
     
   const screenWidth = window.innerWidth;
   
   
     // Add these state variables
   
     const [highlightedIndex, setHighlightedIndex] = useState(-1);
   
     // Filtered locations based on search input
     // const filteredLocations = locations?.filter(item =>
     //   item.Location.toLowerCase().includes(locationSearchInput.toLowerCase())
     // ) || [];
     const filteredLocations =
       locations?.filter(
         (locationName) =>
           locationName &&
           locationName.toLowerCase().includes(locationSearchInput.toLowerCase())
       ) || [];
   
   
   
     const dropdownMenuRef = useRef(null); // Add this ref for the dropdown menu
   
     const handleLocationKeyDown = (e) => {
       if (!showLocation) {
         setShowLocation(true);
         return;
       }
   
       switch (e.key) {
         case 'ArrowDown':
           e.preventDefault();
           setHighlightedIndex(prev => {
             const newIndex = prev < filteredLocations.length - 1 ? prev + 1 : prev;
   
             // Scroll to ensure the highlighted item is visible
             if (dropdownMenuRef.current && newIndex !== prev) {
               const highlightedElement = dropdownMenuRef.current.children[newIndex];
               if (highlightedElement) {
                 highlightedElement.scrollIntoView({
                   block: 'nearest',
                   behavior: 'smooth'
                 });
               }
             }
   
             return newIndex;
           });
           break;
         case 'ArrowUp':
           e.preventDefault();
           setHighlightedIndex(prev => {
             const newIndex = prev > 0 ? prev - 1 : -1;
   
             // Scroll to ensure the highlighted item is visible
             if (dropdownMenuRef.current && newIndex !== prev && newIndex >= 0) {
               const highlightedElement = dropdownMenuRef.current.children[newIndex];
               if (highlightedElement) {
                 highlightedElement.scrollIntoView({
                   block: 'nearest',
                   behavior: 'smooth'
                 });
               }
             }
   
             return newIndex;
           });
           break;
         case 'Enter':
           e.preventDefault();
           if (filteredLocations.length === 1) {
             handleLocation(filteredLocations[0]);
             setHighlightedIndex(-1);
             setShowLocation(false);
             return;
           }
           if (highlightedIndex >= 0 && filteredLocations[highlightedIndex]) {
             handleLocation(filteredLocations[highlightedIndex]);
             setHighlightedIndex(-1);
           }
           break;
         case 'Backspace':
           if (locationSearchInput === '' && selectedLocations.length > 0) {
             removeLocation(selectedLocations[selectedLocations.length - 1]);
           }
           break;
         case 'Escape':
           setShowLocation(false);
           setHighlightedIndex(-1);
           break;
         default:
           break;
       }
     };
   
     // Update your handleLocation function
     const handleLocation = (locationName) => {
       if (!selectedLocations.includes(locationName)) {
         setSelectedLocations([...selectedLocations, locationName]);
         setShowLocation(false);
       }
       setLocationSearchInput("");
       setShowLocation(false);
       setHighlightedIndex(-1);
     };
     const removeLocation = (locationToRemove) => {
       setSelectedLocations(selectedLocations.filter(location => location !== locationToRemove));
     };

      
  return (
    <>
      <div className="container-fluid">
    <div
              className="row mt-2 search-report-card d-flex gap-4 flex-wrap align-items-center"
              style={{ gap: '24px' }}
            >
              <div
                className="col-sm-3 col-lg-3 d-flex align-items-center gap-3"
                style={{ position: 'relative', minWidth: '250px' }}
              >
                <div
                  ref={dropdownRef}
                  className="search-bar"
                  onClick={() => setShowLocation(true)}
                  style={{
                    border: '1px solid #000',
                    padding: '5px',
                    borderRadius: '5px',
                    // minHeight: '30px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '5px',
                    alignItems: 'center',
                    cursor: 'pointer',
                    width: '250px',
                    minWidth: '250px',
                    maxWidth: '250px',
                    height: selectedLocations.length >= 2 ? '60px' : 'auto',
                    overflowY: selectedLocations.length >= 2 ? 'auto' : 'hidden',
                    overflowX: 'hidden',
                  }}
                >
                  <div>
                    {selectedLocations.map((location, index) => (
                      <span key={index} className="selected-location">
                        {location}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeLocation(location);
                          }}
                          style={{
                            backgroundColor: 'black',
                            color: 'white',
                            border: 'none',
                            marginLeft: '5px',
                            borderRadius: '50%',
                            width: '18px',
                            height: '18px',
                            fontSize: '12px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          ×
                        </button>
                        &nbsp;
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder={selectedLocations.length === 0 ? 'Select Locations...' : ''}
                      value={locationSearchInput}
                      onChange={(e) => {
                        setLocationSearchInput(e.target.value);
                        setShowLocation(true);
                      }}
                      onKeyDown={handleLocationKeyDown}
                      style={{
                        border: 'none',
                        outline: 'none',
                        width: selectedLocations.length > 0 ? '70px' : '100%',
                        backgroundColor: 'transparent',
                        minWidth: '60px',
                      }}
                    />
                  </div>
                  {selectedLocations.length < 1 ? <FaChevronDown style={{ color: 'grey' }} /> : ''}
                </div>

                {showLocation && (
                  <div
                    ref={dropdownMenuRef}
                    className="location-card"
                    style={{
                      position: 'absolute',
                      zIndex: 1000,
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      width: '230px',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      top: '100%',
                      marginLeft: '1px',
                      marginTop: '3px',
                    }}
                  >
                    {filteredLocations.map((locationName, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '8px 12px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #eee',
                          backgroundColor: index === highlightedIndex ? '#f0f0f0' : 'transparent',
                        }}
                        onClick={() => {
                          handleLocation(locationName);
                          setShowLocation(false);
                        }}
                        onMouseEnter={() => setHighlightedIndex(index)}
                      >
                        {locationName}
                      </div>
                    ))}
                    {filteredLocations.length === 0 && (
                      <div style={{ padding: '8px 12px', color: '#999' }}>No locations found</div>
                    )}
                  </div>
                )}
              </div>

              <div className="col-12 col-md-6 d-flex align-items-center gap-3 flex-nowrap">
                <button
                  style={{
                    backgroundColor: '#4BC0C0',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '5px',
                    whiteSpace: 'nowrap',
                  }}
                  onClick={handleClick}
                  className="me-2"
                >
                  Search
                </button>
                <button
                  style={{
                    backgroundColor: '#4BC0C0',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '5px',
                    whiteSpace: 'nowrap',
                  }}
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </div>
            </div>
    </>
  )};

  export default SearchHeader;