import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

import { verifyQR } from '../apis/qrApi';

import './css/QRCodeScanner.css';
import logo from '../assets/images/KEYWE_logo_w.png';

const STATUS_MESSAGES: Record<string, string> = {
  NO_CAMERA: "📵 카메라 장치를 찾을 수 없습니다",
  SCANNING: "📷 인식 중... QR 코드를 화면에 맞춰주세요",
  ACCESS_GRANTED: "✅ 출입 인증 성공",
  ACCESS_DENIED: "❌ 출입 권한 없음",
  VERIFY_FAILED: "🛠️ 출입 인증 실패",
  INVALID_QR: "⚠️ 올바르지 않은 QR 코드입니다",
};

const CENTER_MESSAGES = [
  STATUS_MESSAGES.ACCESS_GRANTED,
  STATUS_MESSAGES.ACCESS_DENIED,
  STATUS_MESSAGES.INVALID_QR
];

const parseResult = (raw: string) => {
  return raw.split(",").reduce((acc: Record<string, string>, pair) => {
    const [key, value] = pair.split("=");
    acc[key.trim()] = value?.trim() ?? "";
    return acc;
  }, {});
};

const QRCodeScanner = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<any>(null);

  const buildingName = localStorage.getItem("buildingName") || "";
  const zoneName = localStorage.getItem("zoneName") || "";
  const isZoneMode = !!zoneName;

  const showMessage = (message: string) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      setIsScanning(false);
    }, 5000);
  };

  useEffect(() => {
    if (scannerRef.current) return;

    const scanner = new (Html5QrcodeScanner as any)(
      "qr-reader",
      {
        fps: 10
      },
      false
    );

    const handleScan = async (parsed: any) => {
      const allowedAreas = parsed?.vp?.verifiableCredential?.credentialSubject?.allowedAreas;
      const deviceAreaCode = localStorage.getItem("deviceAreaCode") || "";

      if (Array.isArray(allowedAreas) && deviceAreaCode) {
        try {
          const result = await verifyQR(allowedAreas, deviceAreaCode);
          showMessage(result ? STATUS_MESSAGES.ACCESS_GRANTED : STATUS_MESSAGES.ACCESS_DENIED);
        } catch (err: unknown) {
          console.error("출입 데이터 전송 실패", err);
          showMessage(STATUS_MESSAGES.VERIFY_FAILED);
        }
      } else {
        showMessage(STATUS_MESSAGES.INVALID_QR);
      }
    };

    showMessage(STATUS_MESSAGES.SCANNING);

    scanner.render(
      (decodedText: string) => {
        if (isScanning) return;

        setIsScanning(true);
        let parsed: Record<string, any> | string = decodedText;

        try {
          parsed = JSON.parse(decodedText);
        } catch {
          if (decodedText.includes("=") && decodedText.includes(",")) {
            parsed = parseResult(decodedText);
          } else {
            showMessage(STATUS_MESSAGES.INVALID_QR);
            return;
          }
        }

        setError(null);
        if (typeof parsed === "object" && parsed?.vp?.verifiableCredential?.credentialSubject) {
          handleScan(parsed);
        } else {
          showMessage(STATUS_MESSAGES.INVALID_QR);
        }
      },
      () => {}
    );

    scannerRef.current = scanner;

    return () => {
      scanner.clear().catch(console.error);
      scannerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const resizeHandler = () => {
      const qrReader = document.getElementById("qr-reader");
      if (qrReader) {
        qrReader.style.height = `${window.innerHeight}px`;
        qrReader.style.width = `${window.innerWidth}px`;
      }
    };

    window.addEventListener("resize", resizeHandler);
    resizeHandler();

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <div className="qr-scanner-wrapper">
      <div className="qr-header">
        <img src={logo} alt="KEYWE Logo" className="qr-logo" />
        <h2 className="qr-header-text">QR 스캔 후 출입이 가능합니다!</h2>
        <div className="qr-header-location">
          {isZoneMode ? `${buildingName} / ${zoneName}` : buildingName}
        </div>
      </div>

      {showPopup && (
        <div
          className={`qr-popup-message ${
            CENTER_MESSAGES.includes(popupMessage) ? 'qr-popup-message-center' : ''
          }`}
        >
          {popupMessage}
        </div>
      )}

      <div id="qr-reader" className="qr-reader" />
      <div className="qr-overlay" />

      {error && <p className="qr-error-text">{error}</p>}

      <button className="qr-back-button" onClick={() => navigate(-1)}>돌아가기</button>
    </div>
  );
};

export default QRCodeScanner;
