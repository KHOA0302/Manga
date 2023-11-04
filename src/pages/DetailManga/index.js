import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./DetailManga.module.scss";
import classNames from "classnames/bind";
import { api } from "~/Api";
import SubLoading from "~/components/SubLoading";
import Loading from "~/components/Loading";
import { useFormatNum } from "~/Hook";
import { images } from "~/assets/images";
import Button from "~/components/Button";
import { Context } from "~/components/DataContext";

const cx = classNames.bind(styles);

const storeData = (data) => {
  const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

  if (!indexedDB) {
    console.log("IndexedDB could not be found in this browser.");
  }

  const request = indexedDB.open("HistoryDB", 1);

  request.onerror = function (event) {
    console.error("An error occurred with IndexedDB");
    console.error(event);
  };

  request.onupgradeneeded = function () {
    const db = request.result;

    const store = db.createObjectStore("mangas", { keyPath: "id" });

    store.createIndex("comics", ["comics"], { unique: false });
  };

  request.onsuccess = function () {
    const db = request.result;

    const transaction = db.transaction("mangas", "readwrite");

    const store = transaction.objectStore("mangas");

    store.put(data);

    transaction.oncomplete = function () {
      db.close();
    };
  };
};

const getChapterIndexedDB = (navigate, currentManga) => {
  const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

  if (!indexedDB) {
    console.log("IndexedDB could not be found in this browser.");
  }

  const request = indexedDB.open("HistoryDB", 1);

  request.onerror = function (event) {
    console.error("An error occurred with IndexedDB");
    console.error(event);
  };

  request.onsuccess = function () {
    const db = request.result;

    const transaction = db.transaction("mangas", "readwrite");

    const store = transaction.objectStore("mangas");
    const idQuery = store.get(currentManga.id);

    idQuery.onsuccess = function () {
      const manga = idQuery.result;
      if (manga ?? false) {
        navigate(`/manga/${manga.id}/${manga.chapter}`);
      } else {
        const data = {
          id: currentManga.id,
          chapter: currentManga.chapters[currentManga.chapters.length - 1].id,
          manga: JSON.stringify(currentManga),
        };
        storeData(data);
        navigate(`/manga/${data.id}/${data.chapter}`);
      }
    };

    transaction.oncomplete = function () {
      db.close();
    };
  };
};

