import './css/BuildingLoginCard.css';
import { useState } from 'react';

interface Props {
  onSwitch: () => void;
  isExiting: boolean;
  direction: 'up' | 'down';
}

const BuildingLoginCard: React.FC<Props> = ({ onSwitch: _, isExiting, direction }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (id !== 'building' || password !== '1234') {
      setError('일치하는 정보가 존재하지 않습니다.\n입력 내용을 다시 확인해주세요.');
    } else {
      setError('');
      console.log('건물 로그인 성공!');
      // api연결
    }
  };

  return (
    <div
      className={`building-login-card ${
        isExiting ? (direction === 'up' ? 'building-slide-left' : 'building-slide-right') : ''
      }`}
    >
      <div
        className={`building-card-content ${
          isExiting
            ? 'building-fade-out-up' : 'building-fade-in-down'
        }`}
      >
        <h2>건물용 로그인</h2>
        <p className="description">건물 관리자 계정으로 로그인하세요.</p>
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

export default BuildingLoginCard;
