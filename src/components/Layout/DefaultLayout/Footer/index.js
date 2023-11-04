import styles from "./Footer.module.scss";
import classNames from "classnames/bind";
import { images } from "~/assets/images";

const cx = classNames.bind(styles);

function Footer() {
  return (
    <footer className={cx("footer")}>
      <div className={cx("wrapper")}>
        <div className={cx("external-link")}>
          <ul className={cx("option")}>
            <li className={cx("item")}>
              <a className={cx("item-link")}> {images.facebookSgv}</a>
            </li>
            <li className={cx("item")}>
              <a className={cx("item-link")}>{images.githubSgv}</a>
            </li>
            <li className={cx("item")}>
              <a className={cx("item-link")}> {images.apiSgv}</a>
            </li>
          </ul>
        </div>
        <div className={cx("licenses")}>
          © 2023 Manga™. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
