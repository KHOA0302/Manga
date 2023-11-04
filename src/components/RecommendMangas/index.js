import { useEffect, useState } from "react";
import styles from "./RecommendMangas.module.scss";
import classNames from "classnames/bind";
import Mangas from "../Mangas";
import TempManga from "../TempManga";

const cx = classNames.bind(styles);

const getDataIndexedDB = (setGenres, setIsSubLoading) => {
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
    const chapterIndex = store.index("chapter");
    const mangaIndex = store.index("manga");

    const chapterQuery = chapterIndex.getAll();
    const mangaQuery = mangaIndex.getAll();

    mangaQuery.onsuccess = function () {
      const a = mangaQuery.result.map((manga) => {
        return JSON.parse(manga.manga).genres.map((genre) => genre.id);
      });

      if (a.length === 0) {
        fetch(`https://comics-api.vercel.app/recommend-comics`)
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            console.log(res);
            setGenres(res);
            setIsSubLoading(true);
          });
      } else {
        let arr = [];
        fetch("/add", {
          method: "POST",
          body: JSON.stringify({
            content: [...new Set(a.flat(Infinity))],
          }),
        }).then((response) =>
          response.json().then((data) =>
            data.dataGet.map((data) =>
              fetch(`https://comics-api.vercel.app/genres/${data}?page=1`)
                .then((res) => {
                  return res.json();
                })
                .then((res) => {
                  arr = arr.concat(res.comics);
                  arr = arr.filter((obj, index) => {
                    if (obj !== undefined) {
                      return (
                        index ===
                        arr.findIndex(
                          (o) => obj.id === o.id && obj.name === o.name
                        )
                      );
                    }
                  });

                  function compare(a, b) {
                    if (a.total_views > b.total_views) {
                      return -1;
                    }
                    if (a.total_views < b.total_views) {
                      return 1;
                    }
                    return 0;
                  }

                  arr = arr.sort(compare);

                  let newArr = [];
                  for (let i = 0; i < 18; i++) {
                    newArr[i] = arr[i];
                  }
                  for (let i = arr.length - 1; i >= arr.length - 18; i--) {
                    newArr[i] = arr[i];
                  }

                  setGenres(newArr);
                  setIsSubLoading(true);
                })
            )
          )
        );
      }
    };

    transaction.oncomplete = function () {
      db.close();
    };
  };
};

function RecommendMangas() {
  const [mangas, setMangas] = useState();
  const [isSubLoading, setIsSubLoading] = useState(false);

  const scrollLeft = (element) => {
    const target = element.currentTarget.parentNode.children[1];
    const scrollXValue = target.children[0] ? target.scrollLeft : 0;
    const mangaWidth = target.children[0] ? target.children[0].offsetWidth : 0;
    target.scrollLeft = scrollXValue - mangaWidth;
  };

  const scrollRight = (element) => {
    const target = element.currentTarget.parentNode.children[1];
    const scrollXValue = target.children[0] ? target.scrollLeft : 0;
    const mangaWidth = target.children[0] ? target.children[0].offsetWidth : 0;
    target.scrollLeft = scrollXValue + mangaWidth;
  };

  useEffect(() => {
    getDataIndexedDB(setMangas, setIsSubLoading);
  }, []);
  return isSubLoading ? (
    <>
      <div className={cx("title-genres")}>
        <p>🫶🏼Mangas for you, just you, only you🫵🏼</p>
      </div>
      <div className={cx("container")}>
        <p
          className={cx("scrollBtn", { left: true, gelatine: true })}
          onClick={scrollLeft}
        >
          ↼
        </p>
        <Mangas data={mangas} />
        <p
          className={cx("scrollBtn", { right: true, gelatine: true })}
          onClick={scrollRight}
        >
          ⇁
        </p>
      </div>
    </>
  ) : (
    <>
      <div className={cx("title-genres")}>
        <p>🫶🏼Mangas for you, just you, only you🫵🏼</p>
      </div>
      <Mangas data={new Array(32).fill(null)} ChildComponent={TempManga} />
    </>
  );
}

export default RecommendMangas;
