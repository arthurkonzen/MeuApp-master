import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const AMARELO_ESCURO = '#FFC300';
// Troque pelo IP da sua máquina na rede local!
const BASE_URL = 'http://192.168.0.109:3333';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function cadastrar() {
    if (nome && email && senha) {
      try {
        const response = await fetch(`${BASE_URL}/cadastro`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, email, senha }),
        });
        const data = await response.json();
        if (data.sucesso) {
          alert('Cadastro realizado com sucesso!');
          router.replace('/'); // Volta para o login
        } else {
          alert(data.erro || 'Erro ao cadastrar');
        }
      } catch (error) {
        alert('Erro de conexão');
      }
    } else {
      alert('Preencha todos os campos!');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro</Text>
      <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} style={styles.input} />
      <TouchableOpacity style={styles.amareloBtn} onPress={cadastrar}>
        <Text style={styles.amareloBtnText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  titulo: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 14, borderRadius: 6, fontSize: 16 },
  amareloBtn: {
    backgroundColor: AMARELO_ESCURO,
    borderRadius: 8,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 12,
    elevation: 2,
  },
  amareloBtnText: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
  },
});