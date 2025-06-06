import { useState } from "react";

import { subWeeks } from "date-fns";
import { Swiper, SwiperSlide } from "swiper/react";

import { useRankings } from "@/api/feeds/getRankings";

import { useDeviceStore } from "@/states/deviceStore";

import SquareCard from "@/components/Layout/SquareCard/SquareCard";
import Title from "@/components/Layout/Title/Title";
import IconComponent from "@/components/Asset/Icon";
import Loader from "@/components/Layout/Loader/Loader";

import { PATH_ROUTES } from "@/constants/routes";

import { formattedDate } from "@/utils/formatDate";

import styles from "./Ranking.module.scss";

export default function Ranking() {
  const today = new Date();

  const isMobile = useDeviceStore((state) => state.isMobile);
  const isTablet = useDeviceStore((state) => state.isTablet);

  const [pageIndex, setPageIndex] = useState(0);

  const { data, isLoading } = useRankings({
    startDate: formattedDate(subWeeks(today, 1), "yyyy-MM-dd"),
    endDate: formattedDate(today, "yyyy-MM-dd"),
  });

  if (isLoading) return <Loader />;

  const itemsPerPage = 4;
  const totalSlides = Math.ceil((data?.feeds.length || 0) / itemsPerPage);
  const paginatedFeeds = data?.feeds || [];
  const isEmpty = !data || data.feeds.length === 0;

  const handlePrevClick = () => {
    if (pageIndex > 0) setPageIndex((prev) => prev - 1);
  };

  const handleNextClick = () => {
    if (pageIndex < totalSlides - 1) setPageIndex((prev) => prev + 1);
  };

  return (
    <div className={styles.container}>
      <Title link={PATH_ROUTES.RANKING}>주간 랭킹</Title>
      {isEmpty ? (
        <p className={styles.message}>아직 등록된 그림이 없어요</p>
      ) : isMobile || isTablet ? (
        <div className={styles.rankingContainer}>
          <Swiper
            spaceBetween={12}
            slidesPerView={isMobile ? 1.5 : isTablet ? 3.5 : itemsPerPage}
            onSlideChange={(swiper) => setPageIndex(swiper.activeIndex)}
          >
            {paginatedFeeds.map((feed, idx) => (
              <SwiperSlide key={feed.id}>
                <div className={styles.cardWrapper}>
                  {idx < 4 && (
                    <div className={styles.rankingIconWrapper}>
                      <IconComponent
                        name={
                          idx === 0
                            ? "ranking1"
                            : idx === 1
                            ? "ranking2"
                            : idx === 2
                            ? "ranking3"
                            : "ranking4"
                        }
                        size={30}
                      />
                    </div>
                  )}
                  <SquareCard
                    id={feed.id}
                    title={feed.title}
                    thumbnail={feed.thumbnail}
                    author={feed.author}
                    likeCount={feed.likeCount}
                    viewCount={feed.viewCount}
                    isLike={feed.isLike}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className={styles.rankingContainer}>
          <button
            className={`${styles.navButton} ${styles.left}`}
            onClick={handlePrevClick}
            disabled={pageIndex === 0}
            style={{
              visibility: pageIndex === 0 ? "hidden" : "visible",
            }}
          >
            <img
              src="/icon/card-arrow-left.svg"
              width={40}
              height={40}
              alt="왼쪽 버튼"
              className={styles.arrowBtn}
              loading="lazy"
            />
          </button>
          <div className={styles.cardsContainer}>
            {paginatedFeeds
              .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
              .map((feed, idx) => {
                const absoluteIdx = pageIndex * itemsPerPage + idx;
                return (
                  <div key={feed.id} className={styles.cardWrapper}>
                    {absoluteIdx < 4 && (
                      <div className={styles.rankingIconWrapper}>
                        <IconComponent
                          name={
                            absoluteIdx === 0
                              ? "ranking1"
                              : absoluteIdx === 1
                              ? "ranking2"
                              : absoluteIdx === 2
                              ? "ranking3"
                              : "ranking4"
                          }
                          size={30}
                        />
                      </div>
                    )}
                    <SquareCard
                      id={feed.id}
                      title={feed.title}
                      thumbnail={feed.thumbnail}
                      author={feed.author}
                      likeCount={feed.likeCount}
                      viewCount={feed.viewCount}
                      isLike={feed.isLike}
                    />
                  </div>
                );
              })}
          </div>
          <button
            className={`${styles.navButton} ${styles.right}`}
            onClick={handleNextClick}
            disabled={pageIndex === totalSlides - 1}
            style={{
              visibility: pageIndex === totalSlides - 1 ? "hidden" : "visible",
            }}
          >
            <img
              src="/icon/card-arrow-right.svg"
              width={40}
              height={40}
              alt="오른쪽 버튼"
              className={styles.arrowBtn}
              loading="lazy"
            />
          </button>
        </div>
      )}
    </div>
  );
}
