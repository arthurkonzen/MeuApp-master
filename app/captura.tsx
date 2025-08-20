import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const AMARELO_ESCURO = '#FFC300';
// Troque pelo IP da sua máquina na rede local!
const BASE_URL = 'http://192.168.0.109:3333';

export default function CapturaScreen() {
  const [nomeBebe, setNomeBebe] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [rg, setRG] = useState('');
  const [cpf, setCPF] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function handleSalvar() {
    if (!nomeBebe || !dataNascimento) {
      alert('Preencha ao menos o nome e a data de nascimento!');
      return;
    }
    setSalvando(true);
    try {
      const userStr = await AsyncStorage.getItem('usuario');
      if (!userStr) {
        alert('Usuário não logado!');
        setSalvando(false);
        return;
      }
      const usuario = JSON.parse(userStr);
      const response = await fetch(`${BASE_URL}/bebes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nomeBebe,
          dataNascimento,
          rg,
          cpf,
          usuarioId: usuario.id
        }),
      });
      const data = await response.json();
      if (data.sucesso) {
        alert('Bebê cadastrado com sucesso!');
        setNomeBebe('');
        setDataNascimento('');
        setRG('');
        setCPF('');
        router.replace('/home');
      } else {
        alert(data.erro || 'Erro ao cadastrar bebê');
      }
    } catch (error) {
      alert('Erro de conexão');
    }
    setSalvando(false);
  }

  function handlePerfilPress() {
    alert('Perfil do usuário');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableOpacity style={styles.profileBtn} onPress={handlePerfilPress}>
        <Ionicons name="person-circle-outline" size={48} color={AMARELO_ESCURO} />
      </TouchableOpacity>

      <View style={styles.formContainer}>
        <Text style={styles.titulo}>Cadastro do Bebê</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do bebê"
          value={nomeBebe}
          onChangeText={setNomeBebe}
        />
        <TextInput
          style={styles.input}
          placeholder="Data de Nascimento (DD/MM/AAAA)"
          value={dataNascimento}
          onChangeText={setDataNascimento}
        />
        <TextInput
          style={styles.input}
          placeholder="RG do bebê"
          value={rg}
          onChangeText={setRG}
        />
        <TextInput
          style={styles.input}
          placeholder="CPF do bebê"
          value={cpf}
          onChangeText={setCPF}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSalvar} disabled={salvando}>
          <Text style={styles.saveBtnText}>{salvando ? 'Salvando...' : 'Salvar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  profileBtn: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 28, color: '#333' },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 18,
    backgroundColor: '#f8f8f8',
  },
  saveBtn: {
    backgroundColor: AMARELO_ESCURO,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
    elevation: 2,
  },
  saveBtnText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backBtn: {
    padding: 8,
  },
  backBtnText: {
    color: AMARELO_ESCURO,
    fontSize: 16,
    fontWeight: 'bold',
  },
});