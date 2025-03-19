import styles from "./Nickname.module.scss";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "@/states/modalState";
import { useMutation } from "react-query";
import TextField from "@/components/TextField/TextField";
import IconComponent from "@/components/Asset/Icon";
import Button from "@/components/Button/Button";
import { authState } from "@/states/authState";
import { useToast } from "@/hooks/useToast";
import axiosInstance from "@/constants/baseurl";

export default function Nickname() {
  const [nickname, setNickname] = useState("");
  const [agree, setAgree] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [, setAuth] = useRecoilState(authState);
  const [modal, setModal] = useRecoilState(modalState);
  const { showToast } = useToast();

  const checkNicknameMutation = useMutation({
    mutationFn: async (nickname: string) => {
      const response = await axiosInstance.post("/auth/register/name", { name: nickname });
      return response.data;
    },
    onError: () => {
      setErrorMessage("이미 사용 중인 활동명입니다.");
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { provider: string; providerAccessToken: string; name: string }) => {
      const response = await axiosInstance.post("/auth/register", data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth({
        access_token: data.accessToken,
        isLoggedIn: true,
        user_id: data.id,
      });

      localStorage.setItem("access_token", data.accessToken);
      localStorage.setItem("refresh_token", data.refreshToken || "");

      setModal({ isOpen: true, type: "JOIN", data: null });
    },
    onError: (error: any) => {
      if (error?.response?.status === 409) {
        setErrorMessage("이미 사용 중인 활동명입니다.");
      } else {
        console.error("Registration error:", error);
        showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
      }
    },
  });

  const handleSubmitNickname = async () => {
    setErrorMessage("");

    if (nickname.trim().length < 2) {
      setErrorMessage("활동명은 두 글자 이상 입력해야 합니다.");
      return;
    }

    if (!agree) {
      showToast("서비스 이용약관 및 개인정보취급방침에 동의해주세요.", "error");
      return;
    }

    if (!modal.data || !modal.data.accessToken || !modal.data.provider) {
      showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
      return;
    }

    try {
      await checkNicknameMutation.mutateAsync(nickname.trim());

      setModal({
        isOpen: true,
        type: "PROFILE-ID",
        data: {
          accessToken: modal.data.accessToken,
          provider: modal.data.provider,
          nickname: nickname.trim(),
        },
      });
    } catch (error) {}
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>활동명을 정해주세요</h2>
        <p className={styles.subtitle}>작품과 함께 기억될 이름이에요</p>
      </div>
      <div className={styles.textBtnContainer}>
        <div className={styles.textContainer}>
          <TextField
            placeholder="프로필에 표시될 활동명을 입력해주세요"
            maxLength={12}
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value.trimStart());
              setErrorMessage("");
            }}
            isError={!!errorMessage || checkNicknameMutation.isError}
            errorMessage={errorMessage}
          />
          <label className={styles.label}>
            <div className={styles.checkbox} onClick={() => setAgree(!agree)}>
              <IconComponent name={agree ? "checkedbox" : "checkbox"} size={24} isBtn />
            </div>
            <span className={styles.text}>
              <a
                href="https://nostalgic-patch-498.notion.site/1930ac6bf29881e9a3e4c405e7f49f2b?pvs=73"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.underline}
              >
                서비스이용약관
              </a>{" "}
              과{" "}
              <a
                href="https://nostalgic-patch-498.notion.site/1930ac6bf29881b9aa19ff623c69b8e6?pvs=74"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.underline}
              >
                개인정보취급방침
              </a>{" "}
              에 동의합니다.
            </span>
          </label>
        </div>
        <Button
          size="l"
          type="filled-primary"
          disabled={nickname.trim().length < 2 || !agree}
          onClick={handleSubmitNickname}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
