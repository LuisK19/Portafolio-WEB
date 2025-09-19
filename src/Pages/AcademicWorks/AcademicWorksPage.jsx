import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AcademicWorksPage = () => {
    const [academicWorks, setAcademicWorks] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

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
                setLoading(false);
            })
            .catch(error => {
                console.error('Error loading academic works:', error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    const toggleWorksList = () => {
        setIsExpanded(!isExpanded);
    };

    const categories = [
        { id: 'all', name: 'Todas' },
        { id: 'alura', name: 'Alura Latam' },
        { id: 'ina', name: 'INA' },
        { id: 'tec', name: 'TEC' },
        { id: 'mejores', name: 'Mejores Costa Rica' }
    ];


    // ✅ Mostrar estado de carga
    if (loading) {
        return (
            <div className="works-page">
                <div className="container">
                    <div className="loading">Cargando trabajos académicos...</div>
                </div>
            </div>
        );
    }

    // ✅ Mostrar error si ocurrió
    if (error) {
        return (
            <div className="works-page">
                <div className="container">
                    <div className="error">
                        <h2>Error al cargar los datos</h2>
                        <p>{error}</p>
                        <Link to="/" className="back-btn">← Volver al Portafolio</Link>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ Verificar que academicWorks tiene cursos
    if (!academicWorks || !academicWorks.courses || academicWorks.courses.length === 0) {
        return (
            <div className="works-page">
                <div className="container">
                    <div className="no-data">
                        <h2>No hay trabajos académicos disponibles</h2>
                        <Link to="/" className="back-btn">← Volver al Portafolio</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="works-page">
            <div className="container">
                <header className="works-header">
                    <h1>Mis Trabajos Académicos</h1>
                    <p>Documentación oficial de mis trabajos académicos y proyectos realizados</p>
                </header>

                <div className="filters">
                    <p>Filtrar por categoría:</p>
                    {categories.map(category => (
                        <button
                            key={category.id}
                            className={'filter-btn'}
                        >
                            {category.name}
                        </button>
                    ))}

                    

                    <p>Filtros: por año, por codigo de clase, talvez por medio de checkbox y un textflield</p>


                    <p>arreglar el hecho que el boton de abrir los trabajos del curso abre todos los cursos...</p>


                </div>


                <div className="works-container">
                    {academicWorks.courses.map((course, index) => (
                        <div key={index} className="course-section">
                            <h3>{course.code} - {course.name}</h3>
                            <p><strong>Semestre:</strong> {course.semester}</p>
                            <p>{course.description}</p>

                            <button
                                className='toggle-works-btn'
                                onClick={toggleWorksList}
                                aria-expanded={isExpanded}
                            >
                                {isExpanded ? 'Ocultar trabajos' : 'Mostrar trabajos'}
                                <span>{isExpanded ? '▼' : '►'}</span>
                            </button>

                            <div className={`works-list ${isExpanded ? 'expanded' : 'collapsed'}`}>

                                {course.works.map((work, workIndex) => (
                                    <div key={workIndex} className="work-card">
                                        <h4>{work.name}</h4>
                                        <p><strong>Tipo:</strong> {work.type}</p>
                                        <p>{work.description}</p>
                                        <p><strong>Fecha:</strong> {work.date}</p>
                                        <p><strong>Tecnologías:</strong> {work.technologies.join(', ')}</p>
                                        <div className="work-links">
                                            {work.repoLink && work.repoLink !== '#' && (
                                                <a href={work.repoLink} target="_blank" rel="noopener noreferrer" className="work-link">
                                                    📁 Repositorio
                                                </a>
                                            )}
                                            {work.demoLink && work.demoLink !== '#' && (
                                                <a href={work.demoLink} target="_blank" rel="noopener noreferrer" className="work-link">
                                                    🌐 Ver Demo
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}


                </div>

                <footer className="works-footer">
                    <p>Para más información sobre estos trabajos, contáctame directamente.</p>
                    <Link to="/" className="back-btn">← Volver al Portafolio</Link>
                </footer>
            </div>
        </div>
    );
};

export default AcademicWorksPage;