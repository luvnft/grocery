'use client'
import 'regenerator-runtime/runtime'

import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useReward } from 'react-rewards';
import { LiveAudioVisualizer } from 'react-audio-visualize'
import List, { AisleData } from './List';
import getIngredients from '@/app/actions/getIngredients';
import loadingAnimation from "../animations/loading_animation.json";
import { useLottie } from 'lottie-react';
import Xarrow from 'react-xarrows';

const mimeType = "audio/webm";

export default function Mic() {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
      } = useSpeechRecognition();
      const defaultAnimationOptions = {
        loop: true,
        autoplay: true,
        animationData: loadingAnimation,
      };
    const { View: LoadingView } = useLottie(defaultAnimationOptions, {height: '50px', width: '50px'}); 
    const [isRecording, setIsRecording ] = useState(false);
    const { reward: carrotReward } = useReward('carrotReward', 'emoji', {emoji: ['🥕']});
    const { reward: broccoliReward } = useReward('broccoliReward', 'emoji', {emoji: ['🥦']});
    const { reward: eggplantReward } = useReward('eggplantReward', 'emoji', {emoji: ['🍆']});
    const { reward: lettuceReward } = useReward('lettuceReward', 'emoji', {emoji: ['🥬']});
    const { reward: avocadoReward } = useReward('avocadoReward', 'emoji', {emoji: ['🥑']});
    

    const mediaRecorder = useRef<MediaRecorder | undefined>();
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [sectionData, setSectionData] = useState<AisleData[]>();
    const [isLoading, setIsLoading] = useState(false);

    const getStream = useCallback(async () => {
        if ("MediaRecorder" in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                return streamData;
            } catch (err) {
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
            return null;
        }
    }, []);

    const toggleRecording = useCallback(async () => {
        // TODO: update this once we use Whisper for audio transcription instead
        if (isRecording) {
            SpeechRecognition.stopListening();
            // stopRecording();
            let newSections = [];
            if (transcript.length > 2) {
                setIsLoading(true);
                newSections = await getIngredients(sectionData, transcript);
                if (newSections.aisles) {
                    setSectionData(newSections.aisles);
                    resetTranscript();
                } else {
                    alert("Sorry, something went wrong.");
                    setSectionData([]);
                }
                setIsLoading(false);
            }  else {
                alert("Sorry, we couldn't quite hear that. Please try again.");
            }
        } else {
            // let stream = await getStream();
            SpeechRecognition.startListening({continuous: true});
            if (!browserSupportsSpeechRecognition) {
                alert("Sorry, this browser isn't supported.");
                return;
            }
            // if (stream) {
            //     startRecording(stream);
            // }
        }
        setIsRecording(!isRecording);
    }, [isRecording, setIsRecording, setSectionData, transcript]);

    const ListSection = useMemo(() => List(sectionData), [sectionData]);

    const startRecording = useCallback(async (stream: MediaStream) => {
        const media = new MediaRecorder(stream!, { mimeType });
        mediaRecorder.current = media;
        mediaRecorder.current.start();
        let localAudioChunks: Blob[] = [];
        mediaRecorder.current.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
                localAudioChunks.push(event.data);
            }
        };
        setAudioChunks(localAudioChunks);
    }, [mediaRecorder, setAudioChunks]);

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.current) {
            mediaRecorder.current.stop();
            // TODO: try Whisper AI instead!!
            const audioBlob = new Blob(audioChunks, { type: mimeType });
        }
        mediaRecorder.current = undefined;
    }

    useEffect(() => {
        if (!transcript) {
            return;
        }
        if (transcript.includes('carrot')) {
            carrotReward();
        }
        if (transcript.includes('avocado')) {
            avocadoReward();
        }
        if (transcript.includes('lettuce')) {
            lettuceReward();
        }
        if (transcript.includes('eggplant')) {
            eggplantReward();
        }
        if (transcript.includes('broccoli')) {
            broccoliReward();
        }
    }, [transcript, listening]);

    const RecordButton = useMemo(() => {
        return (
            <div className="flex">
                <div className="relative">
                <button  onClick={toggleRecording} type="button" className={(listening ? "sm:animate-pulse " : "") + "bg-spilltRed"} style={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    width: '80px',
                    height: '80px',
                    borderRadius: '40px',
                    borderWidth: '4px',
                    borderColor: 'black'
                }}>
                    <span>
                    <span id="carrotReward" /><span id="broccoliReward" /><span id="lettuceReward" /><span id="eggplantReward" /><span id="avocadoReward" />
                    {/* {mediaRecorder.current &&
                        <LiveAudioVisualizer
                            barColor='black'
                            mediaRecorder={mediaRecorder.current}
                            width={'40px'}
                            height={'40px'}
                        />} */}
                    </span>
                    {isLoading ? LoadingView : <></>}
                </button>
                </div>
                </div>
        );
    }, [toggleRecording, listening, isLoading]);

    const MicElement = useMemo(() => {
    return (
    <div className="relative w-full h-full flex items-center justify-center">
        <div id="RecordButton" className="absolute px-1">
                {RecordButton}
        </div>
        <div id="ExplainerText" className="absolute left-1/2 transform translate-x-[50%] max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-xl px-1">
            <p className='font-PermanentMarker text-black whitespace-normal break-words'>Tap Me to {isRecording ? "Stop" : "Start"} Recording</p>
        </div>
        <Xarrow
            start="ExplainerText"
            end="RecordButton"
            strokeWidth={2}
            color="black"
        />
    </div>);
    }, [RecordButton]);


    return (
    <div style={{alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
        {MicElement}
        <br/>
        <div className='mt-6'>
            {ListSection} 
        </div>
    </div>
    );
}