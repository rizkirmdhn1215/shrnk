import QRCode from "qrcode"

export async function generateQRCode(url: string): Promise<string> {
  try {
    const qrCodeUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: "H",
      type: "image/png",
      quality: 0.95,
      margin: 1,
      width: 200,
    })
    return qrCodeUrl
  } catch (error) {
    console.error("Failed to generate QR code:", error)
    return ""
  }
}
