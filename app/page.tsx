"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Phone, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SearchResult {
  name: string
  email: string
  phoneNumber: string
  letterURL: string
}

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Chỉ cho phép nhập số
    const numbersOnly = value.replace(/\D/g, "")
    // Giới hạn tối đa 10 số
    const limitedValue = numbersOnly.slice(0, 10)

    setPhoneNumber(limitedValue)
    setError(null)
    setSearchResult(null)
  }

  const handleSearch = async () => {
    if (!phoneNumber.trim()) {
      setError("Vui lòng nhập số điện thoại")
      return
    }

    if (phoneNumber.length !== 10) {
      setError("Số điện thoại phải có đúng 10 số")
      return
    }

    setIsSearching(true)
    setSearchResult(null)
    setError(null)

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Không tìm thấy thông tin")
        return
      }

      if (data.success && data.data) {
        setSearchResult(data.data)
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại.")
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Cho phép: số (0-9), phím điều hướng, phím xóa, Tab, Enter
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
    ]

    // Cho phép Ctrl/Cmd + A, C, V, X (copy, paste, cut, select all)
    if ((e.ctrlKey || e.metaKey) && ["a", "c", "v", "x"].includes(e.key.toLowerCase())) {
      return
    }

    // Nếu là phím được phép hoặc là số (0-9)
    if (allowedKeys.includes(e.key) || /^[0-9]$/.test(e.key)) {
      return
    }

    // Chặn tất cả các phím khác (chữ cái, ký tự đặc biệt)
    e.preventDefault()
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData("text")
    // Chỉ lấy số từ text đã paste
    const numbersOnly = pastedText.replace(/\D/g, "").slice(0, 10)
    setPhoneNumber(numbersOnly)
    setError(null)
    setSearchResult(null)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient matching poster */}
      <div className="fixed inset-0 bg-linear-to-br from-amber-100 via-orange-400 to-rose-500" />

      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 opacity-10"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M50 20 L70 50 L50 80 L30 50 Z"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
            <circle cx="50" cy="50" r="15" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-10 opacity-10"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 50 Q50 20 80 50 Q50 80 20 50"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 text-center"
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2 flex items-center justify-center flex-wrap gap-0.5 md:gap-1"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              color: "#ffffff",
              textShadow: `
                0 0 20px rgba(255, 255, 255, 0.9),
                0 0 40px rgba(255, 255, 255, 0.7),
                0 0 60px rgba(255, 255, 255, 0.5),
                0 0 80px rgba(255, 255, 255, 0.3),
                0 4px 12px rgba(0, 0, 0, 0.4),
                0 0 0 1px rgba(255, 255, 255, 0.2)
              `,
              letterSpacing: "0.03em",
              lineHeight: "1.2",
              fontWeight: 800,
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              KHÚC GIAO MÙA
            </motion.span>
            <motion.span
              className="inline-block text-5xl sm:text-6xl md:text-7xl lg:text-8xl ml-1 md:ml-2"
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 10 }}
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                color: "#ffffff",
                textShadow: `
                  0 0 25px rgba(255, 255, 255, 1),
                  0 0 50px rgba(255, 255, 255, 0.9),
                  0 0 75px rgba(255, 255, 255, 0.7),
                  0 0 100px rgba(255, 255, 255, 0.5),
                  0 0 125px rgba(255, 255, 255, 0.3),
                  0 6px 15px rgba(0, 0, 0, 0.5),
                  0 0 0 2px rgba(255, 255, 255, 0.3)
                `,
                transform: "scale(1.15)",
                letterSpacing: "0.05em",
                fontWeight: 900,
              }}
            >
              IV
            </motion.span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/90 text-sm md:text-base font-medium tracking-wider mt-2"
          >
            FPTU CULTURAL HARMONY
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Mail className="w-8 h-8 text-orange-500" />
                  <CardTitle className="text-2xl font-semibold text-gray-900">
                    Tìm Thông Tin Thư Mời
                  </CardTitle>
                </div>
              </motion.div>
              <CardDescription className="text-base text-gray-600">
                Nhập số điện thoại để tìm thông tin thư mời.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <div className="text-sm font-medium text-gray-700">
                  Số điện thoại <span className="text-gray-400">({phoneNumber.length}/10)</span>
                </div>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="... ... ... ..."
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    onKeyDown={handleKeyDown}
                    onKeyPress={handleKeyPress}
                    onPaste={handlePaste}
                    maxLength={10}
                    className={`pl-10 h-12 text-base bg-white/80 border-gray-300 focus:border-orange-500 focus:ring-orange-500 ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                      }`}
                    disabled={isSearching}
                  />
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1"
                  >
                    {error}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={handleSearch}
                  disabled={!phoneNumber.trim() || phoneNumber.length !== 10 || isSearching}
                  className="w-full h-12 text-base font-semibold bg-linear-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Đang tìm kiếm...
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      Tìm kiếm
                    </div>
                  )}
                </Button>
              </motion.div>

              {searchResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 rounded-lg bg-linear-to-r from-orange-50 to-rose-50 border border-orange-200 space-y-4"
                >
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Họ và tên</p>
                      <p className="text-base font-medium text-gray-900 mt-1">{searchResult.name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</p>
                      <p className="text-base font-medium text-gray-900 mt-1">{searchResult.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Số điện thoại</p>
                      <p className="text-base font-medium text-gray-900 mt-1">{searchResult.phoneNumber}</p>
                    </div>
                    {searchResult.letterURL && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Thư mời</p>
                        <a
                          href={searchResult.letterURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-orange-500 to-rose-500 text-white rounded-md hover:from-orange-600 hover:to-rose-600 transition-all duration-200 text-sm font-medium"
                        >
                          Xem thư mời
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Footer text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-white/80 text-xs mt-1">
              Live Music Concert
            </p>
            <p className="text-white/70 text-xs mt-1">
              Of Vietnamese Traditional Instruments & Western String Ensemble
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div >
  )
}
