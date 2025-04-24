export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp?: Date;
}

export type Mode = 'full-ai' | 'ai-recommendations' | 'manual';
