import logo from "./logo.svg";
// import "./App.css";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import style from "./App.module.css";
import Stack from "@mui/material/Stack";
import axios from "axios";
import SingleAudioComponent from "./SingleAudioComponent.js";
import { LineWave } from "react-loader-spinner";
import { ReactMic } from 'react-mic';
// import { Recorder } from "react-voice-recorder";

// import { Recorder } from "react-voice-recorder";

function App() {
  let [isRecording, setIsRecording] = useState(false);
  let [isDoneRecording, setIsDoneRecording] = useState(false);
  let [isPlaying, setIsPlaying] = useState(false);
  let [audioFiles, setAudioFiles] = useState([]);
  let [currAudio, setCurrAudio] = useState("");
  // let [shouldVisualize, setShouldVisualize] = useState(false);

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
    // Axios call to start recording
    console.log("about to call axios");
    setIsRecording(true);
    setIsDoneRecording(false);
    // setShouldVisualize(true);
    let audioID = await axios.get(`http://127.0.0.1:5000/startRecording`);

    console.log("audio chunks.data: ", audioID.data);

    // const audioBlob = new Blob(audioChunks.data, { type: "audio/wav" });

    // const audioUrl = URL.createObjectURL(audioBlob);
    setCurrAudio(audioID.data);

    console.log("back");
    // console.log(response)
  }

  async function clickedStopRecording() {
    // stop recoding but dont finish
    console.log("about to call axios 2");
    setIsRecording(false);
    setIsDoneRecording(true);
    let response = await axios.get(`http://127.0.0.1:5000/stopRecording`);
    console.log("back 2");
    console.log(response);
  }

  async function clickedPlay() {
    console.log("about to call axios 3");
    setIsPlaying(true);
    // setIsRecording(true);
    let response = await axios.post(
      `http://127.0.0.1:5000/playAudio`,
      { id_num: currAudio },
      {
        "Content-Type": "application/json",
      }
    );
    setIsPlaying(false);
    console.log("back 3");
    console.log(response);
  }

  function clickedClear() {
    setCurrAudio("");
    setIsRecording(false);
    setIsDoneRecording(false);
  }

  function clickedSave() {
    setAudioFiles([currAudio, ...audioFiles]);
    setCurrAudio("");
    setIsRecording(false);
    setIsDoneRecording(false);
  }

  // function test() {
  //   console.log("Printing audio files")
  //   console.log(audioFiles)
  // }

  function audioSelect(file_id) {
    console.log("Printing pops");
    console.log(file_id);
    setCurrAudio(file_id);
  }

  function audioDelete(file_id) {
    console.log("Printing pops");
    console.log(file_id);
    setAudioFiles(
      audioFiles.filter((elem) => {
        return elem !== file_id;
      })
    );
  }

  async function clickedStopAudio() {
    // stop recoding but dont finish
    console.log("about to call axios 2");
    let response = await axios.get(`http://127.0.0.1:5000/stopAudio`);
    setIsPlaying(false);
    console.log(response);
  }

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload. Hi Boolio
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
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
        {/* <div>{currAudio}</div> */}
        <div style={{ width: "80%" }}>
          {currAudio !== "" && (
            <SingleAudioComponent audio_id={currAudio} backColor="#7da8b6">
              {/* <Button variant="outlined" onClick={() => {audioSelect(file_id)}}>
              Select
            </Button>
            <Button style={{marginLeft: "5px"}} variant="outlined" color="error" onClick={() => {audioDelete(file_id)}}>
              Delete
            </Button> */}
            </SingleAudioComponent>
          )}
        </div>
      </div>
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
          {/* <Button variant="contained" onClick={test}>
              See audio files
            </Button> */}
        </Stack>
      </div>
      <div className={style.listSection}>
        <span className={style.listTitle}>
          Saved Audio Files ({audioFiles.length}):
        </span>
        {/* {audioFiles.length !== 0 &&  */}
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
        {/* } */}
      </div>
      {/* {isRecording === true &&  
      <ReactMic
          record={isRecording}
          className="sound-wave"
          onStop={()=>{console.log("done i guess")}}
          // onData={this.onData}
          strokeColor="#000000"
          backgroundColor="#FF4081" />} */}
    </div>
  );
}

export default App;
