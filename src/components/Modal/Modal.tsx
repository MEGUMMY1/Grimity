import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "./Modal.module.scss";
import { modalState } from "@/states/modalState";
import { usePreventScroll } from "@/hooks/usePreventScroll";
import IconComponent from "../Asset/Icon";
import Button from "../Button/Button";
import Login from "./Login/Login";
import Nickname from "./Nickname/Nickname";
import ProfileId from "./ProfileId/ProfileId";
import Join from "./Join/Join";
import ProfileEdit from "./ProfileEdit/ProfileEdit";
import Background from "./Background/Background";
import Follow from "./Follow/Follow";
import Share from "./Share/Share";
import UploadModal from "./Upload/Upload";
import SharePost from "./SharePost/SharePost";
import Like from "./Like/Like";
import Report from "./Report/Report";

export default function Modal() {
  const [modal, setModal] = useRecoilState(modalState);
  const router = useRouter();

  usePreventScroll(modal.isOpen);

  useEffect(() => {
    if (modal.isOpen && modal.isFill) {
      window.history.pushState({ isModalOpen: true }, "", window.location.href);
    }

    const handlePopState = () => {
      setModal({ isOpen: false, type: null, data: null });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [modal.isOpen, setModal]);

  useEffect(() => {
    const handleRouteChange = () => {
      setModal({ isOpen: false, type: null, data: null });
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router, setModal]);

  const closeModal = () => {
    setModal({ isOpen: false, type: null, data: null, isComfirm: false });
  };

  if (!modal.isOpen) return null;

  const renderModalContent = () => {
    switch (modal.type) {
      case "LOGIN":
        return <Login />;
      case "NICKNAME":
        return <Nickname />;
      case "PROFILE-ID":
        return <ProfileId />;
      case "JOIN":
        return <Join />;
      case "PROFILE-EDIT":
        return <ProfileEdit />;
      case "BACKGROUND":
        return <Background imageSrc={modal.data.imageSrc} file={modal.data.file} />;
      case "FOLLOWER":
        return <Follow initialTab="follower" />;
      case "FOLLOWING":
        return <Follow initialTab="following" />;
      case "SHARE":
        return <Share {...modal.data} />;
      case "SHAREPOST":
        return <SharePost {...modal.data} />;
      case "UPLOAD":
        return <UploadModal {...modal.data} />;
      case "LIKE":
        return <Like />;
      case "REPORT":
        return <Report {...modal.data} />;
      default:
        return null;
    }
  };

  return (
    <>
      {!modal.isFill ? (
        <div className={styles.overlay} onClick={closeModal}>
          {modal.isComfirm ? (
            <div className={styles.comfirmModal}>
              <div className={styles.titleContainer}>
                <h2 className={styles.title}>{modal.data.title}</h2>
                {modal.data.subtitle && <p className={styles.subtitle}>{modal.data.subtitle}</p>}
              </div>
              <div className={styles.btnsContainer}>
                <Button size="l" type="outlined-assistive" onClick={closeModal}>
                  취소
                </Button>
                <Button size="l" type="filled-primary" onClick={modal.data.onClick}>
                  {modal.data.confirmBtn}
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={
                modal.type === "PROFILE-EDIT"
                  ? styles.profileEditModal
                  : modal.type === "FOLLOWER" || modal.type === "FOLLOWING" || modal.type === "LIKE"
                  ? styles.followModal
                  : styles.modal
              }
              onClick={(e) => e.stopPropagation()}
            >
              {renderModalContent()}
              <button className={styles.closeButton} onClick={closeModal}>
                <IconComponent name="x" size={24} isBtn />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.fill} onClick={(e) => e.stopPropagation()}>
          {renderModalContent()}
        </div>
      )}
    </>
  );
}
