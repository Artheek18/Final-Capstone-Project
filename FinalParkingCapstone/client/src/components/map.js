import { useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
} from "@react-google-maps/api";
import Places from "./places";
import Distance from "./distance";

export default function Map() {
  const [office, setOffice] = useState();
  const [directions, setDirections] = useState();
  const [isDirectionsFetched, setIsDirectionsFetched] = useState(false); // new state variable
  const mapRef = useRef();
  const center = useMemo(() => ({ lat: 43.6577, lng: -79.49 }), []);
  const options = useMemo(
    () => ({
      mapId: "b181cac70f27f5e6",
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );
  const onLoad = useCallback((map) => (mapRef.current = map), []);
  const houses = useMemo(() => generateHouses(center), [center]);
  const navigate = useNavigate();
  const fetchDirections = (house) => {
    if (!office) return;

    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: house,
        destination: office,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
          setIsDirectionsFetched(true); // set state variable to true after directions are fetched
        }
      }
    );
  };

  return (
    <div className="container">
      <div className="controls">
        <h1>Find Parking</h1>
        <Places
          setOffice={(position) => {
            setOffice(position);
            mapRef.current?.panTo(position);
          }}
        />
        {!office && <p>Enter Your Current Address.</p>}
        {directions && <Distance leg={directions.routes[0].legs[0]} />}
        {isDirectionsFetched && (
          <button className="btn-find-parking" onClick={() => navigate("/")}>
            Find Parking
          </button>
        )}
      </div>

      <div className="map">
        <GoogleMap
          zoom={10}
          center={center}
          mapContainerClassName="map-container"
          options={options}
          onLoad={onLoad}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  zIndex: 50,
                  strokeColor: "#1976D2",
                  strokeWeight: 5,
                },
              }}
            />
          )}

          {office && (
            <>
              <Marker
                position={office}
                icon="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
              />

              <MarkerClusterer>
                {(clusterer) =>
                  houses.map((house) => (
                    <Marker
                      key={house.lat}
                      position={house}
                      clusterer={clusterer}
                      onClick={() => {
                        fetchDirections(house);
                        localStorage.setItem("pkname", house.name);
                      }}
                    />
                  ))
                }
              </MarkerClusterer>

              <Circle center={office} radius={15000} options={closeOptions} />
              <Circle center={office} radius={30000} options={middleOptions} />
              <Circle center={office} radius={45000} options={farOptions} />
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};
const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};
const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.05,
  strokeColor: "#FBC02D",
  fillColor: "#FBC02D",
};
const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: "#FF5252",
  fillColor: "#FF5252",
};

// const generateHouses = (position: LatLngLiteral) => {
//   const _houses: Array<LatLngLiteral> = [];
//   for (let i = 0; i < 2; i++) {
//     const direction = Math.random() < 0.5 ? -2 : 2;
//     _houses.push({
//       lat: position.lat + Math.random() / direction,
//       lng: position.lng + Math.random() / direction,
//     });
//   }
//   return _houses;

// };
const generateHouses = (position) => {
  return [
    { lat: position.lat + 0.01, lng: position.lng + 0.01, name: "John" }, // first house
    { lat: position.lat - 0.01, lng: position.lng - 0.01, name: "John2" }, // second house
    { lat: position.lat + 0.02, lng: position.lng - 0.02, name: "John3" }, // third house
    { lat: position.lat + 0.03, lng: position.lng - 0.03, name: "John4" }, // third house
  ];
};
