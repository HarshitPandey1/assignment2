import { useRef } from 'react';

export function useSpringMotion({ onUpdate, onRest }) {
  const animationRef = useRef();
  const currentValue = useRef(0);
  const targetValue = useRef(0);
  const velocity = useRef(0);

  const setTarget = (value) => {
    targetValue.current = value;
    cancelAnimationFrame(animationRef.current);
    animate();
  };

  const animate = () => {
    const stiffness = 0.1;
    const damping = 0.8;

    const step = () => {
      const displacement = targetValue.current - currentValue.current;
      const springForce = displacement * stiffness;
      velocity.current = velocity.current * damping + springForce;
      currentValue.current += velocity.current;

      onUpdate(currentValue.current);

      if (Math.abs(velocity.current) < 0.5 && Math.abs(displacement) < 0.5) {
        currentValue.current = targetValue.current;
        velocity.current = 0;
        onUpdate(currentValue.current);
        if (onRest) onRest();
        return;
      }

      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
  };

  return setTarget;
}
