import { useEffect, useState } from "react";
import styles from "./History.module.scss";
import classNames from "classnames/bind";
import Loading from "~/components/Loading";
import Mangas from "~/components/Mangas";
import PageMangas from "~/components/PageMangas";
import TempManga from "~/components/TempManga";

const cx = classNames.bind(styles);

const getDataIndexedDB = (setMangas) => {
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
      setMangas(mangaQuery.result.map((manga) => JSON.parse(manga.manga)));
    };

    transaction.oncomplete = function () {
      db.close();
    };
  };
};

function History({ isLoading, setIsLoading }) {
  const [isSubLoading, setIsSubLoading] = useState(true);
  const [mangas, setMangas] = useState([]);

  useEffect(() => {
    getDataIndexedDB(setMangas);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsSubLoading(false);
  }, [mangas]);

  return isLoading ? (
    <Loading />
  ) : (
    <div className={cx("his-wrapper")}>
      <div className={cx("his-container")}>
        <h1 className={cx("his-title")}>
          <span>📜</span>Mangas was read
        </h1>
        {isSubLoading ? (
          <Mangas
            data={new Array(5).fill(null)}
            style="page"
            ChildComponent={TempManga}
          />
        ) : (
          <PageMangas manga={mangas} style="page" history={true} />
        )}
      </div>
    </div>
  );
}

export default History;
