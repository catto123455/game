import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const numberPairs = [
  { id: 1, value: '0', type: 'arabic' },
  { id: 2, value: 'zéro', type: 'french' },
  { id: 3, value: '1', type: 'arabic' },
  { id: 4, value: 'un', type: 'french' },
  { id: 5, value: '2', type: 'arabic' },
  { id: 6, value: 'deux', type: 'french' },
  { id: 7, value: '3', type: 'arabic' },
  { id: 8, value: 'trois', type: 'french' },
  { id: 9, value: '4', type: 'arabic' },
  { id: 10, value: 'quatre', type: 'french' },
  { id: 11, value: '5', type: 'arabic' },
  { id: 12, value: 'cinq', type: 'french' },
  { id: 13, value: '6', type: 'arabic' },
  { id: 14, value: 'six', type: 'french' },
  { id: 15, value: '7', type: 'arabic' },
  { id: 16, value: 'sept', type: 'french' },
  { id: 17, value: '8', type: 'arabic' },
  { id: 18, value: 'huit', type: 'french' },
  { id: 19, value: '9', type: 'arabic' },
  { id: 20, value: 'neuf', type: 'french' },
  { id: 21, value: '10', type: 'arabic' },
  { id: 22, value: 'dix', type: 'french' }
];

// 匹配规则
const matchingPairs = {
  '0': 'zéro',
  '1': 'un',
  '2': 'deux',
  '3': 'trois',
  '4': 'quatre',
  '5': 'cinq',
  '6': 'six',
  '7': 'sept',
  '8': 'huit',
  '9': 'neuf',
  '10': 'dix'
};

export default function Home() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  // 初始化游戏
  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    // 洗牌
    const shuffledCards = [...numberPairs].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameComplete(false);
  };

  const handleCardClick = (index) => {
    // 如果已经翻开或匹配，则不处理
    if (flippedCards.includes(index) || matchedPairs.includes(index)) {
      return;
    }

    // 如果已经有两张牌翻开，则不处理
    if (flippedCards.length >= 2) {
      return;
    }

    // 翻开卡片
    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    // 如果翻开了两张牌，检查是否匹配
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const card1 = cards[newFlippedCards[0]];
      const card2 = cards[newFlippedCards[1]];
      
      // 检查是否是一对（一个阿拉伯数字和一个法语数字）
      const isValidPair = 
        (card1.type === 'arabic' && card2.type === 'french') || 
        (card1.type === 'french' && card2.type === 'arabic');
      
      // 检查值是否匹配
      let isMatch = false;
      
      if (isValidPair) {
        const arabicCard = card1.type === 'arabic' ? card1 : card2;
        const frenchCard = card1.type === 'french' ? card1 : card2;
        
        isMatch = matchingPairs[arabicCard.value] === frenchCard.value;
      }
      
      if (isMatch) {
        // 匹配成功
        setTimeout(() => {
          const newMatchedPairs = [...matchedPairs, ...newFlippedCards];
          setMatchedPairs(newMatchedPairs);
          setFlippedCards([]);
          
          // 检查游戏是否完成
          if (newMatchedPairs.length === cards.length) {
            setGameComplete(true);
          }
        }, 500);
      } else {
        // 匹配失败
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>数字翻翻牌 - 阿拉伯数字与法语匹配</title>
        <meta name="description" content="Match Arabic numerals with their French equivalents" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          数字翻翻牌 - 阿拉伯数字与法语匹配
        </h1>

        <p className={styles.description}>
          将阿拉伯数字 (0-10) 与对应的法语数字匹配起来！
        </p>

        <div className={styles.gameContainer}>
          {cards.map((card, index) => (
            <div 
              key={card.id}
              className={`${styles.card} ${flippedCards.includes(index) ? styles.flipped : ''} ${matchedPairs.includes(index) ? styles.matched : ''}`}
              onClick={() => handleCardClick(index)}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardFront}>?</div>
                <div className={`${styles.cardBack} ${card.type === 'french' ? styles.french : ''}`}>
                  {card.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.controls}>
          <button onClick={initGame} className={styles.button}>重新开始</button>
        </div>

        <div className={styles.score}>
          翻牌次数: {moves}
        </div>

        {gameComplete && (
          <div className={styles.gameComplete}>
            恭喜你完成了游戏！共用了 {moves} 次翻牌。
          </div>
        )}
      </main>
    </div>
  );
}