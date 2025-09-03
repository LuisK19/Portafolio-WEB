const Recommendations = () => {
    return (
        <section id="recomendaciones" className="section">
            <div className="container">
                <h2 className="section-title">Recomendaciones</h2>
                <div className="recommendations-container">
                    <div className="recommendation-card">
                        <h3>Juan Pérez</h3>
                        <p>Desarrollador en XYZ Corp</p>
                        <p>"Luis es un excelente profesional, siempre entrega a tiempo y con calidad."</p>
                    </div>
                    <div className="recommendation-card">
                        <h3>María López</h3>
                        <p>Diseñadora en ABC Ltda</p>
                        <p>"Su creatividad y atención al detalle son impresionantes."</p>
                    </div>
                    <div className="recommendation-card">
                        <h3>Carlos García</h3>
                        <p>Gerente en 123 S.A.</p>
                        <p>"Recomiendo a Luis sin dudarlo, es un gran colaborador."</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Recommendations;
