import classNames from "classnames/bind";
import styles from "./Button.module.scss";

const cx = classNames.bind(styles);

function Button({ text, className, type, onClick, active = false }) {
  return (
    <button
      className={cx("btn", { [type]: true, ["active"]: active }, className)}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;
