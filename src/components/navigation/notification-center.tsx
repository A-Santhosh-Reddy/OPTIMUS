"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  CheckCheck,
  ShieldAlert,
  AlertTriangle,
  Info,
  ShieldCheck,
  ExternalLink,
  Flame,
  Volume2,
  VolumeX,
  Trash2,
  Radio,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  timestamp: string;
  read: boolean;
  type: "INCIDENT" | "THREAT_ANALYSIS" | "DEFENSE_SHIELD" | "SYSTEM";
  link?: string;
}

// Lightweight synth audio alert using Web Audio API (zero external mp3 assets needed)
function playSecurityChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch {
    // Audio context may be restricted by autoplay policy before user gesture
  }
}

export function NotificationCenter() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "critical">("all");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch real notifications on mount
  useEffect(() => {
    let isMounted = true;

    async function loadNotifications() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data.notifications)) {
            // Check localStorage for previously read IDs
            const readIds: string[] = JSON.parse(localStorage.getItem("optimus_read_notifs") || "[]");
            const processed = data.notifications.map((n: NotificationItem) => ({
              ...n,
              read: n.read || readIds.includes(n.id),
            }));
            setNotifications(processed);
          }
        }
      } catch (err) {
        console.warn("Failed to load notifications:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const hasCriticalUnread = notifications.some((n) => !n.read && n.severity === "CRITICAL");

  const markAsRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    const readIds: string[] = JSON.parse(localStorage.getItem("optimus_read_notifs") || "[]");
    if (!readIds.includes(id)) {
      readIds.push(id);
      localStorage.setItem("optimus_read_notifs", JSON.stringify(readIds));
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    const allIds = notifications.map((n) => n.id);
    localStorage.setItem("optimus_read_notifs", JSON.stringify(allIds));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.setItem("optimus_read_notifs", JSON.stringify([]));
  };

  const handleSimulateAlert = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "simulate",
          hostname: "secure-auth-login-verify.com",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.notification) {
          setNotifications((prev) => [data.notification, ...prev]);
          if (soundEnabled) {
            playSecurityChime();
          }
        }
      }
    } catch (err) {
      console.warn("Simulation failed:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleNotificationClick = (item: NotificationItem) => {
    markAsRead(item.id);
    setIsOpen(false);
    if (item.link) {
      router.push(item.link);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "critical") return n.severity === "CRITICAL" || n.severity === "HIGH";
    return true;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FF6474]/15 border border-[#FF6474]/40 text-[#FF6474] font-semibold flex items-center gap-1 shadow-sm">
            <Flame className="h-3 w-3 text-[#FF6474] animate-pulse" />
            CRITICAL
          </span>
        );
      case "HIGH":
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FFB454]/15 border border-[#FFB454]/40 text-[#FFB454] font-semibold flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-[#FFB454]" />
            HIGH
          </span>
        );
      case "MEDIUM":
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#F0D66B]/15 border border-[#F0D66B]/40 text-[#F0D66B] font-medium">
            MEDIUM
          </span>
        );
      case "LOW":
      case "INFO":
      default:
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#00DCC2]/15 border border-[#00DCC2]/40 text-[#00DCC2] font-medium flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-[#00DCC2]" />
            SEC-DEFENSE
          </span>
        );
    }
  };

  const formatTimeAgo = (isoString: string) => {
    try {
      const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
      if (diff < 60) return "Just now";
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* The Notification Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-xl border transition-all duration-200 cursor-pointer ${
          isOpen
            ? "bg-[#163632] border-[#00DCC2] text-[#00DCC2] shadow-[0_0_15px_rgba(0,220,194,0.3)]"
            : unreadCount > 0
            ? "bg-[#082E2B] border-[#28504A] hover:border-[#00DCC2]/60 text-[#E7F4F1] hover:text-[#00DCC2]"
            : "bg-[#082E2B] border-[#193E39] text-[#718C85] hover:text-[#E7F4F1] hover:border-[#28504A]"
        }`}
        title={`Security Notifications (${unreadCount} unread)`}
        aria-label="Open Security Notifications"
      >
        <Bell className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-12 text-[#00DCC2]" : ""}`} />

        {/* Dynamic Badge Counter */}
        {unreadCount > 0 && (
          <span
            className={`absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold font-mono border shadow-md transition-transform ${
              hasCriticalUnread
                ? "bg-[#FF6474] border-[#FF6474] text-white shadow-[0_0_10px_rgba(255,100,116,0.6)] animate-pulse"
                : "bg-[#00DCC2] border-[#00DCC2] text-[#031C1B] shadow-[0_0_8px_rgba(0,220,194,0.5)]"
            }`}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}

        {/* Ambient Radar Ping for Critical Alerts */}
        {hasCriticalUnread && (
          <span className="absolute -top-1 -right-1 h-[18px] w-[18px] rounded-full bg-[#FF6474]/40 animate-ping pointer-events-none" />
        )}
      </button>

      {/* Cyber Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[340px] sm:w-[410px] rounded-2xl bg-[#0B302D] border border-[#28504A] shadow-[0_15px_45px_rgba(3,28,27,0.95)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 border-b border-[#193E39] bg-[#082E2B] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-[#0B302D] border border-[#28504A] flex items-center justify-center text-[#00DCC2]">
                <Bell className="h-3.5 w-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-[#E7F4F1] tracking-wide flex items-center gap-1.5">
                  {t("topbar.notifications", "Security Notifications")}
                  {unreadCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#00DCC2]/20 text-[#00DCC2] font-mono border border-[#00DCC2]/30">
                      {unreadCount} new
                    </span>
                  )}
                </h3>
                <p className="text-[10px] text-[#718C85] font-mono">{t("topbar.notifSub", "Live SOC telemetry & incident feed")}</p>
              </div>
            </div>

            {/* Audio Toggle & Quick Actions */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-1.5 rounded-lg border text-xs transition-colors ${
                  soundEnabled
                    ? "bg-[#0B302D] border-[#28504A] text-[#00DCC2] hover:border-[#00DCC2]"
                    : "bg-[#082E2B] border-[#193E39] text-[#718C85] hover:text-[#A0B8B2]"
                }`}
                title={soundEnabled ? "Mute alert audio" : "Enable alert audio"}
              >
                {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              </button>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="px-2 py-1 rounded-lg border border-[#28504A] bg-[#082E2B] hover:bg-[#163632] hover:border-[#00DCC2]/40 text-[#A0B8B2] hover:text-[#00DCC2] text-[10px] font-mono font-medium flex items-center gap-1 transition-colors"
                  title="Mark all notifications as read"
                >
                  <CheckCheck className="h-3 w-3" />
                  {t("topbar.readAll", "Read All")}
                </button>
              )}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="px-3 py-2 border-b border-[#193E39] bg-[#062321] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`px-2 py-0.5 rounded-md text-[11px] transition-colors ${
                  filter === "all"
                    ? "bg-[#163632] text-[#00DCC2] border border-[#00DCC2]/40"
                    : "text-[#718C85] hover:text-[#E7F4F1]"
                }`}
              >
                {t("topbar.all", "All")} ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("unread")}
                className={`px-2 py-0.5 rounded-md text-[11px] transition-colors ${
                  filter === "unread"
                    ? "bg-[#163632] text-[#00DCC2] border border-[#00DCC2]/40"
                    : "text-[#718C85] hover:text-[#E7F4F1]"
                }`}
              >
                {t("topbar.unread", "Unread")} ({unreadCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter("critical")}
                className={`px-2 py-0.5 rounded-md text-[11px] transition-colors ${
                  filter === "critical"
                    ? "bg-[#FF6474]/20 text-[#FF6474] border border-[#FF6474]/40"
                    : "text-[#718C85] hover:text-[#E7F4F1]"
                }`}
              >
                {t("topbar.critical", "High/Critical")}
              </button>
            </div>

            {/* Live Test Alert Trigger */}
            <button
              type="button"
              disabled={isSimulating}
              onClick={handleSimulateAlert}
              className="text-[10px] text-[#00DCC2] hover:brightness-110 font-semibold flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#082E2B] border border-[#28504A] hover:border-[#00DCC2]/50 transition-all cursor-pointer disabled:opacity-50"
              title="Dispatches a live simulated threat detection alert to test real-time reception"
            >
              <Zap className="h-3 w-3 text-[#00DCC2]" />
              {isSimulating ? "Simulating..." : t("topbar.testAlert", "+ Test Alert")}
            </button>
          </div>

          {/* Notification List Body */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-[#193E39] custom-scrollbar">
            {isLoading ? (
              <div className="py-8 text-center text-xs text-[#718C85] font-mono">
                <Radio className="h-5 w-5 mx-auto mb-2 text-[#00DCC2] animate-spin" />
                Loading security telemetry...
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="py-10 text-center text-xs text-[#718C85] space-y-2">
                <ShieldCheck className="h-8 w-8 mx-auto text-[#45D6A0]" />
                <p className="font-semibold text-[#E7F4F1]">All Clear &bull; No Alerts</p>
                <p className="text-[11px] text-[#718C85] font-mono">
                  {filter === "unread"
                    ? "No unread alerts remaining."
                    : "Your monitored surface is currently free of active threats."}
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 transition-all cursor-pointer group flex items-start gap-3 relative ${
                    item.read
                      ? "bg-transparent hover:bg-[#163632]/40 text-[#718C85]"
                      : "bg-[#112624] hover:bg-[#163632] text-[#E7F4F1] border-l-2 border-l-[#00DCC2]"
                  }`}
                >
                  {/* Left Icon */}
                  <div className="mt-0.5 shrink-0">
                    {item.severity === "CRITICAL" ? (
                      <div className="h-7 w-7 rounded-lg bg-[#FF6474]/15 border border-[#FF6474]/40 flex items-center justify-center text-[#FF6474]">
                        <Flame className="h-3.5 w-3.5" />
                      </div>
                    ) : item.severity === "HIGH" ? (
                      <div className="h-7 w-7 rounded-lg bg-[#FFB454]/15 border border-[#FFB454]/40 flex items-center justify-center text-[#FFB454]">
                        <AlertTriangle className="h-3.5 w-3.5" />
                      </div>
                    ) : (
                      <div className="h-7 w-7 rounded-lg bg-[#00DCC2]/15 border border-[#00DCC2]/40 flex items-center justify-center text-[#00DCC2]">
                        <ShieldAlert className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs font-semibold text-[#E7F4F1] group-hover:text-[#00DCC2] transition-colors">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-[#718C85] font-mono whitespace-nowrap">
                        {formatTimeAgo(item.timestamp)}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#A0B8B2] leading-relaxed line-clamp-2">
                      {item.message}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <div>{getSeverityBadge(item.severity)}</div>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        {!item.read && (
                          <button
                            type="button"
                            onClick={(e) => markAsRead(item.id, e)}
                            className="text-[10px] text-[#718C85] hover:text-[#45D6A0] p-1 rounded hover:bg-[#163632] transition-colors"
                            title="Mark as read"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <span className="text-[10px] font-mono text-[#00DCC2] flex items-center gap-0.5">
                          {t("topbar.inspect", "Inspect")}
                          <ExternalLink className="h-2.5 w-2.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-[#082E2B] border-t border-[#193E39] flex items-center justify-between text-[11px] font-mono text-[#718C85]">
            <span className="flex items-center gap-1.5 text-[10px] text-[#718C85]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#45D6A0] animate-pulse" />
              Live Defense Feed
            </span>

            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllNotifications}
                  className="text-[10px] text-[#718C85] hover:text-[#FF6474] transition-colors flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  {t("topbar.clearList", "Clear List")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
