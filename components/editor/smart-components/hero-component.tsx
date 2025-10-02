"use client"

import React from "react"
import type { EditorElement } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface HeroComponentProps {
  element: EditorElement
  isPreview?: boolean
}

interface HeroContent {
  heading: string
  subheading: string
  buttonText: string
  buttonLink: string
  backgroundImage?: string
  backgroundColor?: string
}

export function HeroComponent({ element, isPreview = false }: HeroComponentProps) {
  // Parse hero content
  const content: HeroContent = {
    heading: element.content?.heading || "Welcome to Our Website",
    subheading: element.content?.subheading || "Create amazing experiences with our powerful tools",
    buttonText: element.content?.buttonText || "Get Started",
    buttonLink: element.content?.buttonLink || "#",
    backgroundImage: element.content?.backgroundImage,
    backgroundColor: element.content?.backgroundColor || "#f8fafc",
  }

  const handleButtonClick = () => {
    if (isPreview && content.buttonLink) {
      if (content.buttonLink.startsWith("#")) {
        // Scroll to section
        const target = document.querySelector(content.buttonLink)
        target?.scrollIntoView({ behavior: "smooth" })
      } else {
        // External link
        window.open(content.buttonLink, "_blank")
      }
    }
  }

  const backgroundStyle = content.backgroundImage
    ? {
        backgroundImage: `url(${content.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    : {
        backgroundColor: content.backgroundColor,
      }

  return (
    <section
      id={element.id}
      className="hero-component"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "4rem 2rem",
        minHeight: "400px",
        textAlign: "center",
        position: "relative",
        ...backgroundStyle,
        ...element.styles,
      }}
    >
      {/* Overlay for better text readability on background images */}
      {content.backgroundImage && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 1,
          }}
        />
      )}

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "800px",
          width: "100%",
        }}
      >
        {/* Heading */}
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            color: content.backgroundImage ? "#ffffff" : "#1f2937",
            lineHeight: "1.2",
          }}
        >
          {content.heading}
        </h1>

        {/* Subheading */}
        <p
          style={{
            fontSize: "1.25rem",
            marginBottom: "2rem",
            color: content.backgroundImage ? "#f3f4f6" : "#6b7280",
            lineHeight: "1.6",
            maxWidth: "600px",
            margin: "0 auto 2rem auto",
          }}
        >
          {content.subheading}
        </p>

        {/* Call-to-Action Button */}
        <Button
          onClick={handleButtonClick}
          size="lg"
          style={{
            fontSize: "1.125rem",
            padding: "0.75rem 2rem",
            backgroundColor: "#3b82f6",
            color: "#ffffff",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#2563eb"
            e.currentTarget.style.transform = "translateY(-2px)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#3b82f6"
            e.currentTarget.style.transform = "translateY(0)"
          }}
        >
          {content.buttonText}
        </Button>
      </div>
    </section>
  )
}