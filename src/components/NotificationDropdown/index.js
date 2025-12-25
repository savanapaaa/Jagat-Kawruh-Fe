import React, { useState, useEffect, useRef } from 'react';
import './NotificationDropdown.css';

const NotificationDropdown = ({ userEmail }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadNotifications();
  }, [userEmail]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const loadNotifications = () => {
    const stored = localStorage.getItem('jagat_kawruh_notifikasi');
    if (stored) {
      const allNotifs = JSON.parse(stored);
      const userNotifs = allNotifs.filter(n => n.targetUser === userEmail);
      setNotifications(userNotifs.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)));
    }
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.isRead).length;
  };

  const markAsRead = (id) => {
    const stored = localStorage.getItem('jagat_kawruh_notifikasi');
    if (stored) {
      const allNotifs = JSON.parse(stored);
      const updated = allNotifs.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      );
      localStorage.setItem('jagat_kawruh_notifikasi', JSON.stringify(updated));
      loadNotifications();
    }
  };

  const markAllAsRead = () => {
    const stored = localStorage.getItem('jagat_kawruh_notifikasi');
    if (stored) {
      const allNotifs = JSON.parse(stored);
      const updated = allNotifs.map(n => 
        n.targetUser === userEmail ? { ...n, isRead: true } : n
      );
      localStorage.setItem('jagat_kawruh_notifikasi', JSON.stringify(updated));
      loadNotifications();
    }
  };

  const deleteNotification = (id) => {
    const stored = localStorage.getItem('jagat_kawruh_notifikasi');
    if (stored) {
      const allNotifs = JSON.parse(stored);
      const filtered = allNotifs.filter(n => n.id !== id);
      localStorage.setItem('jagat_kawruh_notifikasi', JSON.stringify(filtered));
      loadNotifications();
    }
  };

  const getNotificationIcon = (tipe) => {
    switch (tipe) {
      case 'materi': return '📚';
      case 'kuis': return '📝';
      case 'nilai': return '🎯';
      case 'pbl': return '🎓';
      case 'guru': return '👨‍🏫';
      case 'info': return 'ℹ️';
      default: return '🔔';
    }
  };

  const formatTanggal = (tanggal) => {
    const date = new Date(tanggal);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Baru saja';
    if (hours < 24) return `${hours} jam yang lalu`;
    if (days < 7) return `${days} hari yang lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="notification-wrapper" ref={dropdownRef}>
      <button className="notif-btn" onClick={() => setIsOpen(!isOpen)}>
        🔔
        {getUnreadCount() > 0 && (
          <span className="notif-badge">{getUnreadCount()}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notif-header">
            <h3>Notifikasi</h3>
            {notifications.length > 0 && getUnreadCount() > 0 && (
              <button className="mark-all-btn" onClick={markAllAsRead}>
                Tandai Semua
              </button>
            )}
          </div>

          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">
                <span className="empty-icon">🔕</span>
                <p>Tidak ada notifikasi</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div 
                  key={notif.id} 
                  className={`notif-item ${!notif.isRead ? 'unread' : ''}`}
                  onClick={() => !notif.isRead && markAsRead(notif.id)}
                >
                  <div className="notif-icon">
                    {getNotificationIcon(notif.tipe)}
                  </div>
                  <div className="notif-content">
                    <div className="notif-title">{notif.judul}</div>
                    <div className="notif-message">{notif.pesan}</div>
                    <div className="notif-time">{formatTanggal(notif.tanggal)}</div>
                  </div>
                  <button 
                    className="notif-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notif-footer">
              <button onClick={() => setIsOpen(false)}>Tutup</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
