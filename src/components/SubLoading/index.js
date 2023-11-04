import styles from "./SubLoading.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function SubLoading({ active = false }) {
  return (
    <div className={cx("wrapper", { active: active })}>
      <div className={cx("loading-bar")}></div>
    </div>
  );
}

export default SubLoading;
