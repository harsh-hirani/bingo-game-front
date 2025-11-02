"use client"

import React, { useState } from "react"
import { Trophy, Eye, EyeOff, User, Building2, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function AuthForm({ type, userType }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    panNumber: "",
    aadhaarNumber: "",
    addressLine: "",
    postalCode: "",
    city: "",
    state: "",
    country: "India",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (type === "register") {
      if (!formData.name.trim()) newErrors.name = "Name is required"
      if (!formData.company.trim()) newErrors.company = "Company is required"
      if (!formData.panNumber.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)) {
        newErrors.panNumber = "Invalid PAN format"
      }
      if (!formData.aadhaarNumber.match(/^\d{12}$/)) {
        newErrors.aadhaarNumber = "Aadhaar must be 12 digits"
      }
      if (!formData.postalCode.match(/^\d{6}$/)) {
        newErrors.postalCode = "Postal code must be 6 digits"
      }
      if (!formData.mobileNumber.match(/^\d{10}$/)) {
        newErrors.mobileNumber = "Mobile number must be 10 digits"
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = "Please accept terms and conditions"
      }
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Invalid email format"
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    if (validateForm()) {
      console.log("Form submitted:", formData)
      const base = 'http://localhost:8000/api'
      const r = userType === "creator" ? "creator" : "player"
      const uri = `/${r}/${type}/`
      try {
        const res = await fetch(base + uri, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            full_name: formData.name,
            mobile_number: formData.mobileNumber,
            aadhaar_number: formData.aadhaarNumber,
            pan_number: formData.panNumber,
            address_line: formData.addressLine,
            postal_code: formData.postalCode,

          }),
        })
        const data = await res.json()
        console.log("Response data:", data)
        if (!res.ok) throw new Error(data.error || "Something went wrong")
        if (data.access && data.refresh) {
          localStorage.setItem("access_token", data.access)
          localStorage.setItem("refresh_token", data.refresh)
          localStorage.setItem("user", JSON.stringify(data.user))
          // In your login success handler
          localStorage.setItem("user_id", data.useId)
          localStorage.setItem("user_name", data.userName)  // ✅ Add this
        }
        // ✅ Redirect based on user type
        if (userType === "creator") {
          router.push("/creator/dashboard")
        } else {
          router.push("/user/dashboard")
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }

  const isLogin = type === "login"

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <nav className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl">
              <Trophy className="text-primary" size={28} />
              BingoHub
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-primary">
              {userType === "creator" ? <Building2 size={32} /> : <User size={32} />}
              <h1 className="text-2xl font-bold">BingoHub</h1>
            </div>
            <CardTitle className="text-2xl">{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
            <CardDescription>
              {isLogin
                ? `Sign in to your ${userType} account`
                : `Register as a ${userType === "creator" ? "Game Creator" : "Player"}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company/Club *</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className={errors.company ? "border-destructive" : ""}
                      />
                      {errors.company && <p className="text-sm text-destructive">{errors.company}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="panNumber">PAN Number *</Label>
                      <Input
                        id="panNumber"
                        placeholder="ABCDE1234F"
                        value={formData.panNumber}
                        onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                        className={errors.panNumber ? "border-destructive" : ""}
                      />
                      {errors.panNumber && <p className="text-sm text-destructive">{errors.panNumber}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aadhaarNumber">Aadhaar Number *</Label>
                      <Input
                        id="aadhaarNumber"
                        placeholder="123456789012"
                        value={formData.aadhaarNumber}
                        onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                        className={errors.aadhaarNumber ? "border-destructive" : ""}
                      />
                      {errors.aadhaarNumber && <p className="text-sm text-destructive">{errors.aadhaarNumber}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressLine">Address Line *</Label>
                    <Input
                      id="addressLine"
                      value={formData.addressLine}
                      onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        placeholder="123456"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className={errors.postalCode ? "border-destructive" : ""}
                      />
                      {errors.postalCode && <p className="text-sm text-destructive">{errors.postalCode}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber">Mobile Number *</Label>
                    <Input
                      id="mobileNumber"
                      placeholder="9876543210"
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                      className={errors.mobileNumber ? "border-destructive" : ""}
                    />
                    {errors.mobileNumber && <p className="text-sm text-destructive">{errors.mobileNumber}</p>}
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-muted/50 rounded-l-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={errors.confirmPassword ? "border-destructive" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-muted/50 rounded-l-none"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>
              )}

              {!isLogin && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked })}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I accept the Terms & Conditions *
                  </Label>
                </div>
              )}
              {errors.acceptTerms && <p className="text-sm text-destructive">{errors.acceptTerms}</p>}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading
                  ? "Processing..."
                  : isLogin
                    ? "Login"
                    : `Register as ${userType}`}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Link href={isLogin ? `/auth/${userType}/register?userType=${userType}` : `/auth/${userType}/login?userType=${userType}`}>
                  <Button variant="link" className="p-0 h-auto font-normal">
                    {isLogin ? "Sign up" : "Sign in"}
                  </Button>
                </Link>
              </div>
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
