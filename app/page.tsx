"use client";

import { useState, useEffect } from "react";
import { getLocationData, type LocationData } from "./actions/location";
import { saveLocationToDB, getLocationsFromDB } from "./actions/saveLocation";

type LocationWithTimestamp = LocationData & {
  timestamp: Date;
  id: string;
};

export default function Home() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savedLocations, setSavedLocations] = useState<LocationWithTimestamp[]>(
    []
  );

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const data = await getLocationData();
        setLocation(data);
        await saveLocationToDB(data);
        const locations = await getLocationsFromDB();
        setSavedLocations(locations);
      } catch (error) {
        const errorLocation = {
          ip: "",
          latitude: 0,
          longitude: 0,
          city: "",
          region: "",
          country: "",
          error: "Erro ao obter localização: " + (error as Error).message,
        };
        setLocation(errorLocation);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Sua Localização</h1>

      {isLoading ? (
        <div className="text-gray-600 animate-pulse">
          Carregando localização...
        </div>
      ) : location?.error ? (
        <div className="text-red-500 p-4 bg-red-50 rounded-lg">
          {location.error}
        </div>
      ) : (
        <>
          <div className="space-y-3 text-center bg-white p-6 rounded-lg shadow-md w-full max-w-md mb-8">
            <p className="text-gray-700">
              <span className="font-semibold">IP:</span> {location?.ip}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Cidade:</span> {location?.city}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Estado:</span> {location?.region}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">País:</span> {location?.country}
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <p className="text-gray-700">
                <span className="font-semibold">Latitude:</span>{" "}
                {location?.latitude}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Longitude:</span>{" "}
                {location?.longitude}
              </p>
            </div>
          </div>

          {savedLocations.length > 0 && (
            <div className="w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                Histórico de Localizações
              </h2>
              <div className="space-y-4">
                {savedLocations.map((loc) => (
                  <div
                    key={loc.id}
                    className="bg-white p-4 rounded-lg shadow-sm"
                  >
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(loc.timestamp).toLocaleString()}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Cidade:</span> {loc.city},{" "}
                      {loc.region}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">IP:</span> {loc.ip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
