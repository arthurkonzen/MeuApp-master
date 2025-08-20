import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const AMARELO_ESCURO = '#FFC300';
// Troque pelo IP da sua máquina na rede local!
const BASE_URL = 'http://192.168.0.109:3333';

type Bebe = {
  id: number;
  nome: string;
  dataNascimento: string;
  rg: string;
  cpf: string;
};

export default function MeusCadastrosScreen() {
  const [bebes, setBebes] = useState<Bebe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBebe, setSelectedBebe] = useState<Bebe | null>(null);

  useEffect(() => {
    async function fetchBebes() {
      setLoading(true);
      const userStr = await AsyncStorage.getItem('usuario');
      if (!userStr) {
        alert('Usuário não logado!');
        router.replace('/');
        return;
      }
      const usuario = JSON.parse(userStr);
      try {
        const response = await fetch(`${BASE_URL}/bebes/${usuario.id}`);
        const data = await response.json();
        setBebes(data);
      } catch (error) {
        alert('Erro ao buscar cadastros.');
      }
      setLoading(false);
    }
    fetchBebes();
  }, []);

  function handleVoltar() {
    router.back();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Meus Cadastros de Bebê</Text>
      {loading ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Carregando...</Text>
      ) : bebes.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 30, fontSize: 16, color: '#555' }}>
          Nenhum bebê cadastrado ainda.
        </Text>
      ) : (
        <ScrollView contentContainerStyle={styles.bebeList}>
          {bebes.map((bebe) => (
            <TouchableOpacity
              key={bebe.id}
              style={styles.bebeBtn}
              onPress={() => setSelectedBebe(bebe)}
            >
              <Ionicons name="bag-outline" size={24} color="black" style={{ marginRight: 10 }} />
              <Text style={styles.bebeBtnText}>{bebe.nome}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Modal de detalhes */}
      <Modal
        visible={!!selectedBebe}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedBebe(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedBebe?.nome}</Text>
            <Text style={styles.modalLabel}>Data de Nascimento:</Text>
            <Text style={styles.modalValue}>{selectedBebe?.dataNascimento}</Text>
            <Text style={styles.modalLabel}>RG:</Text>
            <Text style={styles.modalValue}>{selectedBebe?.rg || 'Não informado'}</Text>
            <Text style={styles.modalLabel}>CPF:</Text>
            <Text style={styles.modalValue}>{selectedBebe?.cpf || 'Não informado'}</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedBebe(null)}>
              <Text style={styles.closeBtnText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.voltarBtn} onPress={handleVoltar}>
        <Text style={styles.voltarBtnText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 30 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 24 },
  bebeList: { paddingBottom: 80 },
  bebeBtn: {
    backgroundColor: AMARELO_ESCURO,
    borderRadius: 8,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  bebeBtnText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  voltarBtn: {
    backgroundColor: AMARELO_ESCURO,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
    minWidth: 150,
    alignSelf: 'center',
    elevation: 2,
    position: 'absolute',
    bottom: 10,
    left: 16,
    right: 16,
  },
  voltarBtnText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.32)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 26,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    elevation: 6,
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#222' },
  modalLabel: { fontSize: 15, fontWeight: 'bold', marginTop: 12, color: '#555', alignSelf: 'flex-start' },
  modalValue: { fontSize: 16, color: '#333', alignSelf: 'flex-start' },
  closeBtn: {
    backgroundColor: AMARELO_ESCURO,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 26,
    elevation: 2,
  },
  closeBtnText: {
    color: '#333',
    fontSize: 17,
    fontWeight: 'bold',
  },
});