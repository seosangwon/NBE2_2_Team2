import React, { useState } from 'react';
import './App.css';
import UserInfo from './components/UserInfo';
import Login from './components/Login';
import ProfileImageChange from './components/ProfileImageChange';
import UserDelete from './components/UserDelete';
import Register from './components/Register';
import InsertOrder from "./components/InsertOrder";
import OrderListPage from "./components/OrderListPage";

function App() {
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState(null);
    const [activeComponent, setActiveComponent] = useState('');
    const [showSubMenu, setShowSubMenu] = useState(false);
    const [showOrderSubMenu, setOrderShowSubMenu] = useState(false);
    const [profileImage, setProfileImage] = useState(''); // 프로필 이미지 상태 추가
    const [isActive, setIsActive] = useState(false);

    const toggleActive = () => {
        setIsActive(prev => !prev);
    };

    const handleLogin = (name, mImage) => {
        setUserName(name);
        setProfileImage(mImage ? `/api/v1/members/upload/${mImage}` : '/api/v1/members/upload/defaultImageUrl.jpg');
        setActiveComponent('');
    };

    const handleRegister = (name) => {
        setUserName(name);
        setActiveComponent('');
    };

    const handleUserDelete = () => {
        setUserName('');
        setUserId(null);
        setProfileImage(''); // 이미지 초기화
        setActiveComponent('');
    };

    const showComponent = (component) => {
        setActiveComponent(component);
    };

    const handleMouseEnter = () => {
        setShowSubMenu(true);
    };

    const handleMouseLeave = () => {
        setShowSubMenu(false);
    };

    const handleBack = () => {
        setActiveComponent('');
    };

    const handleProfileImageChange = (newImage) => {
        setProfileImage(newImage); // 프로필 이미지 업데이트
    };

    return (
        <div className={isActive ? 'active' : 'inactive'}>
            <div className="App">
                <h1>발주 관리 통합 솔루션</h1>
                <h2 className="index-info">
                    {userName ? (
                        <>
                            <img
                                src={profileImage}
                                alt="Profile"
                                style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}
                            />
                            {userName}
                            <button
                                className="delete-button"
                                onClick={handleUserDelete}
                                style={{ marginLeft: '10px', background: 'red' }}>로그아웃
                            </button>
                        </>
                    ) : '로그인 해주세요'}
                </h2>

                {!userName ? (
                    <div className="auth-container">
                        {activeComponent === '' && (
                            <button className="auth-button" onClick={() => setActiveComponent('login')}>
                                로그인
                            </button>
                        )}
                        {activeComponent === '' && (
                            <button className="auth-button" onClick={() => setActiveComponent('register')}>
                                회원가입
                            </button>
                        )}
                        {activeComponent === 'login' && <Login onLogin={handleLogin} />}
                        {activeComponent === 'register' && <Register onRegister={handleRegister} />}
                        {(activeComponent === 'login' || activeComponent === 'register') && (
                            <button className="back-button" onClick={handleBack}>뒤로가기</button>
                        )}
                    </div>
                ) : activeComponent ? (
                    <div className="component-container">
                        {activeComponent === 'userInfo' && <UserInfo userId={userId} onUpdate={setUserName} />}
                        {activeComponent === 'profileImageChange' &&
                            <ProfileImageChange userId={userId} onProfileImageChange={handleProfileImageChange} />}
                        {activeComponent === 'userDelete' && <UserDelete userId={userId} onDelete={handleUserDelete} />}
                        {activeComponent === 'insertOrder' && <InsertOrder memberId={userId} />}
                        {activeComponent === 'orderListPage' && <OrderListPage />}
                        <button className="back-button" onClick={handleBack}>뒤로가기</button>
                    </div>
                ) : (
                    <div>
                        <div className="container">
                            <button className="box color1" onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}>
                                {showSubMenu ? (
                                    <div className="submenu">
                                        <ul>
                                            <li onClick={() => showComponent('insertOrder')}>▶ 발주 신청</li>
                                            <li onClick={() => showComponent('orderListPage')}>▶ 발주 목록 확인</li>
                                        </ul>
                                    </div>
                                ) : (
                                    "발주 관리"
                                )}
                            </button>
                            <button className="box color2">상품 관리</button>
                            <button className="box color3" onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}>
                                {showSubMenu ? (
                                    <div className="submenu">
                                        <ul>
                                            <li onClick={() => showComponent('userInfo')}>▶ 회원 정보 수정</li>
                                            <li onClick={() => showComponent('profileImageChange')}>▶ 프로필 사진 수정</li>
                                            <li onClick={() => showComponent('userDelete')}>▶ 회원 탈퇴</li>
                                        </ul>
                                    </div>
                                ) : (
                                    "정보 관리"
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
