import React from 'react';
import {
  GithubOutlined,
  LinkedinOutlined,
  MailOutlined,
  TwitterOutlined,
  InstagramOutlined,
  FacebookOutlined,
  GlobalOutlined
} from '@ant-design/icons';

const SocialLinks = ({ personalInfo, variant = 'default' }) => {
  if (!personalInfo || !personalInfo.socialLinks) {
    return (
      <div className='social-container'>
        <div className="social-links">
          <p>Cargando enlaces sociales...</p>
        </div>
      </div>
    );
  }
  
  const getSocialIcon = (iconName) => {
    const iconProps = { className: "social-ant-icon" };
    
    switch (iconName) {
      case 'github': return <GithubOutlined {...iconProps} />;
      case 'linkedin': return <LinkedinOutlined {...iconProps} />;
      case 'email': return <MailOutlined {...iconProps} />;
      case 'twitter': return <TwitterOutlined {...iconProps} />;
      case 'instagram': return <InstagramOutlined {...iconProps} />;
      case 'facebook': return <FacebookOutlined {...iconProps} />;
      case 'website': return <GlobalOutlined {...iconProps} />;
      default: return <span {...iconProps}>🔗</span>;
    }
  };

  const containerClass = variant === 'minimal' 
    ? 'social-links-minimal' 
    : 'social-links';

  return (
    <div className='social-container'>
      <div className={containerClass}>
        {personalInfo.socialLinks.map((social, index) => (
          <a
            key={index}
            href={social.url}
            className={`social-link ${variant === 'minimal' ? 'social-link-minimal' : ''}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
          >
            {getSocialIcon(social.icon)}
            {variant !== 'minimal' && <span className="social-text">{social.name}</span>}
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialLinks;