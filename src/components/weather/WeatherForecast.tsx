import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Forecast {
    dt: number;
    temp: number;
    icon: string;
    description: string;
}

const WeatherForecast: React.FC = () => {
    const [city, setCity] = useState("");
    const [forecast, setForecast] = useState<Forecast[]>([]);
    const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
    const [cityName, setCityName] = useState<string>(""); // New state for city name

    const fetchWeather = async (location: string | { lat: number; lon: number }) => {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
        let url = "";

        if (typeof location === "string") {
            url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`;
        } else {
            url = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${apiKey}`;
            console.log(url)
        }

        try {
            const response = await axios.get(url);
            const data = response.data.list.map((entry: any) => ({
                dt: entry.dt,
                temp: entry.main.temp,
                icon: entry.weather[0].icon,
                description: entry.weather[0].description,
            }));
            setForecast(data);
            // Set city name based on the API response
            setCityName(response.data.city.name);
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    };

    const handleSearch = () => {
        if (city.trim()) {
            fetchWeather(city);
        }
    };

    const fetchCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCurrentLocation(position);
                fetchWeather({ lat: position.coords.latitude, lon: position.coords.longitude });
            },
            (error) => console.error("Error fetching location:", error)
        );
    };

    const graphData = forecast.map((f) => {
        const date = new Date(f.dt * 1000);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear().toString().slice(2)}`;
        const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        
        return {
            date: formattedDate,
            time: formattedTime,
            temperature: f.temp,
            iconUrl: `http://openweathermap.org/img/wn/${f.icon}.png`,
            description: f.description,
        };
    });

    const renderTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length > 0) {
            const { date, time, temperature, iconUrl, description } = payload[0].payload;
            return (
                <div style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", padding: "10px", borderRadius: "5px", color: "#fff" }}>
                    <strong>{date} {time}</strong>
                    <div>
                        <img src={iconUrl} alt="weather icon" style={{ width: "30px", height: "30px" }} />
                    </div>
                    <div>{description}</div>
                    <div>{temperature}°C</div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="weather-forecast">
            <div className="search-bar" style={searchBarStyle}>
                <input
                    type="text"
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={inputStyle}
                />
                <button onClick={handleSearch} style={buttonStyle}>Search</button>
                <button onClick={fetchCurrentLocation} style={buttonStyle}>Use Current Location</button>
            </div>

            {forecast.length > 0 && (
                <div className="forecast-graph">
                    <Card>
                        <CardHeader>
                            <CardTitle>{cityName ? `Weather Forecast for ${cityName}` : "Weather Forecast"}</CardTitle>
                            <CardDescription>Temperature forecast for the next 5 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={600}>
                                <LineChart data={graphData}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Line
                                        type="monotone"
                                        dataKey="temperature"
                                        stroke="#8884d8"
                                    />
                                    <Tooltip content={renderTooltip} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

// Inline styles for the search bar and buttons
const searchBarStyle: React.CSSProperties = {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '20px',
};

const inputStyle: React.CSSProperties = {
    padding: '10px',
    borderRadius: '5px',
    width: '250px',
    border: '1px solid #ccc',
};

const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    borderRadius: '5px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
};

export default WeatherForecast;
