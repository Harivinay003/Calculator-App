"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Plus, Minus, X, Divide, Delete, Equal } from 'lucide-react';

const performCalculation: { [key: string]: (a: number, b: number) => number } = {
  '/': (first, second) => first / second,
  '*': (first, second) => first * second,
  '+': (first, second) => first + second,
  '-': (first, second) => first - second,
};

export function Calculator() {
  const [displayValue, setDisplayValue] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [equation, setEquation] = useState('');

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplayValue('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
      setOperator(nextOperator);
      setEquation((prev) => prev.slice(0, -2) + ` ${nextOperator} `);
      return;
    }

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      if (operator === '/' && inputValue === 0) {
        setDisplayValue('Error');
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(true);
        setEquation('');
        return;
      }
      const result = performCalculation[operator](firstOperand, inputValue);
      const resultString = String(parseFloat(result.toPrecision(12)));

      setDisplayValue(resultString);
      setFirstOperand(result);
    }
    
    setEquation(displayValue + ` ${nextOperator} `);
    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };
  
  const handleEquals = () => {
    if (!operator || firstOperand === null) return;

    const secondOperand = parseFloat(displayValue);
    if (operator === '/' && secondOperand === 0) {
      setDisplayValue('Error');
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(true);
      setEquation('');
      return;
    }
    
    const result = performCalculation[operator](firstOperand, secondOperand);
    const resultString = String(parseFloat(result.toPrecision(12)));
    
    setEquation((prev) => prev + displayValue + ' =');
    setDisplayValue(resultString);
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(true);
  };

  const clearAll = () => {
    setDisplayValue('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    setEquation('');
  };

  const handleDelete = () => {
    if (waitingForSecondOperand) return;
    setDisplayValue(displayValue.length > 1 ? displayValue.slice(0, -1) : '0');
  };

  const buttonClass = 'h-16 text-2xl rounded-xl shadow-md active:shadow-inner focus-visible:ring-offset-0 focus-visible:ring-2';
  const numberButtonClass = 'bg-card hover:bg-muted dark:bg-secondary dark:hover:bg-accent/50 text-foreground';
  const opButtonClass = 'bg-accent/80 hover:bg-accent text-accent-foreground';
  const specialButtonClass = 'bg-muted hover:bg-muted/70 text-foreground';


  return (
    <Card className="w-full max-w-xs mx-auto shadow-2xl rounded-3xl bg-card/60 backdrop-blur-sm border-2 border-white/20">
      <CardHeader>
        <CardTitle className="text-center text-xl font-light text-muted-foreground tracking-widest">CALC</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="bg-black/20 text-right rounded-xl p-4 mb-4 overflow-hidden shadow-inner">
          <p className="text-xl font-mono text-muted-foreground h-7 break-all" style={{ wordBreak: 'break-word' }}>
            {equation || ' '}
          </p>
          <p className="text-5xl font-mono text-foreground break-all" style={{ wordBreak: 'break-word' }}>
            {displayValue}
          </p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <Button onClick={clearAll} className={cn(buttonClass, 'col-span-2', specialButtonClass)}>AC</Button>
          <Button onClick={handleDelete} className={cn(buttonClass, specialButtonClass)}><Delete size={24} /></Button>
          <Button onClick={() => handleOperator('/')} className={cn(buttonClass, opButtonClass)}><Divide size={24} /></Button>

          <Button onClick={() => inputDigit('7')} className={cn(buttonClass, numberButtonClass)}>7</Button>
          <Button onClick={() => inputDigit('8')} className={cn(buttonClass, numberButtonClass)}>8</Button>
          <Button onClick={() => inputDigit('9')} className={cn(buttonClass, numberButtonClass)}>9</Button>
          <Button onClick={() => handleOperator('*')} className={cn(buttonClass, opButtonClass)}><X size={24} /></Button>

          <Button onClick={() => inputDigit('4')} className={cn(buttonClass, numberButtonClass)}>4</Button>
          <Button onClick={() => inputDigit('5')} className={cn(buttonClass, numberButtonClass)}>5</Button>
          <Button onClick={() => inputDigit('6')} className={cn(buttonClass, numberButtonClass)}>6</Button>
          <Button onClick={() => handleOperator('-')} className={cn(buttonClass, opButtonClass)}><Minus size={24} /></Button>

          <Button onClick={() => inputDigit('1')} className={cn(buttonClass, numberButtonClass)}>1</Button>
          <Button onClick={() => inputDigit('2')} className={cn(buttonClass, numberButtonClass)}>2</Button>
          <Button onClick={() => inputDigit('3')} className={cn(buttonClass, numberButtonClass)}>3</Button>
          <Button onClick={() => handleOperator('+')} className={cn(buttonClass, opButtonClass)}><Plus size={24} /></Button>

          <Button onClick={() => inputDigit('0')} className={cn(buttonClass, 'col-span-2', numberButtonClass)}>0</Button>
          <Button onClick={inputDecimal} className={cn(buttonClass, numberButtonClass)}>.</Button>
          <Button onClick={handleEquals} className={cn(buttonClass, 'bg-primary hover:bg-primary/80 text-primary-foreground')}><Equal size={24} /></Button>
        </div>
      </CardContent>
    </Card>
  );
}