function DetailManga({ setIsLoading, isLoading }) {
  const { mangaId } = useParams();
  const subChapters = [];
  const navigate = useNavigate();

  const [isSubLoading, setIsSubLoading] = useState(true);

  const [manga, setManga] = useState({
    genres: [],
    other_names: [],
    chapters: [],
  });

  const context = useContext(Context);

  const [idSubChapters, setIdSubChapters] = useState(0);
  const [chapterBoard, setChapterBoard] = useState([]);

  const [validImg, setValidImg] = useState(images.invalid);

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
    window.scrollTo({ top: 0, behavior: "smooth" });
    const mangaPath = api.base + "comics" + "/" + `${mangaId}`;
    setIsSubLoading(true);
    fetchApi(mangaPath, 1)
      .then((response) => {
        setManga(
          response || {
            genres: [],
            other_names: [],
            chapters: [],
          }
        );
        return response;
      })
      .then((response) => {
        context.setData(response);
        setIsSubLoading(false);
        setIsLoading(false);
      });
    return () => {};
  }, [mangaId]);

  const checkImage = (url) => {
    const img = document.createElement("IMG");
    img.src = url;

    const promise = new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject();
    });

    promise
      .then(() => {
        setValidImg(manga.thumbnail);
      })
      .catch(() => {
        console.warn(url);
      });
  };

  useEffect(() => {
    checkImage(manga.thumbnail);
  }, [manga.thumbnail]);

  //Render ul from api data
  const genres = manga.genres.map((genre, id) => {
    return (
      <li key={id}>
        <Button text={genre.name} className="transparent" type="small" />
      </li>
    );
  });

  const view = useFormatNum(manga.total_views, true);
  const follower = useFormatNum(manga.followers, true);
  ////////////////////////////

  //convert array into chunk array
  const chunkSize = 50;
  for (let i = manga.chapters.length; i > 0; i -= chunkSize) {
    const chunk = manga.chapters.slice(i - 50 < 0 ? 0 : i - 50, i);
    subChapters.push(chunk);
  }
  ///////////////////////////////

  const handleSubChapter = (subchapter, id) => {
    setChapterBoard(subchapter);
    setIdSubChapters(id);
  };

  useEffect(() => {
    setChapterBoard(subChapters[0] ? subChapters[0].reverse() : []);
  }, [isLoading, isSubLoading]);

  const subChaptersBtn = subChapters.map((chapter, id) => {
    const chapterLength = chapter.length;
    const text = chapter[chapterLength - 1].name + " ➡ " + chapter[0].name;
    return (
      <li
        key={id}
        className={cx("manga-subchapter-item", {
          active: id === idSubChapters,
        })}
      >
        <Button
          text={text}
          className="custom-1"
          type="small"
          onClick={() => handleSubChapter(chapter.reverse(), id)}
        />
      </li>
    );
  });

  const chapterItem = chapterBoard.map((chapter, id) => {
    return (
      <li
        key={id}
        className={cx("manga-chapter-main-item")}
        onClick={() =>
          storeData({
            id: manga.id,
            chapter: chapter.id,
            manga: JSON.stringify(manga),
          })
        }
      >
        <Link to={`/manga/${manga.id}/${chapter.id}`}>
          <Button text={chapter.name} type="small" className="custom-2" />
        </Link>
      </li>
    );
  });

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <SubLoading active={isSubLoading} />
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("manga-info")}>
            <div className={cx("info-thumb")}>
              <img src={validImg} />
            </div>
            <div className={cx("info-main")}>
              <h2 className={cx("info-name")}>
                ✨ {isSubLoading ? "🤏🏼🤏🏼🤏🏼" : manga.title}✨
              </h2>
              <p className={cx("info-otherName")}>
                Other names:&nbsp;
                {isSubLoading ? "🤏🏼🤏🏼🤏🏼" : manga.other_names.join(" 👉🏻 ")}
              </p>
              <ul className={cx("info-genres-option")}>{genres}</ul>
              <p className={cx("info-creator")}>
                Authors: <i> {isSubLoading ? "🤏🏼🤏🏼🤏🏼" : manga.authors}</i>
              </p>
              <ul className={cx("info-rating-option")}>
                <li className={cx("info-rating-item")}>
                  <i className={cx("rating-icon")}>👀</i>
                  <p className={cx("rating-number")}>
                    {" "}
                    {isSubLoading ? "🤏🏼🤏🏼🤏🏼" : view}
                  </p>
                </li>
                <li className={cx("info-rating-item")}>
                  <i className={cx("rating-icon", "heart")}>🤌🏻</i>
                  <p className={cx("rating-number")}>
                    {isSubLoading ? "🤏🏼🤏🏼🤏🏼" : follower}
                  </p>
                </li>
              </ul>
              <div className={cx("info-para")}>
                <p> {manga.description}</p>
              </div>
              <div className={cx("info-read")}>
                {isSubLoading ? (
                  ""
                ) : (
                  <Button
                    text="Read"
                    type="large"
                    className="transparent"
                    onClick={() => {
                      getChapterIndexedDB(navigate, manga);
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          <div className={cx("manga-chapters")}>
            <div className={cx("manga-subchapters")}>
              <div className={cx("manga-title")}>
                <i>📖</i>
                <p>Chapters</p>
              </div>
              <div className={cx("manga-subchapters-wrapper")}>
                <ul className={cx("manga-subchapter-option")}>
                  {subChaptersBtn}
                </ul>
              </div>
            </div>
            <div className={cx("manga-chapters-main")}>
              <ul className={cx("manga-chapter-main-option")}>{chapterItem}</ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailManga;
