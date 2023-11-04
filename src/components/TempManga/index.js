import { images } from "~/assets/images";
import styles from "./TempManga.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function TempManga({ manga }) {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("img-wrapper")}>
          <img className={cx("thumbnail")} src={images.temp} />
        </div>
      </div>
    </div>
  );
}

export default TempManga;
