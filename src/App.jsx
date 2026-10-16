import { useState } from "react"; 
import Sidebar from "./components/Sidebar";
import MovieRow from "./components/MovieRow";
import "./App.css";

const sections = {
  Home: [
    { title: "Popular Movie", endpoint: "/movie/popular" },
    { title: "Top Rated", endpoint: "/movie/top_rated" },
    { title: "Trending TV", endpoint: "/trending/tv/week" },
  ],
  "TV show": [{ title: "Popular TV", endpoint: "/tv/popular" }],
  Movie: [{ title: "Now Playing", endpoint: "/movie/now_playing" }],
  Animation: [
    { title: "Animation", endpoint: "/discover/movie?with_genres=16" },
  ],
  "Most Watched": [{ title: "Trending", endpoint: "/trending/all/day" }],
};

export default function App() {
  const [active, setActive] = useState("Home");

  return (
    <div className="layout">
      <Sidebar active={active} onSelect={setActive} />
      <main>
        {sections[active].map((s) => (
          <MovieRow key={s.endpoint} {...s} />
        ))}
      </main>
    </div>
  );
}