import React from 'react';
import { Mail, Globe, ExternalLink, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: 'rgba(7, 9, 14, 0.95)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--border-glass)',
      padding: '32px 24px',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        textAlign: 'center'
      }}>
        {/* Creator Info Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-glass)',
          padding: '16px 24px',
          borderRadius: '20px',
          boxShadow: '0 0 25px rgba(0, 240, 255, 0.1)',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <img
            src="/oviveko_logo.png"
            alt="OVIVEKO Logo"
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              border: '2px solid #00f0ff',
              boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)',
              objectFit: 'cover'
            }}
          />

          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', margin: 0 }}>
                OVIVEKO
              </h3>
              <span style={{
                background: 'linear-gradient(135deg, #00f0ff, #7000ff)',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 900,
                padding: '2px 8px',
                borderRadius: '10px',
                textTransform: 'uppercase'
              }}>
                Creator & Developer
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
              Building ultimate tools for Palworld streamers, gamers, and content creators.
            </p>
          </div>
        </div>

        {/* Social Links Row */}
        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* Work Email */}
          <a
            href="mailto:workforoviveko@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            style={socialBtnStyle('#ff2a6d')}
          >
            <Mail size={16} /> workforoviveko@gmail.com
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/oviveko-dev"
            target="_blank"
            rel="noopener noreferrer"
            style={socialBtnStyle('#00f0ff')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
              <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
            GitHub (oviveko-dev)
          </a>

          {/* X (Twitter) */}
          <a
            href="https://x.com/OVIVEKO"
            target="_blank"
            rel="noopener noreferrer"
            style={socialBtnStyle('#e040fb')}
          >
            <span style={{ fontWeight: 900, fontSize: '0.9rem' }}>𝕏</span> @OVIVEKO
          </a>

          {/* YouTube */}
          <a
            href="https://www.youtube.com/@oviveko"
            target="_blank"
            rel="noopener noreferrer"
            style={socialBtnStyle('#ff0000')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            YouTube (@oviveko)
          </a>
        </div>

        <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '8px' }}>
          PALWORLD CHALLENGE HUB &copy; {new Date().getFullYear()} &bull; Created by <strong style={{ color: '#00f0ff' }}>OVIVEKO</strong>
        </div>
      </div>
    </footer>
  );
}

const socialBtnStyle = (color) => ({
  background: 'rgba(255, 255, 255, 0.04)',
  border: `1px solid ${color}44`,
  color: '#fff',
  padding: '8px 16px',
  borderRadius: '12px',
  textDecoration: 'none',
  fontSize: '0.85rem',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'all 0.2s ease'
});
