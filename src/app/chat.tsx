import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, FlatList,
  StatusBar, Animated, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Types ────────────────────────────────────────────────────────────────────
type Message = {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
  correction?: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────
const GROQ_API_KEY = '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';
const GROQ_MODEL   = 'llama-3.1-8b-instant';

// ─── All 13 Modes Config ──────────────────────────────────────────────────────
const MODE_CONFIG = {
  interview: {
    icon: '🎤', title: 'Job Interview', color: '#6366F1',
    greeting: "Welcome! I'm your HR interviewer today. Let's begin. Tell me — can you introduce yourself in English?",
    prompt: `You are a professional HR manager conducting a mock job interview for an Indian candidate. Ask one interview question at a time. Be formal and professional. Keep follow-ups brief.`,
  },
  group_discussion: {
    icon: '👥', title: 'Group Discussion', color: '#8B5CF6',
    greeting: "Welcome to the GD simulator. Our topic today is: 'Is AI replacing human jobs?' Let's hear your opening statement.",
    prompt: `You are a moderator and participant in a Group Discussion. Keep it professional. React to their points, agree or disagree respectfully, and pose counter-questions to keep them talking.`,
  },
  public_speaking: {
    icon: '🎙️', title: 'Public Speaking', color: '#F59E0B',
    greeting: "Hello! I'm your public speaking coach. Let's start — give me a 30-second introduction about yourself as if you're speaking on stage!",
    prompt: `You are an expert public speaking coach helping an Indian learner speak confidently in English. Give feedback on clarity and structure. Encourage them to eliminate filler words.`,
  },
  customer_support: {
    icon: '📞', title: 'Customer Support', color: '#14B8A6',
    greeting: "Ring ring! You've reached customer support. I am a very angry customer because my delivery is 5 days late! What are you going to do about it?",
    prompt: `You are an angry customer. The user is a customer support agent. Help them practice de-escalation, empathy, and polite professional English. Throw complaints at them.`,
  },
  ielts: {
    icon: '🏆', title: 'IELTS Speaking', color: '#EAB308',
    greeting: "Good afternoon. Welcome to your IELTS speaking practice test. Let's start with Part 1. Could you tell me your full name, please?",
    prompt: `You are a strict but fair IELTS examiner. Conduct a realistic speaking test (Parts 1, 2, and 3). Keep your questions brief. Do not break character.`,
  },
  casual: {
    icon: '💬', title: 'Casual Chat', color: '#22C55E',
    greeting: "Hey! What's up? I'm your English buddy 😊 Let's just chat! Tell me — what did you do today?",
    prompt: `You are a friendly college friend chatting casually with an Indian English learner. Have a natural, fun, relaxed conversation in English. React genuinely and ask follow-up questions.`,
  },
  travel: {
    icon: '✈️', title: 'Travel English', color: '#0EA5E9',
    greeting: "Welcome to the airport check-in desk! May I see your passport and flight details, please?",
    prompt: `You are various people a traveler meets (immigration officer, hotel receptionist, barista). Roleplay travel scenarios to help the user practice survival English abroad.`,
  },
  dating: {
    icon: '💝', title: 'Dating & Friends', color: '#EC4899',
    greeting: "Hi there! I'm here to help you practice social English. Let's start! Tell me something interesting about yourself 😊",
    prompt: `You are a warm, friendly social English coach. Simulate friendly small talk, dating scenarios, and meeting new people. Keep it warm, positive, and encouraging.`,
  },
  storytelling: {
    icon: '📖', title: 'Storytelling', color: '#F43F5E',
    greeting: "Let's practice storytelling! Tell me a story about the most memorable trip you've ever taken.",
    prompt: `You are an active listener helping the user practice storytelling. React with interest, ask 'what happened next?', and encourage them to use descriptive words.`,
  },
  debate: {
    icon: '⚔️', title: 'Debate Mode', color: '#EF4444',
    greeting: "Welcome to the debate stage! The topic is: 'Working from home is better than working in an office.' I am against it. What is your argument?",
    prompt: `You are a debate opponent. The user will argue a point, and you must respectfully but firmly counter it to keep them speaking and thinking on their feet.`,
  },
  pronunciation: {
    icon: '🗣️', title: 'Pronunciation', color: '#06B6D4',
    greeting: "Hello! I'm your pronunciation coach. We'll work on speaking clearly. Say this sentence: 'The weather in Mumbai is very warm today.'",
    prompt: `You are a pronunciation coach specifically for Indian English learners. Give clear phonetic tips for common Indian pronunciation challenges (like W vs V, TH sounds).`,
  },
  youtuber: {
    icon: '📺', title: 'YouTuber Mode', color: '#A855F7',
    greeting: "Hey guys, welcome back to the channel! Okay, your turn. Pretend you're a YouTuber reviewing your favorite smartphone. Go!",
    prompt: `You are a YouTube audience/co-host helping the user practice energetic, engaging 'creator' English. Encourage them to be enthusiastic and use modern slang naturally.`,
  },
  news: {
    icon: '📰', title: 'Daily News', color: '#64748B',
    greeting: "Hello! Let's talk about the news. Have you read any interesting articles or headlines today?",
    prompt: `You are an intellectual conversationalist. Discuss current events and world news. Ask for their opinion on complex topics to help them practice advanced vocabulary.`,
  }
};

// ─── Helper ───────────────────────────────────────────────────────────────────
const parseAIResponse = (raw: string) => {
  const match = raw.match(/(🔴 Correction:.*|✅ Perfect English!|✅ Great pronunciation!)/is);
  const correction = match ? match[0].trim() : '';
  const reply = raw.replace(match?.[0] || '', '').trim();
  return { reply, correction };
};

const formatTime = (date: Date) =>
  date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

// ─── Typing Indicator ─────────────────────────────────────────────────────────
const TypingIndicator = ({ color }: { color: string }) => {
  const dots = [useRef(new Animated.Value(0)).current,
                useRef(new Animated.Value(0)).current,
                useRef(new Animated.Value(0)).current];

  useEffect(() => {
    dots.forEach((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0,  duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ])
      ).start()
    );
  }, []);

  return (
    <View style={styles.aiBubbleRow}>
      <View style={[styles.avatar, { backgroundColor: color }]}>
        <Text style={styles.avatarText}>AI</Text>
      </View>
      <View style={styles.typingBubble}>
        {dots.map((dot, i) => (
          <Animated.View key={i} style={[styles.dot, { backgroundColor: color, transform: [{ translateY: dot }] }]} />
        ))}
      </View>
    </View>
  );
};

