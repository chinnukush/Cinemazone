import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { FiSearch } from "react-icons/fi";
import { VscClose } from "react-icons/vsc";
import { BiHomeAlt2, BiSolidMovie, BiStar } from "react-icons/bi";
import { BsTv } from "react-icons/bs";

import posterPlaceholder from "../assets/images/poster-placeholder.png";

export default function Nav() {
  const BASE = import.meta.env.VITE_BASE_URL;
  const SITENAME = import.meta.env.VITE_SITENAME;

  const [query, setQuery] = useState("");
  const [debouncedVal, setDebouncedVal] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [navStatus, setNavStatus] = useState("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  const location = useLocation();
  const searchRef = useRef();
  const mobileRef = useRef();

  // 🌙 THEME
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
    if (saved === "light") {
      document.documentElement.classList.add("light");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  // ✅ FIXED NAV STATUS
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setNavStatus("Home");
    else if (path.startsWith("/Movies")) setNavStatus("Movies");
    else if (path.startsWith("/Series")) setNavStatus("Series");
  }, [location.pathname]);

  // ⏳ DEBOUNCE
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedVal(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // 🔍 SEARCH
  useEffect(() => {
    if (!debouncedVal.trim()) {
      setSearchResult([]);
      return;
    }

    setIsLoading(true);

    fetch(`${BASE}/api/search/?query=${debouncedVal}&page=1`)
      .then((res) => res.json())
      .then((data) => {
        setSearchResult(data.results || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [debouncedVal]);

  // ❌ CLOSE SEARCH
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="fixed flex items-center justify-between z-50 bg-bgColor/80 backdrop-blur-lg top-0 left-0 right-0 py-4 px-5 md:px-10">

      {/* LEFT (LOGO + THEME) */}
      <div className="flex items-center gap-3">
        <div className="bg-black text-white px-3 py-1 rounded-lg font-bold uppercase">
          cz
        </div>

        <button
          onClick={toggleTheme}
          className="w-14 h-7 flex items-center bg-gray-700 rounded-full p-1"
        >
          <div
            className={`bg-white w-5 h-5 rounded-full transition ${
              theme === "light" ? "translate-x-7" : ""
            }`}
          />
        </button>
      </div>

      {/* SITENAME */}
      <Link to="/" className="hidden md:block text-xl font-bold">
        {SITENAME}
      </Link>

      {/* ✅ RIGHT SIDE MENU (FIXED POSITION) */}
      <div className="flex items-center gap-5 ml-auto">

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex gap-6">
          <Link
            to="/"
            className={navStatus === "Home" ? "text-otherColor" : ""}
          >
            <BiHomeAlt2 />
          </Link>

          <Link
            to="/Movies"
            className={navStatus === "Movies" ? "text-otherColor" : ""}
          >
            <BiSolidMovie />
          </Link>

          <Link
            to="/Series"
            className={navStatus === "Series" ? "text-otherColor" : ""}
          >
            <BsTv />
          </Link>
        </nav>

        {/* MOBILE MENU BUTTON (TOP RIGHT) */}
        <div className="md:hidden relative" ref={mobileRef}>
          <div
            onClick={() => setMobileMenuOpen(true)}
            className="cursor-pointer text-2xl"
          >
            ☰
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="absolute right-0 top-10 bg-black text-white p-5 rounded-xl"
              >
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link><br />
                <Link to="/Movies" onClick={() => setMobileMenuOpen(false)}>Movies</Link><br />
                <Link to="/Series" onClick={() => setMobileMenuOpen(false)}>Series</Link>

                <VscClose
                  className="absolute top-2 right-2 cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative w-full md:w-1/3 ml-5" ref={searchRef}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
          className="w-full py-2 px-4 bg-btnColor rounded-md outline-none"
        />

        <FiSearch className="absolute right-3 top-3" />

        {debouncedVal && (
          <div className="absolute top-12 w-full bg-black text-white rounded-lg p-3 max-h-80 overflow-y-auto z-50">
            {isLoading ? (
              <p>Loading...</p>
            ) : searchResult.length > 0 ? (
              searchResult.map((item) => (
                <Link
                  key={item.tmdb_id}
                  to={
                    item.media_type === "movie"
                      ? `/mov/${item.tmdb_id}`
                      : `/ser/${item.tmdb_id}`
                  }
                  className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded"
                  onClick={() => setQuery("")}
                >
                  <LazyLoadImage
                    src={item.poster || posterPlaceholder}
                    className="w-10 h-14 rounded"
                  />

                  <div>
                    <p>{item.title}</p>
                    {item.rating && (
                      <span className="text-xs flex items-center gap-1">
                        <BiStar /> {item.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <p>No results found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
