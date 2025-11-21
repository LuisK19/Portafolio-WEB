import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GithubOutlined, GlobalOutlined } from '@ant-design/icons';
import { useLanguage } from '../../contexts/LanguageContext';
import '/src/styles/academicWorks.css';



const AcademicWorksPage = () => {
    const { t } = useLanguage();
    const [academicWorks, setAcademicWorks] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedCourses, setExpandedCourses] = useState({});
    const [courseFilters, setCourseFilters] = useState({});
    const [globalFilters, setGlobalFilters] = useState({
        course: [],
        dateRange: { start: '', end: '' }
    });
    const [filterMenuExpanded, setFilterMenuExpanded] = useState(false);
    const [expandedFilters, setExpandedFilters] = useState({
        globalCourse: false,
        globalDate: false
    });
    const [expandedCourseFilters, setExpandedCourseFilters] = useState({});

    useEffect(() => {
        fetch('/Data/academicWorks.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar el archivo JSON');
                }
                return response.json();
            })
            .then(data => {
                setAcademicWorks(data);

                // Inicializar filtros para cada curso
                const initialCourseFilters = {};
                data.courses.forEach(course => {
                    initialCourseFilters[course.code] = {
                        type: [],
                        technology: []
                    };
                });
                setCourseFilters(initialCourseFilters);

                setLoading(false);
            })
            .catch(error => {
                console.error('Error loading academic works:', error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    const toggleCourse = (courseCode) => {
        setExpandedCourses(prev => ({
            ...prev,
            [courseCode]: !prev[courseCode]
        }));
    };

    const toggleFilterMenu = () => {
        setFilterMenuExpanded(!filterMenuExpanded);
    };

    const toggleGlobalFilter = (filterName) => {
        setExpandedFilters(prev => ({
            ...prev,
            [filterName]: !prev[filterName]
        }));
    };

    const toggleCourseFilter = (courseCode, filterName) => {
        const key = `${courseCode}-${filterName}`;
        setExpandedCourseFilters(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleGlobalFilterChange = (filterType, value) => {
        if (filterType === 'dateRange') {
            setGlobalFilters(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, ...value }
            }));
            return;
        }

        if (filterType === 'course') {
            setGlobalFilters(prev => {
                const currentFilters = [...prev.course];
                const index = currentFilters.indexOf(value);

                if (index > -1) {
                    currentFilters.splice(index, 1);
                } else {
                    currentFilters.push(value);
                }

                return {
                    ...prev,
                    course: currentFilters
                };
            });
            return;
        }
    };

    const handleCourseFilterChange = (courseCode, filterType, value) => {
        setCourseFilters(prev => {
            const currentFilters = [...prev[courseCode][filterType]];
            const index = currentFilters.indexOf(value);

            if (index > -1) {
                currentFilters.splice(index, 1);
            } else {
                currentFilters.push(value);
            }

            return {
                ...prev,
                [courseCode]: {
                    ...prev[courseCode],
                    [filterType]: currentFilters
                }
            };
        });
    };

    const getAvailableFiltersForCourse = (course) => {
        const types = new Set();
        const technologies = new Set();

        course.works.forEach(work => {
            types.add(work.type);
            work.technologies.forEach(tech => technologies.add(tech));
        });

        return {
            types: Array.from(types),
            technologies: Array.from(technologies)
        };
    };

    const filterWorks = (works, filters) => {
        return works.filter(work => {
            // Filtrar por tipo
            if (filters.type.length > 0 && !filters.type.includes(work.type)) {
                return false;
            }

            // Filtrar por tecnología
            if (filters.technology.length > 0 &&
                !work.technologies.some(tech => filters.technology.includes(tech))) {
                return false;
            }

            // Filtrar por fecha global
            if (globalFilters.dateRange.start && work.date < globalFilters.dateRange.start) {
                return false;
            }

            if (globalFilters.dateRange.end && work.date > globalFilters.dateRange.end) {
                return false;
            }

            return true;
        });
    };

    const filteredCourses = academicWorks ? academicWorks.courses.filter(course => {
        // Filtrar por curso (filtro global)
        if (globalFilters.course.length > 0 && !globalFilters.course.includes(course.code)) {
            return false;
        }
        return true;
    }) : [];

    if (loading) {
        return (
            <div className="works-page">
                <div className="container">
                    <div className="loading">{t('academicWorks.loading')}</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="works-page">
                <div className="container">
                    <div className="error">
                        <h2>{t('academicWorks.errorTitle')}</h2>
                        <p>{error}</p>
                        <Link to="/" className="back-btn">{t('academicWorks.backToPortfolio')}</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!academicWorks || !academicWorks.courses || academicWorks.courses.length === 0) {
        return (
            <div className="works-page">
                <div className="container">
                    <div className="no-data">
                        <h2>{t('academicWorks.noDataTitle')}</h2>
                        <Link to="/" className="back-btn">{t('academicWorks.backToPortfolio')}</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="works-page">
            <div className="container">
                <header className="works-header">
                    <h1>{t('academicWorks.title')}</h1>
                    <p>{t('academicWorks.description')}</p>
                </header>

                <div className="global-filters">

                    <div className="filter-row">
                        <div className="filter-group compact">
                            <div 
                                className="filter-header" 
                                onClick={() => toggleGlobalFilter('globalCourse')}
                            >
                                <h4>{t('academicWorks.filterByCourse')}</h4>
                                <span className={`filter-toggle-icon ${expandedFilters.globalCourse ? 'expanded' : ''}`}>
                                    ▼
                                </span>
                            </div>
                            <div className={`checkbox-list-wrapper ${expandedFilters.globalCourse ? 'expanded' : ''}`}>
                                <div className="checkbox-list">
                                    {academicWorks.courses.map(course => (
                                        <React.Fragment key={course.code}>
                                            <input
                                                id={`course-${course.code}`}
                                                className="inp-cbx"
                                                type="checkbox"
                                                checked={globalFilters.course.includes(course.code)}
                                                onChange={() => handleGlobalFilterChange('course', course.code)}
                                            />
                                            <label className="cbx" htmlFor={`course-${course.code}`}>
                                                <span>
                                                    <svg width="12px" height="10px" viewBox="0 0 12 10">
                                                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                                    </svg>
                                                </span>
                                                <span>{course.code}</span>
                                            </label>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="filter-group compact">
                            <div 
                                className="filter-header" 
                                onClick={() => toggleGlobalFilter('globalDate')}
                            >
                                <h4>{t('academicWorks.filterByDate')}</h4>
                                <span className={`filter-toggle-icon ${expandedFilters.globalDate ? 'expanded' : ''}`}>
                                    ▼
                                </span>
                            </div>
                            <div className={`checkbox-list-wrapper ${expandedFilters.globalDate ? 'expanded' : ''}`}>
                                <div className="date-filters compact">
                                    <label htmlFor="date-filter-start">
                                        {t('academicWorks.dateFrom')}:
                                        <input
                                            id="date-filter-start"
                                            type="date"
                                            value={globalFilters.dateRange.start}
                                            onChange={(e) => handleGlobalFilterChange('dateRange', { start: e.target.value })}
                                            aria-label="Fecha de inicio para filtrar trabajos"
                                        />
                                    </label>
                                    <label htmlFor="date-filter-end">
                                        {t('academicWorks.dateTo')}:
                                        <input
                                            id="date-filter-end"
                                            type="date"
                                            value={globalFilters.dateRange.end}
                                            onChange={(e) => handleGlobalFilterChange('dateRange', { end: e.target.value })}
                                            aria-label="Fecha de fin para filtrar trabajos"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="works-container">
                    {filteredCourses.map((course, index) => {
                        const availableFilters = getAvailableFiltersForCourse(course);
                        const filteredWorks = filterWorks(course.works, courseFilters[course.code] || { type: [], technology: [] });

                        if (filteredWorks.length === 0 &&
                            (courseFilters[course.code]?.type.length > 0 ||
                                courseFilters[course.code]?.technology.length > 0 ||
                                globalFilters.dateRange.start ||
                                globalFilters.dateRange.end)) {
                            return null;
                        }

                        return (
                            <div key={index} className="course-section">
                                <div className="course-header">
                                    <div className="course-info">
                                        <h3>{course.code} - {course.name}</h3>
                                        <p><strong>{t('academicWorks.semester')}:</strong> {course.semester}</p>
                                        <p className="course-desc">{course.description}</p>
                                    </div>

                                    <button
                                        className='toggle-works-btn'
                                        onClick={() => toggleCourse(course.code)}
                                        aria-expanded={expandedCourses[course.code]}
                                    >
                                        {expandedCourses[course.code] ? t('academicWorks.hideWorks') : t('academicWorks.showWorks')}
                                        <span>{expandedCourses[course.code] ? '▼' : '►'}</span>
                                    </button>
                                </div>

                                <div className={`course-content ${expandedCourses[course.code] ? 'expanded' : 'collapsed'}`}>
                                    <div className="course-filters">
                                        <div className="filter-group compact">
                                            <div 
                                                className="filter-header" 
                                                onClick={() => toggleCourseFilter(course.code, 'type')}
                                            >
                                                <h4>{t('academicWorks.filterByType')}</h4>
                                                <span className={`filter-toggle-icon ${expandedCourseFilters[`${course.code}-type`] ? 'expanded' : ''}`}>
                                                    ▼
                                                </span>
                                            </div>
                                            <div className={`checkbox-list-wrapper ${expandedCourseFilters[`${course.code}-type`] ? 'expanded' : ''}`}>
                                                <div className="checkbox-list">
                                                    {availableFilters.types.map(type => (
                                                        <React.Fragment key={type}>
                                                            <input
                                                                id={`type-${course.code}-${type}`}
                                                                className="inp-cbx"
                                                                type="checkbox"
                                                                checked={courseFilters[course.code]?.type.includes(type) || false}
                                                                onChange={() => handleCourseFilterChange(course.code, 'type', type)}
                                                            />
                                                            <label className="cbx" htmlFor={`type-${course.code}-${type}`}>
                                                                <span>
                                                                    <svg width="12px" height="10px" viewBox="0 0 12 10">
                                                                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                                                    </svg>
                                                                </span>
                                                                <span>{type}</span>
                                                            </label>
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="filter-group compact">
                                            <div 
                                                className="filter-header" 
                                                onClick={() => toggleCourseFilter(course.code, 'tech')}
                                            >
                                                <h4>{t('academicWorks.filterByTech')}</h4>
                                                <span className={`filter-toggle-icon ${expandedCourseFilters[`${course.code}-tech`] ? 'expanded' : ''}`}>
                                                    ▼
                                                </span>
                                            </div>
                                            <div className={`checkbox-list-wrapper ${expandedCourseFilters[`${course.code}-tech`] ? 'expanded' : ''}`}>
                                                <div className="checkbox-list">
                                                    {availableFilters.technologies.map(tech => (
                                                        <React.Fragment key={tech}>
                                                            <input
                                                                id={`tech-${course.code}-${tech}`}
                                                                className="inp-cbx"
                                                                type="checkbox"
                                                                checked={courseFilters[course.code]?.technology.includes(tech) || false}
                                                                onChange={() => handleCourseFilterChange(course.code, 'technology', tech)}
                                                            />
                                                            <label className="cbx" htmlFor={`tech-${course.code}-${tech}`}>
                                                                <span>
                                                                    <svg width="12px" height="10px" viewBox="0 0 12 10">
                                                                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                                                    </svg>
                                                                </span>
                                                                <span>{tech}</span>
                                                            </label>
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {filteredWorks.length > 0 ? (
                                        <div className="works-grid">
                                            {filteredWorks.map((work, workIndex) => (
                                                <div key={workIndex} className="work-card">
                                                    <div className="work-card-header">
                                                        <h4>{work.name}</h4>
                                                        <span className="work-type">{work.type}</span>
                                                    </div>
                                                    <p className="work-description">{work.description}</p>
                                                    <div className="work-details">
                                                        <p><strong>{t('academicWorks.date')}:</strong> {work.date}</p>
                                                        <p><strong>{t('academicWorks.technologies')}:</strong> {work.technologies.join(', ')}</p>
                                                    </div>
                                                    <div className="work-links">
                                                        {work.repoLink && work.repoLink !== '#' && (
                                                            <a
                                                                href={work.repoLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="work-link rounded-btn"
                                                            >
                                                                <GithubOutlined style={{ marginRight: '6px', fontSize: '18px' }} />{t('academicWorks.repository')}
                                                            </a>
                                                        )}
                                                        {work.demoLink && work.demoLink !== '#' && (
                                                            <a
                                                                href={work.demoLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="work-link rounded-btn"
                                                            >
                                                                <GlobalOutlined style={{ marginRight: '6px', fontSize: '18px' }} />{t('academicWorks.viewDemo')}
                                                            </a>
                                                        )}
                                                        {/* Mostrar nota si no hay links y existe note */}
                                                        {(!work.repoLink || work.repoLink === '#') && (!work.demoLink || work.demoLink === '#') && work.note && (
                                                            <div className="work-note">
                                                                <span>{work.note}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="no-works-message">
                                            <p>{t('academicWorks.noWorks')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <footer className="works-footer">
                    <p>{t('academicWorks.contactInfo')}</p>
                    <Link to="/" className="back-btn">{t('academicWorks.backToPortfolio')}</Link>
                </footer>
            </div>
        </div>
    );
};

export default AcademicWorksPage;