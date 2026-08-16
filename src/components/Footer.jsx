import React from 'react';
import { Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: 'rgba(7, 9, 14, 0.95)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--border-glass)',
      padding: '40px 24px',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '850px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        textAlign: 'center'
      }}>
        {/* Header & Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <img
            src="/oviveko_logo.png"
            alt="OVIVEKO Logo"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              border: '2px solid #00f0ff',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
              objectFit: 'cover'
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '0.05em' }}>
              OVIVEKO
            </h3>
            <span style={{
              background: 'linear-gradient(135deg, #00f0ff 0%, #7000ff 100%)',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 900,
              padding: '3px 10px',
              borderRadius: '12px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}>
              CREATOR & DEVELOPER
            </span>
          </div>

          <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: 0, maxWidth: '600px', fontWeight: 500 }}>
            Building ultimate tools for Palworld streamers, gamers, and content creators.
          </p>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--border-glass), transparent)' }} />

        {/* Social Links Row */}
        <div style={{
          display: 'flex',
          gap: '14px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* Work with me */}
          <a
            href="mailto:workforoviveko@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            style={socialBtnStyle('#ff2a6d')}
          >
            <Mail size={16} color="#ff2a6d" /> ✉ Work with me
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/oviveko-dev"
            target="_blank"
            rel="noopener noreferrer"
            style={socialBtnStyle('#00f0ff')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
              <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
            GitHub
          </a>

          {/* X */}
          <a
            href="https://x.com/OVIVEKO"
            target="_blank"
            rel="noopener noreferrer"
            style={socialBtnStyle('#e040fb')}
          >
            <span style={{ fontWeight: 900, fontSize: '0.9rem', color: '#e040fb' }}>𝕏</span> X
          </a>

          {/* YouTube */}
          <a
            href="https://www.youtube.com/@oviveko"
            target="_blank"
            rel="noopener noreferrer"
            style={socialBtnStyle('#ff0000')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff0000">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            YouTube
          </a>
        </div>

        {/* Heartfelt Community Note Card */}
        <div className="glass-panel" style={{
          padding: '24px',
          maxWidth: '680px',
          width: '100%',
          background: 'rgba(13, 18, 29, 0.7)',
          border: '1px solid rgba(0, 240, 255, 0.2)',
          borderRadius: '16px',
          boxShadow: '0 0 30px rgba(0, 240, 255, 0.05)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '1rem',
            fontWeight: 800,
            color: '#ffd166',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            🐾 From one Palworld fan to another.
          </div>
          <p style={{
            fontSize: '0.9rem',
            color: '#cbd5e1',
            lineHeight: 1.6,
            margin: 0,
            fontWeight: 400
          }}>
            I built Palworld Challenge Hub because I genuinely love this game and wanted to create something fun and useful for the community.
            <br /><br />
            Whether you're a streamer, content creator, challenge-run addict, or just another fan of Pals, I hope you have fun with it.
          </p>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--border-glass), transparent)' }} />

        {/* Bottom Copyright */}
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '0.05em' }}>
            PALWORLD CHALLENGE HUB &copy; 2026
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            Created with <Heart size={14} color="#ff2a6d" fill="#ff2a6d" /> by <strong style={{ color: '#00f0ff' }}>OVIVEKO</strong>
          </div>
        </div>
      </div>
    </footer>
  );
}

const socialBtnStyle = (color) => ({
  background: 'rgba(255, 255, 255, 0.04)',
  border: `1px solid ${color}55`,
  color: '#f1f5f9',
  padding: '10px 20px',
  borderRadius: '12px',
  textDecoration: 'none',
  fontSize: '0.9rem',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'all 0.2s ease',
  boxShadow: `0 0 10px ${color}15`
});
