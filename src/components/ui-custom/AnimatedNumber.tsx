
import React, { useState, useEffect } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  formatOptions?: Intl.NumberFormatOptions;
  className?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1000,
  formatOptions = { style: 'currency', currency: 'USD' },
  className,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const endValue = value;
    const difference = endValue - startValue;
    
    const animateValue = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      
      if (elapsed < duration) {
        // Easing function for smoother animation
        const progress = elapsed / duration;
        const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
        
        setDisplayValue(startValue + difference * easedProgress);
        requestAnimationFrame(animateValue);
      } else {
        setDisplayValue(endValue);
      }
    };
    
    requestAnimationFrame(animateValue);
    
    return () => {
      // Cleanup function if needed
    };
  }, [value, duration]);
  
  return (
    <span className={className}>
      {displayValue.toLocaleString(undefined, formatOptions)}
    </span>
  );
};

export default AnimatedNumber;
