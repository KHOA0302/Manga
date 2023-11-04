import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { images } from "~/assets/images";
import Button from "~/components/Button";
import { headerOptionRoutes } from "~/routes";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { api } from "~/Api";
import { Context } from "~/components/DataContext";

const cx = classNames.bind(styles);
const body = document.querySelector("body");

function Header({ pathName }) {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isSearchClick, setIsSearchClick] = useState(false);
  const [isSearLoading, setIsSearLoading] = useState(false);

  const context = useContext(Context);

  const handleActiveBtn = (btn) => {};

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

  const changePagesBtn = headerOptionRoutes.map((route, index) => {
    const text = route.path.slice(1, route.path.length) || "home";

    return (
      <li className={cx("item")} key={index}>
        <Link
          className={cx("item-link", { ["active"]: pathName === route.path })}
          to={route.path}
        >
          <Button text={text} type="medium" active={pathName === route.path} />
        </Link>
      </li>
    );
  });

  useEffect(() => {
    if (searchValue.length >= 1 && searchValue != " ") {
      const path = `${api.base}${api.searchSug}?q=${searchValue}`;
      setIsSearLoading(true);
      fetchApi(path, 1)
        .then((res) => {
          setSearchResult(res);
        })
        .then(() => {
          setIsSearLoading(false);
        });
    } else {
      setSearchValue("");
    }
  }, [searchValue]);

  const handleShowResult = (e) => {
    e.stopPropagation();
    setIsSearchClick(true);
  };

  body.onclick = () => {
    setIsSearchClick(false);
  };

  // set some invalid img for sick link img in box search
  const [validImg, setValidImg] = useState(images.invalid);

  const checkImage = (manga) => {
    const img = document.createElement("IMG");
    img.src = manga.thumbnail;

    const promise = new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject();
    });

    promise
      .then(() => {
        setValidImg(manga.thumbnail);
      })
      .catch(() => {
        console.warn(manga.thumbnail);
      });
  };
  ////////////////////////////////////////////////////
  // cần chỉnh phần mâng nhanh tìm nhanh
  const mangaSearch = searchResult.map((manga, id) => {
    // checkImage(manga);
    return (
      <li key={id} className={cx("search-result-item")}>
        <Link to={`/manga/${manga.id}`}>
          <div className={cx("result-item-wrapper")}>
            <div className={cx("result-thumb")}>
              <img src={manga.thumbnail} />
              {/* <img src={validImg} /> */}
            </div>
            <div className={cx("result-info")}>
              <p className={cx("result-name")}>🌀{manga.title}</p>
              <p className={cx("result-authors")}>🔺{manga.authors}</p>
              <p className={cx("result-process")}>🔻{manga.lastest_chapter}</p>
              <ul className={cx("result-genres")}>
                {manga.genres.map((genre, id) => {
                  return <li key={id}>{genre}</li>;
                })}
              </ul>
            </div>
          </div>
        </Link>
      </li>
    );
  });

  const passSearchValue = () => {
    console.log(searchValue);
    context.setData(searchValue);
  };

  return (
    <header className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content-left")}>
          <Link className={cx("logo-wrapper")} to="/" onClick={handleActiveBtn}>
            <img className={cx("icon")} src={images.icon}></img>
            <img className={cx("logo")} src={images.logo}></img>
          </Link>
          <ul className={cx("option")}>{changePagesBtn}</ul>
        </div>
        <div className={cx("content-right")}>
          <Link className={cx("history-btn")} to="/history">
            {images.historySvg}
          </Link>
          <div className={cx("search-wrapper")}>
            <input
              type="text"
              className={cx("search-input", "searchInputCheckLoading")}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onClick={handleShowResult}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  passSearchValue();
                  navigate("/search");
                }
              }}
            />

            {isSearLoading ? (
              <div className={cx("search-loading")}>
                <p className={cx("spin")}>🪷</p>
              </div>
            ) : (
              ""
            )}

            <Link
              to="/search"
              className={cx("search-icon", "searchBtnCheckLoading")}
              onClick={passSearchValue}
              style={{
                pointerEvents: searchValue.length > 0 ? "auto" : "none",
              }}
            >
              {images.searchSvg}
            </Link>

            <div
              className={cx("search-result", { active: isSearchClick })}
              onClick={(e) => e.stopPropagation()}
            >
              {isSearLoading && (
                <div className={cx("search-result-loading")}>
                  <p className={cx("spin")}>💮</p>
                  <p className={cx("spin")}>💮</p>
                </div>
              )}
              {!isSearLoading && (
                <ul className={cx("search-result-option")}>{mangaSearch}</ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
