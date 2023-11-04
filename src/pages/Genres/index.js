import axios from "axios";
import styles from "./Genres.module.scss";
import classNames from "classnames/bind";

import { useEffect, useState } from "react";

import { api } from "~/Api";
import Loading from "~/components/Loading";
import { images } from "~/assets/images";
import PageMangas from "~/components/PageMangas";
import PageNumNav from "~/components/PageNumNav";
import SubLoading from "~/components/SubLoading";
import Mangas from "~/components/Mangas";
import TempManga from "~/components/TempManga";

const cx = classNames.bind(styles);

function Genres({ setIsLoading, isLoading }) {
  const [isSubLoading, setIsSubLoading] = useState(true);

  const [genresList, setGenresList] = useState([]);
  const [genresManga, setGenreManga] = useState([]);
  const [genresType, setGenreType] = useState(null);
  const [genresDes, setGenresDes] = useState(null);
  const [genresTotalPages, setGenreTotalPages] = useState(null);
  const [genresCurrentPage, setGenreCurrentPage] = useState(1);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const type = urlParams.get("type") || "all";
  const pageType = urlParams.get("page") || "1";

  const genresBase = api.base + api.genresList;

  const fetchApi = async (api, page) => {
    return axios
      .get(api, {
        params: { page: page },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleGenres = (id, des, e) => {
    window.history.pushState(null, "", `?type=${id}`);
    setGenresDes(des);
    setGenreType(id);
    setGenreCurrentPage(1);
    setIsSubLoading(true);
  };

  // fetch genres name
  useEffect(() => {
    Promise.all([fetchApi(genresBase, genresCurrentPage)])
      .then((response) => {
        setGenresList(response[0]);
      })
      .then((response) => {
        setIsLoading(false);
      });
    return () => {};
  }, [isSubLoading]);

  // fetch manga in specific genres
  useEffect(() => {
    const genresId = `${genresBase}/${type}`;
    window.history.pushState(null, "", `?type=${type}&page=${pageType}`);
    new Promise((resolve, reject) => resolve(fetchApi(genresId, pageType)))
      .then((res) => {
        setGenreTotalPages(res.total_pages);
        setGenreManga(res.comics);
      })
      .then((res) => {
        setIsSubLoading(false);
      });
    setGenreType(type);
    return () => {};
  }, [type, genresCurrentPage]);

  const handelChangePage = (page, movingPageNum) => {
    let dynamicPage = page;

    if (page === null) {
      dynamicPage = genresCurrentPage + movingPageNum;
      setGenreCurrentPage(dynamicPage);
    } else {
      setGenreCurrentPage(dynamicPage);
    }
    if (dynamicPage <= 0 || genresTotalPages < dynamicPage) {
      alert("It's over 🗿");
      return;
    }
    setIsSubLoading(true);
    window.history.pushState(null, "", `?type=${type}&page=${dynamicPage}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const genresTag = genresList.map((genres, index) => {
    return (
      <li
        key={index}
        className={cx("genres-item", { active: genres.id === genresType })}
        onClick={(e) => handleGenres(genres.id, genres.description, e)}
      >
        {genres.name}
      </li>
    );
  });

  window.addEventListener("beforeunload", () => {
    console.log("User clicked back button");
  });

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <SubLoading active={isSubLoading} />
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("genres")}>
            <h1 className={cx("genres-title")}>
              <p>{images.crownSgv}</p>
              <p>Genres</p>
            </h1>
            <div className={cx("genres-list")}>
              <ul className={cx("genres-option")}>{genresTag}</ul>
            </div>
            <div className={cx("genres-des")}>
              <p>{images.warnSgv}</p>
              <p>{genresDes || "Tất cả thể loại truyện tranh"}</p>
            </div>
          </div>
          <div className={cx("genres-mangas")}>
            {isSubLoading ? (
              <Mangas
                data={new Array(32).fill(null)}
                style="page"
                ChildComponent={TempManga}
              />
            ) : (
              <PageMangas manga={genresManga} style="page" />
            )}
          </div>
          <PageNumNav
            pageType={pageType}
            genresCurrentPage={genresCurrentPage}
            genresTotalPages={genresTotalPages}
            handelChangePage={handelChangePage}
          />
        </div>
      </div>
    </>
  );
}

export default Genres;
