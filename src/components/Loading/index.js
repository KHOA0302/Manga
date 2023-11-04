import styles from "./Loading.module.scss";
import classNames from "classnames/bind";

import { images } from "~/assets/images";
const cx = classNames.bind(styles);
function Loading() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <img className={cx("spin-img", {spin: true})} src={images.icon} />
      </div>
    </div>
  );
}

export default Loading;
