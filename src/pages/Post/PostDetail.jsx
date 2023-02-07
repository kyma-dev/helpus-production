import React, { useEffect } from "react";
import { StWrapper } from "../../components/UI/StIndex";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  __detailPost,
  __deletePost,
  __postZZim,
  __deadLinePost,
} from "../../redux/modules/postSlice";
import arrow_forward_ios from "../../asset/arrow_forward_ios.svg";
import emptyHeart from "../../asset/emptyHeart.svg";
import fullHeart from "../../asset/fullHeart.svg";
import { StFlex, StSpaceBetween } from "../../components/UI/CardStyle/StCommon";
import {
  StBackBtn,
  StBtnBox,
  StChatBtn,
  StContainer,
  StContents,
  StContentsWrapper,
  StCrsContainer,
  StCrsImg,
  StCrsLeftButton,
  StCrsRightButton,
  StDeadLineButton,
  StDeleteButton,
  StGroupImgs,
  StHidden,
  StHopeDay,
  StLocation,
  StMagam,
  StMainImg,
  StNickname,
  StProfile,
  StTags,
  StTitle,
  StUpdateButton,
  StUserInfo,
  StWishBtn,
  StZZimCount,
  StZZimImg,
} from "./StPostDetail";
import CrsLeft from "../../asset/CrsLeft.svg";
import CrsRight from "../../asset/CrsRight.svg";
import { useRef } from "react";
import { useState } from "react";
const PostDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { postId } = useParams();
  const { userId } = useSelector((state) => state.userSlice.userInfo);
  const zMsg = useSelector((state) => state.postSlice.ZZimMsg?.message);
  const logedIn = useSelector((state) => state.userSlice.isLogin);
  const kakaoLogedIn = useSelector((state) => state.userSlice?.isLoginKakao);
  const detail = useSelector((state) => state.postSlice?.postInfo);
  const deadLine = detail.isDeadLine;
  const dead = useSelector((state) => state.postSlice.deadLineMsg);

  const curr = new Date(detail.appointed);

  const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;

  const kRTimeDiff = 9 * 60 * 60 * 1000;

  const KrCurr = new Date(utc + kRTimeDiff);

  const KoreaDate = !detail.appointed ? null : KrCurr.toLocaleDateString();

  const tag = detail.tag?.split(",");
  const crsRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const TotalSlides = detail?.imageUrls?.length - 4;

  const preRef = useRef(null);

  const deletePost = () => {
    if (logedIn || kakaoLogedIn) {
      if (userId === detail?.userId) {
        dispatch(__deletePost(postId));
        alert("게시물이 삭제되었습니다.");
        navigate("/postlist");
      } else {
        alert("게시글 작성자만 이용할 수 있습니다");
      }
    } else {
      alert("로그인 시 이용할 수 있습니다");
    }
  };
  const updatePost = () => {
    if (logedIn || kakaoLogedIn) {
      if (userId === detail?.userId) {
        navigate(`/post/update/${postId}`);
      } else {
        alert("게시글 작성자만 이용할 수 있습니다");
      }
    } else {
      alert("로그인 시 이용할 수 있습니다");
    }
  };

  const changeDeadLine = () => {
    if (userId === detail?.userId) {
      if (deadLine === 1) {
        dispatch(
          __deadLinePost({
            isDeadLine: { isDeadLine: parseInt(2) },
            id: postId,
          })
        );
      } else {
        dispatch(
          __deadLinePost({
            isDeadLine: { isDeadLine: parseInt(1) },
            id: postId,
          })
        );
      }
    } else {
      alert("게시글 작성자만 이용할 수 있습니다");
    }
  };

  const zzimRef = useRef(null);
  const ZZim = async (e) => {
    dispatch(__postZZim(postId));
  };
  useEffect(() => {
    if (zMsg !== undefined) {
      zMsg === "찜"
        ? (zzimRef.current.src = `${fullHeart}`)
        : (zzimRef.current.src = `${emptyHeart}`);
    }
  }, [zMsg]);
  const moveCrsLeft = () => {
    if (currentSlide === 0) {
      setCurrentSlide(TotalSlides);
    }
    // 마지막 사진으로 이동
    else {
      setCurrentSlide(currentSlide - 1);
    }
  };
  const moveCrsRight = () => {
    if (currentSlide >= TotalSlides) {
      //더 이상 넘어갈 슬라이드가 없으면 1번째 사진으로 넘어간다
      setCurrentSlide(0);
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };
  const preview = (img) => {
    preRef.current.src = img;
  };

  useEffect(() => {
    crsRef.current.style.transition = "all 0.5s ease-in-out";
    crsRef.current.style.transform = `translateX(-${currentSlide * 12.88}em)`;
  }, [currentSlide]);

  useEffect(() => {
    dispatch(__detailPost(postId));
  }, [dead]);
  return (
    <StWrapper>
      <StContainer>
        <StSpaceBetween>
          <StBackBtn onClick={() => navigate("/postlist")}>
            <img src={arrow_forward_ios} alt="back_button" />
          </StBackBtn>
          <StFlex>
            {deadLine === 2 ? (
              <>
                <StDeadLineButton
                  onClick={() => {
                    if (logedIn || kakaoLogedIn) {
                      changeDeadLine();
                    } else {
                      alert("로그인 후에 이용할 수 있습니다");
                    }
                  }}
                >
                  마감취소
                </StDeadLineButton>
              </>
            ) : (
              <StDeadLineButton onClick={changeDeadLine}>마감</StDeadLineButton>
            )}
            {<StUpdateButton onClick={updatePost}>수정</StUpdateButton>}
            {<StDeleteButton onClick={deletePost}>삭제</StDeleteButton>}
          </StFlex>
        </StSpaceBetween>
        <StFlex>
          <StTitle>{detail?.title}</StTitle>
          {deadLine === 2 && <StMagam>마감</StMagam>}
        </StFlex>
        <StUserInfo>
          <StFlex>
            <StProfile src={detail?.userImage}></StProfile>
            <div>
              <StNickname>{detail?.userName}</StNickname>
              <StLocation>
                {detail?.location1}&nbsp;{detail?.location2}
              </StLocation>
            </div>
          </StFlex>
        </StUserInfo>
        <StHopeDay>희망일:{KoreaDate}</StHopeDay>

        <StMainImg ref={preRef} src={detail.mainImage}></StMainImg>
        <StGroupImgs value={currentSlide + 1}>
          <StCrsLeftButton
            src={CrsLeft}
            onClick={moveCrsLeft}
          ></StCrsLeftButton>
          <StCrsRightButton
            src={CrsRight}
            onClick={moveCrsRight}
          ></StCrsRightButton>

          <StHidden>
            <StCrsContainer ref={crsRef}>
              {detail.imageUrls?.map((item, idx) => {
                return (
                  <StCrsImg
                    src={item}
                    key={idx}
                    onClick={() => preview(item)}
                  />
                );
              })}
            </StCrsContainer>
          </StHidden>
        </StGroupImgs>
        <StContentsWrapper>
          <StContents>{detail.content}</StContents>
        </StContentsWrapper>
        <StFlex>
          {tag?.map((item, idx) => {
            return <StTags key={idx}>{item}</StTags>;
          })}
        </StFlex>
        {
          <>
            {
              <StBtnBox>
                <StChatBtn
                  onClick={() => {
                    if (
                      (logedIn || kakaoLogedIn) &&
                      userId !== detail?.userId
                    ) {
                      navigate(`/chat/${postId}/${detail?.userId}`, {
                        state: { chatInfo: detail },
                      });
                    } else {
                      alert("로그인 후에 이용해 주세요");
                    }
                  }}
                >
                  채팅하기
                </StChatBtn>
                <StWishBtn
                  onClick={() => {
                    if (
                      (logedIn || kakaoLogedIn) &&
                      userId !== detail?.userId
                    ) {
                      ZZim();
                    } else {
                      alert("로그인 후에 이용해 주세요");
                    }
                  }}
                >
                  <StZZimImg ref={zzimRef} src={emptyHeart} alt="wish" />
                  <StZZimCount>{detail.Wish}</StZZimCount>
                  찜하기
                </StWishBtn>
              </StBtnBox>
            }
          </>
        }
      </StContainer>
    </StWrapper>
  );
};

export default PostDetail;
