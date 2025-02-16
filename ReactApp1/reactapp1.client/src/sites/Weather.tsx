import { useEffect, useState } from "react";

const API_KEY = "57bf91067fa3fd8d0eae638e2baf0334";
const CITY = "Inari";
const COUNTRY = "FI";
interface WeatherInfo {
    name: string;
    weather: { description: string }[];
    main: { temp: number, humidity: number };
    wind: { speed: number };
}
export default function Weather() {
    const [weather, setWeather] = useState<WeatherInfo|null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=Inari&appid=${API_KEY}&units=metric`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Weather data not found");
                }
                return response.json();
            })
            .then((data) => {
                setWeather(data as WeatherInfo);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading weather data...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="p-4 bg-blue-100 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold">Weather in {weather?.name}</h2>
            <p className="text-lg">{weather?.weather[0].description}</p>
            <p className="text-lg">Temperature: {weather?.main.temp} &deg;C</p>
            <p className="text-lg">Humidity: {weather?.main.humidity}%</p>
            <p className="text-lg">Wind Speed: {weather?.wind.speed} m/s</p>
        </div>
    );
}