import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Cookies from 'js-cookie';
import './LessonPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchCourseLessons, 
    markLessonComplete,
    setCurrentLesson,
    checkCourseSubscription
} from '../../store/slices/lessonSlice';
import overlayImage from '../../assets/images/background.png';

const LessonPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user, loading: userLoading } = useUser();
    const [currentLesson, setCurrentLesson] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const iframeRef = useRef(null);
    const videoContainerRef = useRef(null);
    const dispatch = useDispatch();
    // Restore lessons state from Redux
    const {
        sections,
        currentLesson: reduxCurrentLesson,
        completedLessons: reduxCompletedLessons,
        course,
        isSubscribed,
        loading: reduxLoading,
        error: reduxError
    } = useSelector(state => state.lessons);
    const playerRef = useRef(null); // Store YT.Player instance
    const [playerReady, setPlayerReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showPauseOverlay, setShowPauseOverlay] = useState(false);
    const [progressInterval, setProgressInterval] = useState(null);
    const videoFrameId = 'yt-player-frame';
    const [showLessonOverlay, setShowLessonOverlay] = useState(false);

    // Extract video ID from YouTube URL
    const getYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url?.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Load YouTube IFrame API
    useEffect(() => {
        if (window.YT && window.YT.Player) {
            return;
        }
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
    }, []);

    // Create YT.Player when API is ready and videoId is available
    useEffect(() => {
        const videoId = getYouTubeId(currentLesson?.videoUrl);
        if (!videoId) return;
        function onYouTubeIframeAPIReady() {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
            playerRef.current = new window.YT.Player(videoFrameId, {
                height: '360',
                width: '640',
                videoId: videoId,
                playerVars: {
                    autoplay: 1,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    rel: 0,
                    showinfo: 0,
                    modestbranding: 1,
                    iv_load_policy: 3,
                    playsinline: 1,
                    enablejsapi: 1,
                    origin: window.location.origin
                },
                events: {
                    onReady: (event) => {
                        setPlayerReady(true);
                        setDuration(event.target.getDuration());
                        setCurrentTime(event.target.getCurrentTime());
                        setIsPlaying(event.target.getPlayerState() === window.YT.PlayerState.PLAYING);
                    },
                    onStateChange: (event) => {
                        if (event.data === window.YT.PlayerState.PLAYING) {
                            setIsPlaying(true);
                            setShowPauseOverlay(false);
                        } else if (event.data === window.YT.PlayerState.PAUSED) {
                            setIsPlaying(false);
                            setShowPauseOverlay(true);
                        } else if (event.data === window.YT.PlayerState.ENDED) {
                            setIsPlaying(false);
                            setShowPauseOverlay(true);
                            if (currentLesson) {
                                setCompletedLessons(prev => [...prev, currentLesson._id]);
                                // TODO: Send completion to backend
                            }
                        }
                    },
                    onError: (event) => {
                        setError('YouTube Player Error: ' + event.data);
                    }
                }
            });
        }
        if (window.YT && window.YT.Player) {
            onYouTubeIframeAPIReady();
        } else {
            window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
        }
        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [currentLesson]);

    // Progress update interval
    useEffect(() => {
        if (playerReady && isPlaying && playerRef.current) {
            const interval = setInterval(() => {
                setCurrentTime(playerRef.current.getCurrentTime());
                setDuration(playerRef.current.getDuration());
            }, 200);
            setProgressInterval(interval);
            return () => clearInterval(interval);
        } else {
            if (progressInterval) clearInterval(progressInterval);
        }
    }, [playerReady, isPlaying]);

    // Reset player state when lesson changes
    useEffect(() => {
        setPlayerReady(false);
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        setShowPauseOverlay(false);
    }, [currentLesson]);

    // Fetch course data and check subscription using Redux
    useEffect(() => {
        if (!userLoading && courseId) {
            setLoading(true);
            dispatch(fetchCourseLessons(courseId))
                .then((result) => {
                    if (result.payload && result.payload.sections && result.payload.sections.length > 0) {
                        setCurrentLesson(result.payload.sections[0].lessons[0]);
                    }
                })
                .catch((error) => {
                    setError(error.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [dispatch, courseId, userLoading]);

    // Check subscription status
    useEffect(() => {
        if (user && courseId) {
            dispatch(checkCourseSubscription({ courseId, userId: user._id }));
        }
    }, [dispatch, courseId, user]);

    if (loading || userLoading || reduxLoading) return <div className="loading">Loading...</div>;
    if (error || reduxError) return <div className="error">{error || reduxError}</div>;
    
    if (!isSubscribed) {
        return (
            <div className="subscription-required">
                <h2>Subscription Required</h2>
                <p>You need to subscribe to this course to access its lessons.</p>
                <button className="btn btn-primary" onClick={() => navigate(`/courses/${courseId}`)}>View Course Details</button>
            </div>
        );
    }

    // Progress calculation
    const totalLessons = sections.reduce((acc, sec) => acc + sec.lessons.length, 0);
    const completedCount = completedLessons.length;
    const progress = totalLessons ? (completedCount / totalLessons) * 100 : 0;

    // Calculate current lesson number
    const getCurrentLessonNumber = () => {
        if (!currentLesson) return 0;
        let count = 0;
        for (const section of sections) {
            for (const lesson of section.lessons) {
                count++;
                if (lesson._id === currentLesson._id) {
                    return count;
                }
            }
        }
        return 0;
    };

    const handlePlayPause = () => {
        if (!playerRef.current) return;
        if (isPlaying) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    };

    const handleSeek = (amount) => {
        if (!playerRef.current) return;
        const newTime = Math.max(0, Math.min(duration, playerRef.current.getCurrentTime() + amount));
        playerRef.current.seekTo(newTime, true);
    };

    const handleProgressClick = (e) => {
        if (!playerRef.current) return;
        const bar = e.target.closest('.progress-container');
        if (!bar) return;
        const rect = bar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const newTime = pos * duration;
        playerRef.current.seekTo(newTime, true);
    };

    // Fullscreen handler
    const handleFullscreen = () => {
        const container = videoContainerRef.current;
        if (!container) return;
        if (!document.fullscreenElement) {
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.mozRequestFullScreen) {
                container.mozRequestFullScreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
            } else if (container.msRequestFullscreen) {
                container.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    // Format time for display
    const formatTime = (t) => {
        const m = Math.floor(t / 60);
        const s = Math.floor(t % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // The overlay should show if paused or if lesson overlay is active
    const showImageOverlay = showPauseOverlay || showLessonOverlay;

    // --- Render ---
    const videoId = getYouTubeId(currentLesson?.videoUrl);
    // Instead of iframe, render a div for the YT.Player
    return (
        <div className="lesson-main-layout">
            <div className="lesson-left">
                <div className="lesson-video-container" ref={videoContainerRef} style={{ position: 'relative', maxWidth: 800, margin: '0 auto', background: '#000', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 6px rgba(48, 5, 5, 0.1)' }}>
                    <div className="video-frame-wrapper" style={{ position: 'relative', width: '100%',  }}>
                        <div id={videoFrameId} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></div>
                        {showImageOverlay && (
                            <img
                                src={overlayImage}
                                alt="Overlay"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    zIndex: 15,
                                    pointerEvents: 'none'
                                }}
                            />
                        )}
                        <div className={`pause-overlay${showPauseOverlay ? ' active' : ''}`} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: '#000', zIndex: 5, opacity: showPauseOverlay ? 0.7 : 0, transition: 'opacity 0.3s', pointerEvents: 'none' }}></div>
                        <div className="protective-layer" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, cursor: 'pointer' }}></div>
                    </div>
                    <div className="controls" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', padding: 10, display: 'flex', alignItems: 'center', gap: 10, zIndex: 20 }}>
                        <button className="play-pause-btn" onClick={handlePlayPause} style={{ background: 'none', border: 'none', color: 'white', fontSize: 24, cursor: 'pointer', padding: '5px 10px' }}>{isPlaying ? '⏸' : '▶'}</button>
                        <button className="seek-btn" onClick={() => handleSeek(-10)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 18, cursor: 'pointer', padding: '5px 10px' }}>⏪</button>
                        <div className="progress-container" style={{ flexGrow: 1, height: 4, background: 'rgba(255,255,255,0.2)', position: 'relative', cursor: 'pointer' }} onClick={handleProgressClick}>
                            <div className="progress-bar" style={{ height: '100%', background: '#ff0000', width: duration ? `${(currentTime / duration) * 100}%` : '0', transition: 'width 0.1s linear' }}></div>
                        </div>
                        <button className="seek-btn" onClick={() => handleSeek(10)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 18, cursor: 'pointer', padding: '5px 10px' }}>+10</button>
                        <span className="time-display" style={{ color: 'white', fontSize: 14, margin: '0 10px' }}>{formatTime(currentTime)} / {formatTime(duration)}</span>
                        <button className="fullscreen-btn" title="Fullscreen" onClick={handleFullscreen} style={{ background: 'none', border: 'none', color: 'white', fontSize: 20, cursor: 'pointer', padding: '5px 10px' }}>⛶</button>
                    </div>
                </div>
                    <div className="lesson-title text-center">
                        {course?.title || 'Course'}
                        {currentLesson && (
                            <div className="lesson-subtitle">
                                {currentLesson.title} ({getCurrentLessonNumber()}/{totalLessons})
                            </div>
                        )}
                    </div>
            </div>
            <div className="lesson-right">
                <div className="lesson-sections-card">
                    <div className="lesson-sections-title">Course Sections</div>
                    <div className="lesson-sections-list">
                        {sections.map((section, sIdx) => (
                            <div className="lesson-section" key={section.title}>
                                <div className="lesson-section-title">
                                    {section.index}- {section.title}
                                </div>
                                <div className="lesson-section-lessons">
                                    {section.lessons.map((lesson, lIdx) => (
                                        <div
                                            key={lesson._id}
                                            className={`lesson-section-lesson${currentLesson && lesson._id === currentLesson._id ? ' active' : ''}`}
                                            onClick={() => {
                                                setCurrentLesson(lesson);
                                                setShowLessonOverlay(true);
                                                setTimeout(() => setShowLessonOverlay(false), 4000);
                                            }}
                                        >
                                            <span className="lesson-checkmark">
                                                {completedLessons.includes(lesson._id) ? '✔️' : ''}
                                            </span>
                                            <span className="lesson-section-lesson-title">{lesson.title}</span>
                                            <span className="lesson-section-lesson-duration">{lesson.duration ? lesson.duration.toFixed(2) : '00:00'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonPage; 