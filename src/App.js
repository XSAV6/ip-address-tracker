import "leaflet/dist/leaflet.css";
import "./App.css";
import bgImg from "./Images/pattern-bg.png";
import arrowDown from "./Images/icon-arrow.svg";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import icon from "./icon";
import Markerposition from "./Markerposition";
import Spinner from "./Spinner";

function App() {
    const [ipAddress, setIpAddress] = useState("");
    const [address, setAddress] = useState(null);

    const checkIpAddress =
        /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
    const checkDomain =
        /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;

    const getEnteredData = async () => {
        const res = await fetch(
            `https://geo.ipify.org/api/v2/country,city?apiKey=${
                process.env.REACT_APP_IP_TRACKER_API_kEY
            }&${
                checkIpAddress.test(ipAddress)
                    ? `ipAddress=${ipAddress}`
                    : checkDomain.test(ipAddress)
                    ? `domain=${ipAddress}`
                    : ""
            }`
            // https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=8.8.8.8&domain=google.com
        );
        const data = await res.json();
        setAddress(data);
        console.log("Address: " + JSON.stringify(data));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        getEnteredData();
    };

    useEffect(() => {
        try {
            const getInitialData = async () => {
                const res = await fetch(
                    `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_IP_TRACKER_API_kEY}&ipAddress`
                );
                const data = await res.json();
                setAddress(data);
                console.log(data);
            };

            getInitialData();
        } catch (error) {
            alert(error);
        }
    }, []);

    return (
        <div className="App">
            <img className="pattern-bg" src={bgImg} alt="" srcset="" />
            <h1 className="title">IP Address Tracker</h1>
            <form
                autoComplete="off"
                className="inputBox"
                onSubmit={handleSubmit}
                action=""
            >
                <input
                    placeholder="Search for any IP address or domain"
                    className="input"
                    type="text"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                />
                <button type="submit" className="searchBtn">
                    <img src={arrowDown} alt="" srcset="" />
                </button>
            </form>
            <Spinner />
            {address && (
                <>
                    <article className="infoCard">
                        <div>
                            <h2>IP Address</h2>
                            <p>{address.ip}</p>
                        </div>
                        <span></span>
                        <div>
                            <h2>Location</h2>
                            <p>
                                {address.location.city},{" "}
                                {address.location.region}{" "}
                                {address.location.postalCode}
                            </p>
                        </div>
                        <span></span>

                        <div>
                            <h2>Timezone</h2>
                            <p>UTC {address.location.timezone}</p>
                        </div>
                        <span></span>

                        <div>
                            <h2>ISP</h2>
                            <p>{address.isp}</p>
                        </div>
                    </article>
                    <MapContainer
                        center={[address.location.lat, address.location.lng]}
                        zoom={13}
                        scrollWheelZoom={true}
                        style={{ height: "800px", width: "auto" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Markerposition
                            lat={address.location.lat}
                            lng={address.location.lng}
                        />
                    </MapContainer>
                </>
            )}
        </div>
    );
}

export default App;
