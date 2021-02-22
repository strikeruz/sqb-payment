import React from "react";
import { useHistory } from "react-router-dom";
import arrowLeftIcon from "@/assets/images/arrow-left.svg";
export default function PrevButton(props) {
  const { className, children, onClick } = props;
  const history = useHistory();
  const goToPrev = () => onClick ? onClick() : history.goBack()
  return (
    <>
      <div className={className} onClick={goToPrev}>
        <img src={arrowLeftIcon} alt="Back" />
        {children}
      </div>
    </>
  );
}
