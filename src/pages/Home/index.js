import styles from "./Home.module.scss";
import classNames from "classnames/bind";
import axios from "axios";
import { api } from "~/Api";

import Mangas from "~/components/Mangas";
import TempManga from "~/components/TempManga";

import { useEffect, useState } from "react";
import { images } from "~/assets/images";
import Loading from "~/components/Loading";
import SubLoading from "~/components/SubLoading";
import RecommendMangas from "~/components/RecommendMangas";

const cx = classNames.bind(styles);

function Home({ setIsLoading, isLoading }) {
  const [isSubLoading, setIsSubLoading] = useState(true);
  const [mangasGenres, setMangasGenres] = useState([]);

  const trendingApi = api.base + api.trending;
  const completedApi = api.base + api.completed;
  const recentApi = api.base + api.recent;
  const boyApi = api.base + api.boy;
  const girlApi = api.base + api.girl;

  const fetchApi = async (api, page) => {
    return axios
      .get(api, {
        params: { page: page },
      })
      .then((response) => {
        return response.data.comics;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    Promise.all([
      fetchApi(trendingApi, 1),
      fetchApi(completedApi, 1),
      fetchApi(recentApi, 1),
      fetchApi(boyApi, 1),
      fetchApi(girlApi, 1),
    ]).then((response) => {
      setMangasGenres([...response]);
      setIsLoading(false);
      setIsSubLoading(false);
    });
  }, []);

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

  const sgv = [
    { tag: images.fireSgv, name: "Popular" },
    { tag: images.stickSvg, name: "Completed" },
    { tag: images.clockSgv, name: "Recent Update" },
    { tag: images.boySgv, name: "Boy" },
    { tag: images.girlSgv, name: "Girl" },
  ];

  const mangas = mangasGenres.map((manga, index) => {
    return (
      <div key={index} className={cx("container")}>
        <div className={cx("title-genres")}>
          <p>{sgv[index].tag}</p>
          <p>{sgv[index].name}</p>
        </div>
        <div>
          <p
            className={cx("scrollBtn", { left: true, gelatine: true })}
            onClick={scrollLeft}
          >
            ↼
          </p>
          <Mangas data={manga} />
          <p
            className={cx("scrollBtn", { right: true, gelatine: true })}
            onClick={scrollRight}
          >
            ⇁
          </p>
        </div>
      </div>
    );
  });

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <SubLoading active={isSubLoading} />
      <div className={cx("wrapper")}>
        {mangasGenres.length > 0 ? (
          <>
            <RecommendMangas />
            {mangas}
          </>
        ) : (
          <div className={cx("container")}>
            <div className={cx("title-genres")}>
              <p></p>
              <p>Loading...</p>
            </div>
            <div>
              <p
                className={cx("scrollBtn", { left: true, gelatine: true })}
                onClick={scrollLeft}
              >
                ↼
              </p>
              <Mangas
                data={new Array(32).fill(null)}
                ChildComponent={TempManga}
              />
              <p
                className={cx("scrollBtn", { right: true, gelatine: true })}
                onClick={scrollRight}
              >
                ⇁
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
