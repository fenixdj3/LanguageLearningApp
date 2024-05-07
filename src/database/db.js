import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

export const db = SQLite.openDatabase("LanguageLearning1.db");

export const initDB = () => {
  db.transaction(
    (tx) => {
      // Создаем таблицу Users
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Users (
        firebase_uid TEXT PRIMARY KEY UNIQUE NOT NULL,
        Email TEXT NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`
      );

      // Создаем таблицу Categories
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Categories (
        CategoryID INTEGER PRIMARY KEY AUTOINCREMENT,
        firebase_uid TEXT NOT NULL,
        Name TEXT NOT NULL,
        ImageURL TEXT,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (firebase_uid) REFERENCES Users(firebase_uid)
      );`
      );

      // Создаем таблицу Words
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Words (
        WordID INTEGER PRIMARY KEY AUTOINCREMENT,
        CategoryID INTEGER NOT NULL,
        EnglishWord TEXT NOT NULL,
        Transcription TEXT,
        Translation TEXT NOT NULL,
        Example TEXT,
        ExampleTranslation TEXT,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
      );`
      );

      // Создаем таблицу StudySessions
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS StudySessions (
        SessionID INTEGER PRIMARY KEY AUTOINCREMENT,
        firebase_uid TEXT NOT NULL,
        Mode INTEGER NOT NULL, -- 1 for new words, 2 for review, 3 for mixed
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (firebase_uid) REFERENCES Users(firebase_uid)
      );`
      );

      // Создаем таблицу WordProgress
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS WordProgress (
        WordID INTEGER NOT NULL,
        SessionID INTEGER NOT NULL,
        Status INTEGER NOT NULL, -- 0 for learning, 1 for known, etc.
        Attempts INTEGER DEFAULT 0,
        LastSeen TIMESTAMP,
        FOREIGN KEY (WordID) REFERENCES Words(WordID),
        FOREIGN KEY (SessionID) REFERENCES StudySessions(SessionID),
        PRIMARY KEY (WordID, SessionID)
      );`
      );
    },
    (error) => {
      console.log("Ошибка при инициализации БД", error);
    },
    () => {
      console.log("Инициализация БД и создание таблиц прошло успешно");
    }
  );
};

export const addDefaultCategories = (userID, dbTransaction) => {
  const defaultCategories = [
    {
      name: "Анатомия",
      imageURL:
        "https://firebasestorage.googleapis.com/v0/b/languagelearningexpoapp.appspot.com/o/categoryIcon%2Fanatomy.png?alt=media&token=ad052311-c378-4cee-8012-30366fd0fdc1",
    },
    {
      name: "Искусство",
      imageURL:
        "https://firebasestorage.googleapis.com/v0/b/languagelearningexpoapp.appspot.com/o/categoryIcon%2Fart.png?alt=media&token=7e7d04fd-1f9b-4298-9677-8b60dfa6a5f0",
    },
    {
      name: "Путешествия",
      imageURL:
        "https://firebasestorage.googleapis.com/v0/b/languagelearningexpoapp.appspot.com/o/categoryIcon%2Ftravel.png?alt=media&token=c04c918f-baf7-4665-8554-2aa1d1fc1c79",
    },
  ];

  defaultCategories.forEach(({ name, imageURL }) => {
    dbTransaction.executeSql(
      `INSERT INTO Categories (firebase_uid, Name, ImageURL) VALUES (?, ?, ?);`,
      [userID, name, imageURL],
      () => {
        console.log(
          `Категория '${name}' добавлена для пользователя с ID: ${userID}`
        );
      },
      (_, error) => {
        console.log(`Ошибка при добавлении категории '${name}':`, error);
      }
    );
  });
};

export const addDefaultWords = (dbTransaction) => {
  const defaultWords = [
    {
      categoryID: 1,
      englishWord: "Heart",
      transcription: "hɑːrt",
      translation: "Сердце",
      example: "His heart was beating fast.",
    },
    // Добавьте другие стандартные слова сюда
  ];

  defaultWords.forEach((word) => {
    dbTransaction.executeSql(
      `INSERT INTO Words (CategoryID, EnglishWord, Transcription, Translation, Example) VALUES (?, ?, ?, ?, ?);`,
      [
        word.categoryID,
        word.englishWord,
        word.transcription,
        word.translation,
        word.example,
      ],
      () => {
        console.log(
          `Слово '${word.englishWord}' добавлено в категорию с ID: ${word.categoryID}`
        );
      },
      (_, error) => {
        console.log(
          `Ошибка при добавлении слова '${word.englishWord}':`,
          error
        );
      }
    );
  });
};


export const addUser = (firebase_uid, email, tx, callback) => {
  tx.executeSql(
    `INSERT INTO Users (firebase_uid, Email) VALUES (?, ?);`,
    [firebase_uid, email],
    (_, result) => {
      // Вызов колбэка с результатом успешного добавления пользователя
      callback(true, result);
    },
    (_, error) => {
      // Вызов колбэка с ошибкой при добавлении пользователя
      callback(false, error);
    }
  );
};

const fetchUsers = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM Users;`,
      [],
      (_, { rows: { _array } }) => {
        console.log("Пользователи:", _array);
      },
      (_, error) => {
        console.log("Ошибка при получении пользователей:", error);
        return true; // для предотвращения пропаганды ошибки
      }
    );
  });
};

