"use client"

import React from "react"
import type { EditorElement } from "@/lib/types"
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react"

interface FooterComponentProps {
  element: EditorElement
  isPreview?: boolean
}

interface FooterLink {
  id: string
  label: string
  href: string
}

interface SocialLink {
  id: string
  platform: "facebook" | "twitter" | "instagram" | "linkedin" | "github"
  href: string
}

interface FooterContent {
  copyrightText: string
  links: FooterLink[]
  socialLinks: SocialLink[]
}

const SocialIcon = ({ platform, size = 20 }: { platform: string; size?: number }) => {
  switch (platform) {
    case "facebook":
      return <Facebook size={size} />
    case "twitter":
      return <Twitter size={size} />
    case "instagram":
      return <Instagram size={size} />
    case "linkedin":
      return <Linkedin size={size} />
    case "github":
      return <Github size={size} />
    default:
      return null
  }
}

export function FooterComponent({ element, isPreview = false }: FooterComponentProps) {
  // Parse footer content
  const content: FooterContent = {
    copyrightText: element.content?.copyrightText || `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
    links: element.content?.links || [
      { id: "1", label: "Privacy Policy", href: "/privacy" },
      { id: "2", label: "Terms of Service", href: "/terms" },
      { id: "3", label: "Contact", href: "/contact" },
    ],
    socialLinks: element.content?.socialLinks || [
      { id: "1", platform: "facebook", href: "https://facebook.com" },
      { id: "2", platform: "twitter", href: "https://twitter.com" },
      { id: "3", platform: "instagram", href: "https://instagram.com" },
    ],
  }

  const handleLinkClick = (href: string) => {
    if (isPreview) {
      if (href.startsWith("http")) {
        window.open(href, "_blank")
      } else {
        // Internal navigation would go here
        console.log("Navigate to:", href)
      }
    }
  }

  return (
    <footer
      id={element.id}
      className="footer-component"
      style={{
        backgroundColor: "#1f2937",
        color: "#f9fafb",
        padding: "2rem",
        marginTop: "auto",
        ...element.styles,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {/* Links Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "2rem",
          }}
        >
          {content.links.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.href)}
              style={{
                background: "none",
                border: "none",
                color: "#d1d5db",
                fontSize: "0.875rem",
                cursor: "pointer",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ffffff"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#d1d5db"
              }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Social Links */}
        {content.socialLinks.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            {content.socialLinks.map((social) => (
              <button
                key={social.id}
                onClick={() => handleLinkClick(social.href)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#d1d5db",
                  cursor: "pointer",
                  padding: "0.5rem",
                  borderRadius: "0.375rem",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#ffffff"
                  e.currentTarget.style.backgroundColor = "#374151"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#d1d5db"
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                <SocialIcon platform={social.platform} />
              </button>
            ))}
          </div>
        )}

        {/* Copyright */}
        <div
          style={{
            textAlign: "center",
            paddingTop: "1rem",
            borderTop: "1px solid #374151",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              color: "#9ca3af",
              margin: 0,
            }}
          >
            {content.copyrightText}
          </p>
        </div>
      </div>
    </footer>
  )
}