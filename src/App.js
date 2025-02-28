// import logo from "./logo.svg";
// import "./App.css";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Header from "./Header";
import SearchForm from "./SearchForm";
// import Navbar from './Navbar';

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Configure default marker icons
// Create a custom icon with larger size and adjust anchor points
const customIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [40, 60], // Increase size: [width, height]
  iconAnchor: [25, 50], // Anchor the icon (usually half of width, full height)
  popupAnchor: [0, -50], // Popup opens above the marker
});

function App() {
  // State to hold the listings from the backend
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Define a default center. You can change this if needed.
  // Note: Leaflet Marker expects [lat, lng] order.

  const defaultCenter = [21.052646532979736, 105.73518689483814];
  // Fetch listings from your API endpoint when the component mounts
  // useEffect(() => {
  //   fetchSearch();
  // }, []);

  const fetchListingsNearby = (queryParams = "") => {
    setLoading(true);
    fetch(
      "http://localhost:5000/api/listings/nearby?lat=21.052646532979736&lng=105.73518689483814&min=6000&max=19000&lim=20&radius=10000"
    )
      .then((response) => response.json())
      .then((jsonData) => {
        if (jsonData.success && jsonData.data) {
          setListings(jsonData.data);
        } else {
          console.error("Error in response:", jsonData);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching listings:", error);
        setLoading(false);
      });
  };

  const fetchSearch = (queryParams = "") => {
    setLoading(true);
    setError("");
    fetch(`http://localhost:5000/api/listings/search?${queryParams}`)
      .then((response) => response.json())
      .then((jsonData) => {
        if (jsonData.success && jsonData.data) {
          setListings(jsonData.data);
          setSearchPerformed(true);
        } else {
          console.error("Error in response:", jsonData);
          setError("No listings found.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching listings:", error);
        setError("Error fetching listings.");
        setLoading(false);
      });
  };

  const handleSearch = (conditions) => {
    console.log("Search Conditions:", conditions);
    // Convert to MongoDB query, API call, or state update
    const queryParams = conditions
      .map((cond) => {
        if (cond.condition === "between") {
          return `${cond.field}_gte=${cond.value}&${cond.field}_lte=${cond.value2}`;
        } else if (cond.condition === "contains") {
          return `${cond.field}_regex=${encodeURIComponent(cond.value)}`;
        } else {
          return `${cond.field}=${encodeURIComponent(cond.value)}`;
        }
      })
      .join("&");
    // Fetch listings based on search
    fetchSearch(queryParams);
  };

  return (
    <div className="App">
      <Header />
      <SearchForm onSearch={handleSearch} />
      <div className="content">
        <MapContainer
          center={defaultCenter}
          zoom={16}
          style={{ height: "1000px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {listings.map((listing) => {
            // Make sure the listing has valid geo data
            if (!listing.location || !listing.location.coordinates) return null;
            // GeoJSON stores coordinates as [lng, lat]. Convert them for Leaflet.
            const [lng, lat] = listing.location.coordinates;
            // console.log(lng, lat);
            return (
              <Marker key={listing._id} position={[lat, lng]} icon={customIcon}>
                <Popup>
                  <div>
                    <strong>{listing["Nội dung"]}</strong>
                    <br />
                    Giá chào: {listing["Giá chào hợp đồng (Triệu VNĐ)"]} Triệu
                    VNĐ
                    <br />
                    Diện tích: {listing["Diện tích trên sổ (m)"]}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {loading && <p>Loading listings...</p>}
      {/* Search Results List */}
      <div className="search-results">
        <h3>Search Results:</h3>
        {loading ? (
          <p>Loading listings...</p>
        ) : error ? (
          <p>{error}</p>
        ) : !searchPerformed ? ( // 🚀 No message before search
          <p>Please enter search criteria above.</p>
        ) : listings.length === 0 ? (
          <p>No listings found</p>
        ) : (
          <ul>
            {listings.map((listing) => (
              <li key={listing._id}>
                <strong>{listing["Quận huyện"]}</strong> - {listing["Mô tả"]} -
                <b> {listing["Giá chào hợp đồng (Triệu VNĐ)"]} Triệu</b>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
