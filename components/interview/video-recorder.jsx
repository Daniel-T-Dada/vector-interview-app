'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import 'webrtc-adapter';
import { Video } from 'lucide-react';

export function VideoRecorder({ onRecorded }) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [playbackUrl, setPlaybackUrl] = useState(null);
    const [showPlayback, setShowPlayback] = useState(false);
    const [isPermissionDenied, setIsPermissionDenied] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [recordingStartTime, setRecordingStartTime] = useState(null);
    const [playbackError, setPlaybackError] = useState(null);
    
    const liveVideoRef = useRef(null);
    const playbackVideoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const chunksRef = useRef([]);
    const durationTimerRef = useRef(null);
    
    // Initialize camera access
    useEffect(() => {
        async function setupCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: true, 
                    audio: true 
                });
                
                if (liveVideoRef.current) {
                    liveVideoRef.current.srcObject = stream;
                }
                
                mediaStreamRef.current = stream;
                setIsPermissionDenied(false);
            } catch (err) {
                console.error("Error accessing camera:", err);
                setIsPermissionDenied(true);
            }
        }
        
        setupCamera();
        
        
        return () => {
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
            }
            if (durationTimerRef.current) {
                clearInterval(durationTimerRef.current);
            }
        };
    }, []);
    
    // Notify parent component when recorded blob changes
    useEffect(() => {
        if (onRecorded && recordedBlob) {
            onRecorded(recordedBlob);
        }
    }, [recordedBlob, onRecorded]);
    
    // Update recording duration display
    useEffect(() => {
        if (isRecording && recordingStartTime) {
            durationTimerRef.current = setInterval(() => {
                const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
                setRecordingDuration(elapsed);
            }, 1000);
        } else if (durationTimerRef.current) {
            clearInterval(durationTimerRef.current);
        }
        
        return () => {
            if (durationTimerRef.current) {
                clearInterval(durationTimerRef.current);
            }
        };
    }, [isRecording, recordingStartTime]);
    
    // Handle playback video loading
    useEffect(() => {
        if (showPlayback && playbackVideoRef.current && playbackUrl) {
            // Reset any previous playback state
            setPlaybackError(null);
            
            // Set up event listeners for debugging
            const handlePlaybackError = (e) => {
                console.error("Playback error:", e);
                setPlaybackError(`Error: ${e.target.error?.message || 'Unknown playback error'}`);
            };
            
            const handleLoadedData = () => {
                console.log("Video loaded successfully");
                playbackVideoRef.current.play().catch(e => {
                    console.error("Auto-play failed:", e);
                });
            };
            
            // Add event listeners
            playbackVideoRef.current.addEventListener('error', handlePlaybackError);
            playbackVideoRef.current.addEventListener('loadeddata', handleLoadedData);
            
            // Set the source (this is the important part)
            playbackVideoRef.current.src = playbackUrl;
            playbackVideoRef.current.load();
            
            // Cleanup
            return () => {
                if (playbackVideoRef.current) {
                    playbackVideoRef.current.removeEventListener('error', handlePlaybackError);
                    playbackVideoRef.current.removeEventListener('loadeddata', handleLoadedData);
                }
            };
        }
    }, [showPlayback, playbackUrl]);
    
    const startRecording = useCallback(() => {
        if (!mediaStreamRef.current) return;
        
        // Clear any previous recording data
        chunksRef.current = [];
        setRecordingStartTime(Date.now());
        setRecordingDuration(0);
        setPlaybackError(null);
        
        try {
            // Try with specific MIME type first
            mediaRecorderRef.current = new MediaRecorder(mediaStreamRef.current, {
                mimeType: 'video/webm;codecs=vp9,opus'
            });
            
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };
            
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                
                // Revoke any previous URL to avoid memory leaks
                if (playbackUrl) {
                    URL.revokeObjectURL(playbackUrl);
                }
                
                const url = URL.createObjectURL(blob);
                setRecordedBlob(blob);
                setPlaybackUrl(url);
                console.log("Recording completed, blob size:", blob.size, "URL:", url);
            };
            
            // Start recording with 1000ms timeslice for frequent ondataavailable events
            mediaRecorderRef.current.start(1000);
            setIsRecording(true);
        } catch (error) {
            console.error("Failed with vp9 codec, trying fallback:", error);
            
            try {
                // Fallback to default codec
                mediaRecorderRef.current = new MediaRecorder(mediaStreamRef.current);
                
                mediaRecorderRef.current.ondataavailable = (event) => {
                    if (event.data && event.data.size > 0) {
                        chunksRef.current.push(event.data);
                    }
                };
                
                mediaRecorderRef.current.onstop = () => {
                    const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                    
                    // Revoke any previous URL to avoid memory leaks
                    if (playbackUrl) {
                        URL.revokeObjectURL(playbackUrl);
                    }
                    
                    const url = URL.createObjectURL(blob);
                    setRecordedBlob(blob);
                    setPlaybackUrl(url);
                    console.log("Recording completed (fallback), blob size:", blob.size);
                };
                
                mediaRecorderRef.current.start(1000);
                setIsRecording(true);
            } catch (fallbackError) {
                console.error("All recording methods failed:", fallbackError);
            }
        }
    }, [playbackUrl]);
    
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setRecordingStartTime(null);
        }
    }, [isRecording]);
    
    const handlePlayback = useCallback(() => {
        if (playbackUrl) {
            // Important: Must prevent showing the playback video
            // until we switch to playback mode to avoid race conditions
            setShowPlayback(true);
        }
    }, [playbackUrl]);
    
    const handleReturnToCamera = useCallback(() => {
        // Stop the playback video to free resources
        if (playbackVideoRef.current) {
            playbackVideoRef.current.pause();
        }
        setShowPlayback(false);
    }, []);
    
    const handleRetake = useCallback(() => {
        if (playbackUrl) {
            URL.revokeObjectURL(playbackUrl);
        }
        
        // Stop the playback video if it's playing
        if (playbackVideoRef.current) {
            playbackVideoRef.current.pause();
        }
        
        setRecordedBlob(null);
        setPlaybackUrl(null);
        setShowPlayback(false);
        setRecordingDuration(0);
        setPlaybackError(null);
        
        if (onRecorded) {
            onRecorded(null);
        }
    }, [playbackUrl, onRecorded]);
    
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    if (isPermissionDenied) {
        return (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
                <p className="text-red-700 mb-2">Camera and microphone access denied</p>
                <p className="text-sm text-red-600">Please allow access to your camera and microphone to record your answer.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-4">
            {/* Video Display */}
            <div className="relative overflow-hidden rounded-lg bg-black">
                {!showPlayback ? (
                    // Live camera view
                    <video
                        ref={liveVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full aspect-video"
                    />
                ) : (
                    // Playback view - completely separate from the live video
                    <>
                        <video
                            ref={playbackVideoRef}
                            controls
                            autoPlay
                            className="w-full aspect-video"
                        />
                        {playbackError && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                                <div className="text-white text-center p-4">
                                    <p>Error playing back the video</p>
                                    <p className="text-xs mt-2">{playbackError}</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
                
                {isRecording && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse flex items-center">
                        <span className="mr-1">REC</span>
                        <span>{formatDuration(recordingDuration)}</span>
                    </div>
                )}
            </div>
            
            {/* Controls */}
            <div className="flex justify-between">
                {!recordedBlob ? (
                    // Recording controls
                    <div className="flex space-x-2">
                        {!isRecording ? (
                            <Button
                                onClick={startRecording}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Start Recording
                            </Button>
                        ) : (
                            <Button
                                onClick={stopRecording}
                                variant="outline"
                                className="border-red-500 text-red-500"
                            >
                                Stop Recording
                            </Button>
                        )}
                    </div>
                ) : (
                    // Playback controls
                    <div className="flex space-x-2">
                        {!showPlayback ? (
                            <Button
                                onClick={handlePlayback}
                                variant="outline"
                                className="flex items-center"
                            >
                                <Video className="h-4 w-4 mr-1" />
                                Play Video
                            </Button>
                        ) : (
                            <Button
                                onClick={handleReturnToCamera}
                                variant="outline"
                            >
                                Return to Camera
                            </Button>
                        )}
                        <Button
                            onClick={handleRetake}
                            variant="outline"
                            className="border-red-500 text-red-500"
                        >
                            Retake
                        </Button>
                    </div>
                )}
            </div>
            
            {/* Video information */}
            {recordedBlob && (
                <div className="text-xs text-gray-500 mt-2">
                    <p>Video Size: {Math.round(recordedBlob.size / 1024)} KB</p>
                    <p>Duration: {formatDuration(recordingDuration)}</p>
                </div>
            )}
        </div>
    );
} 