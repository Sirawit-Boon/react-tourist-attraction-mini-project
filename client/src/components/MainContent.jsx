import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import TravelPost from "./ui/TravelPost";

export function MainContent() {
  const [posts, setPosts] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");

  useEffect(() => {
    const handleInput = setTimeout(() => {
      setDebouncedInput(inputSearch);
    }, 500);
    return () => {
      clearTimeout(handleInput);
    };
  }, [inputSearch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4001/trips?keywords=${debouncedInput}`
        );
        setPosts(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData(inputSearch);
  }, [posts]);

  return (
    <section className="hero h-screen w-full flex justify-center">
      <div className="wrapper  h-full flex flex-col items-center p-8 md:p-16 max-w-[1200px] gap-4">
        <h1 className="header text-[#58cce9] text-4xl font-bold">
          เที่ยวไหนดี
        </h1>
        <form className="w-3/4 flex flex-col justify-start gap-2">
          <label className="text-start " htmlFor="search">
            ค้นหาที่เที่ยว
          </label>
          <input
            type="text"
            className="text-search text-center border-b border-neutral-400 focus:outline-none"
            placeholder="หาที่เที่ยวแล้วไปกัน..."
            value={inputSearch}
            onChange={(event) => setInputSearch(event.target.value)}
          />
        </form>
        <TravelPost posts={posts} setInputSearch={setInputSearch}/>
      </div>
    </section>
  );
}