export const fetchCategories = (userID, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT 
        CategoryID,
        Name,
        ImageURL,
        (SELECT COUNT(*) FROM Words WHERE Words.CategoryID = Categories.CategoryID) AS WordCount,
        0 AS Progress
      FROM Categories 
      WHERE firebase_uid = ?;`,
      [userID],
      (_, { rows: { _array } }) => {
        // Формируем URL иконок уже здесь, после получения данных из БД
        const categoriesWithIcons = _array.map((category) => ({
          ...category,
          icon: `https://storage.googleapis.com/languagelearningexpoapp.appspot.com/categoryIcon/${category.ImageURL}`, // Пример формирования HTTP URL на основе ImageURL
        }));
        callback(categoriesWithIcons);
      },
      (_, error) => {
        console.log("Ошибка при получении категорий:", error);
        return true; // для предотвращения пропаганды ошибки
      }
    );
  });
};

export const addWordsToCategories = (userID, dbTransaction) => {
  const defaultWords = [
    {
      categoryName: "Анатомия",
      words: [
        {
          englishWord: "Heart",
          transcription: "hɑːrt",
          translation: "Сердце",
          example: "His heart was beating fast.",
          exampleTranslation: "Его сердце билось быстро.",
        },
        {
          englishWord: "Brain",
          transcription: "breɪn",
          translation: "Мозг",
          example: "The human brain is an incredible organ.",
          exampleTranslation: "Человеческий мозг - удивительный орган.",
        },
        {
          englishWord: "Lung",
          transcription: "lʌŋ",
          translation: "Легкое",
          example: "Lungs are essential for breathing.",
          exampleTranslation: "Легкие необходимы для дыхания.",
        },
      ],
    },
    {
      categoryName: "Искусство",
      words: [
        {
          englishWord: "Painting",
          transcription: "ˈpeɪntɪŋ",
          translation: "Картина",
          example: "I saw an amazing painting in the gallery.",
          exampleTranslation: "Я видел удивительную картину в галерее.",
        },
        {
          englishWord: "Sculpture",
          transcription: "ˈskʌlptʃə",
          translation: "Скульптура",
          example: "The park is famous for its modern sculptures.",
          exampleTranslation: "Парк знаменит своими современными скульптурами.",
        },
        {
          englishWord: "Canvas",
          transcription: "ˈkænvəs",
          translation: "Холст",
          example: "The artist painted her masterpiece on a large canvas.",
          exampleTranslation: "Художник написал свой шедевр на большом холсте.",
        },
      ],
    },
    {
      categoryName: "Путешествия",
      words: [
        {
          englishWord: "Backpack",
          transcription: "ˈbækˌpæk",
          translation: "Рюкзак",
          example: "He packed his backpack for the journey.",
          exampleTranslation: "Он упаковал свой рюкзак для путешествия.",
        },
        {
          englishWord: "Suitcase",
          transcription: "ˈsuːtˌkeɪs",
          translation: "Чемодан",
          example: "She bought a new suitcase for her travels.",
          exampleTranslation: "Она купила новый чемодан для своих путешествий.",
        },
        {
          englishWord: "Destination",
          transcription: "ˌdɛstɪˈneɪʃən",
          translation: "Пункт назначения",
          example: "Their destination was a remote island in the Pacific.",
          exampleTranslation:
            "Их пунктом назначения был удаленный остров в Тихом океане.",
        },
      ],
    },
    // Добавьте другие категории
  ];

  defaultWords.forEach(({ categoryName, words }) => {
    // Получаем CategoryID по имени и userID
    dbTransaction.executeSql(
      `SELECT CategoryID FROM Categories WHERE firebase_uid = ? AND Name = ?;`,
      [userID, categoryName],
      (_, { rows }) => {
        if (rows._array.length > 0) {
          const categoryID = rows._array[0].CategoryID;

          // Добавляем слова в эту категорию
          words.forEach(
            ({
              englishWord,
              transcription,
              translation,
              example,
              exampleTranslation,
            }) => {
              dbTransaction.executeSql(
                `INSERT INTO Words (CategoryID, EnglishWord, Transcription, Translation, Example, ExampleTranslation) VALUES (?, ?, ?, ?, ?, ?);`,
                [
                  categoryID,
                  englishWord,
                  transcription,
                  translation,
                  example,
                  exampleTranslation,
                ],
                () =>
                  console.log(
                    `Слово '${englishWord}' добавлено в категорию '${categoryName}'`
                  ),
                (_, error) =>
                  console.log(
                    `Ошибка при добавлении слова '${englishWord}':`,
                    error
                  )
              );
            }
          );
        } else {
          console.log(`Категория '${categoryName}' не найдена.`);
        }
      },
      (_, error) =>
        console.log(
          `Ошибка при получении ID категории '${categoryName}':`,
          error
        )
    );
  });
};



