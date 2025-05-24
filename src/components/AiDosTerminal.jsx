import React, { useState, useEffect, useRef, useCallback } from 'react';
import './AiDosTerminal.css';

function AiDosTerminal({ onClose }) {
  const [currentInput, setCurrentInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPath] = useState('C:\\AI-DOS>');
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // AI DOS startup sequence
  useEffect(() => {
    const startupSequence = [
      'AI-DOS Version 1.0 [Advanced Intelligence Operating System]',
      'Copyright (C) 2024 Weyland Corporation',
      '',
      'Initializing AI Neural Networks... OK',
      'Loading Knowledge Base... OK', 
      'Establishing Connection to LLM Core... OK',
      '',
      'AI-DOS is ready. Type HELP for available commands.',
      'For AI assistance, simply ask any question.',
      ''
    ];

    let delay = 0;
    startupSequence.forEach((line, index) => {
      setTimeout(() => {
        setTerminalHistory(prev => [...prev, { type: 'system', content: line }]);
      }, delay);
      delay += index === 2 || index === 6 ? 500 : 100; // Longer delays after empty lines
    });
  }, []);

  // Scroll to bottom when history updates
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // AI response generation (simulated LLM responses)
  const generateAiResponse = useCallback(async (input) => {
    const lowerInput = input.toLowerCase().trim();
    
    // Command responses
    if (lowerInput === 'help') {
      return [
        'AI-DOS Commands:',
        '',
        'HELP          - Show this help screen',
        'DIR           - List directory contents', 
        'CLS           - Clear screen',
        'TIME          - Display current time',
        'DATE          - Display current date',
        'VER           - Show AI-DOS version',
        'EXIT          - Exit AI-DOS',
        '',
        'AI Features:',
        'Ask any question and I will respond with AI assistance.',
        'Examples: "What is programming?", "Explain quantum physics"',
        '          "Write a poem", "Help me debug code"'
      ];
    }
    
    if (lowerInput === 'dir') {
      return [
        'Volume in drive C has no label.',
        'Volume Serial Number is 1337-BEEF',
        '',
        'Directory of C:\\AI-DOS',
        '',
        '12-15-24  09:30a    <DIR>          .',
        '12-15-24  09:30a    <DIR>          ..',
        '12-15-24  09:25a           42,000  NEURAL.NET',
        '12-15-24  09:25a        1,337,000  KNOWLEDGE.DAT',
        '12-15-24  09:25a           98,765  LANGUAGE.MDL',
        '12-15-24  09:25a               88  CONFIG.SYS',
        '               4 File(s)      1,477,853 bytes',
        '               2 Dir(s)   999,999,999 bytes free'
      ];
    }
    
    if (lowerInput === 'cls') {
      setTerminalHistory([]);
      return [];
    }
    
    if (lowerInput === 'time') {
      return [`Current time is: ${new Date().toLocaleTimeString()}`];
    }
    
    if (lowerInput === 'date') {
      return [`Current date is: ${new Date().toLocaleDateString()}`];
    }
    
    if (lowerInput === 'ver') {
      return [
        'AI-DOS Version 1.0',
        'Neural Network Engine: GPT-Compatible',
        'Knowledge Cutoff: 2024',
        'Weyland Corporation AI Division'
      ];
    }
    
    if (lowerInput === 'exit') {
      onClose();
      return [];
    }

    // AI responses for questions/general input
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return [
        'Hello! I am AI-DOS, your intelligent command-line assistant.',
        'I combine the classic DOS interface with modern AI capabilities.',
        'How can I help you today?'
      ];
    }

    if (lowerInput.includes('what') && lowerInput.includes('programming')) {
      return [
        'Programming is the process of creating computer software using',
        'programming languages. It involves writing instructions that',
        'tell a computer how to perform specific tasks.',
        '',
        'Key concepts include:',
        '• Variables and data types',
        '• Control structures (loops, conditionals)',  
        '• Functions and procedures',
        '• Object-oriented programming',
        '• Algorithms and data structures'
      ];
    }

    if (lowerInput.includes('quantum') && lowerInput.includes('physics')) {
      return [
        'Quantum physics is the branch of physics that studies matter',
        'and energy at the smallest scales - typically atoms and',
        'subatomic particles.',
        '',
        'Key principles:',
        '• Wave-particle duality',
        '• Quantum superposition', 
        '• Quantum entanglement',
        '• Heisenberg uncertainty principle',
        '',
        'Applications include quantum computing, lasers, and MRI.'
      ];
    }

    if (lowerInput.includes('poem') || lowerInput.includes('poetry')) {
      return [
        'Here is a DOS-themed poem for you:',
        '',
        '  In directories deep and file systems wide,',
        '  Where prompts and cursors do reside,',
        '  The AI awakens with knowledge vast,',
        '  Bridging futures with computing past.',
        '',
        '  C:\\ beckons with mysteries untold,',
        '  While neural networks, brave and bold,',
        '  Process queries in silicon dreams,',
        '  Where nothing is quite what it seems.'
      ];
    }

    if (lowerInput.includes('debug') || lowerInput.includes('code')) {
      return [
        'Debugging is the process of finding and fixing errors in code.',
        '',
        'Common debugging strategies:',
        '1. Read error messages carefully',
        '2. Use print/console.log statements',
        '3. Step through code line by line',
        '4. Check variable values at key points',
        '5. Use debugging tools and IDE features',
        '6. Test with different inputs',
        '',
        'Remember: Every bug is a learning opportunity!'
      ];
    }

    if (lowerInput.includes('ai') || lowerInput.includes('artificial intelligence')) {
      return [
        'Artificial Intelligence (AI) refers to computer systems that',
        'can perform tasks that typically require human intelligence.',
        '',
        'Types of AI:',
        '• Narrow AI (current): Specialized for specific tasks',
        '• General AI (future): Human-level intelligence across domains',
        '',
        'Current applications:',
        '• Natural language processing',
        '• Computer vision',
        '• Machine learning',
        '• Autonomous vehicles',
        '• Game playing (chess, Go)',
        '',
        'I am an example of narrow AI focused on conversation!'
      ];
    }

    // Generic AI response for unrecognized input
    return [
      'I understand you said: "' + input + '"',
      '',
      'As an AI-DOS system, I can help with various topics including:',
      '• Technology and programming questions',
      '• General knowledge and explanations', 
      '• Creative tasks like writing',
      '• Problem-solving assistance',
      '',
      'Try asking me something specific, or type HELP for commands.'
    ];
  }, [onClose]);

  const handleInputSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!currentInput.trim() || isProcessing) return;

    const input = currentInput.trim();
    
    // Add user input to history
    setTerminalHistory(prev => [...prev, { type: 'input', content: `${currentPath} ${input}` }]);
    setCurrentInput('');
    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(async () => {
      const response = await generateAiResponse(input);
      
      // Add response to history
      response.forEach(line => {
        setTerminalHistory(prev => [...prev, { type: 'output', content: line }]);
      });
      
      setIsProcessing(false);
    }, Math.random() * 1000 + 500); // 500-1500ms delay
  }, [currentInput, currentPath, isProcessing, generateAiResponse]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  return (
    <div className="ai-dos-terminal" onKeyDown={handleKeyDown} tabIndex={-1}>
      <div className="ai-dos-terminal-header">
        <div className="ai-dos-title">🤖 AI-DOS v1.0 - Artificial Intelligence Command Line</div>
        <button className="ai-dos-close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="ai-dos-terminal-content" ref={terminalRef}>
        {terminalHistory.map((line, index) => (
          <div key={index} className={`terminal-line ${line.type}`}>
            {line.content}
          </div>
        ))}
        
        {isProcessing && (
          <div className="terminal-line processing">
            <span className="processing-indicator">Processing</span>
            <span className="blinking-dots">...</span>
          </div>
        )}
        
        <form onSubmit={handleInputSubmit} className="input-line">
          <span className="prompt">{currentPath}</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            className="terminal-input"
            disabled={isProcessing}
            autoComplete="off"
            spellCheck={false}
          />
          <span className="cursor">_</span>
        </form>
      </div>
    </div>
  );
}

export default AiDosTerminal; 