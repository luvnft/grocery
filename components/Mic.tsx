'use client'
import 'regenerator-runtime/runtime'

import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useReward } from 'react-rewards';
import { LiveAudioVisualizer } from 'react-audio-visualize'

import List, { AisleData } from './List';
import getIngredients from '@/app/actions/getIngredients';

const mimeType = "audio/webm";

export default function Mic() {
    const {
        transcript,
        listening,
        resetTranscript,
      } = useSpeechRecognition();
    const [isRecording, setIsRecording ] = useState(false);
    const { reward: carrotReward } = useReward('carrotReward', 'emoji', {emoji: ['🥕']});
    const { reward: broccoliReward } = useReward('broccoliReward', 'emoji', {emoji: ['🥦']});
    const { reward: eggplantReward } = useReward('eggplantReward', 'emoji', {emoji: ['🍆']});
    const { reward: lettuceReward } = useReward('lettuceReward', 'emoji', {emoji: ['🥬']});
    const { reward: avocadoReward } = useReward('avocadoReward', 'emoji', {emoji: ['🥑']});
    

    const mediaRecorder = useRef<MediaRecorder | undefined>();
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [sectionData, setSectionData] = useState<AisleData[]>();

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
        if (isRecording) {
            SpeechRecognition.stopListening();
            stopRecording();
            let newSections = [];
            if (transcript.length > 2) {
                newSections = await getIngredients(transcript);
                if (newSections.aisles) {
                    setSectionData(newSections.aisles);
                    resetTranscript();
                } else {
                    alert("Sorry, something went wrong.");
                    setSectionData([]);
                }
            }  else {
                alert("Sorry, we couldn't quite hear that. Please try again.");
            }
        } else {
            SpeechRecognition.startListening({continuous: true});
            let stream = await getStream();
            if (stream) {
                startRecording(stream);
            }
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


    return (
    <div style={{alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
        <div>
            <button  onClick={toggleRecording} type="button" className="record_button" style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                backgroundColor: '#700b0b',
                borderRadius: '40px',
            }}>
                <span>
                <span id="carrotReward" /><span id="broccoliReward" /><span id="lettuceReward" /><span id="eggplantReward" /><span id="avocadoReward" />
                {mediaRecorder.current ? (
                    <LiveAudioVisualizer
                        barColor='#ab1515'
                        mediaRecorder={mediaRecorder.current}
                        width={'40px'}
                        height={'40px'}
                    />
                ) : (<div style={{backgroundColor: '#ab1515', height: '60px', width: '60px', borderRadius: '30px'}}/>)}
                </span>
            </button>
            <br/>
        </div>
            {ListSection}
            
    </div>
    );
}