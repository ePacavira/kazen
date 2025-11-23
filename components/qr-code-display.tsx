'use client'

import QRCode from 'qrcode.react'

interface QRCodeDisplayProps {
  value: string
  size?: number
}

export default function QRCodeDisplay({ value, size = 256 }: QRCodeDisplayProps) {
  return (
    <div className="bg-white p-4 rounded-lg flex items-center justify-center">
      <QRCode
        value={value}
        size={size}
        level="H"
        includeMargin={true}
      />
    </div>
  )
}

