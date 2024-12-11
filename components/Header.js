import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { IoClose } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import { FaHome, FaSearch, FaTv, FaPlay, FaFilm, FaBars, FaStar } from "react-icons/fa";
import useFetchData from "@/hooks/useFetchData";

export default function Header() {
  // Navbar header component scroll sticky
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("nav");
      header.classList.toggle("sticky", window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Functions for navlist item page routing active status
  const router = useRouter();
  const [clicked, setClicked] = useState(false);
  const [navbar, setNavbar] = useState(false);
  const [searchbar, setSearchbar] = useState(false);

  const [activeLink, setActiveLink] = useState("/");

  // Search function by title of the movie
  const [movieshortname, setMovieshortname] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState(null);

  // Fetch data from API
  const { alldata, loading } = useFetchData(`/api/getmovies`);

  // Filter published movies
  const publishedData = alldata.filter((ab) => ab.status === "publish");

  // Function to handle search
  useEffect(() => {
    if (!movieshortname.trim()) {
      setSearchResult([]);
      return;
    }

    const filteredMovies = publishedData.filter((movie) =>
      movie.title.toLowerCase().includes(movieshortname.toLowerCase())
    );

    setSearchResult(filteredMovies);
  }, [movieshortname]);

  const handleMovieClick = () => {
    setMovieshortname("");
  };

  const searchRef = useRef(null);

  // Function to close search bar when clicking outside
  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setMovieshortname("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleClick = () => {
    setClicked(!clicked);
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setClicked(false);
  };

  useEffect(() => {
    // Update active link state when the page is reloaded
    setActiveLink(router.pathname);
  }, [router.pathname]);

  // Navbar
  const handleNavbarOpen = () => {
    setNavbar(!navbar);
  };

  const handleNavbarClose = () => {
    setNavbar(false);
  };

  // Search bar
  const handleSearchbarClose = () => {
    setSearchbar(false);
  };

  const searchInputRef = useRef(null);

  const handleSearchbarOpen = () => setSearchbar(true);

  
  

  return (
    <>
<nav className="header">
  <h1 className="logo1" data-text="&nbsp;Anime in Telugu&nbsp;">
    <a>Anime in Telugu&nbsp;</a>
  </h1>
  
  

  {/* Bottom Navigation Bar */}
<div className="bottom-navigation">
  <ul>
    <li>
      <Link href="/" onClick={handleSearchbarClose}>
        <FaHome />
        <span>Home</span>
      </Link>
    </li>
    <li>
      <Link href="/search">
        <FaSearch />
        <span>Search</span>
      </Link>
    </li>

    <li>
      <Link href="/series" onClick={handleSearchbarClose}>
        <FaTv />
        <span>Series</span>
      </Link>
    </li>
    <li>
      <Link href="/Anime" onClick={handleSearchbarClose}>
        <FaPlay />
        <span>Anime</span>
      </Link>
    </li>
    <li>
      <Link href="/films" onClick={handleSearchbarClose}>
        <FaFilm />
        <span>Movies</span>
      </Link>
    </li>
  </ul>
</div>

</nav>

    </>
  );
                                            }

