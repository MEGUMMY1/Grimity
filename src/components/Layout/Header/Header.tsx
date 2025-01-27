import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./Header.module.scss";
import Button from "@/components/Button/Button";
import Link from "next/link";
import IconComponent from "@/components/Asset/Icon";
import { useRecoilState, useRecoilValue } from "recoil";
import { modalState } from "@/states/modalState";
import { authState } from "@/states/authState";
import { useMyData } from "@/api/users/getMe";
import { useRouter } from "next/router";

export default function Header() {
  const [, setModal] = useRecoilState(modalState);
  const [, setAuth] = useRecoilState(authState);
  const { isLoggedIn } = useRecoilValue(authState);
  const { data: myData } = useMyData();
  const [activeNav, setActiveNav] = useState("홈");
  const activeItemRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const isUserPage = router.pathname.startsWith("/users/[id]");
  const isNavPage = ["/", "/popular", "/board", "/following"].includes(router.pathname);

  const navItems = [
    { name: "홈", path: "/" },
    { name: "인기그림", path: "/popular" },
    { name: "자유게시판", path: "/board" },
    { name: "팔로잉", path: "/following" },
  ];

  const handleNavClick = (item: { name: string; path: string }) => {
    setActiveNav(item.name);
    router.push(item.path);
  };

  const handleLogout = () => {
    setAuth({
      access_token: "",
      isLoggedIn: false,
      user_id: "",
    });
    router.push("/");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
  };

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [isLoggedIn]);

  useEffect(() => {
    const currentPath = router.pathname;
    const activeItem = navItems.find((item) => item.path === currentPath);
    if (activeItem) {
      setActiveNav(activeItem.name);
    }
  }, [router.pathname]);

  useEffect(() => {
    if (isNavPage && activeItemRef.current && indicatorRef.current) {
      const { offsetLeft, offsetWidth } = activeItemRef.current;
      indicatorRef.current.style.transform = `translateX(${offsetLeft}px)`;
      indicatorRef.current.style.width = `${offsetWidth}px`;
    } else if (!isNavPage && indicatorRef.current) {
      indicatorRef.current.style.transform = "none";
      indicatorRef.current.style.width = "0px";
    }
  }, [activeNav, isUserPage]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClickLogo = () => {
    router.push("/");
  };

  return (
    <header className={isUserPage ? styles.userPageHeader : styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <div className={styles.cursor} onClick={handleClickLogo}>
            <Image
              src={isUserPage ? "/image/logo-white.svg" : "/image/logo.svg"}
              width={100}
              height={29}
              alt="logo"
            />
          </div>
          <nav className={styles.nav}>
            {navItems.map((item, index) => (
              <div key={index} className={styles.navItem} onClick={() => handleNavClick(item)}>
                <p
                  className={`${isUserPage ? styles.userPageitem : styles.item} ${
                    isNavPage && (activeNav === item.name ? styles.active : "")
                  }`}
                  ref={item.name === activeNav ? activeItemRef : null}
                >
                  {item.name}
                </p>
                {index < navItems.length - 1 && <div className={styles.bar} />}
              </div>
            ))}
            <div ref={indicatorRef} className={styles.indicator} />
          </nav>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.icons}>
            <IconComponent
              name={isUserPage ? "searchWhite" : "search"}
              width={24}
              height={24}
              padding={8}
              isBtn
              alt="검색"
            />
            {isLoggedIn && (
              <IconComponent
                name={isUserPage ? "bellWhiteActive" : "bellActive"}
                width={40}
                height={40}
                padding={0}
                isBtn
                alt="알림"
              />
            )}
          </div>
          {isLoggedIn && myData ? (
            <div className={styles.profileSection}>
              <div
                className={styles.profileContainer}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {myData.image !== "https://image.grimity.com/null" ? (
                  <Image
                    src={myData.image}
                    width={28}
                    height={28}
                    alt="프로필 이미지"
                    className={styles.profileImage}
                  />
                ) : (
                  <Image
                    src="/image/default.svg"
                    width={28}
                    height={28}
                    alt="프로필 이미지"
                    className={styles.profileImage}
                  />
                )}
              </div>
              {isDropdownOpen && (
                <div className={styles.dropdown} ref={dropdownRef}>
                  <Link href={`/users/${myData.id}`}>
                    <div className={styles.dropdownItem}>
                      {myData.image !== "https://image.grimity.com/null" ? (
                        <Image
                          src={myData.image}
                          width={28}
                          height={28}
                          alt="프로필 이미지"
                          className={styles.dropdownProfileImage}
                        />
                      ) : (
                        <Image
                          src="/image/default.svg"
                          width={28}
                          height={28}
                          alt="프로필 이미지"
                          className={styles.dropdownProfileImage}
                        />
                      )}
                      <span>내 프로필</span>
                    </div>
                  </Link>
                  <div className={styles.divider} />
                  <Link href="/mypage?tab=liked-feeds">
                    <div className={styles.dropdownItem}>좋아요한 그림</div>
                  </Link>
                  <Link href="/mypage?tab=saved-feeds">
                    <div className={styles.dropdownItem}>저장한 그림</div>
                  </Link>
                  <div className={styles.divider} />
                  <Link href="/mypage?tab=liked-posts">
                    <div className={styles.dropdownItem}>좋아요한 글</div>
                  </Link>
                  <Link href="/mypage?tab=my-comments">
                    <div className={styles.dropdownItem}>내가 쓴 댓글</div>
                  </Link>
                  <div className={styles.divider} />
                  <div className={`${styles.dropdownItem} ${styles.logout}`} onClick={handleLogout}>
                    로그아웃
                  </div>
                </div>
              )}
              <Button size="m" type="filled-primary">
                그림 업로드
              </Button>
            </div>
          ) : (
            <div
              className={styles.uploadBtn}
              onClick={() => setModal({ isOpen: true, type: "LOGIN" })}
            >
              <Button size="m" type="filled-primary">
                로그인
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
