import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const BACKEND_URL = "http://172.21.20.162:8080"; // ✅ 서버 주소

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleKakaoLogin = async () => {
    try {
      setLoading(true);

      // ✅ 백엔드 로그인 URL
      const kakaoLoginUrl = `${BACKEND_URL}/login/kakao`;

      // ✅ 앱으로 돌아올 redirect URI 설정
      const redirectUrl = "mechuri://redirect"; // app.json의 scheme에 맞춰야 함

      console.log("login URL:", kakaoLoginUrl);
      console.log("redirect URL:", redirectUrl);

      // ✅ 인앱 로그인 (카카오 로그인 후 redirect URI로 돌아옴)
      const result = await WebBrowser.openAuthSessionAsync(
        kakaoLoginUrl,
        redirectUrl
      );

      console.log("WebBrowser result:", result);

      if (result.type === "success") {
        Alert.alert("로그인 완료", "카카오 로그인 성공!");
        router.push("/MainPage");
      } else if (result.type === "cancel") {
        Alert.alert("취소됨", "로그인이 취소되었습니다.");
      }

    } catch (e) {
      console.error(e);
      Alert.alert("오류 발생", e?.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };
  const goToMainPage = () => {
    router.push("/MainPage");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ME추里</Text>

      <TouchableOpacity
        style={[styles.button, loading && styles.disabled]}
        onPress={handleKakaoLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.buttonText}>카카오로 로그인</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { marginTop: 15 }]}
        onPress={goToMainPage}
      >
        <Text style={styles.buttonText}>test</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
  },
  button: {
    width: 200,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
