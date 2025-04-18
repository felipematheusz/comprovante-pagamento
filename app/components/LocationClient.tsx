"use client";

import { useState } from "react";
import { LocationData } from "../actions/location";
import { saveLocationToDB } from "../actions/saveLocation";

type LocationWithTimestamp = {
  id: string;
  ip: string;
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  country: string;
  timestamp: Date;
};

interface LocationClientProps {
  initialLocation: LocationData;
  initialSavedLocations: LocationWithTimestamp[];
}

export default function LocationClient({
  initialLocation,
  initialSavedLocations,
}: LocationClientProps) {
  const [location, setLocation] = useState<LocationData>(initialLocation);
  const [savedLocations, setSavedLocations] = useState<LocationWithTimestamp[]>(
    initialSavedLocations
  );

  const updateLocation = async () => {
    try {
      const response = await fetch("/api/location");
      if (!response.ok) throw new Error("Falha ao atualizar localização");
      const newLocation = await response.json();
      setLocation(newLocation);
      await saveLocationToDB(newLocation);
      // Atualiza a lista de localizações
      setSavedLocations([
        {
          ...newLocation,
          id: Date.now().toString(),
          timestamp: new Date(),
        } as LocationWithTimestamp,
        ...savedLocations,
      ]);
    } catch (error) {
      setLocation({
        ...location,
        error: "Erro ao atualizar localização: " + (error as Error).message,
      });
    }
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Sua Localização</h1>

      {location?.error ? (
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
            <button
              onClick={updateLocation}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors w-full sm:w-auto"
            >
              Atualizar Localização
            </button>
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
