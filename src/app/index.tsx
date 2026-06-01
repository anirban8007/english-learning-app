import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Categorized Mode Data ────────────────────────────────────────────────────
const CATEGORIES = [
  {
    title: '🟢 Career & Academic',
    modes: [
      { id: 'interview', icon: '🎤', title: 'Job Interview Practice', subtitle: 'Practice with an HR manager', color: '#6366F1', lightColor: 'rgba(99,102,241,0.15)' },
      { id: 'group_discussion', icon: '👥', title: 'Group Discussion (GD)', subtitle: 'Stand out in a GD round', color: '#8B5CF6', lightColor: 'rgba(139,92,246,0.15)' },
      { id: 'public_speaking', icon: '🎙️', title: 'Public Speaking', subtitle: 'Build confidence & clarity', color: '#F59E0B', lightColor: 'rgba(245,158,11,0.15)' },
      { id: 'customer_support', icon: '📞', title: 'Customer Support', subtitle: 'Handle angry customers politely', color: '#14B8A6', lightColor: 'rgba(20,184,166,0.15)' },
      { id: 'ielts', icon: '🏆', title: 'IELTS Speaking', subtitle: 'Simulated exam practice', color: '#EAB308', lightColor: 'rgba(234,179,8,0.15)' },
    ]
  },
  {
    title: '🔵 Daily Life',
    modes: [
      { id: 'casual', icon: '💬', title: 'Casual Conversation', subtitle: 'Friendly everyday English', color: '#22C55E', lightColor: 'rgba(34,197,94,0.15)' },
      { id: 'travel', icon: '✈️', title: 'Travel English', subtitle: 'Airport, hotel & cafes', color: '#0EA5E9', lightColor: 'rgba(14,165,233,0.15)' },
      { id: 'dating', icon: '💝', title: 'Dating & Friends', subtitle: 'Social & confident English', color: '#EC4899', lightColor: 'rgba(236,72,153,0.15)' },
      { id: 'storytelling', icon: '📖', title: 'Storytelling Practice', subtitle: 'Share experiences engagingly', color: '#F43F5E', lightColor: 'rgba(244,63,94,0.15)' },
    ]
  },
  {
    title: '🟡 Skill Building',
    modes: [
      { id: 'debate', icon: '⚔️', title: 'Debate Mode', subtitle: 'Argue and counter-argue', color: '#EF4444', lightColor: 'rgba(239,68,68,0.15)' },
      { id: 'pronunciation', icon: '🗣️', title: 'Pronunciation', subtitle: 'Speak clearly like a native', color: '#06B6D4', lightColor: 'rgba(6,182,212,0.15)' },
      { id: 'youtuber', icon: '📺', title: 'Explain Like a YouTuber', subtitle: 'High energy & engaging', color: '#A855F7', lightColor: 'rgba(168,85,247,0.15)' },
      { id: 'news', icon: '📰', title: 'Daily News', subtitle: 'Discuss current events', color: '#64748B', lightColor: 'rgba(100,116,139,0.15)' },
    ]
  }
];

// ─── Mode Card ────────────────────────────────────────────────────────────────
type ModeCardProps = {
  mode: {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
    color: string;
    lightColor: string;
  };
  onPress: () => void;
};

const ModeCard = ({ mode, onPress }: ModeCardProps) => (
  <TouchableOpacity
    style={[styles.card, { backgroundColor: mode.lightColor, borderColor: mode.color }]}
    onPress={onPress}
    activeOpacity={0.75}
  >
    <View style={[styles.cardIconBox, { backgroundColor: mode.color }]}>
      <Text style={styles.cardIcon}>{mode.icon}</Text>
    </View>
    <View style={styles.cardText}>
      <Text style={styles.cardTitle}>{mode.title}</Text>
      <Text style={styles.cardSubtitle}>{mode.subtitle}</Text>
    </View>
    <Text style={[styles.cardArrow, { color: mode.color }]}>›</Text>
  </TouchableOpacity>
);

// ─── Home Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();

  const openMode = (modeId: string) => {
    router.push({ pathname: '/chat', params: { mode: modeId } });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D1A" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.appName}>🎙️ FluentAI</Text>
              <Text style={styles.tagline}>Your Personal English Tutor</Text>
            </View>
            <TouchableOpacity 
              style={styles.settingsBtn} 
              onPress={() => router.push('/settings')}
            >
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 Day 1 Streak</Text>
          </View>
        </View>

        {/* Mode Categories */}
        {CATEGORIES.map((category) => (
          <View key={category.title} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <View style={styles.cardList}>
              {category.modes.map((mode) => (
                <ModeCard
                  key={mode.id}
                  mode={mode}
                  onPress={() => openMode(mode.id)}
                />
              ))}
            </View>
          </View>
        ))}

        {/* Footer Tip */}
        <View style={styles.tip}>
          <Text style={styles.tipText}>
            💡 Tip: Practice daily for 10 minutes to improve fluency fast!
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea:        { flex: 1, backgroundColor: '#0D0D1A' },
  scroll:          { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },
  header:          { marginBottom: 32, width: '100%' },
  headerTopRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  appName:         { fontSize: 32, fontWeight: 'bold', color: '#F1F1F5', letterSpacing: 0.5 },
  tagline:         { fontSize: 15, color: '#8888AA', marginTop: 6 },
  settingsBtn:     { backgroundColor: '#1E1E32', width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2A2A45' },
  settingsIcon:    { fontSize: 20 },
  streakBadge:     { marginTop: 14, backgroundColor: '#1E1E32', borderRadius: 20,
                     paddingHorizontal: 16, paddingVertical: 6,
                     borderWidth: 1, borderColor: '#2A2A45', alignSelf: 'center' },
  streakText:      { color: '#F1F1F5', fontSize: 13, fontWeight: '600' },
  
  categoryContainer: { marginBottom: 28 },
  categoryTitle:   { fontSize: 18, fontWeight: 'bold', color: '#F1F1F5', marginBottom: 12, marginLeft: 4 },
  
  cardList:        { gap: 12 },
  card:            { flexDirection: 'row', alignItems: 'center', borderRadius: 16,
                     padding: 16, borderWidth: 1 },
  cardIconBox:     { width: 48, height: 48, borderRadius: 14,
                     alignItems: 'center', justifyContent: 'center' },
  cardIcon:        { fontSize: 24 },
  cardText:        { flex: 1, marginLeft: 14 },
  cardTitle:       { fontSize: 16, fontWeight: '700', color: '#F1F1F5' },
  cardSubtitle:    { fontSize: 12, color: '#8888AA', marginTop: 2 },
  cardArrow:       { fontSize: 28, fontWeight: '300', marginLeft: 8 },
  tip:             { marginTop: 10, backgroundColor: '#161625', borderRadius: 12,
                     padding: 14, borderWidth: 1, borderColor: '#2A2A45' },
  tipText:         { color: '#8888AA', fontSize: 13, lineHeight: 19, textAlign: 'center' },
});