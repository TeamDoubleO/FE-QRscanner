import { useNavigate } from 'react-router-dom'; 
import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

import { verifyQR } from '../apis/qrApi';

import './css/QRCodeScanner.css'

const parseResult = (raw: string) => {
  return raw.split(",").reduce((acc: Record<string, string>, pair) => {
    const [key, value] = pair.split("=");
    acc[key.trim()] = value?.trim() ?? "";
    return acc;
  }, {});
};

const QRCodeScanner = () => {
  const navigate = useNavigate();

  // const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (scannerRef.current) return; // 이미 렌더링된 경우 무시

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
          fps: 10,
          qrbox: Math.floor(Math.min(window.innerWidth, window.innerHeight) * 0.8),
      },
      false
  );

  const handleScan = async (parsed: any) => {
  const allowedAreas = parsed?.vp?.verifiableCredential?.credentialSubject?.allowedAreas;
  const deviceAreaCode = localStorage.getItem("deviceAreaCode") || "";

  if (Array.isArray(allowedAreas) && deviceAreaCode) {
    try {
      console.log("allowedAreas:", allowedAreas);
      console.log("deviceAreaCode:", deviceAreaCode);

      const result = await verifyQR(allowedAreas, deviceAreaCode);
      console.log("출입 서버 응답:", result);

      if (result === true) {
        setPopupMessage("✅ 출입 인증 성공");
      } else {
        setPopupMessage("❌ 출입 인증 거부");
      }
    } catch (err) {
      console.error("출입 데이터 전송 실패", err);
      setPopupMessage("출입 인증 실패");
    }
  } else {
    console.warn("allowedAreas 또는 deviceAreaCode가 없습니다.");
    setPopupMessage("QR 검증 데이터 부족");
  }
  setShowPopup(true);
  setIsScanning(true);
  setTimeout(() => {
    setShowPopup(false);
    setIsScanning(false);
  }, 5000);
};

  scanner.render(
    (decodedText: string) => {
    if (isScanning) return;

    setIsScanning(true);
    let parsed: Record<string, any> | string = decodedText;

    try {
      parsed = JSON.parse(decodedText);
    } catch (e) {
      if (decodedText.includes("=") && decodedText.includes(",")) {
        parsed = parseResult(decodedText);
      }
    }

    console.log("Parsed:", parsed);
    // setScanResult(typeof parsed === "string" ? parsed : JSON.stringify(parsed, null, 2));
    setError(null);

    if (typeof parsed === "object" && parsed?.vp?.verifiableCredential?.credentialSubject) {
      handleScan(parsed);
    } else {
      console.warn("handleScan 조건 불충족. parsed:", parsed);
      setIsScanning(false); 
    }
  },
  (_: string) => {
    // 스캔 실패 무시
  }
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
  resizeHandler(); // 초기 실행

  return () => {
    window.removeEventListener("resize", resizeHandler);
  };
}, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>QR 스캔 후 출입이 가능합니다!</h2>

      {showPopup && (
      <div style={{
        position: "fixed", 
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "rgba(0,0,0,0.85)",
        color: "#fff",
        padding: "40px 60px", 
        borderRadius: "16px",
        zIndex: 9999, 
        fontSize: "2rem", 
        fontWeight: "bold",
        textAlign: "center",
        boxShadow: "0 8px 20px rgba(0,0,0,0.3)", 
      }}>
          {popupMessage}
        </div>
      )}

      <div
        id="qr-reader"
        style={{
            width: "100vw",
            height: "100vh",
            margin: "0 auto"
        }}
        ></div>
      {/* {scanResult && (
        <pre
          style={{
            textAlign: "left",
            background: "#f4f4f4",
            padding: "10px",
            marginTop: "16px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          Scanned Result:
          {"\n"}
          {scanResult}
        </pre>
      )} */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={() => navigate(-1)}>돌아가기</button>
    </div>
  );
};

export default QRCodeScanner;