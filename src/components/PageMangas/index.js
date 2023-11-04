import Mangas from "../Mangas";
import styles from "./PageMangas.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function PageMangas({ manga, style, history }) {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <Mangas data={manga} style={style} history={history} />
      </div>
    </div>
  );
}

export default PageMangas;
