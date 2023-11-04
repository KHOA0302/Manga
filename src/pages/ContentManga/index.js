import styles from "./ContentManga.module.scss";
import classNames from "classnames/bind";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "~/Api";
import Loading from "~/components/Loading";
import { Context } from "~/components/DataContext";

const cx = classNames.bind(styles);

function ChapterLoading() {
  return (
    <div className={cx("chapter-loading")}>
      <p className={cx("chapter-loading-icon", "spin")}>🌀</p>
    </div>
  );
}
const storeDataDB = (data) => {
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

function ContentManga({ isLoading, setIsLoading }) {
  const { mangaId, chapterId } = useParams();
  const navigate = useNavigate();

  const [dataChapter, setDataChapter] = useState({ images: [], chapters: [] });
  const [isClick, setIsClick] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(parseInt(chapterId));
  const [isSubLoading, setIsSubLoading] = useState(true);

  const context = useContext(Context);

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
    const chapterPath = `${api.base}comics/${mangaId}/chapters/${currentChapter}`;
    fetchApi(chapterPath, 1)
      .then((res) => {
        setDataChapter(res);
      })
      .then(() => {
        setIsLoading(false);
        setIsSubLoading(false);
      });
  }, [currentChapter, isSubLoading]);

  const img = dataChapter.images.map((img, id) => {
    return (
      <li key={id} className={cx("img-item")}>
        <img src={img.src} />
      </li>
    );
  });

  const allEps = dataChapter.chapters.reverse().map((ep, id) => {
    return (
      <li
        key={id}
        className={cx("all-chapter-item")}
        onClick={() => {
          setIsSubLoading(true);
          setCurrentChapter(ep.id);
          storeDataDB({
            id: mangaId,
            chapter: ep.id,
            manga: JSON.stringify(context.data),
          });
          const chapterPath = `/manga/${mangaId}/${ep.id}`;
          navigate(chapterPath);
        }}
      >
        {ep.name}
      </li>
    );
  });

  const handleCloseCover = (e) => {
    setIsClick(false);
  };

  const handleEp = (e) => {
    e.stopPropagation();
    setIsClick(true);
  };

  const changeCurrentChapter = (step) => {
    setIsSubLoading(true);
    const index = dataChapter.chapters.findIndex((object) => {
      return object.id === parseInt(chapterId);
    });

    if (dataChapter.chapters[index - step] === undefined) {
      alert("It's over 🗿");
      setIsSubLoading(false);
      return;
    }

    const id = dataChapter.chapters[index - step].id;

    setCurrentChapter(id);
    storeDataDB({
      id: mangaId,
      chapter: id,
      manga: JSON.stringify(context.data),
    });
    const chapterPath = `/manga/${mangaId}/${id}`;
    navigate(chapterPath);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div className={cx("wrapper")} onClick={handleCloseCover}>
      <div className={cx("container")}>
        <div className={cx("cover", "header", "target")}>
          <div className={cx("header-info")}>
            <div>
              <button
                onClick={() => {
                  navigate("/");
                }}
              >
                GO HOME
              </button>
            </div>
            <div>
              <span className={cx("manga-name")}>
                {isSubLoading ? "🤏🏼🤏🏼🤏🏼" : dataChapter.comic_name}
              </span>
              <span className={cx("manga-separate-icon")}>✨</span>
              <span className={cx("manga-chapter-name")}>
                {isSubLoading ? "🤏🏼🤏🏼🤏🏼" : dataChapter.chapter_name}
              </span>
            </div>
          </div>
        </div>
        <div className={cx("main")}>
          <ul className={cx("img-option")}>
            {isSubLoading ? <ChapterLoading /> : img}
          </ul>
        </div>
        <div className={cx("cover", "footer", "target")}>
          <div className={cx("chapter-navigation")}>
            <button
              className={cx("btn", "pre")}
              onClick={() => changeCurrentChapter(-1)}
            >
              Previous
            </button>
            <button
              className={cx("btn", "ne")}
              onClick={() => changeCurrentChapter(1)}
            >
              Next
            </button>
            <button
              className={cx("btn", "ep", { active: isClick })}
              onClick={handleEp}
            >
              <p>Episodes</p>
              <ul className={cx("all-chapter-option", { active: isClick })}>
                {allEps}
              </ul>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentManga;
