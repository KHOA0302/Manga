import styles from "./New.module.scss";
import classNames from "classnames/bind";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "~/components/Loading";
import { api } from "~/Api";
import SubLoading from "~/components/SubLoading";
import TempManga from "~/components/TempManga";
import Mangas from "~/components/Mangas";
import PageMangas from "~/components/PageMangas";
import PageNumNav from "~/components/PageNumNav";

const cx = classNames.bind(styles);

function New({ isLoading, setIsLoading }) {
  const [isSubLoading, setIsSubLoading] = useState(true);
  const [mangas, setMangas] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(NaN);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const pageNew = urlParams.get("page") || "1";

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
    const path = `${api.base}${api.new}?page=${pageNew}&status=all`;
    const genresCurrentUrl = window.history.pushState(
      null,
      "",
      `?page=${pageNew}`
    );
    console.log(path);
    fetchApi(path)
      .then((response) => {
        setTotalPages(response.total_pages);
        return response.comics;
      })
      .then((response) => {
        setMangas(response);
      })
      .then(() => {
        setIsSubLoading(false);
        setIsLoading(false);
      });
  }, [isSubLoading]);

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
    const genresCurrentUrl = window.history.pushState(
      null,
      "",
      `?page=${dynamicPage}`
    );
    setIsSubLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <SubLoading active={isSubLoading} />
      <div className={cx("new-wrapper")}>
        <div className={cx("new-container")}>
          <h1 className={cx("new-title")}>
            <span>🆕</span>New Mangas
          </h1>
          {isSubLoading ? (
            <Mangas
              data={new Array(32).fill(null)}
              style="page"
              ChildComponent={TempManga}
            />
          ) : (
            <PageMangas manga={mangas} style="page" />
          )}
        </div>
      </div>
      <PageNumNav
        pageType={pageNew}
        genresCurrentPage={currentPage}
        genresTotalPages={totalPages}
        handelChangePage={handelChangePage}
      />
    </>
  );
}

export default New;