export const resetDB = () => {
  db.transaction(
    (tx) => {
      // Удаляем все записи из таблицы WordProgress
      tx.executeSql(`DELETE FROM WordProgress;`);

      // Удаляем все записи из таблицы StudySessions
      tx.executeSql(`DELETE FROM StudySessions;`);

      // Удаляем все записи из таблицы Words
      tx.executeSql(`DELETE FROM Words;`);

      // Удаляем все записи из таблицы Categories
      tx.executeSql(`DELETE FROM Categories;`);

      // Удаляем все записи из таблицы Users
      tx.executeSql(`DELETE FROM Users;`);
    },
    (error) => {
      console.log("Ошибка при сбросе данных БД", error);
    },
    () => {
      console.log("Все данные в БД успешно сброшены");
    }
  );
};

export const dropTables = () => {
  db.transaction(
    (tx) => {
      // Удаляем таблицу WordProgress
      tx.executeSql(`DROP TABLE IF EXISTS WordProgress;`);

      // Удаляем таблицу StudySessions
      tx.executeSql(`DROP TABLE IF EXISTS StudySessions;`);

      // Удаляем таблицу Words
      tx.executeSql(`DROP TABLE IF EXISTS Words;`);

      // Удаляем таблицу Categories
      tx.executeSql(`DROP TABLE IF EXISTS Categories;`);

      // Удаляем таблицу Users
      tx.executeSql(`DROP TABLE IF EXISTS Users;`);
    },
    (error) => {
      console.log("Ошибка при удалении таблиц", error);
    },
    () => {
      console.log("Все таблицы успешно удалены");
    }
  );
};

//Добавляет категорию по пользователю, названии категории и изображения
export const addCategory = (firebaseUid, categoryName, imageUrl, callback) => {
  db.transaction(
    (tx) => {
      tx.executeSql(
        `INSERT INTO Categories (firebase_uid, Name, ImageURL) VALUES (?, ?, ?);`,
        [firebaseUid, categoryName, imageUrl],
        (_, result) => {
          console.log("Category added successfully:", result);
          callback(); // Вызываем колбэк для обновления списка категорий
        },
        (_, error) => {
          console.error("Error adding category:", error);
        }
      );
    },
    (error) => {
      console.error("Transaction error:", error);
    }
  );
};

//Вытягивает слова из категории по ID категории
export const fetchWordsByCategoryID = (categoryID, callback) => {
  db.transaction(
    (tx) => {
      tx.executeSql(
        `SELECT * FROM Words WHERE CategoryID = ?;`,
        [categoryID],
        (_, { rows: { _array } }) => {
          // Если слова найдены, вызываем колбэк функцию с массивом слов
          callback(_array);
        },
        (_, error) => {
          console.error("Ошибка при получении слов по ID категории:", error);
          return true; // Для предотвращения пропаганды ошибки
        }
      );
    },
    (error) => {
      console.error(
        "Ошибка транзакции при получении слов по ID категории:",
        error
      );
    }
  );
};

//Очищает категорию от слов
export const clearCategory = (db, categoryID, onSuccess, onError) => {
  db.transaction((tx) => {
    tx.executeSql(
      `DELETE FROM Words WHERE CategoryID = ?;`,
      [categoryID],
      (_, result) => onSuccess && onSuccess(result),
      (_, error) => onError && onError(error)
    );
  });
};

