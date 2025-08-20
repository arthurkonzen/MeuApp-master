import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const AMARELO_ESCURO = '#FFC300';
// Troque pelo IP da sua máquina na rede local!
const BASE_URL = 'http://192.168.0.109:3333';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function fazerLogin() {
    if (email && senha) {
      try {
        const response = await fetch(`${BASE_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, senha }),
        });
        const data = await response.json();
        if (data.token) {
          await AsyncStorage.setItem('usuario', JSON.stringify({
            nome: data.nome,
            email: data.email,
            id: data.id,
          }));
          router.push('/home');
        } else {
          alert(data.erro || 'E-mail ou senha incorretos');
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
      <Image
        source={require('../assets/images/utfpr.png')}
        style={styles.utfpr}
        resizeMode="contain"
      />
      <Image
        source={require('../assets/images/logo1.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.titulo}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
      />
      <TouchableOpacity style={styles.amareloBtn} onPress={fazerLogin}>
        <Text style={styles.amareloBtnText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.amareloBtn} onPress={() => router.push('/cadastro')}>
        <Text style={styles.amareloBtnText}>Cadastrar-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 60,
  },
  utfpr: { 
    width: 260,
    height: 110,
    alignSelf: 'center',
    marginBottom: 24
  },
  logo: { 
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20
  },
  titulo: { 
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  input: { 
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },
  amareloBtn: {
    backgroundColor: AMARELO_ESCURO,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 0,
  },
  amareloBtnText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
});