import { InitialPageMeta } from "@/components/MetaData/MetaData";
import styles from "@/styles/pages/home.module.scss";
import { serviceUrl } from "@/constants/serviceurl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Ranking from "@/components/Layout/Ranking/Ranking";
import NewFeed from "@/components/Layout/NewFeed/NewFeed";
import FollowNewFeed from "@/components/Layout/FollowNewFeed/FollowNewFeed";
import { authState } from "@/states/authState";
import { useRecoilValue } from "recoil";
import MainBoard from "@/components/Layout/MainBoard/MainBoard";

export default function Home() {
  const router = useRouter();
  const [OGTitle] = useState("그리미티");
  const [OGUrl, setOGUrl] = useState(serviceUrl);
  const { isLoggedIn } = useRecoilValue(authState);

  useEffect(() => {
    setOGUrl(serviceUrl + router.asPath);
  }, [router.asPath]);

  return (
    <>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <div className={styles.container}>
        <section className={styles.FeedSection}>
          <Ranking />
          <div className={styles.bar} />
          {isLoggedIn && (
            <>
              <FollowNewFeed />
              <div className={styles.bar} />
            </>
          )}
          <NewFeed />
        </section>
        <section className={styles.BoardSection}>
          <MainBoard type="popular" />
          <div className={styles.bar} />
          <MainBoard type="feedback" />
          <div className={styles.bar} />
          <MainBoard type="question" />
        </section>
      </div>
    </>
  );
}
