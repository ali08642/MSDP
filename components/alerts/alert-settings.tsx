"use client"

import { useState } from "react"

export default function AlertSettings() {
  const [settings, setSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    inAppAlerts: true,
    level1: false,
    level2: false,
    level3: true,
    level4: true,
    level5: true,
  })

  const handleChange = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-4">Notification Channels</h3>
        <div className="space-y-3">
          {[
            { key: "emailAlerts", label: "Email Notifications", desc: "Receive alerts via email" },
            { key: "smsAlerts", label: "SMS Notifications", desc: "Receive alerts via SMS (recommended for critical)" },
            { key: "inAppAlerts", label: "In-App Notifications", desc: "See alerts in dashboard" },
          ].map((option) => (
            <label
              key={option.key}
              className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={settings[option.key as keyof typeof settings] as boolean}
                onChange={() => handleChange(option.key)}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-medium text-foreground">{option.label}</p>
                <p className="text-xs text-slate-600">{option.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6">
        <h3 className="font-semibold text-foreground mb-4">Alert Severity Levels</h3>
        <div className="space-y-3">
          {[
            { key: "level1", label: "Level 1 - Low", desc: "Minor disease activity" },
            { key: "level2", label: "Level 2 - Low-Medium", desc: "Slight increase in cases" },
            { key: "level3", label: "Level 3 - Medium", desc: "Moderate outbreak risk" },
            { key: "level4", label: "Level 4 - High", desc: "Significant outbreak detected" },
            { key: "level5", label: "Level 5 - Critical", desc: "Major outbreak/emergency" },
          ].map((level) => (
            <label
              key={level.key}
              className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={settings[level.key as keyof typeof settings] as boolean}
                onChange={() => handleChange(level.key)}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-medium text-foreground">{level.label}</p>
                <p className="text-xs text-slate-600">{level.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium">
        Save Settings
      </button>
    </div>
  )
}
