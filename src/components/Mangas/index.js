import Manga from "../Manga";
import styles from "./Mangas.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function Mangas({ data = [], style, ChildComponent = Manga, history }) {
  const mangas = data.map((manga, index) => {
    return <ChildComponent key={index} manga={manga} history={history} />;
  });
  return <div className={cx("mangas-cl", { [style]: true })}>{mangas}</div>;
}

export default Mangas;
