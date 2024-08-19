import React, { useEffect } from 'react'
import { animated, useSpring } from 'react-spring'

interface EmojiProps {
  emoji: string;
  speed: number;
}

const Emoji: React.FC<EmojiProps> = ({ emoji, speed }) => {
  const [{ x, y }, set] = useSpring(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    config: { duration: 2000 / speed },
  }));

  useEffect(() => {
    const move = () => {
      set({
        x: Math.random() * 100,
        y: Math.random() * 100,
        config: { duration: 2000 / speed },
      });
    };

    move();

    const interval = setInterval(move, 2000 / speed);

    return () => clearInterval(interval);
  }, [speed, set]);

  return (
    <animated.div
      style={{
        display: 'inline-block',
        fontSize: '2rem',
        position: 'absolute',
        transform: x.to((x) => `translate(${x}vw, ${y.get()}vh)`),
        
      }}
    >
      {emoji}
    </animated.div>
  );
};

export default Emoji;
