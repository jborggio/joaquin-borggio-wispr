import React from "react";
import style from "./SAC.module.css";

function SingleAudioComponent(props) {
  return (
    <div className={style.top} style={{background: props.backColor, width: props.width}}>
      <div className={style.name}>Audio File: {props.audio_id}.wav</div>
      <div>{props.children}</div>
    </div>
  );
}

export default SingleAudioComponent;
