import React, { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  velocity: { x: number; y: number; rotation: number };
}

const Confetti: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];

  useEffect(() => {
    if (isActive) {
      // Create confetti pieces
      const newPieces: ConfettiPiece[] = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocity: {
          x: (Math.random() - 0.5) * 8,
          y: Math.random() * 3 + 2,
          rotation: (Math.random() - 0.5) * 10
        }
      }));

      setPieces(newPieces);

      // Animate confetti with requestAnimationFrame for better performance
      let animationId: number;
      const animate = () => {
        setPieces(prevPieces => 
          prevPieces.map(piece => ({
            ...piece,
            x: piece.x + piece.velocity.x,
            y: piece.y + piece.velocity.y,
            rotation: piece.rotation + piece.velocity.rotation,
            velocity: {
              ...piece.velocity,
              y: piece.velocity.y + 0.1 // gravity
            }
          })).filter(piece => piece.y < window.innerHeight + 50)
        );
        animationId = requestAnimationFrame(animate);
      };
      animationId = requestAnimationFrame(animate);

      return () => cancelAnimationFrame(animationId);
    } else {
      setPieces([]);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map(piece => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: piece.x,
            top: piece.y,
            transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
            backgroundColor: piece.color,
            boxShadow: `0 0 4px ${piece.color}`
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
