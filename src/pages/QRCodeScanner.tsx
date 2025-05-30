import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

import { verifyQR } from '../apis/qrApi';

import './css/QRCodeScanner.css';
import logo from '../assets/images/KEYWE_logo.png';

// 상황별 상태 메시지 정의
const STATUS_MESSAGES: Record<string, string> = {
  NO_CAMERA: "📵 카메라 장치를 찾을 수 없습니다",
  SCANNING: "📷 인식 중... QR 코드를 화면에 맞춰주세요",
  ACCESS_GRANTED: "✅ 출입 인증 성공",
  ACCESS_DENIED: "❌ 출입 권한 없음",
  VERIFY_FAILED: "🛠️ 출입 인증 실패",
  INVALID_QR: "⚠️ 올바르지 않은 QR 코드입니다",
};

// 문자열을 key=value 형태로 파싱하는 함수
const parseResult = (raw: string) => {
  return raw.split(",").reduce((acc: Record<string, string>, pair) => {
    const [key, value] = pair.split("=");
    acc[key.trim()] = value?.trim() ?? "";
    return acc;
  }, {});
};

const QRCodeScanner = () => {
  const navigate = useNavigate();

  const [scanResult, setScanResult] = useState<string | null>(null); // 스캔 결과 문자열 저장
  const [error, setError] = useState<string | null>(null); // 에러 메시지 저장
  const [showPopup, setShowPopup] = useState(false); // 팝업 표시 여부
  const [popupMessage, setPopupMessage] = useState(''); // 팝업에 표시할 메시지
  const [isScanning, setIsScanning] = useState(false); // 스캔 중 여부
  const scannerRef = useRef<Html5QrcodeScanner | null>(null); // 스캐너 ref

  // 팝업 메시지 출력 함수
  const showMessage = (message: string) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      setIsScanning(false);
    }, 5000);
  };

  useEffect(() => {
    if (scannerRef.current) return; // 이미 렌더링된 경우 무시

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: Math.floor(Math.min(window.innerWidth, window.innerHeight) * 0.9),
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
            showMessage(STATUS_MESSAGES.ACCESS_GRANTED); // ✅ 출입 인증 성공
          } else {
            showMessage(STATUS_MESSAGES.ACCESS_DENIED); // ❌ 출입 권한 없음
          }
        } catch (err) {
          console.error("출입 데이터 전송 실패", err);
          showMessage(STATUS_MESSAGES.VERIFY_FAILED); // 🛠️ 출입 인증 실패
        }
      } else {
        console.warn("allowedAreas 또는 deviceAreaCode가 없습니다.");
        showMessage(STATUS_MESSAGES.INVALID_QR); // ⚠️ 잘못된 QR 구조
      }
    };

    // 초기 상태 메시지: 스캔 시작 안내
    showMessage(STATUS_MESSAGES.SCANNING);

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
          } else {
            // QR 구조 파싱 실패
            showMessage(STATUS_MESSAGES.INVALID_QR); // ⚠️ 올바르지 않은 QR 코드입니다
            return;
          }
        }

        console.log("Parsed:", parsed);
        setScanResult(typeof parsed === "string" ? parsed : JSON.stringify(parsed, null, 2));
        setError(null);

        if (typeof parsed === "object" && parsed?.vp?.verifiableCredential?.credentialSubject) {
          handleScan(parsed);
        } else {
          console.warn("handleScan 조건 불충족. parsed:", parsed);
          showMessage(STATUS_MESSAGES.INVALID_QR); // ⚠️ 올바르지 않은 QR 코드입니다
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

  // QR 박스 위치 미세 조정 (시각적 중앙 보정)
  useEffect(() => {
    const timer = setTimeout(() => {
      const scanRegion = document.querySelector('#qr-reader__scan_region');
      if (scanRegion) {
        (scanRegion as HTMLElement).style.transform = 'translateY(-30px)';
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="qr-scanner-wrapper">
      {/* 상단 헤더 */}
      <div className="qr-header">
        {/* 왼쪽 로고 */}
        <img
          src={logo}
          alt="KEYWE Logo"
          className="qr-logo"
        />
        {/* 중앙 텍스트 */}
        <h2 className="qr-header-text">QR 스캔 후 출입이 가능합니다!</h2>
      </div>

      {/* 팝업 메시지 */}
      {showPopup && (
        <div className="qr-popup-message">
          {popupMessage}
        </div>
      )}

      {/* QR 스캐너 */}
      <div id="qr-reader" className="qr-reader"></div>

      {/* 에러 메시지 */}
      {error && <p className="qr-error-text">{error}</p>}

      {/* 뒤로가기 버튼 */}
      <button className="qr-back-button" onClick={() => navigate(-1)}>돌아가기</button>
    </div>
  );
};

export default QRCodeScanner;
