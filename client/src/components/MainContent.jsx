import { useEffect } from "react";
import { useState } from "react";
import { Link } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import axios from "axios";

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
        {posts.map((post, index) => {
          return (
            <article key={index} className="container mx-auto px-4 py-6">
              <main className="space-y-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <img
                      src={post.photos[0]}
                      alt={post.title}
                      className="rounded-3xl object-cover w-full h-[200px] md:h-[240px]"
                    />
                  </div>
                  <div className="md:w-2/3">
                    <div className="flex flex-col justify-between items-start gap-1">
                      <a href={post.url} target="_blank">
                        <h2 className="text-2xl font-semibold hover:underline">
                          {post.title}
                        </h2>
                      </a>
                      <p className="text-gray-600">
                        {post.description.length > 100
                          ? `${post.description.slice(0, 100)}  ...`
                          : post.description}
                      </p>
                      <div className="flex justify-between w-full items-center md:relative">
                      <a
                        href={post.url}
                        className="text-[#58cce9] font-semibold underline"
                        target="_blank"
                      >
                        อ่านต่อ
                      </a>
                      <Toaster />
                      <Link
                        className="border border-[#58cce9] rounded-3xl p-1 md:absolute md:top-28 md:right-10 z-50"
                        color="#58cce9"
                        size={40}
                        onClick={() => {
                          navigator.clipboard.writeText(post.url);
                          toast("Copied", {
                            description:
                              "This article has been copied to your clipboard.",
                            action: {
                              label: "Undo",
                              onClick: () => console.log("Undo"),
                            },
                          });
                        }}
                      />
                      </div>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <p className="text-gray-600">หมวด</p>
                      <div className="flex flex-wrap gap-x-2 gap-y-1">
                        {post.tags.map((tag, index) => (
                          <span key={index} className="text-gray-600">
                            {index === post.tags.length - 1 && (
                              <span>และ </span>
                            )}
                            <button
                              className="underline"
                              onClick={() => {
                                setInputSearch((prev) =>
                                  prev.includes(tag)
                                    ? prev
                                    : `${prev} ${tag}`.trim()
                                );
                              }}
                            >
                              {tag}
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-4 md:relative">
                      {post.photos.slice(1).map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt="image of travel places"
                          width={100}
                          height={100}
                          className="rounded-lg object-cover w-20 h-20"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </main>
            </article>
          );
        })}
      </div>
    </section>
  );
}
