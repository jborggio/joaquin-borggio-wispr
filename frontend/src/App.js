// import "./App.css";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import style from "./App.module.css";
import Stack from "@mui/material/Stack";
import axios from "axios";
import SingleAudioComponent from "./SingleAudioComponent.js";
import { LineWave } from "react-loader-spinner";
import { ReactMic } from 'react-mic';


function App() {
  let [isRecording, setIsRecording] = useState(false);
  let [isDoneRecording, setIsDoneRecording] = useState(false);
  let [isPlaying, setIsPlaying] = useState(false);
  let [audioFiles, setAudioFiles] = useState([]);
  let [currAudio, setCurrAudio] = useState("");

  // CODE BELOW CAN BE UNCOMMENTED AND FIXED TO ENABLE VISUALIZATION OF THE AUDIO STREAM
  // var source = new EventSource("://127.0.0.1:5000/startRecording");
  //   source.addEventListener('publish', function(event) {
  //       var data = JSON.parse(event.data);
  //       console.log("The server says " + data.message);
  //   }, false);
  //   source.addEventListener('error', function(event) {
  //       console.log("Error"+ event)
  //       alert("Failed to connect to event stream. Is Redis running?");
  //   }, false);

  async function clickedStart() {
    // set variables
    setIsRecording(true);
    setIsDoneRecording(false);

    // Axios call to start recording
    let audioID = await axios.get(`http://127.0.0.1:5000/startRecording`);

    // set surrent audio
    setCurrAudio(audioID.data);
  }

  async function clickedStopRecording() {
    // set appropriate variables
    setIsRecording(false);
    setIsDoneRecording(true);

    // axios call to stop recording
    let response = await axios.get(`http://127.0.0.1:5000/stopRecording`);
  }

  async function clickedPlay() {
    setIsPlaying(true);

    // Axios call to start playing audio
    let response = await axios.post(
      `http://127.0.0.1:5000/playAudio`,
      { id_num: currAudio },
      {
        "Content-Type": "application/json",
      }
    );

    setIsPlaying(false);
  }

  function clickedClear() {
    // Adjust variables
    setCurrAudio("");
    setIsRecording(false);
    setIsDoneRecording(false);
  }

  function clickedSave() {
    // Save currAudio to audioFiles
    setAudioFiles([currAudio, ...audioFiles]);
    setCurrAudio("");
    setIsRecording(false);
    setIsDoneRecording(false);
  }

  function audioSelect(file_id) {
    // Move audio file to currAudio
    setCurrAudio(file_id);
  }

  function audioDelete(file_id) {
    // Delete audio file from audioFiles 
    setAudioFiles(
      audioFiles.filter((elem) => {
        return elem !== file_id;
      })
    );
  }

  async function clickedStopAudio() {
    // Axios call to stop playing the audio
    let response = await axios.get(`http://127.0.0.1:5000/stopAudio`);
    setIsPlaying(false);
  }

  return (
    <div className="App">
      <div className={style.topSection}>
        <span className={style.headerText}>Record Your Audio with Python!</span>
        {/* {isRecording && <div className={style.recording}>Recording...</div>} */}
        {isRecording && (
          <div>
            <LineWave
              color="blue"
            ></LineWave>{" "}
            <div className={style.recording}>Recording...</div>
          </div>
        )}
        <div style={{ width: "80%" }}>
          {currAudio !== "" && (
            <SingleAudioComponent audio_id={currAudio} backColor="#7da8b6"/>
            // </SingleAudioComponent>
          )}
        </div>
      </div>

      {/* Buttons Section */}
      <div className={style.buttonSection}>
        <Stack direction="row" spacing={2}>
          {!isRecording && !isDoneRecording && currAudio==="" && (
            <Button variant="contained" onClick={clickedStart}>
              Start Recording
            </Button>
          )}
          {isRecording && !isDoneRecording && (
            <Button variant="contained" onClick={clickedStopRecording}>
              Stop Recording
            </Button>
          )}
          {currAudio !== "" && (
            <Button variant="contained" onClick={clickedClear}>
              Clear Audio
            </Button>
          )}
          {!isRecording && isDoneRecording && (
            <Button variant="contained" onClick={clickedSave}>
              Save Audio
            </Button>
          )}
          {currAudio !== "" && !isPlaying && (
            <Button variant="contained" onClick={clickedPlay}>
              Play Audio
            </Button>
          )}
          {currAudio !== "" && isPlaying && (
            <Button variant="contained" onClick={clickedStopAudio}>
              Stop Audio
            </Button>
          )}
        </Stack>
      </div>

      {/* List of saved audio files section */}
      <div className={style.listSection}>
        <span className={style.listTitle}>
          Saved Audio Files ({audioFiles.length}):
        </span>
        {audioFiles.map((file_id) => {
          return (
            <SingleAudioComponent
              audio_id={file_id}
              backColor="#add8e6"
              width="100%"
              key={file_id}
            >
              <Button
                variant="outlined"
                onClick={() => {
                  audioSelect(file_id);
                }}
              >
                Select
              </Button>
              <Button
                style={{ marginLeft: "5px" }}
                variant="outlined"
                color="error"
                onClick={() => {
                  audioDelete(file_id);
                }}
              >
                Delete
              </Button>
            </SingleAudioComponent>
          );
        })}
        {audioFiles.length === 0 && (
          <span className={style.message}>
            Click "Start Recording" to record audio. Then, you can "Save Audio"
            for future reference!
          </span>
        )}
      </div>
    </div>
  );
}

export default App;
