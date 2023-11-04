import { useState, useEffect } from "react";
import styles from "./PageNumNav.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function PageNumNav({
  pageType = 1,
  genresCurrentPage,
  genresTotalPages,
  handelChangePage = () => {},
}) {
  const [pagesNumNavigation, setPagesNumNavigation] = useState([1, 2, 3]);

  useEffect(() => {
    if (genresCurrentPage >= genresTotalPages - 2) {
      if (genresTotalPages > 4) {
        setPagesNumNavigation([
          1,
          "...",
          genresTotalPages - 2,
          genresTotalPages - 1,
          genresTotalPages,
        ]);
      } else {
        setPagesNumNavigation(
          new Array(genresTotalPages).fill(null).map((page, index) => index + 1)
        );
      }
    } else if (genresCurrentPage < 4) {
      setPagesNumNavigation([1, 2, 3, 4, "...", genresTotalPages]);
    } else if (
      genresCurrentPage >= 4 &&
      genresCurrentPage < genresTotalPages - 2
    ) {
      setPagesNumNavigation([
        1,
        "...",
        genresCurrentPage - 1,
        genresCurrentPage,
        genresCurrentPage + 1,
        "...",
        genresTotalPages,
      ]);
    }
  }, [genresCurrentPage, genresTotalPages]);

  const pages = pagesNumNavigation.map((page, index) => {
    return (
      <li key={index} className={cx("pages-item")}>
        <button
          className={cx("page-num", {
            active: page + "" === pageType,
          })}
          onClick={() => handelChangePage(page)}
        >
          {page}
        </button>
      </li>
    );
  });

  console.log()

  return (
    <div className={cx("genres-total-pages")}>
      <button
        className={cx("to-1-page", "page-arrow-btn")}
        onClick={() => handelChangePage(null, -10)}
      >
        ⏮
      </button>
      <button
        className={cx("less-page", "page-arrow-btn")}
        onClick={() => handelChangePage(null, -1)}
      >
        ◀️
      </button>
      <ul className={cx("pages-option")}>{pages}</ul>
      <button
        className={cx("more-page", "page-arrow-btn")}
        onClick={() => handelChangePage(null, 1)}
      >
        ▶️
      </button>
      <button
        className={cx("to-last-page", "page-arrow-btn")}
        onClick={() => handelChangePage(null, 10)}
      >
        ⏭
      </button>
    </div>
  );
}

export default PageNumNav;
