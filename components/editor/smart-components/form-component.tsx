"use client"

import React, { useState } from "react"
import type { EditorElement } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface FormComponentProps {
  element: EditorElement
  isPreview?: boolean
}

interface FormField {
  id: string
  type: "text" | "email" | "tel" | "textarea" | "select"
  label: string
  placeholder?: string
  required?: boolean
  options?: string[] // For select fields
}

interface FormContent {
  title: string
  description?: string
  fields: FormField[]
  submitButtonText: string
  successMessage: string
}

export function FormComponent({ element, isPreview = false }: FormComponentProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Parse form content
  const content: FormContent = {
    title: element.content?.title || "Contact Form",
    description: element.content?.description || "Get in touch with us",
    fields: element.content?.fields || [
      { id: "name", type: "text", label: "Name", placeholder: "Your name", required: true },
      { id: "email", type: "email", label: "Email", placeholder: "your@email.com", required: true },
      { id: "message", type: "textarea", label: "Message", placeholder: "Your message", required: true },
    ],
    submitButtonText: element.content?.submitButtonText || "Send Message",
    successMessage: element.content?.successMessage || "Thank you! Your message has been sent.",
  }

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    content.fields.forEach(field => {
      if (field.required && !formData[field.id]?.trim()) {
        newErrors[field.id] = `${field.label} is required`
      } else if (field.type === "email" && formData[field.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData[field.id])) {
          newErrors[field.id] = "Please enter a valid email address"
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isPreview) return

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // In a real implementation, this would submit to Supabase
      // For now, we'll simulate the submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log("Form submitted:", formData)
      setIsSubmitted(true)
      setFormData({})
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: FormField) => {
    const value = formData[field.id] || ""
    const error = errors[field.id]

    switch (field.type) {
      case "textarea":
        return (
          <div key={field.id} style={{ marginBottom: "1rem" }}>
            <Label htmlFor={field.id} style={{ marginBottom: "0.5rem", display: "block" }}>
              {field.label} {field.required && <span style={{ color: "#ef4444" }}>*</span>}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              style={{
                width: "100%",
                minHeight: "100px",
                border: error ? "1px solid #ef4444" : "1px solid #d1d5db",
              }}
            />
            {error && (
              <p style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                {error}
              </p>
            )}
          </div>
        )

      case "select":
        return (
          <div key={field.id} style={{ marginBottom: "1rem" }}>
            <Label htmlFor={field.id} style={{ marginBottom: "0.5rem", display: "block" }}>
              {field.label} {field.required && <span style={{ color: "#ef4444" }}>*</span>}
            </Label>
            <select
              id={field.id}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: error ? "1px solid #ef4444" : "1px solid #d1d5db",
                borderRadius: "0.375rem",
                backgroundColor: "#ffffff",
              }}
            >
              <option value="">{field.placeholder || `Select ${field.label}`}</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {error && (
              <p style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                {error}
              </p>
            )}
          </div>
        )

      default:
        return (
          <div key={field.id} style={{ marginBottom: "1rem" }}>
            <Label htmlFor={field.id} style={{ marginBottom: "0.5rem", display: "block" }}>
              {field.label} {field.required && <span style={{ color: "#ef4444" }}>*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              style={{
                width: "100%",
                border: error ? "1px solid #ef4444" : "1px solid #d1d5db",
              }}
            />
            {error && (
              <p style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                {error}
              </p>
            )}
          </div>
        )
    }
  }

  if (isSubmitted) {
    return (
      <div
        id={element.id}
        className="form-component"
        style={{
          padding: "2rem",
          backgroundColor: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: "0.5rem",
          textAlign: "center",
          ...element.styles,
        }}
      >
        <h3 style={{ color: "#15803d", marginBottom: "1rem" }}>Success!</h3>
        <p style={{ color: "#166534" }}>{content.successMessage}</p>
        <Button
          onClick={() => setIsSubmitted(false)}
          variant="outline"
          style={{ marginTop: "1rem" }}
        >
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <div
      id={element.id}
      className="form-component"
      style={{
        padding: "2rem",
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "0.5rem",
        maxWidth: "600px",
        margin: "0 auto",
        ...element.styles,
      }}
    >
      {/* Form Header */}
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
          {content.title}
        </h2>
        {content.description && (
          <p style={{ color: "#6b7280" }}>{content.description}</p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {content.fields.map(renderField)}

        <Button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: "100%",
            marginTop: "1rem",
            backgroundColor: isSubmitting ? "#9ca3af" : "#3b82f6",
          }}
        >
          {isSubmitting ? "Sending..." : content.submitButtonText}
        </Button>
      </form>
    </div>
  )
}