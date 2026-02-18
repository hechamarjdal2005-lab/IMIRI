import React from 'react';
import { MessageCircle } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants';

const FloatingWhatsApp: React.FC = () => {
  const handleClick = () => {
    window.open(`https://wa.me/${SOCIAL_LINKS.whatsapp.replace('+', '')}`, '_blank');
  };

  return (
    <>
      <style>{`
        .fwa-btn {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 100;
          width: 52px;
          height: 52px;
          background: #c9a84c;
          color: #0a1f0e;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
          box-shadow: 0 8px 28px rgba(201,168,76,0.35);
          transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .fwa-btn:hover {
          background: #d4b560;
          transform: translateY(-3px);
          box-shadow: 0 14px 40px rgba(201,168,76,0.45);
        }
        .fwa-btn:active {
          transform: translateY(0) scale(0.97);
        }

        /* Pulse ring */
        .fwa-ring {
          position: absolute;
          inset: -6px;
          border: 1px solid rgba(201,168,76,0.4);
          clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
          animation: fwaPulse 2.2s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes fwaPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 0;   transform: scale(1.12); }
        }

        /* Tooltip */
        .fwa-tooltip {
          position: absolute;
          right: calc(100% + 14px);
          top: 50%;
          transform: translateY(-50%) translateX(6px);
          background: rgba(10,31,14,0.97);
          border: 1px solid rgba(201,168,76,0.25);
          color: rgba(255,255,255,0.85);
          padding: 8px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s ease, transform 0.25s ease;
          backdrop-filter: blur(12px);
        }
        /* Arrow */
        .fwa-tooltip::after {
          content: '';
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 6px solid transparent;
          border-left-color: rgba(201,168,76,0.25);
        }
        .fwa-tooltip::before {
          content: '';
          position: absolute;
          left: calc(100% - 1px);
          top: 50%;
          transform: translateY(-50%);
          border: 6px solid transparent;
          border-left-color: rgba(10,31,14,0.97);
          z-index: 1;
        }

        .fwa-btn:hover .fwa-tooltip {
          opacity: 1;
          transform: translateY(-50%) translateX(0);
        }

        @media (max-width: 768px) {
          .fwa-tooltip { display: none; }
        }
      `}</style>

      <button
        className="fwa-btn"
        onClick={handleClick}
        aria-label="Contact us on WhatsApp"
      >
        <div className="fwa-ring" />
        <MessageCircle size={22} strokeWidth={1.8} />

        <span className="fwa-tooltip">
          Chat with us
        </span>
      </button>
    </>
  );
};

export default FloatingWhatsApp;