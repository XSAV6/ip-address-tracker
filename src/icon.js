import L from "leaflet";
import icon from "./Images/icon-location.svg";

export default L.icon({
    iconSize: [42, 50],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: icon,
});
