from flask import Flask, Response, jsonify, request
import pyaudio
import wave
from flask_cors import CORS
import simpleaudio as sa
# from flask_sse import sse # This line is for server side events (live streaming waveform)
import uuid

app = Flask(__name__)
CORS(app)

# Code below would allow for live streaming to frontend
# app.config["REDIS_URL"] = "redis://localhost"
# app.register_blueprint(sse, url_prefix='/stream')

audio = pyaudio.PyAudio()
stream = audio.open(format=pyaudio.paInt16, channels=1, rate=44100, input=True, frames_per_buffer=1024)
turn_off = False

CHUNK=1024
RATE=44100

play_obj = None

@app.route("/startRecording")
def startRec():
    print("inside of /startRecording...")
    global turn_off 
    turn_off = False
    audio = pyaudio.PyAudio()
    stream = audio.open(format=pyaudio.paInt16, channels=1, rate=RATE, input=True, frames_per_buffer=CHUNK)
    frames=[]

    while turn_off == False:
        data = stream.read(1024)
        frames.append(data)

        # Code below would allow for live streaming to frontend
        # sse.publish({"audio_data": data.encode() }, type='publish')


    stream.stop_stream()
    stream.close()
    audio.terminate()

    destination_blob_name = str(uuid.uuid1())

    sound_file = wave.open(destination_blob_name+".wav", "wb")
    sound_file.setnchannels(1)
    sound_file.setsampwidth(audio.get_sample_size(pyaudio.paInt16))
    sound_file.setframerate(44100)
    sound_file.writeframes(b''.join(frames))
    sound_file.close()
    print("...returning from /startRecording")

    return destination_blob_name

@app.route("/stopRecording")
def stopRec():
    print("inside of /stopRecording...")
    global turn_off 
    turn_off = True
    print("...returning from /stopRecording")
    return "Stop World!"

@app.route("/playAudio", methods=['POST'])
def playAudio():
    print("inside of /playAudio...")
    json_data = request.get_json()
    file_path = json_data["id_num"] + ".wav"
    global play_obj
    wave_obj = sa.WaveObject.from_wave_file(file_path)
    play_obj = wave_obj.play()
    play_obj.wait_done()
    print("...returning from /playAudio")

    # Could return valuable audio info here if we want to display the wave form on frontend
    return "Started Playing Audio"

@app.route("/stopAudio")
def stopAudio():
    print("inside of /stopAudio...")
    global play_obj
    play_obj.stop()
    print("...returning from /stopAudio")
    return "Stopped Playing Audio"

if __name__ == "__main__":
  app.run()