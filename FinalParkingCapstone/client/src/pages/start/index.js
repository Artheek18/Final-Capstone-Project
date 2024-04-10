import { useLoadScript } from "@react-google-maps/api";
import Map from "../../components/map";

export default function Home() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBICIkecEtvh7jX7GbgkqTzSszZJUy11Lc",
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map />;
}
