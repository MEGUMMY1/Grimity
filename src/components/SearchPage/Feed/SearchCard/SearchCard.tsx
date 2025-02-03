import { useState } from "react";
import IconComponent from "@/components/Asset/Icon";
import styles from "./SearchCard.module.scss";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";
import { useRecoilValue } from "recoil";
import { authState } from "@/states/authState";
import { deleteLike, putLike } from "@/api/feeds/putDeleteFeedsLike";
import { SearchCardProps } from "./SearchCard.types";
import { Swiper, SwiperSlide } from "swiper/react";

export default function SearchCard({
  id,
  title,
  thumbnail,
  viewCount,
  likeCount,
  commentCount,
  isLike,
  tags,
  author,
}: SearchCardProps) {
  const { isLoggedIn } = useRecoilValue(authState);
  const [isLiked, setIsLiked] = useState(isLike);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) {
      await deleteLike(id);
      setCurrentLikeCount((prev) => prev - 1);
    } else {
      await putLike(id);
      setCurrentLikeCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        {isLoggedIn && (
          <div className={styles.likeBtn} onClick={handleLikeClick}>
            <IconComponent
              name={isLiked ? "cardLikeOn" : "cardLikeOff"}
              isBtn
              width={35}
              height={35}
            />
          </div>
        )}
        <Link href={`/feeds/${id}`}>
          <Image
            src={thumbnail}
            alt={title}
            layout="fill"
            objectFit="cover"
            className={styles.image}
          />
        </Link>
      </div>
      <div className={styles.chips}>
        <Swiper spaceBetween={8} slidesPerView="auto" grabCursor={true} className={styles.swiper}>
          {tags.map((tag: string, index: number) => (
            <SwiperSlide key={index} className={styles.slide}>
              <Link href={`/search?tab=feed&keyword=${tag}`}>
                <div className={styles.chip}>{tag}</div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={styles.infoContainer}>
        <Link href={`/feeds/${id}`}>
          <h3 className={styles.title}>{title}</h3>
        </Link>
        <div className={styles.profileContainer}>
          <Link href={`/users/${author?.id}`}>
            <p className={styles.author}>{author?.name}</p>
          </Link>
          <Image src="/icon/dot.svg" width={3} height={3} alt="" />
          <div className={styles.countContainer}>
            <div className={styles.likeContainer}>
              <IconComponent name="likeCount" width={16} height={16} />
              <p className={styles.count}>{formatCurrency(currentLikeCount)}</p>
            </div>
            <div className={styles.likeContainer}>
              <IconComponent name="commentCount" width={16} height={16} />
              <p className={styles.count}>{formatCurrency(commentCount)}</p>
            </div>
            <div className={styles.likeContainer}>
              <IconComponent name="viewCount" width={16} height={16} />
              <p className={styles.count}>{formatCurrency(viewCount)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
