import { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const primary = "#1A1A1A";
const secondary = "#FFD600";
const plain = "rgba(255,255,255, 0.4)";

const renderItem = (item: any) => {
  const { book, genre } = item.item;
  return (
    <View>
      <Text style={styles.text}>
        {"->"}
        {"  "} {book} - {genre}
      </Text>
    </View>
  );
};

export default function App() {
  const [disabled, setDisabled] = useState(true);
  const [filterValue, setFilterValue] = useState("");
  const [sortAscending, setSortAscending] = useState(true);
  const [bookList, setBookList] = useState<
    Array<{ book: string; genre: string }>
  >([]);
  const [bookListKept, setBookListKept] = useState<
    Array<{ book: string; genre: string }>
  >([]);
  const initialValues = {
    book: "",
    genre: "",
  };
  const [formData, setFormData] = useState(initialValues);
  const { book, genre } = formData;

  const onChange = (value: string, name: string) => {
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (formData.book && formData.genre) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [formData]);

  useEffect(() => {
    if (filterValue) {
      let result = bookListKept.filter((val) => {
        return val.genre
          .toLowerCase()
          .trim()
          .includes(filterValue.toLowerCase().toString().trim());
      });
      setBookList(result);
    } else {
      setBookList(bookListKept);
    }
  }, [filterValue]);

  const handleAddBook = () => {
    setBookList((prevState) => [...prevState, formData]);
    setBookListKept((prevState) => [...prevState, formData]);
    setFormData(initialValues);
    setFilterValue("");
  };

  const reset = () => {
    setFormData(initialValues);
    setBookList([]);
    setBookListKept([]);
    setFilterValue("");
  };

  const sortList = () => {
    if (sortAscending) {
      setBookList(bookList.sort((a, b) => a.book.localeCompare(b.book)));
      setSortAscending(!sortAscending);
    } else {
      setSortAscending(!sortAscending);
      setBookList(bookList.sort((a, b) => b.book.localeCompare(a.book)));
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <View>
              <TextInput
                value={book}
                onChangeText={(value) => onChange(value, "book")}
                style={styles.input}
                selectionColor={"white"}
                placeholder="Enter Book Name"
                placeholderTextColor={plain}
              />
              <TextInput
                value={genre}
                onChangeText={(value) => onChange(value, "genre")}
                style={styles.input}
                selectionColor={"white"}
                placeholderTextColor={plain}
                placeholder="Enter Book Genre"
              />
              <TouchableOpacity
                disabled={disabled}
                onPress={handleAddBook}
                style={styles.button}
              >
                <Text style={styles.btnText}>Add Book</Text>
              </TouchableOpacity>
              {bookListKept.length > 0 && (
                <>
                  <View style={styles.btnWrapper}>
                    <TouchableOpacity
                      onPress={sortList}
                      style={{ ...styles.btn_sm, marginHorizontal: 14 }}
                    >
                      <Text style={styles.btn_sm_text}>
                        {sortAscending ? "⬆️" : "⬇️"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={reset}
                      style={styles.btn_sm}
                    >
                      <Text style={styles.btn_sm_text}>Reset</Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    value={filterValue}
                    onChangeText={(value) => setFilterValue(value)}
                    style={styles.input}
                    selectionColor={"white"}
                    placeholderTextColor={plain}
                    placeholder="Filter Books by Genres"
                  />
                </>
              )}
            </View>
          </>
        }
        renderItem={renderItem}
        style={{ flex: 1 }}
        ListHeaderComponentStyle={{ marginBottom: 20 }}
        keyExtractor={(value) => value.book}
        showsVerticalScrollIndicator={false}
        data={bookList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: primary,
    paddingHorizontal: 20,
    paddingTop: Platform.OS == "android" ? 50 : 80,
  },
  input: {
    height: 54,
    borderColor: `rgba(255,255,255, 0.4)`,
    color: "white",
    borderWidth: 1,
    borderRadius: 4,
    marginVertical: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  button: {
    backgroundColor: secondary,
    color: primary,
    padding: 10,
    height: 50,
    borderRadius: 4,
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontSize: 20,
    fontWeight: "500",
  },
  text: {
    fontSize: 17,
    fontWeight: "500",
    color: plain,
  },
  btn_sm: {
    borderColor: secondary,
    borderWidth: 1,
    height: 30,
    width: 80,
    borderRadius: 4,
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  btn_sm_text: {
    color: secondary,
    fontSize: 17,
    fontWeight: "500",
  },
  btnWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