//Удаляет категорию
export const deleteCategory = (db, categoryID, onSuccess, onError) => {
  db.transaction((tx) => {
    // Сначала удаляем все слова связанные с категорией
    tx.executeSql(
      `DELETE FROM Words WHERE CategoryID = ?;`,
      [categoryID],
      () => {
        // После успешного удаления слов, удаляем саму категорию
        tx.executeSql(
          `DELETE FROM Categories WHERE CategoryID = ?;`,
          [categoryID],
          (_, result) => onSuccess && onSuccess(result),
          (_, error) => onError && onError(error)
        );
      },
      (_, error) => onError && onError(error)
    );
  });
};

export const addWord = (
  categoryID,
  englishWord,
  transcription,
  translation,
  example,
  exampleTranslation,
  onSuccess,
  onError
) => {
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO Words (CategoryID, EnglishWord, Transcription, Translation, Example, ExampleTranslation) VALUES (?, ?, ?, ?, ?, ?);`,
      [
        categoryID,
        englishWord,
        transcription,
        translation,
        example,
        exampleTranslation,
      ],
      (_, result) => {
        console.log("Слово успешно добавлено:", result);
        onSuccess && onSuccess(result);
      },
      (_, error) => {
        console.error("Ошибка при добавлении слова:", error);
        onError && onError(error);
      }
    );
  });
};

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // обмен элементами
  }
  return array;
};

export const getRandomWordsForCurrentUser = async (userID, callback) => {
  db.transaction(
    (tx) => {
      // Получаем все категории пользователя
      tx.executeSql(
        `SELECT CategoryID FROM Categories WHERE firebase_uid = ?;`,
        [userID],
        (_, { rows: { _array: categories } }) => {
          console.log("Найденные категории:", categories); // Логируем найденные категории
          if (categories.length > 0) {
            const categoryIDs = categories.map(
              (category) => category.CategoryID
            );
            // Создаем строку с параметрами для IN условия SQL запроса
            const placeholders = categoryIDs.map((_) => "?").join(",");
            // Выбираем все слова из найденных категорий
            tx.executeSql(
              `SELECT * FROM Words WHERE CategoryID IN (${placeholders});`,
              categoryIDs,
              (_, { rows: { _array: words } }) => {
                if (words.length > 0) {
                  // Если слова найдены, перемешиваем их и возвращаем через callback
                  const shuffledWords = shuffleArray(words);
                  callback(shuffledWords);
                } else {
                  console.log("Слова в категориях не найдены");
                  callback(null);
                }
              }
            );
          } else {
            console.log("Категории не найдены для пользователя с ID:", userID);
            callback(null);
          }
        }
      );
    },
    (error) => {
      console.log("Ошибка при выборке слов:", error);
      callback(null);
    }
  );
};

export const exportDatabaseFile = async () => {
  const dbDirectory = `${FileSystem.documentDirectory}SQLite`;
  const dbFilePath = `${dbDirectory}/LanguageLearning1.db`;
  const exportPath = `${FileSystem.cacheDirectory}LanguageLearning1.db`;

  try {
    // Убедитесь, что каталог кэша существует
    await FileSystem.makeDirectoryAsync(FileSystem.cacheDirectory, {
      intermediates: true,
    });
    // Копирование файла базы данных в каталог кэша
    await FileSystem.copyAsync({
      from: dbFilePath,
      to: exportPath,
    });
    console.log(`Database file exported to: ${exportPath}`);
    return exportPath;
  } catch (error) {
    console.error("Failed to export database file:", error);
  }
};

export const moveDatabaseToFileSystem = async () => {
  const exportPath = `${FileSystem.cacheDirectory}LanguageLearning1.db`;
  const targetPath = `${FileSystem.documentDirectory}exported_LanguageLearning1.db`;

  try {
    await FileSystem.moveAsync({
      from: exportPath,
      to: targetPath,
    });
    console.log(`Database file moved to: ${targetPath}`);
    return targetPath;
  } catch (error) {
    console.error("Failed to move database file:", error);
  }
};


export const database = {
  initDB,
  addDefaultCategories,
  addWordsToCategories,
  addDefaultWords,
  addUser,
  fetchUsers,
  dropTables,
  resetDB,
  fetchCategories,
  addCategory,
  fetchWordsByCategoryID,
  clearCategory,
  deleteCategory,
  addWord,
  shuffleArray,
  getRandomWordsForCurrentUser,
  exportDatabaseFile,
  moveDatabaseToFileSystem,
};