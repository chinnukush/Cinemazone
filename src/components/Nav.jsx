import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/black-and-white.css";

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
  const [searcResult, setSearchResult] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [navStatus, setNavStatus] = useState("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 🌙 THEME STATE
  const [theme, setTheme] = useState("dark");

  const location = useLocation();

  // ✅ Load theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);

    if (savedTheme === "light") {
      document.documentElement.classList.add("light");
    }
  }, []);

  // ✅ Toggle theme
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

  // NAV STATUS
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setNavStatus("Home");
    else if (path.startsWith("/mov")) setNavStatus("Movies");
    else if (path.startsWith("/ser")) setNavStatus("Series");
  }, [location.pathname]);

  // SEARCH FETCH
  useEffect(() => {
    if (!debouncedVal) return;

    setIsLoading(true);
    fetch(`${BASE}/api/search/?query=${debouncedVal}&page=1`)
      .then((res) => res.json())
      .then((data) => {
        setSearchResult(data.results);
        setIsLoading(false);
      });
  }, [debouncedVal]);

  // DEBOUNCE
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedVal(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // CLOSE SEARCH DROPDOWN
  const closeSearchResultsDropDown = useRef();
  useEffect(() => {
    const handler = (e) => {
      if (
        closeSearchResultsDropDown.current &&
        !closeSearchResultsDropDown.current.contains(e.target)
      ) {
        setDebouncedVal("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // MOBILE MENU CLOSE
  const closeMobileMenu = useRef();
  useEffect(() => {
    const handler = (e) => {
      if (
        closeMobileMenu.current &&
        !closeMobileMenu.current.contains(e.target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("scroll", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("scroll", handler);
    };
  }, []);

  return (
    <>
      <div className="fixed flex items-center justify-between gap-3 z-20 bg-bgColor/60 backdrop-blur-md top-0 left-0 right-0 py-4 px-5 md:px-10 text-white">
        
        {/* 🔥 LEFT SIDE (LOGO + TOGGLE) */}
        <div className="flex items-center gap-3">
          {/* CZ LOGO */}
          <div className="bg-black px-3 py-1 rounded-lg font-bold uppercase">
            cz
          </div>

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="w-14 h-7 flex items-center bg-gray-700 rounded-full p-1 transition"
          >
            <div
              className={`bg-white w-5 h-5 rounded-full transform transition ${
                theme === "light" ? "translate-x-7" : ""
              }`}
            />
          </button>

          <span className="text-sm">
            {theme === "dark" ? "🌙" : "☀️"}
          </span>
        </div>

        {/* SITENAME */}
        <Link
          to="/"
          className="hidden md:flex items-center gap-2 uppercase text-otherColor font-extrabold text-2xl"
        >
          <p>{SITENAME}</p>
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            {[
              { icon: BiHomeAlt2, name: "Home" },
              { icon: BiSolidMovie, name: "Movies" },
              { icon: BsTv, name: "Series" },
            ].map((navItem, index) => (
              <Link
                key={index}
                to={navItem.name === "Home" ? "/" : navItem.name}
                className={
                  navStatus === navItem.name
                    ? "flex flex-col items-center text-otherColor scale-105"
                    : "flex flex-col items-center hover:text-otherColor hover:scale-105"
                }
                onClick={() => setNavStatus(navItem.name)}
              >
                <li className="text-2xl">
                  <navItem.icon />
                </li>
                <p className="text-sm text-secondaryTextColor">
                  {navItem.name}
                </p>
              </Link>
            ))}
          </ul>
        </nav>

        {/* MOBILE MENU */}
        <div className="relative block md:hidden">
          <div onClick={() => setMobileMenuOpen(true)}>
            <div className="h-[2px] w-6 bg-secondaryTextColor mb-1"></div>
            <div className="h-[2px] w-4 bg-secondaryTextColor mb-1"></div>
            <div className="h-[2px] w-2 bg-secondaryTextColor"></div>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="absolute w-52 top-12 rounded-3xl bg-btnColor p-6"
                ref={closeMobileMenu}
              >
                {["Home", "Movies", "Series"].map((name, i) => (
                  <Link
                    key={i}
                    to={name === "Home" ? "/" : name}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block p-2"
                  >
                    {name}
                  </Link>
                ))}
                <VscClose
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute text-3xl top-2 right-2"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SEARCH */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="relative flex items-center w-full md:w-1/2"
          ref={closeSearchResultsDropDown}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="py-3 px-10 bg-btnColor/70 rounded-md w-full"
          />
          <FiSearch className="absolute right-5" />
        </form>
      </div>
    </>
  );
}
