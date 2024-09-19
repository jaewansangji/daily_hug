import React, { useState, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { Input, List, Spin } from 'antd';  // Spin 추가
import { SendOutlined } from '@ant-design/icons';  // 전송 아이콘 추가
import './Chat.css'; // CSS 파일에서 스타일 적용

interface ChatProps {
    name: string;
    modelName: string;
    characters: string[];
}

interface ChatMessage {
    sender: 'user' | 'model';
    message: string;
}

const Chat: React.FC<ChatProps> = ({ name, modelName, characters }) => {
    const [chatInput, setChatInput] = useState<string>('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);  // 로딩 상태 추가

    useEffect(() => {
        const fetchGreeting = async () => {
            try {
                const response = await axios.post('http://localhost:8000/greet', {
                    user_name: name,
                    model_name: modelName
                });

                const newModelMessage: ChatMessage = { sender: 'model', message: response.data.response };
                setChatHistory([newModelMessage]);
            } catch (e) {
                console.error("greeting error: ", e);
            }
        };

        fetchGreeting();
    }, [name, modelName]);

    const getLimitedHistory = (history: ChatMessage[]) => {
        const filteredHistory = history.filter(chat => chat.sender === 'user' || chat.sender === 'model');
        return filteredHistory.slice(-6); // 가장 마지막 6개의 대화만 남김
    };

    const handleChatSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (chatInput.trim() === '') return;

        const newUserMessage: ChatMessage = { sender: 'user', message: chatInput };
        const updatedHistory = [...chatHistory, newUserMessage];

        setIsLoading(true);  // 서버 요청 중에 로딩 상태 활성화

        // Spin을 로딩 중 메시지로 추가
        const loadingMessage: ChatMessage = { sender: 'model', message: 'loading' };
        setChatHistory([...updatedHistory, loadingMessage]);

        try {
            const limitedHistory = getLimitedHistory(updatedHistory);

            const response = await axios.post('http://localhost:8000/chat', {
                user_name: name,
                model_name: modelName,
                characters: characters.join(", "),
                message: chatInput,
                history: limitedHistory.map(chat => ({
                    role: chat.sender === 'user' ? 'user' : 'model',
                    content: chat.message
                }))
            });

            // Spin 메시지를 실제 응답으로 교체
            const newModelMessage: ChatMessage = { sender: 'model', message: response.data.response.response };
            const updatedWithResponse = [...updatedHistory, newModelMessage];

            setChatHistory(updatedWithResponse);
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);  // 요청 완료 후 로딩 상태 비활성화
        setChatInput('');
    };

    return (
        <div className="chat-container">
            <div className="chat-background">
                <video autoPlay loop muted className="background-video">
                    <source src="/chat_background.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <div className="chat-box">
                <div className="chat-content">
                    <h2 className="chat-header">{name}님, 안녕하세요!</h2>
                    <div className="chat-history">
                        <List
                            bordered={false}
                            dataSource={chatHistory}
                            renderItem={(chat) => (
                                <div className={`chat-bubble ${chat.sender === 'user' ? 'user-bubble' : 'model-bubble'}`}>
                                    <div className="chat-message">
                                        {chat.message === 'loading' ? <Spin /> : chat.message} {/* Spin 추가 */}
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                    <form onSubmit={handleChatSubmit} className="chat-input-form">
                        <Input
                            className="chat-input"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="메시지를 입력하세요"
                            disabled={isLoading}  // 로딩 중에는 버튼 비활성화
                            suffix={ // 입력창 안에 아이콘을 배치
                                <SendOutlined
                                    onClick={handleChatSubmit}  // 아이콘 클릭 시 메시지 전송
                                    className="send-icon"
                                    style={{ fontSize: '24px', color: isLoading ? '#ddd' : '#1890ff', cursor: 'pointer' }}
                                />
                            }
                        />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;