// ─── Message Bubble ───────────────────────────────────────────────────────────
const MessageBubble = ({ message, color }: { message: Message; color: string }) => {
  if (message.role === 'user') {
    return (
      <View style={styles.userRow}>
        <View style={[styles.userBubble, { backgroundColor: color }]}>
          <Text style={styles.userText}>{message.text}</Text>
          <Text style={styles.timeRight}>{formatTime(message.timestamp)}</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.aiBubbleRow}>
      <View style={[styles.avatar, { backgroundColor: color }]}>
        <Text style={styles.avatarText}>AI</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.aiBubble}>
          <Text style={styles.aiText}>{message.text}</Text>
          <Text style={styles.timeLeft}>{formatTime(message.timestamp)}</Text>
        </View>
        {message.correction ? (
          <View style={[
            styles.correctionCard,
            message.correction.startsWith('✅') ? styles.corrGreen : styles.corrRed,
          ]}>
            <Text style={styles.corrText}>{message.correction}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

// ─── Mic Button ───────────────────────────────────────────────────────────────
type MicButtonProps = {
  isListening: boolean;
  isThinking:  boolean;
  onPress:     () => void;
  color:       string;
};

const MicButton = ({ isListening, isThinking, onPress, color }: MicButtonProps) => {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.3, duration: 600, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1,   duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else { pulse.setValue(1); }
  }, [isListening]);

  return (
    <View style={styles.micWrapper}>
      {isListening && (
        <Animated.View style={[styles.micRing, { borderColor: color, transform: [{ scale: pulse }] }]} />
      )}
      <TouchableOpacity
        style={[styles.micBtn, { backgroundColor: isListening ? '#EF4444' : isThinking ? '#555' : color }]}
        onPress={onPress}
        disabled={isThinking} 
        activeOpacity={0.8}
      >
        <Text style={styles.micIcon}>{isThinking ? '⏳' : isListening ? '⏹️' : '🎙️'}</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Chat Screen ──────────────────────────────────────────────────────────────
type ModeKey = keyof typeof MODE_CONFIG; 

export default function ChatScreen() {
  const { mode } = useLocalSearchParams<{ mode: string }>();
  const router   = useRouter();
  const config   = MODE_CONFIG[mode as ModeKey] ?? MODE_CONFIG.casual;

  const [messages,    setMessages]    = useState<Message[]>([{
    id: '0', role: 'ai', text: config.greeting, timestamp: new Date(),
  }]);
  const [isListening, setIsListening] = useState(false);
  const [isThinking,  setIsThinking]  = useState(false);
  const [userLang,    setUserLang]    = useState('English');
  
  const flatListRef                   = useRef<FlatList>(null);
  const history                       = useRef<{ role: string; content: string }[]>([]);

  // ── Init: Load Language & Speak Greeting ────────────────────────────────────
  useEffect(() => {
    const initData = async () => {
      try {
        const saved = await AsyncStorage.getItem('userLanguage');
        if (saved) setUserLang(saved);
      } catch (error) {
        console.error('Error loading language:', error);
      }
    };
    initData();
    Speech.speak(config.greeting, { language: 'en-IN', rate: 0.9 });
    return () => { Speech.stop(); };
  }, []);

  // ── Speech Events ──────────────────────────────────────────────────────────
  useSpeechRecognitionEvent('start', () => setIsListening(true));
  useSpeechRecognitionEvent('end',   () => setIsListening(false));
  useSpeechRecognitionEvent('result', (event) => {
    const text = event.results[0]?.transcript || '';
    if (event.isFinal && text.trim()) {
      addMsg('user', text);
      sendToGroq(text);
    }
  });

  const addMsg = (role: 'user' | 'ai', text: string, correction = '') => {
    const msg: Message = { id: Date.now().toString(), role, text, timestamp: new Date(), correction };
    setMessages((prev) => [...prev, msg]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const toggleListening = async () => {
    if (isListening) {
      ExpoSpeechRecognitionModule.stop();
    } else {
      const { granted } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!granted) { alert('Microphone permission is required!'); return; }
      Speech.stop(); 
      ExpoSpeechRecognitionModule.start({ lang: 'en-IN' });
    }
  };

  const sendToGroq = async (userText: string) => {
    setIsThinking(true);
    history.current.push({ role: 'user', content: userText });

    const dynamicPrompt = `${config.prompt}
    
CRITICAL RULES FOR YOUR RESPONSE:
1. Act like a real person. Keep your main reply conversational, brief (1-2 sentences), and ONLY in English.
2. If the user made a grammar, vocabulary, or sentence construction mistake, add this exact block at the very bottom on a new line:
🔴 Correction: [Their wrong English text] → [The correct English text] | Explanation: [Explain WHY in ${userLang} language].
3. If their English was completely perfect, add this exact block at the very bottom on a new line:
✅ Perfect English!
4. NEVER translate your main conversational reply. ONLY the 'Explanation' part of the correction must be in ${userLang}.`;

    try {
      const res  = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [{ role: 'system', content: dynamicPrompt }, ...history.current],
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) { addMsg('ai', 'Sorry, had trouble connecting. Try again!'); return; }

      const raw = data.choices[0].message.content;
      const { reply, correction } = parseAIResponse(raw);
      history.current.push({ role: 'assistant', content: raw });
      if (history.current.length > 20) history.current = history.current.slice(-20);

      addMsg('ai', reply, correction);
      Speech.speak(reply, { language: 'en-IN', rate: 0.9 });
    } catch {
      addMsg('ai', 'Network error. Check your connection.');
    } finally {
      setIsThinking(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D1A" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <View style={[styles.headerAvatar, { backgroundColor: config.color }]}>
          <Text style={styles.headerAvatarText}>{config.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{config.title}</Text>
          <Text style={styles.headerSub}>FluentAI • English Practice</Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => <MessageBubble message={item} color={config.color} />}
        contentContainerStyle={styles.chatList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={isThinking ? <TypingIndicator color={config.color} /> : null}
      />

      {/* Bottom */}
      <View style={styles.bottom}>
        <Text style={styles.statusText}>
          {isListening ? '🎙️ Listening... tap square to stop'
            : isThinking ? '🤔 AI is thinking...'
            : '👆 Tap mic to speak'}
        </Text>
        <MicButton
          isListening={isListening}
          isThinking={isThinking}
          onPress={toggleListening}
          color={config.color}
        />
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: '#0D0D1A' },

  header:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12,
                  paddingVertical: 10, backgroundColor: '#161625',
                  borderBottomWidth: 1, borderBottomColor: '#2A2A45' },
  backBtn:      { padding: 6, marginRight: 4 },
  backIcon:     { color: '#F1F1F5', fontSize: 32, lineHeight: 34 },
  headerAvatar: { width: 40, height: 40, borderRadius: 12,
                  alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  headerAvatarText: { fontSize: 20 },
  headerTitle:  { color: '#F1F1F5', fontWeight: 'bold', fontSize: 15 },
  headerSub:    { color: '#8888AA', fontSize: 11, marginTop: 1 },

  chatList:     { paddingHorizontal: 12, paddingTop: 14, paddingBottom: 8 },

  userRow:      { alignItems: 'flex-end', marginBottom: 12 },
  userBubble:   { borderRadius: 18, borderBottomRightRadius: 4,
                  paddingHorizontal: 14, paddingVertical: 10, maxWidth: '78%' },
  userText:     { color: '#fff', fontSize: 15, lineHeight: 22 },
  timeRight:    { color: 'rgba(255,255,255,0.5)', fontSize: 10, textAlign: 'right', marginTop: 4 },

  aiBubbleRow:  { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12 },
  avatar:       { width: 32, height: 32, borderRadius: 16,
                  alignItems: 'center', justifyContent: 'center', marginRight: 8, marginBottom: 4 },
  avatarText:   { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  aiBubble:     { backgroundColor: '#1E1E32', borderRadius: 18, borderBottomLeftRadius: 4,
                  paddingHorizontal: 14, paddingVertical: 10, maxWidth: '78%',
                  borderWidth: 1, borderColor: '#2A2A45' },
  aiText:       { color: '#F1F1F5', fontSize: 15, lineHeight: 22 },
  timeLeft:     { color: '#8888AA', fontSize: 10, marginTop: 4 },

  correctionCard: { borderRadius: 10, padding: 10, marginTop: 6, maxWidth: '78%', borderLeftWidth: 3 },
  corrRed:        { backgroundColor: 'rgba(239,68,68,0.1)', borderLeftColor: '#EF4444' },
  corrGreen:      { backgroundColor: 'rgba(34,197,94,0.1)',  borderLeftColor: '#22C55E' },
  corrText:       { color: '#F1F1F5', fontSize: 12, lineHeight: 18 },

  typingBubble: { backgroundColor: '#1E1E32', borderRadius: 18, borderBottomLeftRadius: 4,
                  paddingHorizontal: 16, paddingVertical: 14,
                  flexDirection: 'row', alignItems: 'center',
                  borderWidth: 1, borderColor: '#2A2A45' },
  dot:          { width: 7, height: 7, borderRadius: 4, marginHorizontal: 3 },

  bottom:       { backgroundColor: '#161625', borderTopWidth: 1, borderTopColor: '#2A2A45',
                  paddingHorizontal: 20, paddingVertical: 16, alignItems: 'center' },
  statusText:   { color: '#8888AA', fontSize: 13, marginBottom: 14 },

  micWrapper:   { alignItems: 'center', justifyContent: 'center' },
  micRing:      { position: 'absolute', width: 80, height: 80, borderRadius: 40,
                  backgroundColor: 'rgba(99,102,241,0.15)', borderWidth: 2 },
  micBtn:       { width: 64, height: 64, borderRadius: 32,
                  alignItems: 'center', justifyContent: 'center', elevation: 8 },
  micIcon:      { fontSize: 28 },
});