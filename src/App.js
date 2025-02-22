// import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function App() {
  const position = [ 21.05311109290442, 105.74254870938998];
  return (
    <div className="App">
      <h1>My Listings Map</h1>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            Sample listing at <br /> {position.join(", ")}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default App;
