import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import NameInput from './components/NameInput';
import Chat from './components/Chat';

function App() {
    const [name, setName] = useState<string>('');
    const [modelName, setModelName] = useState<string>('지찡');  // 모델 이름 기본값 설정
    const [characters, setCharacters] = useState<string[]>([]);  // 모델의 성격 기본값 설정

    return (
        <Router>
            <Routes>
                {/* 이름 입력 페이지 */}
                <Route
                    path="/"
                    element={
                        <NameInput
                            setName={setName}
                            setModelName={setModelName}
                            setCharacters={setCharacters}
                        />
                    }
                />

                {/* 채팅 페이지 */}
                <Route
                    path="/chat"
                    element={
                        <Chat
                            name={name}
                            modelName={modelName}
                            characters={characters}
                        />
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
