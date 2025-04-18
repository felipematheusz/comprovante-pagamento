import { getLocationData } from "./actions/location";
import { getLocationsFromDB } from "./actions/saveLocation";
import LocationClient from "./components/LocationClient";

export default async function Home() {
  const initialLocation = await getLocationData();
  const savedLocations = await getLocationsFromDB();

  return (
    <LocationClient
      initialLocation={initialLocation}
      initialSavedLocations={savedLocations}
    />
  );
}
