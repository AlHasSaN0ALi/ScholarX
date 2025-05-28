import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Cookies from 'js-cookie';
import './LessonPage.css';

const LessonPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user, loading: userLoading } = useUser();
    const [course, setCourse] = useState(null);
    const [sections, setSections] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);

    // Fetch course and lessons
    useEffect(() => {
        const fetchCourseAndLessons = async () => {
            try {
                setLoading(true);
                // Fetch course details (including sections and lessons)
                const courseRes = await fetch(`${import.meta.env.VITE_API_URL}/courses/${courseId}`);
                if (!courseRes.ok) throw new Error('Failed to fetch course');
                const courseData = await courseRes.json();
                setCourse(courseData.data.course);

                // Fetch lessons grouped by section
                const lessonsRes = await fetch(`${import.meta.env.VITE_API_URL}/lessons/courses/${courseId}/lessons`, {
                    headers: user ? { Authorization: `Bearer ${Cookies.get('token')}` } : {}
                });
                if (!lessonsRes.ok) throw new Error('Failed to fetch lessons');
                const lessonsData = await lessonsRes.json();
                console.log(lessonsData);
                
                // Group lessons by section (assuming lesson.section is available)
                const grouped = {};
                lessonsData.data.lessons.forEach(lesson => {
                    const sectionTitle = lesson.section || 'General';
                    if (!grouped[sectionTitle]) grouped[sectionTitle] = [];
                    grouped[sectionTitle].push(lesson);
                });
                const sectionArr = Object.entries(grouped).map(([title, lessons], idx) => ({
                    title,
                    lessons,
                    index: idx + 1
                }));
                setSections(sectionArr);
                // Set first lesson as current by default
                if (sectionArr.length && sectionArr[0].lessons.length) {
                    setCurrentLesson(sectionArr[0].lessons[0]);
                }
                // Check subscription
                if (user && courseData.data.course.subscriptions?.includes(user._id)) {
                    setIsSubscribed(true);
                }
                // TODO: Fetch completed lessons for progress (if available)
                setCompletedLessons([]); // Placeholder
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (!userLoading) fetchCourseAndLessons();
    }, [courseId, user, userLoading]);

    if (loading || userLoading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
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

    return (
        <div className="lesson-main-layout">
            <div className="lesson-left">
                <div className="lesson-video-container">
                    {currentLesson ? (
                        <iframe
                            src={currentLesson.videoUrl}
                            title={currentLesson.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div className="no-video">Select a lesson to start</div>
                    )}
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