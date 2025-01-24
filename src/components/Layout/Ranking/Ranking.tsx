import { useState } from "react";
import SquareCard from "../SquareCard/SquareCard";
import Title from "../Title/Title";
import IconComponent from "@/components/Asset/Icon";
import styles from "./Ranking.module.scss";
import { useTodayPopular } from "@/api/feeds/getTodayPopular";
import Loader from "../Loader/Loader";

export default function Ranking() {
  const [pageIndex, setPageIndex] = useState(0);
  const { data, isLoading } = useTodayPopular();

  if (isLoading) return <Loader />;

  const itemsPerPage = 3;
  const startIdx = pageIndex * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedFeeds = data?.feeds?.slice(startIdx, endIdx) || [];

  const handlePrevClick = () => {
    if (pageIndex > 0) setPageIndex((prev) => prev - 1);
  };

  const handleNextClick = () => {
    if (data?.feeds && endIdx < data.feeds.length) setPageIndex((prev) => prev + 1);
  };

  return (
    <div className={styles.container}>
      <Title>오늘의 인기 랭킹</Title>
      {data && data.feeds && (
        <div className={styles.rankingContainer}>
          <button
            className={`${styles.navButton} ${styles.left}`}
            onClick={handlePrevClick}
            disabled={pageIndex === 0}
            style={{
              visibility: pageIndex === 0 ? "hidden" : "visible",
            }}
          >
            <IconComponent name="cardArrowLeft" width={40} height={40} isBtn />
          </button>
          <div className={styles.cardsContainer}>
            {paginatedFeeds.map((feed, idx) => (
              <div key={feed.id} className={styles.cardWrapper}>
                {startIdx + idx < 3 && (
                  <div className={styles.rankingIconWrapper}>
                    <IconComponent
                      name={
                        startIdx + idx === 0
                          ? "ranking1"
                          : startIdx + idx === 1
                          ? "ranking2"
                          : "ranking3"
                      }
                      width={30}
                      height={30}
                    />
                  </div>
                )}
                <SquareCard
                  id={feed.id}
                  title={feed.title}
                  cards={feed.cards}
                  author={feed.author}
                  likeCount={feed.likeCount}
                  commentCount={feed.commentCount}
                  isLike={feed.isLike}
                />
              </div>
            ))}
          </div>
          <button
            className={`${styles.navButton} ${styles.right}`}
            onClick={handleNextClick}
            disabled={endIdx >= (data?.feeds?.length || 0)}
          >
            <IconComponent name="cardArrowRight" width={40} height={40} isBtn />
          </button>
        </div>
      )}
    </div>
  );
}