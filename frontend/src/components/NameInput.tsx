import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Form, Select, Tag } from 'antd';
import type { SelectProps } from 'antd';

const { Option } = Select;

interface NameInputProps {
  setName: (name: string) => void;
  setModelName: (modelName: string) => void;
  setCharacters: (characters: string[]) => void;
}

// 성격 옵션
const options = [
  '친근한', '따듯한', '웃긴', '귀여운', '새침한', '털털한', '세심한', '긍정적인',
  '논리적인', '사랑스러운', '장난꾸러기', '진지한'
];

// 태그 색상 매핑
const tagColors: { [key: string]: string } = {
  '친근한': 'gold',
  '따듯한': 'lime',
  '웃긴': 'green',
  '귀여운': 'cyan',
  '새침한': 'blue',
  '털털한': 'orange',
  '세심한': 'purple',
  '긍정적인': 'red',
  '논리적인': 'volcano',
  '사랑스러운': 'magenta',
  '장난꾸러기': 'geekblue',
  '진지한': 'brown'
};

// 태그 렌더 함수
const tagRender: SelectProps['tagRender'] = (props) => {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      color={tagColors[value as string]}  // 태그 색상 설정
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginInlineEnd: 4 }}
    >
      {label}
    </Tag>
  );
};

const NameInput: React.FC<NameInputProps> = ({ setName, setModelName, setCharacters }) => {
  const [inputName, setInputName] = useState<string>('');
  const [inputModelName, setInputModelName] = useState<string>('');
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);  // 성격 선택
  const navigate = useNavigate();

  const handleNameSubmit = (e: FormEvent) => {
    e.preventDefault();
    setName(inputName);
    setModelName(inputModelName);
    setCharacters(selectedCharacters);
    navigate('/chat');
  };

  // 성격 선택 시 처리
  const handleCharacterChange = (value: string[]) => {
    setSelectedCharacters(value);
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftSection}>
        <div style={styles.formContainer}>
          <h1 style={styles.title}>뭐라고? 너도 그래?<br/>나만 그런줄 알았는데</h1>
          <Form onSubmitCapture={handleNameSubmit} style={styles.form}>
            <Form.Item style={styles.formItem}>
              <Input
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="사용자 이름"
                required
                style={styles.input}
              />
            </Form.Item>
            <Form.Item style={styles.formItem}>
              <Input
                value={inputModelName}
                onChange={(e) => setInputModelName(e.target.value)}
                placeholder="친구 이름"
                style={styles.input}
              />
            </Form.Item>
            <Form.Item style={styles.formItem} className="character-select-form-item">
              <Select
                mode="multiple"
                allowClear
                placeholder="친구 성격을 선택하세요"
                value={selectedCharacters}
                onChange={handleCharacterChange}
                style={styles.select}
                tagRender={tagRender}  // 태그 렌더 함수
                maxTagCount={3}  // 최대 3개까지만 선택 가능
              >
                {options.map((option) => (
                  <Option key={option} value={option} >
                    {option}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={styles.button}
              >
                대화 시작
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div style={styles.rightSection}>
        <video autoPlay loop muted style={styles.video}>
          <source src="/nameinput_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

// 스타일 정의
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#282828',
    fontFamily: 'WindyLavender, sans-serif',
  },
  leftSection: {
    flex: 3.5,  // 좌측의 비율을 3.5로 설정
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#f0f0f0',
  },
  formContainer: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  rightSection: {
    flex: 6.5,  // 우측의 비율을 6.5로 설정
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
  },
  title: {
    fontSize: '35px',
    marginBottom: '30px',
    color: '#ffffff',
    textAlign: 'center',
    width: '100%',
  },
  form: {
    width: '100%',
  },
  formItem: {
    width: '100%',
  },
  input: {
    height: '50px',  // 친구 이름과 동일한 높이 설정
    fontSize: '16px',
    borderRadius: '20px',  // 둥글게 변경
    backgroundColor: '#ffffff',
    color: '#000000',
    border: '1px solid #5A5A5A',
  },
  select: {
    height: '50px',  // 친구 이름 입력 칸과 동일한 높이로 설정
    fontSize: '16px',
    borderRadius: '20px',
    backgroundColor: '#ffffff',
    color: '#000000',
    border: '1px solid #5A5A5A',
    width: '100%',
  },
  button: {
    height: '50px',
    fontSize: '18px',
    backgroundColor: '#1DB954',
    borderRadius: '20px',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
};

export default NameInput;
