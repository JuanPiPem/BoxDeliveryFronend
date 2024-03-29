import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

interface MapProps {
  destination: string;
}

const MapContainer: React.FC<MapProps> = ({ destination }) => {
  const [response, setResponse] = useState<google.maps.DirectionsResult | null>(
    null
  );
  const [origin, setOrigin] = useState<google.maps.LatLngLiteral | undefined>(
    undefined
  );
  const [error, setError] = useState<string | null>(null);
  const mapStyles = {
    width: "300px",
    height: "396px",
  };

  useEffect(() => {
    // Obtener la ubicación actual del repartidor
    const successCallback = (position: GeolocationPosition) => {
      setOrigin({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };

    const errorCallback = (error: GeolocationPositionError) => {
      setError("No se pudo obtener la ubicación actual.");
      console.error(error);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
      setError("Geolocalización no soportada por tu navegador.");
    }
  }, []);

  return (
    <div style={{ height: "400px" }}>
      <LoadScript
        googleMapsApiKey={
          process.env.NEXT_PUBLIC_API_GOOGLE_MAPS || "UNDEFINED"
        }
        onLoad={() => {}}
      >
        {origin && (
          <GoogleMap
            mapContainerStyle={mapStyles}
            center={origin}
            zoom={13}
            onLoad={(map) => {
              map.addListener("scroll", () => {});
            }}
          >
            {destination && (
              <DirectionsService
                options={{
                  destination: destination,
                  origin: origin,
                  travelMode: google.maps.TravelMode.DRIVING,
                }}
                callback={(result, status) => {
                  if (status === google.maps.DirectionsStatus.OK) {
                    setResponse(result);
                  } else {
                    setError("No se pudo calcular la ruta.");
                  }
                }}
              />
            )}
            {response && (
              <DirectionsRenderer
                options={{
                  directions: response,
                }}
              />
            )}
          </GoogleMap>
        )}
        {error && <p>{error}</p>}
      </LoadScript>
    </div>
  );
};

export default MapContainer;
