from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from typing import List
import random

app = FastAPI()

# device 체커
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

BASE_MODEL = "JaeJiMin/daily_hug"

model = AutoModelForCausalLM.from_pretrained(BASE_MODEL, torch_dtype=torch.bfloat16)
model.to(device)

# Tokenizer model
TOKENIZER__MODEL = "google/gemma-2b-it"
tokenizer = AutoTokenizer.from_pretrained(TOKENIZER__MODEL, add_sepcial_tokens=True)

pipe = pipeline("text-generation", model=model, tokenizer=tokenizer, max_new_tokens=512)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    user_name: str
    model_name: str
    characters: str
    message: str
    history: List[dict]


# 기본 prompt를 만들고 거기에 history를 붙이는식으로

def base_prompt(user_name, model_name, characters):
    prompt = [
        {
            "role": "user",
            "content": f"""
# 시스템 지침

## 성격 규칙
{characters}

## 기본 규칙
당신의 이름은 {model_name}이고, 사용자의 이름은 {user_name}입니다. 당신은 {characters}한 성격을 갖고있습니다. 당신의 역할은 친근한 대화상대로 가벼운 일상 대화를 나누는 것입니다. 자연스럽게 사용자의 하루, 주말 계획 또는 좋아하는 활동에 대해 물어보며 대화를 이끌어야 합니다. 사용자가 친근감을 느낄수있도록 대화를 하면서 상대방의 말투를 닮아가야합니다. 사용자가 감정이나 생각을 표현할 때 경청하고 긍정적인 반응을 보여주세요. 만약 심각한 정신적 문제가 감지되면 부드럽게 문제의 가능성을 제안할 수 있지만, 대부분 가벼운 대화를 유지해야 합니다. 

## 사용자의 규칙
당신은 {user_name}과 자연스러운 대화 흐름을 만들어야 합니다. 농담을 하기도하고, {user_name}의 이야기에 경청하기도하며, 새로운 대화주제를 던지기도하는 등 {user_name}이 당신과 대화하는것을 즐겁게 느껴야합니다. 긴 대답보다는 짧은 대답으로 친구처럼 즐거운 대화를 진행하는데 중점을두세요


## 대화 예시

1. {user_name}: "안녕?"
   {model_name}: "반가워, {user_name}! 오늘 하루는 어땠어?"

2. {user_name}: "주말에 뭐 할거야?"
   {model_name}: "나는 산책할 계획이야. {user_name}는 주말에 뭐 할 거야?"

3. {user_name}: "기분이 좀 안 좋아."
   {model_name}: "무슨일이야? 내가 도울 수 있을까?"

## 시간
2024-09-09 화요일 22:36(JST)"""}
    ]

    return prompt


def encode(chat_request: ChatRequest):
    print(f'user_name : {chat_request.user_name}, message : {chat_request.message}, history : {chat_request.history}')

    user_name = chat_request.user_name
    model_name = chat_request.model_name
    characters = chat_request.characters
    user_input = chat_request.message
    history = chat_request.history

    message = base_prompt(user_name, model_name, characters)
    message = message + history
    print(f"message: {message}")
    prompt = pipe.tokenizer.apply_chat_template(message, tokenize=False, add_generation_prompt=True)
    print(f'token : {prompt}')

    outputs = pipe(
        prompt,
        do_sample=True,
        temperature=0.4,
        top_k=100,
        top_p=0.8,
        repetition_penalty=1.1,
        add_special_tokens=True
    )

    response = outputs[0]["generated_text"][len(prompt):]
    print(f"response: {response}")
    # 새로운 대화 내용을 history에 추가
    new_history = history + [
        {"role": "model", "content": response.strip()}
    ]

    return {"response": response, "history": new_history[-6:]}  # 최근 6개의 대화 기록만 반환


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}


@app.post("/chat")
async def chat(chat_request: ChatRequest):
    response = encode(chat_request)

    return {"response": response}


# 요청으로 받을 데이터 모델 정의
class GreetRequest(BaseModel):
    user_name: str
    model_name: str


@app.post("/greet")
async def greet(request: GreetRequest):
    # request에서 user_name과 model_name을 추출
    user_name = request.user_name
    model_name = request.model_name

    # 대화를 시작하기에 좋은 인사말 목록
    greetings = [
        f"안녕하세요, {user_name}! 오늘 하루는 어떠셨어요?",
        f"반가워요, {user_name}! 오늘 기분은 어떠신가요?",
        f"안녕하세요, {user_name}! 좋은 하루 보내고 계신가요?",
        f"안녕, {user_name}! 오늘 무슨 일이 있었나요?",
        f"안녕하세요, {user_name}! 오늘은 무슨 계획이 있으신가요?",
        f"안녕하세요, {user_name}! 요즘 어떻게 지내세요?",
        f"안녕, {user_name}! 최근에 특별한 일이 있었나요?",
        f"안녕하세요, {user_name}! 오늘 하루는 어떻게 보내셨나요?",
        f"안녕, {user_name}! 요즘 컨디션은 어떤가요?",
        f"안녕하세요, {user_name}! 요즘 무슨 생각을 하고 계신가요?"
    ]

    # 인사말을 랜덤하게 선택
    greeting_message = random.choice(greetings)

    return {"response": greeting_message}
