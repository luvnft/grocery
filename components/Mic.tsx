'use client'
import 'regenerator-runtime/runtime'

import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useReward } from 'react-rewards';
import { LiveAudioVisualizer } from 'react-audio-visualize'
import List, { AisleData } from './List';
import getIngredients from '@/app/actions/getIngredients';
import sendList from '@/app/actions/sendList';
import loadingAnimation from "../animations/loading_animation.json";
import { useLottie } from 'lottie-react';
import Xarrow from 'react-xarrows';
import EmailConfirmationForm from './EmailConfirmForm';

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
    const { View: LoadingView } = useLottie(defaultAnimationOptions, {height: '100px', width: '100px'}); 
    const [isRecording, setIsRecording ] = useState(false);
    const [showEmailSuccess, setShowEmailSuccess] = useState(false);
    const { reward: carrotReward } = useReward('carrotReward', 'emoji', {emoji: ['🥕']});
    const { reward: broccoliReward } = useReward('broccoliReward', 'emoji', {emoji: ['🥦']});
    const { reward: eggplantReward } = useReward('eggplantReward', 'emoji', {emoji: ['🍆']});
    const { reward: lettuceReward } = useReward('lettuceReward', 'emoji', {emoji: ['🥬']});
    const { reward: avocadoReward } = useReward('avocadoReward', 'emoji', {emoji: ['🥑']});
    const [latestTranscript, setLatestTranscript] = useState('');

    const mediaRecorder = useRef<MediaRecorder | undefined>();
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [sectionData, setSectionData] = useState<AisleData[]>([

    ]);
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
            setIsLoading(true);
            await SpeechRecognition.stopListening();
            // stopRecording();
            let newSections = [];
            if (transcript && transcript.length > 2) {
                newSections = await getIngredients(sectionData, transcript);
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
        setIsLoading(false);
    }, [isRecording, setIsRecording, setSectionData, transcript]);

    const [showAuth, setShowAuth] = useState(false);
    const ListSection = useMemo(() => List(sectionData, setShowAuth), [sectionData, setShowAuth]);

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
        if (!transcript || !(transcript.length > 0)) {
            return;
        }
        const newMatches = (testString: string) => {
            const regex = new RegExp(testString, "g")
            const numNew = (transcript.match(regex) || []).length;
            const numOld = (latestTranscript.match(regex) || []).length;
            return numNew > numOld;
        }
        if (newMatches('carrot')) {
            carrotReward();
        }
        if (newMatches('avocado')) {
            avocadoReward();
        }
        if (newMatches('lettuce')) {
            lettuceReward();
        }
        if (newMatches('eggplant')) {
            eggplantReward();
        }
        if (newMatches('broccoli')) {
            broccoliReward();
        }
        setLatestTranscript(transcript);
    }, [transcript]);

    const micButtonClass = "bg-spilltRed w-20 h-20 border-4 border-black rounded-full";

    const RecordButton = useMemo(() => {
        return (
            <div className="flex">
                <div className="relative">
                <button  onClick={toggleRecording} type="button" className={micButtonClass + (isRecording ? " animate-pulse" : "")}>
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
                </button>
                </div>
                </div>
        );
    }, [toggleRecording, isRecording]);


    const MicElement = useMemo(() => {
    return (
    <div className="relative w-full h-full flex items-center justify-center">
        <div id="RecordButton" className="absolute px-1">
                {RecordButton}
        </div>
        <div id="LoadingAnimation" className={isLoading ? 'absolute px-1' : 'absolute px-1 hidden'}>
            {LoadingView}
        </div>
        <div id="ExplainerText" className="absolute left-1/2 transform translate-x-[50%] px-1 mr-[20%] md:mr-[25%]">
            <p className='font-PermanentMarker text-sm sm:text-md md:text-lg text-black whitespace-normal break-words'>{isLoading ? "LOADING " : ""}Tap Me to {isRecording ? "Stop" : "Start"} Recording</p>
        </div>
        <Xarrow
            start="ExplainerText"
            end="RecordButton"
            strokeWidth={2}
            color="black"
        />
    </div>);
    }, [RecordButton, isLoading, LoadingView]);

    const dismissAuthModal = useCallback(() => {
        setShowAuth(false);
    }, [setShowAuth, sectionData]);

    const confirmEmail = useCallback(async (email: string) => {
        console.log('we called confirm email!!!', email);
        const response = await sendList(email, sectionData);
        console.log('huh ok then', response);
        if (response) {
            setShowAuth(false);
            setShowEmailSuccess(true);
        } else {
            setShowAuth(false);
            alert("Sorry, something went wrong.");
        }
    }, [sectionData, setShowAuth, setShowEmailSuccess]);

    const dismissSuccessForm = useCallback(() => {
        setShowEmailSuccess(false);
    }, [setShowEmailSuccess]);

    const modalClass = "fixed inset-0 bg-spilltLightPurple z-50 flex flex-col justify-center items-center";
    const AuthForm = useMemo(() => {
        const className = (showAuth ? '': 'hidden ') + modalClass;
        return (
            <div className={className}>
                <EmailConfirmationForm
                    dismissModal={dismissAuthModal}
                    onEmailCofirm={confirmEmail}
                    isVisible={showAuth}
                />
            </div>
        )
    }, [showAuth, dismissAuthModal]);

    const EmailSuccessForm = useMemo(() => {
        const className = (showEmailSuccess ? '' : 'hidden ') + modalClass;
        return (
            <div className={className}>
                <div className={"flex flex-col justify-center items-center bg-spilltCreme p-6 rounded p-10 rounded-3xl"}>
                    <p className='font-PermanentMarker text-spilltNavy pb-4'>Great Success!</p>
                    <p className={"text-spilltNavy pb-4"}>Check your email for a link to confirm your account and complete sending the list.</p>
                    <button
                        className={"font-PermanentMarker text-spilltNavy border-2 border-spilltNavy bg-white py-1.5 px-4 rounded-full"}
                        onClick={dismissSuccessForm}>
                            Dismiss
                    </button>
                </div>
            </div>
        )
    }, [showEmailSuccess]);

    return (
    <div style={{alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
        {AuthForm}
        {EmailSuccessForm}
        {MicElement}
        <br/>
        <div className='mt-6'>
            {ListSection} 
        </div>
    </div>
    );
}