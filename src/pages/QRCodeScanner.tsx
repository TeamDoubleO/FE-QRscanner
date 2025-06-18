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
  VERIFY_FAILED: "🛠️ 출입 인증 실패 관리자에게 문의해주세요",
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
  const direction = localStorage.getItem("direction") || "";
  const isZoneMode = !!zoneName;
  const isScanningRef = useRef(false);

  const showMessage = (message: string) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      setIsScanning(false);
    }, 1500);
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

  const verifyWithTimeout = (payload: any, timeoutMs = 2000) => { // 타임아웃 2초
    return Promise.race([
      verifyQR(payload),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), timeoutMs)
      )
    ]);
  };

  const handleScan = async (parsed: any) => {
  const deviceAreaCode = localStorage.getItem("deviceAreaCode") || "";
  const deviceAreaId = localStorage.getItem("deviceAreaId");
  const deviceLocationType = localStorage.getItem("deviceLocationType") || "";

  if (Array.isArray(parsed?.accessAreaCodes) && deviceAreaCode) {
    try {
      const payload: any = {
        ...parsed,
        deviceAreaCode,
        deviceAreaId: deviceAreaId ? Number(deviceAreaId) : undefined,
        deviceLocationType,
      };

      // BUILDING인 경우에만 direction 추가
      if (direction) {
        payload.direction = direction;
      }

      console.log("출입 verify 요청 payload:", payload);

      const result = await verifyWithTimeout(payload);
      console.log("출입 검증 result:", result?.success);

      if (result?.success) {
        showMessage(STATUS_MESSAGES.ACCESS_GRANTED);
      } else {
        showMessage(STATUS_MESSAGES.ACCESS_DENIED);
      }
    } catch (err: any) {
      if (err.message === "timeout") {
        console.error("출입 검증 응답 지연으로 타임아웃 발생");
      } else {
        console.error("출입 데이터 전송 실패", err);
      }
      showMessage(STATUS_MESSAGES.VERIFY_FAILED);
    }
  } else {
    showMessage(STATUS_MESSAGES.INVALID_QR);
  }
};

  scannerRef.current = scanner;
  (window as any).scannerRef = scannerRef;

  showMessage(STATUS_MESSAGES.SCANNING);

  scanner.render(
    (decodedText: string) => {
      if (isScanningRef.current) return;

      isScanningRef.current = true; // 1.5초간 QR 인식 일시차단
      console.log("QR 인식됨:", decodedText);

      setIsScanning(true); 
      setTimeout(() => {
        isScanningRef.current = false; // 1.5초 후 해제
        setIsScanning(false);
      }, 1500);

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
      if (typeof parsed === "object" && parsed?.passId && parsed?.accessAreaCodes) {
        handleScan(parsed);
      } else {
        showMessage(STATUS_MESSAGES.INVALID_QR);
      }
    },
    () => {}
  );

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

  const handleBackClick = async () => {
    const instance = scannerRef.current;
    if (instance) {
      try {
        await instance.clear(); // 카메라 종료
      } catch (err) {
        console.error("카메라 정리 중 오류", err);
      } finally {
        scannerRef.current = null;
        sessionStorage.setItem("zoneSelectStep", 'zone');
        navigate(-1);
      }
    } else {
      navigate(-1); 
    }
  };

  useEffect(() => {
    if (isScanning) {
      console.log("QR 코드 쿨타임 중(QR 인식 일시 차단)");
    }
  }, [isScanning]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const video = document.querySelector("#qr-reader video") as HTMLVideoElement;
      if (video) {
        video.style.transform = "scaleX(-1)";
      }
    });

    const qrReader = document.getElementById("qr-reader");
    if (qrReader) {
      observer.observe(qrReader, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="qr-code-scanner-wrapper">
      <div className="qr-code-scanner-header">
        <img src={logo} alt="KEYWE Logo" className="qr-code-scanner-logo" />
        <h2 className="qr-code-scanner-header-text">QR 스캔 후 출입이 가능합니다!</h2>
        <div className="qr-code-scanner-header-location">
          {isZoneMode 
            ? `${buildingName} / ${zoneName}` 
            : `${buildingName} / ${direction}`}
        </div>
      </div>

      {showPopup && (
        <div
          className={`qr-code-scanner-popup-message ${
            CENTER_MESSAGES.includes(popupMessage) ? 'qr-code-scanner-popup-message-center' : ''
          }`}
        >
          {popupMessage}
        </div>
      )}

      <div id="qr-reader" className="qr-code-scanner-reader" />
      <div className="qr-code-scanner-overlay" />

      {error && <p className="qr-code-scanner-error-text">{error}</p>}

      <button className="qr-code-scanner-back-button" onClick={handleBackClick}>돌아가기</button>
    </div>
  );
};

export default QRCodeScanner;
