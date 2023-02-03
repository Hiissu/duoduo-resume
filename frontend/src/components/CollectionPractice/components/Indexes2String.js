import React, { memo, useState } from "react";
import { useDispatch } from "react-redux";
import { fusion2Texts } from "../../../configs/functions";
import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { Text } from "@nextui-org/react";
import { BsVolumeUp } from "react-icons/bs";
import { CgArrowsExpandUpRight } from "react-icons/cg";
import { TranslationViewModal } from ".";
import { onSpeak } from "../../../store/slices/settingSlice";

const Indexes2String = ({ indexes2String }) => {
  const dispatch = useDispatch();
  const onSpeaker = (text) => {
    dispatch(onSpeak(text));
  };

  const meaningsInTran = (meanings) => {
    let mergedMeanings = [];
    meanings.forEach((element) => {
      const meaningArr = fusion2Texts(element.meaning);
      mergedMeanings = [...mergedMeanings, ...meaningArr];
    });

    const meaningsJsx = [];
    const chosenMeanings = [];
    for (let i = 0; i < 3; i++) {
      const randomNum = Math.floor(Math.random() * mergedMeanings.length);
      const chosenMeaning = mergedMeanings.splice(randomNum, 1)[0];

      if (chosenMeaning !== undefined) chosenMeanings.push(chosenMeaning);
    }

    chosenMeanings.forEach((meaning, index) => {
      const isMore = index === 2 && mergedMeanings.length > 1;
      meaningsJsx.push(
        <Text
          className={`text-center ${index < 2 ? "mb-2" : "mb-4"}`}
          weight="normal"
          size={14}
        >
          {meaning}
          {isMore && <CgArrowsExpandUpRight className="ms-2" />}
        </Text>
      );

      if (index < 2 && index < chosenMeanings.length - 1) {
        meaningsJsx.push(<div className="hr" />);
      }
    });

    return meaningsJsx;
  };

  const tranFromWhere = (detail) => {
    switch (detail.from) {
      case "duoduo":
        return (
          <Tooltip title="More Details" placement="right" arrow>
            {/* tooltip only wrap 1 tag */}
            <div>
              <Text
                // css={{
                //   textGradient:
                //     "90deg, hsla(352, 83%, 64%, 1) 0%, hsla(230, 90%, 68%, 1) 100%",
                // }}
                className="pointer d-flex flex-row justify-content-center align-items-center align-items-center"
                weight="bold"
                size={18}
                onClick={() => onSpeaker(detail.header, false)}
              >
                <IconButton color="secondary">
                  <BsVolumeUp className="me-2" />
                </IconButton>

                {detail.header}
              </Text>

              <div
                className="pointer"
                onClick={() =>
                  setIsViewTran({
                    is: true,
                    header: detail.header,
                    translation: detail.translation,
                  })
                }
              >
                {detail.translation.ipa.length > 0 && (
                  <div className="d-flex flex-row align-items-between align-items-center">
                    <Text
                      color="secondary"
                      size={14}
                      className="text-left me-2"
                    >
                      ipa
                    </Text>
                    <Text size={14}>{detail.translation.ipa}</Text>
                  </div>
                )}

                {detail.translation.trans.map((tran, index) => (
                  <div key={index}>
                    <div className="d-flex flex-row align-items-between align-items-center">
                      <Text
                        color="secondary"
                        size={14}
                        className="text-left me-2"
                        // css={{ textGradient: "90deg, hsla(230, 90%, 68%, 1) 0%, hsla(352, 83%, 64%, 1) 100%", }}
                      >
                        pos
                      </Text>
                      <Text size={14}>{tran.pos}</Text>
                    </div>
                    {meaningsInTran(tran.meanings).map((elem, indx) => (
                      <div key={indx}>{elem}</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Tooltip>
        );
      case "microsofttranslator":
        return (
          <>
            <Text
              // css={{
              //   textGradient:
              //     "90deg, hsla(352, 83%, 64%, 1) 0%, hsla(230, 90%, 68%, 1) 100%",
              // }}
              className="pointer d-flex flex-row justify-content-center align-items-center align-items-center"
              weight="bold"
              size={18}
              onClick={() => onSpeaker(detail.header, false)}
            >
              <IconButton color="secondary">
                <BsVolumeUp className="me-2" />
              </IconButton>
              {detail.header}
            </Text>
            <Text className="text-center mb-2" weight="normal" size={14}>
              {detail.translation}
            </Text>
          </>
        );
      default:
        break;
    }
  };

  const DetailsOfElm = ({ details }) => {
    return details.map((detail, index) => (
      <div key={index}>{tranFromWhere(detail)}</div>
    ));
  };

  const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: "none", // or 600
      fontSize: theme.typography.pxToRem(10),
      borderRadius: "12px",
      // border: "1px solid #e5e5e5",
      // backgroundColor: theme.palette.common.white,
      // backgroundColor: "#f7f7f7", transparent
    },
  }));

  const [isViewTran, setIsViewTran] = useState({
    is: false,
    header: "",
    translation: {},
  });

  return (
    <>
      {isViewTran.is && (
        <TranslationViewModal
          onClose={() => setIsViewTran({ ...isViewTran, is: false })}
          header={isViewTran.header}
          translation={isViewTran.translation}
        />
      )}

      {indexes2String.map((element, index) =>
        element.content !== " " ? (
          <span key={index}>
            <CustomTooltip
              arrow
              title={<DetailsOfElm details={element.details} />}
            >
              <span
                className="decor-dot"
                onMouseEnter={() => onSpeaker(element.content, false)}
              >
                {element.content}
              </span>
            </CustomTooltip>
          </span>
        ) : (
          <span key={index}>&nbsp;</span>
        )
      )}
    </>
  );
};

export default memo(Indexes2String);
