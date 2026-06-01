import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGES = [
  { id: 'Hindi', label: '🇮🇳 Hindi' },
  { id: 'Bangla', label: '🇧🇩 Bangla' },
  { id: 'Hinglish', label: '💬 Hinglish' },
  { id: 'Benglish', label: '💬 Benglish' },
  { id: 'Tamil', label: '🌴 Tamil' },
  { id: 'Telugu', label: '🌶️ Telugu' },
  { id: 'Marathi', label: '🎭 Marathi' },
  { id: 'Gujarati', label: '💎 Gujarati' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState('English');

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLang = await AsyncStorage.getItem('userLanguage');
        if (savedLang) setSelectedLang(savedLang);
      } catch (error) {
        console.error('Error loading language:', error);
      }
    };
    loadLanguage();
  }, []);

  const saveLanguage = async (langId: string) => {
    try {
      await AsyncStorage.setItem('userLanguage', langId);
      setSelectedLang(langId);
      // FIX 5: Return to home screen immediately after selection
      router.back(); 
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D1A" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🌍 Explanation Language</Text>
          <Text style={styles.sectionSubtitle}>
            AI will explain your English mistakes in your chosen language.
          </Text>
        </View>

        <View style={styles.listContainer}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.id}
              style={styles.langRow}
              onPress={() => saveLanguage(lang.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.langText}>{lang.label}</Text>
              {selectedLang === lang.id && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.version}>App Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0D0D1A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#161625', borderBottomWidth: 1, borderBottomColor: '#2A2A45' },
  backBtn: { padding: 6, width: 40 },
  backIcon: { color: '#F1F1F5', fontSize: 32, lineHeight: 34 },
  headerTitle: { color: '#F1F1F5', fontWeight: 'bold', fontSize: 18 },
  scroll: { padding: 20 },
  sectionHeader: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#F1F1F5', marginBottom: 6 },
  sectionSubtitle: { fontSize: 13, color: '#8888AA', lineHeight: 19 },
  listContainer: { backgroundColor: '#1E1E32', borderRadius: 16, borderWidth: 1, borderColor: '#2A2A45', overflow: 'hidden' },
  langRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#2A2A45' },
  langText: { fontSize: 16, color: '#F1F1F5' },
  checkmark: { fontSize: 18, color: '#22C55E', fontWeight: 'bold' },
  version: { textAlign: 'center', color: '#8888AA', fontSize: 12, marginTop: 40 },
});