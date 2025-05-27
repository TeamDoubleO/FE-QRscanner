import './css/ZoneLoginCard.css';
import { useState } from 'react';

interface Props {
  onSwitch: () => void;
  isExiting: boolean;
  direction: 'up' | 'down';
}

const ZoneLoginCard: React.FC<Props> = ({ onSwitch: _, isExiting, direction }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (id !== 'zone' || password !== '5678') {
      setError('일치하는 정보가 존재하지 않습니다.\n입력 내용을 다시 확인해주세요.');
    } else {
      setError('');
      console.log('구역 로그인 성공!');
      //  api연결
    }
  };

  return (
    <div
      className={`zone-login-card ${
        isExiting ? (direction === 'up' ? 'zone-slide-left' : 'zone-slide-right') : ''
      }`}
    >
      <div
        className={`zone-card-content ${
          isExiting ? 'zone-fade-out-up' : 'zone-fade-in-down'
        }`}
      >
        <h2>구역용 로그인</h2>
        <p className="description">구역 관리자 계정으로 로그인하세요.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="관리자 ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit">로그인</button>
        </form>
      </div>
    </div>
  );
};

export default ZoneLoginCard;
