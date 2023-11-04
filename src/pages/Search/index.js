import { useContext, useEffect, useState } from "react";
import { Context } from "~/components/DataContext";
import axios from "axios";
import PageMangas from "~/components/PageMangas";
import { api } from "~/Api";
import styles from "./Search.module.scss";
import classNames from "classnames/bind";
import Loading from "~/components/Loading";
import SubLoading from "~/components/SubLoading";
import PageNumNav from "~/components/PageNumNav";
import Mangas from "~/components/Mangas";
import TempManga from "~/components/TempManga";

const cx = classNames.bind(styles);

function Search({ isLoading, setIsLoading }) {
  const context = useContext(Context);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(undefined);
  const [searchManga, setSearchManga] = useState([]);
  const [isSubLoading, setIsSubLoading] = useState(true);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const query = urlParams.get("q") || context.data;
  const pageSearch = urlParams.get("page") || "1";

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

  useEffect(() => {
    const path = `${api.base}${api.search}?q=${query}`;
    const genresCurrentUrl = window.history.pushState(
      null,
      "",
      `?q=${query}&page=${pageSearch}`
    );

    fetchApi(path, pageSearch)
      .then((response) => {
        setSearchManga(response);
        return response;
      })
      .then((response) => {
        setTotalPages(response.total_pages);
        setIsLoading(false);
        setIsSubLoading(false);
      });
  }, [currentPage, context.data, isSubLoading]);

  const handelChangePage = (page, movingPageNum) => {
    let dynamicPage = page;

    if (page === null) {
      dynamicPage = currentPage + movingPageNum;
      setCurrentPage(dynamicPage);
    } else {
      setCurrentPage(dynamicPage);
    }
    if (dynamicPage <= 0 || totalPages < dynamicPage) {
      alert("It's over 🗿");
      return;
    }
    setIsSubLoading(true);
    const genresCurrentUrl = window.history.pushState(
      null,
      "",
      `?q=${query}&page=${dynamicPage}`
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  //check trigger search manga function
  const searchBtnCheckLoading = document.querySelector(
    ".searchBtnCheckLoading"
  );
  const searchInputCheckLoading = document.querySelector(
    ".searchInputCheckLoading"
  );

  if (searchBtnCheckLoading && searchInputCheckLoading) {
    searchBtnCheckLoading.onclick = () => {
      setIsSubLoading(true);
    };
    searchInputCheckLoading.onkeydown = (e) => {
      if (e.key === "Enter") {
        setIsSubLoading(true);
      }
    };
  }

  //////////////////////////////////////////////

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <SubLoading active={isSubLoading} />
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <h1 className={cx("search-title")}>
            <p>🔎</p> Searching
          </h1>
          {isSubLoading ? (
            <Mangas
              data={new Array(15).fill(null)}
              style="page"
              ChildComponent={TempManga}
            />
          ) : searchManga.comics.length ? (
            <>
              <PageMangas manga={searchManga.comics} style="page" />
              <PageNumNav
                pageType={pageSearch}
                genresCurrentPage={currentPage}
                genresTotalPages={totalPages}
                handelChangePage={handelChangePage}
              />
            </>
          ) : (
            <h1 className={cx("search-empty")}>🅾️Can't find manga🅾</h1>
          )}
        </div>
      </div>
    </>
  );
}

export default Search;
