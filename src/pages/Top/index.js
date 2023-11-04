import { useEffect, useState } from "react";
import styles from "./Top.module.scss";
import classNames from "classnames/bind";
import Mangas from "~/components/Mangas";
import TempManga from "~/components/TempManga";
import axios from "axios";
import { api } from "~/Api";
import SubLoading from "~/components/SubLoading";
import PageMangas from "~/components/PageMangas";
import Loading from "~/components/Loading";
import PageNumNav from "~/components/PageNumNav";

const cx = classNames.bind(styles);

function Top({ isLoading, setIsLoading }) {
  const [type, setType] = useState("");
  const [isSubLoading, setIsSubLoading] = useState(true);
  const [manga, setManga] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(NaN);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const status = urlParams.get("status") || "all";
  const subType = urlParams.get("subtype") || "all";
  const pageStatus = urlParams.get("page") || "1";

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
    const path = `${api.base}${api.top}${type}?page=${pageStatus}&status=${subType}`;
    const genresCurrentUrl = window.history.pushState(
      null,
      "",
      `?status=${status}&subtype=${subType}&page=${pageStatus}`
    );
    fetchApi(path)
      .then((response) => {
        setTotalPages(response.total_pages);
        return response.comics;
      })
      .then((response) => {
        setManga(response);
      })
      .then(() => {
        setIsSubLoading(false);
        setIsLoading(false);
      });
  }, [isSubLoading]);

  const handleType = (data) => {
    setType(data);
    setIsSubLoading(true);
    const genresCurrentUrl = window.history.pushState(
      null,
      "",
      `?status=${data.substring(1)}&subtype=${subType}&page=${1}`
    );
  };

  const handleSubType = (data) => {
    setIsSubLoading(true);
    const genresCurrentUrl = window.history.pushState(
      null,
      "",
      `?status=${status}&subtype=${data}&page=${1}`
    );
  };

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
      `?status=${status}&subtype=${subType}&page=${dynamicPage}`
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <SubLoading active={isSubLoading} />
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("top-option")}>
            <div className={cx("top-type")}>
              <ul className={cx("type-option")}>
                <li
                  className={cx("type-item", { active: status === "all" })}
                  onClick={() => handleType("")}
                >
                  <p>1️⃣</p>
                  <h3>All </h3>
                </li>
                <li
                  className={cx("type-item", { active: status === "daily" })}
                  onClick={() => handleType("/daily")}
                >
                  <p>1️⃣</p>
                  <h3>Daily </h3>
                </li>
                <li
                  className={cx("type-item", { active: status === "weekly" })}
                  onClick={() => handleType("/weekly")}
                >
                  <p>1️⃣</p>
                  <h3>Weekly </h3>
                </li>
                <li
                  className={cx("type-item", { active: status === "monthly" })}
                  onClick={() => handleType("/monthly")}
                >
                  <p>1️⃣</p>
                  <h3>Monthly</h3>
                </li>
                <li
                  className={cx("type-item", { active: status === "chapter" })}
                  onClick={() => handleType("/chapter")}
                >
                  <p>1️⃣</p>
                  <h3>Chapter</h3>
                </li>
                <li
                  className={cx("type-item", { active: status === "follow" })}
                  onClick={() => handleType("/follow")}
                >
                  <p>1️⃣</p>
                  <h3>Follow</h3>
                </li>
                <li
                  className={cx("type-item", { active: status === "comment" })}
                  onClick={() => handleType("/comment")}
                >
                  <p>1️⃣</p>
                  <h3>Comment</h3>
                </li>
              </ul>
            </div>
            <div className={cx("top-subtype")}>
              <ul className={cx("subtype-option")}>
                <li
                  className={cx("subtype-item", {
                    active: subType === "all",
                  })}
                  onClick={() => handleSubType("all")}
                >
                  <p>all</p>
                </li>
                <li
                  className={cx("subtype-item", {
                    active: subType === "completed",
                  })}
                  onClick={() => handleSubType("completed")}
                >
                  <p>completed</p>
                </li>
                <li
                  className={cx("subtype-item", {
                    active: subType === "ongoing",
                  })}
                  onClick={() => handleSubType("ongoing")}
                >
                  <p>ongoing</p>
                </li>
              </ul>
            </div>
          </div>

          <div className={cx("top-mangas")}>
            {isSubLoading ? (
              <Mangas
                data={new Array(32).fill(null)}
                style="page"
                ChildComponent={TempManga}
              />
            ) : (
              <PageMangas manga={manga} style="page" />
            )}
          </div>

          <PageNumNav
            pageType={pageStatus}
            genresCurrentPage={currentPage}
            genresTotalPages={totalPages}
            handelChangePage={handelChangePage}
          />
        </div>
      </div>
    </>
  );
}

export default Top;
