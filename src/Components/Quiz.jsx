import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './quiz.module.css';

export default function Quiz() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);

    const decodeEntities = (html) => {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = html;
        return textarea.value;
    };

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const response = await axios.get('https://opentdb.com/api.php?amount=10');
                const formattedQuestions = response.data.results.map((question) => ({
                    ...question,
                    question: decodeEntities(question.question),
                    incorrect_answers: question.incorrect_answers.map(decodeEntities),
                    correct_answer: decodeEntities(question.correct_answer),
                }));
                setQuestions(formattedQuestions);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        }
        fetchQuestions();
    }, []);

    const handleClick = (answer) => {
        if (answer === questions[currentQuestion].correct_answer) {
            setScore(score + 1);
        }
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowScore(true);
        }
    };

    const restartQuiz = () => {
        setQuestions([]);
        setCurrentQuestion(0);
        setScore(0);
        setShowScore(false);
        fetchQuestions();
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.quizTitle}>Quiz App</h1>
            {questions.length > 0 ? (
                showScore ? (
                    <div className={styles.scoreContainer}>
                        <h2 className={styles.score}>Your Score: {score} / {questions.length}</h2>
                        <button className={styles.restartButton} onClick={restartQuiz}>Restart Quiz</button>
                    </div>
                ) : (
                    <div>
                        <h2 className={styles.question}>{questions[currentQuestion].question}</h2>
                        <div className={styles.buttonContainer}>
                            {questions[currentQuestion].incorrect_answers.concat(questions[currentQuestion].correct_answer).map((option, index) => (
                                <button key={index} className={styles.button} onClick={() => handleClick(option)}>
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                )
            ) : (
                <p className={styles.loading}>Loading...</p>
            )}
        </div>
    );
}


