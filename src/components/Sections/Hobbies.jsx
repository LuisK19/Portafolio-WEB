import React from 'react';

const Hobbies = () => {
  const hobbiesData = [
    {
      icon: "🎮",
      title: "Videojuegos",
      description: "Disfruto de juegos de estrategia y aventuras."
    },
    {
      icon: "📚",
      title: "Lectura",
      description: "Me apasiona la lectura de ciencia ficción y libros técnicos."
    },
    {
      icon: "🎸",
      title: "Música",
      description: "Toco la guitarra y disfruto de diversos géneros musicales."
    }
  ];

  return (
    <section id="hobbies" className="section">
      <div className="container">
        <h2 className="section-title">Hobbies e Intereses</h2>
        <div className="hobbies-container">
          {hobbiesData.map((hobby, index) => (
            <div key={index} className="hobby-card">
              <div className="hobby-icon">{hobby.icon}</div>
              <h3>{hobby.title}</h3>
              <p>{hobby.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hobbies;