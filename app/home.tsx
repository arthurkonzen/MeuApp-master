import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const AMARELO_ESCURO = '#FFC300';

export default function HomeScreen() {
  const [usuario, setUsuario] = useState<{ nome: string } | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('usuario').then((userStr) => {
      if (userStr) setUsuario(JSON.parse(userStr));
    });
  }, []);

  function handlePerfilPress() {
    if (usuario) alert(`Perfil do usuário: ${usuario.nome}`);
  }

  function handleCaptura() {
    router.push('/captura');
  }

  function handleMeusCadastros() {
    router.push('/meusCadastros');
  }

  function handleSair() {
    AsyncStorage.removeItem('usuario');
    router.replace('/');
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo1.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <TouchableOpacity style={styles.profileBtn} onPress={handlePerfilPress}>
        <Text style={styles.profileText}>{usuario?.nome || 'Usuário'}</Text>
      </TouchableOpacity>

      <View style={styles.centerContainer}>
        <Text style={styles.titulo}>Bem-vindo à Home!</Text>
        <TouchableOpacity style={styles.actionBtn} onPress={handleCaptura}>
          <Text style={styles.actionBtnText}>Iniciar Captura</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handleMeusCadastros}>
          <Text style={styles.actionBtnText}>Meus Cadastros</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.exitBtn} onPress={handleSair}>
        <Text style={styles.exitBtnText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    alignSelf: 'center',
    marginTop: 55,
    marginBottom: 10,
    zIndex: 1,
  },
  profileBtn: {
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 2,
    backgroundColor: '#f8f8f8',
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 6,
    elevation: 2,
  },
  profileText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: AMARELO_ESCURO,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 32, color: '#333' },
  actionBtn: {
    backgroundColor: AMARELO_ESCURO,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 40,
    marginBottom: 16,
    minWidth: 220,
    alignItems: 'center',
    elevation: 2,
  },
  actionBtnText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  exitBtn: {
    backgroundColor: AMARELO_ESCURO,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 38,
    minWidth: 220,
    alignSelf: 'center',
    elevation: 2,
  },
  exitBtnText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
});