import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Cookies from 'js-cookie';
import YouTubePlayer from 'youtube-player';
import './LessonPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchCourseLessons, 
    markLessonComplete,
    setCurrentLesson,
    checkCourseSubscription
} from '../../store/slices/lessonSlice';

const LessonPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user, loading: userLoading } = useUser();
    const [currentLesson, setCurrentLesson] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const playerRef = useRef(null);
    const playerContainerRef = useRef(null);
    const dispatch = useDispatch();
    
    // Redux selectors
    const { 
        sections, 
        currentLesson: reduxCurrentLesson, 
        completedLessons: reduxCompletedLessons,
        course,
        isSubscribed,
        loading: reduxLoading,
        error: reduxError
    } = useSelector(state => state.lessons);
    
console.log(isSubscribed);
    // Extract video ID from YouTube URL
    const getYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url?.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Initialize YouTube player
    useEffect(() => {
        if (currentLesson && playerContainerRef.current) {
            // Remove any previous iframe
            playerContainerRef.current.innerHTML = '';
            const videoId = getYouTubeId(currentLesson.videoUrl);
            if (videoId) {
                playerRef.current = YouTubePlayer(playerContainerRef.current, {
                    videoId,
                    playerVars: {
                        modestbranding: 1,
                        rel: 0,
                        showinfo: 0,
                        controls: 0,
                        disablekb: 1,
                    },
                });

                // Add event listeners
                playerRef.current.on('stateChange', (event) => {
                    // -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
                    if (event.data === 0) { // Video ended
                        if (currentLesson) {
                            setCompletedLessons(prev => [...prev, currentLesson._id]);
                            // TODO: Send completion to backend
                        }
                    }
                });
            }
        }
        // Cleanup
        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, [currentLesson]);

    // Fetch course data and check subscription using Redux
    useEffect(() => {
        if (!userLoading && courseId) {
            setLoading(true);
            // Fetch course lessons and check subscription in one Redux action
            dispatch(fetchCourseLessons(courseId))
                .then((result) => {
                    if (result.payload && result.payload.sections && result.payload.sections.length > 0) {
                        // Set first lesson as current by default
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

    const handlePlay = () => {
        if (playerRef.current) playerRef.current.playVideo();
    };

    const handlePause = () => {
        if (playerRef.current) playerRef.current.pauseVideo();
    };

    const handlePrev10 = async () => {
        if (playerRef.current) {
            const time = await playerRef.current.getCurrentTime();
            playerRef.current.seekTo(Math.max(0, time - 10), true);
        }
    };

    const handleNext10 = async () => {
        if (playerRef.current) {
            const time = await playerRef.current.getCurrentTime();
            playerRef.current.seekTo(time + 10, true);
        }
    };

    // Fullscreen handler
    const handleFullscreen = () => {
        if (playerContainerRef.current) {
            const iframe = playerContainerRef.current.querySelector('iframe');
            if (iframe) {
                if (iframe.requestFullscreen) {
                    iframe.requestFullscreen();
                } else if (iframe.webkitRequestFullscreen) {
                    iframe.webkitRequestFullscreen(); // Safari
                } else if (iframe.mozRequestFullScreen) {
                    iframe.mozRequestFullScreen(); // Firefox
                } else if (iframe.msRequestFullscreen) {
                    iframe.msRequestFullscreen(); // IE/Edge
                }
            }
        }
    };

    return (
        <div className="lesson-main-layout">
            <div className="lesson-left">
                <div className="lesson-video-container" style={{ position: 'relative' }}>
                    <div className="video-frame-wrapper" style={{ position: 'relative' }}>
                        <div ref={playerContainerRef} className="youtube-player"></div>
                        <div className="video-overlay"></div>
                    </div>
                    <div className="custom-controls">
                        <button onClick={handlePlay}>Play</button>
                        <button onClick={handlePause}>Pause</button>
                        <button onClick={handlePrev10}>-10s</button>
                        <button onClick={handleNext10}>+10s</button>
                        <button onClick={handleFullscreen}>Fullscreen</button>
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
                                            onClick={() => setCurrentLesson(lesson)}
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