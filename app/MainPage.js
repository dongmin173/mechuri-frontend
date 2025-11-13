import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const BACKEND_URL = "http://172.21.20.162:8080"; // ⚠️ 네 백엔드 IP 그대로 사용

export default function MainPage() {
  const [friends, setFriends] = useState([]);
  const [inviteCode, setInviteCode] = useState("");
  const [addCode, setAddCode] = useState("");
  const [loading, setLoading] = useState(false);

  /** ---------------------------------------
   *  GET /friend/list
   *  로그인된 사용자 기준 친구 목록 가져오기
   ----------------------------------------*/
  const fetchFriends = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BACKEND_URL}/friend/list`, {
        method: "GET",
        credentials: "include", // 쿠키(JWT) 유지
      });

      if (!res.ok) throw new Error("친구 목록을 불러오지 못했습니다.");

      const data = await res.json();
      setFriends(data.friends || data); // 너의 서비스 구조에 맞춰 유연하게 처리
    } catch (err) {
      Alert.alert("오류", err.message);
    } finally {
      setLoading(false);
    }
  };

  /** ---------------------------------------
   *  GET /friend/invite
   *  친구 초대 코드 생성
   *  (백엔드: 랜덤 + 1주일 유효기간)
   ----------------------------------------*/
  const generateInviteCode = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/friend/invite`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("초대 코드를 불러오지 못했습니다.");

      const data = await res.json();
      setInviteCode(data.code);

      Alert.alert("친구 초대 코드 생성됨", `코드: ${data.code}`);
    } catch (err) {
      Alert.alert("오류", err.message);
    }
  };

  /** ---------------------------------------
   *  POST /friend/add
   *  친구추가 코드로 친구 맺기
   *  { code: "xxxxxx" }
   ----------------------------------------*/
  const addFriend = async () => {
    if (!addCode.trim()) {
      Alert.alert("입력 필요", "친구 추가 코드를 입력해주세요.");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/friend/add`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: addCode }),
      });

      if (!res.ok) throw new Error("친구 추가 실패");

      Alert.alert("성공", "친구가 추가되었습니다!");

      setAddCode(""); // 입력칸 초기화
      fetchFriends(); // 목록 새로고침
    } catch (err) {
      Alert.alert("오류", err.message);
    }
  };

  // 첫 진입 시 자동으로 목록 불러오기
  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>친구 목록</Text>

      {/* 친구 목록 */}
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : friends.length > 0 ? (
        <FlatList
          data={friends}
          keyExtractor={(item, index) => index.toString()}
          style={{ width: "100%" }}
          renderItem={({ item }) => (
            <View style={styles.friendItem}>
              <Text style={styles.friendName}>
                {item.name || item.nickname || item.username}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noFriends}>친구가 없습니다.</Text>
      )}

      {/* 초대코드 */}
      <TouchableOpacity style={styles.inviteButton} onPress={generateInviteCode}>
        <Text style={styles.inviteText}>초대 코드 생성</Text>
      </TouchableOpacity>

      {inviteCode ? (
        <Text style={styles.inviteCode}>내 초대 코드: {inviteCode}</Text>
      ) : null}

      {/* 친구 추가 */}
      <View style={styles.addContainer}>
        <TextInput
          style={styles.input}
          placeholder="친구 추가 코드 입력"
          value={addCode}
          onChangeText={setAddCode}
        />

        <TouchableOpacity style={styles.addButton} onPress={addFriend}>
          <Text style={styles.addButtonText}>추가</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  noFriends: {
    color: "#888",
    marginBottom: 20,
  },
  friendItem: {
    backgroundColor: "#E6F4FE",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
  },
  friendName: {
    fontSize: 16,
  },
  inviteButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  inviteText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "600",
  },
  inviteCode: {
    marginTop: 12,
    fontSize: 16,
    color: "#222",
  },
  addContainer: {
    flexDirection: "row",
    marginTop: 30,
    width: "100%",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 45,
  },
  addButton: {
    backgroundColor: "#28A745",
    marginLeft: 10,
    borderRadius: 8,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },
});
