import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
    alert('¡Mensaje enviado! Te contactaré pronto.');
    
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <section id="contacto" className="section">
      <div className="container">
        <h2 className="section-title">Contacto</h2>
        <div className="contact-container">
          <div className="contact-info">
            <h3>Información de Contacto</h3>
            <p>Estoy interesado en oportunidades de colaboración o proyectos freelance.</p>
            <div className="contact-details">
              <div className="contact-item">
                <strong>Email:</strong>
                ltrejos@estudiantec.cr
              </div>
              <div className="contact-item">
                <strong>Teléfono:</strong> +506 8433-3757
              </div>
              <div className="contact-item">
                <strong>Ubicación:</strong> Costa Rica
              </div>
            </div>
            <div className="social-links">
              <a href="https://github.com/LuisK19" className="social-link" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a href="#" className="social-link">
                LinkedIn
              </a>
            </div>
          </div>
          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Nombre completo"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="subject"
                placeholder="Asunto"
                value={formData.subject}
                onChange={handleChange}
              />
              <textarea
                name="message"
                placeholder="Mensaje"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
              <button type="submit" className="btn btn-primary">
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;