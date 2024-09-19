# Daily Hug Chat Application

## Introduction
This is a conversational web application where users can chat with an AI model based on the **[Gemma-2b-it (daily_hug)](https://huggingface.co/JaeJiMin/daily_hug)** language model. The AI model provides friendly and empathetic responses based on user inputs, aiming to engage in casual and supportive conversations. The app is built with **React** (TypeScript) on the frontend and **FastAPI** on the backend, utilizing **Ant Design** for UI components.

## Features
- **Real-time Chat**: Users can chat with an AI model that provides responses based on user input.
- **Personality Customization**: Users can name the AI model and set its personality traits.
- **Spin Loader**: Displays a loading animation while the AI is generating a response.
- **Dynamic Background**: The background is a video that provides a calming atmosphere during the chat.
- **Responsive Design**: The chat interface is responsive and works well on both desktop and mobile devices.

## Model Information
The application utilizes the **Gemma-2b-it** model fine-tuned for friendly and empathetic conversations. This model is fine-tuned specifically to provide casual and supportive responses that align with the user's emotions and conversation flow.

- Model Name: **[Gemma-2b-it (daily_hug)](https://huggingface.co/JaeJiMin/daily_hug)**
- Model Description: The model is fine-tuned on conversational datasets to engage users in natural, friendly, and supportive dialogue. It is designed to understand and respond with empathy and positivity.
- Hugging Face Repository: [https://huggingface.co/JaeJiMin/daily_hug](https://huggingface.co/JaeJiMin/daily_hug)

The model is served locally without the need for an external API call to Hugging Face, ensuring faster response times for a real-time chat experience.

## Technologies Used
### Frontend:
- **React (TypeScript)**
- **Ant Design**: Used for input fields, buttons, and other UI components.
- **Axios**: For making HTTP requests to the FastAPI backend.
- **CSS**: For custom styling and layout adjustments.

### Backend:
- **FastAPI**: Handles user inputs, model processing, and serves the AI model.
- **Python (Hugging Face Transformers)**: For utilizing the `Gemma-2b-it` AI model.
- **Conda**: Used for environment management.

### Model:
- **Gemma-2b-it**: A fine-tuned conversational model.

## Setup and Installation
### Prerequisites:
- **Node.js** (for frontend)
- **Python 3.8+** (for backend)
- **Conda** (for environment management)
- **Git** (to clone the repository)

### Backend Setup:
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo/backend

2. Create and activate the Conda environment:
    ```bash
    conda create --name daily_hug python=3.8
    conda activate daily_hug
    ```
   
3. Install the necessary Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
   
4. Run the FastAPI server:
    ```bash
    uvicorn main:app --reload
    ```
The FastAPI server should be running on http://localhost:8000.

### Frontend Setup:
1. Move to the frontend directory:
    ``` bash
    cd ../frontend
    ```

2. Install dependencies:
    ``` bash
    npm install
    ```

3. Install dependencies:
    ``` bash
    npm install
    ```
The frontend should now be running on http://localhost:3000.
   
## Usage Instructions
1. **Enter User Details:** On the first screen, enter your name, the name of the AI model, and select personality traits for the model.
2. **Chat:** Once the details are submitted, the app transitions to the chat screen where you can start a conversation with the AI model.
3. **Real-time Responses:** The model will respond to your inputs with dynamic, empathetic messages. While waiting for a response, a loading spinner is displayed.
