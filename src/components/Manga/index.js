import styles from "./Manga.module.scss";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useFormatNum } from "~/Hook";
import { images } from "~/assets/images";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

const deleteDataIndexedDB = (id, setReLoad) => {
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

    const deleteManga = store.delete(id);

    deleteManga.onsuccess = function () {
      console.log("has been removed");
    };

    transaction.oncomplete = function () {
      db.close();
    };
  };
};

function Manga({ manga = {thumbnail: undefined}, history = false }) {
  const convertFollowerNum = useFormatNum(
    manga === undefined ? 1 : manga.followers
  );
  const convertViewerNum = useFormatNum(
    manga === undefined ? 1 : manga.total_views
  );

  const genres = () => {
    if (manga.genres != undefined) {
      return manga.genres.map((genre, key) => {
        return (
          <li className={cx("type-item")} key={key}>
            <span>{genre.name}</span>
          </li>
        );
      });
    }
  };

  const [validImg, setValidImg] = useState(images.invalid);

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

  return (
    <div className={cx("wrapper")}>
      <Link className={cx("container")} to={`/manga/${manga.id}`}>
        <div className={cx("img-wrapper")}>
          <img className={cx("thumbnail")} src={validImg} />
        </div>
        <div className={cx("info-wrapper")}>
          <div className={cx("status")}>
            <ul className={cx("status-option")}>
              {manga.is_trending && (
                <li className={cx("status-item", { hot: manga.is_trending })}>
                  hot
                </li>
              )}

              <li
                className={cx("status-item", {
                  [manga.status && manga.status.toLowerCase()]: true,
                })}
              >
                {manga.status && manga.status.toLowerCase()}
              </li>
            </ul>
          </div>

          <div className={cx("main-info")}>
            <div className={cx("name")}>
              <span>{manga.title}</span>
            </div>
            <div className={cx("type-wrapper")}>
              <ul className={cx("type-option")}>{genres()}</ul>
            </div>
            <div className={cx("rate")}>
              <div className={cx("follower")}>
                <div>{images.eyeSgv}</div>
                <p>{convertFollowerNum}</p>
              </div>
              <div className={cx("view")}>
                <div>{images.eyeSgv}</div>
                <p>{convertViewerNum}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
      {history && (
        <div
          className={cx({ history: history })}
          onClick={(e) => {
            deleteDataIndexedDB(manga.id);
            e.target.parentNode.style.display = "none";
          }}
        >
          Xóa👆
        </div>
      )}
    </div>
  );
}

export default Manga;
