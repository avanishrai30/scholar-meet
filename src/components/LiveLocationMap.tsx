import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px"
};

interface LiveLocationMapProps {
  lat: number;
  lng: number;
}

const API_KEY = "AIzaSyBXsGHcijB6nlcHY6LkEsdTEgaxt9MTvno";

const LiveLocationMap: React.FC<LiveLocationMapProps> = ({ lat, lng }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY
  });

  const center = { lat, lng };

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
      <Marker position={center} />
    </GoogleMap>
  ) : null;
};

export default LiveLocationMap;