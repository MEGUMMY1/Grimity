import { useState } from "react";
import IconComponent from "@/components/Asset/Icon";
import styles from "./SquareCard.module.scss";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import { SquareCardProps } from "./SquareCard.types";
import Link from "next/link";
import { useRecoilValue } from "recoil";
import { authState } from "@/states/authState";
import { deleteLike } from "@/api/feeds/deleteFeedsIdLike";
import { putLike } from "@/api/feeds/putFeedsIdLike";

export default function SquareCard({
  title,
  cards = [],
  thumbnail,
  author,
  likeCount,
  commentCount,
  id,
  isLike,
}: SquareCardProps) {
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
              width={24}
              height={24}
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
      <div className={styles.infoContainer}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.profileContainer}>
          {author && (
            <>
              <Link href={`/users/${author.id}`}>
                <p className={styles.author}>{author.name}</p>
              </Link>
              <div className={styles.countContainer}>
                <div className={styles.likeContainer}>
                  <IconComponent name="cardLike" width={12} height={12} />
                  <p className={styles.count}>{formatCurrency(currentLikeCount)}</p>
                </div>
                <div className={styles.likeContainer}>
                  <IconComponent name="cardComment" width={12} height={12} />
                  <p className={styles.count}>{formatCurrency(commentCount)}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
