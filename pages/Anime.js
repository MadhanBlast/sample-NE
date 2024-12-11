import Link from "next/link";
import useFetchData from "@/hooks/useFetchData";
import Spinner from "@/components/Spinner";
import Head from "next/head";

import { FaEye, FaHeart, FaStar } from "react-icons/fa";

export default function Anime() {
  // Fetch data with custom hook
  const { alldata, loading } = useFetchData("/api/getmovies");

  // Filter for published anime
  const publishedData = (alldata || []).filter((ab) => ab.status === "publish");

  // Filter data specifically for anime
  const animeData = publishedData.filter((ab) => ab.titlecategory === "anime");

  return (
    <>
      <Head>
        <title>ALL Animes</title>
        <meta name="description" content="All the Anime in Telugu" />
      </Head>

      <section className="genrenamesec">
        <div className="logo3">
         
          <p>
          All Animes
          </p>
        </div>
      </section>

      <section className="genremoviesec">
        <div className="genremovie">
          {loading ? (
            <Spinner />
          ) : (
            <>
              {animeData.map((anime) => (
                <div className="mcard" key={anime.slug}>
                  <Link href={`/movies/${anime.slug}`}>
                    <div className="cardimg">
                      <img
                        src={anime.smposter}
                        alt={anime.title}
                        loading="lazy"
                      />
                    </div>
                    <div className="contents">
                      <h5>{anime.title}</h5>
                      <h6>
                        <span>{anime.year}</span>
                        <div className="rate">
                          <i className="cardfas">
                            <FaHeart />
                          </i>
                          <i className="cardfas">
                            <FaEye />
                          </i>
                          <i className="cardfas">
                            <FaStar />
                          </i>
                          <h6>{anime.rating}</h6>
                        </div>
                      </h6>
                    </div>
                  </Link>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </>
  );
}
